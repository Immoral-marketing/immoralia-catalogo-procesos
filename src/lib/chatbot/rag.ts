/**
 * SPEC-01 — Recuperación de contexto (RAG) del motor v3.
 * Mantiene la búsqueda en dos capas validada en v2 (CA-14):
 * sector actual prioritario (3 docs, umbral 0.25) + global (5 docs, umbral 0.3).
 */
import { createClient } from '@supabase/supabase-js'
import { EMBEDDING_MODEL, SECTOR_NAMES } from './constants'
import { resolveProcessSlug } from './resolveProcess'

interface KnowledgeDoc {
  id: string
  content: string
  metadata: {
    source?: string
    landing_slug?: string
    modulo_codigo?: string
    process_name?: string
    slug?: string
  } | null
}

async function embed(input: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input }),
  })
  const result = await response.json()
  if (result.error) throw new Error(`OpenAI Embedding Error: ${result.error.message}`)
  return result.data[0].embedding
}

/**
 * Busca contexto relevante. El input de embedding combina la última respuesta
 * del bot con el mensaje nuevo para que las réplicas cortas ("sí", "el primero")
 * matcheen en el hilo correcto (CA-04).
 */
export async function retrieveContext(params: {
  message: string
  lastAssistantContent: string | null
  sector: string | null
}): Promise<string> {
  const { message, lastAssistantContent, sector } = params

  const embeddingInput = lastAssistantContent
    ? `${lastAssistantContent}\n\nUsuario: ${message}`
    : message
  const queryEmbedding = await embed(embeddingInput)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } },
  )

  let sectorDocs: KnowledgeDoc[] = []
  let globalDocs: KnowledgeDoc[] = []

  if (sector && SECTOR_NAMES[sector]) {
    const { data: sectorResults } = await supabase.rpc('match_chatbot_knowledge', {
      query_embedding: queryEmbedding,
      match_threshold: 0.25,
      match_count: 3,
      sector_filter: sector,
    })
    if (sectorResults) sectorDocs = sectorResults as KnowledgeDoc[]
  }

  const { data: globalResults } = await supabase.rpc('match_chatbot_knowledge', {
    query_embedding: queryEmbedding,
    match_threshold: 0.3,
    match_count: 5,
  })
  if (globalResults) globalDocs = globalResults as KnowledgeDoc[]

  const sectorIds = new Set(sectorDocs.map(d => d.id))
  const documents = [...sectorDocs, ...globalDocs.filter(d => !sectorIds.has(d.id))].slice(0, 5)

  if (documents.length === 0) {
    return 'No se encontró información relevante en el catálogo.'
  }

  const sectorName = sector ? SECTOR_NAMES[sector] : null

  return documents
    .map(doc => {
      const meta = doc.metadata || {}
      let header = ''
      if (meta.source === 'catalog_process') {
        const isSectorMatch = meta.landing_slug === sector
        const docSectorName = meta.landing_slug
          ? SECTOR_NAMES[meta.landing_slug] || meta.landing_slug
          : null
        const sectorLabel = isSectorMatch
          ? `[SECTOR ACTUAL: ${sectorName}]`
          : docSectorName
            ? `[OTRO SECTOR: ${docSectorName}]`
            : '[PROCESO UNIVERSAL]'
        const moduloCodigo = meta.modulo_codigo ? ` | CÓDIGO: ${meta.modulo_codigo}` : ''
        header = `${sectorLabel} [PROCESO: ${meta.process_name || 'N/A'}${moduloCodigo} | SLUG: ${meta.slug || ''}]\n`
      }
      return `${header}${doc.content}`
    })
    .join('\n\n---\n\n')
}

/** Keywords por sector para inferir el contexto cuando sector=null en la home. */
const SECTOR_KEYWORDS: Record<string, string[]> = {
  'salud': ['clínica', 'clinica', 'dental', 'dentista', 'ortodoncia', 'médico', 'medico', 'hospital', 'fisio', 'psicólogo', 'psicologo', 'farmacia', 'sanitario', 'salud', 'enfermería', 'enfermeria', 'veterinario', 'óptica', 'optica', 'terapeuta', 'consulta', 'paciente', 'pacientes'],
  'academias': ['academia', 'formación', 'formacion', 'cursos', 'escuela', 'instituto', 'educación', 'educacion', 'aprendizaje', 'alumnos', 'profesores', 'clases', 'docente', 'matrícula', 'matricula'],
  'centros-deportivos': ['gimnasio', 'gym', 'crossfit', 'deportivo', 'deporte', 'piscina', 'yoga', 'pilates', 'fitness', 'natación', 'natacion', 'entrenamiento', 'socios', 'abonados'],
  'gestorias': ['gestoría', 'gestoria', 'gestora', 'asesoría', 'asesoria', 'contabilidad', 'fiscal', 'laboral', 'gestor', 'asesor', 'declaración', 'declaracion', 'impuestos', 'nóminas', 'nominas', 'irpf', 'iva', 'autónomos', 'autonomos'],
  'construccion': ['construcción', 'construccion', 'inmobiliaria', 'obra', 'promotora', 'arquitecto', 'reformas', 'promotor', 'vivienda', 'pisos', 'inmueble', 'parcela', 'urbanización', 'urbanizacion'],
  'gastronomia-hosteleria': ['restaurante', 'hostelería', 'hosteleria', 'bar', 'cafetería', 'cafeteria', 'hotel', 'gastronomía', 'gastronomia', 'catering', 'cocina', 'menú', 'menu', 'terraza', 'reservas'],
  'industrial': ['industrial', 'fábrica', 'fabrica', 'manufactura', 'producción', 'produccion', 'almacén', 'almacen', 'logística', 'logistica', 'inventario', 'stock', 'maquinaria', 'taller'],
}

/**
 * Intenta inferir el sector del usuario a partir de keywords en su mensaje.
 * Solo se usa cuando sector=null (home) para mejorar la relevancia del RAG.
 */
export function inferSectorFromMessage(message: string): string | null {
  const lower = message.toLowerCase()
  let bestSector: string | null = null
  let bestCount = 0
  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    const count = keywords.filter(kw => lower.includes(kw)).length
    if (count > bestCount) {
      bestCount = count
      bestSector = sector
    }
  }
  return bestCount > 0 ? bestSector : null
}

/**
 * Extrae los slugs de procesos enlazados en una respuesta del bot.
 * Valida contra el catálogo y repara slugs inventados por nombre (misma
 * lógica que la UI) — solo se persisten como recomendados slugs reales.
 */
export function extractRecommendedSlugs(reply: string): string[] {
  const matches = reply.matchAll(/\[([^\]]+)\]\(\/catalogo\/procesos\/([a-z0-9-]+)\)/g)
  const resolved = [...matches]
    .map(m => resolveProcessSlug(m[2], m[1]))
    .filter((slug): slug is string => slug !== null)
  return [...new Set(resolved)]
}
