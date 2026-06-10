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
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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

  return supabaseResponse
}

export const config = {
  matcher: [
    // Ejecutar en todas las rutas excepto assets estáticos de Next.js
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
