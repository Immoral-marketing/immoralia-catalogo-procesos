import AuditoriaSalud from '@/pages/AuditoriaSalud'
import { buildAuditMetadata } from '@/lib/metadata'

export const metadata = buildAuditMetadata('salud')

export default function Page() {
  return <AuditoriaSalud />
}
