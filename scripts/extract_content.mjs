import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.STAGING_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Faltan variables de entorno. Necesitas STAGING_SUPABASE_URL y STAGING_SUPABASE_SERVICE_ROLE_KEY (o las variantes VITE_)');
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
};

function formatArray(value) {
    if (!value) return 'No especificado';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
}

function formatSteps(value) {
    if (!value) return 'No especificado';
    const arr = Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value) : []);
    return arr.map((paso, i) => `${i + 1}. ${paso}`).join('\n');
}

async function extractProcesses() {
    console.log('--- Extrayendo procesos de Supabase ---');

    const { data: processes, error } = await supabase
        .from('processes')
        .select('id, codigo, slug, nombre, tagline, descripcion_detallada, pasos, personalizacion, landing_slug, bloque_negocio, modulo_codigo, sectores, herramientas, dolores, canales, catalog_active')
        .eq('catalog_active', true);

    if (error) {
        console.error('Error al obtener procesos:', error);
        process.exit(1);
    }

    console.log(`Encontrados ${processes.length} procesos activos.`);

    const chunks = processes.map(p => {
        const sectorName = p.landing_slug ? (SECTOR_NAMES[p.landing_slug] || p.landing_slug) : null;
        const sectorLabel = sectorName ? `Exclusivo de ${sectorName}` : (p.sectores?.length ? p.sectores.join(', ') : 'Todos los sectores');

        const content = `
# Proceso: ${p.nombre}
**Tagline**: ${p.tagline || 'Sin descripción breve'}
**Sector**: ${sectorLabel}
**Bloque de negocio**: ${p.bloque_negocio || 'General'}
**Módulo**: ${p.modulo_codigo || p.codigo}

## Descripción
${p.descripcion_detallada || 'Sin descripción detallada.'}

## Cómo funciona
${formatSteps(p.pasos)}

## Personalización
${p.personalizacion || 'Configurable según las necesidades del negocio.'}

## Herramientas utilizadas
${formatArray(p.herramientas)}

## Problemas que resuelve
${formatArray(p.dolores)}

## Canales de integración
${formatArray(p.canales)}
`.trim();

        // Deep knowledge adicional si existe el archivo en scripts/knowledge/processes/{id}.md
        let finalContent = content;
        const deepKnowledgePath = `./scripts/knowledge/processes/${p.id}.md`;
        if (fs.existsSync(deepKnowledgePath)) {
            const deepContent = fs.readFileSync(deepKnowledgePath, 'utf8');
            finalContent += `\n\n--- INFORMACIÓN DETALLADA ---\n\n${deepContent}`;
        }

        return {
            content: finalContent,
            metadata: {
                source: 'catalog_process',
                process_id: p.id,
                process_name: p.nombre,
                slug: p.slug || '',
                landing_slug: p.landing_slug || null,
                bloque_negocio: p.bloque_negocio || null,
                sector_name: sectorName || null,
            }
        };
    });

    // Conocimiento general (FAQs, info corporativa, etc.)
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
                metadata: {
                    source: 'general_knowledge',
                    type: file.source,
                    name: file.name
                }
            });
        } else {
            console.warn(`  Archivo no encontrado (se omite): ${file.path}`);
        }
    }

    fs.writeFileSync('./scripts/extracted_knowledge.json', JSON.stringify(chunks, null, 2));
    console.log(`--- Listo: ${chunks.length} fragmentos guardados en ./scripts/extracted_knowledge.json ---`);
}

extractProcesses();
