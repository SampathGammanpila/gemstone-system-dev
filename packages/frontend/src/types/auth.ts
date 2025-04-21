export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  isActive: boolean
  createdAt: string
  lastLoginAt: string | null
  stats?: {
    gemstones: number
    roughStones: number
    jewelry: number
    certificates: number
  }
}

export interface UserResponse {
  user: User
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
} 