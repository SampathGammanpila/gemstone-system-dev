import { useState, FormEvent, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Input from '@/components/common/ui/Input'
import Button from '@/components/common/ui/Button'
import { authService } from '@/services/api/auth.service'
import { handleApiError } from '@/utils/errorHandling'
import useToast from '@/hooks/useToast'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState<string | undefined>()
  const { success } = useToast()
  
  useEffect(() => {
    // Set document title
    document.title = 'Forgot Password | Gemstone System'
  }, [])
  
  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required')
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid')
      return false
    }
    
    setEmailError(undefined)
    return true
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail()) return
    
    setIsLoading(true)
    
    try {
      await authService.forgotPassword(email)
      setEmailSent(true)
      success('Password reset link sent to your email')
    } catch (error) {
      handleApiError(error, 'Failed to send password reset email')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gemstone System</h1>
          <p className="text-gray-600 dark:text-gray-400">Reset your password</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          {!emailSent ? (
            <>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Forgot Password</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                
                <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">Check Your Email</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Please check your email and follow the instructions to reset your password.
                </p>
                
                <Button 
                  variant="outline"
                  className="mt-6"
                  onClick={() => setEmailSent(false)}
                >
                  Back to Forgot Password
                </Button>
              </div>
            </>
          )}
          
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
