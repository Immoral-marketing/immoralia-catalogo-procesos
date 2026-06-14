'use client'
/**
 * SPEC-02 — Superficie inline de las landings de sector.
 * Envoltorio ligero del core con el acento y las chips del sector.
 * Mantiene la API de props del SectorChatbot legado para una migración 1:1.
 */
import React from 'react'
import ChatbotCore from './ChatbotCore'

export interface ChatInlineSectorProps {
  sector: string
  sectorName: string
  accentHex: string
  suggestions: string[]
  headline?: React.ReactNode
}

const ChatInlineSector: React.FC<ChatInlineSectorProps> = ({
  sector,
  sectorName,
  accentHex,
  suggestions,
  headline,
}) => {
  const accentRgb = {
    r: parseInt(accentHex.slice(1, 3), 16),
    g: parseInt(accentHex.slice(3, 5), 16),
    b: parseInt(accentHex.slice(5, 7), 16),
  }

  return (
    <ChatbotCore
      surface="sector"
      sector={sector}
      accentHex={accentHex}
      suggestions={suggestions}
      variant="inline"
      headline={
        headline ?? (
          <>
            ¿Qué te está{' '}
            <span style={{ color: `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.90)` }}>robando tiempo</span>{' '}
            en {sectorName.startsWith('tu') ? sectorName : `tu ${sectorName.toLowerCase()}`}?
          </>
        )
      }
      subline="Cuéntanos el problema y te decimos qué proceso lo resuelve."
    />
  )
}

export default ChatInlineSector
