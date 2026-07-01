import IndustrialLanding from '@/pages/IndustrialLanding'
import JsonLd from '@/components/JsonLd'
import { breadcrumbList, SECTOR_NAMES, BASE_URL } from '@/lib/schema-org'
import { buildSectorMetadata } from '@/lib/metadata'

export const metadata = buildSectorMetadata('industrial')

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbList([
        { name: 'Inicio', url: `${BASE_URL}/` },
        { name: SECTOR_NAMES.industrial, url: `${BASE_URL}/sector/industrial` },
      ])} />
      <IndustrialLanding />
    </>
  )
}
