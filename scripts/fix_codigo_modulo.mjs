/**
 * fix_codigo_modulo.mjs
 *
 * Asigna codigo y modulo_codigo en formato B.N a todos los procesos de sectores legacy.
 * La fuente de verdad para los números es el fichero de módulos de cada sector
 * (slug → modulo_codigo). Procesos extra sin módulo reciben números secuenciales
 * a continuación del último módulo de su bloque.
 *
 * Sectores afectados: gestorias, construccion, centros-deportivos
 *
 * Uso:
 *   node scripts/fix_codigo_modulo.mjs          # dry-run
 *   node scripts/fix_codigo_modulo.mjs --apply  # modifica processes.ts
 */

import * as fs from 'fs';

const APPLY = process.argv.includes('--apply');
const PROCESSES_FILE = './src/data/processes.ts';

// ─── 1. PARSEAR MÓDULOS FILES → slug : modulo_codigo ──────────────────────
function parseModulesFile(path) {
  const content = fs.readFileSync(path, 'utf8');
  const map = new Map(); // slug → codigo
  // Extraer pares codigo + linkedProcessSlug del array de módulos
  const entries = [...content.matchAll(/codigo:\s*"([^"]+)"[^}]*?linkedProcessSlug:\s*"([^"]+)"/gs)];
  for (const [, codigo, slug] of entries) {
    map.set(slug, codigo);
  }
  return map;
}

const slugToModulo = new Map(); // slug → modulo_codigo (across all sectors)

const moduleFiles = [
  './src/data/gestoriasModules.ts',
  './src/data/construccionModules.ts',
  './src/data/centrosDeportivosModules.ts',
];

for (const f of moduleFiles) {
  const m = parseModulesFile(f);
  for (const [slug, codigo] of m) {
    slugToModulo.set(slug, codigo);
  }
}

console.log(`\n📦 Módulos cargados: ${slugToModulo.size} slugs mapeados\n`);

// ─── 2. PARSEAR processes.ts ───────────────────────────────────────────────
const raw = fs.readFileSync(PROCESSES_FILE, 'utf8');

function parseAll(content) {
  const arrMatch = content.match(/export const processes: Process\[\] = \[([\s\S]*)\];/);
  if (!arrMatch) throw new Error('Array de procesos no encontrado');
  const arr = arrMatch[1];

  const entries = [];
  let pos = 0;
  while (pos < arr.length) {
    const startIdx = arr.indexOf('{', pos);
    if (startIdx === -1) break;

    let balance = 0, inStr = false, q = '';
    let endIdx = startIdx;
    for (let i = startIdx; i < arr.length; i++) {
      const ch = arr[i];
      if ((ch === '"' || ch === "'" || ch === '`') && arr[i - 1] !== '\\') {
        if (!inStr) { inStr = true; q = ch; }
        else if (ch === q) inStr = false;
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
      slug: getStr('slug'),
      modulo_codigo: getStr('modulo_codigo'),
      landing_slug: getStr('landing_slug'),
      bloque_negocio: getStr('bloque_negocio'),
    });
  }
  return entries;
}

const processes = parseAll(raw);
console.log(`📖 ${processes.length} procesos parseados\n`);

// ─── 3. DETERMINAR CAMBIOS ─────────────────────────────────────────────────
const TARGET_SECTORS = new Set(['gestorias', 'construccion', 'centros-deportivos']);

// Primero, para cada (sector, bloque), encontrar el máximo numero ya asignado
// por los módulos (para poder continuar desde ahí con los procesos extra)
const maxInBloque = new Map(); // "sector|bloque" → max_number

for (const p of processes) {
  if (!TARGET_SECTORS.has(p.landing_slug) || !p.bloque_negocio) continue;
  const mappedCodigo = p.slug ? slugToModulo.get(p.slug) : null;
  if (mappedCodigo) {
    const key = `${p.landing_slug}|${p.bloque_negocio}`;
    const num = parseFloat(mappedCodigo.split('.')[1] || '0');
    const current = maxInBloque.get(key) ?? 0;
    if (num > current) maxInBloque.set(key, num);
  }
}

// Contador para procesos extra (sin módulo asignado)
const extraCounter = new Map(); // "sector|bloque" → next_number

const changes = [];

