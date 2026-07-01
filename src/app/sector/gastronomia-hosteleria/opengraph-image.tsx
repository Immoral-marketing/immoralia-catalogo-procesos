import { createOgImage } from '@/lib/og-image'

export const alt = 'Automatizaciones para gastronomía y hostelería — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return createOgImage({
    title: 'Automatiza tu restaurante u hotel',
    subtitle: 'Reservas, atención al cliente y operaciones del día a día',
    accent: '#ea580c',
  })
}
