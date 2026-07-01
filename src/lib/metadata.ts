import type { Metadata } from 'next'
import { BASE_URL, SECTOR_NAMES } from './schema-org'

export const SECTOR_DISPLAY: Record<string, string> = {
  salud: 'centro de salud',
  gestorias: 'gestoría',
  'centros-deportivos': 'centro deportivo',
  construccion: 'empresa constructora',
  desarrolladoras: 'desarrolladora',
  'gastronomia-hosteleria': 'restaurante u hotel',
  academias: 'academia',
  agencias: 'agencia de marketing',
  ecommerce: 'e-commerce',
  industrial: 'empresa industrial',
}

export const SECTOR_ACCENT: Record<string, string> = {
  salud: '#0ea5e9',
  gestorias: '#22c55e',
  'centros-deportivos': '#ef4444',
  construccion: '#22c55e',
  desarrolladoras: '#10b981',
  'gastronomia-hosteleria': '#ea580c',
  academias: '#c026d3',
  agencias: '#8b5cf6',
  ecommerce: '#06b6d4',
  industrial: '#6b7280',
}

// Auditoría slug → landing_slug del sector
export const AUDITORIA_SECTOR: Record<string, string> = {
  salud: 'salud',
  gestorias: 'gestorias',
  deportivos: 'centros-deportivos',
  constructoras: 'construccion',
  restaurantes: 'gastronomia-hosteleria',
  academias: 'academias',
  industrial: 'industrial',
}

const SECTOR_DESCRIPTIONS: Record<string, string> = {
  salud: 'Automatiza citas, gestión de pacientes y seguimientos en tu centro de salud. Más de 20 procesos listos para implementar.',
  gestorias: 'Automatiza la captación de clientes, gestión documental y comunicaciones de tu gestoría. Procesos diseñados para despachos profesionales.',
  'centros-deportivos': 'Automatiza reservas, bajas, comunicaciones y ventas en tu centro deportivo. Procesos probados para instalaciones deportivas de todo tipo.',
  construccion: 'Automatiza presupuestos, seguimiento de obra y relación con proveedores en tu empresa constructora. Procesos adaptados al sector.',
  desarrolladoras: 'Automatiza la captación de compradores, gestión de leads y documentación de tu desarrolladora inmobiliaria. Más eficiencia, menos tareas manuales.',
  'gastronomia-hosteleria': 'Automatiza reservas, atención al cliente y operaciones diarias de tu restaurante u hotel. Procesos diseñados para gastronomía y hostelería.',
  academias: 'Automatiza matrículas, comunicaciones con alumnos y seguimiento académico en tu academia. Procesos para centros de formación de todos los niveles.',
  agencias: 'Automatiza la captación de clientes, reporting y gestión de campañas en tu agencia de marketing. Procesos para agencias digitales y creativas.',
  ecommerce: 'Automatiza la atención al cliente, gestión de pedidos y reactivación de ventas en tu e-commerce. Procesos adaptados a tiendas online.',
  industrial: 'Automatiza la gestión de mantenimiento, proveedores y producción en tu empresa industrial. Procesos para el sector manufacturero.',
}

const AUDITORIA_DESCRIPTIONS: Record<string, string> = {
  salud: 'Evalúa el nivel de automatización de tu centro de salud con nuestra auditoría gratuita. Obtén un informe con las áreas de mejora prioritarias.',
  gestorias: 'Evalúa el grado de automatización de tu gestoría con nuestra auditoría gratuita. Descubre dónde puedes ahorrar tiempo y reducir errores manuales.',
  deportivos: 'Evalúa el nivel de automatización de tu centro deportivo con nuestra auditoría gratuita. Informe personalizado con áreas de mejora concretas.',
  constructoras: 'Evalúa el nivel de automatización de tu empresa constructora con nuestra auditoría gratuita. Diagnóstico personalizado para tu negocio.',
  restaurantes: 'Evalúa el nivel de automatización de tu restaurante u hotel con nuestra auditoría gratuita. Informe con tus principales oportunidades de mejora.',
  academias: 'Evalúa el nivel de automatización de tu academia con nuestra auditoría gratuita. Obtén un diagnóstico con las áreas de mejora prioritarias.',
  industrial: 'Evalúa el nivel de automatización de tu empresa industrial con nuestra auditoría gratuita. Diagnóstico personalizado para tu sector.',
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str
  const cut = str.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > max - 15 ? cut.slice(0, lastSpace) : cut) + '…'
}

