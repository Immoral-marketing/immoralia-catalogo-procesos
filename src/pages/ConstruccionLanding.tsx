import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { processes } from "@/data/processes";
import { ProcessCard } from "@/components/ProcessCard";
import { SelectionSummary } from "@/components/SelectionSummary";
import { ContactForm } from "@/components/ContactForm";
import { OnboardingModal } from "@/components/OnboardingModal";
import { ShareSelectionModal } from "@/components/ShareSelectionModal";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Users,
  Zap,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  Clock,
  CheckCircle2,
  LayoutGrid,
  List,
  HardHat,
  Calculator,
  FileText,
  Sparkles,
  Search,
  Check
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useSelection } from "@/lib/SelectionContext";
import { isOnboardingCompleted } from "@/lib/onboarding-utils";
import { useNavigate } from "react-router-dom";
import immoraliaLogo from "@/assets/immoralia_logo.png";
import { CalendlyLeadModal } from "@/components/CalendlyLeadModal";

const ACCENT = "#22c55e";

const CONSTRUCCION_LANDING_SLUG = "construccion";

const ConstruccionLanding = () => {
  const navigate = useNavigate();
  const { selectedProcessIds, toggleProcess, n8nHosting, setN8nHosting } = useSelection();
  const [showContactForm, setShowContactForm] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Immoralia - Catálogo de Procesos - Construcción";
    const timer = setTimeout(() => {
      if (!isOnboardingCompleted()) {
        setShowOnboarding(true);
      }
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  // Filtrar procesos para Construcción & Reformas
  const construccionProcesses = useMemo(() => 
    processes.filter(p => !p.hidden && (p.landing_slug === "construccion" || p.sectores?.includes("Construcción & Reformas"))),
    []
  );

  const construccionCategories = useMemo(() => {
    const catsMap = new Map();
    construccionProcesses.forEach(p => {
      if (!catsMap.has(p.categoriaNombre)) {
        catsMap.set(p.categoriaNombre, p.categoriaNombre);
      }
    });
    return Array.from(catsMap.entries()).map(([id, name]) => ({ id, name }));
  }, [construccionProcesses]);

  const [activeCategory, setActiveCategory] = useState("todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const selectedProcesses = useMemo(() => {
    return processes.filter(p => selectedProcessIds.has(p.id));
  }, [selectedProcessIds]);

  const scrollToProcesses = () => {
    const el = document.getElementById("procesos-grid");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-green-500/30 font-sans">
      {/* ───────────────────── NAVIGATION ───────────────────── */}
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/">
            <img src={immoraliaLogo} alt="Immoralia" className="h-8 transition-opacity hover:opacity-80" />
          </Link>
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className={`relative h-10 px-4 gap-2 border transition-all ${
                    selectedProcessIds.size > 0
                      ? "bg-green-600 hover:bg-green-500 text-white border-green-600 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                      : "bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Mi Selección</span>
                  {selectedProcessIds.size > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-white text-green-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {selectedProcessIds.size}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0d0d0d] border-white/5 w-full sm:max-w-md p-0 overflow-hidden text-white">
                <div className="h-full flex flex-col p-6 overflow-hidden">
                  <SheetHeader className="mb-2 text-left">
                    <SheetTitle className="text-white text-2xl font-bold flex items-center gap-2">
                      <LayoutGrid className="w-6 h-6 text-green-400" />
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
                    accentColor="#d97706"
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <StepIndicator currentStep={2} />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/85 to-[#0d0d0d]/40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-900/10 blur-[120px] rounded-full" />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-700">
            De vender sobre plano sin sistema, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              a un proceso que construye solo
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Automatizamos la captación de clientes, los presupuestos y el control de gastos para que tu equipo se centre en construir.
          </p>

          <div className="flex flex-col items-center gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button
              size="lg"
              onClick={() => scrollTo("modulos")}
              className="bg-green-600 hover:bg-green-600 text-white h-14 px-8 text-lg gap-2 font-bold shadow-lg shadow-green-900/30 transition-all hover:scale-[1.02]"
            >
              Empezar el recorrido <ChevronRight className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-5">
              <button
                onClick={() => setShowCalendlyModal(true)}
                className="text-sm text-gray-400 hover:text-green-300 transition-colors underline-offset-4 hover:underline"
              >
                Agendar una llamada
              </button>
              <span className="text-white/15 text-xs">·</span>
              <button
                onClick={() => setShowContactForm(true)}
                className="text-sm text-gray-400 hover:text-green-300 transition-colors underline-offset-4 hover:underline"
              >
                Contáctanos
              </button>
            </div>
          </div>

          {/* Indicador de scroll */}
          <div className="mt-16 flex flex-col items-center gap-2 text-gray-500 animate-bounce">
            <span className="text-[11px] tracking-widest uppercase">Sigue bajando</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* ───────────────────── 6 BLOQUES — FEATURE SHOWCASE ───────────────────── */}
      <section id="modulos" className="py-28 border-t border-white/5 relative overflow-hidden">
        {/* Glow del color del bloque activo */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse at 70% 50%, ${activeBlock.accent}25 0%, transparent 60%)`,
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
              Las áreas donde una constructora{" "}
              <span className="text-green-400">puede vender más, mejor y con menos esfuerzo</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Seis bloques, cada uno con un propósito claro. Pasa por encima de cada uno para ver de qué va.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto items-start">
            {/* Lista vertical de bloques (izquierda) */}
            <div className="lg:col-span-5 space-y-2">
              {construccionBlocks.map((b) => {
                const Icon = b.icon;
                const isActive = b.id === activeShowcaseBlock;
                return (
                  <button
                    key={b.id}
                    onMouseEnter={() => setActiveShowcaseBlock(b.id)}
                    onClick={() => {
                      setActiveShowcaseBlock(b.id);
                      scrollTo(`block-${b.id}`);
                    }}
                    className={`group relative w-full text-left rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isActive
                        ? `${b.accentBorder} bg-gradient-to-r ${b.accentGradient}`
                        : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* Barra lateral animada */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ backgroundColor: b.accent }}
                    />
                    <div className="flex items-center gap-5 p-5 pl-6">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                          isActive ? `${b.accentBg} border ${b.accentBorder}` : "bg-white/5 border border-white/10"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 transition-colors duration-300 ${
                            isActive ? b.accentText : "text-gray-500 group-hover:text-gray-300"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`text-[11px] tracking-widest transition-colors ${
                              isActive ? b.accentText : "text-gray-500"
                            }`}
                          >
                            BLOQUE {b.number}
                          </span>
                        </div>
                        <h3
                          className={`font-bold text-base md:text-lg transition-colors ${
                            isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                          }`}
                        >
                          {b.title}
                        </h3>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 transition-all duration-300 shrink-0 ${
                          isActive
                            ? `${b.accentText} translate-x-1`
                            : "text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Preview lateral (derecha) */}
            <div className="lg:col-span-7 lg:sticky lg:top-24">
              <div
                key={activeBlock.id}
                className="relative animate-in fade-in slide-in-from-right-4 duration-500"
              >
                {/* Imagen con marco y badge */}
                <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[4/3] lg:aspect-[5/4]">
                  <img
                    src={activeBlock.image}
                    alt={activeBlock.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div
                    className="absolute inset-0 mix-blend-overlay opacity-30"
                    style={{ backgroundColor: activeBlock.accent }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  {/* Badge esquina superior */}
                  <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
                    <span className={`text-xs font-light ${activeBlock.accentText}`}>
                      {activeBlock.id}
                    </span>
                    <span className="text-xs text-gray-300">Bloque {activeBlock.number}</span>
                  </div>

                  {/* Texto sobre imagen */}
                  <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                      {activeBlock.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-300 italic">{activeBlock.sub}</p>
                  </div>
                </div>

                {/* Teaser justificado debajo */}
                <p className="mt-6 text-gray-300 leading-relaxed text-justify hyphens-auto">
                  {activeBlock.teaser}
                </p>

                <button
                  onClick={() => scrollTo(`block-${activeBlock.id}`)}
                  className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${activeBlock.accentText} hover:underline`}
                >
                  Conocer en profundidad <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────── DIAGNÓSTICO COMERCIAL ───────────────────── */}
      <section id="diagnostico" className="py-28 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5 pointer-events-none" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-green-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Texto izquierda */}
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium tracking-widest uppercase text-xs">
                  Diagnóstico gratuito · 8 min
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                ¿No sabes por dónde <br className="hidden md:block" />
                empezar? <span className="text-green-400">Te lo decimos nosotros.</span>
              </h2>
              <p className="text-gray-300 leading-relaxed mb-5 text-justify hyphens-auto">
                Cuéntanos cómo funciona hoy tu proceso comercial y te enviamos un{" "}
                <span className="text-white font-semibold">informe personalizado</span> con tu nivel de
                madurez operativa, los bloques donde se está escapando más tiempo y oportunidades, y los
                módulos que recomendamos activar primero.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8 text-sm text-justify hyphens-auto">
                Sin compromiso, sin tarjeta y sin que nadie llame al día siguiente para venderte algo que
                no necesites. Si después quieres una conversación, tú la pides.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: Clock, label: "8 minutos" },
                  { icon: ListChecks, label: "20 preguntas" },
                  { icon: FileText, label: "Informe PDF" },
                  { icon: CheckCircle2, label: "Confidencial" },
                ].map((it, i) => {
                  const Icon = it.icon;
                  return (
                    <div
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300"
                    >
                      <Icon className="w-3.5 h-3.5 text-green-400" /> {it.label}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/auditorias/constructoras"
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-600 text-white h-14 px-7 text-base gap-2 font-bold rounded-md shadow-lg shadow-green-900/30 transition-all hover:scale-[1.02]"
                >
                  Empezar mi auditoría <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Preview del informe (derecha) */}
            <div className="relative">
              <div className="relative aspect-[4/5] max-w-sm mx-auto">
                {/* Capas apiladas tipo PDF stack */}
                <div
                  className="absolute inset-0 rounded-2xl border border-white/10 bg-[#0d2a1a] rotate-3 translate-x-3 translate-y-3 opacity-40"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 rounded-2xl border border-white/15 bg-[#0d2a1a] rotate-1 translate-x-1 translate-y-1 opacity-70"
                  aria-hidden
                />
                <div className="relative rounded-2xl border border-white/20 bg-[#0d2a1a] overflow-hidden shadow-2xl shadow-black/60">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="font-bold text-lg">
                        <span className="text-white">immoral</span>
                        <span className="text-green-400">ia</span>
                      </div>
                      <span className="text-[10px] tracking-widest text-green-300/80 uppercase">
                        Confidencial
                      </span>
                    </div>
                    <div className="text-xs tracking-widest text-green-300/80 mb-3 uppercase">
                      Diagnóstico · Constructoras / Reformas / Inmobiliarias · 2026
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-white leading-tight">
                      Diagnóstico de madurez comercial
                    </h4>
                    {/* Score circle simulado */}
                    <div className="flex items-center gap-5 mb-6 py-4 border-y border-white/10">
                      <div className="relative w-20 h-20 rounded-full bg-[#0a1f10] border-2 border-green-400/30 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-green-400 leading-none">68</span>
                        <span className="text-[8px] tracking-widest text-gray-400 mt-0.5">DE 100</span>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-widest text-gray-400 uppercase mb-0.5">
                          Tu nivel
                        </div>
                        <div className="font-bold text-white">En crecimiento</div>
                      </div>
                    </div>
                    {/* Bloques con barra */}
                    <div className="space-y-2.5">
                      {[
                        { id: "B1", v: 45, c: "bg-red-400" },
                        { id: "B2", v: 72, c: "bg-amber-400" },
                        { id: "B3", v: 38, c: "bg-red-400" },
                        { id: "B4", v: 85, c: "bg-blue-400" },
                        { id: "B5", v: 30, c: "bg-red-400" },
                        { id: "B6", v: 55, c: "bg-amber-400" },
                      ].map((b) => (
                        <div key={b.id} className="flex items-center gap-3">
                          <span className="text-[10px] text-gray-400 w-5">{b.id}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className={`h-full ${b.c}`}
                              style={{ width: `${b.v}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-300 w-6 text-right tabular-nums">
                            {b.v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-6">
                Vista previa · El informe completo incluye módulos prioritarios y hoja de ruta por fases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────── ZOOM POR BLOQUE (alternado) ───────────────────── */}
      {construccionBlocks.map((b, idx) => {
        const Icon = b.icon;
        const modules = getConstruccionModulesByBlock(b.id);
        const reverse = idx % 2 === 1;
        return (
          <section
            key={b.id}
            id={`block-${b.id}`}
            className="py-28 border-t border-white/5 scroll-mt-20 relative overflow-hidden"
          >
            {/* Glow de color del bloque */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                background: reverse
                  ? `radial-gradient(ellipse at 15% 50%, ${b.accent}20 0%, transparent 55%)`
                  : `radial-gradient(ellipse at 85% 50%, ${b.accent}20 0%, transparent 55%)`,
              }}
            />

            <div className="container mx-auto px-6 relative z-10">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  reverse ? "lg:[&>div:first-child]:order-2" : ""
                }`}
              >
                {/* Imagen */}
                <div className="relative px-4">
                  <div className="relative aspect-[4/5]">
                    <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 group">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${b.accentGradient} mix-blend-soft-light`} />
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div
                        className="absolute bottom-4 right-5 font-bold text-[120px] leading-none opacity-15 select-none"
                        style={{ color: b.accent }}
                      >
                        {b.number}
                      </div>
                    </div>
                  </div>

                  {/* Glow detrás */}
                  <div
                    className="absolute -inset-10 -z-10 rounded-3xl blur-3xl opacity-20"
                    style={{ backgroundColor: b.accent }}
                  />
                </div>

                {/* Texto + módulos */}
                <div>
                  <div className="inline-flex items-center gap-2 mb-5">
                    <div
                      className={`w-10 h-10 rounded-xl ${b.accentBg} border ${b.accentBorder} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${b.accentText}`} />
                    </div>
                    <span className={`${b.accentText} font-medium tracking-widest uppercase text-xs`}>
                      Bloque {b.number}
                    </span>
                  </div>
                  <h2
                    className="text-3xl md:text-5xl font-bold mb-4 tracking-tight bg-clip-text text-transparent leading-tight pb-2"
                    style={{
                      backgroundImage: `linear-gradient(135deg, #fff 0%, #fff 60%, ${b.accent} 130%)`,
                    }}
                  >
                    {b.title}
                  </h2>
                  <p className="text-base md:text-lg text-gray-400 mb-7 italic">{b.sub}</p>
                  <p className="text-gray-300 leading-relaxed mb-7 text-justify hyphens-auto">
                    {b.paragraph}
                  </p>

                  {/* Beneficios en accordion */}
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="benefits"
                    className="mb-8"
                  >
                    <AccordionItem
                      value="benefits"
                      className={`rounded-2xl border ${b.accentBorder} bg-white/[0.02] px-5 data-[state=open]:bg-white/[0.04]`}
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <span className="flex items-center gap-2.5 text-sm font-semibold">
                          <Sparkles className={`w-4 h-4 ${b.accentText}`} />
                          Lo que cambia en tu negocio
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-3 pb-2">
                          {b.benefits.map((bn, i) => (
                            <li
                              key={i}
                              className="flex gap-3 text-gray-300 animate-in fade-in slide-in-from-left-2 duration-500"
                              style={{ animationDelay: `${i * 80}ms` }}
                            >
                              <CheckCircle2 className={`w-5 h-5 ${b.accentText} shrink-0 mt-0.5`} />
                              <span className="leading-relaxed">{bn}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Módulos del bloque */}
                  <div className="mb-8 border-t border-white/8">
                    {modules.map((m, i) => {
                      const isOpen = expandedModule === m.codigo;
                      const isModuleSelected = selectedProcessIds.has(`mod-${m.codigo}`);
                      return (
                        <div
                          key={m.codigo}
                          className="border-b border-white/8 animate-in fade-in duration-500"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          <div className="flex items-center">
                            {/* Expand area */}
                            <button
                              onClick={() => setExpandedModule(isOpen ? null : m.codigo)}
                              className="flex-1 flex items-baseline gap-4 py-3.5 hover:bg-white/[0.02] transition-colors text-left group min-w-0"
                            >
                              <span
                                className="text-sm font-light tabular-nums tracking-tight shrink-0 w-9"
                                style={{ color: b.accent, opacity: 0.75 }}
                              >
                                {m.codigo}
                              </span>
                              <span className="flex-1 text-[15px] text-white font-medium leading-snug">
                                {m.nombre}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-300 mr-2 ${
                                  isOpen ? "rotate-180" : ""
                                } group-hover:text-gray-300`}
                              />
                            </button>
                            {/* Toggle selection */}
                            <button
                              onClick={() => toggleProcess(`mod-${m.codigo}`)}
                              className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all mr-1 ${
                                isModuleSelected
                                  ? "bg-green-500/20 border-green-500/60 text-green-400"
                                  : "border-white/15 text-gray-600 hover:border-white/35 hover:text-gray-300"
                              }`}
                            >
                              {isModuleSelected ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Plus className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          {isOpen && (
                            <div className="pl-[52px] pr-2 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                              <p className="text-sm text-gray-400 leading-relaxed text-justify hyphens-auto mb-3">
                                {m.descripcion}
                              </p>
                              {m.linkedProcessSlug && (
                                <Link
                                  to={`/catalogo/procesos/${m.linkedProcessSlug}`}
                                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg border transition-all hover:translate-x-0.5"
                                  style={{
                                    borderColor: `${b.accent}50`,
                                    color: b.accent,
                                    backgroundColor: `${b.accent}10`,
                                  }}
                                >
                                  Ver ficha completa <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}


      {/* ───────────────────── FINAL CTA ───────────────────── */}
      <section className="py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-green-600/5 -z-10" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-500/10 blur-[100px] rounded-full" />
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-[1.05]">
            ¿Listo para escalar <br /> tu constructora?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Solicita una propuesta personalizada con los módulos que te interesan, el orden recomendado
            de implementación y el coste de cada fase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setShowContactForm(true)}
              className="bg-green-600 hover:bg-green-600 h-16 px-10 text-xl font-bold shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-all hover:scale-105"
            >
              Solicitar propuesta
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-16 px-10 text-xl border-white/10 hover:bg-white/5 hover:text-white"
              onClick={() => setShowCalendlyModal(true)}
            >
              Agendar llamada
            </Button>
          </div>
        </div>
      </section>

      {/* ───────────────────── FOOTER ───────────────────── */}
      <footer className="py-12 border-t border-white/5 bg-black/50">
        <div className="container mx-auto px-6 text-center">
          <img src={immoraliaLogo} alt="Immoralia" className="h-6 mx-auto mb-6 opacity-30 grayscale" />
          <p className="text-xs text-gray-600">
            immoralia · Automatización & IA · Parte de Immoral Group · www.immoral.es
          </p>
        </div>
      </footer>

      {/* ───────────────────── FLOATING MODULE BAR ───────────────────── */}
      {selectedProcessIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 px-4 w-full max-w-lg">
          <div className="flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-[#171717] border border-green-500/30 shadow-2xl shadow-black/70 backdrop-blur-md">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 animate-pulse" />
              <span className="text-sm text-white font-semibold truncate">
                {selectedProcessIds.size} proceso{selectedProcessIds.size > 1 ? "s" : ""} seleccionado{selectedProcessIds.size > 1 ? "s" : ""}
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => setShowContactForm(true)}
              className="bg-green-600 hover:bg-green-600 text-white h-9 px-4 text-sm font-semibold gap-1.5 shrink-0"
            >
              Solicitar propuesta <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footnote */}
      <footer className="py-12 border-t border-white/5 bg-black/50">
        <div className="container mx-auto px-6 text-center">
          <img src={immoraliaLogo} alt="Immoralia" className="h-6 mx-auto mb-6 opacity-30 grayscale" />
          <p className="text-gray-600 text-sm">© 2026 Immoralia. Soluciones de Automatización para Construcción & Reformas.</p>
        </div>
      </footer>

      {/* Overlays / Modals */}
      
      {showContactForm && (
        <ContactForm 
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
          selectedProcesses={selectedProcesses}
          n8nHosting={n8nHosting}
          accentColor="#d97706"
        />
      )}

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        prefilledSector="Construcción & Reformas"
        accentColor="#d97706"
      />

      <ShareSelectionModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        selectedProcesses={selectedProcesses}
        accentColor="#d97706"
      />
    </div>
  );
};

export default ConstruccionLanding;
