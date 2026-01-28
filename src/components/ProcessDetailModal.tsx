import { Check, X } from "lucide-react";
import { useState } from "react";
import { Process } from "@/data/processes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface ProcessDetailModalProps {
  process: Process | null;
  isOpen: boolean;
  onClose: () => void;
  isSelected: boolean;
  onToggleSelect: () => void;
}

export const ProcessDetailModal = ({
  process,
  isOpen,
  onClose,
  isSelected,
  onToggleSelect,
}: ProcessDetailModalProps) => {
  const [customizationNote, setCustomizationNote] = useState("");
  
  if (!process) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs font-medium text-secondary border-secondary/30">
                  {process.categoriaNombre}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {process.nombre}
              </DialogTitle>
              <p className="text-sm text-primary mt-1">{process.tagline}</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
                Descripción
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {process.descripcionDetallada}
              </p>
            </div>

            {/* How it Works */}
            <div>
              <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
                Cómo funciona
              </h4>
              <ul className="space-y-2">
                {process.pasos.map((paso, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-muted-foreground flex-1">{paso}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customization */}
            <div>
              <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
                Personalización
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {process.personalizacion}
              </p>
            </div>

            {/* Custom Notes */}
            <div>
              <Label htmlFor="customization-note" className="text-sm font-semibold text-secondary uppercase tracking-wider">
                ¿Cómo quieres personalizar este proceso?
              </Label>
              <Textarea
                id="customization-note"
                value={customizationNote}
                onChange={(e) => setCustomizationNote(e.target.value)}
                placeholder="Escribe cómo..."
                className="mt-2 bg-background border-border resize-none"
                rows={4}
              />
            </div>
          </div>
        </ScrollArea>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button
            onClick={onToggleSelect}
            className={
              isSelected
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }
          >
            {isSelected ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Quitar de mi selección
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Añadir a mi selección
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
