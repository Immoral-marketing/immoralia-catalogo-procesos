# SPEC-23: Análisis SEO continuo asistido por Claude sobre GSC

**Versión:** 1.4
**Estado:** aprobada
**Tipo de proyecto:** web-app (operacional)
**Última actualización:** 2026-06-30
**Owner:** David Navarrete

---

## Descripción

Cerrar el bucle **datos → análisis con IA → acción** del plan SEO. Con GA4 midiendo comportamiento (SPEC-18), GSC verificado y con sitemap enviado (SPEC-14) y el MCP custom de GSC operativo (SPEC-24), disponemos de los datos crudos pero sin un flujo que los convierta en decisiones semanales. Esta SPEC crea la pieza operacional: una skill de Claude Code que David invoca periódicamente para obtener un informe de estado + oportunidades detectadas + acciones concretas recomendadas. Sustituye la función de un consultor externo semanal, sin coste recurrente ni herramientas SEO de pago.

---

## Actores

- **Administrador (David):** invoca la skill cuando toca (semanal, quincenal, o cuando quiera un pulso del estado SEO). Lee el informe, decide qué acciones ejecutar. Puede iterar con Claude en la misma conversación pidiendo detalles.
- **Claude (dentro de Claude Code):** ejecuta la skill. Consulta el MCP custom de GSC (SPEC-24) para leer métricas reales. Cruza datos con el archivo de datos del catálogo (`src/data/processes.ts`) y la lista de sectores. Genera el informe estructurado.
- **MCP custom de GSC (SPEC-24):** proveedor de datos crudos. Expone las herramientas que la skill consulta: top queries, páginas con impresiones/0 clics, url inspection, indexed count, sitemaps registrados.
- **Skills futuras (SPEC-19, ampliaciones de SPEC-22):** consumen las recomendaciones concretas que este análisis produce (qué keywords atacar en H1, qué procesos ampliar el piloto de GEO Content).

---

## Flujos principales

### Flujo 1: David lanza el análisis semanal

1. David abre Claude Code y invoca la skill `seo-analisis-semanal` (o similar según decisión de ambigüedad 2).
2. La skill consulta el MCP GSC con parámetros por defecto (últimos 7 días vs. 7 días anteriores para comparativa, sitio = `procesos.immoralia.es`).
3. Extrae: top queries actuales, cambios de posición vs semana pasada, páginas con impresiones altas y 0 clics, procesos que ganan/pierden tráfico.
4. Cruza los datos con `src/data/processes.ts` para enriquecerlos: qué sector, qué proceso, si está en el piloto SPEC-22, si tiene metadata reciente (SPEC-15).
5. Produce un informe estructurado (formato decidido en ambigüedad 3):
   - Resumen ejecutivo (3-5 bullets).
   - Ganancias de la semana (queries que suben, páginas que ganan tráfico).
   - Pérdidas / alertas (queries que caen, páginas perdiendo posición).
   - Oportunidades (páginas con impresiones y CTR bajo).
   - Acciones recomendadas (concretas, ejecutables).
6. Guarda el informe donde corresponda según ambigüedad 3.

### Flujo 2: David consulta un pulso rápido

1. David pide "dame el estado SEO ahora mismo" en Claude Code.
2. La skill hace una consulta más ligera al MCP: top 10 queries y top 10 páginas de las últimas 4 semanas.
3. Responde en la propia conversación con un resumen de 2-3 líneas.
4. No genera informe formal — es una consulta puntual.

### Flujo 3: Detección de anomalía significativa

1. La skill detecta durante un análisis que una query importante ha caído más de 5 posiciones o que una página con >100 impresiones tiene 0 clics.
2. Alerta explícitamente en el informe con etiqueta `[ALERTA]`.
3. Sugiere acción concreta (revisar título de la URL, revisar contenido, revisar canonical, etc.).

### Flujo 4: Alimentación de otras skills / SPECs

1. Al terminar el análisis, la skill puede opcionalmente disparar un draft de recomendación para:
   - SPEC-19 (Copy H1): "las 3 keywords que están trayendo impresiones al sector salud son X, Y, Z — se sugiere reescribir el H1 incluyendo X".
   - Ampliación SPEC-22 (GEO Content): "las siguientes 5 fichas fuera del piloto reciben impresiones altas — candidatas prioritarias para el rollout".
