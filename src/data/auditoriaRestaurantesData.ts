// Datos de la auditoría de madurez operativa para restaurantes.
// Migrado desde el lead magnet de Vercel para vivir dentro del catálogo.
// Mantiene el scoring, las preguntas y los módulos del MVP original.

export type AuditQuestion =
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
      block: AuditBlockId;
      scaleLabels?: [string, string, string, string, string];
      scaleHints?: [string, string];
    };

export type AuditBlockId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6";

export interface AuditBlock {
  id: AuditBlockId;
  name: string;
  short: string;
  tips: string[];
}

export interface AuditModule {
  ref: string;
  name: string;
  impact: string;
  desc: string;
}

export interface AuditLevel {
  min: number;
  max: number;
  name: string;
  desc: string;
}

export const AUDIT_QUESTIONS: AuditQuestion[] = [
  // Contexto (scoreless)
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Qué tipo de establecimiento describes mejor?",
    help: "Selecciona el que más se aproxima.",
    options: [
      { k: "A", label: "Restaurante gastronómico o de cocina de autor" },
      { k: "B", label: "Restaurante de cocina tradicional / informal" },
      { k: "C", label: "Bar-restaurante o gastrobar" },
      { k: "D", label: "Beach club, chiringuito o restaurante con temporada marcada" },
      { k: "E", label: "Grupo con varios locales" },
    ],
    scoreless: true,
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cuántas mesas tiene el local principal (o la media del grupo)?",
    options: [
      { k: "A", label: "Menos de 20 mesas" },
      { k: "B", label: "De 20 a 40 mesas" },
      { k: "C", label: "De 40 a 80 mesas" },
      { k: "D", label: "Más de 80 mesas o con aforo de eventos" },
    ],
    scoreless: true,
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cuántos locales gestiona el grupo?",
    options: [
      { k: "A", label: "1 local" },
      { k: "B", label: "2 a 3 locales" },
      { k: "C", label: "4 o más locales" },
    ],
    scoreless: true,
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Por qué canales entran las reservas hoy?",
    help: "Puedes seleccionar varios.",
    options: [
      { k: "A", label: "Teléfono" },
      { k: "B", label: "TheFork / Covermanager / plataforma de terceros" },
      { k: "C", label: "WhatsApp o Instagram DM" },
      { k: "D", label: "Formulario web propio" },
      { k: "E", label: "Sin sistema claro — cada uno como puede" },
    ],
    scoreless: true,
    multiselect: true,
  },

  // B1
  {
    type: "scale",
    cat: "Bloque 1 · Reservas y atención",
    block: "B1",
    title: "Atendemos llamadas y mensajes de reserva fuera del horario de sala (noches, fines de semana).",
    help: "1 = Sin cobertura fuera del horario de sala; 5 = Sistema automático atiende reservas 24/7 sin intervención del equipo",
    scaleLabels: ["Sin cobertura", "Solo llamadas", "WhatsApp tarde", "Casi siempre", "24/7 automático"],
    scaleHints: ["1 — Sin cobertura fuera de horario", "5 — Reservas atendidas 24/7 automáticamente"],
  },
  {
    type: "scale",
    cat: "Bloque 1 · Reservas y atención",
    block: "B1",
    title: "Los no-shows representan menos del 5% de las reservas de fin de semana.",
    help: "1 = Más del 15% de no-shows, sin sistema de confirmación; 5 = Menos del 5% gracias a confirmaciones y lista de espera automáticas",
    scaleLabels: ["Más del 15%", "Del 10 al 15%", "Del 5 al 10%", "Cerca del 5%", "Menos del 5%"],
    scaleHints: ["1 — Más del 15% de no-shows", "5 — Menos del 5% con sistema automático"],
  },

  // B2
  {
    type: "scale",
    cat: "Bloque 2 · Reputación y reseñas",
    block: "B2",
    title: "Pedimos reseña de forma sistemática a los clientes que tuvieron buena experiencia.",
    help: "1 = Nunca pedimos reseñas de forma activa; 5 = Sistema automático detecta satisfacción y solicita en el momento óptimo",
    scaleLabels: ["Nunca pedimos", "Rara vez", "A veces", "Con frecuencia", "Siempre, automático"],
    scaleHints: ["1 — Nunca se solicitan reseñas", "5 — Sistema automático post-visita"],
  },
  {
    type: "scale",
    cat: "Bloque 2 · Reputación y reseñas",
    block: "B2",
    title: "Cuando recibimos una reseña negativa, respondemos en menos de 24 horas.",
    help: "1 = Se responde días después si alguien lo ve; 5 = Alerta inmediata con borrador personalizado listo para publicar",
    scaleLabels: ["Días después", "Mismo día (tarde)", "En horas", "Alertados y listos", "Inmediato + borrador"],
    scaleHints: ["1 — Se responde días después", "5 — Alerta inmediata con borrador de respuesta"],
  },

  // B3
  {
    type: "scale",
    cat: "Bloque 3 · Fidelización y base de clientes",
    block: "B3",
    title: "Tenemos una base de datos de clientes habituales a la que podemos comunicar eventos o novedades.",
    help: "1 = Sin base de datos propia, solo redes y plataformas externas; 5 = CRM automatizado con segmentación activa y comunicación directa",
    scaleLabels: ["Sin base de datos", "Agenda informal", "Lista parcial", "Base organizada", "CRM automatizado"],
    scaleHints: ["1 — Sin base de datos de clientes", "5 — CRM automatizado con segmentación"],
  },
  {
    type: "scale",
    cat: "Bloque 3 · Fidelización y base de clientes",
    block: "B3",
    title: "Detectamos cuándo un cliente habitual lleva tiempo sin volver y hacemos algo al respecto.",
    help: "1 = No sabemos quién ha dejado de venir; 5 = Detección automática y secuencia de reactivación sin intervención",
    scaleLabels: ["No lo sabemos", "Gut feeling", "Revisión manual", "Con alertas", "Reactivación auto"],
    scaleHints: ["1 — No sabemos quién ha dejado de venir", "5 — Reactivación automática de inactivos"],
  },

  // B4
  {
    type: "scale",
    cat: "Bloque 4 · Operativa y visibilidad",
    block: "B4",
    title: "La dirección tiene visibilidad del rendimiento de cada local sin tener que ir en persona.",
    help: "1 = Solo visitando en persona o revisando cada sistema por separado; 5 = Dashboard automático con todos los KPIs accesible cada mañana",
    scaleLabels: ["Hay que ir en persona", "Informe semanal", "Reportes diarios", "Panel en tiempo real", "Dashboard automático"],
    scaleHints: ["1 — Solo con visita presencial", "5 — Dashboard automático diario"],
  },
  {
    type: "scale",
    cat: "Bloque 4 · Operativa y visibilidad",
    block: "B4",
    title: "Cuando algo se sale de lo normal (cancelaciones, reseñas malas, ocupación baja), nos enteramos el mismo día.",
    help: "1 = Nos enteramos días después cuando ya ha pasado; 5 = Alertas automáticas en tiempo real ante cualquier anomalía",
    scaleLabels: ["Días después", "Semana siguiente", "Mismo día (revisando)", "Alertas básicas", "Tiempo real"],
    scaleHints: ["1 — Nos enteramos días después", "5 — Alertas en tiempo real automáticas"],
  },

  // B5
  {
    type: "scale",
    cat: "Bloque 5 · Personal y equipo",
    block: "B5",
    title: "Los turnos llegan a todo el equipo de forma automática con confirmación de lectura.",
    help: "1 = Todo por llamadas y grupos de WhatsApp caóticos; 5 = Distribución automática de turnos con confirmación de lectura",
    scaleLabels: ["Llamadas caóticas", "Excel / pizarra", "App básica", "Sistema parcial", "Totalmente automático"],
    scaleHints: ["1 — Turnos por llamadas y WhatsApp caótico", "5 — Distribución automática con confirmación"],
  },
  {
    type: "scale",
    cat: "Bloque 5 · Personal y equipo",
    block: "B5",
    title: "Cuando entra personal nuevo, recibe información y protocolos sin que el encargado lo explique desde cero.",
    help: "1 = El encargado lo explica todo desde cero cada vez; 5 = Onboarding digital automático que se activa al incorporar a alguien",
    scaleLabels: ["Encargado siempre", "Algo escrito", "A medias", "Docs digitales", "Onboarding automático"],
    scaleHints: ["1 — El encargado lo explica todo siempre", "5 — Onboarding digital automático"],
  },

  // B6
  {
    type: "scale",
    cat: "Bloque 6 · Marketing y contenido",
    block: "B6",
    title: "Tenemos presencia activa en redes sociales sin que el equipo del local dedique tiempo semanalmente.",
    help: "1 = Redes inactivas o dependiendo de que alguien publique manualmente; 5 = Publicaciones de eventos y novedades generadas automáticamente",
    scaleLabels: ["Inactivo", "Manual ocasional", "Manual regular", "Semi-automático", "Totalmente automático"],
    scaleHints: ["1 — Redes inactivas o totalmente manuales", "5 — Publicaciones automáticas sin intervención"],
  },
  {
    type: "scale",
    cat: "Bloque 6 · Marketing y contenido",
    block: "B6",
    title: "Cuando organizamos un evento o noche especial, comunicamos a nuestra base de clientes antes de pagar publicidad.",
    help: "1 = Siempre recurrimos a publicidad de pago para llenar el local; 5 = La base propia siempre se activa antes de invertir en ads",
    scaleLabels: ["Siempre pagamos ads", "A veces base propia", "Mitad y mitad", "Base primero", "Siempre base primero"],
    scaleHints: ["1 — Siempre recurrimos a publicidad de pago", "5 — Base de clientes siempre antes que ads"],
  },

  // ─── Madurez digital (scoreless) ────────────────────────────────────────────
  {
    type: "choice",
    cat: "Madurez digital",
    title: "¿Cuántas de estas herramientas digitales usáis de forma activa?",
    help: "Puedes seleccionar varias.",
    options: [
      { k: "A", label: "Software de gestión de reservas (propio o de plataforma)" },
      { k: "B", label: "TPV integrado con análisis de ventas" },
      { k: "C", label: "CRM o base de datos de clientes" },
      { k: "D", label: "Herramienta de email marketing o WhatsApp masivo" },
      { k: "E", label: "Plataforma de publicación en redes sociales" },
      { k: "F", label: "Reporting automático (ocupación, ticket medio, reseñas)" },
    ],
    scoreless: true,
    multiselect: true,
  },

  // ─── Riesgo de concentración (scoreless) ─────────────────────────────────────
  {
    type: "choice",
    cat: "Riesgo de concentración",
    title: "¿Qué porcentaje de los ingresos anuales se genera en los 3 mejores meses (temporada alta)?",
    options: [
      { k: "A", label: "Menos del 30% — ingresos estables todo el año" },
      { k: "B", label: "Del 30 al 50%" },
      { k: "C", label: "Del 50 al 70%" },
      { k: "D", label: "Más del 70% — fuerte concentración estacional" },
      { k: "E", label: "No aplica / sin temporada marcada" },
    ],
    scoreless: true,
  },

  // ─── Calidad y certificaciones (scoreless) ───────────────────────────────────
  {
    type: "choice",
    cat: "Calidad y certificaciones",
    title: "¿Cuáles de estas acreditaciones o sistemas de calidad tenéis activos?",
    help: "Puedes seleccionar varias.",
    options: [
      { k: "A", label: "Certificados de manipulador de alimentos en vigor" },
      { k: "B", label: "Sistema APPCC documentado y auditado" },
      { k: "C", label: "Carta de alérgenos documentada y visible" },
      { k: "D", label: "Sello de calidad turística o distinción gastronómica" },
      { k: "E", label: "Ninguna aún" },
    ],
    scoreless: true,
    multiselect: true,
  },

  // ─── Resiliencia (scoreless) ─────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Resiliencia",
    title: "Si tu proveedor principal de producto desapareciera mañana, ¿cuánto tardaría en normalizarse la operativa?",
    options: [
      { k: "A", label: "1-2 días — tenemos proveedores alternativos identificados" },
      { k: "B", label: "Una semana" },
      { k: "C", label: "2-4 semanas" },
      { k: "D", label: "Más de un mes — dependemos completamente de él" },
    ],
    scoreless: true,
  },

  // Prioridad
  {
    type: "choice",
    cat: "Prioridad",
    title: "¿Cuáles son tus prioridades en los próximos 6 meses?",
    help: "Puedes seleccionar varias.",
    options: [
      { k: "A", label: "Llenar más mesas en turnos bajos y reducir no-shows" },
      { k: "B", label: "Mejorar reputación online y conseguir más reseñas de 5 estrellas" },
      { k: "C", label: "Construir una base de clientes fidelizados que vuelvan solos" },
      { k: "D", label: "Tener visibilidad del negocio sin estar presente todos los días" },
      { k: "E", label: "Ahorrar tiempo al equipo en tareas repetitivas (turnos, comunicaciones)" },
    ],
    scoreless: true,
    priority: true,
    multiselect: true,
  },

  // Inversión
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cuánto invertís actualmente en marketing y captación al mes?",
    options: [
      { k: "A", label: "Menos de 500 €" },
      { k: "B", label: "Entre 500 y 1.500 €" },
      { k: "C", label: "Entre 1.500 y 3.000 €" },
      { k: "D", label: "Más de 3.000 €" },
      { k: "E", label: "Prefiero no responder" },
    ],
    scoreless: true,
  },
];

