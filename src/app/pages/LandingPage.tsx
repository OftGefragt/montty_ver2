import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  Menu, 
  X,
  ArrowRight, 
  Zap, 
  Users, 
  Shield, 
  ArrowDownRight, 
  TrendingUp, 
  Clock 
} from 'lucide-react';

// Add CSS animation
const fadeInAnimation = `
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes letterWave {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-4px);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-4px);
    }
  }
  
  .animate-fade-in-left {
    animation: fadeInLeft 1s ease-out forwards;
  }
  
  .animate-fade-in-right {
    animation: fadeInRight 1s ease-out forwards;
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 1s ease-out forwards;
    animation-delay: 1.5s;
  }
  
  .animate-wave {
    animation: wave 4s ease-in-out infinite;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .letter-wave {
    animation: letterWave 2.8s ease-in-out infinite;
  }
  
  .delay-300 { animation-delay: 0.3s; }
  .delay-600 { animation-delay: 0.6s; }
  .delay-900 { animation-delay: 0.9s; }
  .delay-1200 { animation-delay: 1.2s; }
`;

// Custom MonttyLogo for landing page - always uses red colors with scroll-based wave animation
function LandingMonttyLogo() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(scrolled / maxScroll, 1) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const rectangles = [
    { baseX: 0, baseY: 8, height: 12, delay: 0 },      // small
    { baseX: 8, baseY: 6, height: 16, delay: 50 },     // medium (2px gap)
    { baseX: 16, baseY: 2, height: 24, delay: 100 },   // tall (2px gap)
    { baseX: 24, baseY: 6, height: 16, delay: 150 },   // medium (2px gap)
    { baseX: 32, baseY: 8, height: 12, delay: 200 },   // small (2px gap)
  ];

  const calculateWave = (baseX: number, baseY: number, height: number, delay: number, index: number) => {
    // Calculate wave position based on scroll progress
    const wavePosition = scrollProgress * 6; // Total wave cycles during scroll
    
    // Each rectangle activates based on its position in the sequence
    const rectangleProgress = Math.max(0, Math.min(1, wavePosition - index * 0.2));
    const easeProgress = rectangleProgress < 0.5 
      ? 2 * rectangleProgress * rectangleProgress // Ease in
      : 1 - Math.pow(-2 * rectangleProgress + 2, 2) / 2; // Ease out
    
    const waveHeight = easeProgress * 8; // Max 8px upward movement
    const time = Date.now() / 1000;
    const wave = Math.sin(time * 3 + delay / 100) * waveHeight * 0.3; // Subtle continuous wave
    
    return {
      x: baseX,
      y: baseY - waveHeight + wave, // Move up based on scroll + subtle wave
      scale: 1 + easeProgress * 0.1, // Slight scale effect
      height: height,
      opacity: 0.8 + easeProgress * 0.2
    };
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Wave logo */}
      <div className="relative w-10 h-8">
        {rectangles.map((rect, index) => {
          const wave = calculateWave(rect.baseX, rect.baseY, rect.height, rect.delay, index);
          return (
            <div
              key={index}
              className="absolute w-2 rounded-full bg-red-600 transition-all duration-300 ease-out"
              style={{
                left: `${wave.x}px`,
                top: `${wave.y}px`,
                height: `${wave.height}px`,
                transform: `translateY(${wave.y}px) scale(${wave.scale})`,
                opacity: wave.opacity,
              }}
            />
          );
        })}
      </div>
      
      {/* Brand name */}
      <div className="flex flex-col">
        <span 
          className="text-xl font-bold text-red-600 transition-all duration-300 ease-out"
          style={{ 
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
            transform: `translateY(${-scrollProgress * 3}px) scale(${1 + scrollProgress * 0.05})`,
            opacity: 0.8 + scrollProgress * 0.2,
          }}
        >
          Montty
        </span>
      </div>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const { theme, isDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [painPointsRevealed, setPainPointsRevealed] = useState({
    fragile: false,
    attention: false,
    confidence: false,
    tools: false,
    conclusion: false
  });
  const [monttyRevealed, setMonttyRevealed] = useState(false);
  const [cardsRevealed, setCardsRevealed] = useState(false);
  const [howItWorksRevealed, setHowItWorksRevealed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const transitionRef = useRef<HTMLDivElement>(null);

  // Add billing toggle state
  const [isAnnual, setIsAnnual] = useState(false);

  // Add mountain traversal state
  const [mountainProgress, setMountainProgress] = useState(0);

  // Add Intersection Observer state for How it Works
  const [activeStep, setActiveStep] = useState(0);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  // Add Intersection Observer state for What you get cards
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  // Custom cursor setup
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * {
        cursor: none !important;
      }
      body {
        cursor: none !important;
      }
      .custom-cursor {
        width: 16px;
        height: 16px;
        background-color: #000000;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease-out, background-color 0.2s ease-out;
      }
      .custom-cursor.clicked {
        background-color: #dc2626 !important;
        transform: scale(1.2);
      }
      button, a, input, textarea, select {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX - 8}px`;
      cursor.style.top = `${e.clientY - 8}px`;
    };

    const handleClick = () => {
      cursor.classList.add('clicked');
      setTimeout(() => {
        cursor.classList.remove('clicked');
      }, 200);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      document.head.removeChild(style);
      document.body.removeChild(cursor);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Inject CSS animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = fadeInAnimation;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Mouse tracking for Montty wave animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (transitionRef.current) {
        const rect = transitionRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate wave effect for each letter
  const calculateWave = (letterIndex: number, totalLetters: number) => {
    // Use scroll progress instead of time for scroll-based animation
    const transitionProgress = Math.max(0, Math.min(1, (scrollProgress - 0.8) * 5)); // Activate when 80% scrolled
    const wavePosition = transitionProgress * (totalLetters + 1);
    
    // Each letter moves up smoothly as the wave passes through it
    const letterProgress = Math.max(0, Math.min(1, wavePosition - letterIndex));
    const easeProgress = letterProgress < 0.5 
      ? 2 * letterProgress * letterProgress // Ease in
      : 1 - Math.pow(-2 * letterProgress + 2, 2) / 2; // Ease out
    
    const waveHeight = easeProgress * 15; // Max 15px upward movement
    
    return {
      transform: `translateY(${-waveHeight}px)`,
      opacity: 0.8 + easeProgress * 0.2
    };
  };

  // One-time scroll-based animation for pain points
  useEffect(() => {
    const handleScroll = () => {
      const painPointsSection = document.getElementById('pain-points');
      const transitionSection = document.querySelector('section[style*="60vh"]');
      const valuePropSection = document.querySelector('section[class*="py-32"]');
      const howItWorksSection = document.getElementById('how-it-works');
      
      // Handle pain points animations
      if (painPointsSection) {
        const rect = painPointsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionHeight = rect.height;

        // Calculate scroll progress through pain points section
        if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
          const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight * 0.5)));
          setScrollProgress(progress);
          
          // One-time reveals based on scroll progress
          if (progress > 0.2 && !painPointsRevealed.fragile) {
            setPainPointsRevealed(prev => ({ ...prev, fragile: true }));
          }
          if (progress > 0.4 && !painPointsRevealed.attention) {
            setPainPointsRevealed(prev => ({ ...prev, attention: true }));
          }
          if (progress > 0.6 && !painPointsRevealed.confidence) {
            setPainPointsRevealed(prev => ({ ...prev, confidence: true }));
          }
          if (progress > 0.8 && !painPointsRevealed.tools) {
            setPainPointsRevealed(prev => ({ ...prev, tools: true }));
          }
          if (progress > 0.95 && !painPointsRevealed.conclusion) {
            setPainPointsRevealed(prev => ({ ...prev, conclusion: true }));
          }
        }
      }
      
      // Handle transition section scroll progress and Montty reveal
      if (transitionSection) {
        const rect = transitionSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionHeight = rect.height;

        if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
          const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight * 0.5)));
          setMonttyRevealed(progress > 0.1);
        }
      }

      if (valuePropSection && !cardsRevealed) {
        const rect = valuePropSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionHeight = rect.height;

        if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
          const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight * 0.5)));
          setCardsRevealed(progress > 0.1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [painPointsRevealed, monttyRevealed, cardsRevealed, howItWorksRevealed]);

  // Intersection Observer for How it Works steps
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepNumber = parseInt(entry.target.getAttribute('data-step') || '0');
            setActiveStep(prev => Math.max(prev, stepNumber));
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
        rootMargin: '-100px 0px -100px 0px' // Adjust trigger zone
      }
    );

    // Observe all step elements
    const steps = [step1Ref.current, step2Ref.current, step3Ref.current];
    steps.forEach((step, index) => {
      if (step) {
        step.setAttribute('data-step', (index + 1).toString());
        observer.observe(step);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Intersection Observer for What you get cards
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Show cards instantly if motion is reduced
      setVisibleCards(new Set([1, 2, 3]));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardNumber = parseInt(entry.target.getAttribute('data-card') || '0');
            const delay = (cardNumber - 1) * 100; // 0ms, 100ms, 200ms
            
            setTimeout(() => {
              setVisibleCards(prev => new Set([...prev, cardNumber]));
            }, delay);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the card is visible
        rootMargin: '0px 0px -50px 0px' // Adjust trigger zone
      }
    );

    // Observe all card elements
    const cards = [card1Ref.current, card2Ref.current, card3Ref.current];
    cards.forEach((card, index) => {
      if (card) {
        card.setAttribute('data-card', (index + 1).toString());
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  // Handle navigation to auth
  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'metrics', 'testimonials', 'pricing', 'cta'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Overview' },
    { id: 'pain-points', label: 'Before Montty' },
    { id: 'value', label: 'Value' },
    { id: 'how-it-works', label: 'How it Works' },
    { id: 'pricing', label: 'Pricing' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
      {/* Sticky Header */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isDarkMode ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800' : 'bg-white/95 backdrop-blur-md border-b border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <LandingMonttyLogo />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors ${
                    isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button 
                onClick={handleGetStarted}
                className={`text-sm font-medium transition-all duration-200 border-b border-black hover:border-gray-600 ${
                  isDarkMode ? 'text-black hover:text-gray-700' : 'text-black hover:text-gray-700'
                }`}
              >
                Start Free
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md transition-colors ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-slate-900'
                }`}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className={`md:hidden border-t ${
              isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'
            }`}>
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block px-3 py-2 text-base font-medium transition-colors ${
                      isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <button 
                  onClick={handleGetStarted}
                  className={`block mx-3 mt-2 text-sm font-medium transition-all duration-200 border-b border-black hover:border-gray-600 ${
                    isDarkMode ? 'text-black hover:text-gray-700' : 'text-black hover:text-gray-700'
                  }`}
                >
                  Start Free
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className={`min-h-screen flex items-center justify-center px-6 pt-16 ${
        isDarkMode ? 'bg-slate-950' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-12 max-w-2xl">
              <div className="space-y-8">
                <h1 className={`text-4xl sm:text-5xl font-bold leading-relaxed ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.04em' }}>
                  Financial clarity for founders who don't want to be accountants.
                </h1>
                <p className={`text-base font-medium leading-relaxed ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.025em' }}>
                  Whether you're raising your first round or your third, Montty keeps finances clear without the busywork. 
                  Automatic tax, net worth, and runway calculations, all visualized in a simple dashboard with instant financial report.
                </p>
              </div>
              
              <div className="text-left space-y-4">
                <button 
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-medium text-lg transition-all duration-200 transform hover:scale-105 rounded-2xl shadow-lg"
                >
                  Start Free
                </button>
                <p className={`text-sm italic ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  No credit card needed
                </p>
              </div>
            </div>

            {/* Right Content - Interactive Dashboard */}
            <div className="flex justify-center items-center">
              <div className={`relative rounded-2xl shadow-2xl overflow-hidden border transition-all duration-300 hover:shadow-3xl ${
                isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
              }`}>
                {/* Dashboard Header */}
                <div className={`px-6 py-4 border-b ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Montty Dashboard
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Live
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 space-y-6 w-96">
                  {/* Metrics Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg border ${
                      isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`text-2xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        $124.5K
                      </div>
                      <div className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Total Revenue
                      </div>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-500">+12%</span>
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg border ${
                      isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`text-2xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        8.5
                      </div>
                      <div className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Runway (months)
                      </div>
                      <div className="flex items-center mt-1">
                        <ArrowDownRight className="w-3 h-3 text-yellow-500 mr-1" />
                        <span className="text-xs text-yellow-500">-0.5</span>
                      </div>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className={`p-4 rounded-lg border ${
                    isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`text-sm font-medium mb-3 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Cash Flow
                    </div>
                    <div className="flex items-end justify-between h-20">
                      {[40, 65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                        <div
                          key={i}
                          className="w-6 bg-red-500 rounded-t transition-all duration-500 hover:bg-red-600"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className={`p-4 rounded-lg border ${
                    isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`text-sm font-medium mb-3 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Recent Activity
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Stripe Payment
                        </span>
                        <span className={`text-xs font-medium ${
                          isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`}>
                          +$2,450
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          AWS Bill
                        </span>
                        <span className={`text-xs font-medium ${
                          isDarkMode ? 'text-red-400' : 'text-red-600'
                        }`}>
                          -$850
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${
        isDarkMode ? 'bg-slate-800' : 'bg-gray-200'
      }`}></div>

      {/* Pain Points Section */}
      <section id="pain-points" className={`min-h-screen flex items-center justify-center px-6 ${
        isDarkMode ? 'bg-slate-950' : 'bg-white'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-16">
            <div className="space-y-6">
              <h2 className={`text-3xl sm:text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.02em' }}>
                Startup finance shouldn't feel this heavy.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Fragile clarity */}
              <div className={`${painPointsRevealed.fragile ? 'animate-fade-in-left' : 'opacity-0'}`}>
                <h3 className={`text-xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.02em' }}>
                  Fragile clarity
                </h3>
                <p className={`text-lg leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-black'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.01em' }}>
                  One small change can ripple through your entire model — and suddenly nothing feels reliable.
                </p>
              </div>

              {/* The attention tax */}
              <div className={`${painPointsRevealed.attention ? 'animate-fade-in-right' : 'opacity-0'}`}>
                <h3 className={`text-xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.02em' }}>
                  The attention tax
                </h3>
                <p className={`text-lg leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-black'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.01em' }}>
                  Too much time is spent double-checking formulas instead of leading the business forward.
                </p>
              </div>

              {/* The confidence gap */}
              <div className={`${painPointsRevealed.confidence ? 'animate-fade-in-left' : 'opacity-0'}`}>
                <h3 className={`text-xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.02em' }}>
                  The confidence gap
                </h3>
                <p className={`text-lg leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-black'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.01em' }}>
                  Decisions are made with partial certainty, hoping the numbers hold up as you scale.
                </p>
              </div>

              {/* Tools built for the past */}
              <div className={`${painPointsRevealed.tools ? 'animate-fade-in-right' : 'opacity-0'}`}>
                <h3 className={`text-xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.02em' }}>
                  Tools built for the past
                </h3>
                <p className={`text-lg leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-black'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.01em' }}>
                  Traditional accounting looks backward, while founders need answers about what's next.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deliberate Scroll Transition Section */}
      <section className={`min-h-screen flex items-center justify-center px-6 ${
        isDarkMode ? 'bg-slate-950' : 'bg-white'
      }`} style={{ minHeight: '54vh' }}>
        <div className="text-center" ref={transitionRef}>
          <p className={`text-4xl font-bold ${
            isDarkMode ? 'text-white' : 'text-black'
          }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.04em' }}>
            So we built{' '}
            <span className="text-red-600">
              {'Montty'.split('').map((letter, index) => (
                <span
                  key={index}
                  className="letter-wave inline-block"
                  style={{
                    animationDelay: `${index * 120}ms`
                  }}
                >
                  {letter}
                </span>
              ))}
            </span>
            .
          </p>
          
          {/* Signature Line */}
          <div className="mt-14">
            <p className={`text-2xl font-light ${
              isDarkMode ? 'text-white' : 'text-black'
            }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.02em' }}>
              Built by <span className="text-red-600 italic">founders</span> for <span className="text-red-600 italic">founders</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${
        isDarkMode ? 'bg-slate-800' : 'bg-gray-200'
      }`}></div>

      {/* Value Proposition Section */}
      <section id="what-you-get" className={`py-32 px-6 ${
        isDarkMode ? 'bg-slate-900' : 'bg-white'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div id="what-you-get" className="text-center mb-24">
            <h2 className={`text-4xl font-light ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.02em' }}>
              What you get
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {/* Card 1 */}
            <div 
              ref={card1Ref}
              className={`bg-white dark:bg-slate-800 rounded-3xl p-8 pt-8 pb-20 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center transition-all duration-400 ease-out ${
                visibleCards.has(1) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-3'
              }`}
            >
              <div className="mb-8">
                <div className="w-16 h-16 rounded-full border-2 border-red-500 bg-white flex items-center justify-center">
                  <Zap className="w-8 h-8 text-red-600" strokeWidth={1.5} />
                </div>
              </div>
              <p className={`text-lg font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                Designed for Monday morning decisions — not tax filings.
              </p>
              <p className={`text-sm mt-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                Clear finances, 24/7.
              </p>
            </div>

            {/* Card 2 */}
            <div 
              ref={card2Ref}
              className={`bg-white dark:bg-slate-800 rounded-3xl p-8 pt-8 pb-20 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center transition-all duration-400 ease-out ${
                visibleCards.has(2) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-3'
              }`}
            >
              <div className="mb-8">
                <div className="w-16 h-16 rounded-full border-2 border-red-500 bg-white flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-red-600" strokeWidth={1.5} />
                </div>
              </div>
              <p className={`text-lg font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                Always know your financial position.
              </p>
              <p className={`text-sm mt-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                Real-time clarity.
              </p>
            </div>

            {/* Card 3 */}
            <div 
              ref={card3Ref}
              className={`bg-white dark:bg-slate-800 rounded-3xl p-8 pt-8 pb-20 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center transition-all duration-400 ease-out ${
                visibleCards.has(3) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-3'
              }`}
            >
              <div className="mb-8">
                <div className="w-16 h-16 rounded-full border-2 border-red-500 bg-white flex items-center justify-center">
                  <Clock className="w-8 h-8 text-red-600" strokeWidth={1.5} />
                </div>
              </div>
              <p className={`text-lg font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                Make decisions up to 80% faster with always-ready data.
              </p>
              <p className={`text-sm mt-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                Instant insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${
        isDarkMode ? 'bg-slate-800' : 'bg-gray-200'
      }`}></div>

      {/* How It Works Section */}
      <section id="how-it-works" className={`py-32 px-6 ${
        isDarkMode ? 'bg-slate-950' : 'bg-white'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-32">
            <h2 className={`text-4xl font-light mb-8 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.02em' }}>
              How it works
            </h2>
          </div>

          {/* 4 rows of spacing */}
          <div className="space-y-4 mb-16">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          {/* Interactive Steps */}
          <div className="space-y-24">
            {/* Step 1 */}
            <div 
              ref={step1Ref}
              className={`flex items-start space-x-6 transition-all duration-300 ease-out ${
                activeStep >= 1 ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ease-out flex-shrink-0 ${
                activeStep >= 1 
                  ? 'bg-[#C9342C] border-[#C9342C]' 
                  : 'bg-transparent border-[#C9342C]'
              }`}>
                <span className={`text-2xl font-thin transition-colors duration-300 ease-out ${
                  activeStep >= 1 ? 'text-white' : 'text-white'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                  1
                </span>
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ease-out ${
                  activeStep >= 1 ? 'text-[#C9342C]' : isDarkMode ? 'text-white' : 'text-black'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '0.02em' }}>
                  No setup. No learning curve.
                </h3>
                <p className={`text-base transition-colors duration-300 ease-out ${
                  activeStep >= 1 ? 'text-[#C9342C]' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                  Montty feels familiar from the first minute.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div 
              ref={step2Ref}
              className={`flex items-start space-x-6 transition-all duration-300 ease-out ${
                activeStep >= 2 ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ease-out flex-shrink-0 ${
                activeStep >= 2 
                  ? 'bg-[#C9342C] border-[#C9342C]' 
                  : 'bg-transparent border-[#C9342C]'
              }`}>
                <span className={`text-2xl font-thin transition-colors duration-300 ease-out ${
                  activeStep >= 2 ? 'text-white' : 'text-white'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                  2
                </span>
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ease-out ${
                  activeStep >= 2 ? 'text-[#C9342C]' : isDarkMode ? 'text-white' : 'text-black'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '0.02em' }}>
                  Montty does the math
                </h3>
                <p className={`text-base transition-colors duration-300 ease-out ${
                  activeStep >= 2 ? 'text-[#C9342C]' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                  Your data is processed, connected, and kept in sync. The complexity stays invisible.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div 
              ref={step3Ref}
              className={`flex items-start space-x-6 transition-all duration-300 ease-out ${
                activeStep >= 3 ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ease-out flex-shrink-0 ${
                activeStep >= 3 
                  ? 'bg-[#C9342C] border-[#C9342C]' 
                  : 'bg-transparent border-[#C9342C]'
              }`}>
                <span className={`text-2xl font-thin transition-colors duration-300 ease-out ${
                  activeStep >= 3 ? 'text-white' : 'text-white'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                  3
                </span>
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ease-out ${
                  activeStep >= 3 ? 'text-[#C9342C]' : isDarkMode ? 'text-white' : 'text-black'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '0.02em' }}>
                  Instant financial clarity
                </h3>
                <p className={`text-base transition-colors duration-300 ease-out ${
                  activeStep >= 3 ? 'text-[#C9342C]' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                  Live insights, key stats, and your true position — always ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${
        isDarkMode ? 'bg-slate-800' : 'bg-gray-200'
      }`}></div>

      {/* Pricing Section */}
      <section id="pricing" className={`py-48 px-6 ${
        isDarkMode ? 'bg-slate-950' : 'bg-white'
      }`}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-24">
            <h2 className={`text-4xl font-light mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif", letterSpacing: '-0.02em' }}>
              See clearly. Act confidently.
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
              Choose the plan that helps you understand your financial position and make better decisions.
            </p>
          </div>

          {/* Reduced spacing before toggle */}
          <div className="h-6"></div>

                {/* Billing Toggle */}
          <div className="flex justify-center mb-16">
            <div className={`inline-flex rounded-lg p-1 relative ${
              isDarkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  !isAnnual ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isAnnual ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}
              >
                Annual
              </button>
              {/* Side label */}
              <div className={`absolute -right-20 top-1/2 transform -translate-y-1/2 border-l-2 border-black pl-2 ${
                isDarkMode ? 'border-white' : 'border-black'
              }`}>
                <span className={`text-xs font-medium ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                  Save 33%
                </span>
              </div>
            </div>
          </div>

          {/* Spacing after toggle */}
          <div className="h-8"></div>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-2 gap-8 items-start mb-32">
            {/* Founder Plan */}
            <div className={`rounded-2xl p-8 transition-all duration-300 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-light ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                  Free
                </h3>
                <span className={`text-3xl font-light ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                  $0
                </span>
              </div>
              <p className={`text-sm mb-8 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                Essential clarity for founders getting started
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <svg className={`w-4 h-4 flex-shrink-0 ${
                    isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                    Customer & revenue churn tracking
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className={`w-4 h-4 flex-shrink-0 ${
                    isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                    All-time customer growth view
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className={`w-4 h-4 flex-shrink-0 ${
                    isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                    Month-over-month changes
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className={`w-4 h-4 flex-shrink-0 ${
                    isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                    Core income & expense overview
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className={`w-4 h-4 flex-shrink-0 ${
                    isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                    Net worth snapshot
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className={`w-4 h-4 flex-shrink-0 ${
                    isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                    Basic charts & visualizations
                  </span>
                </div>
              </div>

              {/* Spacing */}
              <div className="h-16"></div>

              <button
                onClick={() => navigate('/signup')}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 mt-8 ${
                  isDarkMode ? 'bg-white text-black border border-gray-600 hover:bg-gray-50' : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
                }`}
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}
              >
                Get started
              </button>
            </div>

            {/* Scale Plan */}
            <div className={`relative rounded-2xl p-8 transition-all duration-300 shadow-lg ${
              isDarkMode ? 'bg-gradient-to-br from-red-600 to-red-700 border-red-600' : 'bg-gradient-to-br from-red-600 to-red-700 border-red-600'
            }`}>
              <div className="absolute -top-4 right-4">
                <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                  Most Popular
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-light text-white`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                  Premium
                </h3>
                <div className="flex items-baseline">
                  <span className={`text-3xl font-light text-white`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                    ${isAnnual ? '9.99' : '14.99'}
                  </span>
                  <span className={`text-lg font-light text-white/80`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                    /{isAnnual ? 'month' : 'month'}
                  </span>
                </div>
              </div>
              
              <p className={`text-sm mb-2 text-white/90`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                {isAnnual && <span className="text-xs text-white/70">Limited-time offer: Billed annually at $119.88 (Save 33%)</span>}
                {!isAnnual && <span className="text-xs text-white/70">Monthly billing</span>}
              </p>
              <p className={`text-sm mb-8 text-white`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                Built for founders who want confidence, not guesswork
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 border-white/60 flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-2.5 h-2.5 text-white/90" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`text-sm text-white/80`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                    Everything in Free
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 border-white/60 flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-2.5 h-2.5 text-white/90" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`text-sm text-white/80`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                    Cash runway & burn rate tracking
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 border-white/60 flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-2.5 h-2.5 text-white/90" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`text-sm text-white/80`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                    Operating cash metrics
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 border-white/60 flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-2.5 h-2.5 text-white/90" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`text-sm text-white/80`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                    Free cash flow margins & alerts
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 border-white/60 flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-2.5 h-2.5 text-white/90" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`text-sm text-white/80`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                    Debt ratio & solvency monitoring
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 border-white/60 flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-2.5 h-2.5 text-white/90" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`text-sm text-white/80`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                    Historical trends & deep insights
                  </span>
                </div>
              </div>

              {/* Spacing */}
              <div className="h-16"></div>

              <button
                onClick={() => navigate('/signup')}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 mt-8 bg-white/90 text-red-600 hover:bg-white`}
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}
              >
                Start free trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${
        isDarkMode ? 'bg-slate-800' : 'bg-gray-200'
      }`}></div>

      {/* Contact Section */}
      <section id="contact" className={`py-32 px-6 ${
        isDarkMode ? 'bg-slate-950' : 'bg-white'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className={`py-16 px-6 ${
        isDarkMode ? 'bg-slate-950' : 'bg-white'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center space-y-8">
            {/* Primary content */}
            <div className="text-left max-w-2xl">
              <p className={`text-2xl font-light mb-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
                Questions? We read every message.
              </p>
              <a 
                href="mailto: contact@monttyfinance.com"
                className={`text-lg font-light underline-offset-2 hover:underline transition-all duration-200 ${
                  isDarkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'
                }`}
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}
              >
                hello@montty.app
              </a>
            </div>

            {/* Secondary links */}
            <div className="flex space-x-6">
              <a 
                href="#"
                className={`text-sm font-light underline-offset-2 hover:underline transition-all duration-200 ${
                  isDarkMode ? 'text-gray-600 hover:text-gray-500' : 'text-gray-300 hover:text-gray-400'
                }`}
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}
              >
                Privacy
              </a>
              <a 
                href="#"
                className={`text-sm font-light underline-offset-2 hover:underline transition-all duration-200 ${
                  isDarkMode ? 'text-gray-600 hover:text-gray-500' : 'text-gray-300 hover:text-gray-400'
                }`}
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>

     

      {/* More sections will be added as we work on them */}
    </div>
  );
}
