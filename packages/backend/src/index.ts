import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from the appropriate .env file
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.production') })
} else {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.development') })
}

import { createServer } from './server'
import logger from './utils/logger'
import { connectDatabase } from './db'

// Start the server
const startServer = async () => {
  try {
    // Connect to the database
    await connectDatabase()
    logger.info('Database connection established')

    // Create and start the Express server
    const app = createServer()
    const PORT = process.env.PORT || 5000
    const HOST = process.env.HOST || 'localhost'

    app.listen(Number(PORT), HOST, () => {
      logger.info(`Server running at http://${HOST}:${PORT}`)
      logger.info(`API available at http://${HOST}:${PORT}${process.env.API_PREFIX || '/api'}`)
      logger.info(`Admin panel available at http://${HOST}:${PORT}/admin`)
    })

    // Handle uncaught exceptions and rejections
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error)
      process.exit(1)
    })

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
      process.exit(1)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()