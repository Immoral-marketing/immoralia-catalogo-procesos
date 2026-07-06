/**
 * SPEC-06 — Sync TS↔Supabase reparado.
 *
 * REGLA OBLIGATORIA #1 del proyecto (CLAUDE.md): src/data/processes.ts manda en
 * CONTENIDO; Supabase manda en ASSETS generados (guion, vídeo, imágenes). Este
 * script envía solo las columnas de la whitelist; los campos de assets se
 * conservan intactos en BBDD por omisión del UPSERT.
 *
 * Uso:
 *   node scripts/sync_processes_to_supabase.mjs --verbose            # dry-run staging (legible)
 *   node scripts/sync_processes_to_supabase.mjs --apply              # aplica a staging
 *   node scripts/sync_processes_to_supabase.mjs --target=prod        # dry-run prod
 *   node scripts/sync_processes_to_supabase.mjs --target=prod --apply # aplica a prod (confirmación)
 *   node scripts/sync_processes_to_supabase.mjs --apply --delete-orphans
 *     # elimina filas de BBDD que ya no existen en TS (confirmación)
 *
 * Variables de entorno:
 *   STAGING_SUPABASE_URL + STAGING_SUPABASE_SERVICE_ROLE_KEY  (staging)
 *   PROD_SUPABASE_URL + PROD_SUPABASE_SERVICE_ROLE_KEY        (prod)
 *   Fallback (staging): NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as readline from 'readline';

dotenv.config();

// ─── Argumentos ─────────────────────────────────────────────
const isProd = process.argv.includes('--target=prod');
const apply = process.argv.includes('--apply');
const deleteOrphans = process.argv.includes('--delete-orphans');
const verbose = process.argv.includes('--verbose');

// ─── Variables de entorno por target ────────────────────────
function loadEnv() {
    if (isProd) {
        const url = process.env.PROD_SUPABASE_URL;
        const key = process.env.PROD_SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            console.error('❌ Faltan variables para target=prod:');
            if (!url) console.error('   - PROD_SUPABASE_URL');
            if (!key) console.error('   - PROD_SUPABASE_SERVICE_ROLE_KEY');
            process.exit(1);
        }
        return { url, key, label: 'PRODUCCIÓN' };
    }
    const url = process.env.STAGING_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
        console.error('❌ Faltan variables para target=staging:');
        if (!url) console.error('   - STAGING_SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL)');
        if (!key) console.error('   - STAGING_SUPABASE_SERVICE_ROLE_KEY (o SUPABASE_SERVICE_ROLE_KEY)');
        process.exit(1);
    }
    return { url, key, label: 'STAGING' };
}

const { url: SUPABASE_URL, key: SUPABASE_KEY, label: TARGET_LABEL } = loadEnv();
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Whitelist de columnas a sincronizar (CA-02) ────────────
// Estas son las columnas de la tabla `processes` que el TS posee como fuente
// de verdad. Los campos de assets (guion_*, video_*, image_*, imagenes_*) NO
// están en esta lista — Supabase los mantiene intactos.
// `categoria` y `categoriaNombre` están @deprecated y NO se envían (CA-03).
const SYNC_WHITELIST = [
    'id',
    'codigo',
    'slug',
    'nombre',
    'tagline',
    'descripcion_detallada',
    'pasos',
    'personalizacion',
    'sectores',
    'herramientas',
    'dolores',
    'canales',
    'integration_domains',
    'landing_slug',
    'bloque_negocio',
    'modulo_codigo',
    'recomendado',
    'catalog_active',
    // GEO — SPEC-22
    'descripcion_citable',
    'faqs_citables',
];

// Columnas que existen como array TEXT en Postgres (no jsonb)
const ARRAY_COLUMNS = new Set(['sectores', 'herramientas', 'dolores', 'canales', 'integration_domains']);

// ─── Confirmación interactiva ───────────────────────────────
function askConfirm(message) {
    return new Promise(resolve => {
        if (!process.stdin.isTTY) {
            // En CI/no-TTY, los flags --apply / --target=prod / --delete-orphans ya son
            // la autorización: doble paso explícito.
            console.log(`\n[Modo no interactivo — flags pasados como autorización] ${message} → continuando.`);
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

// ─── Parser de processes.ts ─────────────────────────────────
function parseProcessesFile() {
    const processesPath = './src/data/processes.ts';
    if (!fs.existsSync(processesPath)) {
        console.error('❌ No se encuentra src/data/processes.ts');
        process.exit(1);
    }
    const content = fs.readFileSync(processesPath, 'utf8');

    const processesArrayMatch = content.match(/export const processes: Process\[\] = \[([\s\S]*?)\];/);
    if (!processesArrayMatch) {
        console.error('❌ No se ha podido encontrar el array de procesos en el archivo.');
        process.exit(1);
    }
    const arrayContent = processesArrayMatch[1];

    // Balanceador de llaves para extraer cada objeto-proceso a nivel raíz.
    const blocks = [];
    let currentPos = 0;
    while (currentPos < arrayContent.length) {
        const startIdx = arrayContent.indexOf('{', currentPos);
        if (startIdx === -1) break;
        let endIdx = startIdx;
        let balance = 0;
        let inString = false;
        let quoteChar = '';
        for (let i = startIdx; i < arrayContent.length; i++) {
            const char = arrayContent[i];
            if ((char === '"' || char === "'" || char === '`') && arrayContent[i - 1] !== '\\') {
                if (!inString) { inString = true; quoteChar = char; }
                else if (char === quoteChar) { inString = false; }
            }
            if (!inString) {
                if (char === '{') balance++;
                if (char === '}') balance--;
                if (balance === 0) { endIdx = i; break; }
            }
        }
        blocks.push(arrayContent.substring(startIdx, endIdx + 1));
        currentPos = endIdx + 1;
    }
    return blocks;
}

// (?<![\w$]) impide que una key matchee dentro de otra que la contiene como
// sufijo (ej. `slug:` dentro de `landing_slug:`, `codigo:` dentro de
// `modulo_codigo:`). Sin este límite, el valor extraído depende del orden de
// los campos en el bloque TS y puede corromper la BBDD.
function extractValue(block, key) {
    const m = block.match(new RegExp(`(?<![\\w$])${key}:\\s*["'\`]([\\s\\S]*?)["'\`](?:,|\\s*})`));
    return m ? m[1] : null;
}

function extractArray(block, key) {
    const m = block.match(new RegExp(`(?<![\\w$])${key}:\\s*\\[([\\s\\S]*?)\\]`));
    if (!m) return null;
    return m[1]
        .split(',')
        .map(s => s.trim().replace(/^["'`]|["'`]$/g, ''))
        .filter(s => s !== '' && !s.startsWith('//'));
}

function extractBool(block, key) {
    const m = block.match(new RegExp(`(?<![\\w$])${key}:\\s*(true|false)`));
    return m ? m[1] === 'true' : null;
}

/**
 * Extrae un array de objetos { q, a } para faqs_citables (SPEC-22).
 * Usa balance de llaves para extraer cada { q: "...", a: "..." } del array.
 */
