import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Faltan variables de entorno (VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Función auxiliar para extraer métricas y slugs del archivo de frontend
function getProcessData() {
    const processesPath = './src/data/processes.ts';
    if (!fs.existsSync(processesPath)) return {};

    const content = fs.readFileSync(processesPath, 'utf8');
    const data = {};

    // Regex para buscar id, slug e indicadores
    const processRegex = /id:\s*["']([^"']+)["'][\s\S]*?slug:\s*["']([^"']+)["'][\s\S]*?indicators:\s*{[\s\S]*?time_estimate:\s*["']([^"']+)["'][\s\S]*?complexity:\s*["']([^"']+)["']/g;

    let match;
    while ((match = processRegex.exec(content)) !== null) {
        data[match[1]] = {
            slug: match[2],
            time_estimate: match[3],
            complexity: match[4]
        };
    }
    return data;
}

async function extractProcesses() {
    console.log('--- Extrayendo procesos de la base de datos ---');

    const { data: processes, error } = await supabase
        .from('processes')
        .select('*');

    if (error) {
        console.error('Error al obtener procesos:', error);
        return;
    }

    console.log(`Encontrados ${processes.length} procesos.`);

    const processData = getProcessData();

    const chunks = processes.map(p => {
        // Mapeo de nombres más explícitos para el motor de búsqueda
        const nameOverrides = {
            'A1': 'Facturación automática de clientes',
            'D15': 'Liquidación y facturación de freelance',
            'D16': 'Gestión de retenciones de freelance'
        };

        const processName = nameOverrides[p.id] || p.nombre;
        const pData = processData[p.id] || {};

        // Determinar audiencia y tipo de flujo para mejor diferenciación
        let audience = 'Client';
        let flowType = 'Revenue';

        // Procesos internos o de pago a proveedores/colaboradores (Gastos)
        if (p.id.startsWith('D') || p.id === 'C9') {
            audience = 'Internal/Supplier';
            flowType = 'Expense';
        }

        // Formateamos cada proceso como un "documento" Markdown enriquecido básico
        let content = `
# Proceso: ${processName}
**Tagline**: ${p.tagline}
**Categoría**: ${p.categoria_nombre}
**Público objetivo**: ${audience === 'Client' ? 'Gestión de Clientes' : 'Gestión Interna / Proveedores'}
**Tipo de flujo**: ${flowType === 'Revenue' ? 'Ingresos (Ventas)' : 'Egresos (Gastos)'}
**Tiempo estimado**: ${pData.time_estimate || 'Consultar'}
**Complejidad**: ${pData.complexity || 'Consultar'}

## Descripción
${p.descripcion_detallada}

## Pasos del proceso
${Array.isArray(p.pasos) ? p.pasos.map((paso, i) => `${i + 1}. ${paso}`).join('\n') : p.pasos}

## Personalización
${p.personalizacion}

## Sectores recomendados
${p.sectores?.join(', ')}

## Herramientas utilizadas
${p.herramientas?.join(', ')}

## Puntos de dolor que resuelve
${p.dolores?.join(', ')}
`.trim();

        // Intentamos cargar información "Deep Knowledge" del sistema de archivos
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
                slug: pData.slug || '',
                category: p.categoria_nombre,
                audience,
                flow_type: flowType,
                process_name: processName
            }
        };
    });

    // 2. Extraer FAQs generales y otros documentos de conocimiento general
    console.log('--- Extrayendo conocimiento general ---');
    const generalFiles = [
        { path: './scripts/knowledge/general_faqs.md', source: 'general_faqs', name: 'FAQs Generales' }
    ];

    for (const file of generalFiles) {
        if (fs.existsSync(file.path)) {
            console.log(`Procesando conocimiento general: ${file.name}`);
            const content = fs.readFileSync(file.path, 'utf8');
            chunks.push({
                content,
                metadata: {
                    source: 'general_knowledge',
                    type: file.source,
                    name: file.name
                }
            });
        }
    }

    // Guardar en un archivo temporal para revisión
    fs.writeFileSync('./scripts/extracted_knowledge.json', JSON.stringify(chunks, null, 2));
    console.log('--- Conocimiento extraído y guardado en ./scripts/extracted_knowledge.json ---');
}

extractProcesses();
