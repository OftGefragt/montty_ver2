'use client'

import { useState } from 'react'
import { SidebarLayout } from '@/components/SidebarLayout'
import { useAuth } from '@/components/AuthProvider'
import AuthLoadingSpinner from '@/components/AuthLoadingSpinner'
import { Search, Filter, Plus, Mail, Phone, Calendar, TrendingUp, Users, Star, MoreVertical } from 'lucide-react'

export default function CustomersPage() {
  const { user, authLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading customers…
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please sign in to access your customers
      </div>
    )
  }

  const filters = [
    { value: 'all', label: 'All Customers' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'new', label: 'New' },
    { value: 'vip', label: 'VIP' }
  ]

  const customers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@techcorp.com',
      company: 'TechCorp Inc.',
      status: 'active',
      value: '$45,200',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      tier: 'vip',
      projects: 12,
      satisfaction: 4.8
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'mchen@startup.io',
      company: 'StartupIO',
      status: 'active',
      value: '$28,900',
      joinDate: '2024-02-20',
      lastActive: '1 day ago',
      tier: 'premium',
      projects: 8,
      satisfaction: 4.5
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.davis@design.co',
      company: 'Design Co',
      status: 'active',
      value: '$15,600',
      joinDate: '2024-03-10',
      lastActive: '3 days ago',
      tier: 'standard',
      projects: 5,
      satisfaction: 4.2
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'dwilson@finance.net',
      company: 'FinanceNet',
      status: 'inactive',
      value: '$67,800',
      joinDate: '2023-12-05',
      lastActive: '2 weeks ago',
      tier: 'vip',
      projects: 18,
      satisfaction: 4.9
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      email: 'lisa@consulting.pro',
      company: 'Consulting Pro',
      status: 'new',
      value: '$8,400',
      joinDate: '2024-04-01',
      lastActive: '1 hour ago',
      tier: 'standard',
      projects: 2,
      satisfaction: 4.0
    }
  ]

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || customer.status === selectedFilter || 
                          (selectedFilter === 'vip' && customer.tier === 'vip') ||
                          (selectedFilter === 'new' && customer.status === 'new')
    
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'new': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'vip': return 'bg-purple-100 text-purple-800'
      case 'premium': return 'bg-orange-100 text-orange-800'
      case 'standard': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <SidebarLayout currentPage="customers">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
              <p className="text-gray-600">Manage and track your customer relationships</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+12%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">2,847</div>
              <div className="text-sm text-gray-500">Total Customers</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-green-50">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+8%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">$165.9K</div>
              <div className="text-sm text-gray-500">Total Revenue</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-green-600">+0.3</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">4.6</div>
              <div className="text-sm text-gray-500">Avg Satisfaction</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-orange-50">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-red-600">-5%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">87%</div>
              <div className="text-sm text-gray-500">Retention Rate</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div className="flex gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedFilter === filter.value
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projects
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Satisfaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                            {customer.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(customer.tier)}`}>
                            {customer.tier}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer.value}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.projects}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-900">{customer.satisfaction}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{customer.lastActive}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Details Panel */}
          {selectedCustomer && (
            <div className="mt-8 bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {(() => {
                const customer = customers.find(c => c.id === selectedCustomer)
                if (!customer) return null
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          +1 (555) 123-4567
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          Joined {customer.joinDate}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Account Details</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-gray-600">Status: </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                            {customer.status}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Tier: </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(customer.tier)}`}>
                            {customer.tier}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Value: </span>
                          <span className="font-medium">{customer.value}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Activity</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-gray-600">Projects: </span>
                          <span className="font-medium">{customer.projects}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Satisfaction: </span>
                          <div className="flex items-center inline">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="font-medium">{customer.satisfaction}</span>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Last Active: </span>
                          <span className="font-medium">{customer.lastActive}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}
