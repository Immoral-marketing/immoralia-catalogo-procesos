# SPEC-06: Reparación del sync script TS↔Supabase

**Versión:** 1.1
**Estado:** aprobada
**Tipo de proyecto:** web-app
**Última actualización:** 2026-06-12
**Owner:** David Navarrete

---

## Descripción

Reparar el script `scripts/sync_processes_to_supabase.mjs` para que cumpla la
**REGLA OBLIGATORIA #1** del proyecto: editar contenido en `src/data/processes.ts`
y sincronizar a la tabla `processes` de Supabase respetando la frontera (whitelist
de campos de contenido, sin tocar campos de assets generados). Hoy el script falla
silenciosamente por una columna deprecada (`categoria`) que sigue intentando enviar
aunque ya no existe en el schema. Bloqueante para escalar la SPEC-04 a los demás
sectores y para que el equipo edite procesos con confianza.

---

## Actores

- **David / Manel / cualquier developer:** ejecuta el script tras editar `processes.ts`.
- **Sistema de IA (procesos automatizados):** rellena campos de assets (guion, vídeo,
  imágenes) directamente en la BBDD — esos campos NO los toca este script.
- **Tabla `processes` (Supabase):** destino del sync.

---

## Flujos principales

### Flujo 1: Sync por defecto (staging)

1. El developer edita procesos en `src/data/processes.ts` (contenido).
2. Ejecuta `node scripts/sync_processes_to_supabase.mjs --verbose` (dry-run).
3. El script lee la fuente, parsea los procesos, calcula los cambios que aplicaría
   a la BBDD y los muestra sin ejecutar nada.
4. Si convence, ejecuta `node scripts/sync_processes_to_supabase.mjs --apply` para
   aplicarlos a staging.

### Flujo 2: Sync a producción

1. Tras validar en staging, ejecuta `node scripts/sync_processes_to_supabase.mjs --target=prod --apply`.
2. Pide confirmación interactiva explícita por el alcance (toca producción).

### Flujo 3: Limpieza de huérfanos

1. `node scripts/sync_processes_to_supabase.mjs --apply --delete-orphans` elimina
   filas que existen en BBDD pero ya no en `processes.ts`.
2. Pide confirmación por la naturaleza destructiva.

---

## Flujos alternativos / Edge cases

- **Proceso nuevo en TS, ausente en BBDD:** se inserta (UPSERT).
- **Proceso editado en TS, existe en BBDD:** se actualiza SOLO las columnas de la
  whitelist; los campos de assets se conservan intactos.
- **Proceso en BBDD ausente en TS:** se mantiene en BBDD (no se borra) salvo flag
  `--delete-orphans`.
- **Campo legacy (`categoria`, `categoriaNombre`) presente en TS:** se ignora — no
  se envía a BBDD porque las columnas ya no existen.
- **Variables de entorno faltantes:** error claro indicando cuáles faltan según el
  target (staging o prod).
- **Conflicto entre `hidden: true` en TS y `catalog_active: true` en BBDD:** la TS
  manda — se envía `catalog_active: false`.
- **Fallo de red mid-sync:** el script reporta qué procesos sí pasaron y cuáles no;
  re-ejecutar es seguro (UPSERT idempotente).

---

## Criterios de aceptación

- [ ] CA-01: El script termina con código de salida 0 y reporta "X procesos sincronizados, 0 fallos" tras un sync completo a staging con el `processes.ts` actual.
- [ ] CA-02: La whitelist de columnas a enviar está declarada explícitamente en el script (constante o array): `id, codigo, slug, nombre, tagline, descripcion_detallada, pasos, personalizacion, sectores, herramientas, dolores, canales, integration_domains, landing_slug, bloque_negocio, modulo_codigo, recomendado, catalog_active` (más los campos opcionales que ya tipa la interfaz Process).
- [ ] CA-03: Las columnas eliminadas del schema (`categoria`, `categoriaNombre`) NO aparecen en la whitelist y NO se envían en ningún UPSERT.
- [ ] CA-04: Verificable: tras un sync `--apply`, los campos de assets (`guion_generado`, `video_remotion_url`, `image_url_1/2/3`, `imagenes_generadas`, etc.) de un proceso con assets ya generados quedan IGUAL que antes del sync (consultable por SQL antes/después).
- [ ] CA-05: El campo `hidden: true` en TS se mapea a `catalog_active: false` en BBDD (verificable: marcar un proceso como `hidden: true`, ejecutar sync, comprobar `catalog_active` en BBDD).
- [ ] CA-06: Sin `--apply` el script es dry-run estricto: NO modifica BBDD. Muestra inserts/updates que aplicaría con un resumen al final.
- [ ] CA-07: Variables de entorno modernas: `STAGING_SUPABASE_URL` + `STAGING_SUPABASE_SERVICE_ROLE_KEY` para staging, `PROD_SUPABASE_URL` + `PROD_SUPABASE_SERVICE_ROLE_KEY` para prod. Mantiene fallback a `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` para staging cuando las variables específicas no están.
- [ ] CA-08: Con `--target=prod --apply` pide confirmación interactiva explícita antes de ejecutar (escribir "si"). En modo no-TTY (CI), `--apply` actúa como autorización por sí mismo, igual que en el script de embeddings.
- [ ] CA-09: Variables faltantes: error claro con el listado exacto de qué falta y para qué target. Código de salida ≠ 0.
- [ ] CA-10: Con `--delete-orphans --apply` borra de la BBDD los procesos que ya no están en TS, pero requiere confirmación interactiva igual que prod.
- [ ] CA-11: Smoke test post-sync: tras editar un proceso del piloto SPEC-04 (ej. añadir un dolor a `salud-comunicacion-turnos`), ejecutar `--apply` a staging, verificar via SQL que el cambio llegó y que los campos de assets se mantienen intactos.

