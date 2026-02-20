import { useState, useEffect, useMemo } from "react";
import { processes, categories, Process } from "@/data/processes";
import { ProcessCard } from "@/components/ProcessCard";
import { ProcessDetailModal } from "@/components/ProcessDetailModal";
import { SelectionSummary } from "@/components/SelectionSummary";
import { ContactForm } from "@/components/ContactForm";
import { OnboardingModal } from "@/components/OnboardingModal";
import { CalendlyLeadModal } from "@/components/CalendlyLeadModal";
import { Button } from "@/components/ui/button";
import { Filter, Sparkles, Settings2, RotateCcw } from "lucide-react";
import { isOnboardingCompleted, getOnboardingAnswers, resetOnboarding, OnboardingAnswers } from "@/lib/onboarding-utils";
import immoraliaLogo from "@/assets/immoralia_logo.png";

const Index = () => {
  const [selectedProcessIds, setSelectedProcessIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("immoralia_selected_processes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validIds = parsed.filter((id) => processes.some((p) => p.id === id));
          return new Set(validIds);
        }
      }
    } catch (error) {
      console.error("Error recuperando selección:", error);
    }
    return new Set();
  });

  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers | null>(null);

  useEffect(() => {
    const answers = getOnboardingAnswers();
    if (!answers) {
      setOnboardingOpen(true);
    } else {
      setOnboardingAnswers(answers);
    }
  }, []);

  const handleOnboardingClose = () => {
    setOnboardingOpen(false);
    setOnboardingAnswers(getOnboardingAnswers());
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de que quieres restablecer todas tus respuestas y selección?")) {
      resetOnboarding();
      setSelectedProcessIds(new Set());
      setOnboardingAnswers(null);
      setOnboardingOpen(true);
    }
  };

  useEffect(() => {
    localStorage.setItem(
      "immoralia_selected_processes",
      JSON.stringify(Array.from(selectedProcessIds))
    );
  }, [selectedProcessIds]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [detailProcess, setDetailProcess] = useState<Process | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);

  const [n8nHosting, setN8nHosting] = useState<'setup' | 'own'>('setup');

  const toggleProcess = (id: string) => {
    const newSet = new Set(selectedProcessIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedProcessIds(newSet);
  };

  const recommendedProcesses = useMemo(() => {
    if (!onboardingAnswers) return [];

    return processes
      .filter(p => {
        // Scoring logic
        let score = 0;
        const sector = onboardingAnswers.sector;
        const tools = Array.isArray(onboardingAnswers.tools) ? onboardingAnswers.tools : [];
        const pains = Array.isArray(onboardingAnswers.pains) ? onboardingAnswers.pains : [];
        const channelsClients = onboardingAnswers.channels?.clients || [];
        const channelsInternal = onboardingAnswers.channels?.internal || [];

        if (sector && p.sectores?.includes(sector)) score += 5;
        if (tools.length > 0 && p.herramientas?.some(h => tools.includes(h))) score += 3;
        if (pains.length > 0 && p.dolores?.some(d => pains.includes(d))) score += 4;

        // Channel matching
        if (channelsClients.length > 0 && p.canales?.some(c => channelsClients.includes(c))) score += 2;
        if (channelsInternal.length > 0 && p.canales?.some(c => channelsInternal.includes(c))) score += 2;

        return score >= 5;
      })
      .slice(0, 4);
  }, [onboardingAnswers]);

  const filteredProcesses = processes.filter(process => {
    if (selectedCategory && process.categoria !== selectedCategory) return false;
    return true;
  });

  const selectedProcesses = processes.filter(p => selectedProcessIds.has(p.id));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <img src={immoraliaLogo} alt="Immoralia" className="h-8 md:h-10" />
              </div>
              <p className="text-muted-foreground mt-2">Elige los procesos que quieres automatizar</p>
            </div>

            {onboardingAnswers ? (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setOnboardingOpen(true)} className="gap-2">
                  <Settings2 className="w-4 h-4" /> Editar respuestas
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-destructive">
                  <RotateCcw className="w-4 h-4" /> Restablecer
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setOnboardingOpen(true)} className="gap-2 border-primary/50 text-primary hover:bg-primary/5">
                  <Sparkles className="w-4 h-4" /> Personalizar catálogo
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Onboarding Summary / Recommendations */}
          {recommendedProcesses.length > 0 && (
            <section className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Recomendados para ti</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {recommendedProcesses.map(process => (
                  <ProcessCard
                    key={`rec-${process.id}`}
                    process={process}
                    isSelected={selectedProcessIds.has(process.id)}
                    onSelect={() => toggleProcess(process.id)}
                    onViewDetails={() => setDetailProcess(process)}
                    isSpecialized={true}
                  />
                ))}
              </div>
            </section>
          )}

          <div className="grid lg:grid-cols-[240px,1fr,320px] gap-6 pb-24 lg:pb-8">
            <aside className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-secondary" />
                  <h3 className="font-semibold text-foreground">Filtros</h3>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Categoría
                  </p>
                  <Button variant={selectedCategory === null ? "default" : "ghost"} size="sm" className="w-full justify-start" onClick={() => setSelectedCategory(null)}>
                    Todas
                  </Button>
                  {categories.map(cat => (
                    <Button key={cat.id} variant={selectedCategory === cat.id ? "default" : "ghost"} size="sm" className="w-full justify-start text-left" onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}>
                      <span className="text-base mr-[8px] flex items-center">{cat.emoji}</span>
                      <span className="truncate">{cat.name}</span>
                    </Button>
                  ))}
                </div>

                {onboardingAnswers ? (
                  <div className="md:hidden pt-4 border-t border-border flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => setOnboardingOpen(true)} className="w-full justify-start gap-2">
                      <Settings2 className="w-4 h-4" /> Editar respuestas
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleReset} className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive">
                      <RotateCcw className="w-4 h-4" /> Restablecer
                    </Button>
                  </div>
                ) : (
                  <div className="md:hidden pt-4 border-t border-border flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => setOnboardingOpen(true)} className="w-full justify-start gap-2 border-primary/50 text-primary">
                      <Sparkles className="w-4 h-4" /> Personalizar catálogo
                    </Button>
                  </div>
                )}
              </div>
            </aside>

            <main>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredProcesses.length} proceso{filteredProcesses.length !== 1 ? "s" : ""}{" "}
                  disponible{filteredProcesses.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {filteredProcesses.map(process => {
                  const isSpecialized = recommendedProcesses.some(rp => rp.id === process.id);
                  return (
                    <ProcessCard
                      key={process.id}
                      process={process}
                      isSelected={selectedProcessIds.has(process.id)}
                      onSelect={() => toggleProcess(process.id)}
                      onViewDetails={() => setDetailProcess(process)}
                      isSpecialized={isSpecialized}
                    />
                  );
                })}

                {/* Optional: Add "Can't find your process?" card at the end of the grid */}
                <div className="bg-card/30 border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-primary/50 transition-colors group cursor-pointer" onClick={() => setShowCalendlyModal(true)}>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">¿No encuentras tu proceso?</h3>
                    <p className="text-muted-foreground text-sm max-w-[200px]">
                      Cuéntanos tu caso y agendamos una llamada de 15-30 min para ayudarte.
                    </p>
                  </div>
                  <Button variant="outline" className="mt-2 border-primary/30 group-hover:border-primary group-hover:bg-primary/5">
                    Contar mi caso
                  </Button>
                </div>
              </div>

              {filteredProcesses.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No hay procesos que coincidan con los filtros seleccionados
                  </p>
                </div>
              )}
            </main>

            <aside className="hidden lg:block">
              <SelectionSummary
                selectedProcesses={selectedProcesses}
                onRemove={id => toggleProcess(id)}
                onContact={() => setShowContactForm(true)}
                onOpenCalendly={() => setShowCalendlyModal(true)}
                n8nHosting={n8nHosting}
                onHostingChange={setN8nHosting}
              />
            </aside>
          </div>
        </div>
      </div>

      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={handleOnboardingClose}
        initialAnswers={onboardingAnswers}
      />

      <ProcessDetailModal
        process={detailProcess}
        isOpen={!!detailProcess}
        onClose={() => setDetailProcess(null)}
        isSelected={detailProcess ? selectedProcessIds.has(detailProcess.id) : false}
        onToggleSelect={() => {
          if (detailProcess) toggleProcess(detailProcess.id);
        }}
        isSpecialized={detailProcess ? recommendedProcesses.some(rp => rp.id === detailProcess.id) : false}
      />

      <ContactForm
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
        selectedProcesses={selectedProcesses}
        n8nHosting={n8nHosting}
      />

      <CalendlyLeadModal
        isOpen={showCalendlyModal}
        onClose={() => setShowCalendlyModal(false)}
        activeCategory={selectedCategory}
        selectedProcessIds={Array.from(selectedProcessIds)}
      />
    </div>
  );
};

export default Index;
