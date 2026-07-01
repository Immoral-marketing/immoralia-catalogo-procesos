# SPEC-17: Performance SEO — Core Web Vitals

**Versión:** 1.4
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-30
**Owner:** David Navarrete

---

## Descripción

Mejorar significativamente el rendimiento del catálogo en móvil y desktop para que Google Core Web Vitals queden en verde y el ranking móvil no se penalice. Hoy toda la app se renderiza server-side en cada request (`dynamic = 'force-dynamic'` global), no se usa `next/image` en ninguna parte, hay tres imágenes públicas > 500 KB sin optimizar y el lazy-loading solo está aplicado en 6 vistas de sector. Esta SPEC ataca las tres palancas de golpe: rendering estratégico por ruta (SSG/ISR/dinámico), migración a `next/image` empezando por LCP, y optimización de assets pesados existentes.

---

## Actores

- **Visitante anónimo:** carga las páginas del catálogo. Percibe la mejora directamente — la landing se le sirve en milisegundos desde CDN en lugar de segundos desde el servidor Vercel.
- **Rastreador de buscador (Googlebot):** mide Core Web Vitals reales en el índice móvil. Con las mejoras, mejora su percepción de "calidad de página" y aumenta la probabilidad de mejor ranking móvil.
- **Administrador del catálogo (David):** actualiza el contenido (procesos, landings) sin preocuparse por cache — los deploys invalidan lo estático; las regeneraciones ISR ocurren solas.
- **Pipeline de despliegue (Vercel):** genera páginas estáticas en build para las rutas SSG y sirve las ISR con revalidación transparente. Reduce el coste de compute por request.

---

## Flujos principales

### Flujo 1: Visitante abre una landing de sector

1. El visitante pide `https://procesos.immoralia.es/sector/salud`.
2. Vercel sirve la página desde CDN (previamente pre-generada en build o cacheada por ISR).
3. El HTML llega en < 100 ms. El navegador empieza a renderizar.
4. `next/image` carga el hero en formato AVIF/WebP con tamaño responsive según el viewport. LCP en < 2.5 s en móvil.
5. Enhanced Measurement de GA4 registra la visita.

### Flujo 2: Visitante abre una ficha de proceso dinámica

1. El visitante pide `https://procesos.immoralia.es/catalogo/procesos/{slug}`.
2. Si la página estaba pre-generada (o está en cache ISR fresh), se sirve desde CDN.
3. Si es la primera petición tras el TTL de la ISR, se regenera en background y se sirve la versión antigua mientras (stale-while-revalidate).
4. LCP < 2.5 s.

### Flujo 3: Se añade un proceso nuevo al archivo de datos y se despliega

1. David edita `src/data/processes.ts` con un proceso nuevo.
2. Ejecuta el sync a Supabase (REGLA #1) + commit + PR + merge.
3. Vercel dispara el build. Las páginas SSG se regeneran incluyendo la ficha nueva.
4. La ficha nueva aparece pre-generada en el catálogo, con el sitemap (SPEC-14) actualizado también.

### Flujo 4: Ruta dinámica (admin, afiliado) sigue funcionando en runtime

1. Un partner autenticado abre `/afiliado`.
2. La ruta sigue siendo dinámica — necesita sesión, cookies, permisos.
3. Se sigue renderizando en server con SSR, sin cache.
4. Comportamiento actual preservado.

### Flujo 5: Medición Core Web Vitals

1. David abre PageSpeed Insights con la URL `https://procesos.immoralia.es/sector/salud`.
2. La herramienta mide LCP, CLS, INP tanto en Field Data (Chrome UX Report) como en Lab Data (Lighthouse).
3. Los valores deben cumplir los objetivos declarados (ver criterios de aceptación).

---

## Flujos alternativos / Edge cases

- **Ruta SSG que usa un hook cliente (localStorage, context):** al eliminar `force-dynamic` global, ciertas rutas podrían romper si mezclan Server Components con lógica exclusivamente client. Mitigación: revisar la frontera server/client antes de migrar y marcar como `'use client'` los componentes que la necesiten.
- **Cliente Supabase en Server Components:** el layout hoy declara que force-dynamic evita "cliente Supabase en build". Al migrar a SSG, hay que usar el cliente SSR (`@supabase/ssr` ya está instalado) — o servir en client component según el caso. Requiere auditoría previa.
- **ISR con datos que cambian por usuario:** si alguna ruta ISR tiene contenido que depende de cookies o parámetros de query, la cache puede servir contenido mezclado a distintos usuarios. Mitigación: rutas con contenido dinámico personal se mantienen SSR (rutas privadas + posiblemente catálogo completo si tiene filtros por sesión).
- **Imagen no optimizada con next/image:** si una imagen remota no tiene dimensiones conocidas, `next/image` da error. Mitigación: para las imágenes externas (poco frecuente en este proyecto) se declaran `remotePatterns` en `next.config.ts` y se pasan `width`/`height` explícitos.
- **Imágenes de `<img>` no migradas todavía:** al ser una migración incremental, unas quedan optimizadas y otras no durante un tiempo. Las que quedan sin migrar mantienen el comportamiento actual — no rompen nada.
- **Página que consultaba en runtime datos que ya no están en build:** al pasar a SSG, ciertas queries pierden datos "en vivo". Solución por ruta: si la ruta necesita datos frescos, usar ISR con `revalidate` corto (ej. 60 s).

---

## Criterios de aceptación

- [ ] CA-01: El root layout NO exporta `dynamic = 'force-dynamic'` a nivel global. Solo las rutas que lo necesitan lo declaran individualmente.
- [ ] CA-02: Las 10 landings de sector (`/sector/*`) se sirven como SSG o ISR (no SSR forzado). Verificable con `curl -I` mirando cabeceras de cache o inspeccionando el manifiesto de build.
- [ ] CA-03: Las 9 páginas de auditorías (`/auditorias` + 8 sectoriales) se sirven como SSG o ISR.
- [ ] CA-04: `/catalogo/completo` se sirve como SSG o ISR (con revalidate razonable si depende de datos frescos).
- [ ] CA-05: Las 161 fichas de proceso `/catalogo/procesos/[slug]` se sirven como SSG (pre-generadas con `generateStaticParams`) o ISR.
- [ ] CA-06: `/admin` y `/afiliado` se mantienen dinámicas (SSR o `dynamic = 'force-dynamic'` en la ruta).
- [ ] CA-07: **TODAS** las `<img>` HTML del proyecto están migradas a `<Image>` de `next/image` (big bang). Verificable con `grep -rE "<img\b" src/` que devuelve 0 resultados (excepto casos justificados y documentados en el PR).
- [ ] CA-08: Las tres imágenes pesadas identificadas (`gestoria.jpg` 1.1 MB, `restauracion.jpg` 968 KB, `robot-mascot.png` 1.8 MB) se sirven al visitante en formato optimizado (AVIF/WebP) vía `next/image`. Verificable en DevTools → Network → ver tipo/tamaño de la respuesta servida. Post-migración ninguna variante servida a móvil supera 200 KB. (Los archivos originales pueden mantenerse en `/public/` — no se sirven directamente.)
- [ ] CA-09: El `alt=""` vacío del banner de auditorías se sustituye por texto descriptivo.
- [ ] CA-10: PageSpeed Insights móvil de `https://procesos.immoralia.es/` reporta **LCP < 2.5 s** en Lab Data (Lighthouse).
- [ ] CA-11: PageSpeed Insights móvil de la misma home reporta **CLS < 0.1** en Lab Data.
- [ ] CA-12: PageSpeed Insights móvil de la misma home reporta **INP < 200 ms** en Lab Data (o `TBT < 200 ms` como proxy si INP no está disponible).
- [ ] CA-13: PageSpeed Insights móvil de al menos una landing de sector (ej. `/sector/salud`) cumple los tres objetivos (LCP < 2.5 s, CLS < 0.1, INP < 200 ms).
- [ ] CA-14: PageSpeed Insights móvil de al menos una ficha de proceso cumple los tres objetivos.
- [ ] CA-15: La funcionalidad de las páginas migradas se mantiene idéntica: chatbot, selección de procesos, formularios, modales, banner de consent, redirects.
- [ ] CA-16: Ningún build de producción falla por la migración (Vercel deploy exitoso).

---

## Modelo de datos

### Entidades nuevas o modificadas

No aplica. Esta SPEC no toca BBDD.

### Relaciones

No aplica.

### Migraciones necesarias

No aplica.

> Nota: el generador de rutas estáticas de fichas de proceso (`generateStaticParams`) lee `src/data/processes.ts`, coherente con REGLA #1 del CLAUDE.md.

---

## UI / Páginas afectadas

### Páginas nuevas

Ninguna.

### Páginas modificadas

- **Root layout** — se retira `dynamic = 'force-dynamic'` global.
- **Todas las páginas públicas** — pueden requerir ajustes puntuales:
  - Landings de sector: añadir `revalidate` si es ISR.
  - Fichas de proceso: añadir `generateStaticParams`.
  - `/afiliado`, `/admin`: mantener explícitamente `dynamic = 'force-dynamic'` (o equivalente) en la propia ruta.
- **Componentes que usan hooks cliente (localStorage, context, useEffect):** revisar que estén marcados con `'use client'` o encapsulados en componentes que lo estén.
- **Vistas con hero image o imágenes above-the-fold** — migrar `<img>` → `<Image>`.

### Componentes reutilizables

Ninguno nuevo.

### Breakpoints obligatorios

Los estándar del proyecto (375 px, 768 px, 1280 px). El componente `next/image` genera automáticamente el `srcset` para cubrir estos breakpoints.

### Estándar de calidad visual

El aspecto visual debe ser idéntico antes y después de la migración. Cualquier regresión visual (imagen recortada, ratio distinto, blur inesperado) es motivo de rechazo.

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

Ninguno directamente. Sin embargo, al retirar `force-dynamic` hay que asegurar que ninguna ruta pública embeba en build datos que dependían de sesión (por ejemplo, si una landing incluye información específica del usuario logueado).

### Validaciones server-side requeridas

Ninguna nueva. Las validaciones existentes se preservan.

### Autenticación y autorización

Las rutas privadas (`/admin`, `/afiliado`) siguen protegidas por su lógica de auth existente. Solo se marcan explícitamente como dinámicas para que la protección se ejecute en cada request.

### Otros riesgos identificados

- **Riesgo de datos obsoletos en cache CDN:** mitigado por ISR con revalidate razonable + invalidación implícita en cada deploy.
- **Riesgo de romper páginas por SSG con datos client:** mitigado por auditoría previa (ver plan de implementación tarea 1).
- **Riesgo de aumento del tiempo de build:** si se generan 179 fichas de proceso en SSG, el build tarda más. Aceptable — Vercel puede paralelizar y esto se hace una vez por deploy, no por request.
- **Riesgo de romper `next/image` en imágenes de dimensiones desconocidas:** mitigado por auditoría previa de cada `<img>` a migrar.

*(SECURITY-AGENT aplicará el checklist. Esta SPEC no introduce inputs de usuario, endpoints nuevos ni secretos.)*

---

## Plan de implementación

### Arquitectura propuesta

Cuatro piezas en el mismo PR:

1. **Auditoría de fronteras server/client** — inventario de componentes que dependen de localStorage, cookies, Supabase client-side, contextos, `useEffect`, etc. Documentar cuáles se pueden servir en Server Component y cuáles necesitan `'use client'`. Esto DESBLOQUEA la retirada de `force-dynamic`.

2. **Estrategia de rendering por ruta** (según decisión de ambigüedad 1):
   - Home, landings sector, auditorías, catálogo completo, fichas de proceso, privacidad → SSG/ISR según decisión.
   - `/admin`, `/afiliado`, `/api/*` → mantienen dinámico explícito.

3. **Migración a `next/image`** (según decisión de ambigüedad 2):
   - Prioridad LCP: imágenes hero de todas las landings y de la home.
   - El resto: se migra según decisión de scope.
   - Imágenes pesadas existentes: se benefician automáticamente de la optimización de `next/image` al migrarlas.

4. **Corrección del `alt=""`** en banner de auditorías: reemplazar por un `alt` descriptivo.

### Desglose de tareas

1. **FRONTEND-AGENT — Auditoría server/client:**
   - Grep en `src/` de: `localStorage`, `sessionStorage`, `document.`, `window.`, `useState`, `useEffect`, `useContext`, `createClient` de Supabase browser.
   - Producir un mapa: qué componentes pueden ser Server y cuáles Client.
   - Marcar los componentes cliente con `'use client'` donde falte.
   - Verificar que el uso de Supabase en Server Components pasa por `@supabase/ssr` (ya instalado).

2. **FRONTEND-AGENT — Retirar `force-dynamic` global:**
   - Eliminar `export const dynamic = 'force-dynamic'` del root layout.
   - Añadir `export const dynamic = 'force-dynamic'` (o su equivalente moderno con headers/cookies) explícitamente en `/admin` y `/afiliado`.

3. **FRONTEND-AGENT — Rendering por ruta (según ambigüedad 1):** aplicar la estrategia elegida ruta por ruta. Añadir `generateStaticParams` a fichas de proceso si se decide SSG. Añadir `export const revalidate = X` a las rutas ISR.

4. **FRONTEND-AGENT — Migración `next/image`:**
   - Migrar como mínimo los hero de home y de las 10 landings de sector.
   - Si la decisión de ambigüedad 2 es big bang, migrar todas las `<img>` en un solo PR.
   - Configurar `remotePatterns` en `next.config.ts` si hay imágenes remotas (comprobar).

5. **FRONTEND-AGENT — Alt descriptivo:** sustituir el `alt=""` del banner de auditorías por texto significativo.

6. **VERIFICACIÓN LOCAL:**
   - `npm run build` sin errores.
   - `npm run start` — verificar visualmente cada landing.
   - `npm run lint` sin errores.

7. **VERIFICACIÓN POST-DEPLOY:**
   - PageSpeed Insights móvil para: home, `/sector/salud`, una ficha de proceso.
   - Lighthouse local en modo móvil emulado.
   - Test manual de funcionalidad: chatbot, selección, formularios, banner consent, redirects (SPEC-13 + SPEC-18 en marcha).

### Dependencias con otras specs

- **Bloqueada por:** Fase 1 completa en producción (SPEC-13, 14, 16, 18, 21). Ejecutar antes que Fase 1 esté deployada podría contaminar la medición del efecto de cada cambio.
- **No bloquea a:** ninguna Fase 3 directamente. Pero mejora el rendimiento base que todas las demás heredan.
- **Coordina con:** SPEC-18 (medición). Antes/después con Lighthouse para cuantificar la ganancia.

### Lecciones aplicables (LESSONS-LEARNED.md)

- **LL-002 (persistencia dentro de streams SSE):** no aplica.
- **LL-003 (no destruir estado local por errores transitorios):** aplica indirectamente — el cambio de rendering puede afectar el orden en que se cargan componentes cliente que dependen de estado local. Mantener robustez.
- **LL-006 (whitelist explícita):** al migrar rutas a SSG, declarar explícitamente qué rutas necesitan dinámico en lugar de asumirlo global.

---

## Tests requeridos

### Tests unitarios

Ninguno directo. La migración es de infraestructura.

### Tests de integración

CA-01 a CA-16 validados con `curl`, PageSpeed Insights, Lighthouse local y clic manual en cada tipo de página.

### Tests E2E

Recomendable un smoke test manual del golden path: home → sector → ficha → contacto → banner consent.

*(P9 — Tests donde aportan valor.)*

---

## Out of scope (explícito)

- Reescribir el chatbot para que sea Server Component o SSR-friendly. Sigue siendo widget cliente flotante como hoy.
- Migrar CSS a algo distinto de Tailwind por rendimiento (Tailwind ya es óptimo).
- Introducir un service worker / PWA / offline caching. Fuera de scope.
- Optimizar el bundle JavaScript más allá de lo que Next.js hace por defecto (splitting automático). Si tras la SPEC hay bundles > 250 KB en móvil, se aborda en SPEC futura.
- Cambiar hosting o CDN. Vercel se mantiene.
- Añadir Preload/Prefetch manual de recursos específicos. Solo lo que `next/image` y Next.js gestionan automáticamente.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-30 | Versión inicial — modo creación a partir del plan SEO + GEO (ClickUp knvz4-239675). | David Navarrete |
| 1.1 | 2026-06-30 | Resuelta ambigüedad 1: SSG puro para todas las rutas públicas (home, landings, auditorías, catálogo completo, 179 fichas con generateStaticParams, privacidad). Solo `/admin`, `/afiliado` y `/api/*` mantienen dinámico. El contenido cambia con deploys (patrón actual del catálogo), no requiere ISR. | David Navarrete |
| 1.2 | 2026-06-30 | Resuelta ambigüedad 2: migración a `next/image` big bang (Opción A) — todas las `<img>` del proyecto se migran en este PR. Elimina la deuda técnica de golpe. CA-07 actualizado para exigir 0 resultados de `<img` en el grep post-migración. | David Navarrete |
| 1.3 | 2026-06-30 | Resuelta ambigüedad 3: confiar en `next/image` para optimizar automáticamente (Opción A). Los archivos originales pesados quedan en `/public/` pero se sirven optimizados AVIF/WebP al vuelo. CA-08 reescrito para verificar la respuesta servida al cliente, no el archivo fuente. | David Navarrete |
| 1.4 | 2026-06-30 | Spec aprobada para implementación. | David Navarrete |
