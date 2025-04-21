import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import RegisterForm from '@/components/auth/RegisterForm'

const Register = () => {
  const { isAuthenticated } = useAuth()
  
  useEffect(() => {
    // Set document title
    document.title = 'Register | Gemstone System'
  }, [])
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gemstone System</h1>
          <p className="text-gray-600 dark:text-gray-400">Create your account</p>
        </div>
        
        <RegisterForm />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you a gemstone professional?{' '}
            <a href="/professional-register" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Register as a professional
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