export const AUDIT_BLOCKS: Record<AuditBlockId, AuditBlock> = {
  B1: {
    id: "B1",
    name: "Reservas y atención 24/7",
    short: "Gestión de llamadas, canales, no-shows y eventos",
    tips: [
      "Asistente de voz que coge reservas 24/7 — sin perder llamadas fuera de horario",
      "Recordatorios automáticos D-1 para confirmar mesa y liberar no-shows en tiempo real",
    ],
  },
  B2: {
    id: "B2",
    name: "Reputación y reseñas",
    short: "Solicitud activa, alertas y respuesta a feedback",
    tips: [
      "Solicitud de reseña post-visita solo a clientes con experiencia positiva",
      "Alerta inmediata cuando llega una valoración negativa con borrador de respuesta listo",
    ],
  },
  B3: {
    id: "B3",
    name: "Fidelización y base de clientes",
    short: "Base de datos, segmentación, reactivación y cumpleaños",
    tips: [
      "Registro automático de cada comensal que reserva — sin fichas ni trabajo manual",
      "Secuencia de reactivación para habituales que llevan 60+ días sin volver",
    ],
  },
  B4: {
    id: "B4",
    name: "Operativa y visibilidad del negocio",
    short: "Reportes diarios, alertas de anomalías y coordinación multi-local",
    tips: [
      "Reporte diario por local a las 9:00 sin necesidad de desplazarse a verlo",
      "Alerta automática cuando se detectan anomalías de ocupación, cancelaciones o reseñas",
    ],
  },
  B5: {
    id: "B5",
    name: "Gestión de personal y equipo",
    short: "Turnos automáticos, onboarding y alertas de cobertura",
    tips: [
      "Turnos distribuidos automáticamente con confirmación de lectura por WhatsApp",
      "Onboarding digital: el nuevo empleado recibe protocolos y documentación al instante",
    ],
  },
  B6: {
    id: "B6",
    name: "Marketing y contenido digital",
    short: "Publicación automática, campañas de temporada y UGC",
    tips: [
      "Publicaciones de eventos y novedades generadas y programadas sin intervención del equipo",
      "Comunicar a base de clientes propia antes de invertir un euro en publicidad de pago",
    ],
  },
};

