import { useState } from "react";
import { processes, categories, Process } from "@/data/processes";
import { ProcessCard } from "@/components/ProcessCard";
import { ProcessDetailModal } from "@/components/ProcessDetailModal";
import { SelectionSummary } from "@/components/SelectionSummary";
import { ContactForm } from "@/components/ContactForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import immoraliaLogo from "@/assets/immoralia_logo.png";
const Index = () => {
  const [selectedProcessIds, setSelectedProcessIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [detailProcess, setDetailProcess] = useState<Process | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleProcess = (id: string) => {
    const newSet = new Set(selectedProcessIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedProcessIds(newSet);
  };
  const filteredProcesses = processes.filter(process => {
    if (selectedCategory && process.categoria !== selectedCategory) return false;
    return true;
  });
  const selectedProcesses = processes.filter(p => selectedProcessIds.has(p.id));
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <img src={immoraliaLogo} alt="Immoralia" className="h-8 md:h-10" />
            </div>
            <p className="text-muted-foreground mt-2">Elige los procesos que quieres automatizar</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile: Summary Bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Seleccionados</p>
                  <p className="text-lg font-bold text-primary">{selectedProcessIds.size}</p>
                </div>
                {selectedProcessIds.size > 0 && <div>
                    <p className="text-xs text-muted-foreground">Estimado</p>
                    <p className="text-lg font-bold text-foreground">
                      {selectedProcessIds.size <= 15 ? `${selectedProcessIds.size <= 3 ? "4.000" : selectedProcessIds.size <= 5 ? "6.000" : selectedProcessIds.size <= 10 ? "10.000" : "13.000"}€` : "A medida"}
                    </p>
                  </div>}
              </div>
              <Button onClick={() => setShowContactForm(true)} disabled={selectedProcessIds.size === 0} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Ver resumen
              </Button>
            </div>
          </div>

          {/* Desktop: 3-Column Layout */}
          <div className="grid lg:grid-cols-[280px,1fr,360px] gap-6 pb-24 lg:pb-8">
            {/* Left: Filters */}
            <aside className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-secondary" />
                  <h3 className="font-semibold text-foreground">Filtros</h3>
                </div>

                {/* Category Filters */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Categoría
                  </p>
                  <Button variant={selectedCategory === null ? "default" : "ghost"} size="sm" className="w-full justify-start" onClick={() => setSelectedCategory(null)}>
                    Todas
                  </Button>
                  {categories.map(cat => <Button key={cat.id} variant={selectedCategory === cat.id ? "default" : "ghost"} size="sm" className="w-full justify-start text-left" onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}>
                      <span className="text-xs opacity-60 mr-2">{cat.id}.</span>
                      <span className="truncate">{cat.name}</span>
                    </Button>)}
                </div>
              </div>
            </aside>

            {/* Center: Catalog */}
            <main>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredProcesses.length} proceso{filteredProcesses.length !== 1 ? "s" : ""}{" "}
                  disponible{filteredProcesses.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {filteredProcesses.map(process => <ProcessCard key={process.id} process={process} isSelected={selectedProcessIds.has(process.id)} onSelect={() => toggleProcess(process.id)} onViewDetails={() => setDetailProcess(process)} />)}
              </div>

              {filteredProcesses.length === 0 && <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No hay procesos que coincidan con los filtros seleccionados
                  </p>
                </div>}
            </main>

            {/* Right: Selection Summary (Desktop Only) */}
            <aside className="hidden lg:block">
              <SelectionSummary selectedProcesses={selectedProcesses} onRemove={id => toggleProcess(id)} onContact={() => setShowContactForm(true)} />
            </aside>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProcessDetailModal process={detailProcess} isOpen={!!detailProcess} onClose={() => setDetailProcess(null)} isSelected={detailProcess ? selectedProcessIds.has(detailProcess.id) : false} onToggleSelect={() => {
      if (detailProcess) toggleProcess(detailProcess.id);
    }} />

      <ContactForm isOpen={showContactForm} onClose={() => setShowContactForm(false)} selectedProcesses={selectedProcesses} />
    </div>;
};
export default Index;