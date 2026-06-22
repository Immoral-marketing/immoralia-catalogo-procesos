/**
 * SPEC-05 — Helper centralizado de envío de email vía Resend.
 *
 * Todos los envíos transaccionales del catálogo deben pasar por aquí.
 * Beneficios:
 *  - Registro automático en `email_logs` (success/failure).
 *  - Manejo uniforme de errores (nunca lanza — devuelve `{ ok, ... }`).
 *  - Un solo sitio donde tocar la lógica de envío (claves, reintentos, etc.).
 *
 * Si `RESEND_API_KEY` no está configurada, el envío se considera fallido pero
 * se registra igualmente para que el equipo lo detecte en BBDD.
 */
import { createClient } from '@supabase/supabase-js'

export type EmailKind =
  // Chatbot (SPEC-03)
  | 'chatbot_lead_captured'
  | 'chatbot_handover_written'
  // SPEC-10: el envío de 'chatbot_call_scheduled' se eliminó (GHL ya manda
  // la confirmación de la reserva). El valor se conserva en el enum por
  // compatibilidad con los registros históricos en `email_logs`.
  | 'chatbot_call_scheduled'
  // Leads (formulario contacto del catálogo)
  | 'contact_internal'
  | 'contact_client'
  // Onboarding (quick form)
  | 'onboarding_internal'
  | 'onboarding_client'
  // Share-selection (compartir selección por link)
  | 'share_selection'
  // Partners (reset de contraseña)
  | 'partners_reset_password'

export interface SendEmailParams {
  kind: EmailKind
  to: string
  subject: string
  html: string
  from?: string
  /** Vínculos opcionales para auditoría */
  conversationId?: string
  leadId?: string
  /** Metadatos extra que quieras guardar en el log */
  metadata?: Record<string, unknown>
}

export interface SendEmailResult {
  ok: boolean
  resendId?: string
  error?: string
}

// Subdominio verificado en Resend para el catálogo de procesos.
// (immoralia.es raíz no está verificado — usar procesos.immoralia.es.)
const DEFAULT_FROM = 'Immoralia <noreply@procesos.immoralia.es>'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}

async function logEmail(
  params: SendEmailParams,
  result: SendEmailResult,
): Promise<void> {
  try {
    await db().from('email_logs').insert({
      kind: params.kind,
      recipient: params.to,
      subject: params.subject,
      conversation_id: params.conversationId ?? null,
      lead_id: params.leadId ?? null,
      status: result.ok ? 'sent' : 'failed',
      error_message: result.error ?? null,
      resend_id: result.resendId ?? null,
      metadata: params.metadata ?? {},
    })
  } catch (err) {
    // Fallo del propio logging — no interrumpe nada
    console.error('email_logs insert falló:', err)
  }
}

/** Envía un email vía Resend. Nunca lanza — devuelve { ok, error? }. */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    const result: SendEmailResult = { ok: false, error: 'RESEND_API_KEY no configurada' }
    console.error(result.error)
    await logEmail(params, result)
    return result
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: params.from || DEFAULT_FROM,
        to: [params.to],
        subject: params.subject,
        html: params.html,
      }),
    })

    const data = await res.json().catch(() => null) as { id?: string; message?: string } | null

    if (!res.ok) {
      const result: SendEmailResult = {
        ok: false,
        error: `Resend ${res.status}: ${data?.message ?? 'unknown'}`,
      }
      console.error(`Email ${params.kind} a ${params.to} falló:`, result.error)
      await logEmail(params, result)
      return result
    }

    const result: SendEmailResult = { ok: true, resendId: data?.id }
    await logEmail(params, result)
    return result
  } catch (err) {
    const result: SendEmailResult = {
      ok: false,
      error: err instanceof Error ? err.message : 'unknown',
    }
    console.error(`Email ${params.kind} a ${params.to} excepción:`, result.error)
    await logEmail(params, result)
    return result
  }
}
