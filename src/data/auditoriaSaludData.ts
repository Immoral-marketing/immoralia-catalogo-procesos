// Datos de la auditoría de madurez operativa para centros de salud privados.
// Sector: clínicas dentales, fisioterapia, estética, veterinaria, médicos, multi-especialidad.

import type { Process } from "./processes";

export type SaAuditQuestion =
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
      block: SaAuditBlockId;
      /** Etiquetas personalizadas para los 5 puntos de la escala. */
      scaleLabels?: [string, string, string, string, string];
      /** Texto bajo la escala (extremos). */
      scaleHints?: [string, string];
    };

export type SaAuditBlockId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6";

export interface SaAuditBlock {
  id: SaAuditBlockId;
  name: string;
  short: string;
  tips: string[];
}

export interface SaAuditModule {
  ref: string;
  name: string;
  impact: string;
  desc: string;
}

export interface SaAuditLevel {
  min: number;
  max: number;
  name: string;
  desc: string;
}

export const SA_AUDIT_QUESTIONS: SaAuditQuestion[] = [
  // ─── Contexto (scoreless) ───────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Qué tipo de centro de salud diriges?",
    scoreless: true,
    options: [
      { k: "A", label: "Clínica dental" },
      { k: "B", label: "Fisioterapia / rehabilitación" },
      { k: "C", label: "Estética / medicina estética" },
      { k: "D", label: "Veterinaria" },
      { k: "E", label: "Medicina general / especialidades" },
      { k: "F", label: "Multi-especialidad o grupo clínico" },
    ],
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cuántas citas gestionáis en una semana normal?",
    scoreless: true,
    options: [
      { k: "A", label: "Menos de 50 citas" },
      { k: "B", label: "Entre 50 y 150 citas" },
      { k: "C", label: "Entre 150 y 300 citas" },
      { k: "D", label: "Más de 300 citas / varias sedes" },
    ],
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Por qué canales contactan habitualmente los nuevos pacientes?",
    scoreless: true,
    multiselect: true,
    options: [
      { k: "A", label: "Web propia / formularios" },
      { k: "B", label: "Instagram / redes sociales" },
      { k: "C", label: "WhatsApp" },
      { k: "D", label: "Teléfono" },
      { k: "E", label: "Referidos / boca a boca" },
    ],
  },
  // ─── B1 Captación y agenda ───────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Captación y agenda",
    title:
      "¿Qué pasa cuando un paciente escribe o llama fuera del horario del centro? ¿Con qué frecuencia esas consultas acaban en una cita reservada?",
    help: "1 = Se responde al día siguiente y muchos no esperan; 5 = Chatbot cualifica al instante y reserva huecos disponibles",
    block: "B1",
    scaleLabels: ["Día siguiente", "Tarde", "Horas", "Rápido", "Al instante"],
    scaleHints: ["1 — Sin respuesta hasta el día siguiente", "5 — Chatbot da cita al instante"],
  },
  {
    type: "scale",
    cat: "Captación y agenda",
    title:
      "¿Pueden los pacientes confirmar, cambiar o cancelar su cita por WhatsApp o web sin necesidad de llamar a recepción?",
    help: "1 = Todo pasa por llamada; 5 = El paciente gestiona su cita 100% digital y sin intervención del equipo",
    block: "B1",
    scaleLabels: ["Solo llamada", "Poco digital", "A medias", "Casi digital", "100% digital"],
    scaleHints: ["1 — Solo por teléfono o en persona", "5 — Todo desde el móvil sin intervención"],
  },
  // ─── B2 Gestión de citas ─────────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Gestión de citas",
    title:
      "¿Cuántos huecos se quedan vacíos cada semana por cancelaciones? ¿Tienes un sistema que los llena automáticamente desde una lista de espera?",
    help: "1 = Los huecos se pierden sin más; 5 = Lista de espera activa que cubre cualquier cancelación en minutos",
    block: "B2",
    scaleLabels: ["Se pierden", "Rara vez", "A veces", "Casi siempre", "Lista activa"],
    scaleHints: ["1 — Huecos perdidos sin más", "5 — Lista de espera llena en minutos"],
  },
  {
    type: "scale",
    cat: "Gestión de citas",
    title:
      "Cuando un profesional falta a última hora, ¿cuánto tarda el equipo en reasignar las citas y avisar a los pacientes afectados?",
    help: "1 = Horas de llamadas y caos en recepción; 5 = El sistema reasigna y avisa automáticamente en minutos",
    block: "B2",
    scaleLabels: ["Horas", "30 min", "15 min", "5 min", "Automático"],
    scaleHints: ["1 — Horas de llamadas en recepción", "5 — Reasignación y aviso automáticos"],
  },
  // ─── B3 Reputación y comunicación ───────────────────────────────────────────
  {
    type: "scale",
    cat: "Reputación y comunicación",
    title:
      "¿Qué porcentaje de tus pacientes satisfechos acaba dejando reseña en Google? ¿Tienes un sistema que se la pide justo después de la visita?",
    help: "1 = Casi nadie deja reseña y no se les pide; 5 = Solicitud automática post-visita con muy alta tasa de conversión",
    block: "B3",
    scaleLabels: ["Casi nadie", "Muy pocos", "Algunos", "Bastantes", "Sistema activo"],
    scaleHints: ["1 — Sin sistema de solicitud", "5 — Solicitud automática post-visita"],
  },
  {
    type: "scale",
    cat: "Reputación y comunicación",
    title:
      "¿El centro recuerda proactivamente a cada paciente cuándo debería volver para su revisión, o es el paciente quien tiene que acordarse?",
    help: "1 = El paciente llama cuando quiere (o no vuelve); 5 = Recordatorio personalizado automático en el momento exacto",
    block: "B3",
    scaleLabels: ["Nunca", "Raramente", "A veces", "Casi siempre", "Automático"],
    scaleHints: ["1 — El paciente llama si quiere", "5 — Recordatorio personalizado automático"],
  },
  // ─── B4 Retención de pacientes ───────────────────────────────────────────────
  {
    type: "scale",
    cat: "Retención de pacientes",
    title:
      "¿Tienes identificados los pacientes que llevan más tiempo del habitual sin venir y los contactas de forma personalizada antes de que se vayan a la competencia?",
    help: "1 = No se hace; 5 = Detección automática con secuencia de reactivación personalizada",
    block: "B4",
    scaleLabels: ["Nunca", "Si se acuerdan", "A veces", "Casi siempre", "Automático"],
    scaleHints: ["1 — No se hace nada", "5 — Detección y secuencia automática"],
  },
  {
    type: "scale",
    cat: "Retención de pacientes",
    title:
      "¿Recoges feedback de los pacientes después de los tratamientos de forma sistemática y actúas sobre esa información antes de que escale a una queja?",
    help: "1 = Solo cuando el paciente se queja directamente; 5 = Encuesta automática post-tratamiento con alertas de insatisfacción",
    block: "B4",
    scaleLabels: ["Nunca", "Si se quejan", "A veces", "Regular", "Sistemático"],
    scaleHints: ["1 — Solo cuando se quejan directamente", "5 — Encuesta automática con alertas"],
  },
  // ─── B5 Administración ───────────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Administración",
    title:
      "¿El ciclo completo de cobro —facturas a mutuas, recordatorios de pago y seguimiento de impagos— funciona sin que el equipo tenga que intervenir manualmente?",
    help: "1 = Todo manual, facturas perdidas y cobros perseguidos; 5 = Completamente automatizado con visibilidad financiera diaria",
    block: "B5",
    scaleLabels: ["Todo manual", "Parcial", "A medias", "Casi auto", "Automático"],
    scaleHints: ["1 — Facturas y cobros perseguidos a mano", "5 — Ciclo completo automatizado"],
  },
  // ─── B6 Equipo y personal ────────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Equipo y personal",
    title:
      "¿Cuánto tiempo dedica el equipo cada semana a gestionar turnos, comunicar cambios de horario y cubrir bajas del personal?",
    help: "1 = Más de 5 horas semanales en WhatsApp y llamadas; 5 = Sistema automatizado, cada profesional recibe su turno y confirma",
    block: "B6",
    scaleLabels: ["5+ horas", "3-5 h", "1-3 h", "Menos 1 h", "Automático"],
    scaleHints: ["1 — Más de 5 horas semanales en gestión", "5 — Cada profesional recibe y confirma turno"],
  },
  // ─── Madurez digital (scoreless) ────────────────────────────────────────────
  {
    type: "choice",
    cat: "Madurez digital",
    title: "¿Qué sistemas digitales usáis hoy para gestionar el centro?",
    scoreless: true,
    options: [
      { k: "A", label: "Agenda en papel o Excel sin software específico" },
      { k: "B", label: "Software básico de citas (Doctoralia, Calendly o similar)" },
      { k: "C", label: "Software clínico completo (iClinic, Gesden, Clinicalia…)" },
      { k: "D", label: "Software clínico + CRM para comunicación con pacientes" },
      { k: "E", label: "Suite completa integrada con automatizaciones y panel de gestión" },
    ],
  },
  // ─── Dependencia de seguros / mutuas (scoreless) ─────────────────────────────
  {
    type: "choice",
    cat: "Riesgo de dependencia",
    title: "¿Qué porcentaje de vuestra facturación viene de seguros médicos y mutuas (vs paciente privado)?",
    scoreless: true,
    options: [
      { k: "A", label: "Menos del 20% — mayoría paciente privado directo" },
      { k: "B", label: "Entre el 20% y el 40%" },
      { k: "C", label: "Entre el 40% y el 60%" },
      { k: "D", label: "Más del 60% — alta dependencia de mutuas y seguros" },
    ],
  },
  // ─── Acreditaciones (scoreless multiselect) ──────────────────────────────────
  {
    type: "choice",
    cat: "Calidad y acreditaciones",
    title: "¿Qué certificaciones o acreditaciones tenéis activas en el centro?",
    scoreless: true,
    multiselect: true,
    options: [
      { k: "A", label: "ISO 9001 — Gestión de calidad" },
      { k: "B", label: "Acreditación sanitaria regional o nacional" },
      { k: "C", label: "Adecuación al RGPD / ENS — Protección de datos sanitarios" },
      { k: "D", label: "Certificación específica de especialidad (SEPA, SEC…)" },
      { k: "E", label: "Registro en plataformas de salud verificadas (Doctoralia, etc.)" },
      { k: "F", label: "Ninguna por ahora" },
    ],
  },
  // ─── Resiliencia (scoreless) ─────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Resiliencia",
    title: "Si mañana falta la recepcionista o coordinadora principal, ¿qué pasa?",
    scoreless: true,
    options: [
      { k: "A", label: "Caos — toda la agenda y los protocolos dependen de ella" },
      { k: "B", label: "Hay un backup parcial pero se nota mucho su ausencia" },
      { k: "C", label: "Hay un backup formado que puede cubrirla sin problemas" },
      { k: "D", label: "Todo está documentado y el centro funciona con cualquier persona del equipo" },
    ],
  },
  // ─── Prioridades (scoreless) ─────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cuál es el problema que más te urge resolver ahora mismo?",
    scoreless: true,
    priority: true,
    options: [
      { k: "A", label: "Captar más pacientes nuevos y responder sin depender del horario" },
      { k: "B", label: "Reducir ausencias y aprovechar mejor la agenda" },
      { k: "C", label: "Mejorar la reputación online y reactivar pacientes inactivos" },
      { k: "D", label: "Automatizar cobros y reducir el trabajo administrativo" },
      { k: "E", label: "Mejorar la gestión de turnos y la comunicación con el equipo" },
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

export const SA_AUDIT_BLOCKS: Record<SaAuditBlockId, SaAuditBlock> = {
  B1: {
    id: "B1",
    name: "Captación y agenda",
    short: "Canales de entrada, chatbot 24/7 y reserva de citas sin recepción",
    tips: [
      "El paciente que no recibe respuesta en la primera hora tiene un 70% de probabilidades de reservar en otra clínica",
      "Un chatbot bien configurado responde dudas, cualifica y da cita incluso a las 11 de la noche",
    ],
  },
  B2: {
    id: "B2",
    name: "Gestión de citas",
    short: "Confirmaciones, lista de espera y reasignaciones automáticas",
    tips: [
      "Una lista de espera activa puede recuperar entre 4 y 8 horas de agenda perdidas cada semana sin esfuerzo del equipo",
      "El 60% de los pacientes prefiere confirmar o cancelar por WhatsApp — dárselo reduce ausencias un 30%",
    ],
  },
  B3: {
    id: "B3",
    name: "Reputación y comunicación",
    short: "Reseñas en Google, recordatorios de revisión y mensajes automatizados",
    tips: [
      "Pedir la reseña 24-48h post-visita puede triplicar la tasa de conversión respecto a pedirla en recepción",
      "Un recordatorio de revisión enviado en el momento exacto recupera entre un 15 y un 25% de pacientes que ya no volverían",
    ],
  },
  B4: {
    id: "B4",
    name: "Retención de pacientes",
    short: "Reactivación de inactivos, encuestas y detección temprana de insatisfacción",
    tips: [
      "Recuperar un paciente inactivo cuesta entre 5 y 8 veces menos que captar uno nuevo",
      "Detectar insatisfacción antes de que el paciente cambie de centro es la diferencia entre perderle y resolverlo",
    ],
  },
  B5: {
    id: "B5",
    name: "Administración",
    short: "Facturación a mutuas, cobros y visibilidad financiera diaria",
    tips: [
      "Automatizar recordatorios de pago y seguimiento de mutuas puede recuperar más de 5 horas semanales de administración",
      "Un parte matutino con ingresos, ausencias y alertas de impago da control total sin abrir ningún sistema",
    ],
  },
  B6: {
    id: "B6",
    name: "Equipo y personal",
    short: "Turnos, bajas, sustituciones y onboarding del personal sanitario",
    tips: [
      "Eliminar el grupo de WhatsApp de turnos y enviar horarios individuales con confirmación evita confusiones y ausencias no cubiertas",
      "Una baja de última hora no tiene que arruinar el día del coordinador: la sustitución y reasignación de citas puede gestionarse automáticamente",
    ],
  },
};

export const SA_AUDIT_LEVELS: SaAuditLevel[] = [
  {
    min: 0,
    max: 39,
    name: "Clínica reactiva",
    desc: "Tu centro depende de que alguien esté disponible en cada momento para gestionar citas, responder consultas y perseguir cobros. Captación por llamadas, confirmaciones manuales y reseñas que nadie pide. Es el punto donde activar dos o tres módulos tiene impacto visible antes del próximo trimestre.",
  },
  {
    min: 40,
    max: 59,
    name: "En transición",
    desc: "Tienes algunas piezas montadas pero el sistema todavía depende demasiado del equipo. La oportunidad está en cerrar los huecos: automatizar confirmaciones, activar la lista de espera y que los cobros no requieran persecución manual.",
  },
  {
    min: 60,
    max: 79,
    name: "Centro sistematizado",
    desc: "Tu operativa ya cubre los frentes principales. La siguiente capa de valor está en la retención inteligente: detectar señales de abandono antes de que el paciente se vaya, solicitar reseñas en el momento exacto y convertir a los satisfechos en embajadores del centro.",
  },
  {
    min: 80,
    max: 100,
    name: "Centro de referencia",
    desc: "Estás en el percentil alto de la salud privada moderna. La conversación ahora es de optimización fina: personalización por perfil de paciente, predicción de abandono con semanas de antelación y escalar el sistema a nuevas especialidades o sedes.",
  },
];

export const SA_AUDIT_BLOCK_KEYS: SaAuditBlockId[] = ["B1", "B2", "B3", "B4", "B5", "B6"];

export function buildSaModulesByBlock(
  allProcesses: Process[]
): Record<SaAuditBlockId, SaAuditModule[]> {
  const sa = allProcesses.filter(
    (p) => p.landing_slug === "salud" && p.bloque_negocio && !p.hidden
  );
  const result = {} as Record<SaAuditBlockId, SaAuditModule[]>;
  for (const b of SA_AUDIT_BLOCK_KEYS) {
    result[b] = sa
      .filter((p) => p.bloque_negocio === b)
      .sort((a, c) => (a.modulo_codigo ?? "").localeCompare(c.modulo_codigo ?? ""))
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
export const SA_AUDIT_TIPO_CENTRO: Record<string, string> = {
  A: "Clínica dental",
  B: "Fisioterapia / rehabilitación",
  C: "Estética / medicina estética",
  D: "Veterinaria",
  E: "Medicina general / especialidades",
  F: "Multi-especialidad o grupo clínico",
};

export const SA_AUDIT_NUM_CITAS: Record<string, string> = {
  A: "Menos de 50 citas",
  B: "Entre 50 y 150 citas",
  C: "Entre 150 y 300 citas",
  D: "Más de 300 citas / varias sedes",
};

export const SA_AUDIT_CANALES: Record<string, string> = {
  A: "Web propia / formularios",
  B: "Instagram / redes sociales",
  C: "WhatsApp",
  D: "Teléfono",
  E: "Referidos / boca a boca",
};

export const SA_AUDIT_PRIORIDADES: Record<string, string> = {
  A: "Captar más pacientes nuevos y responder sin depender del horario",
  B: "Reducir ausencias y aprovechar mejor la agenda",
  C: "Mejorar la reputación online y reactivar pacientes inactivos",
  D: "Automatizar cobros y reducir el trabajo administrativo",
  E: "Mejorar la gestión de turnos y la comunicación con el equipo",
};
