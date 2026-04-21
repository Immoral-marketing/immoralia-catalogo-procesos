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
    categoriaNombre: "Facturación y Finanzas",
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
    sectores: ["Agencia/marketing", "Servicios profesionales", "E-commerce", "Gestoria", "Construcción & Reformas", "Academias / Formación"],
    herramientas: ["ERP/Software de gestión", "Hoja de cálculo"],
    dolores: ["Quiero automatizar presupuestos y respuestas", "Necesito centralizar la información de clientes"],
    integration_domains: ["ERP"],
    landing_slug: "salud"
  },

  {
    id: "A2",
    codigo: "A2",
    slug: "informe-semanal-facturas-vencidas",
    categoria: "A",
    categoriaNombre: "Facturación y Finanzas",
    nombre: "Informe semanal de facturas vencidas",
    tagline: "Controla cada semana cómo van los impagos.",
    one_liner: "Cada lunes sabes exactamente quién te debe dinero, cuánto y desde cuándo. Sin buscar en el ERP, sin perder tiempo.",
    recomendado: true,
    descripcionDetallada: "Cada lunes → recibes un informe con un desglose de las facturas vencidas, quién debe cuánto y desde cuándo. Revisamos todas las facturas con estado 'vencida'. Calculamos antigüedad, importe total y asignamos cliente. Generamos un informe automático.",
    benefits: [
      "Sabes cada lunes quién te debe dinero y cuánto, sin tener que abrir el ERP",
      "Recibes el informe directamente en tu canal favorito: email, Slack, WhatsApp o Teams",
      "Priorizas cobros con datos reales: nombre del cliente, importe y días de retraso"
    ],
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
      { title: "Lo configuras una sola vez", short: "Conectamos tu ERP y defines el canal de envío.", detail: "Conectamos tu ERP y defines el canal donde quieres recibir el informe. A partir de ahí, todo es automático." },
      { title: "Cada semana el sistema hace el trabajo", short: "Revisamos todas las facturas vencidas.", detail: "Revisamos automáticamente todas las facturas vencidas, calculamos cuántos días lleva sin pagar cada cliente y agrupamos los importes." },
      { title: "Recibes el informe y decides a quién llamar", short: "Te llega un resumen con el ranking de deuda.", detail: "Te llega un resumen limpio con el ranking de deuda: quién debe más, cuánto y desde cuándo. Sin buscar, sin calcular." }
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
      { q: "¿Necesito dar acceso a toda mi contabilidad?", a: "No. Solo necesitamos acceso de lectura a las facturas vencidas. No modificamos ningún dato de tu ERP ni accedemos a información que no sea estrictamente la deuda pendiente." },
      { q: "¿Funciona con mi ERP?", a: "Nos integramos con los ERPs más habituales: Holded, Sage, Odoo, Factura Directa y otros. Si no estás seguro, cuéntanos cuál usas y te lo confirmamos en 24h." },
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
    categoriaNombre: "Facturación y Finanzas",
    nombre: "Creación automática de presupuestos sin errores",
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
    sectores: ["Servicios profesionales", "Agencia/marketing", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["ERP/Software de gestión", "Hoja de cálculo"],
    dolores: ["Quiero automatizar presupuestos y respuestas", "Tardamos en responder y perdemos clientes"],
    related_processes: ["seguimiento-presupuestos", "facturas-automatizadas"],
    integration_domains: ["ERP"],
    landing_slug: "construccion"
  },

  {
    id: "A4",
    codigo: "A4",
    slug: "seguimiento-presupuestos",
    categoria: "A",
    categoriaNombre: "Facturación y Finanzas",
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
    categoriaNombre: "Facturación y Finanzas",
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
    sectores: ["Retail", "E-commerce", "Servicios profesionales", "Agencia/marketing", "Gestoria", "Academias / Formación", "Hostelería"],
    herramientas: ["ERP/Software de gestión", "Canal de comunicación"],
    dolores: ["Tardamos en responder y perdemos clientes", "No hago seguimiento a las personas interesadas"],
    related_processes: ["informe-semanal-facturas-vencidas", "traspasos-automaticos-iva"],
    integration_domains: ["ERP"],
    landing_slug: "salud"
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
    integration_domains: ["OTHER"],
    sectores: ["Gestoria", "Clínicas / Salud / Dental / Veterinaria", "Academias / Formación", "Construcción & Reformas", "E-commerce", "Retail", "Agencia/marketing", "Consultoría", "Inmobiliaria", "Hostelería"]
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
    integration_domains: ["OTHER"],
    sectores: ["Gestoria", "Clínicas / Salud / Dental / Veterinaria", "Construcción & Reformas", "E-commerce", "Retail", "Agencia/marketing", "Consultoría", "Inmobiliaria"]
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
    integration_domains: ["OTHER"],
    sectores: ["Gestoria", "Clínicas / Salud / Dental / Veterinaria", "Construcción & Reformas", "E-commerce", "Retail", "Agencia/marketing", "Consultoría", "Inmobiliaria"]
  },

  {
    id: "C9",
    codigo: "C9",
    slug: "alertas-vencimiento-facturas-compra",
    categoria: "C",
    categoriaNombre: "Facturación y Finanzas",
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
    integration_domains: ["ERP"],
    landing_slug: "salud",
    sectores: ["Agencia/marketing", "Servicios profesionales", "Construcción & Reformas"]
  },

  {
    id: "C10",
    codigo: "C10",
    slug: "informes-financieros-direccion",
    categoria: "C",
    categoriaNombre: "Facturación y Finanzas",
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
    categoriaNombre: "Facturación y Finanzas",
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
    categoriaNombre: "Facturación y Finanzas",
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
    integration_domains: ["ERP"],
    landing_slug: "salud"
  },

  {
    id: "D13",
    codigo: "D13",
    slug: "registro-automatico-gastos",
    categoria: "D",
    categoriaNombre: "Gestión Interna",
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
    integration_domains: ["ERP"],
    landing_slug: "salud",
    sectores: ["Agencia/marketing", "Servicios profesionales", "Construcción & Reformas"]
  },
  {
    id: "D14",
    codigo: "D14",
    slug: "creacion-metas-clickup",
    categoria: "D",
    categoriaNombre: "Gestión Interna",
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
    sectores: ["Servicios profesionales", "Retail", "Peluquería/estética", "Gestoria", "Construcción & Reformas", "Academias / Formación", "Hostelería"],
    related_processes: ["atencion-automatica-redes", "captura-organizacion-solicitudes"],
    integration_domains: ["OTHER"],
    landing_slug: "salud"
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
    sectores: ["Clínicas / Salud / Dental / Veterinaria", "Centros de estética", "Peluquería/estética", "Restaurantes", "Servicios profesionales", "Gestoria", "Academias / Formación", "Hostelería"],
    related_processes: ["reduccion-ausencias-citas", "solicitud-automatica-resenas"],
    integration_domains: ["OTHER"],
    landing_slug: "academias"
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
    sectores: ["Servicios profesionales", "Peluquería/estética", "Retail", "E-commerce", "Construcción & Reformas", "Academias / Formación"],
    related_processes: ["seguimiento-automatico-solicitudes", "alta-automatica-clientes-solicitudes"],
    integration_domains: ["CRM"],
    landing_slug: "salud"
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
    integration_domains: ["CRM"],
    landing_slug: "salud"
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
    sectores: ["Restaurantes", "Clínicas / Salud / Dental / Veterinaria", "Peluquería/estética", "Retail", "Gestoria", "Academias / Formación", "Hostelería"],
    related_processes: ["asistente-reservas-recordatorios", "atencion-automatica-tu vía de comunicación preferida"],
    integration_domains: ["OTHER"],
    landing_slug: "restauracion"
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
    nombre: "Reducción de citas perdidas",
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
    sectores: ["Peluquería/estética", "Clínicas / Salud / Dental / Veterinaria", "Gimnasio/yoga", "Servicios profesionales", "Academias / Formación", "Hostelería"],
    herramientas: ["Mensajería", "Calendario"],
    dolores: ["Se olvidan de la cita / hay muchas ausencias"],
    related_processes: ["asistente-reservas-recordatorios", "solicitud-automatica-resenas"],
    landing_slug: "salud"
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
    sectores: ["Agencia/marketing", "Servicios profesionales", "Inmobiliaria", "Gestoria", "Construcción & Reformas"],
    herramientas: ["Formulario", "Gestor de tareas", "Gestor de archivos", "Canal de comunicación"],
    dolores: ["Pierdo solicitudes entre tu vía de comunicación preferida/tu vía de comunicación preferida/tu vía de comunicación preferida", "No hago seguimiento a las personas interesadas"],
    related_processes: ["atencion-automatica-tu vía de comunicación preferida", "captura-organizacion-solicitudes"],
    landing_slug: "salud"
  },
  {
    id: "F25",
    codigo: "F25",
    slug: "auditoria-tecnologica-ia",
    categoria: "F",
    categoriaNombre: "Auditoría tecnológica",
    nombre: "Diagnóstico de automatización",
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
    sectores: ["Agencia/marketing", "Servicios profesionales", "Retail", "Inmobiliaria", "E-commerce", "Clínicas / Salud / Dental / Veterinaria", "Hostelería", "Construcción & Reformas", "Academias / Formación"],
    herramientas: [],
    related_processes: ["atencion-automatica-tu vía de comunicación preferida", "registro-automatico-gastos"],
    landing_slug: "salud"
  },
  {
    id: "CM1",
    codigo: "CM1",
    slug: "lead-capture-crm",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Captación automática de interesados desde tu web y redes sociales",
    tagline: "Los leads entran solos en tu CRM y arrancan su secuencia.",
    recomendado: true,
    descripcionDetallada: "Cuando alguien rellena un formulario de 'prueba gratuita' o 'más información' en la web o Instagram, el contacto entra automáticamente en el CRM/email marketing con etiqueta de origen y arranca una secuencia de nurturing.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Seguimiento automático de personas que preguntaron pero no se apuntaron",
    tagline: "No dejes que ningún lead se olvide de ti.",
    recomendado: true,
    descripcionDetallada: "Tras capturar un lead que no convierte de inmediato, se activa una secuencia de 3-5 emails o WhatsApp con testimonios, beneficios y oferta de primera clase gratuita. Se detiene automáticamente si convierte.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Mensajes automáticos para recuperar socios que se dieron de baja",
    tagline: "Recupera antiguos alumnos con ofertas personalizadas.",
    recomendado: true,
    descripcionDetallada: "Segmenta automáticamente los socios que causaron baja hace más de 3 meses y les envía una oferta de reincorporación personalizada por email o WhatsApp. Se activa mensualmente o en fechas clave.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Facturación y Finanzas",
    nombre: "Aviso automático cuando la cuota de un socio está a punto de caducar",
    tagline: "Renovaciones automáticas sin fricción.",
    recomendado: true,
    descripcionDetallada: "7 y 2 días antes de que venza la membresía, el socio recibe un aviso automático por email y/o WhatsApp con enlace de pago o renovación. Si no renueva, entra en flujo de retención.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Facturación y Finanzas",
    nombre: "Recordatorio automático para quienes vinieron a probar y no volvieron",
    tagline: "Vuelve a por los alumnos que probaron y no volvieron.",
    recomendado: false,
    descripcionDetallada: "Leads que asistieron a la clase de prueba pero no se dieron de alta entran en una secuencia de reactivación automática a los 15, 30 y 60 días: email con testimonio, oferta limitada y enlace de reserva.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Facturación y Finanzas",
    nombre: "Sistema automático para que tus alumnos traigan amigos a cambio de un premio",
    tagline: "Tus alumnos son tus mejores comerciales.",
    recomendado: false,
    descripcionDetallada: "A los 30 días del alta, el alumno recibe un incentivo para referir a un amigo. Si el referido se da de alta, el sistema detecta el origen y aplica el beneficio automáticamente.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Facturación y Finanzas",
    nombre: "Aviso automático cuando un alumno lleva días sin venir al centro",
    tagline: "Detecta el abandono antes de que ocurra.",
    recomendado: true,
    descripcionDetallada: "Si un alumno no asiste en 10 días (o su frecuencia cae un 50%), el sistema genera una alerta interna y dispara un mensaje personalizado del instructor preguntando cómo está.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Facturación y Finanzas",
    nombre: "Recomendación automática de material deportivo según el nivel del alumno",
    tagline: "Vende más a tus alumnos actuales.",
    recomendado: false,
    descripcionDetallada: "Cuando un alumno lleva 2 meses o sube de nivel, recibe automáticamente una recomendación de equipamiento con enlace a tienda propia o afiliado. Se activa tras exámenes de grado.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Facturación y Finanzas",
    nombre: "Control automático de bonos de clases con avisos cuando quedan pocas sesiones",
    tagline: "Control de sesiones sin errores ni Excel manuales.",
    recomendado: false,
    descripcionDetallada: "Cuando un alumno compra un bono, el sistema lleva el control. Al llegar a 2 clases restantes, envía aviso automático con enlace de renovación. Si expira, entra en flujo de recuperación.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Registro automático de nuevos socios con acceso y bienvenida incluidos",
    tagline: "Onboarding inmediato y sin papeleo.",
    recomendado: true,
    descripcionDetallada: "Cuando se registra un nuevo socio, se crea automáticamente su ficha, se activa su acceso al torniquete o app, y se le envía email de bienvenida con normas y horarios.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Gestión automática de reservas, cancelaciones y lista de espera",
    tagline: "Tus clases llenas y el aforo bajo control.",
    recomendado: true,
    descripcionDetallada: "Los socios reservan clase desde app o web. Si cancela con poco tiempo, el sistema libera la plaza, notifica al primero en lista de espera y registra la incidencia.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Aviso automático cuando una clase está casi llena o se llena del todo",
    tagline: "Evita salas masificadas y gestiona la demanda.",
    recomendado: false,
    descripcionDetallada: "Monitoriza en tiempo real el aforo. Si una clase está al 80%, activa aviso en canal interno. Si se llena, cierra la reserva y activa lista de espera automáticamente.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Resumen semanal automático del estado de tu centro",
    tagline: "La salud de tu centro, cada lunes en tu móvil.",
    recomendado: false,
    descripcionDetallada: "Cada lunes a las 8h se genera y envía automáticamente al director un informe con altas, bajas, asistencia por clase, ocupación media y cobros pendientes.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Registro automático de averías con seguimiento hasta que estén reparadas",
    tagline: "Tus máquinas siempre a punto, sin olvidos.",
    recomendado: false,
    descripcionDetallada: "Reporte de averías mediante formulario o mensaje. Se crea automáticamente un ticket, se notifica al responsable de mantenimiento y se hace seguimiento hasta resolución.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Organización automática de exámenes o pruebas de nivel para tus alumnos",
    tagline: "Organiza tus pasos de grado sin caos administrativo.",
    recomendado: true,
    descripcionDetallada: "Identifica automáticamente a los alumnos que cumplen requisitos para examen, les envía invitación con fecha y formulario de confirmación. El instructor recibe el listado 48h antes.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Seguimiento automático de alumnos lesionados hasta que se recuperan",
    tagline: "Cuida a tus alumnos y evita bajas por lesiones.",
    recomendado: false,
    descripcionDetallada: "Cuando un alumno reporta una lesión, se crea un registro y se genera alerta al instructor. Se adapta su ficha de reservas y se programa seguimiento a los 7 días.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Firma y archivo automático de contratos sin papel ni desplazamientos",
    tagline: "Cero papeles. Cero archivos físicos.",
    recomendado: true,
    descripcionDetallada: "Envío automático de contratos de membresía, consentimiento informado y normas del centro para firma digital. El documento queda archivado automáticamente.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Avisos automáticos a padres sobre asistencia, pagos y eventos de sus hijos",
    tagline: "Tranquilidad total para los padres, ahorro de tiempo para ti.",
    recomendado: true,
    descripcionDetallada: "Confirmación de asistencia tras cada clase, aviso si el alumno no aparece a una clase reservada y recordatorios de pagos en un canal separado del alumno.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Resumen mensual automático del progreso de cada alumno",
    tagline: "Gamifica la experiencia y mejora la retención.",
    recomendado: true,
    descripcionDetallada: "Resumen de actividad mensual: clases asistidas, racha, próximo examen estimado y mensaje personalizado del instructor para aumentar el compromiso.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Respuestas automáticas en WhatsApp a las preguntas más habituales",
    tagline: "Tu recepción abierta 24/7 sin contratar a nadie.",
    recomendado: true,
    descripcionDetallada: "Un bot de WhatsApp responde automáticamente a preguntas sobre horarios, precios o cómo darse de alta. Escala a recepción si la duda requiere intervención humana.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Encuesta rápida automática a tus alumnos justo después de cada clase",
    tagline: "Escucha a tus alumnos en caliente.",
    recomendado: false,
    descripcionDetallada: "2 horas después de la clase, el asistente recibe una encuesta de 1-2 preguntas. Las valoraciones bajas generan una alerta inmediata al responsable.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Gestión automática de quejas con confirmación inmediata y seguimiento",
    tagline: "Atiende los problemas antes de que se conviertan en bajas.",
    recomendado: false,
    descripcionDetallada: "Al enviar una queja, se crea automáticamente un ticket, se confirma recepción y se asigna con SLA de respuesta definido (ej: 24h).",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Mensaje automático de cumpleaños a cada socio con un regalo o descuento",
    tagline: "Fideliza a través de los pequeños detalles.",
    recomendado: false,
    descripcionDetallada: "El día de su cumpleaños el socio recibe un mensaje personalizado por WhatsApp o email con una oferta especial (ej. sesión de entrenamiento gratis).",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Aviso automático cuando un socio lleva días sin aparecer por el centro",
    tagline: "Reactiva a los alumnos ausentes antes de perderlos.",
    recomendado: true,
    descripcionDetallada: "Si un socio no asiste en 14 días, entra en flujo de reactivación: mensaje de ¿todo bien?, oferta de sesión de reenganche y alerta al equipo.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
    pasos: ["Chequeo diario de inactividad","Multicanalidad de contacto (Email/WA)","Oferta de rescate personalizada"],
    personalizacion: "Define el umbral de 'riesgo' (14, 20 o 30 días).",
    sectores: ["Centros Deportivos"],
    herramientas: ["Software de gestión","Make","ActiveCampaign","WhatsApp"],
    dolores: ["No sabes cuántos socios están en riesgo de baja ahora mismo"],
    landing_slug: "centros-deportivos"
  },
  {
    id: "AC25",
    codigo: "AC25",
    slug: "notificacion-cambios-cancelaciones-clase",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Aviso automático a alumnos cuando se cancela o cambia una clase",
    tagline: "Cero sorpresas. Tus alumnos siempre informados al instante.",
    recomendado: true,
    descripcionDetallada: "Cuando un profesor cancela o reprograma una clase, el sistema notifica automáticamente a todos los alumnos matriculados en ese grupo con el motivo y, si aplica, la nueva fecha. Sin WhatsApps manuales, sin correos uno a uno.",
    summary: {
      what_it_is: "Comunicación automática de incidencias de horario a todos los alumnos afectados en tiempo real.",
      for_who: ["Directores de academia", "Coordinadores académicos", "Administración"],
      requirements: ["Software de gestión de alumnos", "Canal de comunicación (Email o WhatsApp)"],
      output: "Notificación instantánea a todos los alumnos del grupo afectado."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["Gestión de alumnos", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Detección de cambio", short: "Detectamos la cancelación o cambio.", detail: "El sistema monitoriza el calendario de clases y detecta cualquier modificación o cancelación en tiempo real." },
      { title: "Segmentación de afectados", short: "Identificamos a los alumnos del grupo.", detail: "Se obtiene automáticamente la lista de alumnos matriculados en esa clase o grupo específico." },
      { title: "Envío masivo personalizado", short: "Notificamos a todos a la vez.", detail: "Cada alumno recibe un mensaje con su nombre, la clase afectada y, si aplica, la nueva fecha propuesta." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Canal de notificación", options: ["Email", "WhatsApp", "Ambos"] },
        { type: "select", label: "¿Proponer nueva fecha automáticamente?", options: ["Sí, si hay hueco disponible", "No, solo avisar del cambio"] }
      ],
      free_text_placeholder: "¿Necesitas avisar también a los padres en el caso de alumnos menores?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Funciona si tenemos varios profesores y grupos?", a: "Sí, el sistema distingue por grupo y solo notifica a los alumnos del grupo afectado." },
      { q: "¿Podemos personalizar el mensaje?", a: "Completamente. Puedes definir plantillas distintas para cancelación, cambio de hora o cambio de aula." }
    ],
    pasos: [
      "Detectamos cancelación o cambio en el calendario de clases",
      "Obtenemos la lista de alumnos del grupo afectado",
      "Enviamos notificación personalizada a cada alumno"
    ],
    personalizacion: "Elige el canal, el tono del mensaje y si quieres incluir propuesta de nueva fecha.",
    related_processes: ["control-asistencia-alertas-faltas", "matricula-asignacion-nivel-automatica"],
    integration_domains: ["OTHER"],
    landing_slug: "academias"
  },
  {
    id: "AC26",
    codigo: "AC26",
    slug: "control-asistencia-alertas-faltas",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Control automático de asistencia con alertas cuando un alumno acumula faltas",
    tagline: "Detecta el absentismo antes de que sea un problema.",
    recomendado: true,
    descripcionDetallada: "El sistema registra la asistencia de cada alumno. Si acumula X faltas consecutivas o supera un porcentaje de ausencias, se genera alerta interna para el coordinador y se envía un mensaje automático al alumno (o a su tutor si es menor). Imprescindible en academias con requisitos de asistencia mínima para certificación.",
    summary: {
      what_it_is: "Sistema de seguimiento de asistencia que detecta absentismo y actúa de forma automática antes de que el alumno abandone.",
      for_who: ["Coordinadores académicos", "Directores de academia", "Tutores"],
      requirements: ["Software de gestión de alumnos o registro de asistencia", "Canal de comunicación"],
      output: "Alerta al coordinador + mensaje automático al alumno o tutor cuando se superan los umbrales definidos."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja",
      integrations: ["Gestión de alumnos", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Registro de asistencia", short: "Leemos las asistencias del día.", detail: "Cada día lectivo el sistema consulta el registro de asistencia e identifica ausencias no justificadas." },
      { title: "Cálculo de umbrales", short: "Comprobamos si se ha superado el límite.", detail: "Calculamos el número de faltas consecutivas y el porcentaje acumulado sobre el total de clases del período." },
      { title: "Acción automática", short: "Alertamos y contactamos.", detail: "El coordinador recibe un aviso interno y el alumno (o tutor) recibe un mensaje empático preguntando si todo va bien." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Umbral de faltas para alerta", options: ["2 faltas consecutivas", "3 faltas consecutivas", "20% de ausencias en el mes"] },
        { type: "select", label: "¿A quién notificar?", options: ["Solo al alumno", "Solo al coordinador", "A ambos", "Al tutor si es menor de edad"] }
      ],
      free_text_placeholder: "¿Tienes requisito de asistencia mínima para aprobar o certificar?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Distingue entre faltas justificadas e injustificadas?", a: "Sí, puedes marcar una ausencia como justificada y el sistema no la contabiliza para el umbral de alerta." },
      { q: "¿Funciona con academias de idiomas y también de formación profesional?", a: "Absolutamente, es configurable por tipo de curso y los umbrales se pueden ajustar según las exigencias de cada programa." }
    ],
    pasos: [
      "Leemos el registro de asistencia de cada sesión",
      "Calculamos faltas acumuladas y porcentaje de ausencias",
      "Enviamos alerta al coordinador y mensaje al alumno o tutor"
    ],
    personalizacion: "Define el umbral de faltas, a quién avisar y el tono del mensaje (recordatorio amable o formal).",
    related_processes: ["notificacion-cambios-cancelaciones-clase", "matricula-asignacion-nivel-automatica"],
    integration_domains: ["OTHER"],
    landing_slug: "academias"
  },
  {
    id: "AC27",
    codigo: "AC27",
    slug: "matricula-asignacion-nivel-automatica",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Matrícula automática y asignación al grupo según nivel del alumno",
    tagline: "Del formulario al grupo correcto, sin intervención manual.",
    recomendado: true,
    descripcionDetallada: "Cuando un nuevo alumno completa el formulario de inscripción o la prueba de nivel, el sistema lo asigna automáticamente al grupo adecuado, le envía el horario y la documentación de bienvenida, y notifica al profesor del grupo. Aplica a academias de idiomas, música, autoescuelas, formación profesional y cualquier formación por niveles.",
    summary: {
      what_it_is: "Flujo de alta automatizado que lleva al nuevo alumno desde el registro hasta su primer día de clase sin gestión manual.",
      for_who: ["Administración de academia", "Coordinadores académicos", "Directores"],
      requirements: ["Formulario de inscripción o prueba de nivel", "Software de gestión de alumnos", "Canal de comunicación"],
      output: "Alumno asignado a grupo + email/WhatsApp de bienvenida con horario y documentación + aviso al profesor."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Formularios", "Gestión de alumnos", "Comunicación"]
    },
    how_it_works_steps: [
      { title: "Recepción de inscripción", short: "El alumno completa el formulario.", detail: "Cuando alguien se inscribe o realiza la prueba de nivel, el sistema recibe los datos automáticamente." },
      { title: "Asignación de grupo", short: "Encontramos el grupo correcto.", detail: "Según el resultado del nivel y la disponibilidad de plazas, el sistema asigna al alumno al grupo más adecuado." },
      { title: "Bienvenida y aviso", short: "Todos quedan informados.", detail: "El alumno recibe horario, profesor asignado y documentación de bienvenida. El profesor recibe aviso de nuevo alumno." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "¿Cómo se determina el nivel?", options: ["Resultado de prueba online", "Evaluación presencial previa", "Nivel declarado por el alumno"] },
        { type: "select", label: "¿Qué incluye el kit de bienvenida?", options: ["Horario + normativa", "Horario + materiales del curso", "Solo confirmación de plaza"] }
      ],
      free_text_placeholder: "¿Necesitas que el alumno firme algún documento antes de empezar?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Qué pasa si no hay plazas disponibles en el nivel asignado?", a: "El sistema puede añadirlo a lista de espera y notificarle automáticamente cuando se abra una plaza." },
      { q: "¿Funciona para inscripciones masivas al inicio de curso?", a: "Sí, está diseñado para gestionar altas individuales y también oleadas de matriculación al inicio de cada período." }
    ],
    pasos: [
      "Recibimos los datos de inscripción o resultado de prueba de nivel",
      "Asignamos al alumno al grupo disponible más adecuado",
      "Enviamos bienvenida al alumno y aviso al profesor del grupo"
    ],
    personalizacion: "Personaliza el criterio de asignación, el contenido del kit de bienvenida y los avisos al equipo docente.",
    related_processes: ["notificacion-cambios-cancelaciones-clase", "control-asistencia-alertas-faltas"],
    integration_domains: ["OTHER"],
    landing_slug: "academias"
  },
  {
    id: "RO25",
    codigo: "RO25",
    slug: "onboarding-empleado-entrenador",
    categoria: "D",
    categoriaNombre: "Gestión Interna",
    nombre: "Lista de tareas automática al incorporar a alguien nuevo al centro",
    tagline: "Experiencia premium desde el minuto 1.",
    recomendado: false,
    descripcionDetallada: "Checklist automático de onboarding: envío de documentación, acceso a herramientas, asignación de mentor y recordatorios de pasos pendientes.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Gestión Interna",
    nombre: "Organización automática de turnos e instructores para cubrir todas las clases",
    tagline: "Horarios sin conflictos y sin llamadas constantes.",
    recomendado: false,
    descripcionDetallada: "Los instructores informan disponibilidad vía formulario. El sistema cruza con la programación, detecta conflictos y notifica huecos sin cubrir.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Facturación y Finanzas",
    nombre: "Cobros automáticos mensuales y avisos cuando un pago falla",
    tagline: "Asegura tus ingresos sin perseguir recibos.",
    recomendado: true,
    descripcionDetallada: "Procesamiento automático de cobros. Si falla, el sistema reintenta a los 3 días, notifica al socio con link de pago y alerta a administración.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Facturación y Finanzas",
    nombre: "Aviso semanal de facturas de proveedores pendientes de pagar",
    tagline: "Control de gastos bajo control.",
    recomendado: false,
    descripcionDetallada: "Revisión semanal de facturas de proveedores (mantenimiento, suministros) y alerta al responsable con los vencimientos próximos.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    nombre: "Aviso automático a tus socios cuando se cancela o cambia una clase",
    tagline: "Avisa de imprevistos al instante y sin caos.",
    recomendado: true,
    descripcionDetallada: "Si se modifica o cancela una clase, el sistema notifica automáticamente a los socios con reserva, ofrece alternativas y actualiza el calendario público.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Facturación y Finanzas",
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    customization: {
      options_blocks: [
        { type: "select", label: "Tono Inicial", options: ["Amable", "Conciso"] },
        { type: "select", label: "Frecuencia", options: ["Semanal", "Diaria"] },
        { type: "select", label: "Canal Comunicación", options: ["WhatsApp", "Email", "SMS", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Quieres excluir a algún cliente VIP de este proceso?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Facturación y Finanzas",
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Facturación y Finanzas",
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Gestión Interna",
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Gestión Interna",
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Gestión Interna",
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Gestión Interna",
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Gestión Interna",
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
    categoriaNombre: "Gestión Interna",
    nombre: "Alta de nuevos clientes",
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
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
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
  {
    id: "CN1",
    codigo: "CN1",
    slug: "calificacion-inteligente-leads",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Selección automática de los clientes con más probabilidad de comprar",
    tagline: "Prioriza tus llamadas para contactar primero a quien realmente puede comprar hoy.",
    one_liner: "IA que puntúa y ordena tus leads automáticamente.",
    badges: ["Nuevo", "Popular"],
    benefits: [
      "Aumento del 30% en conversión comercial al llamar primero a leads calificados",
      "Ahorro de 15 horas semanales filtrando 'curiosos'",
      "Cierre más rápido al entender el perfil antes de llamar"
    ],
    recomendado: true,
    descripcionDetallada: "Sistema de IA que evalúa cada lead entrante según presupuesto estimado, capacidad de financiamiento, urgencia de compra, interacción con el proyecto y tipo de interés (inversión vs vivienda). Asigna una puntuación de prioridad y ordena automáticamente el embudo para que el agente llame primero a quien realmente puede comprar.",
    summary: {
      "what_it_is": "Un motor inteligente que analiza a cada interesado que entra y lo clasifica según su probabilidad de cierre.",
      "for_who": ["Directores comerciales", "Equipos de ventas en obra nueva", "Agentes inmobiliarios"],
      "requirements": ["CRM", "Herramienta de automatización"],
      "output": "Lead puntuado y ordenado en tu CRM."
    },
    indicators: {
      "time_estimate": "2-3 semanas",
      "complexity": "Alta",
      "integrations": ["CRM", "IA"]
    },
    how_it_works_steps: [
      { "title": "Captura y análisis", "short": "Se recibe el lead y se analiza su información.", "detail": "Extrae datos de formularios, chats y comportamiento web." },
      { "title": "Evaluación de IA", "short": "Calcula la probabilidad de compra real.", "detail": "Pondera interés, zona, presupuesto y perfil inversor." },
      { "title": "Asignación priorizada", "short": "Ordena el CRM para el agente.", "detail": "Coloca los leads más calientes al inicio de la lista de tareas." }
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Canal de alerta para leads Hot", "options": ["WhatsApp", "Telegram", "Email", "Ninguno"] }
      ],
      "free_text_placeholder": "¿Cuáles son las 3 variables más importantes para calificar un cliente en tu proyecto?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿Se conecta directo con mi CRM actual?", "a": "Sí, funciona sobre los CRMs más habituales usando sus APIs." },
      { "q": "¿Qué pasa con los leads de baja puntuación?", "a": "Se envían a una secuencia de maduración automática (nurturing) sin consumir tiempo del agente." }
    ],
    pasos: [
      "Se recibe el lead y se analiza su información.",
      "Calcula la probabilidad de compra real indicadora.",
      "Asigna y ordena según el interés para el agente de ventas."
    ],
    personalizacion: "Ajusta las variables determinantes (presupuesto, urgencia) que definirán quién es un 'lead caliente'.",
    related_processes: ["dashboard-comercial-tiempo-real", "seguimiento-multicanal-inteligente"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["CRM", "IA"],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion"
  },
  {
    id: "CN2",
    codigo: "CN2",
    slug: "analisis-sentimiento-riesgo",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Aviso automático cuando un cliente empieza a enfriarse",
    tagline: "Anticípate a las dudas de tu cliente y evita que se enfríe la venta.",
    one_liner: "IA que detecta dudas y entusiasmos en tus conversaciones.",
    badges: ["Avanzado"],
    benefits: [
      "Detección del 80% de objeciones no verbalizadas directamente",
      "Reducción del abandono telefónico en negociaciones clave",
      "Intervención rápida en menos de 24h ante inseguridades"
    ],
    recomendado: false,
    descripcionDetallada: "IA que analiza conversaciones de WhatsApp, emails, respuestas post-visita y transcripciones de llamadas para detectar patrones de entusiasmo, objeciones recurrentes, inseguridad o riesgo de abandono. Genera alertas automáticas y recomendaciones de acción para intervención temprana.",
    summary: {
      "what_it_is": "Auditor automático de conversaciones que lee entre líneas y alerta cuando una venta está a punto de caerse.",
      "for_who": ["Gerentes de ventas", "Coordinadoras comerciales"],
      "requirements": ["CRM", "Canal de comunicación integrado (Email/WhatsApp)"],
      "output": "Alertas de riesgo y recomendaciones claras en tu CRM."
    },
    indicators: {
      "time_estimate": "3-4 semanas",
      "complexity": "Alta",
      "integrations": ["CRM", "Comunicaciones", "IA"]
    },
    how_it_works_steps: [
      { "title": "Monitoreo constante", "short": "Supervisa los mensajes que envían los clientes.", "detail": "Conectado al email y WhatsApp oficial de la promotora." },
      { "title": "Análisis de contexto", "short": "Entiende el tono y detecta fricciones.", "detail": "Busca palabras clave de duda sobre pagos, plazos y competencia." },
      { "title": "Alerta predictiva", "short": "Avisa al comercial si hay peligro de fuga.", "detail": "Dispara un mensaje con el punto exacto de fricción y una sugerencia para calmarlo." }
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Canal de alerta", "options": ["Notificación CRM", "Email a gerencia", "Slack"] }
      ],
      "free_text_placeholder": "¿Cuáles son las mayores objeciones que sueles recibir y quieres detectar rápido?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿Es legal leer los WhatsApps?", "a": "Se implementa siempre respetando la política de privacidad que el cliente aceptó al contactar vía canales oficiales." },
      { "q": "¿Avisa de lo bueno también?", "a": "Sí, genera un reporte de 'entusiasmo' para saber cuándo empujar el cierre de venta de inmediato." }
    ],
    pasos: [
      "Supervisa los mensajes que envían los clientes.",
      "Entiende el tono y detecta fricciones.",
      "Avisa al comercial si hay peligro de fuga."
    ],
    personalizacion: "Define de qué canales de comunicación quieres extraer el sentimiento (email, WhatsApp, transcripciones).",
    related_processes: ["resumen-llamadas-crm", "calificacion-inteligente-leads"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["CRM", "IA", "WhatsApp"],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion"
  },
  {
    id: "CN3",
    codigo: "CN3",
    slug: "dashboard-comercial-tiempo-real",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Estado de todas tus ventas en un solo vistazo",
    tagline: "Ten el pulso exacto de tus promociones sin hacer una sola tabla dinámica.",
    one_liner: "Todos tus números de venta accesibles en una pantalla y sin esfuerzo.",
    badges: ["Esencial"],
    benefits: [
      "Identificación visual rápida del cuello de botella comercial",
      "Paso de reportería mensual manual a datos vivos 24/7",
      "Control de rendimiento individual del equipo comercial"
    ],
    recomendado: true,
    descripcionDetallada: "Panel automatizado que integra CRM, visitas y reservas para mostrar conversión por agente, tiempo promedio de cierre, motivos de pérdida, unidades con bajo rendimiento y evolución mensual del embudo.",
    summary: {
      "what_it_is": "Pantalla de control automatizada que cruza datos desde visitas hasta reservas, mostrando métricas críticas.",
      "for_who": ["Dirección comercial", "Director de Proyecto", "CEOs"],
      "requirements": ["CRM", "Herramienta de Business Intelligence (BI)"],
      "output": "Dashboard en tiempo real con datos de conversión."
    },
    indicators: {
      "time_estimate": "2 semanas",
      "complexity": "Media",
      "integrations": ["CRM", "BI"]
    },
    how_it_works_steps: [
      { "title": "Extracción continua", "short": "Saca datos diarios del CRM.", "detail": "Captura automáticamente el cambio de estados en el pipeline cada mañana." },
      { "title": "Consolidación de KPIS", "short": "Calcula los porcentajes críticos.", "detail": "Pondera visitas a reservas, tiempos medios y cuotas por agente." },
      { "title": "Visualización viva", "short": "Te muestra los gráficos actualizados.", "detail": "El panel te presenta los gráficos siempre listos, ideal para la reunión de los lunes." }
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Frecuencia de envío automático por mail", options: ["Todos los viernes", "Lunes por la mañana", "Sólo consultar online"] }
      ],
      "free_text_placeholder": "¿Hay alguna métrica fuera de lo común que necesites que pintemos en pantalla?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿Reemplaza los informes del CRM?", "a": "Los potencia. Los CRMs son limitados en visualización; nosotros cruzamos hasta con plataformas de gestión de reservas externas." },
      { "q": "¿Podré ver qué fase está frenando ventas?", "a": "Totalmente, verás el embudo entero y su porcentaje de caída fase a fase." }
    ],
    pasos: [
      "Saca datos diarios del CRM.",
      "Calcula los porcentajes críticos de negocio.",
      "Te muestra gráficos e indicadores actualizados continuamente."
    ],
    personalizacion: "Pídenos diseñar el flujo de tu embudo específico para que el gráfico encaje al 100% con tu realidad comercial.",
    related_processes: ["calificacion-inteligente-leads", "identificacion-reactivacion-unidades"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["CRM", "BI"],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion"
  },
  {
    id: "CN4",
    codigo: "CN4",
    slug: "asistente-digital-precualificacion",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Asistente en tu web que atiende a los interesados en tu obra",
    tagline: "Educa y calienta a tu cliente en la web mientras tu equipo duerme.",
    one_liner: "Un experto virtual incansable que enamora al lead y lo prepara.",
    badges: ["Popular"],
    benefits: [
      "Atención de interesados 24 horas al día sin sumar nóminas",
      "Ahorro de horas en agentes explicando repetidamente las bondades base",
      "Leads llegan a comercial con presupuestos ya entendidos y aclarados"
    ],
    recomendado: true,
    descripcionDetallada: "Asistente digital guiado (no chatbot básico) que explica tipologías, aclara diferencias entre modelos, detalla formas de pago y responde dudas técnicas frecuentes. Educa al cliente antes del contacto humano para que los leads lleguen mejor preparados al agente.",
    summary: {
      "what_it_is": "Un experto en IA alojado en tu landing page o WhatsApp, cargado con el argumentario de tu promoción.",
      "for_who": ["Visitantes de perfil frío", "Marketing inmobiliario"],
      "requirements": ["Página Web / WhatsApp", "Base de conocimiento del proyecto"],
      "output": "Conversación de alto valor y ficha de lead cualificado al CRM."
    },
    indicators: {
      "time_estimate": "2-3 semanas",
      "complexity": "Alta",
      "integrations": ["Web", "CRM", "IA"]
    },
    how_it_works_steps: [
      { "title": "Bienvenida interactiva", "short": "Aborda al usuario con preguntas clave.", "detail": "Pregunta sutilmente: ¿Buscas comprar para vivir o invertir?" },
      { "title": "Educación de proyecto", "short": "Resuelve las preguntas comunes.", "detail": "Enseña el proyecto y aclara tipologías de piso o chalet." },
      { "title": "Pase a comercial", "short": "Pide el contacto sólo cuando hay interés maduro.", "detail": "Cierra enviando al CRM todo el historial para que el comercial remate." }
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Tono de la IA", "options": ["Elegante y formal", "Cercano y entusiasta", "Eminentemente técnico (para inversores)"] }
      ],
      "free_text_placeholder": "¿Cuál es la Memoria de Calidades o dossier principal del proyecto?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿La gente hablará con un robot?", "a": "Este asistente de IA es tan orgánico y fluido que genera alto engagement por su rapidez y calidad." },
      { "q": "¿Sabe redirigir a un humano?", "a": "Por supuesto. Si el cliente tiene urgencia alta, desvía a WhatsApp u ofrece agendar reunión." }
    ],
    pasos: [
      "Aborda al usuario con preguntas de situación.",
      "Muestra y defiende el proyecto como tu mejor comercial.",
      "Traspasa un lead cualificado a tu equipo y registra la charla en CRM."
    ],
    personalizacion: "Elige la base de conocimiento de la obra: le daremos a leer todos tus PDFs para que aprenda el proyecto perfecto.",
    related_processes: ["calificacion-inteligente-leads", "seguimiento-multicanal-inteligente"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["Web", "CRM", "WhatsApp"],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion"
  },
  {
    id: "CN5",
    codigo: "CN5",
    slug: "motor-presentacion-perfil",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Presentación comercial adaptada automáticamente a cada cliente",
    tagline: "Véndele lujo al inversor y familia a los jóvenes, sin fabricar 100 PowerPoints distintos.",
    one_liner: "Crea la oferta perfecta que resuena con cada tipo de comprador.",
    badges: ["Nuevo"],
    benefits: [
      "Tasa de apertura de dossieres un 45% mayor",
      "Reducción a cero de envíos genéricos irrelevantes",
      "El agente ahorra minutos de buscar y adjuntar PDFs para cada email"
    ],
    recomendado: false,
    descripcionDetallada: "Sistema que adapta automáticamente la narrativa comercial según el perfil detectado del lead (inversor, familia, pareja joven). Automatiza PDFs, correos, mensajes de seguimiento y argumentos comerciales personalizados.",
    summary: {
      "what_it_is": "Generador de contenidos automáticos que ensambla la información más atractiva del proyecto según lo que el cliente quiere oír.",
      "for_who": ["Comerciales de promociones", "Departamentos de Marketing"],
      "requirements": ["CRM", "Generador de PDFs dinámicos"],
      "output": "Dossier o Email hiper-personalizado directo para enviar."
    },
    indicators: {
      "time_estimate": "3 semanas",
      "complexity": "Alta",
      "integrations": ["CRM", "PDF Automation"]
    },
    how_it_works_steps: [
      { "title": "Detección de etiqueta", "short": "Saca el perfil (Inversor/Familia) del CRM.", "detail": "Revisamos el tag indicado por el asistente web o el comercial." },
      { "title": "Ensamblaje", "short": "Combina los bloques ganadores.", "detail": "Une las fotos del parque (familia) o del ROI y plusvalía de la zona (inversión)." },
      { "title": "Generación de salida", "short": "Entrega un documento o email brillante.", "detail": "Crea el contacto con el cliente aportando el ángulo comercial imbatible." }
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Salida principal", "options": ["PDF Dinámico", "Cadena de Emails", "Microsite personalizado"] }
      ],
      "free_text_placeholder": "¿Cuántos perfiles distintos de comprador tienes ya detectados?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿Debemos grabar varios vídeos y PDFs?", "a": "Sí, creamos bloques. Luego el sistema los combina todos solos como un rompecabezas." },
      { "q": "¿Envia el PDF sin que yo lo vea?", "a": "Puede hacerlo o dejarlo en borrador en tu bandeja de salida para que lo remates." }
    ],
    pasos: [
      "Identifica el perfil y necesidad desde tu CRM.",
      "Arma el puzzle automático de textos, imágenes y argumentos.",
      "Envía la documentación más alineada a convertir esa venta."
    ],
    personalizacion: "Define de antemano el mix de beneficios que quieres atar a cada perfil (Rentabilidad vs Calidad de vida).",
    related_processes: ["generador-dossier-unidad", "asistente-digital-precualificacion"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["CRM", "PDF Factory"],
    integration_domains: ["CRM", "DOCS"],
    landing_slug: "construccion"
  },
  {
    id: "CN6",
    codigo: "CN6",
    slug: "generador-dossier-unidad",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Ficha de vivienda generada automáticamente en segundos",
    tagline: "Envía la ficha exacta en un clic: se acabó buscar planos sueltos en carpetas.",
    one_liner: "Empaqueta plano, precio y memoria de calidades de una unidad en 3 segundos.",
    badges: ["Recomendado"],
    benefits: [
      "Eliminación de envíos erróneos con precios desactualizados",
      "El agente gana 2 horas semanales que perdía buscando anexos y renders",
      "Impacto ultra-profesional inmediato en el cliente"
    ],
    recomendado: true,
    descripcionDetallada: "Al seleccionar una unidad, el sistema genera automáticamente un dossier con plano exacto, precio actualizado, condiciones de pago, fecha estimada de entrega y extras incluidos. Elimina la búsqueda manual del agente y reduce retrasos y errores.",
    summary: {
      "what_it_is": "Creador de fichas comerciales en base de datos. Un clic, un PDF perfecto.",
      "for_who": ["Comerciales a pie de obra", "Backoffice comercial"],
      "requirements": ["CRM o ERP Inmobiliario", "Plantilla base"],
      "output": "Ficha comercial PDF única para esa vivienda enviada al lead."
    },
    indicators: {
      "time_estimate": "2 semanas",
      "complexity": "Media",
      "integrations": ["CRM", "DOCS"]
    },
    how_it_works_steps: [
      { "title": "Identificador de unidad", "short": "Eliges el bajo B del bloque 3.", "detail": "Desde tu CRM o app de ventas, marcas la vivienda de interés." },
      { "title": "Autocompletado", "short": "Saca planos vivos y precio vigente.", "detail": "Conecta con tu base de precios para que no haya riesgo de error comercial." },
      { "title": "Envío en un toque", "short": "Se fusiona en PDF y se envía.", "detail": "El cliente lo recibe impecable, sellado por la promotora." }
    ],
    customization: {
      "options_blocks": [
        { "type": "radio", "label": "Marca de agua", "options": ["Incluir nombre cliente en PDF", "No incluir"] }
      ],
      "free_text_placeholder": "¿Qué datos técnicos deben ir siempre obligatorios (m2 útiles, terraza, orientación)?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿Reemplaza los folletos?", "a": "Es el sustituto digital, hiperpreciso y siempre actualizado en precio." },
      { "q": "¿Puede el comercial modificar el precio?", "a": "Solo si tiene permisos en el CRM, el generador coge la fuente de verdad del ERP." }
    ],
    pasos: [
      "Eliges la unidad exacta desde tu app o CRM.",
      "Conecta con bases de precios y saca planos y datos vivos.",
      "Se crea un PDF oficial y se envía en pocos segundos."
    ],
    personalizacion: "Incluye el nombre de tu cliente en cada página para darle exclusividad (y proteger tus planos).",
    related_processes: ["motor-presentacion-perfil", "resumen-llamadas-crm"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["CRM", "DOCS"],
    integration_domains: ["CRM", "DOCS"],
    landing_slug: "construccion"
  },
  {
    id: "CN7",
    codigo: "CN7",
    slug: "resumen-llamadas-crm",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Resumen automático de cada llamada con el cliente",
    tagline: "Registra en tu CRM todo lo que el cliente te contó sin volver a teclear una palabra.",
    one_liner: "IA que transcribe, resume y vuelca a tu CRM post-llamada.",
    badges: ["Popular"],
    benefits: [
      "Calidad de datos en CRM perfecta, sin resúmenes vagos de 'cliente interesado'",
      "El comercial vende, no hace horas de data-entry aburrido",
      "No se olvidan detalles clave como 'me urge para este verano'"
    ],
    recomendado: true,
    descripcionDetallada: "IA que transcribe llamadas, resume los puntos clave, detecta objeciones y actualiza el CRM automáticamente. Evita que el agente tenga que registrar manualmente después de cada llamada.",
    summary: {
      "what_it_is": "Asistente secreto en cada llamada telefónica que capta la información clave y la sube al sistema de gestión de clientes.",
      "for_who": ["Directores comerciales", "Fuerza de ventas"],
      "requirements": ["Telefonía VOIP", "CRM", "IA"],
      "output": "Ficha del CRM con notas completas, presupuesto y objeciones rellenas."
    },
    indicators: {
      "time_estimate": "2-3 semanas",
      "complexity": "Alta",
      "integrations": ["CRM", "Telefonía", "IA"]
    },
    how_it_works_steps: [
      { "title": "Escucha pasiva", "short": "Graba mediante tu centralita.", "detail": "Se conecta a llamadas salientes y entrantes del número oficial (con aviso legal)." },
      { "title": "Extracción semántica", "short": "Anota fechas, precios y pegas.", "detail": "Distingue cuándo el cliente dice 'me parece caro' o 'necesitamos piscina'." },
      { "title": "Volcado mágico", "short": "Tu CRM se rellena solo.", detail: "Aparecen las notas estructuradas en el campo del interesado al colgar." }
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Formato de resumen", "options": ["Corto y directo", "Transcripción completa", "Campos estructurados en CRM (ej: Presupuesto)"] }
      ],
      "free_text_placeholder": "¿Cuáles son las 4 cosas obligatorias que siempre hay que preguntarle al cliente?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿Funciona en español y en calle?", "a": "Entiende argot, modismos e incluso varios idiomas perfectamente." },
      { "q": "¿Es legal?", "a": "Claro, como cuando escuchas 'esta llamada puede ser grabada para mejorar la calidad', se graba y procesa acorde a RGPD." }
    ],
    pasos: [
      "Graba mediante tu centralita o VOIP conectada.",
      "Anota fechas, precios, pegas y puntos clave hablados.",
      "Vuelca las notas estructuradas en el CRM nada más colgar."
    ],
    personalizacion: "Define qué campos del CRM se rellenarán automáticamente con lo interpretado en las notas (Ej. Campo Presupuesto).",
    related_processes: ["analisis-sentimiento-riesgo", "calificacion-inteligente-leads"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["CRM", "IA", "Telefonía"],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion"
  },
  {
    id: "CN8",
    codigo: "CN8",
    slug: "asistente-interno-comerciales",
    categoria: "D",
    categoriaNombre: "Gestión Interna",
    nombre: "Asistente interno para agentes comerciales",
    tagline: "Todo el argumentario de la promoción en el bolsillo de cada asesor.",
    one_liner: "Un co-piloto del proyecto exclusivo para tu equipo de ventas.",
    badges: ["Nuevo"],
    benefits: [
      "Capacitación de nuevos comerciales al proyecto en horas",
      "Reducción total a llamadas al jefe de obra preguntando detalles técnicos",
      "Discurso unificado y coherente hacia el cliente de toda la plantilla"
    ],
    recomendado: false,
    descripcionDetallada: "Asistente interno que permite a los agentes consultar objeciones frecuentes, argumentos por tipología, detalles técnicos del proyecto y comparativas internas. Aumenta la autonomía del equipo y estandariza el discurso comercial.",
    summary: {
      "what_it_is": "Tu base de datos convertida en un chat de WhatsApp/Slack interno, listo para salvar cualquier pregunta difícil de un cliente al instante.",
      "for_who": ["Equipo de ventas", "Apertura de pisos piloto", "Coordinadoras comerciales"],
      "requirements": ["Chat Interno", "Documentación del proyecto completa"],
      "output": "Respuesta al instante y precisa en lenguaje natural."
    },
    indicators: {
      "time_estimate": "2 semanas",
      "complexity": "Media",
      "integrations": ["Chat", "Knowledge Base", "IA"]
    },
    how_it_works_steps: [
      { "title": "Entran los manuales", "short": "Leemos planos, memorias y argumentarios.", "detail": "Cargamos al bot con todos los FAQs, ventajas competitivas y excusas de la competencia." },
      { "title": "El agente consulta", "short": "Pregunta desde su propio Slack o WhatsApp.", "detail": "El comercial frente al cliente duda: ¿Qué espesor lleva la carpintería exterior?" },
      { "title": "Respuesta experta", "short": "El bot da la métrica perfecta.", "detail": "Contesta y le da el manual de donde sacó la información." }
    ],
    customization: {
      "options_blocks": [
        { "type": "radio", "label": "Canal interno preferido", "options": ["WhatsApp de equipo", "Microsoft Teams", "Slack", "Intranet web"] }
      ],
      "free_text_placeholder": "¿Tienen un manual ya hecho de 'Técnicas de rebote a objeciones'?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿Y si la promotora cambia la memoria de calidades?", "a": "Subes el nuevo PDF y el asistente borra la información antigua de inmediato." }
    ],
    pasos: [
      "Cargamos al bot con la documentación, técnica o comercial de la obra.",
      "El agente consulta una objeción por chat rápido (ej. '¿Qué digo si les parece caro?').",
      "El bot contesta al momento y dándole la mejor estrategia argumental."
    ],
    personalizacion: "Cárgalo no sólo de datos aburridos, sino de 'Técnicas de rebote a objeciones' para empoderar de verdad al agente.",
    related_processes: ["generador-dossier-unidad", "resumen-llamadas-crm"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["Chat", "Knowledge Base", "IA"],
    integration_domains: ["OTHER"],
  },
  {
    id: "CN9",
    codigo: "CN9",
    slug: "seguimiento-multicanal-inteligente",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Seguimiento automático a los interesados mientras dura la obra",
    tagline: "Mantén viva la llama por meses automatizando avances de tu obra sin parecer un robot.",
    one_liner: "Secuenciador de contactos que resucita y mantiene el interés hasta el cierre.",
    badges: ["Esencial"],
    benefits: [
      "Se detiene la pérdida de leads por 'enfriamiento' temporal",
      "Aumento en tasas de respuesta a comunicaciones a largo plazo superior al 55%",
      "Crea vínculo emocional cliente-obra mientras se levanta la estructura"
    ],
    recomendado: true,
    descripcionDetallada: "Sistema que mantiene el lead activo durante meses enviando avances de obra, hitos importantes y mensajes personalizados según etapa del embudo. Integra email, WhatsApp y recordatorios programados. Reactiva leads inactivos de forma contextual, no masiva.",
    summary: {
      "what_it_is": "Nutrición pausada para ventas largas. Manda el dron, avisa de la fundación y recuerda beneficios, espaciado con inteligencia.",
      "for_who": ["Marketing Inmobiliario", "Equipos de ventas en ciclo largo"],
      "requirements": ["CRM", "Email Marketing / WhatsApp API"],
      "output": "Campañas distribuidas que envían el mensaje idóneo según la semana en que entraron."
    },
    indicators: {
      "time_estimate": "2-3 semanas",
      "complexity": "Media",
      "integrations": ["CRM", "Mailing / WhatsApp"]
    },
    how_it_works_steps: [
      { "title": "Arquitectura temporal", "short": "Diseña el flujo del año de comercialización.", "detail": "Fijamos puntos de contacto en los meses críticos donde decae el recuerdo." },
      { "title": "Disparos cruzados", "short": "Combina email visual con WhatsApp rápido.", "detail": "Un mes un email bonito del piso piloto, otro mes un WhatsApp directo del agente sobre un descuento." },
      { "title": "Alerta de reactivación", "short": "Avisa al agente si muerden el anzuelo.", "detail": "Si clican el vídeo o contestan algo, entra a la bandeja del comercial de nuevo." }
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Mix de Canales", "options": ["80% Email / 20% WhatsApp", "50% Email / 50% SMS/WhatsApp"] }
      ],
      "free_text_placeholder": "¿Cuáles son los 3 hitos de obra que más alucinan a los compradores?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿No será muy pesado (spam)?", "a": "No, la IA segmenta y espacia los mensajes según la reacción y tipo de lead; puro contexto." }
    ],
    pasos: [
      "Diseña la secuencia ligada a fechas clave de avance de proyecto y marketing.",
      "Cruzan campañas multicanal con fotos o vídeos de dron.",
      "Notifica al agente comercial la reactivación si el lead responde a algo."
    ],
    personalizacion: "Define cómo calibrar los mensajes, más agresivos o más sutiles según la etapa y el termómetro comercial.",
    related_processes: ["identificacion-reactivacion-unidades", "calificacion-inteligente-leads"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["CRM", "Mailing / WhatsApp"],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion"
  },
  {
    id: "CN10",
    codigo: "CN10",
    slug: "automatizacion-agendado-visitas",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Gestión automática de visitas con recordatorios incluidos",
    tagline: "Acaba con el cruce de mails para quedar en el piso piloto.",
    one_liner: "Calendario magnético que cierra citas directas y asegura que acudan.",
    badges: ["Popular"],
    benefits: [
      "Caída drástica de los 'No-Shows' (las ausencias en citas de venta)",
      "Reducción a cero horas semanales dedicadas to reagendar visitas canceladas",
      "El cliente elige a solas bajo su demanda al momento de máximo interés"
    ],
    recomendado: true,
    descripcionDetallada: "Flujo automatizado completo: lead calificado → enlace de agenda → confirmación → recordatorios automáticos → check-in → encuesta post-visita. Reduce no-shows y optimiza el tiempo del agente.",
    summary: {
      "what_it_is": "Asistente satélite enlazado a los calendarios de los comerciales, facilitando la reserva de horas y enviando recordatorios al cliente para asegurar su presencia.",
      "for_who": ["Visitantes de piso piloto", "Coordinadores de venta", "Todos los comerciales"],
      "requirements": ["Calendario tipo Calendly", "CRM", "WhatsApp SMS"],
      "output": "Cita bloqueada firme con doble alerta antes de llegar la fecha."
    },
    indicators: {
      "time_estimate": "1-2 semanas",
      "complexity": "Baja",
      "integrations": ["Agenda", "CRM", "Herramienta de automatización"]
    },
    how_it_works_steps: [
      { "title": "Reserva libre", "short": "Botón para agenda en web o correo directo.", "detail": "Muestra huecos en vivo con la disponibilidad rotativa y real." },
      { "title": "Bloqueo cruzado", "short": "Inscribe en CRM y en agenda del equipo.", "detail": "Asigna vendedor y bloquea una hora de su Google/Outlook Calendar." },
      { "title": "Garantía de asistencia", "short": "Doble recordatorio por WhatsApp con el pin GPS.", "detail": "La víspera o misma mañana avisa y facilita cómo llegar." }
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Tiempos de aviso", "options": ["24h antes y 2h antes", "48h antes SMS, mañana email", "Tu vía de comunicación preferida"] }
      ],
      "free_text_placeholder": "¿Cuántos huecos simultáneos caben en el piso piloto?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿Pisa citas si el agente apunta algo manual?", "a": "Imposible, tiene sincronización bidireccional en el microsegundo." }
    ],
    pasos: [
      "El usuario reserva y se bloquea el espacio en el calendario vendedor.",
      "Queda asignado y documentado sobre su ficha en el CRM al instante.",
      "Se le envían mensajes con ruta Maps el día previo a su cita."
    ],
    personalizacion: "Incluye las instrucciones de parqueo exactas o fotos de la entrada en los avisos preventivos para evitar la fricción.",
    related_processes: ["seguimiento-post-visita", "asistente-digital-precualificacion"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["Agenda", "CRM", "WhatsApp SMS"],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion"
  },
  {
    id: "CN11",
    codigo: "CN11",
    slug: "seguimiento-post-visita",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Seguimiento automático tras cada visita a tu obra o piso piloto",
    tagline: "Saca a la luz si la visita fue un éxito o si el cliente no dio buen feedback en el showflat.",
    one_liner: "El empujón digital post-reunión para recuperar indecisos y cerrar.",
    badges: ["Nuevo"],
    benefits: [
      "25% más de rescate de posibles clientes que se iban por dudas dudosas omitidas",
      "Termómetro real del rendimiento presencial de cada comercial comercial de zona",
      "Automatización plena de la tarea de cierre que más suele olvidarse o postergar"
    ],
    recomendado: false,
    descripcionDetallada: "Sistema que tras cada visita envía encuesta automática, detecta nivel de interés, activa seguimiento personalizado según respuesta y comparte material adicional relevante. Estandariza el proceso y recupera indecisos.",
    summary: {
      "what_it_is": "Evaluador y nutridor digital que contacta al cliente al terminar su visita para amarrar la reserva o conocer la razón del 'no'.",
      "for_who": ["Visitantes al piloto", "Dirección General"],
      "requirements": ["CRM", "Plataforma de Encuestas rápidas"],
      "output": "Estado de ánimo del interesado adjunto a la ficha en CRM y activación de envíos extras condicionados."
    },
    indicators: {
      "time_estimate": "1-2 semanas",
      "complexity": "Media",
      "integrations": ["CRM", "Surveys"]
    },
    how_it_works_steps: [
      { "title": "Detonador de fin de cita", "short": "Al marcar 'visitado' en CRM se inicia el reloj.", "detail": "Pasadas X horas, envía un gracias y un breve test o cuestionario." },
      { "title": "Respuesta de temperatura", "short": "Categoriza según el feedback logrado.", "detail": "Lo clasifica si dice 'me encantan calidades' o 'no tienen luz natural' y lo vuleca al comercial urgente." },
      { "title": "Aporte extra de valor", "short": "Manda folletos extra si los pidió, adjunto al momento.", "detail": "Contesta enviando el dossier de acabados o el plano de garajes que quizás no vió." }
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Tono de la Encuesta", "options": ["1 a 5 Estrellas rápida", "Dos preguntas abiertas sobre dudas extra", "Combinado"] }
      ],
      "free_text_placeholder": "¿Cuántas horas clave deben pasar desde la salida para mandar el primer choque comercial?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿Y si no lo rellenan?", "a": "Quedan marcados para un impacto de la secuencia multicanal y una llamada humana antes de darse por fríos." }
    ],
    pasos: [
      "Inicia enviando un cuestionario en el momento justo al salir la visita o horas posterior.",
      "Categoriza si la experiencia fue excelente o generó ciertas reservas técnicas por resolver.",
      "Alimenta de nuevo al CRM e instruye al agente qué dudas rebatir en la siguiente llamada al día siguiente."
    ],
    personalizacion: "Define el momento y qué incentivo puedes dar por la encuesta (el regalo de 'los planos detallados en HD' a su correo si rellenan).",
    related_processes: ["automatizacion-agendado-visitas", "seguimiento-multicanal-inteligente"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["CRM", "Surveys"],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion"
  },
  {
    id: "CN12",
    codigo: "CN12",
    slug: "automatizacion-contratos-firma",
    categoria: "D",
    categoriaNombre: "Gestión Interna",
    nombre: "Contratos generados y enviados a firmar desde el móvil",
    tagline: "El fin definitivo al papelazo que atranca tus ventas ya cerradas.",
    one_liner: "De la reserva a la firma vinculante sin imprimir un solo folio.",
    badges: ["Esencial", "Popular"],
    benefits: [
      "Tiempo de emisión de contratos reducido en un 95%",
      "Cumplimiento 100% legal de reservas inmediatas, no enfriando al prospecto",
      "Seguimiento visual del estado de firma de todos los intervinientes"
    ],
    recomendado: true,
    descripcionDetallada: "Sistema que automatiza la generación de contratos, anexos y propuestas, gestiona el versionado, envía los documentos para firma digital y hace seguimiento del estado de cada documento. Reduce fricción operativa y acelera los cierres.",
    summary: {
      "what_it_is": "Un motor técnico que absorbe la oferta cerrada en tu CRM y vomita el contrato sellado jurídicamente en el móvil de tu cliente en minutos.",
      "for_who": ["Admnistración inmobiliaria", "Dirección operativa", "Compradores"],
      "requirements": ["CRM", "Software de Firma Digital Certificada"],
      "output": "Documentos legales firmados y archivadps digitalmente."
    },
    indicators: {
      "time_estimate": "3 semanas",
      "complexity": "Alta",
      "integrations": ["CRM", "DOCS", "Firma Digital"]
    },
    how_it_works_steps: [
      { "title": "Generación del contrato", "short": "Un clic al confirmar la venta.", "detail": "Extraemos todos los apellidos, DNI y precio pactado al contrato maestro." },
      { "title": "Firma certificada móvil", "short": "Notifica para firma al instante.", "detail": "Les envía por SMS/Email un visualizador legal para la rúbrica dactilar del documento." },
      { "title": "Sellado y archivado", "short": "Se guarda en tu base y su correo.", "detail": "El PDF queda securizado y se autoguarda en el repositorio corporativo del cliente sin fallar uno." }
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Sistema de firma", "options": ["Avanzada OTP por SMS", "Firma biométrica", "Notarial en siguiente fase"] }
      ],
      "free_text_placeholder": "¿Cuántos intervinientes promedio (titulares y co-titulares o avalistas) tienen los borradores?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿La firma es totalmente legal para una reserva/contrato de arras?", "a": "100%, utiliza proveedores homologados europeos (tipo DocuSign o Signaturit) con trazabilidad plena ante un juez." }
    ],
    pasos: [
      "Inyectamos datos de DNI y precio cerrado con el comercial en la plantilla legal oficial de la gestora.",
      "Lanzamos secuencia de rúbrica en en su móvil con certificado de hora/IP.",
      "Devolvemos el archivo firmado a la promotora listos para facturación y elevación a público posterior."
    ],
    personalizacion: "Nos amoldamos a vuestras plantillas blindadas de la propiedad, respetando todos y cada uno de los anexos (memoria, SEPA, RGPD).",
    related_processes: ["proceso-post-reserva", "resumen-llamadas-crm"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["CRM", "DOCS", "Firma Digital"],
    integration_domains: ["CRM", "DOCS"],
    landing_slug: "construccion"
  },
  {
    id: "CN13",
    codigo: "CN13",
    slug: "proceso-post-reserva",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Todo lo pendiente tras una reserva, gestionado automáticamente",
    tagline: "El momento tras pagar es el más frágil de un comprador: no le dejes solo con su incertidumbre.",
    one_liner: "Flujo de tranquilidad que guía la entrega de recibos y avales durante meses.",
    badges: ["Nuevo"],
    benefits: [
      "Cancelaciones de reservas se hunden al generar confianza inmediata en el proceso técnico",
      "La carga administrativa de pedir el 'envíame por favor los recibos' cae drásticamente",
      "Mejora notable del Net Promoter Score y futuras prescipciones de nuevos vecinos"
    ],
    recomendado: false,
    descripcionDetallada: "Flujo estructurado que tras la reserva marca hitos, solicita documentos automáticamente, comunica avances al comprador y reduce la incertidumbre. Disminuye cancelaciones y mejora la experiencia post-venta.",
    summary: {
      "what_it_is": "Asistente documental interactivo que va empujando burocráticamente de la mano al cliente comprador a medida que el proyecto quema etapas.",
      "for_who": ["Backoffice tramitador", "Compradores en espera de obra"],
      "requirements": ["CRM", "Herramienta de automatización", "Mailing"],
      "output": "Documentación lista e historial de comunicaciones tranquilo sin saltos en el abandono."
    },
    indicators: {
      "time_estimate": "2-3 semanas",
      "complexity": "Media",
      "integrations": ["CRM", "Files", "Automatización"]
    },
    how_it_works_steps: [
      { "title": "Desbloqueo post-firma", "short": "Entra al flujo de 'propietario'.", "detail": "Al firmarse el primer depósito (arras), el CRM los etiqueta como 'en pipeline pre-entrega'." },
      { "title": "Petición amigable de Info", "short": "Bot pide por ti KYC o Sepas.", "detail": "Sigue un goteo automatizado pidiendo DNIS en vigor, recibos del banco o avales a depositar." },
      { "title": "Avance de obra en video", "short": "Alimenta su ilusión de vez en mes.", "detail": "Mete vídeos cortos de los cimientos en sus buzones para evitar remordimiento del comprador ansioso." }
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Cadencia de peticiones", "options": ["Agresiva (1 semana todo documentado)", "Gradual mensual de entregas"] }
      ],
      "free_text_placeholder": "¿Cuántos documentos solicitan a sus clientes tras la primera reserva?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿Es un área privada o va por email?", "a": "Puede configurarse via simple email / WhatsApp sin fricción o como pequeño portal web del interesado." }
    ],
    pasos: [
      "Detectamos que el cliente entra en fase de depósito en banco/firma.",
      "Bot pde por él KYC de capital y domiciliaciones según lo planificado.",
      "Mantenemos ilusión latente enviando informes de construcción por trimestres al ser contactados."
    ],
    personalizacion: "Incorporen encuestas post-reserva de materiales a la carta sin que su backoffice mueva un dedo para gestionar listados en excels.",
    related_processes: ["automatizacion-contratos-firma", "portal-propietarios-post-entrega"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["CRM", "Automatización"],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion"
  },
  {
    id: "CN14",
    codigo: "CN14",
    slug: "portal-propietarios-post-entrega",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Espacio para que los propietarios reporten problemas tras la entrega",
    tagline: "Evita que un grifo suelto hunda tu reputación corporativa bloqueando tus teléfonos.",
    one_liner: "Incidencias gestionadas rápido, garantías atendidas y reviews blindadas.",
    badges: ["Avanzado"],
    benefits: [
      "Filtrado inicial automático resuelve un 40% de dudas 'por favor leer el manual electrodoméstico'",
      "El equipo post-venta de garantía técnica ahorra infinidad de tiempo de ir a mirar",
      "Reducción de quejas de ruido online para proteger futuras promociones."
    ],
    recomendado: false,
    descripcionDetallada: "Portal que permite consultas de mantenimiento, seguimiento de garantías, recordatorios automáticos y soporte inicial mediante asistente IA. Incluye predicción de posibles incidencias. Reduce soporte manual y mejora la reputación de la desarrolladora.",
    summary: {
      "what_it_is": "Cuartel general post-firma. Los propietarios con quejas hablan con una IA entrenada y abren su ticket fácilmente documentando con fotos.",
      "for_who": ["Departamento Post-venta", "Propietarios ya entregados", "Administradores Fincas"],
      "requirements": ["Portal Web app", "Ticketing System", "IA Bot"],
      "output": "Fichas de incidencia de las viviendas listas para enviar al constructor técnico, ya filtradas."
    },
    indicators: {
      "time_estimate": "4 semanas",
      "complexity": "Alta",
      "integrations": ["Portal Web", "Ticketing", "IA"]
    },
    how_it_works_steps: [
      { "title": "Acceso Exclusivo Casa", "short": "Se loguea con sus credenciales seguras.", "detail": "Entra a la interfaz de su propia casa con los datos de las instalaciones." },
      { "title": "El Bot de mantenimiento", "short": "IA diagnostica los problemas primero.", "detail": "Pregunta: 'Me hace ruido la calefacción'. El IA dice: 'Asegúrese de purgar radiador X con la llave Y así'." },
      { "title": "Ticket formal", "short": "Sube foto y a cola de trabajo de los operarios de obra.", "detail": "Si es daño real, exige fotos, lo cataloga (Ej: Electricidad/Fontanería) y escala al encargado de repasos post-obra en 2 segundos." }
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Triage previo", "options": ["IA intenta resolver con manuales al 100%", "Solo catalogar y abrir tickets manuales a humanos"] }
      ],
      "free_text_placeholder": "¿Garantía dividida por plazos? (1 mes pequeños repasos acabados, 3 años defectos visuales, etc?)"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿Se puede linkar con gremios externos subcontratados?", "a": "Absolutamente, en ruta automáticamente las incidencias graves de la bomba de calor a su propia marca subcontratista." }
    ],
    pasos: [
      "El usuario informa problema a bot o formulario de su piso.",
      "El sistema pide adjuntar evidencia e intenta apagar queja menor dando una guía de mantenimiento en el manual web subido.",
      "Vuelca la orden estructurada al ERP del constructor / encargado."
    ],
    personalizacion: "Integra manuales de la aerotermia y el termostato a la inteligencia de la app para que te reboten el 90% de excusas de 'no funciona'.",
    related_processes: ["proceso-post-reserva", "resumen-llamadas-crm"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["Portal Web", "Ticketing", "IA"],
    integration_domains: ["OTHER", "COMMS"],
    landing_slug: "construccion"
  },
  {
    id: "CN15",
    codigo: "CN15",
    slug: "identificacion-reactivacion-unidades",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Detectar automáticamente las viviendas que no se venden y por qué",
    tagline: "Libera tu capital atrapado haciendo que las viviendas paradas brillen ante sus verdaderos compradores.",
    one_liner: "IA que desvela por qué el 4ºA no se vende y da claves para moverlo.",
    badges: ["Recomendado", "Popular"],
    benefits: [
      "Disminución drástica de los días promedio en mercado (DOM) de la cola mala",
      "Reducción de dependencia en rebajas agresivas de último minuto penalizando margen",
      "Activación de estrategias de marketing dirigidas guiadas por el perfil concreto del producto"
    ],
    recomendado: true,
    descripcionDetallada: "IA que analiza tiempo en mercado, número de visitas, interacciones digitales y comparación con competencia para detectar unidades que no avanzan. Genera recomendaciones estratégicas de ajuste de precio, cambio de narrativa o nuevo segmento objetivo.",
    summary: {
      "what_it_is": "Analista de stop-motion que examina pisos que nadie quiere y emite alertas para pivotar el marketing y sacarlas adelante o cambiar precios en automático.",
      "for_who": ["Comerciales de zonas", "Ventas general", "Fondos dueños de cartera"],
      "requirements": ["CRM", "Herramienta de Automatización", "Datos de Anuncios Mercado"],
      "output": "Fichas de acción y propuestas de rebaja/incentivo a dirección semanario."
    },
    indicators: {
      "time_estimate": "3 semanas",
      "complexity": "Alta",
      "integrations": ["CRM", "Market Data", "IA"]
    },
    how_it_works_steps: [
      { "title": "Rastreo inútiles", "short": "Suma días huecos de todos tus pisos.", "detail": "Vigila las 'ratios' de cuánta gente los visito vs reservas dadas." },
      { "title": "Diagnóstico AI", "short": "Halla 'falta de luz' vs exceso frente mercado de la zona.", "detail": "Revisa notas y detecta si es un problema de m2 percibidos de cocina, o si está simplemente 'fuera de mercado en rentabilidad %'." },
      { "title": "Plan de Choque", "short": "Vomita directriz al equipo de diseño.", "detail": "Sugiere: 'Hagan render nuevo amueblado de Home Staging a la vista este' o 'ofrezca garaje de regalo de serie a visitantes de Octubre'." }
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Métrica Core Alarmante", "options": ["Días en Mercado > X", "Visitas a un piso concreto superan Y y no se vende"] }
      ],
      "free_text_placeholder": "¿Cuántos meses sueles aguantar antes de aplicar rebaja táctica?"
    },
    demo: {
      video_url: "PENDING"
    },
    faqs: [
      { "q": "¿Se puede vincular los anuncios web directamente?", "a": "Claro, inyecta bajada de precios al portal de las unidades frías y mide los rebotes." }
    ],
    pasos: [
      "Cruzar base con KPIs para extraer el 'Piso Raro' que frena stock.",
      "Usar feedback en CRM para deducir qué obstáculo paraliza y no convence a la visita.",
      "Emite recomendaciones accionables a la gerencia (Bonus, Muebles o Baja %)."
    ],
    personalizacion: "Define cómo calibrar la rotación o en qué momento y con qué agresividad sugieren incentivar su venta priorizada a tus propios agentes.",
    related_processes: ["dashboard-comercial-tiempo-real", "seguimiento-multicanal-inteligente"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria", "Construcción & Reformas"],
    herramientas: ["CRM", "IA", "Market Data"],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion"
  },

  {
    id: "AG1",
    codigo: "AG1",
    slug: "recordatorio-horas-no-registradas",
    categoria: "A",
    categoriaNombre: "Facturación y Finanzas",
    nombre: "Recordatorio automático al equipo cuando hay horas sin registrar",
    tagline: "Si tu equipo factura por horas, cada hora sin registrar es dinero perdido.",
    recomendado: true,
    descripcionDetallada: "Al final de cada jornada, el sistema revisa qué miembros del equipo no han registrado horas en su herramienta de tracking (Glassy, Timely, Harvest...). Los que no han imputado nada reciben un recordatorio automático y personalizado por Slack o email. Si el patrón se repite varios días seguidos, el responsable recibe un aviso consolidado para actuar.",
    summary: {
      what_it_is: "Sistema de control de imputación horaria que detecta lagunas de registro y avisa al equipo antes de que el cierre de mes deje horas sin facturar.",
      for_who: ["CEOs de agencia", "Project Managers", "Responsables de facturación"],
      requirements: ["Herramienta de tracking de horas (Glassy, Timely, Harvest u otra)", "Canal de comunicación interna (Slack, email o Teams)"],
      output: "Recordatorio automático diario a quien no ha registrado horas + informe semanal al responsable con el histórico de lagunas por persona."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["Tracking de horas", "Comunicación interna"]
    },
    how_it_works_steps: [
      { title: "Consulta diaria de imputaciones", short: "Leemos quién ha registrado y quién no.", detail: "Cada día a la hora que definas, el sistema extrae de tu herramienta de tracking la lista de personas activas y comprueba si han registrado al menos X minutos ese día." },
      { title: "Filtrado de ausencias justificadas", short: "Excluimos vacaciones y días libres.", detail: "Si la persona tiene marcado un día de vacaciones, festivo o ausencia aprobada, el sistema la ignora y no envía el recordatorio." },
      { title: "Recordatorio personalizado", short: "Cada uno recibe su propio aviso.", detail: "El mensaje lleva el nombre de la persona, el día en cuestión y un enlace directo a su herramienta de registro para facilitar la acción inmediata." },
      { title: "Informe de reincidencia al manager", short: "El responsable ve el patrón.", detail: "Si alguien acumula 3 o más días sin registrar en la semana, el manager recibe un resumen agrupado para intervenir si es necesario." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Herramienta de tracking", options: ["Glassy", "Timely", "Harvest", "Toggl", "Clockify", "Otra"] },
        { type: "select", label: "Canal del recordatorio", options: ["Slack DM", "Email", "Teams", "WhatsApp"] },
        { type: "select", label: "Hora del aviso diario", options: ["17:00", "18:00", "19:00", "Personalizada"] },
        { type: "radio", label: "¿Informe semanal al manager?", options: ["Sí", "No"] }
      ],
      free_text_placeholder: "¿Hay perfiles del equipo que deben quedar excluidos del recordatorio (p.ej. freelances externos)?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Funciona con Glassy?", a: "Sí, Glassy tiene API y webhooks que permiten leer imputaciones en tiempo real. Es una de las integraciones más directas." },
      { q: "¿Qué pasa si alguien tiene un día de vacaciones?", a: "El sistema cruza el calendario de ausencias para no enviar recordatorios en días no laborables. Solo avisa cuando realmente hay horas que debieron imputarse." },
      { q: "¿Se puede configurar un mínimo de horas diarias?", a: "Sí, puedes definir el umbral: por ejemplo, avisar solo si la persona ha registrado menos de 4 horas en un día de trabajo completo." },
      { q: "¿El equipo ve quién ha recibido el aviso?", a: "No, cada aviso es un DM privado. Solo el manager recibe el informe consolidado de reincidencias." }
    ],
    pasos: [
      "Consultamos a diario las imputaciones de cada miembro del equipo en la herramienta de tracking",
      "Cruzamos con el calendario de ausencias para filtrar días no laborables",
      "Enviamos recordatorio personalizado a quienes no han registrado horas",
      "Generamos informe semanal para el manager con el histórico de lagunas"
    ],
    personalizacion: "Elige la herramienta de tracking, el canal del aviso, la hora del disparo diario y el umbral de horas mínimas.",
    related_processes: ["facturacion-automatica-horas-freelance", "informe-mensual-horas-estimadas"],
    herramientas: ["Glassy", "Timely", "Harvest", "Toggl", "Make", "Slack", "Email"],
    dolores: ["El equipo no registra las horas y perdemos ingresos al facturar", "Al cerrar el mes siempre faltan horas imputadas"],
    integration_domains: ["OTHER"],
    landing_slug: "agencias"
  },

  {
    id: "AG2",
    codigo: "AG2",
    slug: "consolidacion-solicitudes-multicanal",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Panel unificado de todas las solicitudes entrantes de cualquier canal",
    tagline: "Formulario, Instagram, WhatsApp... todo en un único sitio, sin que nada se pierda.",
    recomendado: true,
    descripcionDetallada: "Cada vez que llega una solicitud nueva — por el formulario de la web, un DM de Instagram o un WhatsApp — el sistema la captura, extrae los datos relevantes (nombre, contacto, canal de origen, mensaje) y crea automáticamente una ficha unificada en Notion, Airtable o el CRM que uses. El responsable recibe aviso inmediato y ya dispone de toda la información en un solo lugar, sin tener que revisar tres aplicaciones distintas.",
    summary: {
      what_it_is: "Centralización automática de todas las solicitudes entrantes en un único panel, independientemente del canal por el que lleguen.",
      for_who: ["CEOs de agencia", "Account Managers", "Equipos de ventas y captación"],
      requirements: ["Al menos uno de: formulario web, Instagram Business, WhatsApp Business API", "Panel de destino: Notion, Airtable, CRM (HubSpot, Pipedrive u otro) o Google Sheets"],
      output: "Ficha unificada por cada solicitud con: canal de origen, fecha/hora, datos de contacto, mensaje completo y estado de seguimiento — más notificación al responsable."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Formularios", "RRSS / Mensajería", "CRM"]
    },
    how_it_works_steps: [
      { title: "Escucha multicanal", short: "Monitorizamos todos los puntos de entrada.", detail: "Conectamos simultáneamente el formulario web, los DMs de Instagram Business y el número de WhatsApp Business para capturar cada mensaje entrante en tiempo real." },
      { title: "Normalización de datos", short: "Damos el mismo formato a todo.", detail: "Independientemente del canal, extraemos siempre los mismos campos: nombre, contacto, canal de origen, timestamp y contenido del mensaje, para que el panel sea homogéneo." },
      { title: "Creación automática de ficha", short: "Abrimos el registro en tu herramienta.", detail: "Se crea automáticamente una nueva entrada en Notion, Airtable o el CRM elegido, con todos los datos normalizados y etiquetada por canal de origen." },
      { title: "Notificación al responsable", short: "El equipo lo sabe al instante.", detail: "El account o comercial responsable recibe un aviso inmediato con el resumen de la solicitud y el enlace directo al registro para actuar sin demora." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Canales a conectar", options: ["Solo formulario web", "Formulario + WhatsApp", "Formulario + Instagram DM", "Los tres canales"] },
        { type: "select", label: "Panel de destino", options: ["Notion", "Airtable", "HubSpot", "Pipedrive", "Google Sheets", "Otro CRM"] },
        { type: "select", label: "Canal de notificación al equipo", options: ["Slack", "Email", "Teams", "WhatsApp interno"] },
        { type: "radio", label: "¿Asignación automática por tipo de solicitud?", options: ["Sí, según palabras clave", "No, todas al mismo responsable"] }
      ],
      free_text_placeholder: "¿Tienes reglas de asignación específicas según el servicio solicitado o la zona geográfica del lead?"
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Necesito WhatsApp Business API o vale con WhatsApp normal?", a: "Para la integración automática es necesaria la API de WhatsApp Business. Si solo tienes WhatsApp normal, podemos valorar alternativas como Manychat o Make con QR." },
      { q: "¿Se duplican las solicitudes si alguien escribe por dos canales?", a: "Podemos configurar deduplicación por número de teléfono o email para evitar fichas duplicadas del mismo contacto." },
      { q: "¿Funciona con Instagram si no tenemos muchos seguidores?", a: "Sí, la integración es con Instagram Business y no depende del número de seguidores, solo de tener la cuenta configurada como cuenta de empresa." },
      { q: "¿Podemos ver métricas de cuántas solicitudes llegan por cada canal?", a: "Absolutamente. Al tener todo etiquetado por canal de origen, puedes generar dashboards automáticos que muestran la distribución por canal, tiempo de respuesta y tasa de conversión." }
    ],
    pasos: [
      "Capturamos el mensaje en tiempo real desde el canal de origen (web, Instagram DM o WhatsApp)",
      "Normalizamos los datos al mismo formato (nombre, contacto, canal, mensaje, timestamp)",
      "Creamos la ficha automáticamente en Notion, Airtable o el CRM elegido",
      "Notificamos al responsable con el resumen y enlace directo al registro"
    ],
    personalizacion: "Elige qué canales conectar, dónde centralizar las fichas y las reglas de asignación por tipo de solicitud.",
    related_processes: ["captura-organizacion-solicitudes", "seguimiento-automatico-solicitudes"],
    herramientas: ["Make", "Zapier", "Instagram Business API", "WhatsApp Business API", "Notion", "Airtable", "HubSpot", "Pipedrive"],
    dolores: ["Las solicitudes llegan por 5 canales distintos y siempre se pierde alguna", "No hay un registro único de leads entrantes"],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "agencias"
  },
];

export const categories = [
  { id: "Facturación y Finanzas", name: "Facturación y Finanzas", emoji: "💳" },
  { id: "Horarios y Proyectos", name: "Horarios y Proyectos", emoji: "📅" },
  { id: "Gestión Interna", name: "Gestión Interna", emoji: "🏢" },
  { id: "Atención y Ventas", name: "Atención y Ventas", emoji: "💬" },
  { id: "Auditoría tecnológica", name: "Auditoría tecnológica", emoji: "🔍" }
];
