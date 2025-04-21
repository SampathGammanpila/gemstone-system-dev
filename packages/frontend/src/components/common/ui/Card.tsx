import React, { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
  headerClassName?: string
  bodyClassName?: string
  footerClassName?: string
  footer?: ReactNode
  flat?: boolean
  bordered?: boolean
  hoverable?: boolean
  bodyPadding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  flat = false,
  bordered = false,
  hoverable = false,
  bodyPadding = 'md'
}) => {
  // Base card classes
  const baseCardClasses = `
    bg-white rounded-lg 
    ${flat ? '' : 'shadow-md'} 
    ${bordered ? 'border border-secondary-200' : ''} 
    ${hoverable ? 'transition-shadow hover:shadow-lg' : ''}
    ${className}
  `

  // Body padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6'
  }

  // Determine if we have a header
  const hasHeader = title || subtitle

  return (
    <div className={baseCardClasses}>
      {hasHeader && (
        <div className={`border-b border-secondary-200 px-5 py-4 ${headerClassName}`}>
          {title && <h3 className="text-lg font-medium text-secondary-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-secondary-500">{subtitle}</p>}
        </div>
      )}
      <div className={`${paddingClasses[bodyPadding]} ${bodyClassName}`}>
        {children}
      </div>
      {footer && (
        <div className={`border-t border-secondary-200 px-5 py-4 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card