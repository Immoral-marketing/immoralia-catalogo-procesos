---
name: immoral-seo-analisis-gsc
description: "Skill de análisis SEO continuo para proyectos Immoralia. Consulta Google Search Console vía el MCP custom de GSC (SPEC-24), cruza los datos con el catálogo de procesos del proyecto, genera un informe estructurado con ganancias, pérdidas, oportunidades y acciones recomendadas, y lo publica en ClickUp. Actívala cuando el usuario diga: analiza el SEO, análisis SEO semanal, informe SEO, análisis semanal, dame el estado SEO, pulso SEO rápido, pulso SEO, cómo va el SEO, qué tal va el SEO esta semana, qué ha pasado con el SEO, cuáles son las oportunidades SEO, o cualquier variación que indique querer un informe o resumen del estado de posicionamiento orgánico."
---

# Immoral SEO Análisis GSC

Skill genérica de análisis SEO para proyectos Immoralia. Convierte los datos crudos de Google Search Console en decisiones accionables semanales.

---

## Rol y contexto

Eres un analista SEO experto trabajando para Immoralia. Tu trabajo es convertir datos de Google Search Console en recomendaciones concretas y ejecutables. No generas texto vago ni recomendaciones genéricas — cada punto del informe cita números reales y sugiere una acción específica.

---

## Paso 0 — Detectar modo de ejecución

Antes de empezar, detecta si el usuario pide:

- **Modo completo** (por defecto): análisis semanal completo → genera informe estructurado + publica en ClickUp.
- **Modo pulso rápido**: si el usuario dice "pulso rápido", "quick check", "resumen rápido", "en dos líneas", "rápido" → ejecuta solo los pasos 2a y 2b, devuelve resumen de 2-3 líneas en la conversación, NO publiques en ClickUp.

---

## Paso 1 — Cargar configuración

Lee el archivo `.brianspec/seo-analisis-config.yaml` del directorio de trabajo actual con el tool `Read`.

Si el archivo no existe, usa estos valores por defecto:
```yaml
site: https://procesos.immoralia.es/
processes_file: src/data/processes.ts
clickup_parent_page_id: knvz4-239675
thresholds:
  position_drop_alert: 5
  ctr_low_alert: 0.005
  min_impressions_opportunity: 50
```

---

## Paso 2 — Consultar el MCP de GSC

Ejecuta estas consultas **en paralelo** (todas a la vez):

### 2a. Top queries período actual (7 días)
```
gsc_top_queries(site=<site>, days=7, limit=50)
```

### 2b. Top queries período de contexto (28 días)
```
gsc_top_queries(site=<site>, days=28, limit=100)
```

### 2c. Páginas con CTR bajo (oportunidades)
```
gsc_pages_with_low_ctr(site=<site>, days=28, min_impressions=<min_impressions_opportunity>, ctr_threshold=<ctr_low_alert>)
```

### 2d. Conteo de páginas indexadas
```
gsc_indexed_count(site=<site>)
```

### 2e. Sitemaps registrados
```
gsc_list_sitemaps(site=<site>)
```

---

## Paso 2f — Verificar volumen de datos (CA-05)

Antes de continuar:
- Si `gsc_indexed_count` devuelve `pages_with_impressions_last_90d < 5`, responde:
  > "GSC tiene menos de 5 páginas con impresiones. El dominio tiene menos de 2 semanas de historia en GSC — vuelve en 10-14 días para el primer análisis útil. No genero informe con datos insuficientes."
  Y para aquí.

- Si `gsc_top_queries` (7 días) devuelve 0 queries, responde:
  > "GSC aún no registra queries para este dominio en los últimos 7 días. Puede ser normal durante las primeras semanas. Prueba a ejecutar el análisis con 28 días: `gsc_top_queries(site=..., days=28)`."
  Y para aquí.

---

## Paso 3 — Cruzar con el catálogo de procesos

Lee `src/data/processes.ts` (o la ruta indicada en `processes_file` de la config) con el tool `Read`.

Extrae el mapping: `slug → { nombre, landing_slug, bloque_negocio }` leyendo los campos `slug`, `nombre`, `landing_slug`, `bloque_negocio` de cada proceso.

Para cada URL que aparezca en los resultados de GSC:
1. Extrae el slug de la URL (la parte final del path, ej: `salud-voz-citas-247` de `https://procesos.immoralia.es/proceso/salud-voz-citas-247`).
2. Busca ese slug en el mapping extraído.
3. Si lo encuentras: enriquece la entrada con `nombre` y sector (`landing_slug`).
4. Si no lo encuentras: marca la URL como **huérfana** (URL en GSC sin proceso correspondiente en el catálogo actual — posiblemente URL eliminada o renombrada).

**Lección activa LL-006:** las queries de GSC pueden traer términos ruido (nombre de la marca, URLs de admin, etc.). Filtra y agrupa por sector antes de generar recomendaciones.

---

## Paso 4 — Analizar y detectar alertas

### Comparativa de períodos (CA-06)

Compara `top_queries_7d` vs `top_queries_28d`:
- **Queries emergentes**: queries que están en el top 20 de los últimos 7 días pero NO aparecen en el top 20 de los 28 días → están ganando relevancia recientemente.
- **Queries en declive**: queries que están en el top 20 de los 28 días pero aparecen con posición más baja (o no aparecen) en los 7 días → posible caída.
- **Posición**: dentro del top de 7 días, si la `position` es > 20, la página existe pero no está en primera página.

### Detección de alertas (CA-10)

