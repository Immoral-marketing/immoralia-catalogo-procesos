import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiKey) {
    console.error('Faltan variables de entorno (VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY o OPENAI_API_KEY)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateEmbeddings() {
    console.log('--- Iniciando generación de embeddings y carga a Supabase ---');

    const knowledgePath = './scripts/extracted_knowledge.json';
    if (!fs.existsSync(knowledgePath)) {
        console.error('No se encuentra el archivo extracted_knowledge.json. Ejecuta primero extract_content.mjs');
        return;
    }

    const chunks = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
    console.log(`Procesando ${chunks.length} fragmentos...`);

    // Limpiar conocimiento previo para evitar duplicados
    console.log('Limpiando conocimiento previo...');
    await supabase
        .from('chatbot_knowledge')
        .delete()
        .in('metadata->>source', ['catalog_process', 'general_knowledge']);

    for (const chunk of chunks) {
        console.log(`Generando embedding para: ${chunk.metadata.process_id || 'Info General'}...`);

        try {
            // 1. Llamada a OpenAI para generar el embedding
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

            // 2. Guardar en Supabase
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
