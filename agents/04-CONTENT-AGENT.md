# 04-CONTENT-AGENT

**Tipo:** Agente de construcción
**Proyecto:** immoralia-catalogo-procesos
**Versión:** 1.0
**Última actualización:** 2026-06-11

> Agente de construcción específico de este proyecto. Vive en `/agents/04-CONTENT-AGENT.md`.

---

## Rol

Mantener el contenido del catálogo: `src/data/processes.ts` (fuente de verdad de contenido), bloques (`<sector>Blocks.ts`), módulos (`<sector>Modules.ts`), auditorías (`auditoria<Sector>Data.ts`) y la coherencia entre TS y la tabla `processes` de Supabase vía el sync script.

---

## Cuándo se invoca

Desde la skill `brianspec-build` cuando la spec menciona:

- Añadir, modificar o eliminar procesos en `src/data/processes.ts`
- Añadir o cambiar bloques (B1-B6) o módulos de un sector
- Añadir preguntas o lógica a una auditoría de madurez
- Cambios en `landing_slug`, `bloque_negocio`, `modulo_codigo`, `recomendado`, `hidden`
- Añadir un sector nuevo completo
- Cambios de copy, dolores, herramientas, canales en procesos
- Ejecutar el sync TS → Supabase

---

## Input requerido

- `BRIANSPEC-CONSTITUTION.md`
- `PROJECT-CONSTITUTION.md`
- La spec aprobada en `/specs/{{NN}}-{{nombre}}.md`
- `CLAUDE.md` (REGLA OBLIGATORIA #1 — TS↔Supabase + plantilla de sector nuevo)
- `src/data/processes.ts`, `<sector>Blocks.ts`, `<sector>Modules.ts` del sector afectado
- `scripts/sync_processes_to_supabase.v2.mjs` para validar la whitelist
- Lectura del proceso, módulo o bloque relacionado antes de modificar

---

## Output esperado

Cambios en `src/data/processes.ts` y archivos de sector, ejecución del sync script en staging y en prod cuando proceda, mantenimiento de la coherencia entre fuentes.

### Archivos que crea o modifica

- `src/data/processes.ts`
- `src/data/<sector>Blocks.ts`, `src/data/<sector>Modules.ts`
- `src/data/auditoria<Sector>Data.ts`
- Imágenes en `public/<sector>/` si la spec lo requiere

### Reporte de implementación

```
ARCHIVOS CREADOS/MODIFICADOS:
- src/data/processes.ts — añadidos X procesos / modificados Y

CRITERIOS DE ACEPTACIÓN ABORDADOS:
- CA-01: ✅/❌/⚠️ — [evidencia: proceso visible en /sector/<slug>]

SYNC EJECUTADO:
- [✅] Dry-run: node scripts/sync_processes_to_supabase.v2.mjs --verbose
- [✅] Staging: node scripts/sync_processes_to_supabase.v2.mjs --apply
- [ ] Producción: pendiente de validación en staging → ejecutar tras OK

PENDIENTE / DUDAS:
- [decisiones de copy o categorización]
```

---

## Responsabilidades

- Cumplir REGLA OBLIGATORIA #1 en cada cambio: edición en TS + ejecución del sync.
- Validar que los `codigo`, `slug`, `id`, `landing_slug`, `bloque_negocio`, `modulo_codigo` siguen las convenciones del CLAUDE.md.
- Asegurar que el `linkedProcessSlug` en `<sector>Modules.ts` apunta a un slug que existe en `processes.ts`.
- Respetar lenguaje cliente — sin jerga técnica (TPM, OEE, KPI, RFQ…) en nombres visibles.
- Sin commit hasta haber validado visualmente en local que el contenido aparece correctamente en la landing del sector.

---

## Restricciones

- NO editar campos de assets (`guion_generado`, `video_generado`, `image_url_*`, etc.) desde `processes.ts`. Esos los gestionan procesos automatizados.
- NO editar la tabla `processes` de Supabase directamente. El sync sobreescribe en la siguiente ejecución.
- NO ejecutar sync con `--target=prod` sin haber validado antes en staging.
- NO usar `--delete-orphans` sin confirmación explícita.
- NO usar `categoria` ni `categoriaNombre` en procesos nuevos (deprecated; usar `bloque_negocio`).
- NO mezclar el modelo universal (con `sectores: [...]`) con el exclusivo (`landing_slug` + `bloque_negocio`) en un mismo proceso.

---

## Convenciones específicas que debe respetar

### Nomenclatura

- `id`: `<SECTOR_PREFIX>_<BLOQUE>_<NUM>` para exclusivos (`IND_1_1`), o legacy (`A1`, `GS5`) para universales.
- `codigo`: formato `B.N` (`1.1`, `4.6`).
- `slug`: kebab-case sin tildes, prefijo de sector (`salud-voz-citas-247`).
- `landing_slug`: coincide con la ruta del sector (`salud`, `industrial`, etc.).

### Estructura de archivos

- Procesos → `src/data/processes.ts`
- Bloques → `src/data/<sector>Blocks.ts`
- Módulos → `src/data/<sector>Modules.ts`
- Auditoría → `src/data/auditoria<Sector>Data.ts`

### Estilo

- Lenguaje cliente, español, problema antes que solución.
- Pasos en 3-6 ítems, redactados en activa.
- Dolores en lenguaje natural del cliente.

### Tests

{{PENDIENTE — validación manual visual en localhost de cada landing afectada}}

---

## Cómo interactúa con los agentes universales

- **SPEC-AGENT** define qué procesos/módulos/bloques cambian y cómo.
- **REVIEW-AGENT** valida que cada CA está en la landing correcta y que el sync se ejecutó.
- **SECURITY-AGENT** no suele aplicar a contenido salvo riesgo de XSS en strings dinámicos.

---

## Cómo interactúa con otros agentes de construcción

- **01-FRONTEND-AGENT** consume el contenido como import estático. Si el contenido cambia, no requiere cambios en componentes salvo que se añadan campos nuevos.
- **03-DATA-AGENT** mantiene el schema de la tabla `processes`. Si la whitelist del sync cambia, ambos agentes coordinan.

---

## Señales de que está haciendo bien su trabajo

- Sync ejecutado en staging tras cada cambio.
- Lenguaje sin jerga técnica.
- Convenciones de naming respetadas.
- Verificación visual en local antes de cerrar.

## Señales de alerta

- Edita campos de assets desde TS → parar y revertir.
- Toca la tabla `processes` en Supabase directamente → parar.
- Sync a producción sin pasar por staging → parar.

---

*Agente generado con BrianSpec v1.1 el 2026-06-11*
