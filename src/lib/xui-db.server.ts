import mysql, { Pool } from 'mysql2/promise';

let pool: Pool | null = null;

export async function getXuiDb(config: any) {
  // Use config or defaults
  const host = config.ip || '38.190.176.170';
  const user = config.user || 'bancovods';
  const password = config.password || 'bancovods';
  const database = config.database || 'xui';
  const port = parseInt(config.port) || 3306;

  // We create a new pool if config changes or first time
  // For the sandbox, we'll just create it every time for simplicity if config is provided
  const newPool = mysql.createPool({
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
    connectTimeout: 5000
  });
  
  return newPool;
}
