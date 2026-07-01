import { createOgImage } from '@/lib/og-image'
import { processes } from '@/data/processes'
import { SECTOR_ACCENT } from '@/lib/metadata'

export const alt = 'Proceso de automatización — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const proc = processes.find(p => p.slug === slug && !p.hidden)
  const accent = proc?.landing_slug ? (SECTOR_ACCENT[proc.landing_slug] ?? '#0ea5e9') : '#0ea5e9'
  return createOgImage({
    title: proc?.nombre ?? 'Automatización de procesos',
    subtitle: proc?.tagline ?? undefined,
    accent,
  })
}
