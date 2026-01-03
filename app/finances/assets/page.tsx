'use client'

import { useState } from 'react'
import { SidebarLayout } from '@/components/SidebarLayout'
import { useAuth } from '@/components/AuthProvider'
import { PiggyBank, TrendingUp, TrendingDown, Calendar, Filter, Download, Building, Car, Smartphone, DollarSign } from 'lucide-react'

export default function AssetsPage() {
  const { user, loading, initialCheckDone } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('year')
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
    return <div>Please sign in to access your asset management</div>
  }

  const periods = [
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ]

  const categories = [
    { value: 'all', label: 'All Assets' },
    { value: 'cash', label: 'Cash & Bank' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'property', label: 'Property' },
    { value: 'investments', label: 'Investments' },
    { value: 'other', label: 'Other' }
  ]

  const assetsData = [
    {
      id: 1,
      name: 'Business Bank Account',
      category: 'cash',
      type: 'Bank Account',
      value: 45000,
      currentValue: 45000,
      acquisitionDate: '2024-01-15',
      location: 'Chase Bank',
      status: 'active'
    },
    {
      id: 2,
      name: 'Office Building',
      category: 'property',
      type: 'Real Estate',
      value: 120000,
      currentValue: 135000,
      acquisitionDate: '2023-06-01',
      location: 'Downtown, CA',
      status: 'active'
    },
    {
      id: 3,
      name: 'Company Vehicles',
      category: 'equipment',
      type: 'Vehicles',
      value: 45000,
      currentValue: 38000,
      acquisitionDate: '2023-09-15',
      location: 'Company Fleet',
      status: 'active'
    },
    {
      id: 4,
      name: 'Tech Equipment',
      category: 'equipment',
      type: 'Electronics',
      value: 25000,
      currentValue: 18000,
      acquisitionDate: '2024-02-01',
      location: 'Office',
      status: 'active'
    },
    {
      id: 5,
      name: 'Stock Portfolio',
      category: 'investments',
      type: 'Stocks',
      value: 15000,
      currentValue: 18500,
      acquisitionDate: '2023-12-01',
      location: 'Brokerage Account',
      status: 'active'
    },
    {
      id: 6,
      name: 'Patents & IP',
      category: 'other',
      type: 'Intellectual Property',
      value: 35000,
      currentValue: 42000,
      acquisitionDate: '2023-03-15',
      location: 'Legal Portfolio',
      status: 'active'
    }
  ]

  const filteredAssets = assetsData.filter(asset => {
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory
    return matchesCategory
  })

  const totalAssets = filteredAssets.reduce((sum, asset) => sum + asset.currentValue, 0)
  const totalOriginalValue = filteredAssets.reduce((sum, asset) => sum + asset.value, 0)
  const appreciation = totalAssets - totalOriginalValue

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cash': return 'bg-green-100 text-green-800'
      case 'equipment': return 'bg-blue-100 text-blue-800'
      case 'property': return 'bg-purple-100 text-purple-800'
      case 'investments': return 'bg-orange-100 text-orange-800'
      case 'other': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'sold': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'Bank Account': return <DollarSign className="w-4 h-4" />
      case 'Real Estate': return <Building className="w-4 h-4" />
      case 'Vehicles': return <Car className="w-4 h-4" />
      case 'Electronics': return <Smartphone className="w-4 h-4" />
      default: return <PiggyBank className="w-4 h-4" />
    }
  }

  return (
    <SidebarLayout currentPage="revenue">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Asset Management</h1>
              <p className="text-gray-600">Track company assets and investments</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
              <PiggyBank className="w-4 h-4 mr-2" />
              Add Asset
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-purple-50">
                  <PiggyBank className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+18%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">${totalAssets.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Assets</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-green-50">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+5%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$45,000</div>
              <div className="text-sm text-gray-500">Cash & Bank</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+12%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$135,000</div>
              <div className="text-sm text-gray-500">Property</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-orange-50">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+23%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$54,700</div>
              <div className="text-sm text-gray-500">Investments</div>
            </div>
          </div>

          {/* Asset Performance */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">+15%</div>
                <div className="text-sm text-gray-600">Total Appreciation</div>
                <div className="text-xs text-gray-500 mt-1">${appreciation.toLocaleString()} gained</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
                <div className="text-sm text-gray-600">Total Assets</div>
                <div className="text-xs text-gray-500 mt-1">Active assets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
                <div className="text-sm text-gray-600">Asset Health</div>
                <div className="text-xs text-gray-500 mt-1">Good condition</div>
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

          {/* Assets Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Original Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gain/Loss
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
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
                  {filteredAssets.map((asset) => {
                    const gainLoss = asset.currentValue - asset.value
                    const isGain = gainLoss >= 0
                    
                    return (
                      <tr key={asset.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getAssetIcon(asset.type)}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                              <div className="text-xs text-gray-500">{asset.type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(asset.category)}`}>
                            {asset.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${asset.currentValue.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${asset.value.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${isGain ? 'text-green-600' : 'text-red-600'}`}>
                            {isGain ? '+' : ''}{Math.abs(gainLoss).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {asset.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                            {asset.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Asset Breakdown */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Asset Distribution */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-gray-700">Cash & Bank</span>
                  </div>
                  <span className="font-semibold text-gray-900">$45,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                    <span className="text-gray-700">Property</span>
                  </div>
                  <span className="font-semibold text-gray-900">$135,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                    <span className="text-gray-700">Equipment</span>
                  </div>
                  <span className="font-semibold text-gray-900">$56,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-3"></div>
                    <span className="text-gray-700">Investments</span>
                  </div>
                  <span className="font-semibold text-gray-900">$54,700</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-500 mr-3"></div>
                    <span className="text-gray-700">Other</span>
                  </div>
                  <span className="font-semibold text-gray-900">$42,000</span>
                </div>
              </div>
            </div>

            {/* Asset Timeline */}
            <div className="bg-white p-6 rounded-lg shadow border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Acquisitions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Tech Equipment</div>
                      <div className="text-xs text-gray-500">Acquired: Feb 1, 2024</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">$25,000</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Stock Portfolio</div>
                      <div className="text-xs text-gray-500">Acquired: Dec 1, 2023</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">$15,000</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Patents & IP</div>
                      <div className="text-xs text-gray-500">Acquired: Mar 15, 2023</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">$35,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
