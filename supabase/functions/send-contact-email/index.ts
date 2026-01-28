import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Zod validation schemas
const ProcessSchema = z.object({
  id: z.string().max(50),
  codigo: z.string().max(20),
  nombre: z.string().max(200),
  categoriaNombre: z.string().max(100),
  tagline: z.string().max(500),
});

const ContactRequestSchema = z.object({
  nombre: z.string().trim().min(2, "Nombre muy corto").max(100, "Nombre muy largo"),
  email: z.string().trim().email("Email inválido").max(255),
  empresa: z.string().trim().min(2, "Empresa muy corta").max(200, "Empresa muy larga"),
  comentario: z.string().max(2000, "Comentario muy largo").default(""),
  selectedProcesses: z
    .array(ProcessSchema)
    .min(1, "Selecciona al menos un proceso")
    .max(50, "Demasiados procesos seleccionados"),
});

// HTML escape function to prevent injection
function escapeHtml(text: string): string {
  return text
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

    const { nombre, email, empresa, comentario, selectedProcesses } = validationResult.data;

    console.log("Sending contact email for:", {
      nombre: escapeHtml(nombre),
      email: escapeHtml(email),
      empresa: escapeHtml(empresa),
      processCount: selectedProcesses.length,
    });

    // Create processes list HTML with escaped content
    const processesListHTML = selectedProcesses
      .map(
        (process) => `
      <div style="margin: 10px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
        <strong>${escapeHtml(process.codigo)} - ${escapeHtml(process.nombre)}</strong><br/>
        <span style="color: #666; font-size: 12px;">${escapeHtml(process.categoriaNombre)}</span><br/>
        <em style="color: #888; font-size: 13px;">${escapeHtml(process.tagline)}</em>
      </div>
    `
      )
      .join("");

    // Calculate estimated price
    const processCount = selectedProcesses.length;
    let estimatedPrice = "A medida";
    if (processCount <= 3) estimatedPrice = "4.000€";
    else if (processCount <= 5) estimatedPrice = "6.000€";
    else if (processCount <= 10) estimatedPrice = "10.000€";
    else if (processCount <= 15) estimatedPrice = "13.000€";

    // Escape user inputs for email content
    const safeNombre = escapeHtml(nombre);
    const safeEmail = escapeHtml(email);
    const safeEmpresa = escapeHtml(empresa);
    const safeComentario = escapeHtml(comentario);

    // Send email to the business (you) using Resend API
    const businessEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Immoralia <noreply@send.immoralia.es>",
        to: ["marco@immoral.marketing"],
        subject: `Nueva solicitud de automatización - ${safeEmpresa}`,
        html: `
          <h1 style="color: #333;">Nueva solicitud de propuesta</h1>
          
          <h2 style="color: #666;">Datos del contacto:</h2>
          <p><strong>Nombre:</strong> ${safeNombre}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Empresa:</strong> ${safeEmpresa}</p>
          
          <h2 style="color: #666;">Procesos seleccionados (${selectedProcesses.length}):</h2>
          <p><strong>Estimación:</strong> ${estimatedPrice}</p>
          ${processesListHTML}
          
          ${
            safeComentario
              ? `
            <h2 style="color: #666;">Comentario adicional:</h2>
            <p style="padding: 10px; background-color: #f9f9f9; border-left: 3px solid #0066cc;">${safeComentario}</p>
          `
              : ""
          }
          
          <p style="margin-top: 30px; color: #888; font-size: 12px;">
            Este email fue generado automáticamente desde el catálogo de procesos de Immoralia Admin.
          </p>
        `,
      }),
    });

    if (!businessEmailResponse.ok) {
      const error = await businessEmailResponse.text();
      throw new Error(`Failed to send business email: ${error}`);
    }

    // Send confirmation email to the client (using validated email)
    const clientEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Immoralia <noreply@send.immoralia.es>",
        to: [email], // Use the validated email directly
        subject: "Hemos recibido tu solicitud de automatización",
        html: `
          <h1 style="color: #333;">¡Gracias por tu interés, ${safeNombre}!</h1>
          
          <p>Hemos recibido tu solicitud de automatización para <strong>${safeEmpresa}</strong>.</p>
          
          <h2 style="color: #666;">Procesos que seleccionaste (${selectedProcesses.length}):</h2>
          ${processesListHTML}
          
          <p><strong>Estimación orientativa:</strong> ${estimatedPrice}</p>
          
          <p style="margin-top: 20px;">
            Nos pondremos en contacto contigo pronto para diseñar tu proyecto de automatización personalizado.
          </p>
          
          <p style="margin-top: 30px;">
            Saludos,<br>
            <strong>El equipo de Immoralia Admin</strong>
          </p>
          
          <p style="margin-top: 30px; color: #888; font-size: 12px;">
            Si no solicitaste esta información, puedes ignorar este email.
          </p>
        `,
      }),
    });

    if (!clientEmailResponse.ok) {
      const error = await clientEmailResponse.text();
      throw new Error(`Failed to send client email: ${error}`);
    }

    const businessEmailData = await businessEmailResponse.json();
    const clientEmailData = await clientEmailResponse.json();

    console.log("Emails sent successfully:", { businessEmailData, clientEmailData });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-contact-email function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
