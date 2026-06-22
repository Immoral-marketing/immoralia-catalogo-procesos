/**
 * SPEC-01 — Tipos del motor conversacional v3.
 * SPEC-11 — Añade VisitorRow, VisitorContext; actualiza ConversationRow con visitor_id.
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

/** SPEC-11 — Visitante anónimo identificado por cookie de 90 días. */
export interface VisitorRow {
  id: string
  created_at: string
  last_seen_at: string
  lead_id: string | null
  conversation_count: number
}

/** SPEC-11 — Contexto del visitante recurrente para personalizar el saludo. */
export interface VisitorContext {
  sector: string | null
  pain_points: string[]
  procesos_vistos: string[]
  nivel_interes: string
  conversation_count: number
}

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
  /** SPEC-11 — Visitante al que pertenece esta conversación. */
  visitor_id: string
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
