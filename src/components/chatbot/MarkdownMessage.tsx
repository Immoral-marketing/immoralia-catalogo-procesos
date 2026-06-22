'use client'
/**
 * SPEC-02 — Renderizado seguro del markdown del bot.
 * Construye nodos React (nunca dangerouslySetInnerHTML): el contenido del
 * modelo no puede inyectar HTML. Solo se enlazan rutas internas y https.
 */
import React from 'react'
import Link from 'next/link'
import { processes } from '@/data/processes'
import { resolveProcessSlug } from '@/lib/chatbot/resolveProcess'

function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

function getProcessNomenclature(slug: string): { codigo: string; bloque: string; nombre: string } | null {
  const p = processes.find(pr => pr.slug === slug)
  if (!p) return null
  return {
    codigo: p.modulo_codigo || p.codigo || '',
    bloque: p.bloque_negocio || '',
    nombre: p.nombre,
  }
}

const ProcessChip: React.FC<{
  slug: string
  label: string
  accentHex: string
  onProcessClick?: (slug: string) => void
}> = ({ slug, label, accentHex, onProcessClick }) => {
  const { r, g, b } = hexToRgb(accentHex)

  // GARANTÍA ANTI-404: valida el slug y repara los inventados por nombre.
  // Sin match → texto plano. El modelo no puede provocar un 404 desde el chat.
  const resolvedSlug = resolveProcessSlug(slug, label)
  const info = resolvedSlug ? getProcessNomenclature(resolvedSlug) : null
  if (!resolvedSlug || !info) {
    return <span className="font-medium text-gray-300">{label}</span>
  }
  slug = resolvedSlug

  const displayLabel = `${info.bloque ? info.bloque + ' · ' : ''}${info.codigo ? info.codigo + ' · ' : ''}${info.nombre}`
  const chipStyle = {
    background: `rgba(${r},${g},${b},0.12)`,
    color: `rgba(${r},${g},${b},1)`,
    border: `1px solid rgba(${r},${g},${b},0.35)`,
  }
  const chipClass = 'inline-flex items-center gap-1.5 mt-1 mb-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 hover:translate-x-0.5'

  // Con handler: abre el panel lateral sin abandonar la conversación
  if (onProcessClick) {
    return (
      <button type="button" onClick={() => onProcessClick(slug)} className={chipClass} style={chipStyle}>
        {displayLabel}
      </button>
    )
  }

  return (
    <Link href={`/catalogo/procesos/${slug}`} className={chipClass} style={chipStyle}>
      {displayLabel}
    </Link>
  )
}

/** Solo rutas internas o https — bloquea javascript: y similares. */
function isSafeHref(href: string): boolean {
  return href.startsWith('/') || href.startsWith('https://')
}

const MarkdownMessage: React.FC<{
  content: string
  accentHex: string
  onProcessClick?: (slug: string) => void
}> = ({ content, accentHex, onProcessClick }) => {
  const { r, g, b } = hexToRgb(accentHex)
  const accentStyle = { color: `rgba(${r},${g},${b},0.9)` }

  const renderInline = (text: string, key: string): React.ReactNode => {
    const parts: React.ReactNode[] = []
    const regex = /\*\*(.*?)\*\*|\[(.*?)\]\((\/catalogo\/procesos\/([^\s)]+))\)|\[(.*?)\]\((\/sector\/[^\s)]+)\)|\[(.*?)\]\(([^)]+)\)/g
    let last = 0
    let match

    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) {
        parts.push(<span key={`t-${key}-${last}`}>{text.slice(last, match.index)}</span>)
      }

      if (match[1] !== undefined) {
        parts.push(<strong key={`b-${key}-${match.index}`} className="font-semibold text-white">{match[1]}</strong>)
      } else if (match[4] !== undefined) {
        parts.push(<ProcessChip key={`p-${key}-${match.index}`} slug={match[4]} label={match[2]} accentHex={accentHex} onProcessClick={onProcessClick} />)
      } else if (match[5] !== undefined) {
        parts.push(
          <Link key={`s-${key}-${match.index}`} href={match[6]} className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity" style={accentStyle}>
            {match[5]} →
          </Link>
        )
      } else if (match[7] !== undefined) {
        if (isSafeHref(match[8])) {
          parts.push(
            <a key={`l-${key}-${match.index}`} href={match[8]} className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity" style={accentStyle} target="_blank" rel="noopener noreferrer">
              {match[7]}
            </a>
          )
        } else {
          parts.push(<span key={`u-${key}-${match.index}`}>{match[7]}</span>)
        }
      }
      last = match.index + match[0].length
    }

    if (last < text.length) {
      parts.push(<span key={`t-${key}-end`}>{text.slice(last)}</span>)
    }

    return <>{parts}</>
  }

  const lines = content.split('\n')
  const nodes: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      nodes.push(<div key={`gap-${i}`} className="h-2" />)
    } else if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''))
        i++
      }
      nodes.push(
        <ul key={`ul-${i}`} className="ml-4 space-y-1 my-1">
          {items.map((item, idx) => (
            <li key={idx} className="list-disc">{renderInline(item, `li-${i}-${idx}`)}</li>
          ))}
        </ul>
      )
      continue
    } else {
      nodes.push(<p key={`p-${i}`} className="leading-relaxed">{renderInline(line, `p-${i}`)}</p>)
    }
    i++
  }

  return <div className="space-y-1 text-sm">{nodes}</div>
}

export default MarkdownMessage
