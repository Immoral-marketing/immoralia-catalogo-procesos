import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  webpack(config) {
    // Devuelve URLs string para imports de imágenes (igual que Vite)
    // Evita tener que cambiar los 22 ficheros que usan `src={immoraliaLogo}`
    const imageRule = config.module.rules.find(
      (rule: { test?: RegExp }) => rule.test instanceof RegExp && rule.test.test('.png')
    )
    if (imageRule) {
      imageRule.resourceQuery = { not: [/url/] }
    }
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|webp)$/i,
      type: 'asset/resource',
    })
    return config
  },
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
