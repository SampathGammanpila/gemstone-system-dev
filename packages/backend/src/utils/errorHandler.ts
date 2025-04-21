/**
 * Error handling utilities for the backend
 */
import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../api/middlewares/error.middleware'
import logger from './logger'

/**
 * Central error handler for API errors
 * Formats errors for API responses consistently
 */
export const handleError = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500
  let message = 'Internal Server Error'
  let errors: string[] = []

  // If it's an API error with a status code
  if (err instanceof ApiError) {
    statusCode = err.statusCode
    message = err.message
    // ApiError doesn't have an errors property, so we'll use an empty array
    errors = []
  } else {
    // For regular errors, we don't expose details in production
    message = process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message || 'Unknown error'
  }

  // Log the error
  logger.error(`[${statusCode}] ${message}`, {
    path: req.path,
    method: req.method,
    errorName: err.name,
    errorMessage: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  })

  // Send the response
  res.status(statusCode).json({
    status: 'error',
    message,
    errors: errors.length ? errors : undefined,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  })
}

/**
 * Async handler to catch errors in async route handlers
 * This removes the need for try/catch blocks in route handlers
 */
export const asyncErrorHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Convert database errors to API errors
 */
export const handleDatabaseError = (error: any): ApiError => {
  // PostgreSQL unique violation
  if (error.code === '23505') {
    return new ApiError(
      409, 
      error.detail || 'A record with this value already exists'
    )
  }
  
  // PostgreSQL foreign key violation
  if (error.code === '23503') {
    return new ApiError(
      400, 
      error.detail || 'Referenced record does not exist'
    )
  }
  
  // PostgreSQL not null violation
  if (error.code === '23502') {
    return new ApiError(
      400, 
      error.detail || 'A required field is missing'
    )
  }
  
  // Default database error
  return new ApiError(
    500, 
    process.env.NODE_ENV === 'production' 
      ? 'An unexpected database error occurred' 
      : error.message
  )
}
