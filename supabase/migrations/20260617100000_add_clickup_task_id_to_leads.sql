-- SPEC-10: Persistir el id de la tarea de ClickUp al capturar el lead.
-- Necesario para reconstruir la URL de ClickUp cuando llega el evento de
-- "llamada agendada" y se envía el aviso a Slack al equipo.
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS clickup_task_id text DEFAULT NULL;
