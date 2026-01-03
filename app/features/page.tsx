'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

// Montty Logo Component
function MonttyLogo() {
  const rectangles = [
    { baseX: 0, baseY: 8, height: 12, delay: 0 },
    { baseX: 8, baseY: 6, height: 16, delay: 100 },
    { baseX: 16, baseY: 2, height: 24, delay: 200 },
    { baseX: 24, baseY: 4, height: 20, delay: 300 },
    { baseX: 32, baseY: 10, height: 10, delay: 400 },
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-10 h-8">
        {rectangles.map((rect, index) => (
          <div 
            key={index} 
            className="absolute w-2 rounded-full bg-red-600"
            style={{ 
              left: `${rect.baseX}px`, 
              top: `${rect.baseY}px`, 
              height: `${rect.height}px`,
            }} 
          />
        ))}
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [suggestions, setSuggestions] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to access feature suggestions</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl p-8 text-center relative">
            <div className="absolute -right-2 top-0 bottom-0 w-1 rounded-r-2xl bg-gradient-to-b from-[#DC2626]/20 via-[#DC2626]/40 to-[#DC2626]/20 blur-sm"></div>
            <div className="absolute -left-2 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-[#DC2626]/20 via-[#DC2626]/40 to-[#DC2626]/20 blur-sm"></div>
            
            <div className="relative">
              <div className="text-center mb-6">
                <div className="w-16 h-12 bg-gradient-to-r from-[#DC2626]/8 via-[#DC2626]/12 to-[#DC2626]/8 rounded-full blur-md mx-auto mb-3"></div>
                <MonttyLogo />
              </div>
              
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-light text-gray-700 mb-3">
                Thank you for your suggestions!
              </h2>
              <p className="text-gray-600 mb-6">
                We'll review your ideas and keep you updated on what's coming next.
              </p>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-white text-[#DC2626] py-3 px-8 rounded-xl border border-[#DC2626] hover:bg-red-50 transition-colors text-lg font-medium"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 relative">
      {/* Back to Landing Arrow */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-8 left-8 p-2 text-gray-400 hover:text-gray-600 transition-colors z-50"
        aria-label="Back to landing"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl p-8 relative">
          <div className="absolute -right-2 top-0 bottom-0 w-1 rounded-r-2xl bg-gradient-to-b from-[#DC2626]/20 via-[#DC2626]/40 to-[#DC2626]/20 blur-sm"></div>
          <div className="absolute -left-2 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-[#DC2626]/20 via-[#DC2626]/40 to-[#DC2626]/20 blur-sm"></div>
          
          <div className="relative">
            {/* Header - More Compact */}
            <div className="text-center mb-6">
              <div className="w-16 h-12 bg-gradient-to-r from-[#DC2626]/8 via-[#DC2626]/12 to-[#DC2626]/8 rounded-full blur-md mx-auto mb-3"></div>
              <MonttyLogo />
            </div>

            <h2 className="text-3xl font-light text-gray-700 text-center mb-3">
              What features would you like to see?
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Help us build Montty better by sharing your ideas and suggestions.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-3">
                  Your Suggestions
                </label>
                <textarea
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all duration-300 resize-none"
                  rows={6}
                  placeholder="Tell us what features you'd love to see in Montty..."
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !suggestions.trim()}
                  className="flex-1 bg-white text-[#DC2626] py-3 px-6 rounded-xl border border-[#DC2626] hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-all duration-300 text-base font-medium"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Suggestions'}
                </button>
                
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="bg-gray-100 text-gray-600 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors text-base font-medium"
                >
                  Skip
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
