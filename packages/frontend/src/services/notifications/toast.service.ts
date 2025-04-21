import { ToastType } from '@/contexts/ToastContext'

// This is a wrapper service for the toast context
// It provides a stable API that can be used anywhere in the app
// Without needing to access the context directly

// Global handler function references
let addToastHandler: (message: string, type: ToastType, duration?: number) => void = () => {}
let removeToastHandler: (id: string) => void = () => {}
let clearToastsHandler: () => void = () => {}

export const toastService = {
  // Initialize the service with handler functions from the context
  initialize: (
    addToast: (message: string, type: ToastType, duration?: number) => void,
    removeToast: (id: string) => void,
    clearToasts: () => void
  ) => {
    addToastHandler = addToast
    removeToastHandler = removeToast
    clearToastsHandler = clearToasts
  },
  
  // Success toast
  success: (message: string, duration = 5000) => {
    addToastHandler(message, 'success', duration)
  },
  
  // Error toast
  error: (message: string, duration = 5000) => {
    addToastHandler(message, 'error', duration)
  },
  
  // Warning toast
  warning: (message: string, duration = 5000) => {
    addToastHandler(message, 'warning', duration)
  },
  
  // Info toast
  info: (message: string, duration = 5000) => {
    addToastHandler(message, 'info', duration)
  },
  
  // Remove a specific toast by id
  remove: (id: string) => {
    removeToastHandler(id)
  },
  
  // Clear all toasts
  clearAll: () => {
    clearToastsHandler()
  },
  
  // API error handler - extracts the error message and shows a toast
  handleError: (error: any, fallbackMessage = 'An unexpected error occurred') => {
    let message = fallbackMessage
    
    if (error.response?.data?.message) {
      message = error.response.data.message
    } else if (error.message) {
      message = error.message
    }
    
    addToastHandler(message, 'error')
    return message
  }
}

export default toastService