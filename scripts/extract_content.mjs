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

    const chunks = processes.map(p => {
        // Mapeo de nombres más explícitos para el motor de búsqueda
        const nameOverrides = {
            'A1': 'Facturación automática de clientes',
            'D15': 'Liquidación y facturación de freelance',
            'D16': 'Gestión de retenciones de freelance'
        };

        const processName = nameOverrides[p.id] || p.nombre;

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
# Proceso: ${processName} (Código: ${p.id})
**Tagline**: ${p.tagline}
**Categoría**: ${p.categoria_nombre}
**Público objetivo**: ${audience === 'Client' ? 'Gestión de Clientes' : 'Gestión Interna / Proveedores'}
**Tipo de flujo**: ${flowType === 'Revenue' ? 'Ingresos (Ventas)' : 'Egresos (Gastos)'}

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
                category: p.categoria_nombre,
                audience,
                flow_type: flowType,
                process_name: processName
            }
        };
    });

    // Guardar en un archivo temporal para revisión
    fs.writeFileSync('./scripts/extracted_knowledge.json', JSON.stringify(chunks, null, 2));
    console.log('--- Conocimiento extraído y guardado en ./scripts/extracted_knowledge.json ---');
}

extractProcesses();
