# PROJECT-CONSTITUTION.md

**Proyecto:** immoralia-catalogo-procesos
**Versión de Constitution del proyecto:** 1.0
**Hereda de:** BRIANSPEC-CONSTITUTION.md v1.1
**Última actualización:** 2026-06-11
**Owner del proyecto:** David Navarrete (desarrollo) — Manel (responsable de vertical Immoralia)

> Este archivo se ha generado al adoptar BrianSpec sobre un proyecto **ya existente** (catálogo de procesos de Immoralia). No proviene de la entrevista inicial de `brianspec-init` — el catálogo ya tenía MVP y producción activa cuando se adoptó BrianSpec. Define las decisiones fundacionales del proyecto y será iterada con `brianspec-spec` a medida que aparezcan funcionalidades nuevas.

---

## 1. Descripción del proyecto

**Tipo de proyecto:** web-app

**Qué problema resuelve:**

Catálogo público de procesos automatizables que Immoralia ofrece como servicio. Permite a un dueño de negocio: identificarse con su sector, explorar los procesos automatizables relevantes para su día a día, seleccionar los que le interesan, descargar una auditoría de madurez y contactar para que Immoralia los implemente. Además sirve como knowledge base del chatbot, base de captación de leads y soporte del sistema de afiliados.

**Actores principales:**

- **Visitante anónimo** — dueño/gerente de un negocio de un sector concreto (salud, gestorías, centros deportivos, construcción, academias, gastronomía/hostelería, industrial). Explora, selecciona, contacta.
- **Chatbot (Brian Catálogo)** — asistente conversacional que orienta al visitante hacia procesos del catálogo según su problema.
- **Administrador (Immoralia)** — gestiona contenido del catálogo, procesos, embeddings, leads, partners.
- **Afiliado** — partner externo que comparte la URL con referral tracking y cobra comisión por leads cerrados.
- **Procesos automatizados internos** — workflows que generan guiones, vídeos Remotion e imágenes de cada proceso del catálogo.

**Alcance del MVP:**

El MVP ya está en producción. Cubre:

- Selector de sector + 7 landings de sector exclusivas (sports, gestorías, salud, construcción, academias, gastronomía/hostelería, industrial) + 3 landings universales (agencias, ecommerce, desarrolladoras).
- Catálogo completo con detalle por proceso, selección, drawer de "Mi Selección", formulario de contacto.
- Auditorías de madurez con PDF descargable por sector.
- Chatbot conversacional (Home, Sector, Detalle) con RAG via pgvector sobre la knowledge base de procesos.
- Onboarding modal para personalización del catálogo.
- Sistema de afiliados v1 con tracking y panel admin.
- Captación de leads + envío a Slack + ClickUp + GHL.
- Integración con Calendly/GHL para agendar llamadas.

**Fuera de alcance (explícito):**

- Sistema de pagos integrado en el catálogo (no e-commerce).
- Área de cliente final con contenido privado (los partners sí tienen panel; el visitante final no).
- Plataforma de formación / cursos / contenido educativo profundo (está en evaluación como proyecto separado).
- Multi-idioma — el catálogo es español únicamente.

---

## 2. Stack tecnológico

### Lenguajes y runtime

- **TypeScript** 5.x (estricto en frontend y backend Next).
- **Node.js** (runtime de Next, scripts y herramientas).
- **Deno** (runtime de edge functions de Supabase).
- **SQL / PL/pgSQL** (migraciones y RPCs Supabase).

### Frameworks y librerías principales

**Frontend:**
- Next.js 15.x — App Router
- React 18.3
- Tailwind CSS 3.x (+ `tailwindcss-animate`, `@tailwindcss/typography`)
- shadcn/ui (sobre Radix UI)
- lucide-react para iconos
- @tanstack/react-query
- react-hook-form + zod
- sonner para toasts
- recharts para gráficos puntuales
- date-fns para fechas
- next-themes
- vaul para drawers móviles
- embla-carousel-react

**Backend Next:**
- API routes en `src/app/api/`
- Server actions cuando proceda
- Middleware en `src/middleware.ts`
- @supabase/ssr para autenticación SSR

