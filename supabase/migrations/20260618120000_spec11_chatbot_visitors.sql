-- SPEC-11: Persistencia extendida del visitante con cookie de larga duración
-- Limpieza de conversaciones legacy acordada con el owner (eran datos de pruebas sintéticas).

DELETE FROM chatbot_messages;
DELETE FROM chatbot_conversations;

-- Tabla de visitantes anónimos: agrupa todas las conversaciones del mismo navegador
CREATE TABLE chatbot_visitors (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         timestamptz NOT NULL DEFAULT now(),
  last_seen_at       timestamptz NOT NULL DEFAULT now(),
  lead_id            uuid        REFERENCES contact_submissions(id) ON DELETE SET NULL,
  conversation_count int         NOT NULL DEFAULT 0
);

CREATE INDEX idx_chatbot_visitors_lead_id ON chatbot_visitors(lead_id);

-- FK de conversaciones al visitante (tabla está vacía tras el DELETE)
ALTER TABLE chatbot_conversations
  ADD COLUMN visitor_id uuid
    REFERENCES chatbot_visitors(id) ON DELETE CASCADE NOT NULL;

CREATE INDEX idx_chatbot_conversations_visitor_id ON chatbot_conversations(visitor_id);
