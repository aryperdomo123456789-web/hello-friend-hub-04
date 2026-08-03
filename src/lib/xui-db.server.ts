import mysql from 'mysql2/promise';

/**
 * Nota sobre compatibilidade Edge:
 * Tentativa de usar mysql2/promise diretamente no ambiente Cloudflare Workers
 * com nodejs_compat habilitado.
 */

export async function getXuiDb(config: any) {
  const host = config.ip || '38.190.176.170';
  const user = config.db_user || config.user || 'bancovods';
  const password = config.db_password || config.password || 'bancovods';
  const database = config.db_name || config.database || 'xui';
  const port = parseInt(config.db_port || config.port) || 3306;

  console.log(`[MySQL] Conectando em ${host}:${port}`);

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port,
      connectTimeout: 15000,
    });
    
    return connection;
  } catch (error: any) {
    console.error("[MySQL] Erro:", error.message);
    throw error;
  }
}
