import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const SLACK_BOT_TOKEN = Deno.env.get("SLACK_BOT_TOKEN");
const SLACK_CHANNEL_ID = Deno.env.get("SLACK_CHANNEL_ID") || "C09CDUKL560";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function formatDateTime(isoString: string): string {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Madrid",
    });
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const payload = await req.json();

        const calendar = payload.calendar ?? {};

        const nombre = payload.full_name || [payload.first_name, payload.last_name].filter(Boolean).join(" ") || "Desconocido";
        const email = payload.email || "—";
        const telefono = payload.phone || "—";
        const startTime = calendar.startTime;
        const title = calendar.calendarName || "30 minutos - Immoralia_Catalogo";

        const fechaFormateada = startTime ? formatDateTime(startTime) : "—";

        const blocks = [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "📅 Nueva llamada agendada",
                    emoji: true,
                },
            },
            {
                type: "section",
                fields: [
                    { type: "mrkdwn", text: `*Contacto:*\n${nombre}` },
                    { type: "mrkdwn", text: `*Email:*\n${email}` },
                    { type: "mrkdwn", text: `*Teléfono:*\n${telefono}` },
                    { type: "mrkdwn", text: `*Fecha y hora:*\n${fechaFormateada}` },
                ],
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Tipo:* ${title}`,
                },
            },
        ];

        const response = await fetch("https://slack.com/api/chat.postMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
            },
            body: JSON.stringify({
                channel: SLACK_CHANNEL_ID,
                blocks,
                text: `Nueva llamada agendada con ${nombre} (${email}) — ${fechaFormateada}`,
            }),
        });

        const result = await response.json();

        if (!result.ok) {
            console.error("Slack error:", result.error);
            return new Response(JSON.stringify({ error: result.error }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (err: any) {
        console.error("notify-booking-slack error:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
