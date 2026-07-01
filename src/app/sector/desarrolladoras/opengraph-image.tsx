import { createOgImage } from '@/lib/og-image'

export const alt = 'Automatizaciones para desarrolladoras — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return createOgImage({
    title: 'Automatiza tu desarrolladora',
    subtitle: 'Captación, leads y documentación sin tareas manuales',
    accent: '#10b981',
  })
}
