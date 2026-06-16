# SPEC-08: Resumen estructurado de conversación

**Versión:** 1.0
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-15
**Owner:** David Navarrete

---

## Descripción

Reemplazar el resumen narrativo libre que genera el modelo cada N turnos (campo `summary text` en `chat_conversations`) por un resumen con campos fijos en formato estructurado. Los campos son: sector declarado por el usuario, pain points principales (lista), slugs de procesos vistos/discutidos y nivel de interés estimado (explorando / interesado / listo para comprar).

El resumen estructurado sirve para dos propósitos simultáneos:
1. **Contexto del motor:** el system prompt del chatbot lo usa como memoria de la conversación en turnos siguientes — con campos fijos es más fácil para el modelo no repetir preguntas y seguir el hilo.
2. **Briefing comercial:** cuando hay una captura de lead, el equipo de ventas ve de un vistazo el sector, los dolores y el nivel de interés sin leer toda la transcripción.

---

## Actores

- **Motor del chat:** genera y actualiza el resumen estructurado en cada ciclo de refresh (misma cadencia que SPEC-01).
- **System prompt:** consume el resumen estructurado formateado como texto legible (no JSON crudo) para dar contexto al modelo en el siguiente turno.
- **Lead route:** extrae `nivel_interes` y `pain_points` del resumen estructurado para enriquecer el payload de ClickUp y GHL.

---

## Flujos principales

### Flujo 1: Generación del resumen estructurado

1. Cada `SUMMARY_REFRESH_EVERY` mensajes nuevos fuera de la ventana de historia íntegra, el motor llama a OpenAI con un prompt de sistema que solicita un objeto JSON con los cuatro campos fijos.
2. El modelo devuelve el JSON estructurado (o falla y se descarta).
3. El JSON válido se persiste en un campo JSONB de `chat_conversations` (`structured_summary`).
4. El campo de texto libre `summary` queda en desuso (se conserva la columna para retrocompatibilidad con conversaciones antiguas hasta una limpieza futura).

### Flujo 2: Consumo en el system prompt

1. Al construir el system prompt, si existe `structured_summary`, se formatea como bloque de texto:
   ```
   MEMORIA DE LA CONVERSACIÓN:
   - Sector: Academias y Formación
   - Dolores mencionados: "se pierden leads de nuevas matrículas", "manual y lento el seguimiento"
   - Procesos discutidos: academias-captura-multicanal, academias-cualificacion-alumno
   - Nivel de interés: interesado
   ```
2. Si `structured_summary` es null (conversación corta o no refrescada aún), el comportamiento es idéntico al actual.

### Flujo 3: Consumo en la captura de lead

1. Al recibir un POST en `/api/chatbot/lead`, se extrae `nivel_interes` y `pain_points` del `structured_summary` de la conversación.
2. Estos campos se añaden a la descripción de ClickUp y al webhook de GHL junto con los campos ya existentes de SPEC-07.

---

## Flujos alternativos / Edge cases

- **El modelo devuelve JSON malformado:** se captura el error, no se actualiza `structured_summary` y la conversación continúa con el resumen anterior (nunca rompe el chat).
- **El modelo devuelve JSON con campos faltantes:** se parsea lo que venga, los campos ausentes quedan null o array vacío.
- **Conversación existente con `summary` string pero sin `structured_summary`:** el system prompt usa el `summary` legacy como fallback; las nuevas conversaciones generan `structured_summary` desde el primer refresh.
- **Nivel de interés en un valor inesperado:** si el modelo devuelve algo distinto de los tres valores permitidos, se normaliza a `'explorando'` (el más conservador).
- **Conversación muy corta (nunca llega al primer refresh):** `structured_summary` es null; el system prompt lo ignora y el lead se captura sin ese contexto (fallback igual que ahora).

---

## Criterios de aceptación

- [ ] CA-01: Al refrescar el resumen, el sistema solicita al modelo un JSON con exactamente cuatro campos: `sector` (string|null), `pain_points` (string[]), `procesos_vistos` (string[]), `nivel_interes` ('explorando'|'interesado'|'listo_para_comprar').
- [ ] CA-02: El JSON válido se persiste en la columna `structured_summary jsonb` de `chat_conversations`.
- [ ] CA-03: Si el modelo devuelve JSON malformado o el campo llega vacío, `structured_summary` no se sobreescribe y la conversación continúa sin error visible al usuario.
- [ ] CA-04: Si `nivel_interes` es un valor fuera de los tres permitidos, se normaliza a `'explorando'`.
- [ ] CA-05: El system prompt del chatbot formatea `structured_summary` como bloque de texto legible (no JSON crudo) cuando el campo no es null.
- [ ] CA-06: Conversaciones existentes con `summary` string pero sin `structured_summary` siguen funcionando: el system prompt usa `summary` como fallback.
- [ ] CA-07: El endpoint `POST /api/chatbot/lead` extrae `nivel_interes` y `pain_points` de `structured_summary` y los añade a la descripción de ClickUp y al payload de GHL.
- [ ] CA-08: En una conversación de prueba de más de `HISTORY_WINDOW + SUMMARY_REFRESH_EVERY` turnos en staging, `structured_summary` se rellena correctamente con los cuatro campos.

