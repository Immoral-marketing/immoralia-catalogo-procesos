// Datos de la auditoría de madurez operativa para centros deportivos.
// Sector: gimnasios, crossfit, yoga, natación, artes marciales, academias deportivas.

import type { Process } from "./processes";

export type DpAuditQuestion =
  | {
      type: "choice";
      cat: string;
      title: string;
      help?: string;
      options: { k: string; label: string }[];
      scoreless?: true;
      multiselect?: boolean;
      priority?: boolean;
    }
  | {
      type: "scale";
      cat: string;
      title: string;
      help?: string;
      block: DpAuditBlockId;
    };

export type DpAuditBlockId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6";

export interface DpAuditBlock {
  id: DpAuditBlockId;
  name: string;
  short: string;
  tips: string[];
}

export interface DpAuditModule {
  ref: string;
  name: string;
  impact: string;
  desc: string;
}

export interface DpAuditLevel {
  min: number;
  max: number;
  name: string;
  desc: string;
}

export const DP_AUDIT_QUESTIONS: DpAuditQuestion[] = [
  // ─── Contexto (scoreless) ───────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Qué tipo de centro deportivo diriges?",
    scoreless: true,
    options: [
      { k: "A", label: "Gimnasio con equipamiento / fitness" },
      { k: "B", label: "CrossFit / funcional / artes marciales" },
      { k: "C", label: "Yoga / pilates / danza / mente-cuerpo" },
      { k: "D", label: "Piscina / natación / acuáticos" },
      { k: "E", label: "Academia deportiva / deporte federado" },
      { k: "F", label: "Centro multidisciplinar / varias especialidades" },
    ],
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cuántos socios activos tenéis actualmente?",
    scoreless: true,
    options: [
      { k: "A", label: "Menos de 100 socios" },
      { k: "B", label: "Entre 100 y 300 socios" },
      { k: "C", label: "Entre 300 y 700 socios" },
      { k: "D", label: "Más de 700 socios / varias sedes" },
    ],
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Por qué canal contactan habitualmente los nuevos socios?",
    scoreless: true,
    multiselect: true,
    options: [
      { k: "A", label: "Web propia / formularios online" },
      { k: "B", label: "Instagram / redes sociales" },
      { k: "C", label: "WhatsApp" },
      { k: "D", label: "Teléfono" },
      { k: "E", label: "Referidos de socios actuales" },
    ],
  },
  // ─── B1 Reservas y acceso 24/7 ──────────────────────────────────────────────
  {
    type: "scale",
    cat: "Reservas y acceso 24/7",
    title:
      "¿Qué pasa cuando alguien escribe fuera de tu horario para preguntar por tarifas o reservar una clase de prueba? ¿Cuántos de esos contactos acaban convirtiéndose en alta?",
    help: "1 = Se responde al día siguiente y muchos no esperan; 5 = Chatbot cualifica al instante y reserva una sesión de prueba sin que intervenga nadie",
    block: "B1",
  },
  {
    type: "scale",
    cat: "Reservas y acceso 24/7",
    title:
      "¿Pueden los socios reservar, cancelar o cambiar su clase desde el móvil sin llamar a recepción?",
    help: "1 = Todo pasa por llamada o presencialmente; 5 = El socio gestiona sus reservas 100% digital sin intervención del equipo",
    block: "B1",
  },
  // ─── B2 Captación y conversión ──────────────────────────────────────────────
  {
    type: "scale",
    cat: "Captación y conversión",
    title:
      "Cuando alguien rellena tu formulario o escribe por Instagram pidiendo información, ¿cuánto tarda en recibir respuesta útil y cuántos acaban dándose de alta?",
    help: "1 = Respuesta manual cuando alguien lo ve, muchos se pierden; 5 = Seguimiento automatizado desde el primer contacto con alta tasa de conversión",
    block: "B2",
  },
  {
    type: "scale",
    cat: "Captación y conversión",
    title:
      "¿Tienes algún sistema para recuperar a personas que vinieron a probar o se dieron de baja y no volvieron?",
    help: "1 = No se hace nada; 5 = Secuencia automática que recupera un porcentaje significativo de pruebas no convertidas y ex-socios",
    block: "B2",
  },
  // ─── B3 Fidelización y retención ────────────────────────────────────────────
  {
    type: "scale",
    cat: "Fidelización y retención",
    title:
      "¿Sabes en tiempo real qué socios llevan días sin venir y tienes un sistema que los contacta antes de que se den de baja?",
    help: "1 = Te enteras cuando ya han causado baja; 5 = Detección automática de riesgo de abandono con mensaje preventivo personalizado",
    block: "B3",
  },
  {
    type: "scale",
    cat: "Fidelización y retención",
    title:
      "¿Las cuotas mensuales se cobran automáticamente y, cuando un pago falla, el sistema avisa al socio y reintenta sin que nadie del equipo tenga que gestionarlo?",
    help: "1 = Los cobros fallidos los persigues tú a mano; 5 = Cobro automático con reintentos y aviso inmediato al socio sin intervención",
    block: "B3",
  },
  // ─── B4 Operativa del centro ────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Operativa del centro",
    title:
      "¿Cómo se gestionan los turnos de los instructores, los cambios de horario y las sustituciones cuando falta alguien a última hora?",
    help: "1 = Todo por WhatsApp en grupo, llamadas de última hora y caos; 5 = Sistema automatizado con turnos individuales, confirmaciones y sustituciones sin intervención tuya",
    block: "B4",
  },
  {
    type: "scale",
    cat: "Operativa del centro",
    title:
      "¿Tienes visibilidad del rendimiento del centro — nuevas altas, bajas, cobros, ocupación — sin tener que construirlo manualmente?",
    help: "1 = Tienes que entrar en varios sistemas y montarlo a mano; 5 = Resumen automático semanal con los KPIs clave enviado a tu móvil",
    block: "B4",
  },
  // ─── B5 Reputación y comunidad ──────────────────────────────────────────────
  {
    type: "scale",
    cat: "Reputación y comunidad",
    title:
      "¿Qué porcentaje de socios satisfechos acaba dejando una reseña en Google? ¿Tienes un sistema que se la pide justo después del alta o de una clase?",
    help: "1 = Casi nadie deja reseña y nadie se las pide; 5 = Solicitud automática post-clase con alta tasa de conversión a reseña 5 estrellas",
    block: "B5",
  },
  // ─── B6 Marketing y contenido ───────────────────────────────────────────────
  {
    type: "scale",
    cat: "Marketing y contenido",
    title:
      "¿Tu Instagram y Google My Business están activos con novedades, horarios y campañas estacionales, sin que alguien del equipo tenga que gestionarlo manualmente cada semana?",
    help: "1 = Semanas sin publicar o dependiendo de que alguien se acuerde; 5 = Contenido generado y publicado automáticamente con campañas de captación en los picos del año",
    block: "B6",
  },
  // ─── Prioridades (scoreless) ─────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cuál es el problema que más te urge resolver ahora mismo?",
    scoreless: true,
    priority: true,
    options: [
      { k: "A", label: "Captar más socios nuevos y no perder leads por falta de respuesta rápida" },
      { k: "B", label: "Reducir bajas y alargar el tiempo de vida del socio" },
      { k: "C", label: "Acabar con el caos de cobros fallidos y perseguir impagos" },
      { k: "D", label: "Ordenar turnos, horarios y operativa interna del centro" },
      { k: "E", label: "Mejorar la presencia online y la captación en picos de temporada" },
    ],
  },
  // ─── Inversión (scoreless) ───────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Qué inversión mensual contemplas para automatizar procesos en tu centro?",
    scoreless: true,
    options: [
      { k: "A", label: "Menos de 300 €/mes" },
      { k: "B", label: "Entre 300 € y 600 €/mes" },
      { k: "C", label: "Entre 600 € y 1.200 €/mes" },
      { k: "D", label: "Más de 1.200 €/mes" },
    ],
  },
];

