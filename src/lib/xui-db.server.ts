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
      connectTimeout: 15000,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
      enableKeepAlive: true,
      // Desabilita eval para evitar erro de segurança em workers
      disableEval: true,
    };

    // Tenta conexão direta usando a versão pura de JS do mysql2 que o Vite empacota
    const connection = await mysql.createConnection(connectionOptions);
    return connection;
  } catch (error: any) {
    console.error("[MySQL] Erro fatal de conexão:", error.message);
    
    // Se o erro for lru-cache ou módulos internos, tentamos uma abordagem de carregamento diferente
    if (error.message.includes('lru') || error.message.includes('module')) {
       throw new Error(`Erro de infraestrutura (módulo ausente): ${error.message}. Verifique o bundling no vite.config.ts.`);
    }
    
    throw new Error(`Falha na conexão XUI: ${error.message}`);
  }
}
