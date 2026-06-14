/**
 * SPEC-04 — Batería de tests de calidad de la knowledge base.
 *
 * Para cada pregunta del sector indicado, calcula el embedding, hace match
 * contra `match_chatbot_knowledge` y verifica que algún slug esperado
 * aparece en los resultados top.
 *
 * Uso:
 *   node scripts/test-knowledge-base.mjs --sector=salud
 *   node scripts/test-knowledge-base.mjs --sector=centros-deportivos --target=prod
 *   node scripts/test-knowledge-base.mjs                 # todos los sectores con batería
 *   node scripts/test-knowledge-base.mjs --verbose       # ver matches completos
 *
 * Umbral de aprobado: 90% (SPEC-04 CA-05).
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const isProd = process.argv.includes('--target=prod');
const verbose = process.argv.includes('--verbose');
const sectorFilter = process.argv.find(a => a.startsWith('--sector='))?.slice(9) || null;

const supabaseUrl = isProd
    ? process.env.PROD_SUPABASE_URL
    : (process.env.STAGING_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseKey = isProd
    ? process.env.PROD_SUPABASE_SERVICE_ROLE_KEY
    : (process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiKey) {
    console.error('Faltan variables de entorno');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const tests = JSON.parse(fs.readFileSync('./scripts/knowledge-base-tests.json', 'utf8'));
const THRESHOLD = tests._meta.threshold || 0.9;

const TOP_N = 5;
const SECTOR_THRESHOLD = 0.25;
const GLOBAL_THRESHOLD = 0.30;

async function embed(text) {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'text-embedding-3-small', input: text }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.data[0].embedding;
}

async function searchProcesses(question, sector) {
    const queryEmbedding = await embed(question);

    // Misma lógica que el motor: dos capas (sector + global)
    const { data: sectorDocs } = await supabase.rpc('match_chatbot_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: SECTOR_THRESHOLD,
        match_count: 3,
        sector_filter: sector,
    });
    const { data: globalDocs } = await supabase.rpc('match_chatbot_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: GLOBAL_THRESHOLD,
        match_count: 5,
    });
    const seen = new Set();
    const merged = [...(sectorDocs ?? []), ...(globalDocs ?? [])]
        .filter(d => { if (seen.has(d.id)) return false; seen.add(d.id); return true; })
        .slice(0, TOP_N);
    return merged.map(d => ({
        slug: d.metadata?.slug || '',
        name: d.metadata?.process_name || '',
        similarity: d.similarity,
    }));
}

function evaluate(test, results) {
    const topSlugs = results.map(r => r.slug);

    if (test.acceptedNoMatch) {
        // La pregunta NO tiene proceso aplicable: aceptamos si el top1 tiene similitud baja
        // (señal de que el bot deberá reconocer "no hay match" en su respuesta).
        // Aquí evaluamos solo que no haya un slug con similitud > 0.45 (matching falso fuerte).
        const strongMatch = results.find(r => r.similarity > 0.45);
        return { pass: !strongMatch, reason: strongMatch ? `falso positivo: ${strongMatch.slug} (${strongMatch.similarity.toFixed(2)})` : 'sin match fuerte (correcto)' };
    }

    if (test.mustNot?.some(s => topSlugs.includes(s))) {
        return { pass: false, reason: `aparece slug prohibido en top ${TOP_N}` };
    }

    const hit = test.expectedSlugs.find(s => topSlugs.includes(s));
    return {
        pass: !!hit,
        reason: hit ? `match con ${hit}` : `no encontró ninguno de [${test.expectedSlugs.join(', ')}] en top ${TOP_N}: [${topSlugs.join(', ')}]`,
    };
}

async function runSector(sector, items) {
    console.log(`\n═══ Sector: ${sector} (${items.length} preguntas) ═══`);
    let pass = 0, fail = 0;
    const failures = [];

    for (const test of items) {
        const results = await searchProcesses(test.question, sector);
        const verdict = evaluate(test, results);
        if (verdict.pass) { pass++; console.log(`  ✅ ${test.id}: ${verdict.reason}`); }
        else { fail++; console.log(`  ❌ ${test.id}: ${verdict.reason}`); failures.push({ test, results }); }
        if (verbose) {
            results.forEach(r => console.log(`       ${r.similarity.toFixed(3)} · ${r.slug}`));
        }
    }

    const rate = pass / items.length;
    const status = rate >= THRESHOLD ? '✅ APROBADO' : '❌ POR DEBAJO DEL UMBRAL';
    console.log(`\n  Resultado: ${pass}/${items.length} (${(rate * 100).toFixed(0)}%) — ${status} (umbral ${THRESHOLD * 100}%)`);
    return { sector, pass, fail, total: items.length, rate, failures };
}

async function main() {
    const sectorsToRun = sectorFilter
        ? [sectorFilter]
        : Object.keys(tests).filter(k => k !== '_meta');

    if (sectorFilter && !tests[sectorFilter]) {
        console.error(`No hay batería para "${sectorFilter}". Sectores disponibles: ${Object.keys(tests).filter(k => k !== '_meta').join(', ')}`);
        process.exit(1);
    }

    console.log(`\n🧪 Batería knowledge base v2 (SPEC-04) contra ${isProd ? 'PRODUCCIÓN' : 'STAGING'}`);
    console.log(`Umbral de aprobado: ${THRESHOLD * 100}%`);

    const reports = [];
    for (const sector of sectorsToRun) {
        const r = await runSector(sector, tests[sector]);
        reports.push(r);
    }

    console.log(`\n═══════════════════════════════════`);
    console.log('RESUMEN GLOBAL');
    console.log(`═══════════════════════════════════`);
    let allPass = true;
    for (const r of reports) {
        const status = r.rate >= THRESHOLD ? '✅' : '❌';
        console.log(`${status} ${r.sector}: ${r.pass}/${r.total} (${(r.rate * 100).toFixed(0)}%)`);
        if (r.rate < THRESHOLD) allPass = false;
    }
    console.log(`═══════════════════════════════════\n`);
    process.exit(allPass ? 0 : 1);
}

main().catch(err => { console.error('Error fatal:', err); process.exit(1); });
