'use client'

import { useAuth } from '../../components/AuthProvider'
import { SidebarLayout } from '../../components/SidebarLayout'
import AuthLoadingSpinner from '../../components/AuthLoadingSpinner'
import { TrendingUp, ArrowDownRight } from 'lucide-react'

export default function DashboardPage() {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard…
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please sign in to access your dashboard
      </div>
    )
  }

  return (
    <SidebarLayout currentPage="dashboard">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Montty Dashboard
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your startup today
            </p>
          </div>
          
          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm font-medium text-gray-900">Total Revenue</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs text-gray-500">Live</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">$124.5K</div>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>+12% from last month</span>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium text-gray-900">Runway</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                      <span className="text-xs text-gray-500">Live</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">8.5</div>
                  <div className="flex items-center text-sm text-yellow-600">
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                    <span>-0.5 months from last month</span>
                  </div>
                </div>
              </div>

              {/* Cash Flow Chart */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Cash Flow</h3>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>
                <div className="flex items-end justify-between h-32 mb-4">
                  {[40, 65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 mx-1 bg-red-500 rounded-t transition-all duration-500 hover:bg-red-600"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">Stripe Payment</p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-semibold">+$2,450</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">AWS Bill</p>
                        <p className="text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <span className="text-red-600 font-semibold">-$850</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">Customer Payment</p>
                        <p className="text-sm text-gray-500">3 days ago</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-semibold">+$1,200</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">Office Rent</p>
                        <p className="text-sm text-gray-500">5 days ago</p>
                      </div>
                    </div>
                    <span className="text-red-600 font-semibold">-$3,200</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Account Info */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium text-gray-900 text-sm">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{user.name} {user.surname}</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Users</span>
                    <span className="font-semibold text-gray-900">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Growth Rate</span>
                    <span className="font-semibold text-gray-900">0%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Burn</span>
                    <span className="font-semibold text-gray-900">$14.6K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Net Worth</span>
                    <span className="font-semibold text-gray-900">$89.2K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax Rate</span>
                    <span className="font-semibold text-gray-900">21%</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                    Generate Report
                  </button>
                  <button className="w-full bg-white text-red-600 border border-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors">
                    Export Data
                  </button>
                  <button className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                    View Settings
                  </button>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data Sync</span>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Status</span>
                    <span className="text-xs text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Update</span>
                    <span className="text-xs text-gray-500">2 min ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
