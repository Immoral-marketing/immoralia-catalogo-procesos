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
import {
  getConversation,
  getMessages,
  getVisitor,
  getVisitorConversationHistoryText,
  isExpired,
  linkVisitorToLead,
  mergeVisitorsByEmail,
  updateConversationFlags,
} from '@/lib/chatbot/store'
import { SECTOR_NAMES } from '@/lib/chatbot/constants'
import type { ConversationRow, MessageRow, StructuredSummary, VisitorRow } from '@/lib/chatbot/types'

const CLICKUP_LIST_ID = '901521069796' // misma lista que /api/leads/contact
const GHL_API_KEY = process.env.GHL_API_KEY
const GHL_LOCATION_ID = 'oAgj6wUxweXdbWMvz0Gn'
const GHL_PIPELINE_ID = 'j9WpjWFG6LKRRJ5ti84W'
const GHL_STAGE_NEW_LEAD = '67c9e715-c68a-47fa-94d5-196c559e6407'
const GHL_API_BASE = 'https://services.leadconnectorhq.com'
const GHL_API_HEADERS = (key: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${key}`,
  Version: '2021-07-28',
})
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

/** Resumen del contexto del cliente para la tarea de ClickUp (CA-16).
 *  SPEC-08: si existe structured_summary, tiene prioridad sobre el texto libre. */
function buildContextSummary(conversation: ConversationRow, messages: MessageRow[]): string {
  const ss = conversation.structured_summary as StructuredSummary | null

  const sectorName = (ss?.sector ? SECTOR_NAMES[ss.sector] ?? ss.sector : null)
    ?? (conversation.initial_sector ? SECTOR_NAMES[conversation.initial_sector] ?? conversation.initial_sector : 'Sin sector identificado')

  const recommended = [...new Set(messages.flatMap(m => m.recommended_slugs))]

  if (ss) {
    const painBlock = ss.pain_points.length
      ? ss.pain_points.map(p => `- ${p}`).join('\n')
      : '- (ninguno capturado)'
    return [
      `**Sector:** ${sectorName}`,
      `**Nivel de interés:** ${ss.nivel_interes}`,
      `**Turnos de conversación:** ${conversation.user_message_count}`,
      '',
      '**Dolores mencionados:**',
      painBlock,
      '',
      recommended.length ? `**Procesos recomendados:** ${recommended.join(', ')}` : '**Procesos recomendados:** ninguno todavía',
    ].join('\n')
  }

  // Fallback: resumen de texto libre (conversaciones antiguas o sin structured_summary)
  let summary = conversation.summary
  if (!summary) {
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

/** SPEC-07 — Extrae los slugs de procesos recomendados durante la conversación.
 *  allSlugs: todos los únicos (para CRM e historial completo).
 *  primarySlug: el último recomendado en el mensaje del bot más reciente con slugs. */
function extractProcessInterest(messages: MessageRow[]): {
  allSlugs: string[]
  primarySlug: string | null
} {
  const allSlugs = [...new Set(messages.flatMap(m => m.recommended_slugs))]
  const lastWithSlugs = [...messages].reverse().find(
    m => m.role === 'assistant' && m.recommended_slugs.length > 0,
  )
  const primarySlug = lastWithSlugs
    ? (lastWithSlugs.recommended_slugs[lastWithSlugs.recommended_slugs.length - 1] ?? null)
    : null
  return { allSlugs, primarySlug }
}

// SPEC-11: custom fields de GHL para datos del visitante (IDs configurados en env vars)
function buildGHLVisitorFields(
  visitor: Pick<VisitorRow, 'created_at' | 'conversation_count'>,
  historyText: string,
  contextSummary: string,
): Array<{ id: string; field_value: string }> {
  const fields: Array<{ id: string; field_value: string }> = []
  const F_FIRST_SEEN = process.env.GHL_FIELD_VISITOR_FIRST_SEEN
  const F_CONV_COUNT = process.env.GHL_FIELD_VISITOR_CONV_COUNT
  const F_HISTORY = process.env.GHL_FIELD_VISITOR_HISTORY
  const F_SUMMARY = process.env.GHL_FIELD_CHATBOT_SUMMARY

  if (F_FIRST_SEEN) fields.push({ id: F_FIRST_SEEN, field_value: visitor.created_at })
  if (F_CONV_COUNT) fields.push({ id: F_CONV_COUNT, field_value: String(visitor.conversation_count) })
  if (F_HISTORY && historyText) fields.push({ id: F_HISTORY, field_value: historyText })
  if (F_SUMMARY && contextSummary) fields.push({ id: F_SUMMARY, field_value: contextSummary })
  return fields
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
    const { allSlugs: interestedSlugs, primarySlug: primaryInterestedSlug } = extractProcessInterest(messages)

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
        interested_process_slugs: interestedSlugs,
        primary_interested_slug: primaryInterestedSlug,
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

    // 5b. SPEC-11: vincular visitante al lead y fusionar por email (CA-06)
    if (conversation.visitor_id) {
      try {
        await linkVisitorToLead(conversation.visitor_id, leadRow.id)
        await mergeVisitorsByEmail(body.email, leadRow.id)
      } catch (visitorErr) {
        console.error('No se pudo vincular visitante al lead:', visitorErr)
      }
    }

    // 6. ClickUp — descripción con resumen de contexto + últimos mensajes (CA-16)
    let clickupTaskId: string | null = null
    let clickupTaskUrl = ''
    const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN
    if (CLICKUP_TOKEN) {
      try {
        const isBusinessHours = (() => { const h = getMadridHour(); return h >= 8 && h < 18 })()
        const taskName = `${isHandover ? '🔴 ' : ''}Catálogo · Chatbot — ${body.nombre}`
        const processInterestBlock = interestedSlugs.length
          ? `**Todos:** ${interestedSlugs.join(', ')}\n**Principal:** ${primaryInterestedSlug ?? interestedSlugs[0]}`
          : 'ninguno todavía'
        const description = [
          `Lead desde Catálogo · Chatbot${isHandover ? ' · **PIDE CONTACTO HUMANO — responder en <24h**' : ''}`,
          '',
          '### Información de Contacto',
          `**Persona:** ${body.nombre}`,
          `**Email:** ${body.email}`,
          `**Conversación:** ${conversation.id} (tabla chatbot_conversations)`,
          '',
          '### Procesos de interés',
          processInterestBlock,
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

        // SPEC-10: persistir el id de la tarea en BBDD para reconstruir su URL
        // al recibir el evento `schedule_completed` (aviso Slack al agendar llamada).
        if (clickupTaskId) {
          await supabase
            .from('contact_submissions')
            .update({ clickup_task_id: clickupTaskId })
            .eq('id', leadRow.id)
        }
      } catch (clickupError) {
        console.error('Fallo ClickUp (lead chatbot):', clickupError)
      }
    }

    // 7. GHL — crear contacto + oportunidad directamente via API
    if (GHL_API_KEY) {
      try {
        const firstName = body.nombre.split(' ')[0]
        const lastName = body.nombre.split(' ').slice(1).join(' ')
        const tags = [
          'catalogo',
          ...(conversation.initial_sector ? [`catalogo-${conversation.initial_sector}`] : []),
          'chatbot_lead',
          ...(isHandover ? ['pide_humano'] : []),
        ]

        // SPEC-11: custom fields del visitante para GHL (CA-07)
        let ghlCustomFields: Array<{ id: string; field_value: string }> = []
        if (conversation.visitor_id) {
          try {
            const [visitorData, historyText] = await Promise.all([
              getVisitor(conversation.visitor_id),
              getVisitorConversationHistoryText(conversation.visitor_id),
            ])
            if (visitorData) {
              ghlCustomFields = buildGHLVisitorFields(visitorData, historyText, contextSummary)
            }
          } catch (visitorErr) {
            console.error('No se pudo obtener datos del visitante para GHL:', visitorErr)
          }
        }

        // Upsert contacto (crea o actualiza si ya existe por email)
        // NOTA: el endpoint /contacts/upsert ignora customFields silenciosamente — se actualizan después vía PUT
        const contactRes = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
          method: 'POST',
          headers: GHL_API_HEADERS(GHL_API_KEY),
          body: JSON.stringify({
            locationId: GHL_LOCATION_ID,
            firstName,
            lastName,
            email: body.email,
            tags,
          }),
        })
        const contactData = await contactRes.json()
        const contactId = contactData?.contact?.id

        // SPEC-11 (CA-07): custom fields via PUT separado — upsert los ignora
        if (contactId && ghlCustomFields.length > 0) {
          await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
            method: 'PUT',
            headers: GHL_API_HEADERS(GHL_API_KEY),
            body: JSON.stringify({ customFields: ghlCustomFields }),
          }).catch(err => console.error('No se pudieron actualizar custom fields GHL:', err))
        }

        // Crear oportunidad en stage "New Lead"
        if (contactId) {
          await fetch(`${GHL_API_BASE}/opportunities/`, {
            method: 'POST',
            headers: GHL_API_HEADERS(GHL_API_KEY),
            body: JSON.stringify({
              locationId: GHL_LOCATION_ID,
              pipelineId: GHL_PIPELINE_ID,
              pipelineStageId: GHL_STAGE_NEW_LEAD,
              contactId,
              name: `Catálogo · Chatbot — ${body.nombre}`,
              status: 'open',
            }),
          })
        }
      } catch (ghlError) {
        console.error('Fallo GHL API (lead chatbot):', ghlError)
      }
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

    // 9. Email — lead_captured lo gestiona GHL (workflow "New Lead"); handover mantiene email propio
    if (isHandover) {
      await sendChatbotEmail('handover_written', {
        to: body.email,
        nombre: body.nombre,
      })
    }

    // 10. Log de éxito (rate limiting compartido)
    await supabase.from('contact_requests_log').insert({ ip_address: clientIP, email: body.email, status: 'success' })

    return NextResponse.json({ success: true, leadId: leadRow.id })
  } catch (error) {
    console.error('Error en /api/chatbot/lead:', error)
    return NextResponse.json({ error: 'No se pudo registrar. Inténtalo de nuevo.' }, { status: 500 })
  }
}
