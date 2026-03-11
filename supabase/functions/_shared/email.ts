/**
 * Shared Email Helper using Resend
 */

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface EmailPayload {
    lead: {
        nombre: string;
        email: string;
        empresa?: string;
        telefono?: string;
        comentario?: string;
    };
    source: "offer_request" | "onboarding" | "chatbot" | "quick_form";
    extraContext?: string; // e.g. Selected processes or Chat history
}

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

export async function sendEmailNewLead({ lead, source, extraContext }: EmailPayload) {
    if (!RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not defined. Skipping Email notification.");
        return;
    }

    const safeNombre = escapeHtml(lead.nombre);
    const safeEmail = escapeHtml(lead.email);
    const safeEmpresa = escapeHtml(lead.empresa || "Particular");
    const safeComentario = escapeHtml(lead.comentario || "");

    const sourceLabel = {
        offer_request: "Solicitud de Propuesta",
        onboarding: "Formulario de Onboarding",
        chatbot: "Conversación con Chatbot",
        quick_form: "Quick Form Lead",
    }[source];

    try {
        // 1. Business notification email
        await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Catálogo de Procesos <onboarding@resend.dev>",
                to: ["david@immoral.es"],
                subject: `🚀 Nuevo lead (${sourceLabel}) - ${safeEmpresa}`,
                html: `
                    <h1>Nueva solicitud de lead</h1>
                    <p><strong>Origen:</strong> ${sourceLabel}</p>
                    <p><strong>Nombre:</strong> ${safeNombre}</p>
                    <p><strong>Email:</strong> ${safeEmail}</p>
                    <p><strong>Empresa:</strong> ${safeEmpresa}</p>
                    <p><strong>Teléfono:</strong> ${lead.telefono || "No provisto"}</p>
                    <br/>
                    ${extraContext ? `<h3>Información Adicional:</h3><div style="background:#f4f4f4;padding:15px;border-radius:8px;white-space:pre-wrap;">${extraContext}</div>` : ""}
                    <br/>
                    <p><strong>Comentario:</strong></p>
                    <p>${safeComentario || "Sin comentario adicional."}</p>
                `,
            }),
        });

        // 2. Client confirmation email
        await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Catálogo de Procesos <onboarding@resend.dev>",
                to: [lead.email],
                subject: "Hemos recibido tu solicitud de automatización",
                html: `
                    <h1>¡Hola, ${safeNombre}!</h1>
                    <p>Hemos recibido tu solicitud correctamente para <strong>${safeEmpresa}</strong>.</p>
                    <p>Nuestro equipo revisará tu caso y nos pondremos en contacto contigo en menos de 24 horas.</p>
                    <br/>
                    <p>¡Gracias por confiar en Immoralia!</p>
                `,
            }),
        });

        console.log(`Emails sent successfully for lead: ${lead.email}`);
    } catch (err) {
        console.error("Error sending emails:", err);
    }
}
