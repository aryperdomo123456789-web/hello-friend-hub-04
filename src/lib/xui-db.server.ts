import mysql from 'mysql2/promise';

export async function getXuiDb(config: any) {
  const host = config.ip || '38.190.176.170';
  const user = config.user || 'bancovods';
  const password = config.password || 'bancovods';
  const database = config.database || 'xui';
  const port = parseInt(config.port) || 3306;

  // Use the standard connection method, but ensure we aren't pulling in Node-only polyfills 
  // that fail in the Worker runtime. mysql2/promise is generally okay in nodejs_compat,
  // but if the specific version is triggering a "node:process" failure, we hope the 
  // version pinned (3.9.7) or standard workerd behavior handles it.
  
  return mysql.createPool({
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
    connectTimeout: 10000,
    // Add compatibility flag if supported by this version
    ssl: {
      rejectUnauthorized: false
    }
  });
}
