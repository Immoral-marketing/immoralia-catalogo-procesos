-- Migration to add slack_notifications_log table for idempotency
-- Created at: 2026-03-04

CREATE TABLE IF NOT EXISTS public.slack_notifications_log (
    clickup_task_id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    success BOOLEAN DEFAULT true,
    error_message TEXT
);

-- Habilitar RLS
ALTER TABLE public.slack_notifications_log ENABLE ROW LEVEL SECURITY;

-- Permitir que la función de servicio gestione los logs
CREATE POLICY "Service role can do everything on slack_notifications_log" ON "public"."slack_notifications_log"
AS PERMISSIVE FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
