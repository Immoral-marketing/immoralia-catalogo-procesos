import AuditoriaAcademias from '@/pages/AuditoriaAcademias'
import { buildAuditMetadata } from '@/lib/metadata'

export const metadata = buildAuditMetadata('academias')

export default function Page() {
  return <AuditoriaAcademias />
}
