// Datos de la auditoría de madurez operativa para promotoras y constructoras.
// Sector: obra nueva, constructoras, reformas y rehabilitación.

import type { Process } from "./processes";

export type CnAuditQuestion =
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
      block: CnAuditBlockId;
      scaleLabels?: [string, string, string, string, string];
      scaleHints?: [string, string];
    };

export type CnAuditBlockId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6";

export interface CnAuditBlock {
  id: CnAuditBlockId;
  name: string;
  short: string;
  tips: string[];
}

export interface CnAuditModule {
  ref: string;
  name: string;
  impact: string;
  desc: string;
}

export interface CnAuditLevel {
  min: number;
  max: number;
  name: string;
  desc: string;
}

export const CN_AUDIT_QUESTIONS: CnAuditQuestion[] = [
  // ─── Contexto (scoreless) ───────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cómo describirías mejor tu empresa?",
    help: "Selecciona el que más se aproxima.",
    options: [
      { k: "A", label: "Promotora de obra nueva (residencial)" },
      { k: "B", label: "Constructora-promotora (construimos y vendemos)" },
      { k: "C", label: "Empresa de reformas y rehabilitación" },
      { k: "D", label: "Estudio de arquitectura + promoción propia" },
    ],
    scoreless: true,
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cuántas unidades tiene tu promoción activa (o la media de tus proyectos)?",
    options: [
      { k: "A", label: "Menos de 20 unidades" },
      { k: "B", label: "De 20 a 60 unidades" },
      { k: "C", label: "De 60 a 150 unidades" },
      { k: "D", label: "Más de 150 unidades o varias promociones simultáneas" },
    ],
    scoreless: true,
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Por qué canales entran los leads hoy?",
    help: "Puedes seleccionar varios.",
    options: [
      { k: "A", label: "Portales inmobiliarios (Idealista, Fotocasa...)" },
      { k: "B", label: "Redes sociales o publicidad digital" },
      { k: "C", label: "Web propia o landing de la promoción" },
      { k: "D", label: "Referidos o boca a boca" },
      { k: "E", label: "Agencias colaboradoras" },
    ],
    scoreless: true,
    multiselect: true,
  },

  // ─── B1 · Captación y cualificación ─────────────────────────────────────────
  {
    type: "scale",
    cat: "Bloque 1 · Captación y cualificación",
    block: "B1",
    title: "Cuando llega un lead, sabemos si tiene presupuesto, urgencia y financiación antes de que el equipo dedique tiempo.",
    help: "1 = Sin cualificación previa, cualquier consulta va directamente al equipo; 5 = Scoring automático filtra por presupuesto y financiación real",
    scaleLabels: ["Sin cualificación", "Preguntas básicas", "Formulario", "Scoring parcial", "Scoring automático"],
    scaleHints: ["1 — Sin cualificación previa al primer contacto", "5 — Scoring automático por presupuesto y financiación"],
  },
  {
    type: "scale",
    cat: "Bloque 1 · Captación y cualificación",
    block: "B1",
    title: "La dirección comercial tiene el estado del pipeline actualizado sin esperar al informe semanal.",
    help: "1 = Solo disponible en el informe semanal o la reunión de equipo; 5 = Pipeline en tiempo real accesible desde el móvil en cualquier momento",
    scaleLabels: ["Nunca disponible", "Informe semanal", "2-3 veces/semana", "Diario", "Tiempo real"],
    scaleHints: ["1 — Solo disponible en el informe semanal", "5 — Pipeline en tiempo real siempre accesible"],
  },

  // ─── B2 · Conversión y argumentación ────────────────────────────────────────
  {
    type: "scale",
    cat: "Bloque 2 · Conversión y argumentación",
    block: "B2",
    title: "Nuestros agentes pueden responder dudas técnicas del comprador (materiales, plazos, financiación) sin improvisar.",
    help: "1 = Los agentes improvisan o llaman a alguien ante dudas técnicas; 5 = Asistente IA resuelve cualquier duda técnica al instante en la visita",
    scaleLabels: ["Siempre improvisamos", "A veces preparados", "Docs básicos", "Base de conocimiento", "Asistente con IA"],
    scaleHints: ["1 — Los agentes siempre improvisan", "5 — Asistente IA listo para cualquier duda técnica"],
  },
  {
    type: "scale",
    cat: "Bloque 2 · Conversión y argumentación",
    block: "B2",
    title: "Cuando un comprador pide información de una unidad, el agente se la envía en menos de 5 minutos con el plano, precio actualizado y condiciones.",
    help: "1 = Más de 30 minutos buscando documentos y preparando el dossier; 5 = Dossier completo con plano, precio y condiciones generado en menos de 5 minutos",
    scaleLabels: ["30+ minutos", "15-30 minutos", "5-15 minutos", "Casi siempre en 5", "Siempre en <5 min"],
    scaleHints: ["1 — Más de 30 minutos buscando documentos", "5 — Dossier completo generado en menos de 5 minutos"],
  },

  // ─── B3 · Seguimiento y visitas ──────────────────────────────────────────────
  {
    type: "scale",
    cat: "Bloque 3 · Seguimiento y visitas",
    block: "B3",
    title: "Los leads que no compran en la primera visita reciben seguimiento personalizado durante los meses de comercialización.",
    help: "1 = Sin seguimiento tras la visita o con mensajes genéricos iguales para todos; 5 = Secuencias personalizadas automáticas según perfil y fase del embudo",
    scaleLabels: ["Sin seguimiento", "Email genérico", "Secuencias básicas", "Personalizadas", "IA + contexto de obra"],
    scaleHints: ["1 — Sin seguimiento tras la primera visita", "5 — Secuencias personalizadas por perfil y fase de obra"],
  },
  {
    type: "scale",
    cat: "Bloque 3 · Seguimiento y visitas",
    block: "B3",
    title: "La gestión de visitas al piso piloto (agenda, confirmación, recordatorios) es automática y no consume tiempo del equipo.",
    help: "1 = Agenda de visitas completamente manual con no-shows frecuentes; 5 = Confirmación y recordatorios automáticos, no-shows prácticamente inexistentes",
    scaleLabels: ["100% manual", "Parcialmente manual", "Casi automático", "Auto con errores", "Totalmente automático"],
    scaleHints: ["1 — Agenda de visitas completamente manual", "5 — Confirmación y recordatorios totalmente automáticos"],
  },

  // ─── B4 · Cierre y contratación ─────────────────────────────────────────────
  {
    type: "scale",
    cat: "Bloque 4 · Cierre y contratación",
    block: "B4",
    title: "Cuando un cliente decide comprar, el contrato de reserva se genera y se envía a firmar en menos de una hora.",
    help: "1 = El contrato tarda 1-2 días en prepararse de forma manual; 5 = Generado automáticamente y enviado a firmar en menos de 1 hora",
    scaleLabels: ["1-2 días", "Varias horas", "1-2 horas", "Casi siempre <1h", "Siempre <1h auto"],
    scaleHints: ["1 — El contrato tarda 1-2 días en prepararse", "5 — Generado y enviado a firmar en menos de 1 hora"],
  },
  {
    type: "scale",
    cat: "Bloque 4 · Cierre y contratación",
    block: "B4",
    title: "Los compradores que ya han reservado reciben comunicación regular sobre el avance de obra sin que nadie lo gestione manualmente.",
    help: "1 = Los compradores no reciben noticias hasta que preguntan; 5 = Comunicación automática de cada hito sin intervención del equipo",
    scaleLabels: ["Sin comunicar", "Email ocasional", "Mensual manual", "Automático básico", "Personalizado y auto"],
    scaleHints: ["1 — Los compradores no reciben actualizaciones de obra", "5 — Comunicación automática de hitos y progreso"],
  },

  // ─── B5 · Postventa ─────────────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Bloque 5 · Postventa y propietarios",
    block: "B5",
    title: "Cuando entregamos una vivienda, los propietarios pueden reportar incidencias y consultar garantías sin colapsar al equipo de postventa.",
    help: "1 = Todo el postventa por teléfono y email con el equipo desbordado; 5 = Portal con IA que resuelve el 70% de incidencias sin intervención humana",
    scaleLabels: ["Todo por teléfono", "Email + teléfono", "Formulario básico", "Portal parcial", "Portal con IA"],
    scaleHints: ["1 — Todo el postventa por teléfono y email", "5 — Portal con IA que resuelve el 70% sin intervención"],
  },

  // ─── B6 · Operativa diaria ───────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Bloque 6 · Operativa diaria",
    block: "B6",
    title: "Cuando una unidad lleva tiempo sin movimiento, el equipo lo detecta automáticamente y tiene recomendaciones de qué hacer.",
    help: "1 = Solo se detecta en la reunión semanal o al revisar el CRM a mano; 5 = Alertas automáticas con análisis de causa y recomendaciones de reactivación",
    scaleLabels: ["Reunión semanal", "Revisión manual", "Alertas básicas", "Alertas + datos", "Auto + recomendaciones"],
    scaleHints: ["1 — Solo se detecta en la reunión semanal", "5 — Alertas automáticas con recomendaciones de reactivación"],
  },

  // ─── Madurez digital (scoreless) ────────────────────────────────────────────
  {
    type: "choice",
    cat: "Madurez digital",
    title: "¿Cuántas de estas herramientas digitales usáis de forma activa?",
    help: "Puedes seleccionar varias.",
    options: [
      { k: "A", label: "CRM inmobiliario (Salesforce, HubSpot, Inmoweb...)" },
      { k: "B", label: "Plataforma de firma digital (DocuSign, Signaturit...)" },
      { k: "C", label: "Marketing automation para leads y nurturing" },
      { k: "D", label: "Software de gestión y seguimiento de obra" },
      { k: "E", label: "Herramienta de reporting y analytics del pipeline" },
      { k: "F", label: "Portal de propietarios para postventa e incidencias" },
    ],
    scoreless: true,
    multiselect: true,
  },

  // ─── Riesgo de concentración (scoreless) ─────────────────────────────────────
  {
    type: "choice",
    cat: "Riesgo de concentración",
    title: "¿Qué porcentaje de las ventas depende de los 3 principales agentes colaboradores (APIs)?",
    options: [
      { k: "A", label: "Menos del 20% — canal diversificado" },
      { k: "B", label: "Del 20 al 40%" },
      { k: "C", label: "Del 40 al 60%" },
      { k: "D", label: "Más del 60% — alta dependencia de agentes colaboradores" },
    ],
    scoreless: true,
  },

  // ─── Calidad y certificaciones (scoreless) ───────────────────────────────────
  {
    type: "choice",
    cat: "Calidad y certificaciones",
    title: "¿Cuáles de estas certificaciones o avales tiene vuestra empresa?",
    help: "Puedes seleccionar varias.",
    options: [
      { k: "A", label: "ISO 9001 (gestión de calidad)" },
      { k: "B", label: "Certificación de construcción sostenible (BREEAM, LEED, Passivhaus...)" },
      { k: "C", label: "Promotor inscrito en registro oficial de promotores" },
      { k: "D", label: "Seguro decenal documentado y comunicado al comprador" },
      { k: "E", label: "Ninguna aún" },
    ],
    scoreless: true,
    multiselect: true,
  },

  // ─── Resiliencia (scoreless) ─────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Resiliencia",
    title: "Si un proveedor o subcontrata clave parase abruptamente, ¿cuánto tardaría la obra en normalizarse?",
    options: [
      { k: "A", label: "1-3 días — tenemos alternativas identificadas" },
      { k: "B", label: "1-2 semanas" },
      { k: "C", label: "Aproximadamente 1 mes" },
      { k: "D", label: "Más de 1 mes — dependencia total de ese proveedor" },
    ],
    scoreless: true,
  },

  // ─── Prioridad (scoreless) ───────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Prioridad",
    title: "¿Cuáles son tus prioridades en los próximos 6 meses?",
    help: "Puedes seleccionar varias.",
    options: [
      { k: "A", label: "Conseguir y cualificar más leads con menos trabajo manual" },
      { k: "B", label: "Mejorar la conversión visita a reserva" },
      { k: "C", label: "Reducir el tiempo de cierre y el papeleo documental" },
      { k: "D", label: "Mantener a los compradores comprometidos durante la obra" },
      { k: "E", label: "Gestionar mejor el postventa y las incidencias de garantía" },
    ],
    scoreless: true,
    priority: true,
    multiselect: true,
  },

  // ─── Inversión (scoreless) ───────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cuánto invertís actualmente en captación y marketing al mes?",
    options: [
      { k: "A", label: "Menos de 2.000 €" },
      { k: "B", label: "Entre 2.000 y 5.000 €" },
      { k: "C", label: "Entre 5.000 y 15.000 €" },
      { k: "D", label: "Más de 15.000 €" },
      { k: "E", label: "Prefiero no responder" },
    ],
    scoreless: true,
  },
];

