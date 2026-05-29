import type { BlockId } from "./industrialBlocks";

export interface IndustrialModule {
  codigo: string;
  bloque: BlockId;
  nombre: string;
  descripcion: string;
  badge: string;
  linkedProcessSlug?: string;
  highlights?: string[];
}

export const industrialModules: IndustrialModule[] = [
  // ── BLOQUE 01 · Clientes y presupuestos ──────────────────────────────────
  {
    codigo: "1.1",
    bloque: "B1",
    nombre: "Captación de peticiones de oferta",
    descripcion:
      "Recoge automáticamente las solicitudes de presupuesto que llegan por email, web o WhatsApp y las convierte en fichas de oportunidad listas para procesar, con el producto, cantidad y plazo ya extraídos.",
    badge: "Sin ofertas perdidas",
    linkedProcessSlug: "industrial-captacion-peticiones-oferta",
    highlights: [
      "Captura desde email, web y WhatsApp en una sola bandeja",
      "Extrae producto, cantidad y plazo automáticamente",
      "Asigna la petición al comercial responsable",
    ],
  },
  {
    codigo: "1.2",
    bloque: "B1",
    nombre: "Generación de presupuestos automáticos",
    descripcion:
      "El sistema prepara el presupuesto con precios actualizados, especificaciones técnicas y plazos de entrega sin que el comercial tenga que buscar cada dato a mano. El documento sale en el formato y la imagen de la empresa.",
    badge: "Presupuestos en minutos",
    linkedProcessSlug: "industrial-presupuestos-automaticos",
    highlights: [
      "Precios y plazos extraídos de la base de datos actualizada",
      "Documento generado en el formato de la empresa",
      "El comercial solo revisa y aprueba, no construye desde cero",
    ],
  },
  {
    codigo: "1.3",
    bloque: "B1",
    nombre: "Seguimiento de ofertas abiertas",
    descripcion:
      "Alerta cuando una oferta lleva demasiado tiempo sin respuesta del cliente y registra automáticamente el resultado — ganada, perdida o en espera — para alimentar el histórico comercial sin tecleo.",
    badge: "Sin ofertas olvidadas",
    linkedProcessSlug: "industrial-seguimiento-ofertas",
    highlights: [
      "Alerta al comercial cuando una oferta supera X días sin respuesta",
      "Registro automático del resultado al cierre",
      "Histórico de ratio de conversión por producto y cliente",
    ],
  },
  {
    codigo: "1.4",
    bloque: "B1",
    nombre: "Portal de estado de pedido para el cliente",
    descripcion:
      "El cliente puede ver en tiempo real en qué fase está su pedido, cuándo se entrega y qué documentación tiene disponible, sin necesidad de llamar al comercial ni al administrativo.",
    badge: "Clientes informados",
    linkedProcessSlug: "industrial-portal-estado-pedido",
    highlights: [
      "Acceso por link sin contraseñas complicadas",
      "Estado actualizado en tiempo real: confirmado, en producción, enviado",
      "Documentación técnica y albaranes disponibles al instante",
    ],
  },

  // ── BLOQUE 02 · Pedidos y producción ─────────────────────────────────────
  {
    codigo: "2.1",
    bloque: "B2",
    nombre: "Entrada de pedido y planificación de producción",
    descripcion:
      "Cuando entra un pedido confirmado, el sistema lo convierte automáticamente en una orden de fabricación, reserva los materiales disponibles y lo ubica en la cola de producción según capacidad y plazo comprometido.",
    badge: "De pedido a planta sin fricción",
    linkedProcessSlug: "industrial-entrada-pedido-produccion",
    highlights: [
      "Orden de fabricación creada al instante sin intervención manual",
      "Materiales reservados automáticamente contra el stock disponible",
      "Posicionamiento en cola según plazo de entrega comprometido",
    ],
  },
  {
    codigo: "2.2",
    bloque: "B2",
    nombre: "Control de avance de línea en tiempo real",
    descripcion:
      "Muestra en un panel visual el estado de cada orden activa: qué está en proceso, qué está parado, cuánto falta para cerrarla y si hay riesgo de retraso respecto al plazo comprometido.",
    badge: "Sin sorpresas en producción",
    linkedProcessSlug: "industrial-control-avance-linea",
    highlights: [
      "Panel visual actualizado en tiempo real por operarios",
      "Alertas automáticas cuando una orden supera el tiempo previsto",
      "Visibilidad para producción y para comercial desde el mismo sitio",
    ],
  },
  {
    codigo: "2.3",
    bloque: "B2",
    nombre: "Gestión de cambios de pedido en curso",
    descripcion:
      "Cuando el cliente modifica un pedido ya en marcha, el proceso recalcula el impacto en plazo, coste y materiales y notifica a los afectados antes de validar el cambio, evitando sorpresas en planta.",
    badge: "Cambios sin caos",
    linkedProcessSlug: "industrial-cambios-pedido-curso",
    highlights: [
      "Cálculo automático del impacto en plazo y coste",
      "Notificación coordinada a producción, compras y comercial",
      "Registro trazable de cada modificación y su aprobación",
    ],
  },
  {
    codigo: "2.4",
    bloque: "B2",
    nombre: "Cierre de orden y entrega de documentación",
    descripcion:
      "Al terminar la producción, el sistema genera automáticamente el albarán, el certificado de calidad y la documentación técnica del lote, y los envía al cliente en un solo paso coordinado.",
    badge: "Cierre limpio, sin papeleos",
    linkedProcessSlug: "industrial-cierre-orden-documentacion",
    highlights: [
      "Albarán y certificado de calidad generados al cierre de la orden",
      "Envío automático al cliente por email o portal",
      "Copia archivada en el expediente del pedido sin intervención",
    ],
  },

  // ── BLOQUE 03 · Calidad, entregas y trazabilidad ──────────────────────────
  {
    codigo: "3.1",
    bloque: "B3",
    nombre: "Control de calidad en proceso",
    descripcion:
      "Registra los controles de calidad en cada punto crítico de la producción y bloquea el avance de la orden si hay una desviación sin resolver, evitando que el problema llegue más lejos en el proceso.",
    badge: "Calidad antes de que salga",
    linkedProcessSlug: "industrial-control-calidad-proceso",
    highlights: [
      "Puntos de control configurables por tipo de producto",
      "Bloqueo automático del avance ante desviaciones",
      "Registro trazable de cada inspección con resultado y responsable",
    ],
  },
  {
    codigo: "3.2",
    bloque: "B3",
    nombre: "Trazabilidad de lote y número de serie",
    descripcion:
      "Sigue el rastro de cada pieza o lote desde la materia prima hasta el cliente final, con un histórico consultable en segundos si hay una reclamación o una auditoría de cliente o de certificación.",
    badge: "Trazabilidad total",
    linkedProcessSlug: "industrial-trazabilidad-lote-serie",
    highlights: [
      "Árbol de trazabilidad completo: materia prima → proceso → cliente",
      "Consulta en segundos por número de lote o serie",
      "Exportable para auditorías y reclamaciones de cliente",
    ],
  },
  {
    codigo: "3.3",
    bloque: "B3",
    nombre: "Gestión de devoluciones y no conformidades",
    descripcion:
      "Abre automáticamente un expediente de no conformidad cuando hay una devolución o reclamación, lo asigna al responsable de calidad y hace seguimiento hasta el cierre formal con el cliente.",
    badge: "Reclamaciones resueltas rápido",
    linkedProcessSlug: "industrial-devoluciones-no-conformidades",
    highlights: [
      "Expediente de no conformidad abierto al instante",
      "Asignación automática al responsable de calidad",
      "Seguimiento hasta cierre con cliente y registro de causa raíz",
    ],
  },
  {
    codigo: "3.4",
    bloque: "B3",
    nombre: "Preparación y seguimiento de envíos",
    descripcion:
      "Coordina la preparación del pedido, genera la documentación de transporte y envía al cliente el número de seguimiento en cuanto el pedido sale de planta, sin que nadie tenga que recordarlo.",
    badge: "Envíos siempre controlados",
    linkedProcessSlug: "industrial-preparacion-seguimiento-envios",
    highlights: [
      "Documentación de transporte generada automáticamente",
      "Número de seguimiento enviado al cliente al salir de almacén",
      "Alerta interna si el transportista registra una incidencia",
    ],
  },

  // ── BLOQUE 04 · Compras y proveedores ────────────────────────────────────
  {
    codigo: "4.1",
    bloque: "B4",
    nombre: "Solicitud de materiales y generación de pedidos",
    descripcion:
      "Cuando la planificación detecta que faltan materiales para una orden, lanza automáticamente la solicitud de compra con las especificaciones y el proveedor preferente ya seleccionado, listo para aprobar en un clic.",
    badge: "Compras sin burocracia",
    linkedProcessSlug: "industrial-solicitud-materiales-pedidos",
    highlights: [
      "Solicitud generada automáticamente por necesidad de producción",
      "Proveedor preferente preseleccionado según histórico",
      "Aprobación de un clic para el responsable de compras",
    ],
  },
  {
    codigo: "4.2",
    bloque: "B4",
    nombre: "Evaluación y homologación de proveedores",
    descripcion:
      "Recoge automáticamente los plazos de entrega reales, la tasa de calidad y el cumplimiento de precio por proveedor, y genera un informe periódico para decidir con quién seguir trabajando con datos objetivos.",
    badge: "Proveedores siempre evaluados",
    linkedProcessSlug: "industrial-evaluacion-proveedores",
    highlights: [
      "Métricas reales: plazo cumplido, calidad recibida, precio acordado",
      "Informe periódico automático sin preparación manual",
      "Base para negociación y decisiones de homologación fundamentadas",
    ],
  },
  {
    codigo: "4.3",
    bloque: "B4",
    nombre: "Recepción y verificación de materiales",
    descripcion:
      "Guía al personal de almacén en la recepción de materiales, comprueba que lo recibido coincide con el pedido y registra las incidencias con el proveedor antes de dar entrada al stock y permitir su uso en producción.",
    badge: "Stock correcto desde el primer día",
    linkedProcessSlug: "industrial-recepcion-verificacion-materiales",
    highlights: [
      "Checklist guiado por pedido para el equipo de almacén",
      "Detección automática de diferencias entre pedido y albarán",
      "Incidencia registrada al proveedor antes de dar entrada al stock",
    ],
  },
  {
    codigo: "4.4",
    bloque: "B4",
    nombre: "Control de stock mínimo y alertas de reposición",
    descripcion:
      "Monitoriza el nivel de cada material crítico y lanza una alerta cuando baja del mínimo definido, con tiempo suficiente para recibir el pedido antes de que afecte a la planificación de producción.",
    badge: "Sin roturas de stock",
    linkedProcessSlug: "industrial-stock-minimo-alertas",
    highlights: [
      "Umbrales configurables por material y proveedor habitual",
      "Alerta con el tiempo de antelación necesario para cada referencia",
      "Propuesta de pedido automática para aprobación rápida",
    ],
  },

  // ── BLOQUE 05 · Administración y facturación ──────────────────────────────
  {
    codigo: "5.1",
    bloque: "B5",
    nombre: "Facturación automática al cierre de entrega",
    descripcion:
      "En cuanto el albarán está firmado y registrado, el sistema genera la factura con los datos correctos, la envía al cliente y la registra en contabilidad sin intervención manual ni demoras administrativas.",
    badge: "Facturas al instante",
    linkedProcessSlug: "industrial-facturacion-automatica",
    highlights: [
      "Del albarán firmado a la factura enviada sin pasos manuales",
      "Registro automático en el sistema contable",
      "Cero errores por datos introducidos a mano",
    ],
  },
  {
    codigo: "5.2",
    bloque: "B5",
    nombre: "Seguimiento de cobros y reclamación de impagados",
    descripcion:
      "Controla el estado de cada factura emitida, lanza recordatorios automáticos antes del vencimiento y escala la reclamación si el pago no llega en plazo, sin que el administrativo tenga que llevar la cuenta a mano.",
    badge: "Cero facturas olvidadas",
    linkedProcessSlug: "industrial-seguimiento-cobros",
    highlights: [
      "Recordatorio preventivo días antes del vencimiento",
      "Escalado automático a responsable si no hay respuesta",
      "Histórico de cobros y tiempos reales por cliente",
    ],
  },
  {
    codigo: "5.3",
    bloque: "B5",
    nombre: "Cuadro de mando financiero",
    descripcion:
      "Consolida facturación, cobros pendientes, coste de producción y margen por orden en un informe accesible en tiempo real, sin tener que abrir la contabilidad ni esperar al cierre del gestor.",
    badge: "Números claros siempre",
    linkedProcessSlug: "industrial-cuadro-mando-financiero",
    highlights: [
      "Visibilidad de facturación, cobros y margen en un solo panel",
      "Actualizado en tiempo real sin intervención manual",
      "Accesible desde cualquier dispositivo para dirección",
    ],
  },
  {
    codigo: "5.4",
    bloque: "B5",
    nombre: "Informes mensuales de actividad y rendimiento",
    descripcion:
      "Genera automáticamente el informe mensual con las métricas clave de producción, ventas, calidad y equipo, listo para presentar a dirección sin necesidad de prepararlo desde cero cada vez.",
    badge: "Informe mensual sin esfuerzo",
    linkedProcessSlug: "industrial-informes-mensuales",
    highlights: [
      "Informe generado automáticamente al cierre de cada mes",
      "Métricas de producción, ventas, calidad y equipo en un solo documento",
      "Envío automático a dirección por email o canal interno",
    ],
  },

  // ── BLOQUE 06 · Equipo y planta ──────────────────────────────────────────
  {
    codigo: "6.1",
    bloque: "B6",
    nombre: "Onboarding de nuevo trabajador",
    descripcion:
      "Cuando se incorpora un operario o técnico, el proceso organiza automáticamente la documentación, el acceso a sistemas, la asignación de equipos de protección y la formación obligatoria del primer día, sin que el responsable tenga que improvisar.",
    badge: "Incorporación en orden",
    linkedProcessSlug: "industrial-onboarding-trabajador",
    highlights: [
      "Documentación, accesos y EPIs coordinados desde el primer día",
      "Formaciones obligatorias asignadas automáticamente por puesto",
      "Seguimiento de que el nuevo ha completado cada paso",
    ],
  },
  {
    codigo: "6.2",
    bloque: "B6",
    nombre: "Control de presencia y turnos",
    descripcion:
      "Registra entradas y salidas, gestiona los cambios de turno y detecta ausencias no justificadas, todo sincronizado con nómina y con la planificación de planta para que nunca haya una línea sin cobertura.",
    badge: "Presencia siempre cuadrada",
    linkedProcessSlug: "industrial-control-presencia-turnos",
    highlights: [
      "Turnos individuales con confirmación, sin grupos de WhatsApp",
      "Detección automática de ausencias y propuesta de sustitución",
      "Sincronización con el software de nóminas",
    ],
  },
  {
    codigo: "6.3",
    bloque: "B6",
    nombre: "Gestión de documentación laboral",
    descripcion:
      "Centraliza contratos, certificados, permisos, formaciones PRL y revisiones médicas de cada trabajador, y alerta cuando hay un documento próximo a vencer o una revisión pendiente antes de que sea un incumplimiento.",
    badge: "Expedientes al día",
    linkedProcessSlug: "industrial-documentacion-laboral",
    highlights: [
      "Expediente digital de cada trabajador en un solo lugar",
      "Alertas automáticas antes del vencimiento de documentos",
      "Trazabilidad completa para inspecciones de trabajo o auditorías",
    ],
  },
  {
    codigo: "6.4",
    bloque: "B6",
    nombre: "Mantenimiento preventivo de maquinaria",
    descripcion:
      "Planifica y registra las revisiones de cada máquina, avisa antes de que caduque un mantenimiento y deja trazabilidad de cada intervención para auditorías internas, de cliente o de certificación de calidad.",
    badge: "Máquinas siempre operativas",
    linkedProcessSlug: "industrial-mantenimiento-preventivo",
    highlights: [
      "Plan de mantenimiento configurado por máquina y tipo de revisión",
      "Alerta con la antelación necesaria antes de cada vencimiento",
      "Registro de cada intervención con responsable y resultado",
    ],
  },
];

export const getModulesByBlock = (blockId: BlockId): IndustrialModule[] =>
  industrialModules.filter((m) => m.bloque === blockId);

export const getModuleByCodigo = (codigo: string): IndustrialModule | undefined =>
  industrialModules.find((m) => m.codigo === codigo);
