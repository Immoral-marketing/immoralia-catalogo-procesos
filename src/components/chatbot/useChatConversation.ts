'use client'
/**
 * SPEC-02 — Hook del core conversacional v3.
 * Una sola conversación que sigue al visitante por todo el sitio:
 * el identificador vive en localStorage (rolling 7 días, alineado con SPEC-01)
 * y el historial SIEMPRE se rehidrata desde el backend.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

export type Rating = 'useful' | 'not_useful'
export type PendingAction = 'lead_form' | 'handover' | null

export interface ChatMessage {
  id?: string
  role: 'user' | 'assistant'
  content: string
  isError?: boolean
  rating?: Rating | null
}

const STORAGE_KEY = 'immoralia_chatbot_v3'
const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000

interface StoredConversation {
  id: string
  lastActivity: number
}

function readStored(): StoredConversation | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredConversation
    if (!parsed.id || Date.now() - parsed.lastActivity > EXPIRY_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeStored(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id, lastActivity: Date.now() }))
  } catch { /* almacenamiento no disponible */ }
}

function clearStored() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch { /* noop */ }
}

interface SendContext {
  sector: string | null
  surface: 'bubble' | 'home' | 'sector'
  route: string
}

export function useChatConversation() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hydratedWithHistory, setHydratedWithHistory] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [leadCaptured, setLeadCaptured] = useState(false)
  const conversationIdRef = useRef<string | null>(null)
  const lastFailedRef = useRef<{ text: string; context: SendContext } | null>(null)
  const hydratedRef = useRef(false)

  // Rehidratación del historial desde el backend (CA-08 de la spec)
  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true

    const stored = readStored()
    if (!stored) return
    conversationIdRef.current = stored.id

    fetch(`/api/chatbot/history?conversationId=${stored.id}`)
      .then(async res => {
        if (res.status === 404 || res.status === 410) {
          // Conversación inexistente o caducada: empezar de cero (CA-09)
          conversationIdRef.current = null
          clearStored()
          return
        }
        if (!res.ok) return // error transitorio del servidor: conservar el id, sin historial visible
        const data = await res.json()
        if (data.leadCaptured) setLeadCaptured(true)
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages.map((m: {
            id: string; role: 'user' | 'assistant'; content: string
            isError?: boolean; rating?: Rating | null
          }) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            isError: m.isError,
            rating: m.rating ?? null,
          })))
          setHydratedWithHistory(true)
        }
      })
      .catch(() => { /* sin red: el chat arranca vacío sin error visible */ })
  }, [])

  const send = useCallback(async (text: string, context: SendContext) => {
    const userMessage = text.trim()
    if (!userMessage || isLoading) return

    setError(null)
    setIsLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationId: conversationIdRef.current ?? undefined,
          sector: context.sector,
          surface: context.surface,
          route: context.route,
        }),
      })

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'No se pudo enviar el mensaje')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let assistantStarted = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const blocks = buffer.split('\n\n')
        buffer = blocks.pop() ?? ''
        for (const block of blocks) {
          const line = block.trim()
          if (!line.startsWith('data: ')) continue
          let event: { type: string; [k: string]: unknown }
          try {
            event = JSON.parse(line.slice(6))
          } catch {
            continue
          }

          if (event.type === 'meta') {
            const newId = event.conversationId as string
            if (event.previousExpired) {
              // La conversación anterior caducó server-side: el hilo visible se reinicia (CA-09)
              setMessages([{ role: 'user', content: userMessage }])
              setHydratedWithHistory(false)
            }
            conversationIdRef.current = newId
            writeStored(newId)
          } else if (event.type === 'delta') {
            const delta = event.text as string
            if (!assistantStarted) {
              assistantStarted = true
              setMessages(prev => [...prev, { role: 'assistant', content: delta }])
            } else {
              setMessages(prev => {
                const next = [...prev]
                const last = next[next.length - 1]
                next[next.length - 1] = { ...last, content: last.content + delta }
                return next
              })
            }
          } else if (event.type === 'done') {
            const messageId = event.assistantMessageId as string
            setMessages(prev => {
              const next = [...prev]
              const last = next[next.length - 1]
              if (last?.role === 'assistant') {
                next[next.length - 1] = { ...last, id: messageId, rating: null }
              }
              return next
            })
            if (conversationIdRef.current) writeStored(conversationIdRef.current)
            // SPEC-03: acción estructurada del backend (formulario / handover)
            if (event.action === 'offer_lead_form') setPendingAction('lead_form')
            else if (event.action === 'offer_handover') setPendingAction('handover')
          } else if (event.type === 'error') {
            setMessages(prev => {
              const base = assistantStarted ? prev.slice(0, -1) : prev
              return [...base, { role: 'assistant', content: event.message as string, isError: true }]
            })
          }
        }
      }

      lastFailedRef.current = null
    } catch (err) {
      console.error('Error enviando mensaje:', err)
      lastFailedRef.current = { text: userMessage, context }
      // El mensaje del usuario se conserva en pantalla; banner con reintento
      setError('No se pudo conectar. Comprueba tu conexión y reintenta.')
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const retry = useCallback(() => {
    const failed = lastFailedRef.current
    if (!failed) return
    // Quita el mensaje de usuario duplicado antes de reenviar
    setMessages(prev => {
      const next = [...prev]
      if (next[next.length - 1]?.role === 'user') next.pop()
      return next
    })
    void send(failed.text, failed.context)
  }, [send])

  const rate = useCallback(async (messageId: string, rating: Rating) => {
    if (!conversationIdRef.current) return
    // Optimista: marca primero, revierte si falla
    setMessages(prev => prev.map(m => (m.id === messageId ? { ...m, rating } : m)))
    try {
      const res = await fetch('/api/chatbot/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: conversationIdRef.current, messageId, rating }),
      })
      if (!res.ok) throw new Error('feedback failed')
    } catch {
      setMessages(prev => prev.map(m => (m.id === messageId ? { ...m, rating: null } : m)))
    }
  }, [])

  const clear = useCallback(() => {
    conversationIdRef.current = null
    clearStored()
    setMessages([])
    setError(null)
    setHydratedWithHistory(false)
    setPendingAction(null)
    setLeadCaptured(false)
  }, [])

  // ─── SPEC-03: lead capture, handover y eventos ───

  const submitLead = useCallback(async (params: {
    nombre: string
    email: string
    mode: 'capture' | 'handover'
  }): Promise<{ ok: boolean; error?: string }> => {
    if (!conversationIdRef.current) return { ok: false, error: 'Empieza una conversación primero' }
    try {
      const res = await fetch('/api/chatbot/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversationIdRef.current,
          nombre: params.nombre,
          email: params.email,
          consent: true, // el botón de envío solo se habilita con el checkbox marcado
          mode: params.mode,
        }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data?.error || 'No se pudo enviar' }
      setLeadCaptured(true)
      setPendingAction(null)
      return { ok: true }
    } catch {
      return { ok: false, error: 'No se pudo conectar. Inténtalo de nuevo.' }
    }
  }, [])

  const sendConversationEvent = useCallback(async (
    event: 'form_dismissed' | 'handover_written' | 'schedule_completed',
  ) => {
    if (!conversationIdRef.current) return
    try {
      await fetch('/api/chatbot/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: conversationIdRef.current, event }),
      })
    } catch (err) {
      console.error('Evento de conversación no registrado:', err)
    }
  }, [])

  const dismissLeadForm = useCallback(() => {
    setPendingAction(null)
    void sendConversationEvent('form_dismissed')
  }, [sendConversationEvent])

  const clearPendingAction = useCallback(() => setPendingAction(null), [])

  return {
    messages, isLoading, error, hydratedWithHistory,
    pendingAction, leadCaptured,
    send, retry, rate, clear,
    submitLead, dismissLeadForm, clearPendingAction, sendConversationEvent,
  }
}
