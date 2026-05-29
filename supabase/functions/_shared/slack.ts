import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

interface SlackPayload {
    lead: {
        nombre: string;
        email: string;
        empresa?: string;
        telefono?: string;
        comentario?: string;
        utm?: string;
    };
    clickupTask: {
        id: string;
        url: string;
        status?: string;
        priority?: number | string;
    };
    source: "offer_request" | "onboarding" | "chatbot" | "quick_form";
}

const SLACK_BOT_TOKEN = Deno.env.get("SLACK_BOT_TOKEN");
const SLACK_CHANNEL_ID = Deno.env.get("SLACK_CHANNEL_ID") || "C08F24QQFB2";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Sends a notification to Slack when a new lead is created.
 * Includes retries, timeout, and idempotency check.
 */
export async function sendSlackNewLead({ lead, clickupTask, source }: SlackPayload) {
    if (!SLACK_BOT_TOKEN) {
        console.error("SLACK_BOT_TOKEN is not defined. Skipping Slack notification.");
        return;
    }

    const taskId = clickupTask.id;

    // 1. Idempotency Check
    const { data: existingLog, error: checkError } = await supabase
        .from("slack_notifications_log")
        .select("clickup_task_id")
        .eq("clickup_task_id", taskId)
        .single();

    if (existingLog) {
        console.log(`Slack notification already sent for task ${taskId}. Skipping.`);
        return;
    }

    if (checkError && checkError.code !== "PGRST116") { // PGRST116 is "not found"
        console.error("Error checking slack_notifications_log:", checkError);
    }

    // 2. Prepare Message
    const sourceLabel = {
        offer_request: "Solicitud de Oferta",
        onboarding: "Formulario Onboarding",
        chatbot: "Chatbot (Handover)",
        quick_form: "Quick Form Lead (⚡)",
    }[source];

    const blocks = [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: `🚀 Nuevo Lead: ${clickupTask.id}`,
                emoji: true,
            },
        },
        {
            type: "section",
            fields: [
                { type: "mrkdwn", text: `*Origen:*\n${sourceLabel}` },
                { type: "mrkdwn", text: `*Empresa:*\n${lead.empresa || "N/A"}` },
                { type: "mrkdwn", text: `*Contacto:*\n${lead.nombre}` },
                { type: "mrkdwn", text: `*Email:*\n${lead.email}` },
            ],
        },
    ];

    if (lead.telefono || lead.utm) {
        blocks.push({
            type: "section",
            fields: [
                { type: "mrkdwn", text: `*Teléfono:*\n${lead.telefono || "No provisto"}` },
                { type: "mrkdwn", text: `*UTM:*\n${lead.utm || "Ninguna"}` },
            ],
        } as any);
    }

    if (lead.comentario) {
        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: `*Comentario:*\n${lead.comentario}`,
            },
        } as any);
    }

    blocks.push({
        type: "actions",
        elements: [
            {
                type: "button",
                text: { type: "plain_text", text: "Ver en ClickUp", emoji: true },
                url: clickupTask.url,
                action_id: "view_clickup",
            },
        ],
    } as any);

    // 3. Send with Retries
    let attempt = 0;
    const maxRetries = 3;
    const timeoutMs = 5000;

    while (attempt <= maxRetries) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

            const response = await fetch("https://slack.com/api/chat.postMessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
                },
                body: JSON.stringify({
                    channel: SLACK_CHANNEL_ID,
                    blocks,
                    text: `Nuevo lead de ${lead.nombre} (${sourceLabel})`,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const result = await response.json();

            if (result.ok) {
                // Log success
                await supabase.from("slack_notifications_log").insert({
                    clickup_task_id: taskId,
                    success: true,
                });
                console.log(`Slack notification sent successfully on attempt ${attempt + 1}`);
                return;
            } else {
                throw new Error(`Slack API error: ${result.error}`);
            }
        } catch (err: any) {
            attempt++;
            console.error(`Attempt ${attempt} failed to send Slack notification:`, err.message);

            if (attempt > maxRetries) {
                // Log final failure
                await supabase.from("slack_notifications_log").insert({
                    clickup_task_id: taskId,
                    success: false,
                    error_message: err.message,
                });
                break;
            }

            // Exponential backoff
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}

/**
 * Sends a generic text notification to Slack.
 */
export async function sendSlackNotification(text: string) {
    if (!SLACK_BOT_TOKEN) {
        console.error("SLACK_BOT_TOKEN is not defined. Skipping Slack notification.");
        return;
    }

    try {
        const response = await fetch("https://slack.com/api/chat.postMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
            },
            body: JSON.stringify({
                channel: SLACK_CHANNEL_ID,
                text,
            }),
        });

        const result = await response.json();
        if (!result.ok) {
            console.error("Error sending generic slack notification:", result.error);
        }
    } catch (err: any) {
        console.error("Failed to send generic slack notification:", err.message);
    }
}

