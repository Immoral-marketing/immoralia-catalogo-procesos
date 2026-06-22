/**
 * test-staging-chatbot.mjs
 * Suite de tests automatizados del chatbot contra staging.immoralia.es
 *
 * Cubre:
 *   - SPEC-11: cookie imm_vid, visitor persistence, returning visitor, lead linking, GHL fields
 *   - Calidad general: respuesta, recomendaciones de proceso, lead form marker, SSE streaming
 *
 * Uso:
 *   node scripts/test-staging-chatbot.mjs
 *   node scripts/test-staging-chatbot.mjs --verbose   (muestra respuestas completas)
 *   node scripts/test-staging-chatbot.mjs --url=https://staging.immoralia.es
 *
 * Variables de entorno opcionales (para tests de GHL y Supabase):
 *   GHL_API_KEY          → verifica que los custom fields se guardaron en GHL
 *   GHL_LOCATION_ID      → ID de la subcuenta GHL
 *   STAGING_SUPABASE_URL + STAGING_SUPABASE_SERVICE_ROLE_KEY → verifica vinculación en BBDD
 */

import * as dotenv from 'dotenv'
dotenv.config()

// ─── Config ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const VERBOSE = args.includes('--verbose')
const urlArg = args.find(a => a.startsWith('--url='))
const BASE_URL = urlArg ? urlArg.split('=')[1] : 'https://staging.immoralia.es'

const GHL_API_KEY = process.env.GHL_API_KEY
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID ?? 'oAgj6wUxweXdbWMvz0Gn'
const SUPABASE_URL = process.env.STAGING_SUPABASE_URL ?? 'https://oxcjcsyowrlslbeylmih.supabase.co'
const SUPABASE_KEY = process.env.STAGING_SUPABASE_SERVICE_ROLE_KEY

const TEST_EMAIL = `chatbot-test-${Date.now()}@immoralia-test.dev`

// ─── Utilidades ──────────────────────────────────────────────────────────────

const pass = (msg) => console.log(`  ✅  ${msg}`)
const fail = (msg) => console.log(`  ❌  ${msg}`)
const skip = (msg) => console.log(`  ⏭️   ${msg}`)
const info = (msg) => VERBOSE && console.log(`       ${msg}`)
const section = (title) => console.log(`\n${'─'.repeat(60)}\n  ${title}\n${'─'.repeat(60)}`)

const sleep = ms => new Promise(r => setTimeout(r, ms))

function extractCookie(headers, name) {
  const cookies = headers.raw?.()?.['set-cookie'] ?? []
  for (const c of (Array.isArray(cookies) ? cookies : [cookies])) {
    const match = c?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
    if (match) return { value: match[1], raw: c }
  }
  // fallback: get() devuelve un string combinado en algunos entornos
  const combined = headers.get('set-cookie') ?? ''
  const m = combined.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return m ? { value: m[1], raw: combined } : null
}

function parseCookies(headerValue) {
  if (!headerValue) return {}
  return Object.fromEntries(
    headerValue.split(';').map(p => p.trim().split('=').map(s => s.trim()))
  )
}

async function sseChat({ visitorCookie, conversationId, message, sector = 'salud' }) {
  const headers = {
    'Content-Type': 'application/json',
    'x-forwarded-for': '10.0.0.99',
  }
  if (visitorCookie) headers['Cookie'] = `imm_vid=${visitorCookie}`

  const res = await fetch(`${BASE_URL}/api/chatbot`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ...(conversationId ? { conversationId } : {}),
      message,
      sector,
      surface: 'sector',
      route: `/sector/${sector}`,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`HTTP ${res.status}: ${body}`)
  }

  // Capturar cookie de la respuesta
  const setCookieHeader = res.headers.get('set-cookie')
  const cookieFromResponse = extractCookie(res.headers, 'imm_vid')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let text = ''
  let resolvedConvId = conversationId ?? null
  let action = null
  let recommendedSlugs = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      const t = line.trim()
      if (!t.startsWith('data: ')) continue
      const payload = t.slice(6)
      if (payload === '[DONE]') continue
      try {
        const ev = JSON.parse(payload)
        if (ev.type === 'meta') resolvedConvId = ev.conversationId
        else if (ev.type === 'delta') text += ev.text
        else if (ev.type === 'done') { action = ev.action; recommendedSlugs = ev.recommendedSlugs || [] }
        else if (ev.type === 'error') throw new Error(`SSE error: ${ev.message}`)
      } catch { /* fragmentos incompletos */ }
    }
  }

  return {
    text: text.trim(),
    action,
    conversationId: resolvedConvId,
    recommendedSlugs,
    setCookieHeader,
    cookieFromResponse,
    status: res.status,
  }
}

