import { Dialog, DialogContent } from "./ui/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const GHL_BOOKING_URL = process.env.NEXT_PUBLIC_GHL_BOOKING_URL ?? "https://api.leadconnectorhq.com/widget/booking/KMjgjNKzL0zYDoJyU8Ta";

interface GHLBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GHLBookingModal = ({ isOpen, onClose }: GHLBookingModalProps) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <>
            {/* Preload iframe silently so it's ready when the modal opens */}
            <iframe
                src={GHL_BOOKING_URL}
                style={{ position: "fixed", width: 0, height: 0, border: 0, opacity: 0, pointerEvents: "none" }}
                onLoad={() => setLoaded(true)}
                title="preload-booking"
                aria-hidden
            />

            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-[640px] w-full">
                    {!loaded && (
                        <div className="flex items-center justify-center h-[600px] bg-[#111] rounded-xl">
                            <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                        </div>
                    )}
                    <iframe
                        src={GHL_BOOKING_URL}
                        className="w-full rounded-xl border-0"
                        style={{ height: 600, display: loaded ? "block" : "none" }}
                        title="Agendar llamada"
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};
