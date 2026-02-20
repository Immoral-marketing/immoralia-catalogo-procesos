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
import { Search, ChevronRight, ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingAnswers, saveOnboardingData, skipOnboarding } from "@/lib/onboarding-utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialAnswers?: OnboardingAnswers | null;
}

const SECTORS = [
    "Peluquería/estética", "Gimnasio/yoga", "Clínica", "Restauración", "Retail",
    "Inmobiliaria", "E-commerce", "Servicios profesionales", "Agencia/marketing", "Otro"
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
        name: "CRM/Ventas",
        tools: ["HubSpot", "Pipedrive", "Zoho", "Salesforce"]
    },
    {
        name: "ERP/Facturación",
        tools: ["Holded", "Sage", "Odoo", "A3", "QuickBooks"]
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

const CHANNELS_CLIENTS = ["WhatsApp", "Instagram DM", "Facebook", "Email", "Teléfono", "Web chat", "Formulario web", "Google Business Messages", "Telegram"];
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

export const OnboardingModal = ({ isOpen, onClose, initialAnswers }: OnboardingModalProps) => {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<OnboardingAnswers>(() => ({
        sector: initialAnswers?.sector || "",
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

    const progress = (step / 6) * 100;

    const nextStep = () => {
        if (step < 6) setStep(step + 1);
        else handleFinish();
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSkip = () => {
        skipOnboarding();
        onClose();
    };

    const handleFinish = async () => {
        setIsSubmitting(true);
        try {
            console.log("Iniciando envío de lead de onboarding:", answers.email);

            const { data, error } = await supabase.functions.invoke("submit-onboarding-lead", {
                body: {
                    nombre: answers.nombre,
                    email: answers.email,
                    telefono: answers.telefono,
                    answers: answers
                }
            });

            if (error) throw error;

            console.log("Lead de onboarding enviado con éxito:", data);
            toast({
                title: "¡Gracias por completar el onboarding!",
                description: "Hemos recibido tu información. Ahora puedes explorar los procesos recomendados.",
            });

            saveOnboardingData(answers);
            onClose();
        } catch (error: any) {
            console.error("Error al enviar lead de onboarding:", error);
            toast({
                variant: "destructive",
                title: "Error al guardar información",
                description: "No hemos podido enviar tus datos de contacto por un error técnico, pero puedes seguir explorando el catálogo.",
            });
            // A pesar del error, dejamos que siga para no bloquear al usuario
            saveOnboardingData(answers);
            onClose();
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
                        <span className="text-sm font-medium text-muted-foreground">Paso {step} de 6</span>
                        <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground hover:text-foreground" disabled={isSubmitting}>
                            Omitir por ahora
                        </Button>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                <div className="flex-1 p-6 overflow-y-auto min-h-0 custom-scrollbar">
                    {step === 1 && (
                        <div className="space-y-4">
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
                            <h2 className="text-2xl font-bold">¿Con qué herramientas trabajáis hoy?</h2>
                            <p className="text-muted-foreground italic">Selecciona todas las que formen parte de tu día a día</p>
                            <div className="space-y-6 pt-2">
                                {TOOLS_CATEGORIES.map(cat => {
                                    return (
                                        <div key={cat.name} className="space-y-2">
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{cat.name}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {cat.tools.map(t => (
                                                    <Button
                                                        key={t}
                                                        variant={answers.tools.includes(t) ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setAnswers({ ...answers, tools: toggleItem(answers.tools, t) })}
                                                    >
                                                        {t}
                                                    </Button>
                                                ))}
                                                <Button
                                                    variant={answers.tools.includes(`${cat.name}: Otro`) ? "default" : "outline"}
                                                    size="sm"
                                                    className={cn(
                                                        !answers.tools.includes(`${cat.name}: Otro`) && "text-primary border-primary/50 hover:bg-primary/5"
                                                    )}
                                                    onClick={() => setAnswers({ ...answers, tools: toggleItem(answers.tools, `${cat.name}: Otro`) })}
                                                >
                                                    Otro
                                                </Button>
                                            </div>
                                            {answers.tools.includes(`${cat.name}: Otro`) && (
                                                <div className="pt-1 animate-in fade-in slide-in-from-top-1">
                                                    <Input
                                                        placeholder={`¿Qué otro ${cat.name.toLowerCase()} usáis?`}
                                                        className="h-8 text-sm"
                                                        value={answers[`other_${cat.name}`] || ""}
                                                        onChange={(e) => setAnswers({ ...answers, [`other_${cat.name}`]: e.target.value })}
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
                                <h2 className="text-2xl font-bold">¿Cómo gestionáis las comunicaciones?</h2>
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
                            <h2 className="text-2xl font-bold">Madurez tecnológica y uso de IA</h2>
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
                                    <Label htmlFor="ai-usage" className="text-base cursor-pointer font-semibold">Ya usamos alguna IA en nuestro día a día</Label>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Cuéntanos para qué la usáis (ej: escribir emails, generar imágenes, análisis de datos...) y qué herramienta utilizáis.
                                </p>
                                {answers.usesAI && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-1">
                                            <Label className="text-xs">¿Qué herramientas usáis?</Label>
                                            <Input
                                                placeholder="ChatGPT, Midjourney, Claude..."
                                                value={answers.aiTools || ""}
                                                onChange={(e) => setAnswers({ ...answers, aiTools: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">¿Para qué tareas las utilizáis?</Label>
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
                            <h2 className="text-2xl font-bold">¿Dónde sientes que perdéis más tiempo?</h2>
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
                                    <Label className="text-foreground font-semibold">¿Cuál es vuestro mayor freno operativo hoy? (opcional)</Label>
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
                </div>


                <div className="p-6 border-t border-border flex justify-between bg-card/80 backdrop-blur-sm">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={step === 1 || isSubmitting}
                        className={step === 1 ? "invisible" : ""}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>
                    <Button
                        onClick={nextStep}
                        disabled={
                            isSubmitting ||
                            (step === 1 && !answers.sector) ||
                            (step === 2 && answers.tools.length === 0 && !answers.otherTool) ||
                            (step === 6 && (!answers.nombre || !answers.email || !answers.email.includes("@")))
                        }
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                {step === 6 ? "Finalizar" : "Siguiente"} <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
