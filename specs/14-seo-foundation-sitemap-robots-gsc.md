# SPEC-14: SEO Foundation — sitemap dinámico, robots y verificación Google Search Console

**Versión:** 1.3
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-30
**Owner:** David Navarrete

---

## Descripción

Dotar al catálogo de la base mínima que necesita Google (y los demás buscadores y rastreadores de IAs) para descubrir, rastrear e indexar todas las URLs públicas del sitio. Hoy los buscadores solo encuentran lo que llegan navegando desde la home — quedan fuera muchas de las 200+ URLs indexables, especialmente las 161 fichas dinámicas de proceso. Esta SPEC publica un sitemap.xml generado dinámicamente que enumera todas las URLs públicas, reescribe el archivo de directivas para rastreadores con permisos explícitos y verifica el dominio en Google Search Console para que el catálogo entre formalmente en el panel de monitorización.

---

## Actores

- **Rastreador de buscador (Googlebot, Bingbot):** descubre la URL del sitemap a través de la directiva declarada en las directivas para rastreadores; descarga el sitemap, encola cada URL listada y rastrea según sus reglas.
- **Rastreador de IA (GPTBot, ClaudeBot, PerplexityBot):** lee las directivas para rastreadores para confirmar que tiene permiso de acceso y descubre el sitemap. Su comportamiento posterior depende de su política propia.
- **Administrador del catálogo (David):** verifica la propiedad del dominio en Google Search Console y registra el sitemap en su panel. Posteriormente revisa errores de indexación.
- **Pipeline de despliegue (Vercel):** sirve el sitemap como recurso público en cada deploy. El contenido del sitemap se regenera en tiempo de build a partir de los datos del catálogo.

---

## Flujos principales

### Flujo 1: Rastreador descubre el sitemap

1. El rastreador pide `https://procesos.immoralia.es/robots.txt`.
2. El servidor devuelve las directivas, que incluyen una línea apuntando a la URL del sitemap.
3. El rastreador pide `https://procesos.immoralia.es/sitemap.xml`.
4. El servidor devuelve un XML válido con todas las URLs públicas del catálogo, sus fechas de última modificación, frecuencia de cambio y prioridad.
5. El rastreador encola las URLs y empieza a rastrearlas según su lógica interna.

### Flujo 2: Generación dinámica del sitemap

1. En cada deploy de producción, el framework genera el sitemap leyendo la lista de procesos publicados del archivo de datos del catálogo.
2. Filtra los procesos marcados como ocultos (`hidden: true`).
3. Construye una URL absoluta por proceso usando la base canónica declarada en variable de entorno.
4. Añade además todas las URLs estáticas: home, landings de sector, auditorías, catálogo completo, página de privacidad.
5. El sitemap se sirve como respuesta HTTP cacheada al recibir la petición.

### Flujo 3: Verificación del dominio en Google Search Console

1. David crea la propiedad `procesos.immoralia.es` en Google Search Console.
2. GSC entrega un token de verificación.
3. El token se incluye en el catálogo de la forma que se haya decidido (meta tag, archivo de verificación, o registro DNS — ver ambigüedad 2).
4. Tras el deploy, David vuelve a GSC y confirma la verificación.
5. Una vez verificado, David envía la URL del sitemap desde el panel de GSC.

### Flujo 4: Bot de IA accede al catálogo

1. El bot pide `/robots.txt`.
2. La respuesta incluye una directiva `Allow: /` específica para su user-agent (GPTBot, ClaudeBot, PerplexityBot).
3. El bot procede a rastrear las URLs del catálogo según su política.

---

## Flujos alternativos / Edge cases

- **Procesos marcados como ocultos:** los que tengan `hidden: true` en el archivo de datos NO aparecen en el sitemap. Si más adelante se vuelven a publicar (`hidden: false`), aparecerán automáticamente en el siguiente deploy.
- **Adición de un proceso nuevo:** el sitemap se regenera en el siguiente build. No hace falta tocar nada manual.
- **Sectores con redirect 301 (restauracion → gastronomia-hosteleria, inmobiliaria → construccion):** las URLs de origen del redirect NO se incluyen en el sitemap (convención SEO: solo URLs finales).
- **Sitemap pedido en host no oficial (staging.immoralia.es, immoralia-hub.vercel.app):** el sitemap se sirve con su contenido normal, pero el middleware de SPEC-13 añade la cabecera `X-Robots-Tag: noindex` a la respuesta — el rastreador lo descarta. Cero impacto: Google solo confía en el sitemap del host verificado.
- **Sitemap con más de 50.000 URLs:** no aplica hoy (~200 URLs). Si en el futuro el catálogo crece más allá, habrá que dividir en sitemap-index.
- **Verificación GSC falla:** se reintenta tras corregir el método. No bloquea el deploy del sitemap — el sitemap se sirve igualmente y Google lo encontrará vía robots.txt.
- **Rutas `/api/*`, `/admin`, `/afiliado`:** NO aparecen en el sitemap (no son rutas públicas indexables). El robots las marca `Disallow`.
- **Rutas dinámicas con slugs inválidos o procesos eliminados:** el sitemap solo incluye procesos que existen en el archivo de datos en el momento del build. Si un proceso se elimina, su URL desaparece del sitemap en el siguiente deploy.

---

## Criterios de aceptación

- [ ] CA-01: `curl https://procesos.immoralia.es/sitemap.xml` devuelve HTTP 200 y un XML que valida contra el esquema oficial de sitemaps (xmlns `http://www.sitemaps.org/schemas/sitemap/0.9`).
- [ ] CA-02: El sitemap contiene la URL home (`https://procesos.immoralia.es/`).
- [ ] CA-03: El sitemap contiene las 10 URLs de landing de sector (`/sector/salud`, `/sector/gestorias`, `/sector/centros-deportivos`, `/sector/construccion`, `/sector/desarrolladoras`, `/sector/gastronomia-hosteleria`, `/sector/academias`, `/sector/agencias`, `/sector/ecommerce`, `/sector/industrial`).
- [ ] CA-04: El sitemap contiene las 9 URLs de auditoría (`/auditorias` + 8 sectoriales: salud, gestorias, deportivos, restaurantes, academias, constructoras, industrial — comprobar nombres exactos en el código).
- [ ] CA-05: El sitemap contiene `https://procesos.immoralia.es/catalogo/completo`.
- [ ] CA-06: El sitemap contiene `https://procesos.immoralia.es/privacidad`.
- [ ] CA-07: El sitemap contiene una URL `https://procesos.immoralia.es/catalogo/procesos/{slug}` por cada proceso del archivo de datos cuyo `hidden !== true` y que tenga `slug` válido (verificar contando: número de entradas en el sitemap = número de procesos publicados).
- [ ] CA-08: El sitemap NO contiene rutas de redirect 301 (`/sector/restauracion`, `/sector/inmobiliaria`).
- [ ] CA-09: El sitemap NO contiene rutas privadas (`/admin`, `/afiliado`, `/api/*`).
- [ ] CA-10: Cada URL del sitemap incluye los atributos `loc`, `lastmod` (formato ISO 8601), `changefreq` y `priority`.
- [ ] CA-11: `curl https://procesos.immoralia.es/robots.txt` devuelve HTTP 200 y un texto que contiene:
  - Una sección `User-agent: GPTBot` con `Allow: /`.
  - Una sección `User-agent: ClaudeBot` con `Allow: /`.
  - Una sección `User-agent: PerplexityBot` con `Allow: /`.
  - Una sección `User-agent: *` con `Allow: /`, `Disallow: /admin`, `Disallow: /afiliado`, `Disallow: /api/`.
  - Una línea `Sitemap: https://procesos.immoralia.es/sitemap.xml`.
- [ ] CA-12: Una consulta DNS al dominio (`dig TXT procesos.immoralia.es` o `dig TXT immoralia.es` según cómo lo entregue Google) devuelve un registro TXT que contiene el token de verificación con prefijo `google-site-verification=`.
- [ ] CA-13: La propiedad `procesos.immoralia.es` aparece como **verificada** en Google Search Console.
- [ ] CA-14: El sitemap está enviado y aparece como **Success** en la sección Sitemaps del panel de GSC.
- [ ] CA-15: Una URL no oficial (ej. `https://immoralia-hub.vercel.app/sitemap.xml`) devuelve el XML pero con cabecera `X-Robots-Tag: noindex, nofollow` (heredado de SPEC-13).

---

## Modelo de datos

### Entidades nuevas o modificadas

No aplica. Esta SPEC no toca BBDD.

### Relaciones

No aplica.

### Migraciones necesarias

No aplica.

> Nota: el sitemap lee la lista de procesos del archivo de datos del catálogo (`src/data/processes.ts`), coherente con REGLA #1 del CLAUDE.md (TS es la fuente de verdad para contenido). No hay lectura de Supabase en runtime.

---

## UI / Páginas afectadas

### Páginas nuevas

- **`/sitemap.xml`** — endpoint público, contenido XML generado por Next.js a partir del archivo de configuración `app/sitemap.ts` (o equivalente).
- **`/robots.txt`** — archivo estático en `public/robots.txt`. Sustituye al actual (que solo tenía permisos genéricos).

### Páginas modificadas

