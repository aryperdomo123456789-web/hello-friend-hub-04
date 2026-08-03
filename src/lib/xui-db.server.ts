import mysql from 'mysql2/promise';

/**
 * Nota sobre compatibilidade Edge:
 * O mysql2 é marcado como external no vite.config.ts para permitir que o 
 * Cloudflare Workers com nodejs_compat o carregue nativamente.
 * Requer mysql2 >= 3.13.0 para suporte disableEval.
 */

export async function getXuiDb(config: any) {
  // Garantir que process e process.nextTick existam (polyfills de borda)
  if (typeof globalThis !== 'undefined' && !globalThis.process) {
    (globalThis as any).process = { 
      env: {}, 
      nextTick: (fn: any, ...args: any[]) => setTimeout(() => fn(...args), 0) 
    };
  }

  const host = config.ip || '38.190.176.170';
  const user = config.db_user || config.user || 'bancovods';
  const password = config.db_password || config.password || 'bancovods';
  const database = config.db_name || config.database || 'xui';
  const port = parseInt(config.db_port || config.port) || 3306;

  console.log(`[MySQL] Tentando conectar em ${host}:${port} (SSL desabilitado por padrão)`);

  try {
    // Configuração otimizada para Cloudflare Workers/Edge
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port,
      connectTimeout: 15000,
      // Desabilita eval para compatibilidade com ambientes que bloqueiam eval()
      disableEval: true,
      // O erro "Server does not support secure connection" acontece quando forçamos SSL 
      // em um servidor que não tem SSL habilitado. Vamos remover o objeto SSL ou deixá-lo nulo.
      ssl: undefined,
      // Aumenta a tolerância para servidores legados
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0
    });
    
    return connection;
  } catch (error: any) {
    console.error("[MySQL] Erro fatal de conexão:", error.message);
    
    // Tenta uma segunda vez se o erro for de SSL, explicitamente desativando SSL
    if (error.message.includes('secure connection') || error.message.includes('SSL')) {
      console.log("[MySQL] Tentando reconexão sem SSL...");
      try {
        return await mysql.createConnection({
          host,
          user,
          password,
          database,
          port,
          connectTimeout: 10000,
          disableEval: true,
          ssl: undefined
        });
      } catch (retryError: any) {
        throw new Error(`Falha na conexão XUI (Retry): ${retryError.message}`);
      }
    }
    
    throw new Error(`Falha na conexão XUI: ${error.message}`);
  }
}
