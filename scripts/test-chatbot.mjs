/**
 * Script de test del chatbot — lanza preguntas típicas a la edge function de staging
 * y muestra las respuestas formateadas en consola.
 *
 * Uso:
 *   node scripts/test-chatbot.mjs
 *   node scripts/test-chatbot.mjs --sector=salud         (solo preguntas de ese sector)
 *   node scripts/test-chatbot.mjs --target=prod          (apunta a producción)
 */

import * as dotenv from 'dotenv';
dotenv.config();

const isProd   = process.argv.includes('--target=prod');
const onlySector = process.argv.find(a => a.startsWith('--sector='))?.split('=')[1] ?? null;

const SUPABASE_URL = isProd
    ? process.env.PROD_SUPABASE_URL
    : (process.env.STAGING_SUPABASE_URL || process.env.VITE_SUPABASE_URL);

const ANON_KEY = isProd
    ? process.env.PROD_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
    : process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/chat-assistant`;

// ── Test por sector — cobertura completa ─────────────────────────────────────
const TESTS = [

    // ── CENTROS DEPORTIVOS ────────────────────────────────────────────────────
    { label: 'DEP 1 — captar leads de redes',       sector: 'centros-deportivos', question: 'Pierdo leads que vienen de Instagram porque no les doy seguimiento a tiempo.' },
    { label: 'DEP 2 — socios en riesgo de baja',    sector: 'centros-deportivos', question: '¿Cómo detecto qué socios están a punto de darse de baja antes de que lo hagan?' },
    { label: 'DEP 3 — reservas de clases',          sector: 'centros-deportivos', question: 'Quiero que mis socios puedan reservar clases solos sin llamar a recepción.' },
    { label: 'DEP 4 — cobros automáticos',          sector: 'centros-deportivos', question: 'Tengo socios cuya cuota mensual caduca y no me entero hasta que ya se fueron.' },
    { label: 'DEP 5 — cumpleaños socios',           sector: 'centros-deportivos', question: '¿Podéis enviar automáticamente un regalo o descuento a los socios el día de su cumpleaños?' },

    // ── GESTORÍAS ────────────────────────────────────────────────────────────
    { label: 'GES 1 — recopilar documentos',        sector: 'gestorias', question: 'Cada mes persigo a mis clientes para que me manden la documentación. Es agotador.' },
    { label: 'GES 2 — nóminas automáticas',         sector: 'gestorias', question: '¿Podéis automatizar el envío de nóminas a los empleados de cada empresa cliente?' },
    { label: 'GES 3 — alertas fiscales',            sector: 'gestorias', question: 'Necesito avisar a mis clientes con tiempo cuando se acercan fechas de impuestos.' },
    { label: 'GES 4 — alta de cliente nuevo',       sector: 'gestorias', question: 'El proceso de dar de alta a un cliente nuevo tarda días porque todo es manual.' },
    { label: 'GES 5 — clasificar documentos',       sector: 'gestorias', question: 'Los clientes me mandan facturas, contratos y nóminas mezcladas por email y WhatsApp y las pierdo.' },

    // ── SALUD ────────────────────────────────────────────────────────────────
    { label: 'SAL 1 — recordatorio de citas',       sector: 'salud', question: 'Tengo muchas ausencias porque los pacientes se olvidan de sus citas.' },
    { label: 'SAL 2 — reactivar pacientes',         sector: 'salud', question: '¿Podéis recuperar pacientes que llevan meses sin venir a la clínica?' },
    { label: 'SAL 3 — alta paciente nuevo',         sector: 'salud', question: 'Cuando llega un paciente nuevo tardamos mucho en rellenar su ficha y asignarle médico.' },
    { label: 'SAL 4 — cobros e impagos',            sector: 'salud', question: 'Tengo pacientes con facturas pendientes y nadie lleva el seguimiento de cobros.' },
    { label: 'SAL 5 — reseñas y reputación',        sector: 'salud', question: 'Quiero conseguir más valoraciones positivas de mis pacientes en Google.' },

    // ── CONSTRUCCIÓN ────────────────────────────────────────────────────────
    { label: 'CON 1 — captar leads presupuesto',    sector: 'construccion', question: 'Me entran solicitudes de presupuesto por email y WhatsApp y tardo demasiado en responder.' },
    { label: 'CON 2 — seguimiento de obra',         sector: 'construccion', question: '¿Cómo mantengo informados a mis clientes del estado de su obra sin que me llamen todo el día?' },
    { label: 'CON 3 — firma digital contratos',     sector: 'construccion', question: 'Firmamos contratos en papel y a veces tardamos semanas en tener todo firmado.' },
    { label: 'CON 4 — gestión de visitas',          sector: 'construccion', question: 'Organizar visitas a pisos piloto y obras me lleva mucho tiempo de coordinación.' },
    { label: 'CON 5 — postventa clientes',          sector: 'construccion', question: 'Cuando entrego una obra los clientes me llaman con incidencias y no tengo sistema para gestionarlas.' },

    // ── ACADEMIAS ────────────────────────────────────────────────────────────
    { label: 'ACA 1 — cobrar mensualidades',        sector: 'academias', question: 'Tengo alumnos que siempre se retrasan en pagar la mensualidad y tengo que perseguirlos.' },
    { label: 'ACA 2 — comunicar a padres',          sector: 'academias', question: '¿Cómo automatizáis los avisos a los padres sobre faltas, exámenes y novedades?' },
    { label: 'ACA 3 — recuperar exalumnos',         sector: 'academias', question: 'Tengo una base de datos enorme de alumnos que se fueron. ¿Podéis ayudarme a recuperarlos?' },
    { label: 'ACA 4 — matriculación digital',       sector: 'academias', question: 'El proceso de matriculación es todo en papel y correos manuales. Quiero digitalizarlo.' },
    { label: 'ACA 5 — detectar riesgo abandono',    sector: 'academias', question: '¿Hay algo para detectar qué alumnos están a punto de darse de baja antes de que lo hagan?' },

    // ── GASTRONOMÍA ─────────────────────────────────────────────────────────
    { label: 'GAS 1 — gestión de reservas',         sector: 'gastronomia-hosteleria', question: 'Gestiono las reservas por teléfono y WhatsApp y siempre se me escapan cosas.' },
    { label: 'GAS 2 — más reseñas en Google',       sector: 'gastronomia-hosteleria', question: 'Quiero conseguir más reseñas positivas en Google de forma automática.' },
    { label: 'GAS 3 — fidelizar clientes',          sector: 'gastronomia-hosteleria', question: '¿Tenéis algo para que los clientes habituales vuelvan más a menudo?' },
    { label: 'GAS 4 — turnos del personal',         sector: 'gastronomia-hosteleria', question: 'Organizar los turnos del equipo me lleva horas cada semana.' },
    { label: 'GAS 5 — control de inventario',       sector: 'gastronomia-hosteleria', question: '¿Podéis ayudarme a controlar el stock de materia prima para no quedarme sin producto?' },

    // ── INDUSTRIAL ───────────────────────────────────────────────────────────
    { label: 'IND 1 — peticiones de oferta',        sector: 'industrial', question: 'Me llegan peticiones de presupuesto por email y WhatsApp y el comercial pierde mucho tiempo gestionándolas.' },
    { label: 'IND 2 — partes de producción',        sector: 'industrial', question: 'Mis operarios rellenan partes de producción en papel y luego alguien los pasa al ordenador.' },
    { label: 'IND 3 — mantenimiento preventivo',    sector: 'industrial', question: 'Siempre me pillo con averías porque el mantenimiento preventivo no está al día.' },
    { label: 'IND 4 — seguimiento de cobros',       sector: 'industrial', question: 'Tenemos facturas vencidas que descubrimos tarde porque nadie lleva el seguimiento.' },
    { label: 'IND 5 — estado de pedido',            sector: 'industrial', question: 'Mis clientes me llaman todo el día preguntando en qué estado está su pedido.' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function stripMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1 → $2')  // muestra la URL real
        .replace(/\\n/g, '\n');
}

async function ask(question, sector) {
    const res = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({ message: question, sector }),
    });
    return res.json();
}

// ── Main ─────────────────────────────────────────────────────────────────────
const filtered = onlySector ? TESTS.filter(t => t.sector === onlySector) : TESTS;
const target = isProd ? 'PRODUCCIÓN' : 'STAGING';

console.log(`\n${'═'.repeat(70)}`);
console.log(`  CHATBOT TEST — ${target}${onlySector ? ` — sector: ${onlySector}` : ''}`);
console.log(`  ${FUNCTION_URL}`);
console.log(`${'═'.repeat(70)}\n`);

let passed = 0;
let failed = 0;

for (const test of filtered) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`📋 ${test.label}`);
    console.log(`   Sector : ${test.sector ?? '(general)'}`);
    console.log(`   Pregunta: ${test.question}`);
    console.log(`${'─'.repeat(70)}`);

    try {
        const start = Date.now();
        const data = await ask(test.question, test.sector);
        const ms = Date.now() - start;

        if (data.error) {
            console.log(`❌ ERROR: ${data.error}`);
            failed++;
        } else {
            console.log(`✅ (${ms}ms | action: ${data.action || 'none'})\n`);
            console.log(stripMarkdown(data.reply));
            passed++;
        }
    } catch (err) {
        console.log(`❌ EXCEPCIÓN: ${err.message}`);
        failed++;
    }
}

console.log(`\n${'═'.repeat(70)}`);
console.log(`  RESULTADO: ${passed} OK / ${failed} errores de ${filtered.length} preguntas`);
console.log(`${'═'.repeat(70)}\n`);
