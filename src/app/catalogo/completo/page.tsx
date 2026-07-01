import Index from '@/pages/Index'
import JsonLd from '@/components/JsonLd'
import { breadcrumbList, BASE_URL } from '@/lib/schema-org'

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbList([
        { name: 'Inicio', url: `${BASE_URL}/` },
        { name: 'Catálogo completo', url: `${BASE_URL}/catalogo/completo` },
      ])} />
      <Index />
    </>
  )
}
