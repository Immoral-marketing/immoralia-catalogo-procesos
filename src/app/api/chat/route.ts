/**
 * POST /api/chat
 * Portado de supabase/functions/chat-assistant/index.ts
 *
 * Genera respuesta del chatbot usando RAG sobre el catálogo de procesos:
 * 1. Embedding de la pregunta → búsqueda vectorial en Supabase
 * 2. Construcción de contexto con los documentos más relevantes
 * 3. Llamada a GPT-4o-mini con el contexto y el historial
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

const SECTOR_NAMES: Record<string, string> = {
  'centros-deportivos': 'Centros Deportivos',
  'gestorias': 'Gestorías',
  'salud': 'Centros de Salud',
  'construccion': 'Construcción & Inmobiliaria',
  'academias': 'Academias y Formación',
  'gastronomia-hosteleria': 'Gastronomía y Hostelería',
  'industrial': 'Industrial',
}

export async function POST(req: NextRequest) {
  try {
    const { message, sector, history = [] } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Falta el mensaje' }, { status: 400 })
    }

    const openaiKey = process.env.OPENAI_API_KEY
    if (!openaiKey) throw new Error('OPENAI_API_KEY no configurada')

    const supabase = createAdminClient()

    // 1. Embedding — usa el último mensaje del asistente como contexto para queries cortas
    const lastAssistant = Array.isArray(history)
      ? [...history].reverse().find((m: any) => m.role === 'assistant')?.content || ''
      : ''
    const embeddingInput = lastAssistant ? `${lastAssistant}\n\nUsuario: ${message}` : message

    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: embeddingInput }),
    })

    const embeddingResult = await embeddingResponse.json()
    if (embeddingResult.error) throw new Error(`OpenAI Embedding Error: ${embeddingResult.error.message}`)

    const queryEmbedding = embeddingResult.data[0].embedding

    // 2. Búsqueda en dos capas: sector específico + global sin duplicados
    let sectorDocs: any[] = []
    let globalDocs: any[] = []

    if (sector && SECTOR_NAMES[sector]) {
      const { data: sectorResults } = await supabase.rpc('match_chatbot_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.25,
        match_count: 3,
        sector_filter: sector,
      })
      if (sectorResults) sectorDocs = sectorResults

      const { data: globalResults } = await supabase.rpc('match_chatbot_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.3,
        match_count: 5,
      })
      if (globalResults) globalDocs = globalResults
    } else {
      const { data: globalResults } = await supabase.rpc('match_chatbot_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.3,
        match_count: 5,
      })
      if (globalResults) globalDocs = globalResults
    }

    const sectorIds = new Set(sectorDocs.map((d: any) => d.id))
    const nonDuplicateGlobal = globalDocs.filter((d: any) => !sectorIds.has(d.id))
    const documents = [...sectorDocs, ...nonDuplicateGlobal].slice(0, 5)

    console.log(`Sector: ${sector || 'general'} | Sector docs: ${sectorDocs.length} | Global docs: ${globalDocs.length} | Final: ${documents.length}`)

    // 3. Contexto con etiquetas de procedencia
    const sectorName = sector ? SECTOR_NAMES[sector] : null

    const contextText = documents.length > 0
      ? documents.map((doc: any) => {
          const meta = doc.metadata || {}
          const isSectorMatch = meta.landing_slug === sector
          const docSectorName = meta.landing_slug ? (SECTOR_NAMES[meta.landing_slug] || meta.landing_slug) : null
          let header = ''
          if (meta.source === 'catalog_process') {
            const sectorLabel = isSectorMatch
              ? `[SECTOR ACTUAL: ${sectorName}]`
              : docSectorName ? `[OTRO SECTOR: ${docSectorName}]` : '[PROCESO UNIVERSAL]'
            const moduloCodigo = meta.modulo_codigo ? ` | CÓDIGO: ${meta.modulo_codigo}` : ''
            header = `${sectorLabel} [PROCESO: ${meta.process_name || 'N/A'}${moduloCodigo} | SLUG: ${meta.slug || ''}]\n`
          }
          return `${header}${doc.content}`
        }).join('\n\n---\n\n')
      : 'No se encontró información relevante en el catálogo.'

    // 4. System prompt
    const sectorContext = sectorName
      ? `El usuario está explorando la sección de **${sectorName}** (/sector/${sector}).\n- Estás hablando con alguien que tiene un negocio de este sector. Habla como si conocieras su día a día.\n- Prioriza siempre los procesos marcados como [SECTOR ACTUAL].\n- Si algún proceso de [OTRO SECTOR] encaja claramente, menciónalo al final con naturalidad.`
      : `El usuario está en el catálogo general. Recomienda los procesos más relevantes sin restricción de sector.`

    const systemPrompt = `Eres el asistente de Immoralia. Ayudas a negocios a automatizar procesos con IA. Hablas como un consultor directo que conoce el sector, no como un chatbot corporativo.

MANTÉN EL HILO DE LA CONVERSACIÓN:
- Lees los mensajes anteriores. Si el usuario responde a una pregunta tuya, continúa ESE hilo — no empieces de cero ni cambies de tema.
- Una respuesta corta del usuario ("smartphones", "sí", "el primero") es una respuesta a tu pregunta anterior. Interprétala en ese contexto, nunca como una consulta nueva aislada.
- Si ya recomendaste un proceso y el usuario sigue preguntando sobre él, responde sobre ESE proceso. No saltes a recomendar otros distintos.

REGLAS DE RESPUESTA — síguelas en este orden:
1. Primera frase: reconoce el problema o responde a lo que dijo el usuario en una sola frase corta. Sin "Entiendo que...", sin "Es frustrante que...". Directo.
2. NO estás obligado a recomendar un proceso en cada turno. Si el usuario aporta información, responde a tu pregunta o sigue describiendo su situación, conversa con naturalidad y profundiza. Está bien un turno de pura conversación.
3. Recomienda un proceso solo cuando entiendas bien el problema. Una conversación de 2-3 turnos antes de recomendar es mejor que recomendar de golpe. Cuando recomiendes: 1-2 procesos máximo, con una frase de por qué encaja y el enlace.
4. Respuesta máxima: 4 párrafos cortos. Sin listas largas. Sin frases de relleno.

EJEMPLO DE RESPUESTA BUENA (imita este estilo):
Usuario: "Pierdo leads que llegan de redes sociales"
Respuesta: "Eso pasa cuando no hay un sistema que los capture al momento — el lead llega, nadie responde en las primeras horas, y se enfría.\\n\\nEl proceso que lo resuelve directamente es [Interesados priorizados por intención de compra](/catalogo/procesos/calificacion-inteligente-leads). Analiza cada contacto y prioriza los que tienen más probabilidad de cerrar.\\n\\n¿Los leads llegan mayormente por Instagram o también tienes formularios web?"

EJEMPLO DE RESPUESTA MALA (nunca hagas esto):
"Entiendo que estás buscando soluciones para mejorar la eficiencia de tu negocio en el sector de la construcción. Existen varias áreas donde la automatización puede facilitarte la vida..."
→ Demasiado genérico, demasiado largo, no reconoce el problema específico.

CONTEXTO DE NAVEGACIÓN:
${sectorContext}

ENLACES A PROCESOS:
- Todo proceso mencionado SIEMPRE debe ir como enlace clicable. Nunca en negrita sin enlace.
- Formato OBLIGATORIO: [Nombre del proceso](/catalogo/procesos/slug-exacto) — solo el enlace, sin código delante ni detrás.
- El chip ya muestra el código y bloque internamente. NO añadas "1.2" ni "B4" fuera del enlace.
- Usa el SLUG exacto del contexto (formato "SLUG: valor"). NUNCA pongas "SLUG" literal.
- Rutas relativas siempre. Sin dominio.

RESPUESTA JSON:
{ "reply": "texto en markdown", "action": "" }
"action" solo es "handover" si piden hablar con una persona.

CONTEXTO DEL CATÁLOGO:
${contextText}`

    // 5. Llamada a OpenAI
    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(Array.isArray(history) ? history.filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && m.content) : []),
          { role: 'user', content: message },
        ],
        response_format: { type: 'json_object' },
      }),
    })

    const chatResult = await chatResponse.json()
    if (chatResult.error) throw new Error(`OpenAI Chat Error: ${chatResult.error.message}`)

    const content = JSON.parse(chatResult.choices[0].message.content)
    const { reply, action } = content

    return NextResponse.json({ reply, action })
  } catch (error: any) {
    console.error('Error en /api/chat:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
