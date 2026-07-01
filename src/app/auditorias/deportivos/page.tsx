import AuditoriaDeportivos from '@/pages/AuditoriaDeportivos'
import { buildAuditMetadata } from '@/lib/metadata'

export const metadata = buildAuditMetadata('deportivos')

export default function Page() {
  return <AuditoriaDeportivos />
}
