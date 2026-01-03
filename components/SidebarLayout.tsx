'use client'

import React, { useState } from 'react'
import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  UserCircle,
  FileText
} from 'lucide-react'

interface SidebarLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

export function SidebarLayout({ children, currentPage = 'dashboard' }: SidebarLayoutProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
  }

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: currentPage === 'dashboard'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      current: currentPage === 'analytics'
    },
    {
      name: 'Revenue',
      href: '/revenue',
      icon: DollarSign,
      current: currentPage === 'revenue'
    },
    {
      name: 'Customers',
      href: '/customers',
      icon: Users,
      current: currentPage === 'customers'
    },
    {
      name: 'Growth',
      href: '/growth',
      icon: TrendingUp,
      current: currentPage === 'growth'
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: FileText,
      current: currentPage === 'reports'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: currentPage === 'settings'
    },
    {
      name: 'Help',
      href: '/help',
      icon: HelpCircle,
      current: currentPage === 'help'
    }
  ]

  if (!user) {
    return <div>Please sign in to access the application</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Montty</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name} {user.surname}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${item.current 
                      ? 'bg-red-50 text-red-700 border-r-2 border-red-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Sign out button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
