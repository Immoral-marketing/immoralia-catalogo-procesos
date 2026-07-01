# SPEC-21: GEO Foundation — LLMS.txt

**Versión:** 1.4
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-30
**Owner:** David Navarrete

---

## Descripción

Publicar en el catálogo un archivo `llms.txt` — estándar emergente propuesto por Anthropic — que sirve como "índice legible por LLMs" del sitio. A diferencia del sitemap (dirigido a rastreadores tradicionales), el `llms.txt` es un documento Markdown escrito para que ChatGPT, Claude, Perplexity y Gemini entiendan de un vistazo qué es el catálogo, qué contenido tiene y cómo navegarlo. Cierra la Fase 1 SEO + GEO: los permisos para los bots de IA en robots.txt ya se cubrieron en SPEC-14; esta SPEC completa el par publicando el archivo que esos bots buscan.

---

## Actores

- **Rastreador de IA (GPTBot, ClaudeBot, PerplexityBot, Gemini, otros):** pide `/llms.txt`, obtiene una descripción estructurada del catálogo y usa esa información para responder mejor a preguntas de sus usuarios que involucren automatización de procesos empresariales.
- **Usuario final de un LLM:** indirectamente, cuando pregunta a ChatGPT/Claude/Perplexity "¿cómo automatizo la agenda de mi centro de salud?", el LLM tiene más probabilidad de citar `procesos.immoralia.es` como fuente si el `llms.txt` está bien construido.
- **Administrador del catálogo (David):** verifica que el archivo se sirve correctamente y que refleja el estado actual del sitio.

---

## Flujos principales

### Flujo 1: Un bot de IA descubre y lee el llms.txt

1. El bot de IA visita `https://procesos.immoralia.es/robots.txt` (ya cubierto por SPEC-14, con `Allow: /` para su user-agent).
2. Con el permiso confirmado, el bot pide `https://procesos.immoralia.es/llms.txt`.
3. El servidor devuelve el contenido en Markdown.
4. El bot parsea la estructura (título, descripción, secciones de enlaces) y lo incorpora a su modelo de comprensión del sitio.
5. Cuando un usuario del LLM hace una consulta relevante, el LLM tiene contexto suficiente para citar el catálogo.

### Flujo 2: Consulta manual del llms.txt

1. Cualquier persona (David, un partner interesado, un lead) puede abrir `https://procesos.immoralia.es/llms.txt` en un navegador.
2. Ve el archivo Markdown como texto plano (los navegadores no lo renderizan como HTML, pero es legible).
3. Puede usar la información para entender rápidamente qué cubre el catálogo sin navegar por todas las páginas.

### Flujo 3: Actualización tras cambio en el catálogo

1. Cuando se añade un sector nuevo o cambia una landing (ej. se activa `/sector/nuevo-sector`), el `llms.txt` debe reflejar el cambio.
2. Si el archivo es estático: hay que editarlo manualmente en el mismo PR que introduce el nuevo sector.
3. Si el archivo es dinámico: se regenera automáticamente en el siguiente deploy (ver ambigüedad 2).

---

## Flujos alternativos / Edge cases

- **Rastreador de IA en host no oficial (staging.immoralia.es, immoralia-hub.vercel.app):** el archivo se sirve igual, pero el middleware de SPEC-13 añade la cabecera `X-Robots-Tag: noindex`. Los bots de IA modernos respetan esa cabecera y descartan la URL. Cero impacto.
- **Rastreador que NO conoce el estándar llms.txt:** simplemente ignora el archivo. No hay error.
- **Sector nuevo añadido sin actualizar el llms.txt:** el archivo queda desactualizado durante un tiempo hasta el próximo cambio. Impacto bajo — los bots de IA que ya conocen el catálogo por otras señales seguirán encontrándolo. Mitigado si se opta por versión dinámica.
- **Archivo pedido con formato incorrecto (ej. `/llms.txt/` con trailing slash):** Next.js normaliza; devuelve 200 con el contenido.
- **Cambio en `NEXT_PUBLIC_SITE_URL`:** todas las URLs absolutas del `llms.txt` deben reflejar el nuevo dominio. En versión dinámica se actualiza solo; en estática hay que editarlo.

---

## Criterios de aceptación

