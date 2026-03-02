import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiKey) {
    console.error('Faltan variables de entorno');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const setupContent = `
# Información sobre el Setup de Automatización (n8n)

Para que las automatizaciones funcionen, necesitan estar alojadas en un servidor (VPS) encendido las 24 horas del día. 

## Opciones de Hosting

### 1. Alojado por Immoralia (Recomendado)
- **Para quién es**: Ideal si no tienes equipo técnico propio y quieres olvidarte de servidores y mantenimiento.
- **Qué hacemos nosotros**: Instalamos y configuramos n8n, lo mantenemos seguro y actualizado, y monitorizamos que funcione 24/7.
- **Ventajas**: Rapidez, seguridad y soporte directo. El coste del servidor se incluye en la cuota de mantenimiento.

### 2. Tu propio servidor
- **Para quién es**: Ideal si ya tienes informático, proveedor de VPS (como AWS, DigitalOcean, etc.) o un n8n ya funcionando.
- **Requisitos**: Necesitarás darnos acceso al servidor o al n8n existente, tener una URL/dominio configurado y las credenciales correspondientes.
- **Soporte**: Tú te encargas de la infraestructura y los pagos al proveedor del VPS.

## Qué incluye nuestro servicio de Setup
- **Instalación**: Puesta en marcha inicial.
- **Seguridad**: Accesos protegidos (SSL/HTTPS), backups diarios y actualizaciones constantes.
- **Monitorización**: Vigilancia activa 24/7 para evitar caídas.
- **Soporte**: Atención directa para dudas tácticas.

## Preguntas Frecuentes sobre el Setup
- **¿Cuánto tarda?**: Normalmente entre 24 y 48 horas laborables.
- **¿Es seguro?**: Sí, usamos entornos aislados, encriptados (nivel bancario) y no mezclamos datos de clientes.
- **¿Puedo cambiar de opción?**: Sí, podemos migrar de nuestro servidor al tuyo (o viceversa) en cualquier momento.
- **¿Qué es un VPS?**: Es un Servidor Privado Virtual, un "ordenador en internet" dedicado exclusivamente a tus tareas.
`.trim();

async function uploadSetupKnowledge() {
    console.log('--- Generando embedding para la info de Setup ---');

    const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: setupContent,
        }),
    });

    const result = await response.json();
    if (result.error) {
        console.error('Error de OpenAI:', result.error);
        return;
    }

    const embedding = result.data[0].embedding;

    const { error } = await supabase
        .from('chatbot_knowledge')
        .insert({
            content: setupContent,
            metadata: { source: 'setup_info', section: 'general' },
            embedding: embedding,
        });

    if (error) {
        console.error('Error al insertar en Supabase:', error);
    } else {
        console.log('✓ Info de Setup cargada correctamente en Supabase.');
    }
}

uploadSetupKnowledge();
