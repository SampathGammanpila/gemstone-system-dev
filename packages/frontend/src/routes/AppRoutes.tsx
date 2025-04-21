import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import ProtectedRoute from '@/components/common/route/ProtectedRoute'
import UserLayout from '@/components/common/layout/UserLayout'
import MainLayout from '@/components/common/layout/MainLayout'
import Loader from '@/components/common/feedback/Loader'
import NotFound from '@/pages/NotFound'

// Lazy-loaded pages
const Home = lazy(() => import('@/pages/Home'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Login = lazy(() => import('@/pages/Auth/Login'))
const Register = lazy(() => import('@/pages/Auth/Register'))
const Profile = lazy(() => import('@/pages/Profile'))

// Import route modules
import MarketplaceRoutes from './MarketplaceRoutes'
import CertificateRoutes from './CertificateRoutes'

// Simple placeholders for routes that aren't implemented yet
const ValuationHome = () => <div className="p-6">Valuation Home - Coming Soon</div>

// Loader component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader size="lg" text="Loading..." />
  </div>
)

const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Home and public pages */}
          <Route path="/" element={<UserLayout><Home /></UserLayout>} />
          
          {/* Dashboard - protected route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Profile - protected route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Marketplace routes */}
          <Route
            path="/marketplace/*"
            element={
              <UserLayout>
                <MarketplaceRoutes />
              </UserLayout>
            }
          />

          {/* Certificate routes */}
          <Route
            path="/certificates/*"
            element={
              <UserLayout>
                <CertificateRoutes />
              </UserLayout>
            }
          />
          
          {/* Valuation routes */}
          <Route
            path="/valuation"
            element={
              <UserLayout>
                <ValuationHome />
              </UserLayout>
            }
          />

          {/* 404 Not Found route */}
          <Route path="/not-found" element={<NotFound />} />
          
          {/* Redirect all unknown routes to 404 */}
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default AppRoutes