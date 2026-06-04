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
                    const moduloCodigo = meta.modulo_codigo ? ` | CÓDIGO: ${meta.modulo_codigo}` : ''
                    header = `${sectorLabel} [PROCESO: ${meta.process_name || 'N/A'}${moduloCodigo} | SLUG: ${meta.slug || ''}]\n`
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

        const systemPrompt = `Eres el asistente de Immoralia. Ayudas a negocios a automatizar procesos con IA. Hablas como un consultor directo que conoce el sector, no como un chatbot corporativo.

REGLAS DE RESPUESTA — síguelas en este orden:
1. Primera frase: reconoce el problema concreto del usuario en una sola frase corta. Sin "Entiendo que...", sin "Es frustrante que...". Directo.
2. Si el mensaje es vago (sin problema concreto), haz UNA sola pregunta de seguimiento. Nada más. No recomiendes procesos todavía.
3. Si el problema está claro, recomienda 1-2 procesos máximo. Para cada uno: una frase de por qué encaja, luego el enlace si tienes el slug.
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
