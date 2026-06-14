/**
 * POST /api/leads/onboarding
 * Portado de supabase/functions/submit-onboarding-lead/index.ts
 *
 * Procesa un lead del Quick Form / CalendlyLeadModal:
 * guarda en Supabase, envía emails, crea tarea ClickUp y notifica Slack.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase-admin'
import { getProfessionalTemplate } from '@/lib/email-templates'
import { sendEmail } from '@/lib/email-sender'
import { sendSlackNewLead } from '@/lib/slack'

const CLICKUP_LIST_ID = '901521069796'

const leadSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().optional(),
  utm: z.string().optional(),
  source: z.string().optional(),
  answers: z.any(),
})

function escapeHtml(text: string): string {
  if (!text) return ''
  return text.toString()
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

function formatOnboarding(ans: any): string {
  if (!ans) return 'No se proporcionó información adicional.'
  let text = ''
  if (ans.sector) text += `Sector: ${ans.sector}${ans.otherSector ? ` (${ans.otherSector})` : ''}\n`
  if (ans.maturity) text += `Madurez: ${ans.maturity}\n`
  if (ans.tools && Array.isArray(ans.tools)) text += `Herramientas: ${ans.tools.join(', ')}\n`
  if (ans.channels) {
    if (ans.channels.clients?.length) text += `Canales Clientes: ${ans.channels.clients.join(', ')}\n`
    if (ans.channels.internal?.length) text += `Canales Internos: ${ans.channels.internal.join(', ')}\n`
  }
  if (ans.usesAI !== undefined) {
    text += `Usa IA: ${ans.usesAI ? 'Sí' : 'No'}\n`
    if (ans.usesAI) {
      if (ans.aiTools) text += `- Herramientas IA: ${ans.aiTools}\n`
      if (ans.aiUsagePurpose) text += `- Propósito IA: ${ans.aiUsagePurpose}\n`
    }
  }
  if (ans.pains && Array.isArray(ans.pains) && ans.pains.length) text += `Dolores:\n- ${ans.pains.join('\n- ')}\n`
  if (ans.otherPain) text += `Otros dolores: ${ans.otherPain}\n`
  if (ans.biggestPain) text += `Mayor freno: ${ans.biggestPain}\n`
  return text || 'No se proporcionó información adicional.'
}

export async function POST(req: NextRequest) {
  try {
    const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN

    const body = await req.json()
    const parseResult = leadSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Validation error', details: parseResult.error.errors }, { status: 400 })
    }

    const { nombre, email, telefono, answers, utm, source } = parseResult.data
    const clientIP = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'

    console.log(`Procesando Quick Form lead: ${email}`)

    // Guardar en Supabase
    const supabase = createAdminClient()
    const { error: dbError } = await supabase
      .from('onboarding_leads')
      .insert({ nombre, email, telefono, answers, ip_address: clientIP })

    if (dbError) console.error('Error guardando lead en DB:', dbError)

    const onboardingText = formatOnboarding(answers)

    // Emails — SPEC-05: vía sendEmail (registra en email_logs)
    {
      const safeNombre = escapeHtml(nombre)
      const safeEmail = escapeHtml(email)
      const safeTelefono = escapeHtml(telefono || 'No indicado')
      const safeUtm = escapeHtml(utm || 'Ninguna')

      const internalHtml = `
        <p class="field-label">Nombre del Lead</p><div class="field-value">${safeNombre}</div>
        <p class="field-label">Email de Contacto</p><div class="field-value">${safeEmail}</div>
        <p class="field-label">Teléfono</p><div class="field-value">${safeTelefono}</div>
        <p class="field-label">UTM / Origen</p><div class="field-value">${safeUtm}</div>
        <h2 class="section-title">Respuestas del Formulario</h2>
        <pre>${onboardingText}</pre>
      `
      const clientHtml = `
        <h2>¡Gracias por tu interés, ${safeNombre}!</h2>
        <p>Hemos recibido correctamente la información que nos has facilitado a través de nuestro catálogo de procesos.</p>
        <p>Nuestro equipo de consultores está revisando tu perfil para identificar las mejores oportunidades de automatización para tu caso específico.</p>
        <div class="info-card">
          <strong>Nos pondremos en contacto contigo en menos de 24 horas laborables para agendar una breve sesión de diagnóstico.</strong>
        </div>
        <p>Mientras tanto, puedes seguir explorando nuestro catálogo para descubrir cómo la IA y la automatización pueden transformar tu negocio.</p>
      `

      await Promise.all([
        sendEmail({
          kind: 'onboarding_internal',
          to: 'team@immoralia.es',
          subject: `⚡ Quick Form Lead - ${safeNombre}`,
          from: 'Immoralia Notificaciones <noreply@procesos.immoralia.es>',
          html: getProfessionalTemplate({ title: 'Nuevo Quick Form Lead', preheader: `Nuevo lead de ${safeNombre}`, mainContent: internalHtml }),
          metadata: { source: source || 'quick_form', utm },
        }),
        sendEmail({
          kind: 'onboarding_client',
          to: email,
          subject: 'Confirmación de recepción — Immoralia',
          html: getProfessionalTemplate({ title: 'Confirmación recibida', preheader: 'Hemos recibido tu información correctamente', mainContent: clientHtml }),
        }),
      ])
    }

    // ClickUp
    let clickupTaskId: string | null = null
    let clickupTaskUrl = ''

    if (CLICKUP_TOKEN) {
      try {
        const isoDatetime = new Date().toISOString()
        const description = `Quick Form Lead desde Web\n\n### Información de Contacto\n**Persona:** ${nombre}\n**Email:** ${email}\n**Tel:** ${telefono || 'No proporcionado'}\n\n### Contexto\n**Origen:** ${source || 'Web'}\n**UTM:** ${utm || 'Ninguna'}\n**Fecha:** ${isoDatetime}\n\n### Respuestas\n${onboardingText}`

        const createTask = async (withStatus = true) => {
          const taskBody: any = { name: `Quick Form Lead: ${nombre}`, description, priority: 3 }
          if (withStatus) taskBody.status = 'CONOCIDO'
          const res = await fetch(`https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: CLICKUP_TOKEN },
            body: JSON.stringify(taskBody),
          })
          if (!res.ok) throw { status: res.status, data: await res.json() }
          return res.json()
        }

        try {
          const task = await createTask(true)
          clickupTaskId = task.id
          clickupTaskUrl = task.url || `https://app.clickup.com/t/${clickupTaskId}`
        } catch {
          const task = await createTask(false)
          clickupTaskId = task.id
          clickupTaskUrl = task.url || `https://app.clickup.com/t/${clickupTaskId}`
        }
        console.log('Tarea onboarding creada en ClickUp:', clickupTaskId)
      } catch (clickupError) {
        console.error('Fallo en integración ClickUp (onboarding):', clickupError)
      }
    }

    // Slack (fire-and-forget)
    if (clickupTaskId) {
      sendSlackNewLead({
        lead: { nombre, email, telefono, utm },
        clickupTask: { id: clickupTaskId, url: clickupTaskUrl },
        source: 'quick_form',
      }).catch(err => console.error('Slack notification error:', err))
    }

    return NextResponse.json({ success: true, message: 'Lead processed successfully', emailSent: true, clickup_task_id: clickupTaskId })
  } catch (error: any) {
    console.error('Error en /api/leads/onboarding:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error', timestamp: new Date().toISOString() }, { status: 500 })
  }
}
