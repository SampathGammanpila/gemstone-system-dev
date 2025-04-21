import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/ui/Button'
import Input from '@/components/common/ui/Input'

const LoginForm = () => {
  const { login, isLoading, error, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({})
  
  // Clear error when user types
  const handleInputChange = (field: string, value: string) => {
    if (error) clearError()
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    if (field === 'email') setEmail(value)
    if (field === 'password') setPassword(value)
  }
  
  // Validate form
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {}
    let isValid = true
    
    if (!email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid'
      isValid = false
    }
    
    if (!password) {
      errors.password = 'Password is required'
      isValid = false
    }
    
    setFormErrors(errors)
    return isValid
  }
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    await login(email, password)
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Log In</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={formErrors.email}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="mb-6">
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={formErrors.password}
            placeholder="Enter your password"
            required
          />
          <div className="mt-1 text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
        >
          Log In
        </Button>
        
        <div className="mt-4 text-center">
          <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
