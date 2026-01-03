'use client'

import { SidebarLayout } from '@/components/SidebarLayout'

export default function ReportsPage() {
  return (
    <SidebarLayout currentPage="reports">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Financial reports coming soon...</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
