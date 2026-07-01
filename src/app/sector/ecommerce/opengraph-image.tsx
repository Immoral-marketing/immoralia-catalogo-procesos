import { createOgImage } from '@/lib/og-image'

export const alt = 'Automatizaciones para e-commerce — Immoralia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return createOgImage({
    title: 'Automatiza tu e-commerce',
    subtitle: 'Atención al cliente, pedidos y reactivación de ventas',
    accent: '#06b6d4',
  })
}
