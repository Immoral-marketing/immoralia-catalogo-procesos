import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { calculatePrice } from "../../../src/lib/pricing.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_PERIOD_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_PERIOD = 3;

// Zod validation schemas
const ProcessSchema = z.object({
  id: z.string().max(50),
  codigo: z.string().max(20),
  nombre: z.string().max(200),
  categoriaNombre: z.string().max(100),
  tagline: z.string().max(500),
});

const ContactRequestSchema = z.object({
  nombre: z
    .string({ required_error: "Escribe tu nombre completo para poder contactarte" })
    .trim()
    .min(1, "Escribe tu nombre completo para poder contactarte")
    .min(2, "El nombre parece incompleto. ¿Puedes verificarlo?")
    .max(100, "Nombre muy largo"),
  email: z
    .string({ required_error: "Necesitamos tu email para enviarte la propuesta" })
    .trim()
    .min(1, "Necesitamos tu email para enviarte la propuesta")
    .email("Este email no parece válido. Revisa que esté bien escrito")
    .max(255),
  empresa: z
    .string({ required_error: "Indícanos el nombre de tu agencia o empresa" })
    .trim()
    .min(1, "Indícanos el nombre de tu agencia o empresa")
    .min(2, "Empresa muy corta")
    .max(200, "Empresa muy larga"),
  comentario: z
    .string()
    .max(2000, "El comentario es demasiado largo. Intenta resumirlo un poco")
    .default(""),
  selectedProcesses: z
    .array(ProcessSchema)
    .min(1, "Selecciona al menos un proceso")
    .max(50, "Demasiados procesos seleccionados"),
  onboardingAnswers: z.any().optional(),
});

