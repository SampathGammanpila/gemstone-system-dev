import { Pool, PoolClient } from 'pg'
import logger from '../utils/logger'

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'gemstone_system_dev',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
}

// Create a new pool
const pool = new Pool(dbConfig)

// Event listener for when a client connects to the pool
pool.on('connect', () => {
  logger.debug('New client connected to database pool')
})

// Event listener for pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err)
  process.exit(-1)
})

/**
 * Connect to the database and validate the connection
 */
export const connectDatabase = async (): Promise<void> => {
  let client: PoolClient | null = null
  
  try {
    // Acquire a client from the pool to test the connection
    client = await pool.connect()
    logger.info('Successfully connected to the database')
  } catch (error) {
    logger.error('Failed to connect to the database:', error)
    throw error
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release()
    }
  }
}

/**
 * Execute a query against the database
 * @param text SQL query text
 * @param params Query parameters
 * @returns Query result
 */
export const query = async (text: string, params?: any[]) => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    logger.debug('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    logger.error('Error executing query', { text, error })
    throw error
  }
}

/**
 * Get a client from the connection pool
 * @returns A PostgreSQL client
 */
export const getClient = async () => {
  const client = await pool.connect()
  const query = client.query.bind(client)
  const release = client.release.bind(client)

  // Monkey patch the query method to keep track of the last query executed
  client.query = async (text: string, params?: any[]) => {
    const start = Date.now()
    try {
      const res = await query(text, params)
      const duration = Date.now() - start
      logger.debug('Executed query with client', { text, duration, rows: res.rowCount })
      return res
    } catch (error) {
      logger.error('Error executing query with client', { text, error })
      throw error
    }
  }

  // Monkey patch the release method to log client release
  client.release = () => {
    logger.debug('Client released back to pool')
    release()
  }

  return client
}

export default {
  query,
  getClient,
  connectDatabase,
}