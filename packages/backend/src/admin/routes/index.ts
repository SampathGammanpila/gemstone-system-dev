import { Router } from 'express'
import authRoutes from './auth.routes'
import { notFoundHandler } from '@/api/middlewares/error.middleware'

const router = Router()

// Admin dashboard route
router.get('/', (req, res) => {
  // Redirect to login if not authenticated
  res.redirect('/admin/auth/login')
})

// Mount routes
router.use('/auth', authRoutes)
// TODO: Add other admin routes here
// router.use('/dashboard', dashboardRoutes)
// router.use('/users', userRoutes)
// router.use('/professionals', professionalRoutes)
// etc.

// Handle 404 for admin routes
router.use(notFoundHandler)

export default router