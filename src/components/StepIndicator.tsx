import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { number: 1, label: "Elige tu sector" },
  { number: 2, label: "Selecciona procesos" },
  { number: 3, label: "Solicita tu propuesta" },
];

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="w-full border-b border-white/5 bg-black/60 backdrop-blur-sm">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-center justify-center py-2.5 gap-0">
          {steps.map((step, i) => {
            const isActive = step.number === currentStep;
            const isDone = step.number < currentStep;
            const isLast = i === steps.length - 1;

            return (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center gap-2">
                  {/* Número */}
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all duration-300",
                    isActive && "bg-cyan-500 text-black",
                    isDone && "bg-cyan-500/30 text-cyan-400",
                    !isActive && !isDone && "bg-white/5 text-white/20"
                  )}>
                    {step.number}
                  </div>

                  {/* Label */}
                  <span className={cn(
                    "text-xs font-medium transition-all duration-300 whitespace-nowrap",
                    isActive && "text-cyan-400",
                    isDone && "text-white/40",
                    !isActive && !isDone && "text-white/20"
                  )}>
                    {step.label}
                  </span>
                </div>

                {/* Conector */}
                {!isLast && (
                  <div className={cn(
                    "w-12 md:w-20 h-px mx-3 transition-all duration-300",
                    isDone ? "bg-cyan-500/30" : "bg-white/5"
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