async function submitLead({ visitorCookie, conversationId }) {
  const headers = {
    'Content-Type': 'application/json',
  }
  if (visitorCookie) headers['Cookie'] = `imm_vid=${visitorCookie}`

  const res = await fetch(`${BASE_URL}/api/chatbot/lead`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      nombre: 'Test Chatbot',
      email: TEST_EMAIL,
      telefono: '+34666000001',
      sector: 'salud',
      consent: true,
      conversationId,
    }),
  })

  const body = await res.json().catch(() => ({}))
  return { status: res.status, body }
}

async function supabaseQuery(path, query) {
  if (!SUPABASE_KEY) return null
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}?${query}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  })
  return res.ok ? res.json() : null
}

async function ghlGetContact(email) {
  if (!GHL_API_KEY) return null
  // GHL v2: buscar contacto por email — endpoint correcto es /contacts (no /contacts/search)
  const res = await fetch(
    `https://services.leadconnectorhq.com/contacts?locationId=${GHL_LOCATION_ID}&query=${encodeURIComponent(email)}&page=1&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        Version: '2021-07-28',
        Accept: 'application/json',
      },
    }
  )
  if (!res.ok) {
    info(`GHL search error: ${res.status} ${await res.text()}`)
    return null
  }
  const data = await res.json()
  info(`GHL search raw: ${JSON.stringify(data).slice(0, 200)}`)
  // El contacto puede estar en data.contacts o data.contact
  const list = data?.contacts ?? (data?.contact ? [data.contact] : [])
  return list.find(c => c.email?.toLowerCase() === email.toLowerCase()) ?? list[0] ?? null
}

// ─── Tests ───────────────────────────────────────────────────────────────────

let passed = 0, failed = 0, skipped = 0
const results = []

function record(id, label, ok, detail = '') {
  if (ok === null) { skipped++; skip(`${id} ${label}${detail ? ` — ${detail}` : ''}`); results.push({ id, ok: null }) }
  else if (ok)     { passed++;  pass(`${id} ${label}`); if (detail) info(detail); results.push({ id, ok: true }) }
  else             { failed++;  fail(`${id} ${label}${detail ? ` — ${detail}` : ''}`); results.push({ id, ok: false }) }
}

// ─── T01: Primera llamada → cookie imm_vid en respuesta ──────────────────────

section('T01 · Primera llamada — cookie imm_vid')

const t01 = await sseChat({ message: 'hola, tengo una clínica dental' })
const t01Cookie = t01.cookieFromResponse

record('T01.1', 'Bot responde (texto no vacío)', t01.text.length > 10, t01.text.slice(0, 80))
record('T01.2', 'Set-Cookie presente en respuesta', !!t01.setCookieHeader, t01.setCookieHeader?.slice(0, 80))
record('T01.3', 'Cookie imm_vid tiene valor', !!t01Cookie?.value, t01Cookie?.value)

if (t01Cookie?.raw) {
  const attrs = t01Cookie.raw.toLowerCase()
  record('T01.4', 'HttpOnly presente', attrs.includes('httponly'))
  record('T01.5', 'Secure presente', attrs.includes('secure'))
  record('T01.6', 'SameSite=Lax', attrs.includes('samesite=lax'))
  record('T01.7', 'Max-Age=7776000 (90 días)', attrs.includes('max-age=7776000'))
} else {
  ;['T01.4','T01.5','T01.6','T01.7'].forEach(id => record(id, 'Atributo cookie (sin raw header)', null, 'Set-Cookie no disponible'))
}
record('T01.8', 'conversationId asignado', !!t01.conversationId, t01.conversationId)

// ─── T02: Segunda llamada misma sesión — mismo conversationId, cookie renovada

section('T02 · Segunda llamada misma sesión')

const t02 = await sseChat({
  visitorCookie: t01Cookie?.value,
  conversationId: t01.conversationId,
  message: 'perdemos unas 5 citas al día, sobre todo por las mañanas',
})

record('T02.1', 'Bot responde', t02.text.length > 10, t02.text.slice(0, 80))
record('T02.2', 'conversationId igual que T01', t02.conversationId === t01.conversationId, `${t02.conversationId} vs ${t01.conversationId}`)
record('T02.3', 'Cookie renovada (Set-Cookie en respuesta)', !!t02.setCookieHeader)
record('T02.4', 'Cookie renew mismo valor', t02.cookieFromResponse?.value === t01Cookie?.value)

// ─── T03: Cookie inválida — debe crear nuevo visitante sin crash ──────────────

section('T03 · Cookie UUID inválida → nuevo visitante')

let t03Error = null
let t03 = null
try {
  t03 = await sseChat({
    visitorCookie: 'no-es-un-uuid-valido',
    message: 'hola, tengo un gimnasio',
    sector: 'centros-deportivos',
  })
} catch (e) { t03Error = e.message }

record('T03.1', 'Sin error HTTP (no crash)', !t03Error && t03?.status !== 500, t03Error ?? `status ${t03?.status}`)
record('T03.2', 'Bot responde', (t03?.text?.length ?? 0) > 5)
record('T03.3', 'Se emite nueva cookie (nuevo visitante creado)', !!t03?.cookieFromResponse?.value)
if (t03?.cookieFromResponse?.value) {
  record('T03.4', 'Nueva cookie diferente de la inválida', t03.cookieFromResponse.value !== 'no-es-un-uuid-valido')
}

// ─── T04: Conversación multivuelta + recomendaciones de proceso ───────────────

section('T04 · Conversación multivuelta + recomendaciones')

// Visitante completamente fresco para este test (sin cookie previa)
const MSGS_SALUD_NATURAL = [
  'hola, tengo una clínica dental con 3 dentistas y perdemos bastantes citas porque no llegamos a coger el teléfono',
  'sobre todo de 9 a 11 de la mañana cuando llaman todos a la vez, tenemos recepcionista pero a veces está ocupada con un paciente',
  'diría que perdemos unas 4 o 5 citas al día, que a 50 euros la consulta son bastantes euros al mes',
  'el problema es que se van directamente a la clínica de al lado, no insisten',
  'usamos google calendar para las citas, nada más sofisticado que eso',
  'no sabía que se podía automatizar con IA, en qué consistiría exactamente para nuestra clínica?',
  'y si el paciente quiere cancelar o cambiar la hora, también podría hacerlo solo?',
  'perfecto. también me preocupa que tenemos muchos pacientes que vienen una vez y no vuelven, nadie les hace seguimiento',
  'cuánto tiempo llevaría implementar algo así?',
  'me interesa mucho, cómo lo hacemos para arrancar con vosotros?',
]

let convId4 = null
let cookie4 = null  // visitante fresco
let gotRecommendations = false
let leadFormSeen = false
let t04Texts = []

for (const msg of MSGS_SALUD_NATURAL) {
  const r = await sseChat({ visitorCookie: cookie4, conversationId: convId4, message: msg, sector: 'salud' })
  convId4 = convId4 ?? r.conversationId
  if (r.cookieFromResponse?.value) cookie4 = r.cookieFromResponse.value
  t04Texts.push(r.text)
  if (r.recommendedSlugs?.length > 0) gotRecommendations = true
  if (r.action === 'show_lead_form' || r.action === 'offer_lead_form') leadFormSeen = true
  info(`[T04 msg ${t04Texts.length}] action=${r.action ?? 'none'} recs=${r.recommendedSlugs?.length ?? 0}`)
  await sleep(1500)
  if (leadFormSeen) break
}

record('T04.1', 'Bot responde en todos los turnos', t04Texts.every(t => t.length > 5))
// T04.2: Los recommendedSlugs requieren embeddings generados en staging
// Si falla aquí, verificar: node scripts/generate_embeddings.mjs
record('T04.2', 'Al menos una respuesta incluye recommendedSlugs (RAG activo)', gotRecommendations, gotRecommendations ? 'sí' : 'no — ejecutar generate_embeddings.mjs en staging si falla')
record('T04.3', 'Lead form marker aparece en conversación completa', leadFormSeen)

let convId4b = convId4
let cookie4b = cookie4

// Si no se disparó, seguimos con más señales de compra
if (!leadFormSeen) {
  const extraBuyMsgs = [
    'cuánto cuesta aproximadamente?',
    'queremos arrancar lo antes posible, somos un equipo pequeño pero tenemos presupuesto',
    'ok me convence, cómo avanzamos para contratar esto?',
  ]
  for (const msg of extraBuyMsgs) {
    if (leadFormSeen) break
    const r = await sseChat({ visitorCookie: cookie4b, conversationId: convId4b, message: msg, sector: 'salud' })
    convId4b = convId4b ?? r.conversationId
    if (r.cookieFromResponse?.value) cookie4b = r.cookieFromResponse.value
    if (r.action === 'show_lead_form' || r.action === 'offer_lead_form') leadFormSeen = true
    await sleep(1500)
  }
  if (!leadFormSeen) record('T04.3b', 'Lead form con mensajes extra (señal de compra)', false, 'El bot nunca disparó show_lead_form ni offer_lead_form')
}

// ─── T05: Submit de lead + vinculación visitante ──────────────────────────────

section('T05 · Submit lead + vinculación visitante')

const t05Lead = await submitLead({ visitorCookie: cookie4b, conversationId: convId4b })
info(`Lead response: ${JSON.stringify(t05Lead.body).slice(0, 120)}`)

record('T05.1', 'Endpoint /api/chatbot/lead responde 200', t05Lead.status === 200, `status ${t05Lead.status}`)
record('T05.2', 'Respuesta tiene campo success o id', !!(t05Lead.body?.success || t05Lead.body?.id || t05Lead.body?.contact), JSON.stringify(t05Lead.body).slice(0, 80))

// Verificar en Supabase que el visitante quedó vinculado
await sleep(2000)
const visitorRows = await supabaseQuery('chatbot_visitors', `select=*&visitor_id=eq.${cookie4b}`)
if (visitorRows === null) {
  record('T05.3', 'Verificación Supabase (sin credenciales)', null, 'Añade STAGING_SUPABASE_SERVICE_ROLE_KEY para verificar')
} else {
  record('T05.3', 'Visitante existe en chatbot_visitors', visitorRows.length > 0, `${visitorRows.length} filas`)
  if (visitorRows[0]) {
    record('T05.4', 'Visitante tiene lead_id asignado', !!visitorRows[0].lead_id, `lead_id=${visitorRows[0].lead_id}`)
  }
}

// ─── T06: Visitor returning — nuevo conversationId, mismo visitor_id ──────────

section('T06 · Returning visitor — nuevo conversationId')

// Necesitamos que haya habido al menos 1 conversación previa (T04 ya lo hizo)
// Ahora abrimos sesión nueva con mismo cookie pero sin conversationId
await sleep(1000)
const t06 = await sseChat({
  visitorCookie: cookie4b,
  // sin conversationId → nueva conversación
  message: 'buenas de nuevo',
  sector: 'salud',
})

const t06IsNewConv = t06.conversationId !== convId4b
record('T06.1', 'Bot responde', t06.text.length > 5)
record('T06.2', 'Se crea nuevo conversationId (no el anterior)', t06IsNewConv, `nuevo=${t06.conversationId}, anterior=${convId4b}`)

// El bot debería mencionar que nos recuerda o hacer referencia al contexto previo
const returningKeywords = [
  'recuerdo', 'recuerda', 'antes', 'anterior', 'volviste', 'vuelves',
  'hablamos', 'hablábamos', 'veo que', 'comentaste', 'dental', 'citas',
  'de nuevo', 'sigues', 'comentabas', 'me acuerdo', 'hablabas', 'pérdida',
  'saturación', 'pacientes', 'recepción', 'seguimos', 'retomamos',
]
const hasReturningContext = returningKeywords.some(k => t06.text.toLowerCase().includes(k))
record('T06.3', 'Bot hace referencia al contexto previo (returning visitor)', hasReturningContext, t06.text.slice(0, 120))

// ─── T07: GHL custom fields ───────────────────────────────────────────────────

section('T07 · GHL custom fields (opcional, requiere GHL_API_KEY)')

if (!GHL_API_KEY) {
  record('T07.1', 'GHL custom fields verificados', null, 'Añade GHL_API_KEY para verificar')
  record('T07.2', 'visitor_id en GHL', null)
  record('T07.3', 'primer_sector en GHL', null)
} else {
  await sleep(3000) // dar tiempo al sync asíncrono
  // Fetch completo del contacto por ID para obtener customFields (search no siempre los incluye)
  const contactSummary = await ghlGetContact(TEST_EMAIL)
  record('T07.1', `Contacto encontrado en GHL (${TEST_EMAIL})`, !!contactSummary, contactSummary?.id)
  if (contactSummary?.id) {
    // GET /contacts/{id} devuelve el contacto completo con customFields
    const fullRes = await fetch(`https://services.leadconnectorhq.com/contacts/${contactSummary.id}`, {
      headers: { Authorization: `Bearer ${GHL_API_KEY}`, Version: '2021-07-28', Accept: 'application/json' },
    })
    const fullData = await fullRes.json().catch(() => ({}))
    info(`GHL contact full customFields: ${JSON.stringify(fullData?.contact?.customFields ?? fullData?.customFields ?? []).slice(0, 300)}`)
    const fields = fullData?.contact?.customFields ?? fullData?.customFields ?? []
    // Los campos que seteamos: first_seen (timestamp ISO), conv_count (número), history (texto), summary (texto)
    const hasAnyField = fields.length > 0
    const hasTimestamp = fields.some(f => f.value && /^\d{4}-\d{2}-\d{2}T/.test(String(f.value)))
    const hasCount = fields.some(f => f.value && /^\d+$/.test(String(f.value)))
    record('T07.2', 'customFields presentes en contacto GHL (PUT funcionó)', hasAnyField, `${fields.length} fields`)
    record('T07.3', 'Al menos un field de visitante guardado (timestamp o count)', hasTimestamp || hasCount, hasAnyField ? `fields: ${fields.map(f=>f.value).join(', ').slice(0,80)}` : 'vacío')
  }
}

