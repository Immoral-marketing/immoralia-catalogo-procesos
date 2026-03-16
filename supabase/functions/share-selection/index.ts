import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

import { sendSlackNotification } from "../_shared/slack.ts";
import { getProfessionalTemplate } from "../_shared/email_templates.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const shareSchema = z.object({
    receiverEmail: z.string().email(),
    senderName: z.string().optional().default("Un usuario"),
    senderEmail: z.string().optional().default("No especificado"),
    selectedProcesses: z.array(z.object({
        id: z.string(),
        nombre: z.string(),
        categoria: z.string().optional()
    }))
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
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        const body = await req.json();
        
        const parseResult = shareSchema.safeParse(body);
        if (!parseResult.success) {
            return new Response(JSON.stringify({ error: "Validation error", details: parseResult.error.errors }), {
                headers: { "Content-Type": "application/json", ...corsHeaders },
                status: 400,
            });
        }

        const { receiverEmail, senderName, senderEmail, selectedProcesses } = parseResult.data;

        console.log(`Processing share selection request from ${senderName} to ${receiverEmail}`);

        if (RESEND_API_KEY) {
            const safeSenderName = escapeHtml(senderName);
            const processListHtml = selectedProcesses.map(p => 
                `<li><strong>${escapeHtml(p.nombre)}</strong> ${p.categoria ? `(<em>${escapeHtml(p.categoria)}</em>)` : ''}</li>`
            ).join("");

            try {
                // Client Email Content
                const clientHtml = `
                    <h2 style="margin-top:0">¡Hola!</h2>
                    <p><strong>${safeSenderName}</strong> (${escapeHtml(senderEmail)}) ha compartido su selección de procesos del catálogo de Immoralia contigo.</p>
                    <p>A continuación, puedes ver los procesos que ha seleccionado:</p>
                    <ul style="margin-left: 20px;">
                        ${processListHtml}
                    </ul>
                    <p>Si tienes alguna duda o quieres saber cómo podemos ayudarte a automatizar estos procesos, <a href="https://immoralia.com/contacto">contacta con nosotros</a>.</p>
                    <p>Un saludo,<br>El equipo de Immoralia</p>
                `;

                await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
                    body: JSON.stringify({
                        from: "Immoralia <onboarding@resend.dev>",
                        to: [receiverEmail],
                        subject: `${safeSenderName} ha compartido su selección de procesos contigo`,
                        html: getProfessionalTemplate({
                            title: "Procesos Compartidos",
                            preheader: "Te han compartido una selección de procesos",
                            mainContent: clientHtml
                        }),
                    }),
                });

                console.log("Share emails sent successfully");
            } catch (emailErr) {
                console.error("Error sending share email:", emailErr);
            }
        }

        // --- SLACK NOTIFICATION ---
        try {
            await sendSlackNotification(`📤 *Nueva selección compartida*\nEl usuario *${senderName}* (${senderEmail}) ha compartido su selección de procesos con *${receiverEmail}*.\nProcesos enviados: ${selectedProcesses.length}`);
        } catch (err) {
            console.error("Slack notification error:", err);
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Share processed successfully",
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