**Backend Supabase:**
- @supabase/supabase-js 2.x
- Edge Functions Deno (`supabase/functions/`) — **LEGACY: desde la migración a Next (junio 2026) no se usa ninguna edge function activa; toda la lógica de servidor vive en las API routes de Next.** El código permanece en el repo hasta su limpieza.

### Servicios y plataformas

- **Supabase** (Postgres + pgvector + Storage + Edge Functions + Auth)
  - Staging: `oxcjcsyowrlslbeylmih`
  - Producción: proyecto productivo aparte
- **Vercel** — hosting de Next, despliegue automático por rama (`staging` → staging, `main` → producción)
- **OpenAI API** — `text-embedding-3-small` y `gpt-4o-mini` para el chatbot
- **Slack** — notificaciones de leads vía webhook
- **ClickUp** — gestión de tareas, documentación y trazabilidad de specs
- **GHL (GoHighLevel)** — pipeline comercial y calendario de reservas
- **Resend** — envío de emails transaccionales
- **GitHub Actions** — workflows de despliegue automático y documentación

### Justificación del stack

- **Next.js 15 App Router** — migrado desde Vite en junio 2026. App Router permite SSR, edge runtime, API routes en el mismo repo, mejor SEO y mejor integración con Supabase SSR. Mantenido en Vercel sin cambios de hosting.
- **Supabase** — Postgres gestionado, pgvector nativo para RAG del chatbot, edge functions Deno separadas del runtime Next, auth lista. Es el estándar de Immoralia.
- **shadcn/ui** — componentes Radix ya integrados, copy-paste sin lock-in, totalmente Tailwind. Decisión heredada del Lovable inicial.
- **Tailwind** — utility-first encaja con desarrollo rápido, paleta de marca custom por sector.
- **React Query** — caching y revalidación de queries Supabase del lado cliente sin escribir state manual.

---

## 3. Integraciones externas

### Skills externas

Skills del ecosistema Immoralia que este proyecto consume o invoca desde otros entornos:

- `immoralia-image-catalog-generator` — genera las 3 imágenes de "Cómo funciona" por proceso y las sube a Supabase Storage.
- `immoralia-guion-catalog-generator` — genera guiones de vídeo y los guarda en Supabase.
- `immoralia-video-generator` — genera composiciones Remotion a partir de los guiones.
- `immoralia-n8n-sticky-notes-generator` — genera sticky notes para los workflows de n8n vinculados a procesos.
- `immoralia-changelog-catalog` — documenta cambios del catálogo en ClickUp.
- `immoralia-automation-report-generator` — informes de automatización para clientes.
- `immoral-project-memory-saver` — guarda hilos de conversación como memoria del proyecto.
- `n8n-flow-generator` — usado cuando un proceso necesita su workflow n8n correspondiente.

### MCPs (Model Context Protocol)

- **Supabase MCP** — operaciones contra la BD (migraciones, queries, deploy de edge functions).
- **ClickUp MCP** — gestión de tareas, docs y trazabilidad de specs.
- **Slack MCP** — comunicación interna del equipo.
- **GitHub MCP** — PRs, issues, workflows.
- **Google Drive / Docs / Sheets / Calendar MCPs** — operaciones puntuales (informes, documentación, calendario).
- **Holded MCP** — facturación e información comercial.
- **GHL MCP** — pipeline de leads y calendario de reservas.
- **GA4 MCP** — analítica del catálogo.
- **Canva, ElevenLabs, Remotion** — generación de assets multimedia.

### APIs de terceros

- **OpenAI** — embeddings y chat completions para el chatbot (clave en variable de entorno).
- **Slack Webhook** — notificación de leads nuevos.
- **GHL API** — creación de oportunidades en pipeline y reservas de calendario.
- **ClickUp API** — creación de tareas asociadas a leads y specs.
- **Resend** — emails transaccionales (notificaciones a partners, recuperación de contraseña).
- **GitHub Actions** — workflows internos del repo (no es API directa pero participa del flujo de despliegue).

### ClickUp — espacio del proyecto

- **clickup_space:** {{PENDIENTE — confirmar espacio de ClickUp donde se trackean specs del catálogo}}
- **clickup_list:** {{PENDIENTE — confirmar lista donde se crean tareas de cada SPEC aprobada}}

---

## 4. Herramienta de IA principal

