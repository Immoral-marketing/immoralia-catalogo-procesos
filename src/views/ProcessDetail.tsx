'use client'
import React, { useState, useEffect, useMemo } from "react";
import { GHLBookingModal } from "@/components/GHLBookingModal";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { processes } from "@/data/processes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Plus, Check, ArrowRight, LayoutGrid, Calendar, Bell, BarChart2, Zap, Settings2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelection } from "@/lib/SelectionContext";
import { SelectionSummary } from "@/components/SelectionSummary";
import { ContactForm } from "@/components/ContactForm";
import { OnboardingModal } from "@/components/OnboardingModal";
import { ShareSelectionModal } from "@/components/ShareSelectionModal";
import { getOnboardingAnswers, OnboardingAnswers } from "@/lib/onboarding-utils";
import { computeFinalComplexity } from "@/lib/complexity-utils";
const immoraliaLogo = "/immoralia_logo.png";
import { Input } from "@/components/ui/input";
import { getCategoryColorClass } from "@/lib/category-colors";
import { supabase } from "@/lib/supabase";

const BENEFIT_ICONS = [Calendar, Bell, BarChart2, Zap, Settings2, Clock];

// Nombres de módulo por sector × bloque
const MODULE_MAP: Record<string, Record<string, string>> = {
    "centros-deportivos": {
        B1: "Reservas y acceso 24/7",
        B2: "Captación y conversión de socios",
        B3: "Fidelización y retención de socios",
        B4: "Operativa del centro y personal",
        B5: "Reputación y comunidad",
        B6: "Marketing y contenido digital",
    },
    "gestorias": {
        B1: "Alta y captación de clientes",
        B2: "Gestión documental",
        B3: "Fiscal y vencimientos",
        B4: "Laboral y nóminas de clientes",
        B5: "Relación con el cliente",
        B6: "Operativa interna de la gestoría",
    },
    "salud": {
        B1: "Captación y primera visita",
        B2: "Gestión de citas y ausencias",
        B3: "Reputación y reseñas",
        B4: "Seguimiento clínico y fidelización",
        B5: "Administración y facturación",
        B6: "Gestión del equipo clínico",
    },
    "gastronomia-hosteleria": {
        B1: "Reservas y atención 24/7",
        B2: "Reputación y reseñas",
        B3: "Fidelización y vuelta del cliente",
        B4: "Operativa diaria y visibilidad",
        B5: "Gestión de personal y equipo",
        B6: "Marketing y contenido digital",
    },
    "academias": {
        B1: "Captación de alumnos",
        B2: "Matriculación y onboarding del alumno",
        B3: "Comunicación con padres y alumnos",
        B4: "Retención y reactivación",
        B5: "Administración y finanzas",
        B6: "Gestión del profesorado",
    },
    "construccion": {
        B1: "Captación y cualificación",
        B2: "Conversión y cierre",
        B3: "Seguimiento y visitas",
        B4: "Obra y proveedores",
        B5: "Finanzas y cobros",
        B6: "Postventa y dirección",
    },
};

// Nombre visible y ruta del sector
const SECTOR_LABELS: Record<string, { label: string; path: string }> = {
    "centros-deportivos":     { label: "Centros Deportivos",       path: "/sector/centros-deportivos" },
    "gestorias":              { label: "Gestorías",                path: "/sector/gestorias" },
    "salud":                  { label: "Centros de Salud",         path: "/sector/salud" },
    "gastronomia-hosteleria": { label: "Gastronomía y Hostelería", path: "/sector/gastronomia-hosteleria" },
    "academias":              { label: "Academias y Formación",    path: "/sector/academias" },
    "construccion":           { label: "Desarrolladoras e Inmobiliarias", path: "/sector/desarrolladoras" },
    "industrial":             { label: "Industrial / Producción",                  path: "/sector/industrial" },
};

