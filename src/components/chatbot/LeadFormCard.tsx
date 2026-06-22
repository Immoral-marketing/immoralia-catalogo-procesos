'use client'
/**
 * SPEC-03 — Formulario de lead embebido en el hilo de conversación.
 * Nombre + email + checkbox RGPD obligatorio (enlace a /privacidad) + X de cierre.
 * Se siente parte de la conversación: mismo lenguaje visual que los mensajes del bot.
 */
import React, { useState } from 'react'
import { Loader2, Send, X } from 'lucide-react'

interface LeadFormCardProps {
  accentHex: string
  title: string
  subtitle?: string
  onSubmit: (nombre: string, email: string) => Promise<{ ok: boolean; error?: string }>
  onDismiss: () => void
}

const LeadFormCard: React.FC<LeadFormCardProps> = ({ accentHex, title, subtitle, onSubmit, onDismiss }) => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const r = parseInt(accentHex.slice(1, 3), 16)
  const g = parseInt(accentHex.slice(3, 5), 16)
  const b = parseInt(accentHex.slice(5, 7), 16)
  const ACCENT = `rgba(${r},${g},${b},0.9)`

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const canSubmit = nombre.trim().length >= 2 && emailValid && consent && !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    const result = await onSubmit(nombre.trim(), email.trim())
    setSubmitting(false)
    if (!result.ok) setError(result.error || 'No se pudo enviar. Inténtalo de nuevo.')
  }

  return (
    <div
      className="relative rounded-2xl border p-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
      style={{ borderColor: `rgba(${r},${g},${b},0.25)`, backgroundColor: `rgba(${r},${g},${b},0.06)` }}
    >
      <button
        onClick={onDismiss}
        aria-label="Cerrar formulario"
        className="absolute top-3 right-3 p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <p className="text-sm font-semibold text-white pr-8">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}

      <div className="flex flex-col sm:flex-row gap-2 mt-3">
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Tu nombre"
          maxLength={100}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-white/25 transition-colors"
          disabled={submitting}
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com"
          maxLength={255}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-white/25 transition-colors"
          disabled={submitting}
        />
      </div>

      <label className="flex items-start gap-2 mt-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
          className="mt-0.5 accent-current"
          style={{ color: ACCENT }}
          disabled={submitting}
        />
        <span className="text-xs text-gray-400 leading-relaxed">
          Acepto la{' '}
          <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2" style={{ color: ACCENT }}>
            política de privacidad
          </a>{' '}
          y que Immoralia me contacte sobre mi consulta.
        </span>
      </label>

      {error && <p className="text-xs text-red-300 mt-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="mt-3 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
        style={{ backgroundColor: ACCENT, color: '#000' }}
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {submitting ? 'Enviando...' : 'Enviar'}
      </button>
    </div>
  )
}

export default LeadFormCard