export const DP_AUDIT_BLOCKS: Record<DpAuditBlockId, DpAuditBlock> = {
  B1: {
    id: "B1",
    name: "Reservas y acceso 24/7",
    short: "Chatbot, reservas sin recepción y respuesta instantánea a nuevos contactos",
    tips: [
      "El interesado que no recibe respuesta en la primera hora tiene un 70% de probabilidades de llamar a otro centro",
      "Un chatbot bien configurado responde dudas, cualifica y reserva sesiones de prueba incluso a las 11 de la noche",
    ],
  },
  B2: {
    id: "B2",
    name: "Captación y conversión",
    short: "Conversión de leads, programa de referidos y recuperación de ex-socios",
    tips: [
      "Seguir a un lead en las primeras 24h multiplica por 3 la probabilidad de que se dé de alta",
      "Una secuencia de reactivación de ex-socios bien diseñada recupera entre el 10 y el 20% antes de los 90 días",
    ],
  },
  B3: {
    id: "B3",
    name: "Fidelización y retención",
    short: "Riesgo de baja, cobros automáticos, bonos y cuotas",
    tips: [
      "Detectar a un socio en riesgo de baja con 2 semanas de antelación permite actuar antes de que tome la decisión",
      "Automatizar los cobros fallidos reduce la morosidad hasta un 40% y libera horas de gestión administrativa",
    ],
  },
  B4: {
    id: "B4",
    name: "Operativa del centro",
    short: "Turnos de instructores, KPIs semanales, contratos y onboarding de personal",
    tips: [
      "Sustituir el grupo de WhatsApp de turnos por turnos individuales con confirmación elimina los conflictos de último momento",
      "Un resumen automático semanal con altas, bajas y cobros pendientes da control total en 2 minutos",
    ],
  },
  B5: {
    id: "B5",
    name: "Reputación y comunidad",
    short: "Reseñas en Google, encuestas de satisfacción y gestión de quejas",
    tips: [
      "Pedir la reseña 24-48h después del alta o de una clase destacada puede triplicar la tasa de respuesta",
      "Responder a las reseñas negativas en menos de 24h reduce el impacto percibido y puede convertir al quejoso en embajador",
    ],
  },
  B6: {
    id: "B6",
    name: "Marketing y contenido",
    short: "Publicaciones en redes sociales y campañas estacionales automatizadas",
    tips: [
      "Enero, septiembre y junio son los picos de captación — una campaña que se lanza sola en el momento exacto vale más que 10 posts sueltos",
      "Centros que publican 3+ veces por semana en Instagram reciben un 40% más de consultas orgánicas que los que lo hacen de forma irregular",
    ],
  },
};

