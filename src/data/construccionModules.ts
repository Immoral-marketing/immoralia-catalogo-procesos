import type { ConstruccionBlockId } from "./construccionBlocks";

export interface ConstruccionModule {
  codigo: string;
  bloque: ConstruccionBlockId;
  nombre: string;
  descripcion: string;
  badge: string;
  linkedProcessSlug?: string;
  highlights?: string[];
}

export const construccionModules: ConstruccionModule[] = [
  // ── BLOQUE 01 · Captación y cualificación de leads ────────────────────────
  {
    codigo: "1.1",
    bloque: "B1",
    nombre: "Calificación inteligente de leads",
    descripcion:
      "La IA analiza cada nuevo contacto — canal de entrada, respuestas al formulario, comportamiento previo — y le asigna una puntuación basada en presupuesto, urgencia y tipo de financiación. Tu equipo comercial recibe solo los leads con intención real de compra.",
    badge: "Impacto inmediato",
    linkedProcessSlug: "calificacion-inteligente-leads",
    highlights: [
      "Puntuación automática por presupuesto, urgencia y financiación",
      "Priorización de contactos sin trabajo manual del equipo",
      "Reduce el tiempo dedicado a leads no cualificados",
    ],
  },
  {
    codigo: "1.2",
    bloque: "B1",
    nombre: "Análisis de sentimiento y riesgo",
    descripcion:
      "El sistema monitoriza la temperatura de cada lead a lo largo del proceso: detecta señales de enfriamiento — falta de respuesta, cambio de tono, silencio — y avisa al agente antes de que el contacto se pierda definitivamente.",
    badge: "Retención de leads",
    linkedProcessSlug: "analisis-sentimiento-riesgo",
    highlights: [
      "Detección temprana de leads que bajan de temperatura",
      "Alerta automática al agente con contexto completo",
      "Reduce la fuga silenciosa de oportunidades",
    ],
  },
  {
    codigo: "1.3",
    bloque: "B1",
    nombre: "Dashboard comercial en tiempo real",
    descripcion:
      "Dirección ve el estado del pipeline en tiempo real sin esperar el informe del lunes: leads nuevos, tasa de conversión por fase, previsión de cierre y unidades en riesgo. Todo actualizado en automático desde el CRM.",
    badge: "Visibilidad total",
    linkedProcessSlug: "dashboard-comercial-tiempo-real",
    highlights: [
      "Estado del pipeline actualizado en tiempo real",
      "Previsión de cierres y alertas de unidades en riesgo",
      "Sin dependencia de reportes manuales del equipo",
    ],
  },

  // ── BLOQUE 02 · Conversión y argumentación comercial ─────────────────────
  {
    codigo: "2.1",
    bloque: "B2",
    nombre: "Asistente digital del proyecto",
    descripcion:
      "Antes de que el agente hable con el cliente, la IA ya ha respondido sus dudas técnicas sobre materiales, certificaciones, plazos y zonas comunes. El cliente llega a la conversación informado y el agente se centra en cerrar.",
    badge: "Eficiencia comercial",
    linkedProcessSlug: "asistente-digital-precualificacion",
    highlights: [
      "Respuestas técnicas al instante sobre el proyecto",
      "El agente llega a la visita con el cliente ya informado",
      "Reduce el tiempo de conversación en dudas básicas",
    ],
  },
  {
    codigo: "2.2",
    bloque: "B2",
    nombre: "Motor de discurso personalizado",
    descripcion:
      "El sistema adapta los argumentos comerciales al perfil de cada cliente — primera vivienda, inversión, familiar — para que el agente siempre tenga el enfoque correcto sin improvisar. Los mensajes de seguimiento también se personalizan automáticamente.",
    badge: "Conversión +",
    linkedProcessSlug: "motor-presentacion-perfil",
    highlights: [
      "Argumentario adaptado al perfil del comprador en tiempo real",
      "Mensajes de seguimiento personalizados sin trabajo manual",
      "Mayor tasa de conversión en perfiles complejos",
    ],
  },
  {
    codigo: "2.3",
    bloque: "B2",
    nombre: "Generador de dossier de unidad",
    descripcion:
      "El agente selecciona la unidad y el sistema genera en segundos un dossier con plano, precio actualizado, condiciones de pago, zonas comunes y certificación energética. Listo para enviar por WhatsApp o email.",
    badge: "Agilidad documental",
    linkedProcessSlug: "generador-dossier-unidad",
    highlights: [
      "Dossier completo generado en menos de 30 segundos",
      "Siempre con precio y condiciones actualizados",
      "Entregable directo por WhatsApp o email al cliente",
    ],
  },
  {
    codigo: "2.4",
    bloque: "B2",
    nombre: "Resumen automático de llamadas",
    descripcion:
      "Cada llamada con un cliente se transcribe, resume y vuelca al CRM automáticamente: intereses, objeciones, próximos pasos. El agente termina la llamada y ya está documentada sin escribir nada.",
    badge: "CRM siempre al día",
    linkedProcessSlug: "resumen-llamadas-crm",
    highlights: [
      "Transcripción y resumen automático de cada conversación",
      "Objeciones e intereses volcados directamente al CRM",
      "El agente documenta cero, el sistema lo hace todo",
    ],
  },
  {
    codigo: "2.5",
    bloque: "B2",
    nombre: "Asistente interno para agentes",
    descripcion:
      "El agente tiene a mano un copiloto que responde en segundos a cualquier pregunta técnica, legal o de producto — mientras está con el cliente, por teléfono o en la visita — sin tener que llamar a nadie ni buscar en documentos.",
    badge: "Agentes más seguros",
    linkedProcessSlug: "asistente-interno-comerciales",
    highlights: [
      "Respuestas instantáneas a preguntas técnicas y legales en plena conversación",
      "Acceso a toda la documentación del proyecto desde el móvil",
      "Agentes más seguros y eficaces sin formación constante",
    ],
  },

  // ── BLOQUE 03 · Seguimiento y visitas ────────────────────────────────────
  {
    codigo: "3.1",
    bloque: "B3",
    nombre: "Seguimiento multicanal contextual",
    descripcion:
      "El sistema envía el mensaje correcto al lead correcto por el canal correcto — WhatsApp, email o SMS — en función de su fase en el embudo y su comportamiento reciente. Sin spam, sin mensajes genéricos, sin trabajo manual.",
    badge: "Leads calientes",
    linkedProcessSlug: "seguimiento-multicanal-inteligente",
    highlights: [
      "Mensajes adaptados a la fase del embudo de cada lead",
      "Canal seleccionado según el comportamiento previo del contacto",
      "Cero trabajo manual de seguimiento para el equipo",
    ],
  },
  {
    codigo: "3.2",
    bloque: "B3",
    nombre: "Automatización de visitas",
    descripcion:
      "El sistema gestiona el calendario de visitas, envía recordatorios automáticos al lead y al agente, registra el check-in en la visita y actualiza el CRM. Si el lead no confirma, el sistema hace el seguimiento hasta que se produce la visita.",
    badge: "Más visitas",
    linkedProcessSlug: "automatizacion-agendado-visitas",
    highlights: [
      "Gestión automática de agenda, confirmación y recordatorios",
      "Check-in automático con actualización del CRM",
      "Recuperación de visitas no confirmadas sin esfuerzo",
    ],
  },
  {
    codigo: "3.3",
    bloque: "B3",
    nombre: "Seguimiento post-visita",
    descripcion:
      "Tras cada visita, el sistema envía automáticamente una encuesta de satisfacción y activa una secuencia de nurturing para los leads que aún no deciden: contenido relevante, actualizaciones del proyecto y momentos de urgencia controlados.",
    badge: "Nurturing activo",
    linkedProcessSlug: "seguimiento-post-visita",
    highlights: [
      "Encuesta automática y análisis de satisfacción post-visita",
      "Secuencia de nurturing personalizada para indecisos",
      "Reactivación de leads fríos con momentos de urgencia bien dosificados",
    ],
  },

  // ── BLOQUE 04 · Cierre y contratación ────────────────────────────────────
  {
    codigo: "4.1",
    bloque: "B4",
    nombre: "Automatización documental",
    descripcion:
      "Cuando el cliente decide comprar, el sistema genera el contrato de reserva con los datos correctos, lo envía para firma digital y registra cada paso con trazabilidad completa. Sin errores manuales, sin demoras por papeleo.",
    badge: "Cierre ágil",
    linkedProcessSlug: "automatizacion-contratos-firma",
    highlights: [
      "Contratos generados automáticamente con datos del CRM",
      "Firma digital integrada con notificación instantánea",
      "Trazabilidad completa de cada documento y estado de firma",
    ],
  },
  {
    codigo: "4.2",
    bloque: "B4",
    nombre: "Proceso post-reserva",
    descripcion:
      "Una vez hecha la reserva, el comprador recibe comunicaciones automáticas sobre cada hito del proyecto — inicio de obra, estructura, cerramientos, entrega prevista — para que se sienta acompañado durante todo el proceso de construcción.",
    badge: "Comprador tranquilo",
    linkedProcessSlug: "proceso-post-reserva",
    highlights: [
      "Comunicaciones automáticas en cada hito del proyecto",
      "Comprador informado sin saturar al equipo postventa",
      "Reduce llamadas de ansiedad y consultas repetitivas",
    ],
  },

  // ── BLOQUE 05 · Postventa y relación con propietarios ─────────────────────
  {
    codigo: "5.1",
    bloque: "B5",
    nombre: "Portal de propietarios con IA",
    descripcion:
      "Un portal personalizado donde el propietario resuelve dudas sobre garantías, reporta incidencias y consulta el estado de su vivienda — atendido por una IA con conocimiento completo del proyecto. El equipo técnico recibe solo lo que necesita su atención real.",
    badge: "Postventa escalable",
    linkedProcessSlug: "portal-propietarios-post-entrega",
    highlights: [
      "Resolución automática del 70% de las consultas de propietarios",
      "Gestión estructurada de incidencias con priorización automática",
      "Predicción de problemas recurrentes por tipología o fase de entrega",
    ],
  },

  // ── BLOQUE 06 · Operativa diaria ──────────────────────────────────────────
  {
    codigo: "6.1",
    bloque: "B6",
    nombre: "Identificación de unidades estancadas",
    descripcion:
      "El sistema analiza el pipeline y detecta automáticamente qué unidades llevan demasiado tiempo sin avance: cruza datos de precio, tipología, visitas y mercado para proponer acciones concretas de reactivación — bajada de precio, cambio de argumentario, oferta especial.",
    badge: "Stock activo",
    linkedProcessSlug: "identificacion-reactivacion-unidades",
    highlights: [
      "Detección automática de unidades sin movimiento con análisis de causa",
      "Recomendaciones basadas en datos de mercado y comportamiento de leads",
      "Alertas para dirección con plan de acción concreto",
    ],
  },
];

export const getConstruccionModulesByBlock = (blockId: ConstruccionBlockId): ConstruccionModule[] =>
  construccionModules.filter((m) => m.bloque === blockId);

export const getConstruccionModuleByCodigo = (codigo: string): ConstruccionModule | undefined =>
  construccionModules.find((m) => m.codigo === codigo);
