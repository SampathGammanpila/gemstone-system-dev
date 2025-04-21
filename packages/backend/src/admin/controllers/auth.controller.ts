import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ApiError } from '@/api/middlewares/error.middleware'
import db from '@/db'
import { authConfig } from '@/config/auth'
import { generateToken, verifyToken } from '@/utils/jwtHelper'

/**
 * Render admin login page
 * @route GET /admin/auth/login
 */
export const loginPage = async (req: Request, res: Response) => {
  // Check if already logged in
  const token = req.cookies?.adminToken
  if (token) {
    try {
      verifyToken(token)
      return res.redirect('/admin/dashboard')
    } catch (error) {
      // Token invalid, continue to login page
    }
  }
  
  res.render('auth/login', {
    title: 'Admin Login',
    error: req.query.error || null,
    success: req.query.success || null
  })
}

/**
 * Process admin login
 * @route POST /admin/auth/login
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  
  try {
    // Find user by email and role
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1 AND role = $2',
      [email, 'admin']
    )
    
    const user = result.rows[0]
    
    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.redirect('/admin/auth/login?error=Invalid credentials')
    }
    
    // Generate JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    })
    
    // Set cookie
    res.cookie('adminToken', token, {
      ...authConfig.cookie,
      path: '/admin', // Only accessible from admin routes
    })
    
    // Redirect to dashboard
    res.redirect('/admin/dashboard')
  } catch (error) {
    res.redirect('/admin/auth/login?error=An error occurred. Please try again.')
  }
}

/**
 * Process admin logout
 * @route GET /admin/auth/logout
 */
export const logout = async (req: Request, res: Response) => {
  // Clear admin token cookie
  res.clearCookie('adminToken', {
    path: '/admin',
  })
  
  // Redirect to login page
  res.redirect('/admin/auth/login?success=Successfully logged out')
}

/**
 * Render change password page
 * @route GET /admin/auth/change-password
 */
export const changePasswordPage = async (req: Request, res: Response) => {
  // Check if logged in
  const token = req.cookies?.adminToken
  if (!token) {
    return res.redirect('/admin/auth/login?error=Please log in to change your password')
  }
  
  try {
    // Verify token
    const decoded = verifyToken(token)
    
    res.render('auth/change-password', {
      title: 'Change Password',
      userId: decoded.id,
      error: req.query.error || null,
      success: req.query.success || null
    })
  } catch (error) {
    res.redirect('/admin/auth/login?error=Session expired. Please log in again.')
  }
}

/**
 * Process change password
 * @route POST /admin/auth/change-password
 */
export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword, confirmPassword } = req.body
  
  // Check if logged in
  const token = req.cookies?.adminToken
  if (!token) {
    return res.redirect('/admin/auth/login?error=Please log in to change your password')
  }
  
  try {
    // Verify token
    const decoded = verifyToken(token)
    const userId = decoded.id
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      return res.redirect('/admin/auth/change-password?error=New passwords do not match')
    }
    
    if (newPassword.length < authConfig.password.minLength) {
      return res.redirect(`/admin/auth/change-password?error=Password must be at least ${authConfig.password.minLength} characters`)
    }
    
    // Get user from database
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1 AND role = $2',
      [userId, 'admin']
    )
    
    const user = result.rows[0]
    
    if (!user) {
      return res.redirect('/admin/auth/login?error=User not found')
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash)
    
    if (!isPasswordValid) {
      return res.redirect('/admin/auth/change-password?error=Current password is incorrect')
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(authConfig.password.saltRounds)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    
    // Update password
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    )
    
    // Redirect with success message
    res.redirect('/admin/auth/change-password?success=Password changed successfully')
  } catch (error) {
    res.redirect('/admin/auth/login?error=Session expired. Please log in again.')
  }
}