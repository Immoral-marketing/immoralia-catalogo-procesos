# SPEC-16: Structured Data — JSON-LD base

**Versión:** 1.5
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-30
**Owner:** David Navarrete

---

## Descripción

Dotar al catálogo de marcado semántico estructurado (JSON-LD según schema.org) en las páginas clave para que Google, Bing y los rastreadores de IAs entiendan qué representa cada URL: quién es el proveedor, dónde está la página en la jerarquía del sitio, y qué servicio describe cada ficha de proceso. Habilita rich snippets en SERPs (breadcrumbs visibles, panel de organización) y mejora la comprensión semántica por parte de modelos de lenguaje. No incluye FAQPage ni HowTo — eso queda para SPEC-22, cuando se haya redactado el contenido específico.

---

## Actores

- **Rastreador de buscador (Googlebot, Bingbot):** lee el JSON-LD inyectado en el HTML y enriquece la presentación de la URL en resultados (breadcrumbs, knowledge panel).
- **Rastreador de IA (GPTBot, ClaudeBot, PerplexityBot):** extrae los datos estructurados para entender el contenido y citarlo con mayor precisión.
- **Visitante anónimo:** no percibe ningún cambio — los `<script type="application/ld+json">` son invisibles para el usuario.

---

## Flujos principales

### Flujo 1: Rastreador lee Organization en cualquier página

1. El rastreador pide cualquier URL del catálogo.
2. El servidor devuelve el HTML, que en el `<head>` incluye un `<script type="application/ld+json">` con el schema `Organization` (renderizado desde el root layout, aplica a todas las páginas).
3. El rastreador parsea el JSON, identifica al proveedor (Immoralia) y lo asocia a la URL.

### Flujo 2: Rastreador lee BreadcrumbList en landing de sector

1. El rastreador pide `https://procesos.immoralia.es/sector/salud`.
2. La respuesta incluye un `<script type="application/ld+json">` con el schema `BreadcrumbList` describiendo la jerarquía: Inicio → Sector salud.
3. El rastreador extrae los breadcrumbs y los muestra como rich snippet en la SERP.

### Flujo 3: Rastreador lee BreadcrumbList + Service en ficha de proceso

1. El rastreador pide `https://procesos.immoralia.es/catalogo/procesos/{slug}`.
2. La respuesta incluye dos schemas:
   - `BreadcrumbList`: Inicio → Sector → Proceso.
   - `Service`: nombre del proceso, descripción, proveedor (Organization), categoría (sector), área servida.
3. Google entiende que la URL es la presentación de un servicio concreto ofrecido por Immoralia.

### Flujo 4: Validación con Google Rich Results Test

1. El owner copia la URL pública o el HTML renderizado y lo pega en `https://search.google.com/test/rich-results`.
2. La herramienta detecta los schemas presentes, valida la estructura y confirma elegibilidad para rich snippets.

---

## Flujos alternativos / Edge cases

- **Página sin schema aplicable (ej. `/privacidad`):** solo lleva el `Organization` heredado del root layout. No se añade BreadcrumbList ni Service. Aceptable — no toda página necesita rich snippets.
- **Sector sin landing dedicada (procesos universales sin `landing_slug`):** la ficha de proceso construye su BreadcrumbList con un sector "Catálogo" en lugar de un sector concreto.
- **Proceso con `hidden: true`:** la ficha no se sirve públicamente (404), por tanto no aplica.
- **Datos faltantes en el archivo de procesos** (ej. proceso sin `nombre`): la inyección no debe romper el render. El schema Service afectado se omite (silencioso) y se loguea en consola del servidor.
- **JSON-LD malformado** (escapado incorrecto de caracteres especiales): rompe la validez del schema. Mitigado al construir el objeto JS y serializarlo con `JSON.stringify` (no concatenación de strings).
- **Validación Rich Results falla**: bloquea el cumplimiento de CAs. Se itera el contenido del schema hasta que pase.

---

## Criterios de aceptación

