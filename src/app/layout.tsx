import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'
import JsonLd from '@/components/JsonLd'
import { ORGANIZATION, WEBSITE, BASE_URL } from '@/lib/schema-org'

// Evita prerender estático en build: el catálogo usa localStorage, contextos de cliente y Supabase.
// SPEC-06 implementará el cliente SSR correcto con @supabase/ssr.
export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Automatiza los procesos de tu negocio | Immoralia',
    template: '%s',
  },
  description: 'Explora más de 150 automatizaciones para pymes españolas. Selecciona los procesos que necesitas y recibe una propuesta personalizada. Cero código, resultados en semanas.',
  openGraph: {
    type: 'website',
    siteName: 'Immoralia',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
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
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
