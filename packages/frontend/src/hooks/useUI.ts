import { useContext } from 'react'
import UIContext from '@/contexts/UIContext'

// Custom hook to use the UI context
const useUI = () => {
  const context = useContext(UIContext)
  
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider')
  }
  
  return context
}

export default useUI