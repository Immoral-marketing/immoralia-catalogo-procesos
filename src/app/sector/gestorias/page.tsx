import GestoriasLanding from '@/pages/GestoriasLanding'
import JsonLd from '@/components/JsonLd'
import { breadcrumbList, SECTOR_NAMES, BASE_URL } from '@/lib/schema-org'
import { buildSectorMetadata } from '@/lib/metadata'

export const metadata = buildSectorMetadata('gestorias')

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbList([
        { name: 'Inicio', url: `${BASE_URL}/` },
        { name: SECTOR_NAMES.gestorias, url: `${BASE_URL}/sector/gestorias` },
      ])} />
      <GestoriasLanding />
    </>
  )
}
