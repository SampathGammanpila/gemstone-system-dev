import Joi from 'joi'
import { authConfig } from '../../config/auth'

/**
 * Validator for user registration
 */
export const registerValidator = Joi.object({
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
    confirmPassword: Joi.string().required().valid(Joi.ref('password'))
      .messages({
        'string.empty': 'Please confirm your password',
        'any.only': 'Passwords do not match',
      }),
  }).required(),
  query: Joi.object({}),
  params: Joi.object({}),
})

/**
 * Validator for professional registration
 */
export const registerProfessionalValidator = Joi.object({
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
    confirmPassword: Joi.string().required().valid(Joi.ref('password'))
      .messages({
        'string.empty': 'Please confirm your password',
        'any.only': 'Passwords do not match',
      }),
    professionalType: Joi.string().required().valid('dealer', 'cutter', 'appraiser')
      .messages({
        'string.empty': 'Professional type is required',
        'any.only': 'Professional type must be dealer, cutter, or appraiser',
      }),
    company: Joi.string().allow('').max(100),
    phone: Joi.string().required().pattern(/^\+?[0-9\s\-\(\)]+$/)
      .messages({
        'string.empty': 'Phone number is required',
        'string.pattern.base': 'Please provide a valid phone number',
      }),
  }).required(),
  query: Joi.object({}),
  params: Joi.object({}),
})

/**
 * Validator for user login
 */
export const loginValidator = Joi.object({
  body: Joi.object({
    email: Joi.string().required().email()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'Password is required',
      }),
  }).required(),
  query: Joi.object({}),
  params: Joi.object({}),
})

/**
 * Validator for forgot password request
 */
export const forgotPasswordValidator = Joi.object({
  body: Joi.object({
    email: Joi.string().required().email()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
      }),
  }).required(),
  query: Joi.object({}),
  params: Joi.object({}),
})

/**
 * Validator for reset password
 */
export const resetPasswordValidator = Joi.object({
  body: Joi.object({
    token: Joi.string().required()
      .messages({
        'string.empty': 'Reset token is required',
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
 * Validator for verify email
 */
export const verifyEmailValidator = Joi.object({
  body: Joi.object({
    token: Joi.string().required()
      .messages({
        'string.empty': 'Verification token is required',
      }),
  }).required(),
  query: Joi.object({}),
  params: Joi.object({}),
})

/**
 * Validator for change password
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