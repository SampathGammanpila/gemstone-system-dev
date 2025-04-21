/**
 * Database configuration
 */
export const databaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'gemstone_system_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    // Connection pool configuration
    pool: {
      max: 20, // Maximum number of clients the pool should contain
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 2000, // How long to wait for a connection
    },
    // Database schema configuration
    schema: {
      default: 'public',
    },
  }