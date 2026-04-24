import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Client público (frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client admin (apenas server-side, para webhooks e downloads)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
