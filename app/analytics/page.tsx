'use client'

import { useState } from 'react'
import { SidebarLayout } from '@/components/SidebarLayout'
import { useAuth } from '@/components/AuthProvider'
import AuthLoadingSpinner from '@/components/AuthLoadingSpinner'
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Calendar } from 'lucide-react'

export default function AnalyticsPage() {
  const { user, authLoading } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading analytics…
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please sign in to access your analytics
      </div>
    )
  }

  const periods = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ]

  const metrics = [
    { value: 'revenue', label: 'Revenue', icon: DollarSign, color: 'text-green-600' },
    { value: 'users', label: 'Users', icon: Users, color: 'text-blue-600' },
    { value: 'growth', label: 'Growth', icon: TrendingUp, color: 'text-purple-600' },
    { value: 'activity', label: 'Activity', icon: Activity, color: 'text-orange-600' }
  ]

  const chartData = {
    revenue: [45, 52, 38, 65, 48, 72, 58, 85, 69, 92, 78, 105],
    users: [120, 135, 125, 145, 160, 155, 175, 190, 185, 210, 205, 225],
    growth: [2.1, 2.3, 2.0, 2.5, 2.4, 2.8, 2.6, 3.1, 2.9, 3.4, 3.2, 3.8],
    activity: [85, 92, 78, 95, 88, 102, 96, 110, 105, 118, 112, 125]
  }

  const currentMetricData = chartData[selectedMetric as keyof typeof chartData]

  return (
    <SidebarLayout currentPage="analytics">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">
              Track your startup's performance and growth metrics
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex flex-wrap gap-2">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Last updated: 2 min ago</span>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => {
              const Icon = metric.icon
              const value = metric.value === 'revenue' ? '$124.5K' :
                          metric.value === 'users' ? '2,847' :
                          metric.value === 'growth' ? '3.8%' : '125'
              const change = metric.value === 'revenue' ? '+12%' :
                           metric.value === 'users' ? '+8%' :
                           metric.value === 'growth' ? '+0.4%' : '+15%'
              const isPositive = !change.includes('-')
              
              return (
                <div key={metric.value} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-gray-50`}>
                      <Icon className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    <div className={`flex items-center text-sm font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
                  <div className="text-sm text-gray-500">{metric.label}</div>
                </div>
              )
            })}
          </div>

          {/* Main Chart */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
              <div className="flex space-x-2">
                {metrics.map((metric) => (
                  <button
                    key={metric.value}
                    onClick={() => setSelectedMetric(metric.value)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedMetric === metric.value
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-64 mb-4">
              <div className="flex items-end justify-between h-full px-2">
                {currentMetricData.map((value, i) => (
                  <div
                    key={i}
                    className="flex-1 mx-1 bg-red-500 rounded-t transition-all duration-300 hover:bg-red-600"
                    style={{ height: `${(value / Math.max(...currentMetricData)) * 100}%` }}
                  />
                ))}
              </div>
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
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Detailed Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-gray-700">Product Sales</span>
                  </div>
                  <span className="font-semibold text-gray-900">$89,200</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                    <span className="text-gray-700">Services</span>
                  </div>
                  <span className="font-semibold text-gray-900">$24,800</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                    <span className="text-gray-700">Subscriptions</span>
                  </div>
                  <span className="font-semibold text-gray-900">$10,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-3"></div>
                    <span className="text-gray-700">Other</span>
                  </div>
                  <span className="font-semibold text-gray-900">$5,000</span>
                </div>
              </div>
            </div>

            {/* User Analytics */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Analytics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Daily Active Users</span>
                  <span className="font-semibold text-gray-900">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Weekly Active Users</span>
                  <span className="font-semibold text-gray-900">3,892</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Monthly Active Users</span>
                  <span className="font-semibold text-gray-900">8,476</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">New Users (30d)</span>
                  <span className="font-semibold text-green-600">+1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Retention Rate</span>
                  <span className="font-semibold text-gray-900">87.3%</span>
                </div>
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">Visitors</div>
                  <div className="flex-1 mx-3">
                    <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">45.2K</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">Sign-ups</div>
                  <div className="flex-1 mx-3">
                    <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">30.7K</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">Active</div>
                  <div className="flex-1 mx-3">
                    <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">20.3K</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">Paying</div>
                  <div className="flex-1 mx-3">
                    <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">12.7K</span>
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Features</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Dashboard Analytics</span>
                  <span className="text-sm font-semibold text-green-600">+34%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Financial Reports</span>
                  <span className="text-sm font-semibold text-green-600">+28%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Revenue Tracking</span>
                  <span className="text-sm font-semibold text-green-600">+22%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">User Management</span>
                  <span className="text-sm font-semibold text-green-600">+18%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Export Tools</span>
                  <span className="text-sm font-semibold text-green-600">+15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
