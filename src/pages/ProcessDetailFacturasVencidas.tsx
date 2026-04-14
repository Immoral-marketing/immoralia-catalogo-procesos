import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { processes } from "@/data/processes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronLeft, Plus, Check, ArrowRight, TrendingDown, LayoutGrid, Calendar, Bell, BarChart2 } from "lucide-react";
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
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Volver al catálogo
                    </button>
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
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight">
                        {process.nombre}
                    </h1>

                    <span className={cn(
                        "inline-flex px-3 py-1 rounded-full text-xs font-medium border",
                        getCategoryColorClass(process.categoriaNombre)
                    )}>
                        {process.categoriaNombre}
                    </span>

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
                                <li key={i} className="rounded-xl border border-border border-l-4 border-l-border bg-card px-6 py-4 transition-all duration-200 hover:border-l-primary hover:bg-card/80">
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
                                <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-3 hover:border-primary/50 transition-all duration-200">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="font-medium text-foreground text-sm">{title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* MÉTRICAS */}
                        <div className="grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-card">
                            {[
                                { value: "1h", label: "ahorrada cada semana" },
                                { value: "Cada lunes", label: "informe automático" },
                                { value: "0", label: "exportaciones manuales" },
                            ].map(({ value, label }, i) => (
                                <div key={i} className="flex flex-col items-center justify-center px-4 py-6 text-center">
                                    <span className="text-2xl md:text-3xl font-bold text-primary leading-none">{value}</span>
                                    <span className="text-xs text-muted-foreground mt-2 leading-snug">{label}</span>
                                </div>
                            ))}
                        </div>

                    </div>

                </section>

                {/* CÓMO FUNCIONA */}
                <section className="space-y-8">
                    <h2 className="text-2xl font-medium">Cómo funciona</h2>
                    <div className="space-y-8">
                        {(process.how_it_works_steps || process.pasos.map(p => ({ title: p, short: p }))).map((step: any, i) => (
                            <div key={i} className="flex gap-5">
                                <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center shrink-0 text-sm font-medium text-primary">
                                    {i + 1}
                                </div>
                                <div className="space-y-1.5 pt-0.5">
                                    <h3 className="text-base font-medium">{step.title}</h3>
                                    <p className="text-muted-foreground font-normal leading-relaxed">
                                        {step.detail || step.short}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQs */}
                {process.faqs && process.faqs.length > 0 && (
                    <section className="space-y-8">
                        <h2 className="text-2xl font-medium">Preguntas frecuentes</h2>
                        <div className="space-y-4">
                            {process.faqs.map((faq, i) => (
                                <div key={i} className="rounded-xl border border-border border-l-4 border-l-border bg-card p-6 space-y-3 transition-all duration-200 hover:border-l-primary hover:bg-card/80">
                                    <h3 className="text-base font-medium text-foreground">{faq.q}</h3>
                                    <p className="text-muted-foreground font-normal leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
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
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border">
                <div className="mx-auto max-w-[860px] px-4 md:px-6 py-4 flex gap-3 justify-center">
                    <Button
                        variant="outline"
                        size="lg"
                        className="font-medium"
                        onClick={() => setShowCalendlyModal(true)}
                    >
                        Agendar llamada
                    </Button>
                    <Button
                        onClick={toggleSelect}
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
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
