import { apiService } from './api.service'

interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: string
    isVerified: boolean
  }
}

interface RegisterResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: string
    isVerified: boolean
  }
}

interface PasswordResetResponse {
  success: boolean
  message: string
}

interface VerifyEmailResponse {
  success: boolean
  message: string
}

interface UserResponse {
  id: string
  email: string
  name: string
  role: string
  isVerified: boolean
}

export const authService = {
  // Login user
  login: (email: string, password: string) => {
    return apiService.post<LoginResponse>('/auth/login', { email, password })
  },
  
  // Register user
  register: (userData: { name: string; email: string; password: string }) => {
    return apiService.post<RegisterResponse>('/auth/register', userData)
  },
  
  // Register professional user
  registerProfessional: (userData: {
    name: string
    email: string
    password: string
    professionalType: string
    company?: string
    phone: string
  }) => {
    return apiService.post<RegisterResponse>('/auth/register/professional', userData)
  },
  
  // Send password reset email
  forgotPassword: (email: string) => {
    return apiService.post<PasswordResetResponse>('/auth/forgot-password', { email })
  },
  
  // Reset password with token
  resetPassword: (token: string, newPassword: string) => {
    return apiService.post<PasswordResetResponse>('/auth/reset-password', {
      token,
      newPassword,
    })
  },
  
  // Change password (authenticated)
  changePassword: (currentPassword: string, newPassword: string) => {
    return apiService.post<{ success: boolean }>('/auth/change-password', {
      currentPassword,
      newPassword,
    })
  },
  
  // Verify email with token
  verifyEmail: (token: string) => {
    return apiService.post<VerifyEmailResponse>('/auth/verify-email', { token })
  },
  
  // Resend verification email
  resendVerificationEmail: (email: string) => {
    return apiService.post<{ success: boolean }>('/auth/resend-verification', { email })
  },
  
  // Check if user is authenticated
  checkAuth: () => {
    return apiService.get<UserResponse>('/auth/me')
  },
  
  // Refresh token
  refreshToken: () => {
    return apiService.post<{ token: string }>('/auth/refresh-token')
  },
  
  // Logout
  logout: () => {
    return apiService.post<{ success: boolean }>('/auth/logout')
  },
}

export default authService