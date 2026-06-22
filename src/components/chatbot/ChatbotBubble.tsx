'use client'
/**
 * SPEC-02 — Burbuja flotante del chatbot v3.
 * Visible en todas las rutas públicas de visitante EXCEPTO:
 *  - home y landings de sector (allí ya hay chat inline — CA-10)
 *  - admin y panel de afiliados (zonas internas)
 * Comparte la misma conversación que las superficies inline.
 */
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { MessageSquare, X } from 'lucide-react'
import ChatbotCore from './ChatbotCore'
import { GENERIC_SUGGESTIONS } from './chips'

const BUBBLE_ACCENT = '#00ffff'

function isBubbleVisible(pathname: string): boolean {
  if (pathname === '/') return false // home tiene inline
  if (pathname.startsWith('/sector/')) return false // landings tienen inline
  if (pathname.startsWith('/admin')) return false // zona interna
  if (pathname.startsWith('/afiliado')) return false // panel de afiliados
  return true
}

const ChatbotBubble: React.FC = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  if (!pathname || !isBubbleVisible(pathname)) return null

  return (
    <>
      {/* Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-[400px] h-[min(600px,calc(100vh-8rem))] rounded-2xl border flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200"
          style={{
            backgroundColor: '#0d0d0d',
            borderColor: 'rgba(0,255,255,0.18)',
            boxShadow: '0 0 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,255,0.08)',
          }}
        >
          {/* Cabecera */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b shrink-0"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center border"
                style={{ borderColor: 'rgba(0,255,255,0.22)', color: 'rgba(0,255,255,0.9)', backgroundColor: 'rgba(0,255,255,0.12)' }}
              >
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">Asistente Immoralia</p>
                <p className="text-[11px] text-gray-500 leading-tight">Te ayudamos a encontrar tu proceso</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <ChatbotCore
            surface="bubble"
            sector={null}
            accentHex={BUBBLE_ACCENT}
            suggestions={GENERIC_SUGGESTIONS}
            variant="panel"
            welcomeText="¡Hola! Soy el asistente de Immoralia. Cuéntame qué te roba tiempo en tu negocio y te digo qué proceso lo resuelve."
          />
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
        className="fixed bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-lg"
        style={{
          backgroundColor: 'rgba(0,255,255,0.9)',
          color: '#000',
          boxShadow: '0 4px 24px rgba(0,255,255,0.25)',
        }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </>
  )
}

export default ChatbotBubble
