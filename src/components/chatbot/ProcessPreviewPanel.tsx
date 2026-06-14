'use client'
/**
 * SPEC-02 (iteración owner) — Panel lateral de consulta de proceso.
 * Muestra la vista REAL del proceso (/catalogo/procesos/<slug>) embebida
 * en el lateral derecho, sin abandonar la conversación.
 */
import React, { useState } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { processes } from '@/data/processes'

interface ProcessPreviewPanelProps {
  slug: string | null
  onClose: () => void
}

const ProcessPreviewPanel: React.FC<ProcessPreviewPanelProps> = ({ slug, onClose }) => {
  const [loaded, setLoaded] = useState(false)
  const process = slug ? processes.find(p => p.slug === slug) : null

  return (
    <Sheet open={!!slug} onOpenChange={open => { if (!open) { setLoaded(false); onClose() } }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[640px] p-0 bg-[#0d0d0d] border-white/10 flex flex-col gap-0 [&>button]:z-20"
      >
        <SheetHeader className="px-4 py-3 border-b border-white/10 shrink-0 text-left">
          <div className="flex items-center justify-between gap-3 pr-8">
            <SheetTitle className="text-sm font-semibold text-white truncate">
              {process?.nombre ?? 'Proceso'}
            </SheetTitle>
            {slug && (
              <a
                href={`/catalogo/procesos/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Abrir página
              </a>
            )}
          </div>
        </SheetHeader>

        <div className="relative flex-1 min-h-0">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          )}
          {slug && (
            <iframe
              src={`/catalogo/procesos/${slug}`}
              title={process?.nombre ?? 'Vista del proceso'}
              className="w-full h-full border-0"
              onLoad={() => setLoaded(true)}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ProcessPreviewPanel
