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
  const password = config.db_password || config.password || 'vmxfontevoods12@';
  const database = config.db_name || config.database || 'xui';
  const port = parseInt(config.db_port || config.port) || 3306;

  console.log(`[MySQL] Tentando conectar em ${host}:${port}`);

  try {
    // Configuração otimizada para Cloudflare Workers/Edge
    // Removido o campo 'ssl' para evitar o erro "Server does not support secure connection"
    const connectionOptions: any = {
      host,
      user,
      password,
      database,
      port,
      connectTimeout: 15000,
      // Desabilita eval para compatibilidade com ambientes que bloqueiam eval()
      disableEval: true,
      // Aumenta a tolerância para servidores legados
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0
    };

    const connection = await mysql.createConnection(connectionOptions);
    return connection;
  } catch (error: any) {
    console.error("[MySQL] Erro fatal de conexão:", error.message);
    
    // Fallback: se falhar por SSL, tentamos explicitamente sem SSL (embora omitir deva funcionar)
    if (error.message.includes('secure connection') || error.message.includes('SSL')) {
      console.log("[MySQL] Tentando reconexão forçando sem SSL...");
      try {
        return await mysql.createConnection({
          host,
          user,
          password,
          database,
          port,
          connectTimeout: 10000,
          disableEval: true
        } as any);
      } catch (retryError: any) {
        throw new Error(`Falha na conexão XUI (Retry): ${retryError.message}`);
      }
    }
    
    throw new Error(`Falha na conexão XUI: ${error.message}`);
  }
}
