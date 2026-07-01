import { createOgImage } from '@/lib/og-image'

export const alt = 'Automatizaciones para agencias de marketing — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return createOgImage({
    title: 'Automatiza tu agencia de marketing',
    subtitle: 'Captación, reporting y gestión de campañas',
    accent: '#8b5cf6',
  })
}
