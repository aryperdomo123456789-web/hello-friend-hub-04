import mysql from 'mysql2/promise';

/**
 * Nota sobre compatibilidade Edge:
 * O erro "No such module node:process" geralmente ocorre quando o driver mysql2 
 * tenta acessar globais do Node em ambientes como Cloudflare Workers (onde o sistema é publicado).
 * No Lovable Cloud, tentamos usar o mysql2 com polyfills via Vite.
 */

export async function getXuiDb(config: any) {
  const host = config.ip || '38.190.176.170';
  const user = config.db_user || config.user || 'bancovods';
  const password = config.db_password || config.password || 'bancovods';
  const database = config.db_name || config.database || 'xui';
  const port = parseInt(config.db_port || config.port) || 3306;

  console.log(`[MySQL] Tentando conectar em ${host}:${port} (user: ${user}, db: ${database})`);

  try {
    // Usamos createConnection diretamente para testes mais rápidos e isolados
    // Adicionamos flags de SSL desativado se necessário ou simplificamos ao máximo
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port,
      connectTimeout: 15000,
      // Desativar SSL se o servidor não suportar ou se causar erros no worker
      ssl: false 
    });
    
    return connection;
  } catch (error: any) {
    console.error("[MySQL] Erro ao criar conexão:", error.message);
    throw error;
  }
}
