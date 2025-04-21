import { Request, Response, NextFunction } from 'express'
import { ApiError } from './error.middleware'

/**
 * Authorization middleware to check if user has the required role
 * @param roles Array of allowed roles
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists in request
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'))
    }

    // Check if user role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to access this resource'))
    }

    next()
  }
}

/**
 * Check if user has specific permissions
 * @param permissions Array of required permissions
 */
export const checkPermissions = (permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user exists in request
      if (!req.user) {
        return next(new ApiError(401, 'Authentication required'))
      }

      // Admin has all permissions
      if (req.user.role === 'admin') {
        return next()
      }

      // Check if user has required permissions
      // This would typically involve a database query to check user's role permissions
      // For now, we're using a simple approach just checking the role
      const hasPermission = await userHasPermissions(req.user.id, permissions)
      
      if (!hasPermission) {
        return next(new ApiError(403, 'You do not have the required permissions'))
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

/**
 * Check if a user has specific permissions
 * @param userId User ID
 * @param requiredPermissions Array of required permissions
 * @returns Boolean indicating if user has all required permissions
 */
const userHasPermissions = async (userId: string, requiredPermissions: string[]): Promise<boolean> => {
  // In a real implementation, this would query the database to check user permissions
  // For now, we're returning true as a placeholder
  // This should be properly implemented with your database
  
  return true
}

/**
 * Check if user is the owner of a resource
 * @param getResourceOwner Function to get resource owner ID
 */
export const checkOwnership = (
  getResourceOwner: (req: Request) => Promise<string | null>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user exists in request
      if (!req.user) {
        return next(new ApiError(401, 'Authentication required'))
      }

      // Admin can access any resource
      if (req.user.role === 'admin') {
        return next()
      }

      // Get resource owner
      const ownerId = await getResourceOwner(req)

      // Check if resource exists
      if (ownerId === null) {
        return next(new ApiError(404, 'Resource not found'))
      }

      // Check if user is owner
      if (req.user.id !== ownerId) {
        return next(new ApiError(403, 'You do not have permission to access this resource'))
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
