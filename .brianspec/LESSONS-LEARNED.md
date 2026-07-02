# LESSONS-LEARNED.md

**Proyecto:** {{PROJECT_NAME}}
**Sistema:** BrianSpec v1.2
**Última actualización:** {{FECHA}}

Este archivo es la **memoria de errores y aprendizajes del proyecto**. Lo escribe `brianspec-build` al cerrar cada spec y lo lee al iniciar cada build. Su propósito es que los errores cometidos en una implementación no vuelvan a ocurrir.

---

## Cómo usar este archivo

- **Lectura:** `brianspec-build` lo carga en Fase 1 antes de implementar. Filtra por stack y tipo de funcionalidad.
- **Escritura:** `brianspec-build` lo actualiza en Fase 6 tras cada implementación.
- **Formato:** una entrada por lección, con estructura estándar. No escribir en prosa libre.
- **Limpieza:** si una lección queda obsoleta (se cambió el stack, se eliminó la funcionalidad), marcarla con `**Estado: OBSOLETA**` — no borrar.

---

## LL-010 — next/image requiere whitelist de dominios remotos en next.config.ts
**Fecha:** 2026-07-02
**Spec origen:** SPEC-17 (detectado en SPEC-22)
**Stack afectado:** Next.js App Router + next/image + Supabase Storage
**Lección:** Al migrar de `<img>` a `<Image>` (next/image), las imágenes de dominios externos dejan de renderizarse silenciosamente en producción/staging si el dominio no está en `images.remotePatterns` del `next.config.ts`. No hay error en build ni en consola de desarrollo — simplemente no se ven. Afectó a `image_url_1/2/3` de todos los procesos (sección "Cómo funciona").
**Cómo aplicar:** cualquier PR que introduzca `<Image>` de next/image con URLs remotas DEBE incluir la actualización de `next.config.ts` con `images.remotePatterns`. Smoke test mínimo tras desplegar: abrir una ficha de proceso y confirmar visualmente que se ven las imágenes del carrusel. El patrón ya configurado es `*.supabase.co/storage/v1/object/public/**`.
**Severidad:** Alta

## LL-009 — Verificar slug↔modulo_codigo antes de inyectar contenido en lotes paralelos
**Fecha:** 2026-07-02
**Spec origen:** SPEC-22
**Stack afectado:** src/data/processes.ts (edición masiva de contenido)
**Lección:** Al inyectar contenido en lotes paralelos sobre processes.ts, el orden en el scratchpad de generación NO coincide necesariamente con el orden en el fichero. Se inyectó contenido de 6 procesos en los procesos incorrectos (2 swaps y 1 ciclo de 4). El build TypeScript no detecta este error porque los tipos son correctos; solo una revisión semántica lo descubre.
**Cómo aplicar:** antes de hacer edits en lote de contenido por proceso, leer el slug y el nombre de cada proceso directamente del fichero y cruzarlos con el contenido a inyectar. No asumir que "proceso N de la lista" = "proceso con modulo_codigo N.X" sin verificar. Anclar el edit con el slug o el nombre del proceso como parte del old_string.
**Severidad:** Media

## Entradas

<!-- brianspec-build añadirá entradas aquí siguiendo este formato:

## LL-001 — título corto
**Fecha:** YYYY-MM-DD
**Spec origen:** SPEC-NN
**Stack afectado:** tecnología o capa (ej: "Next.js App Router", "Supabase RLS", "n8n HTTP node")
**Lección:** descripción clara del patrón, error o restricción descubierta
**Cómo aplicar:** instrucción concreta para el agente de construcción
**Severidad:** Alta / Media / Baja
**Confirmada en:** SPEC-XX, SPEC-YY (se añade cuando otra spec refuerza la misma lección)

-->

## LL-001 — Tablas nuevas y tipos auto-generados de Supabase
**Fecha:** 2026-06-12
**Spec origen:** SPEC-01
**Stack afectado:** Supabase + TypeScript (Next API routes)
**Lección:** `src/integrations/supabase/types.ts` es auto-generado y no conoce las tablas de una migración hasta aplicarla y regenerar. Usar el cliente tipado `createClient<Database>` contra tablas nuevas rompe la compilación.
**Cómo aplicar:** para tablas recién migradas, crear el cliente sin generics y tipar las filas a mano en un `types.ts` local del módulo; tras aplicar la migración, regenerar tipos (`supabase gen types typescript --linked`) y migrar al cliente tipado.
**Severidad:** Media

## LL-002 — Persistencia dentro de streams SSE en serverless
**Fecha:** 2026-06-12
**Spec origen:** SPEC-01
**Stack afectado:** Next.js App Router (route handlers con ReadableStream) en Vercel
**Lección:** en serverless, la función puede terminar en cuanto el stream se cierra. Cualquier escritura en BBDD posterior al cierre puede no ejecutarse.
**Cómo aplicar:** completar TODAS las escrituras (mensaje del bot, contadores, resumen) con `await` dentro del `start` del stream, ANTES de emitir el evento final y de `controller.close()`.
**Severidad:** Alta

