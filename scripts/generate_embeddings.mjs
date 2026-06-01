import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const isProd = process.argv.includes('--target=prod');

const supabaseUrl = isProd
    ? process.env.PROD_SUPABASE_URL
    : (process.env.STAGING_SUPABASE_URL || process.env.VITE_SUPABASE_URL);

const supabaseKey = isProd
    ? process.env.PROD_SUPABASE_SERVICE_ROLE_KEY
    : (process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);

const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiKey) {
    console.error(`Faltan variables de entorno para target=${isProd ? 'prod' : 'staging'}`);
    console.error('Necesitas: PROD_SUPABASE_URL + PROD_SUPABASE_SERVICE_ROLE_KEY (prod) o STAGING_SUPABASE_URL + STAGING_SUPABASE_SERVICE_ROLE_KEY (staging)');
    process.exit(1);
}

console.log(`Target: ${isProd ? 'PRODUCCIÓN' : 'STAGING'} (${supabaseUrl})`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateEmbeddings() {
    console.log('--- Iniciando generación de embeddings y carga a Supabase ---');

    const knowledgePath = './scripts/extracted_knowledge.json';
    if (!fs.existsSync(knowledgePath)) {
        console.error('No se encuentra extracted_knowledge.json. Ejecuta primero extract_content.mjs');
        return;
    }

    const chunks = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
    console.log(`Procesando ${chunks.length} fragmentos...`);

    console.log('Limpiando conocimiento previo...');
    await supabase
        .from('chatbot_knowledge')
        .delete()
        .in('metadata->>source', ['catalog_process', 'general_knowledge']);

    for (const chunk of chunks) {
        console.log(`Generando embedding para: ${chunk.metadata.process_id || 'Info General'}...`);

        try {
            const response = await fetch('https://api.openai.com/v1/embeddings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openaiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'text-embedding-3-small',
                    input: chunk.content,
                }),
            });

            const result = await response.json();

            if (result.error) {
                console.error('Error de OpenAI:', result.error);
                continue;
            }

            const embedding = result.data[0].embedding;

            const { error } = await supabase
                .from('chatbot_knowledge')
                .insert({
                    content: chunk.content,
                    metadata: chunk.metadata,
                    embedding: embedding,
                });

            if (error) {
                console.error('Error al insertar en Supabase:', error);
            } else {
                console.log(`✓ Cargado correctamente.`);
            }
        } catch (err) {
            console.error('Error en el proceso:', err);
        }
    }

    console.log('--- Proceso finalizado ---');
}

generateEmbeddings();
