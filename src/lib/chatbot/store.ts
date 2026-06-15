/**
 * SPEC-01 — Persistencia del motor conversacional v3.
 * Todas las operaciones usan el cliente service_role desde API routes.
 * Acceso sin tipos generados: las tablas v3 aún no están en types.ts
 * (regenerar tras aplicar la migración).
 */
import { createHash } from 'crypto'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import {
  CONVERSATION_EXPIRY_DAYS,
  MAX_MESSAGES_PER_CONVERSATION_PER_HOUR,
  MAX_MESSAGES_PER_IP_PER_DAY,
} from './constants'
import type { ChatSurface, ConversationRow, MessageRow, MessageRating, StructuredSummary } from './types'

function db(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}

export function hashIp(ip: string): string {
  const pepper = process.env.CHATBOT_IP_PEPPER || 'immoralia-chatbot-v3'
  return createHash('sha256').update(`${pepper}:${ip}`).digest('hex')
}

export function isExpired(conversation: Pick<ConversationRow, 'last_activity_at'>): boolean {
  const expiryMs = CONVERSATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  return Date.now() - new Date(conversation.last_activity_at).getTime() > expiryMs
}

export async function getConversation(id: string): Promise<ConversationRow | null> {
  const { data } = await db()
    .from('chatbot_conversations')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  return (data as ConversationRow) ?? null
}

interface CreateConversationInput {
  surface: ChatSurface | null
  sector: string | null
  route: string | null
}

export async function createConversation(input: CreateConversationInput): Promise<ConversationRow> {
  const { data, error } = await db()
    .from('chatbot_conversations')
    .insert({
      surface: input.surface,
      initial_sector: input.sector,
      initial_route: input.route,
    })
    .select('*')
    .single()
  if (error) throw new Error(`No se pudo crear la conversación: ${error.message}`)
  return data as ConversationRow
}

/**
 * Resuelve la conversación de trabajo: reanuda si existe y está vigente,
 * crea una nueva si no hay id, no existe o caducó (rolling 7 días).
 */
export async function resolveConversation(
  conversationId: string | undefined,
  input: CreateConversationInput,
): Promise<{ conversation: ConversationRow; previousExpired: boolean }> {
  if (conversationId) {
    const existing = await getConversation(conversationId)
    if (existing && !isExpired(existing)) {
      return { conversation: existing, previousExpired: false }
    }
    if (existing && isExpired(existing)) {
      await db().from('chatbot_conversations').update({ status: 'expired' }).eq('id', existing.id)
      return { conversation: await createConversation(input), previousExpired: true }
    }
  }
  return { conversation: await createConversation(input), previousExpired: false }
}

export async function getMessages(conversationId: string): Promise<MessageRow[]> {
  const { data, error } = await db()
    .from('chatbot_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  if (error) throw new Error(`No se pudo leer el historial: ${error.message}`)
  return (data ?? []) as MessageRow[]
}

interface InsertMessageInput {
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  route?: string | null
  sector?: string | null
  recommendedSlugs?: string[]
  isError?: boolean
  ipHash?: string | null
}

export async function insertMessage(input: InsertMessageInput): Promise<MessageRow> {
  const { data, error } = await db()
    .from('chatbot_messages')
    .insert({
      conversation_id: input.conversationId,
      role: input.role,
      content: input.content,
      route: input.route ?? null,
      sector: input.sector ?? null,
      recommended_slugs: input.recommendedSlugs ?? [],
      is_error: input.isError ?? false,
      ip_hash: input.ipHash ?? null,
    })
    .select('*')
    .single()
  if (error) throw new Error(`No se pudo guardar el mensaje: ${error.message}`)
  return data as MessageRow
}

/** Actualiza actividad y contadores tras un turno. Reinicia el rolling de caducidad (CA-08). */
export async function touchConversation(
  conversationId: string,
  counts: { userMessages: number; assistantMessages: number },
): Promise<void> {
  await db()
    .from('chatbot_conversations')
    .update({
      last_activity_at: new Date().toISOString(),
      user_message_count: counts.userMessages,
      assistant_message_count: counts.assistantMessages,
      status: 'active',
    })
    .eq('id', conversationId)
}

/** Actualiza flags de negocio de la conversación (SPEC-03). */
export async function updateConversationFlags(
  conversationId: string,
  patch: Partial<Pick<ConversationRow, 'lead_captured' | 'call_scheduled' | 'human_requested' | 'lead_form_dismissed' | 'lead_form_offered' | 'lead_id'>>,
): Promise<void> {
  await db().from('chatbot_conversations').update(patch).eq('id', conversationId)
}

export async function updateSummary(
  conversationId: string,
  summary: string,
  summaryMessageCount: number,
): Promise<void> {
  await db()
    .from('chatbot_conversations')
    .update({ summary, summary_message_count: summaryMessageCount })
    .eq('id', conversationId)
}

/** SPEC-08 — Persiste el resumen estructurado (JSONB) en lugar del texto libre. */
export async function updateStructuredSummary(
  conversationId: string,
  structuredSummary: StructuredSummary,
  summaryMessageCount: number,
): Promise<void> {
  await db()
    .from('chatbot_conversations')
    .update({ structured_summary: structuredSummary, summary_message_count: summaryMessageCount })
    .eq('id', conversationId)
}

/** Rate limit por conversación: mensajes de usuario en la última hora (CA-17). */
export async function conversationHourlyCount(conversationId: string): Promise<number> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await db()
    .from('chatbot_messages')
    .select('id', { count: 'exact', head: true })
    .eq('conversation_id', conversationId)
    .eq('role', 'user')
    .gte('created_at', oneHourAgo)
  return count ?? 0
}

/** Rate limit por IP: mensajes de usuario en las últimas 24h (CA-17). */
export async function ipDailyCount(ipHash: string): Promise<number> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await db()
    .from('chatbot_messages')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', oneDayAgo)
  return count ?? 0
}

/** Valoraciones de una conversación, indexadas por message_id (para rehidratar la UI). */
export async function getRatings(conversationId: string): Promise<Record<string, MessageRating>> {
  const { data } = await db()
    .from('chatbot_message_ratings')
    .select('message_id, rating')
    .eq('conversation_id', conversationId)
  const map: Record<string, MessageRating> = {}
  for (const row of data ?? []) map[row.message_id] = row.rating as MessageRating
  return map
}

/** Valoración útil/no útil de un mensaje del bot — upsert, la última gana (CA-10). */
export async function rateMessage(
  conversationId: string,
  messageId: string,
  rating: MessageRating,
): Promise<{ ok: boolean; reason?: string }> {
  const { data: message } = await db()
    .from('chatbot_messages')
    .select('id, conversation_id, role')
    .eq('id', messageId)
    .maybeSingle()

  if (!message || message.conversation_id !== conversationId) {
    return { ok: false, reason: 'El mensaje no pertenece a esta conversación' }
  }
  if (message.role !== 'assistant') {
    return { ok: false, reason: 'Solo se valoran respuestas del asistente' }
  }

  const { error } = await db()
    .from('chatbot_message_ratings')
    .upsert(
      {
        message_id: messageId,
        conversation_id: conversationId,
        rating,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'message_id' },
    )
  if (error) return { ok: false, reason: error.message }
  return { ok: true }
}
