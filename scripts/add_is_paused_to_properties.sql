-- Agregar columna para pausar/ocultar propiedades
ALTER TABLE properties ADD COLUMN is_paused BOOLEAN DEFAULT FALSE;
