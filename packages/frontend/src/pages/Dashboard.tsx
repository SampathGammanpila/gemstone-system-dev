import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import Card from '@/components/common/ui/Card'
import Button from '@/components/common/ui/Button'

const Dashboard: React.FC = () => {
  const { user, isProfessional } = useAuth()

  useEffect(() => {
    // Set document title
    document.title = 'Dashboard | Gemstone System'
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <div className="flex space-x-2">
          {isProfessional && (
            <Link to="/professional">
              <Button variant="outline">
                Professional Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Welcome card */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="p-6">
          <h2 className="text-xl font-semibold">Welcome back, {user?.name}!</h2>
          <p className="mt-2 opacity-90">
            Gemstone System helps you manage, track, and value your gemstone collection 
            with secure blockchain-based certificates.
          </p>
        </div>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">My Collection</h3>
            <p className="text-secondary-600 mb-4">
              View and manage your gemstone collection, including rough stones and jewelry items.
            </p>
            <Link to="/collection">
              <Button variant="primary" className="w-full">
                View Collection
              </Button>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Valuation</h3>
            <p className="text-secondary-600 mb-4">
              Use our valuation tools to assess the value of your gemstones or jewelry.
            </p>
            <Link to="/valuation">
              <Button variant="primary" className="w-full">
                Valuation Tools
              </Button>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Marketplace</h3>
            <p className="text-secondary-600 mb-4">
              Browse gemstones, rough stones, and jewelry available for purchase.
            </p>
            <Link to="/marketplace">
              <Button variant="primary" className="w-full">
                Go to Marketplace
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <Card title="Recent Activity">
        <div className="p-4">
          <div className="text-center text-secondary-500 py-8">
            <svg
              className="w-12 h-12 mx-auto text-secondary-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2">No recent activity to display</p>
            <div className="mt-4">
              <Link to="/marketplace">
                <Button variant="outline" size="sm">
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard