import { createOgImage } from '@/lib/og-image'

export const alt = 'Auditorías de automatización gratuitas — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return createOgImage({
    title: 'Auditorías de automatización gratuitas',
    subtitle: 'Diagnóstico de madurez digital por sector',
    accent: '#0ea5e9',
  })
}
