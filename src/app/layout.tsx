import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import JsonLd from '@/components/JsonLd'
import { ORGANIZATION, WEBSITE } from '@/lib/schema-org'

// Evita prerender estático en build: el catálogo usa localStorage, contextos de cliente y Supabase.
// SPEC-06 implementará el cliente SSR correcto con @supabase/ssr.
export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Immoralia - Catálogo de Procesos',
  description: 'Explora el catálogo de procesos automatizables de Immoralia. Elige qué áreas de tu negocio quieres optimizar y recibe una propuesta personalizada.',
  openGraph: {
    title: 'Immoralia - Catálogo de Procesos',
    description: 'Explora el catálogo de procesos automatizables de Immoralia',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Immoralia - Catálogo de Procesos',
  },
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <JsonLd data={[ORGANIZATION, WEBSITE]} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
