# SPEC-25: Capa de contenido editorial SEO/GEO — Guías

**Versión:** 1.2
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-07-06
**Owner:** David Navarrete

> **⏸ BLOQUEADA POR DATOS — igual que SPEC-19.** La spec queda redactada y lista, pero la implementación no arranca hasta que GSC tenga 2-4 semanas de datos reales de queries (post-corrección del sitemap, 2026-07-06). Los temas de los artículos piloto se elegirán con queries reales, no con keyword research especulativo. Cuando SPEC-23 (análisis GSC) entregue su primer informe con datos, esta spec y SPEC-19 se desbloquean juntas.

---

## Descripción

El catálogo solo tiene contenido transaccional (fichas de proceso, landings de sector) y ni Google ni las IAs generativas suelen citar catálogos: citan artículos que explican, comparan y responden preguntas concretas. Esta spec crea una sección de guías editoriales (`/guias`) que captura búsquedas informacionales ("cuánto cuesta automatizar la recepción de una clínica"), genera citabilidad en respuestas de IA (ChatGPT, Claude, Perplexity, Gemini) y canaliza tráfico hacia las fichas de proceso y las auditorías de madurez del catálogo.

> Nota de alcance vs Constitution: esto NO es la "plataforma de formación/cursos" declarada fuera de alcance en PROJECT-CONSTITUTION §1. Es contenido editorial de captación SEO/GEO, no contenido educativo privado ni estructurado en cursos.

---

## Decisiones tomadas (iteración 2026-07-06)

| # | Decisión | Elección |
|---|---|---|
| 1 | Alcance | Infraestructura completa + 5-8 artículos piloto del sector salud (patrón piloto→rollout de SPEC-22) |
| 2 | Almacenamiento | Archivos MDX versionados en el repo, rendering estático (SSG), review vía PR |
| 3 | Generación | Claude redacta borradores desde el conocimiento del catálogo; David/Manel revisan y aprueban antes de publicar |
| 4 | Ruta | `/guias` (índice) + `/guias/<slug>` (artículo) |
| 5 | Interlinking | Bidireccional: guías → fichas/auditorías Y fichas → bloque "Guías relacionadas" |
| 6 | Autoría E-E-A-T | Firma "Equipo Immoralia" + línea "Revisado por [nombre]" + fecha de actualización. Schema Article con author de tipo Organization |
| 7 | Selección de temas piloto | Con datos reales de GSC (primer informe de SPEC-23). NO keyword research especulativo |
| 8 | Navegación | Enlace en footer global + bloques contextuales en fichas. Sin entrada en header |

---

## Actores

- **Visitante informacional:** dueño/gerente de pyme que busca en Google o pregunta a una IA sobre automatización de su negocio sin conocer Immoralia. Llega a la guía, descubre el catálogo.
- **Rastreadores de búsqueda e IA:** Google, GPTBot, ClaudeBot, PerplexityBot, etc. Indexan y citan las guías.
- **David / Manel (editores):** revisan y aprueban el contenido generado antes de publicar.
- **Claude (generador):** redacta borradores de guías a partir del conocimiento del catálogo (fichas, FAQs citables, dolores).

---

## Flujos principales

### Flujo 1: Visitante llega desde búsqueda informacional

1. El visitante busca una pregunta informacional en Google (o la hace a una IA generativa).
2. Aterriza en una guía de `/guias/<slug>` que responde la pregunta con datos concretos y prosa citable.
3. La guía enlaza contextualmente a fichas de proceso relacionadas y a la auditoría del sector correspondiente.
4. El visitante navega a la ficha o auditoría → entra en el funnel existente (selección → contacto).

### Flujo 2: Publicación de una guía nueva

1. Se eligen los temas con datos del informe SEO de SPEC-23 (queries con impresiones e intención informacional).
2. Claude redacta el borrador MDX con frontmatter completo (título, description, sector, procesos relacionados, fecha, revisor).
3. David/Manel revisan el borrador en la rama de trabajo (review vía PR, igual que cualquier cambio del repo).
4. Al mergear, la guía se publica: aparece en `/guias`, en el sitemap y con metadata + schemas completos.

### Flujo 3: Visitante descubre guías desde el catálogo

