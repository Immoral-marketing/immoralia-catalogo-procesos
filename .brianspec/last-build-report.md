═══════════════════════════════════════════════
📋 SPEC-23: Análisis SEO continuo asistido por Claude sobre GSC
Fecha: 2026-07-03
Rama: brianspec/23-analisis-gsc-continuo-claude
═══════════════════════════════════════════════

ARCHIVOS CREADOS/MODIFICADOS:
- C:\Users\david\.claude\skills\immoralia\immoral-seo-analisis-gsc\SKILL.md — Skill genérica: análisis SEO semanal con GSC MCP, modo pulso rápido, publicación en ClickUp, cruce con processes.ts, detección de alertas.
- .brianspec/seo-analisis-config.yaml — Config del Catálogo de Procesos: site, sectors_mapping, clickup parent page knvz4-239675, umbrales de alerta.

REVIEW-AGENT — Criterios de Aceptación:
- CA-01: ✅ SKILL.md registrado en ~/.claude/skills/immoralia/immoral-seo-analisis-gsc/SKILL.md con name + palabras de activación
- CA-02: ✅ Paso 2 llama gsc_top_queries, gsc_pages_with_low_ctr, gsc_indexed_count, gsc_list_sitemaps (MCP SPEC-24)
- CA-03: ✅ Informe con 6 secciones obligatorias: resumen ejecutivo, indexación, ganancias, pérdidas/alertas, oportunidades, acciones
- CA-04: ✅ Template con tablas de datos concretos + instrucción "no inventes ni interpoldes números"
- CA-05: ✅ Paso 2f detiene la skill si pages_with_impressions_last_90d < 5 o queries 7d = 0, con mensaje explicativo
- CA-06: ✅ Comparativa 7d vs 28d en Paso 4: queries emergentes y en declive por posición
- CA-07: ✅ gsc_pages_with_low_ctr(days=28, min_impressions=50) → sección Oportunidades
- CA-08: ✅ Paso 6: clickup_create_document_page con parent_page_id knvz4-239675, título "Informe SEO — YYYY-MM-DD"
- CA-09: ✅ Paso 0 detecta modo pulso rápido → solo 2a+2b, 3 líneas, sin ClickUp
- CA-10: ✅ Paso 4 con condiciones [ALERTA]: posición>10 vs histórico, >100 impresiones y 0 clics, CTR < umbral
- CA-11: ✅ Sección "Sugerencias para otras skills" con candidatos SPEC-22 (rollout GEO) y SPEC-19 (keywords H1)
- CA-12: ✅ Todo el output en español — instrucción explícita en reglas generales
Veredicto: APROBADO (12/12 CAs)

SECURITY-AGENT — Checklist skill-ia:
- ✅ Sin prompt injection: archivos locales tratados como datos, no instrucciones
- ✅ Sin acciones destructivas: solo Read + llamadas GSC (solo lectura) + clickup_create (reversible)
- ✅ Sin secretos en SKILL.md: credenciales Service Account viven en VPS .env
- ✅ Datos sensibles GSC solo fluyen a sesión local → ClickUp (destino autorizado)
- ✅ Fallback explícito si ClickUp falla: entrega informe en conversación
- 🟢 BAJO: coste de inferencia fijo (5 llamadas MCP + 2 reads + 1 ClickUp), sin loops posibles
- ✅ Outputs marcados como sugerencias para revisión humana de David
Veredicto: NO BLOQUEANTE

ITERACIONES: 1

LECCIONES CONFIRMADAS:
- LL-006 confirmada en SPEC-23: filtro de queries ruido aplicado en Paso 3
- LL-005 confirmada en SPEC-23: cruce de caídas de posición con calidad del campo `dolores`

═══════════════════════════════════════════════
ESTADO: LISTO PARA MERGE
═══════════════════════════════════════════════