- [ ] CA-01: `curl https://procesos.immoralia.es/` devuelve HTML que contiene UN `<script type="application/ld+json">` con `@type: "Organization"`. El JSON parsea sin error y los campos requeridos por schema.org (`name`, `url`, `logo`) están presentes.
- [ ] CA-02: La misma página `/` incluye un segundo `<script type="application/ld+json">` con `@type: "WebSite"`. Campos presentes: `name: "Immoralia"`, `url: "https://procesos.immoralia.es"`, `inLanguage: "es"`. NO contiene `potentialAction`/`SearchAction` (decidido en ambigüedad 2 — el catálogo no tiene buscador parametrizable).
- [ ] CA-03: `curl https://procesos.immoralia.es/sector/salud` devuelve HTML que contiene un `<script type="application/ld+json">` con `@type: "BreadcrumbList"` que describe la jerarquía Inicio → Sector. Los `position`, `name` y `item` están correctamente serializados.
- [ ] CA-04: Lo mismo para las otras 9 landings de sector (`/sector/gestorias`, `/sector/centros-deportivos`, `/sector/construccion`, `/sector/desarrolladoras`, `/sector/gastronomia-hosteleria`, `/sector/academias`, `/sector/agencias`, `/sector/ecommerce`, `/sector/industrial`).
- [ ] CA-05: `curl https://procesos.immoralia.es/catalogo/procesos/{slug}` (con un slug real cualquiera) devuelve HTML que contiene un `<script type="application/ld+json">` con `@type: "BreadcrumbList"` describiendo Inicio → Sector → Proceso. El sector intermedio se construye a partir del `landing_slug` del proceso; si el proceso no tiene `landing_slug`, el sector intermedio se reemplaza por una entrada "Catálogo" con URL `/catalogo/completo`.
- [ ] CA-06: La misma ficha incluye un segundo `<script type="application/ld+json">` con `@type: "Service"`. Campos requeridos presentes: `name` (del proceso), `description`, `provider` (Organization), `serviceType`. Campos opcionales si están disponibles: `category` (sector), `areaServed` (España).
- [ ] CA-07: `curl https://procesos.immoralia.es/catalogo/completo` devuelve HTML que contiene un `<script type="application/ld+json">` con `@type: "BreadcrumbList"` que describe Inicio → Catálogo completo.
- [ ] CA-08: Validación en `https://search.google.com/test/rich-results` de la home (`/`) detecta `Organization` y `WebSite` SIN errores ni advertencias.
- [ ] CA-09: Validación en Rich Results Test de cualquier `/sector/{slug}` detecta `BreadcrumbList` SIN errores ni advertencias.
- [ ] CA-10: Validación en Rich Results Test de cualquier `/catalogo/procesos/{slug}` detecta `BreadcrumbList` y `Service` SIN errores ni advertencias.
- [ ] CA-11: Validación adicional en `https://validator.schema.org/` de cada uno de los tipos anteriores no devuelve errores de estructura.
- [ ] CA-12: El JSON-LD inyectado NO contiene placeholders sin sustituir (ej. `{{nombre}}`, `null`, `undefined`) en ninguna página.
- [ ] CA-13: Las páginas que no necesitan schemas específicos (ej. `/privacidad`) heredan solo el `Organization` y `WebSite` del root layout. No fallan ni añaden schemas vacíos.
- [ ] CA-14: La adición del JSON-LD no rompe la funcionalidad existente — todas las landings, fichas de proceso, auditorías, chatbot, formularios y panel admin siguen funcionando igual.

---

## Modelo de datos

### Entidades nuevas o modificadas

No aplica. Esta SPEC no toca BBDD.

### Relaciones

No aplica.

### Migraciones necesarias

No aplica.

> Nota: los datos del schema `Service` se construyen leyendo el archivo de datos del catálogo (`src/data/processes.ts`) con los mismos campos que ya consumen las landings (`nombre`, `descripcionDetallada` o `tagline`, `landing_slug`).

---

## UI / Páginas afectadas

### Páginas nuevas

Ninguna.

### Páginas modificadas

- **Root layout** — añade `Organization` y `WebSite` (aplican a todas las páginas hijas).
- **10 landings de sector** — añaden `BreadcrumbList`.
- **161 fichas de proceso** (`/catalogo/procesos/[slug]`) — añaden `BreadcrumbList` y `Service`.
- **Página catálogo completo** (`/catalogo/completo`) — añade `BreadcrumbList`.

### Componentes reutilizables

Se introduce un helper común para inyectar JSON-LD server-side. Permite a cada página declarar qué schemas quiere añadir sin reescribir la lógica de serialización (ver ambigüedad 4).

### Breakpoints obligatorios

No aplica — no hay UI visual.

### Estándar de calidad visual

No aplica.

---

## API / Endpoints

### Endpoints nuevos

Ninguno.

### Endpoints modificados

Ninguno. El JSON-LD se inyecta en el `<head>` del HTML, no es un endpoint independiente.

### Contratos de request/response

No cambia ningún contrato.

---

## Notas de seguridad

### Datos sensibles involucrados

Ninguno. Los datos en los schemas son todos públicos (nombre de la empresa, nombres de procesos, URLs).

### Validaciones server-side requeridas

Construir los objetos en JS y serializar con `JSON.stringify` antes de inyectar. No concatenar strings directamente en el HTML para evitar XSS por valores con comillas o tags.

### Autenticación y autorización

No aplica.

### Otros riesgos identificados