1. El visitante está en una ficha de proceso.
2. Ve el bloque "Guías relacionadas" con guías del mismo sector/tema.
3. Navega a la guía para profundizar → la guía lo devuelve al funnel con más contexto.

---

## Flujos alternativos / Edge cases

- **Guía sin procesos relacionados válidos (slug de proceso eliminado/renombrado):** el bloque de procesos relacionados omite silenciosamente los slugs que no existan en `processes.ts`; si ninguno existe, el bloque no se renderiza. El build no rompe.
- **Slug de guía duplicado:** el build falla con error explícito indicando el slug conflictivo.
- **Guía marcada como borrador (draft en frontmatter):** no aparece en el índice, ni en el sitemap, ni en los bloques relacionados; su URL devuelve 404 en producción.
- **Ficha de proceso sin guías relacionadas:** el bloque "Guías relacionadas" no se renderiza (sin estado vacío visible).
- **Sector sin guías todavía:** el índice `/guias` muestra solo los sectores con contenido; sin secciones vacías.

---

## Criterios de aceptación

- [ ] CA-01: Existe la ruta `/guias` con un índice que lista las guías publicadas agrupadas o filtrables por sector, renderizada estáticamente (SSG).
- [ ] CA-02: Cada guía se publica en `/guias/<slug>` desde un archivo MDX del repo, renderizada estáticamente, con tipografía de lectura larga coherente con el diseño del catálogo (fondo `#0d0d0d`).
- [ ] CA-03: Cada guía tiene metadata SEO completa y única: title, meta description, canonical y Open Graph (reutilizando el patrón de SPEC-15).
- [ ] CA-04: Cada guía inyecta JSON-LD de tipo Article (con author de tipo Organization "Immoralia", datePublished y dateModified) y, si contiene sección de FAQs, FAQPage (reutilizando el helper de SPEC-16).
- [ ] CA-05: Cada guía muestra firma "Equipo Immoralia", línea "Revisado por [nombre]" y fecha de última actualización visible.
- [ ] CA-06: Las guías publicadas aparecen automáticamente en el sitemap dinámico; las guías en draft no aparecen ni en sitemap, ni en índice, y su URL devuelve 404 en producción.
- [ ] CA-07: Cada guía enlaza al menos a 1 ficha de proceso y a la auditoría de su sector mediante enlaces contextuales en el cuerpo.
- [ ] CA-08: Las fichas de proceso con guías relacionadas muestran un bloque "Guías relacionadas"; las fichas sin guías relacionadas no muestran el bloque.
- [ ] CA-09: El footer global incluye enlace a `/guias`.
- [ ] CA-10: Con dos guías con el mismo slug, el build falla con mensaje explícito.
- [ ] CA-11: Se publican 5-8 guías piloto del sector salud, con temas elegidos a partir del primer informe SEO con datos (SPEC-23) y aprobados por David antes de redactar.
- [ ] CA-12: llms.txt incluye una sección de guías con enlaces a las publicadas.
- [ ] CA-13: Todo el contenido y la UI en español, lenguaje cliente sin jerga técnica (regla del proyecto).

---

## Modelo de datos

No aplica BBDD. El contenido vive en archivos MDX en el repo con frontmatter:

- `title`, `description`, `slug`, `sector` (landing_slug válido), `relatedProcesses` (slugs de processes.ts), `relatedAudit` (slug de auditoría), `publishedAt`, `updatedAt`, `reviewedBy`, `draft` (boolean).

La validación del frontmatter se hace en build time (capa frontend).

---

## UI / Páginas afectadas

### Páginas nuevas

- Índice `/guias` — listado de guías por sector.
- Detalle `/guias/<slug>` — artículo con prosa larga, FAQs opcionales, bloque de procesos relacionados y CTA a auditoría.

### Páginas modificadas

- Fichas de proceso — bloque "Guías relacionadas" (solo si existen).
- Footer global — enlace a `/guias`.
- Sitemap — incluye guías publicadas.
- llms.txt — sección de guías.

### Componentes reutilizables

- Bloque "Guías relacionadas" (reutilizable en ficha y potencialmente en landings en el futuro).
- Card de guía para el índice.

### Breakpoints obligatorios

375px, 768px, 1280px.

### Estándar de calidad visual

