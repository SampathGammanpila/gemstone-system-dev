import { Request, Response, NextFunction } from 'express'
import logger from '@/utils/logger'

/**
 * Custom Error class for API errors
 */
export class ApiError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Error handling middleware
 */
export const errorMiddleware = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  logger.error(`[${req.method}] ${req.path} >> ${err.message}`, { 
    error: err.stack,
    body: req.body,
    params: req.params,
    query: req.query
  })

  // Default error
  let statusCode = 500
  let message = 'Internal Server Error'
  let isOperational = false

  // If it's our ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode
    message = err.message
    isOperational = err.isOperational
  }

  // Only show error details in development
  const responseBody = {
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      isOperational
    })
  }

  // Send the error response
  res.status(statusCode).json(responseBody)
}

/**
 * Route not found handler - creates a 404 error
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`))
}

/**
 * Error handler for async routes
 */
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}