import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { processes } from "@/data/processes";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Check, Play, LayoutGrid, Zap, Clock, MessageSquare, Info, Star, Settings2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSelection } from "@/lib/SelectionContext";
import { ContactForm } from "@/components/ContactForm";
import { OnboardingModal } from "@/components/OnboardingModal";
import { CalendlyLeadModal } from "@/components/CalendlyLeadModal";
import { ProcessCard } from "@/components/ProcessCard";
import { getOnboardingAnswers, OnboardingAnswers } from "@/lib/onboarding-utils";
import { computeFinalComplexity } from "@/lib/complexity-utils";
import immoraliaLogo from "@/assets/immoralia_logo.png";

const ProcessDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { selectedProcessIds, toggleProcess, n8nHosting, setN8nHosting } = useSelection();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);


    const process = processes.find((p) => p.slug === slug);

    if (!process) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold mb-4">Proceso no encontrado</h1>
                <p className="text-muted-foreground mb-8">El proceso que buscas no existe o ha sido movido.</p>
                <Button onClick={() => navigate("/")}>Volver al catálogo</Button>
            </div>
        );
    }

    const isSelected = selectedProcessIds.has(process.id);

    const [showContactForm, setShowContactForm] = useState(false);
    const [showCalendlyModal, setShowCalendlyModal] = useState(false);
    const [onboardingOpen, setOnboardingOpen] = useState(false);
    const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers | null>(getOnboardingAnswers());
    const [activeSection, setActiveSection] = useState("resumen");

    const finalComplexity = computeFinalComplexity(process, onboardingAnswers);

    useEffect(() => {
        const sections = ["resumen", "funcionamiento", "personalizacion", "demo", "faqs", "relacionados"];
        const observers = sections.map(id => {
            const element = document.getElementById(id);
            if (!element) return null;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setActiveSection(id);
                        }
                    });
                },
                {
                    rootMargin: "-15% 0px -65% 0px",
                    threshold: 0
                }
            );

            observer.observe(element);
            return observer;
        });

        // Special observer for the last visible section to highlight when near bottom
        const presentSections = sections.filter(id => !!document.getElementById(id));
        const lastSectionId = presentSections[presentSections.length - 1];
        const lastElement = lastSectionId ? document.getElementById(lastSectionId) : null;
        let bottomObserver: IntersectionObserver | null = null;

        if (lastElement) {
            bottomObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        // If we are at the bottom of the page, the last present section should be active
                        // Use a slightly larger margin for detections at the bottom
                        if (entry.isIntersecting && window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
                            setActiveSection(lastSectionId);
                        }
                    });
                },
                { threshold: 0.1 }
            );
            bottomObserver.observe(lastElement);
        }

        return () => {
            observers.forEach(o => o?.disconnect());
            bottomObserver?.disconnect();
        };
    }, [process]);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            setActiveSection(id);
            const offset = 150; // Sticky header + tabs offset
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    const toggleSelect = () => {
        toggleProcess(process.id);
    };

    const relatedProcesses = (process.related_processes || [])
        .map(slug => processes.find(p => p.slug === slug))
        .filter((p): p is typeof processes[0] => !!p);

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 md:py-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="hidden md:flex gap-2 text-muted-foreground hover:text-foreground">
                                <ChevronLeft className="w-4 h-4" /> Volver al catálogo
                            </Button>
                            <img src={immoraliaLogo} alt="Immoralia" className="h-8 md:h-10" />
                        </div>

                        <div className="flex md:hidden">
                            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                                <LayoutGrid className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 pb-[80vh]">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb (Desktop) */}
                    <nav className="mb-8 hidden md:block">
                        <ol className="flex text-sm text-muted-foreground gap-2">
                            <li className="hover:text-foreground cursor-pointer" onClick={() => navigate("/")}>Catálogo</li>
                            <li>/</li>
                            <li>{process.categoriaNombre}</li>
                            <li>/</li>
                            <li className="text-foreground font-medium">{process.nombre}</li>
                        </ol>
                    </nav>

                    <div className="grid lg:grid-cols-[1fr,350px] gap-12">
                        {/* Left Column: Content */}
                        <div className="space-y-12">
                            {/* HERO SECTION */}
                            <section className="space-y-6">
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-semibold border border-secondary/20">
                                        {process.categoriaNombre}
                                    </span>
                                    {process.badges?.map(badge => (
                                        <span key={badge} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-primary" /> {badge}
                                        </span>
                                    ))}
                                </div>

                                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{process.nombre}</h1>
                                <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
                                    {process.one_liner || process.tagline}
                                </p>

                                <ul className="grid gap-3 pt-4">
                                    {(process.benefits || process.pasos.slice(0, 3)).map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-3 text-lg text-muted-foreground italic">
                                            <div className="mt-1.5 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-primary" />
                                            </div>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-wrap gap-4 pt-4 md:hidden">
                                    <Button onClick={toggleSelect} size="lg" className={`flex-1 ${isSelected ? 'bg-secondary hover:bg-secondary/90' : 'bg-primary hover:bg-primary/90'}`}>
                                        {isSelected ? <Check className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
                                        {isSelected ? "Añadido" : "Añadir a mi selección"}
                                    </Button>
                                </div>
                            </section>

                            {/* TABS NAVIGATION (Sticky) */}
                            <div className="sticky top-24 z-30 bg-background/80 backdrop-blur-md border-b border-border -mx-4 px-4 overflow-x-auto">
                                <div className="flex gap-8 whitespace-nowrap min-w-min">
                                    {[
                                        { id: "resumen", label: "Resumen" },
                                        { id: "funcionamiento", label: "Cómo funciona" },
                                        { id: "personalizacion", label: "Personalización", show: process.customization?.options_blocks && process.customization.options_blocks.length > 0 },
                                        { id: "demo", label: "Demo", show: process.demo?.video_url },
                                        { id: "faqs", label: "FAQs", show: process.faqs && process.faqs.length > 0 },
                                        { id: "relacionados", label: "Relacionados", show: relatedProcesses.length > 0 },
                                    ].map((tab) => (
                                        (tab.show !== false) && (
                                            <a
                                                key={tab.id}
                                                href={`#${tab.id}`}
                                                onClick={(e) => scrollToSection(e, tab.id)}
                                                className={cn(
                                                    "py-4 border-b-2 transition-all duration-200",
                                                    activeSection === tab.id
                                                        ? "border-primary text-foreground font-medium"
                                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                {tab.label}
                                            </a>
                                        )
                                    ))}
                                </div>
                            </div>

                            {/* SECTION: Resumen */}
                            <section id="resumen" className="scroll-mt-48 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold">Qué hace</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {process.summary?.what_it_is || process.descripcionDetallada}
                                        </p>
                                    </div>
                                    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-secondary" /> Resultado final
                                        </h3>
                                        <div className="p-4 rounded-xl bg-background/50 border border-primary/10">
                                            <p className="text-sm font-medium text-foreground">{process.summary?.output || "Automatización completa del proceso."}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            {process.indicators?.integrations.map(tool => (
                                                <span key={tool} className="px-2 py-1 rounded-md bg-muted text-muted-foreground">{tool}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-3 gap-6">
                                    <div className="bg-card/50 border border-border rounded-xl p-4 flex flex-col items-center text-center gap-2">
                                        <Clock className="w-6 h-6 text-primary" />
                                        <span className="text-sm text-muted-foreground">Implementación</span>
                                        <span className="font-semibold">{finalComplexity.timeEstimate}</span>
                                    </div>
                                    {(finalComplexity.complexity as any) !== "N/A" && (
                                        <div className="bg-card/50 border border-border rounded-xl p-4 flex flex-col items-center text-center gap-2">
                                            <Settings2 className="w-6 h-6 text-primary" />
                                            <span className="text-sm text-muted-foreground">Complejidad</span>
                                            <span className="font-semibold">{finalComplexity.complexity}</span>
                                        </div>
                                    )}
                                    {(process.indicators?.integrations && process.indicators.integrations.length > 0 && process.id !== "F25") && (
                                        <div className="bg-card/50 border border-border rounded-xl p-4 flex flex-col items-center text-center gap-2">
                                            <MessageSquare className="w-6 h-6 text-primary" />
                                            <span className="text-sm text-muted-foreground">Integraciones</span>
                                            <span className="font-semibold">{process.indicators.integrations.length} herramientas</span>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* SECTION: Funcionamiento */}
                            <section id="funcionamiento" className="scroll-mt-48 space-y-8">
                                <h3 className="text-3xl font-bold">Cómo funciona</h3>
                                <div className="relative space-y-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                                    {(process.how_it_works_steps || process.pasos.map(p => ({ title: p, short: p }))).map((step: any, i) => (
                                        <div key={i} className="relative pl-12 group">
                                            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center font-bold text-sm z-10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                {i + 1}
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-xl font-bold">{step.title}</h4>
                                                <p className="text-muted-foreground">{step.detail || step.short}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* SECTION: Personalizacion */}
                            {process.customization?.options_blocks && process.customization.options_blocks.length > 0 && (
                                <section id="personalizacion" className="scroll-mt-48 space-y-8">
                                    <h3 className="text-3xl font-bold">Personalización</h3>
                                    <div className="bg-card border border-border rounded-2xl p-8 space-y-8">
                                        <div className="grid md:grid-cols-2 gap-12">
                                            {process.customization.options_blocks.map((block, i) => (
                                                <div key={i} className="space-y-4">
                                                    <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{block.label}</label>
                                                    <div className="grid gap-2">
                                                        {block.options.map((opt: string) => (
                                                            <div key={opt} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors bg-background/50">
                                                                <div className="w-4 h-4 rounded-full border-2 border-primary" />
                                                                <span className="text-sm font-medium">{opt}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Necesidades específicas</label>
                                            <textarea
                                                placeholder={process.customization.free_text_placeholder || "Describe aquí cualquier particularidad de tu negocio..."}
                                                className="w-full h-32 bg-background border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* SECTION: Demo */}
                            {process.demo?.video_url && (
                                <section id="demo" className="scroll-mt-48 space-y-8">
                                    <h3 className="text-3xl font-bold">Demo del proceso</h3>
                                    {process.demo.video_url === "PENDING" ? (
                                        <div className="aspect-video rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-6 p-8 text-center group transition-all duration-300 hover:border-primary/40 hover:bg-primary/10">
                                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse group-hover:scale-110 transition-transform">
                                                <Play className="w-10 h-10 text-primary fill-primary" />
                                            </div>
                                            <div className="max-w-md space-y-2">
                                                <h4 className="text-xl font-bold">Video en preparación</h4>
                                                <p className="text-muted-foreground">Estamos puliendo los últimos detalles de esta demo. Estará disponible muy pronto para que veas la magia en acción.</p>
                                            </div>
                                            <Badge variant="secondary" className="px-4 py-1 text-sm">Próximamente</Badge>
                                        </div>
                                    ) : (
                                        <div className="aspect-video rounded-3xl overflow-hidden border border-border bg-black shadow-2xl relative group">
                                            <iframe
                                                src={process.demo.video_url}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* SECTION: FAQs */}
                            {process.faqs && process.faqs.length > 0 && (
                                <section id="faqs" className="scroll-mt-48 space-y-8">
                                    <h3 className="text-3xl font-bold">Preguntas frecuentes</h3>
                                    <div className="space-y-4">
                                        {process.faqs.map((faq, i) => (
                                            <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-3">
                                                <h4 className="font-bold text-lg flex items-center gap-2">
                                                    <Info className="w-5 h-5 text-primary" /> {faq.q}
                                                </h4>
                                                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* SECTION: Related Processes */}
                            {relatedProcesses.length > 0 && (
                                <section id="relacionados" className="scroll-mt-48 space-y-8 pb-12">
                                    <h3 className="text-3xl font-bold">Procesos relacionados</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {relatedProcesses.map((p) => (
                                            <ProcessCard key={p.id} process={p} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Right Column: Sticky Sidebar (Desktop) */}
                        <aside className="hidden lg:block relative">
                            <div className="sticky top-32 space-y-6">
                                <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-xl">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold">Tu selección</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Añade este proceso a tu selección para solicitar una oferta personalizada sin compromiso.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <Button
                                            onClick={toggleSelect}
                                            size="lg"
                                            className={`w-full py-8 text-lg font-bold transition-all duration-300 ${isSelected
                                                ? 'bg-secondary hover:bg-secondary/90 shadow-secondary/20 shadow-lg'
                                                : 'bg-primary hover:bg-primary/90 shadow-primary/20 shadow-lg'
                                                }`}
                                        >
                                            {isSelected ? <Check className="mr-2 h-6 w-6" /> : <Plus className="mr-2 h-6 w-6" />}
                                            {isSelected ? "Seleccionado" : "Añadir a mi selección"}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full py-6"
                                            onClick={() => setShowContactForm(true)}
                                            disabled={selectedProcessIds.size === 0 && !isSelected}
                                        >
                                            Solicitar oferta
                                        </Button>
                                    </div>

                                    <div className="pt-6 border-t border-border space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Procesos en tu lista:</span>
                                            <span className="font-bold">{selectedProcessIds.size}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center space-y-4">
                                    <h4 className="font-bold">¿No es exactamente lo que buscas?</h4>
                                    <p className="text-sm text-muted-foreground">Personalizamos cada flujo a tus necesidades reales.</p>
                                    <Button variant="link" className="text-primary font-bold" onClick={() => setShowCalendlyModal(true)}>Agendar llamada ←</Button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* Modals */}
            <ContactForm
                isOpen={showContactForm}
                onClose={() => setShowContactForm(false)}
                selectedProcesses={processes.filter(p => selectedProcessIds.has(p.id))}
                n8nHosting={n8nHosting}
                onOpenOnboarding={() => {
                    setShowContactForm(false);
                    setOnboardingOpen(true);
                }}
            />

            <OnboardingModal
                isOpen={onboardingOpen}
                onClose={() => {
                    setOnboardingOpen(false);
                    setOnboardingAnswers(getOnboardingAnswers());
                }}
                initialAnswers={onboardingAnswers}
            />

            <CalendlyLeadModal
                isOpen={showCalendlyModal}
                onClose={() => setShowCalendlyModal(false)}
            />

            {/* Sticky Mobile Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-4 z-50 md:hidden flex gap-4 items-center">
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Estado</p>
                    <p className="font-bold">{isSelected ? "Añadido" : "No añadido"}</p>
                </div>
                <Button onClick={toggleSelect} className={`${isSelected ? 'bg-secondary' : 'bg-primary'} font-bold px-8`}>
                    {isSelected ? "Quitar" : "Añadir"}
                </Button>
            </div>
        </div>
    );
};

export default ProcessDetail;
