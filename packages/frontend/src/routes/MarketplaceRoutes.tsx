import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Loader from '@/components/common/feedback/Loader'

// Create placeholder components for routes
const Browse = () => <div>Marketplace Browse Page</div>
const Category = () => <div>Category Page</div>
const GemstoneDetail = () => <div>Gemstone Detail Page</div>
const RoughStoneDetail = () => <div>Rough Stone Detail Page</div>
const JewelryDetail = () => <div>Jewelry Detail Page</div>
const Cart = () => <div>Cart Page</div>
const Checkout = () => <div>Checkout Page</div>
const OrderConfirmation = () => <div>Order Confirmation Page</div>
const StoreView = () => <div>Store View Page</div>

// Loader component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center p-8">
    <Loader size="md" text="Loading marketplace..." />
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
        
        {/* Cart and checkout */}
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/marketplace" replace />} />
      </Routes>
    </Suspense>
  )
}

export default MarketplaceRoutes