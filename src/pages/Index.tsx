import { useState, useEffect, useMemo } from "react";
import { processes, categories, Process } from "@/data/processes";
import { Link } from "react-router-dom";
import { ProcessCard } from "@/components/ProcessCard";
import { SelectionSummary } from "@/components/SelectionSummary";
import { ContactForm } from "@/components/ContactForm";
import { OnboardingModal } from "@/components/OnboardingModal";
import { CalendlyLeadModal } from "@/components/CalendlyLeadModal";
import { ShareSelectionModal } from "@/components/ShareSelectionModal";
import { Button } from "@/components/ui/button";
import { Filter, Sparkles, Settings2, RotateCcw, HelpCircle, LayoutGrid, CreditCard, Calendar, Building2, MessageSquare, Search } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { isOnboardingCompleted, getOnboardingAnswers, resetOnboarding, OnboardingAnswers } from "@/lib/onboarding-utils";
import { useSelection } from "@/lib/SelectionContext";
import { GuidanceMessage } from "@/components/GuidanceMessage";
import immoraliaLogo from "@/assets/immoralia_logo.png";
import { StepIndicator } from "@/components/StepIndicator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const categoryIconMap = {
  "Facturación y Finanzas": CreditCard,
  "Horarios y Proyectos": Calendar,
  "Gestión Interna": Building2,
  "Atención y Ventas": MessageSquare,
  "Auditoría tecnológica": Search,
};

