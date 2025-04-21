import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { ApiError } from '../middlewares/error.middleware'
import { authConfig } from '@/config/auth'
import db from '@/db'
import logger from '@/utils/logger'
import { generateToken, verifyToken } from '@/utils/jwtHelper'

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  
  // Check if user already exists
  const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email])
  
  if (existingUser.rows.length > 0) {
    throw new ApiError(400, 'Email is already registered')
  }
  
  // Hash password
  const salt = await bcrypt.genSalt(authConfig.password.saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)
  
  // Create verification token
  const verificationToken = uuidv4()
  
  // Create user
  const result = await db.query(
    `INSERT INTO users (id, name, email, password_hash, role, verification_token, is_verified)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, email, role, is_verified, created_at`,
    [uuidv4(), name, email, hashedPassword, 'user', verificationToken, false]
  )
  
  const user = result.rows[0]
  
  // Generate JWT
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  })
  
  // TODO: Send verification email with token
  logger.info(`Verification email would be sent to ${email} with token ${verificationToken}`)
  
  // Return user data and token
  res.status(201).json({
    status: 'success',
    message: 'User registered successfully. Please check your email to verify your account.',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.is_verified,
        createdAt: user.created_at
      },
      token
    }
  })
}

/**
 * Register a new professional user
 * @route POST /api/auth/register/professional
 */
