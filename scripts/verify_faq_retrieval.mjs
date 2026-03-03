import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRetrieval(query) {
    console.log(`\n--- Probando recuperación para: "${query}" ---`);

    // 1. Generar embedding
    const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: query,
        }),
    });
    const result = await response.json();
    if (result.error) {
        console.error('Error OpenAI:', result.error);
        return;
    }
    const embedding = result.data[0].embedding;

    // 2. Llamar al RPC
    const { data: documents, error } = await supabase.rpc('match_chatbot_knowledge', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 3,
    });

    if (error) {
        console.error('Error RPC:', error);
    } else {
        console.log(`Encontrados ${documents.length} resultados:`);
        documents.forEach((doc, i) => {
            console.log(`\n[Resultado ${i + 1}] Similarity: ${doc.similarity.toFixed(4)}`);
            console.log(`Source: ${doc.metadata.source}`);
            console.log(`Content: ${doc.content.substring(0, 300)}...`);
        });
    }
}

async function runTests() {
    // Test 1: Pregunta sobre tiempo de implementación (el fallo original)
    await testRetrieval("¿Cuánto tiempo se tarda en implementar el proceso A1?");

    // Test 2: Pregunta sobre n8n (nueva FAQ)
    await testRetrieval("¿Qué es n8n?");

    // Test 3: Pregunta sobre seguridad (nueva FAQ)
    await testRetrieval("¿Están seguros mis datos con vuestras automatizaciones?");
}

runTests();
