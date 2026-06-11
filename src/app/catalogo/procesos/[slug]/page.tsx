'use client'
import { Suspense } from 'react'
import ProcessDetail from '@/pages/ProcessDetail'

// ProcessDetail uses useParams() + useSearchParams() from next/navigation — needs Suspense
export default function Page() {
  return (
    <Suspense>
      <ProcessDetail />
    </Suspense>
  )
}
