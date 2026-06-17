# SPEC-12: Tono del chatbot — respuestas estilo WhatsApp

**Versión:** 1.2
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-17
**Owner:** David Navarrete

---

## Descripción

El chatbot del catálogo responde hoy con un tono correcto pero algo formal — los párrafos son densos, las frases largas y la cadencia se parece más a un email que a un mensaje de WhatsApp. Para acercarlo a la conversación real con un cliente y aumentar la velocidad de lectura, esta spec ajusta el system prompt para que las respuestas sean **máximo 2 párrafos cortos**, sin emojis, sin fórmulas corporativas, con tono cercano pero profesional. Los ejemplos del prompt se reescriben completos para reflejar el registro nuevo.

Decisión post-reunión 16/06/2026: bajar la formalidad sin caer en marketing barato. El bot habla como un consultor que escribe por WhatsApp a un cliente con el que ya tiene confianza.

---

## Actores

- **Visitante anónimo:** lee respuestas más cortas y conversacionales — la fricción de leer baja, el bot se siente cercano.
- **Chatbot:** ahora redacta como un consultor que escribe por WhatsApp, no por email.
- **Equipo Immoralia:** sigue recibiendo en CRM exactamente la misma información estructurada (el tono solo afecta a la respuesta visible al visitante).

---

## Flujos principales

### Flujo 1: Respuesta a un mensaje del visitante (general)

1. El visitante envía un mensaje.
2. El bot lee el contexto y los aprendizajes previos (sector, dolores, procesos vistos).
3. La respuesta sigue las reglas de tono:
   - **Máximo 2 párrafos**, cada uno de 1-3 frases.
   - **Sin saludos corporativos** ("Estimado usuario", "Por supuesto, con mucho gusto", "Permítame...", "Quedo a su disposición").
   - **Sin emojis** en ningún caso.
   - **Tuteo y cercanía** desde el primer turno.
   - **Una idea por mensaje.** Si hay que dar dos ideas distintas, separarlas con doble salto de línea (markdown).
   - **Listas solo cuando aportan**: pasos, opciones puntuales o comparativas. Nunca listas de relleno.
   - **Negritas con moderación**: el énfasis se reserva para datos clave (nombre del proceso, plazo, beneficio principal), no para frases enteras.
4. La respuesta se sigue emitiendo en streaming SSE como hoy — solo cambia el contenido.

### Flujo 2: Recomendación de proceso

1. El visitante describe un dolor concreto.
2. El bot reconoce el problema en **una sola frase corta** (sin "Entiendo que..." ni paráfrasis larga).
3. Enlaza el proceso adecuado con el pill clicable (sintaxis actual).
4. Añade **máximo una pregunta de seguimiento** para profundizar.
5. Total: 2 párrafos como máximo.

### Flujo 3: Sin proceso aplicable en el catálogo

1. El bot reconoce el problema sin inventar procesos.
2. En **1-2 frases** dice que no hay proceso construido y que se puede hacer a medida.
3. **Una sola pregunta corta** para entender mejor el caso.
4. Total: 1-2 párrafos.

### Flujo 4: Cierre / petición de contacto

1. Cuando el bot detecta intención clara, emite el marcador `[[LEAD_FORM]]` (sin cambios en la lógica de SPEC-03).
2. El texto que precede al marcador es ahora más corto y directo: 1-2 frases máximo.

---

## Flujos alternativos / Edge cases

- **Visitante hace una pregunta amplia que requiere explicación:** el bot **no** debe responder con un bloque largo. Si la explicación es densa, divide en mensajes consecutivos cortos o pregunta de vuelta para acotar.
- **Visitante usa lenguaje muy informal o coloquial:** el bot mantiene su registro cercano pero correcto. No imita errores ortográficos.
- **Visitante hace una pregunta de varias partes:** el bot responde a una a la vez, no a las tres en bloque.
- **Visitante en home sin sector declarado:** mismas reglas de tono + pregunta corta para identificar sector si aplica (lógica actual).
- **El modelo intenta meter emojis:** el prompt es explícito en prohibirlos.
- **El modelo se pasa de 2 párrafos:** ejemplos del prompt + instrucción explícita lo desincentivan.

---

## Criterios de aceptación

