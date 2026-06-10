/**
 * POST /api/leads/contact
 * Portado de supabase/functions/send-contact-email/index.ts
 *
 * Procesa un lead de ContactForm / Chatbot handover / LeadCaptureModal:
 * guarda en Supabase, rate-limit, crea tarea ClickUp, envía emails y notifica Slack.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase-admin'
import { getProfessionalTemplate } from '@/lib/email-templates'
import { sendSlackNewLead } from '@/lib/slack'

const CLICKUP_LIST_ID = '901521069796'
const RATE_LIMIT_PERIOD_MS = 60 * 60 * 1000
const MAX_REQUESTS_PER_PERIOD = 50

const ProcessSchema = z.object({
  id: z.string().max(50),
  codigo: z.string().max(20),
  nombre: z.string().max(200),
  categoriaNombre: z.string().max(100),
  tagline: z.string().max(500),
  customizations: z.any().optional(),
})

const ContactRequestSchema = z.object({
  nombre: z.string().trim().min(2, 'El nombre parece incompleto').max(100),
  email: z.string().trim().email('Email no válido').max(255),
  empresa: z.string().trim().optional().or(z.literal('')),
  telefono: z.string().optional(),
  utm: z.string().optional(),
  source: z.string().optional(),
  comentario: z.string().max(2000).default(''),
  selectedProcesses: z.array(ProcessSchema).max(50),
  onboardingAnswers: z.any().optional(),
  chatbotContext: z.array(z.string()).optional(),
  n8nHosting: z.enum(['setup', 'own']).default('setup'),
}).refine((data) => {
  if (data.source !== 'chatbot' && data.source !== 'sin_sector' && (!data.selectedProcesses || data.selectedProcesses.length === 0)) return false
  return true
}, { message: 'Selecciona al menos un proceso', path: ['selectedProcesses'] })

function escapeHtml(text: string): string {
  if (!text) return ''
  return text.toString()
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

function getMadridHour(): number {
  const formatter = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/Madrid' })
  return parseInt(formatter.format(new Date()))
}

function formatOnboarding(answers: any): string {
  if (!answers) return 'No se proporcionaron respuestas de onboarding.'
  let text = ''
  if (answers.sector) text += `Sector: ${answers.sector}${answers.otherSector ? ` (${answers.otherSector})` : ''}\n`
  if (answers.maturity) text += `Madurez: ${answers.maturity}\n`
  if (answers.tools && Array.isArray(answers.tools)) text += `Herramientas: ${answers.tools.join(', ')}\n`
  if (answers.channels) {
    if (answers.channels.clients?.length) text += `Canales Clientes: ${answers.channels.clients.join(', ')}\n`
    if (answers.channels.internal?.length) text += `Canales Internos: ${answers.channels.internal.join(', ')}\n`
  }
  if (answers.usesAI !== undefined) {
    text += `Usa IA: ${answers.usesAI ? 'Sí' : 'No'}\n`
    if (answers.usesAI) {
      if (answers.aiTools) text += `- Herramientas IA: ${answers.aiTools}\n`
      if (answers.aiUsagePurpose) text += `- Propósito IA: ${answers.aiUsagePurpose}\n`
    }
  }
  if (answers.pains && Array.isArray(answers.pains) && answers.pains.length) text += `Dolores/Necesidades:\n- ${answers.pains.join('\n- ')}\n`
  if (answers.otherPain) text += `Otros dolores: ${answers.otherPain}\n`
  if (answers.biggestPain) text += `Mayor freno: ${answers.biggestPain}\n`
  return text
}

export async function POST(req: NextRequest) {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN

    const clientIP = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const rawData = await req.json()

    const validationResult = ContactRequestSchema.safeParse(rawData)
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Datos inválidos',
        details: validationResult.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
      }, { status: 400 })
    }

    const { nombre, email, empresa, comentario, selectedProcesses, onboardingAnswers, n8nHosting, telefono, utm, source, chatbotContext } = validationResult.data
    const isChatbot = source === 'chatbot'
    const isSinSector = source === 'sin_sector'
    const isBusinessHours = (() => { const h = getMadridHour(); return h >= 8 && h < 18 })()

    const supabase = createAdminClient()

    // Guardar en Supabase
    const { error: insertError } = await supabase.from('contact_submissions').insert({
      nombre, email, empresa: empresa || '', comentario,
      selected_processes: selectedProcesses,
      onboarding_answers: onboardingAnswers,
      ip_address: clientIP,
    })
    if (insertError) console.error('ERROR en contact_submissions:', insertError)

    // Rate limit — dos queries separadas para evitar interpolación de valores en el filtro .or()
    // (un email con caracteres especiales como + podría romper el string de filtro PostgREST)
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_PERIOD_MS).toISOString()
    const [{ count: countByIP }, { count: countByEmail }] = await Promise.all([
      supabase.from('contact_requests_log').select('*', { count: 'exact', head: true })
        .eq('ip_address', clientIP).eq('status', 'success').gt('created_at', oneHourAgo),
      supabase.from('contact_requests_log').select('*', { count: 'exact', head: true })
        .eq('email', email).eq('status', 'success').gt('created_at', oneHourAgo),
    ])
    const count = Math.max(countByIP ?? 0, countByEmail ?? 0)

    if (count >= MAX_REQUESTS_PER_PERIOD) {
      await supabase.from('contact_requests_log').insert({ ip_address: clientIP, email, status: 'blocked' })
      return NextResponse.json({ error: 'Has superado el límite de solicitudes por hora. Inténtalo más tarde.' }, { status: 429 })
    }

    // ClickUp
    let clickupTaskId: string | null = null
    let clickupTaskUrl = ''

    if (CLICKUP_TOKEN) {
      try {
        const isoDatetime = new Date().toISOString()
        const onboardingText = formatOnboarding(onboardingAnswers)
        const processesText = selectedProcesses.map((p: any) => {
          let text = `- ${p.codigo}: ${p.nombre}`
          if (p.customizations) {
            const opts = p.customizations.selectedOptions || {}
            const inputs = p.customizations.customInputs || {}
            const optKeys = Object.keys(opts)
            if (optKeys.length > 0) {
              text += `\n  Personalización:`
              optKeys.forEach(k => {
                const val = opts[k]
                const customInputStr = inputs[k] ? ` (Especificado: ${inputs[k]})` : ''
                text += `\n    * ${k}: ${val}${customInputStr}`
              })
            }
            if (inputs.needs?.trim()) text += `\n  Necesidades específicas:\n    "${inputs.needs.trim()}"`
          }
          return text
        }).join('\n\n')

        const chatbotHistory = isChatbot && chatbotContext?.length
          ? `\n### Historial del Chatbot\n${chatbotContext.join('\n')}\n`
          : ''

        const sourceLabel = isSinSector ? 'Sin sector' : isChatbot ? 'Chatbot' : 'Web'
        const description = `Lead desde Catálogo · ${sourceLabel}\n\n### Información de Contacto\n**Empresa:** ${empresa}\n**Persona:** ${nombre}\n**Email:** ${email}\n**Tel:** ${telefono || 'No proporcionado'}\n\n### Contexto\n**Mensaje:** ${comentario || 'Sin mensaje'}\n**Preferencia n8n:** ${n8nHosting === 'own' ? 'Servidor propio' : 'Setup Auto'}\n**Origen:** ${source || 'Web'}\n**UTM:** ${utm || 'Ninguna'}\n**Fecha:** ${isoDatetime}\n${chatbotHistory}\n### Onboarding\n${onboardingText}\n\n### Procesos Seleccionados\n${processesText}`

        const createTask = async (withStatus = true) => {
          const empresaStr = empresa?.trim() || ''
          let taskName: string
          if (isSinSector) {
            taskName = empresaStr ? `Catálogo · Sin sector · ${empresaStr} — ${nombre}` : `Catálogo · Sin sector — ${nombre}`
          } else if (isChatbot) {
            taskName = empresaStr ? `Catálogo · Chatbot · ${empresaStr} — ${nombre}` : `Catálogo · Chatbot — ${nombre}`
          } else {
            taskName = empresaStr ? `Catálogo · Web · ${empresaStr} — ${nombre}` : `Catálogo · Web — ${nombre}`
          }
          const body: any = { name: taskName, description, priority: 3 }
          if (withStatus) body.status = isChatbot && isBusinessHours ? 'CONTACTAR YA' : 'INTERESADO'
          const res = await fetch(`https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: CLICKUP_TOKEN },
            body: JSON.stringify(body),
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
        console.log('Tarea creada en ClickUp:', clickupTaskId)
      } catch (clickupError) {
        console.error('Fallo en integración ClickUp:', clickupError)
      }
    }

    // Emails
    if (RESEND_API_KEY) {
      const safeNombre = escapeHtml(nombre)
      const safeEmail = escapeHtml(email)
      const safeEmpresa = escapeHtml(empresa || '')
      const safeComentario = escapeHtml(comentario || 'No indicado')
      const safeTelefono = escapeHtml(telefono || 'No indicado')
      const sourceLabel = isChatbot ? 'Derivación desde Chatbot' : 'Solicitud de Oferta'
      const processesListHTML = selectedProcesses.length > 0
        ? `<ul>${selectedProcesses.map((p: any) => `<li><strong>${escapeHtml(p.codigo)}</strong> - ${escapeHtml(p.nombre)}</li>`).join('')}</ul>`
        : '<p>Sin procesos seleccionados</p>'

      try {
        const emailsToBatch: Promise<any>[] = []

        const internalMainContent = `
          <p class="field-label">Origen de la solicitud</p>
          <div class="field-value">${sourceLabel} ${isChatbot && isBusinessHours ? '<strong>(En horario laboral - Atención inmediata)</strong>' : ''}</div>
          <div style="display:flex;gap:20px;">
            <div style="flex:1"><p class="field-label">Persona</p><div class="field-value">${safeNombre}</div></div>
            <div style="flex:1"><p class="field-label">Empresa</p><div class="field-value">${safeEmpresa}</div></div>
          </div>
          <div style="display:flex;gap:20px;">
            <div style="flex:1"><p class="field-label">Email</p><div class="field-value">${safeEmail}</div></div>
            <div style="flex:1"><p class="field-label">Teléfono</p><div class="field-value">${safeTelefono}</div></div>
          </div>
          <h2 class="section-title">Detalles de la Solicitud</h2>
          ${!isChatbot ? `<h3>Procesos Seleccionados:</h3>${processesListHTML}` : ''}
          <p class="field-label">Comentario</p>
          <div class="field-value">${safeComentario}</div>
          ${isChatbot && chatbotContext?.length ? `<h2 class="section-title">Historial del Chat</h2><pre>${chatbotContext.join('\n')}</pre>` : ''}
          ${clickupTaskUrl ? `<a href="${clickupTaskUrl}" class="cta-button">Ver en ClickUp</a>` : ''}
        `

        emailsToBatch.push(
          fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
            body: JSON.stringify({
              from: 'Immoralia Notificaciones <noreply@immoralia.es>',
              to: ['team@immoralia.es'],
              subject: `${isChatbot && isBusinessHours ? '⚡ [INMEDIATO] ' : '🚀 '}Lead: ${safeEmpresa} - ${safeNombre}`,
              html: getProfessionalTemplate({ title: 'Nueva Solicitud de Lead', preheader: `Nueva solicitud de ${safeNombre} (${safeEmpresa})`, mainContent: internalMainContent }),
            }),
          })
        )

        // Email al usuario (solo si aplica)
        let shouldSendUserEmail = true
        let clientMainContent = ''
        let clientSubject = 'Hemos recibido tu solicitud - Immoralia'

        if (isChatbot) {
          if (isBusinessHours) {
            shouldSendUserEmail = false
          } else {
            clientSubject = 'Recibido: Revisaremos tu consulta lo antes posible'
            clientMainContent = `
              <h2 style="margin-top:0">¡Hola, ${safeNombre}!</h2>
              <p>Hemos recibido tu solicitud de contacto a través de nuestro asistente virtual.</p>
              <p>Te escribimos para confirmarte que <strong>estamos fuera de nuestro horario de atención habitual (08:00 - 18:00)</strong>.</p>
              <p>Un consultor humano revisará tu caso en cuanto volvamos a estar operativos.</p>
              <p><strong>Nos pondremos en contacto contigo lo antes posible.</strong></p>
            `
          }
        } else {
          clientMainContent = `
            <h2 style="margin-top:0">¡Gracias por tu solicitud, ${safeNombre}!</h2>
            <p>Hemos recibido tu interés en automatizar procesos para <strong>${safeEmpresa}</strong>.</p>
            <p>Nuestro equipo está analizando los procesos que has seleccionado para preparar una propuesta personalizada.</p>
            <p><strong>Un consultor se pondrá en contacto contigo en las próximas 24 horas laborables.</strong></p>
            <br>
            <div style="background-color:#f8fafc;padding:20px;border-radius:8px;">
              <h4 style="margin-top:0">Resumen de procesos seleccionados:</h4>
              ${processesListHTML}
            </div>
          `
        }

        if (shouldSendUserEmail) {
          emailsToBatch.push(
            fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
              body: JSON.stringify({
                from: 'Immoralia <noreply@immoralia.es>',
                to: [email],
                subject: clientSubject,
                html: getProfessionalTemplate({ title: 'Confirmación de solicitud', preheader: 'Hemos recibido tu solicitud correctamente', mainContent: clientMainContent }),
              }),
            })
          )
        }

        await Promise.all(emailsToBatch)
        console.log('Lead emails procesados con éxito')
      } catch (err) {
        console.error('Error procesando emails:', err)
      }
    }

    // Slack
    if (clickupTaskId) {
      await sendSlackNewLead({
        lead: { nombre, email, empresa, telefono, comentario, utm },
        clickupTask: { id: clickupTaskId, url: clickupTaskUrl },
        source: source === 'chatbot' ? 'chatbot' : source === 'sin_sector' ? 'sin_sector' : source === 'onboarding' ? 'onboarding' : 'offer_request',
      }).catch(err => console.error('Slack notification error:', err))
    }

    // Log éxito
    await supabase.from('contact_requests_log').insert({ ip_address: clientIP, email, status: 'success' })

    return NextResponse.json({ success: true, clickup_task_id: clickupTaskId })
  } catch (error: any) {
    console.error('Error en /api/leads/contact:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
