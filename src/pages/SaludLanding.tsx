import { useState, useMemo, useEffect, useRef } from "react";
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
  Stethoscope,
  Calendar,
  Sparkles,
  Search
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
import immoraliaLogo from "@/assets/immoralia_logo.png";
import { CalendlyLeadModal } from "@/components/CalendlyLeadModal";

const ACCENT = "#0ea5e9";
const AUDIT_URL = "/auditorias/salud";

// Sector exclusivo: los procesos de salud tienen landing_slug propio
const SALUD_LANDING_SLUG = "salud";

const SaludLanding = () => {
  const { selectedProcessIds, n8nHosting, setN8nHosting } = useSelection();
  const [showContactForm, setShowContactForm] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Immoralia - Catálogo de Procesos - Salud";
    const timer = setTimeout(() => {
      if (!isOnboardingCompleted()) {
        setShowOnboarding(true);
      }
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  // Filtrar procesos para Salud
  const saludProcesses = useMemo(() => 
    processes.filter(p => !p.hidden && (p.landing_slug === "salud" || p.sectores?.includes("Clínicas / Salud / Dental / Veterinaria"))),
    []
  );

  const saludCategories = useMemo(() => {
    const catsMap = new Map();
    saludProcesses.forEach(p => {
      if (!catsMap.has(p.categoriaNombre)) {
        catsMap.set(p.categoriaNombre, p.categoriaNombre);
      }
    });
    return Array.from(catsMap.entries()).map(([id, name]) => ({ id, name }));
  }, [saludProcesses]);

  const [activeCategory, setActiveCategory] = useState("todos");

  const selectedProcesses = useMemo(() => {
    return processes.filter(p => selectedProcessIds.has(p.id));
  }, [selectedProcessIds]);

  const scrollToProcesses = () => {
    const el = document.getElementById("procesos-grid");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-blue-500/30 font-sans">
      {/* Navigation / Header */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
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
                      ? "bg-blue-600 hover:bg-blue-500 text-white border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                      : "bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Mi Selección</span>
                  {selectedProcessIds.size > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-white text-blue-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {selectedProcessIds.size}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0d0d0d] border-white/5 w-full sm:max-w-md p-0 overflow-hidden text-white">
                <div className="h-full flex flex-col p-6 overflow-hidden">
                  <SheetHeader className="mb-2 text-left">
                    <SheetTitle className="text-white text-2xl font-bold flex items-center gap-2">
                      <LayoutGrid className="w-6 h-6 text-blue-400" />
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
                    accentColor="#2563eb"
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
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/75 to-[#0d0d0d]/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-900/10 blur-[120px] rounded-full" />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            De gestionar tu clínica, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              a liderar tu centro de salud
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Automatizamos la atención, las reservas y el seguimiento de pacientes para que tu equipo se centre en lo más importante: la salud.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button size="lg" onClick={scrollToProcesses} className="bg-blue-600 hover:bg-blue-500 text-white h-14 px-8 text-lg gap-2 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
              Seleccionar mis procesos <ChevronRight className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-5">
              <button
                onClick={() => setShowCalendlyModal(true)}
                className="text-sm text-gray-400 hover:text-sky-300 transition-colors underline-offset-4 hover:underline"
              >
                Agendar una llamada
              </button>
              <span className="text-white/15 text-xs">·</span>
              <button
                onClick={() => setShowContactForm(true)}
                className="text-sm text-gray-400 hover:text-sky-300 transition-colors underline-offset-4 hover:underline"
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

      {/* ───────────────────── 6 MÓDULOS — FEATURE SHOWCASE ───────────────────── */}
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
              Las áreas donde un centro de salud <span className="text-sky-400">puede funcionar solo</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Seis áreas, cada una con un propósito claro. Pasa por encima de cada una para ver de qué va.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto items-start">
            {/* Lista vertical de bloques (izquierda) */}
            <div className="lg:col-span-5 space-y-2">
              {saludBlocks.map((b) => {
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
                            MÓDULO {b.number}
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
                    <span className="text-xs text-gray-300">Módulo {activeBlock.number}</span>
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

      {/* ───────────────────── AUDITORÍA (sustituye al diagnóstico) ───────────────────── */}
      <section id="auditoria" className="py-28 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-amber-500/5 pointer-events-none" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-sky-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Texto izquierda */}
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-sky-400" />
                <span className="text-sky-400 font-medium tracking-widest uppercase text-xs">
                  Auditoría gratuita · 6 min
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                ¿No sabes por dónde <br className="hidden md:block" />
                empezar? <span className="text-sky-400">Te lo decimos nosotros.</span>
              </h2>
              <p className="text-gray-300 leading-relaxed mb-5 text-justify hyphens-auto">
                Responde 18 preguntas sobre cómo opera tu centro hoy y te enviamos un{" "}
                <span className="text-white font-semibold">informe personalizado en PDF</span> con tu
                nivel de madurez operativa, los módulos donde se está escapando más tiempo y clientes, y
                los módulos que recomendamos activar primero.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8 text-sm text-justify hyphens-auto">
                Sin compromiso, sin tarjeta y sin que nadie llame al día siguiente para venderte nada que
                no necesites. Si después quieres una conversación, tú la pides.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: Clock, label: "6 minutos" },
                  { icon: ListChecks, label: "18 preguntas" },
                  { icon: FileText, label: "Informe PDF" },
                  { icon: CheckCircle2, label: "Confidencial" },
                ].map((it, i) => {
                  const Icon = it.icon;
                  return (
                    <div
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300"
                    >
                      <Icon className="w-3.5 h-3.5 text-sky-400" /> {it.label}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={AUDIT_URL}
                  className="inline-flex items-center justify-center bg-sky-600 hover:bg-sky-500 text-white h-14 px-7 text-base gap-2 font-bold rounded-md shadow-lg shadow-sky-900/30 transition-all hover:scale-[1.02]"
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
                  className="absolute inset-0 rounded-2xl border border-white/10 bg-[#0c2a3a] rotate-3 translate-x-3 translate-y-3 opacity-40"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 rounded-2xl border border-white/15 bg-[#0c2a3a] rotate-1 translate-x-1 translate-y-1 opacity-70"
                  aria-hidden
                />
                <div className="relative rounded-2xl border border-white/20 bg-[#0c2a3a] overflow-hidden shadow-2xl shadow-black/60">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="font-bold text-lg">
                        <span className="text-white">immoral</span>
                        <span className="text-sky-400">ia</span>
                      </div>
                      <span className="text-[10px] tracking-widest text-amber-300/80 uppercase">
                        Confidencial
                      </span>
                    </div>
                    <div className="text-xs tracking-widest text-amber-300/80 mb-3 uppercase">
                      Auditoría · Centros de Salud · 2026
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-white leading-tight">
                      Auditoría de madurez operativa
                    </h4>
                    {/* Score circle simulado */}
                    <div className="flex items-center gap-5 mb-6 py-4 border-y border-white/10">
                      <div className="relative w-20 h-20 rounded-full bg-[#082030] border-2 border-sky-400/30 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-sky-400 leading-none">72</span>
                        <span className="text-[8px] tracking-widest text-gray-400 mt-0.5">DE 100</span>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-widest text-gray-400 uppercase mb-0.5">
                          Tu nivel
                        </div>
                        <div className="font-bold text-white">Sistematizado</div>
                      </div>
                    </div>
                    {/* Bloques con barra */}
                    <div className="space-y-2.5">
                      {[
                        { id: "B1", v: 88, c: "bg-emerald-400" },
                        { id: "B2", v: 63, c: "bg-amber-400" },
                        { id: "B3", v: 38, c: "bg-red-400" },
                        { id: "B4", v: 88, c: "bg-emerald-400" },
                        { id: "B5", v: 38, c: "bg-red-400" },
                        { id: "B6", v: 38, c: "bg-red-400" },
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
                Vista previa · El informe completo tiene 7 páginas con módulos prioritarios y hoja de ruta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────── ZOOM POR MÓDULO (alternado, con cariño) ───────────────────── */}
      {saludBlocks.map((b, idx) => {
        const Icon = b.icon;
        const modules = getModulesByBlock(b.id);
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
                {/* Imagen / Flip card */}
                <div className="relative px-4" style={{ perspective: "2400px" }}>
                  <div
                    className="relative aspect-[4/5]"
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "transform 0.8s cubic-bezier(0.4,0.2,0.2,1)",
                      transform: flippedBlock === b.id ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* CARA FRONTAL — imagen, clic voltea */}
                    <div
                      className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 group cursor-pointer"
                      style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                      onClick={() => b.id === "B1" && setFlippedBlock("B1")}
                    >
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

                    {/* CARA TRASERA — vídeo (solo B1), clic vuelve */}
                    {b.id === "B1" && (
                      <div
                        className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 bg-black cursor-pointer"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                        onClick={() => setFlippedBlock(null)}
                      >
                        <video
                          ref={videoRef}
                          src="/salud/modulo1.mp4"
                          className="w-full h-full object-cover"
                          loop
                          playsInline
                        />
                      </div>
                    )}
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
                      Módulo {b.number}
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

                  {/* Módulos del bloque — lista compacta con toggle + expand */}
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
                                  ? "bg-sky-500/20 border-sky-500/60 text-sky-400"
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

                  {/* Botón "Saber más" → flip card (solo B1) */}
                  {b.id === "B1" && (
                    <button
                      onClick={() => setFlippedBlock(flippedBlock === "B1" ? null : "B1")}
                      className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl border transition-all"
                      style={{
                        borderColor: `${b.accent}50`,
                        color: b.accent,
                        backgroundColor: `${b.accent}10`,
                      }}
                    >
                      Saber más <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ───────────────────── FINAL CTA ───────────────────── */}
      <section className="py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-sky-600/5 -z-10" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-500/10 blur-[100px] rounded-full" />
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-[1.05]">
            ¿Listo para escalar <br /> tu centro de salud?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Solicita una propuesta personalizada con los módulos que te interesan, el orden recomendado de
            implementación y el coste de cada fase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setShowContactForm(true)}
              className="bg-sky-600 hover:bg-sky-500 h-16 px-10 text-xl font-bold shadow-[0_0_40px_rgba(14,165,233,0.35)] transition-all hover:scale-105"
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

      {/* Processes Grid Section */}
      <section id="procesos-grid" className="pt-10 pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <LayoutGrid className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium tracking-widest uppercase text-xs">Catálogo para Centros de Salud</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Selecciona tus Soluciones</h2>
                <p className="text-gray-400">Elige los procesos que quieres automatizar en tu clínica. Añade tantos como necesites a tu selección.</p>
              </div>
            </div>

            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="bg-white/5 border border-white/5 p-1 h-auto flex flex-wrap justify-center gap-1 sm:gap-2">
                  <TabsTrigger
                    value="todos"
                    className="px-4 py-2.5 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400 text-sm font-medium transition-all"
                  >
                    Todos
                  </TabsTrigger>
                  {saludCategories.map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className="px-4 py-2.5 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400 text-sm font-medium transition-all"
                    >
                      {cat.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="todos" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {saludProcesses.map((process) => (
                    <ProcessCard
                      key={process.id}
                      process={process}
                      accentColor="#2563eb"
                    sectorSlug="salud"
                    />
                  ))}
                </div>
              </TabsContent>
              {saludCategories.map((cat) => (
                <TabsContent key={cat.id} value={cat.id} className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {saludProcesses
                      .filter(p => p.categoriaNombre === cat.id)
                      .map((process) => (
                        <ProcessCard
                          key={process.id}
                          process={process}
                          accentColor="#2563eb"
                    sectorSlug="salud"
                        />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Catalog Footer Bar */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-r from-white/[0.04] to-black/20 px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-0.5">¿No encuentras lo que buscas?</p>
                <p className="text-sm text-gray-500">Personaliza el catálogo según tu negocio o explora todas las automatizaciones.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Button
                variant="ghost"
                onClick={() => setShowOnboarding(true)}
                className="text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/5 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Personalizar Catálogo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center underline decoration-blue-500/30 underline-offset-8 transition-all hover:decoration-blue-500/60">¿Te Resulta Familiar?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Teléfono de recepción saturado con dudas repetitivas.",
                "Pacientes que olvidan sus citas, dejando huecos vacíos.",
                "Carga administrativa excesiva en facturación y presupuestos.",
                "Falta de seguimiento a pacientes que solicitaron información.",
                "Dificultad para coordinar la agenda entre varios doctores.",
                "Procesos de admisión lentos que generan colas en espera."
              ].map((pain, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-blue-500/20 transition-all hover:translate-y-[-2px] group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-gray-300">{pain}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Lo que Conseguirás con Immoralia</h2>
            <p className="text-gray-400">Transformamos tu operativa clínica para elevar la experiencia del paciente.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <MessageSquare className="w-8 h-8 text-blue-400" />,
                title: "Atención 24/7",
                desc: "Tus pacientes reciben respuestas al instante, incluso fuera de horario. Responde dudas de forma automática y avisa cuando hace falta atención humana."
              },
              {
                icon: <Calendar className="w-8 h-8 text-blue-400" />,
                title: "Optimización de Agenda",
                desc: "Recordatorios y confirmaciones automáticas que reducen las citas perdidas hasta en un 80%."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-blue-400" />,
                title: "Seguridad y Eficiencia",
                desc: "Automatizamos el papeleo y la facturación cumpliendo con todas las normativas de protección de datos de salud."
              }
            ].map((prop, i) => (
              <div key={i} className="text-center space-y-4 group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-400/30 transition-all duration-300">
                  {prop.icon}
                </div>
                <h3 className="text-xl font-bold">{prop.title}</h3>
                <p className="text-gray-400 leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-400 flex items-center justify-center gap-3">
            <Search className="w-8 h-8" /> Dudas Frecuentes
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "¿Los datos de mis pacientes están seguros?",
                a: "Absolutamente. Solo trabajamos con herramientas que cumplen con RGPD y estándares de seguridad de grado médico. No almacenamos datos sensibles en servidores externos."
              },
              {
                q: "¿Se integra con mi software de gestión clínica actual?",
                a: "En la mayoría de los casos, sí. Podemos conectar con tu software de forma directa o sincronizando calendarios y fichas de pacientes automáticamente."
              },
              {
                q: "¿Mis pacientes notarán que es una automatización?",
                a: "Diseñamos las interacciones para que sean lo más humanas y profesionales posible. La automatización gestiona lo repetitivo, pero siempre dejamos la puerta abierta para que un humano intervenga cuando sea necesario."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/10 transition-all hover:bg-white/[0.07] group">
                <h3 className="text-lg font-bold mb-2 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-gray-400 ml-8 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-blue-600/5 -z-10" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full" />
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            ¿Listo para modernizar <br /> tu centro de salud?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Deja de perder tiempo en tareas administrativas y empieza a ofrecer una atención de vanguardia. Pide tu consultoría estratégica gratuita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setShowContactForm(true)} className="bg-blue-600 hover:bg-blue-500 h-16 px-10 text-xl shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all hover:scale-105">
              Solicitar Oferta Ahora
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 text-xl border-white/10 hover:bg-white/5 hover:text-white" onClick={() => window.open('https://calendly.com/david-immoral/30min', '_blank')}>
              Agendar llamada
            </Button>
          </div>
        </div>
      </section>

      {/* Footnote */}
      <footer className="py-12 border-t border-white/5 bg-black/50">
        <div className="container mx-auto px-6 text-center">
          <img src={immoraliaLogo} alt="Immoralia" className="h-6 mx-auto mb-6 opacity-30 grayscale" />
          <p className="text-gray-600 text-sm">© 2026 Immoralia. Soluciones de Automatización para el Sector Salud.</p>
        </div>
      </footer>

      {/* Overlays / Modals */}
      
      {showContactForm && (
        <ContactForm 
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
          selectedProcesses={selectedProcesses}
          n8nHosting={n8nHosting}
          accentColor="#2563eb"
        />
      )}

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        prefilledSector="Clínicas / Salud"
        accentColor="#2563eb"
      />

      <ShareSelectionModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        selectedProcesses={selectedProcesses}
        accentColor="#2563eb"
      />
    </div>
  );
};

export default SaludLanding;
