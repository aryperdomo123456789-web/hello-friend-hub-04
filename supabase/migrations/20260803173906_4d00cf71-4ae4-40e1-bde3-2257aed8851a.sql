CREATE TABLE IF NOT EXISTS public.protected_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'CNAME',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.protected_domains TO authenticated;
GRANT ALL ON public.protected_domains TO service_role;
GRANT SELECT ON public.protected_domains TO anon;

ALTER TABLE public.protected_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.protected_domains
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow select for anon" ON public.protected_domains
    FOR SELECT TO anon USING (true);
