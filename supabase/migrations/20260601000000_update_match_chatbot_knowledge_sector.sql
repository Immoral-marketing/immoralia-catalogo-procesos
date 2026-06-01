-- Actualiza match_chatbot_knowledge con parámetro opcional de filtro por sector.
-- Cuando sector_filter es NULL → comportamiento original (todos los docs).
-- Cuando se pasa un landing_slug → devuelve solo docs de ese sector + conocimiento general.
-- Retrocompatible: las llamadas sin el 4º parámetro siguen funcionando igual.

CREATE OR REPLACE FUNCTION match_chatbot_knowledge (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  sector_filter TEXT DEFAULT NULL
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
    ck.id,
    ck.content,
    ck.metadata,
    1 - (ck.embedding <=> query_embedding) AS similarity
  FROM chatbot_knowledge ck
  WHERE
    1 - (ck.embedding <=> query_embedding) > match_threshold
    AND (
      sector_filter IS NULL
      OR ck.metadata->>'landing_slug' = sector_filter
      OR ck.metadata->>'source' = 'general_knowledge'
    )
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
