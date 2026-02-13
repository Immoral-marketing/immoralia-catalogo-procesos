import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const leadSchema = z.object({
    nombre: z.string().min(2),
    email: z.string().email(),
    telefono: z.string().optional(),
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

serve(async (req) => {
    // 1. Handle CORS Preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // 2. Validate Environment Variables
        // Make RESEND_API_KEY optional to prevent crashes if missing
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        // Only critical vars are strictly required for basic functionality (DB save)
        const missingVars = [];
        if (!SUPABASE_URL) missingVars.push("SUPABASE_URL");
        if (!SUPABASE_SERVICE_ROLE_KEY) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");

        if (missingVars.length > 0) {
            console.error(`ERROR: Critical config missing: ${missingVars.join(", ")}`);
            return new Response(JSON.stringify({
                error: "Configuration error",
                details: `Missing critical environment variables. Check Function Logs.`
            }), {
                headers: { "Content-Type": "application/json", ...corsHeaders },
                status: 500,
            });
        }

        if (!RESEND_API_KEY) {
            console.warn("WARNING: RESEND_API_KEY is missing. Emails will NOT be sent.");
        }

        // 3. Initialize Supabase Client
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

        // 4. Parse Body
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
                headers: { "Content-Type": "application/json", ...corsHeaders },
                status: 400,
            });
        }

        const parseResult = leadSchema.safeParse(body);
        if (!parseResult.success) {
            console.error("Validation error:", parseResult.error);
            return new Response(JSON.stringify({ error: "Validation error", details: parseResult.error.errors }), {
                headers: { "Content-Type": "application/json", ...corsHeaders },
                status: 400,
            });
        }

        const { nombre, email, telefono, answers } = parseResult.data;
        const clientIP = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "unknown";

        console.log(`Processing onboarding lead: ${email}`);

        // 5. Save to Database
        const { error: dbError } = await supabase
            .from("onboarding_leads")
            .insert({
                nombre,
                email,
                telefono,
                answers,
                ip_address: clientIP,
            });

        if (dbError) {
            console.error("Database error saving lead:", dbError);
            return new Response(JSON.stringify({ error: "Database error", details: dbError.message }), {
                headers: { "Content-Type": "application/json", ...corsHeaders },
                status: 500, // If DB fails, we should probably fail.
            });
        } else {
            console.log("Lead saved to database successfully.");
        }

        // 6. Helper Functions for Email
        // Define these only if we are going to send email, or just leave them here
        const formatTools = () => {
            const tools = answers.tools || [];
            if (!Array.isArray(tools)) return "No tools specified";

            const result: string[] = [];
            const categorized: Record<string, string[]> = {};

            tools.forEach((t: string) => {
                if (typeof t === 'string' && t.includes(": Otro")) {
                    const cat = t.split(":")[0];
                    const otherKey = `other_${cat}`;
                    const otherVal = answers[otherKey];
                    if (otherVal) categorized[cat] = [...(categorized[cat] || []), `Otro (${otherVal})`];
                } else {
                    result.push(t);
                }
            });

            const categorizedStr = Object.entries(categorized)
                .map(([cat, val]) => `${cat}: ${val.join(", ")}`);

            return [...result, ...categorizedStr].join(", ");
        };

        const formatChannels = (type: 'clients' | 'internal') => {
            const channels = answers.channels?.[type] || [];
            if (!Array.isArray(channels)) return "None";

            const result = channels.filter((c: string) => c !== "Otro");
            if (channels.includes("Otro")) {
                const otherVal = type === 'clients' ? answers.otherClientChannel : answers.otherInternalChannel;
                if (otherVal) result.push(`Otro (${otherVal})`);
            }
            return result.join(", ");
        };

        // 7. Prepare & Send Email (Only if key exists)
        if (RESEND_API_KEY) {
            const emailHtml = `
              <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px;">¡Nuevo Lead de Onboarding!</h1>
                </div>
                <div style="padding: 30px;">
                  <p style="font-size: 16px; line-height: 1.5;">Se ha completado un nuevo onboarding en el catálogo de procesos:</p>

                  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}">${escapeHtml(email)}</a></p>
                    <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${escapeHtml(telefono || "No proporcionado")}</p>
                  </div>

                  <h2 style="color: #666; border-bottom: 2px solid #eee; padding-bottom: 5px;">Ajuste y Madurez</h2>
                  <p><strong>Sector:</strong> ${escapeHtml(answers.sector || "N/A")} ${answers.otherSector ? `(${escapeHtml(answers.otherSector)})` : ""}</p>
                  <p><strong>Madurez Digital:</strong> ${escapeHtml(answers.maturity || "N/A")}</p>
                  <p><strong>Uso de IA:</strong> ${answers.usesAI ? "Sí" : "No"} ${answers.aiTools ? `<br/><em>Herramientas: ${escapeHtml(answers.aiTools)}</em>` : ""}</p>

                  <h2 style="color: #666; border-bottom: 2px solid #eee; padding-bottom: 5px;">Operativa Actual</h2>
                  <p><strong>Herramientas:</strong> ${escapeHtml(formatTools())}</p>
                  <p><strong>Canales Clientes:</strong> ${escapeHtml(formatChannels('clients'))}</p>
                  <p><strong>Comunicación Interna:</strong> ${escapeHtml(formatChannels('internal'))}</p>

                  <h2 style="color: #666; border-bottom: 2px solid #eee; padding-bottom: 5px;">Puntos Críticos</h2>
                  <p><strong>Cuellos de botella:</strong> ${escapeHtml(Array.isArray(answers.pains) ? answers.pains.join(", ") : "Ninguno")}</p>
                  ${answers.otherPain ? `<p><strong>Otros dolores:</strong> ${escapeHtml(answers.otherPain)}</p>` : ""}
                  ${answers.biggestPain ? `<p style="color: #d32f2f;"><strong>Freno principal:</strong> ${escapeHtml(answers.biggestPain)}</p>` : ""}
                </div>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888;">
                  Este lead ha sido capturado automáticamente al finalizar el onboarding.
                </div>
              </div>
            `;

            console.log("Sending email via Resend...");
            try {
                const res = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${RESEND_API_KEY}`,
                    },
                    body: JSON.stringify({
                        from: "Catálogo de Procesos <onboarding@resend.dev>",
                        to: ["david@immoral.es"],
                        subject: `Nuevo Lead Onboarding: ${nombre} (${answers.sector || 'Sin sector'})`,
                        html: emailHtml,
                    }),
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Error sending email:", errorText);
                    // Do NOT throw. Swallow the error so client receives Success.
                } else {
                    console.log("Email sent successfully.");
                }
            } catch (emailErr) {
                console.error("Exception sending email:", emailErr);
                // Also swallow
            }
        } else {
            console.log("Skipping email send because RESEND_API_KEY is not configured.");
        }

        // Return Success regardless of email outcome, as long as DB saved
        return new Response(JSON.stringify({
            success: true,
            message: "Lead processed successfully",
            emailSent: !!RESEND_API_KEY
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

