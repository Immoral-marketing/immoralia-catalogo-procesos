import { createOgImage } from '@/lib/og-image'

export const alt = 'Automatizaciones para industrial — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return createOgImage({
    title: 'Automatiza tu empresa industrial',
    subtitle: 'Mantenimiento, proveedores y producción sin trabajo manual',
    accent: '#6b7280',
  })
}
