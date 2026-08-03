export interface DashboardStats {
  liveConnections: number;
  streamingCount: number;
  channelsCount: number;
  moviesCount: number;
  seriesCount: number;
  distinctIps: number;
  slotsSold: number;
  muscleCount: number;
  sourceCount: number;
}

export interface ProtectedDomain {
  id: string;
  domain_name: string;
  type: string;
  content: string;
  created_at?: string | null;
}

export interface Source {
  id: string;
  name: string;
  ip: string;
  db_port?: number | null;
  db_name?: string;
  db_user?: string;
  db_password?: string;
  api_url?: string;
  api_token?: string;
  origin_type?: 'A' | 'CNAME';
  created_at?: string | null;
}


export interface Muscle {
  id: string;
  name: string;
  ip: string;
  status: string | null;
  source_id: string | null;
  sources?: { name: string } | null;
  created_at?: string | null;
  last_seen?: string | null;
}

export interface LiveConnection {
  id: string;
  username: string;
  stream_type: string;
  stream_id: number;
  ip_address: string;
  user_agent?: string | null;
  muscle_id?: string | null;
  muscles?: { id: string; name: string } | null;
  started_at?: string | null;
  bytes_sent?: number | null;
  last_activity_at?: string | null;
  server_id?: string | null;
}

export interface XuiUser {
  id: number;
  username: string;
  password?: string;
  exp_date?: number | null;
  admin_enabled: boolean;
  enabled: boolean;
  max_connections: number;
  active_connections: number;
  created_at: number;
  last_login?: number | null;
}

export interface XuiCategory {
  id: number;
  name: string;
  type: string;
}

export interface XuiStream {
  id: number;
  name: string;
  category_id: number;
  stream_icon?: string;
  stream_type: string;
}

export interface XuiEpisode {
  id: number;
  series_id: number;
  title: string;
  image?: string;
  season_num: number;
  episode_num: number;
}



export interface HostHealth {
  id: string;
  host_name: string;
  cpu_usage: number;
  ram_usage: number;
  status: string;
  last_seen: string;
}