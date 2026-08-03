import mysql from 'mysql2/promise';

/**
 * Nota sobre compatibilidade Edge:
 * O mysql2 é marcado como external no vite.config.ts para permitir que o 
 * Cloudflare Workers com nodejs_compat o carregue nativamente.
 */

export async function getXuiDb(config: any) {
  // Garantir que process e process.nextTick existam (polyfills de borda)
  if (typeof globalThis !== 'undefined' && !globalThis.process) {
    (globalThis as any).process = { 
      env: { NODE_ENV: 'production' }, 
      version: 'v18.0.0',
      nextTick: (fn: any, ...args: any[]) => setTimeout(() => fn(...args), 0) 
    };
  }

  // Importação dinâmica para garantir que o lru-cache seja carregado no ambiente correto
  try {
    const lru = await import('lru-cache');
    console.log("[System] lru-cache carregado com sucesso");
  } catch (e) {
    console.error("[System] Erro ao carregar lru-cache:", e);
  }

  const host = config.ip || '38.190.176.170';
  const user = config.db_user || config.user || 'bancovods';
  const password = config.db_password || config.password || 'vmxfontevoods12@';
  const database = config.db_name || config.database || 'xui';
  const port = parseInt(config.db_port || config.port) || 3306;

  console.log(`[MySQL] Tentando conectar em ${host}:${port}`);

  try {
    const connectionOptions: any = {
      host,
      user,
      password,
      database,
      port,
      connectTimeout: 20000,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
      enableKeepAlive: true,
      disableEval: true,
    };

    const connection = await mysql.createConnection(connectionOptions);
    return connection;
  } catch (error: any) {
    console.error("[MySQL] Erro fatal de conexão:", error.message);
    throw new Error(`Falha na conexão XUI: ${error.message}`);
  }
}
