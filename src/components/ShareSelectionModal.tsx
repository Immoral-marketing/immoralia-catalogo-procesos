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
import { Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getOnboardingAnswers } from "@/lib/onboarding-utils";
import { Process } from "@/data/processes";

interface ShareSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedProcesses: Process[];
    accentColor?: string;
}

export const ShareSelectionModal = ({ isOpen, onClose, selectedProcesses, accentColor }: ShareSelectionModalProps) => {
    const [receiverEmail, setReceiverEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleShare = async () => {
        if (!receiverEmail.includes("@")) {
            toast({
                title: "Error",
                description: "Por favor, introduce un correo electrónico válido.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const onboardingData = getOnboardingAnswers();
            const senderName = onboardingData?.nombre || "Un usuario";
            const senderEmail = onboardingData?.email || "No especificado";

            // Pasamos los procesos formateados
            const processList = selectedProcesses.map(p => ({
                id: p.id,
                nombre: p.nombre,
                categoria: p.categoriaNombre
            }));

            const { error } = await supabase.functions.invoke("share-selection", {
                body: {
                    receiverEmail,
                    senderName,
                    senderEmail,
                    selectedProcesses: processList
                }
            });

            if (error) throw error;

            toast({
                title: "Selección compartida",
                description: "Hemos enviado los procesos seleccionados al correo indicado.",
            });
            
            setReceiverEmail("");
            onClose();
        } catch (error: any) {
            console.error("Error sharing selection:", error);
            toast({
                variant: "destructive",
                title: "Error al compartir",
                description: "No se pudo enviar el correo en este momento. Por favor, inténtalo de nuevo.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <Send className="w-5 h-5" style={accentColor ? { color: accentColor } : {}} /> Compartir Selección
                    </DialogTitle>
                    <DialogDescription>
                        Envía los {selectedProcesses.length} procesos seleccionados a un compañero de equipo.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="receiverEmail">Correo del destinatario</Label>
                        <Input
                            id="receiverEmail"
                            type="email"
                            placeholder="companero@empresa.com"
                            value={receiverEmail}
                            onChange={(e) => setReceiverEmail(e.target.value)}
                            className={accentColor ? "focus-visible:ring-0 focus-visible:border-transparent" : ""}
                            onFocus={accentColor ? (e) => { e.target.style.boxShadow = `0 0 0 2px ${accentColor}`; } : undefined}
                            onBlur={accentColor ? (e) => { e.target.style.boxShadow = ""; } : undefined}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className={accentColor ? "hover:bg-transparent" : ""}
                        onMouseEnter={accentColor ? (e) => { (e.currentTarget as HTMLButtonElement).style.color = accentColor; (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${accentColor}15`; } : undefined}
                        onMouseLeave={accentColor ? (e) => { (e.currentTarget as HTMLButtonElement).style.color = ""; (e.currentTarget as HTMLButtonElement).style.backgroundColor = ""; } : undefined}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleShare}
                        disabled={isSubmitting || !receiverEmail}
                        className={!accentColor ? "bg-primary hover:bg-primary/90" : ""}
                        style={accentColor ? { backgroundColor: accentColor } : {}}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>Enviar</>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