- [ ] CA-01: El bot **no** usa fórmulas corporativas como "Estimado", "Por supuesto, con mucho gusto", "Permítame ayudarle", "Quedo a su disposición", "Mucho gusto", "Será un placer". Una batería de prompts de prueba verifica la ausencia de estas fórmulas.
- [ ] CA-02: Las respuestas del bot tienen **máximo 2 párrafos**. Cada párrafo tiene **1-3 frases**. Total ≤ 6 frases por respuesta (excepto cuando el bot enlaza un proceso, que cuenta como 1 elemento, no como frases).
- [ ] CA-03: El bot **no emite emojis** en ningún caso. Verificable inspeccionando 20 respuestas de prueba.
- [ ] CA-04: El bot reconoce el problema del visitante en una sola frase corta antes de proponer solución o pregunta de seguimiento.
- [ ] CA-05: El bot hace como mucho **una pregunta de seguimiento por turno** (regla ya presente, se refuerza).
- [ ] CA-06: Los enlaces a procesos siguen renderizándose como pills cian clicables (sin cambios respecto al formato actual).
- [ ] CA-07: La emisión en streaming SSE sigue funcionando como hoy — solo cambia el contenido textual.
- [ ] CA-08: El payload a CRM (GHL + ClickUp) sigue idéntico — el tono no afecta al backend de captura.
- [ ] CA-09: El system prompt incluye los ejemplos **completamente reescritos**: al menos **3 ejemplos de "respuesta buena estilo WhatsApp"** (recomendación con proceso, sin proceso aplicable, pregunta de cualificación en home) y **2 ejemplos de "respuesta mala (demasiado formal o larga)"** para guiar al modelo por contraste. Los ejemplos anteriores quedan eliminados.
- [ ] CA-10: La longitud media de respuesta tras el cambio es **inferior a la actual**, medido re-ejecutando la batería sintética `scripts/synthetic-test-conversations.mjs` y comparando longitud media de mensajes del rol asistente.

---

## Modelo de datos

No aplica. Spec puramente de prompt.

---

## UI / Páginas afectadas

Ninguna directa. El cambio es 100% server-side en el system prompt. La UI ya renderiza correctamente los párrafos cortos, pills de proceso y listas.

---

## Backend / API afectada

- Módulo del system prompt del chatbot: actualizar las secciones de **tono**, **reglas de respuesta** y **ejemplos**.
- Los ejemplos actuales del system prompt se **reescriben todos** — no se conservan los antiguos.

---

## Integraciones externas afectadas

Ninguna. El cambio es 100% en el prompt local.

---

## Seguridad y privacidad

- Sin impacto. El cambio afecta solo a la generación de texto visible al visitante.

---

## Out of scope

- Cambiar el modelo de OpenAI (sigue siendo el actual).
- Modificar los marcadores invisibles `[[LEAD_FORM]]` y `[[HANDOVER]]`.
- Cambiar la lógica de RAG, captura de leads, embeddings, persistencia.
- Tono de los emails transaccionales (mantienen la plantilla actual de Immoralia).
- Tono de las plantillas de bienvenida personalizada del flujo de SPEC-11 (se genera con el mismo prompt — heredará el tono automáticamente).
- Permitir emojis (decisión owner: no).

---

## Plan de implementación (orientativo, no normativo)

1. Reescribir las secciones del system prompt: **tono**, **reglas de respuesta** y **ejemplos** según las decisiones tomadas.
2. Smoke test manual: enviar 6-8 mensajes de prueba (saludo inicial, dolor concreto, pregunta abierta, pregunta sin proceso aplicable, intención de cierre, pregunta multi-parte) y verificar:
   - Longitud máxima 2 párrafos cortos.
   - Ausencia de emojis.
   - Ausencia de fórmulas corporativas.
   - Reconocimiento del problema en una frase.
3. Re-ejecutar la batería sintética (`scripts/synthetic-test-conversations.mjs`) y comparar longitud media de respuesta antes vs después. La media debe bajar.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-17 | Creación inicial — modo creación brianspec-spec | Claude (en sesión con David) |
| 1.1 | 2026-06-17 | Resueltas 3 ambigüedades: máximo 2 párrafos cortos, sin emojis, reescribir todos los ejemplos del prompt | Claude (en sesión con David) |
| 1.2 | 2026-06-17 | Spec aprobada para implementación | David Navarrete |
