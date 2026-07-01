# SPEC-22: GEO Content — FAQPage + HowTo schemas + prosa citable

**Versión:** 1.6
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-30
**Owner:** David Navarrete

---

## Descripción

Enriquecer las fichas de proceso con marcado estructurado de FAQs y pasos (schemas `FAQPage` y `HowTo` de schema.org) y reescribir sus descripciones detalladas en prosa densa, autocontenida y "citable" por IAs. El objetivo es que ChatGPT, Claude, Perplexity y Gemini, cuando reciban preguntas del tipo *"¿cómo automatizo la gestión de facturas vencidas en gestorías?"*, encuentren en el catálogo un párrafo compacto con datos concretos (qué hace el proceso, tiempo de implementación, sector de aplicación) y puedan citarlo tal cual. Complementa la base semántica introducida en SPEC-16 (Organization, BreadcrumbList, Service).

---

## Actores

- **Rastreador de IA (GPTBot, ClaudeBot, PerplexityBot, Gemini):** al indexar una ficha de proceso, encuentra tres capas semánticas: la descripción en prosa citable, el schema `Service` (SPEC-16), y ahora `FAQPage` y `HowTo`. Puede citar la ficha como fuente completa.
- **Rastreador de buscador (Googlebot):** el schema `FAQPage` habilita rich snippets de preguntas expandibles en SERPs, aumentando el CTR desde búsqueda tradicional.
- **Visitante anónimo:** ve las FAQs y los pasos en la ficha con más claridad y densidad. La UI se ajusta si es necesario (ambigüedad 5).
- **Administrador (David):** revisa el contenido generado antes de publicar. Puede iterar sobre el borrador que produce el pipeline auto-asistido.
- **Skill futura de análisis GSC (SPEC-23):** consulta la posición y CTR de las fichas enriquecidas para validar el impacto real de la SPEC.

---

## Flujos principales

### Flujo 1: Rastreador de IA lee una ficha enriquecida

1. GPTBot pide `https://procesos.immoralia.es/catalogo/procesos/{slug}`.
2. Recibe el HTML SSG (post-SPEC-17) con:
   - Prosa citable en el bloque de descripción detallada.
   - Schema `Service` (SPEC-16).
   - Schema `BreadcrumbList` (SPEC-16).
   - Schema `FAQPage` con 3–5 pares pregunta/respuesta (nuevo, esta SPEC).
   - Schema `HowTo` con los pasos del proceso (nuevo, esta SPEC, si aplica).
3. Cuando un usuario pregunta al modelo por ese tipo de automatización, el modelo tiene información suficiente para citar la ficha completa con precisión.

### Flujo 2: Google muestra un rich snippet de FAQ

1. Un usuario busca *"cómo automatizar seguimiento de facturas gestoría"* en Google.
2. Entre los resultados aparece la ficha del proceso correspondiente.
3. Bajo el snippet aparecen las FAQs expandibles gracias al `FAQPage` schema.
4. El usuario amplía una pregunta directamente en la SERP y ve la respuesta antes de hacer clic — o hace clic para leer la ficha completa.

### Flujo 3: Ciclo de creación del contenido enriquecido

1. Se identifican los procesos a los que aplicar la SPEC (ver ambigüedad 1).
2. Para cada proceso, un pipeline asistido por Claude:
   - Lee los datos existentes: `nombre`, `descripcionDetallada`, `pasos`, `how_it_works_steps`, `dolores`, `faqs` (si hay), `use_cases`, `common_mistakes_avoided`.
   - Genera un borrador de:
     - **Descripción en prosa citable** (2–3 párrafos densos con datos concretos).
     - **3–5 FAQs** en primera persona del cliente potencial.
     - **HowTo** estructurado con los pasos declarados.
