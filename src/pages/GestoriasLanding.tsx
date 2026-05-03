import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { processes, categories } from "@/data/processes";
import { ProcessCard } from "@/components/ProcessCard";
import { SelectionSummary } from "@/components/SelectionSummary";
import { ContactForm } from "@/components/ContactForm";
import { OnboardingModal } from "@/components/OnboardingModal";
import { ShareSelectionModal } from "@/components/ShareSelectionModal";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Target, 
  Users, 
  Zap, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight,
  TrendingDown,
  Clock,
  CheckCircle2,
  LayoutGrid,
  FileText,
  Search,
  Sparkles
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
import { StepIndicator } from "@/components/StepIndicator";

const GestoriasLanding = () => {
  const { selectedProcessIds, toggleProcess, n8nHosting, setN8nHosting } = useSelection();
  const [showContactForm, setShowContactForm] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Immoralia - Catálogo de Procesos - Gestorías";
    const timer = setTimeout(() => {
      if (!isOnboardingCompleted()) {
        setShowOnboarding(true);
      }
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  // Filtrar procesos para Gestorías
  const gestoriasProcesses = useMemo(() => 
    processes.filter(p => !p.hidden && (p.landing_slug === "gestorias" || (p.sectores?.includes("Gestoria") && !p.landing_slug))),
    []
  );

  const gestoriasCategories = useMemo(() => {
    const catsMap = new Map();
    gestoriasProcesses.forEach(p => {
      if (!catsMap.has(p.categoriaNombre)) {
        catsMap.set(p.categoriaNombre, p.categoriaNombre);
      }
    });

    return Array.from(catsMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [gestoriasProcesses]);

  const [activeCategory, setActiveCategory] = useState("todos");

  const selectedProcesses = useMemo(() => {
    return processes.filter(p => selectedProcessIds.has(p.id));
  }, [selectedProcessIds]);

  const scrollToProcesses = () => {
    const el = document.getElementById("procesos-grid");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-teal-500/30">
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
                      ? "bg-teal-600 hover:bg-teal-500 text-white border-teal-600 shadow-[0_0_20px_rgba(20,184,166,0.2)]"
                      : "bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Mi Selección</span>
                  {selectedProcessIds.size > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-white text-teal-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {selectedProcessIds.size}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0d0d0d] border-white/5 w-full sm:max-w-md p-0 overflow-hidden text-white">
                <div className="h-full flex flex-col p-6 overflow-hidden">
                  <SheetHeader className="mb-2 text-left">
                    <SheetTitle className="text-white text-2xl font-bold flex items-center gap-2">
                      <LayoutGrid className="w-6 h-6 text-teal-400" />
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
                    accentColor="#14b8a6"
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
          style={{ backgroundImage: "url('/gestoria.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/75 to-[#0d0d0d]/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-teal-900/10 blur-[120px] rounded-full" />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            De gestionar expedientes, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
              a liderar tu despacho
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Automatizamos la recopilación de documentos, el control de vencimientos y la atención a tus clientes para que tú te centres en el asesoramiento estratégico.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button size="lg" onClick={scrollToProcesses} className="bg-teal-600 hover:bg-teal-500 text-white h-14 px-8 text-lg gap-2 shadow-[0_0_30px_rgba(20,184,166,0.3)]">
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <LayoutGrid className="w-5 h-5 text-teal-400" />
                <span className="text-teal-400 font-medium tracking-widest uppercase text-xs">Catálogo para Gestorías</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Potencia tu Operativa</h2>
              <p className="text-gray-400">Selecciona los procesos que deseas automatizar. Crea tu ecosistema de gestión inteligente a medida.</p>
            </div>
          </div>

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-white/5 border border-white/5 p-1 h-auto flex flex-wrap justify-center gap-1 sm:gap-2">
                <TabsTrigger
                  value="todos"
                  className="px-4 py-2.5 rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white text-gray-400 text-sm font-medium transition-all"
                >
                  Todos
                </TabsTrigger>
                {gestoriasCategories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="px-4 py-2.5 rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white text-gray-400 text-sm font-medium transition-all"
                  >
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="todos" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gestoriasProcesses.map((process) => (
                  <ProcessCard
                    key={process.id}
                    process={process}
                    accentColor="#14b8a6"
                    sectorSlug="gestorias"
                  />
                ))}
              </div>
            </TabsContent>
            {gestoriasCategories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id} className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {gestoriasProcesses
                    .filter(p => p.categoriaNombre === cat.id)
                    .map((process) => (
                      <ProcessCard
                        key={process.id}
                        process={process}
                        accentColor="#14b8a6"
                    sectorSlug="gestorias"
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
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
                className="text-sm text-teal-400 hover:text-teal-300 hover:bg-teal-500/5 flex items-center gap-2"
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
            <h2 className="text-3xl font-bold mb-12 text-center underline decoration-teal-500/30 underline-offset-8 transition-all hover:decoration-teal-500/60">¿Te resulta familiar el caos administrativo?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Perseguir a los clientes cada mes para que envíen sus facturas y documentos.",
                "Miedo constante a que se pase un plazo fiscal o laboral por un descuido manual.",
                "Atender llamadas y mensajes repetitivos sobre el estado de un trámite.",
                "Invertir horas conciliando extractos bancarios con facturas a mano.",
                "Gestionar altas de empleados y contratos con información incompleta.",
                "Sentir que aportas poco valor real por estar colapsado de tareas administrativas."
              ].map((pain, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-teal-500/20 transition-all hover:translate-y-[-2px] group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  </div>
                  <p className="text-gray-300 leading-relaxed">{pain}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Eficiencia Radical para tu Despacho</h2>
            <p className="text-gray-400">Implementamos tecnología que trabaja mientras tú descansas.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <FileText className="w-8 h-8 text-teal-400" />,
                title: "Documentación sin Fricción",
                desc: "Captura automática de facturas y archivos. Recordatorios inteligentes que \"persiguen\" al cliente por ti de forma profesional."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-teal-400" />,
                title: "Seguridad Jurídica 100%",
                desc: "Control total de vencimientos de contratos, certificados y modelos fiscales. Avisos preventivos automáticos para evitar sanciones."
              },
              {
                icon: <MessageSquare className="w-8 h-8 text-teal-400" />,
                title: "Atención Proactiva",
                desc: "Tus clientes conocen el estado de su expediente 24/7 sin llamarte. Respuesta automática a dudas comunes por WhatsApp."
              }
            ].map((prop, i) => (
              <div key={i} className="text-center space-y-4 group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 group-hover:bg-teal-500/20 group-hover:border-teal-400/30 transition-all duration-300">
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
          <h2 className="text-3xl font-bold mb-12 text-center text-teal-400 flex items-center justify-center gap-3">
             <Search className="w-8 h-8" /> Dudas Frecuentes
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "¿Funciona con el software de gestión que ya uso?",
                a: "Nos conectamos con los principales programas del mercado (A3, Holded, Sage, etc.) o leyendo carpetas compartidas de forma automática. No tienes que cambiar tu forma de trabajar."
              },
              {
                q: "¿Es seguro procesar los datos de mis clientes?",
                a: "Absolutamente. Utilizamos entornos seguros y cumplimos estrictamente con la RGPD. Los datos solo se procesan para las tareas definidas y nunca se utilizan para entrenar modelos públicos."
              },
              {
                q: "¿Qué pasa si mis clientes no son tecnológicos?",
                a: "Nuestro sistema está diseñado para ellos. No necesitan apps complejas; la mayoría de las interacciones se realizan vía WhatsApp o Email con enlaces directos, facilitando la adopción al máximo."
              },
              {
                q: "¿Cómo sé si vale la pena?",
                a: "Miramos dos factores: las horas liberadas de tu equipo administrativo (que pueden dedicar a tareas de mayor valor) y la reducción de fugas de clientes por una mejora radical en la atención."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-teal-500/10 transition-all hover:bg-white/[0.07] group">
                <h3 className="text-lg font-bold mb-2 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
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
        <div className="absolute inset-0 bg-teal-600/5 -z-10" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/10 blur-[100px] rounded-full" />
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            Escala tu Gestión, <br className="hidden md:block" /> Reduce tu Estrés
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Empieza hoy mismo a trabajar de forma más eficiente y a dedicar tu tiempo a lo que realmente aporta valor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setShowContactForm(true)} className="bg-teal-600 hover:bg-teal-500 h-16 px-10 text-xl shadow-[0_0_40px_rgba(20,184,166,0.3)] transition-all hover:scale-105">
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
          <p className="text-gray-600 text-sm">© 2026 Immoralia. Soluciones de Automatización para Gestorías y Despachos.</p>
        </div>
      </footer>

      {/* Overlays / Modals */}
      
      {showContactForm && (
        <ContactForm 
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
          selectedProcesses={selectedProcesses}
          n8nHosting={n8nHosting}
          accentColor="#14b8a6"
        />
      )}

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        prefilledSector="Gestoría"
        accentColor="#14b8a6"
      />

      <ShareSelectionModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        selectedProcesses={selectedProcesses}
        accentColor="#14b8a6"
      />
    </div>
  );
};

export default GestoriasLanding;
