import SectorSelector from '@/pages/SectorSelector'
import { buildRootMetadata } from '@/lib/metadata'

export const metadata = buildRootMetadata()

export default function Page() {
  return <SectorSelector />
}
