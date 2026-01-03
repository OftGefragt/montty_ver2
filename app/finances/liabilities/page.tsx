'use client'

import { useState } from 'react'
import { SidebarLayout } from '@/components/SidebarLayout'
import { useAuth } from '@/components/AuthProvider'
import { Calculator, TrendingUp, TrendingDown, Calendar, Filter, Download, AlertTriangle, CreditCard, FileText, Clock, Building } from 'lucide-react'

export default function LiabilitiesPage() {
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
    return <div>Please sign in to access your liability management</div>
  }

  const periods = [
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ]

  const liabilityTypes = [
    { value: 'all', label: 'All Liabilities' },
    { value: 'loans', label: 'Loans' },
    { value: 'credit-cards', label: 'Credit Cards' },
    { value: 'accounts-payable', label: 'Accounts Payable' },
    { value: 'mortgage', label: 'Mortgage' },
    { value: 'other', label: 'Other' }
  ]

  const liabilitiesData = [
    {
      id: 1,
      name: 'Business Loan - Bank of America',
      type: 'loans',
      amount: 50000,
      interestRate: 5.5,
      monthlyPayment: 850,
      dueDate: '2024-05-01',
      startDate: '2023-05-01',
      endDate: '2028-05-01',
      status: 'active'
    },
    {
      id: 2,
      name: 'Office Building Mortgage',
      type: 'mortgage',
      amount: 80000,
      interestRate: 4.2,
      monthlyPayment: 1200,
      dueDate: '2024-04-01',
      startDate: '2022-04-01',
      endDate: '2052-04-01',
      status: 'active'
    },
    {
      id: 3,
      name: 'Business Credit Cards',
      type: 'credit-cards',
      amount: 12000,
      interestRate: 18.9,
      monthlyPayment: 2500,
      dueDate: '2024-04-15',
      startDate: '2023-08-01',
      endDate: null,
      status: 'active'
    },
    {
      id: 4,
      name: 'Vendor Payments',
      type: 'accounts-payable',
      amount: 8500,
      interestRate: 0,
      monthlyPayment: 8500,
      dueDate: '2024-04-20',
      startDate: '2024-04-01',
      endDate: null,
      status: 'pending'
    },
    {
      id: 5,
      name: 'Equipment Lease',
      type: 'other',
      amount: 15000,
      interestRate: 6.8,
      monthlyPayment: 450,
      dueDate: '2024-04-10',
      startDate: '2023-01-01',
      endDate: '2025-12-31',
      status: 'active'
    }
  ]

  const filteredLiabilities = liabilitiesData.filter(liability => {
    const matchesType = selectedType === 'all' || liability.type === selectedType
    return matchesType
  })

  const totalLiabilities = filteredLiabilities.reduce((sum, liability) => sum + liability.amount, 0)
  const totalMonthlyPayments = filteredLiabilities.reduce((sum, liability) => sum + liability.monthlyPayment, 0)
  const averageInterestRate = filteredLiabilities.length > 0 
    ? (filteredLiabilities.reduce((sum, liability) => sum + liability.interestRate, 0) / filteredLiabilities.length).toFixed(1)
    : 0

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'loans': return 'bg-blue-100 text-blue-800'
      case 'credit-cards': return 'bg-red-100 text-red-800'
      case 'accounts-payable': return 'bg-orange-100 text-orange-800'
      case 'mortgage': return 'bg-purple-100 text-purple-800'
      case 'other': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'paid': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLiabilityIcon = (type: string) => {
    switch (type) {
      case 'loans': return <FileText className="w-4 h-4" />
      case 'credit-cards': return <CreditCard className="w-4 h-4" />
      case 'accounts-payable': return <Calculator className="w-4 h-4" />
      case 'mortgage': return <Building className="w-4 h-4" />
      case 'other': return <Clock className="w-4 h-4" />
      default: return <Calculator className="w-4 h-4" />
    }
  }

  return (
    <SidebarLayout currentPage="revenue">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Liability Management</h1>
              <p className="text-gray-600">Manage debts and financial obligations</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Add Liability
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-red-50">
                  <Calculator className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-red-600">-5%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">${totalLiabilities.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Liabilities</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-50">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">-2%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$65,000</div>
              <div className="text-sm text-gray-500">Business Loans</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">-3%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$80,000</div>
              <div className="text-sm text-gray-500">Mortgage</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-orange-50">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">+8%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">${totalMonthlyPayments.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Monthly Payments</div>
            </div>
          </div>

          {/* Debt Analysis */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Debt Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">8.9%</div>
                <div className="text-sm text-gray-600">Average Interest Rate</div>
                <div className="text-xs text-gray-500 mt-1">Weighted average</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">4.2 years</div>
                <div className="text-sm text-gray-600">Average Term</div>
                <div className="text-xs text-gray-500 mt-1">Weighted average</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">42%</div>
                <div className="text-sm text-gray-600">Debt-to-Asset Ratio</div>
                <div className="text-xs text-gray-500 mt-1">Healthy range: &lt;50%</div>
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
              {liabilityTypes.map((type) => (
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

          {/* Liabilities Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liability Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interest Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
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
                  {filteredLiabilities.map((liability) => (
                    <tr key={liability.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getLiabilityIcon(liability.type)}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{liability.name}</div>
                            <div className="text-xs text-gray-500">{liability.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(liability.type)}`}>
                          {liability.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${liability.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{liability.interestRate}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${liability.monthlyPayment.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {liability.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(liability.status)}`}>
                          {liability.status}
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

          {/* Debt Schedule */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Payments */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Payments</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Business Credit Cards</div>
                      <div className="text-xs text-gray-600">Due in 2 days</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-red-600">$2,500</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-yellow-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Vendor Payments</div>
                      <div className="text-xs text-gray-600">Due in 7 days</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-yellow-600">$8,500</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-blue-600 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Business Loan Payment</div>
                      <div className="text-xs text-gray-600">Due in 15 days</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">$850</span>
                </div>
              </div>
            </div>

            {/* Debt Reduction Strategy */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Debt Reduction Strategy</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Extra Monthly Payment</span>
                  <span className="text-sm font-medium text-green-600">Save $2,400/year</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Refinance High-Interest Debt</span>
                  <span className="text-sm font-medium text-green-600">Save $1,800/year</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Consolidate Small Loans</span>
                  <span className="text-sm font-medium text-green-600">Save $600/year</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Negotiate Better Rates</span>
                  <span className="text-sm font-medium text-green-600">Save $1,200/year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
