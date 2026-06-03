# Catálogo de Procesos — Immoralia

Aplicación web para visualizar, filtrar y seleccionar procesos de automatización con IA, organizados por sector de negocio. Permite a clientes explorar el catálogo, hacer una auditoría de madurez digital y solicitar una propuesta personalizada.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Vite + React 18 + TypeScript |
| UI | Tailwind CSS + shadcn/ui (Radix) + lucide-react |
| Routing / Estado | react-router-dom v6 + @tanstack/react-query + Context API |
| Backend / BD | Supabase (Postgres + pgvector + Edge Functions Deno) |
| Despliegue | Vercel — rama `staging` → entorno staging, rama `main` → producción |

## Arranque local

```bash
npm install
npm run dev           # servidor Vite en localhost
npm run build         # build producción
npm run build:dev     # build modo development
npm run lint          # eslint
```

Variables de entorno necesarias (crear `.env.local`):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

## Estructura del proyecto

```
src/
├── App.tsx                          # Router + providers
├── main.tsx                         # Entry point
├── pages/
│   ├── SectorSelector.tsx           # Home: selección de sector
│   ├── Index.tsx                    # Catálogo completo
│   ├── <Sector>Landing.tsx          # Landing pública por sector
│   ├── Auditoria<Sector>.tsx        # Auditoría de madurez por sector
│   ├── ProcessDetail.tsx            # Detalle de proceso
│   ├── AfiliadoPage.tsx             # Sistema de afiliados
│   └── AdminPage.tsx
├── components/
│   ├── ui/                          # shadcn (no editar directamente)
│   ├── ProcessCard.tsx
│   ├── SelectionSummary.tsx
│   ├── ContactForm.tsx
│   ├── OnboardingModal.tsx
│   ├── Chatbot.tsx
│   └── ...
├── data/
│   ├── processes.ts                 # FUENTE DE VERDAD de contenido
│   ├── <sector>Blocks.ts            # 6 bloques de negocio por sector
│   ├── <sector>Modules.ts           # Módulos por sector
│   └── auditoria<Sector>Data.ts
├── lib/
│   ├── SelectionContext.tsx          # Estado global de selección
│   ├── auditoria<Sector>Pdf.ts       # Generadores PDF
│   └── utils.ts, pricing.ts, referral.ts
└── integrations/supabase/
    ├── client.ts
    └── types.ts                     # Auto-generado — no editar

supabase/
├── config.toml
├── migrations/                      # Migraciones SQL
└── functions/                       # Edge Functions Deno

scripts/
├── sync_processes_to_supabase.v2.mjs  # Sync TS → Supabase (ver Regla #1)
├── manual_sync_staging_to_prod.mjs
├── generate_embeddings.mjs
└── knowledge/                         # Base de conocimiento del chatbot

public/
└── <sector>/b1-b6.png, hero.png       # Assets visuales por sector
```

## Sectores activos

| Sector | Ruta |
|---|---|
| Centros Deportivos | `/sector/centros-deportivos` |
| Gestorías | `/sector/gestorias` |
| Centros de Salud | `/sector/salud` |
| Construcción & Inmobiliaria | `/sector/construccion` |
| Academias / Formación | `/sector/academias` |
| Gastronomía y Hotelería | `/sector/gastronomia-hosteleria` |
| Industrial | `/sector/industrial` |

## ⚠️ Regla obligatoria — Flujo TS ↔ Supabase

`src/data/processes.ts` es la **fuente de verdad del contenido**. Supabase almacena los **assets generados** (guiones, vídeos, imágenes). Las landings consumen `processes.ts` en build time — no consultan Supabase.

**Siempre que añadas o modifiques un proceso:**

1. Editar `src/data/processes.ts`
2. Ejecutar el sync:

```bash
# Dry-run — muestra qué cambiará sin aplicar
node scripts/sync_processes_to_supabase.v2.mjs --verbose

# Aplicar a staging
node scripts/sync_processes_to_supabase.v2.mjs --apply

# Aplicar a producción (solo tras validar en staging)
node scripts/sync_processes_to_supabase.v2.mjs --target=prod --apply

# Borrar procesos huérfanos en BD
node scripts/sync_processes_to_supabase.v2.mjs --apply --delete-orphans
```

**Nunca:** editar directamente la tabla en Supabase Studio, ni cambiar solo TS sin ejecutar el sync.

## Branch strategy

| Rama | Propósito |
|---|---|
| `main` | Producción. Solo merges desde `staging` vía PR |
| `staging` | Preproducción. Acumula features antes de producción |
| `feat/<nombre>` / `fix/<nombre>` | Trabajo diario. Salen de `origin/staging` |
| `claude/<nombre>` | Worktrees automáticos de Claude Code |

**Flujo:** `feat/*` → PR a `staging` → validar → PR `staging → main` → deploy automático a producción.

Al mergear a `main`, el workflow `supabase-sync.yml` ejecuta automáticamente `supabase db push` y `supabase functions deploy`.

## Comandos útiles

```bash
# Supabase CLI
supabase db push
supabase gen types typescript --linked > src/integrations/supabase/types.ts
supabase functions deploy <nombre>

# Embeddings del chatbot
node scripts/generate_embeddings.mjs
```

## Responsables

- **Manel** — manel@immoral.es
- **David** — programador
