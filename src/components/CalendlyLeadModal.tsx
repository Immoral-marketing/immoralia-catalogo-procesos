import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";

const GHL_BOOKING_URL = import.meta.env.VITE_GHL_BOOKING_URL as string;

interface CalendlyLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeCategory?: string | null;
    selectedProcessIds?: string[];
}

export const CalendlyLeadModal = ({
    isOpen,
    onClose,
}: CalendlyLeadModalProps) => {
    useEffect(() => {
        if (isOpen) {
            const script = document.createElement("script");
            script.src = "https://api.leadconnectorhq.com/js/form_embed.js";
            script.type = "text/javascript";
            document.body.appendChild(script);
            return () => { document.body.removeChild(script); };
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[720px] h-[92vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-xl font-bold">Elige un horario</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Selecciona el mejor momento para tu llamada con nuestro equipo.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto rounded-b-lg">
                    <iframe
                        src={GHL_BOOKING_URL}
                        style={{ width: "100%", border: "none", minHeight: "700px", display: "block" }}
                        scrolling="yes"
                        id="KMjgjNKzL0zYDoJyU8Ta_1779276117228"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
