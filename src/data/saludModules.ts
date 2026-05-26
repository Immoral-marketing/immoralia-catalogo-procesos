import type { BlockId } from "./saludBlocks";

export interface SaludModule {
  codigo: string;
  bloque: BlockId;
  nombre: string;
  descripcion: string;
  badge: string;
  linkedProcessSlug?: string;
  highlights?: string[];
}

export const saludModules: SaludModule[] = [
  // ── BLOQUE 01 · Captación y primera visita ────────────────────────────────
  {
    codigo: "1.1",
    bloque: "B1",
    nombre: "Asistente de voz 24/7 para pedir cita",
    descripcion:
      "Una voz natural atiende cada llamada — incluso fuera de horario o cuando recepción está ocupada — pregunta motivo, urgencia y aseguradora, y deja la cita confirmada en tu agenda.",
    badge: "Cero llamadas perdidas",
    linkedProcessSlug: "salud-voz-citas-247",
    highlights: [
      "Atiende 24/7 sin recepción nocturna",
      "Cualifica al paciente antes de bloquear hueco",
      "Voz natural en castellano, sin sonar a robot",
    ],
  },
  {
    codigo: "1.2",
    bloque: "B1",
    nombre: "Captura unificada de peticiones desde todos los canales",
    descripcion:
      "WhatsApp, formulario web, Instagram DM, llamadas... todo cae en una única bandeja con el origen del paciente identificado. Sin duplicados ni huecos perdidos entre apps.",
    badge: "Una sola bandeja",
    linkedProcessSlug: "salud-captura-multicanal",
    highlights: [
      "Un único panel para todos los canales",
      "Sin duplicados ni peticiones perdidas",
      "El paciente contacta donde ya está",
    ],
  },
  {
    codigo: "1.3",
    bloque: "B1",
    nombre: "Chatbot informativo del centro",
    descripcion:
      "Un asistente que conoce servicios, precios estimados, aseguradoras con las que trabajáis, ubicación, parking y horarios. Responde al instante en WhatsApp, Instagram y web, y deriva a humano cuando hace falta.",
    badge: "Atención instantánea",
    linkedProcessSlug: "salud-chatbot-info",
    highlights: [
      "Información actualizada 24/7",
      "Filtra dudas habituales que ahogan recepción",
      "Convierte conversaciones en citas",
    ],
  },
  {
    codigo: "1.4",
    bloque: "B1",
    nombre: "Cualificación previa de paciente",
    descripcion:
      "Antes de bloquear agenda, el sistema pregunta motivo de consulta, si es primera visita, urgencia y aseguradora. El profesional llega a consulta con el contexto, sin sorpresas en sala.",
    badge: "Agenda mejor cargada",
    linkedProcessSlug: "salud-cualificacion-previa",
    highlights: [
      "Llega a consulta con contexto, sin sorpresas",
      "Evita huecos mal asignados (urgencias en revisiones)",
      "Mejora la duración asignada por tipo de visita",
    ],
  },

  // ── BLOQUE 02 · Gestión de citas y ausencias ──────────────────────────────
  {
    codigo: "2.1",
    bloque: "B2",
    nombre: "Recordatorios automáticos pre-cita",
    descripcion:
      "Mensaje 24 horas y 2 horas antes pidiendo confirmación con un toque. El paciente confirma sin llamar, y si no confirma se notifica a recepción para gestión activa.",
    badge: "–Ausencias",
    linkedProcessSlug: "salud-recordatorios-citas",
    highlights: [
      "Recordatorio 24h y 2h antes por WhatsApp/SMS",
      "Confirmación de un solo toque",
      "Aviso a recepción si el paciente no responde",
    ],
  },
  {
    codigo: "2.2",
    bloque: "B2",
    nombre: "Confirmación y reprogramación sin llamar",
    descripcion:
      "Si el paciente no puede venir, propone fechas alternativas y reprograma la cita sin pasar por recepción. La cita anterior se libera al instante.",
    badge: "Reagenda solo",
    linkedProcessSlug: "salud-reprogramacion-citas",
    highlights: [
      "Propone alternativas según disponibilidad",
      "Reprograma sin intervención humana",
      "Libera el hueco anterior al instante",
    ],
  },
  {
    codigo: "2.3",
    bloque: "B2",
    nombre: "Lista de espera activa",
    descripcion:
      "Cuando alguien cancela, su hueco se ofrece automáticamente al primero de la lista de espera por WhatsApp. Si acepta, ocupa la cita en minutos sin llamadas.",
    badge: "Rescata cancelaciones",
    linkedProcessSlug: "salud-lista-espera",
    highlights: [
      "El hueco vuela al instante al siguiente",
      "Mensaje con respuesta directa, sin llamada",
      "Llena la agenda incluso con cancelaciones",
    ],
  },
  {
    codigo: "2.4",
    bloque: "B2",
    nombre: "Reasignación inteligente de profesional",
    descripcion:
      "Si un profesional se da de baja o no puede atender, el sistema reasigna sus citas según especialidad, disponibilidad y preferencia del paciente, y avisa a todos los afectados.",
    badge: "Cero citas tiradas",
    linkedProcessSlug: "salud-reasignacion-profesional",
    highlights: [
      "Detecta automáticamente bajas e imprevistos",
      "Reasigna por especialidad y disponibilidad",
      "Notifica al paciente y al equipo a la vez",
    ],
  },

  // ── BLOQUE 03 · Reputación y reseñas ──────────────────────────────────────
  {
    codigo: "3.1",
    bloque: "B3",
    nombre: "Solicitud automática de reseñas post-visita",
    descripcion:
      "24-48h después de la visita, el paciente recibe un mensaje breve. Si responde bien, enlace directo a Google. Si responde mal, conversación privada con el responsable antes de que publique.",
    badge: "Más reseñas 5★",
    linkedProcessSlug: "salud-solicitud-resenas",
    highlights: [
      "Solicitud en el momento de máxima satisfacción",
      "Filtro de descontentos a canal privado",
      "Crecimiento orgánico de reseñas reales",
    ],
  },
  {
    codigo: "3.2",
    bloque: "B3",
    nombre: "Alertas de reseñas negativas en tiempo real",
    descripcion:
      "Cuando alguien publica una reseña <3★ en Google o Doctoralia, el responsable recibe la alerta al instante con la reseña, el contexto del paciente y un borrador de respuesta listo para revisar.",
    badge: "Protege reputación",
    linkedProcessSlug: "salud-alertas-resenas-negativas",
    highlights: [
      "Alerta inmediata en cualquier plataforma",
      "Borrador de respuesta IA en el tono del centro",
      "Cero reseñas malas sin responder",
    ],
  },
  {
    codigo: "3.3",
    bloque: "B3",
    nombre: "Encuestas de satisfacción post-tratamiento",
    descripcion:
      "Después de un tratamiento concreto (no de una visita rápida), el paciente recibe una encuesta breve para saber cómo fue. Te llega el resumen y las alertas si hay algo a revisar.",
    badge: "Mide calidad real",
    linkedProcessSlug: "salud-encuestas-post-tratamiento",
    highlights: [
      "Encuesta en el momento de la verdad",
      "Detección automática de pacientes a contactar",
      "Datos accionables, no solo NPS abstracto",
    ],
  },

  // ── BLOQUE 04 · Seguimiento clínico y fidelización ────────────────────────
  {
    codigo: "4.1",
    bloque: "B4",
    nombre: "Recordatorios de revisión periódica",
    descripcion:
      "El sistema sabe cuándo cada paciente debe volver a revisión (limpieza dental anual, control de mantenimiento, chequeo) y le envía un recordatorio amable con opción de reservar directamente.",
    badge: "Pacientes que vuelven",
    linkedProcessSlug: "salud-recordatorios-revision",
    highlights: [
      "Calendario de revisiones personalizado",
      "Recordatorio en el momento adecuado",
      "Reserva con un toque desde el mensaje",
    ],
  },
  {
    codigo: "4.2",
    bloque: "B4",
    nombre: "Reactivación de pacientes inactivos",
    descripcion:
      "Si un paciente habitual lleva más tiempo del normal sin venir, el sistema lo detecta y le envía un mensaje personal con un motivo concreto para volver — no una campaña masiva.",
    badge: "Recupera habituales",
    linkedProcessSlug: "salud-reactivacion-pacientes",
    highlights: [
      "Detección automática de patrones de visita",
      "Mensaje personal, no campaña masiva",
      "Recupera entre el 15% y el 25% de la base inactiva",
    ],
  },
  {
    codigo: "4.3",
    bloque: "B4",
    nombre: "Mensajes programados a pacientes",
    descripcion:
      "Defines una vez las comunicaciones que quieres mantener vivas — cumpleaños, aniversarios, recordatorios estacionales, fin de tratamiento, novedades — y el sistema las envía en el momento adecuado a quien corresponda, siempre con consentimiento RGPD.",
    badge: "Vínculo continuo",
    linkedProcessSlug: "salud-mensajes-programados",
    highlights: [
      "Calendario único para todas las comunicaciones del centro",
      "Segmentación automática por tipo de paciente",
      "Tono humano, RGPD-compliant, sin saturar",
    ],
  },

  // ── BLOQUE 05 · Administración y facturación ──────────────────────────────
  {
    codigo: "5.1",
    bloque: "B5",
    nombre: "Facturación automática a mutuas y aseguradoras",
    descripcion:
      "El sistema prepara y envía facturas a Adeslas, Sanitas, Asisa y al resto de mutuas con sus formatos respectivos. Mantiene seguimiento de qué está pendiente de cobro y avisa de impagos.",
    badge: "Cobra antes",
    linkedProcessSlug: "salud-facturacion-mutuas",
    highlights: [
      "Adapta el formato a cada aseguradora",
      "Seguimiento del estado de cobro",
      "Avisos automáticos de impagos",
    ],
  },
  {
    codigo: "5.2",
    bloque: "B5",
    nombre: "Seguimiento de facturas pendientes de cobro",
    descripcion:
      "Vigilancia diaria de facturas emitidas (a pacientes y mutuas). Cuando una factura está próxima a vencer o ha vencido, envía recordatorios escalonados antes de que se convierta en impago.",
    badge: "–Impagos",
    linkedProcessSlug: "salud-seguimiento-cobros",
    highlights: [
      "Recordatorios escalonados antes del vencimiento",
      "Visibilidad del estado de cada factura",
      "Notifica solo cuando hace falta intervenir",
    ],
  },
  {
    codigo: "5.3",
    bloque: "B5",
    nombre: "Registro automático de gastos",
    descripcion:
      "Foto al ticket o reenvío de factura por email — el sistema extrae proveedor, importe, IVA y partida, lo registra en el ERP y archiva el justificante en la nube. Cierre de mes en horas, no en días.",
    badge: "Cierre en horas",
    linkedProcessSlug: "salud-registro-gastos",
    highlights: [
      "Cero tickets perdidos",
      "Cierre de mes en horas, no en días",
      "Trazabilidad total de cada gasto",
    ],
  },
  {
    codigo: "5.4",
    bloque: "B5",
    nombre: "Reporte diario por clínica",
    descripcion:
      "Cada mañana llega un parte con cifras del día anterior: pacientes atendidos, ingresos, ausencias, reseñas nuevas. Si tienes varios centros, una visión consolidada del grupo.",
    badge: "Visibilidad total",
    linkedProcessSlug: "salud-reporte-diario",
    highlights: [
      "Llega por WhatsApp o email a primera hora",
      "Multi-clínica en un único parte consolidado",
      "Sin esperar al cierre del gestor",
    ],
  },

  // ── BLOQUE 06 · Gestión del equipo clínico ────────────────────────────────
  {
    codigo: "6.1",
    bloque: "B6",
    nombre: "Comunicación automática de turnos",
    descripcion:
      "Cada miembro del equipo recibe su turno semanal individualizado por WhatsApp, con confirmación de lectura. Los cambios se notifican solo a quien afecta — fin del grupo caótico.",
    badge: "Menos caos",
    linkedProcessSlug: "salud-comunicacion-turnos",
    highlights: [
      "Turnos individuales con confirmación de lectura",
      "Cambios notificados solo a quien afectan",
      "Fin del grupo de WhatsApp ingobernable",
    ],
  },
  {
    codigo: "6.2",
    bloque: "B6",
    nombre: "Onboarding automático de personal sanitario",
    descripcion:
      "Cuando se incorpora alguien nuevo (auxiliar, higienista, recepción), recibe automáticamente documentos, protocolos del centro, contactos del equipo y formación inicial. Operativo desde el primer día.",
    badge: "Incorporación rápida",
    linkedProcessSlug: "salud-onboarding-personal",
    highlights: [
      "Documentos, protocolos y vídeos enviados al instante",
      "Coordinador deja de repetir lo mismo cada vez",
      "Persona nueva operativa el primer día",
    ],
  },
  {
    codigo: "6.3",
    bloque: "B6",
    nombre: "Sustituciones inteligentes y gestión de bajas",
    descripcion:
      "Si un profesional se da de baja, el sistema propone sustitutos según rol, disponibilidad y experiencia, gestiona el aviso al equipo y reasigna las citas afectadas en bloque.",
    badge: "Cobertura sin estrés",
    linkedProcessSlug: "salud-sustituciones-bajas",
    highlights: [
      "Propuesta automática de sustitutos por rol",
      "Reasignación masiva de citas afectadas",
      "Notificación coordinada al equipo y pacientes",
    ],
  },
];

export const getModulesByBlock = (blockId: BlockId): SaludModule[] =>
  saludModules.filter((m) => m.bloque === blockId);

export const getModuleByCodigo = (codigo: string): SaludModule | undefined =>
  saludModules.find((m) => m.codigo === codigo);
