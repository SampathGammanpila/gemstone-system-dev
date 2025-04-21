import { useState, FormEvent, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Input from '@/components/common/ui/Input'
import Button from '@/components/common/ui/Button'
import { authService } from '@/services/api/auth.service'
import { handleApiError } from '@/utils/errorHandling'
import useToast from '@/hooks/useToast'

interface FormErrors {
  newPassword?: string
  confirmPassword?: string
}

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { success } = useToast()
  
  const [token, setToken] = useState<string>('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  
  // Get token from URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    }
    
    // Set document title
    document.title = 'Reset Password | Gemstone System'
  }, [searchParams])
  
  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    let isValid = true
    
    if (!newPassword) {
      errors.newPassword = 'Password is required'
      isValid = false
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters'
      isValid = false
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
      isValid = false
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
      isValid = false
    }
    
    setFormErrors(errors)
    return isValid
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      await authService.resetPassword(token, newPassword)
      setResetSuccess(true)
      success('Password has been reset successfully')
    } catch (error) {
      handleApiError(error, 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Redirect to login after successful reset
  const handleGoToLogin = () => {
    navigate('/login')
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gemstone System</h1>
          <p className="text-gray-600 dark:text-gray-400">Set a new password</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          {!token ? (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              
              <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">Invalid Reset Link</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                The password reset link is invalid or has expired.
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Please request a new password reset link.
              </p>
              
              <Link to="/forgot-password">
                <Button variant="primary" className="mt-6">
                  Request New Reset Link
                </Button>
              </Link>
            </div>
          ) : !resetSuccess ? (
            <>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Reset Your Password</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Enter a new password for your account.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Input
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={formErrors.newPassword}
                    placeholder="Enter new password"
                    required
                  />
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Password must be at least 8 characters
                  </div>
                </div>
                
                <div className="mb-6">
                  <Input
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={formErrors.confirmPassword}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Reset Password
                </Button>
              </form>
            </>
          ) : (
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
              
              <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">Password Reset Complete</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Your password has been reset successfully.
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                You can now log in with your new password.
              </p>
              
              <Button
                variant="primary"
                className="mt-6"
                onClick={handleGoToLogin}
              >
                Go to Login
              </Button>
            </div>
          )}
          
          {!resetSuccess && (
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