- **Riesgo de XSS por inyección de strings sin escapar:** mitigado por uso obligatorio de `JSON.stringify` y, si Next.js lo requiere, encoding adicional al renderizar `<script>` (atributo `dangerouslySetInnerHTML` con contenido ya serializado).
- **Riesgo de JSON inválido por caracteres especiales:** mitigado por construcción — los caracteres se escapan automáticamente en `JSON.stringify`.
- **Riesgo de información obsoleta en los schemas:** si Immoralia cambia su nombre legal, logo o redes sociales, hay que actualizar el código. Para minimizar este riesgo, los valores del `Organization` se centralizan en una constante (no se hardcodean en cada página).

*(SECURITY-AGENT aplicará el checklist de `.brianspec/security-checklists.md` sección "Tipo: web-app" durante la revisión. Esta SPEC no toca autenticación, BBDD, inputs de usuario ni secretos.)*

---

## Plan de implementación

### Arquitectura propuesta

Tres piezas que viven en el mismo PR:

1. **Constante centralizada de Organization** — un módulo con los datos de Immoralia (nombre, logo URL absoluto, sameAs si aplica). Se importa desde el root layout y desde cualquier schema que necesite referenciar al proveedor (ej. `Service`).

2. **Helper de inyección JSON-LD** — un componente React server-side que recibe un objeto schema (o array de schemas) y lo renderiza como uno o varios `<script type="application/ld+json">`. Garantiza serialización segura con `JSON.stringify`.

3. **Schemas por página** — cada página afectada importa el helper y declara qué schemas inyecta:
   - Root layout: `Organization` + `WebSite`.
   - Landings de sector: `BreadcrumbList` con los datos del sector.
   - Fichas de proceso: `BreadcrumbList` + `Service` derivados del archivo `src/data/processes.ts`.
   - Catálogo completo: `BreadcrumbList` con dos niveles.

Todas las URLs absolutas usan `NEXT_PUBLIC_SITE_URL` como base (introducida en SPEC-13).

### Desglose de tareas

1. **FRONTEND-AGENT — Constante Organization:** crear el módulo con los datos canónicos de Immoralia (decididos en ambigüedad 1):

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Immoralia",
  "url": "https://procesos.immoralia.es",
  "logo": "https://procesos.immoralia.es/immoralia_logo.png",
  "description": "Catálogo de automatizaciones de procesos empresariales para pymes españolas",
  "foundingDate": "2020-10-05",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Passeig de Gràcia, Nº12",
    "addressLocality": "Barcelona",
    "addressRegion": "Barcelona",
    "postalCode": "08007",
    "addressCountry": "ES"
  },
  "parentOrganization": {
    "@type": "Organization",
    "name": "Immoral Group",
    "sameAs": [
      "https://es.linkedin.com/company/immoral-group",
      "https://www.instagram.com/immoral.group/"
    ]
  }
}
```

> ⚠️ **Logo provisional.** La URL `https://procesos.immoralia.es/immoralia_logo.png` apunta al logo actual ("im" en cian). Cuando se sustituya por el logo definitivo, basta con reemplazar el archivo en `/public/immoralia_logo.png` manteniendo el mismo nombre — no requiere tocar la constante ni redeploy.
>
> ℹ️ **sameAs en parentOrganization.** Las redes sociales son de Immoral Group (entidad matriz), no del catálogo. Se trasladan a `parentOrganization` para precisión semántica. Si en el futuro el catálogo tiene RRSS propias, se moverán al Organization principal.

2. **FRONTEND-AGENT — Helper de inyección JSON-LD:** crear el componente server-side reutilizable. Acepta un objeto schema o array y lo renderiza como `<script>` con `JSON.stringify` y escapado seguro de `</script>` y caracteres Unicode peligrosos.

3. **FRONTEND-AGENT — Root layout:** añadir `Organization` (datos especificados arriba) y `WebSite` (sin `SearchAction`, decidido en ambigüedad 2) al render del layout. El `WebSite` contiene: `name`, `url`, `inLanguage: "es"`.

4. **FRONTEND-AGENT — Landings de sector:** añadir `BreadcrumbList` a cada una de las 10 landings con la jerarquía decidida en ambigüedad 3.

5. **FRONTEND-AGENT — Ficha de proceso:** añadir `BreadcrumbList` (Inicio → Sector → Proceso) y `Service` con mapeo extensivo decidido en ambigüedad 4:

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "{process.nombre}",
  "description": "{process.descripcionDetallada}",
  "serviceType": "Automatización de proceso empresarial",
  "provider": { "@id": "https://procesos.immoralia.es/#organization" },
  "category": "{nombre legible del sector derivado de landing_slug}",
  "areaServed": {
    "@type": "Country",
    "name": "España"
  },
  "url": "https://procesos.immoralia.es/catalogo/procesos/{process.slug}"
}
```

> **Mapeo `landing_slug` → nombre legible del sector** (constante en el módulo):
> - `salud` → "Centros de salud"
> - `gestorias` → "Gestorías"
> - `centros-deportivos` → "Centros deportivos"
> - `construccion` → "Construcción"
> - `desarrolladoras` → "Desarrolladoras inmobiliarias"
> - `gastronomia-hosteleria` → "Gastronomía y hostelería"
> - `academias` → "Academias y formación"
> - `agencias` → "Agencias de marketing"
> - `ecommerce` → "E-commerce"
> - `industrial` → "Industrial"
> - (sin landing_slug, procesos universales) → "Catálogo general"
>
> El `provider` usa `@id` para referenciar al Organization declarado en el root layout (evita duplicación). El Organization expone su `@id` como `https://procesos.immoralia.es/#organization`.

