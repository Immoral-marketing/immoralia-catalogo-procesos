import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

// Staging Credentials (from .env)
const STAGING_URL = process.env.VITE_SUPABASE_URL;
const STAGING_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Production Credentials (provided by USER)
const PROD_URL = "https://cvnuwrzpbvxtdxolwmxf.supabase.co";
const PROD_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2bnV3cnpwYnZ4dGR4b2x3bXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTYwNDcyOSwiZXhwIjoyMDg1MTgwNzI5fQ.YyqJOEPbHeke9K-Tsd1qtYF1yJpRmBR2uijtZ85xtp0";

if (!STAGING_URL || !STAGING_KEY) {
    console.error('❌ Falta configuración de STAGING en .env');
    process.exit(1);
}

const staging = createClient(STAGING_URL, STAGING_KEY);
const prod = createClient(PROD_URL, PROD_KEY);

async function syncTable(tableName, idField = 'id', cleanProd = false) {
    console.log(`\n⏳ Sincronizando tabla: ${tableName}...`);
    
    // 1. Obtener datos de Staging
    const { data: stagingData, error: stagingError } = await staging
        .from(tableName)
        .select('*');
        
    if (stagingError) {
        console.error(`❌ Error al leer de STAGING (${tableName}):`, stagingError.message);
        return;
    }
    
    console.log(`✅ Leídos ${stagingData.length} registros de Staging.`);
    
    if (stagingData.length === 0) {
        console.log(`⚠️ No hay datos para sincronizar en ${tableName}.`);
        return;
    }

    if (cleanProd) {
        console.log(`🧹 Limpiando tabla ${tableName} en PRODUCCIÓN para mirror exacto...`);
        const { error: deleteError } = await prod
            .from(tableName)
            .delete()
            .neq(idField, '00000000-0000-0000-0000-000000000000'); // Delete all
            
        if (deleteError) {
            console.warn(`⚠️ Advertencia al limpiar producción: ${deleteError.message}`);
        }
    }
    
    // Pre-procesar datos para evitar errores de NOT NULL en producción
    const processedData = stagingData.map(row => {
        const processed = { ...row };
        if (tableName === 'processes') {
            processed.codigo = processed.codigo || processed.id || 'N/A';
            processed.categoria = processed.categoria || 'E'; 
            processed.categoria_nombre = processed.categoria_nombre || 'General';
            processed.nombre = processed.nombre || 'Sin nombre';
            processed.tagline = processed.tagline || '';
            processed.recomendado = processed.recomendado !== null ? processed.recomendado : false;
            processed.descripcion_detallada = processed.descripcion_detallada || '';
            processed.pasos = processed.pasos || [];
            processed.personalizacion = processed.personalizacion || {};
            processed.sectores = processed.sectores || [];
            processed.herramientas = processed.herramientas || [];
            processed.dolores = processed.dolores || [];
            processed.canales = processed.canales || [];
            processed.integration_domains = processed.integration_domains || [];
            processed.landing_slug = processed.landing_slug || '';
        } else if (tableName === 'chatbot_knowledge') {
            processed.content = processed.content || '';
            processed.metadata = processed.metadata || {};
            processed.embedding = processed.embedding || null; // El vector puede ser nulo si no hay embedding generado aún
        }
        return processed;
    });

    // 2. Upsert en Producción (por lotes de 10)
    const batchSize = 10;
    let successCount = 0;
    
    for (let i = 0; i < processedData.length; i += batchSize) {
        const batch = processedData.slice(i, i + batchSize);
        const { error: prodError } = await prod
            .from(tableName)
            .upsert(batch, { onConflict: idField });
            
        if (prodError) {
            console.error(`❌ Error al escribir lote ${Math.floor(i/batchSize) + 1} en PRODUCCIÓN (${tableName}):`, prodError.message);
        } else {
            successCount += batch.length;
        }
    }
    
    console.log(`🎉 Sincronizados ${successCount}/${processedData.length} registros en ${tableName}.`);
}

async function runSync() {
    console.log('🚀 Iniciando proceso de sincronización STAGING -> PRODUCCIÓN (DEFENSIVE MODE)');
    console.log('---------------------------------------------------------');
    
    // Sincronizar Categorías
    await syncTable('categories');
    
    // Sincronizar Procesos (Upsert: añadir nuevos y actualizar)
    await syncTable('processes');
    
    // Sincronizar Conocimiento del Chatbot (Limpiar y re-poblar para mirror exacto)
    await syncTable('chatbot_knowledge', 'id', true);
    
    console.log('\n---------------------------------------------------------');
    console.log('✅ Proceso finalizado.');
}

runSync().catch(err => {
    console.error('💥 Error fatal:', err);
});
