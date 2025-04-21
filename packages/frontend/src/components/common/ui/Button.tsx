import React, { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isLoading?: boolean
  loadingText?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  isLoading = false,
  loadingText,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-lg'
  }
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 border border-transparent',
    secondary: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 focus:ring-secondary-500 border border-transparent',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 border border-transparent',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 border border-transparent',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 border border-transparent',
    outline: 'bg-transparent hover:bg-secondary-50 text-secondary-700 border border-secondary-300 focus:ring-secondary-500',
    ghost: 'bg-transparent hover:bg-secondary-50 text-secondary-700 border border-transparent focus:ring-secondary-500'
  }
  
  // Disabled state
  const disabledClasses = 'opacity-60 cursor-not-allowed'
  
  // Full width
  const fullWidthClass = fullWidth ? 'w-full' : ''
  
  // Compose classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${(disabled || isLoading) ? disabledClasses : ''}
    ${fullWidthClass}
    ${className}
  `

  // Loading spinner
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {isLoading ? loadingText || children : children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  )
}

export default Button