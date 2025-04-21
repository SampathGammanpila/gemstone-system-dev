import { useEffect, useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { UIProvider } from './contexts/UIContext'
import { ToastProvider } from './contexts/ToastContext'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial app loading/initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-secondary-700 font-medium">Loading Gemstone System...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <UIProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </UIProvider>
    </AuthProvider>
  )
}

export default App