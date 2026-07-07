/**
 * POST /api/webhooks/ghl-booking — webhook del WF de GHL "Llamada agendada".
 *
 * Sustituye a la edge function legacy `notify-booking-slack` (Supabase staging),
 * que solo enviaba Slack. Este endpoint además:
 *  - marca `call_scheduled` en la conversación del lead (server-to-server, fiable:
 *    la detección por postMessage del iframe en el cliente es solo best-effort)
 *  - incluye el enlace a la tarea ClickUp del lead en el Slack
 *  - es idempotente (GHL puede reintentar el webhook)
 *
 * Autenticación: si GHL_BOOKING_WEBHOOK_SECRET está definida, exige ?secret=<valor>
 * en la URL del webhook. Sin la variable, acepta cualquier llamada (paridad con la
 * edge function anterior, que no tenía auth).
 *
 * Payload esperado (el que envía el paso Webhook del WF de GHL):
 *   { full_name | first_name+last_name, email, phone, calendar: { startTime, calendarName } }
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { sendSlackBookingScheduled } from '@/lib/slack'

function formatDateTime(isoString: string | null): string {
  if (!isoString) return '—'
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Madrid',
  })
}

export async function POST(req: NextRequest) {
  const secret = process.env.GHL_BOOKING_WEBHOOK_SECRET
  if (secret && req.nextUrl.searchParams.get('secret') !== secret) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  try {
    const calendar = (payload.calendar ?? {}) as Record<string, unknown>
    const nombre =
      (payload.full_name as string) ||
      [payload.first_name, payload.last_name].filter(Boolean).join(' ') ||
      'Desconocido'
    const email = ((payload.email as string) || '').trim().toLowerCase()
    const telefono = (payload.phone as string) || null
    const startTime = (calendar.startTime as string) || null
    const calendario = (calendar.calendarName as string) || null

    const supabase = createAdminClient()

    // Resolver el lead más reciente con ese email para enlazar ClickUp y la conversación
    let clickupTaskUrl: string | null = null
    let conversationId: string | null = null
    if (email) {
      const { data: lead } = await supabase
        .from('contact_submissions')
        .select('id, clickup_task_id, conversation_id')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (lead) {
        if (lead.clickup_task_id) clickupTaskUrl = `https://app.clickup.com/t/${lead.clickup_task_id}`
        conversationId = lead.conversation_id

        // Fallback para leads anteriores a la columna conversation_id
        if (!conversationId) {
          const { data: conv } = await supabase
            .from('chatbot_conversations')
            .select('id')
            .eq('lead_id', lead.id)
            .maybeSingle()
          conversationId = conv?.id ?? null
        }
      }
    }

    // Marcar la conversación (idempotente: flag booleano)
    if (conversationId) {
      await supabase
        .from('chatbot_conversations')
        .update({ call_scheduled: true })
        .eq('id', conversationId)
    }

    await sendSlackBookingScheduled({
      nombre,
      email: email || '—',
      telefono,
      fechaFormateada: formatDateTime(startTime),
      calendario,
      clickupTaskUrl,
      dedupeKey: `booking:${email || nombre}:${startTime ?? 'sin-fecha'}`,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error en /api/webhooks/ghl-booking:', error)
    return NextResponse.json({ error: 'Error procesando el webhook' }, { status: 500 })
  }
}
