import { createClient } from '@supabase/supabase-js';

const PROD_URL = "https://cvnuwrzpbvxtdxolwmxf.supabase.co";
const PROD_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2bnV3cnpwYnZ4dGR4b2x3bXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTYwNDcyOSwiZXhwIjoyMDg1MTgwNzI5fQ.YyqJOEPbHeke9K-Tsd1qtYF1yJpRmBR2uijtZ85xtp0";

const prod = createClient(PROD_URL, PROD_KEY);

async function testWrite() {
    console.log('--- Probando escritura en PRODUCCIÓN ---');
    
    const testData = {
        id: 'TEST_SYNC_001',
        codigo: 'TEST',
        categoria: 'A',
        categoria_nombre: 'Prueba',
        nombre: 'Proceso de Prueba Sincronización',
        tagline: 'Esto es una prueba de escritura',
        recomendado: false
    };
    
    console.log('Intentando UPSERT de un registro...');
    const { data, error } = await prod
        .from('processes')
        .upsert(testData);
        
    if (error) {
        console.error('❌ Error en UPSERT:', error.message);
        console.error('Detalles:', error);
    } else {
        console.log('✅ UPSERT exitoso.');
        
        console.log('Verificando registro...');
        const { data: verifyData, error: verifyError } = await prod
            .from('processes')
            .select('*')
            .eq('id', 'TEST_SYNC_001')
            .single();
            
        if (verifyError) {
            console.error('❌ Error en verificación:', verifyError.message);
        } else {
            console.log('✅ Registro encontrado en producción:', verifyData.id);
            
            // Limpiar
            console.log('Limpiando registro de prueba...');
            await prod.from('processes').delete().eq('id', 'TEST_SYNC_001');
        }
    }
}

testWrite().catch(console.error);
