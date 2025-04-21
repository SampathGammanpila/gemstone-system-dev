import { createContext, useReducer, ReactNode, useState, useEffect } from 'react'

// Types
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

type ToastAction =
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: { id: string } }
  | { type: 'CLEAR_TOASTS' }

interface ToastContextType extends ToastState {
  addToast: (message: string, type: ToastType, duration?: number) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

// Initial state
const initialState: ToastState = {
  toasts: [],
}

// Reducer
const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      }
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload.id),
      }
    case 'CLEAR_TOASTS':
      return {
        ...state,
        toasts: [],
      }
    default:
      return state
  }
}

// Create context
const ToastContext = createContext<ToastContextType>({
  ...initialState,
  addToast: () => {},
  removeToast: () => {},
  clearToasts: () => {},
})

// Generate unique ID for toasts
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9)
}

// Provider component
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState)
  const [toastTimeouts, setToastTimeouts] = useState<Record<string, NodeJS.Timeout>>({})

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(toastTimeouts).forEach((timeout) => clearTimeout(timeout))
    }
  }, [toastTimeouts])

  // Add toast with auto-removal after duration
  const addToast = (message: string, type: ToastType, duration = 5000) => {
    const id = generateId()
    const toast: Toast = { id, message, type, duration }
    
    dispatch({ type: 'ADD_TOAST', payload: toast })
    
    if (duration > 0) {
      const timeout = setTimeout(() => {
        removeToast(id)
      }, duration)
      
      setToastTimeouts((prev) => ({ ...prev, [id]: timeout }))
    }
  }

  // Remove toast and clear its timeout
  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: { id } })
    
    if (toastTimeouts[id]) {
      clearTimeout(toastTimeouts[id])
      setToastTimeouts((prev) => {
        const newTimeouts = { ...prev }
        delete newTimeouts[id]
        return newTimeouts
      })
    }
  }

  // Clear all toasts and their timeouts
  const clearToasts = () => {
    dispatch({ type: 'CLEAR_TOASTS' })
    
    Object.values(toastTimeouts).forEach((timeout) => clearTimeout(timeout))
    setToastTimeouts({})
  }

  // Toast component to render the actual notifications
  const ToastContainer = () => {
    if (state.toasts.length === 0) return null

    return (
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {state.toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-md p-4 flex justify-between items-center shadow-lg transition-all duration-300 ease-in-out ${
              toast.type === 'success'
                ? 'bg-success-100 text-success-800 border-l-4 border-success-500'
                : toast.type === 'error'
                ? 'bg-danger-100 text-danger-800 border-l-4 border-danger-500'
                : toast.type === 'warning'
                ? 'bg-warning-100 text-warning-800 border-l-4 border-warning-500'
                : 'bg-primary-100 text-primary-800 border-l-4 border-primary-500'
            }`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-secondary-500 hover:text-secondary-700"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <ToastContext.Provider
      value={{
        ...state,
        addToast,
        removeToast,
        clearToasts,
      }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export default ToastContext