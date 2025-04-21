import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { storageService } from '../storage/localStorage.service'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?session=expired'
      }
    }
    
    // Handle server errors
    if (error.response?.status === 500) {
      console.error('Server error:', error)
    }
    
    // Log other errors
    if (!error.response) {
      console.error('Network error:', error)
    }
    
    return Promise.reject(error)
  }
)

// Generic API service
export const apiService = {
  // GET request
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.get<T>(url, config)
  },
  
  // POST request
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.post<T>(url, data, config)
  },
  
  // PUT request
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.put<T>(url, data, config)
  },
  
  // PATCH request
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.patch<T>(url, data, config)
  },
  
  // DELETE request
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosInstance.delete<T>(url, config)
  },
  
  // Upload file with progress tracking
  upload: <T>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<AxiosResponse<T>> => {
    return axiosInstance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
  },
  
  // Get base URL (useful for constructing complete URLs for assets)
  getBaseUrl: (): string => {
    return API_URL
  },
}

export default apiService