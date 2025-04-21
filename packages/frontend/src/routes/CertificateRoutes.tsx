import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Loader from '@/components/common/feedback/Loader'

// Lazy-loaded pages
const CertificateView = lazy(() => import('@/pages/Certificate/CertificateView'))
const Verify = lazy(() => import('@/pages/Certificate/Verify'))

// Loader component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center p-8">
    <Loader size="md" text="Loading..." />
  </div>
)

const CertificateRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Certificate view page */}
        <Route path=":id" element={<CertificateView />} />
        
        {/* Certificate verification page */}
        <Route path="verify/:id" element={<Verify />} />
        <Route path="verify" element={<Verify />} />
        
        {/* Fallback to verification page */}
        <Route path="*" element={<Navigate to="/certificates/verify" replace />} />
      </Routes>
    </Suspense>
  )
}

export default CertificateRoutes