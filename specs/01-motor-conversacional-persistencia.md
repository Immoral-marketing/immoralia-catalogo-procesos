# SPEC-01: Motor conversacional y persistencia

**Versión:** 1.2
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-12
**Owner:** David Navarrete

---

## Descripción

Reconstruir el motor del chatbot del catálogo para que mantenga una conversación real: recuerda lo hablado, no se repite, responde en streaming y guarda cada conversación completa en la base de datos como un registro vivo que se amplía cuando el visitante la retoma. Es el cimiento sobre el que se montan la interfaz (SPEC-02), la captura de leads (SPEC-03) y la mejora de la base de conocimiento (SPEC-04).

---

## Actores

- **Visitante anónimo:** conversa con el chatbot desde cualquier superficie del catálogo (burbuja flotante, home, sector).
- **Equipo Immoralia:** consulta las conversaciones almacenadas en la base de datos (vía MCP de Supabase desde Brian) para detectar fallos y mejorar el bot.
- **Sistema de IA (OpenAI):** genera embeddings de la pregunta y la respuesta conversacional con `gpt-4o-mini`.

---

## Flujos principales

### Flujo 1: Primer mensaje de un visitante nuevo

1. El visitante envía su primer mensaje desde cualquier superficie.
2. El backend crea una conversación nueva en la BBDD con metadatos iniciales (superficie de origen, sector si aplica, ruta).
3. El backend busca contexto relevante en la base de conocimiento (búsqueda en dos capas: sector actual + global, como el comportamiento vigente).
4. El backend genera la respuesta con el modelo y la envía en streaming al cliente.
5. Al completarse la respuesta, el mensaje del usuario y el del bot quedan persistidos en la conversación con sus metadatos (ruta donde ocurrió el turno, procesos recomendados en la respuesta).
6. El cliente recibe el identificador de conversación para los turnos siguientes.

### Flujo 2: Turno siguiente dentro de una conversación

1. El visitante envía un mensaje con su identificador de conversación.
2. El backend recupera el historial completo de esa conversación desde la BBDD (no confía en el historial que envíe el cliente).
3. El backend construye el contexto: historial + búsqueda en la base de conocimiento orientada por la conversación acumulada (los mensajes cortos tipo "sí", "el primero" se interpretan en el hilo, nunca como consulta aislada).
4. La respuesta llega en streaming, continúa el hilo y evita repetir recomendaciones ya hechas salvo que el usuario lo pida.
5. El turno se persiste ampliando la misma conversación y se actualiza la fecha de última actividad.

### Flujo 3: Retomar una conversación días después

1. El visitante vuelve al sitio con una conversación previa de hace menos de 7 días.
2. El backend valida que la conversación existe y no ha caducado, y la reanuda: mismo registro, mismo historial.
3. Cada nueva interacción reinicia el contador de caducidad (rolling de 7 días).
4. Si han pasado más de 7 días desde la última actividad, se arranca conversación nueva; la antigua se conserva en BBDD para análisis.

### Flujo 4: Valoración de una respuesta

1. El visitante valora una respuesta concreta del bot (útil / no útil).
2. El backend registra la valoración asociada a ese mensaje exacto.
3. La valoración puede cambiarse (última gana).

---

## Flujos alternativos / Edge cases

- **Identificador de conversación inválido o caducado:** el backend crea conversación nueva de forma transparente y devuelve el identificador nuevo. El visitante no ve ningún error.
- **Fallo del servicio de IA (timeout, error de API, respuesta malformada):** el backend responde con un mensaje de error amable y el turno del usuario queda persistido igualmente con marca de error, para que el fallo sea analizable.
- **Mensaje vacío o excesivamente largo:** se rechaza con validación server-side (máximo 2.000 caracteres) sin llamar al modelo.
- **Conversación muy larga (decenas de turnos):** el backend envía al modelo los últimos N turnos íntegros + un **resumen acumulado** de lo anterior (qué negocio tiene el visitante, qué dolores contó, qué se le recomendó). El resumen se actualiza periódicamente conforme la conversación crece y se persiste con la conversación. La persistencia completa en BBDD nunca se recorta.
- **Abuso del endpoint público:** límites de 30 mensajes por conversación y hora y 100 mensajes al día por IP; superados, se responde con error claro de límite sin llamar al modelo.
- **Dos pestañas abiertas con la misma conversación:** los turnos se persisten por orden de llegada; no se corrompe el registro.
- **El visitante cambia de sector a mitad de conversación:** cada turno guarda la ruta/sector donde ocurrió; la búsqueda de contexto usa el sector del turno actual sin perder el hilo previo.
- **Caída de la conexión a mitad de streaming:** el backend persiste la respuesta completa generada (o la marca como interrumpida); el cliente puede recargar el historial íntegro desde el backend.

---

## Criterios de aceptación

