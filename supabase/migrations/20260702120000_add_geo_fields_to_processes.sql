-- SPEC-22: GEO Content — FAQPage + HowTo schemas + prosa citable
-- Añade columnas para el contenido citable por IAs (schema.org FAQPage, HowTo)
-- Estos campos viven en la whitelist del sync script (fuente de verdad: processes.ts)

ALTER TABLE processes
  ADD COLUMN IF NOT EXISTS descripcion_citable text,
  ADD COLUMN IF NOT EXISTS faqs_citables jsonb;

COMMENT ON COLUMN processes.descripcion_citable IS 'Prosa densa 2-3 párrafos, autocontenida y citable por IAs. Fuente: processes.ts (SPEC-22).';
COMMENT ON COLUMN processes.faqs_citables IS 'Array de 3-5 pares {q, a} para schema FAQPage. Fuente: processes.ts (SPEC-22).';
