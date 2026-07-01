import { createOgImage } from '@/lib/og-image'
import { processes } from '@/data/processes'
import { SECTOR_ACCENT } from '@/lib/metadata'

const SLUG = 'informe-semanal-facturas-vencidas'

export const alt = 'Informe semanal de facturas vencidas — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  const proc = processes.find(p => p.slug === SLUG)
  const accent = proc?.landing_slug ? (SECTOR_ACCENT[proc.landing_slug] ?? '#0ea5e9') : '#0ea5e9'
  return createOgImage({
    title: proc?.nombre ?? 'Informe semanal de facturas vencidas',
    subtitle: proc?.tagline ?? 'Automatización financiera para pymes',
    accent,
  })
}
