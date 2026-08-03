import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { ProtectedDomain } from "@/features/dashboard/types";

export const getDashboardStats = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
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
        distinctIps: Math.max(0, Math.floor((liveConnections || 0) * 0.8)),
        slotsSold: 5911,
        muscleCount: muscleCount || 0,
        sourceCount: sourceCount || 0
      };
    } catch (e) {
      console.error("Error fetching stats:", e);
      return {
        liveConnections: 0,
        streamingCount: 0,
        channelsCount: 0,
        moviesCount: 0,
        seriesCount: 0,
        distinctIps: 0,
        slotsSold: 0,
        muscleCount: 0,
        sourceCount: 0
      };
    }
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
      .select("*, muscles(id, name)")
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

export const getProtectedDomains = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data } = await supabaseAdmin
      .from("protected_domains")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as ProtectedDomain[]) || [];
  });

export const saveSourceConfig = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    const { data: existing } = await supabaseAdmin
      .from("sources")
      .select("id")
      .eq("ip", "38.190.176.170")
      .single();

    if (existing) {
      await supabaseAdmin
        .from("sources")
        .update({
          ip: data.ip,
          db_port: parseInt(data.port),
          api_url: data.apiUrl
        })
        .eq("id", existing.id);
    }
    return { success: true };
  });
