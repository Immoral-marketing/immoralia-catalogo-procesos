/**
 * GET /api/chatbot/history?conversationId=<uuid> — SPEC-01.
 * Rehidrata el cliente con el historial de una conversación vigente.
 * 404 si no existe · 410 si caducó (rolling 7 días).
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getConversation, getMessages, getRatings, isExpired } from '@/lib/chatbot/store'

const querySchema = z.string().uuid()

export async function GET(req: NextRequest) {
  const parsed = querySchema.safeParse(req.nextUrl.searchParams.get('conversationId'))
  if (!parsed.success) {
    return Response.json({ error: 'conversationId inválido' }, { status: 400 })
  }

  try {
    const conversation = await getConversation(parsed.data)
    if (!conversation) {
      return Response.json({ error: 'Conversación no encontrada' }, { status: 404 })
    }
    if (isExpired(conversation)) {
      return Response.json({ expired: true }, { status: 410 })
    }

    const [messages, ratings] = await Promise.all([
      getMessages(conversation.id),
      getRatings(conversation.id),
    ])

    return Response.json({
      conversationId: conversation.id,
      surface: conversation.surface,
      leadCaptured: conversation.lead_captured,
      callScheduled: conversation.call_scheduled,
      messages: messages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.created_at,
        recommendedSlugs: m.recommended_slugs,
        isError: m.is_error,
        rating: ratings[m.id] ?? null,
      })),
    })
  } catch (error) {
    console.error('Error en /api/chatbot/history:', error)
    return Response.json({ error: 'No se pudo recuperar la conversación' }, { status: 500 })
  }
}
