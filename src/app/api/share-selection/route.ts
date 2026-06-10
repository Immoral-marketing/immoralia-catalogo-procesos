/**
 * POST /api/share-selection
 * Portado de supabase/functions/share-selection/index.ts
 *
 * Envía por email una selección de procesos a una dirección receptora.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getProfessionalTemplate } from '@/lib/email-templates'
import { sendSlackNotification } from '@/lib/slack'

const shareSchema = z.object({
  receiverEmail: z.string().email(),
  senderName: z.string().optional().default('Un usuario'),
  senderEmail: z.string().optional().default('No especificado'),
  selectedProcesses: z.array(z.object({
    id: z.string(),
    nombre: z.string(),
    categoria: z.string().optional(),
  })),
})

function escapeHtml(text: string): string {
  if (!text) return ''
  return text.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(req: NextRequest) {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const body = await req.json()

    const parseResult = shareSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Validation error', details: parseResult.error.errors }, { status: 400 })
    }

    const { receiverEmail, senderName, senderEmail, selectedProcesses } = parseResult.data

    console.log(`Procesando share-selection de ${senderName} a ${receiverEmail}`)

    if (RESEND_API_KEY) {
      const safeSenderName = escapeHtml(senderName)
      const processListHtml = selectedProcesses.map(p =>
        `<li><strong>${escapeHtml(p.nombre)}</strong> ${p.categoria ? `(<em>${escapeHtml(p.categoria)}</em>)` : ''}</li>`
      ).join('')

      try {
        const clientHtml = `
          <h2 style="margin-top:0">¡Hola!</h2>
          <p><strong>${safeSenderName}</strong> (${escapeHtml(senderEmail)}) ha compartido su selección de procesos del catálogo de Immoralia contigo.</p>
          <p>A continuación, puedes ver los procesos que ha seleccionado:</p>
          <ul style="margin-left: 20px;">${processListHtml}</ul>
          <p>Si tienes alguna duda o quieres saber cómo podemos ayudarte a automatizar estos procesos, <a href="https://immoralia.com/contacto">contacta con nosotros</a>.</p>
          <p>Un saludo,<br>El equipo de Immoralia</p>
        `
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: 'Immoralia <noreply@immoralia.es>',
            to: [receiverEmail],
            subject: `${safeSenderName} ha compartido su selección de procesos contigo`,
            html: getProfessionalTemplate({
              title: 'Procesos Compartidos',
              preheader: 'Te han compartido una selección de procesos',
              mainContent: clientHtml,
            }),
          }),
        })
        console.log('Email de share-selection enviado con éxito')
      } catch (emailErr) {
        console.error('Error enviando email de share:', emailErr)
      }
    }

    // Slack (fire-and-forget)
    try {
      await sendSlackNotification(
        `📤 *Nueva selección compartida*\nEl usuario *${senderName}* (${senderEmail}) ha compartido su selección de procesos con *${receiverEmail}*.\nProcesos enviados: ${selectedProcesses.length}`
      )
    } catch (err) {
      console.error('Slack notification error:', err)
    }

    return NextResponse.json({ success: true, message: 'Share processed successfully' })
  } catch (error: any) {
    console.error('Error en /api/share-selection:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error', timestamp: new Date().toISOString() }, { status: 500 })
  }
}
