import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function getDb() {
  const { data: source } = await supabaseAdmin
    .from("sources")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!source) throw new Error("Configuração da fonte XUI não encontrada.");

  const { getXuiDb } = await import("./xui-db.server");
  return await getXuiDb(source);
}

export const getXuiCategories = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const db = await getDb();
      let rows: any[] = [];
      try {
        const [xuiRows]: any = await db.query("SELECT id, category_name as name, category_type as type FROM streams_categories ORDER BY category_name ASC");
        rows = xuiRows;
      } catch (err) {
        // XC_VM might use different names, but categories are usually the same table name
        const [xcvmRows]: any = await db.query("SELECT id, category_name as name, category_type as type FROM categories ORDER BY category_name ASC");
        rows = xcvmRows;
      }
      await db.end();
      return rows;
    } catch (e) {
      console.error(e);
      return [];
    }
  });

export const getXuiStreams = createServerFn({ method: "POST" })
  .inputValidator((data: { type: 'live' | 'movie' | 'series' }) => data)
  .handler(async ({ data }) => {
    try {
      const db = await getDb();
      let query = "";
      if (data.type === 'live') {
        query = "SELECT id, stream_display_name as name, category_id, stream_icon, 'live' as stream_type FROM streams WHERE type = 1 ORDER BY id DESC LIMIT 500";
      } else if (data.type === 'movie') {
        query = "SELECT id, stream_display_name as name, category_id, stream_icon, 'movie' as stream_type FROM streams WHERE type = 2 ORDER BY id DESC LIMIT 500";
      } else {
        // Try streams_series (XUI/XC_VM common)
        try {
          const [rows]: any = await db.query("SELECT id, title as name, category_id, cover as stream_icon, 'series' as stream_type FROM streams_series ORDER BY id DESC LIMIT 500");
          await db.end();
          return rows;
        } catch (e) {
          query = "SELECT id, stream_display_name as name, category_id, stream_icon, 'series' as stream_type FROM streams WHERE type = 3 ORDER BY id DESC LIMIT 500";
        }
      }
      const [rows]: any = await db.query(query);
      await db.end();
      return rows;
    } catch (e) {
      console.error(e);
      return [];
    }
  });

export const getXuiEpisodes = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const db = await getDb();
      const [rows]: any = await db.query("SELECT e.id, e.series_id, s.stream_display_name as title, s.stream_icon as image, e.season_num, e.episode_num FROM streams_episodes e LEFT JOIN streams s ON s.id = e.stream_id ORDER BY e.id DESC LIMIT 500");
      await db.end();
      return rows;
    } catch (e) {
      console.error(e);
      return [];
    }
  });
