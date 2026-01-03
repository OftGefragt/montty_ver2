import { supabase } from './supabase'

// Debug function to check Supabase setup
export async function debugSupabaseSetup() {
  console.log('🔍 Debugging Supabase setup...')
  
  try {
    // Test 1: Check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1)
    
    if (testError && testError.code !== 'PGRST116') {
      console.log('✅ Supabase connection works')
    } else {
      console.log('❌ Supabase connection issue:', testError)
    }

    // Test 2: Check what tables exist
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_info') // This might not work, but let's try
    
    if (tablesError) {
      console.log('⚠️ Cannot list tables (expected for most projects)')
    } else {
      console.log('📋 Available tables:', tables)
    }

    // Test 3: Try to access profiles table with minimal query
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (profilesError) {
      console.log('❌ Profiles table error:', profilesError)
      console.log('Error details:', {
        code: profilesError.code,
        message: profilesError.message,
        details: profilesError.details
      })
      
      // Suggest solutions based on error type
      if (profilesError.code === 'PGRST116') {
        console.log('💡 Solution: The "profiles" table does not exist')
        console.log('   → Create the table in Supabase Dashboard')
        console.log('   → Or use a different table name')
      } else if (profilesError.code === '42501') {
        console.log('💡 Solution: Permission issue')
        console.log('   → Check RLS policies on profiles table')
        console.log('   → Ensure user has SELECT permissions')
      }
    } else {
      console.log('✅ Profiles table accessible')
      console.log('Sample data:', profilesData)
    }

    // Test 4: Check if user exists in auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log('❌ Auth error:', authError)
    } else if (user) {
      console.log('✅ Auth user found:', user.id)
      
      // Test 5: Try to query this specific user's profile
      const { data: userProfile, error: userProfileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      
      if (userProfileError) {
        console.log('❌ User profile error:', userProfileError)
      } else {
        console.log('✅ User profile found:', userProfile)
      }
    } else {
      console.log('⚠️ No authenticated user')
    }

  } catch (error) {
    console.error('🚨 Debug function error:', error)
  }
}

// Quick test function
export async function quickTest() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    console.log('Quick test result:', { data, error })
    return { success: !error, error }
  } catch (err) {
    console.log('Quick test error:', err)
    return { success: false, error: err }
  }
}
