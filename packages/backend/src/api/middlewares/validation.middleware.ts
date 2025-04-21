import { Request, Response, NextFunction } from 'express'
import { Schema } from 'joi'
import { ApiError } from './error.middleware'

/**
 * Middleware for validating request data using Joi schemas
 * @param schema Joi validation schema
 */
export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      { abortEarly: false }
    )

    if (!error) {
      return next()
    }

    // Format validation errors
    const errorDetails = error.details.map(detail => detail.message)

    // Create ApiError with validation error message and true for isOperational
    next(new ApiError(400, 'Validation error: ' + errorDetails.join(', '), true))
  }
}

/**
 * Extract sanitized data from request based on specified fields
 * @param req - Express request object
 * @param fields - Fields to extract
 * @returns Object with sanitized data
 */
export const extractSanitizedData = (req: Request, fields: string[]): Record<string, any> => {
  return fields.reduce((acc, field) => {
    if (req.body[field] !== undefined) {
      acc[field] = req.body[field]
    }
    return acc
  }, {} as Record<string, any>)
}