2. Estos drafts NO se aplican automáticamente — se sugieren al humano.

---

## Flujos alternativos / Edge cases

- **GSC sin datos suficientes:** durante las primeras 2-4 semanas tras SPEC-14 en producción, GSC no tiene aún volumen relevante. La skill lo detecta y responde: "GSC tiene menos de N días de datos — vuelve en X días para primer análisis útil".
- **MCP GSC caído o mal autenticado:** la skill responde con el error claro proveniente del MCP (SPEC-24 ya lo traduce).
- **Cambio en el catálogo entre semanas (procesos añadidos):** la comparativa lo indica ("N procesos nuevos han aparecido, N han dejado de estar activos").
- **Query con tráfico ambiguo (múltiples sectores):** la skill lo señala para que David decida a qué sector atribuirlo.
- **Datos incompletos en `processes.ts`:** si un slug del GSC no existe en `processes.ts` (posiblemente URL vieja), se marca como huérfano.

---

## Criterios de aceptación

- [ ] CA-01: Existe una skill invocable desde Claude Code (registrada en el sistema de skills del proyecto). El nombre exacto se define en ambigüedad 2.
- [ ] CA-02: La skill consulta el MCP GSC configurado en SPEC-24 con permisos y credenciales que ya deberían estar operativos.
- [ ] CA-03: Una invocación estándar de la skill produce un informe con al menos estas secciones: resumen ejecutivo, ganancias, pérdidas/alertas, oportunidades, acciones recomendadas.
- [ ] CA-04: El informe cita datos concretos con números y ejemplos (no genéricos): "la query X pasó de posición 12 a 8 y trajo Y clics" — no "algunas queries mejoraron".
- [ ] CA-05: Cuando GSC tiene menos de 14 días de datos, la skill responde explícitamente que aún no hay volumen suficiente y NO genera informe con datos ficticios.
- [ ] CA-06: La comparativa incluye periodo actual vs periodo anterior de igual longitud (7 días vs 7 días, o 28 días vs 28 días, según decisión de ambigüedad 4).
- [ ] CA-07: Las páginas con impresiones y 0 clics durante el periodo se listan en la sección "Oportunidades" con recomendación concreta.
- [ ] CA-08: Al ejecutar la skill con la config del catálogo, el informe se publica como subpágina nueva bajo la página `knvz4-239675` en el doc del Catálogo de Procesos, con título `Informe SEO — YYYY-MM-DD`. Verificable abriendo el doc y viendo la subpágina creada.
- [ ] CA-09: La skill puede ejecutarse en modo "pulso rápido" (Flujo 2) devolviendo un resumen de 2-3 líneas sin generar informe formal.
- [ ] CA-10: Si la skill detecta anomalías importantes (caídas de posición > 5 puestos, páginas con CTR < 0.5%), las señala con etiqueta `[ALERTA]` visible en el informe.
- [ ] CA-11: La skill produce, cuando aplica, un bloque "sugerencias para otras skills" con drafts de recomendaciones ejecutables (ej. keyword propuesta para reescribir un H1).
- [ ] CA-12: Todo el output está en español, coherente con el idioma del proyecto (PROJECT-CONSTITUTION.md).

---

## Modelo de datos

### Entidades nuevas o modificadas

Ninguna en BBDD. La skill es stateless: consulta el MCP GSC en cada ejecución.

Opcionalmente (fuera del scope mínimo de esta SPEC): guardar histórico de informes en un directorio del repo (`docs/seo-informes/YYYY-MM-DD.md`) para tener trazabilidad. Se marca como {{PENDIENTE — decidir si se guarda histórico y dónde}}.

### Relaciones

No aplica.

### Migraciones necesarias

No aplica.

---

## UI / Páginas afectadas

### Páginas nuevas

Ninguna en la web del catálogo.

### Páginas modificadas

Ninguna.

### Componentes reutilizables

No aplica.

### Breakpoints obligatorios

