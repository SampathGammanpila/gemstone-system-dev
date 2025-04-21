import Joi from 'joi'
import { authConfig } from '../../config/auth'

/**
 * Validator for updating user profile
 */
export const updateProfileValidator = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100)
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
      }),
    email: Joi.string().email()
      .messages({
        'string.email': 'Please provide a valid email address',
      }),
  }).required(),
  query: Joi.object({}),
  params: Joi.object({}),
})

/**
 * Validator for changing password
 */
export const changePasswordValidator = Joi.object({
  body: Joi.object({
    currentPassword: Joi.string().required()
      .messages({
        'string.empty': 'Current password is required',
      }),
    newPassword: Joi.string().required().min(authConfig.password.minLength)
      .messages({
        'string.empty': 'New password is required',
        'string.min': `Password must be at least ${authConfig.password.minLength} characters long`,
      }),
    confirmPassword: Joi.string().required().valid(Joi.ref('newPassword'))
      .messages({
        'string.empty': 'Please confirm your password',
        'any.only': 'Passwords do not match',
      }),
  }).required(),
  query: Joi.object({}),
  params: Joi.object({}),
})

/**
 * Validator for creating a user
 */
export const createUserValidator = Joi.object({
  body: Joi.object({
    name: Joi.string().required().min(2).max(100)
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
      }),
    email: Joi.string().required().email()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
      }),
    password: Joi.string().required().min(authConfig.password.minLength)
      .messages({
        'string.empty': 'Password is required',
        'string.min': `Password must be at least ${authConfig.password.minLength} characters long`,
      }),
    role: Joi.string().valid('user', 'admin', 'dealer', 'cutter', 'appraiser')
      .default('user')
      .messages({
        'any.only': 'Role must be one of: user, admin, dealer, cutter, appraiser',
      }),
  }).required(),
  query: Joi.object({}),
  params: Joi.object({}),
})

/**
 * Validator for updating a user
 */
export const updateUserValidator = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100)
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
      }),
    email: Joi.string().email()
      .messages({
        'string.email': 'Please provide a valid email address',
      }),
    role: Joi.string().valid('user', 'admin', 'dealer', 'cutter', 'appraiser')
      .messages({
        'any.only': 'Role must be one of: user, admin, dealer, cutter, appraiser',
      }),
  }).required(),
  query: Joi.object({}),
  params: Joi.object({
    id: Joi.string().required()
      .messages({
        'string.empty': 'User ID is required',
      }),
  }).required(),
})

/**
 * Validator for user search
 */
export const searchUserValidator = Joi.object({
  body: Joi.object({}),
  query: Joi.object({
    q: Joi.string().required()
      .messages({
        'string.empty': 'Search query is required',
      }),
    limit: Joi.number().integer().min(1).max(100).default(10),
    offset: Joi.number().integer().min(0).default(0),
  }).required(),
  params: Joi.object({}),
})
