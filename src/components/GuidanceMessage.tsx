import React from 'react';
import { Lightbulb } from 'lucide-react';
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
    </div>
  );
};
