import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, redirectTo } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email requerido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verificar que el email pertenece a un partner activo
    const { data: partner } = await supabase
      .from("partners")
      .select("id, nombre")
      .eq("email", email)
      .eq("activo", true)
      .single();

    // Si no existe el partner, respondemos OK igualmente (no revelar si existe)
    if (!partner) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generar enlace de recovery via Supabase Admin API
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: redirectTo ?? `${SUPABASE_URL}/afiliado`,
      },
    });

    if (error || !data?.properties?.action_link) {
      throw new Error(error?.message ?? "No se pudo generar el enlace de recovery");
    }

    const resetLink = data.properties.action_link;

    // Enviar email via Resend
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Portal de Afiliados Immoralia <onboarding@resend.dev>",
        to: [email],
        subject: "Restablece tu contraseña — Portal de Afiliados",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;">
            <h2 style="color:#111;margin-bottom:8px;">Hola, ${partner.nombre}</h2>
            <p style="color:#444;line-height:1.6;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta
              en el <strong>Portal de Afiliados de Immoralia</strong>.
            </p>
            <p style="color:#444;line-height:1.6;">
              Haz clic en el botón para crear una nueva contraseña:
            </p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${resetLink}"
                style="display:inline-block;background:#6366f1;color:#fff;padding:14px 28px;
                       border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">
                Restablecer contraseña
              </a>
            </div>
            <p style="color:#888;font-size:13px;line-height:1.5;">
              Este enlace expira en <strong>1 hora</strong>.<br/>
              Si no solicitaste este cambio, puedes ignorar este email.
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
            <p style="color:#bbb;font-size:12px;">
              Immoral Group · procesos.immoralia.es
            </p>
          </div>
        `,
      }),
    });

    if (!resendRes.ok) {
      const resendError = await resendRes.text();
      throw new Error(`Resend error: ${resendError}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[reset-partner-password]", err);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