export const AUDIT_MODULES_BY_BLOCK: Record<AuditBlockId, AuditModule[]> = {
  B1: [
    {
      ref: "Módulo 1.1",
      name: "Asistente de voz para reservas 24/7",
      impact: "Impacto inmediato",
      desc:
        "Una voz natural atiende las llamadas fuera de horario, pregunta fecha, hora, comensales y alergias, y deja la reserva confirmada en el sistema. Si el restaurante está lleno, ofrece alternativas o lista de espera.",
    },
    {
      ref: "Módulo 1.2",
      name: "Reservas desde WhatsApp, Instagram y web",
      impact: "Más canales",
      desc:
        "El cliente reserva desde donde te encuentre — un DM, un mensaje de WhatsApp, un botón en la web. Todo cae al mismo sitio sin duplicados ni llamadas perdidas.",
    },
    {
      ref: "Módulo 1.3",
      name: "Recordatorios y confirmación anti no-shows",
      impact: "-no shows",
      desc:
        "Un mensaje previo a la reserva pide confirmación. Si el cliente cancela, esa mesa se libera y se ofrece a la lista de espera en tiempo real.",
    },
  ],
  B2: [
    {
      ref: "Módulo 2.1",
      name: "Solicitud automática de reseñas",
      impact: "Más reseñas 5★",
      desc:
        "Al día siguiente de la visita, los clientes con buena experiencia reciben un mensaje breve invitándoles a dejar reseña. Si la experiencia fue mala, el sistema lo detecta antes y lo deriva al responsable para gestionarlo en privado.",
    },
    {
      ref: "Módulo 2.2",
      name: "Alertas de reseñas negativas en tiempo real",
      impact: "Protege reputación",
      desc:
        "Cuando alguien deja una valoración baja en Google o TripAdvisor, el responsable recibe un aviso con la reseña y un borrador de respuesta listo para revisar y publicar.",
    },
  ],
  B3: [
    {
      ref: "Módulo 3.1",
      name: "Base de datos automática de comensales",
      impact: "Activo a largo plazo",
      desc:
        "Cada cliente que reserva queda registrado: nombre, contacto, fecha de visita, preferencias, alergias. Sin pedir nada extra ni rellenar fichas a mano.",
    },
    {
      ref: "Módulo 3.2",
      name: "Reactivación de clientes inactivos",
      impact: "Recupera habituales",
      desc:
        "Si un cliente habitual lleva meses sin reservar, el sistema lo detecta y le envía un mensaje personal — una invitación, una novedad, una mención al plato de su última visita.",
    },
    {
      ref: "Módulo 3.3",
      name: "Comunicaciones segmentadas para eventos",
      impact: "Más ocupación",
      desc:
        "Cuando organizas un evento o noche especial, avisas solo a los clientes que ya han venido a algo parecido. Sin spam, sin pagar publicidad para llegar a desconocidos.",
    },
  ],
  B4: [
    {
      ref: "Módulo 4.1",
      name: "Reporte diario por restaurante",
      impact: "Visibilidad total",
      desc:
        "Cada mañana, un resumen de cómo fue el día anterior en cada local: cubiertos, ocupación, ticket medio, reseñas nuevas, no-shows. En un mensaje, no en varias hojas de cálculo.",
    },
    {
      ref: "Módulo 4.2",
      name: "Alertas de anomalías en tiempo real",
      impact: "Reacción rápida",
      desc:
        "Si hay más cancelaciones de lo habitual, reseñas malas seguidas o un pico de reservas para el finde, llega un aviso sin que nadie tenga que mirarlo activamente.",
    },
  ],
  B5: [
    {
      ref: "Módulo 5.1",
      name: "Comunicación automática de turnos",
      impact: "Menos caos",
      desc:
        "Los horarios llegan a cada persona por WhatsApp con confirmación de lectura. Los cambios se notifican al momento. Sin grupos caóticos ni llamadas de última hora.",
    },
    {
      ref: "Módulo 5.2",
      name: "Onboarding automático de personal nuevo",
      impact: "Incorporación rápida",
      desc:
        "Cuando entra alguien nuevo, recibe automáticamente documentos, protocolos y la información básica del restaurante. Sin que el encargado lo explique desde cero cada vez.",
    },
  ],
  B6: [
    {
      ref: "Módulo 6.1",
      name: "Publicaciones automáticas de eventos y novedades",
      impact: "Presencia sin esfuerzo",
      desc:
        "Cuando se programa un concierto, una noche especial o un nuevo plato, el contenido se genera y se publica en Instagram y Facebook en el momento adecuado.",
    },
    {
      ref: "Módulo 6.2",
      name: "Campañas de temporada hacia base propia",
      impact: "Ocupación antes del pico",
      desc:
        "Antes de los picos (Semana Santa, verano, Navidad), se activan campañas hacia la base de clientes existente. Sin agencia, sin briefings, sin semanas de espera.",
    },
  ],
};

