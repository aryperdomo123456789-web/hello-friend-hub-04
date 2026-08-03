import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getDashboardStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const { count: sourceCount } = await supabaseAdmin
      .from('sources')
      .select('*', { count: 'exact', head: true });
      
    const { count: muscleCount } = await supabaseAdmin
      .from('muscles')
      .select('*', { count: 'exact', head: true });
      
    const { data: muscles } = await supabaseAdmin
      .from('muscles')
      .select('status');

    const { count: liveCount } = await supabaseAdmin
      .from('live_connections')
      .select('*', { count: 'exact', head: true });
      
    const onlineMuscles = muscles?.filter(m => m.status === 'online').length || 0;
    
    return {
      sources: sourceCount || 0,
      muscles: muscleCount || 0,
      onlineMuscles,
      liveConnections: liveCount || 0,
      streamingCount: liveCount || 0, // Simplificação inicial
      channelsCount: 0,
      moviesCount: 0,
      seriesCount: 0,
      distinctIps: 0,
      slotsSold: 5911 // Valor fixo do print como placeholder
    };
  });

export const getSources = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from('sources')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  });

export const getMuscles = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from('muscles')
      .select('*, sources(name)')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  });

export const getLiveConnections = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from('live_connections')
      .select('*, muscles(name)')
      .order('started_at', { ascending: false });
      
    if (error) throw error;
    return data;
  });

export const getHostHealth = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from('host_health')
      .select('*')
      .order('last_seen', { ascending: false });
      
    if (error) throw error;
    return data;
  });
