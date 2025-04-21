import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import ProtectedRoute from '@/components/common/route/ProtectedRoute'
import UserLayout from '@/components/common/layout/UserLayout'
import Loader from '@/components/common/feedback/Loader'
import MainLayout from '@/components/common/layout/MainLayout'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'
import ForgotPassword from '@/pages/Auth/ForgotPassword'
import ResetPassword from '@/pages/Auth/ResetPassword'
import VerifyEmail from '@/pages/Auth/VerifyEmail'
import ProfessionalRegister from '@/pages/Auth/ProfessionalRegister'
import NotFound from '@/pages/NotFound'
import Unauthorized from '@/pages/Unauthorized'
import Profile from '@/pages/Profile'

// Lazy-loaded pages
const Home = lazy(() => import('@/pages/Home'))

// Import other route modules
import UserRoutes from './UserRoutes'
import ProfessionalRoutes from './ProfessionalRoutes'
import MarketplaceRoutes from './MarketplaceRoutes'
import CertificateRoutes from './CertificateRoutes'

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
          <Route path="/professional-register" element={<ProfessionalRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* User routes */}
          <Route 
            path="/user/*" 
            element={
              <ProtectedRoute>
                <UserLayout>
                  <UserRoutes />
                </UserLayout>
              </ProtectedRoute>
            } 
          />

          {/* Professional routes */}
          <Route 
            path="/professional/*" 
            element={
              <ProtectedRoute requiredRole={['dealer', 'cutter', 'appraiser']}>
                <UserLayout>
                  <ProfessionalRoutes />
                </UserLayout>
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

          {/* Admin routes would go here */}

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