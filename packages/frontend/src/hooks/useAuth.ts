import { useContext, useCallback } from 'react'
import AuthContext from '@/contexts/AuthContext'
import { handleApiError } from '@/utils/errorHandling'

// Custom hook to use the authentication context
const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  // Wrap login with error handling
  const safeLogin = useCallback(
    async (email: string, password: string) => {
      try {
        await context.login(email, password)
        return true
      } catch (error) {
        handleApiError(error, 'Login failed. Please check your credentials.')
        return false
      }
    },
    [context.login]
  )
  
  // Wrap register with error handling
  const safeRegister = useCallback(
    async (userData: { name: string; email: string; password: string }) => {
      try {
        await context.register(userData)
        return true
      } catch (error) {
        handleApiError(error, 'Registration failed. Please try again.')
        return false
      }
    },
    [context.register]
  )
  
  // Wrap logout with error handling
  const safeLogout = useCallback(() => {
    try {
      context.logout()
      return true
    } catch (error) {
      handleApiError(error, 'Logout failed.')
      return false
    }
  }, [context.logout])
  
  return {
    // Auth state
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    error: context.error,
    
    // Auth actions with error handling
    login: safeLogin,
    register: safeRegister,
    logout: safeLogout,
    clearError: context.clearError,
    updateUser: context.updateUser,
    
    // Helper methods for role checks
    isAdmin: context.user?.role === 'admin',
    isDealer: context.user?.role === 'dealer',
    isCutter: context.user?.role === 'cutter',
    isAppraiser: context.user?.role === 'appraiser',
    isProfessional: ['dealer', 'cutter', 'appraiser'].includes(context.user?.role || ''),
  }
}

export default useAuth