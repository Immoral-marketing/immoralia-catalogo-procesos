/**
 * SPEC-06 — Cliente Supabase para el browser (Client Components).
 *
 * Usa createBrowserClient de @supabase/ssr que:
 * - En el browser: almacena la sesión en cookies (no localStorage).
 * - En SSR (Node.js): usa storage no-op, sin throws ni guards manuales.
 *
 * Fuente de verdad única — reemplaza:
 *   src/integrations/supabase/client.ts (ahora re-export de este fichero)
 *   src/lib/supabase.ts (ahora re-export de este fichero)
 */
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/integrations/supabase/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'placeholder-anon-key'

/**
 * Crea una instancia fresca del cliente Supabase.
 * Úsalo cuando necesites un cliente dentro de un componente o hook.
 */
export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_KEY)
}

/**
 * Singleton para compatibilidad con el patrón existente:
 *   import { supabase } from "@/lib/supabase/client"
 *
 * createBrowserClient es SSR-safe: cuando se llama en Node.js usa
 * storage no-op en lugar de cookies/localStorage → nunca lanza ReferenceError.
 */
export const supabase = createClient()
