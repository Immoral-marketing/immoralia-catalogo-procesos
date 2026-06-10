/**
 * SPEC-09 — Server Component para /afiliado.
 *
 * Lee la sesión del usuario server-side con @supabase/ssr para:
 * 1. Eliminar el spinner de carga para usuarios ya autenticados.
 * 2. Renderizar directamente el formulario de login para no autenticados.
 *
 * Los flujos con token en el hash (#access_token=...&type=invite|recovery)
 * siguen gestionándose en el componente cliente (AfiliadoPage) mediante
 * window.location.hash, ya que el hash nunca llega al servidor.
 */
import { createServerSupabaseClient } from '@/lib/supabase/server'
import AfiliadoPage from '@/pages/AfiliadoPage'
import type { User } from '@supabase/supabase-js'

export default async function Page() {
  let initialUser: User | null = null

  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase.auth.getUser()
    initialUser = data.user
  } catch {
    // En caso de error (ej. variables de entorno no disponibles en dev local)
    // initialUser permanece null y el componente cliente gestiona la auth.
  }

  return <AfiliadoPage initialUser={initialUser} />
}
