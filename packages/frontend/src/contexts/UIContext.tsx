import { createContext, useReducer, ReactNode, useEffect } from 'react'

// Types
interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  isMobileView: boolean
}

type UIAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_MOBILE_VIEW'; payload: boolean }

interface UIContextType extends UIState {
  toggleSidebar: () => void
  setSidebar: (isOpen: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

// Check for saved theme in localStorage, otherwise use system preference
const getSavedTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }
  
  // Use system preference as fallback
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  return 'light'
}

// Initial state
const initialState: UIState = {
  sidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1024 : false, // Open by default on larger screens
  theme: getSavedTheme(),
  isMobileView: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
}

// Reducer
const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      }
    case 'SET_SIDEBAR':
      return {
        ...state,
        sidebarOpen: action.payload,
      }
    case 'SET_THEME':
      // Save theme preference to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload)
      }
      return {
        ...state,
        theme: action.payload,
      }
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      // Save theme preference to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme)
      }
      return {
        ...state,
        theme: newTheme,
      }
    case 'SET_MOBILE_VIEW':
      return {
        ...state,
        isMobileView: action.payload,
        // Auto-close sidebar on mobile view
        sidebarOpen: action.payload ? false : state.sidebarOpen,
      }
    default:
      return state
  }
}

// Create context
const UIContext = createContext<UIContextType>({
  ...initialState,
  toggleSidebar: () => {},
  setSidebar: () => {},
  setTheme: () => {},
  toggleTheme: () => {},
})

// Provider component
export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState)

  // Add resize event listener to update mobile view state
  useEffect(() => {
    const handleResize = () => {
      dispatch({ type: 'SET_MOBILE_VIEW', payload: window.innerWidth < 768 })
      
      // Auto-open sidebar on larger screens when resizing from small to large
      if (window.innerWidth >= 1024 && !state.sidebarOpen) {
        dispatch({ type: 'SET_SIDEBAR', payload: true })
      }
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [state.sidebarOpen])

  // Apply the current theme to the document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [state.theme])

  // Functions
  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' })
  }

  const setSidebar = (isOpen: boolean) => {
    dispatch({ type: 'SET_SIDEBAR', payload: isOpen })
  }

  const setTheme = (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme })
  }

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' })
  }

  return (
    <UIContext.Provider
      value={{
        ...state,
        toggleSidebar,
        setSidebar,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export default UIContext