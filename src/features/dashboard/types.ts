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
  status: 'online' | 'offline';
  source_id: string;
  sources?: { name: string };
  created_at?: string;
}

export interface LiveConnection {
  id: string;
  username: string;
  stream_type: string;
  stream_id: string;
  ip_address: string;
  user_agent?: string;
  muscle_id?: string;
  muscles?: { id: string; name: string };
  started_at?: string;
}

export interface HostHealth {
  id: string;
  host_name: string;
  cpu_usage: number;
  ram_usage: number;
  status: string;
  last_seen: string;
}
