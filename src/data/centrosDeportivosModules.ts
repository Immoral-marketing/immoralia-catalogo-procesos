import type { CentrosDeportivosBlockId } from "./centrosDeportivosBlocks";

export interface CentrosDeportivosModule {
  codigo: string;
  bloque: CentrosDeportivosBlockId;
  nombre: string;
  descripcion: string;
  badge: string;
  linkedProcessSlug?: string;
  highlights?: string[];
}

export const centrosDeportivosModules: CentrosDeportivosModule[] = [
  // ── BLOQUE 01 · Reservas y acceso 24/7 ───────────────────────────────────
  {
    codigo: "1.1",
    bloque: "B1",
    nombre: "Reserva de sesión o pista, confirmación y lista de espera",
    descripcion:
      "El socio reserva desde donde está — un mensaje, la web o la app del centro. Si no hay hueco, entra en lista de espera automáticamente y recibe un aviso en cuanto se libere uno.",
    badge: "Impacto inmediato",
    linkedProcessSlug: "gestion-automatizada-reservas",
    highlights: [
      "Reservas desde cualquier canal unificadas en un único panel",
      "Lista de espera que se activa sola cuando alguien cancela",
      "Confirmación automática sin que nadie tenga que gestionar nada",
    ],
  },
  {
    codigo: "1.2",
    bloque: "B1",
    nombre: "Respuestas automáticas 24/7 a las preguntas más habituales",
    descripcion:
      "Horarios, precios, disponibilidad, cómo apuntarse. Las preguntas más frecuentes se responden de forma automática a cualquier hora, sin que nadie del equipo tenga que estar pendiente.",
    badge: "Atención sin horario",
    linkedProcessSlug: "whatsapp-automata-faq",
    highlights: [
      "Respuesta inmediata fuera de horario de apertura",
      "Preguntas frecuentes resueltas sin intervención humana",
      "Deriva al equipo solo los casos que realmente lo necesitan",
    ],
  },
  {
    codigo: "1.3",
    bloque: "B1",
    nombre: "Aviso inmediato cuando se cancela o cambia una sesión",
    descripcion:
      "En cuanto una sesión o actividad se cancela o modifica, todos los socios inscritos reciben un aviso al instante por el canal que prefieran. Cero llamadas, cero sorpresas.",
    badge: "Cero sustos",
    linkedProcessSlug: "notificacion-cambios-cancelaciones-clase",
    highlights: [
      "Aviso instantáneo a todos los afectados sin trabajo manual",
      "Funciona igual para cancelaciones, cambios de horario o de espacio",
      "Reduce reclamaciones y mejora la experiencia del socio",
    ],
  },
  {
    codigo: "1.4",
    bloque: "B1",
    nombre: "Control del aforo con cierre automático cuando se llena",
    descripcion:
      "El sistema monitoriza en tiempo real cuántos huecos quedan en cada sesión o espacio. Cuando se alcanza el aforo máximo, cierra las inscripciones automáticamente y avisa al equipo.",
    badge: "Gestión de demanda",
    linkedProcessSlug: "control-aforo-alertas-ocupacion",
    highlights: [
      "Cierre automático de inscripciones al llegar al aforo",
      "Alerta interna cuando la ocupación supera el umbral",
      "Evita salas masificadas y mejora la experiencia de los socios",
    ],
  },

  // ── BLOQUE 02 · Captación y conversión de socios ──────────────────────────
  {
    codigo: "2.1",
    bloque: "B2",
    nombre: "Los interesados de tu web y redes entran solos en el CRM",
    descripcion:
      "Cada persona que rellena un formulario, manda un mensaje o contacta por redes sociales entra automáticamente en el CRM y arranca una secuencia de bienvenida personalizada.",
    badge: "Leads automatizados",
    linkedProcessSlug: "lead-capture-crm",
    highlights: [
      "Captura desde web, Instagram y WhatsApp en un único sistema",
      "Secuencia de respuesta inmediata que no permite que el lead se enfríe",
      "Sin entradas manuales ni leads perdidos entre canales",
    ],
  },
  {
    codigo: "2.2",
    bloque: "B2",
    nombre: "Seguimiento de quien preguntó pero no se apuntó",
    descripcion:
      "Si alguien muestra interés pero no da el paso, el sistema hace el seguimiento por él: mensajes espaciados en el tiempo, sin presionar, hasta que decide o descarta definitivamente.",
    badge: "No dejes leads",
    linkedProcessSlug: "secuencia-bienvenida-leads-frios",
    highlights: [
      "Secuencia automática de mensajes sin trabajo manual del equipo",
      "Para solo cuando el lead convierte o cierra la conversación",
      "Recupera entre el 10% y el 20% de los leads que parecían perdidos",
    ],
  },
  {
    codigo: "2.3",
    bloque: "B2",
    nombre: "Recordatorio para quien vino a probar y no dio el paso",
    descripcion:
      "Las sesiones de prueba son el momento de mayor intención de compra. Si el visitante no se inscribe en los días siguientes, recibe un recordatorio personalizado antes de que el impulso se enfríe.",
    badge: "Convierte pruebas",
    linkedProcessSlug: "reactivacion-leads-no-convirtieron",
    highlights: [
      "Mensaje automático a los pocos días de la sesión de prueba",
      "Tono cercano, no comercial — recuerda la experiencia, no el precio",
      "Convierte una parte significativa de visitas de prueba en socios",
    ],
  },
  {
    codigo: "2.4",
    bloque: "B2",
    nombre: "Alta completa del nuevo socio: acceso y bienvenida en un paso",
    descripcion:
      "Cuando alguien se inscribe, su ficha se crea en el sistema, se activan sus credenciales de acceso y recibe un mensaje de bienvenida — todo de forma automática, sin que recepción tenga que tocar nada.",
    badge: "Onboarding sin rozamiento",
    linkedProcessSlug: "alta-socio-accesos-auto",
    highlights: [
      "Ficha creada automáticamente en el software de gestión del centro",
      "Acceso activado desde el primer día sin intervención manual",
      "Bienvenida personalizada que refuerza la decisión de inscribirse",
    ],
  },

  // ── BLOQUE 03 · Fidelización y retención ─────────────────────────────────
  {
    codigo: "3.1",
    bloque: "B3",
    nombre: "Aviso cuando un socio lleva días sin aparecer por el centro",
    descripcion:
      "El sistema detecta automáticamente cuándo un socio lleva más días de lo normal sin asistir y envía un mensaje cercano antes de que el distanciamiento se convierta en baja.",
    badge: "Retención preventiva",
    linkedProcessSlug: "seguimiento-alumnos-riesgo-baja",
    highlights: [
      "Detección automática de ausencia superior al umbral configurado",
      "Mensaje personalizado, no una campaña masiva de spam",
      "Actúa antes de que el socio decida darse de baja formalmente",
    ],
  },
  {
    codigo: "3.2",
    bloque: "B3",
    nombre: "Cobro mensual automático y aviso cuando falla un pago",
    descripcion:
      "Las cuotas se cobran solas cada mes. Cuando un pago falla, el socio recibe un aviso inmediato con enlace de pago directo — sin que nadie tenga que perseguirle ni llamar.",
    badge: "Ingresos asegurados",
    linkedProcessSlug: "cobro-recurrente-gestion-impagos",
    highlights: [
      "Domiciliación mensual sin gestión manual de cobros",
      "Aviso automático al socio cuando su pago no pasa",
      "Reduce la morosidad y el tiempo dedicado a perseguir impagos",
    ],
  },
  {
    codigo: "3.3",
    bloque: "B3",
    nombre: "Aviso cuando la cuota o el bono de un socio está a punto de caducar",
    descripcion:
      "Antes de que una cuota expire o un bono se agote, el socio recibe un aviso con link de renovación directa. Las renovaciones se producen antes de que haya una interrupción del servicio.",
    badge: "Renovación sin roce",
    linkedProcessSlug: "notificacion-renovacion-cuota",
    highlights: [
      "Aviso automático con antelación configurable",
      "Link de renovación directo sin pasar por recepción",
      "Reduce las bajas por olvido o fricción en la renovación",
    ],
  },
  {
    codigo: "3.4",
    bloque: "B3",
    nombre: "Resumen mensual de la actividad y progreso de cada socio",
    descripcion:
      "Cada mes, cada socio recibe un resumen personalizado de sus sesiones, su progreso y sus logros del mes. Les recuerda el valor que están obteniendo y refuerza su vínculo con el centro.",
    badge: "Valor percibido",
    linkedProcessSlug: "informe-mensual-progreso-alumno",
    highlights: [
      "Resumen personalizado generado automáticamente por socio",
      "Refuerza el compromiso recordando el progreso conseguido",
      "Reduce bajas por percepción de falta de avance",
    ],
  },

  // ── BLOQUE 04 · Operativa del centro y personal ───────────────────────────
  {
    codigo: "4.1",
    bloque: "B4",
    nombre: "Organización automática de turnos para cubrir todas las sesiones",
    descripcion:
      "Los horarios llegan a cada persona del equipo con confirmación de lectura. Los cambios se notifican al instante. Sin grupos de mensajes caóticos ni llamadas de última hora.",
    badge: "Menos caos",
    linkedProcessSlug: "gestion-turnos-disponibilidad-instructores",
    highlights: [
      "Turnos individuales con confirmación de lectura",
      "Cambios notificados al instante a quien afectan",
      "Fin de los grupos de mensajes ingobernables",
    ],
  },
  {
    codigo: "4.2",
    bloque: "B4",
    nombre: "Informe semanal automático del centro: ocupación, altas y bajas",
    descripcion:
      "Cada semana, un resumen automático del estado del centro: ocupación media, altas del período, bajas, sesiones realizadas e incidencias. En un mensaje, sin Excel ni informes manuales.",
    badge: "Visibilidad total",
    linkedProcessSlug: "informe-semanal-kpis-operativos",
    highlights: [
      "Llega por WhatsApp o email a primera hora del lunes",
      "Sin esperar a que nadie prepare un informe",
      "Permite tomar decisiones con datos reales de la semana anterior",
    ],
  },
  {
    codigo: "4.3",
    bloque: "B4",
    nombre: "Registro de averías con seguimiento hasta que están resueltas",
    descripcion:
      "Cuando se detecta una avería en el material o las instalaciones, se registra automáticamente y queda en seguimiento hasta que está reparada. Nada se olvida ni se queda sin resolver.",
    badge: "Cero olvidos",
    linkedProcessSlug: "gestion-incidencias-equipamiento",
    highlights: [
      "Registro instantáneo desde cualquier dispositivo",
      "Estado visible para el equipo hasta la resolución",
      "Historial de incidencias para negociar con proveedores o mantenimiento",
    ],
  },
  {
    codigo: "4.4",
    bloque: "B4",
    nombre: "Firma digital de contratos sin papel ni desplazamientos",
    descripcion:
      "Los contratos de socio, acuerdos con proveedores o documentos de autorización se firman digitalmente desde el móvil. Sin imprimir, sin escanear, sin archivar a mano.",
    badge: "Cero papeles",
    linkedProcessSlug: "gestion-contratos-firma-digital",
    highlights: [
      "Firma desde cualquier dispositivo sin necesidad de presencia física",
      "Archivo automático con trazabilidad completa",
      "Válido legalmente con misma validez que la firma manuscrita",
    ],
  },

  // ── BLOQUE 05 · Reputación y comunidad ───────────────────────────────────
  {
    codigo: "5.1",
    bloque: "B5",
    nombre: "Solicitud automática de reseña en Google tras una sesión",
    descripcion:
      "Justo después de una sesión o en el momento de mayor satisfacción, el socio recibe un mensaje breve invitándole a dejar reseña. El timing es clave — y aquí se hace automático.",
    badge: "Más reseñas 5★",
    linkedProcessSlug: "solicitud-automatica-resenas",
    highlights: [
      "Solicitud en el momento de máxima satisfacción del socio",
      "Sin pedir directamente en persona, que resulta incómodo",
      "Crecimiento orgánico y sostenido de valoraciones reales",
    ],
  },
  {
    codigo: "5.2",
    bloque: "B5",
    nombre: "Encuesta rápida al terminar una sesión para detectar problemas",
    descripcion:
      "Una pregunta rápida justo después de la sesión: ¿cómo ha ido? Si hay insatisfacción, el sistema la captura y avisa al responsable antes de que el socio se vaya sin decir nada.",
    badge: "Detecta antes",
    linkedProcessSlug: "encuesta-satisfaccion-post-clase",
    highlights: [
      "Encuesta de una pregunta que casi todo el mundo responde",
      "Alerta al equipo cuando la respuesta es negativa",
      "Permite actuar antes de que la insatisfacción se convierta en baja",
    ],
  },
  {
    codigo: "5.3",
    bloque: "B5",
    nombre: "Gestión de quejas con acuse de recibo y seguimiento",
    descripcion:
      "Cuando un socio manda una queja o reclamación, recibe confirmación inmediata de que ha sido recibida y un plazo de respuesta. El equipo tiene trazabilidad de cada caso hasta el cierre.",
    badge: "Quejas controladas",
    linkedProcessSlug: "gestion-quejas-reclamaciones",
    highlights: [
      "Acuse de recibo automático que frena la escalada inmediata",
      "Trazabilidad completa de cada queja hasta su resolución",
      "Reduce la probabilidad de que una queja se convierta en reseña negativa",
    ],
  },

  // ── BLOQUE 06 · Marketing y contenido digital ─────────────────────────────
  {
    codigo: "6.1",
    bloque: "B6",
    nombre: "Publicación automática de novedades, horarios y promociones",
    descripcion:
      "Cuando hay un cambio de horario, una promoción nueva o un evento en el centro, el contenido se genera y se publica en redes sociales y Google Business en el momento adecuado. Sin que nadie tenga que recordarlo.",
    badge: "Presencia sin esfuerzo",
    highlights: [
      "Publicaciones automáticas en Instagram, Facebook y Google Business",
      "Tu perfil deja de depender de que alguien tenga un rato",
      "Identidad visual consistente en todos los canales",
    ],
  },
  {
    codigo: "6.2",
    bloque: "B6",
    nombre: "Campañas de captación por temporada lanzadas en la fecha correcta",
    descripcion:
      "Enero, septiembre, vuelta al cole — los picos de captación del año se activan solos con campañas preparadas de antemano hacia interesados y ex-socios. Sin briefings ni agencias.",
    badge: "Captación estacional",
    highlights: [
      "Campañas lanzadas automáticamente en el momento de mayor intención",
      "Sin agencia, sin briefings, sin semanas de preparación",
      "Máxima captación en los meses clave del año",
    ],
  },
];

export const getCentrosDeportivosModulesByBlock = (blockId: CentrosDeportivosBlockId): CentrosDeportivosModule[] =>
  centrosDeportivosModules.filter((m) => m.bloque === blockId);

export const getCentrosDeportivosModuleByCodigo = (codigo: string): CentrosDeportivosModule | undefined =>
  centrosDeportivosModules.find((m) => m.codigo === codigo);
