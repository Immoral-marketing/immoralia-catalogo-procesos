# SPEC-03: Captura de leads y handover dentro del chat

**Versión:** 1.2
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-12
**Owner:** David Navarrete

---

## Descripción

Convertir el chatbot en un canal de captación sin fricción: un formulario embebido en la propia conversación (nombre + email, con consentimiento RGPD) que aparece en el momento adecuado, ofrece agendar una llamada tras la captura y gestiona la petición de hablar con una persona. Cada lead entra por el circuito comercial existente (BBDD + Slack + ClickUp + GHL) con origen «chatbot» y queda vinculado a su conversación.

---

## Actores

- **Visitante anónimo:** entrega sus datos dentro del chat, agenda llamada o pide que le escriban.
- **Equipo comercial Immoralia:** recibe el lead por los canales habituales y puede leer la conversación vinculada para llegar con contexto.
- **Chatbot:** decide el momento de ofrecer el formulario y conduce el post-captura.

---

## Flujos principales

### Flujo 1: Aparición del formulario (trigger híbrido)

1. Durante la conversación, el formulario embebido se ofrece cuando ocurre lo primero de:
   - **Trigger semántico:** el bot detecta interés claro (pregunta por precios, implementación, plazos, "me interesa", "quiero que me contactéis"...).
   - **Límite duro:** el visitante completa su 5º turno sin que el trigger semántico haya saltado.
2. El formulario aparece como un mensaje más dentro del hilo: campos nombre y email, checkbox obligatorio de aceptación de la política de privacidad (con enlace) y botón de envío.
3. El formulario lleva una X visible para cerrarlo sin fricción.

### Flujo 2: Captura del lead

1. El visitante rellena nombre + email y marca el checkbox.
2. El backend valida los datos y registra el lead con origen «chatbot», vinculado al identificador de conversación.
3. El lead entra al circuito existente: registro en BBDD, notificación en Slack, tarea en el pipeline de ClickUp y contacto/oportunidad en GHL (reutilizando la lógica y variables de entorno ya operativas, con el naming unificado por origen).
   - **Slack:** notificación simple (lead nuevo + datos básicos + origen chatbot).
   - **ClickUp:** la descripción de la tarea incluye un **resumen del contexto del cliente** (quién es, qué buscaba, qué dolores contó, qué se le recomendó — derivado del resumen acumulado de la conversación) **+ los últimos mensajes literales** del hilo.
4. La conversación queda marcada como «lead capturado».
5. El bot agradece y ofrece el siguiente paso (Flujo 3).

### Flujo 3: Post-captura — ofrecer agendar

1. Tras la captura, el bot muestra dos botones: **«Sí, agendar llamada»** y **«No»**.
2. Si elige agendar: se abre el calendario de GHL; al completar la reserva, el bot agradece y le indica que recibirá un email con la convocatoria (los recordatorios posteriores los gestiona GHL). La conversación queda marcada como «llamada agendada» y continúa abierta.
3. Si elige «No»: el bot lo acepta con naturalidad y la conversación continúa. Se dispara el email de agradecimiento con compromiso de contacto en 24 horas (plantilla de SPEC-05).

### Flujo 4: Handover — el visitante pide hablar con una persona

1. El visitante pide explícitamente hablar con alguien.
2. El bot ofrece dos botones: **«Agendar llamada»** y **«Que me escribáis»**.
3. «Agendar llamada» → abre directamente el calendario de GHL embebido, que captura nombre y email dentro de su propio widget. No se muestra el formulario propio del chat (decisión owner v1.3 — evita doble captura redundante).
4. «Que me escribáis» → solo si aún no hay datos, se muestra el formulario embebido del chat (sin email no podemos escribir). El lead se marca como «pide contacto humano» (prioritario en Slack y ClickUp) y el bot se compromete a contacto en menos de 24 horas. Se dispara el email de agradecimiento correspondiente (SPEC-05).

---

## Flujos alternativos / Edge cases

- **El visitante cierra el formulario con la X:** el límite duro queda consumido; el formulario solo reaparece por trigger semántico o petición explícita. El cierre queda registrado como metadato de la conversación.
- **Lead ya capturado en la conversación:** el formulario no vuelve a mostrarse nunca en esa conversación (ni por semántico ni por límite); los flujos de agendar/handover usan los datos ya entregados.
- **Email con formato inválido:** validación en cliente y en servidor con mensaje claro; no se envía nada a los sistemas externos.
- **Checkbox RGPD sin marcar:** el botón de envío queda deshabilitado; nunca se procesa un envío sin consentimiento.
- **Fallo de un sistema externo (Slack, ClickUp o GHL caídos):** el lead SIEMPRE queda registrado en BBDD; los envíos a sistemas externos fallidos se registran como pendientes/error y se notifica internamente. El visitante nunca ve el fallo: para él la captura fue correcta.
- **Doble envío (doble clic):** idempotencia — un solo lead por conversación.
- **El visitante escribe sus datos en el chat en texto libre en lugar de usar el formulario:** el bot le pide amablemente usar el formulario (no se extraen datos personales del texto libre de forma silenciosa).
- **Conversación retomada días después con lead ya capturado:** el estado persiste; no se vuelve a pedir datos.

---

## Criterios de aceptación

- [ ] CA-01: El formulario aparece embebido en el hilo cuando el bot detecta interés claro de contacto/compra (trigger semántico).
- [ ] CA-02: Si el trigger semántico no ha saltado, el formulario aparece tras el 5º turno del usuario.
- [ ] CA-03: El formulario tiene nombre, email, checkbox RGPD obligatorio con enlace a la política de privacidad y X de cierre.
- [ ] CA-04: Con el checkbox sin marcar, el envío está bloqueado.
- [ ] CA-05: Cerrado con la X, el formulario no reaparece por límite de turnos; solo por trigger semántico o petición del visitante.
- [ ] CA-06: Un envío válido crea el lead en BBDD vinculado a la conversación, con origen «chatbot».
- [ ] CA-07: Un envío válido genera notificación en Slack, tarea en el pipeline de ClickUp y contacto/oportunidad en GHL (verificable en los tres sistemas en staging).
- [ ] CA-08: Tras la captura, el bot muestra los botones «Sí, agendar llamada» / «No», y la conversación continúa en ambos casos (nunca se cierra).
- [ ] CA-09: «Sí, agendar llamada» abre el calendario de GHL; una reserva completada marca la conversación como «llamada agendada».
- [ ] CA-10: Cuando el visitante pide hablar con una persona, el bot ofrece «Agendar llamada» / «Que me escribáis»; si no hay datos aún, primero aparece el formulario.
- [ ] CA-11: «Que me escribáis» marca el lead como prioritario («pide contacto humano») visible en Slack y ClickUp.
- [ ] CA-12: Con lead ya capturado, el formulario no vuelve a aparecer en esa conversación (incluida una reanudación días después).
- [ ] CA-13: Si Slack, ClickUp o GHL fallan, el lead queda en BBDD, el fallo queda registrado y el visitante ve la captura como exitosa.
- [ ] CA-14: Un doble envío no genera leads duplicados (un lead por conversación).
- [ ] CA-15: Los flags de negocio de la conversación (lead capturado, llamada agendada, pide humano, formulario cerrado) quedan persistidos y son consultables en BBDD.
- [ ] CA-16: La tarea de ClickUp del lead incluye en su descripción el resumen del contexto del cliente (quién es, qué buscaba, dolores, procesos recomendados) y los últimos mensajes literales de la conversación.
- [ ] CA-17: Existe la página /privacidad con el texto base RGPD y el checkbox del formulario enlaza a ella.
- [ ] CA-18: Cada uno de los tres eventos (lead sin agenda, handover «que me escribáis», llamada agendada) dispara un email provisional vía Resend al lead (verificable con envío real en staging).

---

## Modelo de datos

### Entidades nuevas o modificadas

- **Conversación (SPEC-01):** se amplía con flags de negocio: lead capturado (referencia al lead), llamada agendada, pide contacto humano, formulario cerrado con X.
- **Lead:** se reutiliza la entidad/tabla existente de leads del catálogo, añadiendo origen «chatbot» y referencia a la conversación. Si la estructura actual no admite la referencia, se amplía.

### Relaciones

- Conversación 1—0..1 Lead.

### Migraciones necesarias

- Ampliación de la tabla de conversaciones (flags) y de la de leads (origen + referencia a conversación), con RLS coherente con SPEC-01.

---

## UI / Páginas afectadas

### Páginas nuevas

- **/privacidad** — política de privacidad del catálogo (texto base RGPD: responsable, finalidad, derechos; pendiente de validación legal por el equipo). Es el destino del enlace del checkbox del formulario.

### Páginas modificadas

Las tres superficies del chat (SPEC-02) — el formulario, los botones de acción y el calendario embebido viven dentro del componente core.

### Componentes reutilizables

- Formulario embebido de lead (mensaje especial dentro del hilo).
- Botonera de acciones del bot (agendar / no / que me escribáis) como mensajes interactivos.
- Modal/calendario de GHL ya existente en el proyecto, reutilizado.

### Breakpoints obligatorios

375px, 768px, 1280px (el formulario embebido debe ser cómodo en móvil).

### Estándar de calidad visual

Aplicar el criterio de las skills de diseño del proyecto. El formulario debe sentirse parte de la conversación (no un popup): mismo lenguaje visual que los mensajes del bot, transición de entrada suave, estado de éxito celebratorio pero sobrio.

---

## API / Endpoints

### Endpoints nuevos

| Método | Ruta (conceptual) | Descripción | Autenticación |
|---|---|---|---|
| POST | captura de lead del chat | Valida y registra el lead, dispara el circuito externo y actualiza la conversación | Pública con identificador de conversación válido |
| POST | eventos de conversación | Registra eventos de negocio: formulario cerrado, agendamiento completado, handover elegido | Pública con identificador de conversación válido |

### Endpoints modificados

- El endpoint de chat (SPEC-01) incorpora en su respuesta la señal de trigger semántico (cuándo ofrecer formulario u opciones de handover), para que la decisión sea del backend y no del cliente.

### Contratos de request/response

A detallar en implementación. Requisito fijo: la señal de mostrar formulario/botones viaja como acción estructurada en la respuesta del chat, no como texto.

---

## Notas de seguridad

### Datos sensibles involucrados

- Nombre y email del visitante (datos personales con consentimiento explícito).
- Vinculación lead—conversación (la transcripción pasa a ser dato personal asociado: afecta a RGPD).

### Validaciones server-side requeridas

- Formato de email y nombre; consentimiento presente en el payload; identificador de conversación válido; idempotencia por conversación.

### Autenticación y autorización

- Mismo modelo que SPEC-01 (identificador no adivinable + RLS). Los datos del lead nunca se exponen por endpoints públicos de lectura.

### Otros riesgos identificados

- **Rate limiting** en el endpoint de captura (endpoint público que dispara emails y escribe en sistemas externos — riesgo de abuso).
- **El registro de consentimiento** (timestamp + versión de la política aceptada) debe persistirse con el lead.
- Los fallos hacia sistemas externos no deben filtrar claves ni URLs internas en logs ni respuestas.

---

## Plan de implementación

### Arquitectura propuesta

- **02-BACKEND-AGENT:** endpoint de captura con circuito externo (reutilizando la lógica existente de leads), señal de trigger semántico en el prompt/respuesta del chat, eventos de conversación, idempotencia y rate limiting.
- **01-FRONTEND-AGENT:** formulario embebido, botoneras interactivas, integración del calendario GHL dentro del chat, estados de éxito/error.
- **03-DATA-AGENT:** migraciones de flags y vínculo lead—conversación.

### Desglose de tareas

1. Migrar BBDD: flags de conversación y vínculo con lead.
2. Definir la señal estructurada de acciones en la respuesta del chat (mostrar formulario, ofrecer agenda, ofrecer handover).
3. Ajustar el prompt de sistema para el trigger semántico y el tono del post-captura.
4. Implementar el contador de límite duro (5 turnos) server-side.
5. Implementar el endpoint de captura con validación, idempotencia y circuito Slack + ClickUp + GHL.
6. Implementar el formulario embebido con RGPD y X de cierre.
7. Implementar la botonera post-captura y la integración del calendario GHL en el hilo.
8. Implementar el flujo de handover con marca de prioridad.
9. Registrar eventos de negocio en la conversación.
10. Conectar los disparos de email con **plantilla provisional digna vía Resend** desde el primer día (decisión owner): los tres eventos (lead sin agenda, handover escrito, llamada agendada) envían email sencillo; SPEC-05 los sustituirá por las plantillas HTML de marca.
11. Crear la página /privacidad con texto base RGPD y enlazarla desde el checkbox.

### Dependencias con otras specs

- Requiere SPEC-01 (motor + persistencia) y SPEC-02 (core de UI). Los emails finales dependen de SPEC-05.

---

## Tests requeridos

### Tests unitarios

- Validación del payload de captura (email, consentimiento, idempotencia).
- Lógica de triggers (semántico consumido, límite duro, formulario cerrado).

### Tests de integración

- Captura completa en staging con verificación en BBDD, Slack, ClickUp y GHL.
- Fallo simulado de un sistema externo: lead persiste y error registrado.

### Tests E2E

- Recorrido: conversación → 5º turno → formulario → captura → agendar en GHL.
- Recorrido handover: pedir humano → elegir «que me escribáis» → lead prioritario.

---

## Out of scope (explícito)

- Contenido y diseño final de los emails (SPEC-05).
- Cualificación automática del lead (scoring) — futura evolución.
- Extracción de datos personales del texto libre del chat.
- Captura de más campos (teléfono, empresa...) — solo nombre + email en v3.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-12 | Versión inicial generada desde entrevista de spec | David Navarrete |
| 1.1 | 2026-06-12 | Iteración: página /privacidad propia, emails provisionales vía Resend desde el día 1, Slack simple + ClickUp con resumen de contexto y últimos mensajes. +3 CAs (16-18) | David Navarrete |
| 1.2 | 2026-06-12 | Spec aprobada para implementación | David Navarrete |
| 1.3 | 2026-06-12 | Iteración post-implementación (feedback owner): «Agendar llamada» en handover abre GHL directo (su widget ya captura datos) — sin form propio redundante. «Que me escribáis» mantiene el form propio porque necesitamos su email. | David Navarrete |