function ogImage(path: string) {
  return `${BASE_URL}${path}`
}

function baseOg(title: string, description: string, imagePath: string): Metadata['openGraph'] {
  return {
    type: 'website',
    siteName: 'Immoralia',
    locale: 'es_ES',
    title,
    description,
    url: BASE_URL,
    images: [{ url: ogImage(imagePath), width: 1200, height: 630 }],
  }
}

function baseTwitter(title: string, description: string, imagePath: string): Metadata['twitter'] {
  return {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage(imagePath)],
  }
}

export function buildRootMetadata(): Metadata {
  const title = 'Automatiza los procesos de tu negocio | Immoralia'
  const description = 'Explora más de 150 automatizaciones para pymes españolas. Selecciona los procesos que necesitas y recibe una propuesta personalizada. Cero código, resultados en semanas.'
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/` },
    openGraph: { ...baseOg(title, description, '/opengraph-image'), url: `${BASE_URL}/` },
    twitter: baseTwitter(title, description, '/opengraph-image'),
  }
}

export function buildSectorMetadata(sectorSlug: string): Metadata {
  const display = SECTOR_DISPLAY[sectorSlug] ?? sectorSlug
  const title = truncate(`Automatiza tu ${display} — Immoralia`, 60)
  const description = SECTOR_DESCRIPTIONS[sectorSlug] ?? `Automatiza los procesos de tu ${display} con Immoralia. Procesos listos para implementar, sin código.`
  const url = `${BASE_URL}/sector/${sectorSlug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { ...baseOg(title, description, `/sector/${sectorSlug}/opengraph-image`), url },
    twitter: baseTwitter(title, description, `/sector/${sectorSlug}/opengraph-image`),
  }
}

export function buildAuditMetadata(auditoriaSlug: string): Metadata {
  const sectorSlug = AUDITORIA_SECTOR[auditoriaSlug]
  const display = sectorSlug ? SECTOR_DISPLAY[sectorSlug] : auditoriaSlug
  const sectorName = sectorSlug ? SECTOR_NAMES[sectorSlug] : auditoriaSlug
  const title = truncate(`Auditoría gratuita para ${sectorName} | Immoralia`, 60)
  const description = AUDITORIA_DESCRIPTIONS[auditoriaSlug] ?? `Evalúa el nivel de automatización de tu ${display} con nuestra auditoría gratuita. Diagnóstico personalizado en minutos.`
  const url = `${BASE_URL}/auditorias/${auditoriaSlug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { ...baseOg(title, description, `/auditorias/${auditoriaSlug}/opengraph-image`), url },
    twitter: baseTwitter(title, description, `/auditorias/${auditoriaSlug}/opengraph-image`),
  }
}

export function buildProcessMetadata(proc: {
  nombre: string
  tagline?: string
  descripcionDetallada?: string
  slug: string
  landing_slug?: string
}): Metadata {
  const display = proc.landing_slug ? SECTOR_DISPLAY[proc.landing_slug] : null
  const sectorSuffix = display ? ` para ${display} | Immoralia` : ' | Immoralia'
  const title = truncate(proc.nombre, 60 - sectorSuffix.length) + sectorSuffix

  const base = proc.tagline || truncate(proc.descripcionDetallada ?? proc.nombre, 110)
  const sectorPart = display ? ` Para ${display}.` : ''
  const rawDesc = `${base}${sectorPart} Consulta cómo implementarlo.`
  const description = truncate(rawDesc, 160)

  const url = `${BASE_URL}/catalogo/procesos/${proc.slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { ...baseOg(title, description, `/catalogo/procesos/${proc.slug}/opengraph-image`), url },
    twitter: baseTwitter(title, description, `/catalogo/procesos/${proc.slug}/opengraph-image`),
  }
}

export function buildCatalogMetadata(): Metadata {
  const title = 'Catálogo de automatizaciones | Immoralia'
  const description = 'Más de 150 automatizaciones para pymes españolas, organizadas por sector y área de negocio. Encuentra el proceso que necesitas y recibe una propuesta a medida.'
  const url = `${BASE_URL}/catalogo/completo`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { ...baseOg(title, description, '/catalogo/completo/opengraph-image'), url },
    twitter: baseTwitter(title, description, '/catalogo/completo/opengraph-image'),
  }
}
