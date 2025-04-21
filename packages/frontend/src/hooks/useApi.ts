import { useState, useEffect, useCallback } from 'react'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { apiService } from '@/services/api/api.service'
import useToast from './useToast'

interface UseApiOptions<T> {
  url: string
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  body?: any
  config?: AxiosRequestConfig
  onSuccess?: (data: T) => void
  onError?: (error: AxiosError) => void
  loadOnMount?: boolean
  showErrorToast?: boolean
  errorMessage?: string
}

// Custom hook for API calls
function useApi<T = any>({
  url,
  method,
  body,
  config,
  onSuccess,
  onError,
  loadOnMount = false,
  showErrorToast = true,
  errorMessage = 'An error occurred while fetching data'
}: UseApiOptions<T>) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<AxiosError | null>(null)
  const toast = useToast()

  // Execute the API call
  const execute = useCallback(async (overrideBody?: any): Promise<T | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      let response: AxiosResponse<T>
      
      switch (method) {
        case 'get':
          response = await apiService.get<T>(url, config)
          break
        case 'post':
          response = await apiService.post<T>(url, overrideBody || body, config)
          break
        case 'put':
          response = await apiService.put<T>(url, overrideBody || body, config)
          break
        case 'patch':
          response = await apiService.patch<T>(url, overrideBody || body, config)
          break
        case 'delete':
          response = await apiService.delete<T>(url, config)
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
      
      setData(response.data)
      if (onSuccess) {
        onSuccess(response.data)
      }
      
      return response.data
    } catch (err) {
      const axiosError = err as AxiosError
      setError(axiosError)
      
      if (showErrorToast) {
        let message = errorMessage
        
        if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
          const responseData = axiosError.response.data as any
          message = responseData.message || responseData.error || errorMessage
        }
        
        toast.error(message)
      }
      
      if (onError) {
        onError(axiosError)
      }
      
      return null
    } finally {
      setIsLoading(false)
    }
  }, [url, method, body, config, onSuccess, onError, showErrorToast, errorMessage, toast])

  // Load data on mount if specified
  useEffect(() => {
    if (loadOnMount) {
      execute()
    }
  }, [loadOnMount, execute])

  // Reset state
  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    data,
    isLoading,
    error,
    execute,
    reset
  }
}

export default useApi