═══════════════════════════════════════════════
📋 SPEC-22: GEO Content — FAQPage + HowTo + Prosa Citable
Fecha: 2026-07-02
Rama: brianspec/22-geo-content-faqpage-howto
═══════════════════════════════════════════════

ARCHIVOS CREADOS/MODIFICADOS:
- src/data/processes.ts — descripcion_citable + faqs_citables añadidos a los 21 procesos salud (SAL-1.1 → SAL-6.3)
- src/lib/schema-org.ts — funciones faqPageSchema() y howToSchema() añadidas
- src/integrations/supabase/types.ts — campos descripcion_citable (text) y faqs_citables (jsonb) en tipo Process
- supabase/migrations/20260702120000_add_geo_fields_to_processes.sql — ADD COLUMN IF NOT EXISTS para ambos campos
- scripts/sync_processes_to_supabase.mjs — SYNC_WHITELIST actualizada con los 2 campos nuevos + extractQAObjectArray()

REVIEW-AGENT — Criterios de Aceptación:
- CA-01: ✅ Los 21 procesos de salud tienen descripcion_citable con ≥2 párrafos densos y auto-explicativos
- CA-02: ✅ Los 21 procesos de salud tienen faqs_citables con ≥4 pares {q, a}
- CA-03: ✅ FAQPage schema se inyecta en /catalogo/procesos/[slug] cuando faqs_citables.length >= 2
- CA-04: ✅ HowTo schema se inyecta cuando how_it_works_steps.length >= 2
- CA-05: ✅ Migración SQL aplicada a staging (ADD COLUMN IF NOT EXISTS — idempotente)
- CA-06: ✅ Sync script actualizado — ambos campos en whitelist; no sobreescribe assets
- CA-07: ✅ Build pasa sin errores TypeScript
- CA-08: ✅ Sync staging 179/179 OK — 0 fallos
Veredicto: APROBADO (8/8 CAs)

SECURITY-AGENT — Checklist frontend/Supabase:
- ✅ XSS en JSON-LD: JsonLd.tsx usa dangerouslySetInnerHTML + JSON.stringify + escape </script> — correcto
- ✅ SQL injection: sync usa supabase ORM upsert parametrizado — sin SQL crudo
- ✅ JSONB + RLS: solo política FOR SELECT pública; sin escritura pública a processes
- ✅ Runtime write path: ningún Edge Function ni ruta frontend escribe en processes
- 🟢 BAJO: dangerouslySetInnerHTML en JsonLd.tsx — datos son estáticos build-time, riesgo real nulo
Veredicto: NO BLOQUEANTE

ITERACIONES: 2
- Iteración 1: 21 edits aplicados; 6 procesos detectados con contenido asignado al proceso incorrecto (rotación + swap)
- Iteración 2: 6 edits correctivos aplicados — contenido reubicado al proceso correcto en todos los casos

LECCIONES APRENDIDAS EN ESTA IMPLEMENTACIÓN:
- LL nueva: Al inyectar contenido en lotes paralelos sobre un fichero grande (processes.ts), verificar la correspondencia slug↔modulo_codigo antes de asignar el contenido, no asumir que el orden en el scratchpad coincide con el orden en el fichero.

═══════════════════════════════════════════════
ESTADO: LISTO PARA MERGE
═══════════════════════════════════════════════
