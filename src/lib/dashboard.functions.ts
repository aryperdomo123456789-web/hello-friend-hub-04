import { createServerFn } from "@tanstack/react-start";
import { ProtectedDomain, XuiUser } from "@/features/dashboard/types";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

async function getSupabaseAdmin() {
  const SUPABASE_URL = process.env['SUPABASE_URL'] || import.meta.env['VITE_SUPABASE_URL'];
  const SUPABASE_SERVICE_ROLE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[getSupabaseAdmin] Variáveis ausentes. URL:", !!SUPABASE_URL, "KEY:", !!SUPABASE_SERVICE_ROLE_KEY);
    throw new Error("Conecte o Supabase no Lovable Cloud para habilitar a sincronização.");
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
}

export const getDashboardStats = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const supabaseAdmin = await getSupabaseAdmin();
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
    try {
      const supabaseAdmin = await getSupabaseAdmin();
      const { data, error } = await supabaseAdmin
        .from("sources")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("getSources error:", e);
      return [];
    }
  });

export const getMuscles = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const supabaseAdmin = await getSupabaseAdmin();
      const { data, error } = await supabaseAdmin
        .from("muscles")
        .select("*, sources(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("getMuscles error:", e);
      return [];
    }
  });

export const getLiveConnections = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const supabaseAdmin = await getSupabaseAdmin();
      
      // Tentar pegar a fonte configurada
      const { data: source } = await supabaseAdmin
        .from("sources")
        .select("*")
        .limit(1)
        .single();

      if (source) {
        try {
          const { getXuiDb } = await import("./xui-db.server");
          const db = await getXuiDb(source);
          
          // Buscar conexões reais do XUI/XC_VM
          let liveRows: any[] = [];
          try {
            const [rows]: any = await db.query(`
              SELECT 
                l.username as subscriber_name,
                'canal' as stream_type,
                'Streaming' as activity_type,
                s.stream_display_name as watching_title,
                cl.user_ip as ip_address,
                'App XUI' as app_name,
                cl.s_time as started_at
              FROM lines_live cl
              JOIN \`lines\` l ON cl.user_id = l.id
              LEFT JOIN streams s ON cl.stream_id = s.id
              LIMIT 100
            `);
            liveRows = rows;
          } catch (e) {
            const [rows]: any = await db.query(`
              SELECT 
                u.username as subscriber_name,
                'canal' as stream_type,
                'Streaming' as activity_type,
                s.stream_display_name as watching_title,
                ul.user_ip as ip_address,
                'App XC_VM' as app_name,
                ul.s_time as started_at
              FROM user_live ul
              JOIN users u ON ul.user_id = u.id
              LEFT JOIN streams s ON ul.stream_id = s.id
              LIMIT 100
            `);
            liveRows = rows;
          }
          await db.end();

          if (liveRows && liveRows.length > 0) {
            return liveRows.map((row, idx) => ({
              id: `xui-${idx}`,
              username: row.subscriber_name,
              stream_type: row.stream_type,
              stream_id: idx,
              ip_address: row.ip_address,
              user_agent: row.app_name,
              started_at: row.started_at ? new Date(Number(row.started_at) * 1000).toISOString() : new Date().toISOString(),
              muscle_id: "main",
              muscles: { id: "main", name: "Main" }
            }));
          }
        } catch (dbErr) {
          console.error("Erro ao buscar conexões reais do MySQL, usando Supabase fallback:", dbErr);
        }
      }

      const { data, error } = await supabaseAdmin
        .from("live_connections")
        .select("*, muscles(id, name)")
        .order("started_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("getLiveConnections error:", e);
      return [];
    }
  });

export const getHostHealth = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const supabaseAdmin = await getSupabaseAdmin();
      const { data, error } = await supabaseAdmin
        .from("host_health")
        .select("*")
        .order("last_seen", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("getHostHealth error:", e);
      return [];
    }
  });

export const getProtectedDomains = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const supabaseAdmin = await getSupabaseAdmin();
      const { data, error } = await supabaseAdmin
        .from("protected_domains")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as ProtectedDomain[]) || [];
    } catch (e) {
      console.error("getProtectedDomains error:", e);
      return [];
    }
  });

export const saveSourceConfig = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    const supabaseAdmin = await getSupabaseAdmin();
    const { data: existing } = await supabaseAdmin
      .from("sources")
      .select("id")
      .eq("ip", data.ip)
      .single();

    const payload = {
      ip: data.ip,
      db_port: parseInt(data.port),
      db_name: data.database,
      db_user: data.user,
      db_password: data.password,
      api_url: data.apiUrl,
      api_token: data.apiToken,
      origin_type: data.originType || 'A',
      updated_at: new Date().toISOString()
    };

    if (existing) {
      await supabaseAdmin
        .from("sources")
        .update(payload)
        .eq("id", existing.id);
    } else {
      await supabaseAdmin
        .from("sources")
        .insert({
          ...payload,
          name: "Fonte XUI"
        });
    }
    return { success: true };
  });