// HTML escape function to prevent injection
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP address
    const clientIP = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    // Parse and validate input
    const rawData = await req.json();
    const validationResult = ContactRequestSchema.safeParse(rawData);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return new Response(
        JSON.stringify({
          error: "Datos inválidos",
          details: validationResult.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { nombre, email, empresa, comentario, selectedProcesses, onboardingAnswers } = validationResult.data;

    // --- SAVE TO DATABASE ---
    console.log("Iniciando inserción en base de datos para:", email);
    const { error: insertError } = await supabase
      .from("contact_submissions")
      .insert({
        nombre,
        email,
        empresa,
        comentario,
        selected_processes: selectedProcesses,
        onboarding_answers: onboardingAnswers,
        ip_address: clientIP,
      });

    let submissionId = null;
    if (insertError) {
      console.error("ERROR en base de datos (contact_submissions):", insertError);
    } else {
      console.log("Inserción exitosa en contact_submissions");
      // Getting the ID if we need to update it with errors later
      const { data: insertedData } = await supabase
        .from("contact_submissions")
        .select("id")
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      submissionId = insertedData?.id;
    }
    // ------------------------

    // --- RATE LIMIT CHECK ---
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_PERIOD_MS).toISOString();

    // Check by IP and Email combined
    const { count, error: countError } = await supabase
      .from("contact_requests_log")
      .select("*", { count: "exact", head: true })
      .or(`ip_address.eq.${clientIP},email.eq.${email}`)
      .eq("status", "success")
      .gt("created_at", oneHourAgo);

    if (countError) {
      console.error("Error checking rate limit:", countError);
    } else if (count !== null && count >= MAX_REQUESTS_PER_PERIOD) {
      console.warn(`Rate limit exceeded for IP: ${clientIP} or Email: ${email}`);

      // Log the blocked attempt
      await supabase.from("contact_requests_log").insert({
        ip_address: clientIP,
        email: email,
        status: "blocked"
      });

      return new Response(
        JSON.stringify({
          error: "Has superada el límite de solicitudes por hoy (3 por hora). Por favor, inténtalo más tarde o contáctanos directamente.",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    // ------------------------

    // Calculate estimated price
    const processCount = selectedProcesses.length;
    const priceResult = calculatePrice(processCount);
    const estimatedPrice = priceResult?.isCustom || !priceResult
      ? "A medida"
      : `${priceResult.price.toLocaleString("es-ES")}€`;

    console.log("Sending contact email for:", {
      nombre: escapeHtml(nombre),
      email: escapeHtml(email),
      empresa: escapeHtml(empresa),
      processCount: selectedProcesses.length,
      estimatedPrice: estimatedPrice,
    });

    // Create processes list HTML with escaped content
    const processesListHTML = selectedProcesses
      .map(
        (process) => `
      <div style="margin: 10px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
        <strong>${escapeHtml(process.codigo)} - ${escapeHtml(process.nombre)}</strong><br/>
        <span style="color: #666; font-size: 12px;">${escapeHtml(process.categoriaNombre)}</span><br/>
        <em style="color: #888; font-size: 13px;">${escapeHtml(process.tagline)}</em>
      </div>
    `
      )
      .join("");

    // Create onboarding answers HTML
    let onboardingHTML = "";
    if (onboardingAnswers) {
      // Helper to format tools list with "Other" values
      const formatTools = () => {
        const tools = Array.isArray(onboardingAnswers.tools) ? onboardingAnswers.tools : [];
        const otherFields = Object.keys(onboardingAnswers).filter(k => k.startsWith('other_'));

        let toolsText = tools.filter(t => !t.includes(': Otro')).join(", ");

        const otherValues = otherFields
          .map(k => {
            const cat = k.replace('other_', '');
            return onboardingAnswers[k] ? `${cat}: ${onboardingAnswers[k]}` : null;
          })
          .filter(Boolean);

        if (otherValues.length > 0) {
          toolsText += (toolsText ? ", " : "") + otherValues.join(", ");
        }

        return toolsText || "Ninguna seleccionada";
      };

      // Helper for channels
      const formatChannels = (type: 'clients' | 'internal') => {
        const channels = onboardingAnswers.channels?.[type] || [];
        let text = channels.filter((c: string) => c !== "Otro").join(", ");
        const other = type === 'clients' ? onboardingAnswers.otherClientChannel : onboardingAnswers.otherInternalChannel;
        if (channels.includes("Otro") && other) {
          text += (text ? ", " : "") + `Otros: ${other}`;
        }
        return text || "No especificado";
      };

      onboardingHTML = `
        <h2 style="color: #666;">Datos del Onboarding:</h2>
        <div style="padding: 15px; background-color: #f0f7ff; border-radius: 8px; border-left: 4px solid #0066cc; line-height: 1.6;">
          <p><strong>Sector:</strong> ${escapeHtml(onboardingAnswers.sector || "No especificado")} ${onboardingAnswers.otherSector ? `(${escapeHtml(onboardingAnswers.otherSector)})` : ""}</p>
          
          <p><strong>Herramientas actuales:</strong><br/>
          <span style="color: #444;">${escapeHtml(formatTools())}</span></p>
          
          <p><strong>Canales de contacto clientes:</strong><br/>
          <span style="color: #444;">${escapeHtml(formatChannels('clients'))}</span></p>
          
          <p><strong>Comunicación interna:</strong><br/>
          <span style="color: #444;">${escapeHtml(formatChannels('internal'))}</span></p>
          
          <p><strong>Madurez Digital:</strong> ${escapeHtml(onboardingAnswers.maturity || "No especificada")}</p>
          
          <p><strong>Uso de IA:</strong> ${onboardingAnswers.usesAI ? "Sí" : "No"}</p>
          ${onboardingAnswers.aiTools ? `<p style="margin-left: 20px;"><strong>Herramientas:</strong> ${escapeHtml(onboardingAnswers.aiTools)}</p>` : ""}
          ${onboardingAnswers.aiUsagePurpose ? `<p style="margin-left: 20px;"><strong>Tareas:</strong> ${escapeHtml(onboardingAnswers.aiUsagePurpose)}</p>` : ""}
          
          <p><strong>Cuellos de botella (Pains):</strong><br/>
          <span style="color: #444;">${escapeHtml(Array.isArray(onboardingAnswers.pains) ? onboardingAnswers.pains.join(", ") : "Ninguno")}</span>
          ${onboardingAnswers.otherPain ? `<br/><em>Otros dolores: ${escapeHtml(onboardingAnswers.otherPain)}</em>` : ""}
          </p>
          
          ${onboardingAnswers.biggestPain ? `<p><strong>Mayor freno operativo:</strong><br/><span style="color: #d32f2f;">${escapeHtml(onboardingAnswers.biggestPain)}</span></p>` : ""}
        </div>
      `;
    }

    // Escape user inputs for email content
    const safeNombre = escapeHtml(nombre);
    const safeEmail = escapeHtml(email);
    const safeEmpresa = escapeHtml(empresa);
    const safeComentario = escapeHtml(comentario);

    // Send email to the business (you) using Resend API
    const businessEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Catálogo de Procesos <onboarding@resend.dev>",
        to: ["david@immoral.es"],
        subject: `Nueva solicitud de automatización - ${safeEmpresa}`,
        html: `
          <h1 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">Nueva solicitud de propuesta</h1>
          
          <div style="margin-bottom: 20px;">
            <h2 style="color: #666; margin-bottom: 5px;">Datos del contacto:</h2>
            <p style="margin: 2px 0;"><strong>Nombre:</strong> ${safeNombre}</p>
            <p style="margin: 2px 0;"><strong>Email:</strong> ${safeEmail}</p>
            <p style="margin: 2px 0;"><strong>Empresa:</strong> ${safeEmpresa}</p>
          </div>
          
          ${onboardingHTML}

          <div style="margin-top: 25px;">
            <h2 style="color: #666; margin-bottom: 5px;">Procesos seleccionados (${selectedProcesses.length}):</h2>
            <p><strong>Estimación:</strong> <span style="font-size: 18px; color: #0066cc; font-weight: bold;">${estimatedPrice}</span></p>
            ${processesListHTML}
          </div>
          
          ${safeComentario
            ? `
            <div style="margin-top: 25px;">
              <h2 style="color: #666; margin-bottom: 5px;">Comentario adicional:</h2>
              <div style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #ddd; font-style: italic;">
                ${safeComentario}
              </div>
            </div>
          `
            : ""
          }
          
          <p style="margin-top: 40px; color: #888; font-size: 12px; border-top: 1px solid #eee; pt: 10px;">
            Este email fue generado automáticamente desde el catálogo de procesos de Immoralia Admin y los datos han sido guardados en la base de datos de Supabase.
          </p>
        `,
      }),
    });


    if (!businessEmailResponse.ok) {
      const error = await businessEmailResponse.text();
      throw new Error(`Failed to send business email: ${error}`);
    }

    // Send confirmation email to the client (using validated email)
    const clientEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Catálogo de Procesos <onboarding@resend.dev>",
        to: [email], // Use the validated email directly
        subject: "Hemos recibido tu solicitud de automatización",
        html: `
          <h1 style="color: #333;">¡Gracias por tu interés, ${safeNombre}!</h1>
          
          <p>Hemos recibido tu solicitud de automatización para <strong>${safeEmpresa}</strong>.</p>
          
          <h2 style="color: #666;">Procesos que seleccionaste (${selectedProcesses.length}):</h2>
          ${processesListHTML}
          
          <p><strong>Estimación orientativa:</strong> <span style="font-size: 16px; color: #0066cc; font-weight: bold;">${estimatedPrice}</span></p>
          
          <p style="margin-top: 20px;">
            Nos pondremos en contacto contigo pronto para diseñar tu proyecto de automatización personalizado.
          </p>
          
          <p style="margin-top: 30px;">
            Saludos,<br>
            <strong>El equipo de Immoralia Admin</strong>
          </p>
          
          <p style="margin-top: 30px; color: #888; font-size: 12px;">
            Si no solicitaste esta información, puedes ignorar este email.
          </p>
        `,
      }),
    });

    if (!clientEmailResponse.ok) {
      const error = await clientEmailResponse.text();
      throw new Error(`Failed to send client email: ${error}`);
    }

    const businessEmailData = await businessEmailResponse.json();
    const clientEmailData = await clientEmailResponse.json();

    console.log("Emails sent successfully:", { businessEmailData, clientEmailData });

    // Log the successful attempt
    await supabase.from("contact_requests_log").insert({
      ip_address: clientIP,
      email: email,
      status: "success"
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-contact-email function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    // Attempt to log the error back to the submission record if we have an ID
    // Note: We need a column for this, or just rely on console logs.
    // Given the user is frustrated, I'll be very verbose in the 500 response.

    return new Response(
      JSON.stringify({
        error: errorMessage,
        timestamp: new Date().toISOString(),
        suggestion: "Verifica que el dominio 'send.immoralia.es' esté verificado en tu panel de Resend o intenta usar 'onboarding@resend.dev' como remitente."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
