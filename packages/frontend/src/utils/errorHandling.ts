/**
 * Error handling utilities for the frontend
 */
import { toastService } from '../services/notifications/toast.service'

// API error interface
export interface ApiError {
  status: string
  message: string
  errors?: string[]
}

// Network error interface
export interface NetworkError {
  message: string
  status?: number
}

/**
 * Format an error message from any type of error
 * @param error The error object
 * @param fallback Fallback message if error cannot be parsed
 */
export const formatErrorMessage = (
  error: any,
  fallback = 'An unexpected error occurred'
): string => {
  if (!error) {
    return fallback
  }

  // If it's an API error response
  if (error.response?.data) {
    const apiError = error.response.data as ApiError
    return apiError.message || apiError.errors?.[0] || fallback
  }

  // If it's a network error
  if (error.message && (error.status || error.code)) {
    return `${error.message} (${error.status || error.code})`
  }

  // If it's a plain error object
  if (error.message) {
    return error.message
  }

  // If it's a string
  if (typeof error === 'string') {
    return error
  }

  // Fallback
  return fallback
}

/**
 * Handle API error and display a toast message
 * @param error The error object
 * @param fallback Fallback message if error cannot be parsed
 */
export const handleApiError = (
  error: any,
  fallback = 'An unexpected error occurred'
): string => {
  const message = formatErrorMessage(error, fallback)
  toastService.error(message)
  return message
}

/**
 * Handle form field errors from API
 * @param error The error object
 * @param setErrors Function to set form errors
 */
export const handleFormErrors = (
  error: any,
  setErrors: (errors: Record<string, string>) => void
): void => {
  // If it's an API error with field validation errors
  if (error.response?.data?.errors) {
    const fieldErrors: Record<string, string> = {}
    
    // Try to parse field errors in format: "field: error message"
    error.response.data.errors.forEach((errorMessage: string) => {
      const match = errorMessage.match(/^([^:]+):\s*(.+)$/)
      if (match) {
        const [, field, message] = match
        fieldErrors[field.trim()] = message.trim()
      }
    })
    
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
  }
  
  // If we couldn't parse field errors, show a generic toast
  handleApiError(error)
}

/**
 * Validate required form fields
 * @param values Form values object
 * @param requiredFields Array of required field names
 * @returns Object with validation errors
 */
export const validateRequiredFields = (
  values: Record<string, any>,
  requiredFields: string[]
): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'This field is required'
    }
  })
  
  return errors
}