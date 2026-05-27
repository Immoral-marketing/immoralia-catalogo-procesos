/**
 * sync_processes_to_supabase.v2.mjs
 *
 * Sincroniza procesos desde src/data/processes.ts → tabla `processes` de Supabase.
 *
 * REGLAS:
 *   1. processes.ts es FUENTE DE VERDAD para campos de CONTENIDO.
 *   2. Supabase es FUENTE DE VERDAD para campos de ASSETS (guion, video, image_*).
 *   3. El script SOLO toca campos en la whitelist SYNCABLE_FIELDS.
 *      Cualquier columna fuera de esa lista queda intacta en BD.
 *
 * MODOS:
 *   --target=staging|prod    (default: staging)
 *   --apply                  (default: false → dry-run)
 *   --delete-orphans         (default: false → solo reporta, no borra)
 *   --verbose                (default: false → solo summary)
 *
 * EJEMPLOS:
 *   node scripts/sync_processes_to_supabase.v2.mjs                           # dry-run staging
 *   node scripts/sync_processes_to_supabase.v2.mjs --verbose                 # dry-run con diffs
 *   node scripts/sync_processes_to_supabase.v2.mjs --apply                   # aplica a staging (sin borrar)
 *   node scripts/sync_processes_to_supabase.v2.mjs --apply --delete-orphans  # aplica y borra huérfanos
 *   node scripts/sync_processes_to_supabase.v2.mjs --target=prod --apply     # aplica a prod
 *
 * .env esperado:
 *   STAGING_SUPABASE_URL, STAGING_SUPABASE_SERVICE_KEY
 *   PROD_SUPABASE_URL, PROD_SUPABASE_SERVICE_KEY
 *   (fallback: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

// ============================================================================
// CLI ARGS
// ============================================================================
const args = process.argv.slice(2);
const TARGET = (args.find(a => a.startsWith('--target='))?.split('=')[1]) || 'staging';
const APPLY = args.includes('--apply');
const DELETE_ORPHANS = args.includes('--delete-orphans');
const VERBOSE = args.includes('--verbose');

if (!['staging', 'prod'].includes(TARGET)) {
  console.error('❌ --target debe ser "staging" o "prod"');
  process.exit(1);
}

// ============================================================================
// WHITELIST — solo estos campos se sincronizan
// ============================================================================
const SYNCABLE_FIELDS = [
  'id',
  'codigo',
  'slug',
  'nombre',
  'tagline',
  'recomendado',
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
  'catalog_active', // mapeado desde hidden:true → catalog_active:false
];

// Campos PRESERVADOS (nunca se tocan, viven solo en BD):
//   guion_generado, guion_clickup_url, guion_generado_at,
//   video_generado, video_remotion_url, video_generado_at,
//   image_url_1/2/3, image_subtitle_1/2/3,
//   imagenes_generadas, imagenes_generadas_at,
//   Asignación, created_at, sector (singular legacy)

// ============================================================================
// CONFIG SUPABASE POR TARGET
// ============================================================================
const envMap = {
  staging: {
    url: process.env.STAGING_SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    key: process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  prod: {
    url: process.env.PROD_SUPABASE_URL,
    key: process.env.PROD_SUPABASE_SERVICE_ROLE_KEY,
  },
};

const { url: supabaseUrl, key: supabaseKey } = envMap[TARGET];

if (!supabaseUrl || !supabaseKey) {
  console.error(`❌ Faltan env vars para target=${TARGET}.`);
  console.error(`   Esperaba: ${TARGET.toUpperCase()}_SUPABASE_URL y ${TARGET.toUpperCase()}_SUPABASE_SERVICE_KEY`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// PARSER DE processes.ts
// ============================================================================
function parseProcessesFile(path) {
  const content = fs.readFileSync(path, 'utf8');
  const arrMatch = content.match(/export const processes: Process\[\] = \[([\s\S]*?)\];/);
  if (!arrMatch) {
    throw new Error('No se encuentra "export const processes" en el fichero.');
  }
  const arrContent = arrMatch[1];

  const parsed = [];
  let pos = 0;
  while (pos < arrContent.length) {
    const startIdx = arrContent.indexOf('{', pos);
    if (startIdx === -1) break;

    let balance = 0;
    let inStr = false;
    let q = '';
    let endIdx = startIdx;
    for (let i = startIdx; i < arrContent.length; i++) {
      const ch = arrContent[i];
      if ((ch === '"' || ch === "'" || ch === '`') && arrContent[i - 1] !== '\\') {
        if (!inStr) {
          inStr = true;
          q = ch;
        } else if (ch === q) {
          inStr = false;
        }
      }
      if (!inStr) {
        if (ch === '{') balance++;
        if (ch === '}') balance--;
        if (balance === 0) {
          endIdx = i;
          break;
        }
      }
    }
    const block = arrContent.substring(startIdx, endIdx + 1);
    pos = endIdx + 1;

    // Solo extraer si es proceso de primer nivel (no objeto anidado dentro de otro proceso)
    const idMatch = block.match(/^\s*\{\s*id:\s*"([^"]+)"/);
    if (!idMatch) continue;

    const getStr = (key) => {
      const m = block.match(new RegExp(`\\b${key}:\\s*["'\`]([\\s\\S]*?)["'\`](?:,|\\s*\\})`));
      return m ? m[1].trim() : null;
    };
    const getBool = (key) => {
      const m = block.match(new RegExp(`\\b${key}:\\s*(true|false)`));
      return m ? m[1] === 'true' : null;
    };
    const getArr = (key) => {
      const m = block.match(new RegExp(`\\b${key}:\\s*\\[([\\s\\S]*?)\\]`));
      if (!m) return null;
      return m[1]
        .split(',')
        .map(s => s.trim().replace(/^["'`]|["'`]$/g, ''))
        .filter(s => s !== '' && !s.startsWith('//'));
    };

    const id = getStr('id');
    if (!id) continue;

    const hidden = getBool('hidden');
    const obj = {
      id,
      codigo: getStr('codigo') || id,
      slug: getStr('slug'),
      categoria: getStr('categoria'),
      categoria_nombre: getStr('categoriaNombre'),
      nombre: getStr('nombre'),
      tagline: getStr('tagline'),
      recomendado: getBool('recomendado') ?? false,
      descripcion_detallada: getStr('descripcionDetallada') || getStr('tagline'),
      pasos: getArr('pasos') ?? [],
      personalizacion: getStr('personalizacion'),
      sectores: getArr('sectores') ?? [],
      herramientas: getArr('herramientas') ?? [],
      dolores: getArr('dolores') ?? [],
      canales: getArr('canales') ?? [],
      integration_domains: getArr('integration_domains') ?? [],
      landing_slug: getStr('landing_slug'),
      bloque_negocio: getStr('bloque_negocio'),
      modulo_codigo: getStr('modulo_codigo'),
      catalog_active: hidden === true ? false : true, // hidden:true → catalog_active:false
    };

    parsed.push(obj);
  }

  return parsed;
}

// ============================================================================
// DIFF ENGINE
// ============================================================================
function diffProcesses(localProcs, remoteProcs) {
  const remoteById = new Map(remoteProcs.map(p => [p.id, p]));
  const localById = new Map(localProcs.map(p => [p.id, p]));

  const toInsert = [];
  const toUpdate = [];
  const orphans = [];

  for (const local of localProcs) {
    const remote = remoteById.get(local.id);
    if (!remote) {
      toInsert.push(local);
    } else {
      // Detectar campos cambiados (solo en whitelist)
      const changedFields = [];
      for (const f of SYNCABLE_FIELDS) {
        if (f === 'id') continue;
        const lv = local[f];
        const rv = remote[f];
        if (!deepEqual(lv, rv)) {
          changedFields.push({ field: f, from: rv, to: lv });
        }
      }
      if (changedFields.length > 0) {
        toUpdate.push({ id: local.id, slug: local.slug, nombre: local.nombre, changes: changedFields, payload: local });
      }
    }
  }

  for (const remote of remoteProcs) {
    if (!localById.has(remote.id)) {
      orphans.push(remote);
    }
  }

  return { toInsert, toUpdate, orphans };
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}

// ============================================================================
// MAIN
// ============================================================================
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  SYNC PROCESSES → Supabase ${TARGET.toUpperCase()}`);
  console.log(`  Modo: ${APPLY ? '🔴 APPLY' : '🟢 DRY-RUN'}${DELETE_ORPHANS ? ' + DELETE-ORPHANS' : ''}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Parsear processes.ts
  console.log('📖 Leyendo src/data/processes.ts ...');
  const local = parseProcessesFile('./src/data/processes.ts');
  console.log(`   ✓ ${local.length} procesos en código\n`);

  // 2. Leer Supabase (solo campos relevantes para diff)
  console.log(`📡 Leyendo Supabase ${TARGET} ...`);
  const remoteFields = SYNCABLE_FIELDS.join(', ');
  const { data: remote, error } = await supabase
    .from('processes')
    .select(remoteFields);
  if (error) {
    console.error('❌ Error leyendo BD:', error.message);
    process.exit(1);
  }
  console.log(`   ✓ ${remote.length} procesos en BD\n`);

  // 3. Diff
  const { toInsert, toUpdate, orphans } = diffProcesses(local, remote);

  console.log('───────────────────────────────────────────────────────────────');
  console.log('  RESUMEN DEL DIFF');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  📥 INSERT (nuevos en código):  ${toInsert.length}`);
  console.log(`  ✏️  UPDATE (cambios):           ${toUpdate.length}`);
  console.log(`  🗑  ORPHANS (en BD, no en código): ${orphans.length}`);
  console.log('───────────────────────────────────────────────────────────────\n');

  // 4. Detalle
  if (toInsert.length > 0) {
    console.log('📥 INSERTs:');
    for (const p of toInsert) console.log(`   + ${p.id.padEnd(15)} ${p.slug}`);
    console.log('');
  }

  if (toUpdate.length > 0) {
    console.log(`✏️  UPDATEs${VERBOSE ? '' : ' (resumen — usa --verbose para detalle)'}:`);
    for (const u of toUpdate) {
      console.log(`   ~ ${u.id.padEnd(15)} ${u.nombre?.slice(0, 50) || u.slug} (${u.changes.length} campos)`);
      if (VERBOSE) {
        for (const c of u.changes) {
          const from = JSON.stringify(c.from)?.slice(0, 60) ?? 'null';
          const to = JSON.stringify(c.to)?.slice(0, 60) ?? 'null';
          console.log(`       · ${c.field}: ${from}  →  ${to}`);
        }
      }
    }
    console.log('');
  }

  if (orphans.length > 0) {
    console.log(`🗑  ORPHANS${DELETE_ORPHANS ? ' (SE BORRARÁN)' : ' (NO se borran sin --delete-orphans)'}:`);
    for (const o of orphans) {
      console.log(`   − ${o.id.padEnd(15)} ${o.slug}`);
    }
    console.log('');
  }

  // 5. Apply
  if (!APPLY) {
    console.log('🟢 DRY-RUN — no se ha escrito nada. Usa --apply para ejecutar.\n');
    return;
  }

  console.log('🔴 APPLY — escribiendo cambios ...\n');

  // INSERTs + UPDATEs en un solo UPSERT
  // Filtrar payload a solo SYNCABLE_FIELDS (evita enviar campos eliminados de la BD)
  const filterPayload = (p) => Object.fromEntries(
    SYNCABLE_FIELDS.map(f => [f, p[f]])
  );

  const toUpsert = [...toInsert, ...toUpdate.map(u => u.payload)];
  if (toUpsert.length > 0) {
    let ok = 0, ko = 0;
    for (const p of toUpsert) {
      const { error: upErr } = await supabase
        .from('processes')
        .upsert(filterPayload(p), { onConflict: 'id' });
      if (upErr) {
        console.error(`   ❌ ${p.id}: ${upErr.message}`);
        ko++;
      } else {
        ok++;
      }
    }
    console.log(`   UPSERT: ${ok} ok, ${ko} fallidos\n`);
  }

  // DELETEs solo si --delete-orphans
  if (DELETE_ORPHANS && orphans.length > 0) {
    const ids = orphans.map(o => o.id);
    const { error: delErr } = await supabase
      .from('processes')
      .delete()
      .in('id', ids);
    if (delErr) {
      console.error(`   ❌ DELETE fallido: ${delErr.message}`);
    } else {
      console.log(`   DELETE: ${ids.length} procesos eliminados`);
    }
  } else if (orphans.length > 0) {
    console.log(`   ⚠️  ${orphans.length} huérfanos en BD NO se han borrado (falta --delete-orphans).`);
  }

  console.log('\n✅ Sincronización completada.');
}

main().catch(err => {
  console.error('💥 Error inesperado:', err);
  process.exit(1);
});
