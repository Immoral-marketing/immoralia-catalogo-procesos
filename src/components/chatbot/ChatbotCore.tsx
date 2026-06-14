'use client'
/**
 * SPEC-02 — Core conversacional único del chatbot v3.
 * Las tres superficies (burbuja, home, sector) renderizan ESTE componente:
 * una sola lógica de mensajes, streaming, enlaces, valoración y persistencia.
 */
import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Send, Loader2, Bot, X, MessageSquare, ChevronDown, ThumbsUp, ThumbsDown, RotateCcw, Calendar, Mail, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GHLBookingModal } from '@/components/GHLBookingModal'
import { useChatConversation, type ChatMessage, type Rating } from './useChatConversation'
import MarkdownMessage from './MarkdownMessage'
import ProcessPreviewPanel from './ProcessPreviewPanel'
import LeadFormCard from './LeadFormCard'

export interface ChatbotCoreProps {
  surface: 'bubble' | 'home' | 'sector'
  sector?: string | null
  accentHex: string
  suggestions: string[]
  variant: 'inline' | 'panel'
  /** Solo variant inline: cabecera grande sobre el chat */
  headline?: React.ReactNode
  subline?: string
  /** Solo variant panel: mensaje de bienvenida estático cuando no hay conversación */
  welcomeText?: string
}