- [ ] CA-01: `curl https://procesos.immoralia.es/llms.txt` devuelve HTTP 200 con `Content-Type: text/plain; charset=utf-8` (o `text/markdown` si se sirve como tal).
- [ ] CA-02: El contenido es Markdown válido y arranca con un `H1` (`# procesos.immoralia.es`) seguido de un párrafo de descripción del catálogo.
- [ ] CA-03: El archivo incluye una sección `## Páginas clave` (o equivalente en el idioma decidido) con enlaces a: home, catálogo completo, cada una de las 10 landings de sector, e índice de auditorías.
- [ ] CA-04: Cada enlace del `llms.txt` es una URL absoluta con base `https://procesos.immoralia.es/` (no relativa, no rota).
- [ ] CA-05: El archivo NO contiene enlaces a rutas privadas (`/admin`, `/afiliado`, `/api/*`) ni a URLs de redirect (`/sector/restauracion`, `/sector/inmobiliaria`).
- [ ] CA-06: El archivo menciona los 10 sectores cubiertos por el catálogo (salud, gestorías, centros deportivos, construcción, desarrolladoras, gastronomía-hostelería, academias, agencias, e-commerce, industrial).
- [ ] CA-07: El archivo pasa una lectura manual "de vista": queda claro qué es el catálogo, para quién es y qué contiene, sin necesidad de visitar ninguna URL.
- [ ] CA-08: `curl https://staging.immoralia.es/llms.txt` devuelve el contenido normalmente PERO con cabecera `X-Robots-Tag: noindex, nofollow` (heredado de SPEC-13).
- [ ] CA-09: El archivo se sirve desde la URL raíz sin subruta — `/llms.txt`, no `/api/llms.txt` ni `/docs/llms.txt`.
- [ ] CA-10: El nivel de detalle y las rutas incluidas coinciden con lo decidido en ambigüedad 1.

---

## Modelo de datos

### Entidades nuevas o modificadas

No aplica.

### Relaciones

No aplica.

### Migraciones necesarias

No aplica.

> Nota: si se opta por generación dinámica (ver ambigüedad 2), el contenido se construye leyendo el archivo de datos del catálogo (`src/data/processes.ts`) — misma fuente que sitemap.ts en SPEC-14. Coherente con REGLA #1 del CLAUDE.md.

---

## UI / Páginas afectadas

### Páginas nuevas

- **`/llms.txt`** — archivo público de texto plano en Markdown.

### Páginas modificadas

Ninguna.

### Componentes reutilizables

Ninguno.

### Breakpoints obligatorios

No aplica.

### Estándar de calidad visual

No aplica — es un archivo de texto.

---

## API / Endpoints

### Endpoints nuevos

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| GET | `/llms.txt` | Archivo Markdown que describe el catálogo para LLMs | Pública |

### Endpoints modificados

Ninguno.

### Contratos de request/response

Respuesta: `Content-Type: text/plain; charset=utf-8`. Cuerpo: texto en Markdown, en el idioma decidido en ambigüedad 4.

---

## Notas de seguridad

### Datos sensibles involucrados

Ninguno. El contenido del `llms.txt` es una descripción pública del sitio.

### Validaciones server-side requeridas

Ninguna.

### Autenticación y autorización

No aplica — recurso público.

### Otros riesgos identificados

- **Riesgo de exposición inadvertida de rutas privadas:** mitigado por CA-05 (verificación explícita) y por construcción — el `llms.txt` se construye a partir de una lista blanca de rutas públicas, nunca escaneando el sistema de archivos.
- **Riesgo de contenido obsoleto:** mitigado según ambigüedad 2 (versión dinámica se auto-actualiza; versión estática requiere disciplina de mantenimiento).

*(SECURITY-AGENT aplicará el checklist de `.brianspec/security-checklists.md` sección "Tipo: web-app". Esta SPEC no toca autenticación, BBDD, inputs de usuario ni secretos.)*

---

## Plan de implementación

### Arquitectura propuesta

Una única pieza:

- **Route handler dinámico `app/llms.txt/route.ts`** — devuelve el contenido como `Content-Type: text/plain; charset=utf-8`. Compone el Markdown a partir de:
  - Una constante con la descripción fija del catálogo (2–3 párrafos redactados).
  - Una lista declarativa de sectores (con URL, nombre legible, línea de descripción por sector).
  - Referencia a `NEXT_PUBLIC_SITE_URL` como base para las URLs absolutas.

