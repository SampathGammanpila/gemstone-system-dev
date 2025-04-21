import React, { useEffect } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import Input from '@/components/common/ui/Input'
import Button from '@/components/common/ui/Button'
import Card from '@/components/common/ui/Card'
import ErrorMessage from '@/components/common/feedback/ErrorMessage'
import useAuth from '@/hooks/useAuth'
import useForm from '@/hooks/useForm'
import LoginForm from '@/components/auth/LoginForm'

interface LoginFormValues {
  email: string
  password: string
  rememberMe: boolean
}

const Login = () => {
  const { isAuthenticated } = useAuth()
  
  useEffect(() => {
    // Set document title
    document.title = 'Login | Gemstone System'
  }, [])
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gemstone System</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to access your account</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  )
}

export default Login