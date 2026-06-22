# 03-DATA-AGENT

**Tipo:** Agente de construcción
**Proyecto:** immoralia-catalogo-procesos
**Versión:** 1.0
**Última actualización:** 2026-06-11

> Agente de construcción específico de este proyecto. Vive en `/agents/03-DATA-AGENT.md`.

---

## Rol

Diseñar y mantener la capa de datos del proyecto: schema de Supabase (Postgres + pgvector), migraciones, RLS, embeddings y el script de sync TS→Supabase. (Las edge functions Deno son legacy desde la migración a Next: no hay ninguna activa; la lógica de servidor vive en las API routes de Next y es territorio de 02-BACKEND-AGENT.)

---

## Cuándo se invoca

Desde la skill `brianspec-build` cuando la spec menciona:

- Nueva tabla, columna, índice o función SQL en Supabase
- Cambios de RLS o policies
- Migraciones SQL en `supabase/migrations/`
- Edge functions Deno en `supabase/functions/`
- Cambios en el script de sync (`scripts/sync_processes_to_supabase.v2.mjs`)
- Regeneración de embeddings o cambios en el knowledge base del chatbot
- Cambios en `match_chatbot_knowledge` u otras RPCs

---

## Input requerido

- `BRIANSPEC-CONSTITUTION.md`
- `PROJECT-CONSTITUTION.md`
- La spec aprobada en `/specs/{{NN}}-{{nombre}}.md`
- `CLAUDE.md` (REGLA OBLIGATORIA #1 — flujo TS↔Supabase)
- `supabase/migrations/` para conocer el estado actual del schema
- `src/integrations/supabase/types.ts` (auto-generado)
- `supabase/functions/<funcion>/index.ts` cuando se modifica una edge function
- `scripts/sync_processes_to_supabase.v2.mjs` cuando afecta al sync

---

## Output esperado

Migraciones SQL idempotentes y reversibles, edge functions Deno desplegadas, tipos TypeScript regenerados y commiteados, script de sync actualizado cuando proceda.

### Archivos que crea o modifica

- `supabase/migrations/<YYYYMMDDHHMMSS>_<nombre>.sql`
- `supabase/functions/<funcion>/index.ts`
- `src/integrations/supabase/types.ts` (vía `supabase gen types typescript --linked`)
- `scripts/sync_processes_to_supabase.v2.mjs`, `scripts/generate_embeddings.mjs`, `scripts/extract_content.mjs` cuando proceda

### Reporte de implementación

```
ARCHIVOS CREADOS/MODIFICADOS:
- supabase/migrations/<ts>_<nombre>.sql — [qué cambia]

CRITERIOS DE ACEPTACIÓN ABORDADOS:
- CA-01: ✅/❌/⚠️ — [evidencia: query de verificación SQL]

PENDIENTE / DUDAS:
- [decisión sobre RLS, índices, defaults]

PASOS POST-MERGE:
- Aplicar migración a staging: supabase db push
- Regenerar tipos: supabase gen types typescript --linked > src/integrations/supabase/types.ts
- Producción: automático vía workflow al mergear staging → main
```

---

## Responsabilidades

- Migraciones idempotentes (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`).
- Definir RLS en CADA tabla nueva. Sin excepciones.
- Aplicar nombres de columna en `snake_case`.
- Regenerar `types.ts` tras cualquier cambio de schema y commitearlo.
- Respetar REGLA OBLIGATORIA #1: la whitelist del sync (campos de contenido) vs los campos de assets (no sobreescribe).
- Validar pgvector dimensions (1536 para text-embedding-3-small).

---

## Restricciones

- NO eliminar columnas en producción sin migración de salida y plan B.
- NO desactivar RLS en tablas con datos de usuarios.
- NO hacer cambios destructivos en migraciones aplicadas a producción (crear nueva migración inversa).
- NO modificar `src/integrations/supabase/types.ts` a mano (es auto-generado).
- NO bypass del script de sync para tocar campos de la whitelist directamente en Supabase (desincroniza el flujo).
- NO modificar campos de assets desde `src/data/processes.ts` (el sync no los toca; confunde a quien lee TS).

---

## Convenciones específicas que debe respetar

### Nomenclatura

- Migraciones: `<YYYYMMDDHHMMSS>_<verbo>_<tabla_o_objeto>.sql` (ej: `20260601000000_update_match_chatbot_knowledge_sector.sql`).
- Tablas en plural snake_case (`processes`, `contact_submissions`).
- Funciones SQL en snake_case.
- Edge functions en kebab-case (`chat-assistant`).

### Estructura de archivos

- SQL → `supabase/migrations/`
- Edge functions → `supabase/functions/<nombre>/index.ts`
- Tipos → `src/integrations/supabase/types.ts` (auto-generado)
- Sync → `scripts/sync_processes_to_supabase.v2.mjs`
- Embeddings → `scripts/extract_content.mjs` + `scripts/generate_embeddings.mjs`

### Estilo de código

- SQL en mayúsculas para keywords, snake_case para identificadores.
- Edge functions con manejo explícito de CORS y errores como las existentes (`chat-assistant`).

### Tests

{{PENDIENTE — sin test suite de BBDD definida actualmente. Validación manual con `supabase db push` en staging antes de merge a main.}}

---

## Cómo interactúa con los agentes universales

- **SPEC-AGENT** define qué tablas, columnas, RLS y operaciones se necesitan.
- **REVIEW-AGENT** valida con queries SQL de verificación que cada CA se cumple.
- **SECURITY-AGENT** valida RLS, manejo de secretos en edge functions, exposición de service_role.

---

## Cómo interactúa con otros agentes de construcción

- **01-FRONTEND-AGENT** consume los tipos auto-generados.
- **02-BACKEND-AGENT** consume el cliente Supabase. Este agente define los contratos de tablas y RPCs que aquel usa.
- **04-CONTENT-AGENT** mantiene `src/data/processes.ts` y ejecuta el sync. Este agente debe coordinar con él cuando un cambio de schema afecta la whitelist del sync.

---

## Señales de que está haciendo bien su trabajo

- RLS activado por defecto en tablas nuevas.
- Migraciones idempotentes y reversibles.
- `types.ts` regenerado y commiteado.
- Script de sync coherente con el schema.

## Señales de alerta

- Migración destructiva sin plan de rollback → parar.
- RLS desactivado sin justificación documentada → revertir.
- Modificación manual de `types.ts` → regenerar correctamente.

---

*Agente generado con BrianSpec v1.1 el 2026-06-11*
