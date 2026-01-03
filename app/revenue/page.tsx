'use client'

import React from 'react'
import { SidebarLayout } from '@/components/SidebarLayout'
import { useAuth } from '@/components/AuthProvider'
import AuthLoadingSpinner from '@/components/AuthLoadingSpinner'
import { DollarSign, CreditCard, PiggyBank, FileText, Calculator, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function RevenuePage() {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading finances…
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please sign in to access your finances
      </div>
    )
  }
  const financePages = [
    {
      title: 'Income Management',
      description: 'Track all revenue streams and income sources',
      icon: DollarSign,
      color: 'text-green-600',
      href: '/finances/income',
      stats: { value: '$124.5K', change: '+12%', color: 'text-green-600' }
    },
    {
      title: 'Expense Tracking',
      description: 'Monitor and categorize all business expenses',
      icon: CreditCard,
      color: 'text-red-600',
      href: '/finances/expenses',
      stats: { value: '$89.3K', change: '+8%', color: 'text-red-600' }
    },
    {
      title: 'Tax Management',
      description: 'Calculate and manage tax obligations efficiently',
      icon: FileText,
      color: 'text-blue-600',
      href: '/finances/taxes',
      stats: { value: '$26.2K', change: '0%', color: 'text-gray-600' }
    },
    {
      title: 'Asset Management',
      description: 'Track company assets and investments',
      icon: PiggyBank,
      color: 'text-purple-600',
      href: '/finances/assets',
      stats: { value: '$234.7K', change: '+18%', color: 'text-green-600' }
    },
    {
      title: 'Liability Management',
      description: 'Manage debts and financial obligations',
      icon: Calculator,
      color: 'text-orange-600',
      href: '/finances/liabilities',
      stats: { value: '$77.9K', change: '-5%', color: 'text-red-600' }
    }
  ]

  return (
    <SidebarLayout currentPage="revenue">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Finances</h1>
            <p className="text-gray-600">
              Manage your startup's financial health and obligations
            </p>
          </div>

          {/* Finance Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financePages.map((page, index) => (
              <Link key={index} href={page.href} className="group">
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-red-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gray-50">
                      <page.icon className={`w-6 h-6 ${page.color}`} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{page.title}</h3>
                  <p className="text-gray-600 mb-4">{page.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">{page.stats.value}</span>
                    <span className={`text-sm font-medium ${page.stats.color}`}>{page.stats.change}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Overview */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">$124.5K</div>
                <div className="text-sm text-gray-500">Total Income</div>
                <div className="text-xs text-green-600 font-medium mt-2">+12% from last month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">$89.3K</div>
                <div className="text-sm text-gray-500">Total Expenses</div>
                <div className="text-xs text-red-600 font-medium mt-2">+8% from last month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">$26.2K</div>
                <div className="text-sm text-gray-500">Taxes</div>
                <div className="text-xs text-gray-500 font-medium mt-2">21% effective rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">$156.8K</div>
                <div className="text-sm text-gray-500">Net Worth</div>
                <div className="text-xs text-green-600 font-medium mt-2">+15% from last year</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                Generate Financial Report
              </button>
              <button className="bg-white text-red-600 border border-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors">
                Export Financial Data
              </button>
              <button className="bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                Tax Calculator
              </button>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
