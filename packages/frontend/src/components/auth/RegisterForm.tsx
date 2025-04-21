import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import Button from '@/components/common/ui/Button'
import Input from '@/components/common/ui/Input'
import ErrorMessage from '@/components/common/feedback/ErrorMessage'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const RegisterForm = () => {
  const { register, isLoading, error, clearError } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  // Clear error when user types
  const handleInputChange = (field: keyof FormData, value: string) => {
    if (error) clearError()
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }

    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Validate form
  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    let isValid = true

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
      isValid = false
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
      isValid = false
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
      isValid = false
    }

    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
      isValid = false
    }

    // Validate password confirmation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Create an Account</h2>

      {error && (
        <ErrorMessage message={error} className="mb-4" />
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={formErrors.name}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="mb-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={formErrors.email}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-4">
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={formErrors.password}
            placeholder="Enter your password"
            required
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Password must be at least 8 characters
          </div>
        </div>

        <div className="mb-6">
          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            error={formErrors.confirmPassword}
            placeholder="Confirm your password"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
        >
          Register
        </Button>

        <div className="mt-4 text-center">
          <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Log In
          </Link>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm