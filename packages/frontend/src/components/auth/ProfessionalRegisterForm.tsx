import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Input from '@/components/common/ui/Input'
import Select from '@/components/common/ui/Select'
import Button from '@/components/common/ui/Button'
import { authService } from '@/services/api/auth.service'
import { handleApiError } from '@/utils/errorHandling'
import useToast from '@/hooks/useToast'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  professionalType: string
  company: string
  phone: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  professionalType?: string
  phone?: string
}

const professionalTypeOptions = [
  { value: '', label: 'Select type' },
  { value: 'dealer', label: 'Gemstone Dealer' },
  { value: 'cutter', label: 'Gemstone Cutter' },
  { value: 'appraiser', label: 'Gemstone Appraiser' },
]

const ProfessionalRegisterForm = () => {
  const { success } = useToast()
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    professionalType: '',
    company: '',
    phone: '',
  })
  
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  
  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    // Clear field error when user types
    if (formErrors[field as keyof FormErrors]) {
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
    
    // Validate professional type
    if (!formData.professionalType) {
      errors.professionalType = 'Please select your professional type'
      isValid = false
    }
    
    // Validate phone
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
      isValid = false
    } else if (!/^\+?[0-9\s\-\(\)]{8,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number'
      isValid = false
    }
    
    setFormErrors(errors)
    return isValid
  }
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      await authService.registerProfessional({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        professionalType: formData.professionalType,
        company: formData.company,
        phone: formData.phone,
      })
      
      setRegistrationSuccess(true)
      success('Registration successful! Please verify your email.')
    } catch (error) {
      handleApiError(error, 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (registrationSuccess) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          
          <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">Registration Successful</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Thank you for registering as a professional on Gemstone System!
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Please check your email to verify your account. Once verified, your professional status will be reviewed by our team.
          </p>
          
          <div className="mt-6">
            <Link to="/login">
              <Button variant="primary">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Professional Registration</h2>
      
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
        
        <div className="mb-4">
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
        
        <div className="mb-4">
          <Select
            label="Professional Type"
            value={formData.professionalType}
            onChange={(e) => handleInputChange('professionalType', e.target.value)}
            error={formErrors.professionalType}
            options={professionalTypeOptions}
            required
          />
        </div>
        
        <div className="mb-4">
          <Input
            label="Company (Optional)"
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="Enter your company name if applicable"
          />
        </div>
        
        <div className="mb-6">
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={formErrors.phone}
            placeholder="Enter your phone number"
            required
          />
        </div>
        
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
        >
          Register as Professional
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
        
        <div className="mt-2 text-center">
          <span className="text-gray-600 dark:text-gray-400">Need a regular account? </span>
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Register here
          </Link>
        </div>
      </form>
    </div>
  )
}

export default ProfessionalRegisterForm
