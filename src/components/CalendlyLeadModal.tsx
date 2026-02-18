import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar } from "lucide-react";

interface CalendlyLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeCategory?: string | null;
    selectedProcessIds?: string[];
}

export const CalendlyLeadModal = ({
    isOpen,
    onClose,
    activeCategory,
    selectedProcessIds = []
}: CalendlyLeadModalProps) => {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        empresa: "",
        telefono: "",
        necesidad: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase.functions.invoke("submit-onboarding-lead", {
                body: {
                    nombre: formData.nombre,
                    email: formData.email,
                    telefono: formData.telefono,
                    answers: {
                        origen: "cta_no_encuentro",
                        empresa: formData.empresa,
                        necesidad: formData.necesidad,
                        categoria_activa: activeCategory || "todas",
                        procesos_seleccionados: selectedProcessIds,
                        timestamp: new Date().toISOString()
                    }
                }
            });

            if (error) throw error;

            toast({
                title: "¡Perfecto!",
                description: "Redirigiendo a Calendly para agendar tu llamada...",
            });

            // Redirect to Calendly in a new tab
            window.open("https://calendly.com/david-immoral/30min", "_blank");

            // Clear form and close
            setFormData({
                nombre: "",
                email: "",
                empresa: "",
                telefono: "",
                necesidad: ""
            });
            onClose();
        } catch (error: any) {
            console.error("Error al registrar lead:", error);
            toast({
                variant: "destructive",
                title: "Error al procesar",
                description: "Hubo un problema al guardar tus datos. Por favor, intenta de nuevo.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-card border-border">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">Cuéntanos tu caso</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Antes de agendar, necesitamos unos datos básicos para preparar la llamada.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre y apellidos *</Label>
                            <Input
                                id="nombre"
                                required
                                placeholder="Tu nombre..."
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email corporativo *</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                placeholder="tu@empresa.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="empresa">Empresa (opcional)</Label>
                            <Input
                                id="empresa"
                                placeholder="Nombre de tu empresa..."
                                value={formData.empresa}
                                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono (opcional)</Label>
                            <Input
                                id="telefono"
                                type="tel"
                                placeholder="+34 600 000 000"
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="necesidad">¿Qué necesitas automatizar? *</Label>
                        <Textarea
                            id="necesidad"
                            required
                            placeholder="Cuéntanos brevemente tu caso o los procesos que no has encontrado..."
                            className="min-h-[100px] bg-background/50"
                            value={formData.necesidad}
                            onChange={(e) => setFormData({ ...formData, necesidad: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 h-auto text-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                "Continuar para agendar"
                            )}
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                            Al hacer clic, te redirigiremos a Calendly para que elijas el mejor momento.
                        </p>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
