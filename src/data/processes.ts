export interface Process {
  id: string;
  codigo: string;
  slug: string;
  categoria: string;
  categoriaNombre: string;
  nombre: string;
  tagline: string;
  one_liner?: string;
  badges?: string[];
  benefits?: string[];
  recomendado: boolean;
  descripcionDetallada: string;
  summary?: {
    what_it_is: string;
    for_who: string[];
    requirements: string[];
    output: string;
  };
  indicators?: {
    time_estimate: string;
    complexity: string;
    integrations: string[];
  };
  how_it_works_steps?: {
    title: string;
    short: string;
    detail?: string;
    media?: string;
  }[];
  customization?: {
    options_blocks: any[];
    free_text_placeholder: string;
  };
  demo?: {
    video_url?: string;
    duration?: string;
    chapters?: { time: string; title: string }[];
    gallery?: string[];
  };
  faqs?: { q: string; a: string }[];
  use_cases?: string[];
  common_mistakes_avoided?: string[];
  related_processes?: string[]; // slugs
  pasos: string[];
  personalizacion: string;
  sectores?: string[];
  herramientas?: string[];
  canales?: string[];
  madurez?: ("Básico" | "Intermedio" | "Avanzado")[];
  dolores?: string[];
  integration_domains?: ("ERP" | "CRM" | "COMMS" | "DOCS" | "OTHER")[];
  landing_slug?: string;
}


