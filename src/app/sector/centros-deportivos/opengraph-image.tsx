import { createOgImage } from '@/lib/og-image'

export const alt = 'Automatizaciones para centros deportivos — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return createOgImage({
    title: 'Automatiza tu centro deportivo',
    subtitle: 'Reservas, bajas, comunicaciones y ventas',
    accent: '#ef4444',
  })
}
