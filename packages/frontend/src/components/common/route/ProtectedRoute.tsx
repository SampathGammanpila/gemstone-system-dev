import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import Loader from '../feedback/Loader'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string | string[]
}

/**
 * Protected route that requires authentication
 * Optional roles parameter to restrict access to specific user roles
 */
const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()
  
  // Show loading state if still checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" text="Loading..." />
      </div>
    )
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the current location to redirect back after login
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />
  }
  
  // Check role-based access if roles are specified
  if (requiredRole && user) {
    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.includes(user.role)
      : user.role === requiredRole
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page if user doesn't have required role
      return <Navigate to="/unauthorized" replace />
    }
  }
  
  // Render children if authenticated and authorized
  return <>{children}</>
}

export default ProtectedRoute