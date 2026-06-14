/**
 * SPEC-01 — Batería de tests de integración del motor conversacional v3.
 *
 * Requisitos:
 *  - Migración 20260612090000_create_chatbot_v3_tables.sql aplicada en staging.
 *  - Dev server corriendo (npm run dev) o --base=<url>.
 *  - Variables de entorno: STAGING_SUPABASE_URL, STAGING_SUPABASE_SERVICE_ROLE_KEY.
 *
 * Uso:
 *   node scripts/test-chatbot-v3.mjs
 *   node scripts/test-chatbot-v3.mjs --base=https://staging.example.com
 */
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const BASE = process.argv.find(a => a.startsWith('--base='))?.slice(7) || 'http://localhost:8080'
// El .env de dev local apunta a staging — sirven ambas parejas de variables.
const SUPABASE_URL = process.env.STAGING_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Faltan STAGING_SUPABASE_URL / STAGING_SUPABASE_SERVICE_ROLE_KEY (o sus equivalentes de .env)')
  process.exit(1)
}

const db = createClient(SUPABASE_URL, SERVICE_KEY)
let passed = 0
let failed = 0

function check(name, condition, detail = '') {
  if (condition) {
    passed++
    console.log(`  ✅ ${name}`)
  } else {
    failed++
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

/** Envía un mensaje al motor y consume el stream SSE completo. */
async function sendMessage(message, { conversationId, sector = null, surface = 'home', route = '/' } = {}) {
  const res = await fetch(`${BASE}/api/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationId, sector, surface, route }),
  })

  if (!res.ok) {
    return { status: res.status, error: (await res.json()).error }
  }

  const events = []
  let reply = ''
  const text = await res.text()
  for (const block of text.split('\n\n')) {
    const line = block.trim()
    if (!line.startsWith('data: ')) continue
    try {
      const event = JSON.parse(line.slice(6))
      events.push(event)
      if (event.type === 'delta') reply += event.text
    } catch { /* fragmento no parseable */ }
  }

  const meta = events.find(e => e.type === 'meta')
  const done = events.find(e => e.type === 'done')
  const error = events.find(e => e.type === 'error')
  return {
    status: res.status,
    conversationId: meta?.conversationId,
    previousExpired: meta?.previousExpired,
    deltaCount: events.filter(e => e.type === 'delta').length,
    reply,
    assistantMessageId: done?.assistantMessageId,
    recommendedSlugs: done?.recommendedSlugs ?? [],
    streamError: error?.message,
  }
}

async function main() {
  console.log(`\n🧪 Batería SPEC-01 contra ${BASE}\n`)

  // ── CA-11: validación de input ─────────────────────────────
  console.log('CA-11 — Validación de input')
  const empty = await fetch(`${BASE}/api/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: '' }),
  })
  check('Mensaje vacío → 400', empty.status === 400)

  const tooLong = await fetch(`${BASE}/api/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'x'.repeat(2001) }),
  })
  check('Mensaje >2000 chars → 400', tooLong.status === 400)

  // ── CA-01 + CA-02: primera conversación con streaming ──────
  console.log('\nCA-01/CA-02 — Primer mensaje y streaming')
  const turn1 = await sendMessage('Tengo una clínica dental y pierdo muchas citas porque nadie confirma', {
    sector: 'salud', surface: 'sector', route: '/sector/salud',
  })
  check('Devuelve conversationId', !!turn1.conversationId)
  check('Streaming: más de 1 delta', turn1.deltaCount > 1, `deltas=${turn1.deltaCount}`)
  check('Respuesta no vacía', turn1.reply.length > 50)
  console.log(`  💬 ${turn1.reply.slice(0, 140).replace(/\n/g, ' ')}...`)

  // ── CA-06: persistencia del turno con metadatos ─────────────
  console.log('\nCA-06 — Persistencia en BBDD')
  const { data: msgs1 } = await db.from('chatbot_messages')
    .select('*').eq('conversation_id', turn1.conversationId).order('created_at')
  check('2 mensajes persistidos (user + assistant)', msgs1?.length === 2)
  check('Metadatos de ruta/sector en el turno', msgs1?.[0]?.route === '/sector/salud' && msgs1?.[0]?.sector === 'salud')

  // ── CA-03 + CA-07: hilo conversacional en la MISMA conversación ──
  console.log('\nCA-03/CA-07 — Hilo y misma conversación')
  const turn2 = await sendMessage('¿Y eso cuánto tarda en ponerse en marcha?', {
    conversationId: turn1.conversationId, sector: 'salud', surface: 'sector', route: '/sector/salud',
  })
  check('Misma conversación', turn2.conversationId === turn1.conversationId)
  check('Responde sin pedir aclaración de tema', turn2.reply.length > 30)
  console.log(`  💬 ${turn2.reply.slice(0, 140).replace(/\n/g, ' ')}...`)

  // ── CA-04: respuesta corta interpretada en el hilo ──────────
  console.log('\nCA-04 — Respuesta corta en contexto')
  const turn3 = await sendMessage('sí', {
    conversationId: turn1.conversationId, sector: 'salud', surface: 'sector', route: '/sector/salud',
  })
  check('Respuesta coherente a un "sí" (no reinicia)', turn3.reply.length > 30 && !/no te entiendo|¿en qué puedo ayudarte\?$/i.test(turn3.reply))
  console.log(`  💬 ${turn3.reply.slice(0, 140).replace(/\n/g, ' ')}...`)

  // ── CA-08: rolling de actividad ─────────────────────────────
  console.log('\nCA-08 — Rolling de last_activity_at')
  const { data: conv } = await db.from('chatbot_conversations')
    .select('*').eq('id', turn1.conversationId).single()
  const ageMs = Date.now() - new Date(conv.last_activity_at).getTime()
  check('last_activity_at actualizado (<60s)', ageMs < 60_000, `${Math.round(ageMs / 1000)}s`)
  check('Contadores actualizados', conv.user_message_count === 3 && conv.assistant_message_count === 3)

  // ── CA-10: valoración ───────────────────────────────────────
  console.log('\nCA-10 — Valoración de mensaje')
  const fb1 = await fetch(`${BASE}/api/chatbot/feedback`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId: turn1.conversationId, messageId: turn3.assistantMessageId, rating: 'useful' }),
  })
  check('Valoración registrada → 200', fb1.status === 200)
  const fb2 = await fetch(`${BASE}/api/chatbot/feedback`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId: turn1.conversationId, messageId: turn3.assistantMessageId, rating: 'not_useful' }),
  })
  check('Cambio de valoración → 200', fb2.status === 200)
  const { data: rating } = await db.from('chatbot_message_ratings')
    .select('*').eq('message_id', turn3.assistantMessageId).single()
  check('La última valoración gana', rating?.rating === 'not_useful')

  const fbBad = await fetch(`${BASE}/api/chatbot/feedback`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId: crypto.randomUUID(), messageId: turn3.assistantMessageId, rating: 'useful' }),
  })
  check('Valorar desde otra conversación → 400', fbBad.status === 400)

  // ── CA-13: lectura conversacional vía BBDD ──────────────────
  console.log('\nCA-13 — Lectura conversacional desde BBDD')
  const { data: transcript } = await db.from('chatbot_messages')
    .select('role, content, created_at, recommended_slugs')
    .eq('conversation_id', turn1.conversationId).order('created_at')
  check('Transcripción ordenada legible', transcript?.length === 6 && transcript[0].role === 'user')

  // ── Historial por API ───────────────────────────────────────
  console.log('\nHistorial — GET /api/chatbot/history')
  const hist = await fetch(`${BASE}/api/chatbot/history?conversationId=${turn1.conversationId}`)
  const histData = await hist.json()
  check('Historial devuelto con mensajes', hist.status === 200 && histData.messages?.length === 6)

  // ── CA-09: caducidad → conversación nueva, la vieja se conserva ──
  console.log('\nCA-09 — Caducidad de 7 días')
  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  await db.from('chatbot_conversations')
    .update({ last_activity_at: eightDaysAgo }).eq('id', turn1.conversationId)
  const turn4 = await sendMessage('Hola, ¿sigues ahí?', { conversationId: turn1.conversationId })
  check('Conversación nueva creada', turn4.conversationId && turn4.conversationId !== turn1.conversationId)
  check('previousExpired = true', turn4.previousExpired === true)
  const { data: oldConv } = await db.from('chatbot_conversations')
    .select('id, status').eq('id', turn1.conversationId).single()
  check('La conversación vieja se conserva en BBDD', !!oldConv)
  const histExpired = await fetch(`${BASE}/api/chatbot/history?conversationId=${turn1.conversationId}`)
  check('Historial de caducada → 410', histExpired.status === 410)

  // ── CA-05/CA-15: anti-redundancia y memoria larga (informe manual) ──
  console.log('\nCA-05/CA-15 — Revisión cualitativa (manual)')
  console.log('  ℹ️  Ejecutar conversación de 20+ turnos y verificar que el bot no repite')
  console.log('     recomendaciones (CA-05) y recuerda el inicio vía resumen (CA-15).')
  console.log(`     Resumen actual de la conversación de test: ${conv.summary ? '"' + conv.summary.slice(0, 100) + '..."' : '(aún sin resumen — normal con <13 mensajes)'}`)

  // ── Limpieza ────────────────────────────────────────────────
  await db.from('chatbot_conversations').delete().eq('id', turn1.conversationId)
  await db.from('chatbot_conversations').delete().eq('id', turn4.conversationId)
  console.log('\n🧹 Conversaciones de test eliminadas')

  console.log(`\n═══════════════════════════════════`)
  console.log(`Resultado: ${passed} ✅ · ${failed} ❌`)
  console.log(`═══════════════════════════════════\n`)
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(err => {
  console.error('Error fatal en la batería:', err)
  process.exit(1)
})
