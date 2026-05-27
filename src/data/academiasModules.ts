import type { BlockId } from "./academiasBlocks";

export interface AcademiasModule {
  codigo: string;
  bloque: BlockId;
  nombre: string;
  descripcion: string;
  badge: string;
  linkedProcessSlug?: string;
  highlights?: string[];
}

export const academiasModules: AcademiasModule[] = [
  // ── BLOQUE 01 · Captación de alumnos ─────────────────────────────────────
  {
    codigo: "1.1",
    bloque: "B1",
    nombre: "Asistente de voz 24/7 para info de cursos",
    descripcion:
      "Una voz natural atiende cada llamada — incluso fuera de horario o cuando la secretaría está ocupada — informa sobre cursos, precios y modalidades, y deja la consulta registrada para seguimiento.",
    badge: "Cero llamadas perdidas",
    linkedProcessSlug: "academias-voz-cursos-247",
    highlights: [
      "Atiende 24/7 sin secretaría nocturna",
      "Informa sobre cursos, precios y modalidades al instante",
      "Voz natural en castellano, sin sonar a robot",
    ],
  },
  {
    codigo: "1.2",
    bloque: "B1",
    nombre: "Captura multicanal (web/WhatsApp/Instagram)",
    descripcion:
      "WhatsApp, formulario web, Instagram DM, llamadas... todo cae en una única bandeja con el origen identificado. Sin duplicados ni consultas perdidas entre plataformas.",
    badge: "Una sola bandeja",
    linkedProcessSlug: "academias-captura-multicanal",
    highlights: [
      "Un único panel para todos los canales",
      "Sin duplicados ni consultas perdidas",
      "El alumno contacta por donde ya está",
    ],
  },
  {
    codigo: "1.3",
    bloque: "B1",
    nombre: "Chatbot informativo (cursos, precios, modalidades)",
    descripcion:
      "Un asistente que conoce toda la oferta formativa: cursos, precios, horarios, modalidades presencial/online, requisitos de nivel y forma de inscripción. Responde al instante y deriva a matrícula cuando hay intención real.",
    badge: "Atención instantánea",
    linkedProcessSlug: "academias-chatbot-info",
    highlights: [
      "Información actualizada de cursos 24/7",
      "Filtra preguntas habituales que saturan secretaría",
      "Convierte conversaciones en matriculaciones",
    ],
  },
  {
    codigo: "1.4",
    bloque: "B1",
    nombre: "Cualificación previa de alumno (objetivo, nivel, modalidad)",
    descripcion:
      "Antes de pasar al proceso de matrícula, el sistema pregunta objetivo de aprendizaje, nivel actual, modalidad preferida y disponibilidad horaria. El asesor llega preparado, sin empezar desde cero.",
    badge: "Mejor primera reunión",
    linkedProcessSlug: "academias-cualificacion-alumno",
    highlights: [
      "Llega al asesor con perfil del alumno, sin sorpresas",
      "Reduce tiempo de primera entrevista a la mitad",
      "Mejora el match entre alumno y grupo/modalidad",
    ],
  },

  // ── BLOQUE 02 · Matriculación y onboarding del alumno ─────────────────────
  {
    codigo: "2.1",
    bloque: "B2",
    nombre: "Proceso de matrícula sin papeleo",
    descripcion:
      "El alumno firma el contrato en digital, aporta documentación vía foto y queda matriculado en el sistema sin pasar por la academia ni rellenar formularios en papel.",
    badge: "Matrícula en 5 min",
    linkedProcessSlug: "academias-matricula-digital",
    highlights: [
      "Firma digital y documentación vía foto",
      "El alumno queda activo en el sistema al instante",
      "Sin visita presencial para trámites administrativos",
    ],
  },
  {
    codigo: "2.2",
    bloque: "B2",
    nombre: "Welcome pack automático (plataforma, materiales, normas)",
    descripcion:
      "El mismo día que se matricula, el alumno recibe acceso a la plataforma, materiales del curso, normas de la academia, contacto del profesor y calendario de las primeras sesiones — sin que nadie tenga que enviarlo manualmente.",
    badge: "Alumno listo el día 1",
    linkedProcessSlug: "academias-welcome-pack",
    highlights: [
      "Enviado automáticamente al confirmar la matrícula",
      "Acceso a plataforma, materiales y calendario incluidos",
      "El coordinador deja de repetir lo mismo cada vez",
    ],
  },
  {
    codigo: "2.3",
    bloque: "B2",
    nombre: "Pago fraccionado y seguimiento de cuotas",
    descripcion:
      "El alumno elige cuántas cuotas pagar, el sistema genera el calendario de cobros y envía recordatorios automáticos antes de cada vencimiento. Los impagos se escalan sin intervención manual.",
    badge: "Cobros sin fricción",
    linkedProcessSlug: "academias-pago-fraccionado",
    highlights: [
      "El alumno elige su plan de pago al matricularse",
      "Recordatorios automáticos antes del vencimiento",
      "Escalado de impagos sin perseguir a nadie",
    ],
  },
  {
    codigo: "2.4",
    bloque: "B2",
    nombre: "Asignación automática al grupo según nivel",
    descripcion:
      "Cuando el alumno completa la inscripción o la prueba de nivel, el sistema lo asigna al grupo correcto, le envía horario y documentación de bienvenida, y avisa al profesor. Sin intervención del equipo administrativo.",
    badge: "Del formulario al grupo",
    linkedProcessSlug: "matricula-asignacion-nivel-automatica",
    highlights: [
      "Asignación automática según resultado de nivel o prueba previa",
      "Alumno recibe horario, profesor y materiales al instante",
      "El coordinador lo ve en el sistema sin gestión manual",
    ],
  },

  // ── BLOQUE 03 · Comunicación con padres y alumnos ────────────────────────
  {
    codigo: "3.1",
    bloque: "B3",
    nombre: "Avisos de asistencia y faltas a padres",
    descripcion:
      "Cuando un alumno falta a clase, el sistema avisa automáticamente a los padres o tutores por WhatsApp o email, con el motivo si se conoce. Sin que el profesor tenga que llamar ni el coordinador gestionar la comunicación.",
    badge: "Padres siempre informados",
    linkedProcessSlug: "academias-avisos-faltas",
    highlights: [
      "Aviso automático a padres por cada falta",
      "El profesor marca la ausencia y el resto es automático",
      "Historial de asistencia accesible para familias",
    ],
  },
  {
    codigo: "3.2",
    bloque: "B3",
    nombre: "Comunicación de calendario y exámenes",
    descripcion:
      "Antes de cada examen, cambio de horario o evento especial, el sistema avisa a los alumnos y padres con la antelación correcta. Sin carteles en el tablón ni mensajes de grupo caóticos.",
    badge: "Sin sorpresas de última hora",
    linkedProcessSlug: "academias-comunicacion-calendario",
    highlights: [
      "Recordatorio personalizado antes de cada examen",
      "Cambios de horario notificados solo a los afectados",
      "Fin de los grupos de WhatsApp inmanejables",
    ],
  },
  {
    codigo: "3.3",
    bloque: "B3",
    nombre: "Encuesta automática post-clase",
    descripcion:
      "Después de cada sesión o bloque de clases, los alumnos reciben una encuesta breve de satisfacción. El coordinador ve las tendencias en tiempo real y puede actuar antes de que el problema escale.",
    badge: "Calidad medible",
    linkedProcessSlug: "academias-encuesta-post-clase",
    highlights: [
      "Encuesta enviada automáticamente tras la clase",
      "Alertas cuando la valoración baja del umbral",
      "Datos accionables, no solo NPS abstracto",
    ],
  },
  {
    codigo: "3.4",
    bloque: "B3",
    nombre: "Mensajes de fechas clave (cumpleaños, fin curso)",
    descripcion:
      "Felicitaciones de cumpleaños para alumnos y padres, y mensajes de celebración al finalizar un curso o superar un nivel. Pequeños gestos automatizados que refuerzan el vínculo con la academia.",
    badge: "Detalle que se recuerda",
    linkedProcessSlug: "academias-mensajes-fechas-clave",
    highlights: [
      "Cumpleaños y fin de curso sin esfuerzo manual",
      "Tono humano, sin parecer un bot",
      "Refuerza la relación con alumnos y familias",
    ],
  },

  // ── BLOQUE 04 · Retención y reactivación ─────────────────────────────────
  {
    codigo: "4.1",
    bloque: "B4",
    nombre: "Detección de alumnos en riesgo de baja",
    descripcion:
      "El sistema detecta patrones de riesgo: ausencias repetidas, caída en el uso de la plataforma o falta de renovación cercana. Antes de que el alumno pida la baja, el coordinador recibe una alerta para actuar.",
    badge: "Actúa antes de la baja",
    linkedProcessSlug: "academias-deteccion-riesgo-baja",
    highlights: [
      "Detección automática por asistencia y actividad",
      "Alerta al coordinador con contexto del alumno",
      "Intervención en el momento útil, no tras la baja",
    ],
  },
  {
    codigo: "4.2",
    bloque: "B4",
    nombre: "Reactivación de exalumnos",
    descripcion:
      "Si un exalumno lleva más de un curso sin matricularse, el sistema le envía un mensaje personalizado con un motivo concreto para volver — no una newsletter masiva — en el momento del año en que hay más probabilidad de reenganche.",
    badge: "Recupera exalumnos",
    linkedProcessSlug: "academias-reactivacion-exalumnos",
    highlights: [
      "Mensaje personal, no campaña masiva",
      "Momento de envío optimizado según temporada",
      "Recupera entre el 10% y el 20% de exalumnos contactados",
    ],
  },
  {
    codigo: "4.3",
    bloque: "B4",
    nombre: "Programa de referidos automatizado",
    descripcion:
      "Los alumnos satisfechos reciben un enlace de referido único. Cuando traen a un amigo, el sistema lo rastrea, aplica el descuento acordado y notifica al coordinador — sin gestionar cupones a mano.",
    badge: "Alumnos que traen alumnos",
    linkedProcessSlug: "academias-programa-referidos",
    highlights: [
      "Enlace de referido único por alumno",
      "Descuento aplicado automáticamente al nuevo alumno",
      "Rastreo completo sin gestión manual de cupones",
    ],
  },

  // ── BLOQUE 05 · Administración y finanzas ────────────────────────────────
  {
    codigo: "5.1",
    bloque: "B5",
    nombre: "Recordatorios de mensualidad y pagos pendientes",
    descripcion:
      "El sistema envía recordatorios escalonados antes del vencimiento y después, sin que el equipo tenga que perseguir a ningún alumno. Los impagos se escalan solo cuando el recordatorio no funciona.",
    badge: "–Impagos",
    linkedProcessSlug: "academias-recordatorio-mensualidad",
    highlights: [
      "Recordatorio antes del vencimiento y después",
      "Escalado automático si no hay respuesta",
      "El equipo solo interviene en los casos que lo requieren",
    ],
  },
  {
    codigo: "5.2",
    bloque: "B5",
    nombre: "Registro automático de gastos",
    descripcion:
      "Foto al ticket o reenvío de factura por email — el sistema extrae proveedor, importe, IVA y categoría (material didáctico, equipamiento, servicios), lo registra y archiva el justificante.",
    badge: "Cierre en horas",
    linkedProcessSlug: "academias-registro-gastos",
    highlights: [
      "Cero tickets perdidos al final del mes",
      "Categorización automática por tipo de gasto",
      "Cierre de mes en horas, no en días",
    ],
  },
  {
    codigo: "5.3",
    bloque: "B5",
    nombre: "Reporte diario por academia",
    descripcion:
      "Cada mañana llega un parte con cifras del día anterior: alumnos activos, cuotas cobradas, faltas registradas, nuevas consultas recibidas. Si tienes varias sedes, vista consolidada del grupo.",
    badge: "Visibilidad total",
    linkedProcessSlug: "academias-reporte-diario",
    highlights: [
      "Llega por WhatsApp o email a primera hora",
      "Multi-sede en un único parte consolidado",
      "Sin esperar al gestor para saber cómo va el mes",
    ],
  },

  // ── BLOQUE 06 · Gestión del profesorado ──────────────────────────────────
  {
    codigo: "6.1",
    bloque: "B6",
    nombre: "Comunicación automática de turnos",
    descripcion:
      "Cada profesor recibe su horario semanal individualizado por WhatsApp, con confirmación de lectura. Los cambios se notifican solo a quien afecta — fin del grupo de WhatsApp caótico.",
    badge: "Menos caos",
    linkedProcessSlug: "academias-comunicacion-turnos",
    highlights: [
      "Horarios individuales con confirmación de lectura",
      "Cambios notificados solo a quien afectan",
      "Fin del grupo de WhatsApp ingobernable",
    ],
  },
  {
    codigo: "6.2",
    bloque: "B6",
    nombre: "Onboarding de profesor nuevo",
    descripcion:
      "Cuando se incorpora un profesor nuevo, recibe automáticamente documentos del centro, protocolo de clases, acceso a plataforma, listado de alumnos asignados y guía de primeras semanas. Operativo desde el primer día.",
    badge: "Incorporación rápida",
    linkedProcessSlug: "academias-onboarding-profesor",
    highlights: [
      "Documentos, protocolos y accesos enviados al instante",
      "El coordinador deja de repetir el proceso cada vez",
      "Profesor nuevo operativo el primer día de clase",
    ],
  },
  {
    codigo: "6.3",
    bloque: "B6",
    nombre: "Sustituciones inteligentes",
    descripcion:
      "Si un profesor no puede dar clase, el sistema propone sustitutos según nivel de enseñanza, disponibilidad horaria y alumnos asignados, gestiona el aviso al equipo y notifica a los alumnos afectados.",
    badge: "Cobertura sin estrés",
    linkedProcessSlug: "academias-sustituciones-inteligentes",
    highlights: [
      "Propuesta automática de sustitutos por nivel y disponibilidad",
      "Notificación coordinada al equipo y alumnos",
      "La clase no se cancela — se cubre",
    ],
  },
];

export const getModulesByBlock = (blockId: BlockId): AcademiasModule[] =>
  academiasModules.filter((m) => m.bloque === blockId);

export const getModuleByCodigo = (codigo: string): AcademiasModule | undefined =>
  academiasModules.find((m) => m.codigo === codigo);
