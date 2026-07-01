import { createOgImage } from '@/lib/og-image'

export const alt = 'Auditoría de automatización para gestorías — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return createOgImage({
    title: 'Auditoría gratuita para gestorías',
    subtitle: 'Descubre dónde pierdes tiempo con tareas manuales',
    accent: '#22c55e',
  })
}
