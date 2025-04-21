import { useState, ChangeEvent, FormEvent } from 'react'

interface FormOptions<T> {
  initialValues: T
  validateOnChange?: boolean
  onSubmit?: (values: T) => void | Promise<void>
  validate?: (values: T) => Partial<Record<keyof T, string>>
}

// Custom hook for form handling
function useForm<T extends Record<string, any>>({
  initialValues,
  validateOnChange = false,
  onSubmit,
  validate
}: FormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validate all form values
  const validateForm = () => {
    if (!validate) return true
    
    const validationErrors = validate(values)
    const hasErrors = Object.keys(validationErrors).length > 0
    
    setErrors(validationErrors)
    return !hasErrors
  }

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    
    // Handle special input types
    const processedValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked
      : type === 'number' 
        ? value === '' ? '' : Number(value)
        : value
    
    setValues(prev => ({
      ...prev,
      [name]: processedValue
    }))
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
    
    // Validate on change if option is enabled
    if (validateOnChange && validate) {
      const validationErrors = validate({
        ...values,
        [name]: processedValue
      })
      
      setErrors(prev => ({
        ...prev,
        [name]: validationErrors[name as keyof T]
      }))
    }
  }

  // Handle input blur events
  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
    
    // Validate field on blur
    if (validate) {
      const validationErrors = validate(values)
      
      setErrors(prev => ({
        ...prev,
        [name]: validationErrors[name as keyof T]
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault()
    }
    
    // Validate form before submission
    const isValid = validateForm()
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true
      return acc
    }, {} as Partial<Record<keyof T, boolean>>)
    
    setTouched(allTouched)
    
    if (isValid && onSubmit) {
      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }

  // Set a specific field value
  const setFieldValue = (field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Set a specific field error
  const setFieldError = (field: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }))
  }

  // Set multiple values at once
  const setMultipleValues = (newValues: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }))
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setMultipleValues,
    setValues
  }
}

export default useForm