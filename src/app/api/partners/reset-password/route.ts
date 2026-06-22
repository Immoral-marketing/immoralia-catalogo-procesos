/**
 * POST /api/partners/reset-password
 * Portado de supabase/functions/reset-partner-password/index.ts
 *
 * Genera un enlace de recuperación de contraseña y lo envía por email.
 * Si el email no pertenece a un partner activo, responde OK igual (no revelar existencia).
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { getProfessionalTemplate } from '@/lib/email-templates'
import { sendEmail } from '@/lib/email-sender'

export async function POST(req: NextRequest) {
  try {
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

    const mainContent = `
      <h2>Hola, ${partner.nombre}</h2>
      <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en el <strong>Portal de Afiliados de Immoralia</strong>.</p>
      <p>Pulsa el botón para crear una nueva contraseña:</p>
      <p style="text-align:center;margin:24px 0;">
        <a href="${resetLink}" class="cta-button">Restablecer contraseña</a>
      </p>
      <div class="info-card">
        Este enlace expira en <strong>1 hora</strong>. Si no solicitaste este cambio, puedes ignorar este email.
      </div>
    `

    const result = await sendEmail({
      kind: 'partners_reset_password',
      to: email,
      subject: 'Restablece tu contraseña — Portal de Afiliados',
      from: 'Portal de Afiliados Immoralia <noreply@procesos.immoralia.es>',
      html: getProfessionalTemplate({
        title: 'Restablece tu contraseña',
        preheader: 'Enlace válido durante 1 hora',
        mainContent,
      }),
      metadata: { partnerId: partner.id },
    })

    if (!result.ok) throw new Error(result.error || 'No se pudo enviar el email')

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[/api/partners/reset-password]', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