for (const p of processes) {
  if (!TARGET_SECTORS.has(p.landing_slug) || !p.bloque_negocio) continue;
  if (p.codigo !== p.id) continue; // ya tiene codigo explícito distinto del id — saltar

  const bloqueNum = p.bloque_negocio.replace('B', '');
  let newCodigo;

  if (p.slug && slugToModulo.has(p.slug)) {
    // Proceso que tiene módulo definido → usa el número del módulo
    newCodigo = slugToModulo.get(p.slug);
  } else {
    // Proceso extra sin módulo → asignar número secuencial después del max
    const key = `${p.landing_slug}|${p.bloque_negocio}`;
    const maxMod = maxInBloque.get(key) ?? 0;
    const prevExtra = extraCounter.get(key) ?? 0;
    const nextNum = maxMod + prevExtra + 1;
    extraCounter.set(key, prevExtra + 1);
    newCodigo = `${bloqueNum}.${nextNum}`;
  }

  changes.push({
    id: p.id,
    landing_slug: p.landing_slug,
    bloque_negocio: p.bloque_negocio,
    slug: p.slug,
    old_codigo: p.codigo,
    old_modulo: p.modulo_codigo,
    new_codigo: newCodigo,
  });
}

// ─── 4. IMPRIMIR RESUMEN ───────────────────────────────────────────────────
console.log(`✏️  ${changes.length} procesos a actualizar:\n`);

const bySector = {};
for (const c of changes) {
  if (!bySector[c.landing_slug]) bySector[c.landing_slug] = [];
  bySector[c.landing_slug].push(c);
}

for (const [sector, list] of Object.entries(bySector)) {
  // ordenar por nuevo codigo para legibilidad
  list.sort((a, b) => {
    const [ab, an] = a.new_codigo.split('.').map(Number);
    const [bb, bn] = b.new_codigo.split('.').map(Number);
    return ab !== bb ? ab - bb : an - bn;
  });
  console.log(`  ${sector} (${list.length}):`);
  for (const c of list) {
    const moduloNote = c.old_modulo
      ? `modulo_codigo: "${c.old_modulo}" → "${c.new_codigo}"`
      : `modulo_codigo: null → "${c.new_codigo}"`;
    const source = c.slug && slugToModulo.has(c.slug) ? '(módulo)' : '(extra)';
    console.log(`    ${c.id.padEnd(10)} → codigo: "${c.old_codigo.padEnd(8)}" → "${c.new_codigo.padEnd(5)}"  ${moduloNote}  ${source}`);
  }
  console.log('');
}

if (!APPLY) {
  console.log('🟢 DRY-RUN — no se ha modificado nada. Añade --apply para ejecutar.\n');
  process.exit(0);
}

// ─── 5. APLICAR CAMBIOS EN processes.ts ───────────────────────────────────
let modified = raw;

for (const c of changes) {
  // 5a. Cambiar codigo: buscar la ocurrencia ÚNICA de `codigo: "OLD_ID"` en el contexto del proceso
  // Usamos el id del proceso como ancla para localizar el bloque correcto
  const codigoRegex = new RegExp(
    `(id:\\s*"${escapeRe(c.id)}"[\\s\\S]{0,500}?)\\bcodigo:\\s*"${escapeRe(c.old_codigo)}"`,
    'm'
  );
  if (codigoRegex.test(modified)) {
    modified = modified.replace(codigoRegex, (match, pre) =>
      `${pre}codigo: "${c.new_codigo}"`
    );
  } else {
    // Fallback: reemplazar si es único
    const fallback = new RegExp(`\\bcodigo:\\s*"${escapeRe(c.old_codigo)}"`, 'g');
    const hits = [...modified.matchAll(fallback)];
    if (hits.length === 1) {
      modified = modified.replace(fallback, `codigo: "${c.new_codigo}"`);
    } else {
      console.warn(`⚠️  ${c.id}: no se pudo reemplazar codigo (${hits.length} coincidencias)`);
    }
  }

  // 5b. Actualizar o insertar modulo_codigo
  const moduloExistsRegex = new RegExp(
    `(id:\\s*"${escapeRe(c.id)}"[\\s\\S]{0,500}?)\\bmodulo_codigo:\\s*(?:null|"[^"]*")`,
    'm'
  );
  if (moduloExistsRegex.test(modified)) {
    modified = modified.replace(moduloExistsRegex, (match, pre) =>
      `${pre}modulo_codigo: "${c.new_codigo}"`
    );
  } else {
    // Insertar después de bloque_negocio
    const insertRegex = new RegExp(
      `(id:\\s*"${escapeRe(c.id)}"[\\s\\S]{0,500}?)(\\bbloque_negocio:\\s*"[^"]*")(,?)`,
      'm'
    );
    if (insertRegex.test(modified)) {
      modified = modified.replace(insertRegex, (match, pre, bloqueField, comma) =>
        `${pre}${bloqueField},\n    modulo_codigo: "${c.new_codigo}"`
      );
    } else {
      console.warn(`⚠️  ${c.id}: no se encontró bloque_negocio para insertar modulo_codigo`);
    }
  }
}

fs.writeFileSync(PROCESSES_FILE, modified, 'utf8');
console.log(`\n✅ processes.ts actualizado con ${changes.length} cambios.\n`);

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
