/**
 * SPEC-01 — Resumen acumulado de la conversación (memoria larga).
 * Cubre los mensajes que quedan fuera de la ventana de turnos íntegros.
 * Se regenera cada SUMMARY_REFRESH_EVERY mensajes nuevos fuera de ventana
 * y se persiste en la conversación (CA-15, CA-16).
 */
import { CHAT_MODEL, HISTORY_WINDOW, SUMMARY_REFRESH_EVERY } from './constants'
import { updateSummary } from './store'
import type { ConversationRow, MessageRow } from './types'

export function shouldRefreshSummary(conversation: ConversationRow, totalMessages: number): boolean {
  const outsideWindow = totalMessages - HISTORY_WINDOW
  if (outsideWindow <= 0) return false
  return outsideWindow - conversation.summary_message_count >= SUMMARY_REFRESH_EVERY
}

/**
 * Regenera el resumen acumulado: resumen previo + mensajes nuevos fuera de ventana.
 * Falla en silencio (log) — un resumen desactualizado no debe romper el chat.
 */
export async function refreshSummary(
  conversation: ConversationRow,
  messages: MessageRow[],
): Promise<void> {
  try {
    const cutoff = messages.length - HISTORY_WINDOW
    if (cutoff <= 0) return

    const newPortion = messages.slice(conversation.summary_message_count, cutoff)
    if (newPortion.length === 0) return

    const transcript = newPortion
      .map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`)
      .join('\n')

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [
          {
            role: 'system',
            content: `Mantienes la memoria de un asistente comercial. Actualiza el resumen de la conversación incorporando los mensajes nuevos al resumen previo. Conserva SIEMPRE: qué negocio/sector tiene el usuario, qué dolores y problemas ha contado, qué procesos se le han recomendado (con sus slugs), qué preferencias o decisiones ha expresado, y cualquier dato que dio sobre su situación. Máximo 200 palabras. Devuelve SOLO el resumen actualizado, sin preámbulos.`,
          },
          {
            role: 'user',
            content: `RESUMEN PREVIO:\n${conversation.summary || '(ninguno)'}\n\nMENSAJES NUEVOS:\n${transcript}`,
          },
        ],
      }),
    })

    const result = await response.json()
    if (result.error) throw new Error(result.error.message)

    const newSummary = result.choices?.[0]?.message?.content?.trim()
    if (newSummary) {
      await updateSummary(conversation.id, newSummary, cutoff)
    }
  } catch (error) {
    console.error('refreshSummary falló (no bloqueante):', error)
  }
}
