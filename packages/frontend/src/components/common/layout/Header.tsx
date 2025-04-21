import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import useUI from '@/hooks/useUI'
import Button from '../ui/Button'

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const { toggleSidebar, sidebarOpen, isMobileView } = useUI()

  return (
    <header className="bg-white border-b border-secondary-200 px-4 h-16 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center">
        {/* Mobile menu button */}
        {isAuthenticated && (
          <button
            type="button"
            className="p-2 rounded-md text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 lg:hidden"
            onClick={() => toggleSidebar()}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {sidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        )}

        {/* Logo */}
        <Link to="/" className="flex items-center ml-2 lg:ml-0">
          <span className="text-primary-600 font-semibold text-xl">Gemstone System</span>
        </Link>
      </div>

      {/* Right side navigation */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            {/* Notification icon */}
            <button
              type="button"
              className="p-2 rounded-full text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 relative"
              aria-label="Notifications"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger-500"></span>
            </button>

            {/* User dropdown - Fix: Add proper null check for user */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 text-secondary-700 hover:text-secondary-900"
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-semibold">
                  {user && user.name ? user.name.substring(0, 1).toUpperCase() : 'U'}
                </div>
                {!isMobileView && (
                  <span className="font-medium">{user?.name || 'User'}</span>
                )}
              </button>
              {/* Dropdown menu would go here */}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline" size="sm">Log In</Button>
            </Link>
            <Link to="/register" className={isMobileView ? 'hidden' : ''}>
              <Button variant="primary" size="sm">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header