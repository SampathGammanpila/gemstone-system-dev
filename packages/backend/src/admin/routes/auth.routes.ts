import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { asyncHandler } from '@/api/middlewares/error.middleware'

const router = Router()

// Admin login page
router.get('/login', asyncHandler(authController.loginPage))

// Admin login action
router.post('/login', asyncHandler(authController.login))

// Admin logout action
router.get('/logout', asyncHandler(authController.logout))

// Admin change password page
router.get('/change-password', asyncHandler(authController.changePasswordPage))

// Admin change password action
router.post('/change-password', asyncHandler(authController.changePassword))

export default router