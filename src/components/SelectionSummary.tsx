import { X } from "lucide-react";
import { Process } from "@/data/processes";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { calculatePrice, getNextPackInfo } from "@/lib/pricing";

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
  const priceInfo = calculatePrice(count);
  const nextPackInfo = getNextPackInfo(count);

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

        {/* Progress to Next Pack */}
        {count >= 15 ? (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-medium text-primary">
              ¡Genial! Has seleccionado muchos procesos. Te prepararemos una propuesta totalmente personalizada
            </p>
          </div>
        ) : nextPackInfo && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="mb-2">
              <p className="text-sm font-medium text-foreground mb-1">
                {count === 0 ? (
                  "Añade procesos para ver tu pack"
                ) : nextPackInfo.remaining === 1 ? (
                  <>¡Solo <span className="text-primary font-bold">1 proceso más</span> para el pack de {nextPackInfo.nextPackSize} procesos!</>
                ) : (
                  <>Añade <span className="text-primary font-bold">{nextPackInfo.remaining} procesos más</span> para el pack de {nextPackInfo.nextPackSize} procesos</>
                )}
              </p>
              {count > 0 && (
                <Progress value={nextPackInfo.progress} className="h-2 mt-2" />
              )}
            </div>
          </div>
        )}

        {/* Price Calculator */}
        <div className="mt-4 pt-4 border-t border-border">
          {count === 0 ? (
            <p className="text-sm text-muted-foreground">
              Añade procesos para ver el presupuesto estimado
            </p>
          ) : priceInfo && !priceInfo.isCustom ? (
            <>
              <p className="text-xs text-muted-foreground mb-1">{priceInfo.packName}</p>
              <p className="text-3xl font-bold text-primary">
                {priceInfo.price.toLocaleString("es-ES")}€
              </p>
            </>
          ) : (
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                Presupuesto personalizado
              </p>
              <p className="text-xs text-muted-foreground">
                Con {count} procesos, te prepararemos un presupuesto a medida.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <Button
        onClick={onContact}
        disabled={count === 0}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary"
      >
        Quiero automatizar estos procesos
      </Button>
    </Card>
  );
};
