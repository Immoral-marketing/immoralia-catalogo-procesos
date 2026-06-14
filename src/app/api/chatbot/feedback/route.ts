/**
 * POST /api/chatbot/feedback — SPEC-01.
 * Valoración útil/no útil de una respuesta del bot. Upsert: la última gana (CA-10).
 * Valida server-side que el mensaje pertenece a la conversación indicada.
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { rateMessage } from '@/lib/chatbot/store'

const bodySchema = z.object({
  conversationId: z.string().uuid(),
  messageId: z.string().uuid(),
  rating: z.enum(['useful', 'not_useful']),
})

export async function POST(req: NextRequest) {
  let body: z.infer<typeof bodySchema>
  try {
    body = bodySchema.parse(await req.json())
  } catch {
    return Response.json({ error: 'Petición inválida' }, { status: 400 })
  }

  try {
    const result = await rateMessage(body.conversationId, body.messageId, body.rating)
    if (!result.ok) {
      return Response.json({ error: result.reason }, { status: 400 })
    }
    return Response.json({ ok: true })
  } catch (error) {
    console.error('Error en /api/chatbot/feedback:', error)
    return Response.json({ error: 'No se pudo registrar la valoración' }, { status: 500 })
  }
}