## LL-007 — Sender centralizado de email > llamadas directas a Resend dispersas
**Fecha:** 2026-06-12
**Spec origen:** SPEC-05
**Stack afectado:** integraciones Resend en API routes
**Lección:** Antes de SPEC-05, el catálogo tenía 5 puntos distintos llamando directamente a `fetch('https://api.resend.com/emails')` cada uno con su lógica de `try/catch` y `console.error`. Resultado: cuando Resend rechazaba un envío (p.ej. "domain not verified" del entorno local), el error iba al log de Vercel y nadie lo veía. El smoke test SPEC-05 reveló que el dominio del local no estaba verificado — algo que llevaba tiempo escondido. Tener un sender centralizado con tabla `email_logs` hace visibles los problemas.
**Cómo aplicar:** cualquier integración con un servicio externo que envíe (email, SMS, push) debe pasar por una función helper centralizada que registre el resultado en BBDD. Las llamadas dispersas que solo logean en consola esconden fallos.
**Severidad:** Media

## LL-006 — Whitelist explícita > "enviar el objeto entero"
**Fecha:** 2026-06-12
**Spec origen:** SPEC-06
**Stack afectado:** scripts de sync TS→BBDD
**Lección:** El script original mandaba el objeto procesos completo a Supabase. Cuando se eliminó la columna `categoria` del schema, el script siguió enviándola — y todos los UPSERT fallaron silenciosamente. Una whitelist explícita de columnas (declarada como constante en el script) habría detectado el cambio de schema antes de fallar en producción.
**Cómo aplicar:** cualquier script que escriba a una tabla debe declarar explícitamente qué columnas envía. Cuando el schema cambia, se actualiza la whitelist a propósito — no a posteriori, debugging fallos.
**Severidad:** Media · **Confirmada en:** SPEC-04, SPEC-06, SPEC-21

## LL-004 — El script de sync TS→Supabase está desactualizado
**Fecha:** 2026-06-12
**Spec origen:** SPEC-04
**Stack afectado:** scripts/sync_processes_to_supabase.mjs + schema processes
**Lección:** `sync_processes_to_supabase.mjs` intenta enviar la columna `categoria` que se eliminó del schema (campo @deprecated del TS). El sync falla con "Could not find the 'categoria' column" para todos los procesos. Además sus variables de entorno son `VITE_*` (proyecto era Vite). Resultado: el sync NO está operativo y los procesos nuevos en TS no llegan a BBDD hasta que se haga a mano.
**Cómo aplicar:** para procesos puntuales, actualizar via MCP Supabase (`mcp__supabase__execute_sql`). Spec separada futura para reparar el script — debe ignorar `categoria`/`categoriaNombre` (whitelist explícita de columnas a sincronizar) y soportar variables de entorno actuales (NEXT_PUBLIC_*, STAGING_*).
**Severidad:** Media · **Estado: RESUELTA** en SPEC-06.

## LL-005 — Los dolores son el campo con más impacto en matching semántico
**Fecha:** 2026-06-12
**Spec origen:** SPEC-04
**Stack afectado:** chatbot RAG + processes.dolores
**Lección:** En la batería de tests baseline, los 4 fallos (de 24 preguntas) tenían en común que el proceso esperado o (a) tenía `dolores: []` vacío o (b) tenía dolores en jerga interna en lugar de vocabulario del cliente. Tras reescribir solo los `dolores` de esos 4 procesos (sin tocar nombres, descripciones ni pasos), la batería pasó de 83% a 100% en ambos sectores piloto.
**Cómo aplicar:** la revisión editorial de cada sector debe priorizar `dolores` antes que cualquier otro campo. Cada proceso debe tener 4-8 dolores en primera persona, sin tecnicismos, incluyendo sinónimos cuando el mismo dolor se exprese de distintas formas en el lenguaje real.
**Severidad:** Alta

## LL-003 — No destruir estado local por errores transitorios del servidor
**Fecha:** 2026-06-12
**Spec origen:** SPEC-02
**Stack afectado:** Next.js dev server + estado en localStorage
**Lección:** el dev server de Next compila rutas on-demand y la primera petición a una API puede devolver un error transitorio. Tratar cualquier respuesta no-OK como "el recurso no existe" llevó a borrar el identificador de conversación del visitante al navegar entre páginas.
**Cómo aplicar:** antes de limpiar estado local persistente, distinguir estados definitivos (404 no existe, 410 caducado) de errores transitorios (5xx, red): los definitivos limpian, los transitorios conservan y reintentan.
**Severidad:** Media
