import { X, Server, Database } from "lucide-react";
import { Process } from "@/data/processes";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useSelection } from "@/lib/SelectionContext";
import { processes } from "@/data/processes";


interface SelectionSummaryProps {
  onContact: () => void;
  onOpenCalendly?: () => void;
  n8nHosting?: 'setup' | 'own';
  onHostingChange?: (value: 'setup' | 'own') => void;
}

export const SelectionSummary = ({
  onContact,
  onOpenCalendly,
  n8nHosting = 'setup',
  onHostingChange,
}: SelectionSummaryProps) => {
  const { selectedProcessIds, toggleProcess } = useSelection();
  const selectedProcesses = processes.filter(p => selectedProcessIds.has(p.id));
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
                onClick={() => toggleProcess(process.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Hosting Configuration */}
      {count > 0 && (
        <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg animate-in fade-in slide-in-from-top-2">
          <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-primary" />
            Configuración de n8n
          </h4>
          <RadioGroup
            value={n8nHosting}
            onValueChange={(value) => onHostingChange?.(value as 'setup' | 'own')}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="setup" id="setup" />
              <Label htmlFor="setup" className="text-xs flex-1 cursor-pointer leading-tight">
                Necesito <strong>Setup de Auto</strong> <br />
                <span className="text-muted-foreground">(Alojado por Immoralia)</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="own" id="own" />
              <Label htmlFor="own" className="text-xs flex-1 cursor-pointer leading-tight">
                Ya dispongo de <strong>n8n</strong> <br />
                <span className="text-muted-foreground">(En servidor propio)</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

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
              Analizaremos tu selección y el tipo de hosting para enviarte una propuesta detallada.
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

      {/* Calendly CTA */}
      <div className="mt-8 pt-8 border-t border-border space-y-4">
        <div className="space-y-2">
          <h4 className="font-bold text-foreground">¿No encuentras tu proceso?</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Agenda una llamada de 15–30 min y cuéntanos tu caso. Si encaja, te propondremos una auditoría para definir el alcance y automatizarlo.
          </p>
        </div>
        <Button
          variant="secondary"
          className="w-full border-secondary text-secondary-foreground hover:bg-secondary/10"
          onClick={() => onOpenCalendly?.()}
        >
          Agendar llamada
        </Button>
      </div>
    </Card>
  );
};