---

## Modelo de datos

### Entidades modificadas

- **`chat_conversations`:** añadir columna `structured_summary jsonb DEFAULT NULL`.
- La columna `summary text` existente se conserva sin cambios para retrocompatibilidad y como fallback.

### Schema del JSONB (`structured_summary`)

```json
{
  "sector": "academias" | null,
  "pain_points": ["pérdida de leads de captación", "seguimiento manual de matrículas"],
  "procesos_vistos": ["academias-captura-multicanal", "academias-cualificacion-alumno"],
  "nivel_interes": "explorando" | "interesado" | "listo_para_comprar"
}
```

### Migraciones necesarias

- `ALTER TABLE chat_conversations ADD COLUMN structured_summary jsonb DEFAULT NULL;`

---

## API / Endpoints

### Endpoints modificados

| Capa | Cambio |
|---|---|
| `src/lib/chatbot/summary.ts` | El prompt de sistema solicita JSON estructurado; el resultado se parsea y se persiste en `structured_summary` vía una nueva función `updateStructuredSummary` |
| `src/lib/chatbot/prompt.ts` | Si existe `structured_summary`, formatear como bloque de texto en lugar del campo `summary` |
| `src/app/api/chatbot/lead/route.ts` | Extraer `nivel_interes` y `pain_points` de `structured_summary` y añadirlos al payload de ClickUp y GHL |

---

## UI / Páginas afectadas

Ninguna. El cambio es interno al motor (backend + base de datos). El visitante no ve diferencia.

---

## Notas de seguridad

- El resumen se genera a partir de conversaciones del usuario. No incluye datos especialmente sensibles (no hay tarjetas, DNI, ni datos médicos).
- El JSONB no se expone en ningún endpoint público.
- El formato estructurado limita el riesgo de que texto libre del usuario "escape" como instrucción al modelo en el siguiente turno (los campos son declarativos, no narrativos libres que el modelo reinterpreta como comandos).

---

## Plan de implementación

### Agentes

- **02-BACKEND-AGENT:** modificar `summary.ts` (prompt estructurado + parseo + persistencia), `prompt.ts` (formateo del bloque de contexto) y `lead/route.ts` (extracción para CRM).
- **03-DATA-AGENT:** migración de la columna `structured_summary jsonb` + función helper de actualización.

### Desglose de tareas

1. Migrar BBDD: columna `structured_summary jsonb` en `chat_conversations`.
2. Regenerar tipos TypeScript: `supabase gen types typescript --linked`.
3. Modificar `summary.ts`: nuevo prompt de sistema que solicita JSON, parseo con try/catch, persistencia en `structured_summary`.
4. Modificar `prompt.ts`: bloque `memoryBlock` usa `structured_summary` si existe (formateado), cae a `summary` como fallback.
5. Modificar `lead/route.ts`: extraer `nivel_interes` y `pain_points` y añadirlos a ClickUp y GHL.
6. Verificar en staging con conversación de prueba (>12 turnos).

### Dependencias

- SPEC-01 (motor conversacional — ya implementada).
- SPEC-03 (captura de leads — ya implementada, se complementa).
- Puede ejecutarse en paralelo con SPEC-07 si se coordinan los cambios en `lead/route.ts`.

---

## Tests requeridos

### Tests de integración (staging)

- Conversación de >12 turnos: verificar que `structured_summary` se rellena con los cuatro campos.
- Modelo devuelve JSON malformado (mock): verificar que el chat no rompe y `structured_summary` no se sobreescribe.
- Lead capturado tras resumen estructurado: verificar que `nivel_interes` y `pain_points` aparecen en ClickUp.

---

## Out of scope (explícito)

- UI para que el visitante vea o corrija su propio resumen.
- Scoring automático del lead basado en `nivel_interes` (puede ser futura evolución).
- Migrar conversaciones históricas con `summary` legacy al nuevo formato estructurado.
- Cambios en la frecuencia de refresh (`SUMMARY_REFRESH_EVERY` no cambia).

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-15 | Versión inicial en modo creación | David Navarrete |
| 1.1 | 2026-06-15 | Decisión: nueva columna JSONB coexistiendo con summary text. Spec aprobada para implementación | David Navarrete |