// Config por sector: color de acento + imagen hero
const SECTOR_CONFIG: Record<string, { accentHsl: string; accentHex: string; heroImage: string | null }> = {
    "centros-deportivos":     { accentHsl: "0 84% 60%",   accentHex: "#ef4444", heroImage: "/centros-deportivos/hero.webp" },
    "gestorias":              { accentHsl: "142 71% 45%", accentHex: "#22c55e", heroImage: "/gestorias/hero.webp" },
    "salud":                  { accentHsl: "199 89% 48%", accentHex: "#0ea5e9", heroImage: "/salud/hero.webp" },
    "gastronomia-hosteleria": { accentHsl: "24 90% 48%",  accentHex: "#ea580c", heroImage: "/restauracion/hero.webp" },
    "academias":              { accentHsl: "292 73% 40%", accentHex: "#a21caf", heroImage: "/academias/hero.webp" },
    "construccion":           { accentHsl: "142 71% 45%", accentHex: "#22c55e", heroImage: "/constructoras.webp" },
    "industrial":             { accentHsl: "220 9% 46%",  accentHex: "#6b7280", heroImage: "/industrial/hero.webp" },
};

const ProcessDetail = () => {
    const params = useParams();
    const slug = params.slug as string;
    const router = useRouter();
    const searchParams = useSearchParams();
    const { selectedProcessIds, toggleProcess, n8nHosting, setN8nHosting, customizations, updateCustomization } = useSelection();

    const baseProcess = processes.find((p) => p.slug === slug);

    // Procesos del mismo módulo desde Supabase staging (tiene bloque_negocio, slug, catalog_active)
    const [dbModuleProcesses, setDbModuleProcesses] = useState<any[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);

    // Fallback a Supabase para procesos no definidos en el archivo estático
    const [dbProcess, setDbProcess] = useState<any>(null);
    const [dbFetchedSlug, setDbFetchedSlug] = useState<string | null>(null);
    // Loading = hay que buscar en Supabase y todavía no ha llegado la respuesta
    const dbLoading = !baseProcess && dbFetchedSlug !== slug;


    // Aplicar variante de sector si existe
    const sectorSlug = searchParams.get("sector") ?? undefined;
    const process = useMemo(() => {
        const bp = baseProcess || dbProcess;
        if (!bp) return undefined;
        const variant = sectorSlug ? bp.sector_variants?.[sectorSlug] : undefined;
        if (!variant) return bp;
        return {
            ...bp,
            ...(variant.tagline           && { tagline: variant.tagline }),
            ...(variant.one_liner         && { one_liner: variant.one_liner }),
            ...(variant.descripcionDetallada && { descripcionDetallada: variant.descripcionDetallada }),
            ...(variant.dolores           && { dolores: variant.dolores }),
            ...(variant.pasos             && { pasos: variant.pasos }),
            ...(variant.personalizacion   && { personalizacion: variant.personalizacion }),
            ...(variant.how_it_works_steps && { how_it_works_steps: variant.how_it_works_steps }),
            ...(variant.summary && {
                summary: { ...bp.summary, ...variant.summary },
            }),
        };
    }, [baseProcess, dbProcess, sectorSlug]);

    const isSelected = process ? selectedProcessIds.has(process.id) : false;

    const [showContactForm, setShowContactForm] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [onboardingOpen, setOnboardingOpen] = useState(false);
    const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers | null>(getOnboardingAnswers());
    const [carouselStep, setCarouselStep] = useState(0);
    const [flippedCard, setFlippedCard] = useState<number | null>(null);
    const [stepImages, setStepImages] = useState<(string | null)[]>([null, null, null]);
    const [stepSubtitles, setStepSubtitles] = useState<(string | null)[]>([null, null, null]);


    // Cargar procesos del mismo módulo desde Supabase staging
    useEffect(() => {
        if (!process?.landing_slug || !process?.bloque_negocio) {
            setDbModuleProcesses([]);
            return;
        }
        supabase
            .from('processes')
            .select('id, slug, nombre, tagline, codigo, modulo_codigo, bloque_negocio, landing_slug')
            .eq('landing_slug', process.landing_slug)
            .eq('bloque_negocio', process.bloque_negocio)
            .neq('slug', process.slug)
            .neq('catalog_active', false)
            .then(({ data }) => {
                setDbModuleProcesses(data ?? []);
            });
    }, [process?.landing_slug, process?.bloque_negocio, process?.slug]);

    // Cargar imágenes desde Supabase (solo para procesos del archivo estático)
    useEffect(() => {
        if (!slug || dbProcess) return;
        supabase
            .from('processes')
            .select('image_url_1, image_url_2, image_url_3, image_subtitle_1, image_subtitle_2, image_subtitle_3')
            .eq('slug', slug)
            .single()
            .then(({ data }) => {
                if (data) {
                    setStepImages([data.image_url_1 ?? null, data.image_url_2 ?? null, data.image_url_3 ?? null]);
                    setStepSubtitles([data.image_subtitle_1 ?? null, data.image_subtitle_2 ?? null, data.image_subtitle_3 ?? null]);
                }
            });
    }, [slug, dbProcess]);

    // Fallback: si el slug no está en el archivo estático, cargar desde Supabase
    useEffect(() => {
        if (!slug || baseProcess) return;
        setDbProcess(null);
        setDbFetchedSlug(null); // reset → dbLoading pasa a true
        supabase
            .from('processes')
            .select('*')
            .eq('slug', slug)
            .limit(1)
            .then(({ data, error }) => {
                if (error) {
                    console.error('[ProcessDetail] Error cargando proceso desde Supabase:', error);
                }
                const row = Array.isArray(data) ? data[0] : null;
                if (row) {
                    // Construir exactamente 3 pasos para el carrusel (uno por imagen)
                    const rawPasos: string[] = Array.isArray(row.pasos) ? row.pasos : [];
                    const len = rawPasos.length;
                    const threeSteps = [
                        { title: rawPasos[0] ?? 'Paso 1', short: rawPasos[0] ?? '' },
                        { title: rawPasos[Math.floor(len / 2)] ?? 'Paso 2', short: rawPasos[Math.floor(len / 2)] ?? '' },
                        { title: rawPasos[len - 1] ?? 'Paso 3', short: rawPasos[len - 1] ?? '' },
                    ];
                    setDbProcess({
                        id: row.id,
                        codigo: row.codigo,
                        slug: row.slug,
                        nombre: row.nombre,
                        tagline: row.tagline ?? '',
                        descripcionDetallada: row.descripcion_detallada ?? '',
                        categoria: row.categoria ?? 'A',
                        categoriaNombre: row.categoria_nombre ?? 'Automatización',
                        recomendado: row.recomendado ?? false,
                        pasos: rawPasos,
                        how_it_works_steps: threeSteps,
                        personalizacion: row.personalizacion ?? '',
                        dolores: row.dolores ?? [],
                        benefits: row.benefits ?? [],
                        sectores: row.sectores ?? [],
                        herramientas: row.herramientas ?? [],
                        landing_slug: row.landing_slug,
                        bloque_negocio: row.bloque_negocio,
                        modulo_codigo: row.modulo_codigo,
                        integration_domains: row.integration_domains ?? [],
                    });
                    setStepImages([
                        row.image_url_1 ?? null,
                        row.image_url_2 ?? null,
                        row.image_url_3 ?? null,
                    ]);
                    setStepSubtitles([
                        row.image_subtitle_1 ?? null,
                        row.image_subtitle_2 ?? null,
                        row.image_subtitle_3 ?? null,
                    ]);
                }
                setDbFetchedSlug(slug); // marca fetch completo → dbLoading pasa a false
            });
    }, [slug, baseProcess]);

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

    const steps = (process
        ? (process.how_it_works_steps || process.pasos.map((p: string) => ({ title: p, short: p }))) as any[]
        : []).slice(0, 3);

    if (!process) {
        if (dbLoading) {
            return (
                <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-4">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Cargando proceso...</p>
                </div>
            );
        }
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold mb-4">Proceso no encontrado</h1>
                <p className="text-muted-foreground mb-8">El proceso que buscas no existe o ha sido movido.</p>
                <Button onClick={() => router.push("/")}>Volver al catálogo</Button>
            </div>
        );
    }

    const benefits = process.benefits || process.pasos.slice(0, 3);

    // Sector theme: color + hero image por landing_slug
    const sectorCfg = process.landing_slug ? SECTOR_CONFIG[process.landing_slug] : undefined;
    const sectorInfo = process.landing_slug ? SECTOR_LABELS[process.landing_slug] : undefined;
    const moduleName = (process.landing_slug && process.bloque_negocio)
        ? MODULE_MAP[process.landing_slug]?.[process.bloque_negocio]
        : undefined;
    const moduleProcesses = dbModuleProcesses;
    const isGastro = process.landing_slug === "gastronomia-hosteleria"; // kept for legacy shadow refs
    const isSalud = process.landing_slug === "salud";
    const isAcademias = process.landing_slug === "academias";
    const themeStyle = sectorCfg ? ({
        "--primary": sectorCfg.accentHsl,
        "--primary-foreground": "0 0% 100%",
        "--accent": sectorCfg.accentHsl,
        "--accent-foreground": "0 0% 100%",
    } as React.CSSProperties) : undefined;

    return (
        <div className="min-h-screen bg-background text-foreground" style={themeStyle}>

            {/* ── Paneles laterales atmosféricos — solo xl+, solo si el sector tiene hero ── */}
            {sectorCfg?.heroImage && (
                <>
                    {/* Panel IZQUIERDO */}
                    <div
                        className="hidden xl:block fixed inset-y-0 left-0 pointer-events-none overflow-hidden"
                        style={{ width: 'max(0px, calc((100vw - 908px) / 2))', zIndex: 0 }}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-right opacity-[0.22]"
                            style={{
                                backgroundImage: `url('${sectorCfg.heroImage}')`,
                                filter: 'blur(3px)',
                                transform: 'scale(1.1)',
                            }}
                        />
                        {/* Fade horizontal hacia el contenido */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background" />
                        {/* Fade vertical: oscurece arriba y abajo */}
                        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent via-[35%] to-background" />
                        {/* Tint de color del sector muy sutil */}
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{ background: `radial-gradient(ellipse at 50% 50%, ${sectorCfg.accentHex}60 0%, transparent 70%)` }}
                        />
                    </div>
                    {/* Panel DERECHO */}
                    <div
                        className="hidden xl:block fixed inset-y-0 right-0 pointer-events-none overflow-hidden"
                        style={{ width: 'max(0px, calc((100vw - 908px) / 2))', zIndex: 0 }}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-left opacity-[0.22]"
                            style={{
                                backgroundImage: `url('${sectorCfg.heroImage}')`,
                                filter: 'blur(3px)',
                                transform: 'scale(1.1)',
                            }}
                        />
                        {/* Fade horizontal hacia el contenido */}
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background" />
                        {/* Fade vertical */}
                        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent via-[35%] to-background" />
                        {/* Tint de color del sector */}
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{ background: `radial-gradient(ellipse at 50% 50%, ${sectorCfg.accentHex}60 0%, transparent 70%)` }}
                        />
                    </div>
                </>
            )}

            {/* Nav */}
            <header className="border-b border-border bg-background sticky top-0 z-40">
                <div className="mx-auto max-w-[860px] px-4 md:px-6 py-4 flex items-center justify-between gap-6">
                    <Image src={immoraliaLogo} alt="Immoralia" width={160} height={40} className="h-8 w-auto cursor-pointer" onClick={() => router.push("/")} />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                className={`relative h-10 px-4 gap-2 border transition-all ${
                                    selectedProcessIds.size > 0
                                        ? cn("bg-primary hover:bg-primary/90 text-primary-foreground border-primary", isGastro ? "shadow-[0_0_20px_rgba(234,88,12,0.25)]" : isSalud ? "shadow-[0_0_20px_rgba(14,165,233,0.25)]" : isAcademias ? "shadow-[0_0_20px_rgba(139,92,246,0.25)]" : "shadow-[0_0_20px_rgba(0,200,220,0.2)]")
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
                                    accentColor={process?.landing_slug ? SECTOR_CONFIG[process.landing_slug]?.accentHex : undefined}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                <div className="mx-auto max-w-[860px] px-4 md:px-6 pb-3">
                    <ol className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        {sectorInfo ? (
                            <>
                                <li
                                    className="hover:text-foreground cursor-pointer transition-colors"
                                    onClick={() => router.push(sectorInfo.path)}
                                >
                                    {sectorInfo.label}
                                </li>
                                {moduleName && (
                                    <>
                                        <li className="opacity-40">/</li>
                                        <li
                                            className="hover:text-foreground cursor-pointer transition-colors"
                                            onClick={() => router.push(`${sectorInfo.path}#block-${process.bloque_negocio}`)}
                                        >
                                            {moduleName}
                                        </li>
                                    </>
                                )}
                                <li className="opacity-40">/</li>
                                <li className="text-foreground truncate max-w-[260px]">{process.nombre}</li>
                            </>
                        ) : (
                            <>
                                <li className="hover:text-foreground cursor-pointer transition-colors" onClick={() => router.push("/")}>
                                    Catálogo
                                </li>
                                <li className="opacity-40">/</li>
                                <li>{process.categoriaNombre}</li>
                                <li className="opacity-40">/</li>
                                <li className="text-foreground truncate max-w-[260px]">{process.nombre}</li>
                            </>
                        )}
                    </ol>
                </div>
            </header>

            {/* ── HERO BANNER con imagen del sector ── */}
            {sectorCfg?.heroImage && (() => {
                return (
                    <div className="relative w-full min-h-[480px] flex flex-col justify-end overflow-hidden">
                        {/* Imagen full-bleed */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${sectorCfg.heroImage}')` }}
                        />
                        {/* Fade inferior: completamente opaco desde el 35% para abajo */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background from-[35%] via-background/70 via-[58%] to-transparent to-[85%]" />
                        {/* Velo superior */}
                        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent via-[20%] to-transparent" />
                        <div className="relative z-10 mx-auto max-w-[860px] w-full px-4 md:px-6 pb-8 pt-6">
                            {/* ← Volver al sector — sobre el título, muy sutil */}
                            {sectorInfo && (
                                <button
                                    onClick={() => router.push(sectorInfo.path)}
                                    className="flex items-center gap-1 text-xs text-white/35 hover:text-white/60 transition-colors mb-5"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    {sectorInfo.label}
                                </button>
                            )}
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white mb-3">
                                {process.nombre}
                            </h1>
                            {(process.one_liner || process.tagline) && (
                                <p className="text-base text-white/55 leading-relaxed max-w-2xl mb-4">
                                    {process.one_liner || process.tagline}
                                </p>
                            )}
                            {/* Chips de módulo y recomendado */}
                            <div className="flex flex-wrap items-center gap-3">
                                {moduleName && (
                                    <div
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border"
                                        style={{
                                            borderColor: `${sectorCfg?.accentHex}50`,
                                            backgroundColor: `${sectorCfg?.accentHex}12`,
                                            color: 'rgba(255,255,255,0.80)',
                                        }}
                                    >
                                        <LayoutGrid className="w-4 h-4 shrink-0" style={{ color: sectorCfg?.accentHex }} />
                                        <span>{process.bloque_negocio} · {moduleName}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}

            <main className={`relative z-10 mx-auto max-w-[860px] px-4 md:px-6 pb-32 space-y-20 ${sectorCfg?.heroImage ? 'pt-8' : 'py-16'}`}>

                {/* HERO */}
                <section className="space-y-6">
                    {!sectorCfg?.heroImage && (
                        <>
                            <button
                                onClick={() => router.push("/")}
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
                        </>
                    )}

                    {/* Descripción detallada — solo cuando hay imagen de sector */}
                    {sectorCfg?.heroImage && process.descripcionDetallada && (
                        <p className="text-base text-muted-foreground leading-relaxed pb-2">
                            {process.descripcionDetallada}
                        </p>
                    )}

                    {/* Cómo funciona — Carrusel */}
                    {steps.length > 0 && (
                        <div className="space-y-4 py-2">
                            <div className="flex items-end justify-between gap-4">
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Cómo funciona</h2>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex gap-1.5">
                                        {steps.map((_: any, i: number) => (
                                            <button
                                                key={i}
                                                onClick={() => setCarouselStep(i)}
                                                className="h-1 w-6 rounded-full overflow-hidden bg-border transition-all duration-300"
                                            >
                                                <div
                                                    className={cn("h-full bg-primary rounded-full transition-all duration-500", i < carouselStep ? "w-full" : i === carouselStep ? "w-full opacity-100" : "w-0")}
                                                    style={{ opacity: i < carouselStep ? 0.4 : i === carouselStep ? 1 : 0 }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground tabular-nums">{carouselStep + 1} / {steps.length}</span>
                                    <div className="flex gap-1.5">
                                        <button onClick={() => setCarouselStep(s => Math.max(0, s - 1))} disabled={carouselStep === 0} className="w-8 h-8 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setCarouselStep(s => Math.min(steps.length - 1, s + 1))} disabled={carouselStep === steps.length - 1} className="w-8 h-8 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {(() => {
                                const step = steps[carouselStep];
                                return (
                                    <div className="rounded-2xl border border-border overflow-hidden">
                                        <div className="relative w-full bg-card aspect-[3/2] flex items-center justify-center overflow-hidden">
                                            {stepImages[carouselStep] ? (
                                                <>
                                                    <Image src={stepImages[carouselStep]!} alt={`Paso ${carouselStep + 1}`} fill className="object-cover" />
                                                    {stepSubtitles[carouselStep] && (
                                                        <div className="absolute bottom-0 left-0 right-0 h-[18%] flex items-end justify-center pb-3 pointer-events-none" style={{ zIndex: 6 }}>
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                                                            <span className="relative z-10 text-white font-bold tracking-[0.2em] uppercase text-[clamp(0.85rem,2.5vw,1.3rem)] drop-shadow-lg">{stepSubtitles[carouselStep]}</span>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
                                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                                                    <div className="relative z-10 flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                            <svg className="w-7 h-7 text-primary/50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="14" rx="2" /><path d="M3 17h18M9 21h6" /></svg>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground/50 font-medium tracking-wide uppercase">Screenshot · Paso {carouselStep + 1}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="p-6 space-y-2 border-t border-border bg-card/30">
                                            <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{step.detail || step.short}</p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* CTA */}
                    <div className="flex justify-center">
                        <Button
                            onClick={toggleSelect}
                            size="lg"
                            className={cn(
                                "font-medium px-8 transition-all duration-200",
                                !sectorCfg && (isSelected
                                    ? "bg-secondary hover:bg-secondary/90 text-white"
                                    : "bg-primary hover:bg-primary/90 text-primary-foreground")
                            )}
                            style={sectorCfg ? { backgroundColor: sectorCfg.accentHex, color: "#fff", boxShadow: isSelected ? `0 0 20px ${sectorCfg.accentHex}55` : undefined } : {}}
                        >
                            {isSelected ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                            {isSelected ? "Proceso seleccionado" : "Seleccionar proceso"}
                        </Button>
                    </div>

                    {/* Antes · Después — flip cards 3D */}
                    {((process.dolores && process.dolores.length > 0) || benefits.length > 0) && (
                        <div className="space-y-6 py-2">
                            <div className="flex items-end justify-between gap-4">
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                                    Lo que cambia con Immoralia
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3">
                                {Array.from({ length: Math.max(process.dolores?.length ?? 0, benefits.length) }).map((_, i) => {
                                    const dolor = process.dolores?.[i];
                                    const benefit = benefits[i];
                                    const BenefitIcon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
                                    return (
                                        <div
                                            key={i}
                                            className="relative cursor-pointer w-full"
                                            style={{ perspective: '1200px', minHeight: '110px' }}
                                            onMouseEnter={() => setFlippedCard(i)}
                                            onMouseLeave={() => setFlippedCard(null)}
                                        >
                                            <div
                                                className="relative w-full"
                                                style={{
                                                    minHeight: '110px',
                                                    transformStyle: 'preserve-3d',
                                                    transform: flippedCard === i ? 'rotateX(180deg)' : 'rotateX(0deg)',
                                                    transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
                                                }}
                                            >
                                                {/* ── FRENTE — con Immoralia (lo bueno primero) ── */}
                                                <div
                                                    className="absolute inset-0 rounded-2xl overflow-hidden flex"
                                                    style={{ backfaceVisibility: 'hidden' }}
                                                >
                                                    {/* Strip izquierda: sólido acento */}
                                                    <div
                                                        className="w-[72px] shrink-0 flex flex-col items-center justify-center gap-3 py-5"
                                                        style={{ backgroundColor: sectorCfg?.accentHex ?? 'hsl(var(--primary))' }}
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                                                            <BenefitIcon className="w-5 h-5 text-white" />
                                                        </div>
                                                        <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    {/* Contenido */}
                                                    <div
                                                        className="flex-1 px-6 py-5 flex flex-col justify-center relative overflow-hidden rounded-r-2xl border border-l-0"
                                                        style={{
                                                            backgroundColor: sectorCfg ? `${sectorCfg.accentHex}14` : 'hsl(var(--muted))',
                                                            borderColor: sectorCfg ? `${sectorCfg.accentHex}40` : 'hsl(var(--border))',
                                                        }}
                                                    >
                                                        <p
                                                            className="text-[9px] font-bold uppercase tracking-[0.18em] mb-2.5"
                                                            style={{ color: sectorCfg?.accentHex ?? 'hsl(var(--primary))' }}
                                                        >
                                                            Con Immoralia
                                                        </p>
                                                        {benefit && (
                                                            <p className="text-base font-bold text-foreground leading-snug">
                                                                {benefit}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* ── DORSO — sin automatizar ── */}
                                                <div
                                                    className="absolute inset-0 rounded-2xl overflow-hidden flex"
                                                    style={{
                                                        backfaceVisibility: 'hidden',
                                                        transform: 'rotateX(180deg)',
                                                    }}
                                                >
                                                    {/* Strip izquierda: sólido oscuro-rojo */}
                                                    <div className="w-[72px] shrink-0 bg-red-950 flex flex-col items-center justify-center gap-3 py-5">
                                                        <div className="w-10 h-10 rounded-full bg-red-900/70 border border-red-800/70 flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </div>
                                                        <svg className="w-6 h-6 text-red-700/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </div>
                                                    {/* Contenido */}
                                                    <div className="flex-1 bg-[#190a0a] px-6 py-5 flex flex-col justify-center relative overflow-hidden border border-l-0 border-red-950 rounded-r-2xl">
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-500/80 mb-2.5">
                                                            Sin automatizar
                                                        </p>
                                                        {dolor && (
                                                            <p className="text-sm font-semibold text-white/70 leading-relaxed">
                                                                {dolor}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </section>

                {/* ── Procesos relacionados ── */}
                {(() => {
                    const combined = moduleProcesses.length > 0
                        ? moduleProcesses
                        : relatedProcesses.filter(rp => !process.landing_slug || rp.landing_slug === process.landing_slug);
                    if (combined.length === 0) return null;
                    const accent = sectorCfg?.accentHex ?? 'hsl(var(--primary))';
                    return (
                        <section className="space-y-5">
                            {/* Cabecera */}
                            <div>
                                {moduleName && (
                                    <p className="text-[10px] uppercase tracking-[0.18em] font-bold mb-2" style={{ color: accent }}>
                                        {process.bloque_negocio} · {moduleName}
                                    </p>
                                )}
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                                    Procesos relacionados
                                </h2>
                            </div>

                            {/* Lista horizontal */}
                            <div className="flex flex-col gap-2">
                                {combined.map((p, idx) => {
                                    const pSelected = selectedProcessIds.has(p.id);
                                    const dest = `/catalogo/procesos/${p.slug}${process.landing_slug ? `?sector=${process.landing_slug}` : ''}`;
                                    const displayCode = p.modulo_codigo ? `B${p.modulo_codigo}` : (p.codigo ?? String(idx + 1).padStart(2, '0'));
                                    return (
                                        <div
                                            key={p.id}
                                            className="group relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300"
                                            style={{
                                                background: pSelected ? `${accent}10` : `${accent}06`,
                                                boxShadow: `0 0 0 1px ${accent}30, 0 4px 20px ${accent}12`,
                                            }}
                                            onClick={() => router.push(dest)}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = `linear-gradient(to right, ${accent}20, ${accent}0a, ${accent}06)`;
                                                e.currentTarget.style.boxShadow = `0 0 0 1px ${accent}80, 0 0 24px ${accent}35, 0 8px 32px ${accent}20`;
                                                e.currentTarget.style.transform = 'translateX(4px)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = pSelected ? `${accent}10` : `${accent}06`;
                                                e.currentTarget.style.boxShadow = `0 0 0 1px ${accent}30, 0 4px 20px ${accent}12`;
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                        >
                                            <div className="flex items-stretch">
                                                {/* Strip izquierdo sólido con código */}
                                                <div
                                                    className="w-[58px] shrink-0 flex items-center justify-center"
                                                    style={{ backgroundColor: accent }}
                                                >
                                                    <span className="text-[11px] font-black text-white tracking-wider text-center leading-tight px-1">
                                                        {displayCode}
                                                    </span>
                                                </div>
                                                {/* Contenido */}
                                                <div className="flex items-center gap-4 pl-4 pr-4 py-4 flex-1">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[17px] font-bold text-white/75 group-hover:text-white transition-colors duration-200 leading-snug">
                                                            {p.nombre}
                                                        </p>
                                                        {p.tagline && (
                                                            <p
                                                                className="text-[14px] leading-relaxed overflow-hidden transition-all duration-300"
                                                                style={{ maxHeight: '0px', opacity: 0, marginTop: '0px', color: 'hsl(var(--muted-foreground))' }}
                                                                ref={el => {
                                                                    if (!el) return;
                                                                    const parent = el.closest('.group');
                                                                    if (!parent) return;
                                                                    parent.addEventListener('mouseenter', () => { el.style.maxHeight = '80px'; el.style.opacity = '1'; el.style.marginTop = '5px'; });
                                                                    parent.addEventListener('mouseleave', () => { el.style.maxHeight = '0px'; el.style.opacity = '0'; el.style.marginTop = '0px'; });
                                                                }}
                                                            >
                                                                {p.tagline}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2.5 shrink-0">
                                                        <button
                                                            onClick={e => { e.stopPropagation(); toggleProcess(p.id); }}
                                                            className="w-7 h-7 rounded-lg border flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                                            style={{
                                                                borderColor: pSelected ? accent : 'hsl(var(--border))',
                                                                background: pSelected ? `${accent}22` : 'transparent',
                                                                color: pSelected ? accent : 'hsl(var(--muted-foreground))',
                                                            }}
                                                        >
                                                            {pSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                                        </button>
                                                        <ArrowRight
                                                            className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                                                            style={{ color: accent }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })()}

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

            </main>

            {/* Sticky CTA bar */}
            {(() => {
                const barAccent = sectorCfg?.accentHex ?? "#0ea5e9";
                return (
                    <div
                        className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t"
                        style={{
                            backgroundColor: `${barAccent}12`,
                            borderColor: `${barAccent}25`,
                            boxShadow: `0 -8px 40px ${barAccent}10`,
                        }}
                    >
                        <div className="mx-auto max-w-[860px] px-4 md:px-6 py-3 flex gap-3 justify-center">
                            <Button
                                variant="ghost"
                                size="lg"
                                className="font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.08]"
                                onClick={() => setShowBookingModal(true)}
                            >
                                Agendar llamada
                            </Button>
                            <Button
                                onClick={toggleSelect}
                                size="lg"
                                className="font-medium border"
                                style={isSelected ? {
                                    backgroundColor: `${barAccent}25`,
                                    borderColor: `${barAccent}55`,
                                    color: barAccent,
                                } : {
                                    backgroundColor: `${barAccent}18`,
                                    borderColor: `${barAccent}40`,
                                    color: "#fff",
                                }}
                            >
                                {isSelected ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                                {isSelected ? "Añadido a mi selección" : "Añadir a mi selección"}
                            </Button>
                        </div>
                    </div>
                );
            })()}


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

            

            <ShareSelectionModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                selectedProcesses={processes.filter(p => selectedProcessIds.has(p.id))}
            />
          <GHLBookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </div>
    );
};

export default ProcessDetail;
