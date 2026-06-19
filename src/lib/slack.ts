/**
 * Utilidades de notificación Slack — portada de supabase/functions/_shared/slack.ts
 * Compatible con Node.js (process.env en lugar de Deno.env).
 */
import { createClient } from '@supabase/supabase-js'

interface SlackPayload {
  lead: {
    nombre: string
    email: string
    empresa?: string
    telefono?: string
    comentario?: string
    utm?: string
  }
  clickupTask: {
    id: string
    url: string
    status?: string
    priority?: number | string
  }
  source: 'offer_request' | 'onboarding' | 'chatbot' | 'quick_form' | 'sin_sector'
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  return createClient(url, key)
}

/**
 * Devuelve el canal Slack según el entorno Vercel.
 * En cualquier entorno distinto de production (preview/development), si existe
 * SLACK_CHANNEL_ID_STAGING se usa ese canal para no contaminar el canal de prod
 * con notificaciones de pruebas.
 */
function getSlackChannelId(): string {
  const stagingChannel = process.env.SLACK_CHANNEL_ID_STAGING
  const isProduction = process.env.VERCEL_ENV === 'production'
  if (!isProduction && stagingChannel) return stagingChannel
  return process.env.SLACK_CHANNEL_ID || 'C08F24QQFB2'
}

/**
 * Envía notificación Slack cuando se crea un nuevo lead.
 * Incluye reintentos, timeout e idempotencia.
 */
export async function sendSlackNewLead({ lead, clickupTask, source }: SlackPayload) {
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN
  const SLACK_CHANNEL_ID = getSlackChannelId()

  if (!SLACK_BOT_TOKEN) {
    console.error('SLACK_BOT_TOKEN no configurado. Saltando notificación Slack.')
    return
  }

  const supabase = getAdminClient()
  const taskId = clickupTask.id

  // 1. Idempotencia
  const { data: existingLog } = await supabase
    .from('slack_notifications_log')
    .select('clickup_task_id')
    .eq('clickup_task_id', taskId)
    .single()

  if (existingLog) {
    console.log(`Notificación Slack ya enviada para tarea ${taskId}. Skipping.`)
    return
  }

  // 2. Construir mensaje
  const sourceLabel: Record<string, string> = {
    offer_request: 'Catálogo · Web',
    onboarding: 'Formulario Onboarding',
    chatbot: 'Catálogo · Chatbot',
    quick_form: 'Quick Form Lead (⚡)',
    sin_sector: 'Catálogo · Sin sector',
  }

  const blocks: any[] = [
    { type: 'header', text: { type: 'plain_text', text: `🚀 Nuevo Lead: ${taskId}`, emoji: true } },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Origen:*\n${sourceLabel[source]}` },
        { type: 'mrkdwn', text: `*Empresa:*\n${lead.empresa || 'N/A'}` },
        { type: 'mrkdwn', text: `*Contacto:*\n${lead.nombre}` },
        { type: 'mrkdwn', text: `*Email:*\n${lead.email}` },
      ],
    },
  ]

  if (lead.telefono || lead.utm) {
    blocks.push({
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Teléfono:*\n${lead.telefono || 'No provisto'}` },
        { type: 'mrkdwn', text: `*UTM:*\n${lead.utm || 'Ninguna'}` },
      ],
    })
  }

  if (lead.comentario) {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*Comentario:*\n${lead.comentario}` } })
  }

  blocks.push({
    type: 'actions',
    elements: [{ type: 'button', text: { type: 'plain_text', text: 'Ver en ClickUp', emoji: true }, url: clickupTask.url, action_id: 'view_clickup' }],
  })

  // 3. Enviar con reintentos
  let attempt = 0
  const maxRetries = 3
  const timeoutMs = 5000

  while (attempt <= maxRetries) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SLACK_BOT_TOKEN}` },
        body: JSON.stringify({ channel: SLACK_CHANNEL_ID, blocks, text: `Nuevo lead de ${lead.nombre} (${sourceLabel[source]})` }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const result = await response.json()

      if (result.ok) {
        await supabase.from('slack_notifications_log').insert({ clickup_task_id: taskId, success: true })
        console.log(`Notificación Slack enviada en intento ${attempt + 1}`)
        return
      } else {
        throw new Error(`Slack API error: ${result.error}`)
      }
    } catch (err: any) {
      attempt++
      console.error(`Intento ${attempt} fallido enviando notificación Slack:`, err.message)
      if (attempt > maxRetries) {
        await supabase.from('slack_notifications_log').insert({ clickup_task_id: taskId, success: false, error_message: err.message })
        break
      }
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000))
    }
  }
}

/** Envía notificación genérica de texto a Slack. */
export async function sendSlackNotification(text: string) {
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN
  const SLACK_CHANNEL_ID = getSlackChannelId()

  if (!SLACK_BOT_TOKEN) {
    console.error('SLACK_BOT_TOKEN no configurado. Saltando notificación Slack.')
    return
  }

  try {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SLACK_BOT_TOKEN}` },
      body: JSON.stringify({ channel: SLACK_CHANNEL_ID, text }),
    })
    const result = await response.json()
    if (!result.ok) console.error('Error enviando notificación Slack genérica:', result.error)
  } catch (err: any) {
    console.error('Fallo enviando notificación Slack genérica:', err.message)
  }
}
