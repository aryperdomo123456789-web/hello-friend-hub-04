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

  try {
    const pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
      connectTimeout: 15000,
      // Desabilitamos SSL por padrão para conexões diretas de banco legadas,
      // a menos que explicitamente configurado.
    });
    
    return pool;
  } catch (error) {
    console.error("Erro ao criar pool MySQL:", error);
    throw new Error("Não foi possível estabelecer conexão com o banco de dados. Verifique os dados de acesso.");
  }
}