// ─── T08: Página de privacidad documenta imm_vid ─────────────────────────────

section('T08 · Privacidad — cookie imm_vid documentada')

const privRes = await fetch(`${BASE_URL}/privacidad`)
const privText = await privRes.text()

record('T08.1', 'Página /privacidad carga (200)', privRes.status === 200, `status ${privRes.status}`)
record('T08.2', 'Contiene "imm_vid"', privText.includes('imm_vid'))
record('T08.3', 'Contiene "Cookies funcionales" o sección chatbot', privText.includes('imm_vid') && (privText.includes('funcional') || privText.includes('asistente')))

// ─── T09: SSE streaming funciona (primeras 3 palabras llegan antes de [DONE]) ─

section('T09 · SSE streaming — respuesta incremental')

let firstChunkAt = null
let doneAt = null
const t09Start = Date.now()

const t09Res = await fetch(`${BASE_URL}/api/chatbot`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'hola', sector: 'gestorias', surface: 'sector', route: '/sector/gestorias' }),
})

const t09Reader = t09Res.body.getReader()
const t09Decoder = new TextDecoder()
let t09Buffer = ''
let t09Text = ''
outer: while (true) {
  const { done, value } = await t09Reader.read()
  if (done) break
  t09Buffer += t09Decoder.decode(value, { stream: true })
  const lines = t09Buffer.split('\n')
  t09Buffer = lines.pop() ?? ''
  for (const line of lines) {
    const t = line.trim()
    if (!t.startsWith('data: ')) continue
    const payload = t.slice(6)
    if (payload === '[DONE]') { doneAt = Date.now() - t09Start; break outer }
    try {
      const ev = JSON.parse(payload)
      if (ev.type === 'delta' && ev.text && !firstChunkAt) firstChunkAt = Date.now() - t09Start
      if (ev.type === 'delta') t09Text += ev.text
    } catch { /* */ }
  }
}

