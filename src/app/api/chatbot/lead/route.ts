/**
 * POST /api/chatbot/lead — SPEC-03: captura del lead desde el chat.
 *
 * Valida datos + consentimiento RGPD, garantiza UN lead por conversación
 * (idempotencia) y dispara el circuito completo: Supabase + ClickUp (con
 * resumen del contexto + últimos mensajes) + GHL (webhook) + Slack + email
 * provisional. El visitante nunca ve fallos de sistemas externos (CA-13).
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase-admin'
import { sendSlackNewLead } from '@/lib/slack'
import { sendChatbotEmail } from '@/lib/chatbot/emails'
import { getConversation, getMessages, isExpired, updateConversationFlags } from '@/lib/chatbot/store'
import { SECTOR_NAMES } from '@/lib/chatbot/constants'
import type { ConversationRow, MessageRow } from '@/lib/chatbot/types'

const CLICKUP_LIST_ID = '901521069796' // misma lista que /api/leads/contact
const GHL_LEAD_WEBHOOK_URL = process.env.GHL_LEAD_WEBHOOK_URL
  ?? 'https://services.leadconnectorhq.com/hooks/oAgj6wUxweXdbWMvz0Gn/webhook-trigger/673af019-7b64-4d52-ac6b-e0adbcb12a60'
const MAX_LEADS_PER_IP_PER_HOUR = 5

const bodySchema = z.object({
  conversationId: z.string().uuid(),
  nombre: z.string().trim().min(2, 'El nombre parece incompleto').max(100),
  email: z.string().trim().email('Email no válido').max(255),
  consent: z.literal(true, { errorMap: () => ({ message: 'Debes aceptar la política de privacidad' }) }),
  /** handover: el visitante pidió contacto humano («que me escribáis») */
  mode: z.enum(['capture', 'handover']).default('capture'),
})

function getMadridHour(): number {
  const formatter = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/Madrid' })
  return parseInt(formatter.format(new Date()))
}

/** Resumen del contexto del cliente para la tarea de ClickUp (CA-16). */
function buildContextSummary(conversation: ConversationRow, messages: MessageRow[]): string {
  const sectorName = conversation.initial_sector
    ? SECTOR_NAMES[conversation.initial_sector] ?? conversation.initial_sector
    : 'Sin sector identificado'
  const recommended = [...new Set(messages.flatMap(m => m.recommended_slugs))]

  let summary = conversation.summary
  if (!summary) {
    // Conversación corta sin resumen acumulado: derivarlo de los mensajes del usuario
    const userLines = messages.filter(m => m.role === 'user').slice(0, 4).map(m => `- ${m.content}`)
    summary = userLines.length ? `Lo que contó el visitante:\n${userLines.join('\n')}` : 'Conversación muy breve.'
  }

  return [
    `**Sector:** ${sectorName}`,
    `**Turnos de conversación:** ${conversation.user_message_count}`,
    '',
    '**Contexto del cliente (quién es, qué buscaba, dolores):**',
    summary,
    '',
    recommended.length ? `**Procesos recomendados:** ${recommended.join(', ')}` : '**Procesos recomendados:** ninguno todavía',
  ].join('\n')
}

function buildLastMessages(messages: MessageRow[], n = 6): string {
  return messages
    .slice(-n)
    .map(m => `${m.role === 'user' ? '👤 Usuario' : '🤖 Bot'}: ${m.content}`)
    .join('\n\n')
}

