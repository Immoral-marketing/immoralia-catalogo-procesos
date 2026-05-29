# CLAUDE.md — Catálogo de Procesos Immoralia

Instrucciones obligatorias para cualquier Claude (Manel, David o cualquier otro) que abra una sesión sobre este repo. Léelas enteras antes de tocar nada.

**Idioma de comunicación con el usuario:** español.

---

## Stack y arranque

- **Frontend:** Vite + React 18 + TypeScript + Tailwind + shadcn/ui (Radix) + lucide-react + react-router-dom + @tanstack/react-query.
- **Backend / BBDD:** Supabase (Postgres + pgvector + Edge Functions Deno).
- **Despliegue:** Vercel sobre rama `staging` y `main`.
- **Project Supabase staging:** `oxcjcsyowrlslbeylmih` (ver `supabase/.temp/linked-project.json`).

```bash
npm install
npm run dev           # arranca Vite local
npm run build         # build de producción
npm run build:dev     # build modo development
npm run lint          # eslint
```

Variables de entorno del frontend (gitignored):
```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Variables del script de sync (gitignored, ver `scripts/sync_processes_to_supabase.v2.mjs`):
```
STAGING_SUPABASE_URL
STAGING_SUPABASE_SERVICE_ROLE_KEY
PROD_SUPABASE_URL
PROD_SUPABASE_SERVICE_ROLE_KEY
```

---

## ⚠️ REGLA OBLIGATORIA #1 — Flujo TS ↔ Supabase

**Aplica a Manel, David y cualquier persona que toque procesos.**

Hay **dos fuentes de verdad** y un **script de sincronización** entre ellas. Confundirlas desincroniza el catálogo y se pierden assets (vídeos, imágenes, guiones) generados.

### Las dos fuentes

| Fuente | Manda en... |
|---|---|
| `src/data/processes.ts` | CONTENIDO: `id`, `codigo`, `slug`, `nombre`, `tagline`, `descripcionDetallada`, `pasos`, `personalizacion`, `sectores`, `herramientas`, `dolores`, `canales`, `integration_domains`, `landing_slug`, `bloque_negocio`, `modulo_codigo`, `recomendado`, `hidden` |
| Tabla `processes` en Supabase | ASSETS generados: `guion_generado`, `guion_clickup_url`, `guion_generado_at`, `video_generado`, `video_remotion_url`, `video_generado_at`, `image_url_1/2/3`, `image_subtitle_1/2/3`, `imagenes_generadas`, `imagenes_generadas_at` |

### La landing NO consulta Supabase

Todas las landings de sector (`SaludLanding`, `GestoriasLanding`, `SportsLanding`, etc.) hacen:
```ts
import { processes } from "@/data/processes"
```
Es **import estático en build time**. Lo que ve el cliente sale de `processes.ts`, no de la BD.

Supabase se usa para: chatbot (embeddings pgvector), knowledge base, conversaciones, compartir selección, afiliados, tracking de assets, captación de leads onboarding. **Nada de eso pinta el catálogo público.**

### Dos pasos OBLIGATORIOS al tocar procesos

Cuando añadas un proceso o cambies cualquier campo de la whitelist:

**Paso 1.** Editar `src/data/processes.ts`.

**Paso 2.** Ejecutar el sync script:
```bash
# Dry-run (te dice qué cambiará sin aplicar)
node scripts/sync_processes_to_supabase.v2.mjs --verbose

# Aplicar a staging
node scripts/sync_processes_to_supabase.v2.mjs --apply

# Aplicar a producción (solo cuando esté validado en staging)
node scripts/sync_processes_to_supabase.v2.mjs --target=prod --apply

