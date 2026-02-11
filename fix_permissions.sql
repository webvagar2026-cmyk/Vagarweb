-- OPCIÓN 1: Deshabilitar RLS temporalmente (Más fácil para debugging)
-- Esto permite que cualquiera (incluso sin login) pueda leer y escribir.
-- Úsalo solo para verificar que el problema son los permisos.
ALTER TABLE public.faqs DISABLE ROW LEVEL SECURITY;

-- OPCIÓN 2: Políticas más permisivas (Si quieres mantener RLS activo)
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON public.faqs;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.faqs;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.faqs;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.faqs;

-- Create permissive policies
CREATE POLICY "Allow all access for all users" ON public.faqs FOR ALL USING (true) WITH CHECK (true);