function hexToRgbStr(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

const RatingButtons: React.FC<{
  message: ChatMessage
  accent: string
  onRate: (id: string, rating: Rating) => void
}> = ({ message, accent, onRate }) => {
  if (!message.id || message.isError) return null
  return (
    <div
      className={cn(
        'flex items-center gap-1 mt-1.5 transition-opacity',
        // Con valoración hecha, los pulgares quedan SIEMPRE visibles; sin valorar, aparecen al hover (móvil: siempre tenues)
        message.rating ? 'opacity-100' : 'md:opacity-0 md:group-hover:opacity-100 opacity-60'
      )}
    >
      <button
        aria-label="Respuesta útil"
        onClick={() => onRate(message.id!, 'useful')}
        className="p-1 rounded-md transition-colors hover:bg-white/5"
        style={{ color: message.rating === 'useful' ? accent : 'rgba(156,163,175,0.7)' }}
      >
        <ThumbsUp className="w-3 h-3" fill={message.rating === 'useful' ? 'currentColor' : 'none'} />
      </button>
      <button
        aria-label="Respuesta no útil"
        onClick={() => onRate(message.id!, 'not_useful')}
        className="p-1 rounded-md transition-colors hover:bg-white/5"
        style={{ color: message.rating === 'not_useful' ? accent : 'rgba(156,163,175,0.7)' }}
      >
        <ThumbsDown className="w-3 h-3" fill={message.rating === 'not_useful' ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
}

const ChatbotCore: React.FC<ChatbotCoreProps> = ({
  surface,
  sector = null,
  accentHex,
  suggestions,
  variant,
  headline,
  subline,
  welcomeText,
}) => {
  const pathname = usePathname()
  const {
    messages, isLoading, error, hydratedWithHistory,
    pendingAction, leadCaptured,
    send, retry, rate, clear,
    submitLead, dismissLeadForm, clearPendingAction, sendConversationEvent,
  } = useChatConversation()
  const [input, setInput] = useState('')
  const [showMessages, setShowMessages] = useState(true)
  const [previewSlug, setPreviewSlug] = useState<string | null>(null)
  // SPEC-03 — estados del flujo de captura/handover
  const [postCaptureOffer, setPostCaptureOffer] = useState(false)
  const [handoverChoice, setHandoverChoice] = useState<'schedule' | 'email' | null>(null)
  const [showBooking, setShowBooking] = useState(false)
  const [scheduledDone, setScheduledDone] = useState(false)
  const [handoverConfirmed, setHandoverConfirmed] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const collapsedInitialized = useRef(false)

  const accentRgb = hexToRgbStr(accentHex)
  const ACCENT = `rgba(${accentRgb},0.90)`
  const ACCENT_DIM = `rgba(${accentRgb},0.12)`
  const ACCENT_BORDER = `rgba(${accentRgb},0.22)`

  const hasMessages = messages.length > 0

  // CA-13: con conversación previa rehidratada, los inline arrancan colapsados
  useEffect(() => {
    if (variant === 'inline' && hydratedWithHistory && !collapsedInitialized.current) {
      collapsedInitialized.current = true
      setShowMessages(false)
    }
  }, [variant, hydratedWithHistory])

  // Sin autoscroll (decisión owner, spec v1.4): el scroll del chat es
  // SIEMPRE del usuario. Ningún evento (mensaje nuevo, streaming, valoración)
  // mueve la vista automáticamente.

  // SPEC-03 — Detección best-effort de reserva completada en el widget GHL
  // (el widget de LeadConnector emite postMessage al confirmar la cita).
  useEffect(() => {
    if (!showBooking) return
    const handler = (event: MessageEvent) => {
      try {
        const raw = typeof event.data === 'string' ? event.data : JSON.stringify(event.data)
        if (/appointment|booking[-_ ]?(confirm|success|booked)/i.test(raw)) {
          setScheduledDone(true)
          setPostCaptureOffer(false)
          void sendConversationEvent('schedule_completed')
        }
      } catch { /* mensajes de otros orígenes — ignorar */ }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [showBooking, sendConversationEvent])

  const handleLeadSubmit = async (nombre: string, email: string) => {
    // Solo se llega aquí desde: lead_form (interés) o handover→escribir.
    // "Agendar llamada" abre directamente GHL, que captura datos él mismo.
    const mode = pendingAction === 'handover' ? 'handover' : 'capture'
    const result = await submitLead({ nombre, email, mode })
    if (result.ok) {
      if (pendingAction === 'handover') {
        setHandoverConfirmed(true)
        setHandoverChoice(null)
      } else {
        setPostCaptureOffer(true) // «Sí, agendar llamada» / «No»
      }
    }
    return result
  }

  const handleHandoverChoice = (choice: 'schedule' | 'email') => {
    if (choice === 'schedule') {
      // GHL captura nombre + email dentro de su propio widget — no usamos form propio
      clearPendingAction()
      setShowBooking(true)
    } else {
      // Sin email no podemos escribirle → mostramos form
      setHandoverChoice('email')
    }
  }

  const handleHandoverWithLead = (choice: 'schedule' | 'email') => {
    clearPendingAction()
    if (choice === 'schedule') {
      setShowBooking(true)
    } else {
      void sendConversationEvent('handover_written')
      setHandoverConfirmed(true)
    }
  }

  const sendMessage = (text: string) => {
    void send(text, { sector, surface, route: pathname || '/' })
    setInput('')
    setShowMessages(true)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) sendMessage(input)
    }
  }

  const isPanel = variant === 'panel'

  const conversationArea = (
    <div className={cn('space-y-4 overflow-y-auto pr-1', isPanel ? 'flex-1 px-4 py-3' : 'max-h-[420px]')}>
      {/* Bienvenida estática del panel cuando no hay conversación */}
      {isPanel && !hasMessages && welcomeText && (
        <div className="flex gap-3 justify-start">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border"
            style={{ borderColor: ACCENT_BORDER, color: ACCENT, backgroundColor: ACCENT_DIM }}
          >
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-none px-4 py-3 text-sm leading-relaxed bg-white/[0.04] border border-white/8 text-gray-200">
            {welcomeText}
          </div>
        </div>
      )}

      {messages.map((m, i) => (
        <div
          key={m.id ?? `msg-${i}`}
          className={cn('flex gap-3 group', m.role === 'user' ? 'justify-end' : 'justify-start')}
        >
          {m.role === 'assistant' && (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border"
              style={{ borderColor: ACCENT_BORDER, color: ACCENT, backgroundColor: ACCENT_DIM }}
            >
              <Bot className="w-3.5 h-3.5" />
            </div>
          )}
          <div className="max-w-[85%] flex flex-col">
            <div
              className={cn(
                'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                m.role === 'user'
                  ? 'bg-white/8 text-white rounded-tr-none'
                  : m.isError
                    ? 'bg-red-500/10 border border-red-500/25 text-red-200 rounded-tl-none'
                    : 'bg-white/[0.04] border border-white/8 text-gray-200 rounded-tl-none'
              )}
            >
              {m.role === 'assistant' && !m.isError
                ? <MarkdownMessage content={m.content} accentHex={accentHex} onProcessClick={setPreviewSlug} />
                : m.content}
            </div>
            {m.role === 'assistant' && <RatingButtons message={m} accent={ACCENT} onRate={rate} />}
          </div>
        </div>
      ))}

      {isLoading && messages[messages.length - 1]?.role === 'user' && (
        <div className="flex gap-3 justify-start">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border"
            style={{ borderColor: ACCENT_BORDER, color: ACCENT, backgroundColor: ACCENT_DIM }}
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          </div>
          <div className="bg-white/[0.04] border border-white/8 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
            <span className="w-1.5 h-1.5 rounded-full animate-bounce bg-gray-500" />
            <span className="w-1.5 h-1.5 rounded-full animate-bounce delay-100 bg-gray-500" />
            <span className="w-1.5 h-1.5 rounded-full animate-bounce delay-200 bg-gray-500" />
          </div>
        </div>
      )}
    </div>
  )

  // ─── SPEC-03: tarjetas de acción (form de lead, handover, post-captura) ───
  const actionButton = (label: string, icon: React.ReactNode, onClick: () => void, primary = true) => (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
        !primary && 'border border-white/15 text-gray-300 hover:text-white hover:border-white/30'
      )}
      style={primary ? { backgroundColor: ACCENT, color: '#000' } : {}}
    >
      {icon}
      {label}
    </button>
  )

  const confirmationCard = (text: string) => (
    <div
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm animate-in fade-in duration-300"
      style={{ borderColor: ACCENT_BORDER, backgroundColor: ACCENT_DIM, color: ACCENT }}
    >
      <CheckCircle2 className="w-4 h-4 shrink-0" />
      <span className="font-medium">{text}</span>
    </div>
  )

  const hasActionContent = (pendingAction !== null && !(pendingAction === 'lead_form' && leadCaptured))
    || postCaptureOffer || scheduledDone || handoverConfirmed

  const actionCards = hasActionContent && (
    <div className={cn('space-y-3', isPanel ? 'px-4 pb-2' : 'mb-4')}>
      {/* Formulario de lead (trigger semántico o límite duro de 5 turnos) */}
      {pendingAction === 'lead_form' && !leadCaptured && (
        <LeadFormCard
          accentHex={accentHex}
          title="¿Quieres que el equipo te eche una mano con esto?"
          subtitle="Déjanos tu nombre y email y te contactamos en menos de 24 horas laborables."
          onSubmit={handleLeadSubmit}
          onDismiss={dismissLeadForm}
        />
      )}

      {/* Handover SIN lead: elegir camino. "Agendar llamada" abre GHL directo; "Escribir" muestra form */}
      {pendingAction === 'handover' && !leadCaptured && handoverChoice === null && (
        <div
          className="rounded-2xl border p-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ borderColor: ACCENT_BORDER, backgroundColor: ACCENT_DIM }}
        >
          <p className="text-sm font-semibold text-white">¿Cómo prefieres que sigamos?</p>
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            {actionButton('Agendar llamada', <Calendar className="w-4 h-4" />, () => handleHandoverChoice('schedule'))}
            {actionButton('Que me escribáis', <Mail className="w-4 h-4" />, () => handleHandoverChoice('email'), false)}
          </div>
        </div>
      )}
      {pendingAction === 'handover' && !leadCaptured && handoverChoice === 'email' && (
        <LeadFormCard
          accentHex={accentHex}
          title="Déjanos tus datos y te escribimos"
          subtitle="Te contactamos en menos de 24 horas laborables."
          onSubmit={handleLeadSubmit}
          onDismiss={() => { setHandoverChoice(null); dismissLeadForm() }}
        />
      )}

      {/* Handover CON lead ya capturado: directo a elegir */}
      {pendingAction === 'handover' && leadCaptured && (
        <div
          className="rounded-2xl border p-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ borderColor: ACCENT_BORDER, backgroundColor: ACCENT_DIM }}
        >
          <p className="text-sm font-semibold text-white">Ya tenemos tus datos. ¿Cómo prefieres que sigamos?</p>
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            {actionButton('Agendar llamada', <Calendar className="w-4 h-4" />, () => handleHandoverWithLead('schedule'))}
            {actionButton('Que me escribáis', <Mail className="w-4 h-4" />, () => handleHandoverWithLead('email'), false)}
          </div>
        </div>
      )}

      {/* Post-captura: ofrecer agendar — la conversación nunca se cierra */}
      {postCaptureOffer && !scheduledDone && (
        <div
          className="rounded-2xl border p-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{ borderColor: ACCENT_BORDER, backgroundColor: ACCENT_DIM }}
        >
          <p className="text-sm font-semibold text-white">¡Recibido! ¿Quieres que lo veamos en una llamada de 20 minutos?</p>
          <p className="text-xs text-gray-400 mt-0.5">Sin compromiso — te orientamos sobre lo que hemos hablado.</p>
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            {actionButton('Sí, agendar llamada', <Calendar className="w-4 h-4" />, () => setShowBooking(true))}
            {actionButton('No', <X className="w-4 h-4" />, () => setPostCaptureOffer(false), false)}
          </div>
        </div>
      )}

      {scheduledDone && confirmationCard('¡Llamada agendada! Te llegará un email con la convocatoria para que no se te olvide.')}
      {handoverConfirmed && confirmationCard('Hecho. Te escribimos en menos de 24 horas laborables.')}
    </div>
  )

  const errorBanner = error && (
    <div className={cn(
      'flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border text-xs',
      'bg-red-500/10 border-red-500/25 text-red-200',
      isPanel ? 'mx-4 mb-2' : 'mb-3'
    )}>
      <span>{error}</span>
      <button
        onClick={retry}
        className="flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 transition-colors shrink-0"
      >
        <RotateCcw className="w-3 h-3" />
        Reintentar
      </button>
    </div>
  )

  const inputBar = (
    <div
      className={cn('relative flex items-center gap-3 rounded-2xl border transition-all duration-200', isPanel ? 'mx-4 mb-4 px-4 py-3' : 'px-5 py-4')}
      style={{
        borderColor: `rgba(${accentRgb},0.28)`,
        backgroundColor: 'rgba(255,255,255,0.04)',
        boxShadow: `0 0 0 1px rgba(${accentRgb},0.12), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        maxLength={2000}
        placeholder="Cuéntanos qué necesitas..."
        className={cn('flex-1 bg-transparent text-white placeholder:text-gray-500 outline-none', isPanel ? 'text-sm' : 'text-base')}
        disabled={isLoading}
      />
      <button
        onClick={() => sendMessage(input)}
        disabled={isLoading || !input.trim()}
        aria-label="Enviar mensaje"
        className={cn('rounded-xl flex items-center justify-center transition-all disabled:opacity-25 shrink-0', isPanel ? 'w-8 h-8' : 'w-9 h-9')}
        style={{ backgroundColor: ACCENT, color: '#000' }}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </button>
    </div>
  )

  const chips = !hasMessages && (
    <div className={cn('flex flex-wrap gap-2 justify-center animate-in fade-in duration-500 delay-200', isPanel ? 'px-4 pb-4' : 'mt-5')}>
      {suggestions.map(s => (
        <button
          key={s}
          onClick={() => sendMessage(s)}
          className={cn('rounded-full border transition-all text-gray-300 hover:text-white', isPanel ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2')}
          style={{ borderColor: `rgba(${accentRgb},0.22)`, backgroundColor: `rgba(${accentRgb},0.05)` }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = `rgba(${accentRgb},0.5)`
            ;(e.currentTarget as HTMLElement).style.backgroundColor = `rgba(${accentRgb},0.12)`
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = `rgba(${accentRgb},0.22)`
            ;(e.currentTarget as HTMLElement).style.backgroundColor = `rgba(${accentRgb},0.05)`
          }}
        >
          {s}
        </button>
      ))}
    </div>
  )

  const processPanel = (
    <ProcessPreviewPanel slug={previewSlug} onClose={() => setPreviewSlug(null)} />
  )

  const bookingModal = (
    <GHLBookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
  )

  // ─── Variante PANEL (burbuja flotante) ───
  if (isPanel) {
    return (
      <div className="flex flex-col h-full">
        {conversationArea}
        {actionCards}
        {errorBanner}
        {inputBar}
        {chips}
        {processPanel}
        {bookingModal}
      </div>
    )
  }

  // ─── Variante INLINE (home y sector) ───
  return (
    <section className="px-6 py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(${accentRgb},0.05) 0%, transparent 70%)` }}
      />

      <div className="max-w-2xl mx-auto relative">
        <div className={cn('text-center animate-in fade-in duration-500', hasMessages && showMessages ? 'mb-6' : 'mb-10')}>
          <h2 className={cn('font-bold text-white leading-tight', hasMessages && showMessages ? 'text-2xl md:text-3xl mb-1' : 'text-3xl md:text-4xl mb-3')}>
            {headline}
          </h2>
          {!hasMessages && subline && (
            <p className="text-sm text-gray-500">{subline}</p>
          )}
        </div>

        {/* CA-13: acceso colapsado para retomar */}
        {hasMessages && !showMessages && (
          <button
            onClick={() => setShowMessages(true)}
            className="w-full mb-4 flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm text-gray-400 hover:text-white"
            style={{ borderColor: ACCENT_BORDER, backgroundColor: ACCENT_DIM }}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" style={{ color: ACCENT }} />
              <span>Conversación guardada · {messages.length} mensajes</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>
        )}

        {hasMessages && showMessages && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Conversación</span>
              <div className="flex items-center gap-3">
                {confirmClear ? (
                  <div className="flex items-center gap-2 animate-in fade-in duration-150">
                    <span className="text-xs text-gray-500">¿Borrar la conversación?</span>
                    <button
                      onClick={() => { clear(); setConfirmClear(false) }}
                      className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                    >
                      Sí, borrar
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    Borrar
                  </button>
                )}
                <button
                  onClick={() => { setShowMessages(false); setConfirmClear(false) }}
                  className="flex items-center gap-1.5 text-xs font-medium transition-colors px-2 py-1 rounded-lg"
                  style={{ color: ACCENT }}
                >
                  <X className="w-3.5 h-3.5" />
                  Cerrar
                </button>
              </div>
            </div>
            {conversationArea}
          </div>
        )}

        {actionCards}
        {errorBanner}
        {inputBar}
        {chips}
      </div>
      {processPanel}
      {bookingModal}
    </section>
  )
}

export default ChatbotCore