function extractQAObjectArray(block, key) {
    const keyMatch = block.match(new RegExp(`(?<![\\w$])${key}:`));
    if (!keyMatch) return null;
    const rest = block.slice(keyMatch.index + key.length + 1).trimStart();
    if (!rest.startsWith('[')) return null;

    // Encuentra el ] de cierre del array externo
    let depth = 0, end = -1;
    for (let i = 0; i < rest.length; i++) {
        const c = rest[i];
        if (c === '[' || c === '{') depth++;
        else if (c === ']' || c === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) return null;
    const arrayContent = rest.slice(1, end);

    // Extrae cada { ... } usando balance de llaves
    const objects = [];
    let od = 0, ostart = -1;
    for (let i = 0; i < arrayContent.length; i++) {
        if (arrayContent[i] === '{') { if (od === 0) ostart = i; od++; }
        else if (arrayContent[i] === '}') {
            od--;
            if (od === 0 && ostart !== -1) { objects.push(arrayContent.slice(ostart, i + 1)); ostart = -1; }
        }
    }

    const result = [];
    for (const obj of objects) {
        const q = extractValue(obj, 'q');
        const a = extractValue(obj, 'a');
        if (q !== null && a !== null) result.push({ q, a });
    }
    return result.length > 0 ? result : null;
}

/**
 * Convierte un bloque TS a un objeto listo para UPSERT respetando la whitelist
 * y el mapeo `hidden: true` → `catalog_active: false` (CA-05).
 */
function blockToRow(block) {
    const id = extractValue(block, 'id');
    if (!id) return null;

    const hidden = extractBool(block, 'hidden');
    const recomendado = extractBool(block, 'recomendado');

    const row = {
        id,
        codigo: extractValue(block, 'codigo') || id,
        slug: extractValue(block, 'slug'),
        nombre: extractValue(block, 'nombre'),
        tagline: extractValue(block, 'tagline'),
        descripcion_detallada: extractValue(block, 'descripcionDetallada'),
        pasos: extractArray(block, 'pasos') ?? [],
        personalizacion: extractValue(block, 'personalizacion'),
        sectores: extractArray(block, 'sectores') ?? [],
        herramientas: extractArray(block, 'herramientas') ?? [],
        dolores: extractArray(block, 'dolores') ?? [],
        canales: extractArray(block, 'canales') ?? [],
        integration_domains: extractArray(block, 'integration_domains') ?? [],
        landing_slug: extractValue(block, 'landing_slug'),
        bloque_negocio: extractValue(block, 'bloque_negocio'),
        modulo_codigo: extractValue(block, 'modulo_codigo'),
        recomendado: recomendado ?? false,
        catalog_active: hidden === true ? false : true,
        // GEO — SPEC-22
        descripcion_citable: extractValue(block, 'descripcion_citable') ?? null,
        faqs_citables: extractQAObjectArray(block, 'faqs_citables') ?? null,
    };

    // Filtrar a whitelist: cualquier campo extra que el parser haya recogido se descarta.
    // (Defensa en profundidad por si algún día se añade una clave nueva al objeto TS.)
    const filtered = {};
    for (const key of SYNC_WHITELIST) {
        if (row[key] !== undefined) filtered[key] = row[key];
    }
    return filtered;
}

// pasos es jsonb en BBDD: lo enviamos como array → @supabase/supabase-js lo serializa OK
// El resto de arrays son text[] nativos.

// ─── Flujo principal ────────────────────────────────────────
async function main() {
    console.log(`\n🚀 Sync TS → Supabase (${TARGET_LABEL})`);
    console.log(`   URL: ${SUPABASE_URL}`);
    console.log(`   Modo: ${apply ? 'APLICAR' : 'DRY-RUN'}${deleteOrphans ? ' + delete-orphans' : ''}`);

    // 1. Parsear processes.ts
    const blocks = parseProcessesFile();
    const tsRows = blocks.map(blockToRow).filter(Boolean);
    console.log(`\n📦 Encontrados ${tsRows.length} procesos en processes.ts.`);

    // 2. Leer estado actual de la BBDD (solo IDs para detectar inserts vs updates)
    const { data: existingRows, error: readError } = await supabase
        .from('processes')
        .select('id');
    if (readError) {
        console.error('❌ Error leyendo la tabla processes:', readError.message);
        process.exit(1);
    }
    const existingIds = new Set((existingRows ?? []).map(r => r.id));

    // 3. Calcular cambios
    const toInsert = tsRows.filter(r => !existingIds.has(r.id));
    const toUpdate = tsRows.filter(r => existingIds.has(r.id));
    const tsIds = new Set(tsRows.map(r => r.id));
    const orphans = [...existingIds].filter(id => !tsIds.has(id));

    console.log(`\n📊 Resumen:`);
    console.log(`   Insertar:  ${toInsert.length}`);
    console.log(`   Actualizar: ${toUpdate.length}`);
    console.log(`   Huérfanos en BBDD (en BBDD, no en TS): ${orphans.length}`);
    if (deleteOrphans) console.log(`   → Se borrarán ${orphans.length} huérfanos por --delete-orphans`);
    else if (orphans.length > 0) console.log(`   (No se borran sin --delete-orphans)`);

    if (verbose) {
        if (toInsert.length) console.log(`\n   Insertar:\n     ${toInsert.map(r => r.id + ' (' + r.slug + ')').join('\n     ')}`);
        if (toUpdate.length) console.log(`\n   Actualizar:\n     ${toUpdate.map(r => r.id + ' (' + r.slug + ')').join('\n     ')}`);
        if (orphans.length) console.log(`\n   Huérfanos:\n     ${orphans.join('\n     ')}`);
    }

    // 4. Modo dry-run
    if (!apply) {
        console.log(`\n[DRY-RUN] No se ha modificado nada. Añade --apply para ejecutar.\n`);
        return;
    }

    // 5. Confirmaciones para operaciones sensibles
    if (isProd) {
        const ok = await askConfirm(`Vas a sincronizar ${tsRows.length} procesos a PRODUCCIÓN. ¿Continuar?`);
        if (!ok) { console.log('\nAbortado por el operador.\n'); return; }
    }
    if (deleteOrphans && orphans.length > 0) {
        const ok = await askConfirm(`Vas a BORRAR ${orphans.length} procesos de ${TARGET_LABEL} (huérfanos). ¿Continuar?`);
        if (!ok) { console.log('\nAbortado por el operador.\n'); return; }
    }

    // 6. UPSERT
    let insertedOk = 0, insertedKo = 0, updatedOk = 0, updatedKo = 0;
    for (const row of tsRows) {
        const { error } = await supabase
            .from('processes')
            .upsert(row, { onConflict: 'id' });
        if (error) {
            const isInsert = !existingIds.has(row.id);
            console.error(`❌ ${row.id} (${row.slug}): ${error.message}`);
            if (isInsert) insertedKo++; else updatedKo++;
        } else {
            const isInsert = !existingIds.has(row.id);
            if (isInsert) insertedOk++; else updatedOk++;
        }
    }

    // 7. Delete orphans
    let deletedOk = 0, deletedKo = 0;
    if (deleteOrphans && orphans.length > 0) {
        for (const id of orphans) {
            const { error } = await supabase.from('processes').delete().eq('id', id);
            if (error) { console.error(`❌ delete ${id}: ${error.message}`); deletedKo++; }
            else deletedOk++;
        }
    }

    // 8. Reporte final
    console.log(`\n✅ Sincronización completada en ${TARGET_LABEL}:`);
    console.log(`   Insertados: ${insertedOk} OK · ${insertedKo} fallos`);
    console.log(`   Actualizados: ${updatedOk} OK · ${updatedKo} fallos`);
    if (deleteOrphans) console.log(`   Borrados: ${deletedOk} OK · ${deletedKo} fallos`);
    const totalFailures = insertedKo + updatedKo + deletedKo;
    console.log(`   Fallos totales: ${totalFailures}\n`);
    process.exit(totalFailures > 0 ? 1 : 0);
}

main().catch(err => {
    console.error('💥 Error inesperado:', err);
    process.exit(1);
});
