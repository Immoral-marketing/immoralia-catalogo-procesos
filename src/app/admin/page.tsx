/**
 * SPEC-09 — Server Component para /admin.
 *
 * Lee la sesión y verifica el rol de super_admin server-side, para que el
 * componente cliente AdminPage arranque directamente en el estado correcto.
 */
import { createServerSupabaseClient } from '@/lib/supabase/server'
import AdminPage from '@/pages/AdminPage'
import type { User } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function Page() {
  let initialUser: User | null = null
  let initialIsAdmin = false

  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      initialUser = user
      const { data } = await supabase
        .from('super_admins')
        .select('user_id')
        .eq('user_id', user.id)
        .single()
      initialIsAdmin = !!data
    }
  } catch {
    // Fallback: el componente cliente gestiona la autenticación.
  }

  return <AdminPage initialUser={initialUser} initialIsAdmin={initialIsAdmin} />
}
