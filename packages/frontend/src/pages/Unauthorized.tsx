import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@/components/common/ui/Button'

const Unauthorized = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    // Set document title
    document.title = 'Unauthorized | Gemstone System'
  }, [])
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
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
          
          <h1 className="mt-4 text-3xl font-bold text-gray-800 dark:text-white">Unauthorized Access</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            variant="primary"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            Go Back
          </Button>
          
          <Link to="/dashboard">
            <Button variant="outline">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized 