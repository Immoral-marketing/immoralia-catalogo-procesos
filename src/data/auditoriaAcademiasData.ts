// Datos de la auditoría de madurez operativa para academias y centros de formación.
// Sector: idiomas, FP, oposiciones, autoescuelas, refuerzo escolar, música/artes.

import type { Process } from "./processes";

export type AcAuditQuestion =
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
      block: AcAuditBlockId;
      scaleLabels?: [string, string, string, string, string];
      scaleHints?: [string, string];
    };

export type AcAuditBlockId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6";

export interface AcAuditBlock {
  id: AcAuditBlockId;
  name: string;
  short: string;
  tips: string[];
}

export interface AcAuditModule {
  ref: string;
  name: string;
  impact: string;
  desc: string;
}

export interface AcAuditLevel {
  min: number;
  max: number;
  name: string;
  desc: string;
}

export const AC_AUDIT_QUESTIONS: AcAuditQuestion[] = [
  // ─── Contexto (scoreless) ───────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Qué tipo de academia o centro de formación diriges?",
    scoreless: true,
    options: [
      { k: "A", label: "Idiomas (inglés, francés, alemán…)" },
      { k: "B", label: "Formación profesional / oposiciones" },
      { k: "C", label: "Autoescuela" },
      { k: "D", label: "Refuerzo escolar" },
      { k: "E", label: "Música, danza o artes" },
      { k: "F", label: "Multi-área o campus" },
    ],
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cuántos alumnos activos tiene actualmente tu academia?",
    scoreless: true,
    options: [
      { k: "A", label: "Menos de 100 alumnos" },
      { k: "B", label: "De 100 a 300 alumnos" },
      { k: "C", label: "De 300 a 700 alumnos" },
      { k: "D", label: "Más de 700 / varias sedes" },
    ],
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Por qué canales llegan habitualmente los nuevos interesados?",
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
  // ─── B1 Captación de alumnos ─────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Captación de alumnos",
    title:
      "¿Qué pasa cuando alguien escribe o llama a tu academia fuera del horario de secretaría? ¿Cuántas de esas consultas tienen respuesta antes del día siguiente?",
    help: "1 = Casi ninguna, se responde al día siguiente; 5 = El sistema responde y cualifica al instante",
    block: "B1",
    scaleLabels: ["Sin respuesta", "Día siguiente", "Misma noche", "En pocas horas", "Al instante"],
    scaleHints: ["1 — Sin respuesta fuera de horario", "5 — Respuesta y cualificación automática 24/7"],
  },
  {
    type: "scale",
    cat: "Captación de alumnos",
    title:
      "¿Tienes visibilidad en tiempo real de todos los leads activos: de dónde vinieron, en qué punto del proceso están y qué se les ha comunicado?",
    help: "1 = Es caótico, se pierden leads por varios canales; 5 = Panel centralizado y actualizado automáticamente",
    block: "B1",
    scaleLabels: ["Sin visibilidad", "Notas dispersas", "Parcialmente", "Panel manual", "Auto centralizado"],
    scaleHints: ["1 — Leads dispersos y caóticos por canales", "5 — Panel centralizado actualizado en tiempo real"],
  },
  // ─── B2 Matriculación y onboarding ───────────────────────────────────────────
  {
    type: "scale",
    cat: "Matriculación y onboarding",
    title:
      "¿Puede un alumno nuevo completar la matrícula —firma, documentación, pago— y recibir el welcome pack sin que nadie de tu equipo tenga que intervenir?",
    help: "1 = Todo depende de una cita o gestión manual; 5 = 100% digital y automático",
    block: "B2",
    scaleLabels: ["Siempre presencial", "Papel + email", "A medias", "Casi digital", "100% automático"],
    scaleHints: ["1 — Todo el proceso depende de gestión manual", "5 — Alta y bienvenida 100% digital y automática"],
  },
  {
    type: "scale",
    cat: "Matriculación y onboarding",
    title:
      "¿Cuántas horas dedica tu equipo cada semana a perseguir mensualidades, gestionar impagos y actualizar el estado de pagos?",
    help: "1 = Más de 5 horas semanales; 5 = No se hace, está completamente automatizado",
    block: "B2",
    scaleLabels: ["5+ h/semana", "3-5 h/semana", "1-3 h/semana", "Pocas horas", "Automatizado"],
    scaleHints: ["1 — Más de 5 horas semanales persiguiendo cobros", "5 — Gestión de cobros completamente automatizada"],
  },
  // ─── B3 Comunicación ─────────────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Comunicación",
    title:
      "¿Los padres y alumnos reciben avisos automáticos de asistencia, cambios de horario y próximos exámenes sin que el equipo tenga que enviarlos manualmente?",
    help: "1 = Todo se comunica a mano cuando alguien se acuerda; 5 = Comunicación proactiva 100% automatizada",
    block: "B3",
    scaleLabels: ["Todo manual", "Parcialmente", "Avisos básicos", "Casi auto", "100% automatizado"],
    scaleHints: ["1 — Todo se comunica a mano cuando alguien se acuerda", "5 — Comunicación proactiva 100% automatizada"],
  },
  {
    type: "scale",
    cat: "Comunicación",
    title:
      "¿Tienes algún sistema que recoja feedback de alumnos y padres de forma regular y detecte insatisfacción antes de que el alumno decida darse de baja?",
    help: "1 = Nos enteramos cuando ya se han ido; 5 = Detección temprana con acción automática",
    block: "B3",
    scaleLabels: ["Sin sistema", "Encuestas anuales", "Trimestrales", "Frecuentes", "Detección proactiva"],
    scaleHints: ["1 — Las bajas llegan de sorpresa", "5 — Detección temprana con acción automática"],
  },
  // ─── B4 Retención y reactivación ─────────────────────────────────────────────
  {
    type: "scale",
    cat: "Retención y reactivación",
    title:
      "¿Tienes un sistema que detecte cuándo un alumno empieza a desengancharse —más faltas, menos respuesta, pagos tardíos— y activa automáticamente una respuesta antes de que pida la baja?",
    help: "1 = Las bajas llegan de sorpresa; 5 = Detección y retención completamente automatizadas",
    block: "B4",
    scaleLabels: ["Sin sistema", "Lo intuimos tarde", "Revisión manual", "Alertas básicas", "Retención automática"],
    scaleHints: ["1 — Las bajas llegan siempre de sorpresa", "5 — Detección y retención completamente automatizadas"],
  },
  {
    type: "scale",
    cat: "Retención y reactivación",
    title:
      "¿Contactas de forma sistemática y personalizada a exalumnos para que vuelvan, o a los alumnos más satisfechos para que recomienden la academia?",
    help: "1 = Nunca se hace; 5 = Secuencias automatizadas según perfil y tiempo desde la baja",
    block: "B4",
    scaleLabels: ["Nunca", "Raramente", "A veces manual", "Con secuencias", "Auto personalizado"],
    scaleHints: ["1 — Nunca se contacta a exalumnos", "5 — Secuencias automáticas por perfil y tiempo desde la baja"],
  },
  // ─── B5 Administración ───────────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Administración",
    title:
      "¿El ciclo completo de cobro de mensualidades —aviso previo, confirmación de pago y escalado de impagos— funciona sin intervención manual del equipo?",
    help: "1 = Todo manual por teléfono o WhatsApp; 5 = Completamente automatizado",
    block: "B5",
    scaleLabels: ["100% manual", "Parcialmente", "Recordatorios auto", "Casi auto", "Completamente auto"],
    scaleHints: ["1 — Todo el ciclo de cobro es manual", "5 — Ciclo completo de cobro automatizado"],
  },
  // ─── B6 Profesorado ──────────────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Gestión del profesorado",
    title:
      "Cuando un profesor falta a última hora, ¿cuánto tarda en gestionarse la sustitución y comunicarse el cambio a los alumnos?",
    help: "1 = Horas de caos, llamadas y grupos de WhatsApp; 5 = El sistema lo gestiona en minutos de forma autónoma",
    block: "B6",
    scaleLabels: ["Horas de caos", "30-60 minutos", "15-30 minutos", "Minutos (manual)", "Automático"],
    scaleHints: ["1 — Horas de caos con llamadas y grupos de WhatsApp", "5 — Sustitución gestionada en minutos automáticamente"],
  },

  // ─── Madurez digital (scoreless) ────────────────────────────────────────────
  {
    type: "choice",
    cat: "Madurez digital",
    title: "¿Cuántas de estas herramientas digitales usáis de forma activa?",
    help: "Puedes seleccionar varias.",
    options: [
      { k: "A", label: "Software de gestión académica (SGA) o ERP de academia" },
      { k: "B", label: "Plataforma de firma electrónica para matrículas" },
      { k: "C", label: "CRM para seguimiento de leads y captación" },
      { k: "D", label: "Herramienta de email o WhatsApp automático" },
      { k: "E", label: "Aula virtual o app de aprendizaje" },
      { k: "F", label: "Reporting automático de cobros y asistencia" },
    ],
    scoreless: true,
    multiselect: true,
  },

  // ─── Riesgo de concentración (scoreless) ─────────────────────────────────────
  {
    type: "choice",
    cat: "Riesgo de concentración",
    title: "¿Qué porcentaje de los ingresos depende de un único curso, programa o franja de edad?",
    options: [
      { k: "A", label: "Menos del 20% — oferta diversificada" },
      { k: "B", label: "Del 20 al 40%" },
      { k: "C", label: "Del 40 al 60%" },
      { k: "D", label: "Más del 60% — fuerte dependencia de un solo programa" },
    ],
    scoreless: true,
  },

  // ─── Calidad y acreditaciones (scoreless) ────────────────────────────────────
  {
    type: "choice",
    cat: "Calidad y acreditaciones",
    title: "¿Cuáles de estas acreditaciones o reconocimientos tiene vuestra academia?",
    help: "Puedes seleccionar varias.",
    options: [
      { k: "A", label: "Centro oficial de exámenes (Cambridge, DELF, EOI, Trinity...)" },
      { k: "B", label: "Certificación de calidad educativa (ISO, Q de Calidad...)" },
      { k: "C", label: "Acreditación para formación para el empleo (SEPE/FUNDAE)" },
      { k: "D", label: "Colaboración formalizada con institutos o universidades" },
      { k: "E", label: "Ninguna aún" },
    ],
    scoreless: true,
    multiselect: true,
  },

  // ─── Resiliencia (scoreless) ─────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Resiliencia",
    title: "Si un profesor clave causara baja mañana, ¿cuánto tardaría la academia en continuar con normalidad?",
    options: [
      { k: "A", label: "Sin problema — tenemos sustitutos identificados y protocolos" },
      { k: "B", label: "1-2 días de ajuste" },
      { k: "C", label: "Aproximadamente 1 semana" },
      { k: "D", label: "Más de 1 semana — dependencia alta de ese docente" },
    ],
    scoreless: true,
  },

  // ─── Prioridades (scoreless) ─────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cuál es el problema que más te urge resolver ahora mismo?",
    scoreless: true,
    priority: true,
    options: [
      { k: "A", label: "Conseguir más alumnos con menos trabajo de captación" },
      { k: "B", label: "Simplificar el proceso de matriculación y el papeleo" },
      { k: "C", label: "Mejorar la comunicación con padres y alumnos" },
      { k: "D", label: "Reducir la tasa de abandono y recuperar exalumnos" },
      { k: "E", label: "Automatizar cobros y liberar tiempo de administración" },
    ],
  },
  // ─── Inversión (scoreless) ───────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Qué inversión mensual contemplas para automatizar procesos en tu academia?",
    scoreless: true,
    options: [
      { k: "A", label: "Menos de 300 €/mes" },
      { k: "B", label: "Entre 300 € y 600 €/mes" },
      { k: "C", label: "Entre 600 € y 1.200 €/mes" },
      { k: "D", label: "Más de 1.200 €/mes" },
    ],
  },
];

export const AC_AUDIT_BLOCKS: Record<AcAuditBlockId, AcAuditBlock> = {
  B1: {
    id: "B1",
    name: "Captación de alumnos",
    short: "Canales de captación, gestión de leads y respuesta 24/7",
    tips: [
      "Centraliza todos los canales en un único flujo: el lead que llega a las 9 de la noche por Instagram no puede perderse",
      "Un chatbot bien configurado responde el 80% de las consultas y filtra a los interesados reales antes de que lleguen al asesor",
    ],
  },
  B2: {
    id: "B2",
    name: "Matriculación y onboarding",
    short: "Alta digital, firma, documentación y bienvenida del alumno",
    tips: [
      "Matrícula 100% digital: el alumno firma, sube docs y recibe el welcome pack sin que nadie tenga que intervenir",
      "El primer día del alumno marca su percepción de la academia — automatizar la bienvenida es la mejor inversión en retención",
    ],
  },
  B3: {
    id: "B3",
    name: "Comunicación",
    short: "Avisos de asistencia, calendario académico y feedback continuo",
    tips: [
      "Los avisos de asistencia y los recordatorios de exámenes en automático eliminan el 90% de las llamadas de padres",
      "Una encuesta breve tras cada clase detecta problemas de calidad antes de que escalen a una baja",
    ],
  },
  B4: {
    id: "B4",
    name: "Retención y reactivación",
    short: "Detección temprana de abandono, reactivación y programa de referidos",
    tips: [
      "Un alumno que acumula más faltas de lo habitual o deja de abrir los mensajes ya está enviando señales de baja — actúa antes",
      "Recuperar un exalumno cuesta entre 5 y 10 veces menos que captar uno nuevo: la secuencia de reactivación se paga sola",
    ],
  },
  B5: {
    id: "B5",
    name: "Administración",
    short: "Mensualidades, impagos y visibilidad financiera diaria",
    tips: [
      "Automatizar los recordatorios de mensualidades recupera más de 4 horas semanales del equipo",
      "Un reporte matutino con alumnos activos, cobros del día y alertas de impago da el control sin abrir ningún sistema",
    ],
  },
  B6: {
    id: "B6",
    name: "Gestión del profesorado",
    short: "Horarios, sustituciones y onboarding del equipo docente",
    tips: [
      "Eliminar los grupos de WhatsApp de profesores y enviar horarios individuales con confirmación evita confusiones y ausencias no cubiertas",
      "Una baja de última hora no tiene que arruinar el día del coordinador: la sustitución se puede gestionar automáticamente",
    ],
  },
};

export const AC_AUDIT_LEVELS: AcAuditLevel[] = [
  {
    min: 0,
    max: 39,
    name: "Operativa reactiva",
    desc: "Tu academia depende de que alguien esté pendiente de cada alumno en cada momento. Captación por canales sueltos, matrículas en papel, mensualidades perseguidas por teléfono y comunicación manual. Es el punto donde activar dos o tres módulos tiene impacto visible antes del próximo trimestre.",
  },
  {
    min: 40,
    max: 59,
    name: "En transición",
    desc: "Tienes algunas piezas montadas pero el sistema todavía no se sostiene solo. La oportunidad está en cerrar los huecos: centralizar la captación, digitalizar la matriculación y que los cobros no dependan de que alguien se acuerde de hacerlos.",
  },
  {
    min: 60,
    max: 79,
    name: "Academia sistematizada",
    desc: "Tu operativa ya cubre los frentes principales. La siguiente capa de valor está en la retención inteligente: detectar señales de abandono antes de que el alumno pida la baja, activar la reactivación de exalumnos y convertir a los satisfechos en embajadores.",
  },
  {
    min: 80,
    max: 100,
    name: "Academia de referencia",
    desc: "Estás en el percentil alto de la formación privada moderna. La conversación ahora es de optimización fina: personalización por perfil de alumno, predicción de bajas con semanas de antelación y escalar el sistema a nuevas sedes.",
  },
];

export const AC_AUDIT_BLOCK_KEYS: AcAuditBlockId[] = ["B1", "B2", "B3", "B4", "B5", "B6"];

export function buildAcModulesByBlock(
  allProcesses: Process[]
): Record<AcAuditBlockId, AcAuditModule[]> {
  const ac = allProcesses.filter(
    (p) => p.landing_slug === "academias" && p.bloque_negocio && !p.hidden
  );
  const result = {} as Record<AcAuditBlockId, AcAuditModule[]>;
  for (const b of AC_AUDIT_BLOCK_KEYS) {
    result[b] = ac
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
export const AC_AUDIT_TIPO_ACADEMIA: Record<string, string> = {
  A: "Idiomas",
  B: "Formación profesional / oposiciones",
  C: "Autoescuela",
  D: "Refuerzo escolar",
  E: "Música, danza o artes",
  F: "Multi-área o campus",
};

export const AC_AUDIT_NUM_ALUMNOS: Record<string, string> = {
  A: "Menos de 100 alumnos",
  B: "De 100 a 300 alumnos",
  C: "De 300 a 700 alumnos",
  D: "Más de 700 / varias sedes",
};

export const AC_AUDIT_CANALES: Record<string, string> = {
  A: "Web propia / formularios",
  B: "Instagram / redes sociales",
  C: "WhatsApp",
  D: "Teléfono",
  E: "Referidos / boca a boca",
};

export const AC_AUDIT_PRIORIDADES: Record<string, string> = {
  A: "Conseguir más alumnos con menos trabajo de captación",
  B: "Simplificar el proceso de matriculación y el papeleo",
  C: "Mejorar la comunicación con padres y alumnos",
  D: "Reducir la tasa de abandono y recuperar exalumnos",
  E: "Automatizar cobros y liberar tiempo de administración",
};
