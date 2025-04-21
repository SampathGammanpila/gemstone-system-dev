import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware'
import { authorize } from '../middlewares/role.middleware'
import { validate } from '../middlewares/validation.middleware'
import { asyncHandler } from '../middlewares/error.middleware'
import * as userController from '../controllers/user.controller'
import * as userValidator from '../validators/user.validator'

const router = Router()

// Get current user profile
router.get(
  '/profile',
  authenticate,
  asyncHandler(userController.getUserProfile)
)

// Update current user profile
router.put(
  '/profile',
  authenticate,
  validate(userValidator.updateProfileValidator),
  asyncHandler(userController.updateProfile)
)

// Change password (for current user)
router.post(
  '/change-password',
  authenticate,
  validate(userValidator.changePasswordValidator),
  asyncHandler(userController.changePassword)
)

// Create a new user (admin only)
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  validate(userValidator.createUserValidator),
  asyncHandler(userController.createUser)
)

// Get all users (admin only)
router.get(
  '/',
  authenticate,
  authorize(['admin']),
  asyncHandler(userController.getUsers)
)

// Get user by ID (admin only)
router.get(
  '/:id',
  authenticate,
  authorize(['admin']),
  asyncHandler(userController.getUserById)
)

// Update user (admin only)
router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  validate(userValidator.updateUserValidator),
  asyncHandler(userController.updateUser)
)

// Delete user (admin only)
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  asyncHandler(userController.deleteUser)
)

// Search users (admin only)
router.get(
  '/search',
  authenticate,
  authorize(['admin']),
  asyncHandler(userController.searchUsers)
)

export default router
