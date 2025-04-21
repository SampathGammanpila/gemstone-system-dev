import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Loader from '@/components/common/feedback/Loader'
import ProtectedRoute from '@/components/common/route/ProtectedRoute'

// Lazy-loaded pages
const Dashboard = lazy(() => import('@/pages/Professional/Dashboard'))
const Inventory = lazy(() => import('@/pages/Professional/Inventory'))
const Sales = lazy(() => import('@/pages/Professional/Sales'))
const Customers = lazy(() => import('@/pages/Professional/Customers'))
const Analytics = lazy(() => import('@/pages/Professional/Analytics'))
const Reviews = lazy(() => import('@/pages/Professional/Reviews'))
const Settings = lazy(() => import('@/pages/Professional/Settings'))

// Loader component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center p-8">
    <Loader size="md" text="Loading..." />
  </div>
)

const ProfessionalRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Dashboard */}
        <Route index element={<Dashboard />} />
        
        {/* Inventory management */}
        <Route path="inventory" element={<Inventory />} />
        <Route path="inventory/:itemId" element={<Inventory />} />
        
        {/* Sales - only for dealer role */}
        <Route 
          path="sales" 
          element={
            <ProtectedRoute requiredRole="dealer">
              <Sales />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="sales/:orderId" 
          element={
            <ProtectedRoute requiredRole="dealer">
              <Sales />
            </ProtectedRoute>
          } 
        />
        
        {/* Customers */}
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:customerId" element={<Customers />} />
        
        {/* Analytics */}
        <Route path="analytics" element={<Analytics />} />
        
        {/* Reviews */}
        <Route path="reviews" element={<Reviews />} />
        
        {/* Settings */}
        <Route path="settings" element={<Settings />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/professional" replace />} />
      </Routes>
    </Suspense>
  )
}

export default ProfessionalRoutes