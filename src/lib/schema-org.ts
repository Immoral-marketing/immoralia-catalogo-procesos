export const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://procesos.immoralia.es').replace(/\/$/, '')

export const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Immoralia',
  url: BASE_URL,
  logo: `${BASE_URL}/immoralia_logo.png`,
  description: 'Catálogo de automatizaciones de procesos empresariales para pymes españolas',
  foundingDate: '2020-10-05',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Passeig de Gràcia, Nº12',
    addressLocality: 'Barcelona',
    addressRegion: 'Barcelona',
    postalCode: '08007',
    addressCountry: 'ES',
  },
  parentOrganization: {
    '@type': 'Organization',
    name: 'Immoral Group',
    sameAs: [
      'https://es.linkedin.com/company/immoral-group',
      'https://www.instagram.com/immoral.group/',
    ],
  },
}

export const WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Immoralia',
  url: BASE_URL,
  inLanguage: 'es',
}

export const SECTOR_NAMES: Record<string, string> = {
  salud: 'Centros de salud',
  gestorias: 'Gestorías',
  'centros-deportivos': 'Centros deportivos',
  construccion: 'Construcción',
  desarrolladoras: 'Desarrolladoras inmobiliarias',
  'gastronomia-hosteleria': 'Gastronomía y hostelería',
  academias: 'Academias y formación',
  agencias: 'Agencias de marketing',
  ecommerce: 'E-commerce',
  industrial: 'Industrial',
}

export function breadcrumbList(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function serviceSchema(proc: {
  nombre: string
  descripcionDetallada?: string
  tagline?: string
  slug: string
  landing_slug?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: proc.nombre,
    description: proc.descripcionDetallada || proc.tagline || '',
    serviceType: 'Automatización de proceso empresarial',
    provider: { '@id': `${BASE_URL}/#organization` },
    category: proc.landing_slug
      ? (SECTOR_NAMES[proc.landing_slug] ?? 'Catálogo general')
      : 'Catálogo general',
    areaServed: {
      '@type': 'Country',
      name: 'España',
    },
    url: `${BASE_URL}/catalogo/procesos/${proc.slug}`,
  }
}

export function faqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

export function howToSchema(proc: {
  nombre: string
  tagline?: string
  how_it_works_steps: { title: string; short: string; detail?: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: proc.nombre,
    description: proc.tagline ?? '',
    step: proc.how_it_works_steps.map(s => ({
      '@type': 'HowToStep',
      name: s.title,
      text: s.detail ? `${s.short} ${s.detail}` : s.short,
    })),
  }
}
