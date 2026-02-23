import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";


const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const CLICKUP_TOKEN = Deno.env.get("CLICKUP_TOKEN");
const CLICKUP_LIST_ID = "901521069796";

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
  telefono: z.string().optional(),
  utm: z.string().optional(),
  source: z.string().optional(),
  comentario: z
    .string()
    .max(2000, "El comentario es demasiado largo. Intenta resumirlo un poco")
    .default(""),
  selectedProcesses: z
    .array(ProcessSchema)
    .min(1, "Selecciona al menos un proceso")
    .max(50, "Demasiados procesos seleccionados"),
  onboardingAnswers: z.any().optional(),
  n8nHosting: z.enum(["setup", "own"]).default("setup"),
});

// HTML escape function to prevent injection
function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .toString()
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

    const { nombre, email, empresa, comentario, selectedProcesses, onboardingAnswers, n8nHosting, telefono, utm, source } = validationResult.data;

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

    if (insertError) {
      console.error("ERROR en base de datos (contact_submissions):", insertError);
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

    // --- SEND EMAILS ---
    if (RESEND_API_KEY) {
      console.log("Sending emails...");
      // (Email sending logic from previous view_file goes here)
      // I'll keep the email sending logic to ensure functionality remains

      const safeNombre = escapeHtml(nombre);
      const safeEmail = escapeHtml(email);
      const safeEmpresa = escapeHtml(empresa);
      const safeComentario = escapeHtml(comentario);

      const processesListHTML = selectedProcesses
        .map(p => `<li>${escapeHtml(p.codigo)} - ${escapeHtml(p.nombre)}</li>`)
        .join("");

      try {
        // Business email
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Catálogo de Procesos <onboarding@resend.dev>",
            to: ["david@immoral.es"],
            subject: `Nueva solicitud de automatización - ${safeEmpresa}`,
            html: `<h1>Nueva solicitud</h1><p>Nombre: ${safeNombre}</p><p>Email: ${safeEmail}</p><p>Empresa: ${safeEmpresa}</p><ul>${processesListHTML}</ul><p>Comentario: ${safeComentario}</p>`,
          }),
        });

        // Client email
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Catálogo de Procesos <onboarding@resend.dev>",
            to: [email],
            subject: "Hemos recibido tu solicitud de automatización",
            html: `<h1>¡Gracias, ${safeNombre}!</h1><p>Hemos recibido tu solicitud para ${safeEmpresa}.</p>`,
          }),
        });
      } catch (err) {
        console.error("Error sending emails:", err);
      }
    }

    // --- CLICKUP INTEGRATION ---
    let clickupTaskId = null;
    if (CLICKUP_TOKEN) {
      console.log("Iniciando creación de tarea en ClickUp...");
      try {
        const isoDatetime = new Date().toISOString();

        // Helper to format onboarding answers into a readable string
        const formatOnboarding = (answers: any) => {
          if (!answers) return "No se proporcionaron respuestas de onboarding.";

          let text = "";
          if (answers.sector) text += `Sector: ${answers.sector}${answers.otherSector ? ` (${answers.otherSector})` : ""}\n`;
          if (answers.maturity) text += `Madurez: ${answers.maturity}\n`;

          if (answers.tools && Array.isArray(answers.tools)) {
            text += `Herramientas: ${answers.tools.join(", ")}\n`;
          }

          if (answers.channels) {
            if (answers.channels.clients?.length) text += `Canales Clientes: ${answers.channels.clients.join(", ")}\n`;
            if (answers.channels.internal?.length) text += `Canales Internos: ${answers.channels.internal.join(", ")}\n`;
          }

          if (answers.usesAI !== undefined) {
            text += `Usa IA: ${answers.usesAI ? "Sí" : "No"}\n`;
            if (answers.usesAI) {
              if (answers.aiTools) text += `- Herramientas IA: ${answers.aiTools}\n`;
              if (answers.aiUsagePurpose) text += `- Propósito IA: ${answers.aiUsagePurpose}\n`;
            }
          }

          if (answers.pains && Array.isArray(answers.pains) && answers.pains.length) {
            text += `Dolores/Necesidades:\n- ${answers.pains.join("\n- ")}\n`;
          }
          if (answers.otherPain) text += `Otros dolores: ${answers.otherPain}\n`;
          if (answers.biggestPain) text += `Mayor freno: ${answers.biggestPain}\n`;

          return text;
        };

        const onboardingText = formatOnboarding(onboardingAnswers);
        const processesText = selectedProcesses.map(p => `- ${p.codigo}: ${p.nombre}`).join("\n");

        const description = `Lead desde Web

### Información de Contacto
**Empresa:** ${empresa}
**Persona:** ${nombre}
**Email:** ${email}
**Tel:** ${telefono || "No proporcionado"}

### Contexto
**Mensaje:** ${comentario || "Sin mensaje"}
**Preferencia n8n:** ${n8nHosting === 'own' ? 'Servidor propio' : 'Setup Auto'}
**Origen:** ${source || "Web"}
**UTM:** ${utm || "Ninguna"}
**Fecha:** ${isoDatetime}

### Onboarding
${onboardingText}

### Procesos Seleccionados
${processesText}`;

        const createTask = async (withStatus = true) => {
          const body: any = {
            name: empresa,
            description,
            priority: 3,
          };
          if (withStatus) {
            body.status = "INTERESADO";
          }

          const response = await fetch(`https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: CLICKUP_TOKEN,
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw { status: response.status, data: errorData };
          }

          return await response.json();
        };

        try {
          const task = await createTask(true);
          clickupTaskId = task.id;
          console.log("Tarea creada en ClickUp con éxito:", clickupTaskId);
        } catch (err: any) {
          console.error("Error al crear tarea en ClickUp (con status):", err);
          console.log("Reintentando sin status...");
          const task = await createTask(false);
          clickupTaskId = task.id;
        }
      } catch (clickupError) {
        console.error("Fallo definitivo en la integración con ClickUp:", clickupError);
      }
    }
    // ---------------------------

    // Log the successful attempt
    await supabase.from("contact_requests_log").insert({
      ip_address: clientIP,
      email: email,
      status: "success"
    });

    return new Response(JSON.stringify({ success: true, clickup_task_id: clickupTaskId }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
