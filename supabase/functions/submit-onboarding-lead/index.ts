import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

import { sendSlackNewLead } from "../_shared/slack.ts";
import { getProfessionalTemplate } from "../_shared/email_templates.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const leadSchema = z.object({
    nombre: z.string().min(2),
    email: z.string().email(),
    telefono: z.string().optional(),
    utm: z.string().optional(),
    source: z.string().optional(),
    answers: z.any(),
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

const CLICKUP_TOKEN = Deno.env.get("CLICKUP_TOKEN");
const CLICKUP_LIST_ID = "901521069796";

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            console.error("Critical config missing");
            return new Response(JSON.stringify({ error: "Configuration error" }), { status: 500, headers: corsHeaders });
        }

        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

        const body = await req.json();
        const parseResult = leadSchema.safeParse(body);
        if (!parseResult.success) {
            return new Response(JSON.stringify({ error: "Validation error", details: parseResult.error.errors }), {
                headers: { "Content-Type": "application/json", ...corsHeaders },
                status: 400,
            });
        }

        const { nombre, email, telefono, answers, utm, source } = parseResult.data;
        const clientIP = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "unknown";

        console.log(`Processing Quick Form lead: ${email}`);

        // Save to Database
        const { error: dbError } = await supabase
            .from("onboarding_leads")
            .insert({ nombre, email, telefono, answers, ip_address: clientIP });

        if (dbError) {
            console.error("Database error saving lead:", dbError);
        }

        // Format Quick Form answers
        const formatOnboarding = (ans: any): string => {
            if (!ans) return "No se proporcionó información adicional.";
            let text = "";
            if (ans.sector) text += `Sector: ${ans.sector}${ans.otherSector ? ` (${ans.otherSector})` : ""}\n`;
            if (ans.maturity) text += `Madurez: ${ans.maturity}\n`;
            if (ans.tools && Array.isArray(ans.tools)) text += `Herramientas: ${ans.tools.join(", ")}\n`;
            if (ans.channels) {
                if (ans.channels.clients?.length) text += `Canales Clientes: ${ans.channels.clients.join(", ")}\n`;
                if (ans.channels.internal?.length) text += `Canales Internos: ${ans.channels.internal.join(", ")}\n`;
            }
            if (ans.usesAI !== undefined) {
                text += `Usa IA: ${ans.usesAI ? "Sí" : "No"}\n`;
                if (ans.usesAI) {
                    if (ans.aiTools) text += `- Herramientas IA: ${ans.aiTools}\n`;
                    if (ans.aiUsagePurpose) text += `- Propósito IA: ${ans.aiUsagePurpose}\n`;
                }
            }
            if (ans.pains && Array.isArray(ans.pains) && ans.pains.length) {
                text += `Dolores:\n- ${ans.pains.join("\n- ")}\n`;
            }
            if (ans.otherPain) text += `Otros dolores: ${ans.otherPain}\n`;
            if (ans.biggestPain) text += `Mayor freno: ${ans.biggestPain}\n`;
            
            return text || "No se proporcionó información adicional.";
        };

        const onboardingText = formatOnboarding(answers);

        // --- SEND EMAIL (always, regardless of ClickUp) ---
        if (RESEND_API_KEY) {
            const safeNombre = escapeHtml(nombre);
            const safeEmail = escapeHtml(email);
            const safeTelefono = escapeHtml(telefono || "No indicado");
            const safeUtm = escapeHtml(utm || "Ninguna");

            try {
                // Internal Email Content
                const internalHtml = `
                    <p class="field-label">Nombre del Lead</p>
                    <div class="field-value">${safeNombre}</div>
                    
                    <p class="field-label">Email de Contacto</p>
                    <div class="field-value">${safeEmail}</div>
                    
                    <p class="field-label">Teléfono</p>
                    <div class="field-value">${safeTelefono}</div>
                    
                    <p class="field-label">UTM / Origen</p>
                    <div class="field-value">${safeUtm}</div>
                    
                    <h2 class="section-title">Respuestas del Formulario</h2>
                    <pre>${onboardingText}</pre>
                `;

                // Client Email Content
                const clientHtml = `
                    <h2 style="margin-top:0">¡Gracias por tu interés, ${safeNombre}!</h2>
                    <p>Hemos recibido correctamente la información que nos has facilitado a través de nuestro catálogo de procesos.</p>
                    <p>Nuestro equipo de consultores está revisando tu perfil para identificar las mejores oportunidades de automatización para tu caso específico.</p>
                    <p><strong>Nos pondremos en contacto contigo en menos de 24 horas laborables para agendar una breve sesión de diagnóstico.</strong></p>
                    <p>Mientras tanto, puedes seguir explorando nuestro catálogo para descubrir cómo la IA y la automatización pueden transformar tu negocio.</p>
                `;

                await Promise.all([
                    // Business notification
                    fetch("https://api.resend.com/emails", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
                        body: JSON.stringify({
                            from: "Immoralia Notificaciones <onboarding@resend.dev>",
                            to: ["david@immoral.es"],
                            subject: `⚡ Quick Form Lead - ${safeNombre}`,
                            html: getProfessionalTemplate({
                                title: "Nuevo Quick Form Lead",
                                preheader: `Nuevo lead de ${safeNombre}`,
                                mainContent: internalHtml
                            }),
                        }),
                    }),
                    // Client confirmation
                    fetch("https://api.resend.com/emails", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
                        body: JSON.stringify({
                            from: "Immoralia <onboarding@resend.dev>",
                            to: [email],
                            subject: "Confirmación de recepción - Immoralia",
                            html: getProfessionalTemplate({
                                title: "Confirmación recibida",
                                preheader: "Hemos recibido tu información correctamente",
                                mainContent: clientHtml
                            }),
                        }),
                    }),
                ]);
                console.log("Quick Form emails sent successfully");
            } catch (emailErr) {
                console.error("Error sending Quick Form emails:", emailErr);
            }
        }

        // --- CLICKUP INTEGRATION ---
        let clickupTaskId: string | null = null;
        let clickupTaskUrl = "";
        if (CLICKUP_TOKEN) {
            console.log("Iniciando creación de tarea en ClickUp para Quick Form Lead...");
            try {
                const isoDatetime = new Date().toISOString();
                const description = `Quick Form Lead desde Web
 
 ### Información de Contacto
 **Persona:** ${nombre}
 **Email:** ${email}
 **Tel:** ${telefono || "No proporcionado"}
 
 ### Contexto
 **Origen:** ${source || "Web"}
 **UTM:** ${utm || "Ninguna"}
 **Fecha:** ${isoDatetime}
 
 ### Respuestas
 ${onboardingText}`;
 
                 const createTask = async (withStatus = true) => {
                     const taskBody: any = { name: `Quick Form Lead: ${nombre}`, description, priority: 3 };
                    if (withStatus) { taskBody.status = "CONOCIDO"; }
                    const response = await fetch(`https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: CLICKUP_TOKEN },
                        body: JSON.stringify(taskBody),
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
                    console.log("Tarea de onboarding creada en ClickUp:", clickupTaskId);
                } catch (err: any) {
                    console.error("Error al crear tarea en ClickUp (con status):", err);
                    const task = await createTask(false);
                    clickupTaskId = task.id;
                    clickupTaskUrl = task.url || `https://app.clickup.com/t/${clickupTaskId}`;
                }
            } catch (clickupError) {
                console.error("Fallo definitivo en la integración con ClickUp (onboarding):", clickupError);
            }
        }

        // --- SLACK NOTIFICATION (fire-and-forget, no await) ---
        if (clickupTaskId) {
            sendSlackNewLead({
                lead: { nombre, email, telefono, utm },
                clickupTask: { id: clickupTaskId, url: clickupTaskUrl },
                source: "quick_form"
            }).catch(err => console.error("Slack notification error:", err));
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Lead processed successfully",
            emailSent: true,
            clickup_task_id: clickupTaskId
        }), {
            headers: { "Content-Type": "application/json", ...corsHeaders },
            status: 200,
        });

    } catch (error: any) {
        console.error("Unhandled error in function:", error);
        return new Response(JSON.stringify({
            error: error.message || "Internal Server Error",
            timestamp: new Date().toISOString()
        }), {
            headers: { "Content-Type": "application/json", ...corsHeaders },
            status: 500,
        });
    }
});