export const AUDIT_LEVELS: AuditLevel[] = [
  {
    min: 0,
    max: 39,
    name: "Operativa reactiva",
    desc: "Tu restaurante funciona pero cada proceso depende de que alguien esté pendiente. Hay tiempo y clientes escurriéndose por tres o más frentes. Es el punto donde activar un par de módulos tiene impacto visible en menos de 30 días.",
  },
  {
    min: 40,
    max: 59,
    name: "En transición",
    desc: "Tienes algunas piezas automatizadas pero el sistema todavía no se sostiene solo. La oportunidad está en cerrar los huecos para que el local funcione bien incluso cuando tú no estás.",
  },
  {
    min: 60,
    max: 79,
    name: "Sistematizado",
    desc: "Tu operativa ya está bastante cubierta. La siguiente capa de valor está en la inteligencia: visibilidad real de cada local, fidelización proactiva y marketing que no depende de la memoria de nadie.",
  },
  {
    min: 80,
    max: 100,
    name: "Excelencia operativa",
    desc: "Estás en el percentil alto de la restauración moderna. La conversación ahora es de optimización fina: personalización de experiencias, predicción de flujo y crecimiento replicable hacia nuevos locales.",
  },
];

export const AUDIT_BLOCK_KEYS: AuditBlockId[] = ["B1", "B2", "B3", "B4", "B5", "B6"];

// Mapas de etiquetado para el payload de GHL.
export const AUDIT_TIPO_LOCAL: Record<string, string> = {
  A: "Restaurante gastronómico",
  B: "Restaurante tradicional",
  C: "Bar-restaurante",
  D: "Beach club / temporada",
  E: "Grupo multi-local",
};

export const AUDIT_NUM_MESAS: Record<string, string> = {
  A: "Menos de 20",
  B: "De 20 a 40",
  C: "De 40 a 80",
  D: "Más de 80 / eventos",
};

export const AUDIT_NUM_LOCALES: Record<string, string> = {
  A: "1 local",
  B: "2 a 3 locales",
  C: "4 o más locales",
};

export const AUDIT_CANALES_RESERVA: Record<string, string> = {
  A: "Teléfono",
  B: "TheFork/Covermanager",
  C: "WhatsApp/Instagram",
  D: "Web propia",
  E: "Sin sistema claro",
};

export const AUDIT_PRIORIDADES: Record<string, string> = {
  A: "Llenar más mesas y reducir no-shows",
  B: "Mejorar reputación online",
  C: "Base de clientes fidelizados",
  D: "Visibilidad del negocio",
  E: "Ahorrar tiempo al equipo",
};
