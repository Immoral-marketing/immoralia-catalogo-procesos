import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { processes, categories } from "@/data/processes";
import { ProcessCard } from "@/components/ProcessCard";
import { SelectionSummary } from "@/components/SelectionSummary";
import { ContactForm } from "@/components/ContactForm";
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
import immoraliaLogo from "@/assets/immoralia_logo.png";

const GestoriasLanding = () => {
  const { selectedProcessIds, toggleProcess, n8nHosting, setN8nHosting } = useSelection();
  const [showContactForm, setShowContactForm] = useState(false);

  // Filtrar procesos para Gestorías
  const gestoriasProcesses = useMemo(() => 
    processes.filter(p => p.landing_slug === "gestorias" || (p.sectores?.includes("Gestoria") && !p.landing_slug)),
    []
  );

  const gestoriasCategories = useMemo(() => {
    const catsMap = new Map();
    gestoriasProcesses.forEach(p => {
      if (!catsMap.has(p.categoria)) {
        catsMap.set(p.categoria, p.categoriaNombre);
      }
    });

    // Ordenar categorías según el orden estándar A-F
    return Array.from(catsMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [gestoriasProcesses]);

  const [activeCategory, setActiveCategory] = useState(gestoriasCategories[0]?.id || "");

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
            <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">
              Ver Catálogo Completo
            </Link>
            <Button onClick={scrollToProcesses} className="bg-cyan-600 hover:bg-cyan-500 text-white border-none shadow-[0_0_20px_rgba(8,145,178,0.2)]">
              Ver Soluciones
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-cyan-900/10 blur-[120px] rounded-full -z-10" />
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap className="w-3 h-3 text-cyan-400" /> ESPECIAL GESTORÍAS Y DESPACHOS
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            De gestionar expedientes, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              a liderar tu despacho
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Automatizamos la recopilación de documentos, el control de vencimientos y la atención a tus clientes para que tú te centres en el asesoramiento estratégico.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button size="lg" onClick={scrollToProcesses} className="bg-cyan-600 hover:bg-cyan-500 text-white h-14 px-8 text-lg gap-2 shadow-[0_0_30px_rgba(8,145,178,0.3)]">
              Configurar mi sistema <ChevronRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.open('https://calendly.com/immoralia/30min', '_blank')} className="border-white/10 hover:bg-white/5 h-14 px-8 text-lg">
              Agendar Auditoría Gratuita
            </Button>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center underline decoration-cyan-500/30 underline-offset-8 transition-all hover:decoration-cyan-500/60">¿Te resulta familiar el caos administrativo?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Perseguir a los clientes cada mes para que envíen sus facturas y documentos.",
                "Miedo constante a que se pase un plazo fiscal o laboral por un descuido manual.",
                "Atender llamadas y mensajes repetitivos sobre el estado de un trámite.",
                "Invertir horas conciliando extractos bancarios con facturas a mano.",
                "Gestionar altas de empleados y contratos con información incompleta.",
                "Sentir que aportas poco valor real por estar colapsado de tareas administrativas."
              ].map((pain, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-all hover:translate-y-[-2px] group">
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
                icon: <FileText className="w-8 h-8 text-cyan-400" />,
                title: "Documentación sin Fricción",
                desc: "Captura automática de facturas y archivos. Recordatorios inteligentes que \"persiguen\" al cliente por ti de forma profesional."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-cyan-400" />,
                title: "Seguridad Jurídica 100%",
                desc: "Control total de vencimientos de contratos, certificados y modelos fiscales. Avisos preventivos automáticos para evitar sanciones."
              },
              {
                icon: <MessageSquare className="w-8 h-8 text-cyan-400" />,
                title: "Atención Proactiva",
                desc: "Tus clientes conocen el estado de su expediente 24/7 sin llamarte. Resolución de dudas comunes vía WhatsApp con IA."
              }
            ].map((prop, i) => (
              <div key={i} className="text-center space-y-4 group">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/30 transition-all duration-300">
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
                  <span className="text-cyan-400 font-medium tracking-widest uppercase text-xs">Catálogo para Gestorías</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Potencia tu Operativa</h2>
                <p className="text-gray-400">Selecciona los procesos que deseas automatizar. Crea tu ecosistema de gestión inteligente a medida.</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Tu selección</p>
                  <p className="text-lg font-bold text-cyan-400">{selectedProcessIds.size} procesos</p>
                </div>
                <Button 
                  onClick={() => setShowContactForm(true)}
                  disabled={selectedProcessIds.size === 0}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 h-12 px-6 shadow-lg shadow-cyan-900/20 transition-all active:scale-95"
                >
                  Confirmar selección <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="bg-white/5 border border-white/5 p-1 h-auto flex flex-wrap justify-center gap-1 sm:gap-2">
                  {gestoriasCategories.map((cat) => (
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

              {gestoriasCategories.map((cat) => (
                <TabsContent key={cat.id} value={cat.id} className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {gestoriasProcesses
                      .filter(p => p.categoria === cat.id)
                      .map((process) => (
                        <ProcessCard
                          key={process.id}
                          process={process}
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
          <h2 className="text-3xl font-bold mb-12 text-center text-cyan-400 flex items-center justify-center gap-3">
             <Search className="w-8 h-8" /> Dudas Frecuentes
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "¿Cómo se integran estas automatizaciones con mi ERP actual?",
                a: "Trabajamos con las APIs de los principales softwares del mercado (A3, Holded, Sage, etc.) o mediante la lectura automática de carpetas compartidas. No tienes que cambiar tu forma de trabajar, solo potenciarla."
              },
              {
                q: "¿Es seguro procesar datos de clientes con IA?",
                a: "Absolutamente. Utilizamos entornos seguros y cumplimos estrictamente con la RGPD. Los datos solo se procesan para las tareas definidas y nunca se utilizan para entrenar modelos públicos."
              },
              {
                q: "¿Qué pasa si mis clientes no son tecnológicos?",
                a: "Nuestro sistema está diseñado para ellos. No necesitan apps complejas; la mayoría de las interacciones se realizan vía WhatsApp o Email con enlaces directos, facilitando la adopción al máximo."
              },
              {
                q: "¿Cómo calculo el retorno de inversión (ROI)?",
                a: "Miramos dos factores: las horas liberadas de tu equipo administrativo (que pueden dedicar a tareas de mayor valor) y la reducción de fugas de clientes por una mejora radical en la atención."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/10 transition-all hover:bg-white/[0.07] group">
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
      <section className="py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-cyan-600/5 -z-10" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full" />
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            Escala tu Gestión, <br className="hidden md:block" /> Reduce tu Estrés
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Únete a la nueva generación de despachos inteligentes. Empieza hoy mismo tu transformación digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setShowContactForm(true)} className="bg-cyan-600 hover:bg-cyan-500 h-16 px-10 text-xl shadow-[0_0_40px_rgba(8,145,178,0.3)] transition-all hover:scale-105">
              Solicitar Plan Personalizado
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 text-xl border-white/10 hover:bg-white/5" onClick={() => window.open('https://calendly.com/immoralia/30min', '_blank')}>
              Hablar con un Experto
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
                <span className="font-bold text-white tracking-wide uppercase text-sm">Tu Configuración</span>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#0d0d0d] border-white/5 w-full sm:max-w-md p-0 overflow-hidden text-white">
            <div className="h-full flex flex-col p-6 overflow-hidden">
              <SheetHeader className="mb-2 text-left">
                <SheetTitle className="text-white text-2xl font-bold flex items-center gap-2">
                  <LayoutGrid className="w-6 h-6 text-cyan-400" />
                  Procesos Seleccionados
                </SheetTitle>
              </SheetHeader>
              <SelectionSummary 
                variant="drawer"
                onContact={() => setShowContactForm(true)}
                n8nHosting={n8nHosting}
                onHostingChange={setN8nHosting}
                className="flex-1 overflow-hidden"
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
        />
      )}
    </div>
  );
};

export default GestoriasLanding;
