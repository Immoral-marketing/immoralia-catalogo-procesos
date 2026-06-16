/**
 * SPEC-01 — Tipos del motor conversacional v3.
 * Las filas se tipan a mano hasta regenerar src/integrations/supabase/types.ts
 * tras aplicar la migración (supabase gen types typescript --linked).
 */

export type ChatRole = 'user' | 'assistant'

/** SPEC-08 — Resumen estructurado de la conversación (sustituye al resumen libre en nuevas convs). */
export interface StructuredSummary {
  sector: string | null
  pain_points: string[]
  procesos_vistos: string[]
  nivel_interes: 'explorando' | 'interesado' | 'listo_para_comprar'
}
export type ChatSurface = 'bubble' | 'home' | 'sector'
export type MessageRating = 'useful' | 'not_useful'

export interface ConversationRow {
  id: string
  created_at: string
  last_activity_at: string
  surface: ChatSurface | null
  initial_sector: string | null
  initial_route: string | null
  summary: string | null
  structured_summary: StructuredSummary | null
  summary_message_count: number
  user_message_count: number
  assistant_message_count: number
  lead_captured: boolean
  call_scheduled: boolean
  human_requested: boolean
  lead_form_dismissed: boolean
  lead_form_offered: boolean
  lead_id: string | null
  status: 'active' | 'expired'
}

/** Acción estructurada que acompaña a una respuesta del bot (SPEC-03) */
export type ChatAction = 'offer_lead_form' | 'offer_handover' | null

export interface MessageRow {
  id: string
  conversation_id: string
  created_at: string
  role: ChatRole
  content: string
  route: string | null
  sector: string | null
  recommended_slugs: string[]
  is_error: boolean
  ip_hash: string | null
}

/** Eventos SSE que emite POST /api/chatbot */
export type ChatStreamEvent =
  | { type: 'meta'; conversationId: string; previousExpired: boolean }
  | { type: 'delta'; text: string }
  | { type: 'done'; assistantMessageId: string; recommendedSlugs: string[]; action: ChatAction }
  | { type: 'error'; message: string }