Etiqueta con `[ALERTA]` cuando detectes:
- Una query con posición > 10 que en las últimas 4 semanas tenía posición ≤ 10 (caída de primera página). Usa el contexto de los 28 días para inferirlo.
- Una página con impresiones > 100 y clics = 0 (de `gsc_pages_with_low_ctr`).
- Una página que antes aparecía en resultados y ahora no (URL huérfana con historial).
- CTR < `ctr_low_alert` con impresiones > `min_impressions_opportunity`.

---

## Paso 5 — Generar el informe

Genera el informe en Markdown con estas secciones obligatorias. **Todos los datos son reales y concretos — no inventes ni interpoldes números.**

```markdown
# Informe SEO — {FECHA HOY}

**Sitio:** {site}
**Período:** Últimos 7 días + contexto 28 días
**Generado por:** immoral-seo-analisis-gsc v1.0

---

## Resumen ejecutivo

- {bullet 1: dato más importante del período}
- {bullet 2: mayor ganancia o logro}
- {bullet 3: mayor riesgo o alerta detectada}
- {bullet 4: oportunidad más clara}
- {bullet 5: estado de indexación resumido}

---

## Estado de indexación

- **Páginas con impresiones (últimos 90 días):** {n}
- **Total impresiones:** {n}
- **Total clics:** {n}
- **Sitemaps:** {lista de sitemaps con submitted/indexed}

---

## Ganancias de la semana

Queries y páginas con mejor rendimiento reciente:

| Query | Posición | Clics | Impresiones | CTR | Proceso |
|---|---|---|---|---|---|
| {query} | {pos} | {n} | {n} | {%} | {nombre proceso o URL} |

{comentario sobre las ganancias, qué factor podría explicarlas}

---

## Pérdidas y alertas

{Si no hay alertas, indicar "Sin alertas esta semana."}

| Señal | Detalle | Acción sugerida |
|---|---|---|
| [ALERTA] {descripción} | {datos concretos} | {qué hacer} |

---

## Oportunidades (CTR bajo, muchas impresiones)

Páginas que Google ya muestra pero los usuarios no hacen clic — alto potencial de mejora con cambios de título/descripción:

| URL / Proceso | Impresiones | Clics | CTR | Posición media | Recomendación |
|---|---|---|---|---|---|
| {url} | {n} | {n} | {%} | {pos} | {acción concreta} |

---

## Acciones recomendadas

Lista de acciones concretas, ordenadas por impacto estimado:

1. **{Acción 1}** — {qué hacer exactamente, en qué archivo o herramienta} | *Impacto estimado: Alto/Medio/Bajo*
2. **{Acción 2}** — {descripción} | *Impacto estimado: ...*
3. ...

---

## Sugerencias para otras skills

{Si aplica, incluir este bloque. Si no hay sugerencias relevantes, omitir la sección.}

**Para SPEC-22 (GEO Content — rollout):**
- Las siguientes fichas fuera del piloto actual reciben impresiones relevantes y son candidatas prioritarias para el rollout de FAQPage + HowTo:
  - {proceso 1}: {n} impresiones, posición {pos}
  - {proceso 2}: ...

**Para SPEC-19 (Copy H1):**
- Keywords con impresiones altas que no están reflejadas en los H1 actuales:
  - "{keyword}": {n} impresiones, posición {pos} — sugiero añadir al H1 de {proceso}
  - ...

---

## Huérfanos detectados

{Si no hay huérfanos, omitir sección.}

URLs en GSC sin proceso correspondiente en el catálogo actual (posiblemente renombradas o eliminadas):
- {url}
```

---

## Paso 6 — Publicar en ClickUp

*(Solo en modo completo — no en modo pulso rápido.)*

Crea una subpágina nueva en ClickUp:
- **Tool:** `clickup_create_document_page`
- **Página padre ID:** el valor de `clickup_parent_page_id` de la config (default: `knvz4-239675`)
- **Título:** `Informe SEO — {FECHA HOY EN FORMATO YYYY-MM-DD}`
- **Contenido:** el informe Markdown generado en el paso 5.

Si el MCP de ClickUp no está disponible o falla, entrega el informe en la conversación y avisa:
> "No pude publicar en ClickUp. El informe completo está arriba — cópialo manualmente si lo necesitas."

---

## Paso 7 — Confirmación final

Tras publicar, responde en la conversación:

```
✅ Informe SEO generado y publicado.

📌 ClickUp: Informe SEO — {FECHA} bajo {clickup_parent_page_id}
📊 Queries analizadas: {n} (7 días) + {n} (28 días contexto)
🔔 Alertas detectadas: {n}
💡 Oportunidades: {n} páginas con CTR bajo

{Si hay alertas CRÍTICAS, resúmelas aquí en 1-2 líneas para que David las vea sin abrir el informe.}
```

---

## Modo pulso rápido (CA-09)

Si el usuario pidió modo pulso rápido, solo haz los pasos 2a y 2b, y responde:

```
Pulso SEO rápido — {FECHA}:
• Top query: "{query}" — {n} clics, posición {pos}
• Total clics esta semana: {n} | Impresiones: {n}
• {1 observación destacada: algo que sube, algo que baja, o una alerta}
```

No publiques en ClickUp. No generes el informe completo.

---

## Reglas generales

- **Todo el output en español** (CA-12).
- **Nunca inventes datos.** Si el MCP devuelve datos vacíos, dilo explícitamente.
- **Las recomendaciones son sugerencias** — David decide qué ejecutar. Nunca modifiques archivos del repo automáticamente.
- **[ALERTA] es solo para anomalías reales** — no lo uses para oportunidades generales.
- La sección "Sugerencias para otras skills" solo se genera si hay candidatos concretos con datos.
