-- Habilitar RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas existentes
DROP POLICY IF EXISTS "Public Read Access" ON public.faqs;
DROP POLICY IF EXISTS "Authenticated Write Access" ON public.faqs;
DROP POLICY IF EXISTS "Authenticated Update Access" ON public.faqs;
DROP POLICY IF EXISTS "Authenticated Delete Access" ON public.faqs;
DROP POLICY IF EXISTS "Allow all access for all users" ON public.faqs;
DROP POLICY IF EXISTS "Service Role Full Access" ON public.faqs;

-- 1. Lectura Pública: Todos pueden leer
CREATE POLICY "Public Read Access" 
ON public.faqs FOR SELECT 
USING (true);

-- 2. Acceso Total para Service Role (El Admin/API Server)
-- Esto asegura que el servidor pueda escribir sin restricciones
CREATE POLICY "Service Role Full Access" 
ON public.faqs FOR ALL 
USING (auth.role() = 'service_role') 
WITH CHECK (auth.role() = 'service_role');

-- 3. Escritura para Usuarios Autenticados (Opcional, si tienes usuarios logueados que no son admin)
CREATE POLICY "Authenticated Write Access" 
ON public.faqs FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update Access" 
ON public.faqs FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete Access" 
ON public.faqs FOR DELETE 
USING (auth.role() = 'authenticated');
