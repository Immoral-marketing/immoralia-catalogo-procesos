-- SPEC-07: Proceso de interés al lead form
-- Añade los slugs de procesos recomendados durante la conversación al registro del lead.
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS interested_process_slugs text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS primary_interested_slug   text    DEFAULT NULL;
