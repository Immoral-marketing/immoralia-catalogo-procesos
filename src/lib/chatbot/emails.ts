/**
 * SPEC-05 — Emails del chatbot con la plantilla de marca Immoralia.
 * (Antes — SPEC-03 — usaban una plantilla provisional. Ahora pasan por
 * el sender centralizado que registra cada envío en `email_logs`.)
 *
 * SPEC-10: la plantilla `call_scheduled` se eliminó — GHL ya envía la
 * confirmación de la reserva al visitante; el catálogo solo avisa al
 * equipo por Slack. Los registros históricos con
 * `kind = 'chatbot_call_scheduled'` en `email_logs` se conservan.
 */
import { getProfessionalTemplate } from '@/lib/email-templates'
import { sendEmail, type EmailKind } from '@/lib/email-sender'

export type ChatbotEmailKind = 'lead_captured' | 'handover_written'

const KIND_TO_LOG_KIND: Record<ChatbotEmailKind, EmailKind> = {
  lead_captured: 'chatbot_lead_captured',
  handover_written: 'chatbot_handover_written',
}

const CONTENT: Record<ChatbotEmailKind, { subject: string; preheader: string; build: (nombre: string) => string }> = {
  lead_captured: {
    subject: 'Hemos recibido tus datos — Immoralia',
    preheader: 'Te contactaremos en menos de 24 horas',
    build: nombre => `
      <h2>¡Gracias, ${nombre}!</h2>
      <p>Hemos recibido tus datos a través de nuestro asistente del catálogo de procesos.</p>
      <div class="info-card">
        Un consultor del equipo revisará tu conversación y <strong>se pondrá en contacto contigo en menos de 24 horas laborables</strong> para ayudarte con lo que estabas buscando.
      </div>
      <p>Mientras tanto, puedes seguir explorando el catálogo o continuar la conversación con el asistente — retomará el hilo donde lo dejasteis.</p>
    `,
  },
  handover_written: {
    subject: 'Te escribimos en menos de 24 horas — Immoralia',
    preheader: 'Tu petición de contacto humano ha quedado registrada',
    build: nombre => `
      <h2>¡Hola, ${nombre}!</h2>
      <p>Desde el equipo de Immoralia te agradecemos tu interés. Hemos registrado tu petición de hablar con una persona del equipo.</p>
      <div class="info-card">
        <strong>Nos pondremos en contacto contigo en un plazo máximo de 24 horas laborables</strong> para ver en qué podemos ayudarte.
      </div>
      <p>Tu conversación con el asistente queda guardada: el consultor llegará con todo el contexto, así no tendrás que repetir nada.</p>
    `,
  },
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

/** Envía el email del chatbot. Nunca lanza — devuelve si se envió (queda registrado en email_logs igualmente). */
export async function sendChatbotEmail(
  kind: ChatbotEmailKind,
  params: { to: string; nombre: string; conversationId?: string; leadId?: string },
): Promise<boolean> {
  const { subject, preheader, build } = CONTENT[kind]
  const safeNombre = escapeHtml(params.nombre)

  const result = await sendEmail({
    kind: KIND_TO_LOG_KIND[kind],
    to: params.to,
    subject,
    html: getProfessionalTemplate({ title: subject, preheader, mainContent: build(safeNombre) }),
    conversationId: params.conversationId,
    leadId: params.leadId,
  })
  return result.ok
}
