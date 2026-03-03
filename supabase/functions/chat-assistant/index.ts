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
3. Sé profesional, cercano y directo.
4. ESTRUCTURA Y FORMATO:
   - Usa **negritas** para destacar nombres de procesos, códigos y conceptos clave.
   - Usa listas con viñetas para enumerar beneficios o pasos.
   - IMPORTANTE: Usa DOBLE SALTO DE LÍNEA (\\n\\n) entre párrafos y entre puntos de una lista para asegurar la legibilidad. No amontones el texto.
   - Evita el uso de símbolos extraños o caracteres técnicos fuera de Markdown estándar.
5. Si el usuario pregunta por el "setup", "hosting" o dónde se alojan las automatizaciones, usa la información del contexto relativa al "Setup de Automatización (n8n)".
6. Cuando recomiendes un proceso, menciona su nombre y código (ej: A1).
7. FORMATO DE RESPUESTA: Debes responder SIEMPRE con un objeto JSON válido que contenga:
   - "reply": Tu respuesta en texto (usando Markdown estructurado).
   - "action": Establece este campo a "handover" si sugieres hablar con un humano o derivar la consulta. Si no, déjalo vacío "".

CONTEXTO:
${contextText}`,
                    },
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
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
            },
        })

    } catch (error) {
        console.error('Error en Edge Function:', error)
        return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
