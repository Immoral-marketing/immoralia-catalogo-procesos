import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/integrations/supabase/types'

// Fallbacks hardcoded para cubrir el caso en que Vercel no tenga
// las variables NEXT_PUBLIC_* configuradas (migración de VITE_ → NEXT_PUBLIC_)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ?? 'https://oxcjcsyowrlslbeylmih.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94Y2pjc3lvd3Jsc2xiZXlsbWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMjEwNzMsImV4cCI6MjA4ODg5NzA3M30.hr0WO4sjjE3Lx5RfnnZJqfvTg9VVPzu6dDW8ouCll3c'

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_KEY)
}

export const supabase = createClient()
export { createClient as default }
