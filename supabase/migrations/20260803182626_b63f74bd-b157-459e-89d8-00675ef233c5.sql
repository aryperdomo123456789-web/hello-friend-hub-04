ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS origin_type TEXT DEFAULT 'A';
GRANT ALL ON public.sources TO authenticated;
GRANT ALL ON public.sources TO service_role;