const Index = () => {
  const { selectedProcessIds, toggleProcess, clearSelection, n8nHosting, setN8nHosting } = useSelection();

  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers | null>(null);

  useEffect(() => {
    const answers = getOnboardingAnswers();
    if (answers) {
      setOnboardingAnswers(answers);
    }
  }, []);

  const handleOnboardingOpen = () => setOnboardingOpen(true);
  const handleOnboardingClose = () => {
    setOnboardingOpen(false);
    setOnboardingAnswers(getOnboardingAnswers());
  };

  const [contactSource, setContactSource] = useState<'web' | 'chatbot'>('web');
  const [chatbotContext, setChatbotContext] = useState<string[]>([]);

  useEffect(() => {
    document.title = "Immoralia - Catálogo de Procesos";
    const handleShowContact = (e: CustomEvent) => {
      if (e.detail?.source === 'chatbot') {
        setContactSource('chatbot');
        setChatbotContext(e.detail.messages || []);
      } else {
        setContactSource('web');
        setChatbotContext([]);
      }
      setShowContactForm(true);
    };

    window.addEventListener('immoralia:show-contact', handleShowContact);
    return () => window.removeEventListener('immoralia:show-contact', handleShowContact);
  }, []);

  const handleReset = () => {
    if (confirm("¿Estás seguro de que quieres restablecer todas tus respuestas y selección?")) {
      resetOnboarding();
      clearSelection();
      setOnboardingAnswers(null);
      setOnboardingOpen(true);
    }
  };


  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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
    if (selectedCategory && process.categoriaNombre !== selectedCategory) return false;
    return true;
  });

  const selectedProcesses = processes.filter(p => selectedProcessIds.has(p.id));

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-cyan-500/30 font-sans">

      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <header className="border-b border-white/5 bg-black/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 py-6">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col pl-2">
              <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                <img src={immoraliaLogo} alt="Immoralia" className="h-8 md:h-10" />
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {onboardingAnswers ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setOnboardingOpen(true)} className="gap-2 border-white/10 text-white/80 hover:text-white hover:bg-white/5">
                    <Settings2 className="w-4 h-4" /> Editar respuestas
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-white/40 hover:text-red-400 hover:bg-transparent">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button onClick={() => setOnboardingOpen(true)} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20">
                    <Sparkles className="w-4 h-4" /> Personalizar catálogo
                  </Button>
                </div>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button className={`relative h-10 px-4 gap-2 border transition-all ${
                    selectedProcessIds.size > 0
                      ? "bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-600 shadow-[0_0_20px_rgba(8,145,178,0.2)]"
                      : "bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">Mi Selección</span>
                    {selectedProcessIds.size > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-white text-cyan-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {selectedProcessIds.size}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#0d0d0d] border-white/5 w-full sm:max-w-md p-0 overflow-hidden text-white">
                  <div className="h-full flex flex-col p-6 overflow-hidden">
                    <SheetHeader className="mb-2 text-left">
                      <SheetTitle className="text-white text-2xl font-bold flex items-center gap-2">
                        <LayoutGrid className="w-6 h-6 text-cyan-400" />
                        Mi Selección
                      </SheetTitle>
                    </SheetHeader>
                    <SelectionSummary
                      variant="drawer"
                      onContact={() => setShowContactForm(true)}
                      onShare={() => setShowShareModal(true)}
                      n8nHosting={n8nHosting}
                      onHostingChange={setN8nHosting}
                      className="flex-1 overflow-hidden"
                      accentColor="#0891b2"
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <StepIndicator currentStep={2} />

      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
        <div className="max-w-[1440px] mx-auto">

          {/* Page header */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Catálogo completo</p>
              <h1 className="text-2xl font-bold tracking-tight text-white">{processes.length} automatizaciones listas para tu negocio</h1>
              <p className="text-sm text-gray-400 mt-1">Selecciona los procesos que necesitas y recibe una propuesta a medida.</p>
            </div>
            {!onboardingAnswers && (
              <Button
                onClick={handleOnboardingOpen}
                variant="outline"
                className="gap-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/5 hover:border-cyan-500/50 shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                ¿No sabes por dónde empezar?
              </Button>
            )}
          </div>

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
                    isSpecialized={true}
                  />
                ))}
              </div>
            </section>
          )}

          <div className="grid lg:grid-cols-[240px,1fr] gap-6 pb-24 lg:pb-8">
            <aside className="space-y-4">
              <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl p-4 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-semibold text-white">Filtros</h3>
                </div>

                <div className="space-y-[8px] mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-1">
                    Categoría
                  </p>
                  <button
                    className={`w-full flex items-center gap-[11px] h-[42px] px-4 rounded-lg text-[14px] font-medium transition-all duration-200 ${selectedCategory === null ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    <LayoutGrid className="w-4 h-4 shrink-0" />
                    <span>Todas</span>
                  </button>
                  {categories.map(cat => {
                    const isActive = selectedCategory === cat.id;
                    const CategoryIcon = categoryIconMap[cat.id as keyof typeof categoryIconMap];
                    return (
                      <button
                        key={cat.id}
                        className={`w-full flex items-center gap-[11px] h-[42px] px-4 rounded-lg text-[14px] font-medium transition-all duration-200 text-left ${isActive ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                      >
                        {CategoryIcon ? <CategoryIcon className="w-4 h-4 shrink-0" /> : <div className="w-4 h-4 shrink-0" />}
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}

                  <div className="pt-2 border-t border-white/5 mt-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="w-full flex items-center gap-[11px] h-[42px] px-4 rounded-lg text-[14px] font-bold text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200"
                          onClick={() => setShowCalendlyModal(true)}
                        >
                          <HelpCircle className="w-5 h-5 shrink-0" />
                          <span className="truncate">Agendar llamada</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={10} className="max-w-[280px] p-4">
                        <p className="text-sm leading-relaxed">
                          Agenda una llamada de 15–30 min y cuéntanos tu caso. Si encaja, te propondremos una auditoría para definir el alcance y automatizarlo.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </aside>

            <main>
              {/* Guidance Message for Main Catalog View */}
              {!onboardingOpen && isOnboardingCompleted() && (
                <GuidanceMessage 
                  id="catalogo_principal"
                  className="mb-6"
                  message={
                    <span>
                      <strong>Explora el catálogo</strong> y añade los procesos que te interesen a tu selección. Cuando termines, podrás compartirla o solicitar una oferta.
                    </span>
                  }
                />
              )}

              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredProcesses.length} proceso{filteredProcesses.length !== 1 ? "s" : ""}{" "}
                  disponible{filteredProcesses.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProcesses.map(process => {
                  const isSpecialized = recommendedProcesses.some(rp => rp.id === process.id);
                  return (
                    <ProcessCard
                      key={process.id}
                      process={process}
                      isSpecialized={isSpecialized}
                    />
                  );
                })}

                {/* Can't find your process? */}
                <div className="bg-transparent border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-cyan-500/30 transition-colors group cursor-pointer" onClick={() => setShowCalendlyModal(true)}>
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="space-y-2 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-white">¿No encuentras tu proceso?</h3>
                    <p className="text-gray-400 text-sm max-w-[200px] mx-auto">
                      Cuéntanos tu caso y agendamos una llamada de 15-30 min para ayudarte.
                    </p>
                  </div>
                  <Button variant="outline" className="mt-2 border-cyan-500/30 text-cyan-400 group-hover:border-cyan-500 group-hover:bg-cyan-500/5">
                    Cuéntanos tu caso
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

          </div>
        </div>
      </div>

      {/* Mobile Sticky Selection Bar */}
      {selectedProcesses.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-4 animate-in slide-in-from-bottom-full duration-300">
          <div className="bg-black/80 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tu selección</span>
              <span className="text-lg font-bold text-cyan-400">{selectedProcesses.length} procesos</span>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button
                onClick={() => setShowContactForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 shadow-lg shadow-primary/20 w-full"
              >
                Solicitar Oferta
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowShareModal(true)}
                className="border-white/10 text-white/70 hover:bg-white/5 hover:text-white w-full h-8 px-4 py-1 text-xs"
              >
                Compartir
              </Button>
            </div>
          </div>
        </div>
      )}

      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={handleOnboardingClose}
        initialAnswers={onboardingAnswers}
      />


      <ContactForm
        isOpen={showContactForm}
        onClose={() => {
          setShowContactForm(false);
          setContactSource('web');
          setChatbotContext([]);
        }}
        selectedProcesses={selectedProcesses}
        n8nHosting={n8nHosting}
        source={contactSource}
        chatbotContext={chatbotContext}
        onOpenOnboarding={() => {
          setShowContactForm(false);
          setOnboardingOpen(true);
        }}
      />

      <CalendlyLeadModal
        isOpen={showCalendlyModal}
        onClose={() => setShowCalendlyModal(false)}
        activeCategory={selectedCategory}
        selectedProcessIds={Array.from(selectedProcessIds)}
      />

      <ShareSelectionModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        selectedProcesses={selectedProcesses}
      />
    </div >
  );
};

export default Index;
