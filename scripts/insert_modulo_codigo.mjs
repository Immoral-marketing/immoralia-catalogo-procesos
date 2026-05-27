/**
 * insert_modulo_codigo.mjs
 *
 * Paso 2 del fix: inserta o corrige modulo_codigo en los procesos que aún no lo tienen,
 * usando el mapeo slug→modulo_codigo de los ficheros de módulos.
 *
 * Uso: node scripts/insert_modulo_codigo.mjs --apply
 */

import * as fs from 'fs';

const APPLY = process.argv.includes('--apply');
const FILE = './src/data/processes.ts';

// ─── 1. MAPA slug → modulo_codigo desde módulos ─────────────────────────────
function parseModulesFile(path) {
  const content = fs.readFileSync(path, 'utf8');
  const map = new Map();
  const entries = [...content.matchAll(/codigo:\s*"([^"]+)"[^}]*?linkedProcessSlug:\s*"([^"]+)"/gs)];
  for (const [, codigo, slug] of entries) map.set(slug, codigo);
  return map;
}

const slugToModulo = new Map();
for (const f of [
  './src/data/gestoriasModules.ts',
  './src/data/construccionModules.ts',
  './src/data/centrosDeportivosModules.ts',
]) {
  for (const [s, c] of parseModulesFile(f)) slugToModulo.set(s, c);
}

// Mapa manual para extras sin módulo (generado por fix_codigo_modulo.mjs)
const EXTRA_MODULOS = new Map([
  ['AC26', '3.10'], // centros-deportivos B3 extra
]);

// ─── 2. PARSEAR processes.ts — obtener bloques con índices exactos ───────────
const raw = fs.readFileSync(FILE, 'utf8');

function parseBlocks(content) {
  const arrMatch = content.match(/export const processes: Process\[\] = \[([\s\S]*)\];/);
  if (!arrMatch) throw new Error('Array no encontrado');
  const arr = arrMatch[1];
  const offset = arrMatch.index + 'export const processes: Process[] = ['.length;

  const blocks = [];
  let pos = 0;
  while (pos < arr.length) {
    const startRel = arr.indexOf('{', pos);
    if (startRel === -1) break;

    let balance = 0, inStr = false, q = '', endRel = startRel;
    for (let i = startRel; i < arr.length; i++) {
      const ch = arr[i];
      if ((ch === '"' || ch === "'" || ch === '`') && arr[i - 1] !== '\\') {
        if (!inStr) { inStr = true; q = ch; } else if (ch === q) inStr = false;
      }
      if (!inStr) {
        if (ch === '{') balance++;
        if (ch === '}') balance--;
        if (balance === 0) { endRel = i; break; }
      }
    }

    const blockText = arr.substring(startRel, endRel + 1);
    pos = endRel + 1;

    const idMatch = blockText.match(/^\s*\{\s*id:\s*"([^"]+)"/);
    if (!idMatch) continue;

    const getStr = (key) => {
      const m = blockText.match(new RegExp(`\\b${key}:\\s*["'\`]([^"'\`]*?)["'\`]`));
      return m ? m[1].trim() : null;
    };

    blocks.push({
      id: idMatch[1],
      slug: getStr('slug'),
      landing_slug: getStr('landing_slug'),
      bloque_negocio: getStr('bloque_negocio'),
      modulo_codigo: getStr('modulo_codigo'),
      startAbs: offset + startRel,
      endAbs: offset + endRel,
      text: blockText,
    });
  }
  return blocks;
}

const blocks = parseBlocks(raw);
console.log(`📖 ${blocks.length} bloques parseados\n`);

// ─── 3. DETERMINAR QUÉ NECESITA modulo_codigo ───────────────────────────────
const TARGET = new Set(['gestorias', 'construccion', 'centros-deportivos']);

const toFix = [];
for (const b of blocks) {
  if (!TARGET.has(b.landing_slug) || !b.bloque_negocio) continue;
  if (b.modulo_codigo) continue; // ya tiene

  // Obtener el valor correcto
  let newModulo;
  if (b.slug && slugToModulo.has(b.slug)) {
    newModulo = slugToModulo.get(b.slug);
  } else if (EXTRA_MODULOS.has(b.id)) {
    newModulo = EXTRA_MODULOS.get(b.id);
  } else {
    console.warn(`⚠️  ${b.id}: sin modulo en mapa ni en EXTRA_MODULOS`);
    continue;
  }

  toFix.push({ ...b, newModulo });
}

console.log(`✏️  ${toFix.length} procesos necesitan modulo_codigo:\n`);
for (const p of toFix) {
  console.log(`   ${p.id.padEnd(12)} → modulo_codigo: "${p.newModulo}"`);
}

if (!APPLY) {
  console.log('\n🟢 DRY-RUN. Añade --apply para ejecutar.\n');
  process.exit(0);
}

// ─── 4. APLICAR — insertar modulo_codigo después de bloque_negocio ──────────
// Procesamos de ATRÁS para adelante para no invalidar índices
toFix.sort((a, b) => b.startAbs - a.startAbs);

let modified = raw;

for (const p of toFix) {
  // Dentro del bloque textual, insertar después de bloque_negocio
  const blockInFile = modified.substring(p.startAbs, p.endAbs + 1);

  // Encontrar la línea de bloque_negocio dentro del bloque
  const bnMatch = blockInFile.match(/(\s*bloque_negocio:\s*"[^"]*")(,?)/);
  if (!bnMatch) {
    console.warn(`⚠️  ${p.id}: no se encontró bloque_negocio en el bloque`);
    continue;
  }

  // Insertar modulo_codigo después de bloque_negocio
  const insertPos = blockInFile.indexOf(bnMatch[0]) + bnMatch[0].length;
  const indent = (bnMatch[1].match(/^(\s+)/) || ['', '    '])[1]; // detectar indentación

  const insertion = `,\n${indent}modulo_codigo: "${p.newModulo}"`;
  // Si ya hay coma al final de bloque_negocio, no añadir otra
  const lineEndCh = blockInFile[insertPos];
  const insertStr = lineEndCh === ',' ? `\n${indent}modulo_codigo: "${p.newModulo}"` : insertion;

  const newBlock = blockInFile.substring(0, insertPos) + insertStr + blockInFile.substring(insertPos);
  modified = modified.substring(0, p.startAbs) + newBlock + modified.substring(p.endAbs + 1);
}

fs.writeFileSync(FILE, modified, 'utf8');
console.log(`\n✅ modulo_codigo insertado en ${toFix.length} procesos.\n`);
