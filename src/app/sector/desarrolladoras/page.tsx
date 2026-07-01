import ConstruccionLanding from '@/pages/ConstruccionLanding'
import JsonLd from '@/components/JsonLd'
import { breadcrumbList, SECTOR_NAMES, BASE_URL } from '@/lib/schema-org'
import { buildSectorMetadata } from '@/lib/metadata'

export const metadata = buildSectorMetadata('desarrolladoras')

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbList([
        { name: 'Inicio', url: `${BASE_URL}/` },
        { name: SECTOR_NAMES.desarrolladoras, url: `${BASE_URL}/sector/desarrolladoras` },
      ])} />
      <ConstruccionLanding />
    </>
  )
}
