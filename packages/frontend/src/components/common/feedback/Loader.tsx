import React from 'react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'white'
  className?: string
  fullScreen?: boolean
  text?: string
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  fullScreen = false,
  text,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  // Color classes for the spinner
  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
  }

  // Spinner component
  const Spinner = () => (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      data-testid="loader-spinner"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )

  // If full screen, show a centered loader with overlay
  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-secondary-900 bg-opacity-50 z-50"
        data-testid="loader-fullscreen"
      >
        <div className="text-center p-4 bg-white rounded-lg shadow-lg">
          <Spinner />
          {text && <p className="mt-2 text-secondary-700">{text}</p>}
        </div>
      </div>
    )
  }

  // If text is provided, show a centered spinner with text
  if (text) {
    return (
      <div className="flex flex-col items-center justify-center p-4" data-testid="loader-with-text">
        <Spinner />
        <p className="mt-2 text-secondary-700">{text}</p>
      </div>
    )
  }

  // Just the spinner
  return <Spinner />
}

export default Loader