import mysql from 'mysql2/promise';
import 'process'; // Force process polyfill


/**
 * Nota sobre compatibilidade Edge:
 * O erro "No such module node:process" geralmente ocorre quando o driver mysql2 
 * tenta acessar globais do Node em ambientes como Cloudflare Workers (onde o sistema é publicado).
 * Estamos usando uma versão estável e garantindo que o pool seja leve.
 */

export async function getXuiDb(config: any) {
  const host = config.ip || '38.190.176.170';
  const user = config.user || 'bancovods';
  const password = config.password || 'bancovods';
  const database = config.database || 'xui';
  const port = parseInt(config.port) || 3306;

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
    });
    
    return connection;
  } catch (error: any) {
    console.error("[MySQL] Erro ao criar conexão:", error.message);
    throw error;
  }
}
