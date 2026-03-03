import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugRetrieval(query) {
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

    const { data: documents, error } = await supabase.rpc('match_chatbot_knowledge', {
        query_embedding: embedding,
        match_threshold: 0.3,
        match_count: 3,
    });

    if (error) {
        console.error(error);
        return;
    }

    console.log('--- TOP RETRIEVAL RESULTS ---');
    documents.forEach((doc, i) => {
        console.log(`\n[RANK ${i + 1}] ID: ${doc.metadata.process_id} | Score: ${doc.similarity.toFixed(4)}`);
        console.log(`Context Header: ${doc.content.includes('## Contexto') ? 'FOUND' : 'NOT FOUND'}`);
        console.log(`First 500 chars: ${doc.content.substring(0, 500)}`);
    });
}

debugRetrieval("En que consiste el proceso de facturación automática?");