---

## Modelo de datos

Sin cambios al schema. Esta spec solo afecta a `scripts/sync_processes_to_supabase.mjs`.

---

## UI / Páginas afectadas

Ninguna — script de línea de comandos.

---

## API / Endpoints

No aplica.

---

## Notas de seguridad

### Datos sensibles involucrados

- `SUPABASE_SERVICE_ROLE_KEY` (staging y prod) — clave de servicio que bypasa RLS.

### Validaciones server-side requeridas

- Validar que las variables de entorno apuntan al target correcto (no permitir
  mezclar URL de prod con clave de staging por accidente).

### Autenticación y autorización

- El script solo se ejecuta desde el entorno del developer; las claves nunca se
  exponen al cliente.

### Otros riesgos identificados

- **Sync a prod accidental:** mitigado con confirmación interactiva obligatoria.
- **Pérdida de assets:** mitigado con whitelist estricta (los campos de assets
  no están en la lista de columnas a enviar).
- **Borrado de huérfanos accidental:** mitigado con flag explícito + confirmación.

---

## Plan de implementación

### Arquitectura propuesta

- **03-DATA-AGENT:** reescribir el script con whitelist, dry-run, flags `--apply`,
  `--target=prod`, `--delete-orphans`, manejo de variables de entorno moderno,
  confirmación interactiva para operaciones sensibles, mapeo `hidden` → `catalog_active`.
- Smoke test manual: editar un proceso del piloto + ejecutar sync + verificar via MCP.

### Desglose de tareas

1. Definir la constante WHITELIST de columnas a sincronizar (las 18 del CA-02).
2. Reescribir el parser de `processes.ts` (o reutilizar el existente si funciona)
   para extraer cada objeto con todos sus campos.
3. Implementar el mapeo TS→BBDD respetando la whitelist (filtrar campos fuera).
4. Implementar `hidden: true` → `catalog_active: false`.
5. Implementar dry-run vs `--apply` (igual que el patrón de generate_embeddings.mjs).
6. Implementar confirmación interactiva para `--target=prod` y `--delete-orphans`.
7. Variables de entorno modernas con fallbacks.
8. Reportar al final: N insertados, N actualizados, N borrados (si --delete-orphans), N fallos.
9. Smoke test manual: editar un proceso del piloto, ejecutar sync, verificar via SQL.

### Dependencias con otras specs

Bloquea: escalado de SPEC-04 a los 5 sectores restantes.

---

## Tests requeridos

### Tests unitarios

- No aplica (script puntual, sin lógica compleja extraíble).

### Tests de integración

- Smoke test manual del CA-11.

### Tests E2E

- No aplica.

---

## Out of scope (explícito)

- No se reescribe la fuente de verdad (TS sigue siendo `processes.ts`).
- No se cambia el schema de la tabla `processes`.
- No se borra el campo `categoria` del TS (sigue ahí como @deprecated por compatibilidad
  con procesos universales antiguos, según CLAUDE.md). Solo se deja de enviar.
- No se añaden campos nuevos al sync (la whitelist son los actuales del schema).

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-06-12 | Versión inicial — reparación del sync script (LL-004 de SPEC-04) | David Navarrete |
| 1.1 | 2026-06-12 | Spec aprobada para implementación | David Navarrete |
| 1.2 | 2026-06-12 | Implementada y verificada en staging — 179 procesos sync OK, assets intactos, hidden→catalog_active funciona, dry-run + flags + confirmaciones operativos | David Navarrete |
