import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

import { sendSlackNewLead } from "../_shared/slack.ts";
import { getProfessionalTemplate } from "../_shared/email_templates.ts";

const CLICKUP_TOKEN = Deno.env.get("CLICKUP_TOKEN");
const CLICKUP_LIST_ID = "901521069796";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RATE_LIMIT_PERIOD_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_PERIOD = 50;

const ProcessSchema = z.object({
  id: z.string().max(50),
  codigo: z.string().max(20),
  nombre: z.string().max(200),
  categoriaNombre: z.string().max(100),
  tagline: z.string().max(500),
  customizations: z.any().optional(),
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
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  telefono: z.string().optional(),
  utm: z.string().optional(),
  source: z.string().optional(),
  comentario: z
    .string()
    .max(2000, "El comentario es demasiado largo. Intenta resumirlo un poco")
    .default(""),
  selectedProcesses: z
    .array(ProcessSchema)
    .max(50, "Demasiados procesos seleccionados"),
  onboardingAnswers: z.any().optional(),
  chatbotContext: z.array(z.string()).optional(),
  n8nHosting: z.enum(["setup", "own"]).default("setup"),
}).refine((data) => {
  if (data.source !== 'chatbot' && (!data.selectedProcesses || data.selectedProcesses.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Selecciona al menos un proceso para solicitar una propuesta",
  path: ["selectedProcesses"],
});

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

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

    const { nombre, email, empresa, comentario, selectedProcesses, onboardingAnswers, n8nHosting, telefono, utm, source, chatbotContext } = validationResult.data;

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

    // --- RATE LIMIT CHECK ---
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_PERIOD_MS).toISOString();
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

    // --- CLICKUP INTEGRATION ---
    let clickupTaskId: string | null = null;
    let clickupTaskUrl = "";

    // Calculate Business Hours Logic for Chatbot
    const isChatbot = source === 'chatbot';
    const nowLocal = new Date(); // Edge functions might use UTC, but user specified 08:00-18:00 in "their" time.
    // Assuming Madrid/Spain Time (CET/CEST) as per user's location +01:00 or current local time metadata
    // We'll use a simple offset or better yet, Intl to get the hour in Europe/Madrid if possible, 
    // but for Edge Functions we should be careful. 
    // User metadata says current local time is 10:43+01:00.
    
    const getMadridHour = () => {
        const d = new Date();
        const formatter = new Intl.DateTimeFormat('en-GB', {
            hour: 'numeric',
            hour12: false,
            timeZone: 'Europe/Madrid'
        });
        return parseInt(formatter.format(d));
    };

    const currentHour = getMadridHour();
    const isBusinessHours = currentHour >= 8 && currentHour < 18;

    if (CLICKUP_TOKEN) {
        console.log(`Iniciando creación de tarea en ClickUp (${isChatbot ? 'CHATBOT' : 'WEB'})...`);
        try {
            const isoDatetime = nowLocal.toISOString();

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

        const processesText = selectedProcesses.map((p: any) => {
          let text = `- ${p.codigo}: ${p.nombre}`;
          if (p.customizations) {
            const opts = p.customizations.selectedOptions || {};
            const inputs = p.customizations.customInputs || {};

            const optKeys = Object.keys(opts);
            if (optKeys.length > 0) {
              text += `\n  Personalización:`;
              optKeys.forEach(k => {
                const val = opts[k];
                const customInputStr = inputs[k] ? ` (Especificado: ${inputs[k]})` : '';
                text += `\n    * ${k}: ${val}${customInputStr}`;
              });
            }
            if (inputs.needs?.trim()) {
              text += `\n  Necesidades específicas:\n    "${inputs.needs.trim()}"`;
            }
          }
          return text;
        }).join("\n\n");

        const chatbotHistory = isChatbot && chatbotContext && chatbotContext.length > 0
          ? `\n### Historial del Chatbot\n${chatbotContext.join('\n')}\n`
          : "";

        const description = `Lead desde ${isChatbot ? "Chatbot" : "Web"}

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
${chatbotHistory}
### Onboarding
${onboardingText}

### Procesos Seleccionados
${processesText}`;

        const createTask = async (withStatus = true) => {
          let taskName = empresa;
          if (isChatbot) {
            const isGenericEmpresa = !empresa || empresa.trim() === '' || empresa.toLowerCase() === 'particular' || empresa.toLowerCase() === 'n/a';
            const identifier = isGenericEmpresa ? nombre : empresa;
            taskName = isBusinessHours ? `🔴 [URGENTE] Chatbot Lead: ${identifier}` : `Chatbot Lead: ${identifier}`;
          }
          const body: any = { name: taskName, description, priority: 3 };
          if (withStatus) { body.status = isChatbot && isBusinessHours ? "CONTACTAR YA" : "INTERESADO"; }
          const response = await fetch(`https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: CLICKUP_TOKEN },
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
          clickupTaskUrl = task.url || `https://app.clickup.com/t/${clickupTaskId}`;
          console.log("Tarea creada en ClickUp con éxito:", clickupTaskId);
        } catch (err: any) {
          console.error("Error al crear tarea en ClickUp (con status):", err);
          console.log("Reintentando sin status...");
          const task = await createTask(false);
          clickupTaskId = task.id;
          clickupTaskUrl = task.url || `https://app.clickup.com/t/${clickupTaskId}`;
        }
      } catch (clickupError) {
        console.error("Fallo definitivo en la integración con ClickUp:", clickupError);
      }
    }

    // --- SEND EMAILS ---
    if (RESEND_API_KEY) {
      const safeNombre = escapeHtml(nombre);
      const safeEmail = escapeHtml(email);
      const safeEmpresa = escapeHtml(empresa);
      const safeComentario = escapeHtml(comentario || "No indicado");
      const safeTelefono = escapeHtml(telefono || "No indicado");
      
      const processesListHTML = selectedProcesses.length > 0
        ? `<ul>${selectedProcesses.map((p: any) => `<li><strong>${escapeHtml(p.codigo)}</strong> - ${escapeHtml(p.nombre)}</li>`).join("")}</ul>`
        : "<p>Sin procesos seleccionados</p>";

      const sourceLabel = isChatbot ? 'Derivación desde Chatbot' : 'Solicitud de Oferta';

      try {
        const emailsToBatch = [];

        // Internal notification email
        const internalMainContent = `
          <p class="field-label">Origen de la solicitud</p>
          <div class="field-value">${sourceLabel} ${isChatbot && isBusinessHours ? '<strong>(En horario laboral - Atención inmediata)</strong>' : ''}</div>
          
          <div style="display: flex; gap: 20px;">
            <div style="flex: 1">
              <p class="field-label">Persona</p>
              <div class="field-value">${safeNombre}</div>
            </div>
            <div style="flex: 1">
              <p class="field-label">Empresa</p>
              <div class="field-value">${safeEmpresa}</div>
            </div>
          </div>

          <div style="display: flex; gap: 20px;">
            <div style="flex: 1">
              <p class="field-label">Email</p>
              <div class="field-value">${safeEmail}</div>
            </div>
            <div style="flex: 1">
              <p class="field-label">Teléfono</p>
              <div class="field-value">${safeTelefono}</div>
            </div>
          </div>

          <h2 class="section-title">Detalles de la Solicitud</h2>
          ${!isChatbot ? `<h3>Procesos Seleccionados:</h3>${processesListHTML}` : ""}
          <p class="field-label">Comentario</p>
          <div class="field-value">${safeComentario}</div>

          ${isChatbot && chatbotContext && chatbotContext.length > 0 ? `
            <h2 class="section-title">Historial del Chat</h2>
            <pre>${chatbotContext.join('\n')}</pre>
          ` : ""}
          
          ${clickupTaskUrl ? `<a href="${clickupTaskUrl}" class="cta-button">Ver en ClickUp</a>` : ""}
        `;

        emailsToBatch.push(
          fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
            body: JSON.stringify({
              from: "Immoralia Notificaciones <noreply@immoralia.es>",
              to: ["team@immoralia.es"],
              subject: `${isChatbot && isBusinessHours ? '⚡ [INMEDIATO] ' : '🚀 '}Lead: ${safeEmpresa} - ${safeNombre}`,
              html: getProfessionalTemplate({
                title: "Nueva Solicitud de Lead",
                preheader: `Nueva solicitud de ${safeNombre} (${safeEmpresa})`,
                mainContent: internalMainContent
              }),
            }),
          })
        );

        // User confirmation email logic
        let shouldSendUserEmail = true;
        let clientMainContent = "";
        let clientSubject = "Hemos recibido tu solicitud - Immoralia";

        if (isChatbot) {
          if (isBusinessHours) {
            // "NO debe enviarse email automático al usuario" -> But user said "no debe enviarse email automático si se deriva directamente".
            // Since we don't have a real-time handover websocket here, we just create the task. 
            // The prompt says: "Si la solicitud se produce entre las 08:00 y las 18:00: NO debe enviarse email automático al usuario"
            shouldSendUserEmail = false;
          } else {
            clientSubject = "Recibido: Revisaremos tu consulta lo antes posible";
            clientMainContent = `
              <h2 style="margin-top:0">¡Hola, ${safeNombre}!</h2>
              <p>Hemos recibido tu solicitud de contacto a través de nuestro asistente virtual.</p>
              <p>Te escribimos para confirmarte que <strong>estamos fuera de nuestro horario de atención habitual (08:00 - 18:00)</strong>.</p>
              <p>No te preocupes: un consultor humano revisará tu caso y el historial de la conversación con el chatbot en cuanto volvamos a estar operativos.</p>
              <p><strong>Nos pondremos en contacto contigo lo antes posible para ayudarte con tus dudas.</strong></p>
              <p>Gracias por tu paciencia y por confiar en Immoralia.</p>
            `;
          }
        } else {
          // Normal Offer Request
          clientMainContent = `
            <h2 style="margin-top:0">¡Gracias por tu solicitud, ${safeNombre}!</h2>
            <p>Hemos recibido tu interés en automatizar procesos para <strong>${safeEmpresa}</strong>.</p>
            <p>Nuestro equipo está analizando los procesos que has seleccionado para preparar una propuesta personalizada que se ajuste a tus necesidades.</p>
            <p><strong>Un consultor se pondrá en contacto contigo en las próximas 24 horas laborables</strong> para profundizar en los detalles y resolver cualquier duda.</p>
            <br>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
              <h4 style="margin-top: 0">Resumen de procesos seleccionados:</h4>
              ${processesListHTML}
            </div>
            <p>Estamos deseando ayudarte a escalar tu negocio a través de la automatización.</p>
          `;
        }

        if (shouldSendUserEmail) {
          emailsToBatch.push(
            fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
              body: JSON.stringify({
                from: "Immoralia <noreply@immoralia.es>",
                to: [email],
                subject: clientSubject,
                html: getProfessionalTemplate({
                  title: "Confirmación de solicitud",
                  preheader: "Hemos recibido tu solicitud correctamente",
                  mainContent: clientMainContent
                }),
              }),
            })
          );
        }

        await Promise.all(emailsToBatch);
        console.log("Lead emails processed successfully");
      } catch (err) {
        console.error("Error processing emails:", err);
      }
    }

    // --- SLACK NOTIFICATION (fire-and-forget, no await) ---
    if (clickupTaskId) {
      sendSlackNewLead({
        lead: { nombre, email, empresa, telefono, comentario, utm },
        clickupTask: { id: clickupTaskId, url: clickupTaskUrl },
        source: (source === 'chatbot' ? 'chatbot' : (source === 'onboarding' ? 'onboarding' : 'offer_request'))
      }).catch(err => console.error("Slack notification error:", err));
    }

    // --- LOG SUCCESS ---
    await supabase.from("contact_requests_log").insert({
      ip_address: clientIP,
      email: email,
      status: "success"
    });

    return new Response(JSON.stringify({ success: true, clickup_task_id: clickupTaskId }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
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