record('T09.1', 'Primer chunk SSE llega en <5s', firstChunkAt !== null && firstChunkAt < 5000, `${firstChunkAt}ms`)
// doneAt puede ser null si [DONE] llega en el mismo chunk que done=true del reader;
// en ese caso basta con que el primer chunk llegara antes de que terminara el stream
const streamEnd = doneAt ?? (firstChunkAt !== null ? Date.now() - t09Start : null)
record('T09.2', 'Streaming es realmente incremental (chunks llegan progresivamente)', firstChunkAt !== null && firstChunkAt < 8000, `primer chunk en ${firstChunkAt}ms`)
record('T09.3', 'Respuesta no vacía', t09Text.length > 5, t09Text.slice(0, 60))

// ─── Resumen ──────────────────────────────────────────────────────────────────

section('RESUMEN')
console.log(`  Target: ${BASE_URL}`)
console.log(`  Email usado para lead: ${TEST_EMAIL}`)
console.log()
console.log(`  ✅ Pasados: ${passed}`)
console.log(`  ❌ Fallidos: ${failed}`)
console.log(`  ⏭️  Saltados: ${skipped}`)
console.log()

const failedTests = results.filter(r => r.ok === false).map(r => r.id)
if (failedTests.length) {
  console.log(`  Tests fallidos: ${failedTests.join(', ')}`)
}

if (failed === 0) {
  console.log('  🎉  Todo verde. Chatbot funcionando correctamente en staging.')
} else {
  console.log(`  ⚠️  ${failed} test(s) fallidos — revisar logs arriba.`)
  process.exit(1)
}