- [ ] CA-01: Enviado un primer mensaje sin identificador de conversación, el backend crea una conversación en BBDD y devuelve su identificador junto con la respuesta.
- [ ] CA-02: Las respuestas del bot llegan al cliente en streaming (el primer fragmento de texto llega antes de que la respuesta esté completa).
- [ ] CA-03: En un segundo turno que referencia el turno anterior (ej. "¿y eso cuánto tarda?"), la respuesta del bot demuestra que usa el historial: responde sobre el tema previo sin pedir aclaración ni cambiar de asunto.
- [ ] CA-04: Una respuesta corta del usuario ("sí", "el primero") tras una pregunta del bot se interpreta en el contexto del hilo, no como consulta nueva.
- [ ] CA-05: El bot no repite la recomendación de un proceso ya recomendado en la misma conversación salvo petición explícita del usuario.
- [ ] CA-06: Cada turno (mensaje usuario + respuesta bot) queda persistido en BBDD con: contenido, timestamps, ruta/sector donde ocurrió y procesos recomendados en la respuesta.
- [ ] CA-07: Al retomar una conversación con menos de 7 días desde la última actividad, los turnos nuevos amplían el MISMO registro de conversación (no se crea uno nuevo).
- [ ] CA-08: Cada interacción nueva actualiza la fecha de última actividad (el contador de 7 días es rolling).
- [ ] CA-09: Con más de 7 días sin actividad, el siguiente mensaje crea conversación nueva y la antigua sigue consultable en BBDD.
- [ ] CA-10: Una valoración (útil/no útil) sobre un mensaje del bot queda registrada en BBDD vinculada a ese mensaje, y puede modificarse.
- [ ] CA-11: Un mensaje vacío o de más de 2.000 caracteres recibe error de validación sin llamar al servicio de IA.
- [ ] CA-12: Ante fallo del servicio de IA, el cliente recibe un mensaje de error amable y el turno queda registrado en BBDD con marca de error.
- [ ] CA-13: Una conversación completa es legible desde la BBDD en formato conversacional (consulta vía MCP de Supabase devuelve los mensajes ordenados con sus metadatos).
- [ ] CA-14: La búsqueda de contexto mantiene el comportamiento de dos capas (sector actual prioritario + global) cuando hay sector activo.
- [ ] CA-15: En una conversación que supera la ventana de turnos, el bot sigue recordando información dada al inicio (verificable: en una conversación de 20+ turnos, preguntado por algo dicho en el turno 1, responde usando el resumen acumulado sin pedir que se lo repitan).
- [ ] CA-16: El resumen acumulado queda persistido en la conversación y se actualiza conforme crece el hilo.
- [ ] CA-17: Superado el límite de 30 mensajes/hora en una conversación o 100 mensajes/día por IP, el endpoint responde con error de límite sin llamar al servicio de IA.

---

## Modelo de datos

### Entidades nuevas o modificadas

- **Conversación:** identificador, superficie de origen, sector inicial, fecha de creación, fecha de última actividad, contadores (turnos), **resumen acumulado de la conversación**, flags de negocio (lead capturado, llamada agendada — los rellenará SPEC-03), estado.
- **Mensaje:** pertenece a una conversación; rol (usuario/bot), contenido, timestamp, ruta/sector del turno, procesos recomendados (si los hay), marca de error si la generación falló.
- **Valoración:** pertenece a un mensaje del bot; valor (útil / no útil), timestamp. Una por mensaje (actualizable).

**Decisión tomada:** se crean tablas NUEVAS diseñadas para el modelo v3. Las tablas del chatbot anterior quedan intactas como histórico consultable; no se migran datos ni se amplían esquemas legados.

### Relaciones

- Conversación 1—N Mensaje.
- Mensaje (bot) 1—0..1 Valoración.

### Migraciones necesarias

- Creación/adaptación de las tablas anteriores con RLS activado.
- Política de acceso: el visitante anónimo solo puede leer/escribir su propia conversación (vía identificador no adivinable); el equipo accede con clave de servicio.

---

## UI / Páginas afectadas

No aplica directamente — esta spec es la capa de backend y datos. La interfaz se define en SPEC-02.

---

## API / Endpoints

### Endpoints nuevos o sustituidos

| Método | Ruta (conceptual) | Descripción | Autenticación |
|---|---|---|---|
| POST | envío de mensaje | Recibe mensaje + identificador de conversación opcional; responde en streaming; persiste el turno | Pública (anónimo), con identificador de conversación no adivinable |
| POST | valoración | Registra/actualiza la valoración de un mensaje del bot | Pública, validando pertenencia al identificador de conversación |
| GET | recuperación de conversación | Devuelve el historial de una conversación vigente para rehidratar el cliente | Pública, solo con identificador válido y no caducado |

### Endpoints modificados