export const CN_AUDIT_BLOCKS: Record<CnAuditBlockId, CnAuditBlock> = {
  B1: {
    id: "B1",
    name: "Captación y cualificación de leads",
    short: "Scoring automático, detección de riesgo y pipeline en tiempo real",
    tips: [
      "IA que puntúa cada lead por presupuesto, urgencia y financiación — antes de que el equipo llame",
      "Dashboard comercial en tiempo real sin esperar al informe del lunes",
    ],
  },
  B2: {
    id: "B2",
    name: "Conversión y argumentación comercial",
    short: "Asistente digital, dossier instantáneo y resumen de llamadas al CRM",
    tips: [
      "Asistente en web que atiende y educa al comprador antes del primer contacto humano",
      "Dossier de unidad generado en segundos — plano, precio y condiciones siempre actualizados",
    ],
  },
  B3: {
    id: "B3",
    name: "Seguimiento y visitas",
    short: "Nurturing durante la obra, agenda automática y seguimiento post-visita",
    tips: [
      "Secuencias de seguimiento contextuales que mantienen el lead activo durante meses",
      "Agenda de visitas con confirmación, recordatorios y check-in automático",
    ],
  },
  B4: {
    id: "B4",
    name: "Cierre y contratación",
    short: "Firma digital, contratos automáticos y comunicación post-reserva",
    tips: [
      "Contratos de reserva generados y enviados a firmar en menos de una hora",
      "Comunicación automática de hitos de obra para que el comprador no se enfríe",
    ],
  },
  B5: {
    id: "B5",
    name: "Postventa y propietarios",
    short: "Portal de incidencias, gestión de garantías y predicción de problemas",
    tips: [
      "Portal con IA que resuelve el 70% de consultas de propietarios sin saturar al equipo técnico",
      "Ticketing estructurado de incidencias con priorización y trazabilidad completa",
    ],
  },
  B6: {
    id: "B6",
    name: "Operativa diaria",
    short: "Identificación de unidades estancadas y recomendaciones estratégicas",
    tips: [
      "Detección automática de unidades sin movimiento con análisis de causa raíz",
      "Recomendaciones de reactivación basadas en datos de mercado para dirección",
    ],
  },
};

