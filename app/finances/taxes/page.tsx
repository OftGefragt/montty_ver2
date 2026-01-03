'use client'

import { useState } from 'react'
import { SidebarLayout } from '@/components/SidebarLayout'
import { useAuth } from '@/components/AuthProvider'
import { FileText, Calculator, TrendingUp, TrendingDown, Calendar, Filter, Download, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TaxesPage() {
  const { user, loading, initialCheckDone } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('year')
  const [selectedType, setSelectedType] = useState('all')

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
    return <div>Please sign in to access your tax management</div>
  }

  const periods = [
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ]

  const taxTypes = [
    { value: 'all', label: 'All Taxes' },
    { value: 'income', label: 'Income Tax' },
    { value: 'sales', label: 'Sales Tax' },
    { value: 'property', label: 'Property Tax' },
    { value: 'payroll', label: 'Payroll Tax' },
    { value: 'other', label: 'Other' }
  ]

  const taxData = [
    {
      id: 1,
      type: 'income',
      description: 'Federal Income Tax',
      amount: 18500,
      dueDate: '2024-04-15',
      status: 'paid',
      paidDate: '2024-04-14'
    },
    {
      id: 2,
      type: 'sales',
      description: 'State Sales Tax',
      amount: 3200,
      dueDate: '2024-04-20',
      status: 'pending',
      paidDate: null
    },
    {
      id: 3,
      type: 'payroll',
      description: 'Payroll Taxes',
      amount: 4500,
      dueDate: '2024-04-30',
      status: 'upcoming',
      paidDate: null
    },
    {
      id: 4,
      type: 'property',
      description: 'Office Property Tax',
      amount: 1200,
      dueDate: '2024-06-01',
      status: 'upcoming',
      paidDate: null
    }
  ]

  const filteredTaxes = taxData.filter(tax => {
    const matchesType = selectedType === 'all' || tax.type === selectedType
    return matchesType
  })

  const totalTaxes = filteredTaxes.reduce((sum, tax) => sum + tax.amount, 0)
  const paidTaxes = filteredTaxes.filter(tax => tax.status === 'paid').reduce((sum, tax) => sum + tax.amount, 0)
  const pendingTaxes = filteredTaxes.filter(tax => tax.status === 'pending').reduce((sum, tax) => sum + tax.amount, 0)

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income': return 'bg-blue-100 text-blue-800'
      case 'sales': return 'bg-green-100 text-green-800'
      case 'property': return 'bg-purple-100 text-purple-800'
      case 'payroll': return 'bg-orange-100 text-orange-800'
      case 'other': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <AlertTriangle className="w-4 h-4" />
      case 'upcoming': return <Calendar className="w-4 h-4" />
      case 'overdue': return <AlertTriangle className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <SidebarLayout currentPage="revenue">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tax Management</h1>
              <p className="text-gray-600">Calculate and manage tax obligations efficiently</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Tax Calculator
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-50">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">0%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">${totalTaxes.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Tax Liability</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-green-50">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600">Paid</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">${paidTaxes.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Taxes Paid</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-yellow-50">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-yellow-600">Due Soon</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">${pendingTaxes.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Calculator className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-green-600">-2%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">21%</div>
              <div className="text-sm text-gray-500">Effective Rate</div>
            </div>
          </div>

          {/* Tax Calculator */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tax Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Income Amount</label>
                <input
                  type="number"
                  placeholder="Enter income"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="10">10%</option>
                  <option value="12">12%</option>
                  <option value="21">21%</option>
                  <option value="24">24%</option>
                  <option value="35">35%</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Tax</label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-semibold">
                  $0
                </div>
              </div>
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
              {taxTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedType === type.value
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Taxes Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTaxes.map((tax) => (
                    <tr key={tax.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(tax.type)}`}>
                          {tax.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{tax.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${tax.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tax.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tax.status)} mr-2`}>
                            {tax.status}
                          </span>
                          {getStatusIcon(tax.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tax.paidDate || '-'}
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

          {/* Tax Summary */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tax Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                    <span className="text-gray-700">Income Tax</span>
                  </div>
                  <span className="font-semibold text-gray-900">$18,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-gray-700">Sales Tax</span>
                  </div>
                  <span className="font-semibold text-gray-900">$3,200</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-3"></div>
                    <span className="text-gray-700">Payroll Tax</span>
                  </div>
                  <span className="font-semibold text-gray-900">$4,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                    <span className="text-gray-700">Property Tax</span>
                  </div>
                  <span className="font-semibold text-gray-900">$1,200</span>
                </div>
              </div>
            </div>

            {/* Tax Calendar */}
            <div className="bg-white p-6 rounded-lg shadow border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tax Deadlines</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">State Sales Tax</div>
                      <div className="text-xs text-gray-600">Due in 5 days</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-red-600">$3,200</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Payroll Taxes</div>
                      <div className="text-xs text-gray-600">Due in 15 days</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">$4,500</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Office Property Tax</div>
                      <div className="text-xs text-gray-600">Due in 45 days</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">$1,200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
