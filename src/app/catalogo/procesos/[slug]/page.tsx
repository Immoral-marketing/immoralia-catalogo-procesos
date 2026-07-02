import type { Metadata } from 'next'
import { Suspense } from 'react'
import ProcessDetail from '@/pages/ProcessDetail'
import JsonLd from '@/components/JsonLd'
import { breadcrumbList, serviceSchema, faqPageSchema, howToSchema, SECTOR_NAMES, BASE_URL } from '@/lib/schema-org'
import { buildProcessMetadata } from '@/lib/metadata'
import { processes } from '@/data/processes'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const proc = processes.find(p => p.slug === slug && !p.hidden)
  if (!proc) return { title: 'Proceso | Immoralia' }
  return buildProcessMetadata(proc)
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const proc = processes.find(p => p.slug === slug && !p.hidden)

  const sectorSlug = proc?.landing_slug
  const sectorName = sectorSlug ? SECTOR_NAMES[sectorSlug] : null

  const crumbs = proc
    ? breadcrumbList([
        { name: 'Inicio', url: `${BASE_URL}/` },
        sectorSlug && sectorName
          ? { name: sectorName, url: `${BASE_URL}/sector/${sectorSlug}` }
          : { name: 'Catálogo', url: `${BASE_URL}/catalogo/completo` },
        { name: proc.nombre, url: `${BASE_URL}/catalogo/procesos/${proc.slug}` },
      ])
    : null

  const service = proc ? serviceSchema(proc) : null
  const faqPage = proc?.faqs_citables && proc.faqs_citables.length >= 2
    ? faqPageSchema(proc.faqs_citables)
    : null
  const howTo = proc?.how_it_works_steps && proc.how_it_works_steps.length >= 2
    ? howToSchema(proc)
    : null

  return (
    <>
      {crumbs && <JsonLd data={crumbs} />}
      {service && <JsonLd data={service} />}
      {faqPage && <JsonLd data={faqPage} />}
      {howTo && <JsonLd data={howTo} />}
      <Suspense>
        <ProcessDetail />
      </Suspense>
    </>
  )
}
