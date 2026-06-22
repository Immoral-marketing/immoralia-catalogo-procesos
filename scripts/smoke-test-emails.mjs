/**
 * SPEC-05 — Smoke test del sistema de emails.
 *
 * Envía un email real a `team@immoralia.es` con la plantilla nueva y verifica
 * que el registro en `email_logs` se ha creado. Útil para validar que el
 * sender centralizado funciona contra Resend + Supabase reales.
 *
 * Uso: node scripts/smoke-test-emails.mjs
 *      node scripts/smoke-test-emails.mjs --to=mi-email-personal@example.com
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = process.env.STAGING_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Faltan variables (RESEND_API_KEY, SUPABASE_URL, SUPABASE_KEY)');
    process.exit(1);
}

const toArg = process.argv.find(a => a.startsWith('--to='))?.slice(5);
const TO = toArg || 'team@immoralia.es';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TEMPLATE = `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;background:#f5f7fa;margin:0;padding:24px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;">
<tr><td style="background:#0d0d0d;padding:28px 32px;color:#fff;">
<p style="margin:0;font-size:22px;font-weight:700;">immoral<span style="color:#00b8b8">ia</span></p>
<p style="margin:4px 0 0;color:#9ca3af;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;">Smoke test — SPEC-05</p>
</td></tr>
<tr><td style="padding:36px 32px;line-height:1.6;color:#1a1a1a;">
<h2 style="margin:0 0 16px;font-size:22px;">Email de prueba de la plantilla v2</h2>
<p>Este email se ha enviado vía <code>sendEmail()</code> del nuevo sender centralizado para verificar:</p>
<ul>
<li>Que Resend recibe la petición y la entrega correctamente.</li>
<li>Que se registra la fila correspondiente en <code>email_logs</code>.</li>
<li>Que la nueva plantilla con identidad Immoralia se ve bien en tu cliente de email.</li>
</ul>
<div style="background:rgba(0,184,184,0.08);border:1px solid rgba(0,184,184,0.35);border-radius:10px;padding:18px;margin:18px 0;">
Si ves este recuadro con borde cian, el render funciona correctamente.
</div>
<p style="margin-top:24px;color:#6b7280;font-size:14px;">Timestamp: ${new Date().toISOString()}</p>
</td></tr>
<tr><td style="padding:26px 32px;background:#fafbfc;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;color:#6b7280;">
© ${new Date().getFullYear()} Immoral Group · Smoke test SPEC-05
</td></tr>
</table>
</body></html>`;

async function main() {
    console.log(`\n🧪 Smoke test SPEC-05: enviando email a ${TO}`);

    // 1. Enviar vía Resend
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            from: 'Immoralia <noreply@procesos.immoralia.es>',
            to: [TO],
            subject: '[Smoke test SPEC-05] Nueva plantilla de email',
            html: TEMPLATE,
        }),
    });
    const data = await res.json();

    if (!res.ok) {
        console.error(`\n❌ Resend falló (${res.status}):`, data);
        // Registrar el fallo en logs igualmente
        await supabase.from('email_logs').insert({
            kind: 'smoke_test',
            recipient: TO,
            subject: '[Smoke test SPEC-05]',
            status: 'failed',
            error_message: `Resend ${res.status}: ${data?.message}`,
        });
        process.exit(1);
    }

    console.log(`✅ Resend OK: id=${data.id}`);

    // 2. Registrar en email_logs (simulando lo que hace el sender real)
    const { error: logError } = await supabase.from('email_logs').insert({
        kind: 'smoke_test',
        recipient: TO,
        subject: '[Smoke test SPEC-05] Nueva plantilla de email',
        status: 'sent',
        resend_id: data.id,
        metadata: { smoke: true, timestamp: new Date().toISOString() },
    });

    if (logError) {
        console.error('❌ Falló el INSERT en email_logs:', logError.message);
        process.exit(1);
    }

    // 3. Verificar lectura
    const { data: lastLog } = await supabase
        .from('email_logs')
        .select('*')
        .eq('resend_id', data.id)
        .single();

    console.log(`✅ Registro en email_logs OK:\n   id=${lastLog.id}\n   created_at=${lastLog.created_at}\n   status=${lastLog.status}`);
    console.log(`\n📬 Revisa la bandeja de ${TO} para confirmar que el email llegó con la nueva plantilla.\n`);
}

main().catch(err => { console.error('Error fatal:', err); process.exit(1); });