**Copiloto declarado:** Claude Code

**Archivos de contexto generados para esta herramienta:**

- `CLAUDE.md` (ya existente — contiene convenciones del catálogo, REGLAS OBLIGATORIAS, mapa de sectores, plantillas de creación de sector, comandos útiles, responsables). Pre-existe a la adopción de BrianSpec y NO se sobreescribe — BrianSpec referencia desde aquí.
- `BRIANSPEC-CONSTITUTION.md` (sistema BrianSpec — principios globales).
- `PROJECT-CONSTITUTION.md` (este archivo — contexto específico del proyecto).
- `docs/BRIANSPEC-CHEATSHEET.md` — guía rápida del ciclo de vida BrianSpec.
- `.brianspec/agents.md` — agentes universales (SPEC, REVIEW, SECURITY).

---

## 5. Agentes de construcción de este proyecto

Los agentes universales (SPEC, REVIEW, SECURITY) vienen del sistema BrianSpec y operan en cualquier proyecto (`.brianspec/agents.md`). Los siguientes agentes de construcción son específicos de este proyecto y viven en `/agents/`:

- **01-FRONTEND-AGENT** — Next App Router, componentes React, Tailwind, shadcn/ui, estado de selección, accesibilidad.
- **02-BACKEND-AGENT** — API routes Next, middleware, server actions, integraciones externas (Slack, GHL, ClickUp, OpenAI, Resend).
- **03-DATA-AGENT** — Schema Supabase, migraciones SQL, RLS, edge functions Deno, embeddings, sync script TS→Supabase.
- **04-CONTENT-AGENT** — Contenido del catálogo: `processes.ts`, bloques y módulos por sector, auditorías, coherencia TS↔Supabase.

Los agentes están definidos en `/agents/{{NN}}-{{AGENT_NAME}}.md` y son consumidos por `brianspec-build`.

---

## 6. Convenciones de código

### Nomenclatura

- **Componentes React:** PascalCase (`ProcessCard.tsx`, `SectorChatbot.tsx`).
- **Páginas App Router:** siempre `page.tsx` dentro de la carpeta de ruta.
- **Hooks:** prefijo `use` en camelCase.
- **API routes:** archivo `route.ts` por endpoint.
- **Tablas Supabase:** plural snake_case.
- **Migraciones SQL:** `<YYYYMMDDHHMMSS>_<verbo>_<objeto>.sql`.
- **Edge functions:** kebab-case (`chat-assistant`).
- **Procesos del catálogo:** ver CLAUDE.md, sección "Estructura del fichero processes.ts" (id, codigo, slug, landing_slug, bloque_negocio, modulo_codigo).
- **Ramas git:** `feat/<nombre>`, `fix/<nombre>`, `claude/<nombre>` (de worktrees), `feat/<X>-v<N>` para iteraciones.

### Estructura de archivos

```
src/
├── app/                # Next App Router (rutas + API)
│   ├── api/            # API routes
│   ├── sector/<slug>/  # Páginas de sector
│   ├── auditorias/     # Páginas de auditoría
│   ├── catalogo/       # Catálogo completo + detalle
│   └── ...
├── views/              # Componentes de página (consumidos por page.tsx)
├── components/
│   ├── ui/             # shadcn (no editar a mano)
│   └── *               # Componentes reutilizables
├── data/               # FUENTE DE VERDAD de contenido
│   ├── processes.ts
│   ├── <sector>Blocks.ts
│   ├── <sector>Modules.ts
│   └── auditoria<Sector>Data.ts
├── lib/                # Utilidades cliente y servidor
├── integrations/supabase/  # Cliente y tipos auto-generados
└── middleware.ts

supabase/
├── migrations/
└── functions/

scripts/  # Scripts de sync, embeddings, generación de assets, etc.

agents/   # Agentes de construcción de BrianSpec
specs/    # Specs activas
specs/archive/  # Specs implementadas y archivadas
.brianspec/     # Sistema BrianSpec (templates, agentes universales, lecciones)
```

### Estilo

