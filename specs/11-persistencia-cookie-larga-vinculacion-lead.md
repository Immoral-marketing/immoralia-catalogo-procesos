# SPEC-11: Persistencia extendida del visitante con cookie de larga duración + vinculación de histórico al lead

**Versión:** 1.2
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-17
**Owner:** David Navarrete

---

## Descripción

Hoy el identificador de conversación del chatbot vive en `localStorage` con rolling de 7 días. Si un visitante vuelve al sitio pasada una semana, empieza una conversación nueva en blanco — el bot no recuerda nada de lo que ya hablaron. Esto rompe el reconocimiento de visitantes recurrentes que toman semanas en decidir.

Esta spec sustituye el `localStorage` por una **cookie funcional de larga duración** (90 días renovables) que persiste el identificador del visitante entre visitas, y crea una entidad nueva `chatbot_visitors` que agrupa todas las conversaciones del mismo visitante. Cuando el visitante decide finalmente dejar sus datos, todas las conversaciones previas asociadas a esa cookie quedan vinculadas al contacto que se crea en GHL, dándole al equipo comercial el histórico completo del visitante en custom fields enriquecidos.

Decisión post-reunión 16/06/2026: queremos memoria larga del visitante anónimo, no solo de la sesión.

---

## Actores

- **Visitante anónimo:** vuelve al sitio múltiples veces a lo largo de semanas. El chatbot lo reconoce y arranca nueva conversación con contexto del visitante.
- **Visitante identificado (lead):** el momento en que deja sus datos, todo su histórico anterior se asocia a su contacto en el CRM.
- **Equipo comercial:** recibe en GHL custom fields enriquecidos con el contexto de visita del lead (primera visita, número de conversaciones, histórico consolidado). En ClickUp, la tarea sigue creándose como hoy (sin cambios).
- **Cumplimiento RGPD:** la cookie es funcional/necesaria, no requiere consentimiento previo según dictamen AEPD.

---

## Flujos principales

### Flujo 1: Primer contacto de un visitante

1. El visitante entra por primera vez al sitio.
2. Al abrir el chatbot por primera vez, el navegador no tiene cookie del catálogo.
3. Cuando envía su primer mensaje, el backend crea un visitante nuevo en `chatbot_visitors` y una conversación vinculada a él.
4. La respuesta incluye una cookie HttpOnly + Secure + SameSite=Lax con el `visitor_id`, duración 90 días.

### Flujo 2: Visitante recurrente dentro de la misma semana

1. El visitante vuelve al sitio dentro de los 7 días desde su última actividad.
2. El navegador envía la cookie con el `visitor_id`.
3. El backend lee la cookie, recupera el visitante y su conversación vigente, y reanuda en el mismo hilo.
4. La cookie se renueva por otros 90 días.

### Flujo 3: Visitante recurrente tras más de 7 días pero menos de 90

1. El visitante vuelve después de 7+ días sin actividad. Su cookie sigue activa.
2. El backend lee la cookie, recupera el visitante. La última conversación está caducada (rolling 7 días).
3. Se arranca una conversación **nueva vinculada al mismo visitante**. La conversación anterior queda archivada.
4. El bot recibe en el system prompt el contexto estructurado del visitante (sector ya conocido, dolores capturados antes, último nivel de interés).
5. El chat muestra un **mensaje de bienvenida personalizado** del tipo: "¡Bienvenido de vuelta! La última vez vimos [tema X]. ¿Qué te trae hoy?". No carga la transcripción previa.
6. La cookie se renueva por otros 90 días.

### Flujo 4: Visitante deja sus datos finalmente

1. En cualquier conversación de cualquier visita, el visitante completa el formulario de captura.
2. Se crea el lead en `contact_submissions` con el `visitor_id` guardado.
3. **Todos los visitantes vinculados a leads con el mismo email se fusionan al mismo `lead_id`** (caso multi-dispositivo o re-captura).
4. El payload a GHL incluye custom fields nuevos:
   - `chatbot_visitor_first_seen_at`: timestamp de la primera visita.
   - `chatbot_visitor_conversation_count`: número de conversaciones del visitante.
   - `chatbot_visitor_history`: texto consolidado con resumen de todas las conversaciones del visitante (no solo la actual).
   - `chatbot_summary`: resumen de la conversación actual **sin límite de 500 chars** (hasta ahora estaba recortado).
5. ClickUp recibe la tarea **exactamente como hoy**, sin cambios.

### Flujo 5: Cookie expirada o ausente

1. El visitante vuelve después de más de 90 días sin actividad. La cookie ya no existe.
2. Se crea un visitante nuevo desde cero, conversación nueva.
3. El histórico antiguo permanece en BBDD sin vínculo automático (consultable internamente como histórico huérfano).

---

## Flujos alternativos / Edge cases

