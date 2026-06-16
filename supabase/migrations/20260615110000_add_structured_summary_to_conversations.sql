-- SPEC-08: Resumen estructurado de conversación
-- Coexiste con el campo 'summary text' existente (retrocompatibilidad).
ALTER TABLE chatbot_conversations
  ADD COLUMN IF NOT EXISTS structured_summary jsonb DEFAULT NULL;
