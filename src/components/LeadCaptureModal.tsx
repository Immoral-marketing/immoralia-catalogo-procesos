import { useState } from "react";
import { Loader2, MessageCircle, Check } from "lucide-react";
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

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadCaptureModal = ({ isOpen, onClose }: LeadCaptureModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    telefono: "",
    comentario: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const ACCENT = "#00FFFF";

  const getFieldStyle = (fieldName: string, isError: boolean) => {
    if (isError) return {};
    const isActive = hoveredField === fieldName || focusedField === fieldName;
    return isActive
      ? { borderColor: ACCENT, boxShadow: `0 0 0 1px ${ACCENT}` }
      : {};
  };

  const fieldBase =
    "bg-white/5 border-white/10 text-white placeholder:text-gray-600 transition-all duration-200 outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.nombre.trim()) e.nombre = "¿Cómo te llamas?";
    if (!formData.email.trim()) e.email = "Necesitamos tu email para contactarte";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "El email no parece válido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          empresa: formData.empresa || undefined,
          telefono: formData.telefono || undefined,
          comentario:
            formData.comentario ||
            "Contacto desde '¿Tu sector no está en la lista?'",
          source: "sin_sector",
          selectedProcesses: [],
          n8nHosting: "setup",
        }),
      });
      if (!res.ok) { const errData = await res.json(); throw errData; }
      setSubmitted(true);
    } catch {
      toast({
        title: "Error al enviar",
        description:
          "Algo ha fallado. Por favor inténtalo de nuevo o escríbenos a hola@immoral.es",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setFormData({ nombre: "", email: "", empresa: "", telefono: "", comentario: "" });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0d0d0d] border-white/10 max-w-lg text-white">
        {!submitted ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "rgba(0,255,255,0.08)",
                    borderColor: "rgba(0,255,255,0.20)",
                  }}
                >
                  <MessageCircle
                    className="w-4 h-4"
                    style={{ color: "rgba(0,255,255,0.75)" }}
                  />
                </div>
                <DialogTitle className="text-xl font-bold text-white">
                  Cuéntanos sobre tu negocio
                </DialogTitle>
              </div>
              <DialogDescription className="text-gray-400 text-sm">
                Analizamos qué procesos encajan con tu empresa y te enviamos una
                propuesta personalizada sin compromiso.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Nombre */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="lead-nombre"
                    className={errors.nombre ? "text-red-400" : "text-gray-300"}
                  >
                    Nombre *
                  </Label>
                  <Input
                    id="lead-nombre"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={(e) => {
                      setFormData({ ...formData, nombre: e.target.value });
                      if (errors.nombre) setErrors({ ...errors, nombre: "" });
                    }}
                    onMouseEnter={() => setHoveredField("nombre")}
                    onMouseLeave={() => setHoveredField(null)}
                    onFocus={() => setFocusedField("nombre")}
                    onBlur={() => setFocusedField(null)}
                    style={getFieldStyle("nombre", !!errors.nombre)}
                    className={`${fieldBase} ${errors.nombre ? "border-red-500" : ""}`}
                  />
                  {errors.nombre && (
                    <p className="text-xs text-red-400">{errors.nombre}</p>
                  )}
                </div>

                {/* Empresa */}
                <div className="space-y-1.5">
                  <Label htmlFor="lead-empresa" className="text-gray-300">
                    Empresa
                  </Label>
                  <Input
                    id="lead-empresa"
                    placeholder="Nombre de tu empresa"
                    value={formData.empresa}
                    onChange={(e) =>
                      setFormData({ ...formData, empresa: e.target.value })
                    }
                    onMouseEnter={() => setHoveredField("empresa")}
                    onMouseLeave={() => setHoveredField(null)}
                    onFocus={() => setFocusedField("empresa")}
                    onBlur={() => setFocusedField(null)}
                    style={getFieldStyle("empresa", false)}
                    className={fieldBase}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="lead-email"
                    className={errors.email ? "text-red-400" : "text-gray-300"}
                  >
                    Email *
                  </Label>
                  <Input
                    id="lead-email"
                    type="email"
                    placeholder="tu@empresa.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    onMouseEnter={() => setHoveredField("email")}
                    onMouseLeave={() => setHoveredField(null)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    style={getFieldStyle("email", !!errors.email)}
                    className={`${fieldBase} ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-1.5">
                  <Label htmlFor="lead-telefono" className="text-gray-300">
                    Teléfono
                  </Label>
                  <Input
                    id="lead-telefono"
                    type="tel"
                    placeholder="+34 600 000 000"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    onMouseEnter={() => setHoveredField("telefono")}
                    onMouseLeave={() => setHoveredField(null)}
                    onFocus={() => setFocusedField("telefono")}
                    onBlur={() => setFocusedField(null)}
                    style={getFieldStyle("telefono", false)}
                    className={fieldBase}
                  />
                </div>
              </div>

              {/* Comentario */}
              <div className="space-y-1.5">
                <Label htmlFor="lead-comentario" className="text-gray-300">
                  ¿A qué se dedica tu empresa?
                </Label>
                <Textarea
                  id="lead-comentario"
                  rows={3}
                  placeholder="Cuéntanos brevemente qué hace tu negocio y qué te gustaría automatizar..."
                  value={formData.comentario}
                  onChange={(e) =>
                    setFormData({ ...formData, comentario: e.target.value })
                  }
                  onMouseEnter={() => setHoveredField("comentario")}
                  onMouseLeave={() => setHoveredField(null)}
                  onFocus={() => setFocusedField("comentario")}
                  onBlur={() => setFocusedField(null)}
                  style={getFieldStyle("comentario", false)}
                  className={`${fieldBase} resize-none`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-white hover:bg-white/5"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: "#00FFFF", color: "#0a0a0a" }}
                  className="font-semibold hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar"
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          /* Estado confirmación */
          <div className="py-8 text-center">
            <div
              className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{
                backgroundColor: "rgba(0,255,255,0.08)",
                border: "1px solid rgba(0,255,255,0.22)",
              }}
            >
              <Check
                className="w-7 h-7"
                style={{ color: "rgba(0,255,255,0.9)" }}
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¡Recibido!</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-7">
              Nos pondremos en contacto contigo en menos de 24&nbsp;horas con
              una propuesta personalizada para tu negocio.
            </p>
            <Button
              onClick={handleClose}
              variant="outline"
              className="border-white/10 text-gray-300 hover:bg-white/5"
            >
              Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
