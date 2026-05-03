import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { processes } from "@/data/processes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronLeft, ChevronRight, Plus, Check, ArrowRight, LayoutGrid, Calendar, Bell, BarChart2, Zap, Settings2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelection } from "@/lib/SelectionContext";
import { SelectionSummary } from "@/components/SelectionSummary";
import { ContactForm } from "@/components/ContactForm";
import { OnboardingModal } from "@/components/OnboardingModal";
import { CalendlyLeadModal } from "@/components/CalendlyLeadModal";
import { ShareSelectionModal } from "@/components/ShareSelectionModal";
import { getOnboardingAnswers, OnboardingAnswers } from "@/lib/onboarding-utils";
import { computeFinalComplexity } from "@/lib/complexity-utils";
import immoraliaLogo from "@/assets/immoralia_logo.png";
import { Input } from "@/components/ui/input";
import { getCategoryColorClass } from "@/lib/category-colors";

const BENEFIT_ICONS = [Calendar, Bell, BarChart2, Zap, Settings2, Clock];

const ProcessDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { selectedProcessIds, toggleProcess, n8nHosting, setN8nHosting, customizations, updateCustomization } = useSelection();

    const baseProcess = processes.find((p) => p.slug === slug);

    // Aplicar variante de sector si existe
    const sectorSlug = searchParams.get("sector") ?? undefined;
    const process = useMemo(() => {
        if (!baseProcess) return undefined;
        const variant = sectorSlug ? baseProcess.sector_variants?.[sectorSlug] : undefined;
        if (!variant) return baseProcess;
        return {
            ...baseProcess,
            ...(variant.tagline           && { tagline: variant.tagline }),
            ...(variant.one_liner         && { one_liner: variant.one_liner }),
            ...(variant.descripcionDetallada && { descripcionDetallada: variant.descripcionDetallada }),
            ...(variant.dolores           && { dolores: variant.dolores }),
            ...(variant.pasos             && { pasos: variant.pasos }),
            ...(variant.personalizacion   && { personalizacion: variant.personalizacion }),
            ...(variant.how_it_works_steps && { how_it_works_steps: variant.how_it_works_steps }),
            ...(variant.summary && {
                summary: { ...baseProcess.summary, ...variant.summary },
            }),
        };
    }, [baseProcess, sectorSlug]);

    const isSelected = process ? selectedProcessIds.has(process.id) : false;

    const [showContactForm, setShowContactForm] = useState(false);
    const [showCalendlyModal, setShowCalendlyModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [onboardingOpen, setOnboardingOpen] = useState(false);
    const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers | null>(getOnboardingAnswers());
    const [carouselStep, setCarouselStep] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        setCarouselStep(0);
        if (process) {
            document.title = `Immoralia - ${process.nombre}`;
        }
    }, [slug, process]);

    const processCustomization = process && customizations[process.id] ? customizations[process.id] : { selectedOptions: {}, customInputs: {} };
    const [localOptions, setLocalOptions] = useState<Record<string, string[]>>(processCustomization.selectedOptions || {});
    const [localInputs, setLocalInputs] = useState<Record<string, string>>(processCustomization.customInputs || {});
    const [localNeedsInput, setLocalNeedsInput] = useState((processCustomization.customInputs && processCustomization.customInputs["needs"]) || "");

    useEffect(() => {
        if (process) {
            updateCustomization(process.id, localOptions, { ...localInputs, needs: localNeedsInput });
        }
    }, [localOptions, localInputs, localNeedsInput]); // eslint-disable-line react-hooks/exhaustive-deps

    const requiresCustomInput = (option: string) => {
        const lower = option.toLowerCase();
        return lower.includes("tu vía") || lower.includes("herramienta") || lower.includes("tu gestor") || lower.includes("otra") || lower.includes("especificar") || lower.includes("otro");
    };

    const handleOptionSelect = (blockLabel: string, option: string) => {
        setLocalOptions(prev => {
            const currentSelected = prev[blockLabel] || [];
            let newSelected: string[];
            if (currentSelected.includes(option)) {
                newSelected = currentSelected.filter((o: string) => o !== option);
            } else {
                newSelected = [...currentSelected, option];
            }
            if (!newSelected.some(o => requiresCustomInput(o))) {
                setLocalInputs(prevInputs => {
                    const next = { ...prevInputs };
                    delete next[blockLabel];
                    return next;
                });
            }
            return { ...prev, [blockLabel]: newSelected };
        });
    };

    const finalComplexity = process ? computeFinalComplexity(process, onboardingAnswers) : { timeEstimate: "N/A", complexity: "N/A" };

    const onboardingChannels = useMemo(() => {
        if (!onboardingAnswers?.channels) return [];
        const all = new Set([...onboardingAnswers.channels.clients, ...onboardingAnswers.channels.internal]);
        all.delete("Otro");
        if (onboardingAnswers.otherClientChannel) all.add(onboardingAnswers.otherClientChannel);
        if (onboardingAnswers.otherInternalChannel) all.add(onboardingAnswers.otherInternalChannel);
        return Array.from(all);
    }, [onboardingAnswers]);

    const toggleSelect = () => {
        if (process) toggleProcess(process.id);
    };

    const relatedProcesses = (process?.related_processes || [])
        .map(s => processes.find(p => p.slug === s))
        .filter((p): p is typeof processes[0] => !!p)
        .slice(0, 2);

    const steps = process
        ? (process.how_it_works_steps || process.pasos.map((p: string) => ({ title: p, short: p }))) as any[]
        : [];

    if (!process) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold mb-4">Proceso no encontrado</h1>
                <p className="text-muted-foreground mb-8">El proceso que buscas no existe o ha sido movido.</p>
                <Button onClick={() => navigate("/")}>Volver al catálogo</Button>
            </div>
        );
    }

    const benefits = process.benefits || process.pasos.slice(0, 3);

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
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                className={`relative h-10 px-4 gap-2 border transition-all ${
                                    selectedProcessIds.size > 0
                                        ? "bg-primary hover:bg-primary/90 text-primary-foreground border-primary shadow-[0_0_20px_rgba(0,200,220,0.2)]"
                                        : "bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                                }`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                <span className="hidden sm:inline">Mi Selección</span>
                                {selectedProcessIds.size > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-background text-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-primary">
                                        {selectedProcessIds.size}
                                    </span>
                                )}
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

                    {(process.one_liner || process.tagline) && (
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {process.one_liner || process.tagline}
                        </p>
                    )}

                    <span className={cn(
                        "inline-flex px-3 py-1 rounded-full text-xs font-medium border",
                        getCategoryColorClass(process.categoriaNombre)
                    )}>
                        {process.categoriaNombre}
                    </span>

                    {/* Video mockup */}
                    <div className="relative w-full rounded-2xl overflow-hidden border border-border bg-card aspect-video flex items-center justify-center group cursor-pointer my-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                                backgroundSize: "40px 40px"
                            }}
                        />
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

                    {/* Pain identification */}
                    {process.dolores && process.dolores.length > 0 && (
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
                                {process.dolores.map((dolor: string, i: number) => (
                                    <li key={i} className="rounded-xl border border-red-900/40 border-l-4 border-l-red-500/70 bg-red-950/20 px-6 py-4 transition-all duration-200 hover:border-l-red-400 hover:bg-red-950/30">
                                        <p className="text-sm font-medium text-foreground">{dolor}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Benefits */}
                    <div className="space-y-6 py-2">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                Lo que conseguirás con Immoralia
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {benefits.slice(0, 3).map((benefit: string, i: number) => {
                                const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
                                return (
                                    <div key={i} className="rounded-xl border border-border bg-transparent p-6 space-y-4 hover:border-primary/40 transition-colors duration-200">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{benefit}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Métricas */}
                        <div className="grid grid-cols-3 divide-x divide-border/50 rounded-xl border border-border/50 bg-muted/30">
                            {[
                                { value: finalComplexity.timeEstimate, label: "de implementación" },
                                { value: finalComplexity.complexity as string, label: "complejidad" },
                                { value: process.indicators?.integrations?.length?.toString() ?? "—", label: "herramientas conectadas" },
                            ].map(({ value, label }, i) => (
                                <div key={i} className="flex flex-col items-center justify-center px-4 py-5 text-center">
                                    <span className="text-xl md:text-2xl font-bold text-primary leading-none">{value}</span>
                                    <span className="text-xs text-muted-foreground/70 mt-1.5 leading-snug">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Cómo funciona — Carrusel */}
                {steps.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="text-2xl font-medium">Cómo funciona</h2>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 flex gap-1.5">
                                {steps.map((_: any, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setCarouselStep(i)}
                                        className="h-1 flex-1 rounded-full overflow-hidden bg-border transition-all duration-300"
                                    >
                                        <div
                                            className={cn(
                                                "h-full bg-primary rounded-full transition-all duration-500",
                                                i < carouselStep ? "w-full" : i === carouselStep ? "w-full opacity-100" : "w-0"
                                            )}
                                            style={{ opacity: i < carouselStep ? 0.4 : i === carouselStep ? 1 : 0 }}
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                                {carouselStep + 1} / {steps.length}
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
                                    onClick={() => setCarouselStep(s => Math.min(steps.length - 1, s + 1))}
                                    disabled={carouselStep === steps.length - 1}
                                    className="w-8 h-8 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {(() => {
                            const step = steps[carouselStep];
                            return (
                                <div className="rounded-2xl border border-border overflow-hidden">
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
                                    <div className="p-6 space-y-2 border-t border-border bg-card/30">
                                        <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{step.detail || step.short}</p>
                                    </div>
                                </div>
                            );
                        })()}
                    </section>
                )}

                {/* Personalización */}
                {process.customization?.options_blocks && process.customization.options_blocks.length > 0 && (
                    <section className="space-y-6">
                        <h2 className="text-2xl font-medium">Personalización</h2>
                        <div className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                {process.customization.options_blocks.map((block, i) => {
                                    const isCanalBlock = block.label.toLowerCase().includes("canal");
                                    const optionsToRender = (isCanalBlock && onboardingChannels.length > 0)
                                        ? [...onboardingChannels, "Tu vía de comunicación preferida"]
                                        : block.options;

                                    return (
                                        <div key={i} className="space-y-4">
                                            <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{block.label}</label>
                                            <div className="grid gap-2">
                                                {optionsToRender.map((opt: string) => {
                                                    const isOptSelected = (localOptions[block.label] || []).includes(opt);
                                                    return (
                                                        <div key={opt} className="space-y-2">
                                                            <div
                                                                onClick={() => handleOptionSelect(block.label, opt)}
                                                                className={cn(
                                                                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                                                                    isOptSelected
                                                                        ? "border-primary bg-primary/5 shadow-[0_0_15px_-3px_rgba(var(--primary),0.2)]"
                                                                        : "border-border hover:border-primary/50 bg-background/50"
                                                                )}
                                                            >
                                                                <div className={cn(
                                                                    "w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors",
                                                                    isOptSelected ? "border-primary bg-primary" : "border-muted-foreground"
                                                                )}>
                                                                    {isOptSelected && <Check className="w-3 h-3 text-primary-foreground stroke-[3]" />}
                                                                </div>
                                                                <span className={cn("text-sm transition-colors", isOptSelected ? "font-bold text-primary" : "font-medium text-foreground")}>{opt}</span>
                                                            </div>
                                                            {isOptSelected && requiresCustomInput(opt) && (
                                                                <div className="pl-8 anim-slide-down">
                                                                    <Input
                                                                        placeholder="Especificar detalladamente..."
                                                                        value={localInputs[block.label] || ""}
                                                                        onChange={(e) => setLocalInputs(prev => ({ ...prev, [block.label]: e.target.value }))}
                                                                        className="border-primary/30 focus-visible:ring-primary/50"
                                                                        autoFocus
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Necesidades específicas</label>
                                <textarea
                                    value={localNeedsInput}
                                    onChange={(e) => setLocalNeedsInput(e.target.value)}
                                    placeholder={process.customization.free_text_placeholder || "Describe aquí cualquier particularidad de tu negocio..."}
                                    className="w-full h-32 bg-background border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                                />
                            </div>
                        </div>
                    </section>
                )}

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

                {/* Procesos relacionados */}
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

export default ProcessDetail;
