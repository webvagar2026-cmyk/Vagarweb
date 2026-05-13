-- Migración para soportar múltiples map_node_id por propiedad

-- 1. Renombrar la columna y cambiar el tipo a un array de texto
ALTER TABLE properties
RENAME COLUMN map_node_id TO map_node_ids;

-- 2. Quitar la restricción UNIQUE anterior
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_map_node_id_key;
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_map_node_ids_key;

-- 3. Cambiar el tipo de dato. Usamos un casting para convertir el valor existente a un array de un solo elemento.
ALTER TABLE properties
ALTER COLUMN map_node_ids TYPE TEXT[] USING 
    CASE 
        WHEN map_node_ids IS NOT NULL THEN ARRAY[map_node_ids]::TEXT[] 
        ELSE '{}'::TEXT[] 
    END;

-- 4. Definir valor por defecto para nuevos registros
ALTER TABLE properties
ALTER COLUMN map_node_ids SET DEFAULT '{}'::TEXT[];

-- 5. Crear la función del trigger para validar que los nodos de mapa sean únicos en todo el sistema
CREATE OR REPLACE FUNCTION check_unique_map_nodes()
RETURNS TRIGGER AS $$
DECLARE
    conflicting_node TEXT;
BEGIN
    -- Si no hay nodos, permitimos la operación
    IF NEW.map_node_ids IS NULL OR array_length(NEW.map_node_ids, 1) IS NULL THEN
        RETURN NEW;
    END IF;

    -- Buscamos si alguno de los nodos del nuevo registro ya existe en otro registro
    SELECT unnest(NEW.map_node_ids) INTERSECT
    SELECT unnest(map_node_ids) FROM properties WHERE id IS DISTINCT FROM NEW.id
    INTO conflicting_node;

    IF conflicting_node IS NOT NULL THEN
        RAISE EXCEPTION 'El nodo de mapa % ya está asignado a otra propiedad.', conflicting_node;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Adjuntar el trigger a la tabla
DROP TRIGGER IF EXISTS trg_check_unique_map_nodes ON properties;
CREATE TRIGGER trg_check_unique_map_nodes
BEFORE INSERT OR UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION check_unique_map_nodes();

-- 7. Recrear la función de RPC para subir el excel, adaptada para buscar en arrays
CREATE OR REPLACE FUNCTION update_availability_from_excel(availability_data JSON)
RETURNS VOID AS $$
DECLARE
    item JSON;
    prop_id INT;
BEGIN
    -- Primero, marcar todas las reservas existentes como 'cancelled' para limpiar la disponibilidad
    UPDATE bookings SET status = 'cancelled' WHERE source = 'excel';

    -- Iterar sobre cada objeto en el array JSON de entrada
    FOR item IN SELECT * FROM json_array_elements(availability_data)
    LOOP
        -- Encontrar el property_id basado en el map_node_ids
        SELECT id INTO prop_id FROM properties WHERE item->>'map_node_id' = ANY(map_node_ids);

        -- Si se encuentra una propiedad, insertar la nueva reserva
        IF prop_id IS NOT NULL THEN
            INSERT INTO bookings (property_id, check_in_date, check_out_date, status, source, client_name)
            VALUES (prop_id, (item->>'start_date')::DATE, (item->>'end_date')::DATE, 'confirmed', 'excel', 'Sistema');
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
