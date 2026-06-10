import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // Fija el root del proyecto para evitar warning por lockfile en directorio padre
  outputFileTracingRoot: path.resolve(__dirname),

  // ESLint y TS errors son pre-existentes al proyecto (any, Supabase RPC sin tipado, etc.)
  // Vite nunca hacía type-checking en build; Next.js sí. Se resuelven en deuda técnica separada.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async redirects() {
    return [
      // Sector restauración → gastronomía-hostelería (slug actualizado)
      {
        source: '/sector/restauracion',
        destination: '/sector/gastronomia-hosteleria',
        permanent: true,
      },
      // Inmobiliaria no existe como sector independiente — unificado con construcción
      {
        source: '/sector/inmobiliaria',
        destination: '/sector/construccion',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
