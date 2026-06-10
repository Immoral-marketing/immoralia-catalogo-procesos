// Datos de la auditoría de madurez comercial para desarrolladoras e inmobiliarias.
// Bloques alineados con el catálogo del sector (construccionBlocks): B1 Captación,
// B2 Conversión y cierre, B3 Seguimiento y visitas, B4 Obra y proveedores,
// B5 Finanzas y cobros, B6 Postventa y dirección.

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
    title: "Cuando entra un interesado, sabemos al momento si tiene presupuesto, urgencia y financiación, y el sistema avisa si empieza a enfriarse.",
    help: "1 = Cualquier consulta va directa al equipo, sin filtro ni alertas; 5 = Scoring automático por presupuesto y financiación + alerta de enfriamiento",
    scaleLabels: ["Sin cualificación", "Preguntas básicas", "Formulario", "Scoring parcial", "Scoring + alerta"],
    scaleHints: ["1 — Sin cualificación ni alertas", "5 — Scoring automático y alerta de enfriamiento"],
  },
  {
    type: "scale",
    cat: "Bloque 1 · Captación y cualificación",
    block: "B1",
    title: "Un asistente atiende y cualifica a los interesados 24/7 en la web y WhatsApp, y la dirección ve el estado del pipeline en tiempo real.",
    help: "1 = Nadie responde fuera de horario y el pipeline solo se ve en el informe semanal; 5 = Asistente 24/7 que cualifica + pipeline en tiempo real",
    scaleLabels: ["Nada de esto", "Solo horario laboral", "Web con formulario", "Asistente básico", "Asistente 24/7 + pipeline live"],
    scaleHints: ["1 — Sin atención 24/7 ni pipeline en vivo", "5 — Asistente 24/7 y pipeline en tiempo real"],
  },

  // ─── B2 · Conversión y cierre ───────────────────────────────────────────────
  {
    type: "scale",
    cat: "Bloque 2 · Conversión y cierre",
    block: "B2",
    title: "El equipo resuelve cualquier duda técnica del comprador y le envía en minutos la ficha de la unidad (plano, precio, condiciones) adaptada a su perfil.",
    help: "1 = Los agentes improvisan y tardan más de 30 min en armar el dossier; 5 = Asistente que resuelve dudas al instante y ficha personalizada en minutos",
    scaleLabels: ["Improvisamos", "Docs sueltos", "Plantilla básica", "Ficha rápida", "Asistente + ficha por perfil"],
    scaleHints: ["1 — Improvisación y dossier lento", "5 — Respuesta instantánea y ficha adaptada al perfil"],
  },
  {
    type: "scale",
    cat: "Bloque 2 · Conversión y cierre",
    block: "B2",
    title: "El comprador puede reservar y pagar la señal online, y el contrato de reserva se genera y se envía a firmar automáticamente.",
    help: "1 = Reserva por transferencia manual y contrato que tarda 1-2 días; 5 = Pago de señal online que dispara el contrato a firma digital al instante",
    scaleLabels: ["Todo manual", "Transferencia + papeleo", "Firma digital suelta", "Casi automático", "Pago online → contrato auto"],
    scaleHints: ["1 — Reserva y contrato manuales", "5 — Pago online que dispara el contrato a firma"],
  },

  // ─── B3 · Seguimiento y visitas ──────────────────────────────────────────────
  {
    type: "scale",
    cat: "Bloque 3 · Seguimiento y visitas",
    block: "B3",
    title: "Los interesados que no compran en la primera visita reciben seguimiento personalizado durante los meses de obra.",
    help: "1 = Sin seguimiento o con mensajes genéricos iguales para todos; 5 = Secuencias personalizadas ligadas a los avances reales de la obra",
    scaleLabels: ["Sin seguimiento", "Email genérico", "Secuencias básicas", "Personalizadas", "IA + avances de obra"],
    scaleHints: ["1 — Sin seguimiento tras la primera visita", "5 — Secuencias personalizadas ligadas a la obra"],
  },
  {
    type: "scale",
    cat: "Bloque 3 · Seguimiento y visitas",
    block: "B3",
    title: "La gestión de visitas (agenda, confirmación, recordatorios y seguimiento posterior) es automática y minimiza los no-shows.",
    help: "1 = Agenda manual con no-shows frecuentes y sin seguimiento posterior; 5 = Agendado, recordatorios y seguimiento post-visita totalmente automáticos",
    scaleLabels: ["100% manual", "Parcialmente manual", "Casi automático", "Auto con errores", "Totalmente automático"],
    scaleHints: ["1 — Agenda de visitas completamente manual", "5 — Agendado y seguimiento post-visita automáticos"],
  },

  // ─── B4 · Obra y proveedores ─────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Bloque 4 · Obra y proveedores",
    block: "B4",
    title: "El reporte de avance de obra se genera solo a partir de las fotos y partes de campo, sin armarlo a mano en hojas de cálculo.",
    help: "1 = El informe de avance se monta a mano y tarda días; 5 = Se genera automáticamente desde el parte de campo, en minutos",
    scaleLabels: ["A mano en Excel", "Plantilla manual", "Semi-automático", "Casi automático", "Automático desde campo"],
    scaleHints: ["1 — Reporte de avance manual y lento", "5 — Informe automático desde fotos y partes"],
  },
  {
    type: "scale",
    cat: "Bloque 4 · Obra y proveedores",
    block: "B4",
    title: "Los albaranes y facturas de proveedor se leen y concilian solos, y los permisos y trámites tienen alertas antes de cada vencimiento.",
    help: "1 = Todo se digita a mano y los permisos se controlan en una hoja aparte; 5 = Lectura y conciliación automática + alertas de vencimientos y normativa",
    scaleLabels: ["Todo manual", "Digitación parcial", "Lectura básica", "Conciliación parcial", "Lectura + alertas auto"],
    scaleHints: ["1 — Albaranes a mano y permisos sin control", "5 — Conciliación automática y alertas de vencimiento"],
  },

  // ─── B5 · Finanzas y cobros ──────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Bloque 5 · Finanzas y cobros",
    block: "B5",
    title: "Los cobros de cuotas atrasadas se reclaman automáticamente y cada comprador tiene su estado de cuenta conciliado y al día.",
    help: "1 = Alguien persigue los pagos a mano y cuadra los cobros en Excel; 5 = Recordatorios automáticos y estado de cuenta conciliado solo",
    scaleLabels: ["Persecución manual", "Recordatorios sueltos", "Semi-automático", "Casi automático", "Cobro + conciliación auto"],
    scaleHints: ["1 — Cobranza y conciliación manuales", "5 — Recordatorios y estado de cuenta automáticos"],
  },
  {
    type: "scale",
    cat: "Bloque 5 · Finanzas y cobros",
    block: "B5",
    title: "La factura de cada pago y el reporte a inversionistas (avance comercial, de obra y de caja) se generan sin trabajo manual.",
    help: "1 = Facturas una a una y reportes a socios montados a mano cada vez; 5 = Facturación automática y reporte a inversionistas generado solo",
    scaleLabels: ["Todo a mano", "Plantillas manuales", "Facturación parcial", "Reporte semi-auto", "Facturación + reporte auto"],
    scaleHints: ["1 — Facturas y reportes manuales", "5 — Facturación y reporte a inversionistas automáticos"],
  },

  // ─── B6 · Postventa y dirección ──────────────────────────────────────────────
  {
    type: "scale",
    cat: "Bloque 6 · Postventa y dirección",
    block: "B6",
    title: "Tras la entrega, los propietarios reportan incidencias y consultan sus garantías en un portal con IA, sin saturar al equipo de postventa.",
    help: "1 = Todo el postventa por teléfono y email con el equipo desbordado; 5 = Portal con IA que resuelve buena parte de las incidencias y controla garantías",
    scaleLabels: ["Todo por teléfono", "Email + teléfono", "Formulario básico", "Portal parcial", "Portal con IA + garantías"],
    scaleHints: ["1 — Postventa por teléfono y email", "5 — Portal con IA y control de garantías"],
  },
  {
    type: "scale",
    cat: "Bloque 6 · Postventa y dirección",
    block: "B6",
    title: "Detectamos automáticamente las unidades estancadas con recomendaciones, y la dirección ve el estado de todos los proyectos en un único panel.",
    help: "1 = Las unidades paradas se detectan en la reunión y dirección pide reportes a cada área; 5 = Alertas automáticas con recomendaciones + panel multiproyecto",
    scaleLabels: ["Reunión semanal", "Revisión manual", "Alertas básicas", "Panel parcial", "Alertas + panel multiproyecto"],
    scaleHints: ["1 — Detección manual y reportes a mano", "5 — Alertas con recomendaciones y panel global"],
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
      { k: "A", label: "Captar y cualificar más leads con menos trabajo manual" },
      { k: "B", label: "Convertir y cerrar más rápido: ficha, presentación, pago y contrato" },
      { k: "C", label: "Mantener al comprador activo durante las visitas y la obra" },
      { k: "D", label: "Tener la obra y los proveedores bajo control (avance, albaranes, permisos)" },
      { k: "E", label: "Proteger la caja: cobros, conciliación y reporte a inversionistas" },
      { k: "F", label: "Ordenar la postventa y la visión de dirección" },
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
    name: "Captación y cualificación",
    short: "Scoring de leads, alerta de enfriamiento, asistente 24/7 y pipeline en tiempo real",
    tips: [
      "IA que puntúa cada interesado por presupuesto, urgencia y financiación — antes de que el equipo llame",
      "Asistente 24/7 en web y WhatsApp + dashboard comercial en tiempo real, sin esperar al informe del lunes",
    ],
  },
  B2: {
    id: "B2",
    name: "Conversión y cierre",
    short: "Ficha y presentación por perfil, pago de reserva online y contrato a firma digital",
    tips: [
      "Ficha de unidad y presentación adaptadas al perfil del comprador, generadas en segundos",
      "Pago de la señal de reserva online que dispara el contrato a firma digital automáticamente",
    ],
  },
  B3: {
    id: "B3",
    name: "Seguimiento y visitas",
    short: "Nurturing durante la obra, agenda automática y seguimiento post-visita",
    tips: [
      "Secuencias de seguimiento ligadas a los avances de obra que mantienen al interesado activo durante meses",
      "Agenda de visitas con confirmación, recordatorios y seguimiento posterior automáticos",
    ],
  },
  B4: {
    id: "B4",
    name: "Obra y proveedores",
    short: "Reporte de avance automático, lectura de albaranes, permisos y control documental",
    tips: [
      "Informe de avance de obra generado desde fotos y partes de campo, en minutos",
      "Albaranes y facturas de proveedor leídos y conciliados solos, con alertas de permisos y normativa",
    ],
  },
  B5: {
    id: "B5",
    name: "Finanzas y cobros",
    short: "Cobranza de cuotas, conciliación y estado de cuenta, facturación y reporte a inversionistas",
    tips: [
      "Recordatorios automáticos de cuotas atrasadas y estado de cuenta de cada comprador al día",
      "Facturación automática de cada pago y reporte a inversionistas con avance comercial, obra y caja",
    ],
  },
  B6: {
    id: "B6",
    name: "Postventa y dirección",
    short: "Entrega digital, portal de incidencias con IA, garantías y panel multiproyecto",
    tips: [
      "Portal con IA para propietarios que resuelve incidencias y controla garantías sin saturar al equipo",
      "Detección de unidades estancadas con recomendaciones y panel de dirección con todos los proyectos",
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
  B: "Convertir y cerrar más rápido",
  C: "Mantener al comprador durante visitas y obra",
  D: "Obra y proveedores bajo control",
  E: "Proteger la caja y reportar a inversionistas",
  F: "Mejor postventa y visión de dirección",
};