export const registerProfessional = async (req: Request, res: Response) => {
  const { name, email, password, professionalType, company, phone } = req.body
  
  // Check if user already exists
  const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email])
  
  if (existingUser.rows.length > 0) {
    throw new ApiError(400, 'Email is already registered')
  }
  
  // Hash password
  const salt = await bcrypt.genSalt(authConfig.password.saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)
  
  // Create verification token
  const verificationToken = uuidv4()
  
  // Create user with professional role
  const userId = uuidv4()
  const userResult = await db.query(
    `INSERT INTO users (id, name, email, password_hash, role, verification_token, is_verified)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, email, role, is_verified, created_at`,
    [userId, name, email, hashedPassword, professionalType, verificationToken, false]
  )
  
  // Create professional profile
  await db.query(
    `INSERT INTO professionals (id, user_id, type, company, phone, is_verified, verification_status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [uuidv4(), userId, professionalType, company || null, phone, false, 'pending']
  )
  
  const user = userResult.rows[0]
  
  // Generate JWT
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  })
  
  // TODO: Send verification email with token
  logger.info(`Verification email would be sent to ${email} with token ${verificationToken}`)
  
  // Return user data and token
  res.status(201).json({
    status: 'success',
    message: 'Professional account registered. Please check your email to verify your account and submit verification documents.',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        professionalType
      },
      token
    }
  })
}

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  
  // Find user by email
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )
  
  const user = result.rows[0]
  
  // Check if user exists and password is correct
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new ApiError(401, 'Invalid email or password')
  }
  
  // Generate JWT
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  })
  
  // Set cookie if in production
  if (process.env.NODE_ENV === 'production') {
    res.cookie('token', token, authConfig.cookie)
  }
  
  // Return user data and token
  res.json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.is_verified
      },
      token
    }
  })
}

/**
 * Get current user
 * @route GET /api/auth/me
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  // User is already attached to request by authentication middleware
  const userId = req.user?.id
  
  if (!userId) {
    throw new ApiError(401, 'Not authenticated')
  }
  
  // Get user from database with latest information
  const result = await db.query(
    'SELECT id, name, email, role, is_verified, created_at, updated_at FROM users WHERE id = $1',
    [userId]
  )
  
  const user = result.rows[0]
  
  if (!user) {
    throw new ApiError(404, 'User not found')
  }
  
  // Return user data
  res.json({
    status: 'success',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.is_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }
  })
}

/**
 * Request password reset
 * @route POST /api/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body
  
  // Find user by email
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )
  
  const user = result.rows[0]
  
  // Don't reveal if user exists or not for security
  if (!user) {
    logger.info(`Password reset requested for non-existent email: ${email}`)
    
    return res.json({
      status: 'success',
      message: 'If your email is registered, you will receive password reset instructions.'
    })
  }
  
  // Generate reset token
  const resetToken = uuidv4()
  const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60) // 1 hour
  
  // Save reset token to database
  await db.query(
    'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
    [resetToken, resetTokenExpiry, user.id]
  )
  
  // TODO: Send password reset email with token
  logger.info(`Password reset email would be sent to ${email} with token ${resetToken}`)
  
  // Return success message
  res.json({
    status: 'success',
    message: 'If your email is registered, you will receive password reset instructions.'
  })
}

/**
 * Reset password with token
 * @route POST /api/auth/reset-password
 */
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body
  
  // Find user by reset token
  const result = await db.query(
    'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > $2',
    [token, new Date()]
  )
  
  const user = result.rows[0]
  
  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token')
  }
  
  // Hash new password
  const salt = await bcrypt.genSalt(authConfig.password.saltRounds)
  const hashedPassword = await bcrypt.hash(newPassword, salt)
  
  // Update password and clear reset token
  await db.query(
    'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = NOW() WHERE id = $2',
    [hashedPassword, user.id]
  )
  
  // Return success message
  res.json({
    status: 'success',
    message: 'Password has been reset successfully. You can now log in with your new password.'
  })
}

/**
 * Logout user
 * @route POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response) => {
  // Clear authentication cookie if it exists
  if (req.cookies.token) {
    res.clearCookie('token')
  }
  
  if (req.cookies.refreshToken) {
    res.clearCookie('refreshToken')
  }
  
  // Return success message
  res.json({
    status: 'success',
    message: 'Logged out successfully'
  })
}

/**
 * Verify email with token
 * @route POST /api/auth/verify-email
 */
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body
  
  // Find user by verification token
  const result = await db.query(
    'SELECT * FROM users WHERE verification_token = $1',
    [token]
  )
  
  const user = result.rows[0]
  
  if (!user) {
    throw new ApiError(400, 'Invalid verification token')
  }
  
  // Update user to verified
  await db.query(
    'UPDATE users SET is_verified = TRUE, verification_token = NULL, updated_at = NOW() WHERE id = $1',
    [user.id]
  )
  
  // Return success message
  res.json({
    status: 'success',
    message: 'Email verified successfully. You can now log in.'
  })
}

/**
 * Refresh token
 * @route POST /api/auth/refresh-token
 */
export const refreshToken = async (req: Request, res: Response) => {
  // Get refresh token from cookies or request body
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken
  
  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required')
  }
  
  try {
    // Verify refresh token
    const decoded = verifyToken(refreshToken)
    
    // Get user
    const result = await db.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.id]
    )
    
    const user = result.rows[0]
    
    if (!user) {
      throw new ApiError(401, 'Invalid refresh token')
    }
    
    // Generate new access token
    const newToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    })
    
    // Return new token
    res.json({
      status: 'success',
      data: {
        token: newToken
      }
    })
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token')
  }
}

/**
 * Change password (authenticated)
 * @route POST /api/auth/change-password
 */
export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body
  const userId = req.user?.id
  
  if (!userId) {
    throw new ApiError(401, 'Not authenticated')
  }
  
  // Get user from database
  const result = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  )
  
  const user = result.rows[0]
  
  if (!user) {
    throw new ApiError(404, 'User not found')
  }
  
  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash)
  
  if (!isPasswordValid) {
    throw new ApiError(400, 'Current password is incorrect')
  }
  
  // Hash new password
  const salt = await bcrypt.genSalt(authConfig.password.saltRounds)
  const hashedPassword = await bcrypt.hash(newPassword, salt)
  
  // Update password and clear reset token
  await db.query(
    'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = NOW() WHERE id = $2',
    [hashedPassword, user.id]
  )
  
  // Return success message
  res.json({
    status: 'success',
    message: 'Password has been reset successfully. You can now log in with your new password.'
  })
}