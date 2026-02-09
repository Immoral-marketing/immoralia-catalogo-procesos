import { useState } from "react";
import { Process } from "@/data/processes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProcesses: Process[];
}

export const ContactForm = ({ isOpen, onClose, selectedProcesses }: ContactFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    comentario: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const invokePromise = supabase.functions.invoke('send-contact-email', {
        body: {
          nombre: formData.nombre,
          email: formData.email,
          empresa: formData.empresa,
          comentario: formData.comentario,
          selectedProcesses: selectedProcesses.map(p => ({
            id: p.id,
            codigo: p.codigo,
            nombre: p.nombre,
            categoriaNombre: p.categoriaNombre,
            tagline: p.tagline,
          })),
        },
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 15000);
      });

      const { data, error } = await Promise.race([invokePromise, timeoutPromise]) as any;

      if (error) throw error;

      console.log("Email sent successfully:", data);
      setSubmitted(true);

      toast({
        title: "¡Solicitud enviada!",
        description: "Te contactaremos pronto para diseñar tu proyecto de automatización.",
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      let description = "No hemos podido enviar tu solicitud. Comprueba tu conexión e inténtalo de nuevo. Si el problema persiste, escríbenos a team@immoral.com";

      // Check for server error (500)
      if (error?.status === 500 || error?.code === 500 || error?.message?.includes('500')) {
        description = "Algo ha fallado por nuestra parte. Estamos trabajando en solucionarlo. Puedes intentarlo en unos minutos o contactarnos directamente";
      } else if (error?.message === 'Request timed out') {
        description = "La solicitud está tardando más de lo normal. Por favor, espera un momento o inténtalo de nuevo";
      }

      toast({
        title: "Error al enviar",
        description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setFormData({
      nombre: "",
      email: "",
      empresa: "",
      comentario: "",
    });
    onClose();
  };

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-card border-border max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">¡Gracias!</h3>
            <p className="text-muted-foreground mb-6">
              Te contactaremos para diseñar tu proyecto de automatización con la selección que has
              hecho.
            </p>
            <Button onClick={handleClose} className="bg-primary hover:bg-primary/90">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Solicitar propuesta</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Completa tus datos y nos pondremos en contacto contigo
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected Processes Summary */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Procesos seleccionados ({selectedProcesses.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProcesses.map((process) => (
                  <Badge
                    key={process.id}
                    variant="outline"
                    className="text-xs border-primary/30 text-primary"
                  >
                    {process.nombre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="empresa">Empresa *</Label>
                <Input
                  id="empresa"
                  required
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comentario">Comentario adicional</Label>
              <Textarea
                id="comentario"
                rows={4}
                value={formData.comentario}
                onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                className="bg-background border-border resize-none"
                placeholder="Cuéntanos más sobre tu agencia y tus necesidades..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar solicitud"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
