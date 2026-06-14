/**
 * SPEC-02 — Resolución segura de slugs de proceso.
 * El modelo a veces inventa el slug a partir del nombre del proceso.
 * Esta utilidad: 1) valida slugs reales, 2) repara slugs inventados si el
 * nombre/label coincide con un proceso real, 3) devuelve null si no hay match
 * (la UI lo pinta como texto plano — nunca un 404).
 *
 * Compartida por servidor (rag.ts) y cliente (MarkdownMessage).
 */
import { processes } from '@/data/processes'

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const VALID_SLUGS = new Set(processes.map(p => p.slug))
const SLUG_BY_NAME = new Map(processes.map(p => [normalize(p.nombre), p.slug]))

/**
 * Devuelve el slug REAL del catálogo, o null si no se puede resolver.
 * @param slug  slug escrito por el modelo (puede ser inventado)
 * @param label texto visible del enlace (suele ser el nombre del proceso)
 */
export function resolveProcessSlug(slug: string, label?: string): string | null {
  if (VALID_SLUGS.has(slug)) return slug

  // Reparación 1: el label coincide con el nombre de un proceso real
  if (label) {
    const byLabel = SLUG_BY_NAME.get(normalize(label))
    if (byLabel) return byLabel
  }

  // Reparación 2: el slug inventado es el nombre del proceso en kebab-case
  const bySlugAsName = SLUG_BY_NAME.get(normalize(slug.replace(/-/g, ' ')))
  if (bySlugAsName) return bySlugAsName

  return null
}
