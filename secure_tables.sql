-- Enable RLS on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propertyamenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propertyrules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Grant usage on schema to standard roles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant all privileges to service_role (Admin/API)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Grant select to anon/authenticated for public content
GRANT SELECT ON public.properties TO anon, authenticated;
GRANT SELECT ON public.experiences TO anon, authenticated;
GRANT SELECT ON public.images TO anon, authenticated;
GRANT SELECT ON public.amenities TO anon, authenticated;
GRANT SELECT ON public.propertyamenities TO anon, authenticated;
GRANT SELECT ON public.propertyrules TO anon, authenticated;
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT SELECT ON public.faqs TO anon, authenticated;

-- Grant insert on bookings to anon/authenticated (for public bookings)
GRANT INSERT ON public.bookings TO anon, authenticated;

-- Clean up existing policies to avoid conflicts
DO $$ 
DECLARE 
    tbl text; 
BEGIN 
    FOR tbl IN 
        SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS "Public Read Access" ON %I', tbl); 
        EXECUTE format('DROP POLICY IF EXISTS "Service Role Full Access" ON %I', tbl); 
        EXECUTE format('DROP POLICY IF EXISTS "Public Insert Access" ON %I', tbl); 
    END LOOP; 
END $$;

-- 1. Policies for Public Read Content (Properties, Content, etc.)
CREATE POLICY "Public Read Access" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.images FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.amenities FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.propertyamenities FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.propertyrules FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.faqs FOR SELECT USING (true);

-- 2. Policies for Bookings (Public Create, Private Read)
CREATE POLICY "Public Insert Access" ON public.bookings FOR INSERT WITH CHECK (true);
-- Optionally allow users to read their own bookings if/when auth is implemented:
-- CREATE POLICY "Read Own Bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id); 

-- 3. Service Role Full Access (Admin) for ALL tables
CREATE POLICY "Service Role Full Access" ON public.properties FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.experiences FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.images FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.amenities FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.propertyamenities FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.propertyrules FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.bookings FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.testimonials FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.faqs FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.users FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