No aplica.

### Estándar de calidad visual

No aplica.

---

## API / Endpoints

### Endpoints nuevos

Ninguno propio. Consume el MCP GSC (SPEC-24) que sí expone endpoints/herramientas.

### Endpoints modificados

Ninguno.

### Contratos de request/response

No aplica.

---

## Notas de seguridad

### Datos sensibles involucrados

Datos de tráfico de GSC (queries, impresiones, clics). No son datos personales pero son sensibles competitivamente. Se transfieren:
1. Servidor MCP → Claude Code local del owner (autenticado con Service Account SPEC-24).
2. Claude Code → destino del informe (ver ambigüedad 3).

### Validaciones server-side requeridas

Delegadas al MCP GSC (SPEC-24). Esta skill solo consume.

### Autenticación y autorización

El acceso al MCP está gobernado por las credenciales del Service Account de SPEC-24. Solo quien tenga configurado el MCP (David y en su momento Manel si se le da acceso) puede ejecutar la skill.

### Otros riesgos identificados

- **Fuga de datos por difusión indiscriminada:** si el informe se envía a un canal Slack público, cualquiera del workspace lo ve. Mitigado eligiendo destinos apropiados en ambigüedad 3.
- **Interpretación errónea de datos:** las recomendaciones son sugerencias de Claude; David debe validarlas antes de ejecutar. No se aplican automáticamente.

*(SECURITY-AGENT aplicará el checklist "Tipo: skill-ia" en particular las cláusulas sobre datos sensibles y outputs.)*

---

## Plan de implementación

### Arquitectura propuesta

**Skill genérica reutilizable** con configuración por app:

1. **Skill genérica publicada en el catálogo Brian de Immoralia** (nombre tentativo `immoral-seo-analisis-gsc`). Se publica siguiendo el flujo estándar de `immoral-skill-creator` → `immoral-master-validator` → `immoral-kb-organizer`. Cualquier proyecto (catálogo, immoral.es, imfilms, etc.) puede invocarla.

2. **Config específica del catálogo de procesos** en un archivo dentro del repo del catálogo, ej. `.brianspec/seo-analisis-config.yaml`. Declara:
   - `site`: dominio en GSC (`procesos.immoralia.es`).
   - `content_source`: cómo se lee el catálogo del negocio (path del archivo TS, URL de endpoint, o instrucciones).
   - `sectors_mapping`: mapping de `landing_slug` a nombre legible del sector.
   - `report_destinations`: dónde publicar el informe (decisión de ambigüedad 3).
   - `thresholds`: umbrales de alerta (caída de posición, CTR mínimo, etc.).

3. **Consultas al MCP GSC** (SPEC-24) — la skill genérica consume las herramientas del MCP con los parámetros que le pasa la config: `gsc_top_queries`, `gsc_pages_with_low_ctr`, `gsc_indexed_count`, `gsc_url_inspection`.

4. **Renderizado y publicación del informe** — la skill produce Markdown estructurado y lo envía a los destinos declarados en el `report_destinations` de la config. La skill soporta:
   - `clickup_subpage`: crea subpágina con fecha bajo una página parent especificada (usando el MCP de ClickUp).
   - `slack_message`: envía el informe a un canal Slack (MCP de Slack).
   - `repo_file`: guarda archivo Markdown en una carpeta del repo (`Write` tool).

**Configuración del catálogo de procesos:**
- `report_destinations` = `clickup_subpage`.
- `clickup.parent_page_id` = `knvz4-239675` (página "Plan Definitivo de Implementación SEO + GEO" bajo la subpágina "SEO — Catálogo de Procesos" en el doc del catálogo).
- Cada análisis crea una subpágina nueva con formato `Informe SEO — YYYY-MM-DD` bajo esa página parent.

### Desglose de tareas

1. **OPERACIONAL — Diseñar la skill genérica:**
   - Definir estructura del informe (secciones obligatorias, tono, formato).
   - Definir el schema del archivo de configuración (`seo-analisis-config.yaml`).
   - Umbrales por defecto de alertas + posibilidad de override en config.

