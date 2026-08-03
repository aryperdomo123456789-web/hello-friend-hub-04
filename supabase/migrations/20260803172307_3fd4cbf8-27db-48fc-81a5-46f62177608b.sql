CREATE TABLE public.live_connections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username text NOT NULL,
    stream_id integer NOT NULL,
    stream_type text NOT NULL,
    ip_address text NOT NULL,
    user_agent text,
    server_id uuid REFERENCES public.muscles(id),
    bytes_sent bigint DEFAULT 0,
    started_at timestamptz DEFAULT now(),
    last_activity_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.live_connections TO authenticated;
GRANT ALL ON public.live_connections TO service_role;

CREATE TABLE public.host_health (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    host text NOT NULL UNIQUE,
    verdict text NOT NULL,
    fail_rate integer DEFAULT 0,
    hops integer DEFAULT 0,
    last_seen timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.host_health TO authenticated;
GRANT ALL ON public.host_health TO service_role;

ALTER TABLE public.live_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_health ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage connections" ON public.live_connections FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage host health" ON public.host_health FOR ALL TO authenticated USING (true);