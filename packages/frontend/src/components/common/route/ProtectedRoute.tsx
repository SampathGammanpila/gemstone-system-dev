import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  roles?: string[]
}

/**
 * Protected route that requires authentication
 * Optional roles parameter to restrict access to specific user roles
 */
const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()
  
  // Show loading state if still checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the current location to redirect back after login
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />
  }
  
  // Check role-based access if roles are specified
  if (roles && roles.length > 0 && user) {
    const hasRequiredRole = roles.includes(user.role)
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page if user doesn't have required role
      return <Navigate to="/unauthorized" replace />
    }
  }
  
  // Render children if authenticated and authorized
  return <>{children}</>
}

export default ProtectedRoute