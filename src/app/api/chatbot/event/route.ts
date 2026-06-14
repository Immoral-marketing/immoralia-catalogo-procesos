/**
 * POST /api/chatbot/event — SPEC-03: eventos de negocio de la conversación.
 *
 * - form_dismissed     → el visitante cerró el formulario con la X (consume el límite duro)
 * - handover_written   → con lead YA capturado, eligió «que me escribáis» (prioritario + email)
 * - schedule_completed → reserva completada en el calendario GHL (flag + email de gracias)
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
        if (!conversation.call_scheduled) {
          await updateConversationFlags(conversation.id, { call_scheduled: true })
          if (conversation.lead_id) {
            const lead = await getLeadContact(conversation.lead_id)
            if (lead) await sendChatbotEmail('call_scheduled', { to: lead.email, nombre: lead.nombre })
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
