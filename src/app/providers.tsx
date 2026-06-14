'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, Suspense } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { SelectionProvider } from '@/lib/SelectionContext'
import { ReferralTracker } from '@/components/ReferralTracker'
import ChatbotBubble from '@/components/chatbot/ChatbotBubble'

export function Providers({ children }: { children: React.ReactNode }) {
  // QueryClient creado por instancia de cliente — nunca a nivel de módulo (SSR safety)
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SelectionProvider>
          {/* ReferralTracker usa useSearchParams() → necesita Suspense */}
          <Suspense>
            <ReferralTracker />
          </Suspense>
          {children}
          <ChatbotBubble />
        </SelectionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
