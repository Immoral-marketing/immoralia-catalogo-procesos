/**
 * SPEC-06 — Cliente Supabase para Server Components y API Route Handlers.
 *
 * Usa createServerClient de @supabase/ssr que:
 * - Lee/escribe la sesión desde las cookies del request HTTP.
 * - Solo puede usarse en contextos con acceso a cookies (Server Components,
 *   Route Handlers, middleware). NUNCA en Client Components.
 *
 * SPEC-07 importará esta función para los Route Handlers de API.
 */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/integrations/supabase/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'placeholder-anon-key'

/**
 * Crea un cliente Supabase con acceso a las cookies del request actual.
 * Es async porque cookies() de next/headers es async en Next.js 15.
 *
 * Uso en Route Handlers:
 *   const supabase = await createServerSupabaseClient()
 *   const { data } = await supabase.from('...').select('...')
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Llamado desde un Server Component (read-only cookies).
          // Ignorar: sin middleware de refresco de sesión esto es esperado.
        }
      },
    },
  })
}
