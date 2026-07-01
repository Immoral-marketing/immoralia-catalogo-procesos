/**
 * SPEC-09 — Middleware de sesión Supabase.
 *
 * Mantiene las cookies de sesión actualizadas en cada request.
 * Necesario para que @supabase/ssr funcione correctamente con Server
 * Components y Route Handlers: sin esto el token JWT puede quedar caducado
 * en el servidor aunque el cliente lo haya renovado.
 *
 * IMPORTANTE: No redirigimos server-side en /afiliado ni /admin.
 * Los links de invitación y recuperación de contraseña de Supabase llevan
 * el token en el hash de la URL (#access_token=...), que el servidor nunca
 * recibe. Si redirigiéramos, esos flujos quedarían rotos. Los componentes
 * cliente gestionan esos casos con window.location.hash.
 *
 * SPEC-13 — Bloqueo de indexación en hosts no canónicos.
 *
 * Cualquier host distinto del definido en NEXT_PUBLIC_SITE_URL (staging,
 * previews de Vercel, IPs, dominios alternativos) recibe el header
 * X-Robots-Tag: noindex, nofollow para evitar que Google indexe contenido
 * duplicado proveniente de entornos no productivos.
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Extraer solo el hostname de la URL canónica (sin protocolo ni trailing slash).
// Se evalúa una sola vez al arrancar el proceso, no en cada request.
const CANONICAL_HOST = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL
  if (!raw) return null
  try {
    return new URL(raw).host
  } catch {
    return null
  }
})()

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Actualizar cookies tanto en el request como en la respuesta
          // para que Server Components del mismo ciclo lean el token fresco.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() valida el JWT con los servidores de Supabase Auth y renueva
  // el access_token si está caducado. No usamos getSession() porque puede
  // devolver datos de cookie sin validar contra el servidor.
  await supabase.auth.getUser()

  // SPEC-13: si el host de la request no coincide exactamente con el host
  // canónico, marcar como noindex para evitar indexación de entornos no prod.
  const requestHost = request.headers.get('host') ?? ''
  if (CANONICAL_HOST && requestHost !== CANONICAL_HOST) {
    supabaseResponse.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Ejecutar en todas las rutas excepto assets estáticos de Next.js
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
