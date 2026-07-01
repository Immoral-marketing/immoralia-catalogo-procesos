import AuditoriaGestorias from '@/pages/AuditoriaGestorias'
import { buildAuditMetadata } from '@/lib/metadata'

export const metadata = buildAuditMetadata('gestorias')

export default function Page() {
  return <AuditoriaGestorias />
}
