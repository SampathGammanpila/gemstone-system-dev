// Get the storage prefix from env or use a default
const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'gemstone_system_'

// Check if window is available (not in SSR)
const isClient = typeof window !== 'undefined'

export const storageService = {
  // Store item in localStorage with prefix
  setItem: (key: string, value: string): void => {
    if (!isClient) return
    
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, value)
    } catch (error) {
      console.error('localStorage setItem error:', error)
    }
  },
  
  // Get item from localStorage with prefix
  getItem: (key: string): string | null => {
    if (!isClient) return null
    
    try {
      return localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    } catch (error) {
      console.error('localStorage getItem error:', error)
      return null
    }
  },
  
  // Remove item from localStorage with prefix
  removeItem: (key: string): void => {
    if (!isClient) return
    
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`)
    } catch (error) {
      console.error('localStorage removeItem error:', error)
    }
  },
  
  // Clear all items in localStorage that have the prefix
  clearAll: (): void => {
    if (!isClient) return
    
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('localStorage clearAll error:', error)
    }
  },
  
  // Store object in localStorage (JSON serialized) with prefix
  setObject: <T>(key: string, value: T): void => {
    if (!isClient) return
    
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, serialized)
    } catch (error) {
      console.error('localStorage setObject error:', error)
    }
  },
  
  // Get object from localStorage (JSON parsed) with prefix
  getObject: <T>(key: string): T | null => {
    if (!isClient) return null
    
    try {
      const serialized = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
      if (serialized === null) return null
      return JSON.parse(serialized) as T
    } catch (error) {
      console.error('localStorage getObject error:', error)
      return null
    }
  },
  
  // Check if item exists in localStorage with prefix
  hasItem: (key: string): boolean => {
    if (!isClient) return false
    
    try {
      return localStorage.getItem(`${STORAGE_PREFIX}${key}`) !== null
    } catch (error) {
      console.error('localStorage hasItem error:', error)
      return false
    }
  }
}

export default storageService