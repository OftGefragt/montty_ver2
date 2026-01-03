'use client'

import { SidebarLayout } from '@/components/SidebarLayout'

export default function SettingsPage() {
  return (
    <SidebarLayout currentPage="settings">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Account settings coming soon...</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
