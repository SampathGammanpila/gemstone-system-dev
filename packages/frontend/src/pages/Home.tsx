import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/common/ui/Button'
import Card from '@/components/common/ui/Card'

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Complete Gemstone Lifecycle Management
            </h1>
            <p className="text-primary-100 text-lg mb-6">
              From rough stones to beautiful jewelry, track, value, and trade gemstones 
              with our secure blockchain-based platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/marketplace">
                <Button variant="secondary" size="lg">
                  Explore Marketplace
                </Button>
              </Link>
              <Link to="/valuation">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-primary-700" size="lg">
                  Try Valuation Tools
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            {/* Placeholder for hero image */}
            <div className="bg-primary-300 h-64 rounded-lg shadow-xl flex items-center justify-center">
              <span className="text-primary-800 font-semibold">Gemstone System</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
            Complete Gemstone Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card 
              title="Valuation Tools" 
              className="text-center hover:shadow-lg transition-shadow"
            >
              <div className="p-4 flex flex-col items-center">
                <svg className="w-12 h-12 text-primary-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="text-secondary-600 mb-4">
                  Professional tools to accurately value rough stones, cut gemstones, and jewelry.
                </p>
                <Link to="/valuation">
                  <Button variant="outline" className="mt-2">
                    Start Valuation
                  </Button>
                </Link>
              </div>
            </Card>
            
            <Card 
              title="Secure Ownership" 
              className="text-center hover:shadow-lg transition-shadow"
            >
              <div className="p-4 flex flex-col items-center">
                <svg className="w-12 h-12 text-primary-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-secondary-600 mb-4">
                  Blockchain-based certificates and secure ownership transfers ensure authentic provenance.
                </p>
                <Link to="/certificates">
                  <Button variant="outline" className="mt-2">
                    View Certificates
                  </Button>
                </Link>
              </div>
            </Card>
            
            <Card 
              title="Marketplace" 
              className="text-center hover:shadow-lg transition-shadow"
            >
              <div className="p-4 flex flex-col items-center">
                <svg className="w-12 h-12 text-primary-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-secondary-600 mb-4">
                  Buy, sell, and trade gemstones and jewelry with verified professionals.
                </p>
                <Link to="/marketplace">
                  <Button variant="outline" className="mt-2">
                    Visit Marketplace
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Professional section */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-50 rounded-xl p-8 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">
                Are You a Gemstone Professional?
              </h2>
              <p className="text-primary-700 mb-4">
                Join our network of verified dealers, cutters, and appraisers. Get access to specialized tools,
                connect with customers, and grow your business.
              </p>
              <Link to="/professional-register">
                <Button variant="primary">
                  Register as a Professional
                </Button>
              </Link>
            </div>
            <div className="md:w-1/3">
              {/* Placeholder for professional image */}
              <div className="bg-primary-200 h-48 rounded-lg shadow-md flex items-center justify-center">
                <span className="text-primary-700 font-semibold">Professional Services</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home