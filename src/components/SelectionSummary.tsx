import { X } from "lucide-react";
import { Process } from "@/data/processes";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";


interface SelectionSummaryProps {
  selectedProcesses: Process[];
  onRemove: (id: string) => void;
  onContact: () => void;
}

export const SelectionSummary = ({
  selectedProcesses,
  onRemove,
  onContact,
}: SelectionSummaryProps) => {
  const count = selectedProcesses.length;


  return (
    <Card className="bg-card border-border p-6 sticky top-6">
      <h3 className="text-xl font-bold text-foreground mb-4">Tu selección</h3>

      {/* Selected Processes List */}
      <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
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
                <p className="text-sm font-medium text-foreground truncate">
                  {process.nombre}
                </p>
                <Badge
                  variant="outline"
                  className="text-xs text-secondary border-secondary/30 mt-1"
                >
                  {process.categoriaNombre}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                onClick={() => onRemove(process.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Procesos seleccionados</span>
          <span className="text-2xl font-bold text-primary">{count}</span>
        </div>

        {/* Call to Action Text */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm font-medium text-foreground mb-1">
            {count === 0
              ? "Añade procesos para solicitar tu oferta"
              : "Solicita tu oferta personalizada"}
          </p>
          {count > 0 && (
            <p className="text-xs text-muted-foreground">
              Analizaremos tu selección y te enviaremos una propuesta adaptada a tus necesidades.
            </p>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <Button
        onClick={onContact}
        disabled={count === 0}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary"
      >
        Solicitar Oferta
      </Button>
    </Card>
  );
};
