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

        // 4. System prompt actualizado con contexto de sector y lógica de enlaces
        const sectorContext = sectorName
            ? `El usuario está navegando en la sección de **${sectorName}** (/sector/${sector}).
- Prioriza los procesos marcados como [SECTOR ACTUAL] en tus respuestas.
- Si hay un proceso de [OTRO SECTOR] que sea claramente relevante, menciónalo brevemente al final como "También disponible para otros sectores".
- Si recomiendas el sector al usuario, usa el enlace: [${sectorName}](/sector/${sector}).`
            : `El usuario está en el catálogo general. Recomienda los procesos más relevantes sin restricción de sector.`

        const systemPrompt = `Eres el Asistente Inteligente de Immoralia. Ayudas a los usuarios a entender cómo podemos automatizar su negocio.

CONTEXTO DE NAVEGACIÓN:
${sectorContext}

MAPA EXACTO DE SECTORES Y SUS URLs (úsalo siempre para los enlaces de sector):
- Centros Deportivos → /sector/centros-deportivos
- Gestorías → /sector/gestorias
- Centros de Salud → /sector/salud
- Construcción & Inmobiliaria → /sector/construccion
- Academias y Formación → /sector/academias
- Gastronomía y Hostelería → /sector/gastronomia-hosteleria
- Industrial → /sector/industrial

REGLAS CRÍTICAS:
1. Usa el CONTEXTO para identificar los procesos que mejor resuelvan la necesidad del usuario.
2. Sé profesional, cercano y directo. Responde en español.
3. FORMATO:
   - Usa **negritas** para destacar nombres de procesos y conceptos clave.
   - Usa listas con viñetas para enumerar beneficios o pasos.
   - Usa DOBLE SALTO DE LÍNEA (\\n\\n) entre párrafos y entre puntos de lista.
4. ENLACES — OBLIGATORIO SIN EXCEPCIÓN:
   - CADA VEZ que menciones el nombre de un proceso, debes incluir su enlace. Sin excepciones. Formato: [Nombre del Proceso](/catalogo/procesos/SLUG)
   - CADA VEZ que menciones un sector, debes incluir su enlace. Usa el mapa de sectores de arriba.
   - Nunca escribas el nombre de un proceso en negrita sin añadir inmediatamente su enlace entre paréntesis.
   - Ejemplo obligatorio: "Te recomiendo **Recordatorios automáticos pre-cita** ([ver proceso](/catalogo/procesos/salud-recordatorios-citas))".
   - Ejemplo de sector: "puedes explorar más en [Centros de Salud](/sector/salud)".
   - El SLUG lo obtienes del contexto del catálogo — nunca lo inventes.
   - Nunca uses códigos alfanuméricos (A1, CM3, etc.) en las respuestas.
   - CRÍTICO: usa SIEMPRE rutas relativas que empiecen por / — NUNCA incluyas un dominio (prohibido: https://immoralia.com o similar).
   - Correcto: /catalogo/procesos/lead-capture-crm | Incorrecto: https://immoralia.com/catalogo/procesos/lead-capture-crm
5. RESPUESTAS COMPLETAS: Desarrolla siempre una respuesta completa. Nunca termines una respuesta de forma abrupta ni dejes frases sin completar. Si vas a explicar cómo funciona un proceso o sus beneficios, hazlo siempre — mínimo 3 párrafos o puntos de contenido real.
6. Si no tienes información suficiente en el contexto, sugiere hablar con el equipo de Immoralia.
7. RESPUESTA: Devuelve SIEMPRE un objeto JSON válido:
   - "reply": tu respuesta en Markdown estructurado y completo.
   - "action": "" en conversaciones normales, "handover" si el usuario necesita atención humana.

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
