import SportsLanding from '@/pages/SportsLanding'
import JsonLd from '@/components/JsonLd'
import { breadcrumbList, SECTOR_NAMES, BASE_URL } from '@/lib/schema-org'
import { buildSectorMetadata } from '@/lib/metadata'

export const metadata = buildSectorMetadata('centros-deportivos')

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbList([
        { name: 'Inicio', url: `${BASE_URL}/` },
        { name: SECTOR_NAMES['centros-deportivos'], url: `${BASE_URL}/sector/centros-deportivos` },
      ])} />
      <SportsLanding />
    </>
  )
}
