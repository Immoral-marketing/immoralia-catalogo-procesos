import AuditoriaIndustrial from '@/pages/AuditoriaIndustrial'
import { buildAuditMetadata } from '@/lib/metadata'

export const metadata = buildAuditMetadata('industrial')

export default function Page() {
  return <AuditoriaIndustrial />
}
