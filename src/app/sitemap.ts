import type { MetadataRoute } from 'next'
import { processes } from '@/data/processes'

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://procesos.immoralia.es').replace(/\/$/, '')

// Slugs confirmados en src/app/sector/ — NO incluir aliases de redirect
// (restauracion → gastronomia-hosteleria, inmobiliaria → construccion)
const SECTOR_SLUGS = [
  'salud',
  'gestorias',
  'centros-deportivos',
  'construccion',
  'desarrolladoras',
  'gastronomia-hosteleria',
  'academias',
  'agencias',
  'ecommerce',
  'industrial',
]

// Slugs confirmados en src/app/auditorias/
const AUDITORIA_SLUGS = [
  'salud',
  'gestorias',
  'deportivos',
  'constructoras',
  'restaurantes',
  'academias',
  'industrial',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const processUrls: MetadataRoute.Sitemap = processes
    .filter(p => !p.hidden)
    .map(p => ({
      url: `${BASE}/catalogo/procesos/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  return [
    {
      url: `${BASE}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    ...SECTOR_SLUGS.map(slug => ({
      url: `${BASE}/sector/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    {
      url: `${BASE}/catalogo/completo`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...processUrls,
    {
      url: `${BASE}/auditorias`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    ...AUDITORIA_SLUGS.map(slug => ({
      url: `${BASE}/auditorias/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    {
      url: `${BASE}/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]
}
