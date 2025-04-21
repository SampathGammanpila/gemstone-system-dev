import { useContext, useEffect } from 'react'
import ToastContext, { ToastType } from '../contexts/ToastContext'
import { toastService } from '../services/notifications/toast.service'

// Custom hook to use the toast context
const useToast = () => {
  const context = useContext(ToastContext)
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  
  // Initialize the toast service with context functions
  useEffect(() => {
    toastService.initialize(
      context.addToast,
      context.removeToast,
      context.clearToasts
    )
  }, [context.addToast, context.removeToast, context.clearToasts])
  
  // Helper functions with the same API as the toast service
  const showToast = (message: string, type: ToastType, duration?: number) => {
    context.addToast(message, type, duration)
  }
  
  const success = (message: string, duration?: number) => {
    context.addToast(message, 'success', duration)
  }
  
  const error = (message: string, duration?: number) => {
    context.addToast(message, 'error', duration)
  }
  
  const warning = (message: string, duration?: number) => {
    context.addToast(message, 'warning', duration)
  }
  
  const info = (message: string, duration?: number) => {
    context.addToast(message, 'info', duration)
  }
  
  return {
    ...context,
    showToast,
    success,
    error,
    warning,
    info,
  }
}

export default useToast