6. **FRONTEND-AGENT — Catálogo completo:** añadir `BreadcrumbList` simple.

7. **VERIFICACIÓN POST-DEPLOY:**
   - Ejecutar CA-01 a CA-07 con `curl` y grep del HTML.
   - Validar manualmente en `https://search.google.com/test/rich-results` al menos: home, una landing de sector, una ficha de proceso, catálogo completo.
   - Validar adicionalmente en `https://validator.schema.org/`.

### Dependencias con otras specs

- **Bloqueada por:** SPEC-14 (no es bloqueo técnico, pero conceptualmente quieres tener sitemap + robots antes que JSON-LD para que Google rastree primero y luego enriquezca lo que ya tiene en índice).
- **Bloquea a:** SPEC-22 (FAQPage y HowTo extienden este sistema cuando haya contenido redactado).
- **Coordina con:** SPEC-15 (metadata) si las URLs absolutas de los schemas se construyen con la misma constante (`NEXT_PUBLIC_SITE_URL`) — sí, lo hacen, sin conflicto.

### Lecciones aplicables (LESSONS-LEARNED.md)

- **LL-006 (whitelist explícita):** el helper de inyección recibe schemas declarativos. Si el archivo `processes.ts` cambia y un campo desaparece, el helper falla en build (no silenciosamente) porque el objeto Schema lo referencia explícitamente.
- **LL-001 (tipos de Supabase auto-generados):** no aplica — esta SPEC no toca BBDD.

---

## Tests requeridos

### Tests unitarios

Ninguno requerido. La construcción de schemas es declarativa y se valida mejor con tests de integración con Rich Results Test post-deploy.

### Tests de integración

CA-01 a CA-13 ejecutados con `curl` + parseo del HTML + validador externo.

### Tests E2E

No aplica.

*(P9 — Tests donde aportan valor.)*

---

## Out of scope (explícito)

- `FAQPage` schema — requiere FAQs redactadas en lenguaje citable. Va en SPEC-22.
- `HowTo` schema — requiere pasos detallados redactados. Va en SPEC-22.
- `Product` schema en fichas — el catálogo no vende productos con precio, vende servicios. Por tanto se usa `Service`, no `Product`.
- `Article` o `BlogPosting` — no aplica, no hay blog.
- `Course` schema en auditorías — las auditorías no son cursos. Se podrían marcar como `WebPage` simples pero no aporta valor SEO claro. Se descarta para esta SPEC.
- Verificación automatizada continua de los schemas (GitHub Action que valide en cada PR). Posible SPEC futura.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-30 | Versión inicial — modo creación a partir del plan SEO + GEO (ClickUp knvz4-239675). | David Navarrete |
| 1.1 | 2026-06-30 | Resuelta ambigüedad 1: datos canónicos de Immoralia para Organization especificados (name, url, logo provisional, description, foundingDate, address en Barcelona). RRSS corporativas de Immoral Group declaradas como `parentOrganization` con `sameAs`. Logo marcado como provisional — sustituible cambiando solo el archivo en `/public/`. | David Navarrete |
| 1.2 | 2026-06-30 | Resuelta ambigüedad 2: WebSite schema sin `SearchAction` (Opción A). Razón: no hay buscador con URL parametrizable. Solo declara `name`, `url`, `inLanguage: "es"`. | David Navarrete |
| 1.3 | 2026-06-30 | Resuelta ambigüedad 3: jerarquía BreadcrumbList en fichas = Inicio → Sector → Proceso (Opción A, 3 niveles). Procesos sin `landing_slug` (universales) usan "Catálogo" como nivel intermedio. Coincide con CA-05 ya escrito. | David Navarrete |
| 1.4 | 2026-06-30 | Resuelta ambigüedad 4: mapeo extensivo del schema Service (Opción A). Campos: name, description, serviceType, provider (referencia @id al Organization), category (sector legible), areaServed (España), url. Añadido mapping landing_slug → nombre legible del sector. | David Navarrete |
| 1.5 | 2026-06-30 | Spec aprobada para implementación. | David Navarrete |
