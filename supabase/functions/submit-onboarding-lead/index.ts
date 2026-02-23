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
    // 1. Handle CORS Preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // 2. Validate Environment Variables
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            console.error("Critical config missing");
            return new Response(JSON.stringify({ error: "Configuration error" }), { status: 500, headers: corsHeaders });
        }

        // 3. Initialize Supabase Client
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

        // 4. Parse Body
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
        }

        // ... (EMAILS)

        // --- CLICKUP INTEGRATION ---
        let clickupTaskId = null;
        if (CLICKUP_TOKEN) {
            console.log("Iniciando creación de tarea en ClickUp para lead de onboarding...");
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

                const onboardingText = formatOnboarding(answers);

                const description = `Lead Onboarding desde Web

### Información de Contacto
**Persona:** ${nombre}
**Email:** ${email}
**Tel:** ${telefono || "No proporcionado"}

### Contexto
**Origen:** ${source || "Web"}
**UTM:** ${utm || "Ninguna"}
**Fecha:** ${isoDatetime}

### Onboarding
${onboardingText}`;

                const createTask = async (withStatus = true) => {
                    const body: any = {
                        name: `Lead Onboarding: ${nombre}`,
                        description,
                        priority: 3,
                    };
                    if (withStatus) {
                        body.status = "CONOCIDO";
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
                    console.log("Tarea de onboarding creada en ClickUp:", clickupTaskId);
                } catch (err: any) {
                    console.error("Error al crear tarea en ClickUp (con status):", err);
                    console.log("Reintentando sin status...");
                    const task = await createTask(false);
                    clickupTaskId = task.id;
                }
            } catch (clickupError) {
                console.error("Fallo definitivo en la integración con ClickUp (onboarding):", clickupError);
            }
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Lead processed successfully",
            emailSent: !!RESEND_API_KEY,
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