export const DP_AUDIT_LEVELS: DpAuditLevel[] = [
  {
    min: 0,
    max: 39,
    name: "Centro reactivo",
    desc: "Tu centro funciona porque hay personas pendientes de todo en todo momento. La captación depende de quien esté disponible, los cobros fallidos se persiguen a mano y la agenda se lleva en la cabeza. Es el punto donde activar dos o tres módulos tiene impacto visible antes del próximo trimestre.",
  },
  {
    min: 40,
    max: 59,
    name: "En transición",
    desc: "Tienes algunas piezas montadas pero el sistema todavía depende demasiado del equipo. La oportunidad está en cerrar los huecos: automatizar cobros fallidos, activar la recuperación de ex-socios y que los turnos lleguen solos a cada instructor.",
  },
  {
    min: 60,
    max: 79,
    name: "Centro sistematizado",
    desc: "Tu operativa ya cubre los frentes principales. La siguiente capa está en la retención inteligente: detectar señales de baja antes de que el socio se vaya, solicitar reseñas en el momento justo y captar en los picos de temporada con campañas que se lanzan solas.",
  },
  {
    min: 80,
    max: 100,
    name: "Centro de referencia",
    desc: "Estás en el percentil alto de los centros deportivos modernos. La conversación ahora es de optimización fina: personalización por perfil de socio, predicción de bajas con semanas de antelación y escalar el modelo a nuevas ubicaciones o franquicias.",
  },
];

export const DP_AUDIT_BLOCK_KEYS: DpAuditBlockId[] = ["B1", "B2", "B3", "B4", "B5", "B6"];

export function buildDpModulesByBlock(
  allProcesses: Process[]
): Record<DpAuditBlockId, DpAuditModule[]> {
  const dp = allProcesses.filter(
    (p) => p.landing_slug === "centros-deportivos" && p.bloque_negocio && !p.hidden
  );
  const result = {} as Record<DpAuditBlockId, DpAuditModule[]>;
  for (const b of DP_AUDIT_BLOCK_KEYS) {
    result[b] = dp
      .filter((p) => p.bloque_negocio === b)
      .sort((a, c) => (a.modulo_codigo ?? "").localeCompare(c.modulo_codigo ?? "", undefined, { numeric: true }))
      .map((p) => ({
        ref: `Módulo ${p.modulo_codigo ?? p.codigo}`,
        name: p.nombre,
        desc: p.descripcionDetallada,
        impact: p.tagline,
      }));
  }
  return result;
}

// ─── Mapas para el payload de GHL ────────────────────────────────────────────
export const DP_AUDIT_TIPO_CENTRO: Record<string, string> = {
  A: "Gimnasio con equipamiento / fitness",
  B: "CrossFit / funcional / artes marciales",
  C: "Yoga / pilates / danza / mente-cuerpo",
  D: "Piscina / natación / acuáticos",
  E: "Academia deportiva / deporte federado",
  F: "Centro multidisciplinar / varias especialidades",
};

export const DP_AUDIT_NUM_SOCIOS: Record<string, string> = {
  A: "Menos de 100 socios",
  B: "Entre 100 y 300 socios",
  C: "Entre 300 y 700 socios",
  D: "Más de 700 socios / varias sedes",
};

export const DP_AUDIT_CANALES: Record<string, string> = {
  A: "Web propia / formularios online",
  B: "Instagram / redes sociales",
  C: "WhatsApp",
  D: "Teléfono",
  E: "Referidos de socios actuales",
};

export const DP_AUDIT_PRIORIDADES: Record<string, string> = {
  A: "Captar más socios nuevos y no perder leads por falta de respuesta rápida",
  B: "Reducir bajas y alargar el tiempo de vida del socio",
  C: "Acabar con el caos de cobros fallidos y perseguir impagos",
  D: "Ordenar turnos, horarios y operativa interna del centro",
  E: "Mejorar la presencia online y la captación en picos de temporada",
};
