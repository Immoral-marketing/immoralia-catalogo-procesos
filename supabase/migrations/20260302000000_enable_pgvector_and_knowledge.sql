-- 1. Habilitar la extensión pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Crear tabla para el conocimiento del chatbot (fragmentos de texto)
CREATE TABLE IF NOT EXISTS public.chatbot_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL, -- El fragmento de texto original (Markdown)
    metadata JSONB DEFAULT '{}', -- Para guardar origen (ej: "A1", "Filosofía")
    embedding VECTOR(1536), -- Tamaño estándar para text-embedding-3-small de OpenAI
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.chatbot_knowledge ENABLE ROW LEVEL SECURITY;

-- Política de lectura (solo lectura para el chatbot, el usuario no inserta aquí)
CREATE POLICY "Allow public read access to knowledge" ON public.chatbot_knowledge
    FOR SELECT USING (true);

-- 3. Función para búsqueda por similitud (Cosine Similarity)
-- Esta función se llamará desde la Edge Function de Supabase
CREATE OR REPLACE FUNCTION match_chatbot_knowledge (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    chatbot_knowledge.id,
    chatbot_knowledge.content,
    chatbot_knowledge.metadata,
    1 - (chatbot_knowledge.embedding <=> query_embedding) AS similarity
  FROM chatbot_knowledge
  WHERE 1 - (chatbot_knowledge.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