export const testXuiConnection = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    console.log("Iniciando teste de conexão XUI para:", data.ip);
    try {
      const { getXuiDb } = await import("./xui-db.server");
      const db = await getXuiDb(data);
      
      const [result]: any = await Promise.race([
        db.query("SELECT 1 as connected"),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout de conexão (15s)")), 15000))
      ]);
      
      await db.end();
      
      if (result && result[0] && result[0].connected === 1) {
        return { success: true, message: "Conexão com o banco de dados XUI estabelecida com sucesso!" };
      }
      
      return { success: false, message: "O banco de dados respondeu mas o teste de query falhou." };
    } catch (error: any) {
      console.error("Erro fatal ao testar conexão XUI:", error);
      let errorMsg = error.message;
      if (errorMsg.includes("ETIMEDOUT")) errorMsg = "Tempo de conexão esgotado (Firewall bloqueando?).";
      if (errorMsg.includes("ECONNREFUSED")) errorMsg = "Conexão recusada (IP ou Porta errados?).";
      if (errorMsg.includes("ER_ACCESS_DENIED_ERROR")) errorMsg = "Acesso negado (Usuário ou Senha errados).";
      
      return { success: false, message: `Falha na conexão: ${errorMsg}` };
    }
  });

export const getXuiUsers = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const supabaseAdmin = await getSupabaseAdmin();
      const { data: source } = await supabaseAdmin
        .from("sources")
        .select("*")
        .limit(1)
        .single();

      if (!source) return [];

      const { getXuiDb } = await import("./xui-db.server");
      const db = await getXuiDb(source);
      
      let rows: any[] = [];
      try {
        const [linesRows]: any = await db.query(`
          SELECT 
            l.id, l.username, l.password, l.enabled, l.admin_enabled,
            l.max_connections, l.created_at, l.exp_date,
            (SELECT COUNT(*) FROM lines_live ll WHERE ll.user_id = l.id) AS active_connections
          FROM \`lines\` l ORDER BY l.id DESC LIMIT 500
        `);
        rows = linesRows;
      } catch (err) {
        const [usersRows]: any = await db.query(`
          SELECT 
            u.id, u.username, u.password, u.enabled, u.admin_enabled,
            u.max_connections, u.created_at, u.exp_date,
            (SELECT COUNT(*) FROM user_live ul WHERE ul.user_id = u.id) AS active_connections
          FROM \`users\` u ORDER BY u.id DESC LIMIT 500
        `);
        rows = usersRows;
      }
      await db.end();

      return rows.map((row: any) => ({
        id: row.id,
        username: row.username,
        password: row.password,
        admin_enabled: row.admin_enabled === 1 || row.admin_enabled === true,
        enabled: row.enabled === 1 || row.enabled === true,
        max_connections: row.max_connections || 1,
        active_connections: Number(row.active_connections) || 0,
        created_at: row.created_at ? Number(row.created_at) : Math.floor(Date.now() / 1000),
        exp_date: row.exp_date ? Number(row.exp_date) : null
      }));

    } catch (error: any) {
      console.error("Error fetching real XUI users:", error);
      throw new Error(`Falha na conexão XUI: ${error.message}`);
    }
  });

export const deleteXuiUser = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      const supabaseAdmin = await getSupabaseAdmin();
      const { data: source } = await supabaseAdmin
        .from("sources")
        .select("*")
        .limit(1)
        .single();

      if (!source) throw new Error("Configuração da fonte XUI não encontrada.");

      const { getXuiDb } = await import("./xui-db.server");
      const db = await getXuiDb(source);
      await db.query("DELETE FROM `lines` WHERE id = ?", [data.id]);
      await db.end();
      return { success: true };
    } catch (error) {
      console.error("Error deleting XUI user:", error);
      return { success: false };
    }
  });

export const toggleXuiUserStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { id: number; enabled: boolean }) => data)
  .handler(async ({ data }) => {
    try {
      const supabaseAdmin = await getSupabaseAdmin();
      const { data: source } = await supabaseAdmin
        .from("sources")
        .select("*")
        .limit(1)
        .single();

      if (!source) throw new Error("Configuração da fonte XUI não encontrada.");

      const { getXuiDb } = await import("./xui-db.server");
      const db = await getXuiDb(source);
      await db.query("UPDATE `lines` SET enabled = ? WHERE id = ?", [data.enabled ? 1 : 0, data.id]);
      await db.end();
      return { success: true };
    } catch (error) {
      console.error("Error toggling XUI user status:", error);
      return { success: false };
    }
  });
