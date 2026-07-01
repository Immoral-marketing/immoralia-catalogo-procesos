import { createOgImage } from '@/lib/og-image'

export const alt = 'Automatizaciones para gestorías — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return createOgImage({
    title: 'Automatiza tu gestoría',
    subtitle: 'Procesos diseñados para despachos profesionales',
    accent: '#22c55e',
  })
}
