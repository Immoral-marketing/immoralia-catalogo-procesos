import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { processes, categories } from "@/data/processes";
import { ProcessCard } from "@/components/ProcessCard";
import { SelectionSummary } from "@/components/SelectionSummary";
import { ContactForm } from "@/components/ContactForm";
import { OnboardingModal } from "@/components/OnboardingModal";
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
import { isOnboardingCompleted, getOnboardingAnswers } from "@/lib/onboarding-utils";
import immoraliaLogo from "@/assets/immoralia_logo.png";

const SportsLanding = () => {
  const { selectedProcessIds, toggleProcess, n8nHosting, setN8nHosting } = useSelection();
  const [showContactForm, setShowContactForm] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Popup after 15 seconds if onboarding not completed
    const timer = setTimeout(() => {
      if (!isOnboardingCompleted()) {
        setShowOnboarding(true);
      }
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  // Filtrar procesos para Centros Deportivos
  const sportsProcesses = useMemo(() => 
    processes.filter(p => p.landing_slug === "centros-deportivos"),
    []
  );

  const sportsCategories = useMemo(() => {
    const catsMap = new Map();
    sportsProcesses.forEach(p => {
      if (!catsMap.has(p.categoria)) {
        catsMap.set(p.categoria, p.categoriaNombre);
      }
    });
    return Array.from(catsMap.entries()).map(([id, name]) => ({ id, name }));
  }, [sportsProcesses]);

  const [activeCategory, setActiveCategory] = useState(sportsCategories[0]?.id || "");

  const selectedProcesses = useMemo(() => {
    return processes.filter(p => selectedProcessIds.has(p.id));
  }, [selectedProcessIds]);

  const scrollToProcesses = () => {
    const el = document.getElementById("procesos-grid");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-cyan-500/30">
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
              className="text-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/5 hidden md:flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Personalizar Catálogo
            </Button>
            <Link to="/catalogo/completo" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">
              Ver Catálogo Completo
            </Link>
            <Button onClick={scrollToProcesses} className="bg-cyan-600 hover:bg-cyan-500 text-white border-none">
              Ver Soluciones
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-cyan-900/10 blur-[120px] rounded-full -z-10" />
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            De gestionar tu centro deportivo, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              a liderar tu negocio
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Automatizamos la captación, las reservas y el seguimiento de tus alumnos para que tú te centres en lo que importa: su progreso.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button size="lg" onClick={scrollToProcesses} className="bg-cyan-600 hover:bg-cyan-500 text-white h-14 px-8 text-lg gap-2">
              Seleccionar mis procesos <ChevronRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.open('https://calendly.com/david-immoral/30min', '_blank')} className="border-white/10 hover:bg-white/5 h-14 px-8 text-lg">
              Agendar Videollamada
            </Button>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">¿Te Resulta Familiar?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Atender WhatsApps a deshoras por reservas y cancelaciones.",
                "Socios que no aparecen por el centro y acaban dándose de baja.",
                "Perder leads de pruebas gratuitas por falta de seguimiento.",
                "Gestionar cobros e impagos manualmente cada principio de mes.",
                "Invertir horas en Excel para saber cuántas clases se han dado.",
                "Informar a todos los alumnos de un cambio de horario/profesor."
              ].map((pain, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingDown className="w-5 h-5 text-red-400" />
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
            <p className="text-gray-400">Transformamos tu operativa para que sea una ventaja competitiva.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Users className="w-8 h-8 text-cyan-400" />,
                title: "Captación 24/7",
                desc: "Tus formularios y redes sociales trabajan solos. Los leads entran, se etiquetan y reciben su secuencia de bienvenida al instante."
              },
              {
                icon: <Clock className="w-8 h-8 text-cyan-400" />,
                title: "Ahorro del 80% de Tiempo",
                desc: "Elimina las tareas administrativas repetitivas. Reservas, cancelaciones y recordatorios se gestionan sin intervención humana."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-cyan-400" />,
                title: "Retención Inteligente",
                desc: "Detectamos cuando un alumno deja de asistir antes de que él mismo sepa que quiere darse de baja, activando flujos de rescate."
              }
            ].map((prop, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
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
                  <LayoutGrid className="w-5 h-5 text-cyan-400" />
                  <span className="text-cyan-400 font-medium">CATÁLOGO ESPECIALIZADO</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Selecciona tus Soluciones</h2>
                <p className="text-gray-400">Elige los procesos que quieres automatizar en tu centro. Añade tantos como necesites a tu selección.</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Tu selección</p>
                  <p className="text-lg font-bold text-cyan-400">{selectedProcessIds.size} procesos</p>
                </div>
                <Button 
                  onClick={() => setShowContactForm(true)}
                  disabled={selectedProcessIds.size === 0}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 h-12 px-6"
                >
                  Continuar selección <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="bg-white/5 border border-white/5 p-1 h-auto flex flex-wrap justify-center gap-1 sm:gap-2">
                  {sportsCategories.map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className="px-4 py-2.5 rounded-lg data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-400 text-sm font-medium transition-all"
                    >
                      {cat.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {sportsCategories.map((cat) => (
                <TabsContent key={cat.id} value={cat.id} className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sportsProcesses
                      .filter(p => p.categoria === cat.id)
                      .map((process) => (
                        <ProcessCard
                          key={process.id}
                          process={process}
                          accentColor="#0891b2"
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
          <h2 className="text-3xl font-bold mb-12 text-center text-cyan-400">Preguntas Frecuentes</h2>
          <div className="space-y-6">
            {[
              {
                q: "¿Es necesario cambiar mi software actual (Mindbody, Virtuagym, etc)?",
                a: "No. En Immoralia nos integramos con tu software actual a través de sus APIs o conectores. Nuestro objetivo es potenciar lo que ya tienes, no sustituirlo."
              },
              {
                q: "¿Cuánto tiempo se tarda en implementar estas automatizaciones?",
                a: "Depende de la complejidad, pero procesos como el lead capture o secuencias de bienvenida pueden estar listos en menos de 7 días."
              },
              {
                q: "¿Qué herramientas necesito contratar?",
                a: "Nosotros te recomendaremos el stack mínimo viable según tu volumen (normalmente herramientas como Make.com o ActiveCampaign). Te ayudamos a optimizar costes."
              },
              {
                q: "¿Cómo se mide el éxito de la automatización?",
                a: "Miramos métricas claras: horas ahorradas en recepción, reducción de la tasa de churn (bajas) y aumento en el ratio de conversión de leads a socios."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <h3 className="text-lg font-bold mb-2 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-gray-400 ml-8 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-600/10 -z-10" />
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            ¿Listo para llevar tu centro <br /> al siguiente nivel?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Deja de apagar fuegos y empieza a construir un negocio que funcione solo. Pide tu presupuesto personalizado sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setShowContactForm(true)} className="bg-cyan-600 hover:bg-cyan-500 h-16 px-10 text-xl shadow-[0_0_40px_rgba(8,145,178,0.3)]">
              Solicitar Oferta Ahora
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 text-xl border-white/10" onClick={() => window.open('https://calendly.com/david-immoral/30min', '_blank')}>
              Agendar Llamada
            </Button>
          </div>
        </div>
      </section>

      {/* Footnote */}
      <footer className="py-12 border-t border-white/5 bg-black/50">
        <div className="container mx-auto px-6 text-center">
          <img src={immoraliaLogo} alt="Immoralia" className="h-6 mx-auto mb-6 opacity-30 grayscale" />
          <p className="text-gray-600 text-sm">© 2026 Immoralia. Catálogo de Procesos para Centros Deportivos.</p>
        </div>
      </footer>

      {/* Overlays / Modals */}
      {selectedProcessIds.size > 0 && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="fixed bottom-8 left-8 z-50 h-14 pl-4 pr-6 rounded-full bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.4)] border-none group transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-left-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <LayoutGrid className="w-6 h-6 text-white" />
                  <span className="absolute -top-2 -right-2 bg-white text-cyan-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-cyan-600">
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
                  <LayoutGrid className="w-6 h-6 text-cyan-400" />
                  Mi Selección
                </SheetTitle>
              </SheetHeader>
              <SelectionSummary 
                variant="drawer"
                onContact={() => setShowContactForm(true)}
                n8nHosting={n8nHosting}
                onHostingChange={setN8nHosting}
                className="flex-1 overflow-hidden"
                accentColor="#0891b2"
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
          accentColor="#0891b2"
        />
      )}

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        prefilledSector="Centros Deportivos"
        accentColor="#0891b2"
      />
    </div>
  );
};

export default SportsLanding;
