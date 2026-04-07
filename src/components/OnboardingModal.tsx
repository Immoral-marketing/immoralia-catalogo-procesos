import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Search, ChevronRight, ChevronLeft, X, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingAnswers, saveOnboardingData, skipOnboarding } from "@/lib/onboarding-utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { GuidanceMessage } from "./GuidanceMessage";

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialAnswers?: OnboardingAnswers | null;
    prefilledSector?: string;
    accentColor?: string;
    upsellMode?: boolean;
    onFinishUpsell?: (answers: OnboardingAnswers) => void;
}

const SECTORS = [
    "Peluquería/estética", "Gimnasio/yoga", "Clínica", "Restauración", "Retail",
    "Inmobiliaria", "E-commerce", "Servicios profesionales", "Agencia/marketing", 
    "Gestoría", "Centros Deportivos", "Otro"
];

const TOOLS_CATEGORIES = [
    {
        name: "Suite",
        tools: ["Google Workspace", "Microsoft 365"]
    },
    {
        name: "Gestión Documental",
        tools: ["Drive", "OneDrive", "SharePoint", "Dropbox"]
    },
    {
        name: "Hojas de cálculo",
        tools: ["Excel", "Google Sheets"]
    },
    {
        name: "Gestión",
        tools: ["ClickUp", "Notion", "Asana", "Trello", "Monday"]
    },
    {
        id: "crm",
        label: "CRM / Ventas",
        tools: [
            { id: "HubSpot", label: "HubSpot" },
            { id: "Pipedrive", label: "Pipedrive" },
            { id: "Zoho", label: "Zoho" },
            { id: "Salesforce", label: "Salesforce" },
            { id: "Microsoft Dynamics 365 Sales", label: "Microsoft Dynamics 365 Sales" },
            { id: "Freshsales (Freshworks CRM)", label: "Freshsales (Freshworks CRM)" },
            { id: "Monday Sales CRM", label: "Monday Sales CRM" },
            { id: "SugarCRM", label: "SugarCRM" },
            { id: "Zendesk Sell", label: "Zendesk Sell" },
            { id: "Insightly", label: "Insightly" },
            { id: "Close (Close.io)", label: "Close (Close.io)" },
            { id: "Copper CRM", label: "Copper CRM" },
            { id: "ActiveCampaign (Deals CRM)", label: "ActiveCampaign (Deals CRM)" }
        ]
    },
    {
        id: "erp",
        label: "ERP / Facturación",
        tools: [
            { id: "Holded", label: "Holded" },
            { id: "Sage", label: "Sage" },
            { id: "Odoo", label: "Odoo" },
            { id: "A3", label: "A3" },
            { id: "QuickBooks", label: "QuickBooks" },
            { id: "Microsoft Dynamics 365 Business Central", label: "Microsoft Dynamics 365 Business Central" },
            { id: "SAP Business One", label: "SAP Business One" },
            { id: "Oracle NetSuite", label: "Oracle NetSuite" },
            { id: "Cegid (Ekon/XRP)", label: "Cegid (Ekon/XRP)" },
            { id: "Xero", label: "Xero" },
            { id: "SAP S/4HANA", label: "SAP S/4HANA" },
            { id: "Oracle ERP Cloud", label: "Oracle ERP Cloud" },
            { id: "Workday", label: "Workday" }
        ]
    },
    {
        name: "E-commerce",
        tools: ["Shopify", "WooCommerce", "Prestashop"]
    },
    {
        name: "Reservas",
        tools: ["Calendly", "Booksy", "Treatwell", "SimplyBook"]
    },
    {
        name: "Soporte",
        tools: ["Zendesk", "Freshdesk"]
    },
    {
        name: "Automatización/IA",
        tools: ["Zapier", "Make", "n8n", "ChatGPT/otros"]
    }
];

const CHANNELS_CLIENTS = ["WhatsApp", "Instagram DM", "Facebook", "Email", "Slack", "Teléfono", "Web chat", "Formulario web", "Google Business Messages", "Telegram"];
const CHANNELS_INTERNAL = ["Slack", "Teams", "WhatsApp", "Email", "Notion", "ClickUp"];

