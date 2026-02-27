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
}


export const processes: Process[] = [
  {
    id: "A1",
    codigo: "A1",
    slug: "facturas-automatizadas",
    categoria: "A",
    categoriaNombre: "Facturas y Gastos",
    nombre: "Facturas automatizadas",
    tagline: "No pierdas más tiempo calculando fees fijos y variables sobre la inversión.",
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
        { type: "select", label: "Canal de notificación", options: ["Email", "Mensajería Corporativa", "Chat"] },
        { type: "radio", label: "Estado inicial", options: ["Borrador", "Emitida"] }
      ],
      free_text_placeholder: "¿Tienes algún fee especial o regla de redondeo?"
    },
    demo: {
      video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "1:45",
      chapters: [
        { time: "0:00", title: "Introducción" },
        { time: "0:45", title: "Configuración inicial" },
        { time: "1:20", title: "Resultado final" }
      ]
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
    sectores: ["Agencia/marketing", "Servicios profesionales", "E-commerce"],
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
        { type: "radio", label: "Canal", options: ["Mensajería", "Email"] }
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
    personalizacion: "Decide cuándo recibes el informe y por qué canal (email, mensajería, etc.).",
    sectores: ["Agencia/marketing", "Servicios profesionales", "Retail"],
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
    descripcionDetallada: "Si pasan X días sin respuesta → Aviso a responsables por el canal que elijas. Revisamos el estado del presupuesto en tu ERP/CRM. Detectamos inactividad. Disparamos alerta o email de seguimiento.",
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
        { type: "select", label: "Frecuencia", options: ["Semanal", "Diaria"] }
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
    sectores: ["Retail", "E-commerce", "Servicios profesionales", "Agencia/marketing"],
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
        { type: "select", label: "Umbral de Burnout", options: ["+10h/semana", "+20h/semana"] }
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
        { type: "radio", label: "Formato", options: ["Hoja de cálculo", "Dashboard visual"] }
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
        { type: "select", label: "Umbral de aviso", options: ["80%", "100%", "+15% sobre total"] }
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
        { type: "select", label: "Anticipación", options: ["2 días", "5 días", "1 semana"] }
      ],
      free_text_placeholder: "¿Deseas agrupar todas las del mismo proveedor?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Puede avisar a varios responsables?", a: "Sí, podemos configurar canales específicos de mensajería o grupos de correo." }
    ],
    pasos: [
      "Leemos facturas de proveedores, importes y fechas",
      "Calculamos los días restantes",
      "Enviamos alertas individuales"
    ],
    personalizacion: "Decide días de anticipación y por dónde recibir el aviso.",
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
    descripcionDetallada: "Cierre mensual → Informe con facturación, margen, costes. Consolidamos datos de ingresos, gastos y estructura. Calculamos KPIs clave. Enviamos informe por correo.",
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
        { type: "select", label: "Periodicidad", options: ["Mensual", "Trimestral"] }
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
      "Enviamos informe por correo"
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
        { type: "radio", label: "Alcance", options: ["3 meses", "6 meses", "12 meses"] }
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
        { type: "select", label: "Aviso", options: ["Instantáneo", "Semanal", "Mensual"] }
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
    personalizacion: "Elige cuándo se notifica (mensual, trimestral) y vía (email, mensajería o nube).",
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
        { type: "select", label: "Fuente", options: ["Nube (Drive/Dropbox)", "Email Forward"] }
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
    nombre: "Creación de metas en ClickUp",
    tagline: "Saca todo el partido a las metas de ClickUp sin perder tiempo en crearlas a mano.",
    recomendado: true,
    descripcionDetallada: "Desde un documento con objetivos mensuales → Creamos metas en ClickUp, asignadas por cliente y equipo. Leemos los objetivos del documento. Creamos metas dinámicas en ClickUp por usuario/equipo. Configuramos seguimiento automático de KPIs.",
    summary: {
      what_it_is: "Traducción automática de tu estrategia de negocio en objetivos accionables (Goals) dentro de ClickUp.",
      for_who: ["Directores de equipo", "CEOs", "Responsables de OKRs"],
      requirements: ["ClickUp (Plan Unlimited/Business)", "Documento de objetivos (Sheets/Notion)"],
      output: "Estructura de Metas (Goals) y objetivos (Targets) creada y asignada en ClickUp."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["ClickUp", "Google Sheets"]
    },
    how_it_works_steps: [
      { title: "Definición de Targets", short: "Leemos tus objetivos.", detail: "Extraemos de tu hoja de planificación cuáles son los KPIs a medir este mes." },
      { title: "Arquitectura ClickUp", short: "Creamos los Goals dinámicos.", detail: "Generamos la estructura de metas en ClickUp asignando pesos y porcentajes de éxito." },
      { title: "Asignación de equipo", short: "Conectamos con responsables.", detail: "Cada usuario implicado recibe su meta para que su progreso se actualice automáticamente." }
    ],
    customization: {
      options_blocks: [
        { type: "radio", label: "Actualización", options: ["Automática vía API", "Manual en ClickUp"] }
      ],
      free_text_placeholder: "¿Cómo mides el éxito de tus metas (monetario, numérico, booleano)?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Se actualiza si cambio el Sheets?", a: "Sí, podemos configurar una sincronización bidireccional o bajo demanda." }
    ],
    pasos: [
      "Leemos los objetivos del documento",
      "Creamos metas dinámicas en ClickUp por usuario/equipo",
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
    nombre: "Facturación automática basada en horas (freelance)",
    tagline: "¿Trabajas con distintos freelance a distintos precios por hora?",
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
        { type: "select", label: "Frecuencia aviso", options: ["Semanal", "Mensual"] }
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
    slug: "atencion-automatica-whatsapp",
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
        { type: "radio", label: "Exigir prepago", options: ["Sí, fianza de reserva", "No, pago en local"] }
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
        { type: "select", label: "Destino", options: ["Gestor de tareas", "Software de gestión", "CRM"] }
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
      requirements: ["CRM con estados de venta", "Canal de comunicación (Chat/Email)"],
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
        { type: "select", label: "Número de toques", options: ["2 intentos", "3 intentos", "5 intentos"] }
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
        { type: "radio", label: "Canal", options: ["Chat (Recomendado)", "Email"] }
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
    related_processes: ["asistente-reservas-recordatorios", "atencion-automatica-whatsapp"],
    integration_domains: ["OTHER"]
  },
  {
    id: "E22",
    codigo: "E22",
    slug: "atencion-automatica-instagram",
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
    related_processes: ["atencion-automatica-whatsapp", "captura-organizacion-solicitudes"]
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
        { type: "select", label: "Tiempo de antelación", options: ["24h antes", "48h antes"] }
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
    categoriaNombre: "Atención y Captura",
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
        { type: "select", label: "Canal", options: ["Mensajería", "Email", "Ambos"] }
      ],
      free_text_placeholder: "¿Qué documentos mínimos necesitas que el cliente suba en su onboarding?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Y si ya existe el cliente?", a: "El sistema detecta duplicados y en lugar de crear un cliente nuevo, añade un nuevo proyecto a su ficha existente." }
    ],
    pasos: [
      "Recibimos los datos del formulario de onboarding",
      "Creamos la carpeta del cliente en el gestor de archivos",
      "Generamos el nuevo proyecto en el gestor de tareas con sus etapas",
      "Creamos el canal de comunicación compartido",
      "Enviamos el mensaje de bienvenida con los acceso"
    ],
    personalizacion: "Define las preguntas del formulario, la estructura de carpetas, el tablero del gestor de tareas y el mensaje de bienvenida.",
    sectores: ["Agencia/marketing", "Servicios profesionales", "Inmobiliaria"],
    herramientas: ["Formulario", "Gestor de tareas", "Gestor de archivos", "Canal de comunicación"],
    dolores: ["Pierdo solicitudes entre WhatsApp/Instagram/email", "No hago seguimiento a las personas interesadas"],
    related_processes: ["atencion-automatica-whatsapp", "captura-organizacion-solicitudes"]
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
    dolores: [
      "No sé por dónde empezar con la IA",
      "Quiero automatizar pero no tengo roadmap",
      "Mis equipos pierden tiempo en tareas manuales complejas"
    ],
    related_processes: ["atencion-automatica-whatsapp", "registro-automatico-gastos"]
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