- El endpoint de chat actual queda sustituido por el nuevo motor. **El endpoint de análisis legado se ELIMINA** (decisión tomada: el análisis de conversaciones se hace consultando la BBDD vía MCP de Supabase, no desde la web).
- La función de chat alojada en Supabase (legado) queda fuera de uso: todo pasa por el backend de Next.

### Contratos de request/response

Se detallan en implementación. Requisitos fijos: respuesta de chat en streaming; identificador de conversación siempre presente en la respuesta; errores con código HTTP coherente y mensaje sin información interna.

---

## Notas de seguridad

### Datos sensibles involucrados

- Contenido libre escrito por visitantes (puede contener datos personales que el visitante decida escribir).
- Identificador de conversación como única llave de acceso del anónimo.

### Validaciones server-side requeridas

- Longitud y formato del mensaje antes de llamar al modelo.
- Pertenencia del mensaje valorado a la conversación indicada.
- El historial se reconstruye SIEMPRE server-side desde BBDD; el cliente no puede inyectar historial falso.

### Autenticación y autorización

- Identificadores de conversación no secuenciales ni adivinables.
- RLS en todas las tablas nuevas; acceso de lectura general solo con clave de servicio.

### Otros riesgos identificados

- **Prompt injection desde el mensaje del usuario:** el contenido del usuario se trata como datos; las instrucciones de sistema van separadas y el bot no ejecuta acciones sensibles por instrucción textual del visitante.
- **Coste:** rate limiting fijado en 30 mensajes por conversación·hora y 100 por día·IP para evitar abuso del endpoint público.
- **Privacidad:** las conversaciones se almacenan sin asociar a identidad salvo que el visitante entregue sus datos (SPEC-03). Revisar texto de la política de privacidad.

---

## Plan de implementación

### Arquitectura propuesta

- **02-BACKEND-AGENT:** endpoint de chat con streaming, gestión de conversación (crear/reanudar/caducar), ventana de historial para el modelo, prompt de sistema conversacional anti-redundancia, endpoint de valoración y de recuperación.
- **03-DATA-AGENT:** modelo de datos (conversación/mensaje/valoración), migraciones con RLS, índices para consulta conversacional, decisión sobre tablas legadas.
- **01-FRONTEND-AGENT:** no participa en esta spec (interfaz en SPEC-02), salvo validar el contrato de streaming.

### Desglose de tareas

1. Diseñar y migrar el modelo de datos de conversaciones con RLS.
2. Implementar la creación/reanudación de conversaciones con caducidad rolling de 7 días.
3. Implementar el endpoint de chat con streaming y persistencia por turno.
4. Portar y mejorar la lógica RAG de dos capas al nuevo endpoint.
5. Redactar el prompt de sistema v3 (hilo conversacional, anti-redundancia, orientación a descubrimiento de dolores).
6. Implementar la memoria de conversaciones largas: ventana de últimos N turnos + resumen acumulado persistido y actualizado periódicamente.
7. Implementar endpoint de valoración por mensaje.
8. Implementar endpoint de recuperación de historial.
9. Eliminar el endpoint de análisis legado y retirar del flujo activo el endpoint de chat anterior y la función de chat de Supabase.
10. Rate limiting del endpoint público (2.000 caracteres/mensaje, 30 mensajes/conversación·hora, 100 mensajes/día·IP).

### Dependencias con otras specs

- SPEC-02 (UI) consume sus endpoints. SPEC-03 (leads) añade flags de negocio a la conversación. SPEC-04 (knowledge base) mejora el contexto que este motor recupera.

---

## Tests requeridos

### Tests unitarios

- Lógica de caducidad rolling (reanudar vs crear).
- Validación de inputs del endpoint de chat.

### Tests de integración

- Conversación de 3+ turnos con persistencia verificada en BBDD.
- Retomar conversación dentro y fuera de la ventana de 7 días.
- Valoración registrada y actualizada.

### Tests E2E

- Batería conversacional con guiones multi-turno (evolución del script de test del chatbot existente) verificando seguimiento de hilo y no-redundancia.

---

## Out of scope (explícito)

- La interfaz de usuario (SPEC-02).
- El formulario de lead y el handover (SPEC-03).
- La revisión del contenido de la base de conocimiento (SPEC-04).
- Emails (SPEC-05).
- Panel de administración de conversaciones (no se construye; el análisis es vía Supabase/MCP).
- Cambio de modelo LLM (se mantiene gpt-4o-mini).

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-12 | Versión inicial generada desde entrevista de spec | David Navarrete |
| 1.1 | 2026-06-12 | Iteración: tablas nuevas v3, memoria resumen+últimos N, límites anti-abuso fijados, eliminación del endpoint de análisis legado. +3 CAs (15-17) | David Navarrete |
| 1.2 | 2026-06-12 | Spec aprobada para implementación | David Navarrete |