Aplicar el criterio de las skills de diseño del proyecto. Tipografía optimizada para lectura larga (`@tailwindcss/typography` ya está en el stack), coherente con el fondo `#0d0d0d` y el acento del sector de la guía.

---

## API / Endpoints

No aplica — contenido estático en build time.

---

## Notas de seguridad

### Datos sensibles involucrados

Ninguno — contenido público sin inputs de usuario.

### Validaciones server-side requeridas

Validación de frontmatter en build time: slug único, sector válido, slugs de procesos existentes (warning, no error), fechas válidas.

### Otros riesgos identificados

- **Contenido IA sin revisión:** mitigado por decisión 3 — nada se publica sin revisión humana (review vía PR).
- **Datos inventados en el contenido (precios, plazos):** la redacción debe basarse solo en información del catálogo y conocimiento verificable; los borradores marcan con visto bueno explícito cualquier cifra.
- **Canibalización de keywords con landings de sector:** las guías apuntan a intención informacional (preguntas, comparativas, costes); las landings a intención transaccional. El informe de SPEC-23 vigilará solapamientos.

---

## Plan de implementación

### Arquitectura propuesta

- **FRONTEND-AGENT:** rutas `/guias` y `/guias/<slug>` (SSG con generateStaticParams), pipeline MDX, componentes de índice/artículo/bloque relacionado, footer, integración sitemap y metadata/JSON-LD reutilizando helpers de SPEC-15/16.
- **CONTENT-AGENT:** redacción de las 5-8 guías piloto de salud (temas aprobados por David a partir del informe SPEC-23), actualización de llms.txt.

### Desglose de tareas

1. Pipeline MDX: lectura de archivos, parsing de frontmatter, validaciones de build.
2. Página índice `/guias` con cards por sector.
3. Página detalle `/guias/<slug>` con prosa, FAQs, procesos relacionados y CTA auditoría.
4. Metadata + JSON-LD (Article + FAQPage condicional) por guía.
5. Integración en sitemap dinámico (publicadas sí, drafts no).
6. Bloque "Guías relacionadas" en fichas de proceso.
7. Enlace en footer global.
8. Propuesta de temas piloto desde el informe SPEC-23 → aprobación de David.
9. Redacción de 5-8 guías piloto de salud → revisión → publicación.
10. Actualización de llms.txt con la sección de guías.

### Dependencias con otras specs

- **SPEC-23 (BLOQUEANTE):** el primer informe SEO con datos reales define los temas piloto (tarea 8). Las tareas 1-7 (infraestructura) podrían adelantarse, pero por decisión del owner la spec completa espera a los datos.
- SPEC-14 (sitemap), SPEC-15 (metadata), SPEC-16 (JSON-LD), SPEC-21/22 (GEO): reutilización de patrones ya implementados.
- SPEC-19 (H1 landings): se desbloquea con los mismos datos — implementar en la misma ventana.

### Lecciones activas de LESSONS-LEARNED

- **LL-009:** al inyectar contenido en lote (guías piloto), verificar slug↔contenido antes de cada edición; anclar edits con el slug.
- **LL-010:** si las guías usan imágenes remotas con next/image, verificar que el dominio está en `images.remotePatterns`.

---

## Tests requeridos

### Tests unitarios

Validación de frontmatter (slug duplicado falla, sector inválido falla, draft excluido de listados).

### Tests de integración

No aplica.

### Tests E2E

Smoke test manual del golden path: `/guias` → guía → ficha de proceso relacionada → auditoría (validación en localhost antes de PR, política actual del proyecto).

---

## Out of scope (explícito)

- Plataforma de formación/cursos (fuera de alcance por Constitution).
- Comentarios de usuarios en artículos.
- Newsletter / suscripción por email.
- Multi-idioma.
- Rollout completo a todos los sectores (spec posterior tras validar el piloto de salud).
- Páginas de autor individuales (decisión 6: firma de organización).
- CMS o edición desde UI (decisión 2: MDX en repo).

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-07-06 | Versión inicial (draft) | David Navarrete + Claude |
| 1.1 | 2026-07-06 | 8 ambigüedades resueltas; marcada como bloqueada por datos GSC junto a SPEC-19 | David Navarrete |
| 1.2 | 2026-07-06 | Spec aprobada para implementación (implementación en espera de datos GSC) | David Navarrete |
