/**
 * SPEC-04 — Regeneración de embeddings con confirmación explícita (CA-11).
 *
 * Modo por defecto: cuenta documentos + estima coste y NO regenera.
 * Para regenerar de verdad: --apply (más confirmación interactiva si TTY).
 *
 * Filtra por --sector=<slug> para regenerar solo un sector (lee el JSON
 * extraído correspondiente y solo borra los embeddings de ese sector).
 *
 * Uso:
 *   node scripts/extract_content.mjs --sector=salud
 *   node scripts/generate_embeddings.mjs --sector=salud         # dry-run
 *   node scripts/generate_embeddings.mjs --sector=salud --apply # ejecuta
 *   node scripts/generate_embeddings.mjs --target=prod --apply  # producción
 *
 * Coste estimado (text-embedding-3-small, $0.02 / 1M tokens):
 *   ~600 tokens medios por documento × 150 docs ≈ $0.002 — cero euros prácticamente.
 *   La confirmación está por hábito, no por coste.
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as readline from 'readline';

dotenv.config();

const isProd = process.argv.includes('--target=prod');
const apply = process.argv.includes('--apply');
const sectorFilter = process.argv.find(a => a.startsWith('--sector='))?.slice(9) || null;

const supabaseUrl = isProd
    ? process.env.PROD_SUPABASE_URL
    : (process.env.STAGING_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL);
const supabaseKey = isProd
    ? process.env.PROD_SUPABASE_SERVICE_ROLE_KEY
    : (process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiKey) {
    console.error(`Faltan variables de entorno para target=${isProd ? 'prod' : 'staging'}`);
    process.exit(1);
}

const TARGET_LABEL = isProd ? 'PRODUCCIÓN' : 'STAGING';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const PRICE_PER_MILLION_TOKENS_USD = 0.02;
const ROUGH_CHARS_PER_TOKEN = 4;

console.log(`\nTarget: ${TARGET_LABEL} (${supabaseUrl})`);
if (sectorFilter) console.log(`Sector: ${sectorFilter}`);

const supabase = createClient(supabaseUrl, supabaseKey);

function askConfirm(message) {
    return new Promise(resolve => {
        // En modo no-TTY (CI, scripts), --apply ES la autorización: doble paso (--apply + no-TTY) ya es confirmación explícita.
        if (!process.stdin.isTTY) {
            console.log(`\n[--apply autoriza en modo no interactivo] ${message} → continuando.`);
            resolve(true);
            return;
        }
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question(`\n${message} (escribe "si" para confirmar): `, ans => {
            rl.close();
            resolve(ans.trim().toLowerCase() === 'si' || ans.trim().toLowerCase() === 'sí');
        });
    });
}

function estimateCost(chunks) {
    const totalChars = chunks.reduce((sum, c) => sum + (c.content?.length || 0), 0);
    const tokens = Math.ceil(totalChars / ROUGH_CHARS_PER_TOKEN);
    const usd = (tokens / 1_000_000) * PRICE_PER_MILLION_TOKENS_USD;
    return { totalChars, tokens, usd };
}

async function generateEmbeddings() {
    const knowledgePath = sectorFilter
        ? `./scripts/extracted_knowledge.${sectorFilter}.json`
        : './scripts/extracted_knowledge.json';

    if (!fs.existsSync(knowledgePath)) {
        console.error(`\nNo se encuentra ${knowledgePath}.`);
        console.error(`Ejecuta primero: node scripts/extract_content.mjs${sectorFilter ? ` --sector=${sectorFilter}` : ''}`);
        process.exit(1);
    }

    const chunks = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
    const { totalChars, tokens, usd } = estimateCost(chunks);

    console.log(`\n┌─ Resumen de regeneración`);
    console.log(`│  Documentos:       ${chunks.length}`);
    console.log(`│  Caracteres total: ${totalChars.toLocaleString()}`);
    console.log(`│  Tokens estimados: ${tokens.toLocaleString()}`);
    console.log(`│  Modelo:           ${EMBEDDING_MODEL}`);
    console.log(`│  Coste estimado:   $${usd.toFixed(4)} USD`);
    console.log(`└──`);

    if (!apply) {
        console.log(`\n[DRY-RUN] No se ha regenerado nada.`);
        console.log(`Para ejecutar de verdad: añade --apply al comando.\n`);
        return;
    }

    const target = sectorFilter
        ? `sector "${sectorFilter}" en ${TARGET_LABEL}`
        : `TODA la knowledge base en ${TARGET_LABEL}`;
    const confirmed = await askConfirm(`Vas a regenerar embeddings de ${target}. ¿Continuar?`);
    if (!confirmed) {
        console.log('\nAbortado por el operador.\n');
        return;
    }

    // Borrado selectivo
    if (sectorFilter) {
        console.log(`\nBorrando embeddings previos del sector ${sectorFilter}...`);
        const { error: delError } = await supabase
            .from('chatbot_knowledge')
            .delete()
            .eq('metadata->>source', 'catalog_process')
            .eq('metadata->>landing_slug', sectorFilter);
        if (delError) console.error('Error borrando previos:', delError);
    } else {
        console.log('\nBorrando toda la knowledge base previa (catálogo + general)...');
        await supabase
            .from('chatbot_knowledge')
            .delete()
            .in('metadata->>source', ['catalog_process', 'general_knowledge']);
    }

    let ok = 0, ko = 0;
    for (const chunk of chunks) {
        const label = chunk.metadata.process_id || chunk.metadata.name || 'doc';
        try {
            const response = await fetch('https://api.openai.com/v1/embeddings', {
                method: 'POST',
                headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: EMBEDDING_MODEL, input: chunk.content }),
            });
            const result = await response.json();
            if (result.error) { console.error(`  ✗ ${label}: ${result.error.message}`); ko++; continue; }

            const { error: insError } = await supabase.from('chatbot_knowledge').insert({
                content: chunk.content,
                metadata: chunk.metadata,
                embedding: result.data[0].embedding,
            });
            if (insError) { console.error(`  ✗ ${label}: ${insError.message}`); ko++; }
            else { ok++; if (ok % 5 === 0) console.log(`  ✓ ${ok}/${chunks.length}`); }
        } catch (err) {
            console.error(`  ✗ ${label}: ${err.message}`); ko++;
        }
    }

    console.log(`\n--- Regeneración completada: ${ok} OK · ${ko} fallos ---\n`);
    if (ko > 0) process.exit(1);
}

generateEmbeddings();
