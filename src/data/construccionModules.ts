import type { ConstruccionBlockId } from "./construccionBlocks";

// ⚠️ ARCHIVO DERIVADO — generado desde processes.ts con scripts/_gen_construccion_modules.mjs
// No editar a mano: el nombre/slug/codigo de cada módulo debe coincidir con su ficha.
// Para regenerar tras tocar processes.ts: node scripts/_gen_construccion_modules.mjs

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
  // ── BLOQUE 01 · Captación y cualificación ──
  {
    codigo: "1.1",
    bloque: "B1",
    nombre: "Interesados priorizados por intención de compra",
    descripcion:
      "El sistema analiza cada interesado que entra, presupuesto, capacidad de financiamiento, urgencia y tipo de interés (inversión o vivienda propia), y le asigna una puntuación de prioridad. Su equipo ve la lista ya ordenada y dedica el tiempo a quien realmente puede cerrar, sin perderlo filtrando curiosos a mano.",
    badge: "Nuevo",
    linkedProcessSlug: "calificacion-inteligente-leads",
    highlights: [
      "Hasta un 30% más de conversión al contactar primero a los interesados con intención real",
      "El equipo deja de perder horas filtrando curiosos",
      "Cierres más rápidos al conocer el perfil antes de la primera llamada",
    ],
  },
  {
    codigo: "1.2",
    bloque: "B1",
    nombre: "Alerta de enfriamiento de interesados",
    descripcion:
      "La IA revisa las conversaciones por WhatsApp, correo y las respuestas tras la visita para detectar señales de duda, silencio o pérdida de interés. Cuando un interesado empieza a enfriarse, avisa al asesor con el motivo concreto y una recomendación de cómo reactivarlo, antes de que la oportunidad se pierda.",
    badge: "Avanzado",
    linkedProcessSlug: "analisis-sentimiento-riesgo",
    highlights: [
      "Detecta a tiempo las dudas que el interesado no dice de frente",
      "Menos ventas perdidas por interesados que se enfrían en silencio",
      "El asesor interviene a tiempo, con el motivo y una acción concreta",
    ],
  },
  {
    codigo: "1.3",
    bloque: "B1",
    nombre: "Panel de control comercial en tiempo real",
    descripcion:
      "Un panel que reúne en tiempo real los datos del CRM, las visitas y las reservas: conversión por asesor, tiempo promedio de cierre, motivos de pérdida y unidades con bajo rendimiento. La dirección ve el estado real de cada proyecto cuando quiere, sin depender de reportes hechos a mano.",
    badge: "Esencial",
    linkedProcessSlug: "dashboard-comercial-tiempo-real",
    highlights: [
      "Identifica de un vistazo dónde se traba la venta",
      "Pasa del reporte mensual a mano a datos vivos las 24 horas",
      "Control del desempeño de cada asesor del equipo",
    ],
  },
  // ── BLOQUE 02 · Conversión y cierre ──
  {
    codigo: "2.1",
    bloque: "B2",
    nombre: "Generador de fichas de vivienda",
    descripcion:
      "Al elegir una unidad, el sistema arma automáticamente su ficha con plano, precio actualizado, condiciones de pago, fecha estimada de entrega y acabados incluidos, lista para enviar por WhatsApp o correo. Se acabó buscar planos sueltos en carpetas o enviar precios desactualizados.",
    badge: "Recomendado",
    linkedProcessSlug: "generador-dossier-unidad",
    highlights: [
      "Cero envíos con precios o datos desactualizados",
      "El asesor recupera horas que perdía buscando planos y anexos",
      "Imagen profesional inmediata ante el comprador",
    ],
  },
  {
    codigo: "2.2",
    bloque: "B2",
    nombre: "Resumen automático de llamadas en el CRM",
    descripcion:
      "La IA transcribe las llamadas del equipo comercial, resume los puntos clave, tipología de interés, presupuesto, objeciones, próximo paso, y los vuelca al CRM automáticamente al colgar. El asesor dedica su tiempo a vender, no a llenar fichas, y no se pierde ningún detalle de la conversación.",
    badge: "Popular",
    linkedProcessSlug: "resumen-llamadas-comerciales-obra",
    highlights: [
      "Datos completos en el CRM, sin resúmenes vagos de 'comprador interesado'",
      "El asesor vende en lugar de llenar fichas tras cada llamada",
      "No se pierden detalles clave como 'necesito tres habitaciones' o 'busco financiamiento al 90%'",
    ],
  },
  {
    codigo: "2.3",
    bloque: "B2",
    nombre: "Asistente interno del equipo de ventas",
    descripcion:
      "La documentación de la promoción, planos, memoria de calidades, condiciones, comparativas, convertida en un asistente que el equipo consulta desde su celular. Frente al comprador, el asesor resuelve cualquier duda técnica o de precio en segundos, con una respuesta correcta y unificada para todo el equipo.",
    badge: "Nuevo",
    linkedProcessSlug: "copiloto-proyecto-agentes-obra",
    highlights: [
      "Un asesor nuevo conoce la promoción a fondo en horas, no en semanas",
      "El equipo responde cualquier duda técnica del comprador sin improvisar",
      "Discurso unificado y coherente de todo el equipo ante el comprador",
    ],
  },
  {
    codigo: "2.4",
    bloque: "B2",
    nombre: "Contratos de reserva con firma digital",
    descripcion:
      "Cuando se cierra la reserva, el sistema genera el contrato con los datos del comprador y la unidad y lo envía a firma digital certificada al celular, con seguimiento del estado de cada firma. Se cierra en caliente, sin que el papeleo enfríe al comprador entre el acuerdo y la firma.",
    badge: "Esencial",
    linkedProcessSlug: "contrato-reserva-firma-digital-obra",
    highlights: [
      "Tiempo de emisión de contratos reducido hasta en un 95%",
      "Reserva firmada en el momento, sin enfriar al comprador",
      "Seguimiento visual del estado de firma de cada interviniente",
    ],
  },
  {
    codigo: "2.5",
    bloque: "B2",
    nombre: "Gestión automática del post-reserva",
    descripcion:
      "Tras la reserva, el sistema marca los hitos, solicita al comprador la documentación necesaria de forma ordenada y le comunica los avances de la obra automáticamente. Reduce las cancelaciones, baja la carga administrativa de andar pidiendo papeles y mantiene tranquilo al comprador durante la espera.",
    badge: "Nuevo",
    linkedProcessSlug: "proceso-post-reserva",
    highlights: [
      "Menos cancelaciones de reserva al transmitir confianza desde el primer día",
      "Baja la carga administrativa de andar solicitando documentos uno a uno",
      "Mejora la satisfacción del comprador y las recomendaciones a nuevos clientes",
    ],
  },
  // ── BLOQUE 03 · Seguimiento y visitas ──
  {
    codigo: "3.1",
    bloque: "B3",
    nombre: "Seguimiento automático durante la obra",
    descripcion:
      "En obra nueva pasan meses entre el primer interés y la entrega, y ahí se enfría la mayoría de los interesados. El sistema mantiene el vínculo con mensajes por correo y WhatsApp ligados a los avances reales de la obra, hitos, fotos, videos, espaciados con criterio. Cuando un interesado vuelve a reaccionar, avisa al asesor para que retome el contacto.",
    badge: "Esencial",
    linkedProcessSlug: "seguimiento-multicanal-inteligente",
    highlights: [
      "Frena la pérdida de interesados por el enfriamiento del ciclo largo",
      "Más del 55% de respuesta en comunicaciones a largo plazo",
      "Crea vínculo entre el comprador y su futura vivienda mientras se construye",
    ],
  },
  {
    codigo: "3.2",
    bloque: "B3",
    nombre: "Gestión automática de visitas",
    descripcion:
      "El interesado reserva su visita desde un enlace, el sistema la agenda en el calendario del asesor y envía los recordatorios automáticos con la ubicación. Reduce al mínimo las ausencias y libera al equipo de coordinar fechas a mano.",
    badge: "Popular",
    linkedProcessSlug: "automatizacion-agendado-visitas",
    highlights: [
      "Caída fuerte de las ausencias a las visitas agendadas",
      "Menos horas a la semana coordinando y reagendando visitas",
      "El interesado agenda solo, en su momento de mayor interés",
    ],
  },
  {
    codigo: "3.3",
    bloque: "B3",
    nombre: "Seguimiento automático tras la visita",
    descripcion:
      "Después de cada visita, el sistema envía una breve encuesta, mide el nivel de interés y activa un seguimiento según la respuesta: envía material adicional a quien quedó con dudas y avisa al asesor de a quién vale la pena recontactar. Estandariza el paso de cierre que normalmente se posterga u olvida.",
    badge: "Nuevo",
    linkedProcessSlug: "seguimiento-post-visita",
    highlights: [
      "Recupera interesados que se iban con dudas sin resolver",
      "Termómetro real del desempeño de cada asesor en la visita",
      "Automatiza el paso de cierre que más se suele olvidar",
    ],
  },
  {
    codigo: "3.4",
    bloque: "B3",
    nombre: "Asistente web de atención al interesado",
    descripcion:
      "Un asistente con IA atiende en su sitio web y por WhatsApp las 24 horas: explica tipologías, formas de pago, ubicación y resuelve las dudas frecuentes del proyecto. El interesado llega a su asesor ya informado, el equipo deja de repetir lo mismo una y otra vez, y toda la conversación queda registrada en el CRM.",
    badge: "Popular",
    linkedProcessSlug: "asistente-digital-precualificacion",
    highlights: [
      "Atención a los interesados las 24 horas sin sumar planilla",
      "El equipo deja de explicar lo básico una y otra vez",
      "Los interesados llegan al asesor ya informados sobre precio y condiciones",
    ],
  },
  {
    codigo: "3.5",
    bloque: "B3",
    nombre: "Presentación comercial adaptada por perfil",
    descripcion:
      "Según el perfil del interesado, inversionista, familia, pareja joven, el sistema arma de forma automática la presentación, la ficha y los correos con los argumentos que de verdad le importan a ese comprador. El asesor envía siempre el material más relevante, sin preparar versiones distintas a mano.",
    badge: "Nuevo",
    linkedProcessSlug: "motor-presentacion-perfil",
    highlights: [
      "Mayor tasa de apertura al enviar material relevante para cada perfil",
      "Se acaban los envíos genéricos que no conectan",
      "El asesor deja de armar a mano una propuesta distinta para cada cliente",
    ],
  },
  // ── BLOQUE 04 · Obra y proveedores ──
  {
    codigo: "4.1",
    bloque: "B4",
    nombre: "Reporte automático de avance de obra",
    descripcion:
      "El personal de campo sube fotos y notas desde el celular y el sistema arma automáticamente el informe de avance de obra: porcentaje ejecutado por partida, comparación con el cronograma y alertas de desviación. La dirección y los inversionistas reciben el reporte al día, sin que nadie pase horas armándolo en hojas de cálculo.",
    badge: "Nuevo",
    linkedProcessSlug: "reporte-avance-obra",
    highlights: [
      "Informe de avance en minutos en lugar de días",
      "Menos retrabajo por información de obra reportada tarde o incompleta",
      "Dirección e inversionistas siempre con el avance real al día",
    ],
  },
  {
    codigo: "4.2",
    bloque: "B4",
    nombre: "Registro automático de albaranes y facturas de proveedor",
    descripcion:
      "El sistema lee con IA los albaranes y facturas de proveedor, importe, partida, proyecto, impuestos, y los registra y concilia contra la orden de compra o el presupuesto, sin que nadie los digite a mano. Detecta diferencias de precio o cantidad y las marca para revisión.",
    badge: "Nuevo",
    linkedProcessSlug: "registro-albaranes-proveedor",
    highlights: [
      "Cero digitación manual de albaranes y facturas",
      "Detecta diferencias de precio o cantidad antes de pagar de más",
      "Costos de proveedor siempre actualizados contra el presupuesto",
    ],
  },
  {
    codigo: "4.3",
    bloque: "B4",
    nombre: "Gestión de permisos y trámites",
    descripcion:
      "El sistema centraliza todos los permisos y trámites del proyecto, ante cada entidad o municipalidad, su estado, requisitos pendientes y fechas límite, y envía alertas antes de cada vencimiento. La dirección sabe en todo momento qué falta para avanzar, sin perseguir el estado de cada gestión.",
    badge: "Nuevo",
    linkedProcessSlug: "control-permisos-tramites",
    highlights: [
      "Todos los permisos y trámites en un solo tablero con su estado",
      "Alertas antes de cada vencimiento o requisito pendiente",
      "Menos retrasos de obra por trámites que se pasan de fecha",
    ],
  },
  {
    codigo: "4.4",
    bloque: "B4",
    nombre: "Gestión documental del proyecto",
    descripcion:
      "El sistema organiza toda la documentación del proyecto, planos, contratos, memorias, permisos, controlando versiones y permitiendo encontrar cualquier documento en lenguaje natural. Se acaba el caos de archivos sueltos por correo y el riesgo de trabajar con una versión vieja del plano.",
    badge: "Nuevo",
    linkedProcessSlug: "gestion-documental-proyecto",
    highlights: [
      "Siempre la última versión del plano o contrato, sin confusiones",
      "Encuentra cualquier documento del proyecto en segundos",
      "Menos errores por trabajar con versiones desactualizadas",
    ],
  },
  {
    codigo: "4.5",
    bloque: "B4",
    nombre: "Revisión de cumplimiento normativo del proyecto",
    descripcion:
      "El sistema contrasta los documentos y planos del proyecto contra la normativa aplicable, usos de suelo, retiros, alturas, requisitos por tipo de proyecto, y señala posibles incumplimientos antes de presentar ante la entidad. Reduce el riesgo de rechazos, observaciones y retrasos costosos.",
    badge: "Nuevo",
    linkedProcessSlug: "revision-cumplimiento-normativo",
    highlights: [
      "Detecta posibles incumplimientos antes de presentar el proyecto",
      "Menos rechazos y observaciones de las entidades",
      "Reduce retrasos y sobrecostos por correcciones tardías",
    ],
  },
  // ── BLOQUE 05 · Finanzas y cobros ──
  {
    codigo: "5.1",
    bloque: "B5",
    nombre: "Recordatorios automáticos de cuotas atrasadas",
    descripcion:
      "El sistema monitorea los pagos de cada comprador y, cuando una cuota se atrasa, envía recordatorios automáticos por el canal correcto, escalando el tono según los días de mora. Mejora la cobranza y protege el flujo de caja del proyecto, sin que el equipo administrativo persiga pagos uno por uno.",
    badge: "Nuevo",
    linkedProcessSlug: "cobranza-cuotas-atrasadas",
    highlights: [
      "Mejora la efectividad de cobranza sin perseguir pagos a mano",
      "Protege el flujo de caja del proyecto",
      "Recordatorios por el canal correcto, con el tono adecuado a la mora",
    ],
  },
  {
    codigo: "5.2",
    bloque: "B5",
    nombre: "Estado de cuenta y conciliación de pagos",
    descripcion:
      "El sistema concilia automáticamente los pagos recibidos contra la cartera de cada comprador y mantiene su estado de cuenta actualizado: cuánto ha pagado, cuánto debe y qué viene. El comprador puede consultarlo y administración deja de cuadrar pagos a mano.",
    badge: "Nuevo",
    linkedProcessSlug: "estado-cuenta-conciliacion",
    highlights: [
      "Pagos conciliados automáticamente, sin cuadrar a mano",
      "Estado de cuenta del comprador siempre actualizado",
      "Menos consultas a administración por cuánto se debe",
    ],
  },
  {
    codigo: "5.3",
    bloque: "B5",
    nombre: "Facturación automática",
    descripcion:
      "Cada vez que se registra un pago, el sistema genera la factura con los datos correctos, cumple el formato fiscal correspondiente y la envía al comprador automáticamente. Administración deja de emitir facturas una por una y se evitan errores y atrasos.",
    badge: "Nuevo",
    linkedProcessSlug: "facturacion-automatica-obra",
    highlights: [
      "Facturas emitidas y enviadas sin trabajo manual",
      "Cumplimiento del formato fiscal sin errores",
      "Administración libera horas de tareas repetitivas",
    ],
  },
  {
    codigo: "5.4",
    bloque: "B5",
    nombre: "Reporte a inversionistas y socios",
    descripcion:
      "El sistema reúne el avance comercial, el avance de obra y el flujo de caja del proyecto en un reporte claro para inversionistas y socios, generado y enviado de forma automática en la periodicidad que defina. Transmite control y profesionalismo sin que dirección dedique días a prepararlo.",
    badge: "Nuevo",
    linkedProcessSlug: "reporte-inversionistas-socios",
    highlights: [
      "Reporte a inversionistas generado y enviado solo",
      "Una sola fuente con avance comercial, obra y caja",
      "Transmite control y profesionalismo a los socios",
    ],
  },
  // ── BLOQUE 06 · Postventa y dirección ──
  {
    codigo: "6.1",
    bloque: "B6",
    nombre: "Entrega de vivienda digital",
    descripcion:
      "El sistema guía la entrega de cada vivienda: checklist de revisión, acta de entrega firmada digitalmente y manuales de la vivienda enviados al propietario. Deja registro de todo y arranca la relación de postventa de forma ordenada y profesional.",
    badge: "Nuevo",
    linkedProcessSlug: "entrega-vivienda-digital",
    highlights: [
      "Entrega ordenada y documentada de cada vivienda",
      "Acta firmada digitalmente, sin papeleo suelto",
      "El propietario recibe sus manuales y garantías desde el primer día",
    ],
  },
  {
    codigo: "6.2",
    bloque: "B6",
    nombre: "Portal de incidencias para propietarios",
    descripcion:
      "Un portal donde el propietario reporta incidencias con foto, consulta sus garantías y recibe una primera respuesta de un asistente con IA que resuelve las dudas básicas. El equipo de posventa recibe solo lo que realmente requiere su atención, ya clasificado y priorizado, protegiendo la reputación de la desarrolladora.",
    badge: "Avanzado",
    linkedProcessSlug: "portal-propietarios-post-entrega",
    highlights: [
      "Un filtro inicial con IA resuelve buena parte de las consultas básicas de uso y mantenimiento",
      "El equipo de posventa y garantía ahorra horas de gestión",
      "Menos quejas públicas que afecten a futuras promociones",
    ],
  },
  {
    codigo: "6.3",
    bloque: "B6",
    nombre: "Gestión de garantías por plazos",
    descripcion:
      "El sistema lleva el control de las garantías de cada vivienda por plazos, acabados, instalaciones, estructura, sabiendo qué cubre cada una y hasta cuándo. Cuando entra una incidencia, define al instante si está en garantía y a quién corresponde, evitando discusiones y costos que no tocan.",
    badge: "Nuevo",
    linkedProcessSlug: "gestion-garantias-plazos",
    highlights: [
      "Cada garantía controlada por plazo y cobertura",
      "Define al instante si una incidencia está cubierta",
      "Evita asumir costos de reparaciones fuera de garantía",
    ],
  },
  {
    codigo: "6.4",
    bloque: "B6",
    nombre: "Alerta de viviendas estancadas",
    descripcion:
      "La IA cruza el tiempo en mercado, las visitas, el interés digital y la comparación con la competencia para detectar las unidades que no avanzan. Para cada una explica el motivo probable, precio, tipología, percepción, y propone acciones concretas: ajuste de precio, cambio de enfoque comercial o un nuevo público objetivo. Libera el capital atrapado en el stock parado.",
    badge: "Recomendado",
    linkedProcessSlug: "identificacion-reactivacion-unidades",
    highlights: [
      "Reduce los días en mercado de las unidades que no rotan",
      "Menos dependencia de rebajas agresivas de último minuto que comen margen",
      "Marketing dirigido al comprador correcto para cada unidad",
    ],
  },
  {
    codigo: "6.5",
    bloque: "B6",
    nombre: "Panel ejecutivo multiproyecto",
    descripcion:
      "Un panel para dirección que reúne el estado de todos los proyectos a la vez: avance comercial, avance de obra y flujo de caja, con alertas de los que se desvían. Permite decidir con datos al día y comparar proyectos sin pedir reportes a cada área.",
    badge: "Nuevo",
    linkedProcessSlug: "panel-ejecutivo-multiproyecto",
    highlights: [
      "Todos los proyectos en una sola pantalla",
      "Compara avance comercial, obra y caja entre proyectos",
      "Decisiones con datos al día, sin pedir reportes a cada área",
    ],
  },
];

export const getConstruccionModulesByBlock = (blockId: ConstruccionBlockId): ConstruccionModule[] =>
  construccionModules.filter((m) => m.bloque === blockId);

export const getConstruccionModuleByCodigo = (codigo: string): ConstruccionModule | undefined =>
  construccionModules.find((m) => m.codigo === codigo);
