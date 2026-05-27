import * as fs from 'fs';

const raw = fs.readFileSync('./src/data/processes.ts', 'utf8');

function parseAll(content) {
  const arrMatch = content.match(/export const processes: Process\[\] = \[([\s\S]*)\];/);
  if (!arrMatch) throw new Error('Array no encontrado');
  const arr = arrMatch[1];
  const entries = [];
  let pos = 0;
  while (pos < arr.length) {
    const startIdx = arr.indexOf('{', pos);
    if (startIdx === -1) break;
    let balance = 0, inStr = false, q = '', endIdx = startIdx;
    for (let i = startIdx; i < arr.length; i++) {
      const ch = arr[i];
      if ((ch === '"' || ch === "'" || ch === '`') && arr[i - 1] !== '\\') {
        if (!inStr) { inStr = true; q = ch; } else if (ch === q) inStr = false;
      }
      if (!inStr) {
        if (ch === '{') balance++;
        if (ch === '}') balance--;
        if (balance === 0) { endIdx = i; break; }
      }
    }
    const block = arr.substring(startIdx, endIdx + 1);
    pos = endIdx + 1;
    const idMatch = block.match(/^\s*\{\s*id:\s*"([^"]+)"/);
    if (!idMatch) continue;
    const getStr = (key) => {
      const m = block.match(new RegExp(`\\b${key}:\\s*["'\`]([^"'\`]*?)["'\`]`));
      return m ? m[1].trim() : null;
    };
    const id = idMatch[1];
    entries.push({
      id,
      codigo: getStr('codigo') || id,
      modulo_codigo: getStr('modulo_codigo'),
      landing_slug: getStr('landing_slug'),
      bloque_negocio: getStr('bloque_negocio'),
    });
  }
  return entries;
}

const procs = parseAll(raw);
console.log('Total procesos:', procs.length);

const mismatches = procs.filter(p => p.modulo_codigo && p.codigo !== p.modulo_codigo);
const withModulo = procs.filter(p => p.modulo_codigo);
const noModuloButLanding = procs.filter(p => p.landing_slug && p.bloque_negocio && !p.modulo_codigo);
const sameOk = procs.filter(p => p.modulo_codigo && p.codigo === p.modulo_codigo);

console.log('\n✅ codigo === modulo_codigo:', sameOk.length);
console.log('❌ Mismatches (codigo != modulo_codigo):', mismatches.length);
console.log('⚠️  Tienen landing_slug+bloque pero sin modulo_codigo:', noModuloButLanding.length);

if (mismatches.length > 0) {
  console.log('\nMISMATCHES:');
  for (const p of mismatches) {
    console.log('  ', p.id.padEnd(12), 'codigo:', String(p.codigo).padEnd(10), 'modulo_codigo:', p.modulo_codigo);
  }
}

if (noModuloButLanding.length > 0) {
  console.log('\nSIN modulo_codigo (con landing_slug + bloque_negocio):');
  for (const p of noModuloButLanding) {
    console.log('  ', p.id.padEnd(12), 'landing_slug:', String(p.landing_slug).padEnd(25), 'codigo:', p.codigo);
  }
}

// Summary by landing_slug
const bySector = {};
for (const p of procs) {
  if (!p.landing_slug) continue;
  if (!bySector[p.landing_slug]) bySector[p.landing_slug] = { ok: 0, mismatch: 0, noModulo: 0 };
  if (p.modulo_codigo && p.codigo === p.modulo_codigo) bySector[p.landing_slug].ok++;
  else if (p.modulo_codigo && p.codigo !== p.modulo_codigo) bySector[p.landing_slug].mismatch++;
  else if (!p.modulo_codigo) bySector[p.landing_slug].noModulo++;
}

console.log('\nPor sector:');
for (const [sector, stats] of Object.entries(bySector)) {
  console.log(`  ${sector.padEnd(30)} ok:${stats.ok} mismatch:${stats.mismatch} sin-modulo:${stats.noModulo}`);
}
