'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

// Montty Logo Component with Wave Animation
function MonttyLogo({ waveProgress }: { waveProgress: number }) {
  console.log('MonttyLogo rendered with waveProgress:', waveProgress);
  
  const rectangles = [
    { baseX: 0, baseY: 8, height: 12, delay: 0 },
    { baseX: 8, baseY: 6, height: 16, delay: 100 },
    { baseX: 16, baseY: 2, height: 24, delay: 200 },
    { baseX: 24, baseY: 4, height: 20, delay: 300 },
    { baseX: 32, baseY: 10, height: 10, delay: 400 },
  ];

  // Calculate wave effect for each rectangle
  const calculateWave = (index: number) => {
    const transitionProgress = waveProgress;
    const wavePosition = transitionProgress * 6;
    
    const rectangleProgress = Math.max(0, Math.min(1, wavePosition - index));
    
    const easeProgress = rectangleProgress < 0.5
      ? 2 * rectangleProgress * rectangleProgress
      : 1 - Math.pow(-2 * rectangleProgress + 2, 2) / 2;
    
    const waveHeight = easeProgress * 15;
    
    return {
      transform: `translateY(${-waveHeight}px)`,
      opacity: 0.8 + easeProgress * 0.2,
      scale: 1 + easeProgress * 0.1
    };
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-10 h-8">
        {rectangles.map((rect, index) => {
          const wave = calculateWave(index);
          return (
            <div
              key={index}
              className="absolute w-2 rounded-full bg-red-600 transition-all duration-300 ease-out"
              style={{
                left: `${rect.baseX}px`,
                top: `${rect.baseY}px`,
                height: `${rect.height}px`,
                ...wave
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [logoWave, setLogoWave] = useState(false)

  const { signUp, signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        // Handle sign up
        const result = await signUp(
          formData.email,
          formData.password,
          formData.name,
          formData.surname
        )

        if (result.error) {
          setError(result.error)
        } else if (result.user) {
          // Redirect immediately without success message
          router.push('/onboarding')
        }
      } else {
        // Handle sign in
        const result = await signIn(formData.email, formData.password)

        if (result.error) {
          setError(result.error)
        } else if (result.user) {
          // Redirect to intended page or dashboard
          const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'
          router.push(redirectTo)
        }
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
        {/* Form Container */}
        <div className="bg-white rounded-2xl p-12 space-y-8 relative">
          {/* Red Light Lining - Side Shadow Effect */}
          <div className="absolute -right-2 top-0 bottom-0 w-1 rounded-r-2xl bg-gradient-to-b from-[#DC2626]/20 via-[#DC2626]/40 to-[#DC2626]/20 blur-sm"></div>
          <div className="absolute -left-2 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-[#DC2626]/20 via-[#DC2626]/40 to-[#DC2626]/20 blur-sm"></div>
          
          {/* Content */}
          <div className="relative">
            {/* Header - Logo Only */}
            <div className="text-center mb-8 relative">
              {/* Subtle Red Glow Around Logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-12 bg-gradient-to-r from-[#DC2626]/8 via-[#DC2626]/12 to-[#DC2626]/8 rounded-full blur-md"></div>
              </div>
              <div className="relative">
                <MonttyLogo waveProgress={logoWave ? 1 : 0} />
              </div>
            </div>

            {/* Form Header - Simplified */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center">
                <h2 className="text-2xl font-light text-gray-500">
                  Welcome
                </h2>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed text-center mb-12">
              Join Montty&apos;s Community of founders today.
            </p>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-3">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-3">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.surname}
                      onChange={(e) => handleInputChange('surname', e.target.value)}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-3">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Privacy Policy Agreement - Only for Sign Up */}
              {isSignUp && (
                <div className="text-left">
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#DC2626] border-gray-300 rounded focus:ring-[#DC2626] mt-0.5"
                      defaultChecked
                    />
                    <span className="text-sm text-gray-500">
                      I agree to the <a href="#" className="text-[#DC2626] hover:text-[#B91C1C] underline">privacy policy</a> and <a href="#" className="text-[#DC2626] hover:text-[#B91C1C] underline">terms</a>.
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-[#DC2626] py-3 px-6 rounded-2xl border border-[#DC2626] hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-all duration-300 text-base font-medium shadow-sm hover:shadow-md"
                onMouseEnter={() => {
                  console.log('Button hover entered, setting logoWave to true');
                  setLogoWave(true);
                }}
                onMouseLeave={() => {
                  console.log('Button hover left, setting logoWave to false');
                  setLogoWave(false);
                }}
              >
                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            {/* Toggle */}
            <div className="text-center mt-8">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                  setSuccess('')
                }}
                className="text-[#DC2626] hover:text-[#B91C1C] font-medium transition-colors z-10 relative"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : 'Need an account? Sign up'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrap the AuthPage with Suspense to handle useSearchParams
function AuthPageWithSuspense() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
    </div>}>
      <AuthPage />
    </Suspense>
  )
}

export default AuthPageWithSuspense
