'use client'

import { useState } from 'react'
import { SidebarLayout } from '@/components/SidebarLayout'
import { useAuth } from '@/components/AuthProvider'
import { DollarSign, TrendingUp, TrendingDown, Calendar, Filter, Download } from 'lucide-react'

export default function IncomePage() {
  const { user, loading, initialCheckDone } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Show loading spinner while checking authentication
  if (loading || !initialCheckDone) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  // Show sign-in message only after initial check is complete and user is not authenticated
  if (!user) {
    return <div>Please sign in to access your income management</div>
  }

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ]

  const categories = [
    { value: 'all', label: 'All Income' },
    { value: 'sales', label: 'Sales' },
    { value: 'services', label: 'Services' },
    { value: 'subscriptions', label: 'Subscriptions' },
    { value: 'other', label: 'Other' }
  ]

  const incomeData = [
    {
      id: 1,
      date: '2024-04-15',
      description: 'Enterprise Plan - TechCorp',
      category: 'sales',
      amount: 45000,
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-04-14',
      description: 'Consulting Services - StartupIO',
      category: 'services',
      amount: 12500,
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-04-13',
      description: 'Monthly Subscriptions',
      category: 'subscriptions',
      amount: 8900,
      status: 'completed'
    },
    {
      id: 4,
      date: '2024-04-12',
      description: 'Product Sales - Design Co',
      category: 'sales',
      amount: 15600,
      status: 'completed'
    },
    {
      id: 5,
      date: '2024-04-11',
      description: 'Licensing Fees',
      category: 'other',
      amount: 3200,
      status: 'completed'
    }
  ]

  const filteredIncome = incomeData.filter(income => {
    const matchesCategory = selectedCategory === 'all' || income.category === selectedCategory
    return matchesCategory
  })

  const totalIncome = filteredIncome.reduce((sum, income) => sum + income.amount, 0)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sales': return 'bg-green-100 text-green-800'
      case 'services': return 'bg-blue-100 text-blue-800'
      case 'subscriptions': return 'bg-purple-100 text-purple-800'
      case 'other': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <SidebarLayout currentPage="revenue">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Income Management</h1>
              <p className="text-gray-600">Track and analyze all revenue streams</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Add Income
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-green-50">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+12%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">${totalIncome.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Income</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-50">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+8%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$85,200</div>
              <div className="text-sm text-gray-500">Sales Revenue</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+15%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$26,800</div>
              <div className="text-sm text-gray-500">Recurring Income</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-orange-50">
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-red-600">-3%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$12,500</div>
              <div className="text-sm text-gray-500">One-time Income</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex gap-2">
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
            
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Income Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIncome.map((income) => (
                    <tr key={income.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {income.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{income.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(income.category)}`}>
                          {income.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">${income.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {income.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Income Chart */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Trend</h3>
            <div className="h-64 mb-4">
              <div className="flex items-end justify-between h-full px-2">
                {[65, 72, 58, 85, 69, 92, 78, 105, 88, 95, 102, 110].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 mx-1 bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                    style={{ height: `${height}%` }}
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
        </div>
      </div>
    </SidebarLayout>
  )
}
