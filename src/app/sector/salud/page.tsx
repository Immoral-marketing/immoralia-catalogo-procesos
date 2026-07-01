import SaludLanding from '@/pages/SaludLanding'
import JsonLd from '@/components/JsonLd'
import { breadcrumbList, SECTOR_NAMES, BASE_URL } from '@/lib/schema-org'
import { buildSectorMetadata } from '@/lib/metadata'

export const metadata = buildSectorMetadata('salud')

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbList([
        { name: 'Inicio', url: `${BASE_URL}/` },
        { name: SECTOR_NAMES.salud, url: `${BASE_URL}/sector/salud` },
      ])} />
      <SaludLanding />
    </>
  )
}
