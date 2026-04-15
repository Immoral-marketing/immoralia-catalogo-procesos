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
  GraduationCap,
  BookOpen,
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

const AcademiasLanding = () => {
  const { selectedProcessIds, n8nHosting, setN8nHosting } = useSelection();
  const [showContactForm, setShowContactForm] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Immoralia - Catálogo de Procesos - Academias";
    const timer = setTimeout(() => {
      if (!isOnboardingCompleted()) {
        setShowOnboarding(true);
      }
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  // Filtrar procesos para Academias / Formación
  const academiasProcesses = useMemo(() => 
    processes.filter(p => p.landing_slug === "academias" || p.sectores?.includes("Academias / Formación")),
    []
  );

  const academiasCategories = useMemo(() => {
    const catsMap = new Map();
    academiasProcesses.forEach(p => {
      if (!catsMap.has(p.categoriaNombre)) {
        catsMap.set(p.categoriaNombre, p.categoriaNombre);
      }
    });
    return Array.from(catsMap.entries()).map(([id, name]) => ({ id, name }));
  }, [academiasProcesses]);

  const [activeCategory, setActiveCategory] = useState("todos");

  const selectedProcesses = useMemo(() => {
    return processes.filter(p => selectedProcessIds.has(p.id));
  }, [selectedProcessIds]);

  const scrollToProcesses = () => {
    const el = document.getElementById("procesos-grid");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-violet-500/30 font-sans">
      {/* Navigation / Header */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/">
            <img src={immoraliaLogo} alt="Immoralia" className="h-8 transition-opacity hover:opacity-80" />
          </Link>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowOnboarding(true)} 
              className="text-sm text-violet-400 hover:text-violet-300 hover:bg-violet-500/5 hidden md:flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Personalizar Catálogo
            </Button>
            <Link to="/catalogo/completo" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">
              Ver Catálogo Completo
            </Link>
            <Button onClick={scrollToProcesses} className="bg-violet-600 hover:bg-violet-500 text-white border-none font-bold shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              Ver Soluciones
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-violet-900/10 blur-[120px] rounded-full -z-10" />
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            De gestionar clases, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">
              a escalar tu centro educativo
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Automatizamos la matriculación, el seguimiento de alumnos y la atención 24/7 para que tú te centres en la enseñanza.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button size="lg" onClick={scrollToProcesses} className="bg-violet-600 hover:bg-violet-500 text-white h-14 px-8 text-lg gap-2 font-bold shadow-lg shadow-violet-900/20 transition-all hover:scale-105">
              Seleccionar mis procesos <ChevronRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.open('https://calendly.com/david-immoral/30min', '_blank')} className="border-white/10 hover:bg-white/5 h-14 px-8 text-lg hover:text-white">
              Agendar llamada
            </Button>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center underline decoration-violet-500/30 underline-offset-8 transition-all hover:decoration-violet-500/60">¿Te Resulta Familiar?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Atender WhatsApps a deshoras por consultas de horarios o precios.",
                "Alumnos que olvidan sus clases de prueba o tutorías.",
                "Gestionar cobros y devoluciones manualmente cada mes.",
                "Perder alumnos interesados por no responder a tiempo.",
                "Carga administrativa excesiva en la matriculación de nuevos cursos.",
                "Dificultad para mantener informados a padres y alumnos de cambios."
              ].map((pain, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-violet-500/20 transition-all hover:translate-y-[-2px] group">
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
            <p className="text-gray-400">Transformamos tu operativa educativa para que sea escalable y eficiente.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <MessageSquare className="w-8 h-8 text-violet-400" />,
                title: "Secretaría 24/7",
                desc: "Resuelve dudas frecuentes y gestiona pruebas de nivel automáticamente, incluso cuando la academia está cerrada."
              },
              {
                icon: <Calendar className="w-8 h-8 text-violet-400" />,
                title: "Asistencia Garantizada",
                desc: "Recordatorios y confirmaciones que reducen el absentismo en clases de prueba y tutorías hasta en un 80%."
              },
              {
                icon: <Zap className="w-8 h-8 text-violet-400" />,
                title: "Cobros sin Fricción",
                desc: "Automatiza la facturación recurrente y el seguimiento de impagos para centrarte en el éxito de tus alumnos."
              }
            ].map((prop, i) => (
              <div key={i} className="text-center space-y-4 group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 group-hover:bg-violet-500/20 group-hover:border-violet-400/30 transition-all duration-300">
                  {prop.icon}
                </div>
                <h3 className="text-xl font-bold">{prop.title}</h3>
                <p className="text-gray-400 leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processes Grid Section */}
      <section id="procesos-grid" className="py-24 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <LayoutGrid className="w-5 h-5 text-violet-400" />
                  <span className="text-violet-400 font-medium tracking-widest uppercase text-xs">CATÁLOGO ESPECIALIZADO</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Selecciona tus Soluciones</h2>
                <p className="text-gray-400">Elige los procesos que quieres automatizar en tu academia. Añade tantos como necesites a tu selección.</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Tu selección</p>
                  <p className="text-lg font-bold text-violet-400">{selectedProcessIds.size} procesos</p>
                </div>
                <Button 
                  onClick={() => setShowContactForm(true)}
                  disabled={selectedProcessIds.size === 0}
                  className="bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 h-12 px-6 font-bold shadow-lg shadow-violet-900/20 transition-all active:scale-95"
                >
                  Continuar selección <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="bg-white/5 border border-white/5 p-1 h-auto flex flex-wrap justify-center gap-1 sm:gap-2">
                  <TabsTrigger
                    value="todos"
                    className="px-4 py-2.5 rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white text-gray-400 text-sm font-medium transition-all"
                  >
                    Todos
                  </TabsTrigger>
                  {academiasCategories.map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className="px-4 py-2.5 rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white text-gray-400 text-sm font-medium transition-all"
                    >
                      {cat.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="todos" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {academiasProcesses.map((process) => (
                    <ProcessCard
                      key={process.id}
                      process={process}
                      accentColor="#7c3aed"
                    />
                  ))}
                </div>
              </TabsContent>
              {academiasCategories.map((cat) => (
                <TabsContent key={cat.id} value={cat.id} className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {academiasProcesses
                      .filter(p => p.categoriaNombre === cat.id)
                      .map((process) => (
                        <ProcessCard
                          key={process.id}
                          process={process}
                          accentColor="#7c3aed"
                        />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-bold mb-12 text-center text-violet-400 flex items-center justify-center gap-3">
            <Search className="w-8 h-8" /> Preguntas Frecuentes
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "¿Se integra con mi software de gestión de alumnos?",
                a: "Sí, podemos conectar con las plataformas de gestión educativa más habituales o usar automatizaciones para sincronizar calendarios y bases de datos."
              },
              {
                q: "¿Puede el sistema realizar pruebas de nivel?",
                a: "Podemos configurar preguntas automáticas iniciales que clasifiquen al alumno según sus respuestas, ahorrando tiempo al profesor en la primera toma de contacto."
              },
              {
                q: "¿Cómo responde el sistema a las preguntas sobre precios?",
                a: "El sistema consulta tu catálogo de cursos y ofrece la información detallada según lo que pida el usuario, pudiendo incluso enviar folletos en PDF automáticamente."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/10 transition-all hover:bg-white/[0.07] group">
                <h3 className="text-lg font-bold mb-2 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
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
        <div className="absolute inset-0 bg-violet-600/5 -z-10" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-500/10 blur-[100px] rounded-full" />
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            ¿Listo para escalar <br /> tu academia?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Deja de perder tiempo en administración y empieza a construir un centro educativo de vanguardia. Pide tu consultoría estratégica gratuita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setShowContactForm(true)} className="bg-violet-600 hover:bg-violet-500 h-16 px-10 text-xl font-bold shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all hover:scale-105">
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
          <p className="text-gray-600 text-sm">© 2026 Immoralia. Soluciones de Automatización para Academias & Formación.</p>
        </div>
      </footer>

      {/* Overlays / Modals */}
      {selectedProcessIds.size > 0 && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="fixed bottom-8 left-8 z-50 h-14 pl-4 pr-6 rounded-full bg-violet-600 hover:bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.4)] border-none group transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-left-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <LayoutGrid className="w-6 h-6 text-white" />
                  <span className="absolute -top-2 -right-2 bg-white text-violet-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-violet-600">
                    {selectedProcessIds.size}
                  </span>
                </div>
                <span className="font-bold text-white tracking-wide uppercase text-sm">Mi Selección</span>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#0d0d0d] border-white/5 w-full sm:max-w-md p-0 overflow-hidden text-white">
            <div className="h-full flex flex-col p-6 overflow-hidden">
              <SheetHeader className="mb-2 text-left">
                <SheetTitle className="text-white text-2xl font-bold flex items-center gap-2">
                  <LayoutGrid className="w-6 h-6 text-violet-400" />
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
                accentColor="#7c3aed"
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      {showContactForm && (
        <ContactForm 
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
          selectedProcesses={selectedProcesses}
          n8nHosting={n8nHosting}
          accentColor="#7c3aed"
        />
      )}

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        prefilledSector="Academias / Formación"
        accentColor="#7c3aed"
      />

      <ShareSelectionModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        selectedProcesses={selectedProcesses}
        accentColor="#7c3aed"
      />
    </div>
  );
};

export default AcademiasLanding;
