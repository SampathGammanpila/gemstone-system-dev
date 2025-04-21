import React, { InputHTMLAttributes, ReactNode, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  isRequired?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = '',
      isRequired = false,
      id,
      ...props
    },
    ref
  ) => {
    // Generate an id if not provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`

    // Base input classes
    const baseInputClasses = `
      block px-3 py-2 border rounded-md shadow-sm 
      placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
      disabled:bg-secondary-100 disabled:cursor-not-allowed
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon ? 'pr-10' : ''}
      ${error ? 'border-danger-500' : 'border-secondary-300'}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `

    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-secondary-700 mb-1"
          >
            {label}
            {isRequired && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={baseInputClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={`${inputId}-error ${inputId}-helper`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-secondary-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-danger-600"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-secondary-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input