import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, Star, Sparkles, CreditCard, Calendar, Building2, MessageSquare, Search, PhoneCall, Heart, BarChart3, Users, Megaphone, CalendarCheck, HeartPulse, ClipboardList, MessageCircle, GraduationCap } from "lucide-react";
import { Process } from "@/data/processes";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { getCategoryColorClass } from "@/lib/category-colors";
import { useSelection } from "@/lib/SelectionContext";
import { computeFinalComplexity } from "@/lib/complexity-utils";
import { getOnboardingAnswers } from "@/lib/onboarding-utils";

const categoryIcons: Record<string, React.ElementType> = {
  "Facturación y Finanzas": CreditCard,
  "Horarios y Proyectos": Calendar,
  "Gestión Interna": Building2,
  "Atención y Ventas": MessageSquare,
  "Auditoría tecnológica": Search,
  // Bloques Gastronomía / Hostelería
  "Reservas y atención 24/7": PhoneCall,
  "Reputación y reseñas": Star,
  "Fidelización y vuelta del cliente": Heart,
  "Operativa diaria y visibilidad": BarChart3,
  "Gestión de personal y equipo": Users,
  "Marketing y contenido digital": Megaphone,
  // Bloques Centros de Salud
  "Captación y primera visita": PhoneCall,
  "Gestión de citas y ausencias": CalendarCheck,
  "Seguimiento clínico y fidelización": HeartPulse,
  "Administración y facturación": CreditCard,
  "Gestión del equipo clínico": Users,
  // Bloques Academias / Formación
  "Captación de alumnos": PhoneCall,
  "Matriculación y onboarding del alumno": ClipboardList,
  "Comunicación con padres y alumnos": MessageCircle,
  "Retención y reactivación": Sparkles,
  "Administración y finanzas": CreditCard,
  "Gestión del profesorado": GraduationCap,
};

// Bloques que llevan acento naranja en su icono (sector gastronomía)
const GASTRO_BLOCK_LABELS = new Set([
  "Reservas y atención 24/7",
  "Reputación y reseñas",
  "Fidelización y vuelta del cliente",
  "Operativa diaria y visibilidad",
  "Gestión de personal y equipo",
  "Marketing y contenido digital",
]);

// Bloques que llevan acento azul (sky) en su icono (sector salud)
const SALUD_BLOCK_LABELS = new Set([
  "Captación y primera visita",
  "Gestión de citas y ausencias",
  "Reputación y reseñas",
  "Seguimiento clínico y fidelización",
  "Administración y facturación",
  "Gestión del equipo clínico",
]);

// Bloques que llevan acento violeta en su icono (sector academias)
const ACADEMIAS_BLOCK_LABELS = new Set([
  "Captación de alumnos",
  "Matriculación y onboarding del alumno",
  "Comunicación con padres y alumnos",
  "Retención y reactivación",
  "Administración y finanzas",
  "Gestión del profesorado",
]);

interface ProcessCardProps {
  process: Process;
  isSpecialized?: boolean;
  accentColor?: string;
  sectorSlug?: string;
}

export const ProcessCard = ({ process, isSpecialized, accentColor, sectorSlug }: ProcessCardProps) => {
  const navigate = useNavigate();
  const { selectedProcessIds, toggleProcess } = useSelection();
  const isSelected = selectedProcessIds.has(process.id);

  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isInfoHovered, setIsInfoHovered] = useState(false);
  const [isSelectHovered, setIsSelectHovered] = useState(false);

  const onboardingAnswers = getOnboardingAnswers();
  const finalComplexity = computeFinalComplexity(process, onboardingAnswers);

  const handleViewDetails = () => {
    const url = sectorSlug
      ? `/catalogo/procesos/${process.slug}?sector=${sectorSlug}`
      : `/catalogo/procesos/${process.slug}`;
    navigate(url);
  };

  const handleToggleSelect = () => {
    toggleProcess(process.id);
  };

  const CategoryIcon = categoryIcons[process.categoriaNombre];
  // Salud usa también "Reputación y reseñas" pero queremos detectarlo por landing_slug
  const isSaludBlock = process.landing_slug === "salud" && SALUD_BLOCK_LABELS.has(process.categoriaNombre);
  const isAcademiasBlock = !isSaludBlock && process.landing_slug === "academias" && ACADEMIAS_BLOCK_LABELS.has(process.categoriaNombre);
  const isGastroBlock = !isSaludBlock && !isAcademiasBlock && GASTRO_BLOCK_LABELS.has(process.categoriaNombre);

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
        "group relative bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl p-6 transition-all duration-300 cursor-pointer h-full flex flex-col",
        !accentColor && "hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(8,145,178,0.08)]",
        !accentColor && isSelected && "border-cyan-500/50 shadow-[0_0_20px_rgba(8,145,178,0.15)]",
        isSpecialized && "border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.08)]"
      )}
      style={{ ...cardHoverStyle, ...selectedCardStyle }}
      onClick={handleViewDetails}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      {/* Icon + Category Badge */}
      <div className={cn("flex items-start mb-4", CategoryIcon ? "justify-between" : "justify-end")}>
        {CategoryIcon && (
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              isGastroBlock && "bg-orange-500/10 border border-orange-500/30 text-orange-400",
              isSaludBlock && "bg-sky-500/10 border border-sky-500/30 text-sky-400",
              isAcademiasBlock && "bg-violet-500/10 border border-violet-500/30 text-violet-400",
              !isGastroBlock && !isSaludBlock && !isAcademiasBlock && "bg-white/5 border border-white/10 text-gray-400"
            )}
          >
            <CategoryIcon className="w-5 h-5" />
          </div>
        )}

        <div className="flex items-start gap-2 flex-wrap justify-end">
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium",
              isSaludBlock
                ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                : isAcademiasBlock
                ? "bg-violet-500/10 text-violet-400 border-violet-500/30"
                : getCategoryColorClass(process.categoriaNombre)
            )}
          >
            {process.categoriaNombre}
          </Badge>

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
          "text-lg font-semibold mb-2 text-white transition-colors",
          !accentColor && "group-hover:text-cyan-400"
        )}
        style={titleHoverStyle}
      >
        {process.nombre}
      </h3>

      {process.tagline && (
        <p className="text-sm text-gray-400 line-clamp-2 mb-2 leading-relaxed">
          {process.tagline}
        </p>
      )}

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 mt-4 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 min-w-[140px] justify-center transition-colors",
            !accentColor && "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
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
            !accentColor && !isSelected && "border-white/10 text-white/70 hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-500/5"
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
