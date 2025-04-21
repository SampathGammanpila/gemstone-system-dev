import React from 'react'

interface ValidationErrorProps {
  error?: string
  id?: string
  className?: string
}

const ValidationError: React.FC<ValidationErrorProps> = ({ 
  error, 
  id,
  className = '' 
}) => {
  if (!error) return null

  return (
    <p 
      id={id} 
      className={`mt-1 text-sm text-danger-600 ${className}`}
      role="alert"
    >
      {error}
    </p>
  )
}

export default ValidationError