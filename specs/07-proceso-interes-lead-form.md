# SPEC-07: Proceso de interés al lead form

**Versión:** 1.0
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-15
**Owner:** David Navarrete

---

## Descripción

Cuando el visitante rellena el formulario de captación de lead dentro del chat, el backend extrae los procesos del catálogo que se recomendaron durante esa conversación y los adjunta como campo de contexto al lead que llega al equipo comercial (ClickUp, GHL). El objetivo es que el comercial sepa exactamente qué automatización le interesaba al lead antes de llamarle, sin tener que leer toda la transcripción.

---

## Actores

- **Visitante anónimo:** rellena el formulario de lead sin notar ningún cambio en la UI.
- **Backend:** extrae los slugs de procesos recomendados del historial persistido de la conversación y los adjunta al payload del lead.
- **Equipo comercial Immoralia:** recibe el lead en ClickUp y GHL con el campo "procesos de interés" visible, y puede empezar la llamada por ahí.

---

## Flujos principales

### Flujo 1: Lead con procesos de interés

1. El visitante conversa con el chatbot. El bot le recomienda uno o más procesos (slugs enlazados, persistidos en `chat_messages.recommended_slugs`).
2. El trigger semántico o el límite duro activa el formulario de lead.
3. El visitante rellena nombre + email y marca el checkbox RGPD.
4. El backend (`POST /api/chatbot/lead`) recibe el `conversationId`.
5. El backend consulta el historial de la conversación y:
   - Agrega **todos los slugs únicos** de `recommended_slugs` de los mensajes del bot.
   - Identifica el **slug principal**: el más reciente (último mensaje del bot que contenía al menos un slug recomendado antes del trigger del formulario).
6. El campo `interested_process_slugs` (todos) y `primary_interested_slug` (el principal) se persisten en la BBDD junto al lead.
7. En ClickUp la descripción incluye: "Procesos de interés: [slug1, slug2] | Principal: [last-slug]".
8. El webhook de GHL incluye `chatbot_interested_slugs` (lista separada por comas) y `chatbot_primary_slug`.
9. El resto del circuito de lead (Slack, email) no cambia.

### Flujo 2: Lead sin procesos de interés

1. El visitante envía el formulario sin que el bot haya recomendado ningún proceso (conversación muy breve o conceptual).
2. El campo `procesos_interes` llega vacío (array vacío / null).
3. El circuito externo funciona exactamente igual; en ClickUp aparece "Procesos de interés: ninguno todavía".

---

## Flujos alternativos / Edge cases

- **Bot recomienda proceso en la misma respuesta que lanza el formulario:** el slug de esa respuesta puede que aún no esté persistido cuando llega el POST de captura. El backend extrae slugs del historial hasta el mensaje inmediatamente anterior al trigger; si llega ese caso, el slug se pierde en esta versión (no bloquea la captura).
- **Conversación reanudada días después con lead ya capturado:** la idempotencia de SPEC-03 sigue aplica; si ya hay lead, se devuelve `alreadyCaptured: true` sin re-enviar datos.
- **Slug de un proceso eliminado del catálogo:** se envía igualmente el slug como string (no se valida existencia en catálogo en el momento de la captura).

---

## Criterios de aceptación

- [ ] CA-01: El endpoint `POST /api/chatbot/lead` extrae todos los slugs únicos de `recommended_slugs` del historial de la conversación antes de registrar el lead.
- [ ] CA-02: El backend identifica el "slug principal" como el del mensaje del bot más reciente que contiene al menos un slug recomendado.
- [ ] CA-03: Los campos `interested_process_slugs text[]` (todos) y `primary_interested_slug text` (el principal o null si no hay ninguno) se persisten en la BBDD en `contact_submissions`.
- [ ] CA-04: La descripción de la tarea de ClickUp incluye una sección "Procesos de interés" con todos los slugs y el principal marcado explícitamente, o "ninguno todavía" si el array está vacío.
- [ ] CA-05: El webhook de GHL incluye `chatbot_interested_slugs` (string con slugs separados por coma) y `chatbot_primary_slug` (el principal o cadena vacía).
- [ ] CA-06: Si no hay slugs recomendados, ambos campos llegan vacíos/null y el circuito externo no rompe (ClickUp crea la tarea igualmente, GHL recibe el webhook igualmente).
- [ ] CA-07: Los slugs se extraen del historial persistido en BBDD, nunca del payload que envía el frontend (el cliente no puede inyectar slugs falsos).
- [ ] CA-08: El Slack de notificación del lead no requiere cambios (mantener formato actual).

---

## Modelo de datos

### Entidades modificadas

- **`contact_submissions`** (lead table): añadir dos columnas: `interested_process_slugs text[] DEFAULT '{}'` y `primary_interested_slug text DEFAULT NULL`.
- **`chat_conversations`**: sin cambios (los slugs ya están en `chat_messages.recommended_slugs`).

### Migraciones necesarias

- `ALTER TABLE contact_submissions ADD COLUMN interested_process_slugs text[] DEFAULT '{}';`
- `ALTER TABLE contact_submissions ADD COLUMN primary_interested_slug text DEFAULT NULL;`

---

## API / Endpoints

### Endpoints modificados

| Método | Ruta | Cambio |
|---|---|---|
| POST | `/api/chatbot/lead` | Extrae slugs del historial y los incluye en el payload de sistemas externos y en el insert de BBDD |

### Contratos de request/response

Sin cambios en el body del request del frontend. El campo `interested_process_slugs` es un detalle interno del backend.

---

## UI / Páginas afectadas

Ninguna. El cambio es invisible para el visitante.

---

## Notas de seguridad

- Los slugs se extraen del historial en BBDD, no del payload del frontend → no hay superficie de inyección.
- Sin nuevas rutas públicas ni datos de usuario nuevos → sin impacto en RGPD.
- El campo viaja a GHL vía webhook existente → misma política de datos que el resto de campos de la conversación.

---

## Plan de implementación

### Agentes

- **02-BACKEND-AGENT:** modificar `POST /api/chatbot/lead` para extraer slugs y enriquecer el payload de sistemas externos + el insert en BBDD.
- **03-DATA-AGENT:** migración para añadir `interested_process_slugs` a `contact_submissions`.

### Desglose de tareas

1. Migrar BBDD: columna `interested_process_slugs text[]` en `contact_submissions`.
2. En `buildContextSummary` (o función nueva), agregar slugs únicos del historial.
3. Añadir sección "Procesos de interés" en la descripción de ClickUp.
4. Añadir campo `chatbot_interested_slugs` al payload del webhook de GHL.
5. Persistir `interested_process_slugs` en el insert de `contact_submissions`.
6. Verificar en staging: lead con procesos recomendados + lead sin procesos.

### Dependencias

- SPEC-03 (captura de leads — ya implementada). No requiere otras specs activas.

---

## Tests requeridos

### Tests de integración (staging)

- Lead con conversación que tiene 2+ procesos recomendados: verificar que el campo aparece en ClickUp y GHL.
- Lead con conversación sin procesos recomendados: verificar que el campo aparece vacío y el circuito no rompe.

---

## Out of scope (explícito)

- Que el visitante seleccione o priorice procesos antes de enviar el formulario (no hay UI nueva).
- Scoring automático del lead según los procesos de interés.
- Validar si los slugs siguen activos en el catálogo en el momento de la captura.
- Cambios en la notificación de Slack.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-15 | Versión inicial en modo creación | David Navarrete |
| 1.1 | 2026-06-15 | Decisión: todos los slugs + último como principal. Spec aprobada para implementación | David Navarrete |
