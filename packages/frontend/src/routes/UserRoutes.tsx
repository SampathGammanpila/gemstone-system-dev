import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Loader from '@/components/common/feedback/Loader'

// Lazy-loaded pages
const Dashboard = lazy(() => import('@/pages/Profile/Dashboard'))
const Collection = lazy(() => import('@/pages/Profile/Collection'))
const MyGemstones = lazy(() => import('@/pages/Profile/MyGemstones'))
const MyRoughStones = lazy(() => import('@/pages/Profile/MyRoughStones'))
const MyJewelry = lazy(() => import('@/pages/Profile/MyJewelry'))
const MyDrafts = lazy(() => import('@/pages/Profile/MyDrafts'))
const Orders = lazy(() => import('@/pages/Profile/Orders'))
const Settings = lazy(() => import('@/pages/Profile/Settings'))
const Transfers = lazy(() => import('@/pages/Profile/Transfers'))

// Valuation pages
const ValuationHome = lazy(() => import('@/pages/Valuation/ValuationHome'))
const GemstoneWizard = lazy(() => import('@/pages/Valuation/GemstoneWizard'))
const RoughStoneWizard = lazy(() => import('@/pages/Valuation/RoughStoneWizard'))
const JewelryWizard = lazy(() => import('@/pages/Valuation/JewelryWizard'))

// Loader component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center p-8">
    <Loader size="md" text="Loading..." />
  </div>
)

const UserRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Dashboard */}
        <Route index element={<Dashboard />} />
        
        {/* Collection routes */}
        <Route path="collection" element={<Collection />} />
        <Route path="gemstones" element={<MyGemstones />} />
        <Route path="rough-stones" element={<MyRoughStones />} />
        <Route path="jewelry" element={<MyJewelry />} />
        <Route path="drafts" element={<MyDrafts />} />
        
        {/* Orders */}
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:orderId" element={<Orders />} />
        
        {/* Transfers */}
        <Route path="transfers" element={<Transfers />} />
        
        {/* Valuation routes */}
        <Route path="valuation" element={<ValuationHome />} />
        <Route path="valuation/gemstone" element={<GemstoneWizard />} />
        <Route path="valuation/rough-stone" element={<RoughStoneWizard />} />
        <Route path="valuation/jewelry" element={<JewelryWizard />} />
        
        {/* Settings */}
        <Route path="settings" element={<Settings />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}

export default UserRoutes