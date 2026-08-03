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

export interface Source {
  id: string;
  name: string;
  ip: string;
  created_at?: string;
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


export interface HostHealth {
  id: string;
  host_name: string;
  cpu_usage: number;
  ram_usage: number;
  status: string;
  last_seen: string;
}
