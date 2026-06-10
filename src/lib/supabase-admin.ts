/**
 * Cliente Supabase con service_role key.
 * SOLO para uso en API Route Handlers y Server Components.
 * NUNCA importar desde Client Components ('use client').
 *
 * Usa @supabase/supabase-js directamente (no @supabase/ssr) porque:
 * - Tiene acceso a auth.admin.*
 * - No necesita cookies — opera con service_role bypass de RLS
 */
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''

/** Cliente con service_role — bypasa RLS, accede a auth.admin */
export function createAdminClient() {
  return createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/**
 * Cliente con anon key + JWT del usuario para verificar autenticación.
 * Se usa en create-partner para comprobar que el llamante es super_admin.
 */
export function createCallerClient(authorizationHeader: string) {
  return createClient<Database>(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authorizationHeader } },
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
