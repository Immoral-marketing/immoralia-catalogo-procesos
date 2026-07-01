import AcademiasLanding from '@/pages/AcademiasLanding'
import JsonLd from '@/components/JsonLd'
import { breadcrumbList, SECTOR_NAMES, BASE_URL } from '@/lib/schema-org'

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbList([
        { name: 'Inicio', url: `${BASE_URL}/` },
        { name: SECTOR_NAMES.academias, url: `${BASE_URL}/sector/academias` },
      ])} />
      <AcademiasLanding />
    </>
  )
}
