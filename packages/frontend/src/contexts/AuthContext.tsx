import { createContext, useReducer, ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api/auth.service'
import { storageService } from '../services/storage/localStorage.service'

// Types
interface User {
  id: string
  email: string
  name: string
  role: string
  isVerified: boolean
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  error: string | null
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'RESTORE_SESSION'; payload: User }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User }

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: {
    name: string
    email: string
    password: string
  }) => Promise<void>
  clearError: () => void
  updateUser: (userData: Partial<User>) => void
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
}

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      }
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null,
      }
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    case 'RESTORE_SESSION':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload } as User,
      }
    default:
      return state
  }
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  clearError: () => {},
  updateUser: () => {},
})

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const token = storageService.getItem('token')
    const storedUser = storageService.getItem('user')

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser)
        dispatch({ type: 'RESTORE_SESSION', payload: user })
      } catch (error) {
        // Invalid stored user
        storageService.removeItem('token')
        storageService.removeItem('user')
      }
    }
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const { data } = await authService.login(email, password)
      const { token, user } = data

      // Store token and user in localStorage
      storageService.setItem('token', token)
      storageService.setItem('user', JSON.stringify(user))

      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      navigate('/dashboard')
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.'
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
    }
  }

  // Logout function
  const logout = () => {
    storageService.removeItem('token')
    storageService.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    navigate('/login')
  }

  // Register function
  const register = async (userData: { name: string; email: string; password: string }) => {
    dispatch({ type: 'REGISTER_START' })
    try {
      const { data } = await authService.register(userData)
      const { token, user } = data

      // Store token and user in localStorage
      storageService.setItem('token', token)
      storageService.setItem('user', JSON.stringify(user))

      dispatch({ type: 'REGISTER_SUCCESS', payload: user })
      navigate('/dashboard')
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.'
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage })
    }
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // Update user
  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData } as User
      storageService.setItem('user', JSON.stringify(updatedUser))
      dispatch({ type: 'UPDATE_USER', payload: updatedUser })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        clearError,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext