/**
 * POST /api/chatbot/event — SPEC-03 + SPEC-10: eventos de negocio de la conversación.
 *
 * - form_dismissed     → el visitante cerró el formulario con la X (consume el límite duro)
 * - handover_written   → con lead YA capturado, eligió «que me escribáis» (prioritario + email)
 * - schedule_completed → reserva completada en el calendario GHL (flag + aviso Slack al equipo)
 *
 * SPEC-10: el email propio de "llamada agendada" se eliminó — GHL ya envía la
 * confirmación al visitante. El catálogo ahora solo guarda el flag y avisa al
 * equipo por Slack con enlace a la tarea de ClickUp del lead.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase-admin'
import { sendSlackNotification } from '@/lib/slack'
import { sendChatbotEmail } from '@/lib/chatbot/emails'
import { getConversation, isExpired, updateConversationFlags } from '@/lib/chatbot/store'

const bodySchema = z.object({
  conversationId: z.string().uuid(),
  event: z.enum(['form_dismissed', 'handover_written', 'schedule_completed']),
})

async function getLeadContact(leadId: string): Promise<{ nombre: string; email: string } | null> {
  const { data } = await createAdminClient()
    .from('contact_submissions')
    .select('nombre, email')
    .eq('id', leadId)
    .maybeSingle()
  return data ?? null
}

/** SPEC-10: lead + id de la tarea de ClickUp (para reconstruir la URL en el Slack de "llamada agendada"). */
async function getLeadWithClickup(
  leadId: string,
): Promise<{ nombre: string; email: string; clickup_task_id: string | null } | null> {
  const { data } = await createAdminClient()
    .from('contact_submissions')
    .select('nombre, email, clickup_task_id')
    .eq('id', leadId)
    .maybeSingle()
  return data ?? null
}

export async function POST(req: NextRequest) {
  let body: z.infer<typeof bodySchema>
  try {
    body = bodySchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'Petición inválida' }, { status: 400 })
  }

  try {
    const conversation = await getConversation(body.conversationId)
    if (!conversation || isExpired(conversation)) {
      return NextResponse.json({ error: 'Conversación no válida' }, { status: 404 })
    }

    switch (body.event) {
      case 'form_dismissed': {
        await updateConversationFlags(conversation.id, { lead_form_dismissed: true })
        break
      }

      case 'handover_written': {
        // Solo válido con lead ya capturado (sin lead, el flujo pasa por /api/chatbot/lead con mode handover)
        if (!conversation.lead_captured || !conversation.lead_id) {
          return NextResponse.json({ error: 'Sin lead asociado a la conversación' }, { status: 400 })
        }
        if (!conversation.human_requested) {
          await updateConversationFlags(conversation.id, { human_requested: true })
          const lead = await getLeadContact(conversation.lead_id)
          if (lead) {
            await sendChatbotEmail('handover_written', { to: lead.email, nombre: lead.nombre })
            await sendSlackNotification(
              `🔴 *Pide contacto humano* (responder en <24h): ${lead.nombre} — ${lead.email} · Conversación ${conversation.id}`,
            ).catch(err => console.error('Slack handover:', err))
          }
        }
        break
      }

      case 'schedule_completed': {
        // SPEC-10: idempotente — actualizar flag y enviar Slack una sola vez.
        // El email propio se eliminó: GHL ya envía la confirmación al visitante.
        if (!conversation.call_scheduled) {
          await updateConversationFlags(conversation.id, { call_scheduled: true })
          if (conversation.lead_id) {
            const lead = await getLeadWithClickup(conversation.lead_id)
            if (lead) {
              const clickupLink = lead.clickup_task_id
                ? ` · <https://app.clickup.com/t/${lead.clickup_task_id}|Ver en ClickUp>`
                : ''
              await sendSlackNotification(
                `📅 *Llamada agendada*: ${lead.nombre} — ${lead.email} · Conversación ${conversation.id}${clickupLink}`,
              ).catch(err => console.error('Slack schedule_completed:', err))
            }
          }
        }
        break
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error en /api/chatbot/event:', error)
    return NextResponse.json({ error: 'No se pudo registrar el evento' }, { status: 500 })
  }
}
