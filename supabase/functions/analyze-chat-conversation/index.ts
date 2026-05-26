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
        const { transcript, ...otherFlags } = await req.json()

        if (!transcript) {
            return new Response(JSON.stringify({ error: 'Falta el transcript de la conversación' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const openaiKey = Deno.env.get('OPENAI_API_KEY')
        if (!openaiKey) {
            throw new Error('OPENAI_API_KEY no configurada')
        }

        // System prompt basado en los requerimientos del usuario
        const systemPrompt = `Eres un sistema de logging para un chatbot de automatización de procesos. 
Tu tarea es analizar el transcript de una charla y generar un objeto JSON estructurado para analítica de negocio, aplicando reglas estrictas de privacidad.

REGLAS DE PRIVACIDAD (PII):
- NO guardes datos personales: emails, teléfonos, direcciones, nombres de personas reales.
- Redacta emails como [REDACTED_EMAIL].
- Redacta teléfonos como [REDACTED_PHONE].
- Redacta nombres de personas (Juan, Pérez, etc.) como [REDACTED_PERSON].
- El NOMBRE DE EMPRESA (ej: "Construcciones Immoralia") SÍ se permite y debe extraerse.

REGLAS DE EXTRACCIÓN Y ANALÍTICA:
1. first_question: La primera duda real del usuario, saltando saludos iniciales.
2. conversation_text: El transcript completo pero con todos los datos personales redactados según las reglas anteriores.
3. company_name: Extrae el nombre de la empresa si aparece; si no, null.
4. company_sector: Extrae el sector (ej: Construcción, Marketing, Retail) si aparece; si no, null.
5. company_size_hint: Si mencionan cuántos son, normaliza a: "1-10", "11-50", "51-200", "200+". Si no, null.
6. human_intervention_required: true si el usuario pide explícitamente hablar con alguien o si se detecta frustración/necesidad de derivación.
7. ended_reason: Elige la que mejor encaje:
   - "resolved": Se respondió la duda con éxito.
   - "human": Se derivó a un humano.
   - "abandoned": Conversación cortada o sin sentido.
   - "unknown": No se puede determinar.
8. Cuenta mensajes de usuario (user_messages_count) y asistente (assistant_messages_count). total_turns es la suma.

DEVOLVER SOLO JSON CON ESTE FORMATO EXACTO:
{
  "first_question": "",
  "conversation_text": "",
  "company_name": null,
  "company_sector": null,
  "company_size_hint": null,
  "location_hint": null,
  "user_messages_count": 0,
  "assistant_messages_count": 0,
  "total_turns": 0,
  "human_intervention_required": false,
  "form_opened": false,
  "form_submitted": false,
  "resolved": null,
  "user_feedback": null,
  "feedback_comment": null,
  "ended_reason": "resolved|human|abandoned|unknown"
}`;

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
                    { role: 'user', content: `Analiza el siguiente transcript:\n\n${transcript}` },
                ],
                response_format: { type: "json_object" }
            }),
        })

        const chatResult = await chatResponse.json()
        if (chatResult.error) throw new Error(`OpenAI Error: ${chatResult.error.message}`)

        const analysis = JSON.parse(chatResult.choices[0].message.content)

        // Combinar con flags externos si se proporcionan
        const finalData = {
            ...analysis,
            form_opened: otherFlags.form_opened || analysis.form_opened || false,
            form_submitted: otherFlags.form_submitted || analysis.form_submitted || false,
            resolved: otherFlags.resolved !== undefined ? otherFlags.resolved : analysis.resolved
        }

        // 3. Insertar en la base de datos usando el Service Role para bypass de RLS
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey)
            const { error: insertError } = await supabase
                .from('chat_conversations')
                .insert([finalData])

            if (insertError) {
                console.error('Error al insertar analítica en DB:', insertError)
            } else {
                console.log('Analítica de conversación guardada con éxito.')
            }
        }

        return new Response(JSON.stringify(finalData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error('Error en Edge Function:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
