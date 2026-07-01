import type { Metadata } from 'next'
import AuditoriasIndex from '@/pages/AuditoriasIndex'
import { BASE_URL } from '@/lib/schema-org'

const _title = 'Auditorías de automatización gratuitas | Immoralia'
const _description = 'Evalúa el nivel de automatización de tu negocio con nuestras auditorías gratuitas por sector. Diagnóstico personalizado en minutos, sin compromiso.'

export const metadata: Metadata = {
  title: _title,
  description: _description,
  alternates: { canonical: `${BASE_URL}/auditorias` },
  openGraph: {
    type: 'website',
    siteName: 'Immoralia',
    locale: 'es_ES',
    title: _title,
    description: _description,
    url: `${BASE_URL}/auditorias`,
    images: [{ url: `${BASE_URL}/auditorias/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: _title,
    description: _description,
    images: [`${BASE_URL}/auditorias/opengraph-image`],
  },
}

export default function Page() {
  return <AuditoriasIndex />
}
