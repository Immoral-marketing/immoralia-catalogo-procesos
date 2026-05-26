import fs from 'fs';

let content = fs.readFileSync('src/components/ContactForm.tsx', 'utf8');

// 1. Add OnboardingModal import
content = content.replace(
  'import { OnboardingAnswers, getOnboardingAnswers } from "@/lib/onboarding-utils";',
  'import { OnboardingAnswers, getOnboardingAnswers } from "@/lib/onboarding-utils";\nimport { OnboardingModal } from "@/components/OnboardingModal";'
);

// 2. Add showUpsell state
content = content.replace(
  '  const [isSubmitting, setIsSubmitting] = useState(false);',
  '  const [isSubmitting, setIsSubmitting] = useState(false);\n  const [showUpsell, setShowUpsell] = useState(false);'
);

// 3. Replace handleSubmit
const oldHandleSubmit = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor, revisa los campos señalados",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const invokePromise = supabase.functions.invoke('send-contact-email', {
        body: {
          nombre: formData.nombre,
          email: formData.email,
          empresa: formData.empresa,
          comentario: formData.comentario,
          onboardingAnswers,
          n8nHosting,
          source,
          chatbotContext,
          selectedProcesses: selectedProcesses.map(p => {
            const adjusted = computeFinalComplexity(p, onboardingAnswers);
            const processCustomizations = customizations[p.id];
            return {
              id: p.id,
              codigo: p.codigo,
              nombre: p.nombre,
              categoriaNombre: p.categoriaNombre,
              tagline: p.tagline,
              adjustedComplexity: adjusted.complexity,
              adjustedTimeEstimate: adjusted.timeEstimate,
              customizations: processCustomizations
            };
          }),
        },
      });


      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 30000);
      });

      const { data, error } = await Promise.race([invokePromise, timeoutPromise]) as any;

      if (error) throw error;

      console.log("Email sent successfully:", data);
      setSubmitted(true);

      toast({
        title: "¡Solicitud enviada!",
        description: "Revisa tu email: te hemos enviado una confirmación personalizada. Nos pondremos en contacto contigo en menos de 24 horas.",
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
  };`;

const newHandleSubmit = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor, revisa los campos señalados",
        variant: "destructive",
      });
      return;
    }

    setShowUpsell(true);
  };

  const handleFinalSubmit = async (answersFromUpsell: OnboardingAnswers) => {
    setIsSubmitting(true);
    setShowUpsell(false);

    try {
      const invokePromise = supabase.functions.invoke('send-contact-email', {
        body: {
          nombre: formData.nombre,
          email: formData.email,
          empresa: formData.empresa,
          comentario: formData.comentario,
          onboardingAnswers: answersFromUpsell,
          n8nHosting,
          source,
          chatbotContext,
          selectedProcesses: selectedProcesses.map(p => {
            const adjusted = computeFinalComplexity(p, answersFromUpsell);
            const processCustomizations = customizations[p.id];
            return {
              id: p.id,
              codigo: p.codigo,
              nombre: p.nombre,
              categoriaNombre: p.categoriaNombre,
              tagline: p.tagline,
              adjustedComplexity: adjusted.complexity,
              adjustedTimeEstimate: adjusted.timeEstimate,
              customizations: processCustomizations
            };
          }),
        },
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 30000);
      });

      const { data, error } = await Promise.race([invokePromise, timeoutPromise]) as any;

      if (error) throw error;

      console.log("Email sent successfully:", data);
      setSubmitted(true);

      toast({
        title: "¡Solicitud enviada!",
        description: "Revisa tu email: te hemos enviado una confirmación personalizada. Nos pondremos en contacto contigo en menos de 24 horas.",
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      let description = "No hemos podido enviar tu solicitud. Comprueba tu conexión e inténtalo de nuevo. Si el problema persiste, escríbenos a team@immoral.com";

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
  };`;

content = content.replace(oldHandleSubmit, newHandleSubmit);

// 4. Remove optional upsell from submitted screen
const upsellBlock = `            {/* Upsell opcional de onboarding */}
            {onRequestOnboarding && (
              <div className="bg-muted/50 border border-border rounded-xl p-5 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">¿Quieres una propuesta más precisa?</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Cuéntanos qué herramientas usas actualmente y cómo está estructurado tu equipo. Con esa info podemos afinar mucho más los tiempos y el precio de tu propuesta. Solo son 5 preguntas rápidas.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { handleClose(); onRequestOnboarding(); }}
                  className="mt-4 w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Añadir información extra →
                </button>
              </div>
            )}`;

content = content.replace(upsellBlock, "");

content = content.replace(
  `{onRequestOnboarding ? 'No gracias, cerrar' : 'Cerrar'}`,
  `Cerrar`
);

// 5. Wrap Return in Fragment and Add Onboarding Modal
content = content.replace(
  '  return (\n    <Dialog open={isOpen} onOpenChange={handleClose}>',
  '  return (\n    <>\n      <Dialog open={isOpen && !showUpsell && !submitted} onOpenChange={handleClose}>'
);

content = content.replace(
  '      </DialogContent>\n    </Dialog>\n  );\n};',
  `      </DialogContent>
    </Dialog>
    {showUpsell && (
      <OnboardingModal
        isOpen={showUpsell}
        onClose={() => handleFinalSubmit(getOnboardingAnswers())}
        initialAnswers={{ ...getOnboardingAnswers(), nombre: formData.nombre, email: formData.email }}
        prefilledSector={selectedProcesses.length > 0 ? selectedProcesses[0].categoriaNombre : undefined}
        upsellMode={true}
        onFinishUpsell={handleFinalSubmit}
      />
    )}
    </>
  );
};`
);

fs.writeFileSync('src/components/ContactForm.tsx', content);
