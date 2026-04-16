import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { processes } from "@/data/processes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronLeft, ChevronRight, Plus, Check, ArrowRight, TrendingDown, LayoutGrid, Calendar, Bell, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelection } from "@/lib/SelectionContext";
import { SelectionSummary } from "@/components/SelectionSummary";
import { ContactForm } from "@/components/ContactForm";
import { OnboardingModal } from "@/components/OnboardingModal";
import { CalendlyLeadModal } from "@/components/CalendlyLeadModal";
import { ShareSelectionModal } from "@/components/ShareSelectionModal";
import { getOnboardingAnswers, OnboardingAnswers } from "@/lib/onboarding-utils";
import immoraliaLogo from "@/assets/immoralia_logo.png";
import { getCategoryColorClass } from "@/lib/category-colors";

const SLUG = "informe-semanal-facturas-vencidas";

const ProcessDetailFacturasVencidas = () => {
    const navigate = useNavigate();
    const { selectedProcessIds, toggleProcess, n8nHosting, setN8nHosting } = useSelection();

    const process = processes.find((p) => p.slug === SLUG)!;
    const isSelected = selectedProcessIds.has(process.id);

    const [showContactForm, setShowContactForm] = useState(false);
    const [showCalendlyModal, setShowCalendlyModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [onboardingOpen, setOnboardingOpen] = useState(false);
    const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers | null>(getOnboardingAnswers());
    const [carouselStep, setCarouselStep] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Immoralia - ${process.nombre}`;
    }, []);

    const toggleSelect = () => toggleProcess(process.id);

    const relatedProcesses = (process.related_processes || [])
        .map(s => processes.find(p => p.slug === s))
        .filter((p): p is typeof processes[0] => !!p)
        .slice(0, 2);

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* Nav */}
            <header className="border-b border-border bg-background sticky top-0 z-40">
                <div className="mx-auto max-w-[860px] px-4 md:px-6 py-4 flex items-center justify-between gap-6">
                    <img
                        src={immoraliaLogo}
                        alt="Immoralia"
                        className="h-8 cursor-pointer"
                        onClick={() => navigate("/")}
                    />
                </div>
                <div className="mx-auto max-w-[860px] px-4 md:px-6 pb-3">
                    <ol className="flex items-center gap-2 text-xs text-muted-foreground">
                        <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => navigate("/")}>
                            Catálogo
                        </li>
                        <li>/</li>
                        <li>{process.categoriaNombre}</li>
                        <li>/</li>
                        <li className="text-foreground">{process.nombre}</li>
                    </ol>
                </div>
            </header>

            <main className="mx-auto max-w-[860px] px-4 md:px-6 py-16 pb-32 space-y-20">

                {/* HERO */}
                <section className="space-y-6">
                    {/* Volver al catálogo */}
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Volver al catálogo
                    </button>

                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight">
                        {process.nombre}
                    </h1>

                    <span className={cn(
                        "inline-flex px-3 py-1 rounded-full text-xs font-medium border",
                        getCategoryColorClass(process.categoriaNombre)
                    )}>
                        {process.categoriaNombre}
                    </span>

                    {/* VIDEO MOCKUP — reemplazar por el video real cuando esté disponible */}
                    <div className="relative w-full rounded-2xl overflow-hidden border border-border bg-card aspect-video flex items-center justify-center group cursor-pointer my-4">
                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />

                        {/* Decorative grid lines */}
                        <div className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                                backgroundSize: "40px 40px"
                            }}
                        />

                        {/* Play button */}
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center backdrop-blur-sm group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(0,200,220,0.2)]">
                                <svg className="w-8 h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
                                Próximamente · Video explicativo
                            </p>
                        </div>

                        {/* Duration badge */}
                        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm border border-border rounded-md px-2.5 py-1 text-xs text-muted-foreground font-mono">
                            2:30
                        </div>
                    </div>

                    {/* CTA debajo del video */}
                    <div className="flex justify-center">
                        <Button
                            onClick={toggleSelect}
                            size="lg"
                            className={cn(
                                "font-medium px-8 transition-all duration-200",
                                isSelected
                                    ? "bg-secondary hover:bg-secondary/90 text-white"
                                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                            )}
                        >
                            {isSelected ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                            {isSelected ? "Proceso seleccionado" : "Seleccionar proceso"}
                        </Button>
                    </div>

                    {/* PAIN IDENTIFICATION */}
                    <div className="space-y-6 py-2">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                ¿Te reconoces?
                            </h2>
                            <p className="text-muted-foreground text-base">
                                Esto pasa en la mayoría de empresas antes de automatizarlo
                            </p>
                        </div>
                        <ul className="space-y-3 pt-2">
                            {[
                                { title: "Una hora perdida antes de empezar", desc: "Abres el ERP, filtras, exportas y calculas. Cada semana. Sin falta." },
                                { title: "Cobras al que te viene a la cabeza", desc: "Sin datos ordenados, no sabes a quién llamar primero." },
                                { title: "Si falta alguien, no se cobra", desc: "El seguimiento depende de una persona. Si no está, no ocurre." },
                            ].map((item, i) => (
                                <li key={i} className="rounded-xl border border-red-900/40 border-l-4 border-l-red-500/70 bg-red-950/20 px-6 py-4 transition-all duration-200 hover:border-l-red-400 hover:bg-red-950/30">
                                    <p className="text-sm font-medium text-foreground mb-1">{item.title}</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* LO QUE CONSEGUIRÁS */}
                    <div className="space-y-6 py-2">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                Lo que conseguirás con Immoralia
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { icon: Calendar, title: "Sin abrir el ERP", desc: "Cada lunes sabes quién te debe y cuánto, sin tocar nada." },
                                { icon: Bell, title: "En tu canal favorito", desc: "Email, Slack, WhatsApp o Teams. Tú decides dónde recibirlo." },
                                { icon: BarChart2, title: "Prioriza con datos reales", desc: "Nombre, importe y días de retraso. Llamas a quien más urge." },
                            ].map(({ icon: Icon, title, desc }, i) => (
                                <div key={i} className="rounded-xl border border-border bg-transparent p-6 space-y-4 hover:border-primary/40 transition-colors duration-200">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* MÉTRICAS */}
                        <div className="grid grid-cols-3 divide-x divide-border/50 rounded-xl border border-border/50 bg-muted/30">
                            {[
                                { value: "1h", label: "ahorrada cada semana" },
                                { value: "Cada lunes", label: "informe automático" },
                                { value: "0", label: "exportaciones manuales" },
                            ].map(({ value, label }, i) => (
                                <div key={i} className="flex flex-col items-center justify-center px-4 py-5 text-center">
                                    <span className="text-xl md:text-2xl font-bold text-primary leading-none">{value}</span>
                                    <span className="text-xs text-muted-foreground/70 mt-1.5 leading-snug">{label}</span>
                                </div>
                            ))}
                        </div>


                    </div>

                </section>

                {/* CÓMO FUNCIONA — Carrusel */}
                <section className="space-y-4">
                    {/* Título */}
                    <h2 className="text-2xl font-medium">Cómo funciona</h2>

                    {/* Barra de progreso + contador + flechas */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 flex gap-1.5">
                            {((process.how_it_works_steps || process.pasos.map((p: string) => ({ title: p, short: p }))) as any[]).map((_: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setCarouselStep(i)}
                                    className="h-1 flex-1 rounded-full overflow-hidden bg-border transition-all duration-300"
                                >
                                    <div className={cn(
                                        "h-full bg-primary rounded-full transition-all duration-500",
                                        i < carouselStep ? "w-full" : i === carouselStep ? "w-full opacity-100" : "w-0"
                                    )} style={{ opacity: i < carouselStep ? 0.4 : i === carouselStep ? 1 : 0 }} />
                                </button>
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                            {carouselStep + 1} / {((process.how_it_works_steps || process.pasos) as any[]).length}
                        </span>
                        <div className="flex gap-1.5 shrink-0">
                            <button
                                onClick={() => setCarouselStep(s => Math.max(0, s - 1))}
                                disabled={carouselStep === 0}
                                className="w-8 h-8 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setCarouselStep(s => Math.min(((process.how_it_works_steps || process.pasos) as any[]).length - 1, s + 1))}
                                disabled={carouselStep === ((process.how_it_works_steps || process.pasos) as any[]).length - 1}
                                className="w-8 h-8 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {(() => {
                        const steps = (process.how_it_works_steps || process.pasos.map((p: string) => ({ title: p, short: p }))) as any[];
                        const step = steps[carouselStep];
                        return (
                            <div className="rounded-2xl border border-border overflow-hidden">
                                {/* Image mockup — reemplazar por screenshot real */}
                                <div className="relative w-full bg-card aspect-video flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
                                    <div
                                        className="absolute inset-0 opacity-10"
                                        style={{
                                            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                                            backgroundSize: "40px 40px"
                                        }}
                                    />
                                    <div className="relative z-10 flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <svg className="w-7 h-7 text-primary/50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                <rect x="3" y="3" width="18" height="14" rx="2" />
                                                <path d="M3 17h18M9 21h6" />
                                            </svg>
                                        </div>
                                        <p className="text-xs text-muted-foreground/50 font-medium tracking-wide uppercase">Screenshot · Paso {carouselStep + 1}</p>
                                    </div>
                                </div>

                                {/* Step info */}
                                <div className="p-6 space-y-2 border-t border-border bg-card/30">
                                    <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{step.detail || step.short}</p>
                                </div>
                            </div>
                        );
                    })()}
                </section>

                {/* FAQs */}
                {process.faqs && process.faqs.length > 0 && (
                    <section className="space-y-6">
                        <h2 className="text-2xl font-medium">Preguntas frecuentes</h2>
                        <Accordion type="single" collapsible className="space-y-2">
                            {process.faqs.map((faq, i) => (
                                <AccordionItem
                                    key={i}
                                    value={`faq-${i}`}
                                    className="rounded-xl border border-border px-5 transition-colors duration-200 hover:border-primary/40 data-[state=open]:border-primary/50"
                                >
                                    <AccordionTrigger className="text-sm font-medium text-foreground py-4 hover:no-underline [&>svg]:text-primary [&>svg]:w-4 [&>svg]:h-4">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </section>
                )}

                {/* PROCESOS RELACIONADOS */}
                {relatedProcesses.length > 0 && (
                    <section className="space-y-8">
                        <h2 className="text-2xl font-medium">Procesos relacionados</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {relatedProcesses.map((p) => (
                                <div
                                    key={p.id}
                                    className="group border border-border rounded-xl p-5 space-y-3 hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                                    onClick={() => navigate(`/catalogo/procesos/${p.slug}`)}
                                >
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                            getCategoryColorClass(p.categoriaNombre)
                                        )}>
                                            {p.categoriaNombre}
                                        </span>
                                        {p.recomendado && (
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                                Recomendado
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base font-medium">{p.nombre}</h3>
                                    <p className="text-sm text-muted-foreground font-normal">{p.tagline}</p>
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Más información <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                        <Button
                                            size="sm"
                                            onClick={(e) => { e.stopPropagation(); toggleProcess(p.id); }}
                                            className={cn(
                                                "text-xs font-medium h-7 px-3",
                                                selectedProcessIds.has(p.id)
                                                    ? "bg-secondary hover:bg-secondary/90 text-white"
                                                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                                            )}
                                        >
                                            {selectedProcessIds.has(p.id) ? <Check className="mr-1 h-3 w-3" /> : <Plus className="mr-1 h-3 w-3" />}
                                            {selectedProcessIds.has(p.id) ? "Añadido" : "Añadir"}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}


            </main>

            {/* Sticky CTA bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary border-t border-primary/80">
                <div className="mx-auto max-w-[860px] px-4 md:px-6 py-3 flex gap-3 justify-center">
                    <Button
                        variant="ghost"
                        size="lg"
                        className="font-medium text-black/70 hover:text-black hover:bg-white/20"
                        onClick={() => setShowCalendlyModal(true)}
                    >
                        Agendar llamada
                    </Button>
                    <Button
                        onClick={toggleSelect}
                        size="lg"
                        className="bg-black/90 hover:bg-black text-white font-medium border-0"
                    >
                        {isSelected ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                        {isSelected ? "Añadido a mi selección" : "Añadir a mi selección"}
                    </Button>
                </div>
            </div>

            {/* Mi selección floating Sheet */}
            {selectedProcessIds.size > 0 && (
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            className="fixed bottom-24 left-8 z-50 h-14 pl-4 pr-6 rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(0,200,220,0.3)] border-none transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-left-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <LayoutGrid className="w-6 h-6 text-primary-foreground" />
                                    <span className="absolute -top-2 -right-2 bg-background text-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-primary">
                                        {selectedProcessIds.size}
                                    </span>
                                </div>
                                <span className="font-bold text-primary-foreground tracking-wide uppercase text-sm">Mi Selección</span>
                            </div>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-background border-border w-full sm:max-w-md p-0 overflow-hidden">
                        <div className="h-full flex flex-col p-6 overflow-hidden">
                            <SheetHeader className="mb-2 text-left">
                                <SheetTitle className="text-foreground text-2xl font-bold flex items-center gap-2">
                                    <LayoutGrid className="w-6 h-6 text-primary" />
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
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            )}

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

            <ShareSelectionModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                selectedProcesses={processes.filter(p => selectedProcessIds.has(p.id))}
            />
        </div>
    );
};

export default ProcessDetailFacturasVencidas;
