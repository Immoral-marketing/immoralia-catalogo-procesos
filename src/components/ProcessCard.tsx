import { Check, ChevronRight, Star } from "lucide-react";
import { Process } from "@/data/processes";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ProcessCardProps {
  process: Process;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
}

export const ProcessCard = ({ process, isSelected, onSelect, onViewDetails }: ProcessCardProps) => {
  return (
    <div
      className={cn(
        "group relative bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:bg-card-hover hover-glow cursor-pointer h-full flex flex-col",
        isSelected && "border-primary glow-primary"
      )}
      onClick={onViewDetails}
    >
      {/* Category Badge and Recommended Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs font-medium text-secondary border-secondary/30">
            {process.categoriaNombre}
          </Badge>
          {process.recomendado && (
            <Badge className="text-xs font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Recomendado
            </Badge>
          )}
        </div>
      </div>

      {/* Process Name */}
      <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
        {process.nombre}
      </h3>

      {/* Tagline */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
        {process.tagline}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 mt-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary hover:bg-primary/10"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
        >
          Más información
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>

        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className={cn(
            "gap-2",
            isSelected
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border-primary text-primary hover:bg-primary/10"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4" />
              Añadido
            </>
          ) : (
            "Seleccionar"
          )}
        </Button>
      </div>
    </div>
  );
};
