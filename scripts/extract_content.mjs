/**
 * SPEC-04 — Extracción de contenido para la knowledge base v2.
 *
 * Cambios respecto a v1 (versión anterior):
 *  - El documento embebido empieza con los DOLORES (vocabulario del cliente)
 *    porque es la señal con más peso en el matching semántico.
 *  - Estructura del documento más clara y consistente para que la búsqueda
 *    encuentre el proceso correcto incluso con preguntas coloquiales.
 *  - Sin secciones vacías («No especificado», «Configurable según...») que
 *    introducían ruido y no aportaban señal — se omiten.
 *  - Procesos universales (sin landing_slug) usan `sectores` para etiqueta.
 *
 * Filtra por --sector=<slug> para regenerar solo un sector durante la
 * revisión editorial por lotes.
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const isProd = process.argv.includes('--target=prod');
const sectorFilter = process.argv.find(a => a.startsWith('--sector='))?.slice(9) || null;

const supabaseUrl = isProd
    ? process.env.PROD_SUPABASE_URL
    : (process.env.STAGING_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL);
const supabaseKey = isProd
    ? process.env.PROD_SUPABASE_SERVICE_ROLE_KEY
    : (process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

if (!supabaseUrl || !supabaseKey) {
    console.error(`Faltan variables de entorno para target=${isProd ? 'prod' : 'staging'}`);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SECTOR_NAMES = {
    'centros-deportivos': 'Centros Deportivos',
    'gestorias': 'Gestorías',
    'salud': 'Centros de Salud',
    'construccion': 'Construcción & Inmobiliaria',
    'academias': 'Academias y Formación',
    'gastronomia-hosteleria': 'Gastronomía y Hostelería',
    'industrial': 'Industrial',
    'agencias': 'Agencias',
    'ecommerce': 'E-commerce',
    'desarrolladoras': 'Desarrolladoras',
};

function toArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string') {
        try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed.filter(Boolean) : []; }
        catch { return [value]; }
    }
    return [];
}

/**
 * Construye el documento que se embebe — plantilla v2 (SPEC-04).
 * Orden y secciones diseñados para que el matching semántico priorice
 * el VOCABULARIO DEL CLIENTE (dolores) sobre el técnico.
 */
function buildDocument(p) {
    const sectorName = p.landing_slug ? (SECTOR_NAMES[p.landing_slug] || p.landing_slug) : null;
    const universalSectors = toArray(p.sectores);
    const sectorLine = sectorName
        ? `Sector: ${sectorName}`
        : (universalSectors.length ? `Sectores donde aplica: ${universalSectors.join(', ')}` : 'Aplicable a cualquier sector');

    const dolores = toArray(p.dolores);
    const pasos = toArray(p.pasos);
    const herramientas = toArray(p.herramientas);
    const canales = toArray(p.canales);

    const sections = [];

    // 1. Cabecera mínima (señal de identidad — sector + nombre)
    sections.push(`# ${p.nombre}`);
    sections.push(sectorLine);
    if (p.tagline) sections.push(p.tagline);

    // 2. DOLORES PRIMERO — vocabulario del cliente (máximo peso semántico)
    if (dolores.length > 0) {
        sections.push('\n## Problemas que resuelve (en palabras del cliente)');
        sections.push(dolores.map(d => `- ${d}`).join('\n'));
    }

    // 3. Descripción detallada (qué hace y cómo)
    if (p.descripcion_detallada) {
        sections.push('\n## Qué hace este proceso');
        sections.push(p.descripcion_detallada);
    }

    // 4. Pasos (cómo funciona)
    if (pasos.length > 0) {
        sections.push('\n## Cómo funciona');
        sections.push(pasos.map((paso, i) => `${i + 1}. ${paso}`).join('\n'));
    }

    // 5. Personalización (solo si aporta señal)
    if (p.personalizacion && p.personalizacion.trim().length > 20) {
        sections.push('\n## Personalización');
        sections.push(p.personalizacion);
    }

    // 6. Integraciones (solo si hay datos reales)
    if (herramientas.length > 0) {
        sections.push('\n## Herramientas con las que se integra');
        sections.push(herramientas.join(', '));
    }
    if (canales.length > 0) {
        sections.push('\n## Canales');
        sections.push(canales.join(', '));
    }

    return sections.join('\n').trim();
}

async function extractProcesses() {
    console.log('--- Extrayendo procesos (plantilla v2 — SPEC-04) ---');
    if (sectorFilter) console.log(`Filtro de sector: ${sectorFilter}`);

    let query = supabase
        .from('processes')
        .select('id, codigo, slug, nombre, tagline, descripcion_detallada, pasos, personalizacion, landing_slug, bloque_negocio, modulo_codigo, sectores, herramientas, dolores, canales, catalog_active')
        .eq('catalog_active', true);

    if (sectorFilter) query = query.eq('landing_slug', sectorFilter);

    const { data: processes, error } = await query;
    if (error) {
        console.error('Error al obtener procesos:', error);
        process.exit(1);
    }

    console.log(`Encontrados ${processes.length} procesos activos${sectorFilter ? ` en ${sectorFilter}` : ''}.`);

    const chunks = processes.map(p => {
        const sectorName = p.landing_slug ? (SECTOR_NAMES[p.landing_slug] || p.landing_slug) : null;
        let content = buildDocument(p);

        // Deep knowledge adicional si existe scripts/knowledge/processes/{id}.md
        const deepKnowledgePath = `./scripts/knowledge/processes/${p.id}.md`;
        if (fs.existsSync(deepKnowledgePath)) {
            const deepContent = fs.readFileSync(deepKnowledgePath, 'utf8');
            content += `\n\n--- INFORMACIÓN DETALLADA ---\n\n${deepContent}`;
        }

        return {
            content,
            metadata: {
                source: 'catalog_process',
                process_id: p.id,
                process_name: p.nombre,
                slug: p.slug || '',
                landing_slug: p.landing_slug || null,
                bloque_negocio: p.bloque_negocio || null,
                modulo_codigo: p.modulo_codigo || p.codigo || null,
                sector_name: sectorName || null,
                template_version: 'v2',
            }
        };
    });

    // Conocimiento general (solo en extracción completa — al filtrar por sector no aplica)
    if (!sectorFilter) {
        console.log('--- Extrayendo conocimiento general ---');
        const generalFiles = [
            { path: './scripts/knowledge/general_faqs.md', source: 'general_faqs', name: 'FAQs Generales de Immoralia' }
        ];
        for (const file of generalFiles) {
            if (fs.existsSync(file.path)) {
                console.log(`  Procesando: ${file.name}`);
                const content = fs.readFileSync(file.path, 'utf8');
                chunks.push({
                    content,
                    metadata: { source: 'general_knowledge', type: file.source, name: file.name, template_version: 'v2' },
                });
            } else {
                console.warn(`  Archivo no encontrado (se omite): ${file.path}`);
            }
        }
    }

    const outputPath = sectorFilter
        ? `./scripts/extracted_knowledge.${sectorFilter}.json`
        : './scripts/extracted_knowledge.json';
    fs.writeFileSync(outputPath, JSON.stringify(chunks, null, 2));
    console.log(`--- Listo: ${chunks.length} fragmentos guardados en ${outputPath} ---`);
}

extractProcesses();
