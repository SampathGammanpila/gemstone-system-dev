import { createContext, useState, useEffect, ReactNode } from 'react'
import { storageService } from '../services/storage/localStorage.service'

// Available theme options
export type ThemeName = 'light' | 'dark' | 'system'

// Theme context interface
interface ThemeContextType {
  theme: ThemeName
  isDarkMode: boolean
  setTheme: (theme: ThemeName) => void
  toggleTheme: () => void
}

// Default theme context
const defaultThemeContext: ThemeContextType = {
  theme: 'system',
  isDarkMode: false,
  setTheme: () => {},
  toggleTheme: () => {},
}

// Create the theme context
const ThemeContext = createContext<ThemeContextType>(defaultThemeContext)

// Provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Get stored theme or default to system
  const storedTheme = storageService.getItem('theme') as ThemeName | null
  const [theme, setThemeState] = useState<ThemeName>(storedTheme || 'system')
  
  // Determine if dark mode is active based on theme and system preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  
  // Update the theme in localStorage and apply it to the document
  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme)
    storageService.setItem('theme', newTheme)
  }
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }
  
  // Effect to detect system preference and apply theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const applyTheme = () => {
      // Determine if dark mode should be active
      const shouldBeDark = 
        theme === 'dark' || 
        (theme === 'system' && mediaQuery.matches)
      
      setIsDarkMode(shouldBeDark)
      
      // Apply theme to HTML element
      if (shouldBeDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    
    // Apply theme initially
    applyTheme()
    
    // Listen for system preference changes
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme()
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])
  
  return (
    <ThemeContext.Provider
      value={{ theme, isDarkMode, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContext
