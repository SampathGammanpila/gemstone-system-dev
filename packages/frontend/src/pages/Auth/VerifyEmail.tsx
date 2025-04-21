import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '@/components/common/ui/Button'
import { authService } from '@/services/api/auth.service'
import { handleApiError } from '@/utils/errorHandling'
import useToast from '@/hooks/useToast'

enum VerificationStatus {
  VERIFYING = 'verifying',
  SUCCESS = 'success',
  ERROR = 'error',
}

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const { success } = useToast()
  
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.VERIFYING)
  const [error, setError] = useState<string>('')
  
  useEffect(() => {
    // Set document title
    document.title = 'Verify Email | Gemstone System'
    
    const verifyEmailToken = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setStatus(VerificationStatus.ERROR)
        setError('Invalid verification link. The token is missing.')
        return
      }
      
      try {
        await authService.verifyEmail(token)
        setStatus(VerificationStatus.SUCCESS)
        success('Email verified successfully!')
      } catch (error) {
        setStatus(VerificationStatus.ERROR)
        setError(
          error instanceof Error 
            ? error.message 
            : 'Invalid or expired verification token. Please request a new verification email.'
        )
      }
    }
    
    verifyEmailToken()
  }, [searchParams, success])
  
  // Resend verification email
  const handleResendVerification = async () => {
    const email = searchParams.get('email')
    
    if (!email) {
      setError('Email address is missing. Please try to login and request a new verification email.')
      return
    }
    
    try {
      await authService.resendVerificationEmail(email)
      success('Verification email has been sent!')
    } catch (error) {
      handleApiError(error, 'Failed to resend verification email')
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gemstone System</h1>
          <p className="text-gray-600 dark:text-gray-400">Email Verification</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          {status === VerificationStatus.VERIFYING && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">Verifying Your Email</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Please wait while we verify your email address...
              </p>
            </div>
          )}
          
          {status === VerificationStatus.SUCCESS && (
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
              
              <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">Email Verified</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Thank you! Your email has been successfully verified.
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                You can now access all features of your Gemstone System account.
              </p>
              
              <div className="mt-6">
                <Link to="/login">
                  <Button variant="primary">
                    Go to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
          
          {status === VerificationStatus.ERROR && (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              
              <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">Verification Failed</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {error}
              </p>
              
              <div className="mt-6 space-y-3">
                <Button
                  variant="primary"
                  onClick={handleResendVerification}
                >
                  Resend Verification Email
                </Button>
                
                <div>
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
