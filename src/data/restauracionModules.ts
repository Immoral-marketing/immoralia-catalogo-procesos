import type { BlockId } from "./restauracionBlocks";

export interface RestauracionModule {
  codigo: string;
  bloque: BlockId;
  nombre: string;
  descripcion: string;
  badge: string;
  linkedProcessSlug?: string;
  highlights?: string[];
}

export const restauracionModules: RestauracionModule[] = [
  // ── BLOQUE 01 · Reservas y atención 24/7 ──────────────────────────────────
  {
    codigo: "1.1",
    bloque: "B1",
    nombre: "Asistente de voz para reservas 24/7",
    descripcion:
      "Una voz natural atiende las llamadas fuera de horario, pregunta fecha, hora, comensales y alergias, y deja la reserva confirmada en el sistema. Si el restaurante está lleno, ofrece alternativas o lista de espera.",
    badge: "Impacto inmediato",
    highlights: [
      "Atiende 24/7 incluso con sala llena",
      "Voz natural en castellano",
      "Sincronización con Covermanager, Tock o tu sistema actual",
    ],
  },
  {
    codigo: "1.2",
    bloque: "B1",
    nombre: "Reservas desde WhatsApp, Instagram y web",
    descripcion:
      "El cliente reserva desde donde te encuentre — un DM, un mensaje de WhatsApp, un botón en la web. Todo cae al mismo sitio sin duplicados ni llamadas perdidas.",
    badge: "Más canales",
    highlights: [
      "Un único panel para todos los canales",
      "Sin duplicados ni reservas perdidas",
      "El cliente reserva donde ya está",
    ],
  },
  {
    codigo: "1.3",
    bloque: "B1",
    nombre: "Recordatorios y confirmación anti no-shows",
    descripcion:
      "Un mensaje previo a la reserva pide confirmación. Si el cliente cancela, esa mesa se libera y se ofrece a la lista de espera en tiempo real.",
    badge: "–No shows",
    linkedProcessSlug: "asistente-reservas-recordatorios",
    highlights: [
      "Confirmación por WhatsApp/SMS antes del servicio",
      "Lista de espera activa que recupera mesas canceladas",
      "Caída de no-shows del 30-50%",
    ],
  },

  // ── BLOQUE 02 · Reputación y reseñas ──────────────────────────────────────
  {
    codigo: "2.1",
    bloque: "B2",
    nombre: "Solicitud automática de reseñas",
    descripcion:
      "Al día siguiente de la visita, los clientes con buena experiencia reciben un mensaje breve invitándoles a dejar reseña. Si la experiencia fue mala, el sistema lo detecta antes y lo deriva al responsable para gestionarlo en privado.",
    badge: "Más reseñas 5★",
    linkedProcessSlug: "solicitud-automatica-resenas",
    highlights: [
      "Solicitud en el momento de máxima satisfacción",
      "Filtro de descontentos a canal privado",
      "Crecimiento orgánico de reseñas reales",
    ],
  },
  {
    codigo: "2.2",
    bloque: "B2",
    nombre: "Alertas de reseñas negativas en tiempo real",
    descripcion:
      "Cuando alguien deja una valoración baja en Google o TripAdvisor, el responsable recibe un aviso con la reseña y un borrador de respuesta listo para revisar y publicar.",
    badge: "Protege reputación",
    highlights: [
      "Alerta inmediata cuando publican una reseña <3★",
      "Borrador de respuesta generado con IA en el tono del local",
      "Cero reseñas malas sin responder",
    ],
  },

  // ── BLOQUE 03 · Fidelización y vuelta del cliente ─────────────────────────
  {
    codigo: "3.1",
    bloque: "B3",
    nombre: "Base de datos automática de comensales",
    descripcion:
      "Cada cliente que reserva queda registrado: nombre, contacto, fecha de visita, preferencias, alergias. Sin pedir nada extra ni rellenar fichas a mano.",
    badge: "Activo a largo plazo",
    highlights: [
      "Se llena sola con cada reserva, sin fichas manuales",
      "Preferencias y alergias guardadas en la ficha del comensal",
      "Tu activo más valioso a 5 años vista",
    ],
  },
  {
    codigo: "3.2",
    bloque: "B3",
    nombre: "Reactivación de clientes inactivos",
    descripcion:
      "Si un cliente habitual lleva meses sin reservar, el sistema lo detecta y le envía un mensaje personal — una invitación, una novedad, una mención al plato de su última visita.",
    badge: "Recupera habituales",
    highlights: [
      "Detección automática de habituales que se enfrían",
      "Mensaje personal, no campaña masiva",
      "Recupera entre el 15% y el 25% de la base inactiva",
    ],
  },
  {
    codigo: "3.3",
    bloque: "B3",
    nombre: "Comunicaciones segmentadas para eventos",
    descripcion:
      "Cuando organizas un evento o noche especial, avisas solo a los clientes que ya han venido a algo parecido. Sin spam, sin pagar publicidad para llegar a desconocidos.",
    badge: "Más ocupación",
    highlights: [
      "Segmentación por histórico de visitas y preferencias",
      "Cero coste publicitario para llenar eventos",
      "Mensajes con tasa de apertura muy superior al email frío",
    ],
  },

  // ── BLOQUE 04 · Operativa diaria y visibilidad ────────────────────────────
  {
    codigo: "4.1",
    bloque: "B4",
    nombre: "Reporte diario por restaurante",
    descripcion:
      "Cada mañana, un resumen de cómo fue el día anterior en cada local: cubiertos, ocupación, ticket medio, reseñas nuevas, no-shows. En un mensaje, no en varias hojas de cálculo.",
    badge: "Visibilidad total",
    highlights: [
      "Llega por WhatsApp o email a primera hora",
      "Multi-local en un único parte consolidado",
      "Sin esperar a que el encargado pase el cierre",
    ],
  },
  {
    codigo: "4.2",
    bloque: "B4",
    nombre: "Alertas de anomalías en tiempo real",
    descripcion:
      "Si hay más cancelaciones de lo habitual, reseñas malas seguidas o un pico de reservas para el finde, llega un aviso sin que nadie tenga que mirarlo activamente.",
    badge: "Reacción rápida",
    highlights: [
      "Detección automática de desviaciones vs. patrón histórico",
      "Aviso al responsable sin tener que mirar nada",
      "Permite actuar antes de que el problema escale",
    ],
  },

  // ── BLOQUE 05 · Gestión de personal y equipo ──────────────────────────────
  {
    codigo: "5.1",
    bloque: "B5",
    nombre: "Comunicación automática de turnos",
    descripcion:
      "Los horarios llegan a cada persona por WhatsApp con confirmación de lectura. Los cambios se notifican al momento. Sin grupos caóticos ni llamadas de última hora.",
    badge: "Menos caos",
    highlights: [
      "Turnos individuales con confirmación de lectura",
      "Cambios notificados al instante a quien afectan",
      "Fin de los grupos de WhatsApp ingobernables",
    ],
  },
  {
    codigo: "5.2",
    bloque: "B5",
    nombre: "Onboarding automático de personal nuevo",
    descripcion:
      "Cuando entra alguien nuevo, recibe automáticamente documentos, protocolos y la información básica del restaurante. Sin que el encargado lo explique desde cero cada vez.",
    badge: "Incorporación rápida",
    highlights: [
      "Documentos, protocolos y vídeos enviados al instante",
      "Encargado deja de repetir lo mismo 30 veces al año",
      "Persona nueva operativa en el primer turno",
    ],
  },

  // ── BLOQUE 06 · Marketing y contenido digital ─────────────────────────────
  {
    codigo: "6.1",
    bloque: "B6",
    nombre: "Publicaciones automáticas de eventos y novedades",
    descripcion:
      "Cuando se programa un concierto, una noche especial o un nuevo plato, el contenido se genera y se publica en Instagram y Facebook en el momento adecuado.",
    badge: "Presencia sin esfuerzo",
    highlights: [
      "Generación de copy + imagen en la identidad del local",
      "Publicación programada al horario óptimo",
      "Tu Instagram deja de depender de quien tenga rato",
    ],
  },
  {
    codigo: "6.2",
    bloque: "B6",
    nombre: "Campañas de temporada hacia base propia",
    descripcion:
      "Antes de los picos (Semana Santa, verano, Navidad), se activan campañas hacia la base de clientes existente. Sin agencia, sin briefings, sin semanas de espera.",
    badge: "Ocupación antes del pico",
    highlights: [
      "Calendario de campañas ligado al calendario gastronómico",
      "Sin agencia, sin briefings, sin coste publicitario",
      "Llenado anticipado de los picos del año",
    ],
  },
];

export const getModulesByBlock = (blockId: BlockId): RestauracionModule[] =>
  restauracionModules.filter((m) => m.bloque === blockId);

export const getModuleByCodigo = (codigo: string): RestauracionModule | undefined =>
  restauracionModules.find((m) => m.codigo === codigo);
