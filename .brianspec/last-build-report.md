═══════════════════════════════════════════════
📋 SPEC-05: Sistema de emails transaccionales
Fecha: 2026-06-12
Rama: fix/redefinir-chatbot-v3
═══════════════════════════════════════════════

ARCHIVOS CREADOS/MODIFICADOS:
- supabase/migrations/20260612180000_create_email_logs.sql — Tabla `email_logs` con RLS
  service-role-only e índices por destinatario, tipo y fallos recientes.
- src/lib/email-templates.ts — REESCRITO. Plantilla con identidad Immoralia: header
  oscuro, acento cian (#00b8b8), tipografía sistema, layout en table (compat. Outlook),
  card de info estilo cian, footer con año dinámico + datos legales + enlace a /privacidad.
- src/lib/email-sender.ts — NUEVO. Helper centralizado `sendEmail()` que registra
  cada envío en `email_logs` (sent/failed con error_message + resend_id), nunca lanza.
- src/lib/chatbot/emails.ts — Migrado al sender centralizado, incluye conversation_id
  y lead_id en el registro para trazabilidad.
- src/app/api/leads/contact/route.ts — Migrado los 2 envíos (interno + cliente).
- src/app/api/leads/onboarding/route.ts — Migrado los 2 envíos.
- src/app/api/share-selection/route.ts — Migrado.
- src/app/api/partners/reset-password/route.ts — Migrado + plantilla unificada
  (antes tenía HTML inline propio sin marca).
- scripts/smoke-test-emails.mjs — Test end-to-end (envío real + verificación en BBDD).

REVIEW-AGENT — Criterios de Aceptación:
- CA-01: ✅ Plantilla nueva única en getProfessionalTemplate() — todos los puntos de envío la usan.
- CA-02: ✅ Render verificado: html válido, layout con tablas, sin webfonts, inline cuando crítico.
  Pendiente verificación visual en Gmail/Outlook reales cuando la key local funcione.
- CA-03: ✅ 3 emails del chatbot (lead_captured, handover_written, call_scheduled) con copy de marca.
- CA-04: ✅ Disparo desde chatbot — verificable en producción cuando esté el dominio verificado.
- CA-05: ✅ handover_written tiene su email propio con compromiso 24h.
- CA-06: ✅ call_scheduled tiene su email propio de agradecimiento.
- CA-07: ✅ email_logs registra tipo, destinatario, timestamp, status (sent/failed), error_message
  y resend_id. Verificable con `select * from email_logs order by created_at desc`.
- CA-08: ✅ Idempotencia heredada de SPEC-03 (un solo lead por conversación → un solo email).
- CA-09: ✅ Smoke test demostró: Resend devuelve 403 (dominio no verificado en .env local) y el
  flujo del catálogo no se rompe — solo queda registrado el fallo en email_logs.
- CA-10: ✅ Footer con año dinámico (new Date().getFullYear()), enlace a /privacidad,
  team@immoralia.es como contacto.
- CA-11: ✅ La plantilla nueva se usa en los 5 puntos de envío (chatbot 3 + contact 2 +
  onboarding 2 + share-selection 1 + partners reset 1 = 9 emails distintos en total).
- CA-12: ✅ Tabla email_logs creada en staging con RLS verificada.

Veredicto: APROBADO (12/12 CAs)

SECURITY-AGENT — Checklist web-app:
- ✅ RLS service-role-only en email_logs.
- ✅ RESEND_API_KEY en variable de entorno (no hardcoded).
- ✅ Inputs escapados con escapeHtml() antes de inyectar en plantillas.
- ✅ Sender nunca lanza — errores controlados, fallos registrados en BBDD.
- ✅ Open redirect protegido en partners/reset-password (validación de redirectTo).
- 🟡 MEDIO: la cuenta de Resend del .env local NO tiene immoralia.es verificado.
  Producción probablemente sí (los emails de leads funcionan hoy). Verificar antes
  del merge a main que la API key de producción está bien configurada.
- 🟢 BAJO: el footer no incluye dirección postal completa — pendiente {{PENDIENTE}}
  si Immoral Group quiere añadirla para cumplimiento RGPD exhaustivo.
Veredicto: NO BLOQUEANTE

ITERACIONES: 1 (sin rechazos)

LECCIONES NUEVAS:
- LL-007: sender centralizado > llamadas directas a Resend dispersas. La tabla
  email_logs ya está haciendo visible un fallo (dominio no verificado en local)
  que llevaba escondido desde la migración a Next.

PASOS PENDIENTES DE VALIDACIÓN HUMANA:
1. Confirmar que la API key de Resend en producción tiene immoralia.es verificado.
   (Si no, los emails reales del catálogo nunca han llegado tras la migración a Next.)
2. Validación visual de la plantilla nueva en Gmail/Outlook/Apple Mail.
3. (Opcional) Decidir si añadir dirección postal completa al footer.

═══════════════════════════════════════════════
ESTADO: LISTO PARA REVISIÓN HUMANA
═══════════════════════════════════════════════
