import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRetrieval(query) {
    console.log(`\nBuscando para: "${query}"`);

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
    const embedding = result.data[0].embedding;

    // 2. Llamar al RPC
    const { data: documents, error } = await supabase.rpc('match_chatbot_knowledge', {
        query_embedding: embedding,
        match_threshold: 0.3,
        match_count: 5,
    });

    if (error) {
        console.error('Error RPC:', error);
    } else {
        console.log(`Encontrados ${documents.length} documentos:`);
        documents.forEach((doc, i) => {
            console.log(`--- DOCUMENTO ${i + 1} (SCORE: ${doc.similarity.toFixed(4)}) ---`);
            console.log(`Process ID: ${doc.metadata.process_id}`);
            console.log(`Audience: ${doc.metadata.audience}`);
            console.log(`Flow Type: ${doc.metadata.flow_type}`);
            console.log(`Content Snippet:\n${doc.content.substring(0, 300)}...\n`);
        });
    }
}

const userQuery = "En que consiste el proceso de facturación automática y como podria iplementarlo en mi empresa teniendo en cuenta que trabajo con Salesforce?";
testRetrieval(userQuery);
