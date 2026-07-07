-- SPEC-03 hardening — un lead por conversación garantizado a nivel de BBDD.
--
-- El check de idempotencia de /api/chatbot/lead era read-then-write: dos
-- submits concurrentes (doble click, retry de red) pasaban ambos el check y
-- creaban dos leads + dos tareas ClickUp + dos avisos Slack. El índice único
-- convierte el segundo insert en un conflicto (23505) que la API traduce a
-- { success: true, alreadyCaptured: true }.
--
-- De paso, contact_submissions gana el vínculo directo lead → conversación
-- (hasta ahora solo existía el inverso chatbot_conversations.lead_id).

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS conversation_id uuid
  REFERENCES public.chatbot_conversations(id) ON DELETE SET NULL;

-- Backfill desde el vínculo inverso existente
UPDATE public.contact_submissions cs
SET conversation_id = c.id
FROM public.chatbot_conversations c
WHERE c.lead_id = cs.id AND cs.conversation_id IS NULL;

-- Único parcial: los leads de otros formularios (contact, onboarding) no llevan
-- conversación y siguen siendo ilimitados.
CREATE UNIQUE INDEX IF NOT EXISTS contact_submissions_conversation_id_key
  ON public.contact_submissions (conversation_id)
  WHERE conversation_id IS NOT NULL;
