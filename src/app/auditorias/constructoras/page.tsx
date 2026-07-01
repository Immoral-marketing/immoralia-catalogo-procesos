import AuditoriaConstructoras from '@/pages/AuditoriaConstructoras'
import { buildAuditMetadata } from '@/lib/metadata'

export const metadata = buildAuditMetadata('constructoras')

export default function Page() {
  return <AuditoriaConstructoras />
}
