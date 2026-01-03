'use client'

import { useState } from 'react'
import { SidebarLayout } from '@/components/SidebarLayout'
import { useAuth } from '@/components/AuthProvider'
import { CreditCard, TrendingUp, TrendingDown, Calendar, Filter, Download, AlertTriangle } from 'lucide-react'

export default function ExpensesPage() {
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
    return <div>Please sign in to access your expense tracking</div>
  }

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ]

  const categories = [
    { value: 'all', label: 'All Expenses' },
    { value: 'operations', label: 'Operations' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'personnel', label: 'Personnel' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'other', label: 'Other' }
  ]

  const expensesData = [
    {
      id: 1,
      date: '2024-04-15',
      description: 'AWS Cloud Services',
      category: 'infrastructure',
      amount: 3500,
      status: 'paid',
      recurring: true
    },
    {
      id: 2,
      date: '2024-04-14',
      description: 'Google Ads Campaign',
      category: 'marketing',
      amount: 2800,
      status: 'paid',
      recurring: false
    },
    {
      id: 3,
      date: '2024-04-13',
      description: 'Office Rent',
      category: 'operations',
      amount: 4500,
      status: 'paid',
      recurring: true
    },
    {
      id: 4,
      date: '2024-04-12',
      description: 'Software Licenses',
      category: 'infrastructure',
      amount: 1200,
      status: 'paid',
      recurring: true
    },
    {
      id: 5,
      date: '2024-04-11',
      description: 'Employee Salaries',
      category: 'personnel',
      amount: 28000,
      status: 'paid',
      recurring: true
    },
    {
      id: 6,
      date: '2024-04-10',
      description: 'Legal Services',
      category: 'other',
      amount: 1500,
      status: 'pending',
      recurring: false
    }
  ]

  const filteredExpenses = expensesData.filter(expense => {
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory
    return matchesCategory
  })

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'operations': return 'bg-blue-100 text-blue-800'
      case 'marketing': return 'bg-purple-100 text-purple-800'
      case 'personnel': return 'bg-orange-100 text-orange-800'
      case 'infrastructure': return 'bg-red-100 text-red-800'
      case 'other': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Management</h1>
              <p className="text-gray-600">Track and categorize all business expenses</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Add Expense
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-red-50">
                  <CreditCard className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-red-600">+8%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">${totalExpenses.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Expenses</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-orange-50">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-red-600">+15%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$41,000</div>
              <div className="text-sm text-gray-500">Personnel Costs</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-50">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-green-600">-5%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$8,000</div>
              <div className="text-sm text-gray-500">Marketing</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-red-600">+12%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$40,300</div>
              <div className="text-sm text-gray-500">Recurring</div>
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
            
            <div className="flex gap-2 flex-wrap">
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

          {/* Expenses Table */}
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
                      Recurring
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(expense.category)}`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-red-600">${expense.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          expense.recurring ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {expense.recurring ? 'Yes' : 'No'}
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

          {/* Expense Breakdown */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown by Category</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-3"></div>
                    <span className="text-gray-700">Personnel</span>
                  </div>
                  <span className="font-semibold text-gray-900">$41,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                    <span className="text-gray-700">Infrastructure</span>
                  </div>
                  <span className="font-semibold text-gray-900">$4,700</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                    <span className="text-gray-700">Operations</span>
                  </div>
                  <span className="font-semibold text-gray-900">$4,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                    <span className="text-gray-700">Marketing</span>
                  </div>
                  <span className="font-semibold text-gray-900">$2,800</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-500 mr-3"></div>
                    <span className="text-gray-700">Other</span>
                  </div>
                  <span className="font-semibold text-gray-900">$1,500</span>
                </div>
              </div>
            </div>

            {/* Expense Trend */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Trend</h3>
              <div className="h-64 mb-4">
                <div className="flex items-end justify-between h-full px-2">
                  {[45, 52, 38, 65, 48, 72, 58, 85, 69, 92, 78, 95].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 mx-1 bg-red-500 rounded-t transition-all duration-300 hover:bg-red-600"
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
      </div>
    </SidebarLayout>
  )
}
