import mysql from 'mysql2/promise';

/**
 * Nota sobre compatibilidade Edge:
 * O mysql2 é marcado como external no vite.config.ts para permitir que o 
 * Cloudflare Workers com nodejs_compat o carregue nativamente.
 */

export async function getXuiDb(config: any) {
  // Garantir que process e process.nextTick existam (polyfills de borda)
  if (typeof globalThis !== 'undefined' && !globalThis.process) {
    (globalThis as any).process = { env: {}, nextTick: (fn: any, ...args: any[]) => setTimeout(() => fn(...args), 0) };
  }

  const host = config.ip || '38.190.176.170';
  const user = config.db_user || config.user || 'bancovods';
  const password = config.db_password || config.password || 'bancovods';
  const database = config.db_name || config.database || 'xui';
  const port = parseInt(config.db_port || config.port) || 3306;

  console.log(`[MySQL] Conectando em ${host}:${port}`);

  try {
    // Usar createConnection para testes e operações rápidas
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port,
      connectTimeout: 15000,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    return connection;
  } catch (error: any) {
    console.error("[MySQL] Erro de conexão:", error.message);
    throw error;
  }
}
