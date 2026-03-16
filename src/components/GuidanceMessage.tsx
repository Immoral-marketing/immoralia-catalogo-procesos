import React, { useState, useEffect } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuidanceMessageProps {
  id: string;
  message: React.ReactNode;
  className?: string;
  variant?: 'inline' | 'floating';
}

export const GuidanceMessage: React.FC<GuidanceMessageProps> = ({
  id,
  message,
  className,
  variant = 'inline'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already dismissed this message
    const dismissed = localStorage.getItem(`immoralia_guidance_dismissed_${id}`);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, [id]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`immoralia_guidance_dismissed_${id}`, 'true');
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3 relative shadow-sm animate-in fade-in slide-in-from-top-2 duration-300",
        variant === 'floating' ? "shadow-lg bg-card/95 backdrop-blur-md" : "",
        className
      )}
    >
      <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
        <Lightbulb className="w-5 h-5 text-primary" />
      </div>
      
      <div className="text-sm text-foreground/90 pr-6 leading-relaxed flex-1">
        {message}
      </div>

      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:bg-black/5 hover:text-foreground transition-colors"
        aria-label="Cerrar mensaje"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
