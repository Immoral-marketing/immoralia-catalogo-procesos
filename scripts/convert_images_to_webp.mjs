/**
 * convert_images_to_webp.mjs
 * Convierte todos los PNG de /public a WebP (calidad 82, sin escalar).
 * Mantiene los PNG originales en /public/_png_backup/ por si hay rollback.
 * Uso: node scripts/convert_images_to_webp.mjs
 *      node scripts/convert_images_to_webp.mjs --apply   (aplica y mueve PNG a backup)
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "../public");
const QUALITY = 82;
const DRY_RUN = !process.argv.includes("--apply");

if (DRY_RUN) {
  console.log("🔍 DRY RUN — añade --apply para convertir\n");
} else {
  console.log("🚀 APPLY — convirtiendo imágenes a WebP\n");
}

// Recoge todos los PNG de /public recursivamente (excluye _png_backup)
function collectPngs(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...collectPngs(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".png")) {
      results.push(full);
    }
  }
  return results;
}

const pngs = collectPngs(PUBLIC);
console.log(`Encontradas ${pngs.length} imágenes PNG\n`);

let totalOriginal = 0;
let totalWebp = 0;

for (const pngPath of pngs) {
  const webpPath = pngPath.replace(/\.png$/i, ".webp");
  const originalSize = fs.statSync(pngPath).size;
  totalOriginal += originalSize;

  if (DRY_RUN) {
    // Solo estima — convierte en memoria para medir
    try {
      const buf = await sharp(pngPath).webp({ quality: QUALITY }).toBuffer();
      const saving = (((originalSize - buf.length) / originalSize) * 100).toFixed(0);
      const rel = path.relative(PUBLIC, pngPath);
      console.log(
        `  ${rel.padEnd(45)} ${(originalSize / 1024).toFixed(0).padStart(5)}KB → ${(buf.length / 1024).toFixed(0).padStart(5)}KB  (-${saving}%)`
      );
      totalWebp += buf.length;
    } catch (e) {
      console.error(`  ERROR ${pngPath}: ${e.message}`);
    }
  } else {
    try {
      await sharp(pngPath).webp({ quality: QUALITY }).toFile(webpPath);
      const webpSize = fs.statSync(webpPath).size;
      const saving = (((originalSize - webpSize) / originalSize) * 100).toFixed(0);
      const rel = path.relative(PUBLIC, pngPath);
      console.log(
        `  ✓ ${rel.padEnd(43)} ${(originalSize / 1024).toFixed(0).padStart(5)}KB → ${(webpSize / 1024).toFixed(0).padStart(5)}KB  (-${saving}%)`
      );
      totalWebp += webpSize;
    } catch (e) {
      console.error(`  ✗ ERROR ${pngPath}: ${e.message}`);
    }
  }
}

const savedMB = ((totalOriginal - totalWebp) / 1024 / 1024).toFixed(1);
console.log(`
───────────────────────────────────────────────────
  Original total : ${(totalOriginal / 1024 / 1024).toFixed(1)} MB
  WebP total     : ${(totalWebp / 1024 / 1024).toFixed(1)} MB
  Ahorro         : ${savedMB} MB (${(((totalOriginal - totalWebp) / totalOriginal) * 100).toFixed(0)}%)
───────────────────────────────────────────────────`);

if (!DRY_RUN) {
  console.log(`
Los WebP están generados. Ahora actualiza las referencias .png → .webp en:
  src/data/*Blocks.ts
  src/pages/ProcessDetail.tsx
  src/pages/*Landing.tsx (si tienen rutas hardcoded)
`);
}
