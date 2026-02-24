import { X, Server, Database, Info, HelpCircle, ExternalLink } from "lucide-react";
import { Process } from "@/data/processes";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useSelection } from "@/lib/SelectionContext";
import { processes } from "@/data/processes";

import { cn } from "@/lib/utils";


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
        <div className="mb-6 p-5 bg-primary/10 border-2 border-primary/30 rounded-xl animate-in fade-in slide-in-from-top-2 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
            <Server className="w-12 h-12" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground">
                Configuración de n8n
              </h4>
            </div>

            <p className="text-[11px] text-muted-foreground leading-snug">
              Aquí definimos dónde se ejecutarán tus automatizaciones (la ‘casa’ donde viven).
            </p>

            <RadioGroup
              value={n8nHosting}
              onValueChange={(value) => onHostingChange?.(value as 'setup' | 'own')}
              className="space-y-3"
            >
              <div className={cn(
                "flex items-start space-x-3 p-2 rounded-lg transition-colors border border-transparent",
                n8nHosting === 'setup' ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50"
              )}>
                <RadioGroupItem value="setup" id="setup" className="mt-1" />
                <Label htmlFor="setup" className="text-xs flex-1 cursor-pointer leading-tight space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-[13px]">Alojado por Immoralia</span>
                    <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-primary/10 text-primary border-primary/20 uppercase tracking-wider font-extrabold">Recomendado</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Nosotros lo dejamos listo por ti. La opción más rápida y segura si no tienes equipo técnico.
                  </p>
                </Label>
              </div>

              <div className={cn(
                "flex items-start space-x-3 p-2 rounded-lg transition-colors border border-transparent",
                n8nHosting === 'own' ? "bg-muted/80 border-border" : "hover:bg-muted/50"
              )}>
                <RadioGroupItem value="own" id="own" className="mt-1" />
                <Label htmlFor="own" className="text-xs flex-1 cursor-pointer leading-tight space-y-1">
                  <span className="font-bold text-foreground text-[13px]">Tengo mi propio servidor</span>
                  <p className="text-[10px] text-muted-foreground">
                    Ya dispones de n8n o un VPS y solo conectamos la automatización.
                  </p>
                </Label>
              </div>
            </RadioGroup>

            {/* Prominent Help CTA */}
            <div className="pt-2 border-t border-primary/10">
              <a
                href="/info/setup-automatizacion"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded-xl bg-background/50 border border-primary/20 hover:border-primary transition-all text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">¿Dudas con la elección?</span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">Pulsa aquí y sal de dudas en 1 minuto.</span>
                  </div>
                </div>
                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
              </a>
            </div>

            <p className="text-[9px] text-muted-foreground/60 italic leading-none pt-1">
              * Por defecto hemos seleccionado el setup gestionado para garantizar el funcionamiento.
            </p>
          </div>
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
