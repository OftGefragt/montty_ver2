import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kzyeipunbkihancsahfs.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ASJEsqchZhGxFkG_LhBxrA_TbS8o9JH'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
