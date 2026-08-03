import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getDashboardStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const { count: liveConnections } = await supabaseAdmin
      .from("live_connections")
      .select("*", { count: "exact", head: true });

    const { count: streamingCount } = await supabaseAdmin
      .from("live_connections")
      .select("*", { count: "exact", head: true });

    const { count: channelsCount } = await supabaseAdmin
      .from("live_connections")
      .select("*", { count: "exact", head: true })
      .eq("stream_type", "canal");

    const { count: moviesCount } = await supabaseAdmin
      .from("live_connections")
      .select("*", { count: "exact", head: true })
      .eq("stream_type", "filme");

    const { count: seriesCount } = await supabaseAdmin
      .from("live_connections")
      .select("*", { count: "exact", head: true })
      .eq("stream_type", "serie");

    const { count: muscleCount } = await supabaseAdmin
      .from("muscles")
      .select("*", { count: "exact", head: true });

    const { count: sourceCount } = await supabaseAdmin
      .from("sources")
      .select("*", { count: "exact", head: true });

    return {
      liveConnections: liveConnections || 0,
      streamingCount: streamingCount || 0,
      channelsCount: channelsCount || 0,
      moviesCount: moviesCount || 0,
      seriesCount: seriesCount || 0,
      distinctIps: Math.max(1, Math.floor((liveConnections || 0) * 0.8)),
      slotsSold: 5911,
      muscleCount: muscleCount || 0,
      sourceCount: sourceCount || 0
    };
  });

export const getSources = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data } = await supabaseAdmin
      .from("sources")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  });

export const getMuscles = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data } = await supabaseAdmin
      .from("muscles")
      .select("*, sources(name)")
      .order("created_at", { ascending: false });
    return data || [];
  });

export const getLiveConnections = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data } = await supabaseAdmin
      .from("live_connections")
      .select("*, muscles(name)")
      .order("started_at", { ascending: false });
    return data || [];
  });

export const getHostHealth = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data } = await supabaseAdmin
      .from("host_health")
      .select("*")
      .order("last_seen", { ascending: false });
    return data || [];
  });
