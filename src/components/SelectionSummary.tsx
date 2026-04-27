import { useState } from "react";
import { X, Server, Database, Info, HelpCircle, ExternalLink, Share2 } from "lucide-react";
import { Process } from "@/data/processes";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useSelection } from "@/lib/SelectionContext";
import { processes } from "@/data/processes";
import { getCategoryColorClass } from "@/lib/category-colors";

import { cn } from "@/lib/utils";


interface SelectionSummaryProps {
  onContact: () => void;
  onOpenCalendly?: () => void;
  n8nHosting?: 'setup' | 'own';
  onHostingChange?: (value: 'setup' | 'own') => void;
  onShare?: () => void;
  variant?: 'card' | 'drawer';
  className?: string;
  accentColor?: string;
}

export const SelectionSummary = ({
  onContact,
  onOpenCalendly,
  n8nHosting = 'setup',
  onHostingChange,
  onShare,
  variant = 'card',
  className,
  accentColor,
}: SelectionSummaryProps) => {
  const { selectedProcessIds, toggleProcess } = useSelection();
  const selectedProcesses = processes.filter(p => selectedProcessIds.has(p.id));
  const count = selectedProcesses.length;

  const [isShareHovered, setIsShareHovered] = useState(false);
  const [hoveredRemoveId, setHoveredRemoveId] = useState<string | null>(null);


  const content = (
    <>
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 min-h-0 flex flex-col">
        <h3 className="text-xl font-bold text-foreground mb-4 shrink-0">Tu selección</h3>

        {/* Selected Processes List */}
        <div className="space-y-2 mb-6 pr-1">
          {count === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Explora el catálogo y selecciona los procesos que quieras automatizar. ¡Puedes elegir tantos como necesites!
            </p>
          ) : (
            selectedProcesses.map((process) => (
              <div
                key={process.id}
                className="flex items-start justify-between gap-2 p-3 bg-muted rounded-md group hover:bg-muted/80 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-snug">
                    {process.nombre}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn("text-xs mt-1", getCategoryColorClass(process.categoriaNombre))}
                  >
                    {process.categoriaNombre}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                  onClick={() => toggleProcess(process.id)}
                  onMouseEnter={() => setHoveredRemoveId(process.id)}
                  onMouseLeave={() => setHoveredRemoveId(null)}
                  style={accentColor ? { 
                    backgroundColor: hoveredRemoveId === process.id ? accentColor : `${accentColor}1a`,
                    color: hoveredRemoveId === process.id ? "#fff" : accentColor
                  } : {}}
                >
                  <X className="w-4 h-4 transition-colors" />
                </Button>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Floating Bottom Section (Always Visible) */}
      <div className="shrink-0 pt-4 mt-2 border-t border-border bg-card">
        {/* Summary Stats */}
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Procesos seleccionados</span>
            <span 
              className={cn("text-2xl font-bold leading-none", !accentColor && "text-primary")}
              style={accentColor ? { color: accentColor } : {}}
            >
              {count}
            </span>
          </div>

          {/* Call to Action Text */}
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-1">
              {count === 0
                ? "Añade procesos para solicitar tu oferta"
                : "Solicita tu oferta personalizada"}
            </p>
            {count > 0 && (
              <p className="text-xs text-muted-foreground leading-snug">
                Analizaremos tu selección y el tipo de hosting para enviarte una propuesta detallada.
              </p>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={onContact}
            disabled={count === 0}
            className={cn(
              "w-full font-semibold h-11 transition-all",
              !accentColor && "bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
            )}
            style={accentColor ? { backgroundColor: accentColor, color: "#fff", boxShadow: `0 0 20px ${accentColor}40` } : {}}
          >
            Solicitar Oferta
          </Button>
          <Button
            variant="outline"
            onClick={onShare}
            disabled={count === 0}
            className={cn(
              "w-full h-11 text-foreground gap-2 transition-all",
              !accentColor && "border-primary/20 hover:bg-primary/5 hover:text-primary",
              accentColor && "border-white/10"
            )}
            style={accentColor 
              ? (isShareHovered ? { color: accentColor, borderColor: `${accentColor}50`, backgroundColor: `${accentColor}10` } : {}) 
              : {}}
            onMouseEnter={() => setIsShareHovered(true)}
            onMouseLeave={() => setIsShareHovered(false)}
          >
            <Share2 className="w-4 h-4" />
            Compartir selección
          </Button>
        </div>
      </div>
    </>
  );

  if (variant === 'drawer') {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        {content}
      </div>
    );
  }

  return (
    <Card className={cn("bg-card border-border p-6 sticky top-24 flex flex-col max-h-[calc(100vh-7rem)] shadow-lg", className)}>
      {content}
    </Card>
  );
};
