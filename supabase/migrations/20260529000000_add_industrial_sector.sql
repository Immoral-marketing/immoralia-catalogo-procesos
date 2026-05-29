-- Sector Industrial / Producción
-- 24 procesos añadidos en src/data/processes.ts (IND-1.1 a IND-6.4)
-- landing_slug: "industrial"
-- El sync de contenido se gestiona vía scripts/sync_processes_to_supabase.v2.mjs
-- Esta migración es un marcador de versión; no requiere DDL adicional.

-- Aseguramos que los nuevos procesos del sector industrial se marcan como activos
-- cuando el sync script los inserte (catalog_active default = true).
-- No se necesita ningún cambio de schema para este sector.

SELECT 1; -- no-op placeholder
