import { createOgImage } from '@/lib/og-image'

export const alt = 'Auditoría de automatización para centros deportivos — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return createOgImage({
    title: 'Auditoría gratuita para centros deportivos',
    subtitle: 'Diagnóstico personalizado de automatización en minutos',
    accent: '#ef4444',
  })
}
