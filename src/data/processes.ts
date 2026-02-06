export interface Process {
  id: string;
  codigo: string;
  categoria: "A" | "B" | "C" | "D";
  categoriaNombre: string;
  nombre: string;
  tagline: string;
  recomendado: boolean;
  descripcionDetallada: string;
  pasos: string[];
  personalizacion: string;
}

export const processes: Process[] = [
  {
    id: "A1",
    codigo: "A1",
    categoria: "A",
    categoriaNombre: "Facturas y Gastos",
    nombre: "Facturas automatizadas",
    tagline: "No pierdas más tiempo calculando fees fijos y variables sobre la inversión.",
    recomendado: true,
    descripcionDetallada: "Desde tu hoja de Servicios → Generamos todas tus facturas automáticamente (proformas o en estado borrador), listas para validar y emitir. Leemos fees por cliente, proyectos y periodos desde donde los tengas volcados. Creamos la factura borrador en Holded con líneas, cantidades y periodo, asignada a cada cliente. Enviamos notificación al responsable para validar, emitir y enviar.",
    pasos: [
      "Leemos fees por cliente, proyectos y periodos desde donde los tengas volcados",
      "Creamos la factura borrador en Holded con líneas, cantidades y periodo, asignada a cada cliente",
      "Enviamos notificación al responsable para validar, emitir y enviar"
    ],
    personalizacion: "Elige la vía de comunicación que mejor se adapte a tu agencia."
  },
  {
    id: "A2",
    codigo: "A2",
    categoria: "A",
    categoriaNombre: "Facturas y Gastos",
    nombre: "Informe semanal de facturas vencidas",
    tagline: "Controla cada semana cómo van los impagos.",
    recomendado: true,
    descripcionDetallada: "Cada lunes → recibes un informe con un desglose de las facturas vencidas, quién debe cuánto y desde cuándo. Revisamos todas las facturas con estado 'vencida'. Calculamos antigüedad, importe total y asignamos cliente. Generamos un informe automático.",
    pasos: [
      "Revisamos todas las facturas con estado 'vencida'",
      "Calculamos antigüedad, importe total y asignamos cliente",
      "Generamos un informe automático"
    ],
    personalizacion: "Decide cuándo recibes el informe y si es por email, Slack o Drive."
  },
  {
    id: "A3",
    codigo: "A3",
    categoria: "A",
    categoriaNombre: "Facturas y Gastos",
    nombre: "Presupuestos automáticos",
    tagline: "Vuela enviando presupuestos.",
    recomendado: false,
    descripcionDetallada: "Desde un Sheets o cualquier fuente → Creamos presupuestos completos en Holded. Leemos tarifas, servicios y cantidades. Creamos el presupuesto con líneas y totales. Notificamos al responsable para envío o revisión.",
    pasos: [
      "Leemos tarifas, servicios y cantidades",
      "Creamos el presupuesto con líneas y totales",
      "Notificamos al responsable para envío o revisión"
    ],
    personalizacion: "Decide si el presupuesto se envía automáticamente al cliente o queda en borrador para que lo revises."
  },
  {
    id: "A4",
    codigo: "A4",
    categoria: "A",
    categoriaNombre: "Facturas y Gastos",
    nombre: "Seguimiento de presupuestos enviados",
    tagline: "Controla todos los presupuestos enviados.",
    recomendado: false,
    descripcionDetallada: "Si pasan X días sin respuesta → Aviso a responsables por cualquier vía. Revisamos el estado del presupuesto en Holded. Detectamos inactividad. Disparamos alerta o email de seguimiento.",
    pasos: [
      "Revisamos el estado del presupuesto en Holded",
      "Detectamos inactividad",
      "Disparamos alerta o email de seguimiento"
    ],
    personalizacion: "Elige el canal del aviso y los días sin respuesta."
  },
  {
    id: "A5",
    codigo: "A5",
    categoria: "A",
    categoriaNombre: "Facturas y Gastos",
    nombre: "Envío de recordatorios de pagos a clientes",
    tagline: "Automatiza el ir detrás de quien no ha pagado.",
    recomendado: true,
    descripcionDetallada: "Envía recordatorios de pago a los clientes que tienen facturas vencidas según hayan pasado 5/10/15 días. Identificación de facturas vencidas según días de atraso. Generación del mensaje con plantilla dinámica. Envío automático al correo del cliente.",
    pasos: [
      "Identificación de facturas vencidas según días de atraso",
      "Generación del mensaje con plantilla dinámica",
      "Envío automático al correo del cliente"
    ],
    personalizacion: "Elige tono del mensaje (amable, neutro, firme) y excepciones por cliente."
  },
  {
    id: "B6",
    codigo: "B6",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Informe de análisis e incidencias en horarios",
    tagline: "Ahorra tiempo analizando los datos para controlar a tus equipos.",
    recomendado: true,
    descripcionDetallada: "Cada semana → Recibes un reporte con fichajes incompletos, duplicados, días sin fichaje sin ausencia relacionada, cálculo del riesgo de burnout por exceso sostenido de horas extra, etc. Leemos los registros diarios de horas. Detectamos anomalías (faltantes, duplicados, exceso). Generamos alerta al manager.",
    pasos: [
      "Leemos los registros diarios de horas",
      "Detectamos anomalías (faltantes, duplicados, exceso)",
      "Generamos alerta al manager"
    ],
    personalizacion: "Elige qué tipo de alertas quieres recibir y cada cuánto."
  },
  {
    id: "B7",
    codigo: "B7",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Informe mensual de horas vs estimadas por proyecto",
    tagline: "Controla los desvíos de horas de cada proyecto.",
    recomendado: true,
    descripcionDetallada: "Recibe un informe mensual el primer día de cada mes → con horas estimadas, registradas y desviaciones. Cruzamos datos de imputación y de planning. Calculamos desviaciones individuales y por proyecto. Generamos un informe detallado.",
    pasos: [
      "Cruzamos datos de imputación y de planning",
      "Calculamos desviaciones individuales y por proyecto",
      "Generamos un informe detallado"
    ],
    personalizacion: "Elige formato del informe (PDF, Excel)."
  },
  {
    id: "B8",
    codigo: "B8",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Alertas por exceso de horas en proyectos",
    tagline: "Recibe avisos cuando algún proyecto se dispara en horas.",
    recomendado: true,
    descripcionDetallada: "Si un proyecto supera el umbral (ej. +15%) → Aviso automático a dirección y al Project Manager. Calculamos desviación entre horas estimadas vs. horas imputadas. Detectamos el umbral superado. Enviamos notificaciones automáticas.",
    pasos: [
      "Calculamos desviación entre horas estimadas vs. horas imputadas",
      "Detectamos el umbral superado",
      "Enviamos notificaciones automáticas"
    ],
    personalizacion: "Define el porcentaje de exceso que activa la alerta, el mensaje y quién la recibe."
  },
  {
    id: "C9",
    codigo: "C9",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Alertas de facturas de compra próximas a vencer",
    tagline: "Entérate de cuándo van a ir llegando los gastos previstos.",
    recomendado: true,
    descripcionDetallada: "Detectamos facturas a X días de vencimiento → Aviso para que prepares pago y evites sustos de tesorería. Leemos facturas de proveedores, importes y fechas. Calculamos los días restantes. Enviamos alertas individuales.",
    pasos: [
      "Leemos facturas de proveedores, importes y fechas",
      "Calculamos los días restantes",
      "Enviamos alertas individuales"
    ],
    personalizacion: "Decide días de anticipación y por dónde recibir el aviso."
  },
  {
    id: "C10",
    codigo: "C10",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Informes financieros para dirección",
    tagline: "Claridad financiera directa en tu inbox, cada mes.",
    recomendado: true,
    descripcionDetallada: "Cierre mensual → Informe con facturación, margen, costes. Consolidamos datos de ingresos, gastos y estructura. Calculamos KPIs clave. Enviamos informe por correo.",
    pasos: [
      "Consolidamos datos de ingresos, gastos y estructura",
      "Calculamos KPIs clave",
      "Enviamos informe por correo"
    ],
    personalizacion: "Elige tu fecha de cierre y tus KPIs."
  },
  {
    id: "C11",
    codigo: "C11",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Proyección automática de ingresos",
    tagline: "Recibe una previsión de ingresos según tu histórico y visión.",
    recomendado: false,
    descripcionDetallada: "Cierre mensual → Informe forecast con proyección de ingresos los próximos meses. Analizamos patrones de facturación anteriores. Calculamos escenarios moderados y alcistas. Generamos un forecast en gráfico + tabla.",
    pasos: [
      "Analizamos patrones de facturación anteriores",
      "Calculamos escenarios moderados y alcistas",
      "Generamos un forecast en gráfico + tabla"
    ],
    personalizacion: "Elige entre visión moderada, alcista o pesimista."
  },
  {
    id: "C12",
    codigo: "C12",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Traspasos automáticos de IVA",
    tagline: "Retira los impuestos a medida que llegan, para evitar sustos de tesorería cada trimestre.",
    recomendado: false,
    descripcionDetallada: "Cada factura recibida → Generamos desglose de IVA → Actualizamos documento con solicitud de traspaso bancario a cuenta de impuestos. Calculamos base y cuota de IVA por periodo. Generamos documento oficial de solicitud de traspaso. Notificamos al responsable.",
    pasos: [
      "Calculamos base y cuota de IVA por periodo",
      "Generamos documento oficial de solicitud de traspaso",
      "Notificamos al responsable"
    ],
    personalizacion: "Elige cuándo se notifica (mensual, trimestral) y vía (email, Slack o Drive)."
  },
  {
    id: "D13",
    codigo: "D13",
    categoria: "D",
    categoriaNombre: "Internos Agencias",
    nombre: "Registro automático de gastos",
    tagline: "Agiliza la gestión de facturas de gasto al máximo.",
    recomendado: true,
    descripcionDetallada: "Vuelcas factura en carpeta de Drive → Generamos la factura de gasto en Holded. Detección automática de facturas de compra volcadas. Envío al Inbox de Holded que las escanea con tecnología OCR. Creación automática del borrador de la factura de compra. Asignación a proveedor. Notificación al responsable para su revisión (opcional).",
    pasos: [
      "Detección automática de facturas de compra volcadas",
      "Envío al Inbox de Holded que las escanea con tecnología OCR",
      "Creación automática del borrador de la factura de compra",
      "Asignación a proveedor",
      "Notificación al responsable para su revisión (opcional)"
    ],
    personalizacion: "Elige la carpeta de Drive."
  },
  {
    id: "D14",
    codigo: "D14",
    categoria: "D",
    categoriaNombre: "Internos Agencias",
    nombre: "Creación de metas en ClickUp",
    tagline: "Saca todo el partido a las metas de ClickUp sin perder tiempo en crearlas a mano.",
    recomendado: true,
    descripcionDetallada: "Desde un documento con objetivos mensuales → Creamos metas en ClickUp, asignadas por cliente y equipo. Leemos los objetivos del documento. Creamos metas dinámicas en ClickUp por usuario/equipo. Configuramos seguimiento automático de KPIs.",
    pasos: [
      "Leemos los objetivos del documento",
      "Creamos metas dinámicas en ClickUp por usuario/equipo",
      "Configuramos seguimiento automático de KPIs"
    ],
    personalizacion: "Elige colores por cliente/equipo."
  },
  {
    id: "D15",
    codigo: "D15",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Facturación automática basada en horas (freelance)",
    tagline: "¿Trabajas con distintos freelance a distintos precios por hora?",
    recomendado: false,
    descripcionDetallada: "Te imputa sus horas un freelance → Se crea la factura de gasto y se asocia a proyecto. Leemos horas registradas por cada freelance. Multiplicamos por tarifa asociada. Creamos factura de gasto y la asignamos al proyecto/cliente.",
    pasos: [
      "Leemos horas registradas por cada freelance",
      "Multiplicamos por tarifa asociada",
      "Creamos factura de gasto y la asignamos al proyecto/cliente"
    ],
    personalizacion: "Define tarifas por freelance y si quieres aprobación antes de crear la factura."
  },
  {
    id: "D16",
    codigo: "D16",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Gestión automática de retenciones (freelance)",
    tagline: "Retira las retenciones a medida que llegan, para evitar sustos de tesorería cada trimestre.",
    recomendado: false,
    descripcionDetallada: "Cuando entra una factura de proveedor → Calculamos retención, generamos asiento y la solicitud de traspaso. Detectamos facturas sujetas a retención. Calculamos el % correspondiente. Creamos asiento contable y aviso de pago.",
    pasos: [
      "Detectamos facturas sujetas a retención",
      "Calculamos el % correspondiente",
      "Creamos asiento contable y aviso de pago"
    ],
    personalizacion: "Elige periodicidad del cálculo y cómo quieres recibir el aviso de pago."
  }
];

export const categories = [
  { id: "A", name: "Facturas y Gastos" },
  { id: "B", name: "Horarios y Proyectos" },
  { id: "C", name: "Finanzas y Tesorería" },
  { id: "D", name: "Internos Agencias" }
];
