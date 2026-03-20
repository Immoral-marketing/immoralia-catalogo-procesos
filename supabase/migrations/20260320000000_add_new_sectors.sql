-- Migration to add new sectors to the catalog
-- This migration documents the addition of "Gestorías" and "Centros Deportivos"
-- The 'sectores' column in the 'processes' table is TEXT[], so no structural change is required.
-- Initial set of sectors supported in the frontend onboarding:
-- "Peluquería/estética", "Gimnasio/yoga", "Clínica", "Restauración", "Retail",
-- "Inmobiliaria", "E-commerce", "Servicios profesionales", "Agencia/marketing", 
-- "Gestorías", "Centros Deportivos"

COMMENT ON COLUMN public.processes.sectores IS 'Array of sectors the process applies to. New sectors added: Gestorías, Centros Deportivos';
