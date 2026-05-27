import type { GestoriasBlockId } from "./gestoriasBlocks";

export interface GestoriasModule {
  codigo: string;
  bloque: GestoriasBlockId;
  nombre: string;
  descripcion: string;
  badge: string;
  linkedProcessSlug?: string;
  highlights?: string[];
}

export const gestoriasModules: GestoriasModule[] = [
  // ── BLOQUE 01 · Alta y captación de clientes ─────────────────────────────
  {
    codigo: "1.1",
    bloque: "B1",
    nombre: "Presupuesto enviado al instante sin que nadie lo prepare a mano",
    descripcion:
      "Cuando un potencial cliente pide información, el sistema genera automáticamente un presupuesto personalizado y lo envía por email o WhatsApp en minutos. Sin esperas, sin olvidar seguir up.",
    badge: "Primera impresión",
    linkedProcessSlug: "presupuestos-automaticos",
    highlights: [
      "Presupuesto generado al instante desde los datos del formulario o la llamada",
      "Envío automático con seguimiento si no hay respuesta en 48h",
      "El cliente recibe algo profesional mientras la competencia aún está pensando qué cobrar",
    ],
  },
  {
    codigo: "1.2",
    bloque: "B1",
    nombre: "Alta del nuevo cliente: datos, contrato y bienvenida en un solo paso",
    descripcion:
      "Cuando alguien dice que sí, el sistema recoge automáticamente toda la documentación necesaria, genera el contrato de servicios y activa la bienvenida. Sin emails de ida y vuelta ni documentos en papel.",
    badge: "Onboarding limpio",
    linkedProcessSlug: "alta-automatizada-nuevos-clientes-gestoria",
    highlights: [
      "Formulario inteligente que recoge CIF, actividad, datos bancarios y documentación inicial",
      "Contrato generado automáticamente con los servicios contratados y enviado a firmar",
      "El cliente queda dado de alta en el sistema sin trabajo manual del equipo",
    ],
  },
  {
    codigo: "1.3",
    bloque: "B1",
    nombre: "Contratos generados y enviados para su firma desde el móvil",
    descripcion:
      "Cualquier contrato — de servicios, de mandato, de representación — se genera, se envía y se firma digitalmente. Con la misma validez legal que la firma manuscrita y sin papel, escáner ni desplazamientos.",
    badge: "Cero papeles",
    linkedProcessSlug: "automatizacion-contratos-firma",
    highlights: [
      "Generación automática del contrato con datos del cliente ya registrados",
      "Firma digital desde cualquier dispositivo con validez legal completa",
      "Archivo automático del contrato firmado con trazabilidad de fecha y hora",
    ],
  },

  // ── BLOQUE 02 · Gestión documental ───────────────────────────────────────
  {
    codigo: "2.1",
    bloque: "B2",
    nombre: "Documentación del mes recibida sin llamar ni mandar WhatsApps",
    descripcion:
      "Cada mes, el sistema envía automáticamente a cada cliente el recordatorio personalizado de qué tiene que entregar antes del cierre. Con seguimiento hasta que llega todo, sin que el equipo tenga que perseguir a nadie.",
    badge: "Cierre sin estrés",
    linkedProcessSlug: "recopilacion-mensual-documentos",
    highlights: [
      "Recordatorio automático con la lista exacta de documentos pendientes por cliente",
      "Seguimiento progresivo: segundo aviso si no hay respuesta en 48h",
      "El equipo ve en tiempo real qué clientes han enviado y qué falta aún",
    ],
  },
  {
    codigo: "2.2",
    bloque: "B2",
    nombre: "Canal único para que el cliente envíe cualquier documento en cualquier momento",
    descripcion:
      "Se acabó recibir facturas por WhatsApp personal, adjuntos en emails de hilo largo o documentos en carpetas compartidas sin orden. El cliente tiene un canal claro y el equipo recibe todo organizado.",
    badge: "Un solo canal",
    linkedProcessSlug: "canal-documental-cliente",
    highlights: [
      "Portal o canal dedicado para el envío de documentos por tipo y fecha",
      "Confirmación automática al cliente de que el documento fue recibido",
      "El equipo recibe los docs clasificados sin tener que buscar en tres sitios",
    ],
  },
  {
    codigo: "2.3",
    bloque: "B2",
    nombre: "Cada documento recibido clasificado y archivado automáticamente",
    descripcion:
      "Cuando llega un documento, el sistema lo lee, identifica de qué se trata (factura, nómina, contrato, certificado) y lo archiva en la carpeta correcta del cliente correcto. Sin intervención manual.",
    badge: "Archivo automático",
    linkedProcessSlug: "clasificacion-automatica-documentos",
    highlights: [
      "Clasificación automática por tipo de documento y cliente usando IA",
      "Archivo directo en el sistema de gestión sin que nadie lo mueva a mano",
      "Búsqueda posterior en segundos: cualquier documento localizable al instante",
    ],
  },
  {
    codigo: "3.3",
    bloque: "B3",
    nombre: "Alerta antes de que un certificado digital, poder o documento caduque",
    descripcion:
      "Certificados digitales, poderes notariales, NIEs, documentos de identidad — todos tienen fecha de caducidad. El sistema los vigila y avisa con suficiente antelación para renovar sin urgencias ni sustos.",
    badge: "Cero sorpresas",
    linkedProcessSlug: "alertas-caducidad-documentos",
    highlights: [
      "Vigilancia automática de todas las fechas de caducidad de documentos críticos",
      "Alerta con X días de antelación configurable según el tipo de documento",
      "Fin a los bloqueos en trámites por certificados caducados en el peor momento",
    ],
  },

  // ── BLOQUE 03 · Fiscal y vencimientos ────────────────────────────────────
  {
    codigo: "3.1",
    bloque: "B3",
    nombre: "El calendario fiscal siempre vigilado — cero recargos por despiste",
    descripcion:
      "Modelo 303, 115, 111, 200, 190, 347 — cada vencimiento tiene su alerta automática con antelación suficiente para actuar. El sistema avisa al equipo interno y, si procede, también al cliente para que tenga los datos a tiempo.",
    badge: "Calendario blindado",
    linkedProcessSlug: "alertas-vencimientos-fiscales",
    highlights: [
      "Alertas automáticas de cada vencimiento fiscal y laboral del año",
      "Aviso previo al cliente para que entregue la documentación necesaria antes del plazo",
      "Registro de qué declaraciones están presentadas, pendientes o en revisión",
    ],
  },
  {
    codigo: "3.2",
    bloque: "B3",
    nombre: "El cliente sabe en qué punto está su trámite sin tener que llamar",
    descripcion:
      "Cada expediente tiene un estado visible. Cuando avanza — presentado, en revisión, resuelto — el cliente recibe una actualización automática. Sin llamadas de seguimiento ni emails de '¿hay alguna novedad?'.",
    badge: "Transparencia total",
    linkedProcessSlug: "seguimiento-expedientes",
    highlights: [
      "Estado actualizado de cada expediente en tiempo real para cliente y gestor",
      "Notificación automática al cliente cada vez que hay un avance relevante",
      "El equipo tiene visión global del volumen de trámites en curso sin revisar cada carpeta",
    ],
  },

  // ── BLOQUE 04 · Laboral y nóminas de clientes ────────────────────────────
  {
    codigo: "4.1",
    bloque: "B4",
    nombre: "Datos del nuevo empleado recibidos por canal estructurado, no a trozos por WhatsApp",
    descripcion:
      "Cuando un cliente comunica una nueva incorporación, el sistema lanza un flujo automático que solicita al futuro empleado todos los datos necesarios (DNI, SS, cuenta bancaria, modelo 145) de forma organizada y completa.",
    badge: "Alta sin caos",
    linkedProcessSlug: "gestion-altas-empleados",
    highlights: [
      "Formulario automático enviado al nuevo empleado con todo lo necesario para el alta",
      "Los datos llegan completos y verificados, no a trozos en mensajes de WhatsApp",
      "Checklist de trámites generado automáticamente para el técnico laboral",
    ],
  },
  {
    codigo: "4.2",
    bloque: "B4",
    nombre: "Contratos temporales vigilados antes de que venzan sin revisar expedientes a mano",
    descripcion:
      "El sistema controla las fechas de fin de todos los contratos temporales de los clientes y avisa con antelación suficiente para decidir si renovar, convertir a indefinido o extinguir — siempre dentro del plazo legal.",
    badge: "Sin líos laborales",
    linkedProcessSlug: "vencimientos-contratos-laborales",
    highlights: [
      "Alerta automática cuando un contrato temporal se acerca a su fecha de fin",
      "Aviso al cliente para que decida qué hacer antes de que sea tarde",
      "Fin a las extinciones improvisadas y a los problemas por no respetar plazos",
    ],
  },
  {
    codigo: "4.3",
    bloque: "B4",
    nombre: "Bajas, accidentes y incidencias de personal gestionados sin que nada se pierda",
    descripcion:
      "Cuando un empleado de un cliente causa baja médica, sufre un accidente o hay una incidencia laboral, el sistema registra el caso y lanza el flujo de documentación necesaria — IT, partes, comunicaciones — sin que el gestor tenga que coordinar todo a mano.",
    badge: "Incidencias controladas",
    linkedProcessSlug: "incidencias-laborales-clientes",
    highlights: [
      "Registro automático de la incidencia con categorización por tipo",
      "Checklist de documentación requerida según el tipo de incidencia",
      "Seguimiento hasta el cierre del expediente sin que nada quede en el limbo",
    ],
  },
  {
    codigo: "4.4",
    bloque: "B4",
    nombre: "Nóminas enviadas a cada empleado automáticamente sin una sola llamada",
    descripcion:
      "Cada mes, una vez cerradas las nóminas, el sistema las distribuye automáticamente a cada empleado por el canal configurado. Sin envíos manuales, sin riesgo de mandar la nómina de uno a otro y sin que esa tarea ocupe una mañana de un técnico.",
    badge: "Distribución sin errores",
    linkedProcessSlug: "envio-automatico-nominas",
    highlights: [
      "Distribución automática a cada empleado en cuanto las nóminas están listas",
      "Cero riesgo de enviar la nómina equivocada al empleado equivocado",
      "Una mañana entera de trabajo manual convertida en un proceso de segundos",
    ],
  },

  // ── BLOQUE 05 · Relación con el cliente ──────────────────────────────────
  {
    codigo: "5.1",
    bloque: "B5",
    nombre: "Cada llamada con el cliente resumida y guardada en el CRM automáticamente",
    descripcion:
      "Cuando termina una llamada con un cliente, el sistema genera un resumen automático de lo tratado, los compromisos adquiridos y los próximos pasos — y lo registra en el CRM. Sin tomar notas a mano ni olvidar lo que se acordó.",
    badge: "Memoria perfecta",
    linkedProcessSlug: "resumen-llamadas-crm",
    highlights: [
      "Transcripción y resumen automático de cada llamada con puntos clave destacados",
      "Registro inmediato en el CRM vinculado al cliente correcto",
      "El asesor llega a la siguiente reunión con el historial completo en segundos",
    ],
  },
  {
    codigo: "5.2",
    bloque: "B5",
    nombre: "El asesor tiene toda la información del cliente en el bolsillo antes de cada reunión",
    descripcion:
      "Un asistente interno que centraliza el historial de cada cliente: qué servicios tiene, qué incidencias ha habido, qué se habló en la última reunión, qué plazos tiene próximos. Para que cualquier miembro del equipo pueda atenderle bien desde el primer segundo.",
    badge: "Equipo alineado",
    linkedProcessSlug: "asistente-interno-comerciales",
    highlights: [
      "Ficha completa del cliente accesible desde cualquier dispositivo antes de cada contacto",
      "Historial de interacciones, documentos entregados y compromisos pendientes en un solo lugar",
      "Cualquier asesor del equipo puede atender al cliente con el mismo nivel de detalle",
    ],
  },
  {
    codigo: "5.3",
    bloque: "B5",
    nombre: "Recupera clientes que llevan tiempo sin dar señales de vida",
    descripcion:
      "Clientes que redujeron servicios, que dejaron de responder o que simplemente llevan meses en modo automático reciben una secuencia de reactivación personalizada que recuerda el valor de la gestoría y abre la puerta a una conversación.",
    badge: "Clientes recuperados",
    linkedProcessSlug: "reactivacion-clientes-gestoria",
    highlights: [
      "Detección automática de clientes con actividad baja o sin contacto reciente",
      "Secuencia de mensajes personalizada que no suena comercial sino cercana",
      "Recuperación de relación antes de que el cliente decida buscar otra gestoría",
    ],
  },

  // ── BLOQUE 06 · Operativa interna de la gestoría ─────────────────────────
  {
    codigo: "6.1",
    bloque: "B6",
    nombre: "Facturas de gasto de la gestoría registradas sin tocar Excel",
    descripcion:
      "Alquiler, software, suministros, formación — los gastos de la propia gestoría se registran automáticamente a partir de las facturas recibidas. Sin hojas de cálculo manuales ni contabilidad interna que nadie actualiza.",
    badge: "Control propio",
    linkedProcessSlug: "registro-automatico-gastos",
    highlights: [
      "Captura automática de facturas de gasto desde email o carpeta compartida",
      "Registro contable inmediato sin intervención del equipo",
      "La gestoría tiene su propia contabilidad tan ordenada como la de sus clientes",
    ],
  },
  {
    codigo: "6.2",
    bloque: "B6",
    nombre: "Extractos bancarios cuadrados con las facturas sin trabajo manual",
    descripcion:
      "El sistema importa los movimientos del banco, los cruza automáticamente con las facturas emitidas y recibidas, e identifica los que no cuadran. La conciliación mensual pasa de una tarde de trabajo a una revisión de diez minutos.",
    badge: "Conciliación automática",
    linkedProcessSlug: "conciliacion-bancaria-automatica",
    highlights: [
      "Importación automática de extractos bancarios y cruce con facturas",
      "Identificación inmediata de cobros pendientes y pagos sin factura asociada",
      "La conciliación mensual que antes tardaba horas ahora tarda minutos",
    ],
  },
];

export const getGestoriasModulesByBlock = (blockId: GestoriasBlockId): GestoriasModule[] =>
  gestoriasModules.filter((m) => m.bloque === blockId);

export const getGestoriasModuleByCodigo = (codigo: string): GestoriasModule | undefined =>
  gestoriasModules.find((m) => m.codigo === codigo);