3. David revisa el borrador (según decisión de ambigüedad 3: auto puro, auto + revisión, manual).
4. Una vez aprobado el contenido, se actualiza el archivo de datos del catálogo (`src/data/processes.ts`) según decisión de ambigüedad 4 (campo existente vs nuevo).
5. Se ejecuta el sync a Supabase (REGLA #1) y se despliega.
6. Los schemas `FAQPage` y `HowTo` se renderizan automáticamente en la ficha (server-side, reutilizando el helper de SPEC-16).

### Flujo 4: Piloto y validación

1. Se implementa la SPEC sobre un subconjunto de procesos (el "piloto" — ver ambigüedad 1).
2. Se despliega y se valida con:
   - Google Rich Results Test para confirmar validez de los schemas.
   - Búsqueda manual en ChatGPT/Claude/Perplexity con preguntas relacionadas para ver si el catálogo aparece como fuente.
   - GA4 (SPEC-18) y GSC (post SPEC-14) para medir el impacto en tráfico orgánico.
3. Tras 2–4 semanas de piloto en producción, se decide si extender al resto del catálogo o iterar.

---

## Flujos alternativos / Edge cases

- **Proceso sin `pasos` ni `how_it_works_steps`:** el schema `HowTo` NO se inyecta. Solo `FAQPage` (si tiene FAQs).
- **Proceso sin FAQs generadas todavía:** no se inyecta `FAQPage` — el schema requiere mínimo 2 pares. Se prioriza no publicar schema vacío o incorrecto.
- **Proceso con `hidden: true`:** no se renderiza la ficha, por tanto no hay schemas.
- **Proceso con `descripcionDetallada` no citable (formato antiguo):** durante la transición, algunos procesos tienen el campo actualizado a prosa citable y otros no. El comportamiento por defecto es servir lo que haya. No se rompe.
- **Rastreador de IA con contenido en cache antiguo:** los rastreadores refrescan a su ritmo. Cambios en las fichas se reflejan en respuestas de IA con delay (semanas típicamente).
- **Datos de origen contradictorios entre `faqs` legacy y las nuevas generadas:** decisión de ambigüedad 2 resuelve dónde vive el contenido y qué se prioriza.

---

## Criterios de aceptación

- [ ] CA-01: `curl https://procesos.immoralia.es/catalogo/procesos/{slug}` de un proceso incluido en el alcance devuelve HTML con un `<script type="application/ld+json">` con `@type: "FAQPage"` que contiene entre 3 y 5 elementos `mainEntity` (uno por FAQ), cada uno con `@type: "Question"`, `name` (la pregunta), y `acceptedAnswer` con `@type: "Answer"` y `text` (la respuesta).
- [ ] CA-02: La misma ficha, **si el proceso tiene `how_it_works_steps` definido (no solo `pasos` genéricos)**, incluye un `<script type="application/ld+json">` adicional con `@type: "HowTo"` que contiene: `name` (nombre del proceso), `description` (resumen corto), y un array `step` con `@type: "HowToStep"` por cada paso (`name` = title, `text` = short + detail concatenados). Si el proceso NO tiene `how_it_works_steps`, no se inyecta HowTo.
- [ ] CA-03: La descripción principal de la ficha (el texto legible por humanos, no solo el JSON-LD) contiene 2–3 párrafos de prosa densa que mencionan al menos: qué hace el proceso, para qué sector, tiempo de implementación estimado y frecuencia de ejecución. Verificable con lectura manual o con grep de palabras clave esperadas.
- [ ] CA-04: Ninguna ficha del alcance tiene un `FAQPage` con menos de 2 preguntas o con respuestas que consistan en una sola palabra o menos de 20 caracteres (validación del pipeline de generación).
- [ ] CA-05: Ninguna ficha del alcance tiene un `HowTo` con menos de 2 pasos.
- [ ] CA-06: Validación en `https://search.google.com/test/rich-results` de al menos una ficha del alcance detecta `FAQPage` (y `HowTo` si aplica) SIN errores ni advertencias críticas.
- [ ] CA-07: Validación adicional en `https://validator.schema.org/` de los mismos schemas no devuelve errores estructurales.
- [ ] CA-08: El alcance final (procesos con contenido enriquecido) coincide con lo decidido en ambigüedad 1. El PR o los PRs cubren exactamente ese alcance, sin fichas fuera de él tocadas por casualidad.
- [ ] CA-09: El campo del archivo de datos que aloja la prosa citable y las FAQs (según decisión de ambigüedad 4) queda documentado en el `interface Process` y en el CLAUDE.md.
- [ ] CA-10: La sección de FAQ visible en la UI de la ficha (si existe hoy) sigue funcionando: o bien se conecta con los mismos datos que el schema FAQPage, o bien se documenta como decoupled (decisión de ambigüedad 5).
- [ ] CA-11: Búsqueda manual en ChatGPT (u otro LLM equivalente) con una pregunta relacionada a un proceso del piloto — post 2 semanas del despliegue — muestra el catálogo como fuente citada al menos una vez. (Criterio validable pero no bloqueante para la aprobación del PR — es criterio de éxito de negocio, no de código.)

---

## Modelo de datos

### Entidades nuevas o modificadas

Ampliación del interface `Process` en `src/data/processes.ts` con **campos nuevos** (los legacy se mantienen durante el piloto y se borran en fase posterior):

```typescript
// Nuevos campos añadidos:
descripcion_citable?: string;   // prosa densa 2-3 párrafos, generada en esta SPEC
faqs_citables?: { q: string; a: string }[];  // 3-5 pares Q/A, formato citable por IAs
```

Los campos legacy (`descripcionDetallada`, `faqs`) se mantienen intactos durante el piloto y se borran en la SPEC de rollout completo (SPEC futura).

Sincronización con Supabase: se amplía la whitelist del sync script para incluir los dos nuevos campos.

### Relaciones

No aplica.

### Migraciones necesarias

- Migración SQL en Supabase: añadir columnas `descripcion_citable` (`text`) y `faqs_citables` (`jsonb`) a la tabla `processes`.
- Regenerar `src/integrations/supabase/types.ts` (auto-generado con `supabase gen types typescript --linked`).
- Ampliar whitelist en `scripts/sync_processes_to_supabase.v2.mjs` para incluir los dos nuevos campos.

---

## UI / Páginas afectadas

### Páginas nuevas

Ninguna.

### Páginas modificadas

- **`/catalogo/procesos/[slug]`** (las 179 fichas de proceso, o el subconjunto del alcance decidido en ambigüedad 1) — inyecta los nuevos schemas y presenta la prosa citable / FAQs según decisión de ambigüedad 5.

### Componentes reutilizables

Reutiliza el helper de inyección JSON-LD introducido en SPEC-16. Si en la UI se sigue mostrando la sección de FAQs (según ambigüedad 5), reutiliza el componente actual de FAQs.

### Breakpoints obligatorios

Los estándar. Sin cambios visuales sustanciales si se opta por reutilizar el componente FAQ actual.

### Estándar de calidad visual

Aplicar criterio de las skills de diseño del proyecto. La prosa citable no puede romper la tipografía ni la jerarquía visual actual.

---

## API / Endpoints

### Endpoints nuevos

Ninguno.

### Endpoints modificados

Ninguno.

### Contratos de request/response

No aplica.

---

## Notas de seguridad

### Datos sensibles involucrados

Ninguno. Contenido público informativo.

### Validaciones server-side requeridas

Serialización segura de los schemas JSON-LD con `JSON.stringify` (misma pauta que SPEC-16). Sin concatenación de strings — evita XSS por caracteres especiales en FAQs generadas.

### Autenticación y autorización

No aplica.

### Otros riesgos identificados

- **Riesgo de FAQs incorrectas o poco naturales:** mitigado por el proceso de revisión decidido en ambigüedad 3.
- **Riesgo de schemas duplicados:** si por error un proceso lleva `FAQPage` en dos scripts distintos, Google puede confundirse. Mitigado por el helper único de inyección (SPEC-16).
- **Riesgo de contenido obsoleto tras cambios en el negocio:** las descripciones citables son estáticas — si Immoralia cambia tiempos de implementación o forma de trabajar, hay que revisar el copy. Se marca como riesgo de mantenimiento continuo.

*(SECURITY-AGENT aplicará el checklist. Esta SPEC no toca autenticación, BBDD sensible ni endpoints — es contenido + JSON-LD.)*

---

## Plan de implementación

### Arquitectura propuesta

Tres piezas que colaboran:

1. **Pipeline asistido de generación de contenido** — un flujo semi-automatizado donde Claude produce borradores de:
   - Prosa citable (2–3 párrafos) por proceso.
   - 3–5 FAQs en primera persona del cliente.
   - HowTo estructurado (si el proceso tiene pasos).
   Basado en los datos existentes: nombre, `descripcionDetallada` actual, `pasos`, `how_it_works_steps`, `dolores`, `use_cases`, `common_mistakes_avoided`, `sector`.

2. **Actualización del archivo de datos** — según decisión de ambigüedad 4, se reescriben campos existentes o se añaden campos nuevos en `src/data/processes.ts`. Con posible migración SQL en Supabase.

3. **Inyección de schemas en la ficha** — extender el helper de SPEC-16 para inyectar también `FAQPage` y `HowTo` cuando los datos correspondientes existan en el proceso. Server-side, con `JSON.stringify` seguro.

### Desglose de tareas

1. **CONTENT-AGENT — Definir prompt canónico para generación:** crear el prompt maestro que Claude usará para producir los borradores. Incluye:
   - Instrucción de tono: en español, primera persona plural (nosotros), sin jerga técnica visible.
   - Estructura de output: 2–3 párrafos + 3–5 FAQs + HowTo si aplica.
   - Datos de entrada: qué campos del archivo de datos se usan como fuente.

2. **CONTENT-AGENT — Ejecutar el pipeline sobre el alcance decidido en ambigüedad 1:**
   - Iterar sobre cada proceso del alcance.
   - Generar borrador con Claude usando el prompt canónico.
   - Aplicar la política de revisión decidida en ambigüedad 3.
   - Persistir en el archivo de datos según decisión de ambigüedad 4.

3. **DATA-AGENT — Migración SQL** (solo si ambigüedad 4 = Opción B):
   - Añadir columnas nuevas a `processes` en Supabase.
   - Ampliar whitelist del sync script.
   - Regenerar tipos TypeScript.

4. **FRONTEND-AGENT — Extender helper de inyección JSON-LD:** añadir soporte para `FAQPage` y `HowTo` en el helper introducido en SPEC-16. Verificar renderización correcta.

5. **FRONTEND-AGENT — Conectar FAQs visibles en UI** (según decisión de ambigüedad 5): sincronizar la sección FAQ visible con la fuente única de FAQs (evitar duplicación).

6. **VERIFICACIÓN POST-DEPLOY:**
   - CA-01 a CA-10 con `curl` + parseo del HTML.
   - CA-06 y CA-07 con validadores externos.
   - Test manual: buscar en ChatGPT una pregunta sobre uno de los procesos del piloto y comprobar que el catálogo aparece como fuente.

### Dependencias con otras specs

- **Bloqueada por:** SPEC-16 (helper de inyección JSON-LD ya existe), SPEC-17 (rendering SSG estable), SPEC-18 (GA4 para elegir piloto por tráfico) — todas en Fase 1/2 anteriores.
- **Alimenta a:** SPEC-23 (los datos de GSC tras esta SPEC dirán qué contenido está funcionando y qué no, informando qué procesos ampliar).
- **Coordina con:** REGLA #1 del CLAUDE.md — cualquier cambio en `src/data/processes.ts` requiere ejecutar el sync a Supabase.

### Lecciones aplicables (LESSONS-LEARNED.md)

- **LL-005 (los `dolores` son el campo con más impacto en matching semántico):** aplica indirectamente. Al generar la prosa citable y las FAQs, los `dolores` del proceso son fuente crítica — un proceso con `dolores` vacío producirá borradores pobres. Auditar antes de generar.
- **LL-006 (whitelist explícita):** si se opta por Opción B en ambigüedad 4, ampliar la whitelist del sync es OBLIGATORIO — de lo contrario los campos nuevos no llegan a Supabase.
- **LL-004 (script sync desactualizado):** si el sync script está roto respecto al schema actual, hay que arreglarlo primero (o está ya arreglado tras SPEC-06 archivada — verificar).

---

## Tests requeridos

### Tests unitarios

Ninguno directo.

### Tests de integración

CA-01 a CA-10 con `curl` + parseo + validadores externos.

### Tests E2E

Test manual del funil de citas: buscar 3–5 preguntas relacionadas con procesos del piloto en ChatGPT/Claude/Perplexity y confirmar que el catálogo aparece como fuente al menos en la mitad.

*(P9 — Tests donde aportan valor.)*

---

## Out of scope (explícito)

- Marcado `Article` o `BlogPosting`. El catálogo no tiene blog (nunca ha estado en scope).
- Marcado `Course` en auditorías. Las auditorías no son cursos.
- Generación automática de imágenes ilustrativas de las FAQs (out of scope estético — el marcado JSON-LD acepta URLs de imagen opcionalmente pero no es prioridad).
- Traducción a otros idiomas. El catálogo es solo español.
- Integración con un CMS externo para gestión de contenido. Sigue viviendo en `src/data/processes.ts` (REGLA #1).
- Regeneración automática programada del contenido. La generación es puntual y disparada por David.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-30 | Versión inicial — modo creación a partir del plan SEO + GEO (ClickUp knvz4-239675). | David Navarrete |
| 1.1 | 2026-06-30 | Resuelta ambigüedad 1: solo piloto en esta SPEC (Opción A). Alcance = 15-20 procesos: los más visitados según GA4 (post-SPEC-18 con datos) o los 15-20 del sector salud como fallback si GA4 aún no tiene datos suficientes. Rollout completo queda para SPEC futura tras 2-4 semanas de medición. | David Navarrete |
| 1.2 | 2026-06-30 | Resuelta ambigüedad 2: campos NUEVOS (`descripcion_citable`, `faqs_citables`) en el interface Process, con migración SQL en Supabase y ampliación de whitelist del sync script. Los legacy (`descripcionDetallada`, `faqs`) se mantienen durante el piloto; se borran en SPEC futura de rollout completo. | David Navarrete |
| 1.3 | 2026-06-30 | Resuelta ambigüedad 3: generación asistida por Claude + revisión humana obligatoria de cada proceso (Opción A). Ningún contenido se commitea sin ojos humanos encima. Viable dado que el piloto es 15-20 procesos. | David Navarrete |
| 1.4 | 2026-06-30 | Resuelta ambigüedad 4: la ficha visible muestra el contenido NUEVO citable en lugar del legacy (Opción A). Un solo contenido, una sola fuente. Coherencia UI ↔ JSON-LD ↔ SERP. Los legacy quedan en el archivo como fallback durante la transición, pero no se pintan. | David Navarrete |
| 1.5 | 2026-06-30 | Resuelta ambigüedad 5: HowTo solo se inyecta si el proceso tiene `how_it_works_steps` definido (Opción A). Procesos sin ese campo van solo con FAQPage. CA-02 actualizado para reflejar esta condición. | David Navarrete |
| 1.6 | 2026-06-30 | Spec aprobada para implementación. | David Navarrete |
