/**
 * Authentication service
 */
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { authConfig } from '../config/auth'
import db from '../db'
import { ApiError } from '../api/middlewares/error.middleware'
import { handleDatabaseError } from '../utils/errorHandler'
import { emailService } from './email.service'
import { generateToken } from '../utils/jwtHelper'

/**
 * Register a new user
 * @param name User's name
 * @param email User's email
 * @param password Plain text password
 */
export const register = async (
  name: string,
  email: string,
  password: string,
  role = 'user'
) => {
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(
      password,
      authConfig.password.saltRounds
    )

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Create the user
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role, verification_token)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, is_verified`,
      [name, email, passwordHash, role, verificationToken]
    )

    const user = result.rows[0]

    // Send verification email
    await emailService.sendVerificationEmail(email, verificationToken)

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    })

    return { user, token }
  } catch (error) {
    // Handle database errors
    throw handleDatabaseError(error)
  }
}

/**
 * Register a professional user
 * @param userData Professional user data
 */
export const registerProfessional = async (userData: {
  name: string
  email: string
  password: string
  professionalType: string
  company?: string
  phone: string
}) => {
  const { name, email, password, professionalType, company, phone } = userData

  // Start a transaction
  const client = await db.getClient()

  try {
    await client.query('BEGIN')

    // Register the user with the professional role
    const { user, token } = await register(name, email, password, professionalType)

    // Create professional profile
    await client.query(
      `INSERT INTO professional_profiles 
       (user_id, professional_type, company_name, phone, verification_status)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, professionalType, company || null, phone, 'pending']
    )

    await client.query('COMMIT')

    return { user, token }
  } catch (error) {
    await client.query('ROLLBACK')
    throw handleDatabaseError(error)
  } finally {
    client.release()
  }
}

/**
 * Login a user
 * @param email User's email
 * @param password Plain text password
 */
export const login = async (email: string, password: string) => {
  try {
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

    // Update last login timestamp
    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    )

    // Generate JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.is_verified
      },
      token
    }
  } catch (error) {
    // Handle database errors
    throw error instanceof ApiError ? error : handleDatabaseError(error)
  }
}

/**
 * Verify a user's email
 * @param token Verification token
 */
export const verifyEmail = async (token: string) => {
  try {
    // Find user by verification token
    const result = await db.query(
      `UPDATE users 
       SET is_verified = TRUE, verification_token = NULL 
       WHERE verification_token = $1
       RETURNING id, name, email, role`,
      [token]
    )

    if (result.rowCount === 0) {
      throw new ApiError(400, 'Invalid or expired verification token')
    }

    return result.rows[0]
  } catch (error) {
    // Handle database errors
    throw error instanceof ApiError ? error : handleDatabaseError(error)
  }
}

/**
 * Request a password reset
 * @param email User's email
 */
export const forgotPassword = async (email: string) => {
  try {
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 3600000) // 1 hour

    // Update user with reset token
    const result = await db.query(
      `UPDATE users 
       SET reset_token = $1, reset_token_expires = $2 
       WHERE email = $3
       RETURNING id`,
      [resetToken, resetTokenExpires, email]
    )

    if (result.rowCount === 0) {
      // Don't reveal user existence, just return success
      return { success: true }
    }

    // Send password reset email
    await emailService.sendPasswordResetEmail(email, resetToken)

    return { success: true }
  } catch (error) {
    // Handle database errors
    throw handleDatabaseError(error)
  }
}

/**
 * Reset a user's password using a token
 * @param token Reset token
 * @param newPassword New password
 */
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    // Find user by reset token
    const userResult = await db.query(
      `SELECT id FROM users 
       WHERE reset_token = $1 AND reset_token_expires > NOW()`,
      [token]
    )

    if (userResult.rowCount === 0) {
      throw new ApiError(400, 'Invalid or expired reset token')
    }

    const userId = userResult.rows[0].id

    // Hash the new password
    const passwordHash = await bcrypt.hash(
      newPassword,
      authConfig.password.saltRounds
    )

    // Update user's password
    await db.query(
      `UPDATE users 
       SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL 
       WHERE id = $2`,
      [passwordHash, userId]
    )

    return { success: true }
  } catch (error) {
    // Handle database errors
    throw error instanceof ApiError ? error : handleDatabaseError(error)
  }
}

/**
 * Change a user's password
 * @param userId User ID
 * @param currentPassword Current password
 * @param newPassword New password
 */
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  try {
    // Get current password hash
    const result = await db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    )

    if (result.rowCount === 0) {
      throw new ApiError(404, 'User not found')
    }

    const user = result.rows[0]

    // Verify current password
    if (!(await bcrypt.compare(currentPassword, user.password_hash))) {
      throw new ApiError(400, 'Current password is incorrect')
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(
      newPassword,
      authConfig.password.saltRounds
    )

    // Update password
    await db.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, userId]
    )

    return { success: true }
  } catch (error) {
    // Handle database errors
    throw error instanceof ApiError ? error : handleDatabaseError(error)
  }
}

/**
 * Get a user by ID
 * @param userId User ID
 */
export const getUserById = async (userId: string) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, role, is_verified, created_at, last_login 
       FROM users WHERE id = $1`,
      [userId]
    )

    if (result.rowCount === 0) {
      throw new ApiError(404, 'User not found')
    }

    return result.rows[0]
  } catch (error) {
    // Handle database errors
    throw error instanceof ApiError ? error : handleDatabaseError(error)
  }
}
