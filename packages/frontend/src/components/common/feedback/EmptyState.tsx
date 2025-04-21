import React, { ReactNode } from 'react'
import Button from '../ui/Button'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  actionText?: string
  onAction?: () => void
  secondaryActionText?: string
  onSecondaryAction?: () => void
  className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = '',
}) => {
  // Default icon if none provided
  const defaultIcon = (
    <svg 
      className="w-12 h-12 text-secondary-400" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
      />
    </svg>
  )

  return (
    <div className={`rounded-lg border-2 border-dashed border-secondary-300 p-8 text-center ${className}`}>
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4">
          {icon || defaultIcon}
        </div>
        
        <h3 className="text-lg font-medium text-secondary-900 mb-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-secondary-500 max-w-md mb-6">
            {description}
          </p>
        )}
        
        {(actionText || secondaryActionText) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {actionText && onAction && (
              <Button onClick={onAction}>{actionText}</Button>
            )}
            
            {secondaryActionText && onSecondaryAction && (
              <Button variant="outline" onClick={onSecondaryAction}>
                {secondaryActionText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmptyState