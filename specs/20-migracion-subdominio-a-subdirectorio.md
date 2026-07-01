# SPEC-20: Migración de subdominio a subdirectorio — `procesos.immoralia.es` → `immoralia.es/procesos`

**Versión:** 1.4
**Estado:** aprobada (condicional — implementación sujeta a decisión D2)
**Tipo de proyecto:** web-app (infraestructura + SEO)
**Última actualización:** 2026-06-30
**Owner:** David Navarrete

---

## Descripción

Migrar el catálogo de procesos del subdominio actual `procesos.immoralia.es` al subdirectorio `immoralia.es/procesos` bajo el dominio principal. Google trata los subdominios como entidades separadas: toda la autoridad SEO que acumule el catálogo hoy no beneficia a `immoralia.es`, y viceversa. Al mover el catálogo a subdirectorio, la autoridad se consolida en un único dominio y ambos sitios se benefician mutuamente.

**Esta SPEC es CONDICIONAL.** Su ejecución depende de la decisión interna D2 (documentada en el plan SEO+GEO en ClickUp `knvz4-239675`). Se aprueba y se deja preparada, pero solo se implementa cuando:

1. Haya al menos 4-6 semanas de datos GSC en `procesos.immoralia.es` (post-SPEC-14 en producción).
2. Los datos justifiquen que el subdominio está limitando el crecimiento (o el análisis con Claude sugiera lo contrario).
3. Se confirme viabilidad técnica de la migración con el equipo que gestiona la infraestructura de `immoralia.es`.

---

## Actores

- **Rastreador de buscador (Googlebot):** durante y tras la migración, recibe los redirects 301 desde las URLs antiguas hacia las nuevas. Consolida la autoridad SEO en el dominio principal.
- **Visitantes existentes con URLs guardadas / enlaces externos:** son redirigidos transparentemente a las nuevas URLs. La experiencia no se rompe.
- **Rastreadores de IA (GPTBot, ClaudeBot, PerplexityBot):** actualizan sus referencias del subdominio a la nueva URL con el mismo mecanismo (siguen redirects 301).
- **Administrador (David):** ejecuta la migración en coordinación con el equipo de infraestructura de `immoralia.es`. Notifica a GSC vía Change of Address Tool.
- **Equipo/persona responsable de la infraestructura de `immoralia.es`:** debe habilitar el subdirectorio en su servidor o configurar el reverse proxy hacia el deploy Vercel del catálogo.

---

## Flujos principales

### Flujo 1: Visitante en subdirectorio tras la migración

1. El visitante pide `https://immoralia.es/procesos/sector/salud`.
2. El servidor de `immoralia.es` recibe la petición. Detecta que la ruta empieza con `/procesos/` y la enruta (vía rewrite o reverse proxy) al deploy Vercel del catálogo.
3. El catálogo, ahora configurado con `basePath: '/procesos'`, sirve la landing correctamente.
4. El visitante ve la página sin percibir el cambio arquitectónico.

### Flujo 2: Visitante en la URL antigua (subdominio)

1. Un visitante entra vía enlace externo a `https://procesos.immoralia.es/sector/salud`.
2. El servidor del catálogo (o Vercel domain settings) devuelve HTTP 301 hacia `https://immoralia.es/procesos/sector/salud`.
3. El navegador sigue el redirect automáticamente.
4. El visitante llega a la nueva URL. Bookmark se actualiza en algunos navegadores.

### Flujo 3: Googlebot durante la ventana de migración

1. Googlebot rastrea `https://procesos.immoralia.es/*`.
2. Recibe 301 → sigue a la URL nueva → indexa la nueva URL.
3. Al cabo de días/semanas, Google actualiza el índice: las URLs viejas quedan como "movidas permanentemente" y transfieren autoridad a las nuevas.
4. Change of Address Tool en GSC acelera y comunica formalmente la migración.

### Flujo 4: Deploy y coordinación

1. Se despliega en Vercel la versión del catálogo con `basePath: '/procesos'`.
2. Se configura el rewrite / proxy en el servidor de `immoralia.es` para enrutar `/procesos/*` al deploy Vercel.
3. Se configuran redirects 301 desde el subdominio antiguo hacia las URLs correspondientes bajo el subdirectorio.
4. Se actualizan canonicals, sitemap, robots.txt (todos ya usan `NEXT_PUBLIC_SITE_URL` — basta con cambiar la variable).
5. Se notifica el cambio en Google Search Console (Change of Address Tool).
6. Se monitoriza el tráfico durante 2-4 semanas post-migración para detectar caídas anómalas.

---

## Flujos alternativos / Edge cases

- **Enlaces externos con URL antigua:** siguen funcionando indefinidamente vía redirect 301. No hay ruptura.
- **Bookmarks del usuario final:** el 301 provoca que los navegadores modernos actualicen el bookmark automáticamente. Los legacy (usuarios antiguos con bookmarks) seguirán funcionando siempre.
- **Assets estáticos del catálogo (`/immoralia_logo.png`, `/robots.txt`, `/sitemap.xml`):** se sirven bajo el subdirectorio (`/procesos/immoralia_logo.png`). El sitemap se regenera con las URLs nuevas automáticamente (SPEC-14 usa `NEXT_PUBLIC_SITE_URL`).
- **Panel de admin y afiliados:** están bajo el mismo catálogo — se mueven al subdirectorio también (`/procesos/admin`, `/procesos/afiliado`). Los usuarios existentes deberán volver a hacer login (o no, si las cookies se mantienen — verificar por dominio).
- **APIs internas (`/api/*`):** quedan bajo `/procesos/api/*`. Cualquier consumidor externo de esas APIs (si existe) debe actualizar la URL base.
- **Recovery de contraseña vía Supabase (`/afiliado?token=...`):** los emails Resend deben actualizarse para apuntar a las URLs nuevas. Si envían URLs con el subdominio antiguo, redirect 301 sigue funcionando.
- **Verificación GSC (SPEC-14):** el registro DNS TXT sigue siendo válido para `procesos.immoralia.es`; para `immoralia.es` puede necesitarse una nueva verificación separada, o compartir permisos con la propiedad existente.

---

## Criterios de aceptación

- [ ] CA-01: `curl -I https://immoralia.es/procesos/` devuelve HTTP 200 (o 3xx con destino final 200) sirviendo la home del catálogo, sin trailing slash issues.
- [ ] CA-02: `curl -I https://immoralia.es/procesos/sector/salud` devuelve 200 y sirve la landing correcta.
- [ ] CA-03: `curl -I https://immoralia.es/procesos/catalogo/procesos/{slug}` (con un slug real) devuelve 200 y sirve la ficha correcta.
- [ ] CA-04: `curl -I https://procesos.immoralia.es/` devuelve HTTP 301 con `Location: https://immoralia.es/procesos/`.
- [ ] CA-05: `curl -I https://procesos.immoralia.es/sector/salud` devuelve HTTP 301 con `Location: https://immoralia.es/procesos/sector/salud`.
- [ ] CA-06: `curl -I https://procesos.immoralia.es/catalogo/procesos/{slug}` devuelve HTTP 301 con destino equivalente bajo `/procesos/`.
- [ ] CA-07: Los canonicals en todas las URLs del subdirectorio apuntan a URLs bajo `https://immoralia.es/procesos/`. Verificable con grep en el HTML.
- [ ] CA-08: `https://immoralia.es/procesos/sitemap.xml` devuelve el sitemap con URLs actualizadas a `https://immoralia.es/procesos/*`.
- [ ] CA-09: `https://immoralia.es/procesos/robots.txt` devuelve el robots con línea `Sitemap: https://immoralia.es/procesos/sitemap.xml`.
- [ ] CA-10: La propiedad `immoralia.es` (o `immoralia.es/procesos`) está verificada en Google Search Console y la propiedad antigua `procesos.immoralia.es` tiene registrada la Change of Address hacia la nueva.
- [ ] CA-11: El panel de admin (`/procesos/admin`) sigue accesible para super_admins y funciona igual que antes.
- [ ] CA-12: El panel de afiliados (`/procesos/afiliado`) sigue funcionando para partners existentes; el login persiste o requiere re-login controlado.
- [ ] CA-13: Los emails transaccionales de Resend (contacto, recuperación de contraseña, notificaciones a partners) usan las URLs nuevas.
- [ ] CA-14: Post-migración 2-4 semanas, el tráfico orgánico total (subdominio antiguo + subdirectorio nuevo, agregado) NO ha caído más de un umbral aceptable (definido en ambigüedad 4). Si cae, se ejecuta plan de contingencia.
- [ ] CA-15: Google Search Console muestra las URLs bajo `immoralia.es/procesos/` indexadas. Las URLs antiguas aparecen como "movidas permanentemente".

---

## Modelo de datos

### Entidades nuevas o modificadas

No aplica en BBDD.

Cambios en configuración/código:
- Variable de entorno `NEXT_PUBLIC_SITE_URL` cambia de `https://procesos.immoralia.es` a `https://immoralia.es/procesos` en Vercel (Production y Preview según toque).
- `next.config.ts` añade `basePath: '/procesos'`.
- Todos los links absolutos internos del catálogo que usen `NEXT_PUBLIC_SITE_URL` se actualizan automáticamente al cambiar la variable.

### Relaciones

No aplica.

### Migraciones necesarias

Ninguna en BBDD Supabase.

---

## UI / Páginas afectadas

Ninguna a nivel de contenido visual. Todos los cambios son de rutas y configuración.

### Componentes reutilizables

Ninguno nuevo.

### Breakpoints obligatorios

No aplica.

### Estándar de calidad visual

Iguales que antes de la migración. La página no debe verse diferente.

---

## API / Endpoints

### Endpoints nuevos

Ninguno.

### Endpoints modificados

Todos los endpoints existentes (`/api/*`) quedan bajo el nuevo subdirectorio (`/procesos/api/*`). Los redirects 301 aseguran retrocompatibilidad para consumidores externos.

### Contratos de request/response

No cambian los contratos internos.

---

## Notas de seguridad

### Datos sensibles involucrados

No hay cambios en el manejo de datos sensibles. Las cookies de sesión (Supabase, consent RGPD) siguen funcionando si el dominio raíz (`.immoralia.es`) se maneja correctamente en el atributo `Domain` de las cookies.

### Validaciones server-side requeridas

Verificar que el `basePath` no rompe la validación de rutas privadas (`/procesos/admin`, `/procesos/afiliado`).

### Autenticación y autorización

- **Cookies de Supabase:** hoy están bajo el subdominio `procesos.immoralia.es`. Al mover al dominio raíz, hay que decidir si:
  - Se ponen en `.immoralia.es` (dominio compartido con la web principal).
  - Se mantienen aisladas en `immoralia.es/procesos` (más seguro pero requiere config específica).
- **Impacto:** durante la migración, los usuarios logueados hoy pueden perder sesión (deben volver a loguearse). No es un problema grave — se comunica.

### Otros riesgos identificados

- **Riesgo de pérdida temporal de tráfico:** durante las semanas post-migración, Google reasigna autoridad progresivamente. Puede haber caída temporal antes de la recuperación. Mitigado con Change of Address Tool + monitoreo activo.
- **Riesgo de doble indexación temporal:** durante días/semanas, Google puede mostrar ambas URLs en el índice. Se resuelve solo con los 301 + canonical.
- **Riesgo de infraestructura de `immoralia.es`:** si el rewrite/proxy no se configura correctamente, todo `/procesos/*` puede caer o cachear indebidamente. Requiere prueba controlada antes del cutover.
- **Riesgo de dependencias externas hardcoded:** cualquier integración (webhook, calendario, formulario embebido) que apunte al subdominio debe actualizarse. Se debe hacer un inventario previo.

*(SECURITY-AGENT aplicará el checklist. Esta SPEC es principalmente infraestructura, con riesgo bajo/medio de seguridad si el rewrite se configura bien.)*

---

## Plan de implementación

### Arquitectura propuesta

Cinco piezas:

1. **Vercel rewrites en el proyecto `immoralia`** — confirmado (2026-06-30) que `immoralia.es` está alojado en Vercel como proyecto separado (`immoralia`, cuenta "Immoral's projects", plan Hobby). El mecanismo elegido: añadir bloque `rewrites` en `next.config.ts` (o `vercel.json`) del proyecto `immoralia` que captura `/procesos/:path*` y lo enruta hacia el deploy Vercel del catálogo (`immoralia-hub`). Vercel preserva por defecto el `Host` header original (`immoralia.es`), lo que permite al middleware de SPEC-13 seguir identificando correctamente el host oficial sin disparar noindex indeseado.

2. **Configuración `basePath` en el catálogo** — añadir `basePath: '/procesos'` en `next.config.ts`. Next.js ajusta automáticamente todos los links internos, assets, y rutas del router.

3. **Actualización de `NEXT_PUBLIC_SITE_URL`** — cambio de valor en Vercel: `https://immoralia.es/procesos`. Todo lo que usa esta variable (SPEC-13, 14, 15, 16, 22, 24) se ajusta solo.

4. **Redirects 301 desde el subdominio antiguo** — configurados en Vercel domain settings o en un archivo `next.config.ts` que capture `procesos.immoralia.es/*` y devuelva 301.

5. **Coordinación con GSC** — nueva propiedad `immoralia.es/procesos` (o usar la de `immoralia.es` completa si ya existe), verificación, Change of Address Tool desde `procesos.immoralia.es`, envío del nuevo sitemap.

### Desglose de tareas

1. **DATA-AGENT / operacional — Prerrequisitos:**
   - Confirmar acceso al servidor / configuración de `immoralia.es`.
   - Decidir mecanismo de rewrite/proxy (ambigüedad 2).
   - Inventariar dependencias externas hardcoded al subdominio (webhooks, emails, integraciones).

2. **BACKEND-AGENT — Configuración basePath:**
   - Añadir `basePath: '/procesos'` en `next.config.ts`.
   - Verificar localmente que todas las rutas siguen funcionando (`npm run dev` con basePath = tricky).

3. **BACKEND-AGENT — Rewrites en el proyecto Vercel `immoralia`:**
   - Añadir bloque `rewrites` en el `next.config.ts` (o `vercel.json`) del repo de `immoralia`:
     ```
     source: '/procesos/:path*'
     destination: 'https://immoralia-hub.vercel.app/procesos/:path*'
     ```
   - Testear en un preview antes de mergear a main.
   - Verificar que el `Host` header original (`immoralia.es`) se preserva y llega al catálogo.

4. **BACKEND-AGENT — Redirects 301 desde subdominio antiguo:**
   - Vercel domain settings o `next.config.ts` con `async redirects()` para capturar todo `procesos.immoralia.es/*` y devolver 301 a la URL equivalente bajo `immoralia.es/procesos/`.

5. **DATA-AGENT — Variables de entorno:**
   - Actualizar `NEXT_PUBLIC_SITE_URL` en Vercel a `https://immoralia.es/procesos`.
   - Verificar que las demás variables no dependen del dominio antiguo.

6. **DATA-AGENT — Google Search Console:**
   - Verificar propiedad `immoralia.es/procesos` (o `immoralia.es` completa) si no existe.
   - Change of Address Tool en la propiedad `procesos.immoralia.es`.
   - Reenviar el sitemap con las URLs nuevas.

7. **CONTENT-AGENT — Actualizar referencias externas:**
   - Emails Resend (plantillas): actualizar URLs.
   - GHL, ClickUp, cualquier otra integración con URLs hardcoded.
   - Documentación pública si la hay.

8. **VERIFICACIÓN POST-MIGRACIÓN:**
   - CA-01 a CA-13 con `curl` y clic manual.
   - CA-14 y CA-15 en seguimiento 2-4 semanas.
   - Plan de contingencia si CA-14 falla: rollback controlado (variable `NEXT_PUBLIC_SITE_URL` de vuelta, desactivar rewrites, redirects 301 en sentido inverso).

### Dependencias con otras specs

- **Bloqueada por:** decisión D2 (interna, con datos GSC de 4-6 semanas post-Fase 1).
- **Bloqueada por:** acceso a infraestructura de `immoralia.es` (externa al repo del catálogo).
- **Afecta a:** todas las specs que usan `NEXT_PUBLIC_SITE_URL` (SPEC-13, 14, 15, 16, 22, 24) — pero el impacto es solo cambio de valor de la variable, no de código.
- **No bloquea a:** ninguna spec del plan actual.

### Lecciones aplicables (LESSONS-LEARNED.md)

- **LL-006 (whitelist explícita):** al migrar, verificar explícitamente cada URL en los archivos de configuración. Nada de "cambiar y a ver".
- **LL-003 (no destruir estado local por errores transitorios):** si hay cookies de sesión antes/después, deben persistir o se debe comunicar la re-autenticación a los usuarios.

---

## Tests requeridos

### Tests unitarios

Ninguno directo.

### Tests de integración

CA-01 a CA-13 con `curl` post-migración. Smoke test manual completo: home → sector → ficha → contacto → chatbot → banner consent → login afiliado.

### Tests E2E

Recomendable un test manual del golden path completo con múltiples user agents (móvil, desktop, bot simulado).

*(P9 — Tests donde aportan valor. Los CA-14 y CA-15 se validan en seguimiento activo durante semanas.)*

---

## Out of scope (explícito)

- Migración a un dominio nuevo distinto de `immoralia.es` (fuera de scope; si se decide, es otra SPEC).
- Rediseño de las URLs (ej. `immoralia.es/procesos/salud` vs `immoralia.es/procesos/sector/salud`). Se mantienen las URLs actuales del catálogo tal cual, solo se anteponen con `/procesos/`.
- Migración del panel de admin/afiliados a otro subdominio. Se mueven junto con el resto.
- Reescritura de contenido para adaptarlo al dominio nuevo. El contenido es el mismo.
- Cambios en la estrategia de branding a nivel de marca. `procesos.immoralia.es` desaparece pero se preserva la memoria de marca del catálogo.

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-30 | Versión inicial — modo creación a partir del plan SEO + GEO (ClickUp knvz4-239675). Estado condicional: sujeta a decisión D2. | David Navarrete |
| 1.1 | 2026-06-30 | Resuelta ambigüedad 1: URL destino = `immoralia.es/procesos` (Opción A). Preserva branding actual, migración con mínima confusión de enlaces. | David Navarrete |
| 1.2 | 2026-06-30 | Ambigüedad 2 (mecanismo técnico rewrite/proxy) marcada como {{BLOQUEANTE}} — pendiente confirmar dónde está alojada `immoralia.es`. David revisará captura del panel de hosting. La spec no se puede aprobar hasta cerrar esto. | David Navarrete |
| 1.3 | 2026-06-30 | Resuelta ambigüedad 2: `immoralia.es` confirmado en Vercel (proyecto `immoralia` separado del `immoralia-hub`). Mecanismo = Vercel rewrites en `next.config.ts`/`vercel.json` del proyecto `immoralia`, apuntando `/procesos/:path*` al deploy del catálogo. El `Host` original se preserva → middleware SPEC-13 sigue funcionando. Bloqueante desmarcado. | David Navarrete |
| 1.4 | 2026-06-30 | Spec aprobada para implementación. Estado condicional preservado: la implementación efectiva depende de decisión D2 (con datos GSC post-Fase 1). | David Navarrete |
