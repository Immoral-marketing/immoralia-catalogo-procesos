# SPEC-15: Metadata SEO por página — title, description, canonical, Open Graph dinámico

**Versión:** 1.4
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-30
**Owner:** David Navarrete

---

## Descripción

Cerrar el mayor problema SEO identificado en la auditoría inicial: hoy 34 de las 36 páginas públicas del catálogo comparten el mismo `<title>` genérico ("Immoralia - Catálogo de Procesos") y no tienen meta description propia, canonical ni Open Graph específico. Esta SPEC implementa `generateMetadata` en todas las páginas públicas, con patrones derivados de los datos ya existentes del catálogo, más OG images dinámicas por ruta para que compartir cualquier URL en LinkedIn, WhatsApp o Twitter produzca un preview específico y no el genérico corporativo. Es la pieza de Fase 3 con mayor impacto directo esperado en el ranking orgánico.

---

## Actores

- **Rastreador de buscador (Googlebot, Bingbot):** al indexar cada URL, encuentra un `<title>` y `<meta description>` únicos y específicos. Deja de ver el sitio como "34 páginas duplicadas" y empieza a posicionar cada página por su keyword propia.
- **Rastreador de IA (GPTBot, ClaudeBot, PerplexityBot):** utiliza el title y description como resumen semántico de cada URL. Cita el catálogo con más precisión.
- **Visitante en redes sociales / chat:** cuando alguien comparte una URL del catálogo en LinkedIn, WhatsApp, X o cualquier canal que consume Open Graph, ve un preview con imagen específica del proceso/sector, no un genérico repetido.
- **Administrador (David):** revisa los borradores de metadata que Claude genera automáticamente antes de commitear. Puede iterar sobre los patrones si algún resultado no encaja.
- **Skill futura SPEC-23 (análisis GSC):** consume los datos de posición y CTR de cada URL. Con metadata específico, la señal por URL es clara — se puede identificar qué patrones convierten mejor.

---

## Flujos principales

### Flujo 1: Google indexa una ficha de proceso

1. Googlebot pide `https://procesos.immoralia.es/catalogo/procesos/{slug}`.
2. Recibe el HTML SSG (post-SPEC-17) con:
   - `<title>` específico del proceso (patrón `{nombre} — Automatización para {sector} | Immoralia`).
   - `<meta name="description">` específica derivada de la prosa citable (SPEC-22).
   - `<link rel="canonical" href="{URL absoluta}">`.
   - `<meta property="og:*">` completo con `og:image` dinámica.
   - `<meta name="twitter:*">` reutilizando OG.
3. Google indexa la URL con esos metadatos. Aparece en SERPs con el title y snippet correctos.

### Flujo 2: Un lead comparte una URL en LinkedIn

1. Un partner comparte `https://procesos.immoralia.es/sector/salud` en LinkedIn.
2. LinkedIn hace fetch de la URL y lee las meta Open Graph.
3. Muestra un preview con:
   - Imagen: OG image dinámica de la landing de salud (logo + nombre del sector + accent color del sector).
   - Título: title específico de la landing.
   - Descripción: meta description específica.
4. El CTR desde ese share aumenta comparado con el preview genérico anterior.

### Flujo 3: Ciclo de creación de los metadatos

1. Claude, con acceso a `src/data/processes.ts` y los archivos `<sector>Blocks.ts`, genera un borrador de `title` + `description` para cada página pública siguiendo los patrones canonizados en esta SPEC.
2. David revisa los borradores (según política decidida en ambigüedad 4).
3. Los metadatos aprobados se materializan en el código: cada `page.tsx` afectado exporta su `generateMetadata` que construye el objeto Metadata a partir de los datos del catálogo + los patrones.
4. Se despliega. Google recrastrea y actualiza el índice progresivamente.

### Flujo 4: OG image dinámica se genera al pedirse

1. Cuando LinkedIn u otro consumidor pide `https://procesos.immoralia.es/catalogo/procesos/{slug}/opengraph-image` (o la URL que Next.js resuelva), Next genera al vuelo un PNG.
2. La imagen incluye: logo + nombre del proceso + tagline + accent color del sector.
3. Se cachea agresivamente (respuesta con Cache-Control largo).

---

## Flujos alternativos / Edge cases

