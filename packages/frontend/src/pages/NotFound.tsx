import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/common/ui/Button'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-6">
          <svg
            className="w-24 h-24 text-primary-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-6xl font-bold text-secondary-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-secondary-800 mb-6">Page Not Found</h2>
        <p className="text-secondary-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/">
            <Button size="lg">
              Go to Homepage
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
        <div className="mt-12">
          <p className="text-secondary-500 text-sm">
            Looking for something specific? Try one of these pages:
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link to="/marketplace" className="text-primary-600 hover:text-primary-700 underline">
              Marketplace
            </Link>
            <Link to="/valuation" className="text-primary-600 hover:text-primary-700 underline">
              Valuation
            </Link>
            <Link to="/certificates" className="text-primary-600 hover:text-primary-700 underline">
              Certificates
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound