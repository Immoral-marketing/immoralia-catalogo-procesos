# SPEC-10: Eliminar email transaccional de "llamada agendada" + aviso Slack enriquecido

**Versión:** 1.2
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-17
**Owner:** David Navarrete

---

## Descripción

Cuando un visitante agenda una llamada desde el calendario embebido del CRM tras dejar sus datos, el catálogo dispara hoy un email transaccional propio de confirmación. El CRM ya gestiona automáticamente todos los emails del flujo de calendario (confirmación, invitación de calendario, recordatorios, enlace para reagendar), por lo que el email propio es redundante y puede confundir al visitante. Esta spec elimina ese envío.

Como contrapartida, dado que no se confía en que el CRM notifique al equipo internamente cuando entra una reserva, el catálogo enviará un mensaje a Slack al canal ya configurado con un enlace directo a la tarea de ClickUp del lead. Para ello, se persiste el id de la tarea de ClickUp del lead en BBDD en el momento de la captura.

Decisión post-reunión 16/06/2026: el flujo del calendario es propiedad del CRM, no del catálogo. Pero el aviso interno sigue saliendo del catálogo.

---

## Actores

- **Visitante anónimo:** agenda la llamada desde el calendario embebido tras dejar sus datos. Recibe los emails del CRM, no del catálogo.
- **CRM (GoHighLevel):** envía confirmación, invitación de calendario y recordatorios al visitante.
- **Equipo Immoralia:** recibe aviso en Slack al canal ya configurado cuando se reserva una llamada (con enlace directo a la tarea del lead en ClickUp), y consulta el flag de "llamada agendada" en BBDD para tracking.

---

## Flujos principales

### Flujo 1: Visitante agenda llamada (estado nuevo)

1. El visitante deja sus datos en el chat → se crea el lead, se crea la tarea en ClickUp, **el id de la tarea queda persistido en BBDD** junto al lead.
2. El bot ofrece agendar llamada → el visitante abre el calendario embebido y reserva un hueco.
3. El CRM gestiona la confirmación al visitante (email propio del CRM con invitación de calendario, recordatorios automáticos, enlace para reagendar).
4. El catálogo recibe la señal de reserva completada y:
   - Marca la conversación con el flag de "llamada agendada".
   - Recupera el id de la tarea de ClickUp del lead.
   - Envía un mensaje a Slack al canal ya configurado con el nombre + email del visitante, el id de la conversación y un enlace directo a la tarea de ClickUp.
5. **NO se envía email del catálogo** al visitante por este motivo.

### Flujo 2: Equipo consulta estado del lead

1. Cualquier consulta a la conversación o al lead muestra el flag de "llamada agendada" actualizado.
2. Desde el mensaje de Slack, el comercial llega directamente a la tarea del lead en ClickUp con todo el contexto (conversación + procesos de interés + nivel de interés).

---

## Flujos alternativos / Edge cases

- **El visitante reagenda la llamada en el CRM:** los emails de reagenda los envía el CRM. El flag interno del catálogo se mantiene como "llamada agendada". No se envía un segundo Slack.
- **El visitante cancela la llamada en el CRM:** el flag interno no se revierte automáticamente (no recibimos señal de cancelación en esta spec; queda como mejora futura).
- **El visitante agenda sin haber dejado datos antes:** flujo imposible — el calendario solo se ofrece tras la captura del lead.
- **La creación de la tarea de ClickUp falló en la captura (campo nulo):** el mensaje de Slack se envía igualmente, pero con texto plano sin enlace ("ClickUp no disponible"). El flujo no se rompe.
- **Doble disparo de `schedule_completed`:** el flag ya gestiona idempotencia (`if (!conversation.call_scheduled)`). El Slack también se envía una sola vez, dentro de la misma guardia.
- **Slack falla en la entrega:** el flag interno se actualiza igualmente y el error se loguea. No se reintenta.

---

## Criterios de aceptación

