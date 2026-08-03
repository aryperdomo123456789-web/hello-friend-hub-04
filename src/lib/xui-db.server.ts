import mysql from 'mysql2/promise';
import process from 'process';

// Garantir que process esteja disponível no escopo global para o mysql2
if (typeof globalThis !== 'undefined' && !globalThis.process) {
  (globalThis as any).process = process;
}

/**
 * Nota sobre compatibilidade Edge:
 * O erro "No such module node:process" ocorre porque o driver mysql2 
 * depende de globais do Node.js. No Cloudflare Workers, usamos polyfills.
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