export function buildCnModulesByBlock(
  allProcesses: Process[]
): Record<CnAuditBlockId, CnAuditModule[]> {
  const cn = allProcesses.filter(
    (p) => p.landing_slug === "construccion" && p.bloque_negocio && !p.hidden
  );
  const result = {} as Record<CnAuditBlockId, CnAuditModule[]>;
  for (const b of CN_AUDIT_BLOCK_KEYS) {
    result[b] = cn
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

export const CN_AUDIT_LEVELS: CnAuditLevel[] = [
  {
    min: 0,
    max: 39,
    name: "Operativa reactiva",
    desc: "Tu comercialización depende de que alguien esté pendiente de cada lead en cada momento. Hay tiempo, oportunidades y compradores escurriéndose por varios frentes. Es el punto donde activar dos o tres módulos tiene impacto visible en el siguiente ciclo de ventas.",
  },
  {
    min: 40,
    max: 59,
    name: "En transición",
    desc: "Tienes algunas piezas montadas pero el sistema todavía no se sostiene solo. La oportunidad está en cerrar los huecos — cualificación, seguimiento y documentación — para que la promoción avance bien incluso cuando el equipo está saturado.",
  },
  {
    min: 60,
    max: 79,
    name: "Comercialización sistematizada",
    desc: "Tu operativa ya cubre los frentes principales. La siguiente capa de valor está en la inteligencia: visibilidad real del pipeline, nurturing activo durante meses y un postventa que no depende de llamadas manuales.",
  },
  {
    min: 80,
    max: 100,
    name: "Promotora de referencia",
    desc: "Estás en el percentil alto de la promoción inmobiliaria moderna. La conversación ahora es de optimización fina: personalización de experiencias por perfil de comprador, predicción de unidades en riesgo y escalado del sistema a nuevas promociones.",
  },
];

export const CN_AUDIT_BLOCK_KEYS: CnAuditBlockId[] = ["B1", "B2", "B3", "B4", "B5", "B6"];

// Mapas para el payload de GHL
export const CN_AUDIT_TIPO_EMPRESA: Record<string, string> = {
  A: "Promotora de obra nueva",
  B: "Constructora-promotora",
  C: "Empresa de reformas y rehabilitación",
  D: "Arquitectura + promoción propia",
};

export const CN_AUDIT_NUM_UNIDADES: Record<string, string> = {
  A: "Menos de 20 unidades",
  B: "De 20 a 60 unidades",
  C: "De 60 a 150 unidades",
  D: "Más de 150 / varias promociones",
};

export const CN_AUDIT_CANALES_LEADS: Record<string, string> = {
  A: "Portales inmobiliarios",
  B: "Redes sociales / digital",
  C: "Web propia / landing",
  D: "Referidos",
  E: "Agencias colaboradoras",
};

export const CN_AUDIT_PRIORIDADES: Record<string, string> = {
  A: "Más leads con menos trabajo manual",
  B: "Mejorar conversión visita a reserva",
  C: "Reducir papeleo y tiempo de cierre",
  D: "Mantener compradores durante la obra",
  E: "Mejor postventa y garantías",
};