- **Página sin datos suficientes para generar metadata:** fallback al metadata del root layout. Nunca queda sin `<title>`.
- **Título generado que excede 60 caracteres:** el patrón se ajusta o se trunca de forma controlada. El pipeline de generación valida longitud antes de commitear.
- **Description generada que excede 160 caracteres:** idem. Se trunca en el último punto natural.
- **Caracteres especiales en el nombre del proceso (comillas, ampersands):** se escapan con `JSON.stringify` o el equivalente que Next use internamente. No hay riesgo de HTML mal formado.
- **URL canónica en host fantasma (`immoralia-hub.vercel.app`):** el canonical siempre apunta a `procesos.immoralia.es` (base `NEXT_PUBLIC_SITE_URL`). Aunque la URL de acceso sea la fantasma, el canonical redirige la autoridad al oficial. Coherente con SPEC-13 (noindex en hosts no oficiales).
- **UTMs o query params en la URL:** el canonical se declara sin query string. Ningún parámetro entra en el canonical. Evita duplicados por UTMs.
- **OG image no se puede generar (fallo runtime):** el consumidor recibe la OG genérica del root layout. Nunca queda sin preview.
- **Proceso con `hidden: true`:** la ficha no se sirve (404). No aplica metadata específico.

---

## Criterios de aceptación

- [ ] CA-01: La home `https://procesos.immoralia.es/` devuelve HTML con `<title>` específico (no el genérico "Immoralia - Catálogo de Procesos"), `<meta name="description">` específica (~155 caracteres), `<link rel="canonical" href="https://procesos.immoralia.es/">` y bloque completo de `<meta property="og:*">`.
- [ ] CA-02: Cada una de las 10 landings de sector (`/sector/*`) devuelve HTML con `<title>` único que menciona el sector (ej. "Automatizaciones para centros de salud | Immoralia"), description específica del sector (~155 caracteres) y canonical propio.
- [ ] CA-03: Cada una de las 9 páginas de auditorías devuelve `<title>` y description específicos.
- [ ] CA-04: `/catalogo/completo` devuelve `<title>` y description específicos.
- [ ] CA-05: Cada una de las 161 fichas de proceso (`/catalogo/procesos/{slug}`) devuelve `<title>` y description generados a partir del proceso concreto (`nombre`, `landing_slug`, prosa citable de SPEC-22). Verificable con muestra aleatoria de 10 slugs distintos.
- [ ] CA-06: TODAS las URLs incluyen `<link rel="canonical" href="{URL absoluta con base https://procesos.immoralia.es}">` sin trailing slash extraño ni query params.
- [ ] CA-07: TODAS las URLs incluyen bloque Open Graph completo: `og:type`, `og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale` (`es_ES`), `og:image` (URL absoluta a la OG image dinámica de la ruta).
- [ ] CA-08: TODAS las URLs incluyen bloque Twitter Card: `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image` (reutilizando la OG image).
- [ ] CA-09: `curl https://procesos.immoralia.es/catalogo/procesos/{slug}/opengraph-image` (o la URL que Next.js resuelva para el OG image dinámico) devuelve un PNG válido con dimensiones 1200×630 (estándar Open Graph).
- [ ] CA-10: Validación en `https://www.opengraph.xyz/` u `https://cards-dev.twitter.com/validator` de una ficha de proceso muestra el preview con imagen específica (no la genérica).
- [ ] CA-11: NO existe ninguna página pública sin metadata propio (verificable con grep en `src/app` de que TODAS las `page.tsx` exportan `metadata` o `generateMetadata`).
- [ ] CA-12: Ningún `<title>` supera 60 caracteres visibles en SERP (contando espacios). Ninguna description supera 160.
- [ ] CA-13: Google Rich Results Test de al menos una URL de cada tipo (home, sector, ficha, auditoría, catálogo completo) NO reporta errores de metadata.
- [ ] CA-14: `<html lang="es">` (ya presente en SPEC-13) se mantiene. `og:locale` = `es_ES`.

---

## Modelo de datos

### Entidades nuevas o modificadas

Ninguna migración de BBDD requerida.

Los patrones de metadata se derivan de campos ya existentes:
- Home: constantes centralizadas.
- Landings de sector: campos de `<sector>Blocks.ts` (título, descripción del sector).
- Fichas de proceso: campos de `src/data/processes.ts` (`nombre`, `landing_slug`, `descripcion_citable` post-SPEC-22, `tagline`).
- Auditorías: constantes por sector.

Sigue REGLA #1 del CLAUDE.md: la fuente de contenido sigue siendo TypeScript.

### Relaciones

No aplica.

### Migraciones necesarias

No aplica.

---

## UI / Páginas afectadas

### Páginas nuevas

- **OG image dinámica por ruta** — `opengraph-image.tsx` (o similar convención de Next.js) en cada carpeta de ruta pública que requiera OG específica: home, cada `/sector/*`, cada `/auditorias/*`, `/catalogo/completo`, y la ruta dinámica `/catalogo/procesos/[slug]`.

