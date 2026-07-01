import { createOgImage } from '@/lib/og-image'

export const alt = 'Automatizaciones para academias — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return createOgImage({
    title: 'Automatiza tu academia',
    subtitle: 'Matrículas, alumnos y seguimiento académico',
    accent: '#c026d3',
  })
}