export const processes: Process[] = [
  {
    id: "A1",
    codigo: "A1",
    slug: "facturas-automatizadas",
    categoria: "A",
    categoriaNombre: "Facturas y Gastos",
    nombre: "Facturación automática de clientes",
    tagline: "Genera tus facturas de venta automáticamente basándote en fees e inversión.",
    one_liner: "Genera facturas proforma o borradores automáticamente desde tu hoja de servicios.",
    badges: ["Popular", "Recomendado"],
    benefits: [
      "Ahorro de 10+ horas mensuales en facturación",
      "Eliminación de errores en cálculos de fees variables",
      "Control total antes de emitir y enviar"
    ],
    recomendado: true,
    descripcionDetallada: "Desde tu hoja de Servicios → Generamos todas tus facturas automáticamente (proformas o en estado borrador), listas para validar y emitir. Leemos fees por cliente, proyectos y periodos desde donde los tengas volcados. Creamos la factura borrador en tu sistema de facturación/ERP con líneas, cantidades y periodo, asignada a cada cliente. Enviamos notificación al responsable para finalizar.",
    summary: {
      what_it_is: "Sistema que conecta tus hojas de cálculo o CRM con tu ERP/Software de gestión para automatizar la creación de borradores de facturas.",
      for_who: ["Agencias con fees variables", "Empresas de servicios", "Freelancers con volumen"],
      requirements: ["ERP/Software de gestión", "Hoja de cálculo estructurada", "Herramienta de automatización"],
      output: "Borradores de factura en ERP + Notificación por el canal de comunicación que prefieras"
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Alta",
      integrations: ["ERP", "Hoja de cálculo", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Recolección de datos", short: "Leemos fees y proyectos desde tu fuente de datos.", detail: "Conectamos con tus hojas de cálculo para extraer automáticamente los datos del periodo." },
      { title: "Creación en ERP", short: "Generamos el borrador en tu sistema de gestión.", detail: "Creamos la proforma con todos los conceptos, impuestos y datos del cliente ya pre-rellenados." },
      { title: "Notificación y Revisión", short: "Te avisamos para que solo tengas que darle a 'Enviar'.", detail: "Recibes un aviso en el canal que elijas para validar que todo está correcto." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Canal de comunicación", options: ["Email", "Slack", "Teams", "WhatsApp", "Tu vía de comunicación preferida"] },
        { type: "radio", label: "Estado inicial", options: ["Borrador", "Emitida"] }
      ],
      free_text_placeholder: "¿Tienes algún fee especial o regla de redondeo?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { q: "¿Es seguro conectar mi ERP?", a: "Sí, usamos APIs oficiales con encriptación de grado bancario." },
      { q: "¿Puedo revisar antes de enviar?", a: "Totalmente. Por defecto las facturas se crean como borradores." }
    ],
    use_cases: ["Agencias de marketing", "Consultoras", "SaaS B2B"],
    common_mistakes_avoided: ["Errores de redondeo", "Olvido de facturar horas extra", "Retraso en el flujo de caja"],
    related_processes: ["informe-semanal-facturas-vencidas", "presupuestos-automaticos"],
    pasos: [
      "Leemos fees por cliente, proyectos y periodos desde donde los tengas volcados",
      "Creamos la factura borrador en tu sistema de facturación/ERP con líneas, cantidades y periodo, asignada a cada cliente",
      "Enviamos notificación al responsable para validar, emitir y enviar"
    ],
    personalizacion: "Elige la vía de comunicación que mejor se adapte a tu agencia.",
    sectores: ["Agencia/marketing", "Servicios profesionales", "E-commerce", "Gestoria"],
    herramientas: ["ERP/Software de gestión", "Hoja de cálculo"],
    dolores: ["Quiero automatizar presupuestos y respuestas", "Necesito centralizar la información de clientes"],
    integration_domains: ["ERP"]
  },

  {
    id: "A2",
    codigo: "A2",
    slug: "informe-semanal-facturas-vencidas",
    categoria: "A",
    categoriaNombre: "Facturas y Gastos",
    nombre: "Informe semanal de facturas vencidas",
    tagline: "Controla cada semana cómo van los impagos.",
    recomendado: true,
    descripcionDetallada: "Cada lunes → recibes un informe con un desglose de las facturas vencidas, quién debe cuánto y desde cuándo. Revisamos todas las facturas con estado 'vencida'. Calculamos antigüedad, importe total y asignamos cliente. Generamos un informe automático.",
    summary: {
      what_it_is: "Informe automatizado que consolida la deuda pendiente de clientes para una gestión de cobros proactiva.",
      for_who: ["Departamentos financieros", "Dueños de agencias", "Project Managers"],
      requirements: ["ERP/Software de gestión", "canal de comunicación que prefieras"],
      output: "Dashboard semanal por el canal elegido con ranking de deuda por cliente."
    },
    indicators: {
      time_estimate: "< 1 semana",
      complexity: "Baja",
      integrations: ["ERP", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Extracción de datos", short: "Leemos facturas vencidas desde tu ERP.", detail: "Cada semana, el sistema revisa automáticamente tu software de gestión buscando facturas con fecha de vencimiento superada." },
      { title: "Consolidación", short: "Agrupamos deuda por cliente y antigüedad.", detail: "Calculamos cuánto debe cada cliente y cuántos días de retraso lleva acumulados." },
      { title: "Envío de reporte", short: "Recibes el resumen en tu canal favorito.", detail: "Generamos un informe limpio y directo para que sepas dónde poner el foco el lunes por la mañana." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Día de envío", options: ["Lunes", "Viernes"] },
        { type: "select", label: "Canal de comunicación", options: ["Email", "Slack", "Teams", "WhatsApp", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Necesitas algún filtro por importe mínimo?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Se puede filtrar por etiquetas en el ERP?", a: "Sí, podemos segmentar el informe por etiquetas de cliente o de factura que tengas definidas." }
    ],
    pasos: [
      "Revisamos todas las facturas con estado 'vencida'",
      "Calculamos antigüedad, importe total y asignamos cliente",
      "Generamos un informe automático"
    ],
    personalizacion: "Decide cuándo recibes el informe y por qué canal (tu vía de comunicación preferida, mensajería, etc.).",
    sectores: ["Agencia/marketing", "Servicios profesionales", "Retail", "Gestoria"],
    herramientas: ["ERP/Software de gestión", "Canal de comunicación"],
    dolores: ["Necesito centralizar la información de clientes"],
    related_processes: ["recordatorios-pagos", "informes-financieros-direccion"],
    integration_domains: ["ERP"]
  },

  {
    id: "A3",
    codigo: "A3",
    slug: "presupuestos-automaticos",
    categoria: "A",
    categoriaNombre: "Facturas y Gastos",
    nombre: "Presupuestos automáticos",
    tagline: "Vuela enviando presupuestos.",
    recomendado: false,
    descripcionDetallada: "Desde una hoja de cálculo o cualquier fuente → Creamos presupuestos completos en tu sistema de facturación/ERP. Leemos tarifas, servicios y cantidades. Creamos el presupuesto con líneas y totales. Notificamos al responsable para envío o revisión.",
    summary: {
      what_it_is: "Automatización que transforma una configuración de servicios en un presupuesto oficial dentro de tu ERP de forma instantánea.",
      for_who: ["Equipos comerciales", "Agencias con servicios modulares", "Empresas con alta rotación de presupuestos"],
      requirements: ["ERP/Software de gestión", "Fuente de datos (Hoja de cálculo, CRM)"],
      output: "Presupuesto en estado borrador o enviado en tu sistema de gestión."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Alta",
      integrations: ["ERP", "Hoja de cálculo", "CRM"]
    },
    how_it_works_steps: [
      { title: "Captura de servicios", short: "Leemos los servicios seleccionados.", detail: "Detectamos qué items y cantidades se han definido para el cliente." },
      { title: "Mapeo de tarifas", short: "Asignamos precios automáticamente.", detail: "Consultamos tu listado de precios o tarifas dinámicas para evitar errores manuales." },
      { title: "Generación en ERP", short: "Creamos el presupuesto en tu software de gestión.", detail: "Se genera el documento completo con todos los impuestos y datos del cliente asociados." }
    ],
    customization: {
      options_blocks: [
        { type: "radio", label: "Envío automático", options: ["Sí, enviar al cliente", "No, dejar en borrador"] }
      ],
      free_text_placeholder: "¿Tienes condiciones generales específicas por cada presupuesto?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Puede usar mis plantillas de PDF?", a: "Sí, el presupuesto se genera usando la configuración visual que ya tengas en tu sistema de facturación." }
    ],
    pasos: [
      "Leemos tarifas, servicios y cantidades",
      "Creamos el presupuesto con líneas y totales",
      "Notificamos al responsable para envío o revisión"
    ],
    personalizacion: "Decide si el presupuesto se envía automáticamente al cliente o queda en borrador para que lo revises.",
    sectores: ["Servicios profesionales", "Agencia/marketing", "Inmobiliaria"],
    herramientas: ["ERP/Software de gestión", "Hoja de cálculo"],
    dolores: ["Quiero automatizar presupuestos y respuestas", "Tardamos en responder y perdemos clientes"],
    related_processes: ["seguimiento-presupuestos", "facturas-automatizadas"],
    integration_domains: ["ERP"]
  },

  {
    id: "A4",
    codigo: "A4",
    slug: "seguimiento-presupuestos",
    categoria: "A",
    categoriaNombre: "Facturas y Gastos",
    nombre: "Seguimiento de presupuestos enviados",
    tagline: "Controla todos los presupuestos enviados.",
    recomendado: false,
    descripcionDetallada: "Si pasan X días sin respuesta → Aviso a responsables por el canal que elijas. Revisamos el estado del presupuesto en tu ERP/CRM. Detectamos inactividad. Disparamos alerta o tu vía de comunicación preferida de seguimiento.",
    summary: {
      what_it_is: "Flujo de control que asegura que ningún presupuesto se pierda por falta de seguimiento comercial.",
      for_who: ["Equipos de ventas", "Project Managers", "Gerencia"],
      requirements: ["ERP/CRM", "Sistema de notificaciones"],
      output: "Recordatorios a ventas o mensajes directos al cliente."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["ERP/CRM", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Monitorización", short: "Vigilamos estados 'Enviado'.", detail: "El sistema revisa diariamente qué presupuestos siguen sin ser aceptados ni rechazados." },
      { title: "Cálculo de inactividad", short: "Contamos los días transcurridos.", detail: "Si se supera el umbral definido (ej. 3 días), se inicia la acción de seguimiento." },
      { title: "Acción de rescate", short: "Disparamos recordatorio.", detail: "Avisamos al comercial o enviamos un mensaje de seguimiento suave al cliente." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Días de espera", options: ["3 días", "5 días", "7 días"] }
      ],
      free_text_placeholder: "¿Quieres un texto de seguimiento específico?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Diferencia presupuestos de facturas?", a: "Sí, este proceso se centra exclusivamente en la fase preventiva de venta." }
    ],
    pasos: [
      "Revisamos el estado del presupuesto en tu sistema de gestión",
      "Detectamos inactividad",
      "Disparamos alerta o mensaje de seguimiento"
    ],
    personalizacion: "Elige el canal del aviso y los días sin respuesta.",
    sectores: ["Agencia/marketing", "Inmobiliaria", "Retail", "Servicios profesionales"],
    herramientas: ["ERP/CRM", "Canal de comunicación"],
    dolores: ["Tardamos en responder y perdemos clientes", "No hago seguimiento a las personas interesadas"],
    related_processes: ["presupuestos-automaticos", "recordatorios-pagos"],
    integration_domains: ["ERP", "CRM"]
  },

  {
    id: "A5",
    codigo: "A5",
    slug: "recordatorios-pagos",
    categoria: "A",
    categoriaNombre: "Facturas y Gastos",
    nombre: "Envío de recordatorios de pagos a clientes",
    tagline: "Automatiza el ir detrás de quien no ha pagado.",
    recomendado: true,
    descripcionDetallada: "Envía recordatorios de pago a los clientes que tienen facturas vencidas según hayan pasado 5/10/15 días. Identificación de facturas vencidas según días de atraso. Generación del mensaje con plantilla dinámica. Envío automático al canal del cliente.",
    summary: {
      what_it_is: "Sistema automatizado de reclamación de deuda que mejora el flujo de caja sin esfuerzo manual.",
      for_who: ["Administración", "Finanzas", "Dueños de agencias"],
      requirements: ["ERP/Software de gestión", "canal de comunicación que prefieras"],
      output: "Mensajes de recordatorio automáticos segmentados por gravedad."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["ERP", "Canal de comunicación"]
    },
    how_it_works_steps: [
      { title: "Detección de impago", short: "Analizamos facturas vencidas.", detail: "Cruzamos fechas de vencimiento con el estado de pago en tiempo real." },
      { title: "Segmentación", short: "Aplicamos lógica 5/10/15 días.", detail: "El mensaje se vuelve más firme a medida que el retraso aumenta." },
      { title: "Comunicación directa", short: "Enviamos aviso personalizado.", detail: "El cliente recibe un aviso con el detalle de la factura y enlace directo al pago." }
    ],
    customization: {
      options_blocks: [
        { type: "radio", label: "Tono inicial", options: ["Amable", "Conciso"] },
        { type: "select", label: "Frecuencia", options: ["Semanal", "Diaria"] },
        { type: "select", label: "Canal comunicación", options: ["WhatsApp", "Email", "SMS", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Quieres excluir a algún cliente VIP de este proceso?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Puedo enviar avisos por mensajería?", a: "Sí, es posible integrar APIs de mensajería para que el recordatorio sea más directo." }
    ],
    pasos: [
      "Identificación de facturas vencidas según días de atraso",
      "Generación del mensaje con plantilla dinámica",
      "Envío automático al contacto del cliente"
    ],
    personalizacion: "Elige tono del mensaje (amable, neutro, firme) y excepciones por cliente.",
    sectores: ["Retail", "E-commerce", "Servicios profesionales", "Agencia/marketing", "Gestoria"],
    herramientas: ["ERP/Software de gestión", "Canal de comunicación"],
    dolores: ["Tardamos en responder y perdemos clientes", "No hago seguimiento a las personas interesadas"],
    related_processes: ["informe-semanal-facturas-vencidas", "traspasos-automaticos-iva"],
    integration_domains: ["ERP"]
  },
  {
    id: "B6",
    codigo: "B6",
    slug: "analisis-incidencias-horarios",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Informe de análisis e incidencias en horarios",
    tagline: "Ahorra tiempo analizando los datos para controlar a tus equipos.",
    recomendado: true,
    descripcionDetallada: "Cada semana → Recibes un reporte con fichajes incompletos, duplicados, días sin fichaje sin ausencia relacionada, cálculo del riesgo de burnout por exceso sostenido de horas extra, etc. Leemos los registros diarios de horas. Detectamos anomalías (faltantes, duplicados, exceso). Generamos alerta al manager.",
    summary: {
      what_it_is: "Control inteligente de registros horarios para asegurar el cumplimiento legal y el bienestar del equipo.",
      for_who: ["Managers de equipo", "Recursos Humanos", "COO"],
      requirements: ["Herramienta de tracking", "Herramienta de automatización"],
      output: "Informe detallado de anomalías y riesgos de burnout por el canal elegido."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Tracking", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Sincronización horaria", short: "Obtenemos registros diarios.", detail: "Nos conectamos a tu herramienta de fichaje para extraer la actividad de todos los empleados." },
      { title: "Detección de patrones", short: "Buscamos huecos y excesos.", detail: "Analizamos si faltan fichajes, si hay solapamientos o si alguien está trabajando demasiadas horas extra." },
      { title: "Alerta inteligente", short: "Notificamos solo lo relevante.", detail: "El manager recibe un aviso solo si hay algo que requiere su atención inmediata." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Umbral de Burnout", options: ["+10h/semana", "+20h/semana"] },
        { type: "select", label: "Canal de comunicación", options: ["Email", "Slack", "Teams", "WhatsApp", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Alguna regla especial para horarios nocturnos?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Cumple con la Ley de Control Horario?", a: "Absolutamente. Ayuda a que los registros estén siempre perfectos ante una auditoría." }
    ],
    pasos: [
      "Leemos los registros diarios de horas",
      "Detectamos anomalías (faltantes, duplicados, exceso)",
      "Generamos alerta al manager"
    ],
    personalizacion: "Elige qué tipo de alertas quieres recibir y cada cuánto.",
    related_processes: ["alertas-exceso-horas", "informe-mensual-horas-estimadas"],
    integration_domains: ["OTHER"]
  },

  {
    id: "B7",
    codigo: "B7",
    slug: "informe-mensual-horas-estimadas",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Informe mensual de horas vs estimadas por proyecto",
    tagline: "Controla los desvíos de horas de cada proyecto.",
    recomendado: true,
    descripcionDetallada: "Recibe un informe mensual el primer día de cada mes → con horas estimadas, registradas y desviaciones. Cruzamos datos de imputación y de planning. Calculamos desviaciones individuales y por proyecto. Generamos un informe detallado.",
    summary: {
      what_it_is: "Dashboard de rentabilidad por proyecto basado en el cruce de planificación y ejecución real.",
      for_who: ["Project Managers", "Directores Financieros", "Gerencia"],
      requirements: ["Gestor de tareas", "Tracking de horas"],
      output: "Informe visual de rentabilidad (Horas Planificadas vs Reales)."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Gestor de tareas", "Hoja de cálculo"]
    },
    how_it_works_steps: [
      { title: "Extracción de Planning", short: "Leemos las estimaciones.", detail: "Consultamos cuántas horas se asignaron a cada tarea o proyecto en la fase de venta/planning." },
      { title: "Cruce de Realidad", short: "Obtenemos horas imputadas.", detail: "Buscamos en el sistema de tracking cuánto tiempo le han dedicado realmente los equipos." },
      { title: "Cálculo de Margen", short: "Detectamos desviaciones.", detail: "Analizamos el porcentaje de error y el impacto económico de cada desviación." }
    ],
    customization: {
      options_blocks: [
        { type: "radio", label: "Formato", options: ["Hoja de cálculo", "Dashboard visual"] },
        { type: "select", label: "Canal de comunicación", options: ["Email", "Slack", "Teams", "WhatsApp", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Quieres incluir el coste/hora de cada perfil?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Se puede ver por empleado?", a: "Sí, el informe permite desglosar quién ha sido más eficiente o quién ha necesitado más apoyo." }
    ],
    pasos: [
      "Cruzamos datos de imputación y de planning",
      "Calculamos desviaciones individuales y por proyecto",
      "Generamos un informe detallado"
    ],
    personalizacion: "Elige formato del informe (PDF, hoja de cálculo).",
    related_processes: ["analisis-incidencias-horarios", "alertas-exceso-horas"],
    integration_domains: ["OTHER"]
  },

  {
    id: "B8",
    codigo: "B8",
    slug: "alertas-exceso-horas",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Alertas por exceso de horas en proyectos",
    tagline: "Recibe avisos cuando algún proyecto se dispara en horas.",
    recomendado: true,
    descripcionDetallada: "Si un proyecto supera el umbral (ej. +15%) → Aviso automático a dirección y al Project Manager. Calculamos desviación entre horas estimadas vs. horas imputadas. Detectamos el umbral superado. Enviamos notificaciones automáticas.",
    summary: {
      what_it_is: "Sistema de alerta temprana para prevenir la pérdida de margen en proyectos activos.",
      for_who: ["Project Managers", "Account Directors", "C-Level"],
      requirements: ["Gestor de tareas", "canal de comunicación que prefieras"],
      output: "Alerta instantánea cuando un proyecto entra en 'zona roja'."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["Gestor de tareas", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Seguimiento en vivo", short: "Vigilamos el consumo de horas.", detail: "Cada vez que alguien imputa tiempo, el sistema recalcula el total acumulado del proyecto." },
      { title: "Check de umbral", short: "Comparamos con el presupuesto.", detail: "Si el consumo alcanza el 80%, 90% o 100% del tiempo vendido, se activa el trigger." },
      { title: "Notificación 'SOS'", short: "Avisamos al responsable.", detail: "Se envía un aviso urgente para decidir si se amplía el presupuesto o se frena el alcance." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Umbral de aviso", options: ["80%", "100%", "+15% sobre total"] },
        { type: "select", label: "Canal de comunicación", options: ["Email", "Slack", "Teams", "WhatsApp", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Deseas notificar también al cliente automáticamente?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Funciona con mi gestor de tareas?", a: "Totalmente compatible con las herramientas de gestión de proyectos líderes y sus campos personalizados." }
    ],
    pasos: [
      "Calculamos desviación entre horas estimadas vs. horas imputadas",
      "Detectamos el umbral superado",
      "Enviamos notificaciones automáticas"
    ],
    personalizacion: "Define el porcentaje de exceso que activa la alerta, el mensaje y quién la recibe.",
    related_processes: ["informe-mensual-horas-estimadas", "analisis-incidencias-horarios"],
    integration_domains: ["OTHER"]
  },

  {
    id: "C9",
    codigo: "C9",
    slug: "alertas-vencimiento-facturas-compra",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Alertas de facturas de compra próximas a vencer",
    tagline: "Entérate de cuándo van a ir llegando los gastos previstos.",
    recomendado: true,
    descripcionDetallada: "Detectamos facturas a X días de vencimiento → Aviso para que prepares pago y evites sustos de tesorería. Leemos facturas de proveedores, importes y fechas. Calculamos los días restantes. Enviamos alertas individuales.",
    summary: {
      what_it_is: "Gestión proactiva del flujo de caja de salida para evitar recargos y sorpresas bancarias.",
      for_who: ["Administración", "Departamentos financieros", "Gerentes de pymes"],
      requirements: ["ERP/Sistema de gestión", "canal de comunicación que prefieras"],
      output: "Previsión de pagos semanal y avisos urgentes 48h antes de cada vencimiento."
    },
    indicators: {
      time_estimate: "< 1 semana",
      complexity: "Baja",
      integrations: ["ERP", "Calendario", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Escaneo de obligaciones", short: "Leemos facturas de proveedores.", detail: "Analizamos regularmente tu listado de compras pendientes de pago." },
      { title: "Alerta de plazo", short: "Detectamos fechas críticas.", detail: "Filtramos solo aquellas facturas cuyo vencimiento es inminente (ej. en 3 días)." },
      { title: "Check de tesorería", short: "Avisamos para preparar fondos.", detail: "Recibes el importe consolidado que se va a girar para que te asegures de tener saldo." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Anticipación", options: ["2 días", "5 días", "1 semana"] },
        { type: "select", label: "Canal de comunicación", options: ["Email", "Slack", "Teams", "WhatsApp", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Deseas agrupar todas las del mismo proveedor?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Puede avisar a varios responsables?", a: "Sí, podemos configurar canales específicos de mensajería o grupos de tu vía de comunicación preferida." }
    ],
    pasos: [
      "Leemos facturas de proveedores, importes y fechas",
      "Calculamos los días restantes",
      "Enviamos alertas individuales"
    ],
    personalizacion: "Anticipación (2 días, 5 días, 1 semana). ¿Deseas agrupar todas las del mismo proveedor?",
    related_processes: ["recordatorios-pagos", "informes-financieros-direccion"],
    integration_domains: ["ERP"]
  },

  {
    id: "C10",
    codigo: "C10",
    slug: "informes-financieros-direccion",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Informes financieros para dirección",
    tagline: "Claridad financiera directa en tu inbox, cada mes.",
    recomendado: true,
    descripcionDetallada: "Cierre mensual → Informe con facturación, margen, costes. Consolidamos datos de ingresos, gastos y estructura. Calculamos KPIs clave. Enviamos informe por tu vía de comunicación preferida.",
    summary: {
      what_it_is: "Fotografía financiera automatizada del negocio para facilitar la toma de decisiones estratégicas.",
      for_who: ["Directores Generales", "CFOs", "Socios de agencias"],
      requirements: ["ERP/Software de gestión", "Hoja de cálculo de costes fijos"],
      output: "Informe PDF/hoja de cálculo con Margen Bruto, EBITDA y Punto de Equilibrio mensual."
    },
    indicators: {
      time_estimate: "2 semanas",
      complexity: "Alta",
      integrations: ["ERP", "Hoja de cálculo", "Generador de PDF"]
    },
    how_it_works_steps: [
      { title: "Cierre de datos", short: "Recopilamos facturación y gastos.", detail: "Una vez cerrado el mes, el sistema extrae todos los movimientos reales del periodo." },
      { title: "Carga de estructura", short: "Sumamos costes fijos (nóminas, alquiler).", detail: "Incorporamos los datos que no están en el ERP para obtener el margen neto real." },
      { title: "Reporte estratégico", short: "Enviamos el análisis final.", detail: "Generamos un resumen ejecutivo con gráficas de evolución y KPIs de salud financiera." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Periodicidad", options: ["Mensual", "Trimestral"] },
        { type: "select", label: "Canal de comunicación", options: ["Email", "Slack", "Teams", "WhatsApp", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Qué KPI específico es vital para tu negocio (LTV, CAC, etc.)?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Es 100% exacto?", a: "Depende de la calidad de tus datos en el ERP. El sistema procesa lo que hay, eliminando el error de transcripción humana." }
    ],
    pasos: [
      "Consolidamos datos de ingresos, gastos y estructura",
      "Calculamos KPIs clave",
      "Enviamos informe por tu vía de comunicación preferida"
    ],
    personalizacion: "Elige tu fecha de cierre y tus KPIs.",
    related_processes: ["proyeccion-automatica-ingresos", "traspasos-automaticos-iva"],
    integration_domains: ["ERP"]
  },
  {
    id: "C11",
    codigo: "C11",
    slug: "proyeccion-automatica-ingresos",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Proyección automática de ingresos",
    tagline: "Recibe una previsión de ingresos según tu histórico y visión.",
    recomendado: false,
    descripcionDetallada: "Cierre mensual → Informe forecast con proyección de ingresos los próximos meses. Analizamos patrones de facturación anteriores. Calculamos escenarios moderados y alcistas. Generamos un forecast en gráfico + tabla.",
    summary: {
      what_it_is: "Algoritmo de previsión que estima tu rentabilidad futura basándose en datos históricos y pipeline actual.",
      for_who: ["Ventas", "Finanzas", "CEO"],
      requirements: ["ERP/Software de gestión", "CRM con Pipeline"],
      output: "Gráfico de proyección a 3-6 meses con escenarios de probabilidad."
    },
    indicators: {
      time_estimate: "2 semanas",
      complexity: "Media",
      integrations: ["ERP", "CRM", "Predictive API"]
    },
    how_it_works_steps: [
      { title: "Análisis histórico", short: "Leemos tendencias pasadas.", detail: "Estudiamos la estacionalidad y el crecimiento medio de tus últimos 12-24 meses." },
      { title: "Pipeline mapping", short: "Sumamos ventas potenciales.", detail: "Cruzamos los datos del CRM según la probabilidad de cierre de cada oportunidad abierta." },
      { title: "Proyección de escenarios", short: "Generamos 3 visiones.", detail: "Obtienes un escenario pesimista, real y optimista para planificar tu tesorería." }
    ],
    customization: {
      options_blocks: [
        { type: "radio", label: "Alcance", options: ["3 meses", "6 meses", "12 meses"] },
        { type: "select", label: "Canal de comunicación", options: ["Email", "Slack", "Teams", "WhatsApp", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Incluimos objetivos de ventas externos?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Considera los clientes recurrentes?", a: "Sí, identifica patrones de suscripción o fees mensuales para una base de proyección estable." }
    ],
    pasos: [
      "Analizamos patrones de facturación anteriores",
      "Calculamos escenarios moderados y alcistas",
      "Generamos un forecast en gráfico + tabla"
    ],
    personalizacion: "Elige entre visión moderada, alcista o pesimista.",
    related_processes: ["informes-financieros-direccion", "seguimiento-presupuestos"],
    integration_domains: ["ERP", "CRM"]
  },

  {
    id: "C12",
    codigo: "C12",
    slug: "traspasos-automaticos-iva",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Traspasos automáticos de IVA",
    tagline: "Retira los impuestos a medida que llegan, para evitar sustos de tesorería cada trimestre.",
    recomendado: false,
    descripcionDetallada: "Cada factura recibida → Generamos desglose de IVA → Actualizamos documento con solicitud de traspaso bancario a cuenta de impuestos. Calculamos base y cuota de IVA por periodo. Generamos documento oficial de solicitud de traspaso. Notificamos al responsable.",
    summary: {
      what_it_is: "Asistente de tesorería técnica que te ayuda a separar el dinero que 'no es tuyo' (IVA/Retenciones) al instante.",
      for_who: ["Administración", "Finanzas", "Freelancers"],
      requirements: ["ERP/Software de gestión", "Acceso a banca (lectura)"],
      output: "Ficha de traspaso bancario lista para ejecutar en tu app bancaria."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["ERP", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Filtrado de cuota", short: "Analizamos cada factura.", detail: "Cada vez que cobras una factura, extraemos la parte correspondiente al IVA." },
      { title: "Registro de reserva", short: "Actualizamos el saldo virtual.", detail: "Llevamos un control estricto de cuánto deberías tener en tu cuenta de impuestos." },
      { title: "Aviso de traspaso", short: "Te recordamos mover el dinero.", detail: "Te avisamos para que hagas el movimiento manual o automático a tu cuenta de ahorro fiscal." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Aviso", options: ["Instantáneo", "Semanal", "Mensual"] },
        { type: "select", label: "Canal de comunicación", options: ["Email", "Slack", "Teams", "WhatsApp", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Deseas separar también el % de Retención IRPF?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿El sistema mueve el dinero solo?", a: "Por seguridad, generamos la orden o el aviso. El movimiento real requiere tu validación bancaria." }
    ],
    pasos: [
      "Calculamos base y cuota de IVA por periodo",
      "Generamos documento oficial de solicitud de traspaso",
      "Notificamos al responsable"
    ],
    personalizacion: "Elige cuándo se notifica (mensual, trimestral) y vía (tu vía de comunicación preferida, mensajería o nube).",
    related_processes: ["recordatorios-pagos", "informes-financieros-direccion"],
    integration_domains: ["ERP"]
  },

  {
    id: "D13",
    codigo: "D13",
    slug: "registro-automatico-gastos",
    categoria: "D",
    categoriaNombre: "Internos Agencias",
    nombre: "Registro automático de gastos",
    tagline: "Agiliza la gestión de facturas de gasto al máximo.",
    recomendado: true,
    descripcionDetallada: "Vuelcas factura en tu gestor de archivos en la nube → Generamos la factura de gasto en tu ERP. Detección automática de facturas de compra volcadas. Envío al sistema de facturación para escaneo y creación automática del borrador. Asignación a proveedor. Notificación al responsable para su revisión (opcional).",
    summary: {
      what_it_is: "Digitalización integral de facturas de proveedores que elimina la entrada manual de datos en el ERP.",
      for_who: ["Administración", "Equipos con volumen de compras", "Gerencia"],
      requirements: ["ERP/Software de gestión", "Gestor de archivos en la nube"],
      output: "Factura de gasto contabilizada en tu sistema con el archivo adjunto."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["ERP", "Nube", "OCR"]
    },
    how_it_works_steps: [
      { title: "Volcado de archivos", short: "Sube tus archivos a la nube.", detail: "Simplemente arrastra tus facturas de compra a una carpeta dedicada de tu gestor de archivos." },
      { title: "Procesamiento OCR", short: "Escaneamos los datos clave.", detail: "El sistema lee automáticamente CIF, importes, fechas e impuestos de cada factura." },
      { title: "Integración ERP", short: "Creamos el asiento en tu sistema.", detail: "Se genera el registro de gasto completo y se asocia al proveedor correspondiente de forma automática." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Fuente", options: ["Google Drive", "Dropbox", "One Drive", "Otra herramienta / gestor de archivos en nube"] }
      ],
      free_text_placeholder: "¿Necesitas asignar proyectos o cuentas contables específicas?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Reconoce facturas a mano?", a: "Funciona mucho mejor con facturas digitales. Si es a mano, dependerá de la legibilidad de la caligrafía." }
    ],
    pasos: [
      "Detección automática de facturas de compra volcadas",
      "Envío al sistema de facturación para escaneo automático",
      "Creación automática del borrador de la factura de compra",
      "Asignación a proveedor",
      "Notificación al responsable para su revisión (opcional)"
    ],
    personalizacion: "Elige tu carpeta de archivos en la nube.",
    related_processes: ["alertas-vencimiento-facturas-compra", "traspasos-automaticos-iva"],
    integration_domains: ["ERP"]
  },
  {
    id: "D14",
    codigo: "D14",
    slug: "creacion-metas-clickup",
    categoria: "D",
    categoriaNombre: "Internos Agencias",
    nombre: "Creación de metas en tu herramienta de gestión de tareas",
    tagline: "Saca todo el partido a las metas de tu herramienta de gestión de tareas sin perder tiempo en crearlas a mano.",
    recomendado: true,
    descripcionDetallada: "Desde un documento con objetivos mensuales → Creamos metas en tu herramienta de gestión de tareas, asignadas por cliente y equipo. Leemos los objetivos del documento. Creamos metas dinámicas en tu herramienta de gestión de tareas por usuario/equipo. Configuramos seguimiento automático de KPIs.",
    summary: {
      what_it_is: "Traducción automática de tu estrategia de negocio en objetivos accionables (Goals) dentro de tu herramienta de gestión de tareas.",
      for_who: ["Directores de equipo", "CEOs", "Responsables de OKRs"],
      requirements: ["tu herramienta de gestión de tareas (Plan Unlimited/Business)", "Documento de objetivos (Sheets/tu herramienta de gestión de tareas)"],
      output: "Estructura de Metas (Goals) y objetivos (Targets) creada y asignada en tu herramienta de gestión de tareas."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["tu herramienta de gestión de tareas", "Google Sheets"]
    },
    how_it_works_steps: [
      { title: "Definición de Targets", short: "Leemos tus objetivos.", detail: "Extraemos de tu hoja de planificación cuáles son los KPIs a medir este mes." },
      { title: "Arquitectura tu herramienta de gestión de tareas", short: "Creamos los Goals dinámicos.", detail: "Generamos la estructura de metas en tu herramienta de gestión de tareas asignando pesos y porcentajes de éxito." },
      { title: "Asignación de equipo", short: "Conectamos con responsables.", detail: "Cada usuario implicado recibe su meta para que su progreso se actualice automáticamente." }
    ],
    customization: {
      options_blocks: [
        { type: "radio", label: "Actualización", options: ["Automática vía API", "Manual en tu herramienta de gestión de tareas"] }
      ],
      free_text_placeholder: "¿Cómo mides el éxito de tus metas (monetario, numérico, booleano)?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Se actualiza si cambio el Sheets?", a: "Sí, podemos configurar una sincronización bidireccional o bajo demanda." }
    ],
    pasos: [
      "Leemos los objetivos del documento",
      "Creamos metas dinámicas en tu herramienta de gestión de tareas por usuario/equipo",
      "Configuramos seguimiento automático de KPIs"
    ],
    personalizacion: "Elige colores por cliente/equipo.",
    related_processes: ["informe-mensual-horas-estimadas", "alertas-exceso-horas"],
    integration_domains: ["OTHER"]
  },

  {
    id: "D15",
    codigo: "D15",
    slug: "facturacion-automatica-horas-freelance",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Liquidación y facturación de freelance",
    tagline: "Automatiza el cálculo y gestión de pagos a tus colaboradores externos por horas.",
    recomendado: false,
    descripcionDetallada: "Te imputa sus horas un freelance → Se crea la factura de gasto y se asocia a proyecto. Leemos horas registradas por cada freelance. Multiplicamos por tarifa asociada. Creamos factura de gasto y la asignamos al proyecto/cliente.",
    summary: {
      what_it_is: "Sistema de liquidación automática para colaboradores externos basado en esfuerzo real.",
      for_who: ["Agencias con freelancers", "Productoras", "Estructuras líquidas"],
      requirements: ["Herramienta de tracking", "ERP/Software de gestión"],
      output: "Factura de gasto de proveedor (freelance) generada automáticamente."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["ERP", "Tracking"]
    },
    how_it_works_steps: [
      { title: "Auditoría de horas", short: "Validamos tiempo registrado.", detail: "El sistema extrae las horas aprobadas que cada colaborador ha imputado a sus proyectos." },
      { title: "Aplicación de tarifas", short: "Calculamos el importe.", detail: "Multiplicamos el tiempo por el precio/hora acordado con cada freelance específico." },
      { title: "Generación de gasto", short: "Registramos en el ERP.", detail: "Se crea la factura de gasto por el servicio del freelance, imputándola a la rentabilidad del proyecto." }
    ],
    customization: {
      options_blocks: [
        { type: "radio", label: "Aprobación", options: ["Revision obligatoria", "Autogenerar facturas"] }
      ],
      free_text_placeholder: "¿Algún freelance cobra por hitos en lugar de por horas?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿El freelance tiene que hacer algo?", a: "Solo registrar bien sus horas. El sistema se encarga de todo el papeleo administrativo." }
    ],
    pasos: [
      "Leemos horas registradas por cada freelance",
      "Multiplicamos por tarifa asociada",
      "Creamos factura de gasto y la asignamos al proyecto/cliente"
    ],
    personalizacion: "Define tarifas por freelance y si quieres aprobación antes de crear la factura.",
    related_processes: ["gestion-automatica-retenciones-freelance", "analisis-incidencias-horarios"],
    integration_domains: ["ERP"]
  },

  {
    id: "D16",
    codigo: "D16",
    slug: "gestion-automatica-retenciones-freelance",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Gestión automática de retenciones (freelance)",
    tagline: "Retira las retenciones a medida que llegan, para evitar sustos de tesorería cada trimestre.",
    recomendado: false,
    descripcionDetallada: "Cuando entra una factura de proveedor → Calculamos retención, generamos asiento y la solicitud de traspaso. Detectamos facturas sujetas a retención. Calculamos el % correspondiente. Creamos asiento contable y aviso de pago.",
    summary: {
      what_it_is: "Control de seguridad fiscal para que el dinero de tus pagos trimestrales esté siempre reservado.",
      for_who: ["Administración", "Departamentos financieros", "CEOs"],
      requirements: ["ERP/Software de gestión", "Cuenta de ahorro fiscal"],
      output: "Cálculo en tiempo real de retenciones acumuladas y avisos de reserva."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["ERP", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Detección de IRPF", short: "Filtramos facturas de profesionales.", detail: "Identificamos facturas de gastos que conllevan retención (profesionales, alquileres)." },
      { title: "Cálculo de hucha", short: "Sumamos reserva.", detail: "El sistema acumula cuánto dinero deberás ingresar a Hacienda al final del trimestre." },
      { title: "Aviso de previsión", short: "Te informamos del saldo.", detail: "Recibes informes periódicos para que sepas exactamente cuánto dinero 'no es tuyo' en la cuenta corriente." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Frecuencia aviso", options: ["Semanal", "Mensual"] },
        { type: "select", label: "Canal de comunicación", options: ["Email", "Slack", "Teams", "WhatsApp", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Manejas retenciones de alquileres además de las de freelance?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Controla el impuesto de retenciones?", a: "Calcula los datos para que casen perfectamente con tu contabilidad oficial." }
    ],
    pasos: [
      "Detectamos facturas sujetas a retención",
      "Calculamos el % correspondiente",
      "Creamos asiento contable y aviso de reserva"
    ],
    personalizacion: "Elige periodicidad del cálculo y cómo quieres recibir el aviso.",
    related_processes: ["facturacion-automatica-horas-freelance", "traspasos-automaticos-iva"],
    integration_domains: ["ERP"]
  },

  {
    id: "E17",
    codigo: "E17",
    slug: "atencion-automatica-tu vía de comunicación preferida",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Atención automática por mensajería",
    tagline: "Responde al instante a dudas frecuentes y deriva a una persona cuando haga falta.",
    recomendado: true,
    descripcionDetallada: "Automatizamos la atención inicial por canales de mensajería para responder consultas repetidas (horarios, precios, ubicación, servicios, disponibilidad, etc.). Cuando el cliente pregunta algo complejo o fuera de lo previsto, el sistema deriva la conversación a un responsable con el contexto necesario para continuar sin perder tiempo.",
    summary: {
      what_it_is: "Asistente inteligente 24/7 que filtra y resuelve dudas en tus canales de mensajería, liberando a tu equipo para ventas reales.",
      for_who: ["Atención al cliente", "Soportes técnicos", "Recepciones"],
      requirements: ["API de mensajería móvil", "Base de conocimientos (FAQs)"],
      output: "Conversaciones resueltas o filtradas con resumen para el humano."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Mensajería", "IA", "Automatización"]
    },
    how_it_works_steps: [
      { title: "Recepción de mensaje", short: "Escuchamos 24/7.", detail: "Cada mensaje entrante es analizado para entender la intención del usuario al instante." },
      { title: "Resolución por IA", short: "Respondemos con contexto.", detail: "Consultamos tu base de precios, horarios y servicios para dar la respuesta perfecta." },
      { title: "Derivación humana", short: "Pasamos el testigo cuando hace falta.", detail: "Si la consulta es de venta crítica o muy compleja, avisamos a tu equipo con un resumen de la charla." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Horario de atención", options: ["24/7", "Solo fuera de oficina"] },
        { type: "radio", label: "Tono de la IA", options: ["Formal", "Cercano", "Divertido"] }
      ],
      free_text_placeholder: "¿Cuáles son las 3 preguntas que más te hacen tus clientes?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Puede enviar archivos o imágenes?", a: "Sí, puede enviar catálogos, mapas de ubicación o fotos de productos automáticamente." }
    ],
    pasos: [
      "Detectamos el tipo de consulta del cliente (por palabras clave y contexto)",
      "Respondemos con mensajes automatizados personalizados según la consulta",
      "Si la conversación requiere atención humana, derivamos a un responsable",
      "Guardamos el contexto para retomar sin perder información"
    ],
    personalizacion: "Define el tono, las preguntas frecuentes, horarios, servicios, mensajes de derivación y cuándo debe pasar a una persona.",
    sectores: ["Servicios profesionales", "Retail", "Peluquería/estética", "Gestoria"],
    related_processes: ["atencion-automatica-redes", "captura-organizacion-solicitudes"],
    integration_domains: ["OTHER"]
  },
  {
    id: "E18",
    codigo: "E18",
    slug: "asistente-reservas-recordatorios",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Asistente de reservas y recordatorios",
    tagline: "Gestiona reservas de forma ágil y reduce ausencias con confirmaciones y recordatorios.",
    recomendado: true,
    descripcionDetallada: "Facilitamos que los clientes reserven sin esperas: el asistente recopila la información necesaria, confirma la reserva y envía recordatorios. También permite cambios o reprogramaciones con un flujo guiado para evitar pérdidas de tiempo y reducir las ausencias a citas.",
    summary: {
      what_it_is: "Secretaria virtual que coordina tu agenda y asegura que tus citas lleguen a tiempo.",
      for_who: ["Clínicas", "Centros de estética", "Consultoras", "Restaurantes"],
      requirements: ["Sistema de calendario corporativo", "Canal de comunicación directa"],
      output: "Citas confirmadas en agenda + Reducción de 'No-Shows' hasta un 80%."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Agenda online", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Reserva guiada", short: "Elegir hueco sin llamadas.", detail: "El cliente selecciona su servicio y horario disponible de forma visual y rápida." },
      { title: "Confirmación de plaza", short: "Bloqueo inmediato en agenda.", detail: "El sistema reserva el tiempo y envía una confirmación al móvil del cliente." },
      { title: "Cerco a la ausencia", short: "Recordatorios dinámicos.", detail: "Enviamos avisos según el tiempo definido antes para que el cliente no olvide la cita o la cambie con antelación." }
    ],
    customization: {
      options_blocks: [
        { type: "radio", label: "Exigir prepago", options: ["Sí, fianza de reserva", "No, pago en local"] },
        { type: "select", label: "Canal comunicación", options: ["WhatsApp", "Email", "SMS", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Cuál es tu tiempo mínimo de antelación para reservar?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Se sincroniza con mi calendario personal?", a: "Sí, podemos leer tus 'Ocupados' personales para no dar citas donde no puedes." }
    ],
    pasos: [
      "Pedimos los datos necesarios para la reserva (servicio, día, hora y contacto)",
      "Confirmamos la solicitud y guiamos al cliente hasta dejarla cerrada",
      "Enviamos recordatorios antes de la cita para reducir ausencias",
      "Si el cliente necesita cambiar, guiamos la reprogramación o cancelación de forma sencilla"
    ],
    personalizacion: "Define qué datos pedir, reglas de confirmación, mensajes de recordatorio, tiempos de aviso y cómo gestionar cambios/cancelaciones.",
    sectores: ["Clínicas", "Centros de estética", "Peluquería/estética", "Restaurantes", "Servicios profesionales", "Gestoria"],
    related_processes: ["reduccion-ausencias-citas", "solicitud-automatica-resenas"],
    integration_domains: ["OTHER"]
  },
  {
    id: "E19",
    codigo: "E19",
    slug: "captura-organizacion-solicitudes",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Captura y organización automática de solicitudes",
    tagline: "Recoge solicitudes desde distintos canales y las deja ordenadas para gestionarlas rápido.",
    recomendado: true,
    descripcionDetallada: "Cuando llegan solicitudes desde formularios o mensajes, las centralizamos y organizamos para que no se pierdan. El objetivo es pasar de “mensajes sueltos” a un sistema claro: qué ha pedido la persona, por qué canal llegó y en qué estado está.",
    summary: {
      what_it_is: "Buzón unificado que profesionaliza la entrada de nuevos contactos (leads) de tu negocio.",
      for_who: ["Equipos comerciales", "Equipos de marketing", "Atención al cliente"],
      requirements: ["Canales digitales (Web/Redes)", "Base de datos (Gestor de tareas/CRM)"],
      output: "Tablón con todas las solicitudes clasificadas por canal y urgencia."
    },
    indicators: {
      time_estimate: "< 1 semana",
      complexity: "Baja",
      integrations: ["Gestor de tareas", "Canal de comunicación", "Redes sociales"]
    },
    how_it_works_steps: [
      { title: "Escucha multicanal", short: "Leemos todos tus mensajes.", detail: "Extraemos el contacto de quien te escribe por tus canales digitales o web." },
      { title: "Categorización automática", short: "Entendemos la demanda.", detail: "El sistema clasifica si es una pregunta de precio, una queja o una solicitud de presupuesto." },
      { title: "Centralización", short: "Todo a tu zona de trabajo.", detail: "Creamos una tarjeta en tu gestor de tareas para que nada dependa de una memoria dispersa." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Destino", options: ["Gestor de tareas", "Software de gestión", "CRM"] },
        { type: "select", label: "Canal de comunicación", options: ["Email", "Slack", "Teams", "WhatsApp", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Cuántos canales quieres unificar hoy mismo?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Avisa al jefe de equipo?", a: "Podemos configurar reglas para que las solicitudes 'VIP' notifiquen directamente a gerencia." }
    ],
    pasos: [
      "Recibimos solicitudes desde los canales definidos (por ejemplo, formulario, chat o redes)",
      "Extraemos la información clave (contacto, motivo, servicio y urgencia)",
      "Guardamos cada solicitud en un listado organizado para su seguimiento",
      "Notificamos al responsable para que actúe sin retrasos"
    ],
    personalizacion: "Define qué información quieres capturar, cómo se ordena (por prioridad/servicio) y qué avisos se envían al equipo.",
    sectores: ["Servicios profesionales", "Peluquería/estética", "Retail", "E-commerce"],
    related_processes: ["seguimiento-automatico-solicitudes", "alta-automatica-clientes-solicitudes"],
    integration_domains: ["CRM"]
  },
  {
    id: "E20",
    codigo: "E20",
    slug: "seguimiento-automatico-solicitudes",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Seguimiento automático de solicitudes",
    tagline: "Automatiza el seguimiento para que nadie se quede sin respuesta.",
    recomendado: true,
    descripcionDetallada: "Creamos un flujo de seguimiento para retomar conversaciones y solicitudes que no avanzan. El sistema envía mensajes según el estado (pendiente de respuesta, esperando confirmación, propuesta enviada, etc.) y evita que se pierdan solicitudes por falta de seguimiento.",
    summary: {
      what_it_is: "Cierre de ventas incansable que 'persigue' suavemente a tus prospectos hasta obtener respuesta.",
      for_who: ["Comerciales", "Freelancers", "Agencias de marketing"],
      requirements: ["CRM con estados de venta", "Canal de comunicación (Chat/tu vía de comunicación preferida)"],
      output: "Aumento de la tasa de conversión sin carga administrativa para el equipo."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["CRM", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Control de estancamiento", short: "Detectamos el silencio.", detail: "Si un cliente no responde a una propuesta en el tiempo definido, el proceso se activa solo." },
      { title: "Mensaje de contexto", short: "Recordamos el valor.", detail: "Enviamos un mensaje personalizado tipo 'Hola, ¿pudiste ver la propuesta?' por la vía más efectiva." },
      { title: "Cierre o derivación", short: "Limpiamos el pipeline.", detail: "Si el seguimiento no prospera, el sistema archiva la oportunidad y te avisa del resultado." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Número de toques", options: ["2 intentos", "3 intentos", "5 intentos"] },
        { type: "select", label: "Canal comunicación", options: ["WhatsApp", "Email", "SMS", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Quieres usar notas de voz autogeneradas para que sea más natural?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Parecerá un robot?", a: "No, usamos variables para que el mensaje incluya su nombre, servicio y contexto real de la charla." }
    ],
    pasos: [
      "Detectamos solicitudes sin respuesta o estancadas según estado y tiempo",
      "Enviamos un mensaje de seguimiento personalizado",
      "Si la persona responde, se actualiza el estado y se deriva al responsable si corresponde",
      "Si no hay respuesta, realizamos un segundo intento y cerramos con un mensaje final (opcional)"
    ],
    personalizacion: "Define estados, tiempos de espera, número de intentos, tono de los mensajes y qué casos deben pasar a una persona.",
    sectores: ["Inmobiliaria", "Servicios profesionales", "Peluquería/estética", "Gestoria"],
    related_processes: ["captura-organizacion-solicitudes", "seguimiento-presupuestos"],
    integration_domains: ["CRM"]
  },
  {
    id: "E21",
    codigo: "E21",
    slug: "solicitud-automatica-resenas",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Solicitud automática de reseñas",
    tagline: "Pide reseñas tras el servicio para aumentar valoraciones y reputación online.",
    recomendado: true,
    descripcionDetallada: "Automatizamos el envío de mensajes para pedir una reseña después de una cita o servicio. El flujo es simple y respetuoso: se envía en el momento adecuado y con un texto alineado al negocio para aumentar la tasa de reseñas sin molestar al cliente.",
    summary: {
      what_it_is: "Motor de reputación online que solicita feedback positivo en el momento de máxima satisfacción del cliente.",
      for_who: ["Restaurantes", "Clínicas", "E-commerce", "Servicios Locales"],
      requirements: ["Perfil de negocio online", "CRM / Agenda"],
      output: "Aumento constante de estrellas y comentarios reales en plataformas de reseñas."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["Plataforma de reseñas", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Trigger de finalización", short: "Detectamos el fin del servicio.", detail: "Cuando marcas una cita como completada o un pedido como entregado, se inicia el contador." },
      { title: "Envío estratégico", short: "Pedimos la reseña vía móvil.", detail: "Enviamos un enlace directo a tu perfil con un texto que invita a compartir la experiencia." },
      { title: "Filtro de satisfacción", short: "Cuidamos tu nota.", detail: "Si el cliente no está contento, le invitamos a hablar con nosotros en privado antes de publicar la reseña." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Canal comunicación", options: ["WhatsApp", "Email", "SMS", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Quieres ofrecer algún incentivo por la reseña (descuento, etc.)?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Es legal pedir reseñas?", a: "Totalmente, siempre que no se compren. Es una solicitud legítima de feedback a tus clientes reales." }
    ],
    pasos: [
      "Tras finalizar el servicio, identificamos a quién enviar la solicitud",
      "Enviamos un mensaje con enlace y texto personalizado",
      "Si no responde, enviamos un recordatorio suave (opcional)",
      "Opcionalmente, registramos el resultado para mejorar el servicio"
    ],
    personalizacion: "Define cuándo se envía, el texto, si hay recordatorio y el tono (más cercano o más formal).",
    sectores: ["Restaurantes", "Clínicas", "Peluquería/estética", "Retail", "Gestoria"],
    related_processes: ["asistente-reservas-recordatorios", "atencion-automatica-tu vía de comunicación preferida"],
    integration_domains: ["OTHER"]
  },
  {
    id: "E22",
    codigo: "E22",
    slug: "atencion-automatica-tu vía de comunicación preferida",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Atención automática por redes sociales",
    tagline: "Responde dudas frecuentes en tus redes y deriva los casos complejos al equipo.",
    recomendado: false,
    descripcionDetallada: "Automatizamos respuestas a mensajes en redes sociales con consultas típicas y ayudamos a gestionar preguntas repetidas que aparecen en comentarios. El objetivo es responder más rápido, mantener un tono coherente y no perder solicitudes por falta de tiempo.",
    summary: {
      what_it_is: "Gestión inteligente de menciones y mensajes directos para que tu marca nunca deje de participar en la conversación.",
      for_who: ["Community Managers", "Marcas Personales", "E-commerce"],
      requirements: ["Cuentas profesionales en redes", "Herramienta de IA"],
      output: "Interacción instantánea 24/7 y filtrado de leads calificados por el canal elegido."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Redes Sociales", "IA", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Escucha social", short: "Detectamos el contacto.", detail: "El sistema monitoriza menciones en stories, comentarios y mensajes directos de tus redes." },
      { title: "Respuesta nativa", short: "Interactuamos al momento.", detail: "La inteligencia artificial responde siguiendo el tono de tu marca, resolviendo dudas o agradeciendo menciones." },
      { title: "Conversión a Lead", short: "Llevamos el tráfico al CRM.", detail: "Si el usuario muestra interés real, el sistema le guía para dejar sus datos o agendar una cita automáticamente." }
    ],
    customization: {
      options_blocks: [
        { type: "radio", label: "Alcance", options: ["Solo DMs", "DMs + Comentarios"] }
      ],
      free_text_placeholder: "¿Tienes alguna palabra prohibida que la IA deba ignorar?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Puede banear usuarios?", a: "Podemos configurar reglas de seguridad para que ignorar perfiles tóxicos o derivar quejas críticas a un humano." }
    ],
    pasos: [
      "Monitorizamos interacciones en tus perfiles sociales",
      "La IA responde o reacciona según el tipo de interacción",
      "Si hay una intención de compra, iniciamos el flujo de captación",
      "Notificamos al equipo sobre las interacciones más relevantes"
    ],
    personalizacion: "Define el tono de respuesta, qué tipo de interacciones priorizar y qué información enviar (enlaces, catálogos, etc.).",
    sectores: ["Agencia/marketing", "Retail", "E-commerce", "Servicios profesionales"],
    herramientas: ["Redes Sociales", "IA", "Herramienta de automatización"],
    dolores: ["Me escriben mucho y no doy abasto", "Tardamos en responder y perdemos clientes"],
    related_processes: ["atencion-automatica-tu vía de comunicación preferida", "captura-organizacion-solicitudes"]
  },
  {
    id: "E23",
    codigo: "E23",
    slug: "reduccion-ausencias-citas",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Reducción de ausencias a citas (confirmación + recordatorios)",
    tagline: "Confirma citas, recuerda automáticamente y facilita reprogramar para evitar huecos perdidos.",
    recomendado: false,
    descripcionDetallada: "Creamos un flujo de confirmación y recordatorios para reducir las ausencias a citas. El cliente puede confirmar de forma sencilla y, si no puede asistir, se le guía para cambiar la cita sin llamadas ni idas y vueltas.",
    summary: {
      what_it_is: "Protocolo de comunicación activa que asegura la asistencia de tus clientes y optimiza tu tiempo productivo.",
      for_who: ["Clínicas", "Consultoría", "Estética"],
      requirements: ["Sistema de citas (Calendario/CRM)", "API de mensajería"],
      output: "Agenda llena con ausencias mínimas y reprogramaciones fáciles."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["Calendario", "Mensajería"]
    },
    how_it_works_steps: [
      { title: "Trigger de Cita", short: "Detectamos nuevas reservas.", detail: "En cuanto se crea un evento en tu calendario, el sistema planifica los recordatorios." },
      { title: "Doble Confirmación", short: "Validamos asistencia 24h antes.", detail: "Enviamos un mensaje pidiendo confirmación. Si cancelan, el hueco queda libre automáticamente." },
      { title: "Aviso de 'Última Hora'", short: "Recordamos 1h antes.", detail: "Un último aviso para asegurar que el cliente ya está de camino a tu centro/oficina." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Tiempo de antelación", options: ["24h antes", "48h antes"] },
        { type: "select", label: "Canal comunicación", options: ["WhatsApp", "Email", "SMS", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿A quién avisamos internamente si un cliente cancela de golpe?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Puedo usar mi propio número?", a: "Sí, a través de integraciones oficiales podemos usar tu línea de empresa para los avisos." }
    ],
    pasos: [
      "Enviamos un mensaje de confirmación tras la reserva (o antes de la cita)",
      "Enviamos recordatorios en los momentos definidos",
      "Si el cliente no puede asistir, le guiamos para reprogramar o cancelar fácilmente",
      "Si no hay respuesta, avisamos al responsable para actuar a tiempo"
    ],
    personalizacion: "Define cuándo enviar confirmaciones y recordatorios, el texto de los mensajes y las reglas para cambios/cancelaciones.",
    sectores: ["Peluquería/estética", "Clínica", "Gimnasio/yoga", "Servicios profesionales"],
    herramientas: ["Mensajería", "Calendario"],
    dolores: ["Se olvidan de la cita / hay muchas ausencias"],
    related_processes: ["asistente-reservas-recordatorios", "solicitud-automatica-resenas"]
  },
  {
    id: "E24",
    codigo: "E24",
    slug: "alta-automatica-clientes-solicitudes",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Alta automática de clientes y solicitudes",
    tagline: "Crea una ficha con los datos clave cuando alguien pregunta o reserva, sin hacerlo a mano.",
    recomendado: false,
    descripcionDetallada: "Cada vez que entra una consulta o una reserva, generamos una ficha con la información importante para tener historial y contexto: quién es, qué pidió, por qué canal llegó y qué se le respondió. Esto evita perder datos y facilita el seguimiento.",
    summary: {
      what_it_is: "Sistema de acogida que enamora al cliente desde el minuto uno, centralizando toda su información de forma impecable.",
      for_who: ["Project Managers", "Account Managers", "Dueños de agencias"],
      requirements: ["Formulario de onboarding", "Gestor de tareas", "Gestor de archivos", "Comunicación"],
      output: "Carpeta de proyecto creada + Tablero de trabajo listo + Mensaje de bienvenida enviado."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Formulario", "Gestor de tareas", "Gestor de archivos", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Captura de Datos", short: "Recibimos la información.", detail: "El cliente rellena su formulario de bienvenida con toda la información técnica y de contacto." },
      { title: "Estructuración", short: "Creamos el ecosistema.", detail: "El sistema crea automáticamente la carpeta en la nube, el canal de comunicación y el tablero de trabajo." },
      { title: "Kick-off automático", short: "Damos el pistoletazo de salida.", detail: "Se envía un mensaje de bienvenida con los enlaces a todas sus nuevas herramientas de trabajo." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Canal comunicación", options: ["WhatsApp", "Email", "SMS", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Qué documentos mínimos necesitas que el cliente suba en su onboarding?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Evita duplicados?", a: "Sí, comprueba email y teléfono." }
    ],
    pasos: [
      "Recibimos los datos del formulario de onboarding",
      "Creamos la carpeta del cliente en el gestor de archivos",
      "Generamos el nuevo proyecto en el gestor de tareas con sus etapas",
      "Creamos el canal de comunicación compartido",
      "Enviamos el mensaje de bienvenida con los acceso"
    ],
    personalizacion: "Define las preguntas del formulario, la estructura de carpetas, el tablero del gestor de tareas y el mensaje de bienvenida.",
    sectores: ["Agencia/marketing", "Servicios profesionales", "Inmobiliaria", "Gestoria"],
    herramientas: ["Formulario", "Gestor de tareas", "Gestor de archivos", "Canal de comunicación"],
    dolores: ["Pierdo solicitudes entre tu vía de comunicación preferida/tu vía de comunicación preferida/tu vía de comunicación preferida", "No hago seguimiento a las personas interesadas"],
    related_processes: ["atencion-automatica-tu vía de comunicación preferida", "captura-organizacion-solicitudes"]
  },
  {
    id: "F25",
    codigo: "F25",
    slug: "auditoria-tecnologica-ia",
    categoria: "F",
    categoriaNombre: "Auditoría tecnológica",
    nombre: "Auditoría tecnológica (IA + Automatización)",
    tagline: "Analizamos tus procesos y definimos un plan de automatización con IA: quick wins, roadmap y ROI.",
    recomendado: false,
    descripcionDetallada: "Analizamos en profundidad con tus equipos actuales cómo fluye la información en tu negocio. El objetivo es identificar dónde la IA y la automatización pueden generar mayor impacto inmediato (Quick Wins) y trazar una hoja de ruta clara para escalar tu eficiencia operativa sin fricciones.",
    summary: {
      what_it_is: "Servicio de consultoría técnica que diagnostica tu potencial de automatización y define tu estrategia de IA.",
      for_who: ["COOs", "Gerentes de Operaciones", "Dueños de Negocios"],
      requirements: ["Entrevista con responsables", "Acceso a stack tecnológico"],
      output: "Documento Estratégico + Roadmap de Implementación + Análisis de ROI."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "N/A",
      integrations: []
    },
    how_it_works_steps: [
      { title: "Diagnóstico In Situ", short: "Entendemos tu realidad.", detail: "Auditamos tus herramientas y procesos actuales para ver qué se puede delegar en la tecnología." },
      { title: "Diseño de Roadmap", short: "Priorizamos por impacto.", detail: "Definimos qué automatizaciones te darán resultados en días y cuáles son estratégicas a largo plazo." },
      { title: "Cálculo de Retorno", short: "Hablamos de rentabilidad.", detail: "Te mostramos cuántas horas y cuánto dinero vas a ahorrar con cada implementación propuesta." }
    ],
    customization: {
      options_blocks: [
        { type: "radio", label: "Enfoque", options: ["Eficiencia Interna", "Atención al Cliente", "Estrategia Global"] }
      ],
      free_text_placeholder: "¿Cuál es el proceso que más te quita el sueño actualmente?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Es necesario tener ya programadores?", a: "No, nosotros te ayudamos a elegir y configurar las soluciones sin que necesites equipo técnico propio." }
    ],
    pasos: [
      "Mapa de procesos y pain points",
      "Identificación de quick wins y automatizaciones",
      "Propuesta de enfoque/herramientas",
      "Estimación impacto vs esfuerzo (ROI/horas)",
      "Roadmap por fases + backlog priorizado"
    ],
    personalizacion: "Duración orientativa: 1–2 semanas (según alcance). Entregables: informe + roadmap + backlog.",
    sectores: ["Agencia/marketing", "Servicios profesionales", "Retail", "Inmobiliaria", "E-commerce", "Clínica", "Restauración"],
    herramientas: [],
    related_processes: ["atencion-automatica-tu vía de comunicación preferida", "registro-automatico-gastos"]
  },
  {
    id: "CM1",
    codigo: "CM1",
    slug: "lead-capture-crm",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Lead capture desde web / redes sociales → CRM",
    tagline: "Los leads entran solos en tu CRM y arrancan su secuencia.",
    recomendado: true,
    descripcionDetallada: "Cuando alguien rellena un formulario de 'prueba gratuita' o 'más información' en la web o Instagram, el contacto entra automáticamente en el CRM/email marketing con etiqueta de origen y arranca una secuencia de nurturing.",
    pasos: ["Captura de lead desde formulario/RRSS","Sincronización con CRM","Activación de secuencia de email/notificación"],
    personalizacion: "Define los campos a capturar y el CRM de destino (HubSpot, ActiveCampaign, etc.).",
    sectores: ["Centros Deportivos"],
    herramientas: ["Typeform","HubSpot","ActiveCampaign","Make"],
    dolores: ["Tienes leads de prueba gratuita que nunca nadie siguió","Pierdo solicitudes entre WhatsApp/Instagram/email"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "CM2",
    codigo: "CM2",
    slug: "secuencia-bienvenida-leads-frios",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Secuencia de bienvenida para leads fríos",
    tagline: "No dejes que ningún lead se olvide de ti.",
    recomendado: true,
    descripcionDetallada: "Tras capturar un lead que no convierte de inmediato, se activa una secuencia de 3-5 emails o WhatsApp con testimonios, beneficios y oferta de primera clase gratuita. Se detiene automáticamente si convierte.",
    pasos: ["Trigger por nuevo lead","Envío de secuencia temporizada","Detección de conversión para parada automática"],
    personalizacion: "Elige el canal (Email/WhatsApp) y el número de impactos.",
    sectores: ["Centros Deportivos"],
    herramientas: ["ActiveCampaign","Brevo","WhatsApp Business API"],
    dolores: ["Tardamos en responder y perdemos clientes"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "CM3",
    codigo: "CM3",
    slug: "campana-reactivacion-ex-socios",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Campaña de reactivación de ex-socios",
    tagline: "Recupera antiguos alumnos con ofertas personalizadas.",
    recomendado: true,
    descripcionDetallada: "Segmenta automáticamente los socios que causaron baja hace más de 3 meses y les envía una oferta de reincorporación personalizada por email o WhatsApp. Se activa mensualmente o en fechas clave.",
    pasos: ["Filtro de ex-socios (baja > 3 meses)","Envío de oferta vía Email/WhatsApp","Seguimiento de respuesta"],
    personalizacion: "Define el tiempo de inactividad y las fechas de lanzamiento.",
    sectores: ["Centros Deportivos"],
    herramientas: ["ActiveCampaign","Airtable","Mindbody","Make"],
    dolores: ["Los socios se van sin avisar y te enteras cuando ya es tarde"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "GV4",
    codigo: "GV4",
    slug: "notificacion-renovacion-cuota",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Notificación de renovación de cuota próxima a vencer",
    tagline: "Renovaciones automáticas sin fricción.",
    recomendado: true,
    descripcionDetallada: "7 y 2 días antes de que venza la membresía, el socio recibe un aviso automático por email y/o WhatsApp con enlace de pago o renovación. Si no renueva, entra en flujo de retención.",
    pasos: ["Monitorización de fechas de vencimiento","Avisos automáticos T-7 y T-2","Link de pago directo"],
    personalizacion: "Elige los días de antelación y el tono del mensaje.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Make","WhatsApp Business API","Stripe"],
    dolores: ["Los cobros fallidos los sigues persiguiendo tú"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "GV5",
    codigo: "GV5",
    slug: "reactivacion-leads-no-convirtieron",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Reactivación de leads fríos (no convirtieron tras prueba)",
    tagline: "Vuelve a por los alumnos que probaron y no volvieron.",
    recomendado: false,
    descripcionDetallada: "Leads que asistieron a la clase de prueba pero no se dieron de alta entran en una secuencia de reactivación automática a los 15, 30 y 60 días: email con testimonio, oferta limitada y enlace de reserva.",
    pasos: ["Detección de 'Prueba sin Alta'","Secuencia 15/30/60 días","Aviso a equipo si hay respuesta"],
    personalizacion: "Define los incentivos y el número de recordatorios.",
    sectores: ["Centros Deportivos"],
    herramientas: ["ActiveCampaign","Make","Calendly"],
    dolores: ["Tienes leads de prueba gratuita que nunca nadie siguió"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "GV6",
    codigo: "GV6",
    slug: "programa-referidos-automatizado",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Programa de referidos automatizado",
    tagline: "Tus alumnos son tus mejores comerciales.",
    recomendado: false,
    descripcionDetallada: "A los 30 días del alta, el alumno recibe un incentivo para referir a un amigo. Si el referido se da de alta, el sistema detecta el origen y aplica el beneficio automáticamente.",
    pasos: ["Trigger a los 30 días del alta","Envío de link único de referido","Atribución automática de premio"],
    personalizacion: "Elige el premio (mes gratis, descuento, etc.).",
    sectores: ["Centros Deportivos"],
    herramientas: ["ReferralHero","Viral Loops","Make","ActiveCampaign"],
    dolores: ["Necesito más reservas"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "GV7",
    codigo: "GV7",
    slug: "seguimiento-alumnos-riesgo-baja",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Notificación y seguimiento de alumnos en riesgo de baja",
    tagline: "Detecta el abandono antes de que ocurra.",
    recomendado: true,
    descripcionDetallada: "Si un alumno no asiste en 10 días (o su frecuencia cae un 50%), el sistema genera una alerta interna y dispara un mensaje personalizado del instructor preguntando cómo está.",
    pasos: ["Análisis de frecuencia de asistencia","Detección de 'riesgo de abandono'","Mensaje preventivo personalizado"],
    personalizacion: "Ajusta los días de inactividad según la intensidad del centro.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Virtuagym","Mindbody","Make","WhatsApp Business API"],
    dolores: ["No sabes cuántos socios están en riesgo de baja ahora mismo"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "GV8",
    codigo: "GV8",
    slug: "upsell-equipamiento-deportivo",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Upsell de equipamiento y material deportivo",
    tagline: "Vende más a tus alumnos actuales.",
    recomendado: false,
    descripcionDetallada: "Cuando un alumno lleva 2 meses o sube de nivel, recibe automáticamente una recomendación de equipamiento con enlace a tienda propia o afiliado. Se activa tras exámenes de grado.",
    pasos: ["Trigger por antigüedad o cambio de nivel","Envío de oferta de material","Link a tienda online"],
    personalizacion: "Elige qué material recomendar por cada nivel/antigüedad.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Make","ActiveCampaign","Shopify"],
    dolores: ["Quiero automatizar presupuestos y respuestas"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "GV9",
    codigo: "GV9",
    slug: "gestion-bonos-packs-clases",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Gestión automatizada de bonos y packs de clases",
    tagline: "Control de sesiones sin errores ni Excel manuales.",
    recomendado: false,
    descripcionDetallada: "Cuando un alumno compra un bono, el sistema lleva el control. Al llegar a 2 clases restantes, envía aviso automático con enlace de renovación. Si expira, entra en flujo de recuperación.",
    pasos: ["Conteo automático de sesiones consumidas","Aviso de 'bono pronto a agotar'","Link de renovación inmediata"],
    personalizacion: "Configura el número de clases para el aviso de renovación.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Make","Stripe","ActiveCampaign"],
    dolores: ["Gestionas las reservas y cancelaciones a mano"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "OA10",
    codigo: "OA10",
    slug: "alta-socio-accesos-auto",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Alta de nuevo socio → creación de ficha y accesos",
    tagline: "Onboarding inmediato y sin papeleo.",
    recomendado: true,
    descripcionDetallada: "Cuando se registra un nuevo socio, se crea automáticamente su ficha, se activa su acceso al torniquete o app, y se le envía email de bienvenida con normas y horarios.",
    pasos: ["Recepción de alta desde web/recepción","Creación de perfil en software de gestión","Activación de credenciales de acceso"],
    personalizacion: "Define el contenido del kit de bienvenida.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Make","Virtuagym","Mindbody","Gmail"],
    dolores: ["Necesito centralizar la información de clientes"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "OA11",
    codigo: "OA11",
    slug: "gestion-automatizada-reservas",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Gestión automatizada de reservas de clases",
    tagline: "Tus clases llenas y el aforo bajo control.",
    recomendado: true,
    descripcionDetallada: "Los socios reservan clase desde app o web. Si cancela con poco tiempo, el sistema libera la plaza, notifica al primero en lista de espera y registra la incidencia.",
    pasos: ["Gestión de booking online","Control de política de cancelación","Notificación a lista de espera automática"],
    personalizacion: "Personaliza el tiempo límite de cancelación.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Mindbody","Virtuagym","Make","WhatsApp Business API"],
    dolores: ["Gestionas las reservas y cancelaciones a mano"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "OA12",
    codigo: "OA12",
    slug: "control-aforo-alertas-ocupacion",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Control de aforo y alertas de ocupación",
    tagline: "Evita salas masificadas y gestiona la demanda.",
    recomendado: false,
    descripcionDetallada: "Monitoriza en tiempo real el aforo. Si una clase está al 80%, activa aviso en canal interno. Si se llena, cierra la reserva y activa lista de espera automáticamente.",
    pasos: ["Chequeo de ocupación vs aforo máximo","Alertas internas por alta demanda","Cierre dinámico de reservas"],
    personalizacion: "Define los umbrales de alerta (80%, 90%).",
    sectores: ["Centros Deportivos"],
    herramientas: ["Software de gestión","Make","Slack"],
    dolores: ["No sabes cuántos socios están en riesgo de baja"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "OA13",
    codigo: "OA13",
    slug: "informe-semanal-kpis-operativos",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Informe semanal de KPIs operativos",
    tagline: "La salud de tu centro, cada lunes en tu móvil.",
    recomendado: false,
    descripcionDetallada: "Cada lunes a las 8h se genera y envía automáticamente al director un informe con altas, bajas, asistencia por clase, ocupación media y cobros pendientes.",
    pasos: ["Consolidación de datos de la semana","Generación de dashboard resumido","Envío vía Slack/WhatsApp/Email"],
    personalizacion: "Elige las métricas clave para tu tipo de centro.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Make","Google Sheets","Slack"],
    dolores: ["No sabes cuántos socios están en riesgo de baja ahora mismo"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "OA14",
    codigo: "OA14",
    slug: "gestion-incidencias-equipamiento",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Gestión de incidencias de equipamiento",
    tagline: "Tus máquinas siempre a punto, sin olvidos.",
    recomendado: false,
    descripcionDetallada: "Reporte de averías mediante formulario o mensaje. Se crea automáticamente un ticket, se notifica al responsable de mantenimiento y se hace seguimiento hasta resolución.",
    pasos: ["Entrada de incidencia desde staff","Alta en gestor de mantenimiento","Aviso y tracking de reparación"],
    personalizacion: "Elige la herramienta de tickets (ClickUp, Notion, Slack).",
    sectores: ["Centros Deportivos"],
    herramientas: ["Typeform","Slack","ClickUp","Make"],
    dolores: ["Pierdo solicitudes entre WhatsApp/Instagram/email"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "OA15",
    codigo: "OA15",
    slug: "gestion-calendario-examenes-grado",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Gestión del calendario de exámenes de grado",
    tagline: "Organiza tus pasos de grado sin caos administrativo.",
    recomendado: true,
    descripcionDetallada: "Identifica automáticamente a los alumnos que cumplen requisitos para examen, les envía invitación con fecha y formulario de confirmación. El instructor recibe el listado 48h antes.",
    pasos: ["Filtrado de alumnos elegibles","Envío masivo de invitaciones","Consolidación de confirmaciones"],
    personalizacion: "Ajusta los requisitos por cada nivel o cinturón.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Make","Google Sheets","Gmail","WhatsApp Business API"],
    dolores: ["Quiero ordenar tareas y que se asignen solas"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "OA16",
    codigo: "OA16",
    slug: "registro-seguimiento-lesiones",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Registro y seguimiento de lesiones de alumnos",
    tagline: "Cuida a tus alumnos y evita bajas por lesiones.",
    recomendado: false,
    descripcionDetallada: "Cuando un alumno reporta una lesión, se crea un registro y se genera alerta al instructor. Se adapta su ficha de reservas y se programa seguimiento a los 7 días.",
    pasos: ["Reporte de lesión","Alerta automática a instructores","Programación de check-up de salud"],
    personalizacion: "Define los tipos de lesiones y el protocolo de seguimiento.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Typeform","Make","Airtable","Gmail"],
    dolores: ["Los socios se van sin avisar"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "OA17",
    codigo: "OA17",
    slug: "gestion-contratos-firma-digital",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Gestión de contratos y documentación firmada digitalmente",
    tagline: "Cero papeles. Cero archivos físicos.",
    recomendado: true,
    descripcionDetallada: "Envío automático de contratos de membresía, consentimiento informado y normas del centro para firma digital. El documento queda archivado automáticamente.",
    pasos: ["Generación de contrato dinámico","Envío para firma digital","Archivo automático en la nube"],
    personalizacion: "Incluye tus propias plantillas de contrato.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Docusign","SignNow","Make","Google Drive"],
    dolores: ["Necesito centralizar la información de clientes"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "OA18",
    codigo: "OA18",
    slug: "automatizacion-comunicacion-padres",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Automatización de la comunicación con padres (alumnos menores)",
    tagline: "Tranquilidad total para los padres, ahorro de tiempo para ti.",
    recomendado: true,
    descripcionDetallada: "Confirmación de asistencia tras cada clase, aviso si el alumno no aparece a una clase reservada y recordatorios de pagos en un canal separado del alumno.",
    pasos: ["Segmentación Alumno vs Tutor","Alertas de asistencia en tiempo real","Recordatorios de eventos infantiles"],
    personalizacion: "Elige qué avisos enviar a los padres y por qué canal.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Make","WhatsApp Business API","ActiveCampaign"],
    dolores: ["Tardamos en responder y perdemos clientes"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "OA19",
    codigo: "OA19",
    slug: "informe-mensual-progreso-alumno",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Informe mensual de progreso por alumno",
    tagline: "Gamifica la experiencia y mejora la retención.",
    recomendado: true,
    descripcionDetallada: "Resumen de actividad mensual: clases asistidas, racha, próximo examen estimado y mensaje personalizado del instructor para aumentar el compromiso.",
    pasos: ["Agregación de actividad mensual","Generación de reporte visual","Envío personalizado automatizado"],
    personalizacion: "Define qué hitos celebrar (ej. '10 clases este mes').",
    sectores: ["Centros Deportivos"],
    herramientas: ["Make","Software de gestión","ActiveCampaign","Google Sheets"],
    dolores: ["Los socios se van sin avisar"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "AC20",
    codigo: "AC20",
    slug: "whatsapp-automata-faq",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Respuesta automática a consultas frecuentes por WhatsApp",
    tagline: "Tu recepción abierta 24/7 sin contratar a nadie.",
    recomendado: true,
    descripcionDetallada: "Un bot de WhatsApp responde automáticamente a preguntas sobre horarios, precios o cómo darse de alta. Escala a recepción si la duda requiere intervención humana.",
    pasos: ["Detección de intención (NLP)","Respuesta desde base de conocimiento","Escalado inteligente con contexto"],
    personalizacion: "Entrena al bot con tus horarios y tarifas específicas.",
    sectores: ["Centros Deportivos"],
    herramientas: ["WhatsApp Business API","Make","ChatGPT"],
    dolores: ["Me escriben mucho y no doy abasto","Tengo muchas preguntas repetidas"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "AC21",
    codigo: "AC21",
    slug: "encuesta-satisfaccion-post-clase",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Encuesta de satisfacción post-clase",
    tagline: "Escucha a tus alumnos en caliente.",
    recomendado: false,
    descripcionDetallada: "2 horas después de la clase, el asistente recibe una encuesta de 1-2 preguntas. Las valoraciones bajas generan una alerta inmediata al responsable.",
    pasos: ["Trigger post-asistencia","Envío de micro-encuesta","Alertas por malas valoraciones"],
    personalizacion: "Elige las preguntas y el tiempo de espera post-clase.",
    sectores: ["Centros Deportivos", "Gestoria"],
    herramientas: ["Typeform","Make","ActiveCampaign"],
    dolores: ["Los socios se van sin avisar"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "AC22",
    codigo: "AC22",
    slug: "gestion-quejas-reclamaciones",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Gestión de quejas y reclamaciones",
    tagline: "Atiende los problemas antes de que se conviertan en bajas.",
    recomendado: false,
    descripcionDetallada: "Al enviar una queja, se crea automáticamente un ticket, se confirma recepción y se asigna con SLA de respuesta definido (ej: 24h).",
    pasos: ["Captura de queja vía formulario","Creación de ticket prioritario","Notificación y seguimiento de SLA"],
    personalizacion: "Define tus tiempos de respuesta por tipo de queja.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Typeform","ClickUp","Make"],
    dolores: ["Los socios se van sin avisar"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "AC23",
    codigo: "AC23",
    slug: "felicitacion-cumpleanos-oferta",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Felicitación de cumpleaños con oferta",
    tagline: "Fideliza a través de los pequeños detalles.",
    recomendado: false,
    descripcionDetallada: "El día de su cumpleaños el socio recibe un mensaje personalizado por WhatsApp o email con una oferta especial (ej. sesión de entrenamiento gratis).",
    pasos: ["Trigger por fecha de natalicio","Envío de mensaje festivo","Inclusión de cupón/oferta"],
    personalizacion: "Elige qué regalo hacer a cada tipo de socio.",
    sectores: ["Centros Deportivos"],
    herramientas: ["ActiveCampaign","Make","WhatsApp Business API"],
    dolores: ["Los socios se van sin avisar"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "AC24",
    codigo: "AC24",
    slug: "deteccion-socios-churn-riesgo",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Detección de socios en riesgo de baja (churn)",
    tagline: "Reactiva a los alumnos ausentes antes de perderlos.",
    recomendado: true,
    descripcionDetallada: "Si un socio no asiste en 14 días, entra en flujo de reactivación: mensaje de ¿todo bien?, oferta de sesión de reenganche y alerta al equipo.",
    pasos: ["Chequeo diario de inactividad","Multicanalidad de contacto (Email/WA)","Oferta de rescate personalizada"],
    personalizacion: "Define el umbral de 'riesgo' (14, 20 o 30 días).",
    sectores: ["Centros Deportivos"],
    herramientas: ["Software de gestión","Make","ActiveCampaign","WhatsApp"],
    dolores: ["No sabes cuántos socios están en riesgo de baja ahora mismo"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "RO25",
    codigo: "RO25",
    slug: "onboarding-empleado-entrenador",
    categoria: "D",
    categoriaNombre: "Internos Agencias",
    nombre: "Onboarding de nuevo empleado / entrenador / alumno",
    tagline: "Experiencia premium desde el minuto 1.",
    recomendado: false,
    descripcionDetallada: "Checklist automático de onboarding: envío de documentación, acceso a herramientas, asignación de mentor y recordatorios de pasos pendientes.",
    pasos: ["Lanzamiento de workflow por nuevo contrato","Distribución de kit de bienvenida digital","Seguimiento de tareas de onboarding"],
    personalizacion: "Adapta el checklist por rol (staff, instructor, alumno).",
    sectores: ["Centros Deportivos"],
    herramientas: ["Make","Notion","Gmail"],
    dolores: ["Quiero ordenar tareas y que se asignen solas"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "RO26",
    codigo: "RO26",
    slug: "gestion-turnos-disponibilidad-instructores",
    categoria: "D",
    categoriaNombre: "Internos Agencias",
    nombre: "Gestión de turnos y disponibilidad de instructores",
    tagline: "Horarios sin conflictos y sin llamadas constantes.",
    recomendado: false,
    descripcionDetallada: "Los instructores informan disponibilidad vía formulario. El sistema cruza con la programación, detecta conflictos y notifica huecos sin cubrir.",
    pasos: ["Recogida de disponibilidad semanal","Cruce automático con calendario de clases","Notificación de incidencias de cobertura"],
    personalizacion: "Define los plazos para informar la disponibilidad.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Typeform","Make","Google Calendar","Slack"],
    dolores: ["Quiero ordenar tareas y que se asignen solas"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "FF27",
    codigo: "FF27",
    slug: "cobro-recurrente-gestion-impagos",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Cobro recurrente y gestión de impagos",
    tagline: "Asegura tus ingresos sin perseguir recibos.",
    recomendado: true,
    descripcionDetallada: "Procesamiento automático de cobros. Si falla, el sistema reintenta a los 3 días, notifica al socio con link de pago y alerta a administración.",
    pasos: ["Ejecución de remesa/cobro tarjeta","Lógica de reintentos automática","Comunicación de deuda instantánea"],
    personalizacion: "Define el número de reintentos y los plazos de aviso.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Stripe","GoCardless","Make","WhatsApp Business API"],
    dolores: ["Los cobros fallidos los sigues persiguiendo tú"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "FF28",
    codigo: "FF28",
    slug: "alerta-pagos-pendientes-proveedores",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    nombre: "Alerta de pagos pendientes a proveedores",
    tagline: "Control de gastos bajo control.",
    recomendado: false,
    descripcionDetallada: "Revisión semanal de facturas de proveedores (mantenimiento, suministros) y alerta al responsable con los vencimientos próximos.",
    pasos: ["Lectura de fechas de vencimiento de compra","Consolidación semanal de pagos","Avisos internos de tesorería"],
    personalizacion: "Elige el día de la semana para el resumen de pagos.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Airtable","Make","Gmail"],
    dolores: ["Necesito centralizar la información de clientes"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "OE29",
    codigo: "OE29",
    slug: "comunicacion-cambios-horario",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Programación y comunicación de cambios en horario de clases",
    tagline: "Avisa de imprevistos al instante y sin caos.",
    recomendado: true,
    descripcionDetallada: "Si se modifica o cancela una clase, el sistema notifica automáticamente a los socios con reserva, ofrece alternativas y actualiza el calendario público.",
    pasos: ["Actualización de horario en sistema","Identificación de socios afectados","Aviso masivo multicanal"],
    personalizacion: "Define el margen de tiempo para avisar de cancelaciones.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Software de gestión","Make","WhatsApp Business API"],
    dolores: ["Gestionas las reservas y cancelaciones a mano"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "GS1",
    codigo: "GS1",
    slug: "recopilacion-mensual-documentos",
    categoria: "F",
    categoriaNombre: "Auditoría tecnológica",
    nombre: "Recopilación automática de documentos",
    tagline: "Solicita y centraliza la documentación de tus clientes cada mes sin perseguir a nadie.",
    landing_slug: "gestorias",
    benefits: [
      "Ahorro de 5+ horas mensuales en gestión documental",
      "Reducción drástica de retrasos en cierres contables",
      "Imagen de orden y profesionalidad ante el cliente"
    ],
    recomendado: true,
    descripcionDetallada: "Olvídate de perseguir facturas cada mes. El sistema detecta automáticamente la fecha de cierre y solicita la documentación necesaria a cada cliente. Si no hay respuesta tras unos días, lanza un segundo aviso de recordatorio. Toda la documentación recibida se centraliza automáticamente en su carpeta correspondiente, lista para ser procesada.",
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Email", "Gestor de archivos", "Automatización"]
    },
    how_it_works_steps: [
      { title: "Detección de ciclo", short: "Identificamos el periodo de cierre.", detail: "El sistema conoce las fechas clave de cada cliente para iniciar la petición en el momento justo." },
      { title: "Solicitud inteligente", short: "Enviamos aviso personalizado.", detail: "Tu cliente recibe un enlace directo para subir sus documentos sin necesidad de login complejo." },
      { title: "Seguimiento y archivo", short: "Recordamos y organizamos.", detail: "Si falta algo, el sistema insiste por ti. Al recibirlo, lo clasifica en la carpeta del periodo." }
    ],
    pasos: [
      "Configuramos el calendario de cierre por cliente",
      "Lanzamos solicitudes automáticas multicanal",
      "Monitorizamos la recepción y lanzamos recordatorios",
      "Centralizamos los archivos en tu gestor de nube organizado"
    ],
    personalizacion: "Define los días de aviso, el tono del mensaje y la estructura de carpetas en tu nube.",
    sectores: ["Gestoria", "Servicios profesionales"],
    herramientas: ["Email", "Google Drive/Dropbox", "Make/Zapier"],
    dolores: ["Pierdo mucho tiempo pidiendo facturas", "Los clientes se retrasan en el envío de docs"],
    integration_domains: ["DOCS"]
  },
  {
    id: "GS2",
    codigo: "GS2",
    slug: "alertas-vencimientos-fiscales",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    landing_slug: "gestorias",
    nombre: "Alertas de vencimientos fiscales y laborales",
    tagline: "Evita sanciones y recargos con un calendario de impuestos automatizado.",
    benefits: [
      "Cero olvidos en trimestres o declaraciones anuales",
      "Visibilidad total para el cliente sobre sus obligaciones",
      "Reducción del estrés en los picos de trabajo fiscales"
    ],
    recomendado: true,
    descripcionDetallada: "Mantén bajo control todas las obligaciones fiscales (IVA, IRPF, Sociedades) y laborales de tus clientes. El sistema genera avisos automáticos con la antelación configurada, tanto para tu equipo interno como para el cliente final. Asegura que toda la documentación esté lista antes de que expire el plazo legal, evitando recargos innecesarios.",
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["Calendario", "Email", "Mensajería"]
    },
    how_it_works_steps: [
      { title: "Carga de calendario", short: "Registramos las fechas clave.", detail: "Introducimos los hitos fiscales y laborales según el perfil de cada cliente." },
      { title: "Avisos preventivos", short: "Notificamos con antelación.", detail: "El sistema lanza alertas escalonadas (T-15, T-5, T-1) para asegurar la recopilación de info." },
      { title: "Confirmación de envío", short: "Validamos la presentación.", detail: "Una vez presentado el trámite, el cliente recibe una confirmación automática con el justificante." }
    ],
    pasos: [
      "Definimos el perfil tributario de cada cliente",
      "Programamos la secuencia de alertas automáticas",
      "Asignamos responsables internos para cada hito",
      "Activamos el canal de notificaciones al cliente"
    ],
    personalizacion: "Ajusta los días de antelación y los canales de aviso (WhatsApp, Email) por cada cliente.",
    sectores: ["Gestoria", "Servicios profesionales"],
    herramientas: ["Google Calendar", "Make", "Email/WhatsApp"],
    dolores: ["Me da miedo que se pase un plazo de impuestos", "El cliente siempre envía todo el último día"],
    integration_domains: ["ERP", "OTHER"]
  },
  {
    id: "GS3",
    codigo: "GS3",
    slug: "seguimiento-expedientes",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    landing_slug: "gestorias",
    nombre: "Seguimiento del estado de cada expediente",
    tagline: "Tu cliente sabe en qué punto está su gestión sin tener que llamarte.",
    benefits: [
      "Reducción del 40% en llamadas de consulta de estado",
      "Transparencia total en el flujo de trabajo del gestor",
      "Control absoluto de plazos y cuellos de botella internos"
    ],
    recomendado: true,
    descripcionDetallada: "Cada vez que entra un nuevo encargo (una herencia, una matriculación, un alta), el sistema genera automáticamente una ficha de seguimiento. El cliente puede consultar en tiempo real en qué fase se encuentra su trámite y recibe una notificación inmediata en su móvil cuando la gestión está completada con éxito.",
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["CRM/Gestor de tareas", "Notificaciones push/Email"]
    },
    how_it_works_steps: [
      { title: "Alta de trámite", short: "Creamos el expediente digital.", detail: "Al recibir el encargo, se asigna un ID único y un responsable automáticamente." },
      { title: "Actualización de hitos", short: "Informamos del progreso.", detail: "Cada vez que superas una fase (ej. 'Presentado en registro'), el estado se actualiza solo." },
      { title: "Cierre y aviso", short: "Notificamos la resolución.", detail: "Cuando termina la gestión, el cliente recibe el resultado y el documento final al instante." }
    ],
    pasos: [
      "Estandarizamos las fases de cada tipo de trámite",
      "Conectamos tu gestor de tareas con el portal del cliente",
      "Configuramos los disparadores de notificaciones automáticas",
      "Activamos el repositorio de documentos resueltos"
    ],
    personalizacion: "Elige qué fases son visibles para el cliente y cuáles son de uso interno.",
    sectores: ["Gestoria", "Servicios profesionales", "Inmobiliaria"],
    herramientas: ["ClickUp/Monday", "Make", "Airtable"],
    dolores: ["Los clientes llaman constantemente para preguntar cómo va lo suyo", "No tengo claro el volumen de trámites pendientes"],
    integration_domains: ["CRM", "OTHER"]
  },
  {
    id: "GS4",
    codigo: "GS4",
    slug: "informes-mensuales-clientes",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    landing_slug: "gestorias",
    nombre: "Informes mensuales automáticos para el cliente",
    tagline: "Entrega valor cada mes con un resumen automático de la situación de tu cliente.",
    benefits: [
      "Aumento de la percepción de valor y fidelización",
      "Cero tiempo invertido en preparar resúmenes manuales",
      "Claridad total sobre ingresos, gastos e IVA pendiente"
    ],
    recomendado: false,
    descripcionDetallada: "Al cierre de cada mes o trimestre, el sistema recopila los datos financieros del cliente y genera un informe visual y fácil de entender. Sin que tu equipo tenga que preparar nada manualmente, el cliente recibe un resumen de su situación: comparativa de ingresos/gastos, previsión de impuestos y alertas de salud financiera.",
    indicators: {
      time_estimate: "2 semanas",
      complexity: "Media",
      integrations: ["ERP", "Google Sheets", "PDF Generator"]
    },
    how_it_works_steps: [
      { title: "Extracción de datos", short: "Leemos el balance del periodo.", detail: "Conectamos con tu software contable para extraer los totales del mes." },
      { title: "Generación de PDF", short: "Diseñamos el reporte visual.", detail: "Convertimos los números en gráficas e indicadores clave de rendimiento (KPIs)." },
      { title: "Envío programado", short: "Entregamos el valor al cliente.", detail: "Se envía automáticamente por email o se deposita en la zona privada del cliente." }
    ],
    pasos: [
      "Definimos la estructura del informe ideal para tus clientes",
      "Mapeamos los campos de tu ERP con la plantilla del reporte",
      "Programamos el envío automático tras el cierre del periodo",
      "Configuramos alertas de variaciones bruscas para el gestor"
    ],
    personalizacion: "Elige los KPIs que quieres mostrar (Margen, IVA, Cashflow) y la marca de agua con tu logo.",
    sectores: ["Gestoria", "Servicios profesionales"],
    herramientas: ["ERP contable", "Make", "Hojas de cálculo"],
    dolores: ["El cliente solo tiene noticias mías para pedir papeles o pagar impuestos", "Tardo mucho en preparar informes para los clientes VIP"],
    integration_domains: ["ERP", "DOCS"]
  },
  {
    id: "GS5",
    codigo: "GS5",
    slug: "conciliacion-bancaria-automatica",
    categoria: "C",
    categoriaNombre: "Finanzas y Tesorería",
    landing_slug: "gestorias",
    nombre: "Conciliación de extractos bancarios",
    tagline: "Cruza cobros y pagos con tus facturas registradas de forma automática.",
    benefits: [
      "Detección inmediata de facturas no cobradas",
      "Contabilidad al día con el mínimo esfuerzo manual",
      "Control exacto de la tesorería de cada cliente"
    ],
    recomendado: true,
    descripcionDetallada: "Automatiza la tarea más tediosa de la contabilidad. El sistema lee periódicamente los movimientos bancarios y los cruza con las facturas emitidas y recibidas. Si hay coincidencia exacta (importe y descripción/CIF), marca la factura como pagada. Si hay discrepancia, genera una tarea de revisión para el gestor.",
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Banca online", "ERP contable"]
    },
    how_it_works_steps: [
      { title: "Sync bancaria", short: "Leemos los movimientos reales.", detail: "Conexión segura vía API con las entidades financieras para obtener el extracto." },
      { title: "Matching inteligente", short: "Cruzamos con la facturación.", detail: "Algoritmos de búsqueda vinculan el ingreso con el cliente o el pago con el proveedor." },
      { title: "Alertas de desvío", short: "Avisamos de lo que no cuadra.", detail: "Si un pago llega sin factura asociada, el sistema pregunta al cliente automáticamente." }
    ],
    pasos: [
      "Configuramos la pasarela de lectura bancaria (Open Banking)",
      "Definimos las reglas de conciliación automática por conceptos",
      "Activamos el panel de discrepancias para revisión rápida",
      "Sincronizamos los estados de pago con tu software contable"
    ],
    personalizacion: "Define el umbral de tolerancia para descuadres de céntimos y reglas por palabras clave.",
    sectores: ["Gestoria", "Servicios profesionales", "E-commerce"],
    herramientas: ["Pasarela bancaria", "ERP", "Make"],
    dolores: ["Dedico demasiadas horas a puntear el banco con las facturas", "No sé quién me debe dinero hasta que no reviso el banco a mano"],
    integration_domains: ["ERP", "OTHER"]
  },
  {
    id: "GS6",
    codigo: "GS6",
    slug: "gestion-altas-empleados",
    categoria: "D",
    categoriaNombre: "Internos Agencias",
    landing_slug: "gestorias",
    nombre: "Alta de nuevos empleados de clientes",
    tagline: "Recopila datos y genera el checklist de contratación al instante.",
    benefits: [
      "Onboarding de empleados impecable y profesional",
      "Eliminación de errores en datos fiscales y laborales",
      "Agilidad extrema: de la solicitud al alta en minutos"
    ],
    recomendado: true,
    descripcionDetallada: "Simplifica el proceso de contratación para tus clientes. Cuando un cliente comunica una nueva incorporación, el sistema lanza una secuencia automática: solicita al futuro empleado su documentación (DNI, SS, cuenta bancaria, modelo 145), crea su ficha digital y genera un checklist de trámites para el gestor. Todo llega ordenado y listo para tramitar el alta en la Seguridad Social.",
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Formularios", "Email", "Gestor de archivos"]
    },
    how_it_works_steps: [
      { title: "Solicitud de datos", short: "El empleado rellena su perfil.", detail: "Enviamos un formulario estructurado al trabajador para que suba su info y fotos de documentos." },
      { title: "Validación de info", short: "Revisamos que esté todo OK.", detail: "El sistema comprueba que no falten campos obligatorios antes de avisar al gestor." },
      { title: "Expediente listo", short: "Todo en su sitio para el alta.", detail: "Se crea una carpeta con toda la documentación organizada por tipo y nombre de empleado." }
    ],
    pasos: [
      "Diseñamos el formulario de recogida de datos laborales",
      "Configuramos la automatización de creación de carpetas",
      "Establecemos el flujo de avisos al departamento laboral",
      "Damos acceso al cliente para que monitorice sus solicitudes"
    ],
    personalizacion: "Personaliza los documentos solicitados según el convenio o tipo de contrato.",
    sectores: ["Gestoria", "Servicios profesionales"],
    herramientas: ["Typeform/Tally", "Make", "Google Drive"],
    dolores: ["Me envían los datos de los nuevos empleados por WhatsApp y a trozos", "Pierdo mucho tiempo reclamando el DNI o el número de la SS"],
    integration_domains: ["DOCS", "OTHER"]
  },
  {
    id: "GS7",
    codigo: "GS7",
    slug: "vencimientos-contratos-laborales",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    landing_slug: "gestorias",
    nombre: "Control de vencimientos de contratos temporales",
    tagline: "Controla renovaciones y extinciones antes de que se pase el plazo legal.",
    benefits: [
      "Evita conversiones forzosas a indefinido por descuido",
      "Planificación anticipada de costes de personal para el cliente",
      "Seguridad jurídica total en la gestión de la plantilla"
    ],
    recomendado: true,
    descripcionDetallada: "No permitas que un contrato temporal se convierta en indefinido por un simple olvido administrativo. El sistema rastrea todas las fechas de fin de contrato y de periodos de prueba, enviando alertas automáticas al gestor y al cliente con la antelación necesaria (30, 15 y 5 días) para decidir la renovación, conversión o extinción de la relación laboral.",
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["ERP Laboral", "Calendario", "Email"]
    },
    how_it_works_steps: [
      { title: "Monitorización", short: "Vigilamos las fechas clave.", detail: "El sistema revisa diariamente la base de datos de empleados buscando vencimientos próximos." },
      { title: "Alerta de decisión", short: "Preguntamos al cliente.", detail: "Enviamos un mensaje al cliente para que confirme si quiere renovar o finalizar el contrato." },
      { title: "Tarea de gestión", short: "Ejecutamos el trámite.", detail: "Si se confirma la baja, se genera automáticamente la tarea para preparar el finiquito." }
    ],
    pasos: [
      "Sincronizamos tu base de datos de contratos con el sistema de alertas",
      "Definimos los umbrales de aviso para cada tipo de contrato",
      "Configuramos los mensajes de solicitud de decisión al cliente",
      "Integramos los avisos en el panel de control del departamento laboral"
    ],
    personalizacion: "Define quién recibe cada alerta y con cuántos días de margen según el tipo de preaviso necesario.",
    sectores: ["Gestoria", "Servicios profesionales"],
    herramientas: ["Airtable/Google Sheets", "Make", "Email/Slack"],
    dolores: ["Se nos pasan las fechas de fin de contrato y hay líos legales", "El cliente nos avisa tarde de que quiere despedir a alguien"],
    integration_domains: ["ERP", "OTHER"]
  },
  {
    id: "GS8",
    codigo: "GS8",
    slug: "envio-automatico-nominas",
    categoria: "D",
    categoriaNombre: "Internos Agencias",
    landing_slug: "gestorias",
    nombre: "Envío automático de nóminas a empleados",
    tagline: "Distribuye todos los recibos de salarios en un clic sin envíos manuales.",
    benefits: [
      "Distribución inmediata y segura tras el cierre de nóminas",
      "Ahorro de horas de trabajo administrativo repetitivo",
      "Canal oficial y profesional de comunicación con el empleado"
    ],
    recomendado: false,
    descripcionDetallada: "Elimina el tedioso proceso de enviar las nóminas una a una por email. Una vez generadas desde tu software laboral, el sistema identifica automáticamente a cada empleado por su DNI o código, separa el documento masivo y envía a cada trabajador su recibo de salarios de forma individual y segura por el canal preferido (email o portal del empleado).",
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["ERP Laboral", "Email", "PDF Splitter"]
    },
    how_it_works_steps: [
      { title: "Subida masiva", short: "Vuelcas el PDF general.", detail: "Simplemente subes el archivo con todas las nóminas del mes generado por tu software." },
      { title: "Fragmentación", short: "Separamos cada nómina.", detail: "La herramienta identifica dónde empieza y acaba cada recibo de forma inteligente." },
      { title: "Entrega segura", short: "Enviamos a cada buzón.", detail: "Cada empleado recibe solo lo suyo, cumpliendo estrictamente con la RGPD." }
    ],
    pasos: [
      "Configuramos el sistema de reconocimiento de campos en el PDF",
      "Vinculamos los DNI con las bases de datos de emails",
      "Establecemos el protocolo de envío con contraseña (opcional)",
      "Activamos el registro de 'entregado/leído' para control interno"
    ],
    personalizacion: "Elige si quieres proteger el PDF con contraseña (ej. últimos dígitos del DNI) y el diseño del cuerpo del email.",
    sectores: ["Gestoria", "Servicios profesionales"],
    herramientas: ["PDF.co", "Make", "SendGrid/Gmail"],
    dolores: ["Tardo una mañana entera en enviar las nóminas de mis clientes", "A veces nos equivocamos y enviamos la nómina de uno a otro por error"],
    integration_domains: ["DOCS", "OTHER"]
  },
  {
    id: "GS9",
    codigo: "GS9",
    slug: "incidencias-laborales-clientes",
    categoria: "D",
    categoriaNombre: "Internos Agencias",
    landing_slug: "gestorias",
    nombre: "Gestión de incidencias de personal",
    tagline: "Recibe bajas, altas, vacaciones e incidencias de forma ordenada y procesable.",
    benefits: [
      "Centralización de toda la información laboral en un solo punto",
      "Evita hilos de email infinitos y mensajes de audio por WhatsApp",
      "Histórico impecable de incidencias por cada trabajador"
    ],
    recomendado: true,
    descripcionDetallada: "Tus clientes ya no te enviarán las variables del mes de forma desordenada. A través de un formulario estructurado, el cliente reporta bajas médicas, vacaciones, horas extra o bonus de sus empleados. El gestor recibe la información clasificada y lista para introducir en nómina, con los documentos adjuntos (partes de baja) vinculados directamente.",
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["Formularios", "Gestor de tareas", "Email"]
    },
    how_it_works_steps: [
      { title: "Reporte estructurado", short: "El cliente rellena el aviso.", detail: "Usa un formulario simple donde elige empleado y tipo de incidencia (baja, vacaciones, etc)." },
      { title: "Clasificación auto", short: "Ordenamos la entrada.", detail: "El sistema crea una tarea en tu departamento laboral con la prioridad adecuada." },
      { title: "Cierre de variable", short: "Confirmamos la gestión.", detail: "Al procesar la nómina, el sistema avisa al cliente de que la incidencia ha sido aplicada." }
    ],
    pasos: [
      "Creamos el catálogo de incidencias estándar (Baja IT, Paternidad, Bonus...)",
      "Implementos el formulario de entrada de datos para el cliente",
      "Conectamos la entrada con tu sistema de gestión de tareas laboral",
      "Configuramos el repositorio de adjuntos (partes de baja, facturas de gastos)"
    ],
    personalizacion: "Define qué tipos de incidencias quieres permitir y si necesitan validación del gestor jefe.",
    sectores: ["Gestoria", "Servicios profesionales"],
    herramientas: ["Tally/JotForm", "Make", "Notion/ClickUp"],
    dolores: ["Me llegan las bajas médicas por fotos borrosas de WhatsApp", "A final de mes siempre falta algún variable que el cliente olvidó decirme"],
    integration_domains: ["OTHER"]
  },
  {
    id: "GS10",
    codigo: "GS10",
    slug: "comunicaciones-calendario-fiscal",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    landing_slug: "gestorias",
    nombre: "Comunicaciones estacionales por calendario fiscal",
    tagline: "Mantén a tus clientes informados y tranquilos con avisos automáticos útiles.",
    benefits: [
      "Posicionamiento como expertos proactivos ante el cliente",
      "Aumento de la confianza y reducción de la incertidumbre",
      "Oportunidad de ofrecer servicios adicionales en momentos clave"
    ],
    recomendado: false,
    descripcionDetallada: "No esperes a que el cliente te pregunte. En los momentos clave del año (apertura de la Renta, cierres trimestrales, fin de año fiscal), el sistema envía automáticamente contenidos útiles, recordatorios de plazos y recomendaciones de ahorro fiscal. Automatiza la comunicación masiva pero personalizada, derivando a cita solo a los clientes con dudas complejas.",
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Email Marketing", "CRM", "Calendario"]
    },
    how_it_works_steps: [
      { title: "Trigger estacional", short: "Detectamos el hito fiscal.", detail: "El sistema se activa al llegar fechas clave (ej. 1 de abril para la Renta)." },
      { title: "Envío didáctico", short: "Educamos al cliente.", detail: "Enviamos una guía o checklist automático sobre qué debe preparar este mes." },
      { title: "Llamada a la acción", short: "Convertimos dudas en trámites.", detail: "Ofrecemos un link para agendar consulta o subir los documentos específicos." }
    ],
    pasos: [
      "Redactamos las plantillas de comunicación para cada hito del año",
      "Segmentamos tu base de datos (Autónomos vs Sociedades)",
      "Configuramos los disparadores por fecha en tu herramienta de email",
      "Integramos el link de reserva de citas para consultas especiales"
    ],
    personalizacion: "Elige el tono de la comunicación y añade vídeos cortos explicativos propios si lo deseas.",
    sectores: ["Gestoria", "Servicios profesionales"],
    herramientas: ["Mailchimp/ActiveCampaign", "Make", "Calendly"],
    dolores: ["Los clientes me colapsan a llamadas cuando empieza la campaña de Renta", " Siento que no aporto valor más allá de meter facturas"],
    integration_domains: ["CRM", "OTHER"]
  },
  {
    id: "GS11",
    codigo: "GS11",
    slug: "alertas-caducidad-documentos",
    categoria: "F",
    categoriaNombre: "Auditoría tecnológica",
    landing_slug: "gestorias",
    nombre: "Alertas de documentos próximos a caducar",
    tagline: "No permitas que un certificado o poder caducado frene una gestión vital.",
    benefits: [
      "Continuidad operativa garantizada para el negocio del cliente",
      "Evita bloqueos inesperados en trámites ante organismos públicos",
      "Gestión proactiva que refuerza tu papel como asesor de confianza"
    ],
    recomendado: true,
    descripcionDetallada: "Poderes notariales, certificados digitales, autorizaciones de transporte o licencias... si caducan, el negocio se para. Este sistema rastrea las fechas de validez de los documentos clave de cada cliente y genera alertas tanto para el gestor como para el cliente con meses de antelación, permitiendo iniciar la renovación de forma relajada y segura.",
    indicators: {
      time_estimate: "< 1 semana",
      complexity: "Baja",
      integrations: ["Gestor de archivos", "Calendario", "Email"]
    },
    how_it_works_steps: [
      { title: "Indexación de fechas", short: "Leemos las caducidades.", detail: "Extraemos las fechas de validez de los documentos al archivarlos en la nube." },
      { title: "Cuenta atrás", short: "Vigilamos el calendario.", detail: "El sistema comprueba diariamente qué documentos están en zona de renovación (ej. 60 días)." },
      { title: "Aviso de renovación", short: "Iniciamos el trámite.", detail: "Notificamos al cliente la necesidad de renovar y los pasos a seguir." }
    ],
    pasos: [
      "Catalogamos los documentos críticos sujetos a caducidad por cliente",
      "Configuramos los campos de fecha en tu gestor documental o base de datos",
      "Programamos la secuencia de pre-avisos automáticos multicanal",
      "Creamos la tarea de seguimiento para el gestor responsable"
    ],
    personalizacion: "Define el margen de antelación para cada tipo de documento (ej. certificados 30 días, poderes 90 días).",
    sectores: ["Gestoria", "Servicios profesionales"],
    herramientas: ["Airtable/Google Sheets", "Make", "Google Drive"],
    dolores: ["Nos damos cuenta de que un poder ha caducado cuando estamos en la notaría", "Los certificados digitales siempre caducan en el peor momento"],
    integration_domains: ["DOCS", "OTHER"]
  },
  {
    id: "GS12",
    codigo: "GS12",
    slug: "canal-documental-cliente",
    categoria: "D",
    categoriaNombre: "Internos Agencias",
    nombre: "Canal estructurado de envío de documentos con el cliente",
    tagline: "Un lugar único y ordenado para que tu cliente suba su documentación sin errores.",
    benefits: [
      "Orden total en la recepción de archivos: nada se pierde en el email",
      "Aviso inmediato al gestor cada vez que el cliente aporta algo nuevo",
      "Estructura de carpetas compartida y profesional desde el primer día"
    ],
    recomendado: true,
    descripcionDetallada: "Sustituye el caos del correo electrónico por un canal de subida directo y estructurado. El cliente dispone de una carpeta compartida o un formulario de carga donde arrastra los documentos. Al hacerlo, el gestor recibe una notificación automática y el archivo se renombra y clasifica en la carpeta de 'Pendientes de revisar' de ese cliente específico.",
    indicators: {
      time_estimate: "< 1 semana",
      complexity: "Baja",
      integrations: ["Gestor de archivos", "Notificaciones push/Slack"]
    },
    how_it_works_steps: [
      { title: "Carga simple", short: "El cliente arrastra el archivo.", detail: "Sin registros farragosos, el cliente sube el documento a su zona privada." },
      { title: "Aviso de recepción", short: "Te avisamos al instante.", detail: "Recibes una notificación en tu canal de trabajo indicando qué cliente ha subido qué." },
      { title: "Orden automático", short: "El archivo va a su sitio.", detail: "Se mueve a la carpeta del cliente y periodo correspondiente para que lo proceses." }
    ],
    pasos: [
      "Desplegamos la estructura de carpetas en tu nube configurada por cliente",
      "Enviamos los enlaces de acceso únicos y seguros a tus clientes",
      "Configuramos el sistema de alertas de 'Nueva Documentación Recibida'",
      "Activamos el historial de versiones para evitar pérdida de datos"
    ],
    personalizacion: "Decide si prefieres un portal web propio o usar carpetas compartidas de Google Drive/Dropbox personalizadas.",
    sectores: ["Gestoria", "Servicios profesionales", "Inmobiliaria"],
    herramientas: ["Google Drive/Dropbox", "Make", "Slack/Email"],
    dolores: ["Tengo el email colapsado de adjuntos de clientes y pierdo horas descargando", "Nunca sé si el cliente me ha enviado ya lo que le pedí"],
    integration_domains: ["DOCS", "OTHER"]
  },
  {
    id: "GS13",
    codigo: "GS13",
    slug: "archivo-automatico-expedientes",
    categoria: "D",
    categoriaNombre: "Internos Agencias",
    nombre: "Archivo organizado de expedientes cerrados",
    tagline: "Pasa de la carpeta activa al histórico de forma automática y con nomenclatura estándar.",
    benefits: [
      "Cumplimiento de RGPD integrado: borrado y archivo controlado",
      "Búsqueda instantánea de información histórica de clientes antiguos",
      "Ahorro de tiempo en tareas de orden y limpieza digital del servidor"
    ],
    recomendado: false,
    descripcionDetallada: "Cuando se marca un trámite o año fiscal como cerrado, el sistema se encarga de 'limpiar' el área de trabajo activa. Mueve toda la documentación a una estructura de archivo histórico, renombra los archivos con una nomenclatura estándar (Año_Cliente_Tramite) y genera un índice para que localices cualquier documento en segundos en el futuro.",
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["Gestor de archivos", "Base de datos"]
    },
    how_it_works_steps: [
      { title: "Trigger de cierre", short: "Confirmas el fin del trámite.", detail: "Al cerrar el expediente en tu gestor, se activa el flujo de archivo." },
      { title: "Procesamiento de docs", short: "Renombramos y organizamos.", detail: "El sistema revisa todos los archivos, quita duplicados y aplica el estándar de nombre." },
      { title: "Traslado seguro", short: "Movemos al histórico.", detail: "Los archivos pasan a la zona de lectura de largo plazo, liberando tu área de trabajo diaria." }
    ],
    pasos: [
      "Definimos tu estándar de nomenclatura para el archivo histórico",
      "Configuramos el disparador de cierre en tu herramienta de gestión de tareas",
      "Establecemos la estructura de carpetas de larga duración",
      "Activamos el registro de auditoría de documentos archivados"
    ],
    personalizacion: "Define el formato de nombre de archivo y el tiempo de permanencia antes del borrado definitivo (RGPD).",
    sectores: ["Gestoria", "Servicios profesionales"],
    herramientas: ["Google Drive/OneDrive/Dropbox", "Make"],
    dolores: ["Tengo el servidor lleno de carpetas de trámites de hace años mezclados con los nuevos", "Cada persona en el equipo nombra los archivos de una forma distinta"],
    integration_domains: ["DOCS"]
  },
  {
    id: "GS14",
    codigo: "GS14",
    slug: "clasificacion-automatica-documentos",
    categoria: "F",
    categoriaNombre: "Auditoría tecnológica",
    landing_slug: "gestorias",
    nombre: "Clasificación y archivo automático de documentos",
    tagline: "Deja que la tecnología lea, clasifique y guarde los documentos por ti.",
    benefits: [
      "Adiós al trabajo pesado de descargar y mover archivos a mano",
      "Cero errores humanos en la clasificación de documentos clave",
      "Acceso instantáneo a la información organizada por cliente y tipo"
    ],
    recomendado: true,
    descripcionDetallada: "Tu buzón de entrada ya no será un cementerio de adjuntos. El sistema vigila tus canales de entrada (email, nube, WhatsApp) y usa inteligencia artificial para leer los documentos. Identifica qué cliente los envía y de qué se trata (una escritura, un parte de baja, un contrato) y los archiva directamente en la carpeta correcta sin que tú muevas un dedo.",
    indicators: {
      time_estimate: "2 semanas",
      complexity: "Alta",
      integrations: ["Email", "IA (OCR)", "Gestor de archivos"]
    },
    how_it_works_steps: [
      { title: "Escucha multicanal", short: "Interceptamos el documento.", detail: "Detectamos el archivo en cuanto llega a tu email o carpeta de entrada." },
      { title: "Análisis por IA", short: "Entendemos qué es.", detail: "La inteligencia artificial lee el contenido y asocia el doc a un cliente por CIF o nombre." },
      { title: "Guardado directo", short: "Archivamos en su sitio.", detail: "Se deposita en la subcarpeta correspondiente (ej. /Laboral/Altas) automáticamente." }
    ],
    pasos: [
      "Entrenamos a la IA con tus tipos de documentos más habituales",
      "Conectamos tus bandejas de entrada con el motor de clasificación",
      "Configuramos las reglas de asociación Cliente-Documento",
      "Activamos un canal de revisión para casos dudosos"
    ],
    personalizacion: "Define qué tipos de documentos quieres que se clasifiquen solos y cuáles prefieres revisar tú.",
    sectores: ["Gestoria", "Servicios profesionales", "Real Estate"],
    herramientas: ["OpenAI/OCR", "Make", "Gestores de archivos"],
    dolores: ["Recibo cientos de documentos al día y pierdo horas clasificándolos", "Muchas veces archivamos mal los documentos y luego no aparecen"],
    integration_domains: ["DOCS"]
  },
  {
    id: "GS15",
    codigo: "GS15",
    slug: "reactivacion-clientes-gestoria",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    landing_slug: "gestorias",
    nombre: "Reactivación de clientes inactivos",
    tagline: "Recupera el contacto con clientes recurrentes que han perdido actividad.",
    benefits: [
      "Aumento de la facturación recurrente sin inversión publicitaria",
      "Detección proactiva de necesidades latentes o fugas de clientes",
      "Imagen de interés genuino y cuidado personalizado del cliente"
    ],
    recomendado: false,
    descripcionDetallada: "No dejes que un cliente se vaya en silencio. El sistema monitoriza la actividad de tu cartera y detecta si algún cliente lleva X meses sin solicitar trámites o facturar servicios específicos. En ese momento, lanza un mensaje personalizado (vía WhatsApp o email) de interés genuino, ofreciendo una revisión gratuita de su situación o informando de una novedad legal que le afecte.",
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["CRM", "Email/WhatsApp Marketing", "ERP"]
    },
    how_it_works_steps: [
      { title: "Monitorización de actividad", short: "Vigilamos el silencio.", detail: "El sistema revisa quién no ha tenido actividad en el periodo definido." },
      { title: "Mensaje de valor", short: "Contactamos con sentido.", detail: "Enviamos una propuesta útil personalizada según el perfil del cliente." },
      { title: "Alerta comercial", short: "Avisamos para seguimiento.", detail: "Si el cliente responde o muestra interés, se genera una tarea para el gestor." }
    ],
    pasos: [
      "Segmentamos tus clientes por volumen e historial",
      "Definimos los umbrales de inactividad que activan el proceso",
      "Redactamos los guiones de contacto para que suenen naturales y útiles",
      "Configuramos la automatización de envío y el registro de respuestas"
    ],
    personalizacion: "Define el tiempo de espera por segmento y el canal de contacto preferido por cada cliente.",
    sectores: ["Gestoria", "Servicios profesionales"],
    herramientas: ["ActiveCampaign/Brevo", "Make", "CRM"],
    dolores: ["Solo hablo con mis clientes cuando hay problemas o toca pagar", "Se me olvidan clientes que solían traerme trámites y ya no vienen"],
    integration_domains: ["CRM", "OTHER"]
  },
  {
    id: "GS16",
    codigo: "GS16",
    slug: "alta-automatizada-nuevos-clientes-gestoria",
    categoria: "D",
    categoriaNombre: "Internos Agencias",
    nombre: "Alta automatizada de nuevos clientes (Gestoría)",
    tagline: "Recopila datos, documentos y genera el contrato de servicios al instante.",
    benefits: [
      "Onboarding impecable que enamora al cliente desde el primer día",
      "Eliminación de la entrada manual de datos en el ERP",
      "Seguridad total con firma digital de mandatos y contratos"
    ],
    recomendado: true,
    descripcionDetallada: "Cada vez que entra un nuevo cliente, se activa una secuencia automática: solicita sus datos fiscales, escanea su DNI/CIF, genera el mandato SEPA y el contrato de servicios para firma digital. Una vez firmado, crea automáticamente la ficha en tu software de gestión y archiva la documentación en su carpeta correspondiente.",
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Firma Digital", "Formularios", "ERP"]
    },
    how_it_works_steps: [
      { title: "Captura de onboarding", short: "El cliente rellena su ficha.", detail: "Enviamos un link seguro donde el cliente aporta sus datos y documentos iniciales." },
      { title: "Firma y contrato", short: "Generamos el papeleo legal.", detail: "Se envía automáticamente el contrato de servicios para su firma biométrica o con certificado." },
      { title: "Sincronización ERP", short: "Creamos la ficha de cliente.", detail: "Los datos validados se vuelcan directamente en tu sistema de gestión sin errores." }
    ],
    pasos: [
      "Activamos el formulario de bienvenida de marca blanca",
      "Configuramos la generación dinámica de contratos en PDF",
      "Integramos la pasarela de firma digital",
      "Sincronizamos los datos con tu software contable/laboral"
    ],
    personalizacion: "Define el contenido de tu kit de bienvenida y los documentos legales necesarios para tu actividad.",
    sectores: ["Gestoria", "Servicios profesionales"],
    herramientas: ["SignNow/Docusign", "Make", "Formularios Cloud"],
    dolores: ["El proceso de alta de un cliente me quita demasiado tiempo", "A veces empezamos a trabajar sin tener el contrato firmado"],
    landing_slug: "gestorias",
    integration_domains: ["CRM", "OTHER"]
  },
];

export const categories = [
  { id: "A", name: "Facturas y Gastos", emoji: "🧾" },
  { id: "B", name: "Horarios y Proyectos", emoji: "📅" },
  { id: "C", name: "Finanzas y Tesorería", emoji: "💰" },
  { id: "D", name: "Internos Agencias", emoji: "🏢" },
  { id: "E", name: "Atención y Ventas", emoji: "💬" },
  { id: "F", name: "Auditoría tecnológica", emoji: "🔍" }
];