### Páginas modificadas

- **Root layout** — mantiene el metadata genérico como fallback. Se ajusta `openGraph.locale = 'es_ES'` si no lo tiene, `openGraph.siteName` = "Immoralia".
- **Todas las páginas `page.tsx` públicas** — se les añade `export const metadata` (páginas estáticas) o `export async function generateMetadata` (páginas dinámicas).

### Componentes reutilizables

- **Helper `buildProcessMetadata(process, sector)`** — función que dado un proceso, devuelve el objeto Metadata correspondiente.
- **Helper `buildSectorMetadata(sector)`** — idem para landings de sector.
- **Constantes de patrones** — templates canónicos de title/description por tipo de página.

### Breakpoints obligatorios

No aplica (no hay UI visual, solo metadata en `<head>`).

### Estándar de calidad visual

- **OG images:** consistencia visual con la paleta del catálogo (fondo `bg-[#0d0d0d]`, accent color por sector). Se aplica el criterio de las skills de diseño del proyecto.

---

## API / Endpoints

### Endpoints nuevos

Ninguno directo. Las OG images dinámicas viven como recursos de Next.js resueltos automáticamente por el convention `opengraph-image.tsx`.

### Endpoints modificados

Ninguno.

### Contratos de request/response

No aplica.

---

## Notas de seguridad

### Datos sensibles involucrados

Ninguno.

### Validaciones server-side requeridas

Sanitización de strings al construir los objetos Metadata: usar `JSON.stringify` o los helpers de Next.js — nunca concatenación directa a HTML.

### Autenticación y autorización

No aplica — metadata público.

### Otros riesgos identificados

- **Riesgo de metadata contaminado por datos sucios en `processes.ts`:** si algún proceso tiene `nombre` con caracteres extraños o `descripcion_citable` mal formada, el metadata resultante puede ser feo. Mitigado por revisión humana del piloto SPEC-22 (los procesos con citable ya revisado no darán problemas). Los procesos sin `descripcion_citable` usan `descripcionDetallada` como fallback.
- **Riesgo de OG image dinámica con datos faltantes:** si un proceso no tiene tagline o sector, la imagen queda con placeholder. Mitigado por defaults sensatos en el template de generación.
- **Riesgo de canonical mal apuntado:** si `NEXT_PUBLIC_SITE_URL` cambia (ej. SPEC-20 de migración a subdirectorio), TODOS los canonicals cambian de golpe. Deseable — mantiene consistencia — pero requiere validación post-cambio.

*(SECURITY-AGENT aplicará el checklist. Esta SPEC no toca autenticación, BBDD ni inputs de usuario.)*

---

## Plan de implementación

### Arquitectura propuesta

Cinco piezas:

1. **Constantes de patrones canónicos** — un módulo que declara los templates de title y description por tipo de página, con placeholders. Ejemplo: `TITLE_PATTERN_PROCESO = "{nombre} — Automatización para {sector} | Immoralia"`.

2. **Helpers de construcción de metadata** — funciones puras que dado un objeto de datos (proceso, sector, etc.) devuelven el `Metadata` object completo. Incluye title, description, canonical, openGraph, twitter.

3. **Integración con las páginas** — cada `page.tsx` público:
   - Estático (home, sectores, auditorías, catálogo, privacidad): `export const metadata = buildXXXMetadata(...)`.
   - Dinámico (fichas de proceso): `export async function generateMetadata({ params }) { ... }` que resuelve los datos del proceso desde `processes.ts` según el slug.

4. **OG images dinámicas** — un `opengraph-image.tsx` por ruta afectada usando la ImageResponse API de Next.js. Componente React server que genera el PNG.

5. **Generación asistida por Claude de los textos** — pipeline puntual (script + revisión) que pobló los patrones para las URLs con datos suficientes. Los patrones canónicos son fijos; los VALORES concretos (title + description por página) se generan desde los datos del proceso/sector.

### Desglose de tareas

1. **DATA-AGENT — Análisis previo:** confirmar que todos los procesos incluidos en el alcance tienen los campos requeridos (nombre, landing_slug, tagline o descripcion_citable). Reportar procesos con datos insuficientes.

2. **CONTENT-AGENT — Definir patrones canónicos** (según ambigüedades 1 y 2):
   - Patrones exactos de title por tipo de URL (home, sector, ficha, auditoría, catálogo).
   - Patrones exactos de description por tipo de URL.
   - Longitudes objetivo (title ≤60, description ≤160).