Ninguna — la verificación GSC se hace vía DNS TXT (no toca código).

### Componentes reutilizables

Ninguno.

### Breakpoints obligatorios

No aplica — no hay UI visual.

### Estándar de calidad visual

No aplica.

---

## API / Endpoints

### Endpoints nuevos

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| GET | `/sitemap.xml` | XML con todas las URLs públicas | Pública |
| GET | `/robots.txt` | Texto con directivas para rastreadores | Pública |

### Endpoints modificados

Ninguno.

### Contratos de request/response

`/sitemap.xml`: respuesta `Content-Type: application/xml`. Cuerpo: XML válido contra el esquema sitemap.org.

`/robots.txt`: respuesta `Content-Type: text/plain`. Cuerpo: texto plano siguiendo el formato robots.txt.

---

## Notas de seguridad

### Datos sensibles involucrados

Ninguno. Las URLs del sitemap son todas públicas — no se expone nada que no fuera ya accesible navegando.

### Validaciones server-side requeridas

Generación determinística desde el archivo de datos. No hay input externo que validar.

### Autenticación y autorización

No aplica — endpoints públicos.

### Otros riesgos identificados

- **Riesgo de exponer URLs privadas en el sitemap:** mitigado por construcción — el sitemap se genera a partir de listas explícitas (procesos publicados + URLs estáticas declaradas). Rutas `/admin`, `/afiliado`, `/api/*` no aparecen en esas listas.
- **Verificación GSC sin acoplar al código:** al hacerse vía DNS TXT, el token de verificación no entra en el repo ni en variables de entorno. Vive solo en el DNS — desacoplado del ciclo de deploy y rotable sin tocar código.
- **Riesgo de sitemap inválido tras refactor de processes.ts:** mitigado por test post-deploy (CA-01 valida que el XML parsea).

*(SECURITY-AGENT aplicará el checklist de `.brianspec/security-checklists.md` sección "Tipo: web-app" durante la revisión. Esta SPEC no toca autenticación, BBDD, inputs de usuario ni secretos sensibles.)*

---

## Plan de implementación

### Arquitectura propuesta

Tres piezas independientes que viven en el mismo PR:

1. **Sitemap dinámico** — archivo de configuración en la capa de routing de Next.js (`app/sitemap.ts`) que exporta una función generadora. La función lee el archivo de datos del catálogo (`src/data/processes.ts`), filtra los procesos publicados, y devuelve una lista de objetos `{ url, lastModified, changeFrequency, priority }` que Next convierte en XML. La URL base se construye a partir de `NEXT_PUBLIC_SITE_URL` (introducida en SPEC-13).

2. **Directivas para rastreadores (robots)** — archivo estático en `public/robots.txt` que **sustituye** al actual. Incluye:
   - Permisos explícitos por user-agent para bots de IA (GPTBot, ClaudeBot, PerplexityBot).
   - Disallow para rutas privadas (`/admin`, `/afiliado`, `/api/`) en la sección global.
   - Allow para todo lo demás.
   - Línea `Sitemap: https://procesos.immoralia.es/sitemap.xml` (URL absoluta hardcoded — el robots.txt al ser estático no puede interpolar variables).

3. **Verificación Google Search Console (vía DNS TXT)** — David crea la propiedad en GSC, copia el valor TXT que Google entrega y lo añade como registro TXT en el DNS de `procesos.immoralia.es` (panel de Vercel si gestiona el DNS, o panel del proveedor del dominio en caso contrario). Tras propagación, vuelve a GSC y confirma la verificación. No hay cambios en el código del catálogo.

### Desglose de tareas

1. **FRONTEND-AGENT — Sitemap dinámico:** crear el archivo de configuración de sitemap en la capa de routing. Lee `src/data/processes.ts`, filtra `hidden !== true`, mapea a URLs absolutas con base `NEXT_PUBLIC_SITE_URL`. Añade además la lista declarativa de URLs estáticas (home, sectores, auditorías, catálogo completo, privacidad). Asigna `priority`, `changeFrequency` y `lastModified` por tipo de URL según convenciones (ver tabla en sección Out of scope para el detalle final).

2. **FRONTEND-AGENT — Directivas robots:** sustituir el contenido de `public/robots.txt` por la nueva versión. Declarar permisos por user-agent (incluidos bots IA), Disallow para rutas privadas (`/admin`, `/afiliado`, `/api/`), y línea `Sitemap` apuntando a la URL absoluta del sitemap en producción.

3. **VERIFICACIÓN POST-DEPLOY:** ejecutar CA-01 a CA-11 con `curl` contra `procesos.immoralia.es`. Validar el sitemap con el validador oficial de Google Sitemaps.

4. **REGISTRO EN GSC (tarea humana, manual, post-merge a producción):**
   - Crear propiedad `procesos.immoralia.es` en Google Search Console (modo Dominio).
   - Copiar el valor TXT que entrega GSC.
   - Añadir el registro TXT en el DNS de `immoralia.es` desde donde corresponda (Vercel domain settings o proveedor del dominio).
   - Esperar propagación (típicamente minutos, máximo 24h).
   - Pulsar "Verificar" en GSC. Cumple CA-13.
   - Una vez verificado, en GSC → Sitemaps → enviar `https://procesos.immoralia.es/sitemap.xml`. Cumple CA-14.

### Dependencias con otras specs

- **Bloqueada por:** SPEC-13 (los hosts no oficiales deben tener noindex antes que el sitemap publique URLs reales — evita confusión de duplicados durante la transición).
- **Bloquea a:** SPEC-23 (análisis continuo de GSC necesita 2–4 semanas de datos, que solo empiezan a acumularse cuando el dominio está verificado y el sitemap enviado — esta SPEC inicia el contador).
- **Coordina con:** SPEC-21 (añade `llms.txt` y refuerza permisos de bots IA; lo natural es mergear SPEC-21 inmediatamente después de SPEC-14 para que los bots IA encuentren la base completa).

### Lecciones aplicables (LESSONS-LEARNED.md)

- **LL-006 (whitelist explícita > "enviar el objeto entero"):** el sitemap se construye declarando explícitamente qué campos del archivo de datos se leen (`slug`, `hidden`). Si en el futuro se elimina o renombra `slug`, el sitemap debe romperse en build (no silenciosamente al deploy).
- **LL-002 (persistencia en streams SSE):** no aplica directamente — sitemap es respuesta cacheable, no stream.

---

## Tests requeridos

### Tests unitarios

Ninguno requerido. La función generadora del sitemap es declarativa y se valida mejor con tests de integración post-deploy.

### Tests de integración

CA-01 a CA-11 ejecutados con `curl` post-deploy. Validación del XML con el validador oficial de Google Sitemaps.

### Tests E2E

No aplica.

*(P9 — Tests donde aportan valor.)*

---

## Out of scope (explícito)

- Sitemap de imágenes separado (`sitemap-images.xml`). Útil para fichas con muchas imágenes pero no crítico hoy. Posible SPEC futura.
- Sitemap de vídeos. Similar al anterior.
- Sitemap-index (división en múltiples sitemaps). Aplicable solo si superamos 50.000 URLs.
- "Ping" automático a Google cuando se redeploya (`https://www.google.com/ping?sitemap=...`). Google ha deprecado este endpoint en 2026 — se descarta como no recomendado.
- Soporte multi-idioma (`hreflang`) en el sitemap. El catálogo es solo español (declarado en `PROJECT-CONSTITUTION.md` sección 1).
- Generación del archivo `llms.txt` — eso es scope de SPEC-21.
- Configuración del dashboard de GSC. La SPEC se cierra con dominio verificado + sitemap enviado; el análisis de datos viene en SPEC-23.

### Convención propuesta de priority / changeFrequency

| Tipo de URL | priority | changeFrequency |
|---|---|---|
| Home | 1.0 | monthly |
| Landings de sector | 0.9 | monthly |
| Catálogo completo | 0.8 | weekly |
| Fichas de proceso | 0.7 | monthly |
| Auditorías (índice y sectoriales) | 0.6 | monthly |
| Privacidad | 0.3 | yearly |

Estos valores son orientativos para Google. Decidir si se confirman estos o se ajustan (ver ambigüedad 4 si se considera crítica).

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-30 | Versión inicial — modo creación a partir del plan SEO + GEO (ClickUp knvz4-239675). | David Navarrete |
| 1.1 | 2026-06-30 | Resuelta ambigüedad 1: el archivo de directivas para rastreadores se mantiene como `public/robots.txt` plano (Opción B), no se introduce `app/robots.ts`. Razón: simplicidad, más legible a ojo, no necesitamos lógica condicional. La línea `Sitemap` hardcodea la URL absoluta de producción. | David Navarrete |
| 1.2 | 2026-06-30 | Resuelta ambigüedad 2: verificación GSC vía DNS TXT (Opción C). El token vive en el DNS, no en el código. Eliminada referencia a `NEXT_PUBLIC_GSC_VERIFICATION` y al meta tag en root layout. CA-12 reescrito para validar el registro DNS con `dig`. Tarea 4 del desglose convertida en paso manual de David post-deploy. | David Navarrete |
| 1.3 | 2026-06-30 | Spec aprobada para implementación. | David Navarrete |
