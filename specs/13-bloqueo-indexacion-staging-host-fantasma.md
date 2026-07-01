# SPEC-13: Bloqueo de indexación en staging y host fantasma de Vercel

**Versión:** 1.5
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-30
**Owner:** David Navarrete

---

## Descripción

Impedir que los buscadores y rastreadores indexen cualquier copia no-oficial del catálogo de procesos. Hoy la web está disponible en tres hosts distintos que sirven el mismo contenido: el dominio oficial (`procesos.immoralia.es`), el entorno de preproducción (`staging.immoralia.es`) y el host técnico que Vercel asigna automáticamente al deploy de producción (`immoralia-hub.vercel.app`). Si Google y los rastreadores de IAs indexan los tres, ven contenido duplicado y reparten autoridad entre las tres URLs, perjudicando al dominio oficial. Esta SPEC marca todos los hosts no-oficiales como `noindex, nofollow` mediante cabeceras HTTP, dejando intacto el dominio oficial.

---

## Actores

- **Visitante anónimo:** ve la misma web en cualquier host. No le afecta — sigue navegando con normalidad.
- **Rastreador (Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, etc.):** al pedir cualquier URL en un host no-oficial, recibe la respuesta junto con la cabecera `X-Robots-Tag: noindex, nofollow` y descarta la URL del índice.
- **Pipeline de despliegue (Vercel):** sirve la web en producción (rama `main` → `procesos.immoralia.es` + `immoralia-hub.vercel.app`) y en preproducción (rama `staging` → `staging.immoralia.es`) sin cambios de configuración a nivel de pipeline.

---

## Flujos principales

### Flujo 1: Petición a host oficial (caso indexable)

1. El rastreador pide `https://procesos.immoralia.es/sector/salud`.
2. El servidor sirve la página normalmente.
3. La respuesta NO contiene la cabecera `X-Robots-Tag: noindex`.
4. El rastreador procesa la URL como contenido indexable.

### Flujo 2: Petición a entorno staging

1. El rastreador pide `https://staging.immoralia.es/sector/salud`.
2. El servidor identifica el entorno como no-producción (vía variable de entorno de Vercel).
3. La respuesta incluye la cabecera `X-Robots-Tag: noindex, nofollow`.
4. El rastreador descarta la URL.

### Flujo 3: Petición a host fantasma de Vercel

1. El rastreador pide `https://immoralia-hub.vercel.app/sector/salud`.
2. El servidor identifica que el host de la petición NO coincide con el host oficial declarado.
3. La respuesta incluye la cabecera `X-Robots-Tag: noindex, nofollow`.
4. El rastreador descarta la URL.

### Flujo 4: Petición a preview de Pull Request

1. El rastreador pide una URL en un preview de Vercel (cualquier deploy de rama que no sea production).
2. El servidor identifica el entorno como no-producción.
3. La respuesta incluye la cabecera `X-Robots-Tag: noindex, nofollow`.
4. El rastreador descarta la URL.

---

## Flujos alternativos / Edge cases

- **Subdominio nuevo no contemplado:** si en el futuro se añade otro host (ej. `demo.immoralia.es`), debe quedar también marcado como noindex por defecto. La lógica de comparación es "todo lo que NO es el host oficial declarado, va noindex".
- **Petición desde localhost en desarrollo:** durante `next dev` la variable de entorno indica desarrollo. La respuesta debe incluir `X-Robots-Tag: noindex` (consistencia, aunque localhost rara vez sea rastreado).
- **Petición a una ruta inexistente (404):** la cabecera se aplica igualmente. Una página 404 no indexable.
- **Petición a una ruta de API (`/api/*`):** el comportamiento estándar de Google es no indexar JSON, pero por defensa el `X-Robots-Tag` también se aplica a respuestas de API en hosts no oficiales.
- **Petición a assets estáticos (`/_next/static/*`, `/favicon.png`):** Next.js los sirve fuera del middleware (ver matcher actual). El bloqueo a nivel de cabecera HTTP no aplica. Esto es aceptable — los assets estáticos no son páginas indexables.
- **Petición HEAD vs GET:** la cabecera se aplica en ambas (es comportamiento por defecto de Next.js).
- **Producción ya indexada en host fantasma:** si Google ya tiene indexadas URLs de `immoralia-hub.vercel.app` antes de esta SPEC, esta SPEC solo evita futuras indexaciones. La limpieza del índice actual requiere acción manual en Google Search Console (Remove URLs Tool) — se documenta en la verificación post-deploy pero no forma parte del scope técnico de implementación.

