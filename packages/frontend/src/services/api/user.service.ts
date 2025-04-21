import { api } from './api'
import { User, UserResponse } from '@/types/auth'

interface ProfileUpdateData {
  name: string
  email: string
}

interface PasswordUpdateData {
  currentPassword: string
  newPassword: string
}

export const userService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<UserResponse>('/users/profile')
    return response.data.user
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: ProfileUpdateData): Promise<User> => {
    const response = await api.put<UserResponse>('/users/profile', data)
    return response.data.user
  },

  /**
   * Update user password
   */
  updatePassword: async (data: PasswordUpdateData): Promise<void> => {
    await api.put('/users/password', data)
  },
}
