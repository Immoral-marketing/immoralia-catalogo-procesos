import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

// Variante de AccordionContent que mantiene el contenido montado (forceMount)
// para que exista en el HTML del servidor aunque el acordeón esté cerrado —
// requisito SEO/GEO de SPEC-26: los bots que no ejecutan JS deben poder leer
// las respuestas. El wrapper de shadcn no sirve aquí: aplica el className a un
// div interno sin data-state, por lo que data-[state=closed]:hidden no actúa.
const SeoAccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        forceMount
        className="overflow-hidden text-sm data-[state=closed]:hidden data-[state=open]:animate-accordion-down"
        {...props}
    >
        <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
));
SeoAccordionContent.displayName = "SeoAccordionContent";

export { SeoAccordionContent };
