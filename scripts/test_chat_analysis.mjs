import * as dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY no encontrada en .env");
    process.exit(1);
}

const mockTranscript = `
User: Hola, buenas.
Assistant: ¡Hola! Soy el Asistente de Immoralia. ¿En qué puedo ayudarte hoy?
User: Pues mira, soy Juan Pérez de 'Digital Solutions SL'. Somos una agencia de marketing de unos 35 empleados.
Assistant: Encantado, Juan. ¿Qué estáis buscando automatizar en Digital Solutions SL?
User: Queríamos ver si podemos automatizar la facturación. Mi email es juan.perez@digitalsolutions.com y mi móvil es +34 600 000 000.
Assistant: Claro, para una agencia de vuestro tamaño (35 empleados), el proceso A1 es ideal.
User: Vale, me interesa. ¿Podemos hablar con alguien?
Assistant: Por supuesto, abro el formulario de contacto para que un experto te llame.
`;

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

async function testAnalysis() {
    console.log("--- TEST DE ANÁLISIS DE TRANSCRIPT ---");

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Analiza el siguiente transcript:\n\n${mockTranscript}` },
                ],
                response_format: { type: "json_object" }
            }),
        });

        const result = await response.json();
        const analysis = JSON.parse(result.choices[0].message.content);

        console.log("\nRESULTADO DEL ANÁLISIS:");
        console.log(JSON.stringify(analysis, null, 2));

        // Verificaciones básicas
        if (analysis.company_name !== 'Digital Solutions SL') console.error("❌ Falla extracción company_name");
        if (!analysis.conversation_text.includes('[REDACTED_EMAIL]')) console.error("❌ Falla redacción email");
        if (!analysis.conversation_text.includes('[REDACTED_PHONE]')) console.error("❌ Falla redacción teléfono");
        if (analysis.company_size_hint !== '11-50') console.error("❌ Falla normalización company_size");

    } catch (error) {
        console.error("Error en el test:", error);
    }
}

testAnalysis();
