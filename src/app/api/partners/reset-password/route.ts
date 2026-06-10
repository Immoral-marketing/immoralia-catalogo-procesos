/**
 * POST /api/partners/reset-password
 * Portado de supabase/functions/reset-partner-password/index.ts
 *
 * Genera un enlace de recuperación de contraseña y lo envía por email.
 * Si el email no pertenece a un partner activo, responde OK igual (no revelar existencia).
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const { email, redirectTo } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Verificar que el email pertenece a un partner activo
    const { data: partner } = await supabase
      .from('partners')
      .select('id, nombre')
      .eq('email', email)
      .eq('activo', true)
      .single()

    // Si no existe, responder OK igualmente (no revelar si existe)
    if (!partner) {
      return NextResponse.json({ success: true })
    }

    const siteUrl = process.env.SITE_URL ?? 'https://procesos.immoralia.es'

    // Validar redirectTo: solo se acepta si empieza por el dominio propio
    // para prevenir open redirect (el token de recovery se appendea a la URL como fragment)
    const safeRedirectTo = redirectTo && redirectTo.startsWith(siteUrl)
      ? redirectTo
      : `${siteUrl}/afiliado`

    // Generar enlace de recovery via Supabase Admin API
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: safeRedirectTo },
    })

    if (error || !data?.properties?.action_link) {
      throw new Error(error?.message ?? 'No se pudo generar el enlace de recovery')
    }

    const resetLink = data.properties.action_link

    if (RESEND_API_KEY) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: 'Portal de Afiliados Immoralia <noreply@immoralia.es>',
          to: [email],
          subject: 'Restablece tu contraseña — Portal de Afiliados',
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;">
              <h2 style="color:#111;margin-bottom:8px;">Hola, ${partner.nombre}</h2>
              <p style="color:#444;line-height:1.6;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta
                en el <strong>Portal de Afiliados de Immoralia</strong>.
              </p>
              <p style="color:#444;line-height:1.6;">Haz clic en el botón para crear una nueva contraseña:</p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${resetLink}"
                  style="display:inline-block;background:#6366f1;color:#fff;padding:14px 28px;
                         border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">
                  Restablecer contraseña
                </a>
              </div>
              <p style="color:#888;font-size:13px;line-height:1.5;">
                Este enlace expira en <strong>1 hora</strong>.<br/>
                Si no solicitaste este cambio, puedes ignorar este email.
              </p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
              <p style="color:#bbb;font-size:12px;">Immoral Group · procesos.immoralia.es</p>
            </div>
          `,
        }),
      })

      if (!resendRes.ok) {
        const resendError = await resendRes.text()
        throw new Error(`Resend error: ${resendError}`)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[/api/partners/reset-password]', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