# Borrar registros que ya no existen en TS
node scripts/sync_processes_to_supabase.v2.mjs --apply --delete-orphans
```

El script:
- Solo toca campos de la whitelist (los de contenido).
- **NUNCA sobreescribe** los campos de assets.
- Mapea `hidden: true` (TS) ↔ `catalog_active: false` (BD).

### NUNCA hagas esto

- ❌ Editar directamente la tabla `processes` en Supabase Studio → queda desincronizado con TS y al siguiente sync se sobreescribe.
- ❌ Cambiar solo TS sin ejecutar sync → chatbot/embeddings/knowledge base se quedan con datos viejos.
- ❌ Cambiar solo Supabase sin tocar TS → la landing no se entera.
- ❌ Tocar campos de assets desde TS → no pasarán al sync, pero confunden a quien lee el fichero.

Referencia ampliada: doc ClickUp "Regla obligatoria — Flujo TS↔Supabase" (`knvz4-233635`, doc `knvz4-80475`).

---

## ⚠️ REGLA OBLIGATORIA #2 — Worktrees

**NUNCA edites ficheros del proyecto principal cuando trabajes en un worktree de staging.**

- El worktree vive en `C:\Claude Immoral\Repos\Catalogo Procesos\immoralia-catalogo-procesos\.claude\worktrees\<nombre>\`.
- El proyecto principal vive en `C:\Claude Immoral\Repos\Catalogo Procesos\immoralia-catalogo-procesos\`.
- Si editas en el proyecto principal pensando que es el worktree, los cambios no aparecen en el dev server del worktree y pierdes tiempo.
- Antes de cada edición confirma que la ruta empieza por `.claude\worktrees\<nombre>\`.

---

## Arquitectura del catálogo

### Sectores activos (en `src/pages/SectorSelector.tsx`)

| Sector | landing_slug | Ruta | Página | Datos |
|---|---|---|---|---|
| Centros Deportivos | `centros-deportivos` | `/sector/centros-deportivos` | `SportsLanding.tsx` | `centrosDeportivosBlocks.ts` + `centrosDeportivosModules.ts` |
| Gestorías | `gestorias` | `/sector/gestorias` | `GestoriasLanding.tsx` | `gestoriasBlocks.ts` + `gestoriasModules.ts` |
| Centros de Salud | `salud` | `/sector/salud` | `SaludLanding.tsx` | `saludBlocks.ts` + `saludModules.ts` |
| Construcción & Inmobiliaria | `construccion` | `/sector/construccion` | `ConstruccionLanding.tsx` | `construccionBlocks.ts` + `construccionModules.ts` |
| Academias / Formación | `academias` | `/sector/academias` | `AcademiasLanding.tsx` | `academiasBlocks.ts` + `academiasModules.ts` |
| Gastronomía y Hotelería | `gastronomia-hosteleria` | `/sector/gastronomia-hosteleria` | `RestauracionLanding.tsx` | `restauracionBlocks.ts` + `restauracionModules.ts` |
| Industrial | `industrial` | `/sector/industrial` | `IndustrialLanding.tsx` | `industrialBlocks.ts` + `industrialModules.ts` |

Redirects activos en `App.tsx`:
- `/sector/restauracion` → `/sector/gastronomia-hosteleria`
- `/sector/inmobiliaria` → `/sector/construccion`

### Estructura de un sector "completo"

Un sector completo (como Salud) tiene:

```
src/data/<sector>Blocks.ts        # Los 6 bloques de negocio B1-B6
src/data/<sector>Modules.ts       # 18-22 módulos con codigo "B.N"
src/data/auditoria<Sector>Data.ts # Preguntas de auditoría de madurez
src/lib/auditoria<Sector>Pdf.ts   # Generador PDF de la auditoría
src/pages/<Sector>Landing.tsx     # Landing pública del sector
src/pages/Auditoria<Sector>.tsx   # Página /auditorias/<sector>
public/<sector>/b1.png ... b6.png # Imagen por bloque
public/<sector>/hero.png          # Imagen hero
```

### Los 6 bloques de negocio (B1...B6)

Cada sector con landing dedicado define 6 bloques en su `<sector>Blocks.ts`. Cada bloque tiene:
```ts
{
  id: "B1",                       // B1 | B2 | B3 | B4 | B5 | B6
  number: "01",
  title: "Captación y primera visita",
  sub: "Subtítulo en lenguaje cliente",
  icon: PhoneCall,                // lucide-react
  accent: "#0ea5e9",
  accentBg, accentBorder, accentText, accentGradient,
  image: "/<sector>/b1.png",
  teaser: "...",
  paragraph: "...",
  benefits: ["...", "...", "..."]
}
```

Cada bloque agrupa 3-4 módulos definidos en `<sector>Modules.ts`:
```ts
{
  codigo: "1.1",                  // formato B.N — primer dígito = bloque
  bloque: "B1",
  nombre: "Asistente de voz 24/7",
  descripcion: "...",
  badge: "Cero llamadas perdidas",
  linkedProcessSlug: "salud-voz-citas-247",
  highlights: ["...", "...", "..."]
}
```

### Auditoría de madurez

Página dedicada `/auditorias/<sector>` con cuestionario que genera un PDF de diagnóstico. Patrón: data en `src/data/auditoria<Sector>Data.ts`, generador PDF en `src/lib/auditoria<Sector>Pdf.ts`, índice general en `src/pages/AuditoriasIndex.tsx`.

---

## Estructura del fichero `src/data/processes.ts`

### Campos obligatorios al crear un proceso para un sector

```ts
{
  id: "IND_1_1",                      // ID interno único
  codigo: "1.1",                      // Formato B.N — debe coincidir con modulo_codigo
  slug: "industrial-captura-presupuestos",  // kebab-case sin tildes
  landing_slug: "industrial",         // Asigna el sector EXCLUSIVO
  bloque_negocio: "B1",               // B1 | B2 | B3 | B4 | B5 | B6
  modulo_codigo: "1.1",               // Debe coincidir con el codigo del módulo
  nombre: "Captura de peticiones...",
  tagline: "Frase corta de gancho",
  descripcionDetallada: "...",
  recomendado: true | false,
  pasos: ["paso 1", "paso 2", "paso 3"],
  personalizacion: "...",
}
```

### Campos opcionales pero recomendados

`one_liner`, `badges`, `benefits`, `summary` (what_it_is, for_who, requirements, output), `indicators` (time_estimate, complexity, integrations), `how_it_works_steps`, `customization`, `demo`, `faqs`, `use_cases`, `common_mistakes_avoided`, `related_processes`, `herramientas`, `canales`, `madurez`, `dolores`, `integration_domains`, `sector_variants`.

### Campos @deprecated (no usar en procesos nuevos)

- `categoria` y `categoriaNombre` — sustituidos por `bloque_negocio` en runtime. Solo siguen ahí por compatibilidad con procesos universales antiguos.

### Campos espejo de Supabase (NO editar desde TS)

Existen en la interfaz `Process` solo para que TypeScript no llore al leerlos del sync. **Nunca los rellenes a mano en `processes.ts`** — los gestionan procesos automatizados de generación de assets:
```
catalog_active, guion_generado, guion_clickup_url, guion_generado_at,
video_generado, video_remotion_url, video_generado_at,
image_url_1/2/3, image_subtitle_1/2/3,
imagenes_generadas, imagenes_generadas_at
```

### Procesos universales vs procesos exclusivos de sector

- **Exclusivos de sector** (modelo nuevo): `landing_slug: "<sector>"` + `bloque_negocio` + `modulo_codigo`. Solo aparecen en la landing de ese sector.
- **Universales** (modelo antiguo): sin `landing_slug`, con array `sectores: [...]` que lista los sectores donde aplica. Aparecen filtrados por nombre de sector.

Para sectores nuevos **usa siempre el modelo exclusivo** (landing_slug). Es el patrón de Salud y los sectores recientes.

---

## Convenciones de código

### Naming y lenguaje

- **Nada de jerga técnica** en nombres de procesos, módulos o bloques. Prohibido: TPM, OEE, KPI, SLA, RFQ, MES, ERP en títulos visibles (en specs internos sí).
- **Lenguaje cliente, en español**, hablando del problema antes que de la solución.
- **Codigo**: formato `B.N` (`1.1`, `4.6`). Primer dígito = bloque.
- **Slug**: kebab-case sin tildes, prefijo de sector cuando aplica (`salud-voz-citas-247`, `industrial-captura-presupuestos`).
- **id**: `<SECTOR_PREFIX>_<BLOQUE>_<NUM>` para procesos exclusivos (ej. `IND_1_1`), o letra+número legacy (`A1`, `GS5`) para universales.

### UI / Estilo

- Fondo base de landings: `bg-[#0d0d0d]`.
- Acento por sector definido en el `<sector>Blocks.ts` y reutilizado en la landing.
- Iconos **siempre de lucide-react** (no Heroicons ni otros packs).
- Componentes UI de **shadcn/ui** (`@/components/ui/*`). No mezclar con otras librerías de componentes.
- Mobile-first, breakpoints `md:` y `lg:` según Tailwind por defecto.

### Componentes compartidos clave

| Componente | Para qué sirve |
|---|---|
| `ProcessCard` | Tarjeta de proceso reutilizable en todas las landings |
| `SelectionSummary` | Drawer lateral con la selección del usuario |
| `ContactForm` | Modal de contacto final |
| `OnboardingModal` | Modal de personalización del catálogo |
| `ShareSelectionModal` | Compartir selección por link |
| `CalendlyLeadModal` | Captura de lead + agendar llamada |
| `StepIndicator` | Indicador de paso en flujo de sectorSelector → landing |
| `Chatbot` | Asistente flotante (consume Supabase + embeddings) |
| `ReferralTracker` | Tracking de referrals en URL |

### Estado global

- `src/lib/SelectionContext.tsx` — Context React con `selectedProcessIds`, `toggleProcess`, `n8nHosting`, `setN8nHosting`. Envuelve toda la app en `App.tsx` vía `<SelectionProvider>`.

---

## Cómo añadir un sector nuevo (plantilla)

Clonar desde Salud, que es el sector más reciente y completo.

1. Crear los datos:
   - `src/data/<sector>Blocks.ts` — 6 bloques con icono, color, copy, imagen
   - `src/data/<sector>Modules.ts` — 18-22 módulos con `codigo`, `bloque`, `linkedProcessSlug`
   - `src/data/auditoria<Sector>Data.ts` — preguntas de auditoría (opcional pero recomendado)
   - `src/lib/auditoria<Sector>Pdf.ts` — generador PDF (clonar de salud)

2. Crear las páginas:
   - `src/pages/<Sector>Landing.tsx` — clonar `SaludLanding.tsx`, cambiar `ACCENT`, `AUDIT_URL`, `<sector>_LANDING_SLUG` y los imports
   - `src/pages/Auditoria<Sector>.tsx` — clonar `AuditoriaSalud.tsx`

3. Crear los assets:
   - `public/<sector>/b1.png ... b6.png` + `hero.png` (placeholders al principio)

4. Registrar el sector:
   - Card nueva en `src/pages/SectorSelector.tsx` (array `sectors`)
   - Dos rutas nuevas en `src/App.tsx` (`/sector/<slug>` y `/auditorias/<slug>`)
   - "<Nombre>" añadido a la lista de sectores de `src/components/OnboardingModal.tsx` si aplica
   - Registrar la auditoría en `src/pages/AuditoriasIndex.tsx` si tiene página dedicada

5. Crear los procesos:
   - Añadir 18-22 entradas en `src/data/processes.ts` con `landing_slug: "<sector>"`, `bloque_negocio`, `modulo_codigo` rellenos correctamente
   - Cumplir REGLA OBLIGATORIA #1 (ver arriba)

6. Smoke test local: home → card sector → landing → auditoría → seleccionar procesos → contacto.

7. Ejecutar sync a staging y abrir PR contra `staging` (nunca contra `main` directamente).

---

## Branch strategy y despliegue

### Ramas

- `main` — producción. Solo se mergea desde `staging` vía PR.
- `staging` — preproducción. Aquí se acumulan las features antes de pasar a producción.
- `feat/<nombre>` y `fix/<nombre>` — ramas de trabajo. Salen siempre de `origin/staging`.
- `claude/<nombre>` — ramas de worktrees automáticos de Claude Code.

### Flujo de despliegue

1. Crear rama desde `origin/staging`: `git checkout -b feat/<nombre> origin/staging`.
2. Trabajar localmente, validar con `npm run dev`.
3. Si hay cambios en procesos: ejecutar sync script (REGLA #1).
4. Commit + push.
5. Abrir PR contra `staging`. Mergear cuando esté revisado.
6. La rama `staging` despliega automáticamente al entorno staging.
7. Cuando una tanda esté validada en staging, abrir PR de `staging` → `main`.
8. Al mergear el PR a `main`, el workflow `.github/workflows/supabase-sync.yml` ejecuta automáticamente:
   - `supabase db push` contra la BD de producción (migraciones)
   - `supabase functions deploy` para todas las edge functions
   - Crea página de documentación en ClickUp con el cambio

### Migraciones SQL

- Vivien en `supabase/migrations/<YYYYMMDDHHMMSS>_<nombre>.sql`.
- Aplicar a staging manualmente: `supabase db push` (CLI linkada al proyecto staging).
- A producción: automático vía workflow al mergear `staging → main`.
- Después de cambios de schema: `supabase gen types typescript --linked > src/integrations/supabase/types.ts` y commitear.

### Workflows GitHub Actions activos

- `.github/workflows/supabase-sync.yml` — Despliegue automático a Supabase prod al mergear PR a `main`.
- `.github/workflows/auto-pr.yml` — Automatización de PRs.
- `.github/workflows/clickup-docs.yml` — Documentación automática en ClickUp.

---

## Ficheros que NO se editan a mano

- `src/integrations/supabase/types.ts` — auto-generado con `supabase gen types typescript`. Si lo tocas a mano se pisa al regenerar.
- `supabase/.temp/` — CLI de Supabase. Nunca commitear cambios manuales aquí.
- `src/components/ui/*` — componentes shadcn auto-generados. Si necesitas personalizar uno, créate un wrapper en `src/components/`.
- `dist/`, `node_modules/`, `.next/` — outputs de build.

---

## Carpetas y referencia rápida

```
src/
├── App.tsx                      # Router + providers
├── main.tsx                     # Entry point
├── pages/                       # Páginas (1 por ruta)
│   ├── SectorSelector.tsx       # Home: selección de sector
│   ├── Index.tsx                # Catálogo completo
│   ├── <Sector>Landing.tsx      # Landings por sector
│   ├── Auditoria<Sector>.tsx    # Auditorías por sector
│   ├── ProcessDetail.tsx        # Detalle de proceso
│   ├── AfiliadoPage.tsx         # Sistema afiliados
│   └── AdminPage.tsx
├── components/
│   ├── ui/                      # shadcn (no editar)
│   ├── ProcessCard.tsx, SelectionSummary.tsx, ...
│   └── Chatbot.tsx
├── data/
│   ├── processes.ts             # FUENTE DE VERDAD CONTENIDO
│   ├── <sector>Blocks.ts        # 6 bloques por sector
│   ├── <sector>Modules.ts       # Módulos por sector
│   └── auditoria<Sector>Data.ts
├── lib/
│   ├── SelectionContext.tsx     # Estado global selección
│   ├── auditoria<Sector>Pdf.ts  # Generadores PDF
│   └── utils.ts, pricing.ts, referral.ts
└── integrations/supabase/
    ├── client.ts                # Cliente Supabase
    └── types.ts                 # Auto-generado

supabase/
├── config.toml
├── migrations/<YYYYMMDDHHMMSS>_*.sql
└── functions/                   # Edge functions Deno

scripts/
├── sync_processes_to_supabase.v2.mjs   # Script SYNC (REGLA #1)
├── manual_sync_staging_to_prod.mjs
├── generate_embeddings.mjs
└── knowledge/                          # Base de conocimiento del chatbot

public/
├── <sector>/b1.png ... b6.png   # Imágenes de bloques
└── <sector>/hero.png            # Imagen hero
```

---

## Comandos útiles

```bash
# Desarrollo
npm run dev
npm run build
npm run lint

# Sync de procesos TS → Supabase (REGLA #1)
node scripts/sync_processes_to_supabase.v2.mjs --verbose                # dry-run staging
node scripts/sync_processes_to_supabase.v2.mjs --apply                  # aplica staging
node scripts/sync_processes_to_supabase.v2.mjs --target=prod --apply    # aplica prod
node scripts/sync_processes_to_supabase.v2.mjs --apply --delete-orphans # borra huérfanos

# Supabase CLI
supabase db push                                                # migraciones a linked project
supabase gen types typescript --linked > src/integrations/supabase/types.ts
supabase functions deploy <nombre>                              # deploy edge function

# Embeddings y knowledge base
node scripts/generate_embeddings.mjs
```

---

## Responsables y contacto

- **Manel** — `manel@immoral.es`
- **David** — programador
- Idioma de comunicación: **español**.
- Documentación viva en ClickUp: doc "Memorias — Knowledge Brian" (`knvz4-80475`), página immoralia (`knvz4-233395`).
- Regla TS↔Supabase ampliada: `knvz4-233635`.