---

## Criterios de aceptación

- [ ] CA-01: `curl -I https://procesos.immoralia.es/` NO devuelve la cabecera `x-robots-tag`.
- [ ] CA-02: `curl -I https://procesos.immoralia.es/sector/salud` NO devuelve la cabecera `x-robots-tag`.
- [ ] CA-03: `curl -I https://staging.immoralia.es/` devuelve la cabecera `x-robots-tag: noindex, nofollow`.
- [ ] CA-04: `curl -I https://staging.immoralia.es/sector/salud` devuelve la cabecera `x-robots-tag: noindex, nofollow`.
- [ ] CA-05: `curl -I https://immoralia-hub.vercel.app/` devuelve la cabecera `x-robots-tag: noindex, nofollow`.
- [ ] CA-06: `curl -I https://immoralia-hub.vercel.app/sector/salud` devuelve la cabecera `x-robots-tag: noindex, nofollow`.
- [ ] CA-07: Un deploy preview de un Pull Request (URL `*-immoralia-hub.vercel.app` o similar) devuelve la cabecera `x-robots-tag: noindex, nofollow` en cualquier ruta.
- [ ] CA-08: En `next dev` local (puerto 8080), una respuesta a `http://localhost:8080/` incluye la cabecera `x-robots-tag: noindex, nofollow`.
- [ ] CA-09: Las respuestas HTTP de cualquier ruta en hosts no oficiales siguen devolviendo el mismo status code y el mismo cuerpo (HTML o JSON) que devolvían antes de la SPEC; el único cambio observable es la presencia de la cabecera `x-robots-tag: noindex, nofollow`.
- [ ] CA-10: `curl -I https://immoralia-hub.vercel.app/catalogo/procesos/cualquier-slug` devuelve `x-robots-tag: noindex, nofollow` (la cabecera se aplica también a rutas dinámicas).
- [ ] CA-11: `curl -I https://immoralia-hub.vercel.app/api/chatbot/event` devuelve `x-robots-tag: noindex, nofollow` (la cabecera se aplica también a respuestas de API en hosts no oficiales).
- [ ] CA-12: Cuando una petición llega sin cabecera `Host` (test con `curl --resolve` o cliente HTTP a IP directa), la respuesta incluye `x-robots-tag: noindex, nofollow` (allowlist estricta por defecto).

---

## Modelo de datos

### Entidades nuevas o modificadas

No aplica. Esta SPEC no toca BBDD.

### Relaciones

No aplica.

### Migraciones necesarias

No aplica.

---

## UI / Páginas afectadas

### Páginas nuevas

Ninguna.

### Páginas modificadas

Ninguna a nivel visual. El cambio es exclusivamente en cabeceras HTTP de respuesta.

### Componentes reutilizables

Ninguno.

### Breakpoints obligatorios

No aplica.

### Estándar de calidad visual

No aplica — no hay cambios visuales.

---

## API / Endpoints

### Endpoints nuevos

Ninguno.

### Endpoints modificados

Ninguno funcionalmente. Solo se modifica la cabecera de respuesta que ya emite el framework.

### Contratos de request/response

No cambia ningún contrato. Solo se añade una cabecera de respuesta condicional.

---

## Notas de seguridad

### Datos sensibles involucrados

Ninguno. Esta SPEC no procesa datos.

### Validaciones server-side requeridas

