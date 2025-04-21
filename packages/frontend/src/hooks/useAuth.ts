import { useContext } from 'react'
import AuthContext from '../contexts/AuthContext'
import { handleApiError } from '../utils/errorHandling'

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return {
    // Auth state
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    error: context.error,
    
    // Auth actions
    login: context.login,
    register: context.register,
    logout: context.logout,
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