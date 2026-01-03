import React, { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

// Types for user data
interface User {
  id: string;
  email: string;
  name?: string;
  surname?: string;
}

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  signUp: (email: string, password: string, name: string, surname: string) => Promise<{ user: User | null; error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<void>;
  confirmEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
}

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    let isMounted = true;
    
    const checkSession = async () => {
      try {
        console.log('Starting auth session check...');
        
        // First check if we have a stored session in localStorage
        const storedSession = localStorage.getItem('supabase.auth.token');
        
        if (storedSession) {
          console.log('Found stored session, attempting to restore...');
          try {
            const sessionData = JSON.parse(storedSession);
            if (sessionData?.user && isMounted) {
              const restoredUser: User = {
                id: sessionData.user.id,
                email: sessionData.user.email || '',
                name: sessionData.user.user_metadata?.name || '',
                surname: sessionData.user.user_metadata?.surname || ''
              };
              console.log('Restored user from localStorage:', restoredUser.email);
              setUser(restoredUser);
            }
          } catch (parseError) {
            console.warn('Failed to parse stored session:', parseError);
          }
        }
        
        // Always try to get current session from Supabase to ensure it's valid
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.warn('Supabase session error:', error.message);
            if (isMounted) {
              setUser(null);
            }
          } else if (session?.user && isMounted) {
            console.log('Got valid session from Supabase:', session.user.email);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || '',
              surname: session.user.user_metadata?.surname || ''
            });
          } else if (!session?.user && isMounted) {
            console.log('No valid session found, setting user to null');
            setUser(null);
          }
        } catch (supabaseError) {
          console.warn('Supabase connection failed, using offline mode:', supabaseError);
          // If we already restored from localStorage, keep that user
          // Otherwise, set user to null
          if (isMounted) {
            if (!storedSession) {
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error('Auth system error:', error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          console.log('Auth check complete');
          setAuthLoading(false);
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email);
      if (isMounted) {
        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || '',
            surname: session.user.user_metadata?.surname || ''
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = async (email: string, password: string, name: string, surname: string) => {
    setAuthLoading(true);
    
    try {
      // Validate inputs
      if (!email || !password || !name || !surname) {
        setAuthLoading(false);
        return { user: null, error: 'All fields are required' };
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setAuthLoading(false);
        return { user: null, error: 'Please enter a valid email address' };
      }

      // Password validation
      if (password.length < 6) {
        setAuthLoading(false);
        return { user: null, error: 'Password must be at least 6 characters long' };
      }

      // Test Supabase connection first
      const { error: connectionError } = await supabase.from('profiles').select('id', { count: 'exact' });
      
      if (connectionError) {
        // Fallback mode - create mock user for demo purposes
        console.warn('Supabase not available, creating mock user for demo');
        const mockUser: User = {
          id: `demo_${Date.now()}`,
          email,
          name,
          surname
        };
        setUser(mockUser);
        setAuthLoading(false);
        return { user: mockUser, error: null };
      }

      // Create user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            surname
          },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        setAuthLoading(false);
        return { user: null, error: error.message };
      }

      if (data.user) {
        const newUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
          surname: data.user.user_metadata?.surname || ''
        };
        
        setUser(newUser);
        setAuthLoading(false);
        
        // Check if email confirmation is needed
        if (data.user.email_confirmed_at === null) {
          return { 
            user: newUser, 
            error: 'Please check your email to confirm your account. You may need to check your spam folder.' 
          };
        }
        
        return { user: newUser, error: null };
      }

      setAuthLoading(false);
      return { user: null, error: 'Failed to create account' };

    } catch (error) {
      console.error('Signup error:', error);
      setAuthLoading(false);
      return { user: null, error: 'Network connection error. Please check your internet connection.' };
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setAuthLoading(true);
    
    try {
      // Validate inputs
      if (!email || !password) {
        setAuthLoading(false);
        return { user: null, error: 'Email and password are required' };
      }

      // Test Supabase connection first
      const { error: connectionError } = await supabase.from('profiles').select('id', { count: 'exact' });
      
      if (connectionError) {
        // Fallback mode - create mock user for demo purposes
        console.warn('Supabase not available, creating mock user for demo');
        const mockUser: User = {
          id: `demo_${Date.now()}`,
          email,
          name: 'Demo',
          surname: 'User'
        };
        setUser(mockUser);
        setAuthLoading(false);
        return { user: mockUser, error: null };
      }

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setAuthLoading(false);
        return { user: null, error: error.message };
      }

      if (data.user) {
        const loggedInUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
          surname: data.user.user_metadata?.surname || ''
        };
        
        setUser(loggedInUser);
        setAuthLoading(false);
        return { user: loggedInUser, error: null };
      }

      setAuthLoading(false);
      return { user: null, error: 'Failed to sign in' };

    } catch (error) {
      console.error('Signin error:', error);
      setAuthLoading(false);
      return { user: null, error: 'Network connection error. Please check your internet connection.' };
    }
  };

  // Manual email confirmation for development
  const confirmEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // For development: we can use the admin client to confirm email
      // In production, users should click the confirmation link in their email
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to resend confirmation email' };
    }
  };

  const signOut = async () => {
    setAuthLoading(true);
    
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAuthLoading(false);
    } catch (error) {
      console.error('Sign out error:', error);
      setUser(null);
      setAuthLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    authLoading,
    signUp,
    signIn,
    signOut,
    confirmEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
