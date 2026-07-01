import AuditoriaRestaurantes from '@/pages/AuditoriaRestaurantes'
import { buildAuditMetadata } from '@/lib/metadata'

export const metadata = buildAuditMetadata('restaurantes')

export default function Page() {
  return <AuditoriaRestaurantes />
}
