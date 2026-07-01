import type { Metadata } from 'next'
import ProcessDetailFacturasVencidas from '@/pages/ProcessDetailFacturasVencidas'
import JsonLd from '@/components/JsonLd'
import { breadcrumbList, serviceSchema, BASE_URL } from '@/lib/schema-org'
import { buildProcessMetadata } from '@/lib/metadata'
import { processes } from '@/data/processes'

const SLUG = 'informe-semanal-facturas-vencidas'
const _proc = processes.find(p => p.slug === SLUG)
export const metadata: Metadata = _proc
  ? buildProcessMetadata(_proc)
  : { title: 'Informe semanal de facturas vencidas | Immoralia' }

export default function Page() {
  const proc = processes.find(p => p.slug === SLUG)
  const crumbs = proc
    ? breadcrumbList([
        { name: 'Inicio', url: `${BASE_URL}/` },
        { name: 'Catálogo', url: `${BASE_URL}/catalogo/completo` },
        { name: proc.nombre, url: `${BASE_URL}/catalogo/procesos/${SLUG}` },
      ])
    : null
  const service = proc ? serviceSchema(proc) : null

  return (
    <>
      {crumbs && <JsonLd data={crumbs} />}
      {service && <JsonLd data={service} />}
      <ProcessDetailFacturasVencidas />
    </>
  )
}
