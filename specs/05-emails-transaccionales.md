# SPEC-05: Sistema de emails transaccionales

**Versión:** 1.2
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-12
**Owner:** David Navarrete

---

## Descripción

Crear el sistema de emails transaccionales del catálogo con criterio común: inventario de qué emails hacen falta, una plantilla HTML base con la identidad de Immoralia (reutilizable para cualquier email futuro) y el contenido de cada uno. Da servicio inmediato a los disparos del chatbot (SPEC-03) y deja la base para que cualquier email posterior del catálogo salga con la misma calidad y marca.

---

## Actores

- **Visitante / lead:** recibe los emails tras interactuar con el chatbot u otros puntos del catálogo.
- **Equipo Immoralia:** define tono y contenido; recibe copia interna donde aplique.
- **Sistema de envío (Resend):** entrega los emails.

---

## Flujos principales

### Flujo 1: Inventario y plantilla base

1. **Inventario** de los emails transaccionales activos hoy (5 puntos de envío):
   - Chatbot — 3 plantillas provisionales (SPEC-03): lead capturado, handover escrito, llamada agendada.
   - Formulario de contacto del catálogo (`/api/leads/contact`) — email al equipo + email al cliente.
   - Onboarding/quick form (`/api/leads/onboarding`) — email al equipo + email al cliente.
   - Share-selection (`/api/share-selection`) — email al destinatario que recibe la selección compartida.
   - Partners reset password (`/api/partners/reset-password`) — sin plantilla, refactorizar.
2. **Plantilla HTML base nueva** (`getProfessionalTemplate` reescrita, decisión owner v1.2):
   - Identidad Immoralia: header oscuro con el logo, acento cian, cuerpo blanco con detalles cian, footer con datos legales completos.
   - Compatible con clientes mayoritarios (sin fondo oscuro completo — los emails con `body{background:#000}` rompen en Outlook desktop y Gmail dark mode).
   - Año dinámico + dirección + enlace a política de privacidad en el footer.
3. **Migración completa** (decisión owner v1.2): los 5 puntos de envío usan la plantilla nueva. Mismo aspecto en cualquier email que reciba un visitante o partner.

### Flujo 2: Envío disparado por el chatbot

1. SPEC-03 dispara el evento correspondiente (lead capturado sin agenda / handover escrito / llamada agendada).
2. El backend compone el email con la plantilla base + el contenido del email correspondiente, personalizado con el nombre del lead.
3. El envío se registra en `email_logs` (qué email, a quién, cuándo, resultado).
4. Si el envío falla, se reintenta de forma limitada y el fallo queda registrado sin bloquear el flujo del chat.

### Flujo 3: Registro de envíos (auditoría)

1. Cada envío vía Resend (sea del chatbot, del formulario de contacto, del onboarding, del share-selection o del reset password de partners) deja una fila en la tabla `email_logs`.
2. La fila incluye: tipo de email, destinatario, lead_id/conversation_id si aplica, timestamp, resultado (success/error), error_message si falló.
3. Acceso solo con clave de servicio (RLS).
4. Consultable via MCP de Supabase para depurar rebotes, fallos o auditar envíos.

---

## Flujos alternativos / Edge cases

- **Email rebotado o inválido tras la captura:** el fallo queda registrado en el lead para que el equipo lo vea (el dato puede estar mal escrito).
- **Doble disparo del mismo evento:** idempotencia — un email por evento y lead.
- **Lead que agenda Y pide que le escriban:** recibe solo el email correspondiente al último evento relevante; no se le bombardea.
- **Visitante que escribe un email con alias/+ etiquetas:** se envía igualmente (formato válido).
- **Resend caído:** el flujo del chat no se bloquea; el envío queda en cola/registro de error para reintento.

---

## Criterios de aceptación

- [ ] CA-01: Existe una plantilla HTML base única con la identidad de Immoralia, usada por todos los emails del inventario.
- [ ] CA-02: La plantilla se renderiza correctamente en los clientes mayoritarios (Gmail web/móvil, Apple Mail, Outlook) sin roturas de layout.
- [ ] CA-03: Los tres emails de v3 (lead sin agenda, handover escrito, llamada agendada) existen con contenido aprobado y personalización por nombre.
- [ ] CA-04: El evento «lead capturado sin agendar» dispara su email correspondiente (verificable en staging con un envío real).
- [ ] CA-05: El evento «handover que me escribáis» dispara su email con el compromiso de 24 horas.
- [ ] CA-06: El evento «llamada agendada» dispara su email de agradecimiento.
- [ ] CA-07: Cada envío queda registrado (tipo, destinatario, timestamp, resultado) y es consultable en BBDD.
- [ ] CA-08: Un mismo evento no genera emails duplicados al mismo lead (idempotencia verificada).
- [ ] CA-09: Con el servicio de envío caído, el flujo del chatbot no se bloquea y el fallo queda registrado.
- [ ] CA-10: Todos los emails incluyen pie legal: año dinámico, identidad del remitente (Immoral Group), referencia a la política de privacidad (`/privacidad` del catálogo) y datos de contacto.
- [ ] CA-11: La plantilla nueva renderiza con la identidad Immoralia (acento cian) y se usa en los 5 puntos de envío (chatbot, contact, onboarding, share-selection, partners reset).
- [ ] CA-12: La tabla `email_logs` existe en Supabase staging con RLS service-role-only.