La comparación de host se hace server-side a partir de la cabecera `host` (o equivalente) de la petición entrante, en el middleware. No se confía en ningún input del cliente para decidir si añadir noindex.

### Autenticación y autorización

No aplica.

### Otros riesgos identificados

- **Riesgo de aplicar noindex a producción por error:** si la lógica de comparación de host falla (typo en el host oficial, regex mal escrita), producción podría quedar marcada noindex y desaparecer del índice de Google. Mitigación: declarar el host oficial como constante y validarlo en los CAs post-deploy con curl.
- **Riesgo de regresión al renombrar el proyecto Vercel:** si el host fantasma cambia (de `immoralia-hub.vercel.app` a otra cosa), el middleware lo seguirá cubriendo porque la lógica es "todo lo que no es el host oficial, noindex".
- **Riesgo de cache CDN:** si Vercel cachea respuestas con la cabecera, hay que invalidar caché al deploy. Vercel invalida automáticamente entre deploys.

*(SECURITY-AGENT aplicará el checklist de `.brianspec/security-checklists.md` sección "Tipo: web-app" durante la revisión. Esta SPEC no toca autenticación, BBDD, inputs de usuario ni secretos.)*

---

## Plan de implementación

### Arquitectura propuesta

Una única capa: el middleware existente (`src/middleware.ts`) compara el host de cada petición entrante contra el host oficial declarado. Cuando no coincide, añade la cabecera `X-Robots-Tag: noindex, nofollow` a la respuesta. Cubre todos los casos en una sola regla:

- Host oficial (`procesos.immoralia.es`) → sin cabecera, indexable.
- Cualquier otro host (staging, host fantasma de Vercel, previews de PR, localhost en dev) → con cabecera, no indexable.

No se usa la variable `VERCEL_ENV` ni se añaden `headers()` en `next.config.ts`. La detección se basa exclusivamente en el `host` de la request, estándar HTTP universal. Esto mantiene la solución agnóstica al proveedor (replicable a Cloudflare Workers, Netlify, self-hosted) y centralizada en un solo archivo.

El host oficial se declara mediante una variable de entorno nueva y pública: `NEXT_PUBLIC_SITE_URL` con el valor `https://procesos.immoralia.es` (URL completa, con protocolo). Es la misma URL en los tres entornos de Vercel (Production, Preview, Development) — no varía nunca. El middleware extrae el host de esa URL para la comparación. La variable también queda disponible para usarse en SPECs siguientes (canonicals, OG dinámico, sitemap) sin duplicar fuentes de verdad.

**Política de allowlist estricta para el host:** solo el host extraído de `NEXT_PUBLIC_SITE_URL` queda sin noindex. Cualquier otra cosa (variantes con `www`, IPs, hosts mal formados, ausencia de cabecera `Host`) lleva noindex por defecto. Si en el futuro se quieren añadir variantes oficiales (por ejemplo `www.procesos.immoralia.es`), el responsable del proyecto define explícitamente la lista en la lógica de comparación — no se aceptan variantes implícitas.

### Desglose de tareas

1. **FRONTEND-AGENT — Middleware:** ampliar el middleware existente (que hoy gestiona sesión Supabase) para que compare el host de la petición contra el host extraído de `NEXT_PUBLIC_SITE_URL`. Cuando no coincida, añadir la cabecera `X-Robots-Tag: noindex, nofollow` a la respuesta. La cabecera se aplica a TODAS las rutas que el middleware cubra (incluido `/api/*`).

2. **FRONTEND-AGENT — Variable de entorno del host oficial:** añadir `NEXT_PUBLIC_SITE_URL=https://procesos.immoralia.es` en los tres entornos de Vercel (Production, Preview, Development) y documentar en `.env.example`. La variable es pública (prefijo `NEXT_PUBLIC_`) para que pueda usarse también desde código cliente en futuras SPECs.

3. **VERIFICACIÓN POST-DEPLOY:** ejecutar los CA-01 a CA-08 con `curl -I` contra los hosts reales después del deploy a staging y, separadamente, después del deploy a producción. Documentar los resultados en el PR.