2. **OPERACIONAL — Crear la skill:**
   - `SKILL.md` con descripción, palabras de activación y flujo genérico.
   - Lógica de consulta al MCP GSC parametrizada.
   - Formateo del output según destinos declarados en la config.

3. **OPERACIONAL — Publicar la skill en el catálogo Brian:**
   - Ejecutar `immoral-skill-creator` para el borrador.
   - Validar con `immoral-master-validator`.
   - Publicar con `immoral-kb-organizer`.

4. **OPERACIONAL — Configurar la skill para el catálogo de procesos:**
   - Crear `.brianspec/seo-analisis-config.yaml` en el repo del catálogo con los valores del proyecto (dominio, content_source = `src/data/processes.ts`, sectors_mapping, report_destinations, thresholds).

4. **VERIFICACIÓN:**
   - Ejecutar la skill contra datos reales de GSC.
   - Validar los CA con muestra de output.
   - Iterar el prompt canónico si el output no es útil.

### Dependencias con otras specs

- **Bloqueada por:** SPEC-14 en producción con 2–4 semanas de datos GSC + SPEC-24 operativo. Sin estos dos, esta skill no funciona.
- **Alimenta a:** SPEC-19 (keywords para H1), ampliación SPEC-22 (rollout GEO Content), refinamiento SPEC-15 (patrones metadata validados con datos).

### Lecciones aplicables (LESSONS-LEARNED.md)

- **LL-005 (dolores como campo clave):** el análisis se puede cruzar con la calidad de `dolores` por proceso — si un proceso con dolores pobres pierde posición, la skill puede sugerir revisarlos.
- **LL-006 (whitelist explícita):** las queries de GSC pueden traer términos ruido — la skill debe filtrar por lista blanca de sectores/procesos del catálogo antes de generar sugerencias accionables.

---

## Tests requeridos

### Tests unitarios

Ninguno aplicable.

### Tests de integración

Ejecutar la skill contra datos reales del entorno de producción y validar output frente a los CAs.

### Tests E2E

No aplica.

*(P9 — Tests donde aportan valor. La validación real es "genera informes útiles que David pueda usar", no medible por assertions clásicas.)*

---

## Out of scope (explícito)

- Dashboard visual persistente (Grafana, Looker Studio, etc.). Fuera de scope — la skill produce Markdown, no gráficos.
- Alertas en tiempo real por caídas de tráfico. Solo revisión periódica invocada por el humano.
- Aplicación automática de recomendaciones (por ejemplo, editar `processes.ts` sin revisión humana). Explícitamente prohibido — todo cambio pasa por David.
- Análisis multi-propiedad (varias webs). Solo `procesos.immoralia.es`. Si en el futuro Immoral Group quiere el mismo análisis para otras webs, se replica en otras SPECs.
- Integración con Bing Webmaster Tools u otros buscadores. Solo GSC.
- A/B testing de titulares. Fuera de scope.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-30 | Versión inicial — modo creación a partir del plan SEO + GEO (ClickUp knvz4-239675). | David Navarrete |
| 1.1 | 2026-06-30 | Resuelta ambigüedad 1: trigger manual (David invoca la skill en Claude Code, Opción A). Sin cron ni infraestructura adicional. Se puede combinar con recordatorio en calendario/Slack para constancia. | David Navarrete |
| 1.2 | 2026-06-30 | Resuelta ambigüedad 2: skill GENÉRICA reutilizable publicada en el catálogo Brian de Immoralia (nombre tentativo `immoral-seo-analisis-gsc`) + config específica del catálogo en `.brianspec/seo-analisis-config.yaml`. Permite futuros usos en immoral.es, imfilms, etc. sin duplicar código. | David Navarrete |
| 1.3 | 2026-06-30 | Resuelta ambigüedad 3: la skill soporta múltiples destinos declarativos (`clickup_subpage`, `slack_message`, `repo_file`); cada app configura el que quiera en su config. Para el catálogo de procesos: `clickup_subpage` con parent `knvz4-239675`. Cada análisis crea subpágina nueva con fecha. | David Navarrete |
| 1.4 | 2026-06-30 | Spec aprobada para implementación. | David Navarrete |
