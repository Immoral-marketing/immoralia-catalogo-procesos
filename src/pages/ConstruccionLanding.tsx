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
import { StepIndicator } from "@/components/StepIndicator";

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
    processes.filter(p => p.landing_slug === "construccion" || p.sectores?.includes("Construcción & Reformas")),
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
    <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-amber-500/30 font-sans">
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
                      ? "bg-amber-600 hover:bg-amber-500 text-white border-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.2)]"
                      : "bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Mi Selección</span>
                  {selectedProcessIds.size > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-white text-amber-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {selectedProcessIds.size}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0d0d0d] border-white/5 w-full sm:max-w-md p-0 overflow-hidden text-white">
                <div className="h-full flex flex-col p-6 overflow-hidden">
                  <SheetHeader className="mb-2 text-left">
                    <SheetTitle className="text-white text-2xl font-bold flex items-center gap-2">
                      <LayoutGrid className="w-6 h-6 text-amber-400" />
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/75 to-[#0d0d0d]/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-amber-900/10 blur-[120px] rounded-full" />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            De gestionar presupuestos, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              a liderar proyectos de éxito
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Automatizamos la captación de clientes, los presupuestos y el control de gastos para que tu equipo se centre en construir.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button size="lg" onClick={scrollToProcesses} className="bg-amber-600 hover:bg-amber-500 text-white h-14 px-8 text-lg gap-2 font-bold shadow-lg shadow-amber-900/20 transition-all hover:scale-105">
              Seleccionar mis procesos <ChevronRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.open('https://calendly.com/david-immoral/30min', '_blank')} className="border-white/10 hover:bg-white/5 h-14 px-8 text-lg hover:text-white">
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
                  <LayoutGrid className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-400 font-medium tracking-widest uppercase text-xs">CATÁLOGO ESPECIALIZADO</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Selecciona tus Soluciones</h2>
                <p className="text-gray-400">Elige los procesos que quieres automatizar en tu empresa. Añade tantos como necesites a tu selección.</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Toggle vista */}
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1 gap-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-amber-600 text-white" : "text-gray-400 hover:text-white"}`}
                    title="Vista en tarjetas"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-amber-600 text-white" : "text-gray-400 hover:text-white"}`}
                    title="Vista en lista"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="bg-white/5 border border-white/5 p-1 h-auto flex flex-wrap justify-center gap-1 sm:gap-2">
                  <TabsTrigger
                    value="todos"
                    className="px-4 py-2.5 rounded-lg data-[state=active]:bg-amber-600 data-[state=active]:text-white text-gray-400 text-sm font-medium transition-all"
                  >
                    Todos
                  </TabsTrigger>
                  {construccionCategories.map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className="px-4 py-2.5 rounded-lg data-[state=active]:bg-amber-600 data-[state=active]:text-white text-gray-400 text-sm font-medium transition-all"
                    >
                      {cat.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {[
                { value: "todos", items: construccionProcesses },
                ...construccionCategories.map(cat => ({
                  value: cat.id,
                  items: construccionProcesses.filter(p => p.categoriaNombre === cat.id)
                }))
              ].map(({ value, items }) => (
                <TabsContent key={value} value={value} className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {items.map((process) => (
                        <ProcessCard
                          key={process.id}
                          process={process}
                          accentColor="#d97706"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col divide-y divide-white/5 rounded-xl border border-white/5 overflow-hidden">
                      {items.map((process) => {
                        const isSelected = selectedProcessIds.has(process.id);
                        return (
                          <div
                            key={process.id}
                            className={`flex items-center gap-4 px-6 py-4 bg-black/30 hover:bg-black/50 transition-all group ${isSelected ? "border-l-2 border-amber-500" : "border-l-2 border-transparent"}`}
                          >
                            <span
                              className="hidden sm:flex w-44 shrink-0 justify-center text-xs text-amber-400/70 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded font-medium whitespace-nowrap text-center cursor-pointer hover:bg-amber-500/20 hover:text-amber-300 transition-colors"
                              onClick={() => setActiveCategory(process.categoriaNombre)}
                            >
                              {process.categoriaNombre}
                            </span>
                            <p
                              className="flex-1 font-medium text-gray-200 group-hover:text-white transition-colors cursor-pointer"
                              onClick={() => navigate(`/catalogo/procesos/${process.slug}`)}
                            >
                              {process.nombre}
                            </p>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 hidden sm:flex"
                                onClick={() => navigate(`/catalogo/procesos/${process.slug}`)}
                              >
                                Saber más <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                              <Button
                                size="sm"
                                variant={isSelected ? "default" : "outline"}
                                onClick={() => toggleProcess(process.id)}
                                className="gap-1.5 transition-all hover:!bg-amber-500/15 hover:!text-amber-300 hover:!border-amber-400"
                                style={isSelected
                                  ? { backgroundColor: "#d97706", borderColor: "#d97706", color: "white" }
                                  : { borderColor: "#d97706", color: "#d97706" }
                                }
                              >
                                {isSelected ? <><Check className="w-3.5 h-3.5" /> Añadido</> : "Seleccionar"}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
                className="text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-500/5 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Personalizar Catálogo
              </Button>
              <Button asChild variant="outline" size="sm" className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white">
                <Link to="/catalogo/completo">Ver Catálogo Completo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center underline decoration-amber-500/30 underline-offset-8 transition-all hover:decoration-amber-500/60">¿Te Resulta Familiar?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Tardar días en preparar presupuestos complejos y perder la venta.",
                "Descontrol en las facturas de proveedores y pérdida de márgenes.",
                "Falta de seguimiento a solicitudes que llegan por la web o redes.",
                "Dificultad para coordinar pagos y vencimientos con subcontratas.",
                "Invertir horas en Excel para saber el estado real de los costes de obra.",
                "Informar a los clientes del avance del proyecto consume demasiado tiempo."
              ].map((pain, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-amber-500/20 transition-all hover:translate-y-[-2px] group">
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
            <p className="text-gray-400">Transformamos tu operativa para elevar la rentabilidad de cada proyecto.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Calculator className="w-8 h-8 text-amber-400" />,
                title: "Presupuestos en minutos",
                desc: "Genera ofertas precisas en minutos, no días. El sistema calcula materiales y mano de obra sin errores."
              },
              {
                icon: <FileText className="w-8 h-8 text-amber-400" />,
                title: "Control total de la obra",
                desc: "Seguimiento automático de facturas y gastos por proyecto. Sabrás tu margen real en cada momento."
              },
              {
                icon: <Users className="w-8 h-8 text-amber-400" />,
                title: "Más clientes, menos esfuerzo",
                desc: "Tus redes sociales y web trabajan para traerte nuevas obras. Cada interesado recibe respuesta al instante."
              }
            ].map((prop, i) => (
              <div key={i} className="text-center space-y-4 group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 group-hover:border-amber-400/30 transition-all duration-300">
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
          <h2 className="text-3xl font-bold mb-12 text-center text-amber-400 flex items-center justify-center gap-3">
            <Search className="w-8 h-8" /> Preguntas Frecuentes
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "¿Se puede conectar con el programa que ya uso para hacer presupuestos?",
                a: "Sí, nos conectamos con la mayoría de programas de facturación y gestión del mercado sin que tengas que cambiar nada de lo que ya tienes."
              },
              {
                q: "¿Cómo funciona la generación automática de presupuestos?",
                a: "El sistema lee la solicitud del cliente y, basándose en tus tarifas y tu historial, propone una lista de materiales y tiempos lista para revisar y enviar."
              },
              {
                q: "¿Sirve para reformistas autónomos o solo para constructoras?",
                a: "Para ambos. Un autónomo puede empezar por responder automáticamente en WhatsApp y llevar el control de facturas. Una empresa más grande puede usar todo el catálogo."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/10 transition-all hover:bg-white/[0.07] group">
                <h3 className="text-lg font-bold mb-2 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
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
        <div className="absolute inset-0 bg-amber-600/5 -z-10" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full" />
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            ¿Listo para profesionalizar <br /> tu constructora?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Deja de apagar fuegos financieros y empieza a construir un negocio sólido. Pide tu consultoría estratégica gratuita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setShowContactForm(true)} className="bg-amber-600 hover:bg-amber-500 h-16 px-10 text-xl font-bold shadow-[0_0_40px_rgba(217,119,6,0.3)] transition-all hover:scale-105">
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