4. **VERIFICACIÓN GSC:** comprobar en Google Search Console si `staging.immoralia.es` o `immoralia-hub.vercel.app` están actualmente indexados. Si lo están, solicitar eliminación manual desde la herramienta Remove URLs. Esta acción es manual y se documenta como paso post-merge.

### Dependencias con otras specs

- **Bloquea a:** SPEC-14 (foundation SEO). Sin esta SPEC, el sitemap de la SPEC-14 podría enviar a Google URLs duplicadas entre los tres hosts.
- **No depende de:** ninguna otra SPEC. Es la primera de la Fase 1.

### Lecciones aplicables (LESSONS-LEARNED.md)

- **LL-002 (streams SSE en serverless):** no aplica directamente — esta SPEC no usa streams.
- **LL-006 (whitelist explícita):** aplica al espíritu — declarar el host oficial explícitamente como constante o env var, no inferirlo dinámicamente.

---

## Tests requeridos

### Tests unitarios

Ninguno requerido. La lógica es declarativa (cabeceras condicionales) y se valida mejor con tests de integración curl post-deploy.

### Tests de integración

CAs CA-01 a CA-08 ejecutados con `curl -I` post-deploy. Son tests manuales en esta iteración. Se puede automatizar como GitHub Action de verificación post-deploy en una SPEC futura — no obligatorio aquí.

### Tests E2E

No aplica.

*(P9 — Tests donde aportan valor. La verificación con curl post-deploy es suficiente para esta SPEC.)*

---

## Out of scope (explícito)

- Solicitar eliminación manual de URLs ya indexadas en Google Search Console (queda como tarea documentada post-merge, no parte de la implementación técnica).
- Configurar redirects 301 desde `immoralia-hub.vercel.app/*` hacia `procesos.immoralia.es/*` (alternativa descartada en favor de noindex — más reversible).
- Automatización de la verificación post-deploy con GitHub Actions (puede ir en SPEC futura si se considera necesario).
- Actualización de `robots.txt` (eso es scope de SPEC-14).
- Adición de etiquetas `<meta name="robots">` en el HTML (innecesario — la cabecera HTTP `X-Robots-Tag` es más fuerte y los rastreadores la procesan primero).

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-30 | Versión inicial — modo creación a partir del plan SEO + GEO (ClickUp knvz4-239675). | David Navarrete |
| 1.1 | 2026-06-30 | Resuelta ambigüedad 1: el host oficial se declara con variable nueva `NEXT_PUBLIC_SITE_URL=https://procesos.immoralia.es` (Opción B), no reutilizando `SITE_URL` ni hardcodeando. | David Navarrete |
| 1.2 | 2026-06-30 | Resuelta ambigüedad 2: el noindex en hosts no oficiales se aplica a TODAS las rutas, incluidas `/api/*` (Opción A). El bloqueo permanente de `/api/*` en el host oficial se trata aparte en SPEC-14 (robots.txt). | David Navarrete |
| 1.3 | 2026-06-30 | Resuelta ambigüedad 3: una sola capa de noindex en el middleware (Opción A). Eliminada la propuesta de añadir `headers()` en `next.config.ts`. Razón: escalable, mantenible y agnóstico a Vercel. | David Navarrete |
| 1.4 | 2026-06-30 | Resuelta ambigüedad 4: política de allowlist estricta (Opción A). Solo el host de `NEXT_PUBLIC_SITE_URL` queda sin noindex; cualquier variante (www, IP, ausencia de Host) lleva noindex. Si se quieren añadir variantes oficiales en el futuro, se declaran explícitamente. CAs actualizados (CA-09 reescrito objetivo, CA-11 ahora cubre `/api/*`, CA-12 ahora cubre ausencia de Host). | David Navarrete |
| 1.5 | 2026-06-30 | Spec aprobada para implementación. | David Navarrete |
