'use client'
/**
 * SPEC-02 — Superficie inline de la home.
 * Envoltorio ligero del core con acento cian y chips genéricas.
 */
import React from 'react'
import ChatbotCore from './ChatbotCore'
import { GENERIC_SUGGESTIONS } from './chips'

const HOME_ACCENT = '#00ffff'

const ChatInlineHome: React.FC = () => (
  <ChatbotCore
    surface="home"
    sector={null}
    accentHex={HOME_ACCENT}
    suggestions={GENERIC_SUGGESTIONS}
    variant="inline"
    headline={
      <>
        ¿Qué te está{' '}
        <span style={{ color: 'rgba(0,255,255,0.90)' }}>robando tiempo</span>{' '}
        en tu negocio?
      </>
    }
    subline="Cuéntanos el problema y te decimos qué proceso lo resuelve."
  />
)

export default ChatInlineHome