- **Cookie corrupta o con id inexistente:** se trata como visitante nuevo. Se crea uno nuevo y se actualiza la cookie. Sin error visible.
- **Mismo visitante en dos dispositivos:** son dos cookies distintas → dos visitantes distintos en `chatbot_visitors`. Al dejar el mismo email en cualquiera, ambos visitantes se vinculan al mismo `lead_id` (fusión).
- **Visitante borra cookies del navegador:** queda como visitante nuevo en próxima visita. Histórico anterior queda en BBDD sin vínculo automático.
- **Visitante con bloqueador de cookies / cookies de terceros:** la cookie es first-party, no debería bloquearse. Si el navegador la bloquea de todas formas, equivale a visitante nuevo en cada sesión (degradación silenciosa).
- **El backend recibe peticiones sin cookie pero con `conversationId` en el body:** el `conversationId` manda. Si la conversación existe y pertenece a un visitor, se renueva la cookie. Retrocompat.
- **Backfill de conversaciones legacy:** **NO aplica** — se borran todas las conversaciones existentes antes de aplicar la migración (decisión owner, datos eran pruebas). Las 16 conversaciones sintéticas se pueden regenerar con el script existente.

---

## Criterios de aceptación

- [ ] CA-01: Al primer mensaje de un visitante nuevo, la respuesta del backend incluye un `Set-Cookie` con atributos `HttpOnly`, `Secure`, `SameSite=Lax`, `Max-Age=7776000` (90 días) y `Path=/`.
- [ ] CA-02: Un visitante que vuelve dentro de los 7 días retoma su conversación vigente sin necesidad de identificarse.
- [ ] CA-03: Un visitante que vuelve entre 7 y 90 días arranca **conversación nueva vinculada al mismo `visitor_id`** y el chat muestra un mensaje de bienvenida personalizado generado por el bot con contexto del visitante (sector, último tema visto).
- [ ] CA-04: La cookie se renueva por 90 días en cada respuesta del backend al visitante.
- [ ] CA-05: Una cookie con `visitor_id` inválido no rompe la experiencia: se crea visitante nuevo y se actualiza la cookie.
- [ ] CA-06: Al capturar un lead, si ya existe otro `chatbot_visitor` vinculado a un `lead_id` con el mismo email, ambos visitantes quedan vinculados al mismo `lead_id`.
- [ ] CA-07: El payload del webhook a GHL al capturar el lead incluye los custom fields nuevos: `chatbot_visitor_first_seen_at`, `chatbot_visitor_conversation_count`, `chatbot_visitor_history`, y el `chatbot_summary` sin recorte de 500 chars.
- [ ] CA-08: La tarea de ClickUp del lead se crea exactamente con el mismo formato y contenido que antes de esta spec (sin cambios visibles).
- [ ] CA-09: Antes de aplicar la migración, todas las conversaciones existentes en `chatbot_conversations` y `chatbot_messages` quedan eliminadas (limpieza explícita en migración).
- [ ] CA-10: La página `/privacidad` se actualiza con una entrada que menciona la cookie funcional del chatbot, su finalidad y duración.
- [ ] CA-11: No se introduce cookie banner — la cookie es funcional/necesaria según RGPD.

---

## Modelo de datos

### Entidades nuevas

**Tabla `chatbot_visitors`:**
- `id uuid PK` (el que viaja en la cookie).
- `created_at timestamptz NOT NULL DEFAULT now()`.
- `last_seen_at timestamptz NOT NULL DEFAULT now()`.
- `lead_id uuid REFERENCES contact_submissions(id) ON DELETE SET NULL` (nullable).
- `conversation_count int NOT NULL DEFAULT 0` (denormalizado, contador para enviar a GHL).

### Entidades modificadas

**Tabla `chatbot_conversations`:**
- Nueva columna `visitor_id uuid REFERENCES chatbot_visitors(id) ON DELETE CASCADE NOT NULL`.

### Migraciones necesarias

1. `DELETE FROM chatbot_messages` (limpieza previa por borrado total acordado).
2. `DELETE FROM chatbot_conversations`.
3. `CREATE TABLE chatbot_visitors (...)`.
4. `ALTER TABLE chatbot_conversations ADD COLUMN visitor_id uuid REFERENCES chatbot_visitors(id) ON DELETE CASCADE NOT NULL`.

### Caducidad

- **`chatbot_conversations`:** rolling 7 días (sin cambios).
- **`chatbot_visitors`:** sin caducidad en BBDD. La cookie es lo que caduca a 90 días client-side.

---

## UI / Páginas afectadas

