import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiKey) {
    console.error('Faltan variables de entorno (VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY o OPENAI_API_KEY)');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const industriesKnowledge = [
    {
        industry: "Peluquerías y Centros de Estética",
        processes: ["E18", "E21", "E23", "E17", "D13", "A5"],
        description: `
Para una peluquería o centro de estética, los procesos más recomendados son:
- **Asistente de reservas y recordatorios (E18)**: Gestiona citas 24/7 sin llamadas y reduce ausencias.
- **Reducción de ausencias a citas (E23)**: Envía confirmaciones y recordatorios por WhatsApp.
- **Solicitud automática de reseñas (E21)**: Mejora tu reputación en Google pidiendo reseñas tras el servicio.
- **Atención automática por mensajería (E17)**: Responde dudas sobre precios, horarios y servicios al instante.
- **Registro automático de gastos (D13)**: Digitaliza tus facturas de proveedores (productos, alquiler) con solo una foto.
- **Recordatorios de pagos (A5)**: Útil si trabajas con bonos o pagos aplazados.
    `.trim()
    },
    {
        industry: "Agencias de Marketing y Consultoras",
        processes: ["A1", "B7", "B8", "D14", "E19", "E24"],
        description: `
Para agencias y empresas de servicios profesionales:
- **Facturas automatizadas (A1)**: Genera proformas según fees variables o inversión.
- **Informe de horas vs estimadas (B7)**: Controla la rentabilidad de tus proyectos en tiempo real.
- **Alertas por exceso de horas (B8)**: Evita perder margen cuando un proyecto se dispara en horas.
- **Creación de metas en ClickUp (D14)**: Sincroniza tus KPIs de Sheets con objetivos en ClickUp.
- **Captura y organización de solicitudes (E19)**: Centraliza leads de WhatsApp, Web e Instagram.
- **Alta automática de clientes (E24)**: Onboarding impecable creando carpetas y tableros al instante.
    `.trim()
    }
];

async function uploadIndustryKnowledge() {
    console.log('--- Iniciando carga de conocimiento por industria ---');

    for (const item of industriesKnowledge) {
        console.log(`Generando embedding para: ${item.industry}...`);

        try {
            const response = await fetch('https://api.openai.com/v1/embeddings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openaiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'text-embedding-3-small',
                    input: item.description,
                }),
            });

            const result = await response.json();
            if (result.error) {
                console.error('Error de OpenAI:', result.error);
                continue;
            }

            const embedding = result.data[0].embedding;

            const { error } = await supabase
                .from('chatbot_knowledge')
                .insert({
                    content: item.description,
                    metadata: { source: 'industry_mapping', industry: item.industry, suggested_processes: item.processes },
                    embedding: embedding,
                });

            if (error) {
                console.error('Error al insertar en Supabase:', error);
            } else {
                console.log(`✓ Cargado: ${item.industry}`);
            }
        } catch (err) {
            console.error('Error en el proceso:', err);
        }
    }

    console.log('--- Proceso finalizado ---');
}

uploadIndustryKnowledge();
