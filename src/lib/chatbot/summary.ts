/**
 * SPEC-08 — Resumen estructurado de la conversación (sustituye al texto libre de SPEC-01).
 * El modelo devuelve un JSON con sector, pain_points, procesos_vistos y nivel_interes.
 * Si el JSON viene malformado, se descarta silenciosamente — nunca rompe el chat.
 * Retrocompatibilidad: conversaciones con solo 'summary' text siguen funcionando
 * en el system prompt vía el fallback en prompt.ts.
 */
import { CHAT_MODEL, HISTORY_WINDOW, SUMMARY_REFRESH_EVERY } from './constants'
import { updateStructuredSummary } from './store'
import type { ConversationRow, MessageRow, StructuredSummary } from './types'

const VALID_INTEREST_LEVELS = ['explorando', 'interesado', 'listo_para_comprar'] as const

function normalizeNivelInteres(value: unknown): StructuredSummary['nivel_interes'] {
  if (VALID_INTEREST_LEVELS.includes(value as StructuredSummary['nivel_interes'])) {
    return value as StructuredSummary['nivel_interes']
  }
  return 'explorando'
}

function parseStructuredSummary(raw: string): StructuredSummary | null {
  try {
    // El modelo a veces envuelve el JSON en ```json … ```: se limpia.
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed: unknown = JSON.parse(cleaned)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null
    const obj = parsed as Record<string, unknown>
    return {
      sector: typeof obj.sector === 'string' && obj.sector !== 'null' ? obj.sector : null,
      pain_points: Array.isArray(obj.pain_points)
        ? obj.pain_points.filter((p): p is string => typeof p === 'string').slice(0, 5)
        : [],
      procesos_vistos: Array.isArray(obj.procesos_vistos)
        ? obj.procesos_vistos.filter((p): p is string => typeof p === 'string')
        : [],
      nivel_interes: normalizeNivelInteres(obj.nivel_interes),
    }
  } catch {
    return null
  }
}

export function shouldRefreshSummary(conversation: ConversationRow, totalMessages: number): boolean {
  const outsideWindow = totalMessages - HISTORY_WINDOW
  if (outsideWindow <= 0) return false
  return outsideWindow - conversation.summary_message_count >= SUMMARY_REFRESH_EVERY
}

/**
 * Regenera el resumen estructurado: resumen previo + mensajes nuevos fuera de ventana.
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
            content: `Eres un asistente que mantiene la memoria estructurada de una conversación comercial. Actualiza el resumen incorporando los mensajes nuevos y devuelve un JSON con exactamente estos cuatro campos:
{
  "sector": "<slug del sector declarado por el usuario, o null>",
  "pain_points": ["<dolor en primera persona del cliente, máximo 5>"],
  "procesos_vistos": ["<slug-de-proceso>"],
  "nivel_interes": "explorando" | "interesado" | "listo_para_comprar"
}
Instrucciones:
- sector: uno de los slugs válidos (salud, gestorias, centros-deportivos, construccion, academias, gastronomia-hosteleria, industrial) o null si el usuario no declaró su tipo de negocio.
- pain_points: máximo 5 dolores o problemas que el usuario mencionó, en primera persona sin tecnicismos. Ejemplo: "pierdo leads porque no respondo rápido".
- procesos_vistos: todos los slugs que aparecen en enlaces /catalogo/procesos/<slug> en el hilo. Extráelos exactamente del texto, no los inventes.
- nivel_interes: "explorando" si solo hace preguntas generales, "interesado" si muestra interés claro por algún proceso, "listo_para_comprar" si pregunta por precios, plazos o cómo contratar.
Devuelve SOLO el JSON. Sin markdown, sin texto adicional.`,
          },
          {
            role: 'user',
            content: `RESUMEN ESTRUCTURADO PREVIO:\n${JSON.stringify(conversation.structured_summary) ?? 'null'}\n\nMENSAJES NUEVOS:\n${transcript}`,
          },
        ],
      }),
    })

    const result = await response.json()
    if (result.error) throw new Error(result.error.message)

    const raw: string = result.choices?.[0]?.message?.content?.trim() ?? ''
    const structuredSummary = parseStructuredSummary(raw)
    if (structuredSummary) {
      await updateStructuredSummary(conversation.id, structuredSummary, cutoff)
    }
  } catch (error) {
    console.error('refreshSummary falló (no bloqueante):', error)
  }
}
