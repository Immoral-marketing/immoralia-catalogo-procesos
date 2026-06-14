/**
 * SPEC-01 — Verificación cualitativa de CA-05 (anti-redundancia) y
 * CA-15 (memoria larga vía resumen acumulado) con una conversación de 11+ turnos.
 *
 * Uso: node scripts/test-chatbot-v3-memoria.mjs  (dev server corriendo)
 */
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const BASE = process.argv.find(a => a.startsWith('--base='))?.slice(7) || 'http://localhost:8080'
const SUPABASE_URL = process.env.STAGING_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
const db = createClient(SUPABASE_URL, SERVICE_KEY)

async function send(message, conversationId) {
  const res = await fetch(`${BASE}/api/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationId, sector: 'salud', surface: 'sector', route: '/sector/salud' }),
  })
  const text = await res.text()
  let reply = ''
  let convId = conversationId
  let slugs = []
  for (const block of text.split('\n\n')) {
    const line = block.trim()
    if (!line.startsWith('data: ')) continue
    try {
      const e = JSON.parse(line.slice(6))
      if (e.type === 'meta') convId = e.conversationId
      if (e.type === 'delta') reply += e.text
      if (e.type === 'done') slugs = e.recommendedSlugs
    } catch { /* ignore */ }
  }
  return { reply, convId, slugs }
}

const TURNS = [
  'Hola, tengo una clínica dental en Valencia que se llama Clínica Sonrisa. Mi mayor problema es que perdemos pacientes porque nadie confirma las citas.',
  'Somos 3 doctores y 2 recepcionistas. Usamos el programa Gesden para gestionar la clínica.',
  '¿Y eso cómo funciona exactamente?',
  '¿Qué pasa si el paciente no contesta al recordatorio?',
  'Nos pasa mucho que se quedan huecos vacíos por cancelaciones de última hora.',
  '¿Eso se puede conectar con Gesden?',
  'También me interesaría algo para las reseñas de Google, tenemos pocas.',
  '¿Cuánto se tarda en poner en marcha todo esto?',
  'ok, ¿y necesito contratar a alguien técnico para mantenerlo?',
  '¿Me puedes hacer un resumen de lo que hemos visto hasta ahora?',
  '¿Recuerdas cómo se llama mi clínica y en qué ciudad estamos? ¿Y qué programa de gestión usamos?',
]

async function main() {
  console.log(`\n🧪 Test de memoria larga (CA-05/CA-15) contra ${BASE}\n`)
  let convId
  const slugHistory = []

  for (let i = 0; i < TURNS.length; i++) {
    const { reply, convId: id, slugs } = await send(TURNS[i], convId)
    convId = id
    slugHistory.push(slugs)
    console.log(`— Turno ${i + 1}: ${TURNS[i].slice(0, 60)}...`)
    console.log(`  🤖 ${reply.slice(0, 150).replace(/\n/g, ' ')}${reply.length > 150 ? '...' : ''}`)
    if (slugs.length) console.log(`  🔗 slugs: ${slugs.join(', ')}`)
  }

  // CA-15: el último turno pregunta por datos del turno 1-2 (fuera de la ventana de 12)
  const { data: conv } = await db.from('chatbot_conversations').select('*').eq('id', convId).single()
  const lastReply = (await db.from('chatbot_messages')
    .select('content').eq('conversation_id', convId).eq('role', 'assistant')
    .order('created_at', { ascending: false }).limit(1).single()).data?.content || ''

  console.log('\n═══ EVALUACIÓN ═══')
  console.log(`Resumen persistido: ${conv.summary ? '✅ SÍ' : '❌ NO'} (summary_message_count=${conv.summary_message_count})`)
  if (conv.summary) console.log(`  📝 "${conv.summary.slice(0, 200)}..."`)

  const remembersClinic = /sonrisa/i.test(lastReply)
  const remembersCity = /valencia/i.test(lastReply)
  const remembersSoftware = /gesden/i.test(lastReply)
  console.log(`CA-15 — Recuerda nombre clínica (turno 1): ${remembersClinic ? '✅' : '❌'}`)
  console.log(`CA-15 — Recuerda ciudad (turno 1): ${remembersCity ? '✅' : '❌'}`)
  console.log(`CA-15 — Recuerda software (turno 2): ${remembersSoftware ? '✅' : '❌'}`)

  // CA-05: un slug no debe recomendarse como nuevo en turnos posteriores
  const seen = new Map()
  let repeats = 0
  slugHistory.forEach((slugs, turn) => {
    slugs.forEach(s => {
      if (seen.has(s)) repeats++
      else seen.set(s, turn)
    })
  })
  console.log(`CA-05 — Slugs repetidos en turnos posteriores: ${repeats} ${repeats <= 1 ? '✅ (el turno 10 pedía resumen — repetición legítima)' : '⚠️ revisar transcripción'}`)

  await db.from('chatbot_conversations').delete().eq('id', convId)
  console.log('\n🧹 Conversación de test eliminada\n')

  const ok = conv.summary && remembersClinic && remembersCity && remembersSoftware
  process.exit(ok ? 0 : 1)
}

main().catch(err => { console.error(err); process.exit(1) })