const MATURITY_LEVELS = [
    { id: "Básico", label: "Básico", description: "Todo manual, poco ordenado" },
    { id: "Intermedio", label: "Intermedio", description: "Usamos herramientas (Drive/Excel/CRM) pero sin automatizaciones" },
    { id: "Avanzado", label: "Avanzado", description: "Ya usamos automatizaciones o IA (Zapier/Make/bots/reporting)" }
];

const PAINS = [
    "Me escriben mucho y no doy abasto",
    "Tardamos en responder y perdemos clientes",
    "Tengo muchas preguntas repetidas (horarios, precios, ubicación…)",
    "Se olvidan de la cita / hay muchas ausencias",
    "Necesito más reservas / más clientes",
    "No hago seguimiento a las personas interesadas",
    "Pierdo solicitudes entre WhatsApp/Instagram/email",
    "Quiero pedir reseñas de forma automática",
    "Quiero ordenar tareas y que se asignen solas",
    "Necesito centralizar la información de clientes",
    "Quiero automatizar presupuestos y respuestas"
];

export const OnboardingModal = ({ isOpen, onClose, initialAnswers, prefilledSector, accentColor = "#0ea5e9", upsellMode = false, onFinishUpsell }: OnboardingModalProps) => {
    // step 0: Intro
    const [step, setStep] = useState(0); 
    const [answers, setAnswers] = useState<OnboardingAnswers>(() => ({
        sector: prefilledSector || initialAnswers?.sector || "",
        tools: Array.isArray(initialAnswers?.tools) ? initialAnswers.tools : [],
        channels: initialAnswers?.channels || { clients: [], internal: [] },
        maturity: initialAnswers?.maturity || "Básico",
        usesAI: initialAnswers?.usesAI || false,
        volume: initialAnswers?.volume || "",
        pains: Array.isArray(initialAnswers?.pains) ? initialAnswers.pains : [],
        nombre: initialAnswers?.nombre || "",
        email: initialAnswers?.email || "",
        telefono: initialAnswers?.telefono || "",
        ...(initialAnswers || {})
    }));

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPrevHovered, setIsPrevHovered] = useState(false);
    const [isSkipHovered, setIsSkipHovered] = useState(false);
    const [hoveredToolId, setHoveredToolId] = useState<string | null>(null);
    const { toast } = useToast();

    const [searchTerm, setSearchTerm] = useState("");

    const isSectorStepSkipped = !!prefilledSector;
    const totalQuestions = isSectorStepSkipped ? 5 : 6;

    const getDisplayStepNumber = () => {
        if (step === 0) return 0;
        if (step === 1) return 1;
        return isSectorStepSkipped ? step - 1 : step;
    };

    const progress = step === 0 ? 0 : (getDisplayStepNumber() / totalQuestions) * 100;

    const nextStep = () => {
        if (step === 0) {
            setStep(isSectorStepSkipped ? 2 : 1);
        } else if (step === 5 && upsellMode) {
            handleFinish();
        } else if (step < 6) {
            setStep(step + 1);
        } else if (step === 6) {
            handleFinish();
        }
    };

    const prevStep = () => {
        if (step === 1) setStep(0);
        else if (step === 2) setStep(isSectorStepSkipped ? 0 : 1);
        else if (step > 1 && step < 7) setStep(step - 1);
    };

    const handleSkip = () => {
        skipOnboarding();
        if (upsellMode && onFinishUpsell) {
            onFinishUpsell(answers);
        } else {
            onClose();
        }
    };

    const handleFinish = async () => {
        if (upsellMode && onFinishUpsell) {
            setIsSubmitting(true);
            await onFinishUpsell(answers); // Podría ser una promesa si hace peticiones de red
            setIsSubmitting(false);
            return;
        }
        setIsSubmitting(true);
        try {
            console.log("Iniciando envío de Quick Form Lead:", answers.email);

            const { data, error } = await supabase.functions.invoke("submit-onboarding-lead", {
                body: {
                    nombre: answers.nombre,
                    email: answers.email,
                    telefono: answers.telefono,
                    answers: answers
                }
            });

            if (error) throw error;

            console.log("Lead de Quick Form enviado con éxito:", data);
            
            saveOnboardingData(answers);
            setStep(7);
        } catch (error: any) {
            console.error("Error al enviar lead de onboarding:", error);
            toast({
                variant: "destructive",
                title: "Error al guardar información",
                description: "No hemos podido enviar tus datos de contacto por un error técnico, pero puedes seguir explorando el catálogo.",
            });
            // A pesar del error, dejamos que siga para no bloquear al usuario
            saveOnboardingData(answers);
            setStep(7);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleItem = (list: string[], item: string) => {
        return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
    };

    const filteredSectors = SECTORS;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-card border-border p-0 overflow-hidden flex flex-col max-h-[90vh]">
                {step < 7 && (
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center justify-between mb-4 pr-8">
                            <span className="text-sm font-medium text-muted-foreground">
                                {step === 0 
                                    ? "Introducción" 
                                    : `Paso ${getDisplayStepNumber()} de ${totalQuestions}`
                                }
                            </span>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleSkip} 
                                className="text-muted-foreground transition-colors" 
                                disabled={isSubmitting}
                                onMouseEnter={() => setIsSkipHovered(true)}
                                onMouseLeave={() => setIsSkipHovered(false)}
                                style={isSkipHovered ? { color: 'white', backgroundColor: accentColor } : {}}
                            >
                                Omitir por ahora
                            </Button>
                        </div>
                        <div 
                            className={cn(
                                "h-2 w-full rounded-full overflow-hidden",
                                prefilledSector ? "bg-white/10" : "bg-black/20"
                            )}
                        >
                            <div 
                                className="h-full transition-all duration-500 ease-out" 
                                style={{ 
                                    width: `${progress}%`,
                                    backgroundColor: accentColor 
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex-1 p-6 overflow-y-auto min-h-0 custom-scrollbar">
                    {step === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="h-20 w-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 rotate-3 hover:rotate-0 transition-transform duration-300" style={{ backgroundColor: `${accentColor}15` }}>
                                <Sparkles className="h-10 w-10 text-primary" style={{ color: accentColor }} />
                            </div>
                            {upsellMode ? (
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-bold tracking-tight">Ayúdanos a afinar tu propuesta</h2>
                                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                                        Responde estas {totalQuestions} breves preguntas sobre cómo trabajáis hoy (menos de 2 min) para que podamos calcular tiempos y costes técnicos con absoluta precisión.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-bold tracking-tight">Personaliza tu Catálogo</h2>
                                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                                        Responde {totalQuestions} breves preguntas (menos de 2 min) para que podamos identificar qué procesos son automatizables en tu negocio y mostrarte una selección totalmente personalizada.
                                    </p>
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-3 w-full max-w-sm pt-4">
                                <div className="flex items-center space-x-3 text-left p-4 bg-secondary/30 rounded-xl border border-border/50">
                                    <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}20` }}>
                                        <CheckCircle2 className="h-5 w-5" style={{ color: accentColor }} />
                                    </div>
                                    <p className="text-sm font-medium">Recomendaciones basadas en tu sector</p>
                                </div>
                                <div className="flex items-center space-x-3 text-left p-4 bg-secondary/30 rounded-xl border border-border/50">
                                    <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}20` }}>
                                        <CheckCircle2 className="h-5 w-5" style={{ color: accentColor }} />
                                    </div>
                                    <p className="text-sm font-medium">Análisis de viabilidad técnica (IA/Tools)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 1 && !isSectorStepSkipped && (
                        <div className="space-y-4">
                            <GuidanceMessage 
                                id="inicio_quiz" 
                                className="mb-6"
                                message={
                                    upsellMode ? (
                                        <span>
                                            <strong>¡Gracias por tus datos!</strong> Esta información extra nos permite ser mucho más precisos a la hora de estructurar tu automatización.
                                        </span>
                                    ) : (
                                        <span>
                                            <strong>¡Hola! Queremos conocerte un poco.</strong> Responde estas breves preguntas para que podamos recomendarte exactamente lo que tu negocio necesita.
                                        </span>
                                    )
                                } 
                            />
                            <h2 className="text-2xl font-bold">¿En qué sector se mueve tu negocio?</h2>
                            <div className="grid grid-cols-2 gap-2 pt-2">
                                {SECTORS.map(s => (
                                    <Button
                                        key={s}
                                        variant={answers.sector === s ? "default" : "outline"}
                                        className={cn(
                                            "justify-start h-auto py-3 text-left transition-all",
                                            answers.sector === s && "ring-2 ring-offset-2 ring-offset-background",
                                        )}
                                        style={
                                            answers.sector === s 
                                            ? { backgroundColor: accentColor, color: 'white', borderColor: accentColor } 
                                            : (s === "Otro" ? { color: accentColor, borderColor: `${accentColor}80` } : {})
                                        }
                                        onClick={() => setAnswers({ ...answers, sector: s })}
                                    >
                                        {s}
                                    </Button>
                                ))}
                            </div>
                            {answers.sector === "Otro" && (
                                <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2">
                                    <Label>¿Cuál es tu sector?</Label>
                                    <Input
                                        placeholder="Escribe tu sector..."
                                        value={answers.otherSector || ""}
                                        onChange={(e) => setAnswers({ ...answers, otherSector: e.target.value })}
                                        style={{ '--tw-ring-color': accentColor } as any}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">¿Con qué herramientas trabajas hoy?</h2>
                            <p className="text-muted-foreground italic">Selecciona todas las que formen parte de tu día a día</p>
                            <div className="space-y-6 pt-2">
                                {TOOLS_CATEGORIES.map(cat => {
                                    const isPlatformCategory = 'id' in cat;
                                    const categoryName = isPlatformCategory ? (cat as any).label : (cat as any).name;
                                    const toolsList = cat.tools;

                                    return (
                                        <div key={categoryName} className="space-y-2">
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{categoryName}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {toolsList.map((t: any) => {
                                                    const toolId = typeof t === 'string' ? t : t.id;
                                                    const toolLabel = typeof t === 'string' ? t : t.label;
                                                    const isSelected = answers.tools.includes(toolId);

                                                    const isToolHovered = hoveredToolId === toolId;
                                                    return (
                                                        <Button
                                                            key={toolId}
                                                            variant={isSelected ? "default" : "outline"}
                                                            size="sm"
                                                            className="transition-all"
                                                            style={
                                                                isSelected
                                                                    ? { backgroundColor: accentColor, color: 'white', borderColor: accentColor }
                                                                    : isToolHovered
                                                                    ? { backgroundColor: accentColor, color: 'white', borderColor: accentColor }
                                                                    : {}
                                                            }
                                                            onMouseEnter={() => setHoveredToolId(toolId)}
                                                            onMouseLeave={() => setHoveredToolId(null)}
                                                            onClick={() => {
                                                                let newTools = toggleItem(answers.tools, toolId);
                                                                let extra: any = {};

                                                                if (isPlatformCategory) {
                                                                    const platformKey = cat.id === 'crm' ? 'selected_crm_platform_id' : 'selected_erp_platform_id';
                                                                    // Si seleccionamos uno, deseleccionamos el anterior de la misma categoría (radio-like behavior for complexity)
                                                                    if (!isSelected) {
                                                                        const otherToolsInCat = toolsList.filter((ot: any) => ot.id !== toolId).map((ot: any) => ot.id);
                                                                        newTools = newTools.filter(nt => !otherToolsInCat.includes(nt));
                                                                        extra[platformKey] = toolId;
                                                                    } else {
                                                                        extra[platformKey] = "";
                                                                    }
                                                                }

                                                                setAnswers({ ...answers, tools: newTools, ...extra });
                                                            }}
                                                        >
                                                            {toolLabel}
                                                        </Button>
                                                    );
                                                })}
                                                <Button
                                                    variant={answers.tools.includes(`${categoryName}: Otro`) ? "default" : "outline"}
                                                    size="sm"
                                                    style={
                                                        answers.tools.includes(`${categoryName}: Otro`) 
                                                        ? { backgroundColor: accentColor, color: 'white', borderColor: accentColor } 
                                                        : hoveredToolId === `${categoryName}: Otro`
                                                        ? { backgroundColor: accentColor, color: 'white', borderColor: accentColor }
                                                        : { color: accentColor, borderColor: `${accentColor}80` }
                                                    }
                                                    onMouseEnter={() => setHoveredToolId(`${categoryName}: Otro`)}
                                                    onMouseLeave={() => setHoveredToolId(null)}
                                                    onClick={() => setAnswers({ ...answers, tools: toggleItem(answers.tools, `${categoryName}: Otro`) })}
                                                >
                                                    Otro
                                                </Button>
                                            </div>
                                            {answers.tools.includes(`${categoryName}: Otro`) && (
                                                <div className="pt-1 animate-in fade-in slide-in-from-top-1">
                                                    <Input
                                                        placeholder={`¿Qué otro ${categoryName.toLowerCase()} usas?`}
                                                        className="h-8 text-sm"
                                                        value={answers[`other_${categoryName}`] || ""}
                                                        onChange={(e) => setAnswers({ ...answers, [`other_${categoryName}`]: e.target.value })}
                                                        style={{ '--tw-ring-color': accentColor } as any}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">¿Cómo gestionas las comunicaciones?</h2>
                                <div className="space-y-4">
                                    <Label className="text-base font-semibold text-foreground">Canales de contacto con clientes</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {CHANNELS_CLIENTS.map(c => (
                                            <Button
                                                key={c}
                                                variant={answers.channels.clients.includes(c) ? "default" : "outline"}
                                                size="sm"
                                                style={answers.channels.clients.includes(c) ? { backgroundColor: accentColor, color: 'white', borderColor: accentColor } : {}}
                                                onClick={() => setAnswers({
                                                    ...answers,
                                                    channels: { ...answers.channels, clients: toggleItem(answers.channels.clients, c) }
                                                })}
                                            >
                                                {c}
                                            </Button>
                                        ))}
                                        <Button
                                            variant={answers.channels.clients.includes("Otro") ? "default" : "outline"}
                                            size="sm"
                                            style={
                                                answers.channels.clients.includes("Otro") 
                                                ? { backgroundColor: accentColor, color: 'white', borderColor: accentColor } 
                                                : hoveredToolId === "channel-client-otro"
                                                ? { backgroundColor: accentColor, color: 'white', borderColor: accentColor }
                                                : { color: accentColor, borderColor: `${accentColor}80` }
                                            }
                                            onMouseEnter={() => setHoveredToolId("channel-client-otro")}
                                            onMouseLeave={() => setHoveredToolId(null)}
                                            onClick={() => setAnswers({
                                                ...answers,
                                                channels: { ...answers.channels, clients: toggleItem(answers.channels.clients, "Otro") }
                                            })}
                                        >
                                            Otro
                                        </Button>
                                    </div>
                                    {answers.channels.clients.includes("Otro") && (
                                        <div className="pt-1 animate-in fade-in slide-in-from-top-1">
                                            <Input
                                                placeholder="¿Qué otro canal con clientes usáis?"
                                                className="h-8 text-sm"
                                                value={answers.otherClientChannel || ""}
                                                onChange={(e) => setAnswers({ ...answers, otherClientChannel: e.target.value })}
                                                style={{ '--tw-ring-color': accentColor } as any}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-lg font-semibold">Comunicación interna</Label>
                                <div className="flex flex-wrap gap-2">
                                    {CHANNELS_INTERNAL.map(c => (
                                        <Button
                                            key={c}
                                            variant={answers.channels.internal.includes(c) ? "default" : "outline"}
                                            size="sm"
                                            style={answers.channels.internal.includes(c) ? { backgroundColor: accentColor, color: 'white', borderColor: accentColor } : {}}
                                            onClick={() => setAnswers({
                                                ...answers,
                                                channels: { ...answers.channels, internal: toggleItem(answers.channels.internal, c) }
                                            })}
                                        >
                                            {c}
                                        </Button>
                                    ))}
                                    <Button
                                        variant={answers.channels.internal.includes("Otro") ? "default" : "outline"}
                                        size="sm"
                                        style={
                                            answers.channels.internal.includes("Otro") 
                                            ? { backgroundColor: accentColor, color: 'white', borderColor: accentColor } 
                                            : hoveredToolId === "channel-internal-otro"
                                            ? { backgroundColor: accentColor, color: 'white', borderColor: accentColor }
                                            : { color: accentColor, borderColor: `${accentColor}80` }
                                        }
                                        onMouseEnter={() => setHoveredToolId("channel-internal-otro")}
                                        onMouseLeave={() => setHoveredToolId(null)}
                                        onClick={() => setAnswers({
                                            ...answers,
                                            channels: { ...answers.channels, internal: toggleItem(answers.channels.internal, "Otro") }
                                        })}
                                    >
                                        Otro
                                    </Button>
                                </div>
                                {answers.channels.internal.includes("Otro") && (
                                    <div className="pt-1 animate-in fade-in slide-in-from-top-1">
                                        <Input
                                            placeholder="¿Qué otro canal interno usáis?"
                                            className="h-8 text-sm"
                                            value={answers.otherInternalChannel || ""}
                                            onChange={(e) => setAnswers({ ...answers, otherInternalChannel: e.target.value })}
                                            style={{ '--tw-ring-color': accentColor } as any}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">¿Qué tan avanzada está tu empresa en el uso de tecnología e IA?</h2>
                            <div className="space-y-3">
                                {MATURITY_LEVELS.map(level => {
                                    const isSelected = answers.maturity === level.id;
                                    return (
                                        <button
                                            key={level.id}
                                            onClick={() => setAnswers({ ...answers, maturity: level.id as any })}
                                            className={cn(
                                                "w-full text-left p-4 rounded-lg border transition-all",
                                                isSelected 
                                                    ? "bg-primary/5 ring-1" 
                                                    : "border-border hover:border-primary/50"
                                            )}
                                            style={isSelected ? { borderColor: accentColor } : {}}
                                        >
                                            <div className="font-bold">{level.label}</div>
                                            <div className="text-sm text-muted-foreground">{level.description}</div>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="pt-4 border-t border-border">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Checkbox
                                        id="ai-usage"
                                        checked={answers.usesAI}
                                        onCheckedChange={(checked) => setAnswers({ ...answers, usesAI: checked as boolean })}
                                        className={cn(answers.usesAI && "bg-primary border-primary")}
                                        style={answers.usesAI ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                                    />
                                    <Label htmlFor="ai-usage" className="text-base cursor-pointer font-semibold">¿Tu empresa ya utiliza IA?</Label>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Cuéntanos para qué la usas (ej: escribir emails, generar imágenes, análisis de datos...) y qué herramienta utilizas.
                                </p>
                                {answers.usesAI && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-1">
                                            <Label className="text-xs">¿Qué herramientas usas?</Label>
                                            <Input
                                                placeholder="ChatGPT, Midjourney, Claude..."
                                                value={answers.aiTools || ""}
                                                onChange={(e) => setAnswers({ ...answers, aiTools: e.target.value })}
                                                style={{ '--tw-ring-color': accentColor } as any}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">¿Para qué tareas las utilizas?</Label>
                                            <Input
                                                placeholder="Ej: Atención al cliente, soporte, redacción..."
                                                value={answers.aiUsagePurpose || ""}
                                                onChange={(e) => setAnswers({ ...answers, aiUsagePurpose: e.target.value })}
                                                style={{ '--tw-ring-color': accentColor } as any}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">¿Dónde sientes que pierdes más tiempo?</h2>
                            <p className="text-muted-foreground italic">Selecciona los mayores cuellos de botella hoy mismo</p>
                            <div className="grid gap-2 pt-2">
                                {PAINS.map(p => (
                                    <Button
                                        key={p}
                                        variant={answers.pains.includes(p) ? "default" : "outline"}
                                        className="justify-start h-auto py-3 text-left whitespace-normal leading-tight transition-all"
                                        style={answers.pains.includes(p) ? { backgroundColor: accentColor, color: 'white', borderColor: accentColor } : {}}
                                        onClick={() => setAnswers({ ...answers, pains: toggleItem(answers.pains, p) })}
                                    >
                                        {p}
                                    </Button>
                                ))}
                            </div>
                            <div className="space-y-3 pt-4 border-t border-border">
                                <div className="space-y-1">
                                    <Label className="text-foreground font-semibold">¿Qué más te gustaría que automatizáramos?</Label>
                                    <Input
                                        placeholder="Escribe aquí cualquier otro dolor o necesidad..."
                                        value={answers.otherPain || ""}
                                        onChange={(e) => setAnswers({ ...answers, otherPain: e.target.value })}
                                        style={{ '--tw-ring-color': accentColor } as any}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-foreground font-semibold">¿Cuál es tu mayor freno operativo hoy? (opcional)</Label>
                                    <Input
                                        placeholder="Lo que más nos frena es..."
                                        value={answers.biggestPain || ""}
                                        onChange={(e) => setAnswers({ ...answers, biggestPain: e.target.value })}
                                        style={{ '--tw-ring-color': accentColor } as any}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 6 && !upsellMode && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">Por último, ¿cómo podemos contactarte?</h2>
                            <p className="text-muted-foreground">
                                Tu perfil de automatización está listo. Danos tus datos para ver tus recomendaciones personalizadas y guardar tu progreso.
                            </p>
                            <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre completo *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Tu nombre..."
                                        value={answers.nombre || ""}
                                        onChange={(e) => setAnswers({ ...answers, nombre: e.target.value })}
                                        style={{ '--tw-ring-color': accentColor } as any}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo electrónico *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={answers.email || ""}
                                        onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                                        style={{ '--tw-ring-color': accentColor } as any}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono (opcional)</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+34 600 000 000"
                                        value={answers.telefono || ""}
                                        onChange={(e) => setAnswers({ ...answers, telefono: e.target.value })}
                                        style={{ '--tw-ring-color': accentColor } as any}
                                    />
                                </div>
                            </div>

                        </div>
                    )}

                    {step === 7 && (
                        <div className="flex flex-col items-center justify-center py-4 px-4 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${accentColor}15` }}>
                                <Sparkles className="h-12 w-12" style={{ color: accentColor }} />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-3xl font-bold tracking-tight">
                                    {answers.sector && answers.sector !== "Otro"
                                        ? `Según tus respuestas para el sector de ${answers.sector.toLowerCase()}, esto es lo que hemos preparado:`
                                        : "Según tus respuestas, esto es lo que hemos preparado:"}
                                </h2>
                                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                                    Hemos analizado tus cuellos de botella y seleccionado los procesos que más impacto tendrán en tu eficiencia operativa.
                                </p>
                            </div>
                            <div className="w-full max-w-sm mt-8">
                                <Button 
                                    onClick={onClose}
                                    className="w-full py-6 text-lg font-bold shadow-lg transition-all hover:scale-105"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    Ver mis recomendaciones <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {step < 7 && (
                    <div className="p-6 border-t border-border flex justify-between bg-card/80 backdrop-blur-sm">
                        <Button
                            variant="ghost"
                            onClick={prevStep}
                            onMouseEnter={() => setIsPrevHovered(true)}
                            onMouseLeave={() => setIsPrevHovered(false)}
                            disabled={step === 0 || isSubmitting}
                            className={cn(step === 0 ? "invisible" : "transition-colors")}
                            style={isPrevHovered ? { backgroundColor: accentColor, color: 'white' } : {}}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                        </Button>
                        <Button
                            onClick={nextStep}
                            disabled={
                                isSubmitting ||
                                (step === 1 && !answers.sector) ||
                                (step === 2 && answers.tools.length === 0) ||
                                (step === 6 && (!answers.nombre || !answers.email || !answers.email.includes("@")))
                            }
                            className="px-8 transition-all hover:scale-105 active:scale-95 text-white"
                            style={{ backgroundColor: accentColor }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    {step === 0 ? "Empezar" : (step === 6 || (step === 5 && upsellMode)) ? "Finalizar" : "Siguiente"} <ChevronRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
