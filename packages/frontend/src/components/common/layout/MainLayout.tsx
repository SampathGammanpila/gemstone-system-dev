import React, { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import useUI from '@/hooks/useUI'
import useAuth from '@/hooks/useAuth'

interface MainLayoutProps {
  children: ReactNode
  showFooter?: boolean
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showFooter = true }) => {
  const { sidebarOpen } = useUI()
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex-grow flex">
        {/* Sidebar (only for authenticated users) */}
        {isAuthenticated && <Sidebar />}

        {/* Main content area */}
        <main 
          className={`flex-1 transition-all duration-300 ${
            isAuthenticated ? (sidebarOpen ? 'lg:ml-64' : '') : ''
          }`}
        >
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  )
}

export default MainLayout