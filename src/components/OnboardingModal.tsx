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

export const OnboardingModal = ({ isOpen, onClose, initialAnswers, prefilledSector }: OnboardingModalProps) => {
    const [step, setStep] = useState(prefilledSector ? 2 : 1);
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
    const { toast } = useToast();

    const [searchTerm, setSearchTerm] = useState("");

    const progress = (step / 7) * 100;

    const nextStep = () => {
        if (step < 6) setStep(step + 1);
        else if (step === 6) handleFinish();
    };

    const prevStep = () => {
        if (step > (prefilledSector ? 2 : 1) && step < 7) setStep(step - 1);
    };

    const handleSkip = () => {
        skipOnboarding();
        onClose();
    };

    const handleFinish = async () => {
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
                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between mb-4 pr-8">
                        <span className="text-sm font-medium text-muted-foreground">
                            {step < 7 ? `Paso ${step} de 6` : "¡Todo listo!"}
                        </span>
                        {step < 7 && (
                            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground hover:text-foreground" disabled={isSubmitting}>
                                Omitir por ahora
                            </Button>
                        )}
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                <div className="flex-1 p-6 overflow-y-auto min-h-0 custom-scrollbar">
                    {step === 1 && (
                        <div className="space-y-4">
                            <GuidanceMessage 
                                id="inicio_quiz" 
                                className="mb-6"
                                message={
                                    <span>
                                        <strong>¡Hola! Queremos conocerte un poco.</strong> Responde estas breves preguntas para que podamos recomendarte exactamente lo que tu negocio necesita.
                                    </span>
                                } 
                            />
                            <h2 className="text-2xl font-bold">¿En qué sector se mueve tu negocio?</h2>
                            <div className="grid grid-cols-2 gap-2 pt-2">
                                {filteredSectors.map(s => (
                                    <Button
                                        key={s}
                                        variant={answers.sector === s ? "default" : "outline"}
                                        className={cn(
                                            "justify-start h-auto py-3 text-left",
                                            s === "Otro" && answers.sector !== "Otro" && "text-primary border-primary/50 hover:bg-primary/5"
                                        )}
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

                                                    return (
                                                        <Button
                                                            key={toolId}
                                                            variant={isSelected ? "default" : "outline"}
                                                            size="sm"
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
                                                    className={cn(
                                                        !answers.tools.includes(`${categoryName}: Otro`) && "text-primary border-primary/50 hover:bg-primary/5"
                                                    )}
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
                                            className={cn(
                                                !answers.channels.clients.includes("Otro") && "text-primary border-primary/50 hover:bg-primary/5"
                                            )}
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
                                        className={cn(
                                            !answers.channels.internal.includes("Otro") && "text-primary border-primary/50 hover:bg-primary/5"
                                        )}
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
                                {MATURITY_LEVELS.map(level => (
                                    <button
                                        key={level.id}
                                        onClick={() => setAnswers({ ...answers, maturity: level.id as any })}
                                        className={`w-full text-left p-4 rounded-lg border transition-all ${answers.maturity === level.id
                                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                                            : "border-border hover:border-primary/50"
                                            }`}
                                    >
                                        <div className="font-bold">{level.label}</div>
                                        <div className="text-sm text-muted-foreground">{level.description}</div>
                                    </button>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-border">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Checkbox
                                        id="ai-usage"
                                        checked={answers.usesAI}
                                        onCheckedChange={(checked) => setAnswers({ ...answers, usesAI: checked as boolean })}
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
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">¿Para qué tareas las utilizas?</Label>
                                            <Input
                                                placeholder="Ej: Atención al cliente, soporte, redacción..."
                                                value={answers.aiUsagePurpose || ""}
                                                onChange={(e) => setAnswers({ ...answers, aiUsagePurpose: e.target.value })}
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
                                        className="justify-start h-auto py-3 text-left whitespace-normal leading-tight"
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
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-foreground font-semibold">¿Cuál es tu mayor freno operativo hoy? (opcional)</Label>
                                    <Input
                                        placeholder="Lo que más nos frena es..."
                                        value={answers.biggestPain || ""}
                                        onChange={(e) => setAnswers({ ...answers, biggestPain: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 6 && (
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
                                    />
                                </div>
                            </div>

                        </div>
                    )}

                    {step === 7 && (
                        <div className="flex flex-col items-center justify-center py-4 px-4 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                                <Sparkles className="h-12 w-12 text-primary animate-pulse" />
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
                            <div className="grid grid-cols-1 gap-3 w-full max-w-sm pt-4">
                                <div className="flex items-center space-x-3 text-left p-4 bg-secondary/30 rounded-xl border border-border/50">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <p className="text-sm font-medium">Procesos filtrados por relevancia</p>
                                </div>
                                <div className="flex items-center space-x-3 text-left p-4 bg-secondary/30 rounded-xl border border-border/50">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <p className="text-sm font-medium">Soluciones adaptadas a tu tecnología</p>
                                </div>
                            </div>
                            
                            <div className="w-full max-w-sm mt-8">
                                <GuidanceMessage 
                                    id="post_quiz"
                                    message={
                                        <span>
                                            <strong>¡Todo listo!</strong> Hemos preparado una selección de procesos especialmente pensada para ahorrarte tiempo. Cierra esta ventana para descubrirlos.
                                        </span>
                                    } 
                                />
                            </div>
                        </div>
                    )}
                </div>


                <div className="p-6 border-t border-border flex justify-between bg-card/80 backdrop-blur-sm">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={step === 1 || step === 7 || isSubmitting}
                        className={step === 1 || step === 7 ? "invisible" : ""}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>
                    <Button
                        onClick={step === 7 ? onClose : nextStep}
                        disabled={
                            isSubmitting ||
                            (step === 1 && !answers.sector) ||
                            (step === 2 && answers.tools.length === 0 && !answers.otherTool) ||
                            (step === 6 && (!answers.nombre || !answers.email || !answers.email.includes("@")))
                        }
                        className={cn(step === 7 && "w-full sm:w-auto px-8 py-6 text-lg")}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                {step === 6 ? "Finalizar" : step === 7 ? "Ver mis recomendaciones" : "Siguiente"} <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
