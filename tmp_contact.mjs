import fs from 'fs';

let code = fs.readFileSync('src/components/ContactForm.tsx', 'utf8');

if (!code.includes('import { OnboardingModal }')) {
  code = code.replace(
    /import \{ OnboardingAnswers, getOnboardingAnswers \} from "@\/lib\/onboarding-utils";/,
    'import { OnboardingAnswers, getOnboardingAnswers } from "@/lib/onboarding-utils";\nimport { OnboardingModal } from "@/components/OnboardingModal";'
  );
}

if (!code.includes('setShowUpsell')) {
  code = code.replace(
    /const \[isSubmitting, setIsSubmitting\] = useState\(false\);/,
    'const [isSubmitting, setIsSubmitting] = useState(false);\n  const [showUpsell, setShowUpsell] = useState(false);'
  );
}

// Rename handleSubmit to originalHandleSubmit temporarily to not break things
// We will replace handleSubmit completely using regex
code = code.replace(/const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?const handleClose = \(\) => \{/, 
`const handleSubmit = async (e: React.FormEvent) => {
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
  };

  const handleClose = () => {`);

// Remove optional upsell block
code = code.replace(/\{onRequestOnboarding && \([\s\S]*?Añadir información extra[^\}]*\}\)\}/, '');

code = code.replace(/\{onRequestOnboarding \? 'No gracias, cerrar' : 'Cerrar'\}/, 'Cerrar');

code = code.replace(/<Dialog open=\{isOpen\}/, '<Dialog open={isOpen && !showUpsell && !submitted}');

code = code.replace(/<\/Dialog>\s*\);\s*\};/g, `</DialogContent>
    </Dialog>
    {showUpsell && (
      <OnboardingModal
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        initialAnswers={{ ...getOnboardingAnswers(), nombre: formData.nombre, email: formData.email }}
        prefilledSector={selectedProcesses.length > 0 ? selectedProcesses[0].categoriaNombre : undefined}
        upsellMode={true}
        onFinishUpsell={handleFinalSubmit}
      />
    )}
    </>
  );
};`);

// Need to wrap return in Fragment <></>
code = code.replace(/return \(\s*<Dialog open=\{isOpen && !showUpsell && !submitted\}/, 'return (\n    <>\n      <Dialog open={isOpen && !showUpsell && !submitted}');

fs.writeFileSync('src/components/ContactForm.tsx', code);
console.log('Fixed ContactForm completely');
