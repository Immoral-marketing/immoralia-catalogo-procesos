/**
 * POST /api/chatbot — SPEC-01: Motor conversacional v3.
 *
 * Chat con memoria real: el historial se reconstruye SIEMPRE server-side
 * desde la BBDD (el cliente solo envía su mensaje + conversationId).
 * Respuesta en streaming SSE. Persistencia de cada turno con metadatos.
 *
 * Eventos SSE (ver ChatStreamEvent en @/lib/chatbot/types):
 *   meta  → { conversationId, previousExpired }
 *   delta → { text }
 *   done  → { assistantMessageId, recommendedSlugs }
 *   error → { message }
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
  CHAT_MODEL,
  FRIENDLY_ERROR_MESSAGE,
  HANDOVER_INTENT_REGEX,
  HANDOVER_MARKER,
  HARD_LIMIT_TURNS,
  HISTORY_WINDOW,
  LEAD_FORM_MARKER,
  LEAD_INTENT_REGEX,
  MAX_MESSAGE_LENGTH,
  MAX_MESSAGES_PER_CONVERSATION_PER_HOUR,
  MAX_MESSAGES_PER_IP_PER_DAY,
  SECTOR_NAMES,
} from '@/lib/chatbot/constants'
import {
  conversationHourlyCount,
  getMessages,
  hashIp,
  insertMessage,
  ipDailyCount,
  resolveConversation,
  touchConversation,
  updateConversationFlags,
} from '@/lib/chatbot/store'
import { extractRecommendedSlugs, inferSectorFromMessage, retrieveContext } from '@/lib/chatbot/rag'
import { buildSystemPrompt } from '@/lib/chatbot/prompt'
import { refreshSummary, shouldRefreshSummary } from '@/lib/chatbot/summary'
import type { ChatAction, ChatStreamEvent } from '@/lib/chatbot/types'

const bodySchema = z.object({
  message: z.string().trim().min(1, 'Falta el mensaje').max(MAX_MESSAGE_LENGTH, 'Mensaje demasiado largo'),
  conversationId: z.string().uuid().optional(),
  sector: z.string().nullable().optional(),
  surface: z.enum(['bubble', 'home', 'sector']).optional(),
  route: z.string().max(300).nullable().optional(),
})

function sse(event: ChatStreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`
}

export async function POST(req: NextRequest) {
  // 1. Validación de input (CA-11)
  let body: z.infer<typeof bodySchema>
  try {
    body = bodySchema.parse(await req.json())
  } catch (error) {
    const message = error instanceof z.ZodError ? error.errors[0]?.message : 'Petición inválida'
    return Response.json({ error: message }, { status: 400 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: 'Servicio no disponible' }, { status: 500 })
  }

  const sector = body.sector && SECTOR_NAMES[body.sector] ? body.sector : null
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const ipHash = hashIp(ip)

  try {
    // 2. Rate limit por IP (CA-17)
    if ((await ipDailyCount(ipHash)) >= MAX_MESSAGES_PER_IP_PER_DAY) {
      return Response.json({ error: 'Límite diario de mensajes alcanzado' }, { status: 429 })
    }

    // 3. Conversación: reanudar vigente o crear nueva (CA-01, CA-07, CA-09)
    const { conversation, previousExpired } = await resolveConversation(body.conversationId, {
      surface: body.surface ?? null,
      sector,
      route: body.route ?? null,
    })

    // 4. Rate limit por conversación (CA-17)
    if ((await conversationHourlyCount(conversation.id)) >= MAX_MESSAGES_PER_CONVERSATION_PER_HOUR) {
      return Response.json({ error: 'Límite de mensajes por hora alcanzado en esta conversación' }, { status: 429 })
    }

    // 5. Historial completo desde BBDD (CA-03) + persistencia del turno del usuario (CA-06)
    const history = await getMessages(conversation.id)
    await insertMessage({
      conversationId: conversation.id,
      role: 'user',
      content: body.message,
      route: body.route ?? null,
      sector,
      ipHash,
    })

    // 6. Contexto: RAG en dos capas (CA-14) + memoria
    // Cuando sector=null (home), intentar inferir el sector del mensaje para
    // mejorar la relevancia del RAG sin alterar el sector persistido en la conversación.
    const inferredSector = sector === null ? inferSectorFromMessage(body.message) : null
    const ragSector = sector ?? inferredSector

    const lastAssistant = [...history].reverse().find(m => m.role === 'assistant')
    const alreadyRecommendedSlugs = [...new Set(history.flatMap(m => m.recommended_slugs))]
    const userCount = history.filter(m => m.role === 'user').length + 1

    const contextText = await retrieveContext({
      message: body.message,
      lastAssistantContent: lastAssistant?.content ?? null,
      sector: ragSector,
      excludeSlugs: alreadyRecommendedSlugs,
    })

    const systemPrompt = buildSystemPrompt({
      sector,
      contextText,
      summary: conversation.summary,
      structuredSummary: conversation.structured_summary,
      alreadyRecommendedSlugs,
      leadCaptured: conversation.lead_captured,
      leadFormOffered: conversation.lead_form_offered,
      inferredSector,
      userCount,
    })

    // Ventana de últimos N turnos íntegros; lo anterior viaja en el resumen (CA-15)
    const windowed = history.slice(-HISTORY_WINDOW).filter(m => !m.is_error)

    // 7. Llamada a OpenAI en streaming (CA-02)
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          ...windowed.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: body.message },
        ],
      }),
    })

    if (!openaiResponse.ok || !openaiResponse.body) {
      throw new Error(`OpenAI respondió ${openaiResponse.status}`)
    }

    const encoder = new TextEncoder()
    const openaiBody = openaiResponse.body

    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode(sse({
          type: 'meta',
          conversationId: conversation.id,
          previousExpired,
        })))

        let fullReply = ''
        // SPEC-03: los marcadores de acción ([[LEAD_FORM]], [[HANDOVER]]) viajan
        // dentro del texto del modelo. Se retiene una cola (holdback) para que
        // un marcador parcial nunca llegue al cliente; se extraen y se convierten
        // en acción estructurada del evento done.
        let tail = ''
        // Doble detección: marcador del modelo + fallback determinista sobre el
        // mensaje del usuario (el modelo a veces olvida el marcador).
        // userExplicitIntent: el usuario pidió explícitamente dejar sus datos — bypasea el guard de 3 turnos.
        const userExplicitIntent = LEAD_INTENT_REGEX.test(body.message)
        let leadFormDetected = userExplicitIntent
        let handoverDetected = HANDOVER_INTENT_REGEX.test(body.message)

        const extractMarkers = () => {
          while (tail.includes(LEAD_FORM_MARKER)) {
            leadFormDetected = true
            tail = tail.replace(LEAD_FORM_MARKER, '')
          }
          while (tail.includes(HANDOVER_MARKER)) {
            handoverDetected = true
            tail = tail.replace(HANDOVER_MARKER, '')
          }
        }

        const emitSafe = (final: boolean) => {
          extractMarkers()
          let emit: string
          if (final) {
            emit = tail
            tail = ''
          } else {
            // Retener cualquier posible inicio de marcador ('[[') o un '[' final
            const candidate = tail.lastIndexOf('[[')
            if (candidate !== -1 && tail.length - candidate < HANDOVER_MARKER.length + LEAD_FORM_MARKER.length) {
              emit = tail.slice(0, candidate)
              tail = tail.slice(candidate)
            } else if (tail.endsWith('[')) {
              emit = tail.slice(0, -1)
              tail = '['
            } else {
              emit = tail
              tail = ''
            }
          }
          if (emit) {
            fullReply += emit
            controller.enqueue(encoder.encode(sse({ type: 'delta', text: emit })))
          }
        }

        try {
          const reader = openaiBody.getReader()
          const decoder = new TextDecoder()
          let buffer = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })

            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''
            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed.startsWith('data: ')) continue
              const payload = trimmed.slice(6)
              if (payload === '[DONE]') continue
              try {
                const delta: string = JSON.parse(payload).choices?.[0]?.delta?.content ?? ''
                if (delta) {
                  tail += delta
                  emitSafe(false)
                }
              } catch {
                // Fragmento no parseable — se ignora sin romper el stream
              }
            }
          }
          emitSafe(true)
          fullReply = fullReply.trimEnd()

          // 8. Persistir la respuesta completa con metadatos (CA-06)
          const recommendedSlugs = extractRecommendedSlugs(fullReply)
          const assistantMessage = await insertMessage({
            conversationId: conversation.id,
            role: 'assistant',
            content: fullReply,
            route: body.route ?? null,
            sector,
            recommendedSlugs,
          })

          // 9. Actividad + contadores → rolling de 7 días (CA-08)
          const assistantCount = history.filter(m => m.role === 'assistant').length + 1
          await touchConversation(conversation.id, {
            userMessages: userCount,
            assistantMessages: assistantCount,
          })

          // 10. Refrescar el resumen acumulado si toca (CA-15, CA-16)
          const totalMessages = history.length + 2
          if (shouldRefreshSummary(conversation, totalMessages)) {
            const allMessages = await getMessages(conversation.id)
            await refreshSummary(conversation, allMessages)
          }

          // 11. SPEC-03 — Decisión de acción: handover > semántico > límite duro (5 turnos)
          // El camino semántico permite re-ofrecer el formulario si el visitante muestra intención clara
          // tras haberlo ignorado en un ofrecimiento previo. Solo bloquea si lo cerró activamente (X → dismissed).
          // El camino del límite duro mantiene `!lead_form_offered` para no auto-ofrecerlo dos veces de oficio.
          let action: ChatAction = null
          if (handoverDetected) {
            action = 'offer_handover'
          } else if (
            leadFormDetected &&
            !conversation.lead_captured &&
            !conversation.lead_form_dismissed &&
            (userExplicitIntent || userCount >= 3)
          ) {
            action = 'offer_lead_form'
          } else if (
            !conversation.lead_captured &&
            !conversation.lead_form_dismissed &&
            !conversation.lead_form_offered &&
            userCount >= HARD_LIMIT_TURNS
          ) {
            action = 'offer_lead_form'
          }
          if (action === 'offer_lead_form') {
            await updateConversationFlags(conversation.id, { lead_form_offered: true })
          }

          controller.enqueue(encoder.encode(sse({
            type: 'done',
            assistantMessageId: assistantMessage.id,
            recommendedSlugs,
            action,
          })))
        } catch (error) {
          // Fallo de IA: turno registrado con marca de error + mensaje amable (CA-12)
          console.error('Error en streaming de /api/chatbot:', error)
          await insertMessage({
            conversationId: conversation.id,
            role: 'assistant',
            content: FRIENDLY_ERROR_MESSAGE,
            route: body.route ?? null,
            sector,
            isError: true,
          }).catch(persistError => console.error('No se pudo registrar el error:', persistError))

          controller.enqueue(encoder.encode(sse({ type: 'error', message: FRIENDLY_ERROR_MESSAGE })))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error en /api/chatbot:', error)
    return Response.json({ error: FRIENDLY_ERROR_MESSAGE }, { status: 500 })
  }
}
