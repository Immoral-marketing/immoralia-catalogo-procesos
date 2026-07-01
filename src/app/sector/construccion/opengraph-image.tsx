import { createOgImage } from '@/lib/og-image'

export const alt = 'Automatizaciones para construcción — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return createOgImage({
    title: 'Automatiza tu empresa constructora',
    subtitle: 'Presupuestos, obra y proveedores sin trabajo manual',
    accent: '#22c55e',
  })
}
