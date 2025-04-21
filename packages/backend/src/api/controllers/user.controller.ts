import { Request, Response } from 'express'
import * as userService from '../../services/user.service'
import * as authService from '../../services/auth.service'
import { ApiError } from '../middlewares/error.middleware'

/**
 * Get current user profile
 * @route GET /api/users/profile
 */
export const getUserProfile = async (req: Request, res: Response) => {
  // User ID is available from authentication middleware
  const userId = req.user?.id

  if (!userId) {
    throw new ApiError(401, 'Authentication required')
  }

  // Get user profile with details
  const userProfile = await userService.getUserProfile(userId)

  res.json({
    status: 'success',
    data: userProfile,
  })
}

/**
 * Update current user profile
 * @route PUT /api/users/profile
 */
export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id

  if (!userId) {
    throw new ApiError(401, 'Authentication required')
  }

  // Only allow certain fields to be updated
  const { name, email } = req.body
  const updatedUser = await userService.updateUser(userId, { name, email })

  res.json({
    status: 'success',
    message: 'Profile updated successfully',
    data: updatedUser,
  })
}

/**
 * Change current user password
 * @route POST /api/users/change-password
 */
export const changePassword = async (req: Request, res: Response) => {
  const userId = req.user?.id

  if (!userId) {
    throw new ApiError(401, 'Authentication required')
  }

  const { currentPassword, newPassword } = req.body
  await authService.changePassword(userId, currentPassword, newPassword)

  res.json({
    status: 'success',
    message: 'Password changed successfully',
  })
}

/**
 * Create a new user (admin only)
 * @route POST /api/users
 */
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role = 'user' } = req.body
  
  // Register user with specified role
  const result = await authService.register(name, email, password, role)

  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    },
  })
}

/**
 * Get all users with pagination (admin only)
 * @route GET /api/users
 */
export const getUsers = async (req: Request, res: Response) => {
  // Parse query parameters
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
  const offset = req.query.offset ? parseInt(req.query.offset as string) : 0
  const role = req.query.role as string | undefined

  const result = await userService.getUsers(limit, offset, role)

  res.json({
    status: 'success',
    data: result.users,
    meta: {
      total: result.total,
      limit: result.limit,
      offset: result.offset,
    },
  })
}

/**
 * Get user by ID (admin only)
 * @route GET /api/users/:id
 */
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = await userService.getUserById(id)

  res.json({
    status: 'success',
    data: user,
  })
}

/**
 * Update user (admin only)
 * @route PUT /api/users/:id
 */
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, email, role } = req.body

  // Get the current user to check if admin is trying to downgrade themselves
  if (role && req.user?.id === id && req.user?.role === 'admin' && role !== 'admin') {
    throw new ApiError(403, 'Admins cannot downgrade their own role')
  }

  // Update user profile
  const updatedUser = await userService.updateUser(id, { name, email })

  res.json({
    status: 'success',
    message: 'User updated successfully',
    data: updatedUser,
  })
}

/**
 * Delete user (admin only)
 * @route DELETE /api/users/:id
 */
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params

  // Prevent admin from deleting themselves
  if (req.user?.id === id) {
    throw new ApiError(403, 'You cannot delete your own account')
  }

  await userService.deleteUser(id)

  res.json({
    status: 'success',
    message: 'User deleted successfully',
  })
}

/**
 * Search users (admin only)
 * @route GET /api/users/search
 */
export const searchUsers = async (req: Request, res: Response) => {
  const query = req.query.q as string
  
  if (!query) {
    throw new ApiError(400, 'Search query is required')
  }
  
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
  const offset = req.query.offset ? parseInt(req.query.offset as string) : 0
  
  const result = await userService.searchUsers(query, limit, offset)
  
  res.json({
    status: 'success',
    data: result.users,
    meta: {
      total: result.total,
      limit: result.limit,
      offset: result.offset,
    },
  })
}
