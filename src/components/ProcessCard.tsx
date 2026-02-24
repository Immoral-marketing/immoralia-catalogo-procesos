import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, Star, Sparkles } from "lucide-react";
import { Process } from "@/data/processes";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useSelection } from "@/lib/SelectionContext";

interface ProcessCardProps {
  process: Process;
  isSpecialized?: boolean;
}

export const ProcessCard = ({ process, isSpecialized }: ProcessCardProps) => {
  const navigate = useNavigate();
  const { selectedProcessIds, toggleProcess } = useSelection();
  const isSelected = selectedProcessIds.has(process.id);

  const handleViewDetails = () => {
    navigate(`/catalogo/procesos/${process.slug}`);
  };

  const handleToggleSelect = () => {
    toggleProcess(process.id);
  };
  return (
    <div
      className={cn(
        "group relative bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:bg-card-hover hover-glow cursor-pointer h-full flex flex-col",
        isSelected && "border-primary glow-primary",
        isSpecialized && "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
      )}
      onClick={handleViewDetails}
    >
      {/* Category Badge and Recommendation Badges */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs font-medium text-secondary border-secondary/30">
            {process.categoriaNombre}
          </Badge>

          {isSpecialized ? (
            <Badge className="text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3 h-3 fill-current" />
              Para ti
            </Badge>
          ) : process.recomendado && (
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
      <div className="flex-1" />


      {/* Actions */}
      <div className="flex items-center justify-between gap-2 mt-4 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary hover:bg-primary/10 flex-1 min-w-[140px] justify-center"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
        >
          Más información
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>

        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className={cn(
            "gap-2 flex-1 min-w-[140px] justify-center",
            isSelected
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border-primary text-primary hover:bg-primary/10"
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleSelect();
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