- **Componente del chatbot:** ya no escribe `localStorage`. El `visitor_id` viaja en cookie HttpOnly (el cliente no la lee). El `conversationId` actual sí queda en memoria del cliente para la sesión.
- **Mensaje de bienvenida del bot:** cuando se detecta visitante recurrente con conversación nueva, el primer mensaje del bot debe ser personalizado con contexto.
- **Página `/privacidad`:** añadir entrada describiendo la cookie funcional del chatbot.

---

## Backend / API afectada

- **Endpoint principal del chatbot:** lee la cookie en cada petición, resuelve el visitante, crea nueva conversación si la última caducó, vincula al visitor, devuelve `Set-Cookie` renovado.
- **Endpoint de captura de lead:** al capturar, hace upsert del `chatbot_visitor` actual + busca y fusiona visitantes con leads del mismo email.
- **Endpoint de historial:** devuelve el histórico de la conversación actual + opcionalmente metadatos del visitante para componer el mensaje de bienvenida.

---

## Integraciones externas afectadas

- **CRM — GHL:** custom fields nuevos en el payload del webhook:
  - `chatbot_visitor_first_seen_at` (ISO timestamp).
  - `chatbot_visitor_conversation_count` (entero).
  - `chatbot_visitor_history` (texto consolidado con resúmenes estructurados de todas las conversaciones del visitante, separados por fechas).
  - `chatbot_summary` (ya existe — se elimina el límite de 500 chars).
- **ClickUp:** **sin cambios.** La tarea sigue creándose con el mismo formato actual.

---

## Seguridad y privacidad

### Atributos de la cookie

- `HttpOnly`: sí (el cliente JS no la lee).
- `Secure`: sí (solo HTTPS).
- `SameSite=Lax`: permite navegación cross-site normal (visitante llega de LinkedIn/buscador).
- `Max-Age`: 90 días (7776000 segundos).
- `Path`: `/`.
- `Domain`: dominio raíz del catálogo (no subdominio específico).

### RGPD

- **Cookie funcional/estrictamente necesaria**: no requiere consentimiento previo según dictamen AEPD (la cookie es indispensable para que el chatbot recuerde el hilo del visitante).
- Se añade una entrada en `/privacidad` describiendo la cookie, su finalidad y duración. Sin cookie banner.

### Protección contra manipulación

- El `visitor_id` es UUID v4 (impredecible).
- `HttpOnly` mitiga robo vía XSS.
- Cookie firmada no necesaria en esta fase (un atacante que adivine un UUID v4 válido tiene probabilidad ínfima; el riesgo no justifica complejidad adicional).

---

## Out of scope

- Fusión heurística de visitantes ("este visitante con cookie B parece la misma persona que la cookie A perdida"). Solo se fusiona al capturar lead con email igual.
- Migración / preservación de conversaciones legacy (se borran).
- Cambiar la caducidad de la conversación (sigue rolling 7 días).
- Implementar panel admin para ver visitantes anónimos (consulta vía Supabase MCP por ahora).
- Cumplimiento extendido más allá del RGPD (CCPA, LGPD, etc.).
- Cookie banner / consentimiento explícito.
- Cambios en la tarea de ClickUp del lead.

---

## Plan de implementación (orientativo, no normativo)

1. Aplicar limpieza de conversaciones existentes (DELETE total).
2. Crear tabla `chatbot_visitors` + columna `visitor_id` en `chatbot_conversations`. Regenerar tipos.
3. Implementar lectura/escritura de cookie en el endpoint principal del chatbot.
4. Sustituir `localStorage` por dependencia de cookie en el cliente (mantener fallback de transición opcional).
5. Implementar lógica de "visitante recurrente tras 7+ días" → nueva conversación + mensaje de bienvenida personalizado generado por el bot en su primer turno.
6. Actualizar el endpoint de captura de lead: vincular visitor + fusionar visitantes con mismo email.
7. Añadir los 3 custom fields nuevos al payload GHL + eliminar el recorte de 500 chars en `chatbot_summary`.
8. Actualizar la página `/privacidad` con la entrada de cookie funcional.
9. Validar en staging end-to-end: visitante nuevo → conversación → cerrar navegador → volver 8 días después → debe arrancar conversación nueva pero con saludo personalizado → deja datos → GHL recibe los 3 custom fields nuevos + summary completo, ClickUp recibe la tarea como hoy.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-17 | Creación inicial — modo creación brianspec-spec | Claude (en sesión con David) |
| 1.1 | 2026-06-17 | Resueltas 8 ambigüedades: tabla nueva chatbot_visitors, cookie funcional sin consentimiento, HttpOnly+Secure+SameSite=Lax, fusión visitantes por email, borrar conversaciones legacy, visitante recurrente arranca conversación nueva con bienvenida personalizada, GHL recibe histórico consolidado + metadatos, ClickUp sin cambios | Claude (en sesión con David) |
| 1.2 | 2026-06-17 | Spec aprobada para implementación | David Navarrete |
