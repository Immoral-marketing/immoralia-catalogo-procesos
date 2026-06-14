# Guía editorial — knowledge base del chatbot (SPEC-04)

**Versión:** 1.0 · **Fecha:** 2026-06-12

Esta guía define cómo redactar el contenido de cada proceso en `src/data/processes.ts`
para que la búsqueda semántica del chatbot funcione bien. La aplica el 04-CONTENT-AGENT
durante la revisión editorial por lotes (un sector a la vez, validación humana antes
de sincronizar a BBDD).

---

## Principio guía

> **El visitante no usa nuestras palabras. Usa las suyas.**

El chatbot recibe consultas como «pierdo citas porque nadie confirma», no como
«necesito un sistema de recordatorios automatizados». Si los `dolores` y las
descripciones del proceso solo contienen jerga interna, la búsqueda semántica
no encuentra el proceso correcto aunque exista.

La regla práctica: si una frase no la diría un dueño de negocio describiendo su
problema en voz alta, no debe estar en `dolores`. Va en `descripcionDetallada`.

---

## Campos editables (por orden de impacto en el matching)

### 1. `dolores` — vocabulario del cliente, no nuestro

**Qué es:** array de frases cortas que describen problemas en las palabras del cliente.
Es el campo que más pesa en el matching cuando el usuario describe su situación.

**Sí:**
- «Pierdo citas porque los pacientes no confirman»
- «No sé cuáles de mis pacientes llevan meses sin venir»
- «El teléfono no para de sonar y nadie responde a tiempo»

**No:**
- «Gestión ineficiente de no-shows» ← jerga
- «Falta de retención de pacientes inactivos» ← jerga
- «Optimización de atención al cliente» ← genérico

**Reglas:**
- 4-8 dolores por proceso.
- Primera persona y lenguaje natural ("Pierdo...", "No sé...", "Me cuesta...").
- Incluir **sinónimos** del mismo dolor cuando aplica (un dolor puede tener 2 formulaciones
  distintas si las dos son comunes — el matching mejora).
- Sin tecnicismos: nada de TPM, OEE, KPI, SLA, RFQ, MES, ERP en dolores visibles.
- Si el sector tiene jerga propia del cliente (no técnica), úsala. Ejemplo en salud:
  "paciente", "cita", "recepción", no "usuario", "appointment", "front-desk".

### 2. `descripcionDetallada` — claridad + valor concreto

**Qué es:** párrafo de 2-4 frases que explica qué hace el proceso y a quién ayuda.

**Estructura:**
1. **Una frase sobre el problema** que resuelve.
2. **Una frase sobre cómo lo resuelve** (sin tecnicismos profundos).
3. *(Opcional)* **Una frase sobre el resultado** que el cliente nota.

**Sí:**
> «Cuando un paciente no responde al recordatorio de su cita, el sistema le ofrece
> automáticamente fechas alternativas vía WhatsApp y libera el hueco original.
> Resultado: menos huecos vacíos y menos llamadas de recepción.»

**No:**
> «Solución de gestión de reagendamientos basada en automatización vía mensajería
> instantánea con liberación automática de slots y optimización de capacity utilization.»

### 3. `pasos` — concretos, accionables, sin tecnicismos

**Qué es:** array de 3-6 pasos cortos que describen el flujo del proceso.

**Reglas:**
- Cada paso empieza con un verbo en infinitivo o tercera persona ("Detecta...", "Envía...", "Libera...").
- Concretos: nombrar el canal cuando importa ("vía WhatsApp"), pero sin entrar en marcas.
- 8-20 palabras por paso. Si necesitas más, divídelo.

**Sí:**
- "Detecta cuándo un paciente no confirma su cita 24h antes."
- "Envía un mensaje proponiendo 3 fechas alternativas."
- "Libera el hueco si no responde en 2 horas."

**No:**
- "El sistema utiliza algoritmos de detección de patrones de comportamiento..." ← técnico
- "Mejora la experiencia del paciente." ← vago

### 4. `tagline` — gancho corto

**Qué es:** frase de máximo 80 caracteres que aparece en cards.

**Sí:**
- «Recupera citas perdidas sin levantar el teléfono.»
- «Saber qué pacientes están a punto de irse antes de que se vayan.»

**No:**
- «Solución integral de retención de pacientes mediante IA predictiva.»

### 5. `herramientas` y `canales` — array de strings

**Qué es:** tecnologías y canales que el proceso usa.

**Reglas:**
- Una palabra o nombre comercial corto por entrada (WhatsApp, n8n, GHL, Calendly).
- Si el campo está vacío hoy y la respuesta puede aplicar a varias herramientas, ponerlas
  todas — ayuda al matching cuando el usuario pregunta «¿se integra con X?».

---

## Lo que NO se toca

- `id`, `codigo`, `slug`, `landing_slug`, `bloque_negocio`, `modulo_codigo` — son
  identificadores estables.
- Campos de assets generados (`guion_generado`, `video_remotion_url`, `image_url_*`,
  etc.) — los gestionan procesos automatizados (REGLA OBLIGATORIA #1 del CLAUDE.md).
- `nombre` del proceso — solo cambiarlo si el actual es claramente engañoso o técnico.
  Cambiar nombres rompe enlaces externos y el chatbot.

---

## Flujo operativo (por lote = un sector)

1. **Lectura previa:** abrir los procesos del sector en `src/data/processes.ts` + los
   módulos en `src/data/<sector>Modules.ts`. Entender la promesa de cada uno.
2. **Propuesta por proceso (IA):** para cada proceso, generar un diff editorial que
   afecte SOLO a `dolores`, `descripcionDetallada`, `pasos` y `tagline`. Mostrar
   antes/después al humano.
3. **Validación humana:** el owner acepta, ajusta o rechaza por proceso.
4. **Aplicación en TS:** los cambios aceptados se aplican a `src/data/processes.ts`.
5. **Sync a BBDD:**
   ```bash
   node scripts/sync_processes_to_supabase.v2.mjs --verbose      # dry-run
   node scripts/sync_processes_to_supabase.v2.mjs --apply         # staging
   ```
6. **Regenerar embeddings:**
   ```bash
   node scripts/extract_content.mjs
   node scripts/generate_embeddings.mjs                            # pide confirmación
   ```
7. **Validar con batería:**
   ```bash
   node scripts/test-knowledge-base.mjs --sector=<slug>
   ```
8. Si la batería de ese sector pasa el umbral (90% aciertos), lote cerrado. Siguiente sector.

---

## Señales de que el contenido está bien

- El dueño del negocio diría «sí, ese es mi problema» leyendo los `dolores` en voz alta.
- Una pregunta coloquial como «cómo evito que se me caigan socios» encuentra el proceso
  correcto en la batería (CA-05 de la SPEC-04).
- No hay procesos diferentes con `dolores` casi idénticos (matching ambiguo).

## Señales de alerta

- Dolores que empiezan por «Falta de», «Mala gestión de», «Ineficiente»: son
  descripciones nuestras, no del cliente. Reescribir en primera persona.
- Descripciones con más de 2 acrónimos: simplificar.
- Dos procesos del mismo bloque que parecen lo mismo: rediferenciar dolores antes de
  embeber.

---

*Guía v1.0 — SPEC-04 v1.2*
