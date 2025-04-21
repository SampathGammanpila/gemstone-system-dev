import { CorsOptions } from 'cors'

/**
 * CORS configuration options
 */
export const corsOptions: CorsOptions = {
  // Origin
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Allow credentials (cookies, authorization headers, etc.)
  credentials: true,
  
  // HTTP methods to allow
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  // Allowed headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-CSRF-Token',
  ],
  
  // Exposed headers
  exposedHeaders: ['X-CSRF-Token'],
  
  // How long the results of a preflight request can be cached
  maxAge: 86400,
}