---

## Modelo de datos

### Entidades nuevas o modificadas

- **Registro de envíos:** tipo de email, lead/destinatario, conversación origen si aplica, timestamp, resultado, reintentos.

### Relaciones

- Registro de envíos N—1 Lead (cuando aplica).

### Migraciones necesarias

- Tabla de registro de envíos con RLS (acceso solo con clave de servicio).

---

## UI / Páginas afectadas

Ninguna página del catálogo. El entregable visual son los propios emails.

### Estándar de calidad visual

La plantilla sigue la identidad del catálogo (fondo oscuro o claro según legibilidad en email, acento cian, tipografía sobria). El email debe sentirse premium y humano, no automático. Aplicar el criterio de las skills de diseño del proyecto adaptado al medio email (restricciones de HTML de correo).

---

## API / Endpoints

### Endpoints nuevos

Ninguno público. Módulo interno de envío invocado por los flujos del backend (SPEC-03 y futuros).

### Contratos

El módulo de envío recibe: tipo de email, destinatario, datos de personalización. Devuelve resultado y registra el envío.

---

## Notas de seguridad

### Datos sensibles involucrados

- Nombre y email del lead.

### Validaciones server-side requeridas

- Formato del destinatario; tipo de email dentro del inventario permitido (no se envían contenidos arbitrarios).

### Autenticación y autorización

- La clave del servicio de envío vive en variables de entorno; el módulo solo es invocable desde el backend.

### Otros riesgos identificados

- **Abuso del disparo:** los eventos que disparan emails vienen de endpoints con rate limiting (SPEC-03).
- **Reputación de dominio:** verificar SPF/DKIM/DMARC del dominio remitente antes de activar en producción.
- Los logs no almacenan el contenido completo del email, solo metadatos.

---

## Plan de implementación

### Arquitectura propuesta

- **02-BACKEND-AGENT:** módulo de envío con registro, idempotencia y reintentos; integración con los eventos de SPEC-03.
- **01-FRONTEND-AGENT:** maquetación HTML de la plantilla base y los tres emails (HTML de email, no de app).
- **03-DATA-AGENT:** tabla de registro de envíos.

### Desglose de tareas

1. Inventariar emails v3 y auditar los existentes del catálogo.
2. Diseñar y maquetar la plantilla HTML base (con pruebas en clientes de correo).
3. Redactar y aprobar el contenido de los tres emails (tono Immoralia).
4. Crear la tabla de registro de envíos.
5. Implementar el módulo de envío con idempotencia y reintentos limitados.
6. Conectar los tres eventos de SPEC-03 a sus emails.
7. Verificar SPF/DKIM/DMARC del dominio remitente.
8. Pruebas de envío real en staging y validación visual.

### Dependencias con otras specs

- Los disparos vienen de SPEC-03. La plantilla base es reutilizable por cualquier email futuro del catálogo (afiliados, auditorías...).

---

## Tests requeridos

### Tests unitarios

- Idempotencia del módulo de envío.
- Validación de tipos de email permitidos.

### Tests de integración

- Envío real en staging por cada evento, con registro verificado.
- Simulación de fallo del servicio de envío.

### Tests E2E

- Recorrido completo desde el chat: captura → email recibido en buzón de prueba.

---

## Out of scope (explícito)

- Emails de marketing o secuencias de nurturing (esto es transaccional puro).
- Migración inmediata de todos los emails existentes del catálogo a la plantilla nueva (se decide en el inventario; puede ser fase posterior).
- Editor de plantillas o gestión de emails desde panel.
- Tracking de apertura/clics (evaluar más adelante).

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-12 | Versión inicial generada desde entrevista de spec | David Navarrete |
| 1.1 | 2026-06-12 | Iteración: plantilla con identidad Immoralia (cian, no fondo oscuro completo), migración completa de los 5 puntos de envío, tabla email_logs con RLS, footer con año dinámico + datos legales. +2 CAs (11-12) | David Navarrete |
| 1.2 | 2026-06-12 | Spec aprobada para implementación | David Navarrete |