- **Tailwind utility-first**, sin CSS suelto fuera de `globals.css` y `index.css`.
- **Iconos:** solo `lucide-react`. Nada de Heroicons ni otros packs.
- **Componentes UI:** shadcn/ui obligatorio para primitivas; wrappers en `src/components/`.
- **Idioma de UI y contenido:** español, lenguaje cliente sin jerga técnica.
- **Fondo base:** `bg-[#0d0d0d]`. Acento por sector vía `SECTOR_CONFIG`.
- **Mobile-first.** Breakpoints `md:`, `lg:` por defecto Tailwind.
- **Async/await** siempre (no `.then()` encadenados en API routes).
- **Zod** para validación de inputs en API routes.

### Tests

{{PENDIENTE — el proyecto no tiene actualmente test suite automatizada. Política a definir.}}

---

## 7. Modelo de datos

Resumen de tablas clave en Supabase (Postgres + pgvector). Detalle completo en `supabase/migrations/`:

- **processes** — tabla espejo de `src/data/processes.ts`. Whitelist sincronizada por `scripts/sync_processes_to_supabase.v2.mjs`. Contiene también campos de assets (`guion_generado`, `video_remotion_url`, `image_url_*`, etc.) que se rellenan por procesos automatizados y NO se tocan desde TS.
- **chatbot_knowledge** — knowledge base del chatbot. Embeddings vectoriales (pgvector 1536 dim) de procesos + general_faqs. Se regenera con `scripts/extract_content.mjs` + `scripts/generate_embeddings.mjs`.
- **chat_conversations** + **chat_messages** — persistencia de conversaciones del chatbot.
- **contact_submissions** — leads enviados desde el formulario de contacto.
- **onboarding_responses** — respuestas del modal de onboarding (perfil del visitante).
- **share_selections** — selecciones compartidas vía link único.
- **partners** + tablas relacionadas — sistema de afiliados v1.
- **catalog_active** (columna en processes) — mapea con `hidden: true` en TS vía sync.

**Función SQL principal:** `match_chatbot_knowledge(query_embedding, match_threshold, match_count, sector_filter)` — busca docs similares con filtro opcional por sector.

**Regla obligatoria #1 del CLAUDE.md:** dos fuentes de verdad — TS para contenido, Supabase para assets generados. El sync respeta la frontera estricta.

---

## 8. Convenciones operativas

### Git

- **Naming de ramas:** `feat/<nombre>`, `fix/<nombre>`, `feat/<nombre>-v<N>` para iteraciones, `claude/<nombre>` para worktrees automáticos.
- **Convención de commits:** mensajes en español, formato `<tipo>(<scope>): <descripción>` (ej: `fix(leads): naming unificado ClickUp`). Sin Conventional Commits estricto, pero claros.
- **Política de PRs:**
  - Salen siempre de `origin/staging`.
  - Se mergean a `staging`.
  - Cuando una tanda está validada en staging, PR `staging → main`.
  - Cada PR usa el **Prompt Maestro** como descripción (memoria del usuario `feedback_pr_description_format`).
  - NUNCA mergear a main ni a staging sin confirmación explícita del usuario.
  - NUNCA hacer push directo sin instrucción explícita.

### Despliegue

- **Vercel:**
  - `staging` rama → deploy preview / entorno staging.
  - `main` rama → producción.
- **Supabase staging:** `supabase db push` manual desde CLI linkada a staging.
- **Supabase producción:** automático vía `.github/workflows/supabase-sync.yml` al mergear PR a `main`. Aplica migraciones y despliega edge functions.
- **ClickUp docs:** automático vía `.github/workflows/clickup-docs.yml`.

### Variables de entorno

Frontend (gitignored, ver `.env.example`):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Backend (server-only):
```
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
SLACK_WEBHOOK_URL
GHL_API_KEY
GHL_LOCATION_ID
GHL_PIPELINE_ID
GHL_CALENDAR_ID
CLICKUP_API_TOKEN
RESEND_API_KEY
```

Scripts (gitignored):
```
STAGING_SUPABASE_URL
STAGING_SUPABASE_SERVICE_ROLE_KEY
PROD_SUPABASE_URL
PROD_SUPABASE_SERVICE_ROLE_KEY
```

---

## 9. Restricciones específicas del proyecto

Restricciones técnicas, de negocio, de seguridad o de cumplimiento que aplican solo a este proyecto:

1. **REGLA OBLIGATORIA #1 — Flujo TS ↔ Supabase.** Toda edición de procesos del catálogo se hace en `src/data/processes.ts` y se sincroniza con `scripts/sync_processes_to_supabase.v2.mjs`. Nunca editar la tabla `processes` de Supabase directamente. Nunca tocar campos de assets desde TS. (Detalle en CLAUDE.md.)

2. **REGLA OBLIGATORIA #2 — No worktrees.** Trabajar siempre en el proyecto principal, no en `.claude/worktrees/`. (Memoria `feedback_no_worktrees`.)

3. **Rama base siempre `staging`, nunca `main`.** Cualquier rama nueva sale de `origin/staging`.

4. **No commit ni push sin instrucción explícita.** El asistente nunca commitea/pushea por iniciativa propia.

5. **No mergear PRs ni hacer push a staging/main sin confirmación explícita.** Validación primero en local.

6. **Idioma de comunicación:** español. La UI del catálogo, las specs y los commits están en español.

7. **Lenguaje cliente sin jerga técnica** en nombres visibles de procesos y módulos. Prohibido TPM, OEE, KPI, SLA, RFQ, MES, ERP en títulos públicos (en specs internas sí están permitidos).

8. **Catálogo público no consulta Supabase para contenido.** Las landings importan estáticamente `src/data/processes.ts`. Supabase se usa solo para chatbot, knowledge base, leads, share-selection, afiliados.

9. **Producción es sensible al SEO.** Cualquier cambio que afecte rutas, metadatos, OG tags o sitemap debe verificarse antes de merge.

10. **El cliente final no es técnico.** Convenciones del catálogo orientadas a propietarios/gerentes de negocios de 5-30 empleados — no a perfiles técnicos.

---

## 10. Cómo aplica BrianSpec a este proyecto

### Comandos disponibles

- `brianspec-spec` → Generar/clarificar specs nuevas
- `brianspec-build` → Implementar specs con revisión automática
- `brianspec-archive` → Cerrar y archivar specs implementadas
- `brianspec-upgrade` → Actualizar BrianSpec a nueva versión

### Umbral para spec

Sigue lo definido en `BRIANSPEC-CONSTITUTION.md` (P1). En este proyecto, **requiere spec** todo cambio que:

- Afecte al visitante del catálogo (UI, flujos, contenido visible).
- Introduzca un sector nuevo o modifique la lista de sectores activos.
- Modifique el modelo de datos de Supabase (tablas, columnas, RLS, funciones SQL).
- Cambie el comportamiento del chatbot (prompts, RAG, embeddings, lógica de respuesta).
- Modifique integraciones externas (Slack, GHL, ClickUp, OpenAI, Resend).
- Modifique el sistema de afiliados o el panel admin.
- Introduzca cambios estructurales en el modelo de procesos (campos, formatos, convenciones).

**NO requiere spec:**

- Hotfixes evidentes (typo, null check, fix de regression menor).
- Refactors internos sin cambio funcional.
- Cambios de copy puntual sin cambio de comportamiento.
- Generación de assets automatizados (guiones, vídeos, imágenes) por procesos batch.
- Sync de contenido vía `sync_processes_to_supabase.v2.mjs`.
- Operaciones de mantenimiento del knowledge base (regeneración de embeddings).

### Política de tests

{{PENDIENTE — el proyecto no tiene test suite automatizada hoy. Definir si introducimos Playwright para regression visual de landings, vitest para utilidades críticas, o mantenemos validación manual con golden path en localhost antes de PR.}}

---

## 11. Enmiendas a esta Constitution del proyecto

Esta Constitution del proyecto puede modificarse cuando una decisión fundacional cambie (cambio de stack mayor, cambio de owner, cambio de alcance, adopción de una nueva REGLA OBLIGATORIA). El cambio se versiona en el `CHANGELOG.md` del proyecto y se anuncia al equipo antes de aplicarse.

Las enmiendas al `BRIANSPEC-CONSTITUTION.md` global siguen su propio proceso, definido en su sección 4. Este proyecto no puede modificar la Constitution global.

---

*Proyecto immoralia-catalogo-procesos — Adoptado BrianSpec v1.1 el 2026-06-11 sobre proyecto pre-existente en producción.*
