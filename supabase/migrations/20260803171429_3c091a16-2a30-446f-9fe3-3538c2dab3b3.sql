
CREATE TABLE public.sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    ip TEXT NOT NULL,
    root_user TEXT,
    db_user TEXT,
    db_name TEXT DEFAULT 'xui',
    db_port INTEGER DEFAULT 3306,
    api_url TEXT,
    panel_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sources TO authenticated;
GRANT ALL ON public.sources TO service_role;

ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own sources" 
ON public.sources 
FOR ALL 
TO authenticated 
USING (true);

CREATE TABLE public.muscles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    ip TEXT NOT NULL,
    status TEXT DEFAULT 'offline',
    last_seen TIMESTAMPTZ,
    source_id UUID REFERENCES public.sources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.muscles TO authenticated;
GRANT ALL ON public.muscles TO service_role;

ALTER TABLE public.muscles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own muscles" 
ON public.muscles 
FOR ALL 
TO authenticated 
USING (true);

INSERT INTO public.sources (name, ip, root_user, db_user, db_name, db_port, api_url, panel_url)
VALUES (
    'Laboratório Inicial', 
    '38.190.176.170', 
    'root', 
    'bancovods', 
    'xui', 
    3306, 
    'http://38.190.176.170/fejvCHkR', 
    'http://38.190.176.170/HHnEcjsR'
);
