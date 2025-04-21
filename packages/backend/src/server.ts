import express, { Express } from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'

// Import routes
import apiRoutes from './api/routes'
import adminRoutes from './admin/routes'

// Import middlewares
import { errorMiddleware } from './api/middlewares/error.middleware'

// Import configuration
import { corsOptions } from './config/cors'

export const createServer = (): Express => {
  const app = express()

  // Security headers
  app.use(helmet())

  // Parse JSON bodies
  app.use(express.json())
  
  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true }))
  
  // Parse cookies
  app.use(cookieParser())
  
  // Enable CORS
  app.use(cors(corsOptions))
  
  // Compress all responses
  app.use(compression())
  
  // HTTP request logging
  app.use(morgan(process.env.LOG_FORMAT || 'dev'))
  
  // Rate limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  })
  
  // Apply rate limiting to API routes
  app.use(`${process.env.API_PREFIX || '/api'}`, apiLimiter)
  
  // Set up static file serving
  app.use(express.static(path.join(__dirname, '../public')))
  
  // Set up view engine for admin panel
  app.set('views', path.join(__dirname, 'admin/views'))
  app.set('view engine', 'ejs')
  
  // API routes
  app.use(`${process.env.API_PREFIX || '/api'}`, apiRoutes)
  
  // Admin panel routes
  app.use('/admin', adminRoutes)
  
  // Default route
  app.get('/', (req, res) => {
    res.json({ message: 'Gemstone System API' })
  })
  
  // 404 handler
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' })
  })
  
  // Error handling middleware
  app.use(errorMiddleware)
  
  return app
}