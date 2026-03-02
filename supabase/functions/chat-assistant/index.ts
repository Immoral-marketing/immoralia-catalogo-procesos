import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Manejo de preflight CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { message } = await req.json()

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

        // 2. Buscar fragmentos relevantes en Supabase
        const { data: documents, error: matchError } = await supabase.rpc('match_chatbot_knowledge', {
            query_embedding: queryEmbedding,
            match_threshold: 0.5, // Ajustable
            match_count: 5,
        })

        if (matchError) throw matchError

        // 3. Construir el contexto
        const contextText = documents
            ?.map((doc: any) => doc.content)
            .join('\n\n---\n\n') || 'No se encontró información relevante.'

        // 4. Llamar a OpenAI para la respuesta final (con el contexto inyectado)
        const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `Eres el Asistente Inteligente de Immoralia. Tu objetivo es ayudar a los usuarios del catálogo de procesos a entender cómo podemos automatizar su negocio.
            
REGLAS CRÍTICAS:
1. Usa EXCLUSIVAMENTE el CONTEXTO proporcionado para responder.
2. Si la respuesta no está en el contexto, di educadamente que no tienes esa información y ofrece derivar la consulta a un humano.
3. Sé profesional, cercano y directo. Usa Markdown para que las respuestas sean fáciles de leer (negritas, listas, etc.).
4. Si el usuario pregunta por el "setup", "hosting" o dónde se alojan las automatizaciones, usa la información del contexto relativa al "Setup de Automatización (n8n)".
5. Cuando recomiendes un proceso, menciona su nombre y código (ej: A1).

CONTEXTO:
${contextText}`,
                    },
                    { role: 'user', content: message },
                ],
            }),
        })

        const chatResult = await chatResponse.json()
        const reply = chatResult.choices[0].message.content

        return new Response(JSON.stringify({ reply }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
            },
        })

    } catch (error) {
        console.error('Error en Edge Function:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
