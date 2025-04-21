import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Loader from '@/components/common/feedback/Loader'
import ProtectedRoute from '@/components/common/route/ProtectedRoute'

// Lazy-loaded pages
const Browse = lazy(() => import('@/pages/Marketplace/Browse'))
const Category = lazy(() => import('@/pages/Marketplace/Category'))
const GemstoneDetail = lazy(() => import('@/pages/Marketplace/GemstoneDetail'))
const RoughStoneDetail = lazy(() => import('@/pages/Marketplace/RoughStoneDetail'))
const JewelryDetail = lazy(() => import('@/pages/Marketplace/JewelryDetail'))
const Cart = lazy(() => import('@/pages/Marketplace/Cart'))
const Checkout = lazy(() => import('@/pages/Marketplace/Checkout'))
const OrderConfirmation = lazy(() => import('@/pages/Marketplace/OrderConfirmation'))
const StoreView = lazy(() => import('@/pages/Marketplace/StoreView'))

// Loader component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center p-8">
    <Loader size="md" text="Loading..." />
  </div>
)

const MarketplaceRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Main marketplace page */}
        <Route index element={<Browse />} />
        
        {/* Category pages */}
        <Route path="category/:categorySlug" element={<Category />} />
        
        {/* Product detail pages */}
        <Route path="gemstone/:id" element={<GemstoneDetail />} />
        <Route path="rough-stone/:id" element={<RoughStoneDetail />} />
        <Route path="jewelry/:id" element={<JewelryDetail />} />
        
        {/* Store pages */}
        <Route path="store/:storeId" element={<StoreView />} />
        
        {/* Cart and checkout - protected routes */}
        <Route 
          path="cart" 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="order-confirmation/:orderId" 
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/marketplace" replace />} />
      </Routes>
    </Suspense>
  )
}

export default MarketplaceRoutes