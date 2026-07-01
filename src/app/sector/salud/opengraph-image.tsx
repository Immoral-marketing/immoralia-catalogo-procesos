import { createOgImage } from '@/lib/og-image'

export const alt = 'Automatizaciones para centros de salud — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return createOgImage({
    title: 'Automatiza tu centro de salud',
    subtitle: 'Más de 20 procesos listos para implementar',
    accent: '#0ea5e9',
  })
}
