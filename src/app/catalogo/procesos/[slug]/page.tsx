import { Suspense } from 'react'
import ProcessDetail from '@/pages/ProcessDetail'
import JsonLd from '@/components/JsonLd'
import { breadcrumbList, serviceSchema, SECTOR_NAMES, BASE_URL } from '@/lib/schema-org'
import { processes } from '@/data/processes'

// ProcessDetail uses useParams() + useSearchParams() — needs Suspense
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

  return (
    <>
      {crumbs && <JsonLd data={crumbs} />}
      {service && <JsonLd data={service} />}
      <Suspense>
        <ProcessDetail />
      </Suspense>
    </>
  )
}