- [ ] CA-01: Al agendar una llamada tras la captura de lead, el catálogo **no envía ningún email** al visitante (ni desde Resend ni desde ningún otro proveedor).
- [ ] CA-02: El flag de "llamada agendada" sigue actualizándose correctamente en la BBDD del catálogo tras la reserva.
- [ ] CA-03: Las otras dos plantillas del chatbot (lead capturado sin agenda, handover escrito) siguen funcionando exactamente igual que antes — no se ven afectadas.
- [ ] CA-04: La plantilla `call_scheduled`, su entrada en `CONTENT`, su clave en `KIND_TO_LOG_KIND` y su valor en `ChatbotEmailKind` quedan eliminados del módulo del chatbot. Solo el valor del enum global `EmailKind` del sender centralizado se conserva (con comentario aclarando que ya no se produce) por compatibilidad con registros históricos.
- [ ] CA-05: Al capturar un lead, el `clickup_task_id` queda persistido en `contact_submissions`. Si la creación de la tarea de ClickUp falla, el campo queda nulo y el flujo sigue sin error.
- [ ] CA-06: Al recibir `schedule_completed` con lead asociado, el catálogo envía un mensaje a Slack al canal ya configurado con: nombre del lead, email, id de conversación y enlace a la tarea de ClickUp (`https://app.clickup.com/t/{id}`). Si no hay `clickup_task_id`, el mensaje se envía sin enlace pero igualmente.
- [ ] CA-07: Un doble disparo de `schedule_completed` actualiza el flag una sola vez y envía Slack una sola vez (idempotente).
- [ ] CA-08: Una llamada de prueba en staging termina con: 0 emails del catálogo al visitante, 1 fila en Slack al canal configurado, flag `call_scheduled = true` en BBDD, y registro histórico previo (`chatbot_call_scheduled`) intacto en `email_logs`.

---

## Modelo de datos

### Entidades nuevas o modificadas

- `contact_submissions`: nueva columna `clickup_task_id text` (nullable, sin default).

### Relaciones

No aplica.

### Migraciones necesarias

- **Migración 1:** añadir columna `clickup_task_id` a `contact_submissions`.

```sql
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS clickup_task_id text DEFAULT NULL;
```

### Limpieza de `email_logs`

Los registros históricos con `kind = 'chatbot_call_scheduled'` se **conservan tal cual** por auditoría. No hay migración de limpieza.

---

## UI / Páginas afectadas

Ninguna. El visitante no ve cambios en la interfaz del chat — el cambio es 100% transparente para él (solo deja de recibir un email duplicado).

---

## Backend / API afectada

- **Endpoint de captura de lead:** persiste `clickup_task_id` en `contact_submissions` tras crear la tarea (si la creación tuvo éxito).
- **Endpoint de eventos del chatbot:** el manejador del evento de "reserva completada" deja de disparar email y pasa a enviar Slack enriquecido con enlace a ClickUp.
- **Módulo de emails del chatbot:** la plantilla `call_scheduled` y su tipo asociado se eliminan completamente.
- **Sender centralizado de emails:** el valor `chatbot_call_scheduled` del enum `EmailKind` se conserva con comentario aclarando que ya no se produce (compatibilidad con logs históricos).

---

## Integraciones externas afectadas

- **Resend:** un endpoint deja de invocarlo. No requiere cambios en la cuenta de Resend.
- **CRM (GHL):** sin cambios — sigue gestionando los emails del flujo de calendario.
- **ClickUp:** sin cambios en la creación de la tarea (lo único nuevo es persistir su id en BBDD del catálogo).
- **Slack:** un nuevo tipo de notificación al canal ya configurado. Reutiliza el helper existente.

---

## Seguridad y privacidad

- Sin nuevos datos personales en juego — el flujo elimina un envío y añade una notificación interna al equipo.
- El `clickup_task_id` no es información sensible (no contiene datos personales).
- RGPD: el visitante deja de recibir un email duplicado. Impacto neutro o positivo.

---

## Out of scope

- Cambiar el contenido de las otras dos plantillas (lead capturado, handover escrito).
- Migrar todos los emails transaccionales del catálogo al CRM (esto es solo el de agenda de llamada).
- Implementar reconciliación bidireccional CRM→catálogo de cancelaciones / reagendas.
- Reescribir el sender centralizado de emails.
- Persistir la URL completa de ClickUp (solo se guarda el id, se reconstruye al usar).

---

## Plan de implementación (orientativo, no normativo)

1. Aplicar la migración: añadir `clickup_task_id` a `contact_submissions` en staging y regenerar tipos.
2. Modificar el endpoint de captura de lead para guardar el id devuelto por la API de ClickUp.
3. Modificar el manejador del evento `schedule_completed`: eliminar la línea de envío de email, añadir lectura de `clickup_task_id` y envío de Slack enriquecido.
4. Limpiar el módulo de emails del chatbot (tipo, constantes, mapping).
5. Añadir comentario en el sender centralizado al valor del enum que ya no se produce.
6. Validar en staging: simular reserva → 0 emails al visitante, 1 Slack al canal, flag actualizado, tarea ClickUp accesible desde el enlace del Slack.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-17 | Creación inicial — modo creación brianspec-spec | Claude (en sesión con David) |
| 1.1 | 2026-06-17 | Resueltas 6 ambigüedades: Slack desde catálogo, limpieza completa del módulo emails, conservar logs, conservar enum, Slack enriquecido con enlace ClickUp, persistir `clickup_task_id` | Claude (en sesión con David) |
| 1.2 | 2026-06-17 | Spec aprobada para implementación | David Navarrete |