export async function POST(req: NextRequest) {
  let body: z.infer<typeof bodySchema>
  try {
    body = bodySchema.parse(await req.json())
  } catch (error) {
    const message = error instanceof z.ZodError ? error.errors[0]?.message : 'Petición inválida'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const clientIP = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const supabase = createAdminClient()

  try {
    // 1. Conversación válida y vigente
    const conversation = await getConversation(body.conversationId)
    if (!conversation || isExpired(conversation)) {
      return NextResponse.json({ error: 'Conversación no válida' }, { status: 404 })
    }

    // 2. Idempotencia: un lead por conversación (CA-14)
    if (conversation.lead_captured && conversation.lead_id) {
      return NextResponse.json({ success: true, alreadyCaptured: true })
    }

    // 3. Rate limit por IP (endpoint público que dispara emails y sistemas externos)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('contact_requests_log')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', clientIP)
      .eq('status', 'success')
      .gt('created_at', oneHourAgo)
    if ((count ?? 0) >= MAX_LEADS_PER_IP_PER_HOUR) {
      await supabase.from('contact_requests_log').insert({ ip_address: clientIP, email: body.email, status: 'blocked' })
      return NextResponse.json({ error: 'Demasiadas solicitudes. Inténtalo más tarde.' }, { status: 429 })
    }

    const isHandover = body.mode === 'handover'
    const messages = await getMessages(conversation.id)
    const contextSummary = buildContextSummary(conversation, messages)
    const lastMessages = buildLastMessages(messages)

    // 4. Lead en BBDD — SIEMPRE primero: si lo externo falla, el lead existe (CA-13)
    const consentNote = `Consentimiento RGPD aceptado el ${new Date().toISOString()} (chatbot v3, política /privacidad)`
    const { data: leadRow, error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        nombre: body.nombre,
        email: body.email,
        empresa: '',
        comentario: `${isHandover ? '🔴 PIDE CONTACTO HUMANO (compromiso 24h)\n\n' : ''}Lead capturado por el chatbot v3.\n${consentNote}`,
        selected_processes: [],
        ip_address: clientIP,
      })
      .select('id')
      .single()
    if (insertError || !leadRow) {
      console.error('ERROR insertando lead del chatbot:', insertError)
      return NextResponse.json({ error: 'No se pudo registrar. Inténtalo de nuevo.' }, { status: 500 })
    }

    // 5. Flags de la conversación (CA-15)
    await updateConversationFlags(conversation.id, {
      lead_captured: true,
      lead_id: leadRow.id,
      ...(isHandover ? { human_requested: true } : {}),
    })

    // 6. ClickUp — descripción con resumen de contexto + últimos mensajes (CA-16)
    let clickupTaskId: string | null = null
    let clickupTaskUrl = ''
    const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN
    if (CLICKUP_TOKEN) {
      try {
        const isBusinessHours = (() => { const h = getMadridHour(); return h >= 8 && h < 18 })()
        const taskName = `${isHandover ? '🔴 ' : ''}Catálogo · Chatbot — ${body.nombre}`
        const description = [
          `Lead desde Catálogo · Chatbot${isHandover ? ' · **PIDE CONTACTO HUMANO — responder en <24h**' : ''}`,
          '',
          '### Información de Contacto',
          `**Persona:** ${body.nombre}`,
          `**Email:** ${body.email}`,
          `**Conversación:** ${conversation.id} (tabla chatbot_conversations)`,
          '',
          '### Resumen del contexto',
          contextSummary,
          '',
          '### Últimos mensajes',
          lastMessages,
        ].join('\n')

        const createTask = async (withStatus: boolean) => {
          const taskBody: Record<string, unknown> = {
            name: taskName,
            description,
            priority: isHandover ? 1 : 3,
          }
          if (withStatus) taskBody.status = (isHandover || isBusinessHours) ? 'CONTACTAR YA' : 'INTERESADO'
          const res = await fetch(`https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: CLICKUP_TOKEN },
            body: JSON.stringify(taskBody),
          })
          if (!res.ok) throw new Error(`ClickUp ${res.status}`)
          return res.json()
        }

        let task
        try { task = await createTask(true) } catch { task = await createTask(false) }
        clickupTaskId = task.id
        clickupTaskUrl = task.url || `https://app.clickup.com/t/${clickupTaskId}`
      } catch (clickupError) {
        console.error('Fallo ClickUp (lead chatbot):', clickupError)
      }
    }

    // 7. GHL — webhook de entrada (mismo patrón que las auditorías)
    try {
      await fetch(GHL_LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: body.nombre.split(' ')[0],
          last_name: body.nombre.split(' ').slice(1).join(' '),
          email: body.email,
          custom_fields: {
            chatbot_conversation_id: conversation.id,
            chatbot_sector: conversation.initial_sector || 'sin_sector',
            chatbot_summary: (conversation.summary || '').slice(0, 500),
            chatbot_human_requested: isHandover,
          },
          tags: ['chatbot_lead', ...(conversation.initial_sector ? [conversation.initial_sector] : []), ...(isHandover ? ['pide_humano'] : [])],
        }),
      })
    } catch (ghlError) {
      console.error('Fallo GHL webhook (lead chatbot):', ghlError)
    }

    // 8. Slack — notificación simple
    if (clickupTaskId) {
      await sendSlackNewLead({
        lead: {
          nombre: body.nombre,
          email: body.email,
          comentario: isHandover ? '🔴 Pide contacto humano — responder en <24h' : 'Lead capturado por el chatbot',
        },
        clickupTask: { id: clickupTaskId, url: clickupTaskUrl },
        source: 'chatbot',
      }).catch(err => console.error('Slack (lead chatbot):', err))
    }

    // 9. Email provisional (CA-18) — handover tiene su propio copy
    await sendChatbotEmail(isHandover ? 'handover_written' : 'lead_captured', {
      to: body.email,
      nombre: body.nombre,
    })

    // 10. Log de éxito (rate limiting compartido)
    await supabase.from('contact_requests_log').insert({ ip_address: clientIP, email: body.email, status: 'success' })

    return NextResponse.json({ success: true, leadId: leadRow.id })
  } catch (error) {
    console.error('Error en /api/chatbot/lead:', error)
    return NextResponse.json({ error: 'No se pudo registrar. Inténtalo de nuevo.' }, { status: 500 })
  }
}