3. **FRONTEND-AGENT — Helpers y constantes:**
   - Módulo con las constantes de patrón.
   - Helpers `buildRootMetadata`, `buildSectorMetadata`, `buildAuditMetadata`, `buildProcessMetadata`, `buildFullCatalogMetadata`.

4. **FRONTEND-AGENT — OG images dinámicas** (según ambigüedad 3):
   - Template React server para la OG image (logo + título + accent color según sector).
   - `opengraph-image.tsx` por cada ruta relevante.

5. **FRONTEND-AGENT — Integración en cada page.tsx:**
   - Home, sectores (10), auditorías (9), catálogo completo, privacidad → `export const metadata`.
   - Fichas de proceso → `export async function generateMetadata`.

6. **VERIFICACIÓN POST-DEPLOY:**
   - Ejecutar CA-01 a CA-14 con curl + parseo del HTML + validadores externos (opengraph.xyz, Google Rich Results Test).
   - Muestra aleatoria de 10 fichas de proceso.

### Dependencias con otras specs

- **Bloqueada por:** SPEC-17 (SSG estable), idealmente SPEC-22 (prosa citable disponible al menos en el piloto). SI SPEC-22 no está terminada, se usa `descripcionDetallada` legacy como fallback en las fichas fuera del piloto.
- **Coordina con:** SPEC-16 (los schemas JSON-LD ya usan `NEXT_PUBLIC_SITE_URL` — el canonical también).
- **Alimenta a:** SPEC-19 (una vez visibles los metadatos en SERPs, GSC empieza a acumular datos de CTR y posición por URL — SPEC-19 los usará para refinar H1s).
- **Se refina con:** SPEC-23 (cuando haya datos GSC de 4+ semanas, revisar qué patrones convierten mejor y ajustar).

### Lecciones aplicables (LESSONS-LEARNED.md)

- **LL-006 (whitelist explícita):** los patrones canónicos declaran exactamente qué campos del proceso se usan. Si en el futuro se elimina un campo de `processes.ts`, la construcción de metadata falla en build (no silenciosamente en runtime).
- **LL-005 (dolores son el campo con más impacto en matching semántico):** aplica al pipeline de generación de description — si el proceso tiene `dolores` bien redactados, la description resultante encaja mejor con las queries reales.

---

## Tests requeridos

### Tests unitarios

Ninguno directo. Los helpers son puros y se validan mejor con tests de integración post-deploy.

### Tests de integración

CA-01 a CA-14 con curl + parseo + validadores externos.

### Tests E2E

No aplica.

*(P9 — Tests donde aportan valor.)*

---

## Out of scope (explícito)

- Reescribir el copy visible en las páginas (esto es solo metadata en `<head>`, no toca el texto que ve el usuario en la página).
- Refinar los H1 y subheaders de las landings (eso es SPEC-19).
- Traducción multi-idioma. El catálogo es solo español.
- Metadata específico para páginas privadas (`/admin`, `/afiliado`). Mantienen el fallback del root layout — no hay necesidad SEO.
- A/B testing de patrones de metadata. Fuera de scope; puede evaluarse en SPEC futura si SPEC-23 revela diferencias claras entre patrones.
- Structured Data / JSON-LD adicional. Cubierto por SPEC-16 y SPEC-22.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-30 | Versión inicial — modo creación a partir del plan SEO + GEO (ClickUp knvz4-239675). | David Navarrete |
| 1.1 | 2026-06-30 | Resuelta ambigüedad 1: patrón de `<title>` cliente-primero (Opción A). Home: `Automatiza los procesos de tu negocio \| Immoralia`. Sector: `Automatiza tu {sector} — Immoralia`. Ficha: `{nombre_proceso} para {sector} \| Immoralia`. Auditoría: `Auditoría gratuita para {sector} \| Immoralia`. Catálogo: `Catálogo de automatizaciones \| Immoralia`. Todos ≤60 caracteres. | David Navarrete |
| 1.2 | 2026-06-30 | Resuelta ambigüedad 2: patrón de meta description derivada de datos + CTA (Opción A), pero SIN incluir tiempos de implementación (decisión de negocio para preservar margen comercial). Ficha usa `descripcion_citable` (SPEC-22) o `tagline` como fallback + sector + CTA genérico. Todas ~155 caracteres. | David Navarrete |
| 1.3 | 2026-06-30 | Resuelta ambigüedad 3: OG images generadas dinámicamente con `opengraph-image.tsx` nativo de Next 15 (Opción A). Un archivo por ruta relevante. Se cachea automáticamente. Sin dependencias externas. | David Navarrete |
| 1.4 | 2026-06-30 | Spec aprobada para implementación. | David Navarrete |
