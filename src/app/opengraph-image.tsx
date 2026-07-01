import { createOgImage } from '@/lib/og-image'

export const alt = 'Automatiza los procesos de tu negocio — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return createOgImage({
    title: 'Automatiza los procesos de tu negocio',
    subtitle: 'Más de 150 procesos para pymes españolas',
    accent: '#0ea5e9',
  })
}
