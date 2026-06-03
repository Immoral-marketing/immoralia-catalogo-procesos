import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SECTOR_NAMES: Record<string, string> = {
    'centros-deportivos': 'Centros Deportivos',
    'gestorias': 'Gestorías',
    'salud': 'Centros de Salud',
    'construccion': 'Construcción & Inmobiliaria',
    'academias': 'Academias y Formación',
    'gastronomia-hosteleria': 'Gastronomía y Hostelería',
    'industrial': 'Industrial',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { message, sector } = await req.json()

        if (!message) {
            return new Response(JSON.stringify({ error: 'Falta el mensaje' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const openaiKey = Deno.env.get('OPENAI_API_KEY')

        const supabase = createClient(supabaseUrl, supabaseKey)

        // 1. Generar embedding para la pregunta del usuario
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'text-embedding-3-small',
                input: message,
            }),
        })

        const embeddingResult = await embeddingResponse.json()
        if (embeddingResult.error) throw new Error(`OpenAI Embedding Error: ${embeddingResult.error.message}`)

        const queryEmbedding = embeddingResult.data[0].embedding

        // 2. Búsqueda en dos capas: sector específico + global sin duplicados
        let sectorDocs: any[] = []
        let globalDocs: any[] = []

        if (sector && SECTOR_NAMES[sector]) {
            // Capa 1: procesos del sector actual (hasta 3)
            const { data: sectorResults, error: sectorError } = await supabase.rpc('match_chatbot_knowledge', {
                query_embedding: queryEmbedding,
                match_threshold: 0.25,
                match_count: 3,
                sector_filter: sector,
            })
            if (!sectorError && sectorResults) sectorDocs = sectorResults

            // Capa 2: búsqueda global para alternativas de otros sectores (hasta 5)
            const { data: globalResults, error: globalError } = await supabase.rpc('match_chatbot_knowledge', {
                query_embedding: queryEmbedding,
                match_threshold: 0.3,
                match_count: 5,
            })
            if (!globalError && globalResults) globalDocs = globalResults
        } else {
            // Sin sector: búsqueda global estándar
            const { data: globalResults, error: globalError } = await supabase.rpc('match_chatbot_knowledge', {
                query_embedding: queryEmbedding,
                match_threshold: 0.3,
                match_count: 5,
            })
            if (!globalError && globalResults) globalDocs = globalResults
        }

        // Combinar: sector primero, luego rellenar con globales sin duplicar (máx 5 total)
        const sectorIds = new Set(sectorDocs.map((d: any) => d.id))
        const nonDuplicateGlobal = globalDocs.filter((d: any) => !sectorIds.has(d.id))
        const documents = [...sectorDocs, ...nonDuplicateGlobal].slice(0, 5)

        console.log(`Sector: ${sector || 'general'} | Sector docs: ${sectorDocs.length} | Global docs: ${globalDocs.length} | Final: ${documents.length}`)

        // 3. Construir el contexto etiquetando la procedencia de cada documento
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
                    header = `${sectorLabel} [PROCESO: ${meta.process_name || 'N/A'} | SLUG: ${meta.slug || ''}]\n`
                }
                return `${header}${doc.content}`
            }).join('\n\n---\n\n')
            : 'No se encontró información relevante en el catálogo.'

        // 4. System prompt conversacional con contexto de sector
        const sectorContext = sectorName
            ? `El usuario está explorando la sección de **${sectorName}** (/sector/${sector}).
- Estás hablando con alguien que tiene un negocio de este sector. Habla como si conocieras su día a día.
- Prioriza siempre los procesos marcados como [SECTOR ACTUAL].
- Si algún proceso de [OTRO SECTOR] encaja claramente, menciónalo al final con naturalidad.`
            : `El usuario está en el catálogo general. Recomienda los procesos más relevantes sin restricción de sector.`

        const systemPrompt = `Eres el asistente de Immoralia, una empresa que ayuda a negocios a automatizar sus procesos con IA. Tu trabajo es entender el problema real del usuario y orientarle hacia las automatizaciones que más le van a ayudar.

CÓMO DEBES HABLAR:
- Empieza siempre reconociendo el problema que te han contado antes de recomendar nada. Una frase empática, real, no corporativa.
- Si el problema es vago o tiene varias lecturas posibles, haz UNA pregunta de seguimiento concreta antes de recomendar procesos.
- Cuando recomiendes un proceso, explica brevemente POR QUÉ encaja con su problema específico — no des una lista fría de nombres.
- Usa un tono directo, cercano, como un consultor que conoce el sector. Nada de frases genéricas como "entiendo tu situación".
- Si el usuario ya ha explicado bastante, ve directo a lo útil sin repetir lo que ya sabes.
- Máximo 2-3 procesos por respuesta. Mejor pocos y bien explicados que una lista de 8.

CONTEXTO DE NAVEGACIÓN:
${sectorContext}

MAPA DE SECTORES (usa estas URLs exactas):
- Centros Deportivos → /sector/centros-deportivos
- Gestorías → /sector/gestorias
- Centros de Salud → /sector/salud
- Construcción & Inmobiliaria → /sector/construccion
- Academias y Formación → /sector/academias
- Gastronomía y Hostelería → /sector/gastronomia-hosteleria
- Industrial → /sector/industrial

REGLAS DE FORMATO Y ENLACES:
1. **Negritas** para nombres de procesos y conceptos clave.
2. Listas con viñetas solo cuando enumeres 3+ items. Evita el formato lista para respuestas cortas.
3. DOBLE salto de línea (\\n\\n) entre párrafos.
4. ENLACES A PROCESOS — reglas absolutas:
   - Solo enlaza un proceso si su SLUG aparece en el CONTEXTO DEL CATÁLOGO (formato "SLUG: valor").
   - Formato: [Nombre del proceso](/catalogo/procesos/SLUG-EXACTO)
   - NUNCA pongas el nombre del proceso en **negrita** justo antes o después del enlace — el chip ya muestra el nombre, duplicarlo es redundante.
   - NUNCA inventes un slug. Si no está en el contexto, escríbelo en **negrita** sin enlace.
   - Rutas siempre relativas (/). Nunca incluyas dominio.
5. Respuestas completas, nunca cortadas. Mínimo 2 párrafos de contenido real.
6. Si no tienes info suficiente en el contexto, di que puedes orientarle mejor en una llamada.
7. RESPUESTA: JSON válido siempre:
   - "reply": respuesta en Markdown.
   - "action": "" normalmente, "handover" si pide hablar con una persona.

CONTEXTO DEL CATÁLOGO:
${contextText}`

        // 5. Llamar a OpenAI con el prompt actualizado
        const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message },
                ],
                response_format: { type: "json_object" }
            }),
        })

        const chatResult = await chatResponse.json()
        if (chatResult.error) throw new Error(`OpenAI Chat Error: ${chatResult.error.message}`)

        const content = JSON.parse(chatResult.choices[0].message.content)
        const { reply, action } = content

        return new Response(JSON.stringify({ reply, action }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error('Error en Edge Function:', error)
        return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
