/**
 * SPEC-01 — Motor conversacional v3.
 * Constantes del motor. Los límites vienen fijados por la spec aprobada.
 */

export const CHAT_MODEL = 'gpt-4o-mini'
export const EMBEDDING_MODEL = 'text-embedding-3-small'

/** Caducidad rolling de la conversación (días sin actividad) */
export const CONVERSATION_EXPIRY_DAYS = 7

/** Ventana de mensajes íntegros que se envían al modelo */
export const HISTORY_WINDOW = 12

/**
 * Nº mínimo de mensajes (user+bot) para generar el primer resumen estructurado.
 * 4 = a partir del 2º turno del usuario. Antes el primer resumen esperaba a que
 * hubiera mensajes fuera de la ventana (mensaje ~18): la mayoría de conversaciones
 * nunca llegaban y structured_summary quedaba NULL — rompiendo el contexto de
 * visitante recurrente (SPEC-11), el historial de GHL y el resumen de ClickUp.
 */
export const SUMMARY_MIN_MESSAGES = 4
/** El resumen se refresca cuando hay este nº de mensajes nuevos desde el último (2 = cada turno) */
export const SUMMARY_REFRESH_EVERY = 2

/** Límites anti-abuso (SPEC-01, ambigüedad 3) */
export const MAX_MESSAGE_LENGTH = 2000
export const MAX_MESSAGES_PER_CONVERSATION_PER_HOUR = 30
export const MAX_MESSAGES_PER_IP_PER_DAY = 100

export const SECTOR_NAMES: Record<string, string> = {
  'centros-deportivos': 'Centros Deportivos',
  'gestorias': 'Gestorías',
  'salud': 'Centros de Salud',
  'construccion': 'Construcción & Inmobiliaria',
  'academias': 'Academias y Formación',
  'gastronomia-hosteleria': 'Gastronomía y Hostelería',
  'industrial': 'Industrial',
}

export const FRIENDLY_ERROR_MESSAGE =
  'Ha habido un problema técnico generando la respuesta. Vuelve a intentarlo en unos segundos, por favor.'

/** SPEC-03 — Captura de leads */
export const HARD_LIMIT_TURNS = 5
/** Marcadores que el modelo añade al FINAL de su respuesta; se eliminan del texto y se convierten en acciones estructuradas */
export const LEAD_FORM_MARKER = '[[LEAD_FORM]]'
export const HANDOVER_MARKER = '[[HANDOVER]]'
/** Holdback del streaming: caracteres retenidos para que un marcador parcial nunca llegue al cliente */
export const STREAM_HOLDBACK_CHARS = 32

/**
 * Fallback determinista del trigger semántico: si el MENSAJE DEL USUARIO expresa
 * intención clara, la acción se dispara aunque el modelo olvide el marcador.
 */
export const HANDOVER_INTENT_REGEX =
  /hablar con (una persona|alguien|un humano|el equipo|un comercial|un consultor)|atienda una persona|persona real|humano por favor|agendar (una )?llamada|quiero (una )?llamada|podemos (hablar|llamar|agendar)|reservar (una )?llamada/i

export const LEAD_INTENT_REGEX =
  /cu[aá]nto (cuesta|vale|costar[ií]a)|precio|presupuesto|contact[eé]is|contactarme|contactadme|escribidme|ll[aá]mame|llamadme|quiero (empezar|contratar|que me llam)|c[oó]mo (empezamos|lo contrato|contratar)|me interesa (contratar|empezar|implantar|implementar)|agendar (una )?llamada|p[oó]nte en contacto|poneos en contacto/i
