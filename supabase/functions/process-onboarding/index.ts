import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const leadSchema = z.object({
    nombre: z.string().min(1),
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
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        console.log("Request body received:", JSON.stringify(body));

        const { nombre, email, telefono, answers } = leadSchema.parse(body);
        const clientIP = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "unknown";

        console.log(`Procesando lead de onboarding: ${email}`);

        // 1. Guardar en base de datos
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
            console.error("CRITICAL: Error al guardar lead en DB:", JSON.stringify(dbError));
            throw new Error(`Error en base de datos: ${dbError.message}`);
        }

        // 2. Preparar el contenido del email para el administrador
        const formatTools = () => {
            try {
                const tools = answers.tools || [];
                const result: string[] = [];
                const categorized: Record<string, string[]> = {};

                tools.forEach((t: string) => {
                    if (typeof t !== 'string') return;
                    if (t.includes(": Otro")) {
                        const cat = t.split(":")[0];
                        const otherVal = answers[`other_${cat}`];
                        if (otherVal) categorized[cat] = [...(categorized[cat] || []), `Otro (${otherVal})`];
                    } else {
                        result.push(t);
                    }
                });

                return [...result, ...Object.entries(categorized).map(([cat, val]) => `${cat}: ${val.join(", ")}`)].join(", ");
            } catch (e) {
                console.error("Error al formatear herramientas:", e);
                return "Error al procesar herramientas";
            }
        };

        const formatChannels = (type: 'clients' | 'internal') => {
            try {
                const channels = answers.channels?.[type] || [];
                const result = channels.filter((c: string) => c !== "Otro");
                if (channels.includes("Otro")) {
                    const otherVal = type === 'clients' ? answers.otherClientChannel : answers.otherInternalChannel;
                    if (otherVal) result.push(`Otro (${otherVal})`);
                }
                return result.join(", ");
            } catch (e) {
                return "No especificado";
            }
        };

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
          <p><strong>Sector:</strong> ${escapeHtml(answers.sector)} ${answers.otherSector ? `(${escapeHtml(answers.otherSector)})` : ""}</p>
          <p><strong>Madurez Digital:</strong> ${escapeHtml(answers.maturity)}</p>
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

        // 3. Enviar email a David
        if (RESEND_API_KEY) {
            console.log("Enviando email de notificación...");
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
                const error = await res.text();
                console.error("Error al enviar email a admin:", error);
            } else {
                console.log("Email enviado con éxito.");
            }
        } else {
            console.warn("ADVERTENCIA: RESEND_API_KEY no configurado. Se omite el envío de email.");
        }

        return new Response(JSON.stringify({ success: true, message: "Lead capturado correctamente" }), {
            headers: { "Content-Type": "application/json", ...corsHeaders },
            status: 200,
        });
    } catch (error: any) {
        console.error("ERROR CRÍTICO en submit-onboarding-lead:", error);
        return new Response(JSON.stringify({
            error: error.message || "Error interno",
            details: error.toString(),
            hint: "Verifica que el nombre y email cumplan el formato y que las tablas existan."
        }), {
            headers: { "Content-Type": "application/json", ...corsHeaders },
            status: 500,
        });
    }
});
