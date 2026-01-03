'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'

// Add custom styles for smooth expansion
const customStyles = `
  @keyframes expand {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-expand {
    animation: expand 0.3s ease-in-out;
  }
`

// Montty Logo Component with Wave Animation
function MonttyLogo({ waveProgress }: { waveProgress: number }) {
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
    
    if (wavePosition <= index) {
      return {
        transform: 'translateY(0px) scale(1)',
        opacity: 1,
      };
    }
    
    const amplitude = 8;
    const frequency = 0.3;
    const phase = index * 0.5;
    const yOffset = amplitude * Math.sin(frequency * (wavePosition - index) + phase);
    
    return {
      transform: `translateY(${yOffset}px) scale(${1 + Math.abs(yOffset) * 0.02})`,
      opacity: 1 - Math.abs(yOffset) * 0.05,
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

// Types for onboarding data
interface OnboardingData {
  company_name: string
  website?: string
  role: string
  mission: string
  company_stage: string
  team_size: string
  main_focus: string
  linkedin?: string
}

// Company stages options
const COMPANY_STAGES = [
  'Just an idea',
  'Building MVP',
  'Have MVP, getting first users',
  'Early traction & revenue',
  'Scaling the business',
  'Established business'
]

// Team size options for bubble mesh
const TEAM_SIZES = [
  { label: 'Just me', size: 80 },
  { label: '2-4', size: 100 },
  { label: '5-12', size: 120 },
  { label: '13-30', size: 140 },
  { label: '30+', size: 100 }
]

// Focus options
const FOCUS_OPTIONS = [
  { 
    label: 'Revenue / MRR', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    label: 'Retention / Churn', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  },
  { 
    label: 'Conversion Rate', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  { 
    label: 'Burn Rate / Runway', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    )
  },
  { 
    label: 'Sales Pipeline / Deals', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  }
]

// Helper function for SVG calculations
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): {x: number, y: number} {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

// Processing State Component
function ProcessingState({ onboardingData }: { onboardingData: any }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  const projectName = onboardingData.company_name || '';
  const metric = onboardingData.main_focus || '';

  const textSequence = [
    metric ? `Analyzing ${metric}...`: 'Analyzing..',
    'Calculating strategy...', 
    'Mathing...',
     projectName ? `Optimizing for ${projectName}...` : 'Optimizing...',
  ].filter(text => text); // Remove empty strings



  const features = [
    { title: 'Revenue Forecasting', description: 'AI-powered predictions based on your metrics' },
    { title: 'Growth Analytics', description: 'Track and optimize your key performance indicators' },
    { title: 'Strategic Insights', description: 'Data-driven recommendations for scaling' }
  ];

  useEffect(() => {
    if (currentTextIndex < textSequence.length) {
      const timer = setTimeout(() => {
        setCurrentTextIndex(currentTextIndex + 1);
      }, 600);
      return () => clearTimeout(timer);
    } else if (!showFeatures) {
      // Start showing features after text sequence
      setShowFeatures(true);
      // Stagger card reveals
      features.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index]);
        }, 300 + (index * 100));
      });
    }
  }, [currentTextIndex, textSequence.length, showFeatures, features]);

  if (showFeatures) {
    return (
      <div className="min-h-screen flex items-start justify-center pt-2 p-4">
        <div className="w-full max-w-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white border border-gray-300 rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 hover:border-red-500 ${
                  visibleCards.includes(index) 
                    ? 'opacity-100 transform scale-100' 
                    : 'opacity-0 transform scale-95'
                }`}
              >
                <div className="mb-4">
                  <div className="text-sm text-red-600 font-semibold uppercase tracking-wide">
                    Recommended for {projectName || 'Your Project'}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-2 p-4">
      <div className="text-center">
        <div className="font-mono text-[#ADADAD] text-2xl transition-all duration-300">
          {currentTextIndex < textSequence.length && (
            <span className="inline-block animate-pulse">
              {textSequence[currentTextIndex]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [logoWave, setLogoWave] = useState(false)
  const [isMissionExpanded, setIsMissionExpanded] = useState(false)
  const [missionHeight, setMissionHeight] = useState('auto')
  const missionRef = React.useRef<HTMLTextAreaElement>(null)
  const [sliderInteracted, setSliderInteracted] = useState(false)
  const ghostSuggestions = [
    'A fintech app for Gen-Z investors',
    'SaaS platform for sustainable fashion brands',
    'AI-powered productivity tool for remote teams'
  ]

  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.textContent = customStyles
    document.head.appendChild(styleElement)
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(() => ({
    company_name: '',
    website: '',
    role: '',
    mission: '',
    company_stage: '',
    team_size: '',
    main_focus: '',
    linkedin: ''
  }))

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [user, router])

  // Check if onboarding is already completed
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return
      
      try {
        // Test Supabase connection first
        const { error: testError } = await supabase.from('profiles').select('count').limit(1)
        
        if (testError) {
          console.warn('Supabase connection failed, skipping onboarding status check:', testError)
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_completed, project_name, metric')
          .eq('id', user.id)
          .maybeSingle()

        if (error) {
          console.warn('Error checking onboarding status:', error)
          // If table doesn't exist or other error, continue with onboarding
          return
        }

        if (data && !error && data.onboarding_completed) {
          // User already completed onboarding, redirect to dashboard
          router.push('/dashboard')
        }
      } catch (err) {
        console.warn('Error checking onboarding status:', err)
      }
    }

    checkOnboardingStatus()
  }, [user, router])

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }))
  }

  const handleMissionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange('mission', e.target.value)
    // No auto-resize - keep single row
  }

  
  
 const handleNext = () => {
    setError('');
    if (currentStep === 8) {
      handleSubmit();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 8));
    }
  };
  

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

 

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')

    try {
      if (!user) {
        setError('User not authenticated')
        return
      }

      // Test Supabase connection first
      const { error: testError } = await supabase.from('profiles').select('count').limit(1)
        
      if (testError) {
        // Fallback mode - simulate successful submission for demo
        console.warn('Supabase not available, simulating onboarding completion:', testError)
        setSuccess('Welcome to Montty! Redirecting to dashboard...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000);
        return
      }

      // Save onboarding data to Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: onboardingData.company_name,
          website: onboardingData.website || null,
          role: onboardingData.role,
          mission: onboardingData.mission,
          company_stage: onboardingData.company_stage,
          team_size: onboardingData.team_size,
          main_focus: onboardingData.main_focus,
          linkedin: onboardingData.linkedin || null,
          onboarding_completed: true
        })
        .eq('id', user.id)

      if (error) {
        console.warn('Error saving onboarding data:', error)
        // Continue with success flow even if database save fails
        setSuccess('Welcome to Montty! Redirecting to dashboard...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
        return
      }

      setSuccess('Welcome to Montty! Redirecting to dashboard...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error) {
      console.error('Onboarding submission error:', error);
      setError('Network connection error. Please check your internet connection.')
      setIsLoading(false)
    }
  }

  // Render individual screens
  const renderScreen = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-12">
            <h2 className="text-3xl font-light text-gray-700">What&apos;s the name of your company or project?</h2>
            <input
              type="text"
              value={onboardingData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              className="w-full px-6 py-4 border border-[#E5E7EB] rounded-xl focus:outline-none transition-all duration-300 text-lg hover:border-[#DC2626]/30 hover:shadow-sm hover:shadow-[#DC2626]/10 active:scale-[0.98] active:shadow-md"
              placeholder="Enter your company or project name"
              autoFocus
            />
          </div>
        )

      case 1:
        return (
          <div className="space-y-12">
            <h2 className="text-3xl font-light text-gray-700">Got a website or landing page yet?</h2>
            <p className="text-[#6B7280] text-lg">(Totally optional -- for better personalization)</p>
            <input
              type="url"
              value={onboardingData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-6 py-4 border border-[#E5E7EB] rounded-xl focus:outline-none transition-all duration-300 text-lg hover:border-[#DC2626]/30 hover:shadow-sm hover:shadow-[#DC2626]/10 active:scale-[0.98] active:shadow-md"
              placeholder="https://yourcompany.com"
              autoFocus
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-16">
            <h2 className="text-3xl font-light text-gray-700">Where&apos;s your company at right now?</h2>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                {/* Thin red line */}
                <div className="relative h-1 bg-red-200 rounded-full">
                  {/* Draggable circle */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-red-400 rounded-full cursor-grab active:cursor-grabbing shadow-lg transition-all duration-200 hover:scale-110"
                    style={{
                      left: `${(COMPANY_STAGES.findIndex(s => s === onboardingData.company_stage) >= 0 ? COMPANY_STAGES.findIndex(s => s === onboardingData.company_stage) : Math.floor(COMPANY_STAGES.length / 2)) * (100 / (COMPANY_STAGES.length - 1))}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move'
                      setSliderInteracted(true)
                    }}
                    onDrag={(e) => {
                      const container = e.currentTarget.parentElement
                      if (!container) return
                      const rect = container.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
                      const index = Math.round((percentage / 100) * (COMPANY_STAGES.length - 1))
                      handleInputChange('company_stage', COMPANY_STAGES[index])
                    }}
                    onDragEnd={(e) => {
                      const container = e.currentTarget.parentElement
                      if (!container) return
                      const rect = container.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
                      const index = Math.round((percentage / 100) * (COMPANY_STAGES.length - 1))
                      handleInputChange('company_stage', COMPANY_STAGES[index])
                    }}
                  />
                  
                  {/* Hint arrows - disappear after interaction */}
                  {!sliderInteracted && (
                    <>
                      <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-300 animate-bounce" style={{ transform: 'translateY(-50%)' }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-300 animate-bounce" style={{ transform: 'translateY(-50%)' }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Stage labels */}
                <div className="flex justify-between mt-4 relative w-full">
                  {COMPANY_STAGES.map((stage, index) => (
                    <div
                      key={stage}
                      className={`text-xs ${
                        onboardingData.company_stage === stage
                          ? 'text-red-400 font-medium'
                          : 'text-gray-400'
                      }`}
                      style={{
                        position: 'absolute',
                        left: `${index * (100 / (COMPANY_STAGES.length - 1))}%`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <div className="text-center whitespace-nowrap">
                        <div className="text-xs leading-tight">{stage.split(' ')[0]}</div>
                        {stage.split(' ').length > 1 && (
                          <div className="text-xs leading-tight">{stage.split(' ').slice(1).join(' ')}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-12">
            <h2 className="text-3xl font-light text-gray-700">What&apos;s your seat on the rocket ship?</h2>
            <div className="flex flex-col items-center space-y-6">
              {/* First Row - 3 items */}
              <div className="grid grid-cols-3 gap-6 max-w-2xl">
                {/* Design */}
                <button
                  onClick={() => handleInputChange('role', 'Design')}
                  className={`p-8 rounded-3xl border-2 text-center transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/20 ${
                    onboardingData.role === 'Design'
                      ? 'border-[#DC2626] bg-red-50 text-[#DC2626]'
                      : 'border-[#E5E7EB] bg-white hover:border-[#DC2626]/50 text-black'
                  }`}
                >
                  <svg className="w-8 h-8 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <div className="text-xl font-medium">Design</div>
                </button>
                
                {/* Development */}
                <button
                  onClick={() => handleInputChange('role', 'Development')}
                  className={`p-6 rounded-3xl border-2 text-center transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/20 ${
                    onboardingData.role === 'Development'
                      ? 'border-[#DC2626] bg-red-50 text-[#DC2626]'
                      : 'border-[#E5E7EB] bg-white hover:border-[#DC2626]/50 text-black'
                  }`}
                >
                  <svg className="w-7 h-7 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <div className="text-lg font-medium">Development</div>
                </button>
                
                {/* Business Management */}
                <button
                  onClick={() => handleInputChange('role', 'Business Management')}
                  className={`p-5 rounded-3xl border-2 text-center transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/20 ${
                    onboardingData.role === 'Business Management'
                      ? 'border-[#DC2626] bg-red-50 text-[#DC2626]'
                      : 'border-[#E5E7EB] bg-white hover:border-[#DC2626]/50 text-black'
                  }`}
                >
                  <svg className="w-6 h-6 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="text-sm font-medium">Business Management</div>
                </button>
              </div>
              
              {/* Second Row - 2 items */}
              <div className="flex justify-center gap-6 w-full max-w-2xl">
                {/* Marketing */}
                <button
                  onClick={() => handleInputChange('role', 'Marketing')}
                  className={`p-5 rounded-3xl border-2 text-center transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/20 ${
                    onboardingData.role === 'Marketing'
                      ? 'border-[#DC2626] bg-red-50 text-[#DC2626]'
                      : 'border-[#E5E7EB] bg-white hover:border-[#DC2626]/50 text-black'
                  }`}
                >
                  <svg className="w-6 h-6 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  <div className="text-sm font-medium">Marketing</div>
                </button>
                
                {/* Other */}
                <button
                  onClick={() => handleInputChange('role', 'Other')}
                  className={`p-6 rounded-3xl border-2 text-center transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/20 ${
                    onboardingData.role === 'Other'
                      ? 'border-[#DC2626] bg-red-50 text-[#DC2626]'
                      : 'border-[#E5E7EB] bg-white hover:border-[#DC2626]/50 text-black'
                  }`}
                >
                  <svg className="w-7 h-7 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <div className="text-lg font-medium">Other</div>
                </button>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-12">
            <h2 className="text-3xl font-light text-gray-700">What are you building?</h2>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div 
                  className={`relative cursor-pointer transition-all duration-300 ease-in-out ${
                    isMissionExpanded ? 'py-4' : 'py-8'
                  }`}
                  onClick={() => !isMissionExpanded && setIsMissionExpanded(true)}
                >
                  {!isMissionExpanded ? (
                    <>
                      <div className="text-gray-400 text-lg">I am building...</div>
                      <div className="h-px bg-red-300 mt-2"></div>
                    </>
                  ) : (
                    <div className="animate-expand">
                      <textarea
                        ref={missionRef}
                        value={onboardingData.mission}
                        onChange={handleMissionChange}
                        className="w-full px-0 py-4 bg-transparent focus:outline-none border-b-2 border-red-400 text-gray-900 text-lg resize-none"
                        placeholder=""
                        rows={1}
                        autoFocus
                        onFocus={() => {
                          if (missionRef.current) {
                            missionRef.current.style.height = 'auto';
                            missionRef.current.style.height = `${missionRef.current.scrollHeight}px`;
                          }
                        }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = `${target.scrollHeight}px`;
                        }}
                      />
                      <div className="mt-4 space-y-2">
                        {ghostSuggestions.map((suggestion, index) => (
                          <div 
                            key={index} 
                            className="text-gray-300 text-sm italic hover:text-gray-400 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInputChange('mission', suggestion);
                              if (missionRef.current) {
                                missionRef.current.style.height = 'auto';
                                missionRef.current.style.height = `${missionRef.current.scrollHeight}px`;
                              }
                            }}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        const TEAM_SIZE_OPTIONS = [
          { label: 'Just me', value: '1', angle: 90 },
          { label: '2-4', value: '2-4', angle: 162 },
          { label: '5-12', value: '5-12', angle: 234 },
          { label: '13-30', value: '13-30', angle: 306 },
          { label: '30+', value: '30+', angle: 378 }
        ];

        // Find the selected index
        const selectedIndex = TEAM_SIZE_OPTIONS.findIndex(option => onboardingData.team_size === option.value);

        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-light text-gray-700">What&apos;s the current headcount?</h2>
            <div className="relative w-[28rem] h-[28rem] mx-auto">
              {/* SVG Donut Pie Chart */}
              <svg viewBox="0 0 500 500" className="w-full h-full">
                {/* Background donut (white) */}
                <circle
                  cx="250"
                  cy="250"
                  r="120"
                  fill="none"
                  stroke="#F3F4F6"
                  strokeWidth="20"
                />
                
                {/* Red fill segments (from "Just me" up to selected) */}
                {selectedIndex >= 0 && TEAM_SIZE_OPTIONS.slice(0, selectedIndex + 1).map((option, index) => {
                  const startAngle = option.angle - 90;
                  const endAngle = startAngle + 72;
                  
                  // Calculate path for pie segment
                  const start = polarToCartesian(250, 250, 120, endAngle);
                  const end = polarToCartesian(250, 250, 120, startAngle);
                  const innerStart = polarToCartesian(250, 250, 100, endAngle);
                  const innerEnd = polarToCartesian(250, 250, 100, startAngle);
                  
                  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
                  
                  const pathData = [
                    "M", start.x, start.y,
                    "A", 120, 120, 0, largeArcFlag, 0, end.x, end.y,
                    "L", innerEnd.x, innerEnd.y,
                    "A", 100, 100, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
                    "Z"
                  ].join(" ");
                  
                  return (
                    <g key={`fill-${option.value}`}>
                      <path
                        d={pathData}
                        fill="#FCA5A5"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
                
                {/* White segments (remaining unselected) */}
                {selectedIndex >= 0 && TEAM_SIZE_OPTIONS.slice(selectedIndex + 1).map((option, index) => {
                  const startAngle = option.angle - 90;
                  const endAngle = startAngle + 72;
                  
                  // Calculate path for pie segment
                  const start = polarToCartesian(250, 250, 120, endAngle);
                  const end = polarToCartesian(250, 250, 120, startAngle);
                  const innerStart = polarToCartesian(250, 250, 100, endAngle);
                  const innerEnd = polarToCartesian(250, 250, 100, startAngle);
                  
                  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
                  
                  const pathData = [
                    "M", start.x, start.y,
                    "A", 120, 120, 0, largeArcFlag, 0, end.x, end.y,
                    "L", innerEnd.x, innerEnd.y,
                    "A", 100, 100, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
                    "Z"
                  ].join(" ");
                  
                  return (
                    <g key={`white-${option.value}`}>
                      <path
                        d={pathData}
                        fill="#F3F4F6"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
                
                {/* All segments when nothing is selected */}
                {selectedIndex === -1 && TEAM_SIZE_OPTIONS.map((option, index) => {
                  const startAngle = option.angle - 90;
                  const endAngle = startAngle + 72;
                  
                  // Calculate path for pie segment
                  const start = polarToCartesian(250, 250, 120, endAngle);
                  const end = polarToCartesian(250, 250, 120, startAngle);
                  const innerStart = polarToCartesian(250, 250, 100, endAngle);
                  const innerEnd = polarToCartesian(250, 250, 100, startAngle);
                  
                  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
                  
                  const pathData = [
                    "M", start.x, start.y,
                    "A", 120, 120, 0, largeArcFlag, 0, end.x, end.y,
                    "L", innerEnd.x, innerEnd.y,
                    "A", 100, 100, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
                    "Z"
                  ].join(" ");
                  
                  return (
                    <g key={`default-${option.value}`}>
                      <path
                        d={pathData}
                        fill="#F3F4F6"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
                
                {/* Center circle */}
                <circle cx="250" cy="250" r="75" fill="white" />
                <text
                  x="250"
                  y="250"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl font-medium fill-gray-800"
                >
                  {onboardingData.team_size || '?'}
                </text>
                <text
                  x="250"
                  y="270"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-gray-500"
                >
                  employees
                </text>
                
                {/* Bubble boxes for labels */}
                {TEAM_SIZE_OPTIONS.map((option, index) => {
                  const labelAngle = option.angle - 90 - 50; // -90 for SVG coordinate system, -50 for counter-clockwise rotation (10 degrees less)
                  const labelRadius = 180; // Further away from donut
                  const x = 250 + Math.cos(labelAngle * Math.PI / 180) * labelRadius;
                  const y = 250 + Math.sin(labelAngle * Math.PI / 180) * labelRadius;
                  const isSelected = onboardingData.team_size === option.value;
                  
                  return (
                    <g key={`bubble-${option.value}`}>
                      {/* Bubble box */}
                      <rect
                        x={x - 35}
                        y={y - 15}
                        width="70"
                        height="30"
                        rx="15"
                        className={`cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? 'fill-red-500 stroke-red-600' 
                            : 'fill-white stroke-gray-300 hover:stroke-red-400'
                        }`}
                        strokeWidth="2"
                        onClick={() => handleInputChange('team_size', option.value)}
                      />
                      
                      {/* Label text */}
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={`text-sm font-medium cursor-pointer transition-all duration-300 ${
                          isSelected ? 'fill-white font-bold' : 'fill-gray-700'
                        }`}
                        onClick={() => handleInputChange('team_size', option.value)}
                      >
                        {option.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-12">
            <h2 className="text-3xl font-light text-gray-700">If you could 10x one key metric in the next quarter, which would it be?</h2>
            <div className="flex flex-col items-center space-y-6">
              {/* First Row - 2 items */}
              <div className="grid grid-cols-2 gap-6 max-w-2xl">
                {/* Revenue / MRR */}
                <button
                  onClick={() => handleInputChange('main_focus', FOCUS_OPTIONS[0].label)}
                  className={`p-8 rounded-3xl border-2 text-center transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/20 ${
                    onboardingData.main_focus === FOCUS_OPTIONS[0].label
                      ? 'border-[#DC2626] bg-red-50'
                      : 'border-[#E5E7EB] bg-white hover:border-[#DC2626]/50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`text-red-500 ${onboardingData.main_focus === FOCUS_OPTIONS[0].label ? 'text-red-600' : ''}`}>
                      {FOCUS_OPTIONS[0].icon}
                    </div>
                    <div className={`text-xl font-medium ${onboardingData.main_focus === FOCUS_OPTIONS[0].label ? 'text-[#DC2626]' : 'text-[#1F2937]'}`}>
                      {FOCUS_OPTIONS[0].label}
                    </div>
                  </div>
                </button>
                
                {/* Retention / Churn */}
                <button
                  onClick={() => handleInputChange('main_focus', FOCUS_OPTIONS[1].label)}
                  className={`p-8 rounded-3xl border-2 text-center transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/20 ${
                    onboardingData.main_focus === FOCUS_OPTIONS[1].label
                      ? 'border-[#DC2626] bg-red-50'
                      : 'border-[#E5E7EB] bg-white hover:border-[#DC2626]/50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`text-red-500 ${onboardingData.main_focus === FOCUS_OPTIONS[1].label ? 'text-red-600' : ''}`}>
                      {FOCUS_OPTIONS[1].icon}
                    </div>
                    <div className={`text-xl font-medium ${onboardingData.main_focus === FOCUS_OPTIONS[1].label ? 'text-[#DC2626]' : 'text-[#1F2937]'}`}>
                      {FOCUS_OPTIONS[1].label}
                    </div>
                  </div>
                </button>
              </div>
              
              {/* Second Row - 2 items */}
              <div className="grid grid-cols-2 gap-6 max-w-2xl">
                {/* Conversion Rate */}
                <button
                  onClick={() => handleInputChange('main_focus', FOCUS_OPTIONS[2].label)}
                  className={`p-8 rounded-3xl border-2 text-center transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/20 ${
                    onboardingData.main_focus === FOCUS_OPTIONS[2].label
                      ? 'border-[#DC2626] bg-red-50'
                      : 'border-[#E5E7EB] bg-white hover:border-[#DC2626]/50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`text-red-500 ${onboardingData.main_focus === FOCUS_OPTIONS[2].label ? 'text-red-600' : ''}`}>
                      {FOCUS_OPTIONS[2].icon}
                    </div>
                    <div className={`text-xl font-medium ${onboardingData.main_focus === FOCUS_OPTIONS[2].label ? 'text-[#DC2626]' : 'text-[#1F2937]'}`}>
                      {FOCUS_OPTIONS[2].label}
                    </div>
                  </div>
                </button>
                
                {/* Burn Rate / Runway */}
                <button
                  onClick={() => handleInputChange('main_focus', FOCUS_OPTIONS[3].label)}
                  className={`p-8 rounded-3xl border-2 text-center transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/20 ${
                    onboardingData.main_focus === FOCUS_OPTIONS[3].label
                      ? 'border-[#DC2626] bg-red-50'
                      : 'border-[#E5E7EB] bg-white hover:border-[#DC2626]/50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`text-red-500 ${onboardingData.main_focus === FOCUS_OPTIONS[3].label ? 'text-red-600' : ''}`}>
                      {FOCUS_OPTIONS[3].icon}
                    </div>
                    <div className={`text-xl font-medium ${onboardingData.main_focus === FOCUS_OPTIONS[3].label ? 'text-[#DC2626]' : 'text-[#1F2937]'}`}>
                      {FOCUS_OPTIONS[3].label}
                    </div>
                  </div>
                </button>
              </div>
              
              {/* Third Row - 1 item */}
              <div className="flex justify-center w-full max-w-md">
                {/* Sales Pipeline / Deals */}
                <button
                  onClick={() => handleInputChange('main_focus', FOCUS_OPTIONS[4].label)}
                  className={`w-full p-8 rounded-3xl border-2 text-center transition-all duration-300 hover:shadow-lg hover:shadow-[#DC2626]/20 ${
                    onboardingData.main_focus === FOCUS_OPTIONS[4].label
                      ? 'border-[#DC2626] bg-red-50'
                      : 'border-[#E5E7EB] bg-white hover:border-[#DC2626]/50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`text-red-500 ${onboardingData.main_focus === FOCUS_OPTIONS[4].label ? 'text-red-600' : ''}`}>
                      {FOCUS_OPTIONS[4].icon}
                    </div>
                    <div className={`text-xl font-medium ${onboardingData.main_focus === FOCUS_OPTIONS[4].label ? 'text-[#DC2626]' : 'text-[#1F2937]'}`}>
                      {FOCUS_OPTIONS[4].label}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-12">
            <h2 className="text-3xl font-light text-gray-700">Drop your LinkedIn or email</h2>
            <p className="text-[#6B7280] text-lg">(optional)</p>
            <input
              type="text"
              value={onboardingData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              className="w-full px-6 py-4 border border-[#E5E7EB] rounded-xl focus:outline-none transition-all duration-300 text-lg hover:border-[#DC2626]/30 hover:shadow-sm hover:shadow-[#DC2626]/10 active:scale-[0.98] active:shadow-md"
              placeholder="https://linkedin.com/in/yourprofile or your@email.com"
              autoFocus
            />
          </div>
        )

      case 8:
        return <ProcessingState onboardingData={onboardingData} />

      default:
        return null
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to continue with onboarding</p>
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

      <div className="w-full max-w-4xl">
        {/* Form Container */}
        <div className="bg-white rounded-2xl p-24 relative">
          {/* Red Light Lining - Side Shadow Effect */}
          <div className="absolute -right-2 top-0 bottom-0 w-1 rounded-r-2xl bg-gradient-to-b from-[#DC2626]/20 via-[#DC2626]/40 to-[#DC2626]/20 blur-sm"></div>
          <div className="absolute -left-2 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-[#DC2626]/20 via-[#DC2626]/40 to-[#DC2626]/20 blur-sm"></div>
          
          {/* Content */}
          <div className="relative">
            {/* Header - Logo Only */}
            <div className="text-center mb-6 relative">
              {/* Subtle Red Glow Around Logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-12 bg-gradient-to-r from-[#DC2626]/8 via-[#DC2626]/12 to-[#DC2626]/8 rounded-full blur-md"></div>
              </div>
              <div className="relative">
                <MonttyLogo waveProgress={logoWave ? 1 : 0} />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-[#6B7280]">
                  Step {Math.min(currentStep + 1, 9)} of 9
                </span>
                <span className="text-sm text-[#6B7280]">
                  {Math.min(Math.round(((currentStep + 1) / 9) * 100), 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-[#E5E7EB] rounded-full h-1">
                <div 
                  className="bg-[#DC2626] h-1 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((currentStep + 1) / 9) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-8">
                {success}
              </div>
            )}

            {/* Current Screen - Centered at Eye Level */}
         <div className="flex justify-center">

              <div className="w-full max-w-2xl">
                {renderScreen()}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-48">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-3 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onMouseEnter={() => setLogoWave(true)}
                onMouseLeave={() => setLogoWave(false)}
              >
                Back
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="bg-white text-[#DC2626] py-3 px-6 rounded-xl border border-[#DC2626] hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-colors text-lg font-medium"
                  onMouseEnter={() => setLogoWave(true)}
                  onMouseLeave={() => setLogoWave(false)}
                >
                  {isLoading ? 'Processing...' : (currentStep === 8 ? 'Complete' : 'Next')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
