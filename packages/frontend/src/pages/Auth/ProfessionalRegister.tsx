import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import ProfessionalRegisterForm from '@/components/auth/ProfessionalRegisterForm'

const ProfessionalRegister = () => {
  const { isAuthenticated } = useAuth()
  
  useEffect(() => {
    // Set document title
    document.title = 'Professional Registration | Gemstone System'
  }, [])
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gemstone System</h1>
          <p className="text-gray-600 dark:text-gray-400">Professional Registration</p>
        </div>
        
        <ProfessionalRegisterForm />
      </div>
    </div>
  )
}

export default ProfessionalRegister
