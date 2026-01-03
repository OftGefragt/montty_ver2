import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabase';

// Types for onboarding data
interface OnboardingData {
  company_name: string;
  website?: string;
  role: string;
  mission: string;
  company_stage: string;
  team_size: string;
  main_focus: string;
  industry: string;
  linkedin?: string;
}

// Company stages options
const COMPANY_STAGES = [
  'Idea/Concept',
  'MVP Development',
  'Early Traction',
  'Growth Stage',
  'Mature Business',
  'Enterprise'
];

// Team size options
const TEAM_SIZES = [
  'Just me',
  '2-5 people',
  '6-20 people',
  '21-50 people',
  '51-200 people',
  '201+ people'
];

// Industry options
const INDUSTRIES = [
  'Technology/SaaS',
  'E-commerce',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Consulting',
  'Media/Entertainment',
  'Real Estate',
  'Other'
];

export function Dashboard() {
  const { user } = useAuth();
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<OnboardingData>({
    company_name: '',
    website: '',
    role: '',
    mission: '',
    company_stage: '',
    team_size: '',
    main_focus: '',
    industry: '',
    linkedin: ''
  });

  // Load user's onboarding data on mount
  useEffect(() => {
    const loadOnboardingData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      // DEBUG: Test actual schema
      console.log('🔍 DEBUG: User ID from auth:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)  // Use 'id' column as it exists in Supabase
          .maybeSingle();

        console.log('🔍 DEBUG: Query result:', { data, error });
        
        if (error) {
          console.error('Error loading profile:', error);
          // Don't set error state if profile just doesn't exist
          if (error.code !== 'PGRST116') {
            setError('Failed to load profile data');
          }
        } else if (data) {
          setOnboardingData(data);
        }
        // If data is null, it means profile doesn't exist yet - that's OK
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadOnboardingData();
  }, [user]);

  // Handle onboarding data update
  const handleUpdate = async () => {
    if (!user) return;

    setIsLoading(true);
    setError('');

    try {
      // First try to update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          company_name: editForm.company_name,
          website: editForm.website,
          role: editForm.role,
          mission: editForm.mission,
          company_stage: editForm.company_stage,
          team_size: editForm.team_size,
          main_focus: editForm.main_focus,
          industry: editForm.industry,
          linkedin: editForm.linkedin
        })
        .eq('id', user.id);

      if (updateError) {
        // If update fails because profile doesn't exist, create it
        if (updateError.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,  // Use 'id' column as it exists in Supabase
              company_name: editForm.company_name,
              website: editForm.website,
              role: editForm.role,
              mission: editForm.mission,
              company_stage: editForm.company_stage,
              team_size: editForm.team_size,
              main_focus: editForm.main_focus,
              industry: editForm.industry,
              linkedin: editForm.linkedin,
              onboarding_completed: true
            });

          if (insertError) {
            setError('Failed to create profile');
          } else {
            setOnboardingData(editForm);
            setIsEditing(false);
            setError('');
          }
        } else {
          setError('Failed to update profile');
        }
      } else {
        setOnboardingData(editForm);
        setIsEditing(false);
        setError('');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit form changes
  const handleEditChange = (field: keyof OnboardingData, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  // Start editing
  const startEditing = () => {
    if (onboardingData) {
      setEditForm(onboardingData);
      setIsEditing(true);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditForm({
      company_name: '',
      website: '',
      role: '',
      mission: '',
      company_stage: '',
      team_size: '',
      main_focus: '',
      industry: '',
      linkedin: ''
    });
    setIsEditing(false);
    setError('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to access your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Montty, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">
            Manage your account and track your metrics
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <button
              onClick={isEditing ? cancelEditing : startEditing}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            // Edit Form
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={editForm.company_name}
                  onChange={(e) => handleEditChange('company_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  value={editForm.website}
                  onChange={(e) => handleEditChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => handleEditChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., CEO, Founder, Marketing Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mission Statement
                </label>
                <textarea
                  value={editForm.mission}
                  onChange={(e) => handleEditChange('mission', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Describe your mission in one sentence"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Stage
                </label>
                <select
                  value={editForm.company_stage}
                  onChange={(e) => handleEditChange('company_stage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select a stage</option>
                  {COMPANY_STAGES.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Size
                </label>
                <select
                  value={editForm.team_size}
                  onChange={(e) => handleEditChange('team_size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select team size</option>
                  {TEAM_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Focus
                </label>
                <input
                  type="text"
                  value={editForm.main_focus}
                  onChange={(e) => handleEditChange('main_focus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., B2B SaaS, Consumer App, Consulting Services"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={editForm.industry}
                  onChange={(e) => handleEditChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select an industry</option>
                  {INDUSTRIES.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile (Optional)
                </label>
                <input
                  type="url"
                  value={editForm.linkedin}
                  onChange={(e) => handleEditChange('linkedin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelEditing}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            // Display Mode
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Company</h3>
                  <p className="text-gray-900 font-semibold">{onboardingData?.company_name || 'Not set'}</p>
                  {onboardingData?.website && (
                    <p className="text-sm text-gray-600">
                      <a href={onboardingData.website} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600">
                        {onboardingData.website}
                      </a>
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Role</h3>
                  <p className="text-gray-900 font-semibold">{onboardingData?.role || 'Not set'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Mission</h3>
                  <p className="text-gray-900">{onboardingData?.mission || 'Not set'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Stage</h3>
                  <p className="text-gray-900">{onboardingData?.company_stage || 'Not set'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Team Size</h3>
                  <p className="text-gray-900">{onboardingData?.team_size || 'Not set'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Focus</h3>
                  <p className="text-gray-900">{onboardingData?.main_focus || 'Not set'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Industry</h3>
                  <p className="text-gray-900">{onboardingData?.industry || 'Not set'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">LinkedIn</h3>
                  {onboardingData?.linkedin ? (
                    <a href={onboardingData.linkedin} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-600">
                      View Profile
                    </a>
                  ) : (
                    <p className="text-gray-500">Not provided</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Onboarding</h3>
            <p className="text-gray-600 mb-4">Finish setting up your profile to get the most out of Montty</p>
            <button
              onClick={startEditing}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Complete Profile Setup
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Go to Churn Analytics</h3>
            <p className="text-gray-600 mb-4">Track your customer metrics and revenue</p>
            <button
              onClick={() => window.location.href = '/churn'}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            >
              View Churn Dashboard
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Settings</h3>
            <p className="text-gray-600 mb-4">Manage your account and preferences</p>
            <button
              onClick={() => window.location.href = '/settings'}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Account Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
