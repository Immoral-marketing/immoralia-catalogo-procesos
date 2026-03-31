import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role for UPSERT

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno (VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncProcesses() {
  console.log('🚀 Iniciando sincronización de procesos a Supabase Staging...');

  const processesPath = './src/data/processes.ts';
  if (!fs.existsSync(processesPath)) {
    console.error('❌ No se encuentra el archivo src/data/processes.ts');
    return;
  }

  const content = fs.readFileSync(processesPath, 'utf8');

  // Regex para extraer cada objeto del array de procesos
  // Buscamos los bloques delimitados por { ... } dentro del array const processes = [ ... ];
  // Usamos un matching no codicioso (*?) para capturar solo el primer array
  const processesArrayMatch = content.match(/export const processes: Process\[\] = \[([\s\S]*?)\];/);
  if (!processesArrayMatch) {
    console.error('❌ No se ha podido encontrar el array de procesos en el archivo.');
    return;
  }

  const processesString = processesArrayMatch[1];
  
  // Extraemos también el array de categorías
  const categoriesArrayMatch = content.match(/export const categories = \[([\s\S]*?)\];/);
  let parsedCategories = [];
  if (categoriesArrayMatch) {
    const categoriesString = categoriesArrayMatch[1];
    const categoryBlocks = categoriesString.split(/},\s*(?:\n\s*)?{/).map(b => b.trim());
    for (let block of categoryBlocks) {
      if (!block.trim() || !block.includes('id:')) continue;
      
      const getValue = (key) => {
        const match = block.match(new RegExp(`${key}:\\s*["']([^"']*)["']`));
        return match ? match[1] : null;
      };

      const catId = getValue('id');
      if (catId) {
        parsedCategories.push({
          id: catId,
          name: getValue('name'),
          emoji: getValue('emoji')
        });
      }
    }
  }

  const parsedProcesses = [];

  // Mejora de la división de bloques
  const cleanBlocks = processesString.split(/},\s*(?:\n\s*)?{/).map(b => b.trim());

  for (let block of cleanBlocks) {
    if (!block.trim() || !block.includes('id:')) continue;
    
    // Función robusta para extraer valores
    const getValue = (key) => {
      // Intenta capturar lo que hay entre comillas después de la key:
      const match = block.match(new RegExp(`${key}:\\s*["']([^"']*)["']`));
      if (match) return match[1];
      return null;
    };

    const getArray = (key) => {
      const match = block.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
      if (!match) return [];
      return match[1]
        .split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(s => s !== '' && !s.startsWith('//'));
    };

    const id = getValue('id');
    if (!id) continue;

    const recomendation = block.match(/recomendado:\s*(true|false)/);
    const recomendado = recomendation ? recomendation[1] === 'true' : false;

    const processObj = {
      id: id,
      codigo: getValue('codigo') || id,
      categoria: getValue('categoria'),
      categoria_nombre: getValue('categoriaNombre'),
      nombre: getValue('nombre'),
      tagline: getValue('tagline'),
      recomendado: recomendado,
      descripcion_detallada: getValue('descripcionDetallada'),
      pasos: getArray('pasos'),
      personalizacion: getValue('personalizacion'),
      sectores: getArray('sectores'),
      herramientas: getArray('herramientas'),
      dolores: getArray('dolores'),
      canales: getArray('canales') || [],
      landing_slug: getValue('landing_slug'),
      integration_domains: getArray('integration_domains')
    };

    // Validación básica para evitar errores de base de datos
    if (!processObj.categoria_nombre) {
      console.warn(`⚠️ Aviso: El proceso ${id} no tiene categoriaNombre.`);
      // Intento de fallback si es uno de los conocidos
      const catMap = {};
      parsedCategories.forEach(c => catMap[c.id] = c.name);
      if (processObj.categoria && catMap[processObj.categoria]) {
        processObj.categoria_nombre = catMap[processObj.categoria];
      }
    }

    parsedProcesses.push(processObj);
  }

  // Sincronización de Categorías primero
  if (parsedCategories.length > 0) {
    console.log(`📂 Sincronizando ${parsedCategories.length} categorías...`);
    const { error: catError } = await supabase
      .from('categories')
      .upsert(parsedCategories, { onConflict: 'id' });
    
    if (catError) {
      console.error('❌ Error al sincronizar categorías:', catError);
      return;
    }
  }

  console.log(`📦 Preparados ${parsedProcesses.length} procesos para sincronizar.`);

  // Sincronización masiva (UPSERT)
  const { data, error } = await supabase
    .from('processes')
    .upsert(parsedProcesses, { onConflict: 'id' });

  if (error) {
    console.error('❌ Error al sincronizar con Supabase:', error);
    return;
  }

  console.log('✅ Sincronización completada con éxito.');
  console.log(`✨ Total de categorías: ${parsedCategories.length}`);
  console.log(`✨ Total de procesos: ${parsedProcesses.length}`);
}

syncProcesses().catch(err => {
  console.error('💥 Error inesperado:', err);
});
