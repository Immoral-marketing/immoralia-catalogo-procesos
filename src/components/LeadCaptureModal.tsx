import { useState } from "react";
import { Loader2, X, Mail, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { markLeadCaptured, markLeadSkippedThisSession } from "@/lib/onboarding-utils";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor?: string;
  sector?: string;
}

export const LeadCaptureModal = ({
  isOpen,
  onClose,
  accentColor = "#8b5cf6",
  sector = "",
}: LeadCaptureModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ nombre: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim() || formData.nombre.trim().length < 2) {
      newErrors.nombre = "Escribe tu nombre";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email no válido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await supabase.functions.invoke("send-contact-email", {
        body: {
          nombre: formData.nombre,
          email: formData.email,
          empresa: "",
          comentario: "",
          source: "lead_capture",
          sector,
          selectedProcesses: [],
          chatbotContext: [],
          n8nHosting: "setup",
          onboardingAnswers: null,
        },
      });

      markLeadCaptured();
      setSubmitted(true);
    } catch (err) {
      console.error("Lead capture error:", err);
      // Even if the request fails, mark as captured so we don't spam
      markLeadCaptured();
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    markLeadSkippedThisSession();
    onClose();
  };

  const handleCloseAfterSubmit = () => {
    onClose();
  };

  // Accent color as inline style vars
  const accentStyle = { "--accent": accentColor } as React.CSSProperties;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      style={accentStyle}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-sm bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Top glow bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />

        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {submitted ? (
            /* Success state */
            <div className="text-center py-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40` }}
              >
                <Mail className="w-7 h-7" style={{ color: accentColor }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">¡Perfecto, te tenemos!</h3>
              <p className="text-sm text-gray-400 mb-5">
                Te mantendremos al tanto de novedades y automatizaciones pensadas para tu sector.
              </p>
              <Button
                onClick={handleCloseAfterSubmit}
                className="w-full h-10 text-sm font-semibold text-white border-none"
                style={{ background: accentColor }}
              >
                Continuar explorando
              </Button>
            </div>
          ) : (
            /* Form state */
            <>
              {/* Header */}
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accentColor }}>
                  Mantente informado
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                ¿Quieres saber más?
              </h3>
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                Déjanos tu contacto y te avisaremos sobre recursos gratuitos y nuevas automatizaciones para tu negocio.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Nombre */}
                <div className="space-y-1">
                  <Label htmlFor="lc-nombre" className={`text-xs font-medium ${errors.nombre ? "text-red-400" : "text-gray-300"}`}>
                    Nombre
                  </Label>
                  <Input
                    id="lc-nombre"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={(e) => {
                      setFormData({ ...formData, nombre: e.target.value });
                      if (errors.nombre) setErrors({ ...errors, nombre: "" });
                    }}
                    className={`bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-10 focus-visible:ring-1 ${
                      errors.nombre
                        ? "border-red-500/50 focus-visible:ring-red-500"
                        : "focus-visible:border-white/20"
                    }`}
                    style={errors.nombre ? {} : { "--tw-ring-color": accentColor } as React.CSSProperties}
                  />
                  {errors.nombre && <p className="text-xs text-red-400">{errors.nombre}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="lc-email" className={`text-xs font-medium ${errors.email ? "text-red-400" : "text-gray-300"}`}>
                    Email
                  </Label>
                  <Input
                    id="lc-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={`bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-10 focus-visible:ring-1 ${
                      errors.email
                        ? "border-red-500/50 focus-visible:ring-red-500"
                        : "focus-visible:border-white/20"
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 mt-1 text-sm font-semibold text-white border-none gap-2"
                  style={{ background: accentColor }}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                  ) : (
                    <><span>Quiero estar al día</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
              </form>

              {/* Skip */}
              <button
                onClick={handleSkip}
                className="w-full mt-3 text-xs text-gray-600 hover:text-gray-400 transition-colors py-1"
              >
                Ahora no, gracias
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
