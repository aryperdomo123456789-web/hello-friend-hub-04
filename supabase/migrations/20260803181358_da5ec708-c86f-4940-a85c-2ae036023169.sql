
ALTER TABLE public.sources 
ADD COLUMN IF NOT EXISTS db_password text,
ADD COLUMN IF NOT EXISTS api_token text,
ADD COLUMN IF NOT EXISTS db_name text DEFAULT 'xui';

-- Ensure we have the latest column names matching our component
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sources TO authenticated;
GRANT ALL ON public.sources TO service_role;
