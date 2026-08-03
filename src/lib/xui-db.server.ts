import mysql from 'mysql2/promise';

/**
 * Nota sobre compatibilidade Edge:
 * O erro "No such module node:process" geralmente ocorre quando o driver mysql2 
 * tenta acessar globais do Node em ambientes como Cloudflare Workers.
 * Estamos usando a versão JS-only do driver para maior compatibilidade.
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
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port,
      connectTimeout: 15000,
      // Se SSL causar problemas no worker, aqui é onde configuramos
      // ssl: { rejectUnauthorized: false }
    });
    
    return connection;
  } catch (error: any) {
    console.error("[MySQL] Erro ao criar conexão:", error.message);
    throw error;
  }
}
