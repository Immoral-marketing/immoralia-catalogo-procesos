import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, Star, Sparkles } from "lucide-react";
import { Process } from "@/data/processes";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { getCategoryColorClass } from "@/lib/category-colors";
import { useSelection } from "@/lib/SelectionContext";
import { computeFinalComplexity } from "@/lib/complexity-utils";
import { getOnboardingAnswers } from "@/lib/onboarding-utils";

interface ProcessCardProps {
  process: Process;
  isSpecialized?: boolean;
  accentColor?: string;
}

export const ProcessCard = ({ process, isSpecialized, accentColor }: ProcessCardProps) => {
  const navigate = useNavigate();
  const { selectedProcessIds, toggleProcess } = useSelection();
  const isSelected = selectedProcessIds.has(process.id);

  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isInfoHovered, setIsInfoHovered] = useState(false);
  const [isSelectHovered, setIsSelectHovered] = useState(false);

  const onboardingAnswers = getOnboardingAnswers();
  const finalComplexity = computeFinalComplexity(process, onboardingAnswers);

  const handleViewDetails = () => {
    navigate(`/catalogo/procesos/${process.slug}`);
  };

  const handleToggleSelect = () => {
    toggleProcess(process.id);
  };

  // Estilos dinámicos según accentColor del sector
  const cardHoverStyle = accentColor && isCardHovered && !isSelected
    ? { borderColor: `${accentColor}60`, boxShadow: `0 0 20px ${accentColor}20` }
    : {};

  const selectedCardStyle = accentColor && isSelected
    ? { borderColor: accentColor, boxShadow: `0 0 20px ${accentColor}25` }
    : {};

  const titleHoverStyle = accentColor && isCardHovered
    ? { color: accentColor }
    : {};

  const infoButtonHoverStyle = accentColor && isInfoHovered
    ? { color: accentColor, backgroundColor: `${accentColor}15` }
    : {};

  const selectButtonHoverStyle = accentColor && isSelectHovered && !isSelected
    ? { borderColor: accentColor, color: accentColor, backgroundColor: `${accentColor}12` }
    : {};

  const selectedButtonStyle = accentColor && isSelected
    ? { backgroundColor: accentColor, borderColor: accentColor }
    : {};

  return (
    <div
      className={cn(
        "group relative bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:bg-card-hover cursor-pointer h-full flex flex-col",
        !accentColor && "hover-glow",
        !accentColor && isSelected && "border-primary glow-primary",
        isSpecialized && "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
      )}
      style={{ ...cardHoverStyle, ...selectedCardStyle }}
      onClick={handleViewDetails}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      {/* Category Badge and Recommendation Badges */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {!accentColor && (
            <Badge variant="outline" className={cn("text-xs font-medium", getCategoryColorClass(process.categoriaNombre))}>
              {process.categoriaNombre}
            </Badge>
          )}

          {isSpecialized ? (
            <Badge className="text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3 h-3 fill-current" />
              Para ti
            </Badge>
          ) : (process.recomendado && !accentColor) && (
            <Badge className="text-xs font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Recomendado
            </Badge>
          )}
        </div>
      </div>

      {/* Process Name */}
      <h3
        className={cn(
          "text-lg font-semibold mb-2 text-foreground transition-colors",
          !accentColor && "group-hover:text-primary"
        )}
        style={titleHoverStyle}
      >
        {process.nombre}
      </h3>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 mt-4 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 min-w-[140px] justify-center transition-colors",
            !accentColor && "text-primary hover:text-primary hover:bg-primary/10"
          )}
          style={accentColor
            ? { color: isInfoHovered ? accentColor : accentColor, ...infoButtonHoverStyle }
            : {}}
          onMouseEnter={() => setIsInfoHovered(true)}
          onMouseLeave={() => setIsInfoHovered(false)}
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
            "gap-2 flex-1 min-w-[140px] justify-center transition-colors",
            !accentColor && isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
            !accentColor && !isSelected && "border-primary text-primary hover:bg-primary/10"
          )}
          style={accentColor
            ? isSelected
              ? { ...selectedButtonStyle, color: "white" }
              : { borderColor: accentColor, color: accentColor, ...selectButtonHoverStyle }
            : {}}
          onMouseEnter={() => setIsSelectHovered(true)}
          onMouseLeave={() => setIsSelectHovered(false)}
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