El route handler se cachea agresivamente (`revalidate` alto, ej. 24 h) porque el contenido cambia solo cuando se añade un sector nuevo → invalidación implícita por deploy.

### Desglose de tareas

1. **CONTENT-AGENT — Redacción del contenido:** redactar el texto del `llms.txt` en el idioma decidido (ambigüedad 4), con el nivel de detalle decidido (ambigüedad 1). Estructura mínima:
   - `H1` con el dominio y una frase de descripción.
   - `H2 ## Descripción` (o similar) — 2–3 párrafos explicando qué es el catálogo y para quién.
   - `H2 ## Páginas clave` con lista de enlaces principales.
   - Si aplica según ambigüedad 3: `H2 ## Sectores cubiertos` con enlace a cada landing.
   - Si aplica según ambigüedad 3: sección `H2 ## Automatizaciones destacadas` con procesos individuales.

2. **FRONTEND-AGENT — Publicación del archivo:** crear `app/llms.txt/route.ts` que devuelve el contenido en Markdown componiendo la descripción fija con la lista declarativa de sectores. Header `Content-Type: text/plain; charset=utf-8`. Cachear con `revalidate: 86400` (24h).

3. **VERIFICACIÓN POST-DEPLOY:**
   - Ejecutar CA-01 a CA-09 con `curl` y `grep`.
   - Comprobar CA-08 con `curl -I` para verificar la cabecera noindex en staging (heredada de SPEC-13).
   - Lectura manual "de vista" (CA-07).

### Dependencias con otras specs

- **Bloqueada por:** SPEC-14 (los permisos para los bots de IA en robots.txt son prerrequisito — sin ellos, algunos bots ni siquiera intentarán leer el `llms.txt`).
- **Coordina con:** SPEC-14 en mergeo temporal (se recomienda mergear las dos cerca en el tiempo para dejar la Fase 1 completa).
- **No bloquea a:** ninguna otra SPEC directamente. Contribuye a SPEC-22 (contenido citable) porque las URLs listadas aquí son las que el bot rastreará después para consumir contenido.

### Lecciones aplicables (LESSONS-LEARNED.md)

- **LL-006 (whitelist explícita):** el `llms.txt` se construye a partir de una lista blanca declarativa de rutas y sectores. No se autogenera escaneando; se declara qué se incluye.

---

## Tests requeridos

### Tests unitarios

Ninguno requerido.

### Tests de integración

CA-01 a CA-09 ejecutados con `curl` y `grep` post-deploy.

### Tests E2E

No aplica.

*(P9 — Tests donde aportan valor. Es un archivo estático de texto — la verificación con curl es suficiente.)*

---

## Out of scope (explícito)

- Permisos para bots IA en robots.txt (ya cubiertos por SPEC-14 aprobada).
- Marcado JSON-LD adicional para IAs (cubierto por SPEC-16 aprobada; `FAQPage` y `HowTo` vendrán en SPEC-22).
- Redacción del contenido "citable" en las fichas de proceso (eso es SPEC-22 completa).
- Tracking de si los bots de IA realmente están leyendo el `llms.txt` (fuera del alcance — es una convención emergente sin herramientas de observabilidad estándar).
- `llms-full.txt` complementario (ver ambigüedad 3 — puede quedar como decisión pendiente).

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-30 | Versión inicial — modo creación a partir del plan SEO + GEO (ClickUp knvz4-239675). | David Navarrete |
| 1.1 | 2026-06-30 | Resuelta ambigüedad 1: nivel de detalle intermedio (Opción A). Incluye descripción + páginas top-level + los 10 sectores con URL y línea de descripción. NO incluye los 179 procesos individuales. | David Navarrete |
| 1.2 | 2026-06-30 | Resuelta ambigüedad 2: archivo dinámico vía route handler (Opción B tras reflexión del usuario sobre crecimiento del catálogo). Coherente con sitemap.ts. Se autoactualiza al añadir sectores/procesos, sin intervención manual. Cache 24h. | David Navarrete |
| 1.3 | 2026-06-30 | Resueltas ambigüedades menores: (3) NO se añade `llms-full.txt` en esta SPEC — se evalúa en el futuro cuando SPEC-22 esté terminada. (4) Idioma del `llms.txt` = español, coherente con el idioma del sitio. | David Navarrete |
| 1.4 | 2026-06-30 | Spec aprobada para implementación. | David Navarrete |
