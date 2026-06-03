export interface Process {
  id: string;
  codigo: string;
  slug: string;
  categoria?: string;       // @deprecated — no se usa en landings activas
  categoriaNombre?: string; // @deprecated — sobreescrito por bloque_negocio en runtime
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
  hidden?: boolean;
  bloque_negocio?: "B1" | "B2" | "B3" | "B4" | "B5" | "B6";
  modulo_codigo?: string;
  sector_variants?: Record<string, {
    tagline?: string;
    one_liner?: string;
    descripcionDetallada?: string;
    dolores?: string[];
    pasos?: string[];
    personalizacion?: string;
    summary?: {
      what_it_is?: string;
      for_who?: string[];
      requirements?: string[];
      output?: string;
    };
    how_it_works_steps?: {
      title: string;
      short: string;
      detail?: string;
    }[];
  }>;

  // ===== Campos espejo de Supabase (NO se editan desde processes.ts) =====
  // Estos campos viven en la BD y guardan estado de generación de assets.
  // El script de sync los preserva intactos — nunca los sobrescribe.
  // Mapping: hidden:true (código) ↔ catalog_active:false (BD).
  catalog_active?: boolean;
  guion_generado?: boolean;
  guion_clickup_url?: string;
  guion_generado_at?: string;
  video_generado?: boolean;
  video_remotion_url?: string;
  video_generado_at?: string;
  image_url_1?: string;
  image_url_2?: string;
  image_url_3?: string;
  image_subtitle_1?: string;
  image_subtitle_2?: string;
  image_subtitle_3?: string;
  imagenes_generadas?: boolean;
  imagenes_generadas_at?: string;
}


export const processes: Process[] = [
  {
    id: "A1",
    hidden: true,
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    herramientas: ["ERP/Software de gestión", "Hoja de cálculo"],
    dolores: ["Quiero automatizar presupuestos y respuestas", "Necesito centralizar la información de clientes"],
    integration_domains: ["ERP"],
  },

  {
    id: "A2",
    hidden: true,
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    herramientas: ["ERP/Software de gestión", "Canal de comunicación"],
    dolores: ["Necesito centralizar la información de clientes"],
    related_processes: ["recordatorios-pagos", "informes-financieros-direccion"],
    integration_domains: ["ERP"]
  },

  {
    id: "A3",
    codigo: "1.1",
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
    sectores: ["Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    herramientas: ["ERP/Software de gestión", "Hoja de cálculo"],
    dolores: ["Quiero automatizar presupuestos y respuestas", "Tardamos en responder y perdemos clientes"],
    related_processes: ["seguimiento-presupuestos", "facturas-automatizadas"],
    integration_domains: ["ERP"],
    landing_slug: "gestorias",
    bloque_negocio: "B1",

    modulo_codigo: "1.1",
  },
  {
    id: "B6",
    hidden: true,
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    bloque_negocio: "B4",
  },

  {
    id: "B7",
    hidden: true,
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
  },

  {
    id: "B8",
    hidden: true,
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
  },

  {
    id: "C9",
    hidden: true,
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    bloque_negocio: "B4",
  },

  {
    id: "C10",
    codigo: "4.6",
    slug: "informes-financieros-direccion",
    categoria: "C",
    categoriaNombre: "Facturación y Finanzas",
    nombre: "Resumen financiero mensual del centro deportivo",
    tagline: "Saber cómo va el centro sin esperar a que nadie prepare un informe.",
    recomendado: true,
    descripcionDetallada: "Al cierre de cada mes, el sistema consolida automáticamente los ingresos por cuotas, bonos y servicios, los gastos operativos y los KPIs clave del centro. El responsable recibe un resumen ejecutivo sin tener que abrir el software de gestión ni preparar nada.",
    summary: {
      what_it_is: "Fotografía financiera automatizada del centro deportivo para tomar decisiones con datos reales cada mes.",
      for_who: ["Propietarios de centros deportivos", "Gerentes de instalaciones", "Responsables de área"],
      requirements: ["Software de gestión del centro", "Hoja de costes fijos"],
      output: "Resumen mensual con ingresos por cuotas, ocupación, bajas y margen — entregado automáticamente."
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    integration_domains: ["ERP"],
    landing_slug: "centros-deportivos",
    bloque_negocio: "B4",

    modulo_codigo: "4.6",
  },
  {
    id: "C11",
    hidden: true,
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    integration_domains: ["ERP", "CRM"]
  },

  {
    id: "C12",
    hidden: true,
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    integration_domains: ["ERP"],
    bloque_negocio: "B4",
  },

  {
    id: "D13",
    codigo: "6.1",
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
    landing_slug: "gestorias",
    sectores: ["Gestoria", "Construcción & Reformas", "Inmobiliaria"],
    bloque_negocio: "B6",

    modulo_codigo: "6.1",
  },

  {
    id: "D15",
    landing_slug: "agencias",
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
    sectores: ["Agencia/marketing"],
    integration_domains: ["ERP"]
  },

  {
    id: "D16",
    landing_slug: "agencias",
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
    sectores: ["Agencia/marketing"],
    integration_domains: ["ERP"]
  },

  {
    id: "E18",
    codigo: "1.1",
    slug: "asistente-reservas-recordatorios",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Reservas de sesiones y pistas con recordatorios automáticos",
    tagline: "Los socios reservan, el sistema confirma y avisa. Tú no tienes que hacer nada.",
    recomendado: true,
    descripcionDetallada: "El socio reserva su sesión o pista desde donde prefiera — WhatsApp, web o app. El sistema confirma la plaza al instante, envía un recordatorio antes de la cita y gestiona los cambios o cancelaciones con un flujo guiado. Sin llamadas, sin papel, sin malentendidos.",
    summary: {
      what_it_is: "Asistente de reservas automático para centros deportivos que elimina la gestión manual de sesiones, pistas y actividades.",
      for_who: ["Centros deportivos", "Clubs de pádel", "Gimnasios boutique", "Estudios de yoga y fitness"],
      requirements: ["Canal de comunicación del centro (WhatsApp, web o app)", "Calendario de actividades o pistas"],
      output: "Reservas confirmadas al instante + recordatorios automáticos + reducción de ausencias."
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "Inmobiliaria", "Agencia/marketing"],
    related_processes: ["reduccion-ausencias-citas", "solicitud-automatica-resenas"],
    integration_domains: ["OTHER"],
    landing_slug: "centros-deportivos",
    bloque_negocio: "B1",
    modulo_codigo: "1.1",
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
    sectores: ["Centros Deportivos", "E-commerce"],
    related_processes: ["asistente-reservas-recordatorios", "atencion-automatica-redes-sociales"],
    integration_domains: ["OTHER"],
    landing_slug: "centros-deportivos",
    bloque_negocio: "B5",
    modulo_codigo: "5.1",
  },
  {
    id: "E22",
    hidden: true,
    codigo: "E22",
    slug: "atencion-automatica-redes-sociales",
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    herramientas: ["Redes Sociales", "IA", "Herramienta de automatización"],
    dolores: ["Me escriben mucho y no doy abasto", "Tardamos en responder y perdemos clientes"],
    related_processes: ["atencion-automatica-redes-sociales", "captura-organizacion-solicitudes"],

  },
  {
    id: "E24",
    hidden: true,
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    herramientas: ["Formulario", "Gestor de tareas", "Gestor de archivos", "Canal de comunicación"],
    dolores: ["Pierdo solicitudes entre tu vía de comunicación preferida/tu vía de comunicación preferida/tu vía de comunicación preferida", "No hago seguimiento a las personas interesadas"],
    related_processes: ["atencion-automatica-redes-sociales", "captura-organizacion-solicitudes"],
  },
  {
    id: "F25",
    hidden: true,
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    herramientas: [],
    related_processes: ["atencion-automatica-redes-sociales", "registro-automatico-gastos"],
    bloque_negocio: "B4",
  },
  {
    id: "CM1",
    codigo: "2.1",
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    herramientas: ["Typeform","HubSpot","ActiveCampaign","Make"],
    dolores: ["Tienes leads de prueba gratuita que nunca nadie siguió","Pierdo solicitudes entre WhatsApp/Instagram/email"],
    landing_slug: "centros-deportivos",
    bloque_negocio: "B2",

    modulo_codigo: "2.1",
  },
  {
    id: "CM2",
    hidden: true,
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
    sectores: ["Centros Deportivos", "Construcción & Reformas", "E-commerce"],
    herramientas: ["ActiveCampaign","Brevo","WhatsApp Business API"],
    dolores: ["Tardamos en responder y perdemos clientes"],
  },
  {
    id: "CM3",
    codigo: "3.2",
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
    landing_slug: "centros-deportivos",
    bloque_negocio: "B3",

    modulo_codigo: "3.2",
  },
  {
    id: "GV4",
    codigo: "3.3",
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
    landing_slug: "centros-deportivos",
    bloque_negocio: "B3",

    modulo_codigo: "3.3",
  },
  {
    id: "GV5",
    codigo: "2.2",
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
    landing_slug: "centros-deportivos",
    bloque_negocio: "B2",

    modulo_codigo: "2.2",
  },
  {
    id: "GV6",
    codigo: "2.3",
    slug: "programa-referidos-automatizado",
    categoria: "C",
    categoriaNombre: "Facturación y Finanzas",
    nombre: "Sistema automático para que tus alumnos traigan amigos a cambio de un descuento",
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
    landing_slug: "centros-deportivos",
    bloque_negocio: "B2",

    modulo_codigo: "2.3",
  },
  {
    id: "GV7",
    codigo: "3.1",
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
    landing_slug: "centros-deportivos",
    bloque_negocio: "B3",

    modulo_codigo: "3.1",
  },
  {
    id: "GV8",
    hidden: true,
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
  },
  {
    id: "GV9",
    codigo: "3.5",
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
    landing_slug: "centros-deportivos",
    bloque_negocio: "B3",

    modulo_codigo: "3.5",
  },
  {
    id: "OA10",
    codigo: "2.4",
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
    landing_slug: "centros-deportivos",
    bloque_negocio: "B2",

    modulo_codigo: "2.4",
  },
  {
    id: "OA11",
    hidden: true,
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
  },
  {
    id: "OA12",
    codigo: "1.4",
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
    landing_slug: "centros-deportivos",
    bloque_negocio: "B1",

    modulo_codigo: "1.4",
  },
  {
    id: "OA13",
    codigo: "4.2",
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
    landing_slug: "centros-deportivos",
    bloque_negocio: "B4",
    modulo_codigo: "4.2",
  },
  {
    id: "OA16",
    hidden: true,
    codigo: "3.7",
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
    landing_slug: "centros-deportivos",
    bloque_negocio: "B3",

    modulo_codigo: "3.7",
  },
  {
    id: "OA17",
    codigo: "4.3",
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    herramientas: ["Docusign","SignNow","Make","Google Drive"],
    dolores: ["Necesito centralizar la información de clientes"],
    landing_slug: "centros-deportivos",
    bloque_negocio: "B4",
    modulo_codigo: "4.3",
  },
  {
    id: "OA18",
    codigo: "4.5",
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
    landing_slug: "centros-deportivos",
    bloque_negocio: "B4",
    modulo_codigo: "4.5",
  },
  {
    id: "OA19",
    codigo: "3.4",
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
    landing_slug: "centros-deportivos",
    bloque_negocio: "B3",

    modulo_codigo: "3.4",
  },
  {
    id: "AC20",
    codigo: "1.2",
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    herramientas: ["WhatsApp Business API","Make","ChatGPT"],
    dolores: ["Me escriben mucho y no doy abasto","Tengo muchas preguntas repetidas"],
    landing_slug: "centros-deportivos",
    bloque_negocio: "B1",

    modulo_codigo: "1.2",
  },
  {
    id: "AC21",
    codigo: "5.2",
    slug: "encuesta-satisfaccion-post-clase",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Encuesta de satisfacción periódica a socios: detecta problemas antes de que se vayan",
    tagline: "Saber cómo están tus socios sin preguntarles cada día.",
    recomendado: false,
    descripcionDetallada: "Una vez al mes, o tras un número configurable de sesiones, el sistema envía una encuesta breve de 1-2 preguntas a una muestra de socios. No es un bombardeo — es una escucha inteligente. Si alguien valora mal, el responsable recibe una alerta inmediata para actuar antes de que ese socio decida irse.",
    customization: {
      options_blocks: [
        { type: "select", label: "Preferencias de Configuración", options: ["Priorizar automatización total", "Mantener paso de revisión manual", "Adaptar según el caso"] },
        { type: "select", label: "Canal de Notificaciones", options: ["Email", "WhatsApp", "Slack", "Teams", "Otro"] }
      ],
      free_text_placeholder: "¿Existe algún requisito específico para tu negocio o clientes a tener en cuenta?"
    },
    demo: { video_url: "PENDING" },
    pasos: ["Trigger periódico configurable (mensual o cada X sesiones)","Envío de micro-encuesta a muestra de socios","Alerta inmediata al responsable si la valoración es baja"],
    personalizacion: "Elige la frecuencia (mensual, quincenal, cada 5 sesiones), las preguntas y el umbral de alerta.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Typeform","Make","ActiveCampaign"],
    dolores: ["Los socios se van sin avisar"],
    landing_slug: "centros-deportivos",
    bloque_negocio: "B5",

    modulo_codigo: "5.2",
  },
  {
    id: "AC22",
    codigo: "5.3",
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    herramientas: ["Typeform","ClickUp","Make"],
    dolores: ["Los socios se van sin avisar"],
    landing_slug: "centros-deportivos",
    bloque_negocio: "B5",

    modulo_codigo: "5.3",
  },
  {
    id: "AC23",
    codigo: "3.6",
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
    sectores: ["Centros Deportivos", "E-commerce"],
    herramientas: ["ActiveCampaign","Make","WhatsApp Business API"],
    dolores: ["Los socios se van sin avisar"],
    landing_slug: "centros-deportivos",
    bloque_negocio: "B3",

    modulo_codigo: "3.6",
  },
  {
    id: "AC24",
    hidden: true,
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
  },
  {
    id: "AC25",
    codigo: "1.3",
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
    related_processes: ["matricula-asignacion-nivel-automatica"],
    sectores: ["Centros Deportivos"],
    integration_domains: ["OTHER"],
    landing_slug: "centros-deportivos",
    bloque_negocio: "B1",

    modulo_codigo: "1.3",
  },
  {
    id: "AC26",
    hidden: true,
    codigo: "3.10",
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
    sectores: ["Centros Deportivos"],
    integration_domains: ["OTHER"],
    landing_slug: "centros-deportivos",
    bloque_negocio: "B3",

    modulo_codigo: "3.10",
  },
  {
    id: "AC27",
    codigo: "2.4",
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
    related_processes: ["notificacion-cambios-cancelaciones-clase"],
    integration_domains: ["OTHER"],
    landing_slug: "academias",
    bloque_negocio: "B2",
    modulo_codigo: "2.4",
  },
  {
    id: "RO25",
    codigo: "4.4",
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
    landing_slug: "centros-deportivos",
    bloque_negocio: "B4",
    modulo_codigo: "4.4",
  },
  {
    id: "RO26",
    hidden: false,
    codigo: "4.7",
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
    dolores: [
      "Cada semana llamas o escribes a cada instructor para saber cuándo puede dar clase",
      "Los horarios se montan a mano y los errores de asignación generan conflictos de última hora",
      "Cuando falta cobertura en una clase te enteras tarde, sin margen para reaccionar",
    ],
    benefits: [
      "Los instructores reportan disponibilidad solos desde su móvil, sin que tú intervengas",
      "El sistema cruza disponibilidades con el calendario y detecta conflictos antes de que ocurran",
      "Las incidencias de cobertura se notifican al instante para que puedas actuar a tiempo",
    ],
    landing_slug: "centros-deportivos",
    bloque_negocio: "B4",
    modulo_codigo: "4.7",
  },
  {
    id: "FF27",
    codigo: "4.1",
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
    sectores: ["Centros Deportivos", "E-commerce"],
    herramientas: ["Stripe","GoCardless","Make","WhatsApp Business API"],
    dolores: ["Los cobros fallidos los sigues persiguiendo tú"],
    landing_slug: "centros-deportivos",
    bloque_negocio: "B4",

    modulo_codigo: "4.1",
  },
  {
    id: "FF28",
    hidden: true,
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
    sectores: ["Centros Deportivos", "E-commerce"],
    herramientas: ["Airtable","Make","Gmail"],
    dolores: ["Necesito centralizar la información de clientes"],
  },
  {
    id: "OE29",
    hidden: true,
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
  },
  {
    id: "GS1",
    codigo: "2.1",
    slug: "recopilacion-mensual-documentos",
    categoria: "F",
    categoriaNombre: "Auditoría tecnológica",
    nombre: "Recopilación automática de documentos",
    tagline: "Solicita y centraliza la documentación de tus clientes cada mes sin perseguir a nadie.",
    landing_slug: "gestorias",
    bloque_negocio: "B2",
    modulo_codigo: "2.1",
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
    codigo: "3.1",
    slug: "alertas-vencimientos-fiscales",
    categoria: "C",
    categoriaNombre: "Facturación y Finanzas",
    landing_slug: "gestorias",
    bloque_negocio: "B3",
    modulo_codigo: "3.1",
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
    codigo: "3.2",
    slug: "seguimiento-expedientes",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    landing_slug: "gestorias",
    bloque_negocio: "B3",
    modulo_codigo: "3.2",
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
    landing_slug: "agencias",
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
    sectores: ["Agencia/marketing"],
    herramientas: ["ERP contable", "Make", "Hojas de cálculo"],
    dolores: ["El cliente solo tiene noticias mías para pedir papeles o pagar impuestos", "Tardo mucho en preparar informes para los clientes VIP"],
    integration_domains: ["ERP", "DOCS"]
  },
  {
    id: "GS5",
    codigo: "6.2",
    slug: "conciliacion-bancaria-automatica",
    categoria: "C",
    categoriaNombre: "Facturación y Finanzas",
    landing_slug: "gestorias",
    bloque_negocio: "B6",
    modulo_codigo: "6.2",
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
    sectores: ["Centros Deportivos", "Gestoria", "E-commerce"],
    herramientas: ["Pasarela bancaria", "ERP", "Make"],
    dolores: ["Dedico demasiadas horas a puntear el banco con las facturas", "No sé quién me debe dinero hasta que no reviso el banco a mano"],
    integration_domains: ["ERP", "OTHER"]
  },
  {
    id: "GS6",
    codigo: "4.1",
    slug: "gestion-altas-empleados",
    categoria: "D",
    categoriaNombre: "Gestión Interna",
    landing_slug: "gestorias",
    bloque_negocio: "B4",
    modulo_codigo: "4.1",
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
    codigo: "4.2",
    slug: "vencimientos-contratos-laborales",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    landing_slug: "gestorias",
    bloque_negocio: "B4",
    modulo_codigo: "4.2",
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
    codigo: "4.4",
    slug: "envio-automatico-nominas",
    categoria: "D",
    categoriaNombre: "Gestión Interna",
    landing_slug: "gestorias",
    bloque_negocio: "B4",
    modulo_codigo: "4.4",
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
    sectores: ["Gestoria"],
    herramientas: ["PDF.co", "Make", "SendGrid/Gmail"],
    dolores: ["Tardo una mañana entera en enviar las nóminas de mis clientes", "A veces nos equivocamos y enviamos la nómina de uno a otro por error"],
    integration_domains: ["DOCS", "OTHER"]
  },
  {
    id: "GS9",
    codigo: "4.3",
    slug: "incidencias-laborales-clientes",
    categoria: "D",
    categoriaNombre: "Gestión Interna",
    landing_slug: "gestorias",
    bloque_negocio: "B4",
    modulo_codigo: "4.3",
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    herramientas: ["Tally/JotForm", "Make", "Notion/ClickUp"],
    dolores: ["Me llegan las bajas médicas por fotos borrosas de WhatsApp", "A final de mes siempre falta algún variable que el cliente olvidó decirme"],
    integration_domains: ["OTHER"]
  },
  {
    id: "GS10",
    codigo: "6.2",
    slug: "comunicaciones-calendario-fiscal",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    landing_slug: "centros-deportivos",
    bloque_negocio: "B6",
    modulo_codigo: "6.2",
    nombre: "Campañas de captación estacional para centros deportivos",
    tagline: "Enero, septiembre, verano — los picos del año activados solos, en el momento exacto.",
    benefits: [
      "Centro lleno antes de los picos de temporada sin pagar publicidad externa",
      "Comunicación personalizada para socios actuales, ex-socios e interesados",
      "Campañas que se lanzan solas en la fecha correcta, sin que nadie tenga que recordarlo"
    ],
    recomendado: false,
    descripcionDetallada: "Los centros deportivos tienen sus propios picos de captación: la vuelta al cole de septiembre, el propósito de año nuevo de enero, el «voy a ponerme en forma antes del verano» de marzo. Antes de cada uno, el sistema activa una campaña hacia socios actuales, ex-socios e interesados — mensaje adecuado, canal adecuado, sin agencia y sin briefings de última hora.",
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Email Marketing", "CRM", "Calendario"]
    },
    how_it_works_steps: [
      { title: "Calendario deportivo", short: "Definimos los picos del centro.", detail: "Mapeamos las fechas clave del año: vuelta al cole, enero, verano, eventos propios del centro y temporadas de mayor intención de apuntarse." },
      { title: "Segmentación de socios", short: "Avisamos a quien ya te conoce.", detail: "Filtramos la base por socios activos, ex-socios y leads fríos para enviar el mensaje más relevante a cada segmento." },
      { title: "Activación automática", short: "Las campañas se lanzan solas.", detail: "El sistema dispara cada campaña en el momento óptimo — sin que nadie tenga que acordarse ni preparar nada." }
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
      "Definimos el calendario de picos del centro deportivo (enero, septiembre, verano, eventos propios)",
      "Segmentamos la base por socios activos, ex-socios e interesados según historial y frecuencia",
      "Configuramos los disparadores por fecha y activamos las campañas de forma automática",
      "Medimos la ocupación antes y después de cada campaña para optimizar la siguiente"
    ],
    personalizacion: "Elige los canales preferidos (WhatsApp o email), los picos del año que quieres activar y el tono de los mensajes. Si tienes eventos propios del centro, los añadimos al calendario.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Mailchimp/ActiveCampaign", "Make", "WhatsApp Business"],
    dolores: ["El centro no aprovecha los picos más rentables del año", "Las campañas de temporada llegan tarde o no llegan"],
    integration_domains: ["CRM", "OTHER"],
    bloque_negocio: "B6",
  },
  {
    id: "DEP-6.1",
    codigo: "6.1",
    slug: "publicacion-novedades-redes-centro-deportivo",
    categoria: "B6",
    categoriaNombre: "Marketing y contenido digital",
    nombre: "Publica novedades, horarios y promociones del centro sin tocar el móvil",
    tagline: "Nuevas clases, cambios de horario, retos y promos — publicados solos en Instagram, Facebook y Google Business.",
    recomendado: false,
    descripcionDetallada: "Cuando hay algo nuevo en el centro — una clase nueva, un cambio de horario, un reto de temporada, una promo de captación — el sistema lo detecta y publica automáticamente en tus canales: Instagram, Facebook y Google Business. Con el copy en el tono del centro y en el horario de mayor engagement de tu audiencia. Tu perfil deja de depender de que alguien tenga un rato.",
    summary: {
      what_it_is: "Sistema de publicación automática en redes sociales y Google Business para centros deportivos: clases, horarios, promos y eventos publicados sin esfuerzo.",
      for_who: [
        "Gimnasios, boxes y centros con Instagram activo que no tienen tiempo de gestionar el contenido",
        "Centros con programación cambiante (clases nuevas, eventos, retos de temporada)",
        "Centros que quieren presencia digital constante sin contratar a un community manager"
      ],
      requirements: ["Cuenta Instagram Business", "Identidad visual del centro (logo, colores)", "Acceso a Google Business Profile"],
      output: "Perfil actualizado y activo de forma continua con contenido relevante, sin trabajo manual del equipo."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["Instagram Business API", "Google Business Profile", "IA generativa"]
    },
    how_it_works_steps: [
      { title: "Detecta la novedad", short: "Clase nueva, cambio, promo.", detail: "El flujo se activa cuando registras un cambio en el calendario, una oferta nueva o un evento — vía formulario, Notion o el sistema que uses." },
      { title: "Genera el contenido", short: "Copy + imagen en tu identidad.", detail: "La IA redacta el texto en el tono del centro y crea una imagen que sigue tu guía visual (colores, tipografías, logotipo)." },
      { title: "Publica al momento óptimo", short: "Cuando tu audiencia está activa.", detail: "El post se programa al horario de mayor engagement de tu cuenta — sin que nadie tenga que pensar en ello ni recordarlo." }
    ],
    benefits: [
      "Perfil de Instagram y Google Business siempre actualizado sin esfuerzo del equipo",
      "Contenido con identidad visual consistente en todos los canales",
      "Publicaciones en el horario de mayor alcance, sin planificación manual"
    ],
    pasos: [
      "Registras la novedad en tu sistema o formulario (clase nueva / cambio de horario / promo)",
      "La IA genera el copy adaptado al tono del centro",
      "Se crea la imagen siguiendo la identidad visual",
      "Se publica automáticamente en Instagram y Google Business al horario óptimo"
    ],
    personalizacion: "Define el tono de la marca, la identidad visual (plantillas, colores, tipografías), los canales donde publicar y si quieres aprobación manual antes de cada post.",
    sectores: ["Centros Deportivos"],
    herramientas: ["Instagram Business API", "Google Business API", "OpenAI / DALL-E", "Make/n8n"],
    canales: ["Instagram", "Facebook", "Google Business"],
    dolores: [
      "Nuestro Instagram lleva semanas sin publicar nada",
      "Las publicaciones que hacemos son inconsistentes en estética",
      "No tenemos tiempo de gestionar las redes encima de gestionar el centro"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "centros-deportivos",
    bloque_negocio: "B6",
    modulo_codigo: "6.1",
    related_processes: ["comunicaciones-calendario-fiscal"]
  },
  {
    id: "GS11",
    codigo: "3.3",
    slug: "alertas-caducidad-documentos",
    categoria: "F",
    categoriaNombre: "Auditoría tecnológica",
    landing_slug: "gestorias",
    bloque_negocio: "B3",
    modulo_codigo: "3.3",
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
    codigo: "2.2",
    slug: "canal-documental-cliente",
    categoria: "D",
    categoriaNombre: "Gestión Interna",
    landing_slug: "gestorias",
    bloque_negocio: "B2",
    modulo_codigo: "2.2",
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    herramientas: ["Google Drive/Dropbox", "Make", "Slack/Email"],
    dolores: ["Tengo el email colapsado de adjuntos de clientes y pierdo horas descargando", "Nunca sé si el cliente me ha enviado ya lo que le pedí"],
    integration_domains: ["DOCS", "OTHER"],

  },
  {
    id: "GS13",
    hidden: true,
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
    codigo: "2.3",
    slug: "clasificacion-automatica-documentos",
    categoria: "F",
    categoriaNombre: "Auditoría tecnológica",
    landing_slug: "gestorias",
    bloque_negocio: "B2",
    modulo_codigo: "2.3",
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    herramientas: ["OpenAI/OCR", "Make", "Gestores de archivos"],
    dolores: ["Recibo cientos de documentos al día y pierdo horas clasificándolos", "Muchas veces archivamos mal los documentos y luego no aparecen"],
    integration_domains: ["DOCS"]
  },
  {
    id: "GS15",
    codigo: "5.3",
    slug: "reactivacion-clientes-gestoria",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    landing_slug: "gestorias",
    bloque_negocio: "B5",
    modulo_codigo: "5.3",
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
    sectores: ["Centros Deportivos"],
    herramientas: ["ActiveCampaign/Brevo", "Make", "CRM"],
    dolores: ["Solo hablo con mis clientes cuando hay problemas o toca pagar", "Se me olvidan clientes que solían traerme trámites y ya no vienen"],
    integration_domains: ["CRM", "OTHER"]
  },
  {
    id: "GS16",
    codigo: "1.2",
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
    bloque_negocio: "B1",

    modulo_codigo: "1.2",
    integration_domains: ["CRM", "OTHER"]
  },
  {
    id: "CN1",
    codigo: "1.1",
    slug: "calificacion-inteligente-leads",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Interesados priorizados por intención de compra",
    tagline: "Su equipo contacta primero a quien de verdad puede comprar, no a los curiosos.",
    one_liner: "La IA puntúa y ordena cada interesado según su probabilidad real de compra.",
    badges: ["Nuevo", "Popular"],
    benefits: [
      "Hasta un 30% más de conversión al contactar primero a los interesados con intención real",
      "El equipo deja de perder horas filtrando curiosos",
      "Cierres más rápidos al conocer el perfil antes de la primera llamada",
    ],
    recomendado: true,
    descripcionDetallada: "El sistema analiza cada interesado que entra, presupuesto, capacidad de financiamiento, urgencia y tipo de interés (inversión o vivienda propia), y le asigna una puntuación de prioridad. Su equipo ve la lista ya ordenada y dedica el tiempo a quien realmente puede cerrar, sin perderlo filtrando curiosos a mano.",
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
    sectores: ["Construcción & Reformas", "E-commerce", "Inmobiliaria"],
    herramientas: ["CRM", "IA"],
    dolores: [
      "El equipo pierde horas llamando a curiosos sin presupuesto",
      "Los compradores reales se enfrían mientras se atiende a quien no compra",
      "Se llama sin conocer el perfil y el cierre se alarga",
    ],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion",
    bloque_negocio: "B1",

    modulo_codigo: "1.1",
  },
  {
    id: "CN2",
    codigo: "1.2",
    slug: "analisis-sentimiento-riesgo",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Alerta de enfriamiento de interesados",
    tagline: "El sistema avisa a su asesor antes de que un interesado tibio se pierda.",
    one_liner: "La IA detecta señales de enfriamiento en las conversaciones y alerta a tiempo.",
    badges: ["Avanzado"],
    benefits: [
      "Detecta a tiempo las dudas que el interesado no dice de frente",
      "Menos ventas perdidas por interesados que se enfrían en silencio",
      "El asesor interviene a tiempo, con el motivo y una acción concreta",
    ],
    recomendado: false,
    descripcionDetallada: "La IA revisa las conversaciones por WhatsApp, correo y las respuestas tras la visita para detectar señales de duda, silencio o pérdida de interés. Cuando un interesado empieza a enfriarse, avisa al asesor con el motivo concreto y una recomendación de cómo reactivarlo, antes de que la oportunidad se pierda.",
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
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["CRM", "IA", "WhatsApp"],
    dolores: [
      "Los interesados tibios se pierden sin que nadie lo note",
      "Las dudas del comprador no se detectan hasta que ya se fue",
      "El asesor reacciona tarde, cuando la venta ya se enfrió",
    ],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion",
    bloque_negocio: "B1",

    modulo_codigo: "1.2",
  },
  {
    id: "CN3",
    codigo: "1.3",
    slug: "dashboard-comercial-tiempo-real",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Panel de control comercial en tiempo real",
    tagline: "Todo el estado de la comercialización en una pantalla, sin esperar al informe del lunes.",
    one_liner: "Sus números de venta, siempre actualizados y en un solo lugar.",
    badges: ["Esencial"],
    benefits: [
      "Identifica de un vistazo dónde se traba la venta",
      "Pasa del reporte mensual a mano a datos vivos las 24 horas",
      "Control del desempeño de cada asesor del equipo",
    ],
    recomendado: true,
    descripcionDetallada: "Un panel que reúne en tiempo real los datos del CRM, las visitas y las reservas: conversión por asesor, tiempo promedio de cierre, motivos de pérdida y unidades con bajo rendimiento. La dirección ve el estado real de cada proyecto cuando quiere, sin depender de reportes hechos a mano.",
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
    dolores: [
      "Dirección no sabe el estado real de la venta hasta el informe semanal",
      "Los números de venta están dispersos en hojas de cálculo",
      "No se ve a tiempo en qué fase se traba la comercialización",
    ],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion",
    bloque_negocio: "B1",

    modulo_codigo: "1.3",
  },
  {
    id: "CN4",
    codigo: "3.4",
    slug: "asistente-digital-precualificacion",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Asistente web de atención al interesado",
    tagline: "Atiende y orienta a los interesados las 24 horas, también cuando su equipo no está.",
    one_liner: "Un asistente en su web y WhatsApp que responde dudas y prepara al interesado.",
    badges: ["Popular"],
    benefits: [
      "Atención a los interesados las 24 horas sin sumar planilla",
      "El equipo deja de explicar lo básico una y otra vez",
      "Los interesados llegan al asesor ya informados sobre precio y condiciones",
    ],
    recomendado: true,
    descripcionDetallada: "Un asistente con IA atiende en su sitio web y por WhatsApp las 24 horas: explica tipologías, formas de pago, ubicación y resuelve las dudas frecuentes del proyecto. El interesado llega a su asesor ya informado, el equipo deja de repetir lo mismo una y otra vez, y toda la conversación queda registrada en el CRM.",
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
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["Web", "CRM", "WhatsApp"],
    dolores: [
      "Los interesados escriben fuera de horario y nadie responde",
      "El equipo repite lo mismo una y otra vez sobre el proyecto",
      "Los interesados llegan al asesor sin entender precio ni condiciones",
    ],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion",
    bloque_negocio: "B3",

    modulo_codigo: "3.4",
  },
  {
    id: "CN5",
    codigo: "3.5",
    slug: "motor-presentacion-perfil",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Presentación comercial adaptada por perfil",
    tagline: "El mensaje correcto para cada comprador: inversionista, familia o primera vivienda.",
    one_liner: "Arma la propuesta y los materiales adaptados al perfil de cada interesado.",
    badges: ["Nuevo"],
    benefits: [
      "Mayor tasa de apertura al enviar material relevante para cada perfil",
      "Se acaban los envíos genéricos que no conectan",
      "El asesor deja de armar a mano una propuesta distinta para cada cliente",
    ],
    recomendado: false,
    descripcionDetallada: "Según el perfil del interesado, inversionista, familia, pareja joven, el sistema arma de forma automática la presentación, la ficha y los correos con los argumentos que de verdad le importan a ese comprador. El asesor envía siempre el material más relevante, sin preparar versiones distintas a mano.",
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
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["CRM", "PDF Factory"],
    dolores: [
      "Se envía el mismo material genérico a todos los compradores",
      "El asesor improvisa el argumento según el perfil",
      "Preparar una propuesta distinta por cliente consume tiempo",
    ],
    integration_domains: ["CRM", "DOCS"],
    landing_slug: "construccion",
    bloque_negocio: "B3",

    modulo_codigo: "3.5",
  },
  {
    id: "CN6",
    codigo: "2.1",
    slug: "generador-dossier-unidad",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Generador de fichas de vivienda",
    tagline: "La ficha exacta de cada unidad en un clic: plano, precio y condiciones al día.",
    one_liner: "Genera en segundos la ficha completa de cualquier unidad lista para enviar.",
    badges: ["Recomendado"],
    benefits: [
      "Cero envíos con precios o datos desactualizados",
      "El asesor recupera horas que perdía buscando planos y anexos",
      "Imagen profesional inmediata ante el comprador",
    ],
    recomendado: true,
    descripcionDetallada: "Al elegir una unidad, el sistema arma automáticamente su ficha con plano, precio actualizado, condiciones de pago, fecha estimada de entrega y acabados incluidos, lista para enviar por WhatsApp o correo. Se acabó buscar planos sueltos en carpetas o enviar precios desactualizados.",
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
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["CRM", "DOCS"],
    dolores: [
      "Buscar planos y datos sueltos en carpetas toma horas",
      "Se envían fichas con precios desactualizados",
      "El material que recibe el comprador se ve poco profesional",
    ],
    integration_domains: ["CRM", "DOCS"],
    landing_slug: "construccion",
    bloque_negocio: "B2",

    modulo_codigo: "2.1",
  },
  {
    id: "CN7",
    codigo: "5.1",
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
    sectores: ["Gestoria", "Construcción & Reformas", "Inmobiliaria", "Agencia/marketing"],
    herramientas: ["CRM", "IA", "Telefonía"],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "gestorias",
    bloque_negocio: "B5",

    modulo_codigo: "5.1",
  },
  {
    id: "CN8",
    codigo: "5.2",
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
    sectores: ["Gestoria", "Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["Chat", "Knowledge Base", "IA"],
    integration_domains: ["OTHER"],
    landing_slug: "gestorias",
    bloque_negocio: "B5",

    modulo_codigo: "5.2",
  },
  {
    id: "CN9",
    codigo: "3.1",
    slug: "seguimiento-multicanal-inteligente",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Seguimiento automático durante la obra",
    tagline: "Mantenga vivo el interés durante los meses de obra, sin que su equipo lo haga a mano.",
    one_liner: "Secuencia de seguimiento que acompaña al interesado hasta la entrega.",
    badges: ["Esencial"],
    benefits: [
      "Frena la pérdida de interesados por el enfriamiento del ciclo largo",
      "Más del 55% de respuesta en comunicaciones a largo plazo",
      "Crea vínculo entre el comprador y su futura vivienda mientras se construye",
    ],
    recomendado: true,
    descripcionDetallada: "En obra nueva pasan meses entre el primer interés y la entrega, y ahí se enfría la mayoría de los interesados. El sistema mantiene el vínculo con mensajes por correo y WhatsApp ligados a los avances reales de la obra, hitos, fotos, videos, espaciados con criterio. Cuando un interesado vuelve a reaccionar, avisa al asesor para que retome el contacto.",
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
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["CRM", "Mailing / WhatsApp"],
    dolores: [
      "Los interesados se enfrían durante los meses de obra",
      "El seguimiento a largo plazo se hace a mano o no se hace",
      "Se pierden compradores que sí habrían cerrado más adelante",
    ],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion",
    bloque_negocio: "B3",

    modulo_codigo: "3.1",
  },
  {
    id: "CN10",
    codigo: "3.2",
    slug: "automatizacion-agendado-visitas",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Gestión automática de visitas",
    tagline: "Se acabó el ir y venir de correos para coordinar una visita al proyecto.",
    one_liner: "Agenda, confirma y recuerda cada visita de forma automática.",
    badges: ["Popular"],
    benefits: [
      "Caída fuerte de las ausencias a las visitas agendadas",
      "Menos horas a la semana coordinando y reagendando visitas",
      "El interesado agenda solo, en su momento de mayor interés",
    ],
    recomendado: true,
    descripcionDetallada: "El interesado reserva su visita desde un enlace, el sistema la agenda en el calendario del asesor y envía los recordatorios automáticos con la ubicación. Reduce al mínimo las ausencias y libera al equipo de coordinar fechas a mano.",
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
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["Agenda", "CRM", "WhatsApp SMS"],
    dolores: [
      "Coordinar cada visita es un ir y venir de mensajes",
      "Las ausencias a las visitas son frecuentes",
      "El equipo gasta horas reagendando visitas",
    ],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion",
    bloque_negocio: "B3",

    modulo_codigo: "3.2",
  },
  {
    id: "CN11",
    codigo: "3.3",
    slug: "seguimiento-post-visita",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Seguimiento automático tras la visita",
    tagline: "Sepa cómo salió cada visita y recupere a los interesados que quedaron con dudas.",
    one_liner: "Encuesta y seguimiento automático después de cada visita al proyecto.",
    badges: ["Nuevo"],
    benefits: [
      "Recupera interesados que se iban con dudas sin resolver",
      "Termómetro real del desempeño de cada asesor en la visita",
      "Automatiza el paso de cierre que más se suele olvidar",
    ],
    recomendado: false,
    descripcionDetallada: "Después de cada visita, el sistema envía una breve encuesta, mide el nivel de interés y activa un seguimiento según la respuesta: envía material adicional a quien quedó con dudas y avisa al asesor de a quién vale la pena recontactar. Estandariza el paso de cierre que normalmente se posterga u olvida.",
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
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["CRM", "Surveys"],
    dolores: [
      "Tras la visita no se sabe si el comprador quedó convencido",
      "Los interesados con dudas se pierden sin seguimiento",
      "El paso de cierre tras la visita se olvida o se posterga",
    ],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion",
    bloque_negocio: "B3",

    modulo_codigo: "3.3",
  },
  {
    id: "CN12",
    codigo: "1.3",
    slug: "automatizacion-contratos-firma",
    categoria: "D",
    categoriaNombre: "Gestión Interna",
    nombre: "Contratos generados y enviados para su firma desde el móvil",
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
    sectores: ["Gestoria", "Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["CRM", "DOCS", "Firma Digital"],
    integration_domains: ["CRM", "DOCS"],
    landing_slug: "gestorias",
    bloque_negocio: "B1",

    modulo_codigo: "1.3",
  },
  {
    id: "CN13",
    codigo: "2.5",
    slug: "proceso-post-reserva",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Gestión automática del post-reserva",
    tagline: "El momento tras la reserva es frágil: acompañe al comprador en lugar de dejarlo con dudas.",
    one_liner: "Guía al comprador en documentos y avances de obra tras la reserva.",
    badges: ["Nuevo"],
    benefits: [
      "Menos cancelaciones de reserva al transmitir confianza desde el primer día",
      "Baja la carga administrativa de andar solicitando documentos uno a uno",
      "Mejora la satisfacción del comprador y las recomendaciones a nuevos clientes",
    ],
    recomendado: false,
    descripcionDetallada: "Tras la reserva, el sistema marca los hitos, solicita al comprador la documentación necesaria de forma ordenada y le comunica los avances de la obra automáticamente. Reduce las cancelaciones, baja la carga administrativa de andar pidiendo papeles y mantiene tranquilo al comprador durante la espera.",
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
    dolores: [
      "El comprador queda con dudas tras pagar la reserva",
      "Pedir la documentación al comprador consume tiempo administrativo",
      "Las cancelaciones aumentan por falta de acompañamiento",
    ],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion",
    bloque_negocio: "B2",

    modulo_codigo: "2.5",
  },
  {
    id: "CN14",
    codigo: "6.2",
    slug: "portal-propietarios-post-entrega",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Portal de incidencias para propietarios",
    tagline: "Las incidencias tras la entrega, ordenadas y resueltas sin saturar el teléfono.",
    one_liner: "Un portal donde el propietario reporta incidencias y consulta garantías.",
    badges: ["Avanzado"],
    benefits: [
      "Un filtro inicial con IA resuelve buena parte de las consultas básicas de uso y mantenimiento",
      "El equipo de posventa y garantía ahorra horas de gestión",
      "Menos quejas públicas que afecten a futuras promociones",
    ],
    recomendado: false,
    descripcionDetallada: "Un portal donde el propietario reporta incidencias con foto, consulta sus garantías y recibe una primera respuesta de un asistente con IA que resuelve las dudas básicas. El equipo de posventa recibe solo lo que realmente requiere su atención, ya clasificado y priorizado, protegiendo la reputación de la desarrolladora.",
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
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["Portal Web", "Ticketing", "IA"],
    dolores: [
      "Las consultas de propietarios saturan el teléfono del equipo",
      "Las incidencias llegan sin orden ni prioridad",
      "Las quejas públicas afectan la reputación de la desarrolladora",
    ],
    integration_domains: ["OTHER", "COMMS"],
    landing_slug: "construccion",
    bloque_negocio: "B6",

    modulo_codigo: "6.2",
  },
  {
    id: "CN15",
    codigo: "6.4",
    slug: "identificacion-reactivacion-unidades",
    categoria: "B",
    categoriaNombre: "Horarios y Proyectos",
    nombre: "Alerta de viviendas estancadas",
    tagline: "Detecte qué unidades no avanzan, por qué, y qué hacer para moverlas.",
    one_liner: "La IA revela por qué una unidad no se vende y propone cómo reactivarla.",
    badges: ["Recomendado", "Popular"],
    benefits: [
      "Reduce los días en mercado de las unidades que no rotan",
      "Menos dependencia de rebajas agresivas de último minuto que comen margen",
      "Marketing dirigido al comprador correcto para cada unidad",
    ],
    recomendado: true,
    descripcionDetallada: "La IA cruza el tiempo en mercado, las visitas, el interés digital y la comparación con la competencia para detectar las unidades que no avanzan. Para cada una explica el motivo probable, precio, tipología, percepción, y propone acciones concretas: ajuste de precio, cambio de enfoque comercial o un nuevo público objetivo. Libera el capital atrapado en el stock parado.",
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
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["CRM", "IA", "Market Data"],
    dolores: [
      "Las unidades que no rotan se descubren demasiado tarde",
      "Se recurre a rebajas agresivas que comen margen",
      "El marketing no se dirige al comprador correcto de cada unidad",
    ],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion",
    bloque_negocio: "B6",

    modulo_codigo: "6.4",
  },

  // ── CONSTRUCCIÓN CN16-CN18 · versiones promotora/inmobiliaria ────────────
  {
    id: "CN16",
    codigo: "2.2",
    slug: "resumen-llamadas-comerciales-obra",
    categoria: "E",
    categoriaNombre: "Atención y Ventas",
    nombre: "Resumen automático de llamadas en el CRM",
    tagline: "Todo lo que el comprador dijo queda en el CRM, sin que el asesor vuelva a teclear.",
    one_liner: "La IA transcribe, resume y registra cada llamada en el CRM.",
    badges: ["Popular"],
    benefits: [
      "Datos completos en el CRM, sin resúmenes vagos de 'comprador interesado'",
      "El asesor vende en lugar de llenar fichas tras cada llamada",
      "No se pierden detalles clave como 'necesito tres habitaciones' o 'busco financiamiento al 90%'",
    ],
    recomendado: true,
    descripcionDetallada: "La IA transcribe las llamadas del equipo comercial, resume los puntos clave, tipología de interés, presupuesto, objeciones, próximo paso, y los vuelca al CRM automáticamente al colgar. El asesor dedica su tiempo a vender, no a llenar fichas, y no se pierde ningún detalle de la conversación.",
    summary: {
      "what_it_is": "Asistente secreto en cada llamada que capta la información del comprador y la sube directamente al CRM del proyecto.",
      "for_who": ["Directores comerciales de promotoras", "Equipos de sala de ventas"],
      "requirements": ["Telefonía VOIP", "CRM", "IA"],
      "output": "Ficha del CRM con tipología de interés, presupuesto, objeciones y próximo paso rellenos.",
    },
    indicators: {
      "time_estimate": "2-3 semanas",
      "complexity": "Alta",
      "integrations": ["CRM", "Telefonía", "IA"],
    },
    how_it_works_steps: [
      { "title": "Escucha pasiva", "short": "Graba mediante tu centralita.", "detail": "Se conecta a llamadas salientes y entrantes del número oficial (con aviso legal)." },
      { "title": "Extracción semántica", "short": "Anota tipología, presupuesto y objeciones.", "detail": "Distingue cuándo el comprador dice 'me parece caro para esa planta' o 'necesitamos piscina y tres habitaciones'." },
      { "title": "Volcado al CRM", "short": "La ficha del lead se rellena sola.", "detail": "Aparecen las notas estructuradas en el campo del interesado al colgar, sin que el agente escriba nada." },
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Formato de resumen", "options": ["Corto y directo", "Transcripción completa", "Campos estructurados en CRM (tipología, presupuesto, objeciones)"] },
      ],
      "free_text_placeholder": "¿Cuáles son los 4 datos que siempre hay que capturar de un comprador: tipología, presupuesto, urgencia, financiación?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { "q": "¿Funciona en español y con argot inmobiliario?", "a": "Entiende el lenguaje natural, incluyendo referencias a tipologías, orientaciones y condiciones de pago." },
      { "q": "¿Es legal?", "a": "Claro, con el aviso de grabación estándar. Se procesa conforme al RGPD." },
    ],
    pasos: [
      "Graba mediante tu centralita o VOIP conectada.",
      "Anota tipología de interés, presupuesto, objeciones y próximo paso acordado.",
      "Vuelca las notas estructuradas en el CRM nada más colgar.",
    ],
    personalizacion: "Define qué campos del CRM del proyecto se rellenarán automáticamente: tipología preferida, presupuesto máximo, financiación solicitada, objeciones pendientes.",
    related_processes: ["analisis-sentimiento-riesgo", "calificacion-inteligente-leads"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["CRM", "IA", "Telefonía"],
    dolores: [
      "El equipo no registra bien lo hablado en el CRM",
      "Se pierde información clave de las llamadas con compradores",
      "El asesor gasta tiempo llenando fichas tras cada llamada",
    ],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion",
    bloque_negocio: "B2",

    modulo_codigo: "2.2",
  },
  {
    id: "CN17",
    codigo: "2.3",
    slug: "copiloto-proyecto-agentes-obra",
    categoria: "D",
    categoriaNombre: "Gestión Interna",
    nombre: "Asistente interno del equipo de ventas",
    tagline: "Todo el argumentario de la promoción en el bolsillo de cada asesor.",
    one_liner: "Un asistente interno que responde cualquier duda del proyecto al instante.",
    badges: ["Nuevo"],
    benefits: [
      "Un asesor nuevo conoce la promoción a fondo en horas, no en semanas",
      "El equipo responde cualquier duda técnica del comprador sin improvisar",
      "Discurso unificado y coherente de todo el equipo ante el comprador",
    ],
    recomendado: false,
    descripcionDetallada: "La documentación de la promoción, planos, memoria de calidades, condiciones, comparativas, convertida en un asistente que el equipo consulta desde su celular. Frente al comprador, el asesor resuelve cualquier duda técnica o de precio en segundos, con una respuesta correcta y unificada para todo el equipo.",
    summary: {
      "what_it_is": "La documentación de la promoción convertida en un chat interno, listo para salvar cualquier pregunta difícil de un comprador al instante.",
      "for_who": ["Equipo de ventas", "Apertura de pisos piloto", "Coordinadoras comerciales"],
      "requirements": ["Chat Interno", "Documentación del proyecto completa"],
      "output": "Respuesta al instante y precisa en lenguaje natural.",
    },
    indicators: {
      "time_estimate": "2 semanas",
      "complexity": "Media",
      "integrations": ["Chat", "Knowledge Base", "IA"],
    },
    how_it_works_steps: [
      { "title": "Entran los manuales", "short": "Leemos planos, memorias y argumentarios.", "detail": "Cargamos al asistente con todos los FAQs, ventajas competitivas de la promoción y objeciones habituales de la competencia." },
      { "title": "El agente consulta", "short": "Pregunta desde su propio Slack o WhatsApp.", "detail": "El comercial frente al comprador duda: '¿Qué espesor lleva la carpintería exterior?' o '¿qué digo si le parece caro comparado con la competencia?'" },
      { "title": "Respuesta experta", "short": "El asistente da la respuesta correcta.", "detail": "Contesta en segundos y señala el documento del que lo ha extraído." },
    ],
    customization: {
      "options_blocks": [
        { "type": "radio", "label": "Canal interno preferido", "options": ["WhatsApp de equipo", "Microsoft Teams", "Slack", "Intranet web"] },
      ],
      "free_text_placeholder": "¿Tienen un manual ya hecho de técnicas de rebote a objeciones de compradores?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { "q": "¿Y si la promotora cambia la memoria de calidades o los precios?", "a": "Subes el nuevo PDF y el asistente actualiza la información de inmediato." },
    ],
    pasos: [
      "Cargamos el asistente con la documentación técnica y comercial de la promoción.",
      "El agente consulta una objeción por chat rápido ('¿Qué digo si les parece caro respecto al vecino?').",
      "El asistente contesta al momento con la mejor estrategia argumental.",
    ],
    personalizacion: "Cárgalo con técnicas de rebote a las objeciones más frecuentes de tu promoción para que ningún agente improvise ante el comprador.",
    related_processes: ["generador-dossier-unidad", "resumen-llamadas-comerciales-obra"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["Chat", "Knowledge Base", "IA"],
    dolores: [
      "Un asesor nuevo tarda semanas en conocer la promoción",
      "El equipo improvisa ante preguntas técnicas del comprador",
      "Cada asesor cuenta una versión distinta del proyecto",
    ],
    integration_domains: ["OTHER"],
    landing_slug: "construccion",
    bloque_negocio: "B2",

    modulo_codigo: "2.3",
  },
  {
    id: "CN18",
    codigo: "2.4",
    slug: "contrato-reserva-firma-digital-obra",
    categoria: "D",
    categoriaNombre: "Gestión Interna",
    nombre: "Contratos de reserva con firma digital",
    tagline: "De la reserva a la firma vinculante sin imprimir una sola hoja.",
    one_liner: "Genera el contrato de reserva y lo envía a firmar desde el celular.",
    badges: ["Esencial", "Popular"],
    benefits: [
      "Tiempo de emisión de contratos reducido hasta en un 95%",
      "Reserva firmada en el momento, sin enfriar al comprador",
      "Seguimiento visual del estado de firma de cada interviniente",
    ],
    recomendado: true,
    descripcionDetallada: "Cuando se cierra la reserva, el sistema genera el contrato con los datos del comprador y la unidad y lo envía a firma digital certificada al celular, con seguimiento del estado de cada firma. Se cierra en caliente, sin que el papeleo enfríe al comprador entre el acuerdo y la firma.",
    summary: {
      "what_it_is": "Un motor técnico que absorbe la reserva cerrada en el CRM y genera el contrato sellado jurídicamente en el móvil del comprador en minutos.",
      "for_who": ["Administración de promotoras", "Dirección operativa", "Compradores"],
      "requirements": ["CRM", "Software de Firma Digital Certificada"],
      "output": "Documentos legales firmados y archivados digitalmente.",
    },
    indicators: {
      "time_estimate": "3 semanas",
      "complexity": "Alta",
      "integrations": ["CRM", "DOCS", "Firma Digital"],
    },
    how_it_works_steps: [
      { "title": "Generación del contrato", "short": "Un clic al confirmar la reserva.", "detail": "Extraemos todos los datos del comprador, la unidad y el precio pactado y los volcamos en la plantilla legal de la promotora." },
      { "title": "Firma certificada desde el móvil", "short": "Notifica al comprador para firma al instante.", "detail": "Le envía por SMS/Email un visualizador legal para firma dactilar o biométrica del documento, sin descargar ninguna app." },
      { "title": "Sellado y archivado", "short": "Se guarda en tu base y en el correo del comprador.", "detail": "El PDF queda securizado y se autoguarda en el repositorio corporativo listo para elevación a escritura pública." },
    ],
    customization: {
      "options_blocks": [
        { "type": "select", "label": "Sistema de firma", "options": ["Avanzada OTP por SMS", "Firma biométrica", "Notarial en siguiente fase"] },
      ],
      "free_text_placeholder": "¿Cuántos intervinientes promedio tienen los contratos de tu promotora (titulares, co-titulares, avalistas)?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { "q": "¿La firma es totalmente legal para un contrato de arras o reserva?", "a": "100%. Utiliza proveedores homologados europeos (DocuSign, Signaturit) con trazabilidad plena ante cualquier reclamación." },
    ],
    pasos: [
      "Inyectamos los datos del comprador y el precio cerrado en la plantilla legal oficial de la promotora.",
      "Lanzamos la secuencia de firma en el móvil del comprador con certificado de hora e IP.",
      "Devolvemos el archivo firmado a la promotora listo para facturación y elevación a escritura pública.",
    ],
    personalizacion: "Nos amoldamos a las plantillas blindadas de la promotora, respetando todos los anexos: memoria de calidades, SEPA, RGPD y cualquier cláusula específica.",
    related_processes: ["proceso-post-reserva", "resumen-llamadas-comerciales-obra"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["CRM", "DOCS", "Firma Digital"],
    dolores: [
      "El papeleo de contratos atrasa los cierres",
      "El comprador se enfría entre el acuerdo y la firma",
      "No se sabe en qué estado de firma va cada interviniente",
    ],
    integration_domains: ["CRM", "DOCS"],
    landing_slug: "construccion",
    bloque_negocio: "B2",

    modulo_codigo: "2.4",
  },

  // ── CONSTRUCCIÓN CN19-CN30 · Obra, Finanzas y Postventa/Dirección ──────────
  {
    id: "CN19",
    codigo: "4.1",
    slug: "reporte-avance-obra",
    nombre: "Reporte automático de avance de obra",
    tagline: "Convierta las fotos y partes de campo en un informe de avance, sin armarlo a mano.",
    one_liner: "Del parte de obra al informe listo en minutos, no en días.",
    badges: ["Nuevo", "Recomendado"],
    benefits: [
      "Informe de avance en minutos en lugar de días",
      "Menos retrabajo por información de obra reportada tarde o incompleta",
      "Dirección e inversionistas siempre con el avance real al día",
    ],
    recomendado: true,
    descripcionDetallada: "El personal de campo sube fotos y notas desde el celular y el sistema arma automáticamente el informe de avance de obra: porcentaje ejecutado por partida, comparación con el cronograma y alertas de desviación. La dirección y los inversionistas reciben el reporte al día, sin que nadie pase horas armándolo en hojas de cálculo.",
    summary: {
      what_it_is: "Un sistema que toma las fotos y partes del personal de campo y genera el informe de avance del proyecto automáticamente.",
      for_who: ["Dirección de proyecto", "Residentes de obra", "Inversionistas"],
      requirements: ["App o canal para partes de campo", "Cronograma del proyecto"],
      output: "Informe de avance con porcentaje ejecutado y desviaciones, listo para enviar.",
    },
    indicators: { time_estimate: "2-3 semanas", complexity: "Media", integrations: ["Gestión de obra", "IA"] },
    how_it_works_steps: [
      { title: "Captura en campo", short: "El personal sube fotos y notas desde el celular.", detail: "Cada parte queda asociado a su partida y fecha." },
      { title: "Consolidación automática", short: "El sistema calcula el avance por partida.", detail: "Compara lo ejecutado contra el cronograma planificado." },
      { title: "Informe al instante", short: "Genera el reporte listo para enviar.", detail: "Con alertas de las partidas que van retrasadas." },
    ],
    customization: {
      options_blocks: [{ type: "select", label: "Periodicidad del reporte", options: ["Diario", "Semanal", "Por hito de obra"] }],
      free_text_placeholder: "¿Cómo mide hoy el avance de su obra (por partidas, por hitos, por porcentaje)?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿El personal de campo necesita una app complicada?", a: "No. Suben fotos y notas desde WhatsApp o una app sencilla; el sistema hace el resto." },
    ],
    pasos: [
      "El personal de campo sube fotos y notas de la jornada.",
      "El sistema calcula el avance por partida y lo compara con el cronograma.",
      "Genera el informe con desviaciones y lo envía a dirección.",
    ],
    personalizacion: "Definimos las partidas y los hitos de su proyecto para que el avance se calcule como usted lo mide.",
    related_processes: ["control-permisos-tramites", "gestion-documental-proyecto"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["Gestión de obra", "IA"],
    dolores: [
      "Los reportes de avance toman días y llegan tarde",
      "La obra y la oficina trabajan con información distinta",
      "Dirección e inversionistas no ven el avance real al día",
    ],
    integration_domains: ["OTHER"],
    landing_slug: "construccion",
    bloque_negocio: "B4",
    modulo_codigo: "4.1",
  },
  {
    id: "CN20",
    codigo: "4.2",
    slug: "registro-albaranes-proveedor",
    nombre: "Registro automático de albaranes y facturas de proveedor",
    tagline: "Cada albarán y factura de proveedor leído, registrado y conciliado sin digitarlo a mano.",
    one_liner: "La IA lee los documentos de proveedor y los registra solos.",
    badges: ["Nuevo"],
    benefits: [
      "Cero digitación manual de albaranes y facturas",
      "Detecta diferencias de precio o cantidad antes de pagar de más",
      "Costos de proveedor siempre actualizados contra el presupuesto",
    ],
    recomendado: false,
    descripcionDetallada: "El sistema lee con IA los albaranes y facturas de proveedor, importe, partida, proyecto, impuestos, y los registra y concilia contra la orden de compra o el presupuesto, sin que nadie los digite a mano. Detecta diferencias de precio o cantidad y las marca para revisión.",
    summary: {
      what_it_is: "Un lector con IA que convierte los documentos de proveedor en registros conciliados automáticamente.",
      for_who: ["Administración de obra", "Contabilidad", "Dirección financiera"],
      requirements: ["Correo o carpeta donde llegan los documentos", "ERP o sistema de costos"],
      output: "Albarán o factura registrado y conciliado, con diferencias marcadas.",
    },
    indicators: { time_estimate: "2-3 semanas", complexity: "Media", integrations: ["ERP", "IA"] },
    how_it_works_steps: [
      { title: "Recepción del documento", short: "Llega por correo o se sube a una carpeta.", detail: "El sistema lo detecta y empieza a leerlo." },
      { title: "Lectura con IA", short: "Extrae importe, partida e impuestos.", detail: "Identifica el proveedor y el proyecto al que corresponde." },
      { title: "Conciliación", short: "Cruza contra la orden de compra.", detail: "Marca diferencias de precio o cantidad para revisión." },
    ],
    customization: {
      options_blocks: [{ type: "select", label: "Destino del registro", options: ["ERP contable", "Hoja de control de costos", "Ambos"] }],
      free_text_placeholder: "¿Qué proveedores le generan más volumen de documentos al mes?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Sirve aunque cada proveedor use un formato distinto?", a: "Sí. La IA entiende formatos distintos de albarán y factura sin plantilla fija." },
    ],
    pasos: [
      "El documento del proveedor llega por correo o carpeta.",
      "La IA extrae los datos y los asocia al proyecto y la partida.",
      "Concilia contra la orden de compra y marca diferencias.",
    ],
    personalizacion: "Adaptamos la lectura a los formatos de sus proveedores habituales y a las partidas de su presupuesto.",
    related_processes: ["reporte-avance-obra", "facturacion-automatica-obra"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["ERP", "IA"],
    dolores: [
      "Digitar albaranes y facturas a mano consume horas",
      "Se pagan diferencias de precio que nadie detecta a tiempo",
      "Los costos de proveedor no están al día contra el presupuesto",
    ],
    integration_domains: ["ERP", "DOCS"],
    landing_slug: "construccion",
    bloque_negocio: "B4",
    modulo_codigo: "4.2",
  },
  {
    id: "CN21",
    codigo: "4.3",
    slug: "control-permisos-tramites",
    nombre: "Gestión de permisos y trámites",
    tagline: "Cada permiso y trámite del proyecto, con su estado, entidad y plazo en un solo lugar.",
    one_liner: "El estado de todos sus permisos y trámites, siempre al día.",
    badges: ["Nuevo", "Recomendado"],
    benefits: [
      "Todos los permisos y trámites en un solo tablero con su estado",
      "Alertas antes de cada vencimiento o requisito pendiente",
      "Menos retrasos de obra por trámites que se pasan de fecha",
    ],
    recomendado: true,
    descripcionDetallada: "El sistema centraliza todos los permisos y trámites del proyecto, ante cada entidad o municipalidad, su estado, requisitos pendientes y fechas límite, y envía alertas antes de cada vencimiento. La dirección sabe en todo momento qué falta para avanzar, sin perseguir el estado de cada gestión.",
    summary: {
      what_it_is: "Un control centralizado del estado de cada permiso y trámite del proyecto ante cada entidad.",
      for_who: ["Dirección de proyecto", "Gestoría o legal", "Desarrolladora"],
      requirements: ["Listado de trámites y entidades", "Canal de alertas"],
      output: "Tablero de permisos con estado, requisitos y plazos, con alertas.",
    },
    indicators: { time_estimate: "2 semanas", complexity: "Baja", integrations: ["Gestión documental", "IA"] },
    how_it_works_steps: [
      { title: "Mapa de trámites", short: "Cargamos los permisos y entidades del proyecto.", detail: "Cada uno con sus requisitos y plazos." },
      { title: "Seguimiento de estado", short: "Se actualiza el avance de cada gestión.", detail: "Qué se presentó, qué falta y ante quién." },
      { title: "Alerta de vencimientos", short: "Avisa antes de cada fecha límite.", detail: "Para que ningún trámite frene la obra." },
    ],
    customization: {
      options_blocks: [{ type: "select", label: "Canal de alerta", options: ["WhatsApp", "Correo", "Notificación interna"] }],
      free_text_placeholder: "¿Ante qué entidades tramita habitualmente sus permisos?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Se adapta a los trámites de mi cantón?", a: "Sí. Configuramos las entidades, tipos de trámite y plazos propios de su zona y tipo de proyecto." },
    ],
    pasos: [
      "Cargamos los permisos y trámites del proyecto con sus entidades y plazos.",
      "El sistema mantiene el estado de cada gestión actualizado.",
      "Envía alertas antes de cada vencimiento o requisito pendiente.",
    ],
    personalizacion: "Configuramos las entidades, los tipos de trámite y los plazos propios de su cantón y tipo de proyecto.",
    related_processes: ["gestion-documental-proyecto", "revision-cumplimiento-normativo"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["Gestión documental", "IA"],
    dolores: [
      "Los trámites se pasan de fecha y frenan la obra",
      "Nadie tiene centralizado el estado de cada permiso",
      "Se descubre tarde un requisito pendiente ante una entidad",
    ],
    integration_domains: ["OTHER"],
    landing_slug: "construccion",
    bloque_negocio: "B4",
    modulo_codigo: "4.3",
  },
  {
    id: "CN22",
    codigo: "4.4",
    slug: "gestion-documental-proyecto",
    nombre: "Gestión documental del proyecto",
    tagline: "Planos, contratos y versiones del proyecto, ordenados y siempre en su última versión.",
    one_liner: "Toda la documentación del proyecto, ordenada y consultable al instante.",
    badges: ["Nuevo"],
    benefits: [
      "Siempre la última versión del plano o contrato, sin confusiones",
      "Encuentra cualquier documento del proyecto en segundos",
      "Menos errores por trabajar con versiones desactualizadas",
    ],
    recomendado: false,
    descripcionDetallada: "El sistema organiza toda la documentación del proyecto, planos, contratos, memorias, permisos, controlando versiones y permitiendo encontrar cualquier documento en lenguaje natural. Se acaba el caos de archivos sueltos por correo y el riesgo de trabajar con una versión vieja del plano.",
    summary: {
      what_it_is: "Un repositorio inteligente que ordena la documentación del proyecto y la hace consultable en lenguaje natural.",
      for_who: ["Dirección de proyecto", "Obra", "Administración"],
      requirements: ["Documentación del proyecto", "Almacenamiento en la nube"],
      output: "Documentación versionada y buscable en lenguaje natural.",
    },
    indicators: { time_estimate: "2-3 semanas", complexity: "Media", integrations: ["Gestión documental", "IA"] },
    how_it_works_steps: [
      { title: "Centralización", short: "Subimos toda la documentación del proyecto.", detail: "Planos, contratos, memorias y permisos en un solo lugar." },
      { title: "Control de versiones", short: "Cada documento mantiene su historial.", detail: "Siempre se accede a la versión vigente." },
      { title: "Búsqueda con IA", short: "Pregunte por cualquier dato en lenguaje natural.", detail: "El sistema encuentra el documento y la página exacta." },
    ],
    customization: {
      options_blocks: [{ type: "select", label: "Acceso", options: ["Solo equipo interno", "Equipo y contratistas", "Por roles"] }],
      free_text_placeholder: "¿Dónde guarda hoy los planos y contratos del proyecto?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Sustituye nuestra nube actual?", a: "Se conecta a ella. Ordena y hace consultable lo que ya tiene, sin migrar nada a la fuerza." },
    ],
    pasos: [
      "Centralizamos toda la documentación del proyecto.",
      "El sistema controla versiones y mantiene la vigente.",
      "Cualquier miembro consulta lo que necesita en lenguaje natural.",
    ],
    personalizacion: "Organizamos la documentación según la estructura de carpetas y la nomenclatura de su desarrolladora.",
    related_processes: ["control-permisos-tramites", "reporte-avance-obra"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["Gestión documental", "IA"],
    dolores: [
      "Se trabaja con versiones viejas de planos",
      "Encontrar un documento del proyecto toma demasiado tiempo",
      "Los archivos viven dispersos en correos y carpetas",
    ],
    integration_domains: ["DOCS"],
    landing_slug: "construccion",
    bloque_negocio: "B4",
    modulo_codigo: "4.4",
  },
  {
    id: "CN23",
    codigo: "4.5",
    slug: "revision-cumplimiento-normativo",
    nombre: "Revisión de cumplimiento normativo del proyecto",
    tagline: "Revise el proyecto contra la normativa aplicable antes de que un incumplimiento le cueste.",
    one_liner: "La IA contrasta el proyecto con la normativa y marca los incumplimientos.",
    badges: ["Nuevo", "Avanzado"],
    benefits: [
      "Detecta posibles incumplimientos antes de presentar el proyecto",
      "Menos rechazos y observaciones de las entidades",
      "Reduce retrasos y sobrecostos por correcciones tardías",
    ],
    recomendado: true,
    descripcionDetallada: "El sistema contrasta los documentos y planos del proyecto contra la normativa aplicable, usos de suelo, retiros, alturas, requisitos por tipo de proyecto, y señala posibles incumplimientos antes de presentar ante la entidad. Reduce el riesgo de rechazos, observaciones y retrasos costosos.",
    summary: {
      what_it_is: "Un revisor con IA que compara el proyecto contra la normativa aplicable y marca lo que no cumple.",
      for_who: ["Dirección de proyecto", "Arquitectura", "Legal o gestoría"],
      requirements: ["Documentación del proyecto", "Normativa de referencia"],
      output: "Reporte de posibles incumplimientos con la referencia normativa.",
    },
    indicators: { time_estimate: "3 semanas", complexity: "Alta", integrations: ["Gestión documental", "IA"] },
    how_it_works_steps: [
      { title: "Carga del proyecto y la norma", short: "Subimos planos y la normativa aplicable.", detail: "Por tipo de proyecto, zona y entidad." },
      { title: "Contraste con IA", short: "Compara el proyecto contra cada requisito.", detail: "Usos de suelo, retiros, alturas y requisitos técnicos." },
      { title: "Reporte de hallazgos", short: "Marca los posibles incumplimientos.", detail: "Con la referencia exacta de la norma para corregir." },
    ],
    customization: {
      options_blocks: [{ type: "select", label: "Alcance de la revisión", options: ["Urbanística", "Técnica", "Ambas"] }],
      free_text_placeholder: "¿Qué normativa aplica a su proyecto y zona?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Reemplaza la revisión del arquitecto o el abogado?", a: "No. Es un primer filtro que les ahorra tiempo y reduce el riesgo de que algo se escape." },
    ],
    pasos: [
      "Cargamos el proyecto y la normativa aplicable.",
      "La IA contrasta cada requisito contra los planos y documentos.",
      "Entrega un reporte de posibles incumplimientos con su referencia.",
    ],
    personalizacion: "Cargamos la normativa específica de su cantón y tipo de proyecto para que la revisión sea relevante.",
    related_processes: ["control-permisos-tramites", "gestion-documental-proyecto"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["Gestión documental", "IA"],
    dolores: [
      "Los rechazos por incumplimientos generan retrasos costosos",
      "Nadie revisa el proyecto completo contra la norma a tiempo",
      "Las observaciones de la entidad aparecen cuando ya es tarde",
    ],
    integration_domains: ["OTHER"],
    landing_slug: "construccion",
    bloque_negocio: "B4",
    modulo_codigo: "4.5",
  },
  {
    id: "CN24",
    codigo: "5.1",
    slug: "cobranza-cuotas-atrasadas",
    nombre: "Recordatorios automáticos de cuotas atrasadas",
    tagline: "Cobre a tiempo sin perseguir a nadie: el sistema recuerda cada cuota atrasada por usted.",
    one_liner: "Recordatorios de pago automáticos que mejoran la cobranza sin fricción.",
    badges: ["Nuevo", "Recomendado"],
    benefits: [
      "Mejora la efectividad de cobranza sin perseguir pagos a mano",
      "Protege el flujo de caja del proyecto",
      "Recordatorios por el canal correcto, con el tono adecuado a la mora",
    ],
    recomendado: true,
    descripcionDetallada: "El sistema monitorea los pagos de cada comprador y, cuando una cuota se atrasa, envía recordatorios automáticos por el canal correcto, escalando el tono según los días de mora. Mejora la cobranza y protege el flujo de caja del proyecto, sin que el equipo administrativo persiga pagos uno por uno.",
    summary: {
      what_it_is: "Un sistema que detecta cuotas atrasadas y gestiona los recordatorios de cobro automáticamente.",
      for_who: ["Administración", "Dirección financiera", "Cobranzas"],
      requirements: ["Sistema de pagos o cartera", "Canal de comunicación"],
      output: "Recordatorios enviados y estado de mora actualizado.",
    },
    indicators: { time_estimate: "2 semanas", complexity: "Baja", integrations: ["CRM", "Comunicaciones"] },
    how_it_works_steps: [
      { title: "Monitoreo de cartera", short: "Revisa los vencimientos de cada comprador.", detail: "Detecta cada cuota que entra en mora." },
      { title: "Recordatorio automático", short: "Envía el aviso por el canal correcto.", detail: "WhatsApp, correo o mensaje, según el comprador." },
      { title: "Escalado por mora", short: "Ajusta el tono según los días de atraso.", detail: "Y avisa a administración cuando requiere gestión humana." },
    ],
    customization: {
      options_blocks: [{ type: "select", label: "Canal principal", options: ["WhatsApp", "Correo", "Ambos"] }],
      free_text_placeholder: "¿Cuál es su política de recordatorios de cobro hoy?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿No molesta al comprador?", a: "El tono se gradúa según la mora y se respeta el canal que prefiere; es firme pero cuidado." },
    ],
    pasos: [
      "El sistema detecta las cuotas que entran en mora.",
      "Envía recordatorios automáticos por el canal correcto.",
      "Escala el tono y avisa a administración según los días de atraso.",
    ],
    personalizacion: "Definimos la secuencia de recordatorios, los canales y el tono según su política de cobranza.",
    related_processes: ["estado-cuenta-conciliacion", "facturacion-automatica-obra"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["CRM", "Comunicaciones"],
    dolores: [
      "La cobranza consume horas de seguimiento manual",
      "Los atrasos golpean el flujo de caja del proyecto",
      "Los recordatorios se mandan tarde o no se mandan",
    ],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion",
    bloque_negocio: "B5",
    modulo_codigo: "5.1",
  },
  {
    id: "CN25",
    codigo: "5.2",
    slug: "estado-cuenta-conciliacion",
    nombre: "Estado de cuenta y conciliación de pagos",
    tagline: "Cada comprador con su estado de cuenta al día y los pagos conciliados solos.",
    one_liner: "Pagos conciliados y estado de cuenta del comprador siempre al día.",
    badges: ["Nuevo"],
    benefits: [
      "Pagos conciliados automáticamente, sin cuadrar a mano",
      "Estado de cuenta del comprador siempre actualizado",
      "Menos consultas a administración por cuánto se debe",
    ],
    recomendado: false,
    descripcionDetallada: "El sistema concilia automáticamente los pagos recibidos contra la cartera de cada comprador y mantiene su estado de cuenta actualizado: cuánto ha pagado, cuánto debe y qué viene. El comprador puede consultarlo y administración deja de cuadrar pagos a mano.",
    summary: {
      what_it_is: "Un sistema que concilia los pagos y mantiene el estado de cuenta de cada comprador al día.",
      for_who: ["Administración", "Compradores", "Dirección financiera"],
      requirements: ["Sistema de pagos o banco", "Cartera de compradores"],
      output: "Estado de cuenta conciliado por comprador.",
    },
    indicators: { time_estimate: "2-3 semanas", complexity: "Media", integrations: ["ERP", "CRM"] },
    how_it_works_steps: [
      { title: "Lectura de pagos", short: "Toma los pagos del banco o pasarela.", detail: "Los asocia al comprador y a su cuota." },
      { title: "Conciliación", short: "Cuadra lo recibido contra lo esperado.", detail: "Marca pagos parciales o no identificados." },
      { title: "Estado al día", short: "Actualiza el estado de cuenta.", detail: "Disponible para el comprador y administración." },
    ],
    customization: {
      options_blocks: [{ type: "select", label: "Acceso del comprador", options: ["Portal web", "Envío automático", "Solo interno"] }],
      free_text_placeholder: "¿Cómo recibe hoy los pagos de sus compradores?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Funciona con pagos por banco y por pasarela?", a: "Sí, integra ambas fuentes y las concilia contra la cartera." },
    ],
    pasos: [
      "El sistema toma los pagos recibidos del banco o pasarela.",
      "Los concilia contra la cuota esperada de cada comprador.",
      "Actualiza el estado de cuenta y marca lo pendiente.",
    ],
    personalizacion: "Conectamos su banco o pasarela y su cartera para conciliar como usted la lleva.",
    related_processes: ["cobranza-cuotas-atrasadas", "facturacion-automatica-obra"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["ERP", "CRM"],
    dolores: [
      "Cuadrar pagos a mano consume tiempo y genera errores",
      "El comprador pregunta a cada rato cuánto debe",
      "No hay un estado de cuenta claro y al día por comprador",
    ],
    integration_domains: ["ERP", "CRM"],
    landing_slug: "construccion",
    bloque_negocio: "B5",
    modulo_codigo: "5.2",
  },
  {
    id: "CN26",
    codigo: "5.3",
    slug: "facturacion-automatica-obra",
    nombre: "Facturación automática",
    tagline: "Las facturas de cada pago, emitidas y enviadas solas, sin trabajo administrativo.",
    one_liner: "Factura emitida y enviada automáticamente con cada pago.",
    badges: ["Nuevo"],
    benefits: [
      "Facturas emitidas y enviadas sin trabajo manual",
      "Cumplimiento del formato fiscal sin errores",
      "Administración libera horas de tareas repetitivas",
    ],
    recomendado: false,
    descripcionDetallada: "Cada vez que se registra un pago, el sistema genera la factura con los datos correctos, cumple el formato fiscal correspondiente y la envía al comprador automáticamente. Administración deja de emitir facturas una por una y se evitan errores y atrasos.",
    summary: {
      what_it_is: "Un sistema que emite y envía la factura de cada pago automáticamente.",
      for_who: ["Administración", "Contabilidad"],
      requirements: ["Sistema de facturación electrónica", "Registro de pagos"],
      output: "Factura emitida, enviada y archivada.",
    },
    indicators: { time_estimate: "2 semanas", complexity: "Baja", integrations: ["ERP", "DOCS"] },
    how_it_works_steps: [
      { title: "Disparo por pago", short: "Detecta el pago registrado.", detail: "Toma los datos del comprador y la operación." },
      { title: "Emisión fiscal", short: "Genera la factura en el formato correcto.", detail: "Cumpliendo los requisitos fiscales correspondientes." },
      { title: "Envío y archivo", short: "La envía al comprador y la archiva.", detail: "Sin que administración intervenga." },
    ],
    customization: {
      options_blocks: [{ type: "select", label: "Sistema fiscal", options: ["Factura electrónica local", "ERP propio", "Por definir"] }],
      free_text_placeholder: "¿Con qué sistema factura hoy?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Se adapta a la factura electrónica de Costa Rica?", a: "Sí, se configura según el sistema fiscal y las series de su empresa." },
    ],
    pasos: [
      "El sistema detecta el pago registrado.",
      "Genera la factura con el formato fiscal correcto.",
      "La envía al comprador y la archiva automáticamente.",
    ],
    personalizacion: "Adaptamos la facturación a su sistema fiscal y a sus plantillas y series.",
    related_processes: ["estado-cuenta-conciliacion", "registro-albaranes-proveedor"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["ERP", "DOCS"],
    dolores: [
      "Emitir facturas una por una consume horas",
      "Los errores de facturación generan retrabajo",
      "Las facturas salen tarde tras cada pago",
    ],
    integration_domains: ["ERP", "DOCS"],
    landing_slug: "construccion",
    bloque_negocio: "B5",
    modulo_codigo: "5.3",
  },
  {
    id: "CN27",
    codigo: "5.4",
    slug: "reporte-inversionistas-socios",
    nombre: "Reporte a inversionistas y socios",
    tagline: "Cada inversionista con un reporte claro del proyecto, sin armarlo a mano cada mes.",
    one_liner: "Reporte de avance comercial, obra y caja para sus inversionistas, automático.",
    badges: ["Nuevo"],
    benefits: [
      "Reporte a inversionistas generado y enviado solo",
      "Una sola fuente con avance comercial, obra y caja",
      "Transmite control y profesionalismo a los socios",
    ],
    recomendado: false,
    descripcionDetallada: "El sistema reúne el avance comercial, el avance de obra y el flujo de caja del proyecto en un reporte claro para inversionistas y socios, generado y enviado de forma automática en la periodicidad que defina. Transmite control y profesionalismo sin que dirección dedique días a prepararlo.",
    summary: {
      what_it_is: "Un sistema que consolida el estado del proyecto en un reporte para inversionistas y lo envía automáticamente.",
      for_who: ["Dirección general", "Socios e inversionistas"],
      requirements: ["Datos de ventas, obra y finanzas"],
      output: "Reporte de inversionistas consolidado y enviado.",
    },
    indicators: { time_estimate: "2-3 semanas", complexity: "Media", integrations: ["BI", "IA"] },
    how_it_works_steps: [
      { title: "Consolidación", short: "Reúne ventas, obra y caja.", detail: "Desde el CRM, la gestión de obra y finanzas." },
      { title: "Reporte claro", short: "Arma el informe para inversionistas.", detail: "Con los indicadores que cada socio espera ver." },
      { title: "Envío periódico", short: "Lo envía en la periodicidad definida.", detail: "Mensual, trimestral o cuando lo pida." },
    ],
    customization: {
      options_blocks: [{ type: "select", label: "Periodicidad", options: ["Mensual", "Trimestral", "Por hito"] }],
      free_text_placeholder: "¿Qué indicadores esperan ver sus inversionistas?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Cada socio puede ver solo su proyecto?", a: "Sí, el reporte se segmenta por proyecto e inversionista según corresponda." },
    ],
    pasos: [
      "El sistema consolida avance comercial, de obra y de caja.",
      "Arma el reporte para inversionistas con los indicadores clave.",
      "Lo envía automáticamente en la periodicidad definida.",
    ],
    personalizacion: "Definimos los indicadores y el formato que sus inversionistas esperan ver.",
    related_processes: ["panel-ejecutivo-multiproyecto", "dashboard-comercial-tiempo-real"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["BI", "IA"],
    dolores: [
      "Preparar el reporte a inversionistas toma días",
      "La información de ventas, obra y caja vive en sistemas distintos",
      "Los socios no reciben un reporte claro y a tiempo",
    ],
    integration_domains: ["OTHER"],
    landing_slug: "construccion",
    bloque_negocio: "B5",
    modulo_codigo: "5.4",
  },
  {
    id: "CN28",
    codigo: "6.1",
    slug: "entrega-vivienda-digital",
    nombre: "Entrega de vivienda digital",
    tagline: "La entrega de cada vivienda ordenada: acta, checklist y manuales, sin papeleo suelto.",
    one_liner: "Acta, checklist y manuales de entrega, gestionados digitalmente.",
    badges: ["Nuevo"],
    benefits: [
      "Entrega ordenada y documentada de cada vivienda",
      "Acta firmada digitalmente, sin papeleo suelto",
      "El propietario recibe sus manuales y garantías desde el primer día",
    ],
    recomendado: false,
    descripcionDetallada: "El sistema guía la entrega de cada vivienda: checklist de revisión, acta de entrega firmada digitalmente y manuales de la vivienda enviados al propietario. Deja registro de todo y arranca la relación de postventa de forma ordenada y profesional.",
    summary: {
      what_it_is: "Un flujo digital que ordena la entrega de la vivienda: checklist, acta firmada y manuales.",
      for_who: ["Posventa", "Dirección de proyecto", "Propietarios"],
      requirements: ["Firma digital", "Documentación de la vivienda"],
      output: "Entrega documentada con acta firmada y manuales enviados.",
    },
    indicators: { time_estimate: "2 semanas", complexity: "Baja", integrations: ["DOCS", "Firma Digital"] },
    how_it_works_steps: [
      { title: "Checklist de revisión", short: "Se revisa la vivienda punto por punto.", detail: "Con foto de cada observación pendiente." },
      { title: "Acta de entrega", short: "Se firma digitalmente en el momento.", detail: "Propietario y desarrolladora, sin imprimir." },
      { title: "Manuales y garantías", short: "Se envían al propietario al instante.", detail: "Inicia la postventa de forma ordenada." },
    ],
    customization: {
      options_blocks: [{ type: "select", label: "Formato del acta", options: ["Estándar", "Con anexo fotográfico", "Personalizada"] }],
      free_text_placeholder: "¿Qué revisa hoy en la entrega de cada vivienda?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Queda registro de las observaciones de entrega?", a: "Sí, con foto y firma; queda todo trazado para la postventa." },
    ],
    pasos: [
      "Se completa el checklist de revisión de la vivienda.",
      "Se firma el acta de entrega digitalmente.",
      "Se envían manuales y garantías al propietario.",
    ],
    personalizacion: "Adaptamos el checklist y el acta a los estándares de entrega de su desarrolladora.",
    related_processes: ["portal-propietarios-post-entrega", "gestion-garantias-plazos"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["DOCS", "Firma Digital"],
    dolores: [
      "La entrega se documenta en papel y se pierde",
      "La postventa arranca desordenada desde el primer día",
      "El propietario no recibe sus manuales ni garantías al entregar",
    ],
    integration_domains: ["DOCS"],
    landing_slug: "construccion",
    bloque_negocio: "B6",
    modulo_codigo: "6.1",
  },
  {
    id: "CN29",
    codigo: "6.3",
    slug: "gestion-garantias-plazos",
    nombre: "Gestión de garantías por plazos",
    tagline: "Cada garantía con su plazo controlado: sepa qué cubre y hasta cuándo, sin discusiones.",
    one_liner: "Las garantías de cada vivienda, controladas por plazo y cobertura.",
    badges: ["Nuevo"],
    benefits: [
      "Cada garantía controlada por plazo y cobertura",
      "Define al instante si una incidencia está cubierta",
      "Evita asumir costos de reparaciones fuera de garantía",
    ],
    recomendado: false,
    descripcionDetallada: "El sistema lleva el control de las garantías de cada vivienda por plazos, acabados, instalaciones, estructura, sabiendo qué cubre cada una y hasta cuándo. Cuando entra una incidencia, define al instante si está en garantía y a quién corresponde, evitando discusiones y costos que no tocan.",
    summary: {
      what_it_is: "Un control de las garantías de cada vivienda por plazo y cobertura, conectado a las incidencias.",
      for_who: ["Posventa", "Dirección técnica"],
      requirements: ["Datos de garantías por vivienda", "Sistema de incidencias"],
      output: "Estado de garantía por vivienda y por tipo de cobertura.",
    },
    indicators: { time_estimate: "2 semanas", complexity: "Baja", integrations: ["Gestión documental", "IA"] },
    how_it_works_steps: [
      { title: "Registro de garantías", short: "Cargamos las garantías por vivienda.", detail: "Con su plazo y lo que cubre cada una." },
      { title: "Cruce con la incidencia", short: "Al entrar una incidencia, valida la cobertura.", detail: "Define si está en garantía y a quién corresponde." },
      { title: "Control de vencimientos", short: "Avisa de garantías por vencer.", detail: "Para gestionar a tiempo lo pendiente." },
    ],
    customization: {
      options_blocks: [{ type: "select", label: "Tipos de garantía", options: ["Acabados", "Instalaciones", "Estructura", "Todas"] }],
      free_text_placeholder: "¿Qué plazos de garantía maneja su desarrolladora?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Se conecta con el portal de incidencias?", a: "Sí, cada incidencia se valida contra la garantía vigente de esa vivienda." },
    ],
    pasos: [
      "Cargamos las garantías de cada vivienda con su plazo y cobertura.",
      "Al entrar una incidencia, el sistema valida si está cubierta.",
      "Avisa de las garantías próximas a vencer.",
    ],
    personalizacion: "Configuramos los tipos de garantía y plazos según las condiciones de su desarrolladora.",
    related_processes: ["portal-propietarios-post-entrega", "entrega-vivienda-digital"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["Gestión documental", "IA"],
    dolores: [
      "Se asumen costos de reparaciones fuera de garantía",
      "Nadie tiene claro qué cubre cada garantía y hasta cuándo",
      "Al entrar una incidencia no se sabe si está en garantía",
    ],
    integration_domains: ["OTHER"],
    landing_slug: "construccion",
    bloque_negocio: "B6",
    modulo_codigo: "6.3",
  },
  {
    id: "CN30",
    codigo: "6.5",
    slug: "panel-ejecutivo-multiproyecto",
    nombre: "Panel ejecutivo multiproyecto",
    tagline: "Todos sus proyectos en una sola pantalla: ventas, obra y caja, sin pedir reportes.",
    one_liner: "El estado de todos sus proyectos, ventas, obra y caja, en un solo lugar.",
    badges: ["Nuevo", "Recomendado"],
    benefits: [
      "Todos los proyectos en una sola pantalla",
      "Compara avance comercial, obra y caja entre proyectos",
      "Decisiones con datos al día, sin pedir reportes a cada área",
    ],
    recomendado: true,
    descripcionDetallada: "Un panel para dirección que reúne el estado de todos los proyectos a la vez: avance comercial, avance de obra y flujo de caja, con alertas de los que se desvían. Permite decidir con datos al día y comparar proyectos sin pedir reportes a cada área.",
    summary: {
      what_it_is: "Un panel de dirección que consolida el estado de todos los proyectos en tiempo real.",
      for_who: ["Dirección general", "Socios", "Gerencia"],
      requirements: ["Datos de ventas, obra y finanzas de cada proyecto"],
      output: "Panel multiproyecto con avance comercial, obra y caja.",
    },
    indicators: { time_estimate: "3 semanas", complexity: "Media", integrations: ["BI", "IA"] },
    how_it_works_steps: [
      { title: "Integración de proyectos", short: "Conecta los datos de cada proyecto.", detail: "Ventas, obra y finanzas en un mismo lugar." },
      { title: "Vista ejecutiva", short: "Muestra el estado de todos a la vez.", detail: "Con los indicadores clave por proyecto." },
      { title: "Alertas de desvío", short: "Resalta los proyectos en riesgo.", detail: "Para actuar antes de que el problema crezca." },
    ],
    customization: {
      options_blocks: [{ type: "select", label: "Indicadores principales", options: ["Comercial", "Obra", "Caja", "Todos"] }],
      free_text_placeholder: "¿Cuántos proyectos lleva en paralelo y qué necesita comparar?",
    },
    demo: { video_url: "PENDING" },
    faqs: [
      { q: "¿Sirve si cada proyecto usa herramientas distintas?", a: "Sí, integra las fuentes de cada proyecto y las unifica en una sola vista." },
    ],
    pasos: [
      "Conectamos los datos de ventas, obra y caja de cada proyecto.",
      "El panel muestra el estado de todos los proyectos a la vez.",
      "Resalta los proyectos que se desvían para actuar a tiempo.",
    ],
    personalizacion: "Definimos los indicadores y el comparativo entre proyectos que dirección necesita ver.",
    related_processes: ["reporte-inversionistas-socios", "dashboard-comercial-tiempo-real"],
    sectores: ["Construcción & Reformas", "Inmobiliaria"],
    herramientas: ["BI", "IA"],
    dolores: [
      "Dirección no tiene una vista única de todos los proyectos",
      "Comparar proyectos exige pedir reportes a cada área",
      "Los proyectos que se desvían se detectan demasiado tarde",
    ],
    integration_domains: ["OTHER"],
    landing_slug: "construccion",
    bloque_negocio: "B6",
    modulo_codigo: "6.5",
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
    hidden: true,
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
    sectores: ["Centros Deportivos", "Gestoria", "Construcción & Reformas", "E-commerce", "Inmobiliaria", "Agencia/marketing"],
    herramientas: ["Make", "Zapier", "Instagram Business API", "WhatsApp Business API", "Notion", "Airtable", "HubSpot", "Pipedrive"],
    dolores: ["Las solicitudes llegan por 5 canales distintos y siempre se pierde alguna", "No hay un registro único de leads entrantes"],
    integration_domains: ["CRM", "COMMS"],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SECTOR GASTRONOMÍA / HOSTELERÍA — 16 procesos · 6 bloques
  // Cada proceso es exclusivo de este sector (no se reutiliza)
  // ══════════════════════════════════════════════════════════════════════════

  // ── BLOQUE B1 · Reservas y atención 24/7 ────────────────────────────────
  {
    id: "GAST-1.1",
    codigo: "1.1",
    slug: "gastro-voz-reservas-247",
    categoria: "B1",
    categoriaNombre: "Reservas y atención 24/7",
    nombre: "Asistente de voz para reservas 24/7",
    tagline: "Una voz natural atiende cada llamada — incluso a las 23h — y deja la reserva confirmada en tu sistema.",
    recomendado: true,
    descripcionDetallada: "Una voz IA atiende las llamadas que entran fuera de horario, en hora punta o cuando la sala está hasta arriba. Pregunta fecha, hora, comensales y alergias, comprueba disponibilidad en tu sistema de reservas y deja la mesa confirmada. Si el restaurante está lleno, ofrece alternativas o anota al cliente en lista de espera. Atiende en castellano natural y maneja interrupciones del cliente sin perder el hilo.",
    summary: {
      what_it_is: "Recepcionista IA por voz, conectado a tu sistema de reservas, que atiende 24/7 sin perder ni una sola llamada.",
      for_who: ["Restaurantes con alto volumen de llamadas", "Locales con horario partido", "Grupos con varios locales"],
      requirements: ["Sistema de reservas (Covermanager, Tock, The Fork…) o agenda propia", "Línea telefónica derivable a la IA"],
      output: "Reserva confirmada en el sistema + confirmación al cliente (SMS/WhatsApp) sin que nadie del equipo descuelgue el teléfono."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["Telefonía", "Sistema de reservas", "WhatsApp/SMS"]
    },
    how_it_works_steps: [
      { title: "Atiende la llamada", short: "Voz natural, no robótica.", detail: "El asistente responde con la voz y el tono del local, identifica que el cliente quiere reservar y se presenta como parte del restaurante." },
      { title: "Recoge datos", short: "Fecha, hora, comensales, alergias.", detail: "Pregunta lo justo, confirma cada dato y maneja correcciones sobre la marcha (\"perdón, mejor a las 22h\")." },
      { title: "Comprueba disponibilidad", short: "En tiempo real contra tu sistema.", detail: "Consulta Covermanager/Tock al instante. Si no hay hueco a esa hora, propone alternativas cercanas o lista de espera." },
      { title: "Confirma y registra", short: "Reserva creada + confirmación al cliente.", detail: "Crea la reserva en el sistema, envía WhatsApp/SMS de confirmación y deja la llamada cerrada con todos los datos." }
    ],
    benefits: [
      "Cero llamadas perdidas — el teléfono nunca queda sin atender",
      "Voz natural en castellano, no suena robot",
      "Sincronización directa con Covermanager, Tock o tu sistema actual"
    ],
    pasos: [
      "La llamada entra al número del restaurante (o se desvía a la IA fuera de horario)",
      "El asistente saluda con el nombre del local y pregunta en qué puede ayudar",
      "Si es una reserva: recoge fecha, hora, comensales, nombre y alergias",
      "Comprueba disponibilidad en tu sistema de reservas en tiempo real",
      "Crea la reserva o propone alternativas si no hay hueco",
      "Envía confirmación al cliente por el canal elegido (WhatsApp/SMS)"
    ],
    personalizacion: "Define el tono de voz, qué datos pedir, qué hacer en lleno (lista de espera, alternativas, derivar a humano), horarios de cobertura IA vs. humanos y el canal de confirmación.",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["Vapi", "ElevenLabs", "Covermanager / Tock / TheFork", "Twilio", "WhatsApp Business API"],
    canales: ["Voz / Teléfono"],
    dolores: [
      "Perdemos reservas porque no podemos atender el teléfono en hora punta",
      "Fuera de horario el contestador no recoge nada útil",
      "Una persona dedicada solo al teléfono cuesta lo mismo que un cocinero"
    ],
    integration_domains: ["COMMS", "OTHER"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B1",
    modulo_codigo: "1.1",
    related_processes: ["gastro-reservas-multicanal", "gastro-recordatorios-noshows"]
  },
  {
    id: "GAST-1.2",
    codigo: "1.2",
    slug: "gastro-reservas-multicanal",
    categoria: "B1",
    categoriaNombre: "Reservas y atención 24/7",
    nombre: "Reservas desde WhatsApp, Instagram y web",
    tagline: "El cliente reserva desde donde te encuentre — un DM, un WhatsApp, un botón en la web — sin duplicados ni mesas perdidas.",
    recomendado: true,
    descripcionDetallada: "Unificamos todos los canales de reserva entrantes en una única bandeja. El cliente pide mesa desde Instagram DM, WhatsApp o el botón de la web y la reserva cae al mismo sistema, sin duplicados y sin que el equipo tenga que copiar datos a mano. Si la disponibilidad cambia (cancelación, hueco abierto), se refleja al instante en todos los canales.",
    summary: {
      what_it_is: "Un panel único de reservas que recoge entradas desde redes sociales, WhatsApp y la web, eliminando saltos manuales entre apps.",
      for_who: ["Restaurantes con presencia activa en Instagram", "Locales que reciben DMs pidiendo mesa", "Negocios que no quieren depender solo del teléfono"],
      requirements: ["Cuenta Instagram Business", "WhatsApp Business API", "Sistema de reservas con webhook (o agenda compartida)"],
      output: "Todas las reservas en una sola vista, con el canal de origen marcado y sin duplicados."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Instagram", "WhatsApp", "Web", "Sistema de reservas"]
    },
    how_it_works_steps: [
      { title: "Escucha multicanal", short: "DMs, WhatsApp y web a la vez.", detail: "El sistema monitoriza cada canal en paralelo y detecta intención de reserva incluso en mensajes informales." },
      { title: "Conversa y recoge", short: "Pide solo lo necesario.", detail: "Pregunta fecha, hora, comensales y alergias en el mismo canal donde escribe el cliente — sin obligarle a saltar a otra app." },
      { title: "Confirma y centraliza", short: "Una sola bandeja, sin duplicados.", detail: "Crea la reserva en tu sistema único, marca el canal de origen y avisa al equipo si requiere atención humana." }
    ],
    benefits: [
      "Un único panel para todos los canales — adiós a saltar entre apps",
      "Sin duplicados ni reservas perdidas",
      "El cliente reserva donde ya está, no donde tú quieres"
    ],
    pasos: [
      "Conectamos Instagram DM, WhatsApp Business y un widget de la web",
      "Detectamos automáticamente cuándo un mensaje es petición de reserva",
      "Recogemos los datos en el propio canal sin obligar a cambiar de app",
      "Creamos la reserva en tu sistema único y marcamos el canal de origen",
      "Notificamos al equipo si hay algo fuera de lo previsto (grupos grandes, peticiones especiales)"
    ],
    personalizacion: "Elige qué canales activar, el tono de cada uno, qué datos pedir y qué se considera 'caso especial' para escalar al equipo (grupos >8 personas, peticiones VIP, eventos).",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["Instagram Business API", "WhatsApp Business API", "Make/n8n", "Covermanager / Tock"],
    canales: ["Instagram", "WhatsApp", "Web"],
    dolores: [
      "Los DMs de Instagram pidiendo mesa se nos pasan",
      "El equipo está copiando datos de WhatsApp al sistema de reservas a mano",
      "Tenemos reservas duplicadas por venir del mismo cliente por dos canales"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B1",
    modulo_codigo: "1.2",
    related_processes: ["gastro-voz-reservas-247", "gastro-recordatorios-noshows", "gastro-chatbot-info"]
  },
  {
    id: "GAST-1.3",
    codigo: "1.3",
    slug: "gastro-recordatorios-noshows",
    categoria: "B1",
    categoriaNombre: "Reservas y atención 24/7",
    nombre: "Recordatorios y confirmación anti no-shows",
    tagline: "Un mensaje previo pide confirmación. Si el cliente cancela, esa mesa se ofrece al instante a la lista de espera.",
    recomendado: true,
    descripcionDetallada: "Antes del servicio, el sistema envía un mensaje al cliente pidiendo confirmación de la reserva. Si responde 'sí', mesa segura. Si dice que no puede, esa mesa se libera y se ofrece automáticamente a quien estaba en lista de espera. Resultado: caída del 30-50% en no-shows y mejor ocupación real de sala.",
    summary: {
      what_it_is: "Sistema automático de confirmación pre-servicio que reduce no-shows y rescata mesas para la lista de espera.",
      for_who: ["Restaurantes con problema de no-shows", "Locales con lista de espera frecuente", "Restaurantes con menú degustación o producto de coste alto"],
      requirements: ["Sistema de reservas con datos de contacto", "WhatsApp Business o SMS"],
      output: "Tasa de no-show baja del 15-20% típico al 5-8%, con mesas canceladas rescatadas en tiempo real."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["WhatsApp/SMS", "Sistema de reservas"]
    },
    how_it_works_steps: [
      { title: "Mensaje pre-servicio", short: "24h y 2h antes.", detail: "Enviamos un mensaje amable pidiendo confirmación. El cliente solo tiene que responder un emoji o un 'sí/no'." },
      { title: "Liberación automática", short: "Si cancela, la mesa vuela.", detail: "Si el cliente no puede venir, su mesa se libera al instante y se ofrece al primero de la lista de espera." },
      { title: "Rescate de mesa", short: "Lista de espera activa.", detail: "Ofrecemos automáticamente la mesa libre al siguiente cliente en lista de espera vía WhatsApp con respuesta directa." }
    ],
    benefits: [
      "Caída del 30-50% en no-shows",
      "Mesas canceladas se rescatan al instante",
      "Lista de espera funcional, no decorativa"
    ],
    pasos: [
      "Detectamos las reservas del día siguiente (24h antes) o del turno (2h antes)",
      "Enviamos confirmación amable por el canal del cliente (WhatsApp o SMS)",
      "Si confirma → mesa lista. Si cancela → mesa libre",
      "Notificamos al primero de la lista de espera con el hueco liberado",
      "Si nadie responde a la confirmación, alertamos al equipo en sala"
    ],
    personalizacion: "Define cuándo se envía el mensaje (24h, 2h, ambos), el tono del recordatorio y las reglas de lista de espera (orden, tiempo de respuesta, etc.).",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["WhatsApp Business API", "Twilio", "Covermanager / Tock", "Make/n8n"],
    canales: ["WhatsApp", "SMS"],
    dolores: [
      "Cada noche tenemos 2-3 mesas que no aparecen sin avisar",
      "Tenemos lista de espera pero cuando alguien cancela no le ofrecemos la mesa a nadie",
      "Las pérdidas por no-shows en menú degustación son enormes"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B1",
    modulo_codigo: "1.3",
    related_processes: ["gastro-voz-reservas-247", "gastro-reservas-multicanal"]
  },
  {
    id: "GAST-1.4",
    codigo: "1.4",
    slug: "gastro-chatbot-info",
    categoria: "B1",
    categoriaNombre: "Reservas y atención 24/7",
    nombre: "Chatbot con toda la información del restaurante",
    tagline: "Un asistente que conoce la carta, horarios, alérgenos, ubicación, precio medio y eventos — y lo cuenta cuando se lo pregunten.",
    recomendado: true,
    descripcionDetallada: "Un asistente conversacional disponible en WhatsApp, Instagram DM y el chat de la web que tiene en la cabeza toda la información del restaurante: carta y precios, horarios, alérgenos y opciones especiales (sin gluten, vegano), ubicación y cómo llegar, eventos próximos, política de grupos, parking, terraza, mascotas, etc. Responde al instante 24/7 con la información actualizada y, cuando la conversación llega a 'quiero reservar', deriva o gestiona la reserva directamente.",
    summary: {
      what_it_is: "Base de conocimiento conversacional del restaurante accesible por chat. Respuestas instantáneas a todas las preguntas frecuentes que ahogan al equipo.",
      for_who: ["Restaurantes con muchas preguntas repetidas", "Locales con carta amplia o cambiante", "Negocios con eventos o programación variable"],
      requirements: ["Carta y datos del local actualizados", "WhatsApp Business o widget web", "Cuenta Instagram Business (opcional)"],
      output: "Cliente informado al instante 24/7. Ahorras al equipo 1-2 horas al día de preguntas repetidas."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja-Media",
      integrations: ["WhatsApp", "Instagram", "Web", "IA / Base de conocimiento"]
    },
    how_it_works_steps: [
      { title: "Carga la información", short: "Carta, horarios, todo.", detail: "Subimos carta con precios, alérgenos, horarios por día, ubicación, política de grupos, eventos. Se actualiza cuando tú la actualizas." },
      { title: "Responde 24/7", short: "Instantáneo, en el canal del cliente.", detail: "Da respuestas precisas a las preguntas habituales: '¿tenéis terraza?', '¿abrís el lunes?', '¿tenéis opciones sin gluten?', '¿precio medio?'." },
      { title: "Deriva a venta", short: "Cuando hay intención de reservar.", detail: "Si la conversación se orienta a reservar, conecta con tu sistema de reservas o pasa el contacto al humano con todo el contexto." }
    ],
    benefits: [
      "Cero preguntas repetidas para el equipo",
      "Información correcta y actualizada 24/7",
      "Conversaciones que terminan en reserva, no en silencio"
    ],
    pasos: [
      "Recopilamos toda la información del restaurante (carta, horarios, datos)",
      "Entrenamos al asistente para responder en el tono del local",
      "Lo conectamos a los canales donde te escriben los clientes",
      "Responde dudas al instante con información actualizada",
      "Cuando detecta intención de reservar, gestiona o deriva con contexto"
    ],
    personalizacion: "Define el tono del asistente, qué información incluir, qué preguntas escalar siempre a humano y cuándo proponer activamente reservar.",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["OpenAI / Claude", "WhatsApp Business API", "Instagram Business", "Make/n8n"],
    canales: ["WhatsApp", "Instagram", "Web"],
    dolores: [
      "Todos los días respondemos las mismas 10 preguntas (horarios, sin gluten, terraza)",
      "El equipo está atendiendo el móvil en vez de la sala",
      "Damos información incorrecta o desactualizada por las prisas"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B1",
    modulo_codigo: "1.4",
    related_processes: ["gastro-reservas-multicanal", "gastro-voz-reservas-247"]
  },

  // ── BLOQUE B2 · Reputación y reseñas ────────────────────────────────────
  {
    id: "GAST-2.1",
    codigo: "2.1",
    slug: "gastro-solicitud-resenas",
    categoria: "B2",
    categoriaNombre: "Reputación y reseñas",
    nombre: "Solicitud automática de reseñas",
    tagline: "Al día siguiente de la visita, los clientes contentos reciben un mensaje pidiendo reseña. Los descontentos van a canal privado.",
    recomendado: true,
    descripcionDetallada: "Después de cada servicio, el sistema detecta cuándo es el momento óptimo para pedir reseña (típicamente al día siguiente, no en caliente). Envía un mensaje breve y personal al cliente. Si la experiencia fue positiva, lo guía a dejar reseña en Google o TripAdvisor. Si detecta señales de descontento, deriva la conversación al responsable en privado para que pueda gestionarlo antes de que se convierta en una reseña pública negativa.",
    summary: {
      what_it_is: "Sistema automático de solicitud de reseñas con filtro de descontento — más reseñas reales, menos sorpresas públicas.",
      for_who: ["Restaurantes que quieren crecer en Google Maps", "Locales que necesitan reseñas frescas para posicionar", "Negocios que ya tienen buen producto pero pocas reseñas"],
      requirements: ["Sistema de reservas con datos de contacto", "WhatsApp/Email", "Ficha en Google Business activa"],
      output: "Crecimiento orgánico de reseñas reales en Google + ratio mejor de positivas vs. negativas públicas."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["WhatsApp/Email", "Google Business", "Sistema de reservas"]
    },
    how_it_works_steps: [
      { title: "Detecta el momento", short: "Día siguiente, no en caliente.", detail: "Tras el servicio, esperamos al momento de mayor satisfacción procesada (típicamente 18-24h después) para pedir reseña." },
      { title: "Pregunta breve", short: "Una sola pregunta sencilla.", detail: "Mensaje corto y personal: '¿Cómo te trataron ayer?'. Si responde bien → enlace a Google. Si responde mal → conversación privada." },
      { title: "Gestión de descontentos", short: "En privado, no en público.", detail: "Si el cliente menciona algo negativo, derivamos al responsable con todo el contexto para gestionar antes de que sea reseña pública." }
    ],
    benefits: [
      "Más reseñas 5★ pidiendo en el momento de máxima satisfacción",
      "Filtro de descontentos a canal privado — protege reputación",
      "Crecimiento orgánico de reseñas reales en Google Maps"
    ],
    pasos: [
      "Detectamos las reservas servidas del día anterior",
      "Enviamos mensaje breve de seguimiento al cliente",
      "Si la respuesta es positiva → enlace directo a reseña Google",
      "Si la respuesta es negativa o tibia → conversación privada con el responsable",
      "Registramos la interacción para análisis de tendencias"
    ],
    personalizacion: "Define cuándo se envía (24h, 48h), el tono, el canal (WhatsApp/email), qué responsable recibe los descontentos y si quieres añadir incentivo (descuento próxima visita).",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["WhatsApp Business API", "Resend/SendGrid", "Google Business API", "Make/n8n"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "Tenemos clientes contentos pero pocas reseñas en Google",
      "Las únicas reseñas que dejan son las quejas",
      "La competencia tiene 800 reseñas y nosotros 80"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B2",
    modulo_codigo: "2.1",
    related_processes: ["gastro-alertas-resenas-negativas"]
  },
  {
    id: "GAST-2.2",
    codigo: "2.2",
    slug: "gastro-alertas-resenas-negativas",
    categoria: "B2",
    categoriaNombre: "Reputación y reseñas",
    nombre: "Alertas de reseñas negativas en tiempo real",
    tagline: "Cuando alguien deja una reseña <3★, recibes el aviso al instante con borrador de respuesta listo para revisar.",
    recomendado: false,
    descripcionDetallada: "Monitorizamos Google, TripAdvisor, TheFork y otras plataformas. Cuando alguien publica una reseña por debajo de 3 estrellas, el responsable recibe una notificación inmediata por WhatsApp o email con la reseña, el contexto del cliente (si reservó, qué tomó), y un borrador de respuesta generado por IA en el tono del local. Solo tienes que revisar, ajustar si quieres y publicar. Cero reseñas malas sin responder, cero respuestas tardías.",
    summary: {
      what_it_is: "Sistema de monitorización + alerta + asistencia de respuesta para reseñas negativas en todas las plataformas relevantes.",
      for_who: ["Restaurantes presentes en Google + TripAdvisor + TheFork", "Locales que cuidan reputación online", "Grupos con varios locales que necesitan visibilidad consolidada"],
      requirements: ["Acceso a Google Business", "Cuenta TripAdvisor/TheFork (opcional)"],
      output: "100% de las reseñas <3★ con respuesta en menos de 24h, redactadas en el tono del local."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["Google Business", "TripAdvisor", "WhatsApp/Email"]
    },
    how_it_works_steps: [
      { title: "Monitoriza 24/7", short: "Todas las plataformas, en tiempo real.", detail: "Vigilamos Google, TripAdvisor, TheFork y cualquier otra plataforma donde estés presente." },
      { title: "Alerta inmediata", short: "Aviso con contexto y borrador.", detail: "Si aparece una reseña <3★, el responsable recibe notificación con la reseña, el contexto del cliente y un borrador de respuesta IA." },
      { title: "Respuesta humana asistida", short: "Tú revisas y publicas.", detail: "El borrador respeta el tono del local. Solo revisas, ajustas si quieres, y publicas. Cero reseñas malas sin responder." }
    ],
    benefits: [
      "Alerta inmediata cuando publican una reseña <3★",
      "Borrador de respuesta generado con IA en el tono del local",
      "Cero reseñas malas sin responder ni respuestas tardías"
    ],
    pasos: [
      "Monitorizamos las plataformas de reseñas en tiempo real",
      "Detectamos reseñas por debajo del umbral definido (por defecto 3★)",
      "Buscamos contexto del cliente en tu sistema (si reservó, fecha, mesa)",
      "Generamos borrador de respuesta personalizado en el tono del local",
      "Te enviamos alerta con todo + opción de aprobar/editar/rechazar"
    ],
    personalizacion: "Define el umbral de estrellas que activa la alerta, plataformas a monitorizar, tono de la respuesta IA y quién recibe la alerta.",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["Google Business API", "TripAdvisor", "OpenAI", "WhatsApp Business / Email"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "Nos enteramos de las reseñas malas días después",
      "No sabemos qué responder ni con qué tono",
      "Cuando respondemos, ya nadie las ve"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B2",
    modulo_codigo: "2.2",
    related_processes: ["gastro-solicitud-resenas"]
  },

  // ── BLOQUE B3 · Fidelización y vuelta del cliente ───────────────────────
  {
    id: "GAST-3.1",
    codigo: "3.1",
    slug: "gastro-base-datos-comensales",
    categoria: "B3",
    categoriaNombre: "Fidelización y vuelta del cliente",
    nombre: "Base de datos automática de comensales",
    tagline: "Cada cliente que reserva queda registrado con preferencias, alergias y visitas — sin fichas manuales.",
    recomendado: true,
    descripcionDetallada: "Cada reserva crea o actualiza la ficha del comensal en tu base de datos: nombre, contacto, fechas de visita, qué pidió (si lo registramos), alergias, preferencias y observaciones. Sin pedirle nada extra al cliente y sin que nadie del equipo rellene fichas. Es el activo más valioso a 5 años: una base de habituales conocida que puedes segmentar para campañas, eventos y reactivación.",
    summary: {
      what_it_is: "CRM automatizado de comensales que se llena solo con cada reserva, sin trabajo manual.",
      for_who: ["Restaurantes que quieren conocer a sus habituales", "Grupos con varios locales que comparten clientes", "Negocios que planean campañas a base propia"],
      requirements: ["Sistema de reservas o entrada de datos consistente", "CRM ligero (Airtable, HubSpot o Notion)"],
      output: "Base de datos limpia, segmentable y útil para campañas, eventos y análisis de visitas."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja",
      integrations: ["Sistema de reservas", "CRM"]
    },
    how_it_works_steps: [
      { title: "Captura en cada reserva", short: "Sin pedir nada extra.", detail: "Cada reserva (por cualquier canal) crea o actualiza la ficha del comensal con todos los datos disponibles." },
      { title: "Enriquece automáticamente", short: "Preferencias y alergias guardadas.", detail: "Si el cliente menciona alergias, preferencias o aniversario, queda registrado en su ficha para próximas visitas." },
      { title: "Segmenta para campañas", short: "Habituales, ocasionales, dormidos.", detail: "La base se segmenta sola por frecuencia, ticket medio, preferencias y antigüedad — lista para usar en campañas." }
    ],
    benefits: [
      "Se llena sola con cada reserva, sin fichas manuales",
      "Preferencias y alergias guardadas en la ficha del comensal",
      "Tu activo más valioso a 5 años vista"
    ],
    pasos: [
      "Conectamos tu sistema de reservas al CRM",
      "Cada reserva crea/actualiza la ficha del comensal con todos los datos",
      "Detectamos preferencias y alergias mencionadas en mensajes",
      "Segmentamos automáticamente por frecuencia y ticket",
      "Te damos un panel para consultar y exportar la base"
    ],
    personalizacion: "Define qué campos quieres registrar, qué cuenta como 'habitual' (frecuencia), cómo gestionar duplicados y qué consentimiento marketing pides al cliente.",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["Airtable", "HubSpot", "Notion", "Covermanager / Tock", "Make/n8n"],
    dolores: [
      "No sabemos quiénes son nuestros habituales",
      "Tenemos clientes desde hace años y no les podemos avisar de nada porque no tenemos sus datos",
      "Cada vez que viene un cliente VIP el equipo se entera tarde"
    ],
    integration_domains: ["CRM"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B3",
    modulo_codigo: "3.1",
    related_processes: ["gastro-reactivacion-inactivos", "gastro-segmentacion-eventos"]
  },
  {
    id: "GAST-3.2",
    codigo: "3.2",
    slug: "gastro-reactivacion-inactivos",
    categoria: "B3",
    categoriaNombre: "Fidelización y vuelta del cliente",
    nombre: "Reactivación de clientes inactivos",
    tagline: "Si un habitual lleva meses sin venir, el sistema lo detecta y le envía un mensaje personal con un motivo para volver.",
    recomendado: false,
    descripcionDetallada: "El sistema detecta automáticamente cuándo un cliente habitual lleva más tiempo del normal sin reservar. En ese momento, le envía un mensaje personal — no campaña masiva — con un motivo concreto para volver: una novedad de carta, una mención al plato que pidió la última vez, una invitación a un evento o simplemente un saludo. Recupera entre el 15% y el 25% de la base inactiva sin coste publicitario.",
    summary: {
      what_it_is: "Sistema de detección de habituales que se enfrían + envío de mensajes personales de reactivación.",
      for_who: ["Restaurantes con base de habituales identificada", "Negocios maduros con historial de clientes", "Locales con ticket medio alto donde un cliente perdido cuesta caro"],
      requirements: ["Base de datos de comensales (módulo 3.1)", "WhatsApp/Email", "Carta o eventos actualizados"],
      output: "Recuperación del 15-25% de clientes inactivos con mensajes personales, sin agencia ni publicidad."
    },
    indicators: {
      time_estimate: "2 semanas",
      complexity: "Media",
      integrations: ["CRM", "WhatsApp/Email", "Sistema de reservas"]
    },
    how_it_works_steps: [
      { title: "Detecta habituales fríos", short: "Más tiempo del normal sin venir.", detail: "Calcula para cada cliente su frecuencia habitual y detecta cuándo se está saliendo del patrón." },
      { title: "Mensaje personal", short: "Con motivo concreto, no spam.", detail: "Genera un mensaje individual con un gancho real: plato nuevo, evento, mención a su última visita." },
      { title: "Mide la respuesta", short: "Qué funciona, qué no.", detail: "Trackea quién vuelve, quién no responde, qué tipo de mensaje convierte mejor. Aprende y mejora." }
    ],
    benefits: [
      "Detección automática de habituales que se enfrían",
      "Mensaje personal, no campaña masiva",
      "Recupera entre el 15% y el 25% de la base inactiva"
    ],
    pasos: [
      "Calculamos la frecuencia normal de cada cliente",
      "Detectamos cuándo alguien se está saliendo del patrón",
      "Generamos un mensaje personal con motivo concreto",
      "Lo enviamos por el canal preferido del cliente",
      "Medimos la respuesta y mejoramos el mensaje en cada ciclo"
    ],
    personalizacion: "Define qué cuenta como 'inactivo' (umbral de tiempo), el canal preferido, tipos de gancho a usar (carta, eventos, descuentos) y la frecuencia máxima de contacto.",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["Airtable / HubSpot", "WhatsApp Business / Email", "OpenAI", "Make/n8n"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "Teníamos clientes habituales que han dejado de venir y no sabemos por qué",
      "Cuando alguien deja de venir, no hacemos nada activo para recuperarlo",
      "Pagamos publicidad para captar nuevos en vez de recuperar los que ya tuvimos"
    ],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B3",
    modulo_codigo: "3.2",
    related_processes: ["gastro-base-datos-comensales", "gastro-segmentacion-eventos"]
  },
  {
    id: "GAST-3.3",
    codigo: "3.3",
    slug: "gastro-segmentacion-eventos",
    categoria: "B3",
    categoriaNombre: "Fidelización y vuelta del cliente",
    nombre: "Comunicaciones segmentadas para eventos",
    tagline: "Si organizas un evento, avisas solo a los clientes que ya han venido a algo parecido. Cero spam, cero publicidad.",
    recomendado: false,
    descripcionDetallada: "Cuando programas un evento (cena con maridaje, noche temática, concierto, brunch especial), el sistema te ayuda a identificar exactamente qué clientes de tu base ya han venido a eventos similares o tienen perfil afín. Envías el aviso solo a ellos. La tasa de apertura y conversión es muy superior a campañas masivas, y llenas el evento sin pagar publicidad a desconocidos.",
    summary: {
      what_it_is: "Sistema de segmentación + comunicación dirigida a clientes propios para llenar eventos sin coste publicitario.",
      for_who: ["Restaurantes que organizan eventos regulares", "Locales con base segmentada por preferencias", "Negocios con producto premium o experiencias diferenciadas"],
      requirements: ["Base de datos de comensales con histórico", "WhatsApp/Email"],
      output: "Eventos llenos con clientes ya cualificados, tasa de apertura >40% vs 15% típico de email frío."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["CRM", "WhatsApp/Email"]
    },
    how_it_works_steps: [
      { title: "Define el evento", short: "Qué es, qué perfil encaja.", detail: "Describes el evento y el sistema identifica los criterios de perfil que mejor encajan (han venido a maridajes, prefieren vino, vienen en parejas, etc.)." },
      { title: "Segmenta la base", short: "Solo los que encajan.", detail: "Filtra automáticamente la base de comensales por criterios de afinidad y propone una lista de destinatarios." },
      { title: "Envía y mide", short: "Mensaje personalizado por canal.", detail: "Envía la invitación por el canal preferido de cada uno. Mide aperturas, respuestas y conversiones para mejorar la próxima vez." }
    ],
    benefits: [
      "Segmentación por histórico de visitas y preferencias",
      "Cero coste publicitario para llenar eventos",
      "Tasa de apertura muy superior al email frío"
    ],
    pasos: [
      "Defines el evento y sus criterios ideales de público",
      "El sistema filtra la base de comensales por afinidad",
      "Te propone la lista de destinatarios y el mensaje",
      "Envías por el canal preferido de cada cliente",
      "Mides resultados y aprendes para el siguiente evento"
    ],
    personalizacion: "Define los criterios de afinidad por tipo de evento, los canales preferidos por defecto y la frecuencia máxima de invitaciones por cliente.",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["Airtable / HubSpot", "WhatsApp Business / Resend", "Make/n8n"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "Organizamos eventos y nos cuesta llenarlos",
      "Tenemos clientes ideales en la base pero no sabemos quiénes son para cada evento",
      "Pagamos publicidad para llenar eventos cuando ya tenemos a la gente en casa"
    ],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B3",
    modulo_codigo: "3.3",
    related_processes: ["gastro-base-datos-comensales", "gastro-campanas-temporada"]
  },

  // ── BLOQUE B4 · Operativa diaria y visibilidad ──────────────────────────
  {
    id: "GAST-4.1",
    codigo: "4.1",
    slug: "gastro-reporte-diario",
    categoria: "B4",
    categoriaNombre: "Operativa diaria y visibilidad",
    nombre: "Reporte diario por restaurante",
    tagline: "Cada mañana, un parte único con cubiertos, ocupación, ticket medio, reseñas nuevas y no-shows del día anterior.",
    recomendado: true,
    descripcionDetallada: "Cada mañana a la hora que decidas, recibes un resumen consolidado de cómo fue el día anterior en cada uno de tus locales: cubiertos servidos, ocupación por turno, ticket medio, reseñas nuevas y su valoración, no-shows e incidencias destacables. Todo en un único mensaje por WhatsApp o email, no en cinco hojas de cálculo distintas. Para grupos con varios locales, llega un parte consolidado del grupo y opcionalmente uno por local.",
    summary: {
      what_it_is: "Informe diario operativo consolidado que llega antes de que abras el ordenador.",
      for_who: ["Restauradores que llevan varios turnos", "Grupos con múltiples locales", "Propietarios que no quieren depender del encargado para enterarse"],
      requirements: ["Sistema de reservas con datos de cubiertos", "TPV/POS con ticket medio (opcional)", "Acceso a Google Business para reseñas"],
      output: "Un mensaje matutino con todos los KPIs clave del día anterior por local y consolidado."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Sistema de reservas", "TPV", "Google Business", "WhatsApp/Email"]
    },
    how_it_works_steps: [
      { title: "Recopila datos overnight", short: "De todas las fuentes.", detail: "Durante la noche el sistema recoge cubiertos, ticket medio, reseñas, no-shows e incidencias de todas las fuentes." },
      { title: "Consolida por local", short: "Un solo mensaje, no cinco.", detail: "Une todos los datos en un parte claro por local y un consolidado del grupo si tienes varios." },
      { title: "Envía al equipo directivo", short: "WhatsApp o email, a primera hora.", detail: "Llega al canal y a la hora que defines, sin que nadie tenga que prepararlo manualmente." }
    ],
    benefits: [
      "Llega por WhatsApp o email a primera hora",
      "Multi-local en un único parte consolidado",
      "Sin esperar a que el encargado pase el cierre"
    ],
    pasos: [
      "Conectamos sistema de reservas, TPV y plataformas de reseñas",
      "Definimos el horario y el formato del parte",
      "Cada mañana se generan los datos del día anterior",
      "Se consolidan en un mensaje único (o uno por local + consolidado)",
      "Se envía por WhatsApp o email al equipo definido"
    ],
    personalizacion: "Define qué KPIs incluir, formato (texto, tabla, gráfico), hora de envío, destinatarios por local y por grupo, y nivel de detalle.",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["Covermanager / Tock", "TPV (Glop, Camarero10, etc.)", "Google Business API", "Make/n8n", "WhatsApp/Email"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "Cada mañana llamo al encargado para saber cómo fue el día anterior",
      "Tengo varios locales y no consigo una visión consolidada",
      "Los informes que pido tardan semanas en llegar"
    ],
    integration_domains: ["ERP", "OTHER"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B4",
    modulo_codigo: "4.1",
    related_processes: ["gastro-seguimiento-facturas", "gastro-registro-gastos"]
  },
  {
    id: "GAST-4.2",
    codigo: "4.2",
    slug: "gastro-seguimiento-facturas",
    categoria: "B4",
    categoriaNombre: "Operativa diaria y visibilidad",
    nombre: "Seguimiento de facturas próximas a vencer",
    tagline: "Aviso anticipado de cada factura de proveedor antes de su vencimiento, agrupada por proveedor y prioridad.",
    recomendado: false,
    descripcionDetallada: "El sistema vigila tus facturas de compra (proveedores de género, bebida, suministros, alquileres). Con la antelación que tú decidas, te avisa antes de cada vencimiento con la lista priorizada: cuáles vencen mañana, esta semana, el próximo lunes, agrupadas por proveedor. Adiós a recargos por olvidar pagar a tiempo y adiós a llamadas incómodas de proveedores.",
    summary: {
      what_it_is: "Sistema de vigilancia y aviso anticipado de vencimiento de facturas de compra de un restaurante.",
      for_who: ["Restaurantes con muchos proveedores recurrentes", "Grupos con compras descentralizadas", "Negocios que pagan recargos por olvidar facturas"],
      requirements: ["Software de gestión / ERP / hojas de control de facturas", "Email o WhatsApp del responsable"],
      output: "Cero facturas vencidas sin pagar a tiempo. Aviso anticipado con priorización."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja-Media",
      integrations: ["ERP / Software de gestión", "Email/WhatsApp"]
    },
    how_it_works_steps: [
      { title: "Vigila los vencimientos", short: "Todas las facturas, todos los días.", detail: "Cada noche revisa las facturas pendientes y calcula cuáles vencen en los próximos días según tu umbral." },
      { title: "Agrupa y prioriza", short: "Por proveedor y urgencia.", detail: "Agrupa las facturas por proveedor para pagar de una sola vez y prioriza por urgencia y por importe." },
      { title: "Avisa al responsable", short: "Con todo listo para pagar.", detail: "Envía aviso con la lista, el importe total y los datos necesarios para hacer las transferencias." }
    ],
    benefits: [
      "Cero recargos por facturas vencidas",
      "Lista agrupada por proveedor, lista para pagar de una",
      "Visibilidad anticipada del cash-flow operativo"
    ],
    pasos: [
      "Conectamos tu sistema de gestión de facturas",
      "Definimos el umbral de aviso (2 días, 5 días, 1 semana)",
      "Cada día el sistema revisa los vencimientos próximos",
      "Genera la lista agrupada por proveedor y priorizada",
      "Te llega el aviso por el canal que prefieras"
    ],
    personalizacion: "Define el umbral de anticipación (cuándo avisar), si agrupar por proveedor o no, el canal y la frecuencia (diaria, semanal).",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["ERP / Holded / Anfix / Sage", "Make/n8n", "Email/WhatsApp"],
    canales: ["Email", "WhatsApp"],
    dolores: [
      "Olvidamos pagar facturas y nos clavan recargos",
      "Las facturas de proveedores se acumulan y nadie las revisa hasta que llaman",
      "No tenemos visibilidad de qué tenemos que pagar la próxima semana"
    ],
    integration_domains: ["ERP"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B4",
    modulo_codigo: "4.2",
    related_processes: ["gastro-reporte-diario", "gastro-registro-gastos"]
  },
  {
    id: "GAST-4.3",
    codigo: "4.3",
    slug: "gastro-registro-gastos",
    categoria: "B4",
    categoriaNombre: "Operativa diaria y visibilidad",
    nombre: "Registro automático de gastos",
    tagline: "Cada ticket o factura de gasto se captura, clasifica y archiva sin que nadie pegue papeles ni teclee importes.",
    recomendado: false,
    descripcionDetallada: "El equipo hace foto a un ticket o reenvía una factura por email — el sistema extrae proveedor, importe, fecha, IVA y partida de gasto (género, bebida, suministros, etc.), lo registra en el ERP y archiva el justificante en la nube. Adiós a cajas de zapatos llenas de tickets, adiós a buscar a fin de mes qué se compró y dónde.",
    summary: {
      what_it_is: "Captura automatizada de tickets y facturas de gasto + clasificación contable + archivo en la nube.",
      for_who: ["Restaurantes que pierden tickets de compra", "Grupos con compras descentralizadas (varios encargados compran)", "Negocios que quieren cerrar mes en horas, no días"],
      requirements: ["Móvil del equipo (foto del ticket) o email", "ERP / Software contable", "Almacenamiento en la nube"],
      output: "Todos los gastos registrados y clasificados al día, con justificante archivado y trazable."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["OCR / IA", "ERP", "Google Drive / Dropbox"]
    },
    how_it_works_steps: [
      { title: "Captura el justificante", short: "Foto del ticket o reenvío email.", detail: "Cualquiera del equipo hace foto al ticket o reenvía la factura electrónica. No hace falta app especial." },
      { title: "Extrae los datos", short: "OCR + IA leen todo.", detail: "El sistema extrae proveedor, importe, fecha, IVA y propone partida de gasto según el histórico." },
      { title: "Registra y archiva", short: "ERP + nube.", detail: "Anota el gasto en el ERP con la clasificación correcta y guarda el justificante en la carpeta de la nube." }
    ],
    benefits: [
      "Cero tickets perdidos",
      "Cierre de mes en horas, no en días",
      "Trazabilidad total de cada gasto"
    ],
    pasos: [
      "El equipo hace foto al ticket o reenvía la factura por email",
      "El sistema extrae proveedor, importe, fecha, IVA",
      "Clasifica el gasto por partida (género, bebida, suministros...)",
      "Registra en el ERP/software de gestión",
      "Archiva el justificante en la carpeta de la nube correspondiente"
    ],
    personalizacion: "Define las partidas de gasto a usar, el sistema de archivo en la nube, qué emails de proveedor conectar y reglas de aprobación si las hay.",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["Mindee / OCR", "Holded / Anfix", "Google Drive / Dropbox", "Make/n8n"],
    dolores: [
      "Los tickets de proveedores se pierden o se acumulan sin registrar",
      "El cierre de mes es una pesadilla de buscar justificantes",
      "No sabemos cuánto gastamos en cada partida hasta meses después"
    ],
    integration_domains: ["ERP", "DOCS"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B4",
    modulo_codigo: "4.3",
    related_processes: ["gastro-reporte-diario", "gastro-seguimiento-facturas"]
  },
  {
    id: "GAST-4.4",
    codigo: "4.4",
    slug: "gastro-control-stock-inventario",
    categoria: "B4",
    categoriaNombre: "Operativa diaria y visibilidad",
    nombre: "Control automático de stock de materia prima y alertas de reposición",
    tagline: "Nunca más quedarte sin producto en mitad del servicio.",
    recomendado: true,
    descripcionDetallada: "En hostelería, quedarse sin un ingrediente clave durante el servicio es uno de los errores más evitables y más frecuentes. El stock se gestiona de memoria, los pedidos los hace quien se acuerda y nadie sabe cuánto queda de cada producto hasta que ya no queda. Este proceso registra el inventario en tiempo real: descuenta el consumo diario a partir de los datos de ventas del TPV, compara con los niveles mínimos configurados por producto y lanza una alerta automática al responsable cuando hay que pedir. También puede generar el pedido al proveedor habitual directamente. Resultado: cero roturas de stock, menos mermas por sobrecompra y visibilidad total sobre el coste de materia prima.",
    summary: {
      what_it_is: "Sistema de control de inventario conectado al TPV que alerta automáticamente cuando un producto baja del stock mínimo y puede generar el pedido al proveedor.",
      for_who: [
        "Restaurantes que se quedan sin producto durante el servicio",
        "Negocios que hacen los pedidos de memoria sin datos reales",
        "Grupos con varios locales que necesitan control centralizado de stock"
      ],
      requirements: ["TPV o sistema de gestión de ventas", "Lista de proveedores y productos con stock mínimo", "WhatsApp o email del responsable de compras"],
      output: "Alertas automáticas de reposición, pedidos generados al proveedor y visibilidad del coste de materia prima en tiempo real."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["TPV", "ERP", "WhatsApp"]
    },
    how_it_works_steps: [
      { title: "Registra el inventario inicial", short: "Carga el stock de partida.", detail: "Se registran todos los productos con su stock actual y el nivel mínimo que activa la alerta de reposición." },
      { title: "Descuenta el consumo automáticamente", short: "Se conecta al TPV.", detail: "Cada vez que se vende un plato, el sistema descuenta los ingredientes correspondientes del stock en tiempo real." },
      { title: "Alerta cuando hay que pedir", short: "Aviso al responsable.", detail: "Cuando un producto baja del mínimo, el responsable recibe una alerta por WhatsApp o email con qué pedir y cuánto." },
      { title: "Genera el pedido al proveedor", short: "Orden de compra automática.", detail: "Opcionalmente, el sistema genera y envía la orden de compra al proveedor habitual con las cantidades correctas." },
      { title: "Actualiza el stock al recibir", short: "Cierre del ciclo.", detail: "Al registrar la recepción del pedido, el stock se actualiza y el ciclo vuelve a empezar." }
    ],
    benefits: [
      "Cero roturas de stock en mitad del servicio",
      "Pedidos basados en datos, no en memoria",
      "Visibilidad del coste de materia prima en tiempo real"
    ],
    pasos: [
      "Configuración del inventario inicial con stocks mínimos por producto",
      "Conexión con el TPV para descuento automático del consumo",
      "Alerta automática al responsable cuando un producto baja del mínimo",
      "Generación del pedido al proveedor habitual con las cantidades exactas",
      "Actualización del stock al confirmar la recepción del pedido"
    ],
    personalizacion: "Define los niveles mínimos de stock por producto, el canal de alerta (WhatsApp o email), el responsable de compras, los proveedores habituales y si quieres que el pedido se genere automáticamente o requiera aprobación.",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["Lightspeed", "Square", "Holded", "Google Sheets", "Make/n8n", "WhatsApp Business API"],
    dolores: [
      "Me quedo sin ingredientes clave en mitad del servicio",
      "Hacemos los pedidos de memoria y siempre nos pasamos o nos quedamos cortos",
      "No sé cuánto tengo de cada producto hasta que abro la nevera",
      "Tiramos producto porque compramos de más sin control",
      "El inventario lo hacemos a mano cada semana y es un infierno",
      "Los pedidos a proveedores los hace quien se acuerda, sin sistema"
    ],
    canales: ["WhatsApp", "Email"],
    integration_domains: ["ERP", "COMMS"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B4",
    modulo_codigo: "4.4",
    related_processes: ["gastro-reporte-diario", "gastro-registro-gastos"]
  },

  // ── BLOQUE B5 · Gestión de personal y equipo ────────────────────────────
  {
    id: "GAST-5.1",
    codigo: "5.1",
    slug: "gastro-onboarding-personal",
    categoria: "B5",
    categoriaNombre: "Gestión de personal y equipo",
    nombre: "Onboarding automático de personal nuevo",
    tagline: "Cuando entra alguien nuevo, recibe automáticamente documentos, protocolos y vídeos para estar operativo el primer turno.",
    recomendado: false,
    descripcionDetallada: "Cuando se incorpora una persona nueva al equipo, recibe automáticamente toda la información que necesita: contrato y documentación, protocolos del local (apertura, cierre, COVID, alergenos), vídeos de la carta y los platos clave, listado de proveedores, contactos del equipo y normas de uso de cocina/sala. Sin que el encargado se siente a explicar lo mismo 30 veces al año. El nuevo entra ya con contexto y arranca el primer turno operativo.",
    summary: {
      what_it_is: "Sistema automático de onboarding de personal con documentos, protocolos y vídeos enviados al instante.",
      for_who: ["Restaurantes con rotación alta de personal", "Grupos con muchos locales que contratan en paralelo", "Negocios donde el encargado pierde tiempo explicando lo mismo"],
      requirements: ["Carpeta con protocolos y documentos del local", "WhatsApp/Email del nuevo", "Vídeos de carta (opcional)"],
      output: "Persona nueva operativa desde el primer turno, sin saturar al encargado."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja",
      integrations: ["WhatsApp/Email", "Google Drive / Notion"]
    },
    how_it_works_steps: [
      { title: "Detecta el alta", short: "Nueva persona, arranca onboarding.", detail: "Al registrar al nuevo en el sistema (o al añadirlo manualmente), arranca el flujo de onboarding." },
      { title: "Envía paquete inicial", short: "Documentos, protocolos, vídeos.", detail: "Le llega un mensaje organizado con todo: contrato, protocolos, vídeos de carta, contactos del equipo y normas." },
      { title: "Hace seguimiento", short: "¿Ha leído? ¿Tiene dudas?", detail: "Pregunta a los pocos días si todo está claro y deriva al encargado si hay dudas concretas." }
    ],
    benefits: [
      "Documentos, protocolos y vídeos enviados al instante",
      "Encargado deja de repetir lo mismo 30 veces al año",
      "Persona nueva operativa en el primer turno"
    ],
    pasos: [
      "Se detecta el alta de personal nuevo",
      "Se le envía el paquete de onboarding por WhatsApp/email",
      "Recibe documentos, protocolos, vídeos de carta",
      "Se hace seguimiento a los pocos días para detectar dudas",
      "Se notifica al encargado si hay puntos pendientes"
    ],
    personalizacion: "Define qué materiales incluir, en qué orden, canal de envío, días de seguimiento y a quién escalar dudas.",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["Google Drive / Notion", "WhatsApp Business", "Make/n8n"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "Cada vez que entra alguien nuevo el encargado pierde un día entero",
      "El personal nuevo empieza sin saber dónde está nada",
      "Repetimos la misma explicación de carta 50 veces al año"
    ],
    integration_domains: ["DOCS", "COMMS"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B5",
    modulo_codigo: "5.1",
    related_processes: ["gastro-gestion-personal"]
  },
  {
    id: "GAST-5.2",
    codigo: "5.2",
    slug: "gastro-gestion-personal",
    categoria: "B5",
    categoriaNombre: "Gestión de personal y equipo",
    nombre: "Gestión automática de personal",
    tagline: "Turnos, comunicaciones, sustituciones y confirmaciones — sin grupos de WhatsApp caóticos ni llamadas de última hora.",
    recomendado: true,
    descripcionDetallada: "El sistema gestiona la comunicación operativa del equipo: cada persona recibe su turno semanal por WhatsApp con confirmación de lectura. Los cambios y sustituciones se notifican al instante solo a quien afecta. Si alguien no puede venir, propone automáticamente a quién avisar para cubrir según disponibilidad. Y guarda histórico para análisis de cobertura. Fin del grupo de WhatsApp ingobernable donde nadie sabe quién entra mañana.",
    summary: {
      what_it_is: "Sistema integral de comunicación de turnos, sustituciones y cambios para equipos de sala y cocina.",
      for_who: ["Restaurantes con equipos de 5+ personas", "Grupos con plantilla rotativa", "Locales con turnos cambiantes"],
      requirements: ["Cuadrante de turnos (Excel, Sesame, Factorial)", "WhatsApp del equipo", "Lista de personal con disponibilidad"],
      output: "Cero malentendidos de turnos. Sustituciones cubiertas en minutos, no en horas."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["WhatsApp Business", "Software de turnos / Excel", "Make/n8n"]
    },
    how_it_works_steps: [
      { title: "Envía turnos individuales", short: "A cada persona el suyo.", detail: "Cada lunes (o el día que decidas), cada persona recibe su turno semanal por WhatsApp con confirmación de lectura." },
      { title: "Gestiona cambios", short: "Solo a quien afecta.", detail: "Si hay un cambio, se notifica al instante solo a las personas afectadas. Nada de spam al grupo entero." },
      { title: "Sustituciones inteligentes", short: "Propone quién puede cubrir.", detail: "Si alguien no puede venir, el sistema propone candidatos según disponibilidad y experiencia, y gestiona el aviso." }
    ],
    benefits: [
      "Turnos individuales con confirmación de lectura",
      "Cambios notificados al instante a quien afectan",
      "Fin de los grupos de WhatsApp ingobernables"
    ],
    pasos: [
      "Conectamos tu cuadrante de turnos (Excel, Sesame, Factorial)",
      "Enviamos a cada persona su turno individual por WhatsApp",
      "Detectamos confirmación de lectura y respuesta",
      "Gestionamos cambios y sustituciones notificando solo a quien afecta",
      "Si alguien falta, proponemos candidatos para cubrir"
    ],
    personalizacion: "Define el día y hora de envío del cuadrante, los criterios de sustitución, qué confirmaciones pedir y cómo escalar imprevistos.",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["WhatsApp Business API", "Sesame / Factorial / Excel", "Make/n8n"],
    canales: ["WhatsApp"],
    dolores: [
      "Los grupos de WhatsApp del equipo son ingobernables",
      "Cada cambio de turno requiere 20 llamadas",
      "Cuando alguien falta, perdemos una hora buscando sustituto"
    ],
    integration_domains: ["COMMS", "OTHER"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B5",
    modulo_codigo: "5.2",
    related_processes: ["gastro-onboarding-personal"]
  },

  // ── BLOQUE B6 · Marketing y contenido digital ───────────────────────────
  {
    id: "GAST-6.1",
    codigo: "6.1",
    slug: "gastro-publicaciones-eventos",
    categoria: "B6",
    categoriaNombre: "Marketing y contenido digital",
    nombre: "Publicaciones automáticas de eventos y novedades",
    tagline: "Cuando programas un evento o plato nuevo, el contenido se genera y publica en Instagram y Facebook en el momento óptimo.",
    recomendado: false,
    descripcionDetallada: "Cuando se programa un evento, una noche especial, un nuevo plato o una promoción, el sistema genera automáticamente el contenido (copy + imagen en la identidad visual del local) y lo publica en Instagram y Facebook al horario óptimo de tu audiencia. Tu Instagram deja de depender de quien tenga rato un martes a las once de la noche.",
    summary: {
      what_it_is: "Sistema de generación + publicación automática de contenido en redes sociales para restaurantes.",
      for_who: ["Restaurantes con presencia en Instagram/Facebook", "Negocios que descuidan redes por falta de tiempo", "Locales con programación cambiante (eventos, carta de temporada)"],
      requirements: ["Cuenta Instagram Business", "Identidad visual del local (logo, colores, tipografías)", "Calendario de eventos/cambios"],
      output: "Instagram y Facebook actualizados sin esfuerzo, con contenido coherente y publicado en horario óptimo."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["Instagram Business API", "IA generativa", "Banco de imágenes"]
    },
    how_it_works_steps: [
      { title: "Recoge la novedad", short: "Evento, plato, oferta.", detail: "Detectas un evento o cambio (en calendario, agenda compartida o formulario simple) y arranca el flujo." },
      { title: "Genera el contenido", short: "Copy + imagen en tu identidad.", detail: "La IA crea texto en el tono del local y una imagen siguiendo la guía visual (colores, tipografías, plantillas)." },
      { title: "Publica al horario óptimo", short: "Cuando tu audiencia está activa.", detail: "Programa la publicación al horario de mayor engagement de tu cuenta, sin que tengas que pensar en ello." }
    ],
    benefits: [
      "Generación de copy + imagen en la identidad del local",
      "Publicación programada al horario óptimo",
      "Tu Instagram deja de depender de quien tenga rato"
    ],
    pasos: [
      "Detectamos novedades (evento, plato nuevo, oferta) en tu calendario o formulario",
      "La IA genera el copy en el tono del local",
      "Se crea la imagen siguiendo tu identidad visual",
      "Se programa la publicación al horario óptimo",
      "Publicamos en Instagram, Facebook y opcionalmente otros canales"
    ],
    personalizacion: "Define el tono de la marca, la identidad visual (plantillas, colores, tipografías), los canales a publicar, la frecuencia máxima y si quieres aprobación humana antes de cada post.",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["Instagram Business API", "OpenAI / DALL-E", "Canva API", "Make/n8n"],
    canales: ["Instagram", "Facebook"],
    dolores: [
      "Nuestro Instagram lleva semanas sin publicar nada",
      "Las publicaciones que hacemos son inconsistentes en estética",
      "No tenemos tiempo de pensar el contenido encima de servir mesas"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B6",
    modulo_codigo: "6.1",
    related_processes: ["gastro-campanas-temporada"]
  },
  {
    id: "GAST-6.2",
    codigo: "6.2",
    slug: "gastro-campanas-temporada",
    categoria: "B6",
    categoriaNombre: "Marketing y contenido digital",
    nombre: "Campañas de temporada hacia base propia",
    tagline: "Antes de los picos (San Valentín, Semana Santa, verano, Navidad), se activan campañas a tu base de clientes. Sin agencia.",
    recomendado: true,
    descripcionDetallada: "El sistema sigue un calendario gastronómico de picos del año: San Valentín, Día de la Madre/Padre, Semana Santa, comuniones, verano, vuelta al cole, Navidades, Nochevieja. Antes de cada uno, activa una campaña automática a tu base de clientes — los que ya han venido — con el mensaje y la oferta adecuada. Llenado anticipado del pico sin agencia, sin briefings y sin coste publicitario.",
    summary: {
      what_it_is: "Calendario automatizado de campañas de temporada dirigidas a base propia, sin agencia ni publicidad.",
      for_who: ["Restaurantes con producto adaptable a temporadas", "Locales con base de habituales identificada", "Negocios que quieren llenar picos con clientes ya cualificados"],
      requirements: ["Base de datos de comensales (módulo 3.1)", "WhatsApp/Email", "Calendario de oferta por temporada"],
      output: "Picos del año llenados con clientes propios, sin coste publicitario, con anticipación suficiente."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["CRM", "WhatsApp/Email", "Calendario gastronómico"]
    },
    how_it_works_steps: [
      { title: "Calendario gastronómico", short: "Picos del año marcados.", detail: "Definimos juntos los picos relevantes para tu local (San Valentín, comuniones, eventos locales, etc.)." },
      { title: "Activa anticipación", short: "3-4 semanas antes del pico.", detail: "Con tiempo suficiente, arranca la campaña: mensaje a la base segmentada, oferta de reserva anticipada." },
      { title: "Mide y ajusta", short: "Qué pico funciona mejor.", detail: "Cada campaña deja datos: aperturas, reservas generadas, ticket medio. Aprendes para el siguiente año." }
    ],
    benefits: [
      "Calendario de campañas ligado al calendario gastronómico",
      "Sin agencia, sin briefings, sin coste publicitario",
      "Llenado anticipado de los picos del año"
    ],
    pasos: [
      "Definimos juntos el calendario gastronómico del local",
      "Para cada pico, configuramos audiencia, mensaje y oferta",
      "3-4 semanas antes, se activa la campaña automáticamente",
      "El mensaje sale por el canal preferido de cada cliente",
      "Medimos resultados y mejoramos para el siguiente ciclo"
    ],
    personalizacion: "Define qué picos del año son relevantes, el tono y oferta de cada uno, los canales preferidos y la frecuencia máxima de contacto por cliente.",
    sectores: ["Gastronomía / Hostelería"],
    herramientas: ["Airtable / HubSpot", "WhatsApp Business / Resend", "Make/n8n", "OpenAI"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "Llegamos tarde a campañas de Navidad / San Valentín",
      "Pagamos publicidad para llenar fechas cuando ya tenemos clientes que vendrían",
      "Las agencias tardan semanas en preparar una campaña simple"
    ],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "gastronomia-hosteleria",
    bloque_negocio: "B6",
    modulo_codigo: "6.2",
    related_processes: ["gastro-segmentacion-eventos", "gastro-base-datos-comensales", "gastro-publicaciones-eventos"]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SECTOR CENTROS DE SALUD — 21 procesos · 6 bloques
  // Exclusivos de este sector. Copy adaptado a clínicas (dental, fisio,
  // estética, médica, veterinaria). Tono RGPD-aware.
  // ══════════════════════════════════════════════════════════════════════════

  // ── BLOQUE B1 · Captación y primera visita ──────────────────────────────
  {
    id: "SAL-1.1",
    codigo: "1.1",
    slug: "salud-voz-citas-247",
    categoria: "B1",
    categoriaNombre: "Captación y primera visita",
    nombre: "Asistente de voz 24/7 para pedir cita",
    tagline: "Una voz natural atiende cada llamada — incluso fuera de horario — y deja la cita confirmada en tu agenda.",
    recomendado: true,
    descripcionDetallada: "Una voz IA atiende las llamadas que entran cuando recepción está ocupada o cerrada. Pregunta motivo de consulta, urgencia, aseguradora y preferencia de profesional, comprueba disponibilidad en tu agenda y deja la cita creada. Si el motivo requiere triaje (dolor agudo, urgencia), deriva inmediatamente al teléfono de guardia.",
    summary: {
      what_it_is: "Recepcionista IA por voz que atiende 24/7, conectado a tu sistema de agenda, capaz de derivar urgencias.",
      for_who: ["Clínicas con alto volumen de llamadas", "Centros con horario partido", "Grupos con varios centros"],
      requirements: ["Software de gestión clínica con API o agenda compartida", "Línea telefónica derivable"],
      output: "Cita creada y confirmada al paciente por WhatsApp/SMS sin intervención humana."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["Telefonía", "Software de gestión clínica", "WhatsApp/SMS"]
    },
    how_it_works_steps: [
      { title: "Atiende la llamada", short: "Voz natural en castellano.", detail: "El asistente responde con la identidad del centro y pregunta en qué puede ayudar." },
      { title: "Cualifica al paciente", short: "Motivo, urgencia, aseguradora.", detail: "Recoge los datos necesarios para asignar el profesional y la duración correctos." },
      { title: "Reserva en agenda", short: "Hueco real, no provisional.", detail: "Consulta disponibilidad real, propone fechas y deja la cita creada en tu sistema." },
      { title: "Confirma al paciente", short: "WhatsApp/SMS al instante.", detail: "El paciente recibe confirmación por su canal preferido con los datos de la cita." }
    ],
    benefits: [
      "Atiende 24/7 sin recepción nocturna",
      "Cualifica al paciente antes de bloquear agenda",
      "Voz natural en castellano, no suena a robot"
    ],
    pasos: [
      "La llamada entra al número del centro (o se desvía a la IA fuera de horario)",
      "El asistente saluda con el nombre del centro y pregunta en qué puede ayudar",
      "Si es una cita: recoge motivo, urgencia, aseguradora, preferencia de profesional",
      "Comprueba disponibilidad real en tu agenda clínica",
      "Crea la cita o deriva a urgencia si el motivo lo requiere",
      "Envía confirmación al paciente por WhatsApp/SMS"
    ],
    personalizacion: "Define el tono de voz, qué motivos derivan a urgencia, qué aseguradoras admite el centro, horarios de cobertura IA vs. humanos y el canal de confirmación.",
    sectores: ["Centros de Salud"],
    herramientas: ["Vapi", "ElevenLabs", "Software de gestión clínica", "Twilio", "WhatsApp Business API"],
    canales: ["Voz / Teléfono"],
    dolores: [
      "Perdemos pacientes porque no podemos atender el teléfono",
      "Fuera de horario el contestador no sirve para nada",
      "Recepción se satura cuando coinciden llamadas y mostrador"
    ],
    integration_domains: ["COMMS", "OTHER"],
    landing_slug: "salud",
    bloque_negocio: "B1",
    modulo_codigo: "1.1",
    related_processes: ["salud-captura-multicanal", "salud-cualificacion-previa"]
  },
  {
    id: "SAL-1.2",
    codigo: "1.2",
    slug: "salud-captura-multicanal",
    categoria: "B1",
    categoriaNombre: "Captación y primera visita",
    nombre: "Captura unificada de peticiones desde todos los canales",
    tagline: "WhatsApp, formulario web, Instagram DM, llamadas — todo cae en una sola bandeja con el origen identificado.",
    recomendado: true,
    descripcionDetallada: "Centralizamos todas las peticiones de cita entrantes en un único panel. El paciente escribe por WhatsApp, por Instagram DM, rellena el formulario de la web o llama por teléfono — y todo se unifica con el canal de origen marcado, sin duplicados y sin que recepción tenga que saltar entre 5 apps.",
    summary: {
      what_it_is: "Panel único de captación con todas las peticiones de cita entrantes etiquetadas por canal.",
      for_who: ["Clínicas con presencia activa en Instagram", "Centros con formulario web operativo", "Negocios que reciben DMs pidiendo cita"],
      requirements: ["Cuenta Instagram Business", "WhatsApp Business API", "Formulario web", "Sistema de gestión clínica"],
      output: "Todas las peticiones en una sola vista, sin duplicados, con canal de origen identificado."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Instagram", "WhatsApp", "Web", "Software de gestión clínica"]
    },
    how_it_works_steps: [
      { title: "Escucha multicanal", short: "Todos los canales a la vez.", detail: "Monitoriza en paralelo Instagram DM, WhatsApp, web y teléfono, detectando intención de cita." },
      { title: "Centraliza en panel", short: "Una sola bandeja para todo.", detail: "Cada petición entra al panel con el canal de origen, fecha y datos disponibles del paciente." },
      { title: "Detecta duplicados", short: "Si escribe por dos canales, uno solo.", detail: "Identifica al paciente por número o email y consolida peticiones del mismo paciente." }
    ],
    benefits: [
      "Un único panel para todos los canales",
      "Sin duplicados ni peticiones perdidas",
      "El paciente contacta por donde ya está"
    ],
    pasos: [
      "Conectamos Instagram DM, WhatsApp Business, web y llamadas",
      "Detectamos qué mensajes son petición de cita real",
      "Unificamos en un panel centralizado",
      "Etiquetamos cada petición por canal de origen",
      "Notificamos a recepción solo lo que requiere intervención humana"
    ],
    personalizacion: "Elige qué canales activar, qué cuenta como 'caso especial' (grupos, urgencias, peticiones VIP) y la asignación por defecto.",
    sectores: ["Centros de Salud"],
    herramientas: ["Instagram Business API", "WhatsApp Business API", "Make/n8n", "Software de gestión clínica"],
    canales: ["Instagram", "WhatsApp", "Web", "Teléfono"],
    dolores: [
      "Los DMs de Instagram pidiendo cita se nos pasan",
      "Recepción copia datos de WhatsApp al sistema a mano",
      "Tenemos peticiones duplicadas por el mismo paciente"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "salud",
    bloque_negocio: "B1",
    modulo_codigo: "1.2",
    related_processes: ["salud-voz-citas-247", "salud-chatbot-info"]
  },
  {
    id: "SAL-1.3",
    codigo: "1.3",
    slug: "salud-chatbot-info",
    categoria: "B1",
    categoriaNombre: "Captación y primera visita",
    nombre: "Chatbot informativo del centro",
    tagline: "Un asistente que conoce servicios, precios estimados, aseguradoras, ubicación y horarios — y responde al instante.",
    recomendado: true,
    descripcionDetallada: "Un asistente conversacional disponible en WhatsApp, Instagram DM y el chat de la web que tiene toda la información del centro: cartera de servicios, rangos de precio orientativos, aseguradoras con las que trabajáis, dirección y cómo llegar, parking, horarios, política de primera visita. Responde 24/7 con información actualizada y, cuando hay intención de cita, deriva o gestiona la reserva.",
    summary: {
      what_it_is: "Base de conocimiento conversacional del centro accesible por chat. Filtra preguntas habituales que ahogan a recepción.",
      for_who: ["Clínicas con muchas preguntas repetidas", "Centros con cartera de servicios amplia", "Negocios con varias sedes o profesionales"],
      requirements: ["Cartera de servicios actualizada", "WhatsApp Business o widget web", "Cuenta Instagram Business (opcional)"],
      output: "Paciente informado al instante 24/7. Recepción libre de preguntas repetidas."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja-Media",
      integrations: ["WhatsApp", "Instagram", "Web", "IA / Base de conocimiento"]
    },
    how_it_works_steps: [
      { title: "Carga la información", short: "Servicios, precios, aseguradoras.", detail: "Subimos cartera con servicios, rangos de precio, aseguradoras, horarios y datos del centro. Se actualiza cuando tú la actualizas." },
      { title: "Responde 24/7", short: "Instantáneo, en el canal del paciente.", detail: "Da respuestas precisas a las preguntas habituales: '¿tenéis Adeslas?', '¿precio de limpieza?', '¿abrís sábados?'." },
      { title: "Deriva a cita o humano", short: "Cuando hace falta intervención.", detail: "Si la conversación indica intención de cita, la gestiona. Si requiere humano (urgencia, queja), avisa al equipo con contexto." }
    ],
    benefits: [
      "Cero preguntas repetidas para recepción",
      "Información correcta y actualizada 24/7",
      "Conversaciones que terminan en cita, no en silencio"
    ],
    pasos: [
      "Recopilamos toda la información del centro y servicios",
      "Entrenamos al asistente en el tono del centro",
      "Lo conectamos a los canales donde te escriben los pacientes",
      "Responde dudas al instante con información actualizada",
      "Cuando detecta intención de cita, la gestiona o deriva con contexto"
    ],
    personalizacion: "Define el tono, qué información incluir, qué temas escalar siempre a humano (urgencias, quejas) y cuándo proponer activamente reservar cita.",
    sectores: ["Centros de Salud"],
    herramientas: ["OpenAI / Claude", "WhatsApp Business API", "Instagram Business", "Make/n8n"],
    canales: ["WhatsApp", "Instagram", "Web"],
    dolores: [
      "Todos los días respondemos las mismas 10 preguntas",
      "Recepción está al teléfono y no atiende el mostrador",
      "Damos información inconsistente según quién responda"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "salud",
    bloque_negocio: "B1",
    modulo_codigo: "1.3",
    related_processes: ["salud-captura-multicanal", "salud-voz-citas-247"]
  },
  {
    id: "SAL-1.4",
    codigo: "1.4",
    slug: "salud-cualificacion-previa",
    categoria: "B1",
    categoriaNombre: "Captación y primera visita",
    nombre: "Cualificación previa de paciente",
    tagline: "Antes de bloquear agenda, pregunta motivo, urgencia, primera visita y aseguradora — y asigna el profesional correcto.",
    recomendado: false,
    descripcionDetallada: "Antes de ocupar agenda, el sistema cualifica al paciente: motivo de consulta, urgencia, si es primera visita o revisión, aseguradora, preferencia de profesional. Con esa información, asigna el profesional adecuado, la duración correcta y el tipo de visita. El profesional llega a consulta con el contexto, sin sorpresas en sala.",
    summary: {
      what_it_is: "Triage automatizado pre-agenda que asigna profesional, duración y tipo correctos según el motivo.",
      for_who: ["Centros con varios profesionales y especialidades", "Clínicas con primera visita diferenciada", "Negocios con duraciones distintas según tratamiento"],
      requirements: ["Software de gestión con asignación por profesional", "Reglas de asignación definidas"],
      output: "Agenda mejor cargada: cada cita con profesional, duración y contexto correctos."
    },
    indicators: {
      time_estimate: "2 semanas",
      complexity: "Media",
      integrations: ["Software de gestión clínica", "WhatsApp/Web"]
    },
    how_it_works_steps: [
      { title: "Pregunta clave", short: "Motivo, urgencia, aseguradora.", detail: "En el canal por donde llega la petición, el sistema hace 3-5 preguntas concretas." },
      { title: "Asigna profesional", short: "Según reglas y especialidad.", detail: "Aplica tus reglas para escoger profesional, duración y tipo de visita correctos." },
      { title: "Reserva con contexto", short: "El profesional lo ve en su agenda.", detail: "La cita se crea con un resumen del motivo visible para el profesional antes de empezar." }
    ],
    benefits: [
      "Llega a consulta con contexto, sin sorpresas",
      "Evita huecos mal asignados (urgencias en revisiones)",
      "Mejora la duración asignada por tipo de visita"
    ],
    pasos: [
      "El paciente solicita cita por cualquier canal",
      "El sistema hace 3-5 preguntas clave",
      "Aplica reglas para asignar profesional + duración + tipo",
      "Crea la cita con contexto visible para el profesional",
      "Notifica al paciente la asignación"
    ],
    personalizacion: "Define qué preguntas hacer en cada canal, las reglas de asignación profesional/duración, qué motivos requieren triaje urgente.",
    sectores: ["Centros de Salud"],
    herramientas: ["Software de gestión clínica", "Make/n8n", "WhatsApp/Web"],
    dolores: [
      "Asignamos a un profesional y resulta no era su especialidad",
      "Bloqueamos 30 minutos cuando hacían falta 60",
      "El profesional descubre el motivo al ver al paciente"
    ],
    integration_domains: ["OTHER"],
    landing_slug: "salud",
    bloque_negocio: "B1",
    modulo_codigo: "1.4",
    related_processes: ["salud-voz-citas-247", "salud-captura-multicanal"]
  },

  // ── BLOQUE B2 · Gestión de citas y ausencias ────────────────────────
  {
    id: "SAL-2.1",
    codigo: "2.1",
    slug: "salud-recordatorios-citas",
    categoria: "B2",
    categoriaNombre: "Gestión de citas y ausencias",
    nombre: "Recordatorios automáticos pre-cita",
    tagline: "Mensaje 24 horas y 2 horas antes. El paciente confirma con un toque, sin llamar.",
    recomendado: true,
    descripcionDetallada: "El sistema envía recordatorios automáticos 24 horas y 2 horas antes de la cita por WhatsApp o SMS. El paciente confirma con un solo toque. Si no responde, recepción recibe alerta para gestión activa. Resultado típico: ausencias del 15-25% bajan al 5-10%.",
    summary: {
      what_it_is: "Recordatorios automáticos pre-cita con confirmación de un toque y alerta a recepción si no hay respuesta.",
      for_who: ["Clínicas con problema de ausencias", "Centros con citas de coste alto (estética, dental)", "Negocios con agenda apretada"],
      requirements: ["Software de gestión con datos de contacto", "WhatsApp Business o SMS"],
      output: "Bajada del 50-70% en ausencias con cero llamadas de recepción para confirmar."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["WhatsApp/SMS", "Software de gestión clínica"]
    },
    how_it_works_steps: [
      { title: "24h antes", short: "Mensaje amable de recordatorio.", detail: "Recordatorio con fecha, hora, profesional y opción de confirmar/cancelar con un toque." },
      { title: "2h antes", short: "Último aviso si no ha confirmado.", detail: "Para quienes no confirmaron, último mensaje para que respondan o llamen si hay problema." },
      { title: "Alerta a recepción", short: "Si nadie responde.", detail: "Si tras los 2 recordatorios el paciente no ha respondido, recepción recibe alerta para llamar." }
    ],
    benefits: [
      "Recordatorio 24h y 2h antes por WhatsApp/SMS",
      "Confirmación de un solo toque",
      "Aviso a recepción si el paciente no responde"
    ],
    pasos: [
      "Detectamos las citas del día siguiente y del turno",
      "Enviamos recordatorio amable por el canal del paciente",
      "Si confirma → cita asegurada. Si responde 'no puedo' → libera y reagenda",
      "Si no responde tras 2 mensajes, alerta a recepción",
      "Registramos el patrón para análisis de ausencias"
    ],
    personalizacion: "Define cuándo se envía (24h, 2h, ambos), el tono del recordatorio, qué canales usar y qué hacer ante no-respuesta.",
    sectores: ["Centros de Salud"],
    herramientas: ["WhatsApp Business API", "Twilio", "Software de gestión clínica", "Make/n8n"],
    canales: ["WhatsApp", "SMS"],
    dolores: [
      "Cada día tenemos pacientes que no aparecen sin avisar",
      "Recepción pasa horas confirmando citas por teléfono",
      "Las ausencias en menú de tratamiento caro son enormes"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "salud",
    bloque_negocio: "B2",
    modulo_codigo: "2.1",
    related_processes: ["salud-reprogramacion-citas", "salud-lista-espera"]
  },
  {
    id: "SAL-2.2",
    codigo: "2.2",
    slug: "salud-reprogramacion-citas",
    categoria: "B2",
    categoriaNombre: "Gestión de citas y ausencias",
    nombre: "Confirmación y reprogramación sin llamar",
    tagline: "Si el paciente no puede venir, propone fechas alternativas y reprograma sin pasar por recepción.",
    recomendado: false,
    descripcionDetallada: "Cuando el paciente responde 'no puedo' al recordatorio, el sistema le propone automáticamente 3 fechas alternativas en función de su preferencia y la agenda del profesional. El paciente elige una con un toque y la cita se reagenda. La cita anterior queda liberada al instante para lista de espera.",
    summary: {
      what_it_is: "Sistema de reprogramación autónoma para que el paciente cambie su cita sin pasar por recepción.",
      for_who: ["Clínicas que pierden tiempo en reagendas", "Centros con agenda apretada", "Negocios con políticas de cancelación claras"],
      requirements: ["Software de gestión clínica", "WhatsApp Business"],
      output: "Reprogramaciones sin llamada + hueco liberado al instante para lista de espera."
    },
    indicators: {
      time_estimate: "2 semanas",
      complexity: "Media",
      integrations: ["WhatsApp", "Software de gestión clínica"]
    },
    how_it_works_steps: [
      { title: "Detecta intención de cambio", short: "El paciente responde 'no puedo'.", detail: "Cuando el paciente responde al recordatorio que no puede venir, arranca el flujo de reprogramación." },
      { title: "Propone alternativas", short: "3 fechas según preferencia.", detail: "Consulta agenda del profesional preferido y propone 3 opciones." },
      { title: "Reagenda con un toque", short: "El paciente elige y listo.", detail: "El paciente elige una opción. La cita se reagenda y la anterior se libera." }
    ],
    benefits: [
      "Propone alternativas según disponibilidad",
      "Reprograma sin intervención humana",
      "Libera el hueco anterior al instante"
    ],
    pasos: [
      "Detectamos cuándo un paciente quiere cambiar su cita",
      "Consultamos su preferencia y la disponibilidad del profesional",
      "Proponemos 3 opciones alternativas",
      "El paciente elige y la cita se reagenda automáticamente",
      "Liberamos el hueco anterior para lista de espera"
    ],
    personalizacion: "Define qué profesionales aceptan reagenda automática, cuánta antelación se requiere y reglas de cancelación.",
    sectores: ["Centros de Salud"],
    herramientas: ["WhatsApp Business API", "Software de gestión clínica", "Make/n8n"],
    canales: ["WhatsApp"],
    dolores: [
      "Recepción pasa el día reagendando citas",
      "Cuando alguien cambia su cita, su hueco se queda perdido",
      "Los pacientes prefieren no avisar antes que llamar"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "salud",
    bloque_negocio: "B2",
    modulo_codigo: "2.2",
    related_processes: ["salud-recordatorios-citas", "salud-lista-espera"]
  },
  {
    id: "SAL-2.3",
    codigo: "2.3",
    slug: "salud-lista-espera",
    categoria: "B2",
    categoriaNombre: "Gestión de citas y ausencias",
    nombre: "Lista de espera activa",
    tagline: "Cuando alguien cancela, el hueco se ofrece automáticamente al primero de la lista por WhatsApp.",
    recomendado: true,
    descripcionDetallada: "Cuando una cita se libera (cancelación, reprogramación), el sistema ofrece automáticamente ese hueco al primer paciente de la lista de espera por WhatsApp. El paciente puede aceptar con un toque y la cita queda ocupada en minutos. Si no responde en X tiempo, pasa al siguiente.",
    summary: {
      what_it_is: "Lista de espera realmente operativa que llena cancelaciones en tiempo real.",
      for_who: ["Centros con lista de espera frecuente", "Clínicas con tratamientos especialistas (limitada disponibilidad)", "Negocios con agenda muy demandada"],
      requirements: ["Software de gestión clínica", "WhatsApp Business", "Lista de espera mantenida"],
      output: "Cancelaciones rescatadas en minutos sin llamadas de recepción."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja-Media",
      integrations: ["WhatsApp", "Software de gestión clínica"]
    },
    how_it_works_steps: [
      { title: "Detecta hueco libre", short: "Cancelación o reprograma.", detail: "Cuando una cita se libera, arranca el flujo de rescate." },
      { title: "Ofrece al siguiente", short: "WhatsApp con respuesta directa.", detail: "Envía mensaje al primero de la lista con el hueco disponible y respuesta de un toque." },
      { title: "Avanza si no responde", short: "Cadena automática.", detail: "Si no responde en el tiempo definido, pasa al siguiente automáticamente." }
    ],
    benefits: [
      "El hueco vuela al instante al siguiente",
      "Mensaje con respuesta directa, sin llamada",
      "Llena la agenda incluso con cancelaciones"
    ],
    pasos: [
      "Recibimos aviso de hueco libre",
      "Identificamos al primer candidato de la lista de espera",
      "Le enviamos el hueco por WhatsApp con respuesta directa",
      "Si acepta → cita creada. Si no responde → siguiente candidato",
      "El proceso se repite hasta llenar el hueco"
    ],
    personalizacion: "Define criterio de orden en la lista (FIFO, urgencia, fidelidad), tiempo de respuesta antes de avanzar y máximo de pacientes a contactar.",
    sectores: ["Centros de Salud"],
    herramientas: ["WhatsApp Business API", "Software de gestión clínica", "Make/n8n"],
    canales: ["WhatsApp"],
    dolores: [
      "Tenemos lista de espera pero no la usamos en cancelaciones",
      "Cuando se cae una cita, el hueco se queda vacío",
      "Llamar a 10 pacientes de la lista lleva horas"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "salud",
    bloque_negocio: "B2",
    modulo_codigo: "2.3",
    related_processes: ["salud-recordatorios-citas", "salud-reprogramacion-citas"]
  },
  {
    id: "SAL-2.4",
    codigo: "2.4",
    slug: "salud-reasignacion-profesional",
    categoria: "B2",
    categoriaNombre: "Gestión de citas y ausencias",
    nombre: "Reasignación inteligente de profesional",
    tagline: "Si un profesional se da de baja, reasigna sus citas según especialidad y disponibilidad — y avisa a todos.",
    recomendado: false,
    descripcionDetallada: "Si un profesional se da de baja repentina, el sistema reasigna sus citas del día / semana según especialidad, disponibilidad de otros profesionales y preferencias del paciente. Notifica a cada paciente afectado con la nueva asignación y opciones para mantener, cambiar o cancelar.",
    summary: {
      what_it_is: "Reasignación masiva de citas cuando un profesional no puede atender, con notificación coordinada.",
      for_who: ["Centros con varios profesionales", "Clínicas con bajas frecuentes", "Grupos con rotación de personal"],
      requirements: ["Software de gestión con datos de profesionales y especialidades", "WhatsApp Business"],
      output: "Cero citas tiradas por baja imprevista, con paciente informado al instante."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media-Alta",
      integrations: ["Software de gestión clínica", "WhatsApp"]
    },
    how_it_works_steps: [
      { title: "Detecta la baja", short: "Manual o automática.", detail: "Recepción marca al profesional como no disponible, o se detecta vía calendario sincronizado." },
      { title: "Reasigna las citas", short: "Por especialidad y disponibilidad.", detail: "Para cada cita afectada, busca un profesional compatible y la reasigna." },
      { title: "Notifica al paciente", short: "Con opciones claras.", detail: "Mensaje al paciente con la nueva asignación y posibilidad de mantener, cambiar o cancelar." }
    ],
    benefits: [
      "Detecta automáticamente bajas e imprevistos",
      "Reasigna por especialidad y disponibilidad",
      "Notifica al paciente y al equipo a la vez"
    ],
    pasos: [
      "Se marca al profesional como no disponible",
      "El sistema localiza sus citas afectadas",
      "Busca profesional compatible (especialidad + hueco)",
      "Reasigna y notifica al paciente con opciones",
      "Recepción ve el panel consolidado de cambios"
    ],
    personalizacion: "Define reglas de compatibilidad de profesionales, qué tipo de citas se pueden reasignar y qué pacientes prefieren cancelar siempre.",
    sectores: ["Centros de Salud"],
    herramientas: ["Software de gestión clínica", "WhatsApp Business API", "Make/n8n"],
    canales: ["WhatsApp"],
    dolores: [
      "Cuando se da de baja un profesional, perdemos un día entero de citas",
      "Reagendar 15 pacientes por baja imprevista es un caos",
      "Los pacientes se enteran tarde y se enfadan"
    ],
    integration_domains: ["COMMS", "OTHER"],
    landing_slug: "salud",
    bloque_negocio: "B2",
    modulo_codigo: "2.4",
    related_processes: ["salud-recordatorios-citas", "salud-comunicacion-turnos"]
  },

  // ── BLOQUE B3 · Reputación y reseñas ────────────────────────────────────
  {
    id: "SAL-3.1",
    codigo: "3.1",
    slug: "salud-solicitud-resenas",
    categoria: "B3",
    categoriaNombre: "Reputación y reseñas",
    nombre: "Solicitud automática de reseñas post-visita",
    tagline: "24-48h después de la visita, los pacientes contentos reciben enlace a Google. Los descontentos van a privado.",
    recomendado: true,
    descripcionDetallada: "Después de la visita, el sistema detecta el momento óptimo para pedir reseña (24-48h, no en caliente). Envía un mensaje breve. Si responde positivamente, enlace directo a Google. Si detecta señales de descontento, deriva la conversación al responsable en privado para gestionarlo antes de que se convierta en reseña pública negativa.",
    summary: {
      what_it_is: "Sistema automático de solicitud de reseñas con filtro de descontento — más reseñas positivas, menos sorpresas públicas.",
      for_who: ["Centros que quieren crecer en Google Maps y Doctoralia", "Clínicas que ya dan buen trato pero tienen pocas reseñas", "Negocios que protegen reputación online"],
      requirements: ["Software de gestión clínica", "WhatsApp/Email", "Ficha Google Business activa"],
      output: "Crecimiento orgánico de reseñas reales + protección frente a reseñas negativas sorpresivas."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["WhatsApp/Email", "Google Business", "Doctoralia (opcional)"]
    },
    how_it_works_steps: [
      { title: "Detecta el momento", short: "24-48h después de la visita.", detail: "Tras la visita esperamos el momento de satisfacción procesada para pedir reseña." },
      { title: "Pregunta breve", short: "Una sola pregunta sencilla.", detail: "Mensaje corto y personal. Si responde bien → enlace a Google. Si responde mal → conversación privada." },
      { title: "Gestión de descontentos", short: "En privado, no en público.", detail: "Si el paciente menciona algo negativo, lo derivamos al responsable con todo el contexto." }
    ],
    benefits: [
      "Más reseñas 5★ pidiendo en el momento de máxima satisfacción",
      "Filtro de descontentos a canal privado — protege reputación",
      "Crecimiento orgánico de reseñas reales en Google Maps"
    ],
    pasos: [
      "Detectamos las visitas realizadas del día anterior",
      "Enviamos mensaje breve de seguimiento al paciente",
      "Si la respuesta es positiva → enlace a reseña Google",
      "Si la respuesta es negativa → conversación privada con el responsable",
      "Registramos la interacción para análisis"
    ],
    personalizacion: "Define cuándo se envía (24h, 48h), el tono, el canal (WhatsApp/email) y quién recibe los descontentos.",
    sectores: ["Centros de Salud"],
    herramientas: ["WhatsApp Business API", "Resend/SendGrid", "Google Business API", "Make/n8n"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "Damos buen servicio pero tenemos pocas reseñas",
      "Solo nos dejan reseña las quejas",
      "La competencia tiene 500 reseñas y nosotros 50"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "salud",
    bloque_negocio: "B3",
    modulo_codigo: "3.1",
    related_processes: ["salud-alertas-resenas-negativas"]
  },
  {
    id: "SAL-3.2",
    codigo: "3.2",
    slug: "salud-alertas-resenas-negativas",
    categoria: "B3",
    categoriaNombre: "Reputación y reseñas",
    nombre: "Alertas de reseñas negativas en tiempo real",
    tagline: "Cuando alguien publica reseña <3★, recibes alerta con borrador de respuesta listo para revisar.",
    recomendado: false,
    descripcionDetallada: "Monitorizamos Google Business, Doctoralia, Top Doctors y otras plataformas. Cuando aparece una reseña por debajo de 3 estrellas, el responsable recibe una alerta inmediata con la reseña, el contexto del paciente y un borrador de respuesta generado por IA en el tono del centro.",
    summary: {
      what_it_is: "Monitorización + alerta + asistencia de respuesta para reseñas negativas en todas las plataformas relevantes.",
      for_who: ["Centros presentes en Google + Doctoralia + Top Doctors", "Clínicas que cuidan reputación online", "Grupos que necesitan visibilidad consolidada multi-centro"],
      requirements: ["Acceso a Google Business", "Cuenta Doctoralia/Top Doctors (opcional)"],
      output: "100% de las reseñas <3★ con respuesta en menos de 24h, en el tono del centro."
    },
    indicators: {
      time_estimate: "1 semana",
      complexity: "Baja",
      integrations: ["Google Business", "Doctoralia", "WhatsApp/Email"]
    },
    how_it_works_steps: [
      { title: "Monitoriza 24/7", short: "Todas las plataformas.", detail: "Vigilamos Google, Doctoralia, Top Doctors y cualquier otra plataforma donde estés presente." },
      { title: "Alerta inmediata", short: "Aviso con contexto y borrador.", detail: "Si aparece una reseña <3★, llega notificación con la reseña, el contexto del paciente y un borrador IA." },
      { title: "Respuesta humana asistida", short: "Tú revisas y publicas.", detail: "El borrador respeta el tono del centro. Solo revisas, ajustas si quieres y publicas." }
    ],
    benefits: [
      "Alerta inmediata cuando publican una reseña <3★",
      "Borrador de respuesta generado con IA en el tono del centro",
      "Cero reseñas malas sin responder ni respuestas tardías"
    ],
    pasos: [
      "Monitorizamos las plataformas de reseñas en tiempo real",
      "Detectamos reseñas por debajo del umbral (por defecto 3★)",
      "Buscamos contexto del paciente en tu sistema",
      "Generamos borrador de respuesta personalizado",
      "Te enviamos alerta con todo + opción de aprobar/editar"
    ],
    personalizacion: "Define el umbral de estrellas, las plataformas, el tono de la respuesta IA y quién recibe la alerta.",
    sectores: ["Centros de Salud"],
    herramientas: ["Google Business API", "Doctoralia API", "OpenAI", "WhatsApp Business / Email"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "Nos enteramos de las reseñas malas días después",
      "No sabemos qué responder ni con qué tono",
      "Cuando respondemos, ya nadie las ve"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "salud",
    bloque_negocio: "B3",
    modulo_codigo: "3.2",
    related_processes: ["salud-solicitud-resenas"]
  },

  // ── BLOQUE B4 · Seguimiento clínico y fidelización ──────────────────────
  {
    id: "SAL-4.1",
    codigo: "4.1",
    slug: "salud-recordatorios-revision",
    categoria: "B4",
    categoriaNombre: "Seguimiento clínico y fidelización",
    nombre: "Recordatorios de revisión periódica",
    tagline: "El sistema sabe cuándo cada paciente debe volver y le envía un recordatorio con opción de reservar al toque.",
    recomendado: true,
    descripcionDetallada: "Para cada paciente, el sistema sabe cuándo toca su próxima revisión (limpieza dental anual, control de mantenimiento, chequeo periódico) y envía un recordatorio amable en ese momento, con opción de reservar directamente desde el mensaje. Sin que recepción tenga que llamar a 200 pacientes al mes.",
    summary: {
      what_it_is: "Sistema de recordatorios de revisión periódica que mantiene a los pacientes volviendo sin esfuerzo de recepción.",
      for_who: ["Clínicas dentales (limpiezas anuales)", "Centros con tratamientos de mantenimiento", "Veterinarias con vacunación periódica"],
      requirements: ["Software de gestión con histórico de visitas", "WhatsApp/Email"],
      output: "Tasa de retorno a revisión periódica del 60-80% sin esfuerzo humano."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja-Media",
      integrations: ["Software de gestión clínica", "WhatsApp/Email"]
    },
    how_it_works_steps: [
      { title: "Calendario individual", short: "Por paciente y tratamiento.", detail: "Para cada paciente, sabemos cuándo le toca su próxima revisión según tipo y última visita." },
      { title: "Recordatorio amable", short: "Con motivo concreto.", detail: "En el momento adecuado, mensaje personal con motivo claro y opción de reservar." },
      { title: "Reserva al toque", short: "Sin llamar a recepción.", detail: "Desde el mensaje el paciente puede ver huecos disponibles y reservar al instante." }
    ],
    benefits: [
      "Calendario de revisiones personalizado",
      "Recordatorio en el momento adecuado",
      "Reserva con un toque desde el mensaje"
    ],
    pasos: [
      "Identificamos para cada paciente cuándo toca revisión",
      "En el momento adecuado, enviamos recordatorio amable",
      "Incluimos opción de reservar directa con un toque",
      "Si reserva → cita creada. Si no responde → segundo recordatorio en X días",
      "Pasamos a recepción solo los casos persistentes"
    ],
    personalizacion: "Define la periodicidad por tipo de tratamiento, el tono del recordatorio y cuántos avisos máximos por paciente.",
    sectores: ["Centros de Salud"],
    herramientas: ["Software de gestión clínica", "WhatsApp Business", "Make/n8n"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "Pacientes habituales no vuelven a su revisión y nadie los avisa",
      "Recepción no tiene tiempo de llamar a 200 personas al mes",
      "Perdemos pacientes recurrentes que se van a la competencia"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "salud",
    bloque_negocio: "B4",
    modulo_codigo: "4.1",
    related_processes: ["salud-reactivacion-pacientes", "salud-mensajes-programados"]
  },
  {
    id: "SAL-4.2",
    codigo: "4.2",
    slug: "salud-reactivacion-pacientes",
    categoria: "B4",
    categoriaNombre: "Seguimiento clínico y fidelización",
    nombre: "Reactivación de pacientes inactivos",
    tagline: "Si un paciente habitual lleva más tiempo del normal sin venir, le enviamos un mensaje personal — no campaña masiva.",
    recomendado: false,
    descripcionDetallada: "El sistema detecta automáticamente cuándo un paciente habitual lleva más tiempo del normal sin visitar el centro. En ese momento, le envía un mensaje personal con un motivo concreto para volver: una novedad del centro, un cambio en cartera, una mención cercana a su última visita. Recupera entre el 15% y el 25% de la base inactiva sin coste publicitario.",
    summary: {
      what_it_is: "Detección de pacientes que se enfrían + envío de mensajes personales de reactivación.",
      for_who: ["Clínicas con base de habituales identificada", "Centros maduros con historial", "Negocios con ticket alto donde un paciente perdido cuesta"],
      requirements: ["Software de gestión con histórico", "WhatsApp/Email"],
      output: "Recuperación del 15-25% de pacientes inactivos con mensajes personales."
    },
    indicators: {
      time_estimate: "2 semanas",
      complexity: "Media",
      integrations: ["Software de gestión clínica", "WhatsApp/Email"]
    },
    how_it_works_steps: [
      { title: "Detecta pacientes fríos", short: "Más tiempo del normal sin venir.", detail: "Calcula para cada paciente su frecuencia habitual y detecta cuándo se está saliendo del patrón." },
      { title: "Mensaje personal", short: "Con motivo concreto.", detail: "Genera mensaje individual con gancho real: cambio en cartera, novedad, mención a última visita." },
      { title: "Mide la respuesta", short: "Qué funciona, qué no.", detail: "Trackea quién vuelve, qué tipo de mensaje convierte mejor, aprende y mejora." }
    ],
    benefits: [
      "Detección automática de patrones de visita",
      "Mensaje personal, no campaña masiva",
      "Recupera entre el 15% y el 25% de la base inactiva"
    ],
    pasos: [
      "Calculamos la frecuencia normal de cada paciente",
      "Detectamos cuándo alguien se sale del patrón",
      "Generamos mensaje personal con motivo concreto",
      "Lo enviamos por el canal preferido del paciente",
      "Medimos respuesta y mejoramos en cada ciclo"
    ],
    personalizacion: "Define qué cuenta como 'inactivo' (umbral de tiempo), canales, tipos de gancho y frecuencia máxima de contacto.",
    sectores: ["Centros de Salud"],
    herramientas: ["Software de gestión clínica", "WhatsApp Business / Email", "OpenAI", "Make/n8n"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "Teníamos pacientes habituales que han dejado de venir y no sabemos por qué",
      "No hacemos nada cuando alguien deja de venir",
      "Pagamos publicidad para captar nuevos en vez de recuperar los que ya tuvimos"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "salud",
    bloque_negocio: "B4",
    modulo_codigo: "4.2",
    related_processes: ["salud-recordatorios-revision", "salud-mensajes-programados"]
  },
  {
    id: "SAL-3.3",
    codigo: "3.3",
    slug: "salud-encuestas-post-tratamiento",
    categoria: "B3",
    categoriaNombre: "Reputación y reseñas",
    nombre: "Encuestas de satisfacción post-tratamiento",
    tagline: "Después de un tratamiento concreto, encuesta breve para saber cómo fue — en el momento útil, con datos accionables.",
    recomendado: false,
    descripcionDetallada: "Tras un tratamiento concreto (no una visita rápida), el paciente recibe una encuesta breve para saber cómo fue la experiencia y el resultado. Te llega el resumen consolidado y alertas si algún caso requiere atención. Datos accionables — no NPS abstracto.",
    summary: {
      what_it_is: "Encuestas de satisfacción post-tratamiento con alertas y consolidado, útiles para mejora real.",
      for_who: ["Clínicas con tratamientos diferenciados (estética, dental, fisio)", "Centros que quieren medir calidad real", "Negocios que aprenden de cada caso"],
      requirements: ["Software de gestión con histórico de tratamientos", "WhatsApp/Email"],
      output: "Feedback estructurado de pacientes en el momento útil, con alertas accionables."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja-Media",
      integrations: ["Software de gestión clínica", "WhatsApp/Email"]
    },
    how_it_works_steps: [
      { title: "Detecta tratamientos clave", short: "No cada visita, sólo las importantes.", detail: "Identifica las visitas que ameritan encuesta (no una limpieza rápida)." },
      { title: "Encuesta breve", short: "5 preguntas máximo.", detail: "Mensaje sencillo con preguntas concretas sobre la experiencia y el resultado." },
      { title: "Consolida y alerta", short: "Resumen + casos a revisar.", detail: "Te llega el resumen + alerta inmediata si alguien menciona algo grave." }
    ],
    benefits: [
      "Encuesta en el momento de la verdad",
      "Detección automática de pacientes a contactar",
      "Datos accionables, no solo NPS abstracto"
    ],
    pasos: [
      "Identificamos las visitas que ameritan encuesta",
      "Enviamos encuesta breve al paciente",
      "Consolidamos las respuestas semanalmente",
      "Si hay alerta, notificación inmediata al responsable",
      "Te llega el resumen con datos accionables"
    ],
    personalizacion: "Define qué visitas activan encuesta, las preguntas, el formato y los umbrales que generan alerta.",
    sectores: ["Centros de Salud"],
    herramientas: ["Software de gestión clínica", "WhatsApp Business / Resend", "Make/n8n"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "No sabemos cómo de satisfechos están realmente los pacientes",
      "Solo nos enteramos cuando hay queja en Google",
      "Las encuestas que enviamos no responde nadie"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "salud",
    bloque_negocio: "B3",
    modulo_codigo: "3.3",
    related_processes: ["salud-solicitud-resenas", "salud-reactivacion-pacientes"]
  },
  {
    id: "SAL-4.3",
    codigo: "4.3",
    slug: "salud-mensajes-programados",
    categoria: "B4",
    categoriaNombre: "Seguimiento clínico y fidelización",
    nombre: "Mensajes programados a pacientes",
    tagline: "Defines una vez las comunicaciones que quieres mantener vivas con tus pacientes — el sistema las envía en el momento adecuado a quien corresponda.",
    recomendado: false,
    descripcionDetallada: "Un calendario único de comunicaciones programadas hacia tu base de pacientes: felicitaciones de cumpleaños, aniversarios de tratamiento, recordatorios estacionales (cambio de estación, vuelta de vacaciones), seguimiento post-tratamiento, novedades del centro. El sistema segmenta automáticamente por tipo de paciente y envía en el momento adecuado, siempre con consentimiento RGPD y sin saturar.",
    summary: {
      what_it_is: "Calendario central de comunicaciones programadas a pacientes, segmentadas y RGPD-compliant.",
      for_who: ["Centros que cuidan la relación a largo plazo", "Clínicas con varios tipos de paciente", "Negocios que quieren mantener vínculo sin saturar"],
      requirements: ["Base de pacientes con consentimientos", "WhatsApp/Email", "Calendario de comunicaciones definido"],
      output: "Comunicaciones automáticas en el momento adecuado, segmentadas por tipo de paciente, sin trabajo manual."
    },
    indicators: {
      time_estimate: "2 semanas",
      complexity: "Baja-Media",
      integrations: ["Software de gestión clínica", "WhatsApp/Email"]
    },
    how_it_works_steps: [
      { title: "Calendario de mensajes", short: "Defines una vez, se ejecuta solo.", detail: "Configuramos juntos qué comunicaciones quieres mantener vivas y cuándo se disparan (fechas fijas, eventos, hitos por paciente)." },
      { title: "Segmenta destinatarios", short: "A quién aplica cada uno.", detail: "Cada mensaje sólo llega al perfil que encaja (consentimiento, tipo de tratamiento, frecuencia de visita)." },
      { title: "Envía y mide", short: "Sin saturar, con control.", detail: "El sistema respeta la frecuencia máxima por paciente y registra bajas para no insistir." }
    ],
    benefits: [
      "Un solo calendario para todas las comunicaciones del centro",
      "Segmentación automática por tipo de paciente",
      "Tono humano, RGPD-compliant, sin saturar"
    ],
    pasos: [
      "Definimos juntos el calendario de comunicaciones del centro",
      "Configuramos disparadores: fechas fijas o eventos del paciente",
      "Segmentamos audiencias por consentimiento y tipo de tratamiento",
      "El sistema envía cada mensaje en su momento al perfil correcto",
      "Medimos respuesta y bajas para ajustar frecuencia"
    ],
    personalizacion: "Define el calendario de comunicaciones, segmentación por tipo de paciente, canales, frecuencia máxima y reglas RGPD.",
    sectores: ["Centros de Salud"],
    herramientas: ["Software de gestión clínica", "WhatsApp Business / Resend", "Make/n8n"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "Queremos mantener vivo el vínculo pero no tenemos tiempo",
      "Las comunicaciones que enviamos no están coordinadas",
      "Saturamos al paciente o desaparecemos completamente — sin término medio"
    ],
    integration_domains: ["COMMS"],
    landing_slug: "salud",
    bloque_negocio: "B4",
    modulo_codigo: "4.3",
    related_processes: ["salud-reactivacion-pacientes", "salud-recordatorios-revision"]
  },

  // ── BLOQUE B5 · Administración y facturación ────────────────────────────
  {
    id: "SAL-5.1",
    codigo: "5.1",
    slug: "salud-facturacion-mutuas",
    categoria: "B5",
    categoriaNombre: "Administración y facturación",
    nombre: "Facturación automática a mutuas y aseguradoras",
    tagline: "Adeslas, Sanitas, Asisa, DKV — cada una con su formato. Lo preparamos, enviamos y hacemos seguimiento de cobro.",
    recomendado: true,
    descripcionDetallada: "El sistema prepara las facturas a cada aseguradora con el formato y los códigos que cada una requiere. Las envía por su canal (portal, email, EDI), mantiene seguimiento del estado de cobro y avisa cuando una factura ha sido rechazada o lleva demasiado tiempo pendiente.",
    summary: {
      what_it_is: "Facturación automatizada a aseguradoras adaptada al formato de cada una, con seguimiento de cobro.",
      for_who: ["Clínicas que trabajan con mutuas (Adeslas, Sanitas, Asisa, DKV)", "Centros con volumen alto de seguros", "Negocios que pierden ingresos por facturas mal rechazadas"],
      requirements: ["Software de gestión clínica con datos de aseguradora", "Acceso a portales o EDI de aseguradoras"],
      output: "Cobro más rápido + visibilidad del estado de cada factura por aseguradora."
    },
    indicators: {
      time_estimate: "3-4 semanas",
      complexity: "Media-Alta",
      integrations: ["Software de gestión clínica", "Portales de aseguradoras", "Email/EDI"]
    },
    how_it_works_steps: [
      { title: "Detecta facturas a generar", short: "Tras la visita.", detail: "Cuando una visita se cierra, identifica si va a paciente o a aseguradora." },
      { title: "Formato por aseguradora", short: "Cada una con sus códigos.", detail: "Aplica el formato y los códigos que cada aseguradora requiere." },
      { title: "Envía y trackea", short: "Estado de cada factura.", detail: "Envía por el canal de cada aseguradora y mantiene visibilidad del estado de cobro." }
    ],
    benefits: [
      "Adapta el formato a cada aseguradora",
      "Seguimiento del estado de cobro",
      "Avisos automáticos de impagos"
    ],
    pasos: [
      "Identificamos visitas facturables a aseguradora",
      "Preparamos la factura con el formato correcto",
      "Enviamos por el canal de cada aseguradora",
      "Trackeamos el estado de cobro de cada una",
      "Avisamos de rechazos o impagos para acción"
    ],
    personalizacion: "Define con qué aseguradoras trabajáis, el formato/código de cada una y los umbrales que activan aviso de impago.",
    sectores: ["Centros de Salud"],
    herramientas: ["Software de gestión clínica", "Portales aseguradoras", "Make/n8n", "Email/EDI"],
    dolores: [
      "Cada aseguradora tiene su formato y enviamos las facturas mal",
      "Nos rechazan facturas y nos enteramos meses después",
      "No sabemos qué tenemos pendiente de cobro de cada mutua"
    ],
    integration_domains: ["ERP"],
    landing_slug: "salud",
    bloque_negocio: "B5",
    modulo_codigo: "5.1",
    related_processes: ["salud-seguimiento-cobros", "salud-reporte-diario"]
  },
  {
    id: "SAL-5.2",
    codigo: "5.2",
    slug: "salud-seguimiento-cobros",
    categoria: "B5",
    categoriaNombre: "Administración y facturación",
    nombre: "Seguimiento de facturas pendientes de cobro",
    tagline: "Recordatorios escalonados antes y después del vencimiento para que ninguna factura se convierta en impago.",
    recomendado: false,
    descripcionDetallada: "Vigilancia diaria de facturas emitidas (a pacientes y aseguradoras). Cuando una factura está próxima a vencer o ha vencido, envía recordatorios escalonados según el tipo de cliente y el importe. Cero facturas olvidadas. Cobros más rápidos sin perseguir manualmente.",
    summary: {
      what_it_is: "Sistema de recordatorios escalonados que reduce impagos y acelera cobros sin esfuerzo humano.",
      for_who: ["Clínicas con facturas a paciente directo", "Centros con cobro retrasado de mutuas", "Negocios que quieren mejorar cash flow"],
      requirements: ["Software de gestión con facturas y estados", "WhatsApp/Email/SMS"],
      output: "Cero facturas olvidadas + reducción del DSO (días de cobro)."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja-Media",
      integrations: ["Software de gestión", "WhatsApp/Email"]
    },
    how_it_works_steps: [
      { title: "Vigila vencimientos", short: "Cada día revisa el estado.", detail: "Cada noche revisa facturas próximas y vencidas, calcula urgencia." },
      { title: "Recordatorio escalonado", short: "Tono según urgencia.", detail: "Primero amable, luego más firme. Diferente para paciente directo vs aseguradora." },
      { title: "Escala si hace falta", short: "A humano si no responde.", detail: "Si tras X recordatorios sigue sin pagar, deriva al responsable con todo el contexto." }
    ],
    benefits: [
      "Recordatorios escalonados antes del vencimiento",
      "Visibilidad del estado de cada factura",
      "Notifica solo cuando hace falta intervenir"
    ],
    pasos: [
      "Cada día revisamos vencimientos próximos y vencidos",
      "Enviamos recordatorios escalonados por canal del cliente",
      "Aplicamos tono diferente según urgencia",
      "Si tras varios avisos no paga, escalamos al responsable",
      "Actualizamos estado en el sistema"
    ],
    personalizacion: "Define la cadencia de recordatorios, los tonos por etapa y qué umbral escala a humano.",
    sectores: ["Centros de Salud"],
    herramientas: ["Software de gestión clínica", "WhatsApp/Email", "Make/n8n"],
    canales: ["WhatsApp", "Email", "SMS"],
    dolores: [
      "Tenemos facturas vencidas y nadie las persigue",
      "Olvidamos cobrar a algunos pacientes",
      "El cash flow sufre por cobros que llegan tarde"
    ],
    integration_domains: ["ERP", "COMMS"],
    landing_slug: "salud",
    bloque_negocio: "B5",
    modulo_codigo: "5.2",
    related_processes: ["salud-facturacion-mutuas", "salud-registro-gastos"]
  },
  {
    id: "SAL-5.3",
    codigo: "5.3",
    slug: "salud-registro-gastos",
    categoria: "B5",
    categoriaNombre: "Administración y facturación",
    nombre: "Registro automático de gastos",
    tagline: "Foto al ticket o reenvío de factura — extraemos datos, registramos en ERP y archivamos en la nube.",
    recomendado: false,
    descripcionDetallada: "El equipo hace foto a un ticket o reenvía la factura por email. El sistema extrae proveedor, importe, fecha, IVA y partida de gasto, lo registra en el ERP y archiva el justificante en la nube. Adiós a cajas de tickets, adiós a buscar a fin de mes qué se compró.",
    summary: {
      what_it_is: "Captura automatizada de tickets y facturas + clasificación contable + archivo en la nube.",
      for_who: ["Centros con varias categorías de gasto", "Negocios con compras descentralizadas", "Centros que quieren cerrar mes en horas"],
      requirements: ["Móvil del equipo o email", "ERP", "Almacenamiento en la nube"],
      output: "Cierre de mes en horas + trazabilidad completa de cada gasto."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["OCR / IA", "ERP", "Google Drive / Dropbox"]
    },
    how_it_works_steps: [
      { title: "Captura el justificante", short: "Foto del ticket o email.", detail: "Cualquiera del equipo hace foto o reenvía factura. Sin app especial." },
      { title: "Extrae los datos", short: "OCR + IA leen todo.", detail: "Extrae proveedor, importe, fecha, IVA y propone partida de gasto según tu plan contable." },
      { title: "Registra y archiva", short: "ERP + nube.", detail: "Anota el gasto en ERP con clasificación y guarda el justificante en la nube." }
    ],
    benefits: [
      "Cero tickets perdidos",
      "Cierre de mes en horas, no en días",
      "Trazabilidad total de cada gasto"
    ],
    pasos: [
      "El equipo hace foto al ticket o reenvía la factura por email",
      "Extraemos proveedor, importe, fecha, IVA",
      "Clasificamos por partida según tu plan contable",
      "Registramos en el ERP",
      "Archivamos justificante en la nube"
    ],
    personalizacion: "Define las partidas de gasto según tu plan contable, el sistema de archivo en la nube y qué emails de proveedor conectar.",
    sectores: ["Centros de Salud"],
    herramientas: ["Mindee / OCR", "Holded / Anfix", "Google Drive / Dropbox", "Make/n8n"],
    dolores: [
      "Los tickets de proveedores se pierden o no se registran",
      "El cierre de mes es buscar justificantes",
      "No sabemos cuánto gastamos por partida hasta meses después"
    ],
    integration_domains: ["ERP", "DOCS"],
    landing_slug: "salud",
    bloque_negocio: "B5",
    modulo_codigo: "5.3",
    related_processes: ["salud-seguimiento-cobros", "salud-reporte-diario"]
  },
  {
    id: "SAL-5.4",
    codigo: "5.4",
    slug: "salud-reporte-diario",
    categoria: "B5",
    categoriaNombre: "Administración y facturación",
    nombre: "Reporte diario por clínica",
    tagline: "Cada mañana, parte único con pacientes atendidos, ingresos, ausencias y reseñas del día anterior.",
    recomendado: true,
    descripcionDetallada: "Cada mañana llega un parte consolidado del día anterior por clínica: pacientes atendidos, ingresos, ticket medio, ausencias, reseñas nuevas. Para grupos con varios centros, parte individual por centro + consolidado del grupo. Sin esperar al cierre del gestor.",
    summary: {
      what_it_is: "Informe diario operativo y financiero consolidado, listo antes de abrir el ordenador.",
      for_who: ["Directores de clínica", "Grupos con varios centros", "Propietarios que quieren visibilidad sin perseguir al gestor"],
      requirements: ["Software de gestión clínica", "Email/WhatsApp"],
      output: "Un mensaje matutino con todos los KPIs clave del día anterior."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["Software de gestión clínica", "Email/WhatsApp"]
    },
    how_it_works_steps: [
      { title: "Recopila overnight", short: "De todas las fuentes.", detail: "Durante la noche el sistema recoge pacientes, ingresos, reseñas, ausencias." },
      { title: "Consolida por centro", short: "Un mensaje, no cinco.", detail: "Une todos los datos en parte claro por centro + consolidado del grupo." },
      { title: "Envía al equipo", short: "WhatsApp o email a primera hora.", detail: "Llega al canal y hora que defines sin que nadie lo prepare." }
    ],
    benefits: [
      "Llega por WhatsApp o email a primera hora",
      "Multi-clínica en un único parte consolidado",
      "Sin esperar al cierre del gestor"
    ],
    pasos: [
      "Conectamos software de gestión y reseñas",
      "Definimos el horario y formato del parte",
      "Cada mañana se generan los datos del día anterior",
      "Se consolidan en un mensaje único por centro y grupo",
      "Se envía por WhatsApp o email"
    ],
    personalizacion: "Define qué KPIs incluir, formato, hora, destinatarios por centro y por grupo.",
    sectores: ["Centros de Salud"],
    herramientas: ["Software de gestión clínica", "Make/n8n", "WhatsApp/Email"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "Llamo al encargado para saber cómo fue el día",
      "Tengo varios centros y no consigo visión consolidada",
      "Los informes que pido tardan semanas"
    ],
    integration_domains: ["ERP", "OTHER"],
    landing_slug: "salud",
    bloque_negocio: "B5",
    modulo_codigo: "5.4",
    related_processes: ["salud-facturacion-mutuas", "salud-registro-gastos"]
  },

  // ── BLOQUE B6 · Gestión del equipo clínico ──────────────────────────────
  {
    id: "SAL-6.1",
    codigo: "6.1",
    slug: "salud-comunicacion-turnos",
    categoria: "B6",
    categoriaNombre: "Gestión del equipo clínico",
    nombre: "Comunicación automática de turnos",
    tagline: "Cada miembro recibe su turno individual por WhatsApp con confirmación de lectura. Cambios solo a quien afecta.",
    recomendado: true,
    descripcionDetallada: "Cada semana, cada persona del equipo recibe su turno individualizado por WhatsApp con confirmación de lectura. Los cambios se notifican al instante solo a quien afecta — fin del grupo caótico donde todos reciben todo.",
    summary: {
      what_it_is: "Comunicación de turnos individual con confirmación, sin grupos de WhatsApp ingobernables.",
      for_who: ["Centros con equipos de 5+ personas", "Clínicas con turnos rotativos", "Grupos con varios profesionales"],
      requirements: ["Cuadrante de turnos", "WhatsApp del equipo"],
      output: "Cero malentendidos de turnos + comunicación clara sin saturar."
    },
    indicators: {
      time_estimate: "2 semanas",
      complexity: "Media",
      integrations: ["WhatsApp Business", "Software de turnos / Excel"]
    },
    how_it_works_steps: [
      { title: "Envía turnos individuales", short: "Cada uno el suyo.", detail: "Cada semana, cada persona recibe su turno individualizado con confirmación de lectura." },
      { title: "Gestiona cambios", short: "Solo a quien afecta.", detail: "Si hay cambio, se notifica solo a las personas afectadas." },
      { title: "Sustituciones inteligentes", short: "Propone candidatos.", detail: "Si alguien no puede, propone sustituto según rol y disponibilidad." }
    ],
    benefits: [
      "Turnos individuales con confirmación de lectura",
      "Cambios notificados solo a quien afectan",
      "Fin del grupo de WhatsApp ingobernable"
    ],
    pasos: [
      "Conectamos el cuadrante de turnos",
      "Enviamos a cada persona su turno individual",
      "Detectamos confirmación de lectura",
      "Notificamos cambios solo a afectados",
      "Si alguien falta, proponemos sustituto"
    ],
    personalizacion: "Define día/hora de envío, criterios de sustitución y confirmaciones a pedir.",
    sectores: ["Centros de Salud"],
    herramientas: ["WhatsApp Business API", "Sesame / Factorial", "Make/n8n"],
    canales: ["WhatsApp"],
    dolores: [
      "Los grupos de WhatsApp del equipo son ingobernables",
      "Cada cambio de turno requiere 20 llamadas",
      "Cuando alguien falta, perdemos una hora buscando sustituto"
    ],
    integration_domains: ["COMMS", "OTHER"],
    landing_slug: "salud",
    bloque_negocio: "B6",
    modulo_codigo: "6.1",
    related_processes: ["salud-onboarding-personal", "salud-sustituciones-bajas"]
  },
  {
    id: "SAL-6.2",
    codigo: "6.2",
    slug: "salud-onboarding-personal",
    categoria: "B6",
    categoriaNombre: "Gestión del equipo clínico",
    nombre: "Onboarding automático de personal sanitario",
    tagline: "Cuando entra alguien nuevo (auxiliar, higienista, recepción), recibe documentos, protocolos y formación inicial.",
    recomendado: false,
    descripcionDetallada: "Cuando se incorpora una persona nueva al equipo clínico, recibe automáticamente toda la información que necesita: contrato y documentación, protocolos del centro (apertura, cierre, esterilización, atención al paciente, RGPD), vídeos de procedimientos, contactos del equipo y normas básicas. Operativa desde el primer día sin saturar al coordinador.",
    summary: {
      what_it_is: "Onboarding automatizado para personal nuevo con todo el material clínico y administrativo.",
      for_who: ["Clínicas con rotación alta", "Centros con múltiples sedes", "Negocios donde el coordinador pierde tiempo explicando lo mismo"],
      requirements: ["Carpeta con protocolos y documentos", "WhatsApp/Email del nuevo"],
      output: "Persona nueva operativa desde el primer turno sin saturar al coordinador."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja",
      integrations: ["WhatsApp/Email", "Google Drive / Notion"]
    },
    how_it_works_steps: [
      { title: "Detecta el alta", short: "Nuevo en el sistema.", detail: "Al registrar al nuevo (o añadirlo manualmente), arranca el flujo de onboarding." },
      { title: "Envía paquete inicial", short: "Documentos, protocolos, vídeos.", detail: "Mensaje organizado con todo: contrato, protocolos, vídeos, contactos del equipo, normas." },
      { title: "Seguimiento", short: "¿Tiene dudas?", detail: "A los pocos días pregunta si todo está claro y deriva al coordinador si hay dudas." }
    ],
    benefits: [
      "Documentos, protocolos y vídeos enviados al instante",
      "Coordinador deja de repetir lo mismo cada vez",
      "Persona nueva operativa el primer día"
    ],
    pasos: [
      "Se detecta el alta de personal nuevo",
      "Se le envía el paquete de onboarding por WhatsApp/email",
      "Recibe documentos, protocolos, vídeos de procedimientos",
      "Seguimiento a los pocos días para detectar dudas",
      "Notificación al coordinador si hay puntos pendientes"
    ],
    personalizacion: "Define qué materiales incluir, en qué orden, canal y días de seguimiento.",
    sectores: ["Centros de Salud"],
    herramientas: ["Google Drive / Notion", "WhatsApp Business", "Make/n8n"],
    canales: ["WhatsApp", "Email"],
    dolores: [
      "Cada vez que entra alguien nuevo el coordinador pierde un día",
      "El personal nuevo empieza sin saber dónde está nada",
      "Repetimos la misma explicación 30 veces al año"
    ],
    integration_domains: ["DOCS", "COMMS"],
    landing_slug: "salud",
    bloque_negocio: "B6",
    modulo_codigo: "6.2",
    related_processes: ["salud-comunicacion-turnos", "salud-sustituciones-bajas"]
  },
  {
    id: "SAL-6.3",
    codigo: "6.3",
    slug: "salud-sustituciones-bajas",
    categoria: "B6",
    categoriaNombre: "Gestión del equipo clínico",
    nombre: "Sustituciones inteligentes y gestión de bajas",
    tagline: "Si un profesional se da de baja, propone sustitutos según rol y reasigna citas afectadas en bloque.",
    recomendado: false,
    descripcionDetallada: "Cuando un miembro del equipo no puede venir (baja imprevista, enfermedad), el sistema propone sustitutos según rol, disponibilidad y experiencia, gestiona el aviso al equipo y reasigna las citas afectadas en bloque. Cobertura sin estrés.",
    summary: {
      what_it_is: "Sistema de gestión de bajas e imprevistos con propuesta automática de sustitutos y reasignación masiva.",
      for_who: ["Centros con bajas frecuentes", "Clínicas con equipos pequeños donde una baja desorganiza el día", "Grupos con personal rotativo"],
      requirements: ["Lista de personal con rol y disponibilidad", "Software de gestión", "WhatsApp"],
      output: "Cero días tirados por bajas imprevistas + reasignación coordinada."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media-Alta",
      integrations: ["Software de gestión", "WhatsApp", "Make/n8n"]
    },
    how_it_works_steps: [
      { title: "Detecta la baja", short: "Comunicada o detectada.", detail: "Coordinación marca la baja o se detecta vía calendario." },
      { title: "Propone sustituto", short: "Por rol y disponibilidad.", detail: "Busca candidatos según rol, disponibilidad y preferencias del paciente." },
      { title: "Reasigna y notifica", short: "En bloque y coordinado.", detail: "Reasigna citas, notifica a pacientes y al equipo de forma coordinada." }
    ],
    benefits: [
      "Propuesta automática de sustitutos por rol",
      "Reasignación masiva de citas afectadas",
      "Notificación coordinada al equipo y pacientes"
    ],
    pasos: [
      "Se detecta o registra la baja del profesional",
      "Identificamos sus citas afectadas",
      "Buscamos sustituto compatible (rol + disponibilidad)",
      "Reasignamos las citas",
      "Notificamos a pacientes y equipo de forma coordinada"
    ],
    personalizacion: "Define criterios de compatibilidad por rol, qué citas se pueden reasignar y cuáles cancelar.",
    sectores: ["Centros de Salud"],
    herramientas: ["Software de gestión", "WhatsApp Business API", "Make/n8n"],
    canales: ["WhatsApp"],
    dolores: [
      "Una baja imprevista nos desorganiza el día entero",
      "Reasignar pacientes manualmente lleva horas",
      "Los pacientes se enteran tarde y se enfadan"
    ],
    integration_domains: ["COMMS", "OTHER"],
    landing_slug: "salud",
    bloque_negocio: "B6",
    modulo_codigo: "6.3",
    related_processes: ["salud-comunicacion-turnos", "salud-reasignacion-profesional"]
  },
  // ─── Academias / Formación ───────────────────────────────────────────────
  {
    id: "ACA-1.1",
    codigo: "1.1",
    slug: "academias-voz-cursos-247",
    nombre: "Atención de consultas de cursos 24/7 por voz",
    tagline: "Un sistema automatizado que atiende llamadas fuera de horario, cualifica al interesado y lo prepara para matriculación",
    one_liner: "Recibe llamadas de alumnos potenciales las 24 horas y cualifícalos automáticamente",
    descripcionDetallada: "Muchas academias pierden alumnos potenciales porque no pueden atender llamadas fuera del horario de secretaría. Un sistema de atención de voz automatizada recoge la consulta, detecta el interés (idiomas, oposiciones, formación profesional), cualifica al interesado y lo prepara para que el asesor lo contacte en horario de oficina con toda la información necesaria.",
    categoria: "B1",
    categoriaNombre: "Captación de alumnos",
    sectores: ["Academias / Formación"],
    recomendado: true,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B1",
    modulo_codigo: "1.1",
    dolores: [
      "Llamadas perdidas fuera del horario de secretaría",
      "Alumnos que llaman y no encuentran atención",
      "El equipo no puede atender consultas 24/7"
    ],
    pasos: [
      "El alumno potencial llama a la academia",
      "El sistema de voz recibe la llamada y recoge datos básicos",
      "Se cualifica el interés y modalidad del curso",
      "Se notifica al asesor con toda la información lista para el seguimiento"
    ],
    personalizacion: "Se adapta al catálogo de cursos y horarios de cada academia",
    summary: {
      tiempo_implementacion: "2-3 semanas",
      ahorro_horas_semana: 5,
      roi_estimado: "Alto",
      complejidad: "Media"
    },
    integration_domains: ["COMMS", "CRM"],
    related_processes: ["academias-captura-multicanal", "academias-cualificacion-alumno"]
  },
  {
    id: "ACA-1.2",
    codigo: "1.2",
    slug: "academias-captura-multicanal",
    nombre: "Captura y centralización de leads multicanal",
    tagline: "Unifica en una sola bandeja de entrada todos los canales de contacto: teléfono, WhatsApp, web e Instagram",
    one_liner: "Centraliza todos los canales de captación en un único flujo de matriculación",
    descripcionDetallada: "Un alumno potencial puede llegar por llamada, WhatsApp, formulario web, DM de Instagram o incluso TikTok. Sin un sistema unificado, estos leads se pierden en bandejas de entrada distintas. Este proceso centraliza todos los canales en un único CRM con calificación automática y asignación al asesor correcto.",
    categoria: "B1",
    categoriaNombre: "Captación de alumnos",
    sectores: ["Academias / Formación"],
    recomendado: true,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B1",
    modulo_codigo: "1.2",
    dolores: [
      "Leads que llegan por canales distintos y se pierden",
      "Sin visibilidad de qué canal genera más matriculaciones",
      "Mensajes de Instagram sin responder durante horas"
    ],
    pasos: [
      "El interesado contacta por cualquier canal disponible",
      "El sistema unifica la conversación en el CRM",
      "Se asigna automáticamente al asesor según disponibilidad",
      "El asesor ve el historial completo del lead en un solo lugar"
    ],
    personalizacion: "Integrable con los canales activos de cada academia",
    summary: {
      tiempo_implementacion: "2-4 semanas",
      ahorro_horas_semana: 6,
      roi_estimado: "Alto",
      complejidad: "Media"
    },
    integration_domains: ["COMMS", "CRM"],
    related_processes: ["academias-voz-cursos-247", "academias-chatbot-info"]
  },
  {
    id: "ACA-1.3",
    codigo: "1.3",
    slug: "academias-chatbot-info",
    nombre: "Chatbot informativo de cursos y horarios",
    tagline: "Responde automáticamente preguntas frecuentes sobre cursos, precios, horarios y modalidades en web y WhatsApp",
    one_liner: "Un chatbot que responde consultas de cursos y filtra interesados reales",
    descripcionDetallada: "El 80% de las consultas que recibe una academia son siempre las mismas: ¿qué cursos tenéis?, ¿cuánto cuesta?, ¿hay plazas?. Un chatbot bien configurado responde estas preguntas al instante, filtra a quienes tienen interés real y los prepara para hablar con un asesor.",
    categoria: "B1",
    categoriaNombre: "Captación de alumnos",
    sectores: ["Academias / Formación"],
    recomendado: true,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B1",
    modulo_codigo: "1.3",
    dolores: [
      "El equipo pierde tiempo respondiendo las mismas preguntas",
      "Interesados que no reciben respuesta y se van a otra academia",
      "Sin filtro previo, el asesor habla con personas sin interés real"
    ],
    pasos: [
      "El visitante entra a la web o escribe por WhatsApp",
      "El chatbot responde preguntas frecuentes al instante",
      "Si hay interés real, recoge datos de contacto",
      "Deriva al asesor solo los leads cualificados"
    ],
    personalizacion: "Adaptado al catálogo de cursos y FAQs de cada academia",
    summary: {
      tiempo_implementacion: "1-2 semanas",
      ahorro_horas_semana: 4,
      roi_estimado: "Alto",
      complejidad: "Baja"
    },
    integration_domains: ["COMMS", "CRM"],
    related_processes: ["academias-captura-multicanal", "academias-cualificacion-alumno"]
  },
  {
    id: "ACA-1.4",
    codigo: "1.4",
    slug: "academias-cualificacion-alumno",
    nombre: "Cualificación automática de alumnos potenciales",
    tagline: "Filtra y puntúa automáticamente a los interesados según objetivo, nivel y modalidad antes de que lleguen al asesor",
    one_liner: "Prioriza los leads con más probabilidad de matricularse",
    descripcionDetallada: "No todos los interesados tienen el mismo potencial de conversión. Este proceso asigna una puntuación automática a cada lead según los datos recogidos (objetivo, nivel previo, modalidad preferida, urgencia) para que el asesor priorice su tiempo en los más propensos a matricularse.",
    categoria: "B1",
    categoriaNombre: "Captación de alumnos",
    sectores: ["Academias / Formación"],
    recomendado: false,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B1",
    modulo_codigo: "1.4",
    dolores: [
      "Asesores que invierten tiempo igual en todos los leads",
      "Sin criterio claro para priorizar a quién llamar primero",
      "Tasa de conversión baja por falta de filtro previo"
    ],
    pasos: [
      "El lead llega por cualquier canal",
      "El sistema recoge datos clave mediante preguntas automatizadas",
      "Se asigna una puntuación de cualificación",
      "Los leads de mayor puntuación se priorizan para el asesor"
    ],
    personalizacion: "Los criterios de puntuación se adaptan al tipo de academia y curso",
    summary: {
      tiempo_implementacion: "2-3 semanas",
      ahorro_horas_semana: 3,
      roi_estimado: "Medio",
      complejidad: "Media"
    },
    integration_domains: ["CRM", "OTHER"],
    related_processes: ["academias-captura-multicanal", "academias-matricula-digital"]
  },
  {
    id: "ACA-2.1",
    codigo: "2.1",
    slug: "academias-matricula-digital",
    nombre: "Matriculación 100% digital",
    tagline: "El alumno firma el contrato, sube documentación y completa la matrícula sin visitar la academia ni imprimir nada",
    one_liner: "Matricula a nuevos alumnos sin papeleo ni visita presencial",
    descripcionDetallada: "La matriculación manual implica citas presenciales, impresión de contratos, recogida de documentos y entrada manual de datos. Todo este proceso se puede digitalizar: el alumno recibe un enlace, firma digitalmente, sube los documentos requeridos y queda matriculado en minutos, sin que el equipo tenga que intervenir.",
    categoria: "B2",
    categoriaNombre: "Matriculación y onboarding del alumno",
    sectores: ["Academias / Formación"],
    recomendado: true,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B2",
    modulo_codigo: "2.1",
    dolores: [
      "Proceso de matriculación lento que depende de visita presencial",
      "Contratos en papel que se pierden o deterioran",
      "El equipo pierde horas gestionando papeleo administrativo"
    ],
    pasos: [
      "El alumno recibe un enlace de matriculación personalizado",
      "Firma digitalmente el contrato y acepta condiciones",
      "Sube la documentación requerida (DNI, foto, etc.)",
      "Queda matriculado automáticamente en el sistema"
    ],
    personalizacion: "Se adapta a los requisitos de documentación de cada academia",
    summary: {
      tiempo_implementacion: "2-3 semanas",
      ahorro_horas_semana: 6,
      roi_estimado: "Alto",
      complejidad: "Media"
    },
    integration_domains: ["ADMIN", "CRM"],
    related_processes: ["academias-welcome-pack", "academias-pago-fraccionado"]
  },
  {
    id: "ACA-2.2",
    codigo: "2.2",
    slug: "academias-welcome-pack",
    nombre: "Welcome pack automático al nuevo alumno",
    tagline: "El alumno recibe al instante acceso a plataforma, materiales de bienvenida y toda la información que necesita para empezar",
    one_liner: "Onboarding digital completo para que el alumno empiece sin fricción",
    descripcionDetallada: "Cuando un alumno se matricula, espera recibir la información de acceso, los materiales del curso y las instrucciones de funcionamiento de inmediato. Sin automatización, esto depende de que alguien del equipo lo gestione manualmente. Con este proceso, el welcome pack se envía automáticamente en el momento en que se confirma la matrícula.",
    categoria: "B2",
    categoriaNombre: "Matriculación y onboarding del alumno",
    sectores: ["Academias / Formación"],
    recomendado: true,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B2",
    modulo_codigo: "2.2",
    dolores: [
      "Alumnos que no saben cómo empezar tras matricularse",
      "El equipo envía manualmente la bienvenida a cada nuevo alumno",
      "Primeras impresiones negativas por falta de comunicación"
    ],
    pasos: [
      "Se confirma la matriculación del alumno",
      "El sistema genera automáticamente el welcome pack personalizado",
      "El alumno recibe acceso a plataforma, materiales y calendario",
      "Se registra la entrega y se marca como onboarding completado"
    ],
    personalizacion: "Contenido personalizado según el curso y modalidad",
    summary: {
      tiempo_implementacion: "1-2 semanas",
      ahorro_horas_semana: 3,
      roi_estimado: "Alto",
      complejidad: "Baja"
    },
    integration_domains: ["COMMS", "ADMIN"],
    related_processes: ["academias-matricula-digital", "academias-pago-fraccionado"]
  },
  {
    id: "ACA-2.3",
    codigo: "2.3",
    slug: "academias-pago-fraccionado",
    nombre: "Control de cuotas y pagos fraccionados",
    tagline: "Gestión automática de mensualidades, recordatorios de pago y seguimiento de impagos sin intervención manual",
    one_liner: "Automatiza el cobro de cuotas y elimina la persecución manual de pagos",
    descripcionDetallada: "Las academias que ofrecen pago fraccionado dedican horas a recordar mensualidades, perseguir impagos y actualizar hojas de cálculo. Este proceso automatiza el ciclo completo: recordatorio previo al vencimiento, notificación el día del cobro y escalonado de alertas para impagos, con registro automático en el sistema.",
    categoria: "B2",
    categoriaNombre: "Matriculación y onboarding del alumno",
    sectores: ["Academias / Formación"],
    recomendado: false,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B2",
    modulo_codigo: "2.3",
    dolores: [
      "Horas semanales persiguiendo impagos manualmente",
      "Sin registro claro de qué alumnos han pagado",
      "Relación incómoda con alumnos cuando hay que reclamar pagos"
    ],
    pasos: [
      "El sistema identifica las cuotas próximas a vencer",
      "Se envía recordatorio automático 3 días antes",
      "En caso de impago, se activa una secuencia de recordatorios escalonados",
      "El estado de pago se actualiza automáticamente en el CRM"
    ],
    personalizacion: "Configurable según política de pagos y tolerancia de cada academia",
    summary: {
      tiempo_implementacion: "2-3 semanas",
      ahorro_horas_semana: 4,
      roi_estimado: "Alto",
      complejidad: "Media"
    },
    integration_domains: ["FINANCE", "COMMS"],
    related_processes: ["academias-recordatorio-mensualidad", "academias-matricula-digital"]
  },
  {
    id: "ACA-3.1",
    codigo: "3.1",
    slug: "academias-avisos-faltas",
    nombre: "Avisos automáticos de faltas a padres",
    tagline: "Notifica automáticamente a los padres cuando su hijo no asiste a clase, sin que el equipo tenga que hacerlo manualmente",
    one_liner: "Mantén informados a los padres de asistencia sin llamadas manuales",
    descripcionDetallada: "En academias con alumnos menores, los padres quieren saber si su hijo ha asistido. Hacer esto de forma manual consume tiempo del equipo y genera errores. Este proceso envia avisos automáticos de falta por WhatsApp o email tan pronto como se registra la ausencia en el sistema.",
    categoria: "B3",
    categoriaNombre: "Comunicación con padres y alumnos",
    sectores: ["Academias / Formación"],
    recomendado: true,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B3",
    modulo_codigo: "3.1",
    dolores: [
      "Padres que llaman para preguntar si su hijo ha ido a clase",
      "El equipo pierde tiempo en llamadas de seguimiento de asistencia",
      "Faltas no comunicadas que generan conflictos"
    ],
    pasos: [
      "El profesor registra la falta en el sistema",
      "El sistema detecta la ausencia en tiempo real",
      "Se envía aviso automático al padre/tutor por WhatsApp o email",
      "El aviso queda registrado en el historial del alumno"
    ],
    personalizacion: "Canal de aviso configurable según preferencia de cada familia",
    summary: {
      tiempo_implementacion: "1-2 semanas",
      ahorro_horas_semana: 3,
      roi_estimado: "Medio",
      complejidad: "Baja"
    },
    integration_domains: ["COMMS", "OTHER"],
    related_processes: ["academias-comunicacion-calendario", "academias-mensajes-fechas-clave"]
  },
  {
    id: "ACA-3.2",
    codigo: "3.2",
    slug: "academias-comunicacion-calendario",
    nombre: "Comunicación de calendario y exámenes",
    tagline: "Envía recordatorios de exámenes, cambios de horario y fechas clave con la antelación suficiente para que alumnos y padres no se pillen por sorpresa",
    one_liner: "Que nadie llegue a un examen sin saberlo con tiempo suficiente",
    descripcionDetallada: "Las academias cambian horarios, programan exámenes y modifican el calendario con frecuencia. Sin comunicación proactiva, estas novedades llegan tarde o no llegan. Este proceso envía automáticamente avisos con la antelación configurada para cada tipo de evento.",
    categoria: "B3",
    categoriaNombre: "Comunicación con padres y alumnos",
    sectores: ["Academias / Formación"],
    recomendado: false,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B3",
    modulo_codigo: "3.2",
    dolores: [
      "Alumnos que llegan sin saber que había examen",
      "Padres que no se enteran de los cambios de horario",
      "El equipo envía mensajes de recordatorio de forma manual"
    ],
    pasos: [
      "Se registra el evento en el calendario de la academia",
      "El sistema calcula el momento de envío del aviso",
      "Se envía el recordatorio al grupo correspondiente",
      "Se confirma la recepción y se registra el envío"
    ],
    personalizacion: "Antelación del aviso configurable por tipo de evento",
    summary: {
      tiempo_implementacion: "1-2 semanas",
      ahorro_horas_semana: 2,
      roi_estimado: "Medio",
      complejidad: "Baja"
    },
    integration_domains: ["COMMS", "OTHER"],
    related_processes: ["academias-avisos-faltas", "academias-mensajes-fechas-clave"]
  },
  {
    id: "ACA-3.3",
    codigo: "3.3",
    slug: "academias-encuesta-post-clase",
    nombre: "Encuesta de satisfacción post-clase",
    tagline: "Recoge feedback de alumnos y padres de forma automática tras cada clase para detectar problemas antes de que escalen",
    one_liner: "Detecta problemas de calidad en tiempo real antes de que el alumno se vaya",
    descripcionDetallada: "Sin un sistema de feedback regular, los problemas de calidad solo se detectan cuando el alumno ya se ha dado de baja. Una encuesta breve enviada de forma automática tras cada sesión permite identificar tendencias, actuar sobre profesores con valoraciones bajas y retener alumnos insatisfechos a tiempo.",
    categoria: "B3",
    categoriaNombre: "Comunicación con padres y alumnos",
    sectores: ["Academias / Formación"],
    recomendado: false,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B3",
    modulo_codigo: "3.3",
    dolores: [
      "No hay visibilidad sobre la satisfacción de los alumnos",
      "Los problemas de calidad se detectan demasiado tarde",
      "Bajas sin aviso previo que podrían haberse evitado"
    ],
    pasos: [
      "Finaliza la clase y se registra en el sistema",
      "Se envía automáticamente una encuesta breve al alumno/padre",
      "Las respuestas se agregan en un dashboard de calidad",
      "Las valoraciones bajas generan alerta automática al coordinador"
    ],
    personalizacion: "Frecuencia y canal de encuesta configurables por academia",
    summary: {
      tiempo_implementacion: "1-2 semanas",
      ahorro_horas_semana: 2,
      roi_estimado: "Medio",
      complejidad: "Baja"
    },
    integration_domains: ["COMMS", "OTHER"],
    related_processes: ["academias-deteccion-riesgo-baja", "academias-avisos-faltas"]
  },
  {
    id: "ACA-3.4",
    codigo: "3.4",
    slug: "academias-mensajes-fechas-clave",
    nombre: "Mensajes automáticos en fechas clave",
    tagline: "Felicitaciones de cumpleaños, inicio de curso, fin de trimestre y otras fechas importantes enviadas automáticamente para mantener el vínculo con el alumno",
    one_liner: "Mantén el vínculo emocional con alumnos y familias sin trabajo manual",
    descripcionDetallada: "Las pequeñas atenciones — un mensaje de cumpleaños, una felicitación al terminar el trimestre, un recordatorio del inicio de curso — generan vínculos que fidelizan. Este proceso los gestiona automáticamente para que ninguna fecha importante pase sin un mensaje personalizado.",
    categoria: "B3",
    categoriaNombre: "Comunicación con padres y alumnos",
    sectores: ["Academias / Formación"],
    recomendado: false,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B3",
    modulo_codigo: "3.4",
    dolores: [
      "Fechas importantes pasan sin ninguna comunicación",
      "Los alumnos no sienten que la academia se preocupa por ellos",
      "Sin fidelización, la renovación depende solo del precio"
    ],
    pasos: [
      "El sistema sincroniza las fechas clave de cada alumno",
      "Se programan los mensajes con antelación configurable",
      "Los mensajes se envían automáticamente en la fecha correcta",
      "Se registra el envío para seguimiento de engagement"
    ],
    personalizacion: "Calendario de fechas clave y tono de mensaje configurables",
    summary: {
      tiempo_implementacion: "1 semana",
      ahorro_horas_semana: 1,
      roi_estimado: "Medio",
      complejidad: "Baja"
    },
    integration_domains: ["COMMS", "CRM"],
    related_processes: ["academias-comunicacion-calendario", "academias-encuesta-post-clase"]
  },
  {
    id: "ACA-4.1",
    codigo: "4.1",
    slug: "academias-deteccion-riesgo-baja",
    nombre: "Detección automática de alumnos en riesgo de baja",
    tagline: "Identifica patrones de abandono antes de que el alumno pida la baja y activa una intervención personalizada",
    one_liner: "Actúa antes de que el alumno decida irse",
    descripcionDetallada: "Un alumno que empieza a faltar más, no abre los mensajes o lleva semanas sin conectarse a la plataforma está enviando señales de abandono. Este sistema detecta esas señales de forma automática y activa una respuesta personalizada — una llamada del coordinador, un descuento de renovación o una sesión de tutoría — antes de que el alumno tome la decisión de irse.",
    categoria: "B4",
    categoriaNombre: "Retención y reactivación",
    sectores: ["Academias / Formación"],
    recomendado: true,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B4",
    modulo_codigo: "4.1",
    dolores: [
      "Bajas que llegan de sorpresa sin señales previas visibles",
      "Sin sistema para detectar alumnos desmotivados a tiempo",
      "Captación que cuesta más que lo que cuesta retener"
    ],
    pasos: [
      "El sistema monitoriza señales de riesgo: faltas, engagement, pagos",
      "Al superar el umbral configurado, se activa una alerta",
      "Se lanza automáticamente una acción de retención personalizada",
      "El coordinador recibe un aviso para seguimiento humano si es necesario"
    ],
    personalizacion: "Umbrales de riesgo y acciones de retención configurables",
    summary: {
      tiempo_implementacion: "3-4 semanas",
      ahorro_horas_semana: 4,
      roi_estimado: "Muy alto",
      complejidad: "Alta"
    },
    integration_domains: ["CRM", "COMMS"],
    related_processes: ["academias-reactivacion-exalumnos", "academias-encuesta-post-clase"]
  },
  {
    id: "ACA-4.2",
    codigo: "4.2",
    slug: "academias-reactivacion-exalumnos",
    nombre: "Reactivación de exalumnos",
    tagline: "Recupera alumnos que dejaron el curso con una secuencia de mensajes personalizados en el momento adecuado",
    one_liner: "Recupera alumnos que se fueron antes de que la competencia los capture definitivamente",
    descripcionDetallada: "Un exalumno que dejó el curso hace 3 o 6 meses es mucho más fácil de recuperar que captar uno nuevo. Este proceso identifica exalumnos según el tiempo transcurrido desde la baja y lanza una secuencia de reactivación con un motivo personalizado y concreto para volver.",
    categoria: "B4",
    categoriaNombre: "Retención y reactivación",
    sectores: ["Academias / Formación"],
    recomendado: false,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B4",
    modulo_codigo: "4.2",
    dolores: [
      "Exalumnos que se fueron y no han recibido ningún contacto desde entonces",
      "Base de datos de bajas que no se aprovecha",
      "Coste de captación alto cuando hay potencial de reactivación sin explotar"
    ],
    pasos: [
      "El sistema identifica exalumnos según criterios de tiempo y motivo de baja",
      "Se selecciona el mensaje de reactivación más adecuado",
      "Se lanza la secuencia personalizada por WhatsApp o email",
      "Los interesados en volver entran directamente al flujo de matriculación"
    ],
    personalizacion: "Criterios de segmentación y mensajes configurables por academia",
    summary: {
      tiempo_implementacion: "2-3 semanas",
      ahorro_horas_semana: 2,
      roi_estimado: "Alto",
      complejidad: "Media"
    },
    integration_domains: ["CRM", "COMMS"],
    related_processes: ["academias-deteccion-riesgo-baja", "academias-programa-referidos"]
  },
  {
    id: "ACA-4.3",
    codigo: "4.3",
    slug: "academias-programa-referidos",
    nombre: "Programa de referidos para alumnos satisfechos",
    tagline: "Convierte a los alumnos más satisfechos en embajadores que traen nuevos alumnos a cambio de incentivos automáticos",
    one_liner: "Genera nuevas matriculaciones sin publicidad pagada a través de tus propios alumnos",
    descripcionDetallada: "Un alumno satisfecho es la mejor publicidad que tiene una academia. Un programa de referidos bien estructurado — con incentivos claros, seguimiento automático y comunicación proactiva — puede generar entre el 15 y el 25% de nuevas matriculaciones sin coste de adquisición.",
    categoria: "B4",
    categoriaNombre: "Retención y reactivación",
    sectores: ["Academias / Formación"],
    recomendado: false,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B4",
    modulo_codigo: "4.3",
    dolores: [
      "Alto coste de captación por dependencia de publicidad pagada",
      "Alumnos satisfechos que no recomiendan porque no se les pide",
      "Sin sistema para rastrear de dónde vienen las recomendaciones"
    ],
    pasos: [
      "El sistema identifica alumnos con alta satisfacción",
      "Se les invita automáticamente al programa de referidos",
      "Se genera un código o enlace de referido personalizado",
      "El incentivo se aplica automáticamente cuando el referido se matricula"
    ],
    personalizacion: "Incentivos y criterios de elegibilidad configurables",
    summary: {
      tiempo_implementacion: "2-3 semanas",
      ahorro_horas_semana: 2,
      roi_estimado: "Alto",
      complejidad: "Media"
    },
    integration_domains: ["CRM", "COMMS"],
    related_processes: ["academias-deteccion-riesgo-baja", "academias-reactivacion-exalumnos"]
  },
  {
    id: "ACA-5.1",
    codigo: "5.1",
    slug: "academias-recordatorio-mensualidad",
    nombre: "Recordatorios escalonados de mensualidad",
    tagline: "Gestión automática del ciclo de cobro: aviso previo, confirmación de pago y escalado de impagos sin intervención del equipo",
    one_liner: "Elimina la persecución manual de pagos y reduce la tasa de impago",
    descripcionDetallada: "El seguimiento manual de mensualidades en academias con decenas o cientos de alumnos es ineficiente y fuente de tensiones. Este proceso automatiza el ciclo completo: aviso 3 días antes del vencimiento, confirmación el día del cobro y secuencia escalonada de recordatorios para impagos, con escalado a gestión humana si no se resuelve.",
    categoria: "B5",
    categoriaNombre: "Administración y finanzas",
    sectores: ["Academias / Formación"],
    recomendado: true,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B5",
    modulo_codigo: "5.1",
    dolores: [
      "Horas semanales persiguiendo impagos por teléfono",
      "Sin registro centralizado del estado de pagos",
      "Relación tensa con alumnos cuando hay reclamaciones de pago"
    ],
    pasos: [
      "El sistema identifica cuotas próximas a vencer",
      "Se envía aviso previo automático 3 días antes",
      "En caso de impago, se activa secuencia escalonada de recordatorios",
      "Si persiste, se escala a gestión humana con historial completo"
    ],
    personalizacion: "Plazos y canales de recordatorio configurables por academia",
    summary: {
      tiempo_implementacion: "2-3 semanas",
      ahorro_horas_semana: 5,
      roi_estimado: "Alto",
      complejidad: "Media"
    },
    integration_domains: ["FINANCE", "COMMS"],
    related_processes: ["academias-pago-fraccionado", "academias-reporte-diario"]
  },
  {
    id: "ACA-5.2",
    codigo: "5.2",
    slug: "academias-registro-gastos",
    nombre: "Captura de gastos con foto sin tecleo manual",
    tagline: "El equipo fotografía cualquier ticket o factura y el gasto queda registrado automáticamente en la categoría correcta",
    one_liner: "Registra gastos de material y operativos con una foto, sin formularios",
    descripcionDetallada: "Las academias tienen gastos continuos de material didáctico, mantenimiento e imprevistos. Registrarlos manualmente — con formularios, Excel o notas de papel — genera retrasos y errores. Con este proceso, cualquier miembro del equipo fotografía el ticket y el sistema extrae los datos, categoriza el gasto y lo registra automáticamente.",
    categoria: "B5",
    categoriaNombre: "Administración y finanzas",
    sectores: ["Academias / Formación"],
    recomendado: false,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B5",
    modulo_codigo: "5.2",
    dolores: [
      "Gastos que no se registran hasta fin de mes",
      "Tickets perdidos que no entran en la contabilidad",
      "El equipo dedica tiempo a formularios de gastos"
    ],
    pasos: [
      "El empleado fotografía el ticket desde el móvil",
      "El sistema extrae los datos con OCR automático",
      "El gasto se categoriza y registra automáticamente",
      "Queda disponible para el reporte financiero del mes"
    ],
    personalizacion: "Categorías de gasto adaptadas a la estructura de cada academia",
    summary: {
      tiempo_implementacion: "1-2 semanas",
      ahorro_horas_semana: 2,
      roi_estimado: "Medio",
      complejidad: "Baja"
    },
    integration_domains: ["FINANCE", "ADMIN"],
    related_processes: ["academias-reporte-diario", "academias-recordatorio-mensualidad"]
  },
  {
    id: "ACA-5.3",
    codigo: "5.3",
    slug: "academias-reporte-diario",
    nombre: "Reporte diario con cifras clave de la academia",
    tagline: "Recibe cada mañana un resumen automático con alumnos activos, cobros del día, faltas y alertas relevantes sin necesidad de abrir ningún sistema",
    one_liner: "Toma decisiones con datos frescos sin tener que extraerlos manualmente",
    descripcionDetallada: "La dirección de una academia necesita visibilidad diaria sin tener que acceder a múltiples sistemas. Este proceso genera automáticamente un reporte matutino con los indicadores más relevantes: alumnos activos, cobros esperados del día, faltas registradas, alertas de impago y cualquier dato configurado como prioritario.",
    categoria: "B5",
    categoriaNombre: "Administración y finanzas",
    sectores: ["Academias / Formación"],
    recomendado: false,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B5",
    modulo_codigo: "5.3",
    dolores: [
      "Sin visibilidad diaria del estado real de la academia",
      "Los reportes se generan manualmente con retraso",
      "Decisiones tomadas sin datos actualizados"
    ],
    pasos: [
      "El sistema recoge datos de todos los módulos activos",
      "Se genera el reporte automáticamente a la hora configurada",
      "Se envía por WhatsApp o email al director/coordinador",
      "Incluye alertas destacadas que requieren atención inmediata"
    ],
    personalizacion: "KPIs y hora de envío configurables por academia o sede",
    summary: {
      tiempo_implementacion: "1-2 semanas",
      ahorro_horas_semana: 2,
      roi_estimado: "Medio",
      complejidad: "Baja"
    },
    integration_domains: ["ADMIN", "COMMS"],
    related_processes: ["academias-registro-gastos", "academias-recordatorio-mensualidad"]
  },
  {
    id: "ACA-6.1",
    codigo: "6.1",
    slug: "academias-comunicacion-turnos",
    nombre: "Comunicación individual de horarios con confirmación",
    tagline: "Cada profesor recibe su horario semanal por WhatsApp con confirmación de lectura, eliminando los grupos caóticos de equipo",
    one_liner: "Elimina los grupos de WhatsApp del equipo docente y envía horarios de forma ordenada",
    descripcionDetallada: "Los grupos de WhatsApp de profesores son un caos: mensajes importantes enterrados bajo conversaciones irrelevantes, confirmaciones de lectura imposibles de rastrear. Este proceso envía el horario semanal de forma individual a cada profesor con confirmación y alerta automática al coordinador si no hay respuesta.",
    categoria: "B6",
    categoriaNombre: "Gestión del profesorado",
    sectores: ["Academias / Formación"],
    recomendado: false,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B6",
    modulo_codigo: "6.1",
    dolores: [
      "Grupos de WhatsApp de profesores ingobernables",
      "Sin confirmación de que el profesor ha visto su horario",
      "Confusión de turnos por mensajes malinterpretados en grupos"
    ],
    pasos: [
      "El coordinador publica el horario en el sistema",
      "El sistema envía el horario individual a cada profesor",
      "El profesor confirma con un botón de respuesta",
      "Las no-respuestas generan alerta automática al coordinador"
    ],
    personalizacion: "Formato de horario y canal de envío configurables",
    summary: {
      tiempo_implementacion: "1-2 semanas",
      ahorro_horas_semana: 2,
      roi_estimado: "Medio",
      complejidad: "Baja"
    },
    integration_domains: ["COMMS", "ADMIN"],
    related_processes: ["academias-sustituciones-inteligentes", "academias-onboarding-profesor"]
  },
  {
    id: "ACA-6.2",
    codigo: "6.2",
    slug: "academias-onboarding-profesor",
    nombre: "Onboarding automático de nuevo profesor",
    tagline: "El profesor nuevo recibe automáticamente toda la documentación, protocolos y asignaciones del primer día sin que el coordinador tenga que enviarlo manualmente",
    one_liner: "Incorpora a un nuevo profesor en un día sin trabajo manual del coordinador",
    descripcionDetallada: "Cada vez que se incorpora un nuevo profesor, el coordinador dedica horas a explicar protocolos, enviar documentación y asignar las primeras clases. Este proceso lo automatiza: en cuanto se da de alta al profesor en el sistema, se lanza una secuencia de onboarding con todo lo que necesita para arrancar operativo.",
    categoria: "B6",
    categoriaNombre: "Gestión del profesorado",
    sectores: ["Academias / Formación"],
    recomendado: false,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B6",
    modulo_codigo: "6.2",
    dolores: [
      "Incorporación de nuevos profesores que depende de tiempo del coordinador",
      "Profesores que arrancan sin tener toda la información necesaria",
      "Documentación de protocolos dispersa y difícil de encontrar"
    ],
    pasos: [
      "Se da de alta al nuevo profesor en el sistema",
      "Se lanza automáticamente la secuencia de onboarding",
      "El profesor recibe documentación, protocolos y accesos",
      "Las primeras clases se asignan automáticamente según disponibilidad"
    ],
    personalizacion: "Contenido de onboarding adaptado al tipo de academia y área de enseñanza",
    summary: {
      tiempo_implementacion: "1-2 semanas",
      ahorro_horas_semana: 3,
      roi_estimado: "Medio",
      complejidad: "Baja"
    },
    integration_domains: ["ADMIN", "COMMS"],
    related_processes: ["academias-comunicacion-turnos", "academias-sustituciones-inteligentes"]
  },
  {
    id: "ACA-6.3",
    codigo: "6.3",
    slug: "academias-sustituciones-inteligentes",
    nombre: "Gestión inteligente de sustituciones",
    tagline: "Cuando un profesor no puede dar clase, el sistema identifica automáticamente el sustituto más adecuado según disponibilidad y nivel, sin llamadas urgentes del coordinador",
    one_liner: "Resuelve ausencias de profesores sin el caos habitual de llamadas y grupos",
    descripcionDetallada: "Una baja de última hora de un profesor puede arruinar el día del coordinador: llamadas urgentes, grupos de WhatsApp, negociaciones de disponibilidad. Este sistema gestiona las sustituciones de forma automática: detecta la ausencia, identifica al sustituto óptimo según disponibilidad y competencia, lo notifica y confirma la sustitución.",
    categoria: "B6",
    categoriaNombre: "Gestión del profesorado",
    sectores: ["Academias / Formación"],
    recomendado: false,
    hidden: false,
    landing_slug: "academias",
    bloque_negocio: "B6",
    modulo_codigo: "6.3",
    dolores: [
      "Horas del coordinador gestionando sustituciones de última hora",
      "Sin criterio claro para elegir el sustituto más adecuado",
      "Los alumnos se enteran tarde de los cambios de profesor"
    ],
    pasos: [
      "Se registra la ausencia del profesor (manual o automática)",
      "El sistema identifica el sustituto óptimo disponible",
      "Se notifica al sustituto y se solicita confirmación",
      "Se avisa automáticamente a los alumnos del cambio"
    ],
    personalizacion: "Criterios de selección de sustituto configurables por academia",
    summary: {
      tiempo_implementacion: "2-3 semanas",
      ahorro_horas_semana: 3,
      roi_estimado: "Medio",
      complejidad: "Media"
    },
    integration_domains: ["ADMIN", "COMMS"],
    related_processes: ["academias-comunicacion-turnos", "academias-onboarding-profesor"]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SECTOR INDUSTRIAL / PRODUCCIÓN — 24 procesos · 6 bloques
  // Exclusivos de este sector. landing_slug: "industrial"
  // ══════════════════════════════════════════════════════════════════════════

  // ── BLOQUE B1 · Clientes y presupuestos ─────────────────────────────────
  {
    id: "IND-1.1",
    codigo: "1.1",
    slug: "industrial-captacion-peticiones-oferta",
    categoria: "B1",
    categoriaNombre: "Clientes y presupuestos",
    nombre: "Captación de peticiones de oferta",
    tagline: "Cada petición de presupuesto que llega por email, web o WhatsApp queda registrada automáticamente como oportunidad con los datos ya extraídos.",
    recomendado: true,
    descripcionDetallada: "El comercial de una industrial pierde tiempo buscando los datos de cada petición que llega dispersa entre bandejas de email, mensajes de WhatsApp y formularios web. Este proceso centraliza todas las entradas, extrae automáticamente producto, cantidad, plazo y datos del cliente, y crea una ficha de oportunidad asignada al responsable correcto. Ninguna petición se pierde y el comercial solo tiene que revisar, no construir desde cero.",
    summary: {
      what_it_is: "Sistema de captura y cualificación automática de peticiones de oferta desde cualquier canal.",
      for_who: ["Industriales con comercial propio", "Empresas que reciben peticiones por múltiples canales", "Equipos donde las peticiones se pierden o llegan tarde"],
      requirements: ["Email corporativo", "WhatsApp Business (opcional)", "Formulario web o canal habitual de entrada"],
      output: "Ficha de oportunidad creada y asignada al responsable en menos de 5 minutos desde la recepción."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja",
      integrations: ["Email", "WhatsApp Business", "CRM / ERP"]
    },
    how_it_works_steps: [
      { title: "Recoge la petición", short: "Desde cualquier canal.", detail: "Email, WhatsApp, formulario web — todas las entradas llegan a un único punto de procesamiento." },
      { title: "Extrae los datos", short: "Producto, cantidad, plazo.", detail: "IA extrae automáticamente los campos clave de la petición y los estructura en la ficha." },
      { title: "Asigna y notifica", short: "Al comercial correcto.", detail: "La ficha creada se asigna al responsable y este recibe una notificación con todo listo para responder." }
    ],
    benefits: [
      "Cero peticiones perdidas entre bandejas y canales",
      "Datos extraídos automáticamente, sin teclear a mano",
      "El comercial actúa más rápido con la información estructurada"
    ],
    pasos: [
      "Se detecta la entrada de una petición de oferta por cualquier canal",
      "La IA extrae producto, cantidad, plazo y datos de contacto",
      "Se crea la ficha de oportunidad en el CRM o ERP",
      "Se asigna al comercial responsable y se le notifica",
      "El comercial recibe la ficha lista para empezar a trabajar"
    ],
    personalizacion: "Define qué campos extraer, cómo asignar por producto o zona, el canal de notificación al comercial y si requiere validación antes de crear la ficha.",
    sectores: ["Industrial"],
    herramientas: ["Email", "WhatsApp Business API", "CRM / ERP", "IA"],
    canales: ["Email", "WhatsApp"],
    dolores: [
      "Las peticiones llegan por tres sitios y alguna siempre se nos escapa",
      "El comercial pierde tiempo buscando datos antes de poder responder"
    ],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "industrial",
    bloque_negocio: "B1",
    modulo_codigo: "1.1"
  },
  {
    id: "IND-1.2",
    codigo: "1.2",
    slug: "industrial-presupuestos-automaticos",
    categoria: "B1",
    categoriaNombre: "Clientes y presupuestos",
    nombre: "Generación de presupuestos automáticos",
    tagline: "El sistema prepara el presupuesto con precios actualizados, especificaciones y plazos sin que el comercial tenga que buscar cada dato a mano.",
    recomendado: true,
    descripcionDetallada: "Preparar un presupuesto en una industrial implica consultar la tarifa de precios, calcular el tiempo de producción, revisar el stock de materia prima y maquetar el documento en el formato correcto. Este proceso automatiza toda esa cadena: extrae los datos de la petición cualificada, los cruza con las tarifas vigentes y los plazos de producción, y genera el documento listo para revisar y aprobar. El comercial solo necesita unos minutos para personalizar y enviar.",
    summary: {
      what_it_is: "Generador automático de presupuestos con datos actualizados de precio, plazo y especificaciones.",
      for_who: ["Industriales con catálogo de productos o procesos parametrizables", "Comerciales que invierten horas en preparar cada presupuesto", "Empresas con tarifas frecuentemente actualizadas"],
      requirements: ["Tarifa de precios actualizada", "Datos de plazos de producción por producto", "Plantilla de presupuesto en formato de la empresa"],
      output: "Presupuesto en formato PDF o Word listo para revisar y enviar al cliente."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["ERP / CRM", "Tarifas de precio", "Generador de documentos"]
    },
    how_it_works_steps: [
      { title: "Toma los datos de la petición", short: "Producto, cantidad, condiciones.", detail: "Recoge la ficha de oportunidad creada en el paso anterior con todos los campos estructurados." },
      { title: "Calcula precio y plazo", short: "Con datos siempre actualizados.", detail: "Cruza con la tarifa vigente, calcula el tiempo de producción y comprueba disponibilidad de materiales." },
      { title: "Genera el documento", short: "En el formato de la empresa.", detail: "Produce el presupuesto en PDF o Word con el diseño corporativo, listo para que el comercial revise y apruebe." }
    ],
    benefits: [
      "Presupuesto listo en minutos, no en horas",
      "Precios siempre actualizados desde la tarifa vigente",
      "El comercial invierte su tiempo en vender, no en formatear documentos"
    ],
    pasos: [
      "Se recoge la ficha de oportunidad con los datos de la petición",
      "El sistema cruza con la tarifa de precios actualizada",
      "Calcula plazos de producción y disponibilidad de materiales",
      "Genera el documento de presupuesto en formato corporativo",
      "El comercial revisa, personaliza si necesita y envía"
    ],
    personalizacion: "Define las variables de precio (volumen, descuentos, condiciones de pago), el formato del documento y si quiere aprobación de un segundo nivel antes del envío.",
    sectores: ["Industrial"],
    herramientas: ["ERP / CRM", "Generador de documentos", "IA"],
    dolores: [
      "Preparar un presupuesto nos lleva entre 2 y 4 horas",
      "A veces enviamos presupuestos con precios desfasados",
      "El comercial pierde más tiempo en el documento que con el cliente"
    ],
    integration_domains: ["CRM", "DOCS"],
    landing_slug: "industrial",
    bloque_negocio: "B1",
    modulo_codigo: "1.2"
  },
  {
    id: "IND-1.3",
    codigo: "1.3",
    slug: "industrial-seguimiento-ofertas",
    categoria: "B1",
    categoriaNombre: "Clientes y presupuestos",
    nombre: "Seguimiento de ofertas abiertas",
    tagline: "Alerta cuando una oferta lleva demasiado tiempo sin respuesta del cliente y registra el resultado automáticamente al cierre.",
    recomendado: false,
    descripcionDetallada: "Una oferta enviada que no tiene seguimiento es una oferta que se pierde al silencio. Este proceso monitoriza cada presupuesto enviado, detecta cuando supera el tiempo de respuesta habitual y lanza un recordatorio al comercial con el contexto completo para que pueda hacer un seguimiento efectivo. Al cierre — ganada, perdida o pausada — registra el resultado automáticamente para construir el histórico de conversión.",
    summary: {
      what_it_is: "Sistema de seguimiento automático de ofertas pendientes con alertas y registro de resultado al cierre.",
      for_who: ["Comerciales con múltiples ofertas abiertas a la vez", "Empresas que pierden ofertas por falta de seguimiento", "Industrias con ciclo de venta largo"],
      requirements: ["CRM o ERP donde se registran los presupuestos", "Canal de notificación al comercial"],
      output: "Tasa de seguimiento del 100% de ofertas abiertas y histórico de conversión por producto y cliente."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja",
      integrations: ["CRM / ERP", "Email", "WhatsApp"]
    },
    how_it_works_steps: [
      { title: "Monitoriza cada oferta", short: "Desde el envío hasta el cierre.", detail: "Sigue el estado de cada presupuesto enviado y cuenta los días transcurridos desde el envío." },
      { title: "Alerta al comercial", short: "Cuando lleva demasiado sin respuesta.", detail: "En función del tipo de cliente y producto, lanza un recordatorio al comercial con el contexto de la oferta." },
      { title: "Registra el resultado", short: "Ganada, perdida o pausada.", detail: "Al cierre, el comercial indica el resultado y el sistema lo registra en el histórico con el motivo." }
    ],
    benefits: [
      "Ninguna oferta cae en el olvido por falta de seguimiento",
      "El comercial actúa en el momento correcto con el contexto completo",
      "Histórico de conversión por producto, cliente y motivo de pérdida"
    ],
    pasos: [
      "Se marca la oferta como enviada en el sistema",
      "El proceso monitoriza los días sin respuesta",
      "Al superar el umbral configurado, alerta al comercial",
      "El comercial contacta con el cliente y actualiza el estado",
      "Al cierre, el resultado queda registrado automáticamente"
    ],
    personalizacion: "Define los umbrales de alerta por tipo de producto o importe, el canal de notificación y qué campos registrar al cierre.",
    sectores: ["Industrial"],
    herramientas: ["CRM / ERP", "Email", "Make/n8n"],
    dolores: [
      "Enviamos presupuestos y luego no sabemos en qué estado están",
      "El comercial tiene tantas ofertas abiertas que olvida hacer seguimiento"
    ],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "industrial",
    bloque_negocio: "B1",
    modulo_codigo: "1.3"
  },
  {
    id: "IND-1.4",
    codigo: "1.4",
    slug: "industrial-portal-estado-pedido",
    categoria: "B1",
    categoriaNombre: "Clientes y presupuestos",
    nombre: "Portal de estado de pedido para el cliente",
    tagline: "El cliente puede consultar en tiempo real en qué fase está su pedido, cuándo se entrega y qué documentación tiene disponible, sin llamar.",
    recomendado: false,
    descripcionDetallada: "El cliente industrial llama para saber si su pedido está listo porque no tiene otra forma de saberlo. Esas llamadas consumen tiempo del administrativo y del comercial, y no siempre tienen la información actualizada. Este portal da al cliente una visión en tiempo real del estado de su pedido — confirmado, en producción, en control de calidad, enviado — y acceso a toda la documentación asociada sin que nadie tenga que gestionarlo manualmente.",
    summary: {
      what_it_is: "Portal web para que el cliente consulte el estado de sus pedidos y descargue documentación sin llamar.",
      for_who: ["Industriales cuyos clientes llaman frecuentemente a preguntar por pedidos", "Empresas que quieren reducir la carga administrativa", "Clientes habituales con varios pedidos activos a la vez"],
      requirements: ["Sistema de gestión de pedidos actualizado", "Datos de cliente para acceso al portal"],
      output: "Reducción del volumen de llamadas de estado de pedido y mayor satisfacción del cliente."
    },
    indicators: {
      time_estimate: "3-4 semanas",
      complexity: "Media",
      integrations: ["ERP / Sistema de producción", "Portal web", "Email"]
    },
    how_it_works_steps: [
      { title: "El cliente accede al portal", short: "Por link sin contraseñas complicadas.", detail: "Al confirmar el pedido, el cliente recibe un link de acceso personalizado a su espacio de seguimiento." },
      { title: "Ve el estado en tiempo real", short: "Actualizado desde producción.", detail: "El estado del pedido se sincroniza con el sistema de producción: confirmado, en fabricación, QC, expedición." },
      { title: "Descarga su documentación", short: "Albarán, certificado, factura.", detail: "La documentación disponible aparece automáticamente en el portal en cuanto se genera." }
    ],
    benefits: [
      "Clientes informados sin que nadie tenga que atender sus llamadas",
      "Reducción significativa de llamadas de 'cómo va mi pedido'",
      "Imagen profesional y servicio diferenciado respecto a la competencia"
    ],
    pasos: [
      "Al confirmar el pedido, el cliente recibe acceso al portal",
      "El estado del pedido se actualiza automáticamente desde producción",
      "El cliente ve la fase en tiempo real: confirmado, en producción, enviado",
      "La documentación aparece en el portal al generarse",
      "El cliente descarga lo que necesita sin llamar"
    ],
    personalizacion: "Define qué información mostrar en cada fase, qué documentos son visibles y cuándo, y si quieres añadir chat de soporte integrado.",
    sectores: ["Industrial"],
    herramientas: ["ERP", "Portal web", "Make/n8n"],
    dolores: [
      "Los clientes llaman todo el día a preguntar por sus pedidos",
      "El administrativo pierde horas al día dando el mismo tipo de información"
    ],
    integration_domains: ["CRM", "DOCS"],
    landing_slug: "industrial",
    bloque_negocio: "B1",
    modulo_codigo: "1.4"
  },

  // ── BLOQUE B2 · Pedidos y producción ──────────────────────────────────────
  {
    id: "IND-2.1",
    codigo: "2.1",
    slug: "industrial-entrada-pedido-produccion",
    categoria: "B2",
    categoriaNombre: "Pedidos y producción",
    nombre: "Entrada de pedido y planificación de producción",
    tagline: "Cuando entra un pedido confirmado, el sistema lo convierte en una orden de fabricación, reserva los materiales y lo ubica en la cola de producción.",
    recomendado: true,
    descripcionDetallada: "El traslado manual de un pedido confirmado a una orden de producción es uno de los cuellos de botella más habituales en la industria. Alguien tiene que introducir los datos en el sistema de producción, comprobar los materiales disponibles, reservarlos y asignar la posición en la cola. Si hay errores en ese paso, los plazos se incumplen y planta trabaja con información incorrecta. Este proceso cierra ese gap de forma automática y sin intervención humana.",
    summary: {
      what_it_is: "Automatización del puente entre la confirmación de pedido y la creación de la orden de fabricación con materiales reservados.",
      for_who: ["Industriales donde el paso de pedido a producción es manual", "Empresas con errores frecuentes en la transferencia de información", "Fábricas donde el jefe de planta recibe datos tarde o incompletos"],
      requirements: ["Sistema de gestión de pedidos", "Sistema de planificación de producción (ERP / MES)", "Gestión de stock de materiales"],
      output: "Orden de fabricación creada al instante con materiales reservados y posicionada en la cola de producción."
    },
    indicators: {
      time_estimate: "3-4 semanas",
      complexity: "Alta",
      integrations: ["ERP / CRM", "MES / Sistema de producción", "Gestión de stock"]
    },
    how_it_works_steps: [
      { title: "Pedido confirmado", short: "Arranca el flujo de producción.", detail: "Al confirmarse el pedido, el sistema crea automáticamente la orden de fabricación con los datos del pedido." },
      { title: "Reserva materiales", short: "Comprueba stock y reserva.", detail: "Verifica disponibilidad de materias primas y reserva las cantidades necesarias en el almacén." },
      { title: "Planifica la producción", short: "Posiciona en la cola con el plazo.", detail: "Ubica la orden en la cola de producción según capacidad disponible y plazo comprometido al cliente." }
    ],
    benefits: [
      "Orden de fabricación creada automáticamente, sin introducción manual",
      "Materiales reservados antes de que planta empiece a trabajar",
      "El jefe de planta recibe la información completa y a tiempo"
    ],
    pasos: [
      "El pedido se confirma en el sistema de gestión",
      "Se crea automáticamente la orden de fabricación",
      "Se comprueba el stock de materiales necesarios",
      "Se reservan los materiales para la orden",
      "La orden se posiciona en la cola de producción según plazo"
    ],
    personalizacion: "Define los criterios de posicionamiento en cola (FIFO, por fecha de entrega, por cliente prioritario), qué hacer si faltan materiales y cómo notificar a planta.",
    sectores: ["Industrial"],
    herramientas: ["ERP", "MES / Sistema de producción", "Make/n8n"],
    dolores: [
      "De la confirmación del pedido a la orden de producción pueden pasar horas o días",
      "Planta empieza a trabajar con datos incorrectos o incompletos",
      "Los errores de transferencia nos generan retrabajos y retrasos"
    ],
    integration_domains: ["OTHER"],
    landing_slug: "industrial",
    bloque_negocio: "B2",
    modulo_codigo: "2.1"
  },
  {
    id: "IND-2.2",
    codigo: "2.2",
    slug: "industrial-control-avance-linea",
    categoria: "B2",
    categoriaNombre: "Pedidos y producción",
    nombre: "Control de avance de línea en tiempo real",
    tagline: "Panel visual del estado de cada orden activa: qué está en proceso, qué está parado y si hay riesgo de retraso respecto al plazo comprometido.",
    recomendado: true,
    descripcionDetallada: "El jefe de producción necesita saber en todo momento qué está pasando en planta sin tener que ir a comprobarlo físicamente. Este panel muestra en tiempo real el avance de cada orden, los operarios asignados, los tiempos invertidos y una alerta automática si alguna orden supera el tiempo previsto. Comercial y dirección pueden ver también el estado sin interrumpir a planta.",
    summary: {
      what_it_is: "Dashboard en tiempo real del estado de todas las órdenes de producción activas, con alertas por desviación de plazo.",
      for_who: ["Jefes de producción sin visibilidad en tiempo real", "Empresas que se enteran del retraso cuando ya no hay margen", "Organizaciones donde comercial y producción no comparten información"],
      requirements: ["Registro de avance por parte de los operarios (tablet o terminal)", "Sistema de órdenes de fabricación"],
      output: "Visibilidad completa del estado de planta en tiempo real para producción, comercial y dirección."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["MES / Sistema de producción", "Dashboard", "Alertas por WhatsApp/Email"]
    },
    how_it_works_steps: [
      { title: "Operarios reportan avance", short: "Desde tablet o terminal en planta.", detail: "Al completar cada fase de la orden, el operario registra el avance en menos de 30 segundos." },
      { title: "Panel actualizado al instante", short: "Estado de cada orden en tiempo real.", detail: "El dashboard refleja el avance, el tiempo invertido y el tiempo restante estimado por orden." },
      { title: "Alerta si hay desviación", short: "Antes de que el problema escale.", detail: "Si una orden supera el tiempo previsto, alerta automáticamente al jefe de producción y al comercial." }
    ],
    benefits: [
      "Visibilidad completa de planta sin interrumpir el trabajo",
      "Alertas antes de que el retraso sea inevitable",
      "Comercial puede informar al cliente con datos reales, no con estimaciones"
    ],
    pasos: [
      "Los operarios reportan el avance de cada fase desde planta",
      "El sistema actualiza el estado de cada orden en tiempo real",
      "Se calcula el tiempo restante estimado por orden",
      "Se lanza alerta si hay desviación respecto al plazo comprometido",
      "Jefe de producción y comercial reciben la alerta y pueden actuar"
    ],
    personalizacion: "Define los umbrales de alerta por tipo de orden, quién recibe las notificaciones y qué información ve cada rol (producción, comercial, dirección).",
    sectores: ["Industrial"],
    herramientas: ["MES / Sistema de producción", "Dashboard", "Make/n8n"],
    dolores: [
      "Nos enteramos de los retrasos cuando ya es demasiado tarde",
      "El comercial llama a planta para saber el estado y los interrumpe"
    ],
    integration_domains: ["OTHER"],
    landing_slug: "industrial",
    bloque_negocio: "B2",
    modulo_codigo: "2.2"
  },
  {
    id: "IND-2.3",
    codigo: "2.3",
    slug: "industrial-cambios-pedido-curso",
    categoria: "B2",
    categoriaNombre: "Pedidos y producción",
    nombre: "Gestión de cambios de pedido en curso",
    tagline: "Cuando el cliente modifica un pedido ya en marcha, el proceso recalcula el impacto en plazo y coste y notifica a todos los afectados antes de validar.",
    recomendado: false,
    descripcionDetallada: "Un cambio en un pedido que ya está en producción es una de las situaciones más costosas y caóticas en una industrial. El cliente lo pide como si fuera fácil, pero el impacto en materiales, cola de producción y plazo puede ser significativo. Este proceso obliga a cuantificar ese impacto antes de aceptar el cambio, coordina la comunicación con todos los afectados (producción, compras, comercial) y registra la modificación de forma trazable.",
    summary: {
      what_it_is: "Flujo de gestión de modificaciones de pedidos en curso con cálculo de impacto y aprobación coordinada.",
      for_who: ["Industriales que gestionan cambios de pedido de forma manual", "Empresas con clientes que modifican pedidos con frecuencia", "Fábricas donde los cambios generan caos y errores de comunicación"],
      requirements: ["Sistema de gestión de órdenes de fabricación", "Datos de coste de producción por tipo de cambio"],
      output: "Cambios gestionados con impacto cuantificado, aprobación registrada y notificación coordinada a todos los afectados."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["ERP", "Email", "WhatsApp"]
    },
    how_it_works_steps: [
      { title: "Se recibe la solicitud de cambio", short: "Del comercial o del cliente.", detail: "El comercial introduce la modificación solicitada en el sistema con los detalles del cambio." },
      { title: "Calcula el impacto", short: "En plazo, coste y materiales.", detail: "El sistema calcula automáticamente cómo afecta el cambio al plazo de entrega, al coste y a los materiales reservados." },
      { title: "Coordina la aprobación", short: "Y notifica a todos los afectados.", detail: "El cambio aprobado se comunica automáticamente a producción, compras y al cliente, y queda registrado." }
    ],
    benefits: [
      "El impacto del cambio se calcula antes de aceptarlo, no después",
      "Cero cambios que llegan a planta sin que compras lo sepa",
      "Trazabilidad completa de cada modificación para facturación y disputas"
    ],
    pasos: [
      "Se registra la solicitud de cambio con los detalles de la modificación",
      "El sistema calcula el impacto en plazo, coste y materiales",
      "El responsable revisa y aprueba o rechaza el cambio",
      "Al aprobarse, se notifica a producción, compras y al cliente",
      "La modificación queda registrada en el expediente del pedido"
    ],
    personalizacion: "Define quién aprueba según el tipo de cambio, los criterios de cálculo de coste adicional y el canal de notificación a cada parte.",
    sectores: ["Industrial"],
    herramientas: ["ERP", "Email", "Make/n8n"],
    dolores: [
      "Los cambios de pedido en curso generan caos en planta",
      "No sabemos el coste de cada modificación hasta que ya está hecha"
    ],
    integration_domains: ["OTHER", "COMMS"],
    landing_slug: "industrial",
    bloque_negocio: "B2",
    modulo_codigo: "2.3"
  },
  {
    id: "IND-2.4",
    codigo: "2.4",
    slug: "industrial-cierre-orden-documentacion",
    categoria: "B2",
    categoriaNombre: "Pedidos y producción",
    nombre: "Cierre de orden y entrega de documentación",
    tagline: "Al terminar la producción, el sistema genera automáticamente el albarán, el certificado de calidad y la documentación técnica, y los envía al cliente en un solo paso.",
    recomendado: false,
    descripcionDetallada: "Cuando una orden termina, empieza otra carrera: generar el albarán, crear el certificado de calidad, adjuntar la ficha técnica del lote y enviarlo todo al cliente antes de que llame preguntando. Si este proceso es manual, el margen de error es alto y el retraso habitual. Este proceso genera toda la documentación de cierre automáticamente al marcar la orden como completada y la envía al cliente en un único paquete coordinado.",
    summary: {
      what_it_is: "Generación y envío automático de toda la documentación de cierre al completar una orden de fabricación.",
      for_who: ["Industriales con procesos de documentación de entrega manual", "Empresas que envían documentación con retraso respecto a la entrega física", "Sectores que requieren certificados de calidad o fichas técnicas de lote"],
      requirements: ["Sistema de gestión de órdenes con cierre de estado", "Plantillas de albarán y certificado de calidad", "Email del cliente"],
      output: "Documentación completa enviada al cliente automáticamente en el momento del cierre de producción."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["ERP", "Generador de documentos", "Email"]
    },
    how_it_works_steps: [
      { title: "Se cierra la orden", short: "Al marcar producción como completada.", detail: "El operario o el jefe de producción marca la orden como completada en el sistema." },
      { title: "Genera la documentación", short: "Albarán, certificado, ficha técnica.", detail: "El sistema genera automáticamente todos los documentos requeridos con los datos del lote y la orden." },
      { title: "Envía al cliente", short: "En un paquete coordinado.", detail: "El cliente recibe por email todos los documentos en el mismo momento, sin que nadie tenga que gestionarlo." }
    ],
    benefits: [
      "Documentación enviada al cliente en el mismo momento del cierre de producción",
      "Sin errores por datos introducidos a mano en cada documento",
      "El cliente tiene todo lo que necesita antes de que llegue el camión"
    ],
    pasos: [
      "Se marca la orden de fabricación como completada",
      "El sistema extrae los datos del lote y la orden",
      "Genera el albarán, el certificado de calidad y la ficha técnica",
      "Envía el paquete de documentación al cliente por email",
      "Archiva los documentos en el expediente del pedido"
    ],
    personalizacion: "Define qué documentos generar por tipo de producto, el formato y el canal de envío, y si quiere confirmación de recepción por parte del cliente.",
    sectores: ["Industrial"],
    herramientas: ["ERP", "Generador de documentos", "Email"],
    dolores: [
      "Enviamos el albarán días después de que el producto ya llegó",
      "El certificado de calidad siempre se demora o llega con errores"
    ],
    integration_domains: ["DOCS", "COMMS"],
    landing_slug: "industrial",
    bloque_negocio: "B2",
    modulo_codigo: "2.4"
  },

  // ── BLOQUE B3 · Calidad, entregas y trazabilidad ──────────────────────────
  {
    id: "IND-3.1",
    codigo: "3.1",
    slug: "industrial-control-calidad-proceso",
    categoria: "B3",
    categoriaNombre: "Calidad, entregas y trazabilidad",
    nombre: "Control de calidad en proceso",
    tagline: "Registra los controles de calidad en cada punto crítico de la producción y bloquea el avance de la orden si hay una desviación sin resolver.",
    recomendado: true,
    descripcionDetallada: "El control de calidad que se hace de memoria o en papel llega tarde y deja trazabilidad incompleta. Este proceso digitaliza los puntos de control de calidad a lo largo de la producción: el operario registra los valores medidos en cada fase, el sistema comprueba si están dentro de tolerancia y bloquea el avance si hay una desviación sin resolver, evitando que el problema avance en la cadena.",
    summary: {
      what_it_is: "Sistema de control de calidad digital integrado en el proceso de producción con bloqueo automático ante desviaciones.",
      for_who: ["Industriales con controles de calidad en papel o memoria", "Empresas con problemas de calidad detectados tarde", "Sectores con requisitos de certificación ISO o de cliente"],
      requirements: ["Puntos de control definidos por tipo de producto", "Terminal o tablet en planta para el registro"],
      output: "Control de calidad registrado en cada fase con trazabilidad completa y bloqueo automático ante desviaciones."
    },
    indicators: {
      time_estimate: "3-4 semanas",
      complexity: "Media",
      integrations: ["MES / Sistema de producción", "Tablet / Terminal en planta", "Alertas"]
    },
    how_it_works_steps: [
      { title: "Define los puntos de control", short: "Por tipo de producto y fase.", detail: "Se configuran los puntos de inspección, los valores esperados y las tolerancias para cada tipo de producción." },
      { title: "Operario registra valores", short: "Desde la tablet en planta.", detail: "Al llegar al punto de control, el operario introduce los valores medidos en menos de un minuto." },
      { title: "Sistema valida y bloquea", short: "Si hay desviación, para el avance.", detail: "Si los valores están fuera de tolerancia, se bloquea el avance y se notifica al responsable de calidad." }
    ],
    benefits: [
      "Los problemas de calidad se detectan en planta, no en el cliente",
      "Trazabilidad completa de cada inspección por lote y operario",
      "Cumplimiento de requisitos de certificación sin más burocracia"
    ],
    pasos: [
      "Se definen los puntos de control y tolerancias por tipo de producto",
      "El operario registra los valores medidos en cada punto de control",
      "El sistema compara con los valores esperados",
      "Si hay desviación, bloquea el avance y alerta al responsable",
      "El responsable valida o rechaza antes de permitir continuar"
    ],
    personalizacion: "Define los puntos de control, valores esperados y tolerancias por producto, y el escalado de alertas según la gravedad de la desviación.",
    sectores: ["Industrial"],
    herramientas: ["MES / Sistema de producción", "Tablet", "Make/n8n"],
    dolores: [
      "El control de calidad se hace de memoria y la trazabilidad es muy mala",
      "Detectamos los problemas cuando el producto ya está en el cliente"
    ],
    integration_domains: ["OTHER"],
    landing_slug: "industrial",
    bloque_negocio: "B3",
    modulo_codigo: "3.1"
  },
  {
    id: "IND-3.2",
    codigo: "3.2",
    slug: "industrial-trazabilidad-lote-serie",
    categoria: "B3",
    categoriaNombre: "Calidad, entregas y trazabilidad",
    nombre: "Trazabilidad de lote y número de serie",
    tagline: "Rastrea cada pieza o lote desde la materia prima hasta el cliente final. Consulta el histórico completo en segundos cuando hay una reclamación o auditoría.",
    recomendado: true,
    descripcionDetallada: "Cuando llega una reclamación de cliente o una auditoría de certificación, el tiempo que se tarda en reconstruir el histórico de un lote determina si el problema se resuelve en horas o en semanas. Este proceso registra automáticamente cada movimiento de cada lote o número de serie — materias primas, operaciones, controles de calidad, expedición — y lo hace consultable en segundos con el número de lote o serie como punto de entrada.",
    summary: {
      what_it_is: "Sistema de trazabilidad completa de lote y número de serie desde materia prima hasta cliente final.",
      for_who: ["Industriales con requisitos de trazabilidad por cliente o certificación", "Empresas que tardan días en reconstruir el histórico de un lote", "Sectores con reclamaciones frecuentes que requieren investigación rápida"],
      requirements: ["Codificación de lotes en producción", "Registro de movimientos de materiales"],
      output: "Árbol de trazabilidad completo por lote o número de serie, consultable en segundos."
    },
    indicators: {
      time_estimate: "4-6 semanas",
      complexity: "Alta",
      integrations: ["ERP", "MES", "Gestión de almacén", "Códigos QR / escáneres"]
    },
    how_it_works_steps: [
      { title: "Asigna identificación a cada lote", short: "Código QR o número de serie.", detail: "Cada lote de materia prima y cada producto terminado recibe un identificador único desde el inicio." },
      { title: "Registra cada movimiento", short: "Automáticamente en cada paso.", detail: "Entradas de almacén, operaciones de producción, controles de calidad y expedición se registran vinculados al lote." },
      { title: "Consulta en segundos", short: "Árbol completo por lote o serie.", detail: "Con el número de lote, se obtiene inmediatamente toda la cadena: materia prima → proceso → cliente." }
    ],
    benefits: [
      "Reclamaciones investigadas en horas, no en semanas",
      "Cumplimiento de requisitos de clientes y certificaciones sin esfuerzo adicional",
      "Retiradas de lote ejecutadas con precisión sin afectar a otros clientes"
    ],
    pasos: [
      "Se asigna un identificador único a cada lote de material o producto",
      "Cada operación y movimiento se registra vinculado al identificador",
      "Los controles de calidad se asocian al lote correspondiente",
      "Al expedir, se registra el cliente y la cantidad por lote",
      "Ante una reclamación, se obtiene el árbol completo en segundos"
    ],
    personalizacion: "Define la granularidad de trazabilidad (lote, sublote, unidad), los puntos de registro y el formato de exportación para auditorías.",
    sectores: ["Industrial"],
    herramientas: ["ERP", "MES", "Códigos QR / escáneres", "Make/n8n"],
    dolores: [
      "Cuando un cliente reclama, tardamos días en saber qué pasó y con qué material",
      "Una auditoría de cliente nos genera semanas de trabajo de reconstrucción"
    ],
    integration_domains: ["OTHER"],
    landing_slug: "industrial",
    bloque_negocio: "B3",
    modulo_codigo: "3.2"
  },
  {
    id: "IND-3.3",
    codigo: "3.3",
    slug: "industrial-devoluciones-no-conformidades",
    categoria: "B3",
    categoriaNombre: "Calidad, entregas y trazabilidad",
    nombre: "Gestión de devoluciones y no conformidades",
    tagline: "Abre el expediente de no conformidad automáticamente al recibir una reclamación, asígnalo al responsable y sigue hasta el cierre formal con el cliente.",
    recomendado: false,
    descripcionDetallada: "Una reclamación de cliente que no tiene un expediente formal asignado y seguido tiende a resolverse tarde, mal o a repetirse porque nadie investiga la causa raíz. Este proceso abre el expediente automáticamente, lo asigna al responsable de calidad, documenta la investigación, registra las acciones correctivas y cierra formalmente con el cliente una vez resuelto.",
    summary: {
      what_it_is: "Sistema de gestión de no conformidades y devoluciones con expediente automático, seguimiento y cierre formal.",
      for_who: ["Industriales que gestionan reclamaciones sin sistema formal", "Empresas con reclamaciones recurrentes que no se analizan", "Sectores con clientes que exigen respuesta formal a no conformidades"],
      requirements: ["Canal de recepción de reclamaciones definido", "Responsable de calidad identificado"],
      output: "100% de reclamaciones con expediente abierto, investigado y cerrado formalmente."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["Email", "CRM / ERP", "Generador de documentos"]
    },
    how_it_works_steps: [
      { title: "Llega la reclamación", short: "Por email, llamada o portal.", detail: "Se recibe la reclamación del cliente por el canal habitual y se abre el expediente automáticamente." },
      { title: "Se investiga y se actúa", short: "Responsable asignado con seguimiento.", detail: "El responsable de calidad investiga la causa raíz, define la acción correctiva y la ejecuta dentro del plazo." },
      { title: "Se cierra con el cliente", short: "Informe formal y confirmación.", detail: "Se envía al cliente el informe de resolución y se registra el cierre formal en el expediente." }
    ],
    benefits: [
      "Cero reclamaciones sin expediente y sin responsable asignado",
      "Las causas raíz se identifican y atacan, reduciendo recurrencia",
      "Los clientes reciben respuesta formal en plazo, mejorando la relación"
    ],
    pasos: [
      "Se recibe la reclamación y se abre el expediente automáticamente",
      "Se asigna al responsable de calidad con plazo de investigación",
      "El responsable documenta la causa raíz y la acción correctiva",
      "Se ejecuta la acción correctiva y se verifica su eficacia",
      "Se cierra el expediente formalmente y se notifica al cliente"
    ],
    personalizacion: "Define los plazos de respuesta por tipo de reclamación, el flujo de aprobación de acciones correctivas y el formato del informe al cliente.",
    sectores: ["Industrial"],
    herramientas: ["Email", "CRM / ERP", "Generador de documentos", "Make/n8n"],
    dolores: [
      "Las reclamaciones de clientes se gestionan de forma informal y sin seguimiento",
      "Los mismos problemas se repiten porque nunca investigamos la causa raíz"
    ],
    integration_domains: ["CRM", "DOCS"],
    landing_slug: "industrial",
    bloque_negocio: "B3",
    modulo_codigo: "3.3"
  },
  {
    id: "IND-3.4",
    codigo: "3.4",
    slug: "industrial-preparacion-seguimiento-envios",
    categoria: "B3",
    categoriaNombre: "Calidad, entregas y trazabilidad",
    nombre: "Preparación y seguimiento de envíos",
    tagline: "Coordina la preparación del pedido, genera la documentación de transporte y envía al cliente el número de seguimiento en cuanto sale de planta.",
    recomendado: false,
    descripcionDetallada: "El proceso de expedición en muchas industriales es manual: alguien busca el número del transportista, genera el albarán, llama al cliente para avisar de que el pedido sale. Este proceso automatiza la coordinación de expedición, genera la documentación de transporte al confirmar la recogida, envía automáticamente el número de seguimiento al cliente y alerta al comercial si el transportista registra alguna incidencia en la entrega.",
    summary: {
      what_it_is: "Automatización del proceso de expedición: documentación de transporte, notificación al cliente y seguimiento de entrega.",
      for_who: ["Industriales con proceso de expedición manual", "Empresas cuyos clientes llaman para saber cuándo llega su pedido", "Negocios con volumen de envíos que no pueden gestionar manualmente"],
      requirements: ["Transportistas habituales con API o acceso web", "Email o WhatsApp del contacto del cliente"],
      output: "Documentación de transporte generada automáticamente y cliente notificado en cuanto el pedido sale de planta."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["Transportistas (API)", "Email", "WhatsApp", "ERP"]
    },
    how_it_works_steps: [
      { title: "Confirma la recogida", short: "Con el transportista habitual.", detail: "Al confirmar que el pedido está listo para expedir, el sistema solicita recogida al transportista." },
      { title: "Genera la documentación", short: "CMR, albarán, etiquetas.", detail: "La documentación de transporte se genera automáticamente con los datos del pedido y el destinatario." },
      { title: "Notifica al cliente", short: "Con el número de seguimiento.", detail: "En cuanto el transportista registra la recogida, el cliente recibe el número de seguimiento automáticamente." }
    ],
    benefits: [
      "El cliente siempre sabe cuándo llega su pedido sin llamar",
      "Documentación de transporte generada sin intervención manual",
      "Alertas al comercial ante incidencias del transportista antes de que llame el cliente"
    ],
    pasos: [
      "Se confirma que el pedido está listo para expedir",
      "El sistema solicita recogida al transportista",
      "Se genera la documentación de transporte automáticamente",
      "El transportista recoge y registra la incidencia de recogida",
      "El cliente recibe el número de seguimiento por email o WhatsApp"
    ],
    personalizacion: "Define los transportistas habituales, el canal de notificación al cliente y las alertas en caso de incidencia de entrega.",
    sectores: ["Industrial"],
    herramientas: ["API de transportistas", "Email", "WhatsApp Business", "ERP"],
    dolores: [
      "El cliente llama para saber si su pedido salió cuando ya deberíamos haberlo avisado",
      "Generamos la documentación de transporte a mano y a veces hay errores"
    ],
    integration_domains: ["COMMS", "DOCS"],
    landing_slug: "industrial",
    bloque_negocio: "B3",
    modulo_codigo: "3.4"
  },

  // ── BLOQUE B4 · Compras y proveedores ─────────────────────────────────────
  {
    id: "IND-4.1",
    codigo: "4.1",
    slug: "industrial-solicitud-materiales-pedidos",
    categoria: "B4",
    categoriaNombre: "Compras y proveedores",
    nombre: "Solicitud de materiales y generación de pedidos",
    tagline: "Cuando la planificación detecta que faltan materiales, lanza automáticamente la solicitud de compra con el proveedor preferente seleccionado.",
    recomendado: true,
    descripcionDetallada: "En muchas industriales, la generación de pedidos de compra es un proceso manual que depende de que alguien revise el stock o que producción avise cuando falta algo. Este proceso monitoriza las necesidades de materiales en función de las órdenes planificadas, detecta automáticamente las necesidades de compra y genera la solicitud con el proveedor preferente, las cantidades correctas y el plazo necesario, lista para que compras solo tenga que aprobar.",
    summary: {
      what_it_is: "Generación automática de solicitudes de compra a partir de las necesidades detectadas en planificación de producción.",
      for_who: ["Industriales donde los pedidos de compra se gestionan manualmente", "Empresas con roturas de stock por retrasos en la generación de pedidos", "Departamentos de compras que pasan más tiempo recopilando necesidades que negociando"],
      requirements: ["Sistema de planificación de producción", "Catálogo de proveedores con condiciones", "Stock mínimo definido por material"],
      output: "Solicitud de compra generada automáticamente con proveedor, cantidad y plazo, lista para aprobación."
    },
    indicators: {
      time_estimate: "3-4 semanas",
      complexity: "Media",
      integrations: ["ERP", "Gestión de stock", "Email al proveedor"]
    },
    how_it_works_steps: [
      { title: "Detecta la necesidad", short: "Por planificación o por stock mínimo.", detail: "El sistema calcula las necesidades de material en función de las órdenes planificadas o el nivel de stock." },
      { title: "Genera la solicitud", short: "Con proveedor y cantidad correctos.", detail: "Crea la solicitud de compra con el proveedor preferente, la cantidad necesaria y el plazo requerido." },
      { title: "Aprobación de un clic", short: "Para el responsable de compras.", detail: "El responsable recibe la solicitud por email o en el sistema, revisa y aprueba en un solo paso." }
    ],
    benefits: [
      "Cero roturas de stock por retrasos en la generación de pedidos",
      "El departamento de compras invierte su tiempo en negociar, no en recopilar necesidades",
      "Proveedor preferente seleccionado automáticamente con el mejor plazo"
    ],
    pasos: [
      "El sistema detecta la necesidad de material por planificación o stock",
      "Calcula la cantidad a pedir y el plazo necesario",
      "Selecciona el proveedor preferente según condiciones configuradas",
      "Genera la solicitud de compra lista para aprobación",
      "El responsable de compras aprueba y el pedido se envía al proveedor"
    ],
    personalizacion: "Define los criterios de selección de proveedor (precio, plazo, calidad histórica), los niveles de aprobación y si quiere envío automático al proveedor tras la aprobación.",
    sectores: ["Industrial"],
    herramientas: ["ERP", "Gestión de stock", "Email", "Make/n8n"],
    dolores: [
      "Nos quedamos sin material porque nadie generó el pedido a tiempo",
      "Compras pasa más tiempo recopilando necesidades que negociando con proveedores"
    ],
    integration_domains: ["OTHER"],
    landing_slug: "industrial",
    bloque_negocio: "B4",
    modulo_codigo: "4.1"
  },
  {
    id: "IND-4.2",
    codigo: "4.2",
    slug: "industrial-evaluacion-proveedores",
    categoria: "B4",
    categoriaNombre: "Compras y proveedores",
    nombre: "Evaluación y homologación de proveedores",
    tagline: "Recoge automáticamente los datos de entrega, calidad y precio por proveedor y genera el informe periódico para decidir con quién seguir trabajando.",
    recomendado: false,
    descripcionDetallada: "La evaluación de proveedores en muchas industriales se hace de forma subjetiva o directamente no se hace. Este proceso recoge automáticamente los datos reales de cada proveedor — plazos de entrega cumplidos, tasa de material rechazado, desviaciones de precio — y genera un scorecard periódico que sirve de base objetiva para las decisiones de compras: homologar proveedores nuevos, renegociar condiciones o buscar alternativas.",
    summary: {
      what_it_is: "Sistema automático de evaluación de proveedores con datos reales de entrega, calidad y precio.",
      for_who: ["Industriales sin sistema formal de evaluación de proveedores", "Empresas con problemas de calidad o plazo recurrentes con los mismos proveedores", "Departamentos de compras que necesitan datos objetivos para negociar"],
      requirements: ["Registro de pedidos de compra con fechas comprometidas y reales", "Registro de incidencias de calidad por proveedor"],
      output: "Scorecard periódico por proveedor con métricas objetivas de rendimiento."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["ERP", "Gestión de compras", "Dashboard"]
    },
    how_it_works_steps: [
      { title: "Recoge los datos reales", short: "Automaticamente de cada operación.", detail: "Extrae de los pedidos cerrados los plazos reales, las incidencias de calidad y las desviaciones de precio." },
      { title: "Calcula el scorecard", short: "Por proveedor y periodo.", detail: "Puntúa a cada proveedor en las dimensiones configuradas y genera el ranking comparativo." },
      { title: "Genera el informe periódico", short: "Para la reunión de compras.", detail: "El informe se genera automáticamente con la frecuencia definida y se envía al responsable de compras." }
    ],
    benefits: [
      "Decisiones de compras basadas en datos reales, no en percepciones",
      "Proveedores problemáticos identificados antes de que el impacto sea mayor",
      "Base objetiva para renegociaciones y decisiones de homologación"
    ],
    pasos: [
      "El sistema recoge automáticamente los datos de cada pedido cerrado",
      "Calcula las métricas de rendimiento por proveedor: plazo, calidad, precio",
      "Genera el scorecard comparativo por proveedor",
      "Envía el informe al responsable de compras con la frecuencia definida",
      "Las decisiones de homologación y renegociación se basan en el scorecard"
    ],
    personalizacion: "Define las métricas y su ponderación (plazo, calidad, precio, servicio), la frecuencia del informe y los umbrales que activan una revisión de proveedor.",
    sectores: ["Industrial"],
    herramientas: ["ERP", "Dashboard", "Make/n8n"],
    dolores: [
      "No tenemos datos objetivos para evaluar a nuestros proveedores",
      "Seguimos trabajando con proveedores problemáticos porque no tenemos alternativa documentada"
    ],
    integration_domains: ["OTHER"],
    landing_slug: "industrial",
    bloque_negocio: "B4",
    modulo_codigo: "4.2"
  },
  {
    id: "IND-4.3",
    codigo: "4.3",
    slug: "industrial-recepcion-verificacion-materiales",
    categoria: "B4",
    categoriaNombre: "Compras y proveedores",
    nombre: "Recepción y verificación de materiales",
    tagline: "Guía al almacén en la recepción de materiales, comprueba que lo recibido coincide con el pedido y registra las incidencias antes de dar entrada al stock.",
    recomendado: false,
    descripcionDetallada: "Recibir materiales sin un proceso de verificación estructurado significa que errores del proveedor — cantidades incorrectas, materiales fuera de especificación, daños de transporte — entran en el stock y se detectan cuando ya están en producción, mucho más tarde y con mucho más impacto. Este proceso guía al personal de almacén en la recepción con una checklist vinculada al pedido, registra las incidencias en el momento y bloquea la entrada al stock hasta que están resueltas.",
    summary: {
      what_it_is: "Proceso guiado de recepción y verificación de materiales con registro de incidencias y control de entrada al stock.",
      for_who: ["Almacenes que reciben sin proceso de verificación formal", "Industriales con problemas de material incorrecto o dañado detectado tarde", "Empresas que pierden tiempo reconciliando diferencias con proveedores sin documentación"],
      requirements: ["Pedidos de compra en el sistema con cantidades y especificaciones", "Terminal o tablet en almacén"],
      output: "Recepción verificada, incidencias documentadas en el momento y entrada al stock controlada."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Baja",
      integrations: ["ERP", "Gestión de almacén", "Tablet"]
    },
    how_it_works_steps: [
      { title: "Identifica el pedido entrante", short: "Escaneando albarán o código.", detail: "El personal de almacén identifica el pedido en el sistema para cargar la checklist de recepción." },
      { title: "Verifica cantidad y estado", short: "Guiado por el sistema.", detail: "La checklist guía la verificación: cantidad, referencia, estado del embalaje, documentación requerida." },
      { title: "Registra incidencias y da entrada", short: "Solo si todo está correcto.", detail: "Las incidencias se registran al momento y se notifica al proveedor. La entrada al stock solo se permite si la recepción es correcta." }
    ],
    benefits: [
      "Los errores del proveedor se detectan en almacén, no en producción",
      "Incidencias documentadas automáticamente para reclamación al proveedor",
      "Stock correcto desde el primer día, sin sorpresas en producción"
    ],
    pasos: [
      "El personal de almacén identifica el pedido entrante en el sistema",
      "La checklist guía la verificación de cantidad, referencia y estado",
      "Las incidencias detectadas se registran en el sistema con foto",
      "Se notifica automáticamente al proveedor de las incidencias",
      "La entrada al stock solo se aprueba cuando la recepción es correcta"
    ],
    personalizacion: "Define qué verificar por tipo de material, los criterios de aceptación/rechazo y el flujo de notificación al proveedor en caso de incidencia.",
    sectores: ["Industrial"],
    herramientas: ["ERP", "Gestión de almacén", "Tablet", "Make/n8n"],
    dolores: [
      "Recibimos material incorrecto o dañado y lo detectamos cuando ya está en producción",
      "No tenemos documentación de las incidencias para reclamar al proveedor"
    ],
    integration_domains: ["OTHER"],
    landing_slug: "industrial",
    bloque_negocio: "B4",
    modulo_codigo: "4.3"
  },
  {
    id: "IND-4.4",
    codigo: "4.4",
    slug: "industrial-stock-minimo-alertas",
    categoria: "B4",
    categoriaNombre: "Compras y proveedores",
    nombre: "Control de stock mínimo y alertas de reposición",
    tagline: "Monitoriza el nivel de cada material y lanza una alerta cuando baja del mínimo definido, con el tiempo de antelación necesario para recibir el pedido antes de que afecte a producción.",
    recomendado: false,
    descripcionDetallada: "Una rotura de stock en una referencia crítica puede parar una línea de producción entera. Y el stock mínimo que se configuró hace dos años ya no refleja el ritmo de consumo actual. Este proceso monitoriza en tiempo real el nivel de cada referencia de material, ajusta dinámicamente las alertas según el consumo reciente y el plazo de entrega del proveedor, y lanza la alerta con la antelación suficiente para recibir el pedido antes de que la producción se vea afectada.",
    summary: {
      what_it_is: "Sistema de monitorización de niveles de stock con alertas de reposición adaptadas al consumo real y al plazo del proveedor.",
      for_who: ["Industriales con roturas de stock recurrentes", "Almacenes con stocks mínimos desactualizados", "Empresas donde la rotura de stock es un evento que paraliza la actividad"],
      requirements: ["Sistema de gestión de stock actualizado", "Plazos de entrega por proveedor y referencia definidos"],
      output: "Alertas de reposición con la antelación correcta para que nunca haya rotura de stock por falta de previsión."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja",
      integrations: ["ERP", "Gestión de stock", "Email / WhatsApp"]
    },
    how_it_works_steps: [
      { title: "Monitoriza el nivel de stock", short: "En tiempo real por referencia.", detail: "Sigue el nivel de cada material actualizado en el sistema de gestión de stock." },
      { title: "Calcula el punto de reposición", short: "Según consumo y plazo del proveedor.", detail: "Calcula dinámicamente cuándo lanzar la alerta para que el pedido llegue antes de que se agote el stock." },
      { title: "Lanza la alerta", short: "Con propuesta de pedido incluida.", detail: "Notifica al responsable de compras con la referencia, la cantidad sugerida y el proveedor habitual." }
    ],
    benefits: [
      "Cero roturas de stock por falta de previsión",
      "Alertas con la antelación correcta, no cuando ya es tarde",
      "Stock mínimo actualizado dinámicamente según consumo real"
    ],
    pasos: [
      "El sistema monitoriza el nivel de stock por referencia en tiempo real",
      "Calcula el punto de reposición según consumo y plazo del proveedor",
      "Cuando el nivel baja del punto de reposición, lanza la alerta",
      "La alerta incluye la cantidad sugerida y el proveedor habitual",
      "El responsable de compras genera el pedido en un clic"
    ],
    personalizacion: "Define los stocks mínimos por referencia, la sensibilidad de ajuste dinámico y el canal de alerta al responsable de compras.",
    sectores: ["Industrial"],
    herramientas: ["ERP", "Gestión de stock", "Email / WhatsApp", "Make/n8n"],
    dolores: [
      "Nos quedamos sin material y paramos producción cuando ya es tarde",
      "Los stocks mínimos que tenemos configurados están desactualizados"
    ],
    integration_domains: ["OTHER", "COMMS"],
    landing_slug: "industrial",
    bloque_negocio: "B4",
    modulo_codigo: "4.4"
  },

  // ── BLOQUE B5 · Administración y facturación ───────────────────────────────
  {
    id: "IND-5.1",
    codigo: "5.1",
    slug: "industrial-facturacion-automatica",
    categoria: "B5",
    categoriaNombre: "Administración y facturación",
    nombre: "Facturación automática al cierre de entrega",
    tagline: "En cuanto el albarán está firmado, el sistema genera la factura, la envía al cliente y la registra en contabilidad sin intervención manual.",
    recomendado: true,
    descripcionDetallada: "En una industrial que factura a plazos largos (60 o 90 días), cualquier retraso en la emisión de la factura se traduce directamente en retraso del cobro. Si el albarán tarda tres días en procesarse y convertirse en factura, esos tres días se suman al plazo de cobro. Este proceso elimina ese retraso: desde la firma del albarán hasta la factura enviada al cliente en cuestión de minutos, con los datos correctos y el registro automático en el sistema contable.",
    summary: {
      what_it_is: "Automatización completa del ciclo albarán → factura → envío → registro contable.",
      for_who: ["Industriales con facturación a plazos largos", "Empresas donde el proceso de facturación es manual y lento", "Negocios con errores frecuentes en facturas por datos introducidos a mano"],
      requirements: ["Sistema de albaranes actualizado", "Software de facturación o ERP con módulo de facturación", "Email del cliente para envío"],
      output: "Factura generada, enviada al cliente y registrada en contabilidad en minutos desde la firma del albarán."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["ERP", "Software de facturación", "Email", "Contabilidad"]
    },
    how_it_works_steps: [
      { title: "Albarán firmado y registrado", short: "Arranca el proceso de facturación.", detail: "Al registrarse el albarán firmado en el sistema, arranca automáticamente el flujo de facturación." },
      { title: "Genera la factura", short: "Con los datos del pedido y el albarán.", detail: "La factura se genera con los datos correctos del pedido, condiciones de pago y detalles del cliente." },
      { title: "Envía y registra", short: "Al cliente y en contabilidad.", detail: "La factura se envía al cliente por email y se registra automáticamente en el sistema contable." }
    ],
    benefits: [
      "El cobro empieza antes porque la factura llega antes",
      "Cero errores por datos introducidos manualmente",
      "El administrativo libera horas de tecleo para tareas de más valor"
    ],
    pasos: [
      "El albarán firmado queda registrado en el sistema",
      "El proceso detecta el cierre y arranca la facturación",
      "Se genera la factura con los datos del pedido y las condiciones acordadas",
      "La factura se envía automáticamente al cliente por email",
      "Se registra en el sistema contable sin intervención manual"
    ],
    personalizacion: "Define las condiciones de facturación por cliente (plazo, divisa, formato), los campos de validación requeridos y si quiere revisión humana antes del envío para pedidos de gran importe.",
    sectores: ["Industrial"],
    herramientas: ["ERP", "Software de facturación", "Email", "Contabilidad"],
    dolores: [
      "El albarán tarda días en convertirse en factura y perdemos días de cobro",
      "Las facturas tienen errores por los datos introducidos a mano"
    ],
    integration_domains: ["ADMIN", "COMMS"],
    landing_slug: "industrial",
    bloque_negocio: "B5",
    modulo_codigo: "5.1"
  },
  {
    id: "IND-5.2",
    codigo: "5.2",
    slug: "industrial-seguimiento-cobros",
    categoria: "B5",
    categoriaNombre: "Administración y facturación",
    nombre: "Seguimiento de cobros y reclamación de impagados",
    tagline: "Controla el estado de cada factura emitida, lanza recordatorios automáticos antes del vencimiento y escala si el pago no llega en plazo.",
    recomendado: true,
    descripcionDetallada: "En industria, los plazos de cobro son largos y las facturas son muchas. Llevar el seguimiento manual de cuáles están cobradas, cuáles están próximas a vencer y cuáles han vencido sin cobrar es un trabajo que consume horas del administrativo cada semana. Este proceso automatiza toda la cadena: recordatorio preventivo antes del vencimiento, seguimiento tras el vencimiento y escalado a la dirección si la situación persiste.",
    summary: {
      what_it_is: "Sistema de seguimiento automatizado de cobros con recordatorios escalonados y gestión de impagados.",
      for_who: ["Industriales con volumen de facturas difícil de gestionar manualmente", "Empresas con tensiones de tesorería por cobros retrasados", "Departamentos administrativos que dedican demasiado tiempo al seguimiento de cobros"],
      requirements: ["Sistema de facturación actualizado con fechas de vencimiento", "Email o teléfono del responsable de pagos del cliente"],
      output: "Reducción de días de cobro y del volumen de facturas vencidas sin gestión activa."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja",
      integrations: ["ERP / Software de facturación", "Email", "WhatsApp"]
    },
    how_it_works_steps: [
      { title: "Recordatorio preventivo", short: "Días antes del vencimiento.", detail: "El cliente recibe un recordatorio amable días antes del vencimiento con los datos de la factura." },
      { title: "Seguimiento post-vencimiento", short: "Escalado si no hay respuesta.", detail: "Si la factura vence sin cobrar, los recordatorios se escalan en tono y frecuencia hasta obtener respuesta." },
      { title: "Alerta a dirección", short: "Si supera el umbral crítico.", detail: "Cuando una factura supera los días de retraso definidos, alerta a dirección para la gestión directa." }
    ],
    benefits: [
      "Reducción del tiempo medio de cobro sin gestión manual adicional",
      "Cero facturas vencidas sin ningún seguimiento activo",
      "El administrativo invierte su tiempo en casos complejos, no en recordatorios rutinarios"
    ],
    pasos: [
      "El sistema monitoriza el estado de cada factura emitida",
      "Días antes del vencimiento, envía recordatorio al cliente",
      "Al vencer sin cobrar, inicia el proceso de seguimiento escalonado",
      "Si persiste sin pago, escala a un nivel de comunicación más directo",
      "Cuando supera el umbral crítico, alerta a dirección para gestión directa"
    ],
    personalizacion: "Define los umbrales de recordatorio, el tono de cada escalado, quién recibe las alertas en dirección y si integra con el departamento legal para casos extremos.",
    sectores: ["Industrial"],
    herramientas: ["ERP / Software de facturación", "Email", "WhatsApp Business", "Make/n8n"],
    dolores: [
      "Las facturas se cobran tarde porque nadie lleva el seguimiento de forma sistemática",
      "Tenemos facturas vencidas de hace meses que descubrimos por casualidad"
    ],
    integration_domains: ["ADMIN", "COMMS"],
    landing_slug: "industrial",
    bloque_negocio: "B5",
    modulo_codigo: "5.2"
  },
  {
    id: "IND-5.3",
    codigo: "5.3",
    slug: "industrial-cuadro-mando-financiero",
    categoria: "B5",
    categoriaNombre: "Administración y facturación",
    nombre: "Cuadro de mando financiero",
    tagline: "Consolidada facturación, cobros pendientes, coste de producción y margen por orden en un informe accesible en tiempo real, sin esperar al gestor.",
    recomendado: false,
    descripcionDetallada: "La dirección de una industrial no puede tomar decisiones operativas si los datos financieros del mes actual solo están disponibles cuando el gestor cierra los libros. Este cuadro de mando consolida en tiempo real los datos de facturación, cobros pendientes, costes de producción y margen por orden desde los sistemas operativos, y los presenta en un panel accesible para dirección sin necesidad de intervención del administrativo.",
    summary: {
      what_it_is: "Dashboard financiero en tiempo real con facturación, cobros, costes y márgenes consolidados.",
      for_who: ["Directores que toman decisiones sin datos actualizados", "Empresas donde el cierre financiero llega semanas tarde", "Industriales que no conocen su margen real por orden o por cliente"],
      requirements: ["Datos de facturación y cobros en el sistema", "Datos de costes de producción actualizados"],
      output: "Panel financiero accesible en tiempo real para dirección con los indicadores clave del negocio."
    },
    indicators: {
      time_estimate: "3-4 semanas",
      complexity: "Media",
      integrations: ["ERP", "Contabilidad", "Dashboard (Power BI / Looker / similar)"]
    },
    how_it_works_steps: [
      { title: "Conecta las fuentes de datos", short: "ERP, facturación, contabilidad.", detail: "Se integran los sistemas operativos para extraer datos de facturación, cobros y costes en tiempo real." },
      { title: "Consolida y calcula", short: "Márgenes, cobros pendientes, tendencias.", detail: "El sistema calcula automáticamente márgenes por orden, cobros pendientes y evolución frente al periodo anterior." },
      { title: "Panel accesible para dirección", short: "Desde cualquier dispositivo.", detail: "El dashboard está disponible en tiempo real para dirección desde cualquier dispositivo, sin intervención del administrativo." }
    ],
    benefits: [
      "Decisiones basadas en datos actuales, no en cierres del mes pasado",
      "Margen real por orden y por cliente visible en tiempo real",
      "Dirección autónoma para consultar sus KPIs sin depender de nadie"
    ],
    pasos: [
      "Se integran los sistemas de datos (ERP, facturación, contabilidad)",
      "El sistema extrae y consolida los datos en tiempo real",
      "Calcula márgenes, cobros pendientes y variaciones respecto al periodo anterior",
      "El panel se actualiza automáticamente y es accesible para dirección",
      "Se configuran alertas si algún indicador supera los umbrales definidos"
    ],
    personalizacion: "Define los indicadores clave para tu negocio, los periodos de comparación y los umbrales que disparan alertas para dirección.",
    sectores: ["Industrial"],
    herramientas: ["ERP", "Contabilidad", "Power BI / Looker / similar", "Make/n8n"],
    dolores: [
      "No sabemos nuestro margen real hasta que el gestor cierra los libros, semanas tarde",
      "Dirección toma decisiones con datos del mes pasado"
    ],
    integration_domains: ["ADMIN"],
    landing_slug: "industrial",
    bloque_negocio: "B5",
    modulo_codigo: "5.3"
  },
  {
    id: "IND-5.4",
    codigo: "5.4",
    slug: "industrial-informes-mensuales",
    categoria: "B5",
    categoriaNombre: "Administración y facturación",
    nombre: "Informes mensuales de actividad y rendimiento",
    tagline: "Genera automáticamente el informe mensual con métricas clave de producción, ventas, calidad y equipo, listo para presentar a dirección sin prepararlo desde cero.",
    recomendado: false,
    descripcionDetallada: "El informe mensual que se presenta en la reunión de dirección suele prepararse manualmente, extrayendo datos de varios sistemas y formateando el documento. Este proceso lo automatiza completamente: al cierre de cada mes, extrae los datos de producción, ventas, calidad y equipo de los sistemas operativos, genera el informe con el formato corporativo y lo envía a los destinatarios configurados listo para revisar y presentar.",
    summary: {
      what_it_is: "Generación automática del informe mensual de actividad y rendimiento con datos de todos los departamentos.",
      for_who: ["Empresas donde el informe mensual se prepara manualmente", "Directores que necesitan datos consolidados de varios departamentos", "Industriales con reuniones de dirección mensuales o trimestrales"],
      requirements: ["Fuentes de datos definidas por departamento", "Plantilla del informe en formato corporativo"],
      output: "Informe mensual generado automáticamente al cierre de mes y enviado a los destinatarios configurados."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["ERP", "Sistema de producción", "Generador de documentos", "Email"]
    },
    how_it_works_steps: [
      { title: "Se activa al cierre de mes", short: "Automáticamente en la fecha configurada.", detail: "Al cierre del periodo, el proceso arranca automáticamente sin que nadie tenga que iniciarlo." },
      { title: "Extrae y consolida los datos", short: "De producción, ventas, calidad, equipo.", detail: "Recoge los KPIs de cada área desde sus sistemas respectivos y los consolida en el informe." },
      { title: "Genera y envía el informe", short: "En formato corporativo por email.", detail: "El informe se genera en el formato definido y se envía a la lista de distribución configurada." }
    ],
    benefits: [
      "Horas de trabajo manual eliminadas en la preparación del informe mensual",
      "Datos siempre consistentes porque vienen del sistema, no de Excel manual",
      "Dirección recibe el informe el mismo día del cierre, no una semana después"
    ],
    pasos: [
      "Al cierre del mes, el proceso se activa automáticamente",
      "Extrae KPIs de producción: órdenes, plazos, eficiencia",
      "Extrae KPIs de ventas: facturación, nuevos pedidos, pipeline",
      "Extrae KPIs de calidad: no conformidades, reclamaciones, rechazos",
      "Genera el informe en formato corporativo y lo envía a la lista de distribución"
    ],
    personalizacion: "Define los KPIs de cada área, el formato del informe, la fecha de generación y la lista de distribución.",
    sectores: ["Industrial"],
    herramientas: ["ERP", "Sistema de producción", "Generador de documentos", "Email"],
    dolores: [
      "El informe mensual lo prepara alguien a mano y siempre llega tarde a la reunión",
      "Los datos de distintos departamentos no cuadran porque cada uno tira de su Excel"
    ],
    integration_domains: ["ADMIN", "DOCS"],
    landing_slug: "industrial",
    bloque_negocio: "B5",
    modulo_codigo: "5.4"
  },

  // ── BLOQUE B6 · Equipo y planta ──────────────────────────────────────────
  {
    id: "IND-6.1",
    codigo: "6.1",
    slug: "industrial-onboarding-trabajador",
    categoria: "B6",
    categoriaNombre: "Equipo y planta",
    nombre: "Onboarding de nuevo trabajador",
    tagline: "Cuando se incorpora un operario, el proceso organiza automáticamente la documentación, los accesos, el equipo de protección y la formación obligatoria del primer día.",
    recomendado: false,
    descripcionDetallada: "En una industrial, la incorporación de un nuevo operario implica coordinación entre RRHH, el responsable de planta, el responsable de seguridad y el responsable de sistemas: contrato, alta en nómina, ficha de formación PRL, entrega de EPIs, acceso a máquinas y sistemas. Si ese proceso no está automatizado, la mitad de las veces el nuevo llega y alguien está improvisando. Este proceso coordina automáticamente cada paso del onboarding desde el momento de la contratación.",
    summary: {
      what_it_is: "Proceso automatizado de incorporación de nuevo trabajador que coordina documentación, accesos, EPIs y formación.",
      for_who: ["Industriales con incorporaciones frecuentes de personal", "Empresas donde el onboarding es caótico e improvisto", "Fábricas con requisitos de formación PRL obligatoria en el primer día"],
      requirements: ["Datos del nuevo trabajador al confirmar la contratación", "Listado de accesos, EPIs y formaciones por puesto"],
      output: "Nuevo trabajador operativo desde el primer día con toda la documentación, accesos y formaciones en orden."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["RRHH / Nómina", "Email / WhatsApp", "Gestión de formaciones", "Control de accesos"]
    },
    how_it_works_steps: [
      { title: "Se confirma la contratación", short: "Arranca el flujo de onboarding.", detail: "Al registrar la nueva contratación, el proceso lanza automáticamente todos los pasos coordinados." },
      { title: "Coordina acciones paralelas", short: "Documentación, EPIs, accesos, formación.", detail: "RRHH recibe la checklist de documentación, planta recibe la lista de EPIs a preparar, sistemas activa los accesos." },
      { title: "El primer día está listo", short: "Sin que nadie improvise.", detail: "El nuevo llega y todo está preparado: su puesto, su equipo de protección, sus accesos y su agenda de formación del día." }
    ],
    benefits: [
      "El primer día del nuevo trabajador funciona sin improvisación ni caos",
      "Cero formaciones PRL olvidadas que generan incumplimiento normativo",
      "El responsable de planta no pierde su tiempo gestionando el onboarding"
    ],
    pasos: [
      "Se confirma la contratación en el sistema de RRHH",
      "El proceso lanza la checklist de documentación a RRHH",
      "Se preparan los EPIs y accesos necesarios para el puesto",
      "Se programan las formaciones obligatorias del primer día",
      "El nuevo trabajador llega con todo preparado y operativo"
    ],
    personalizacion: "Define la lista de acciones por tipo de puesto, los responsables de cada acción y el canal de comunicación para cada parte.",
    sectores: ["Industrial"],
    herramientas: ["RRHH / Nómina", "Email / WhatsApp", "Make/n8n"],
    dolores: [
      "Cuando entra alguien nuevo siempre hay algo sin preparar: el acceso, los EPIs, la formación",
      "El responsable de planta pierde media jornada el primer día del nuevo"
    ],
    integration_domains: ["ADMIN", "COMMS"],
    landing_slug: "industrial",
    bloque_negocio: "B6",
    modulo_codigo: "6.1"
  },
  {
    id: "IND-6.2",
    codigo: "6.2",
    slug: "industrial-control-presencia-turnos",
    categoria: "B6",
    categoriaNombre: "Equipo y planta",
    nombre: "Control de presencia y turnos",
    tagline: "Cada operario recibe su turno individual por WhatsApp con confirmación. Los cambios se gestionan automáticamente y la ausencia no justificada alerta al responsable.",
    recomendado: false,
    descripcionDetallada: "Los grupos de WhatsApp de turnos en una fábrica son ingobernables cuando el equipo supera los 10-15 operarios. Los cambios de turno generan confusión, las ausencias de última hora cogen a producción sin cobertura y el cuaderno de presencia en papel no permite análisis ni cruce con nómina. Este proceso digitaliza la comunicación de turnos, el registro de presencia y la gestión de ausencias con notificaciones automáticas al responsable.",
    summary: {
      what_it_is: "Sistema de comunicación de turnos individuales, registro de presencia y gestión de ausencias para equipos de producción.",
      for_who: ["Fábricas con equipos de 10+ operarios", "Industriales con grupos de WhatsApp de turnos caóticos", "Empresas donde las ausencias cogen a producción sin cobertura"],
      requirements: ["Cuadrante de turnos (Excel, software de RRHH)", "WhatsApp de cada operario", "Responsable de planta como punto de escalado"],
      output: "Comunicación de turnos sin grupos caóticos, registro de presencia digital y alertas de ausencia a tiempo."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["Software de RRHH / Excel", "WhatsApp Business API", "Make/n8n"]
    },
    how_it_works_steps: [
      { title: "Envía turnos individuales", short: "Cada operario recibe el suyo.", detail: "Al publicarse el cuadrante, cada operario recibe su turno individual por WhatsApp con confirmación de lectura." },
      { title: "Gestiona cambios y ausencias", short: "Solo a quien afecta.", detail: "Los cambios se notifican solo a los afectados. Las ausencias detectadas alertan al responsable con tiempo para buscar cobertura." },
      { title: "Sincroniza con nómina", short: "Registro digital de presencia.", detail: "El registro de entradas y salidas se sincroniza con el sistema de nómina, sin tecleo manual adicional." }
    ],
    benefits: [
      "Fin del grupo de WhatsApp ingobernable de turnos",
      "El responsable sabe la ausencia con tiempo suficiente para buscar cobertura",
      "Registro de presencia digital sincronizado con nómina"
    ],
    pasos: [
      "Se publica el cuadrante de turnos en el sistema",
      "Cada operario recibe su turno individual por WhatsApp",
      "Se registra la confirmación de lectura de cada turno",
      "Los cambios y ausencias generan notificaciones solo a los afectados",
      "El registro de presencia se sincroniza automáticamente con nómina"
    ],
    personalizacion: "Define el día y hora de envío del cuadrante, los criterios de sustitución por ausencia y el canal de escalado al responsable.",
    sectores: ["Industrial"],
    herramientas: ["WhatsApp Business API", "Software de RRHH / Excel", "Make/n8n"],
    dolores: [
      "El grupo de WhatsApp de turnos es un caos que nadie controla",
      "Las ausencias de última hora nos pillan sin cobertura en planta"
    ],
    integration_domains: ["COMMS", "ADMIN"],
    landing_slug: "industrial",
    bloque_negocio: "B6",
    modulo_codigo: "6.2"
  },
  {
    id: "IND-6.3",
    codigo: "6.3",
    slug: "industrial-documentacion-laboral",
    categoria: "B6",
    categoriaNombre: "Equipo y planta",
    nombre: "Gestión de documentación laboral",
    tagline: "Centraliza contratos, certificados, permisos, formaciones PRL y revisiones médicas de cada trabajador, con alertas antes de que venza cualquier documento.",
    recomendado: false,
    descripcionDetallada: "En una industrial con obligaciones de PRL, los documentos laborales que caducan sin renovación son un riesgo legal directo. Una revisión médica vencida, un carné de carretillero caducado o una formación no actualizada pueden suponer sanciones significativas en una inspección de trabajo. Este proceso centraliza todos los documentos de cada trabajador, calcula automáticamente las fechas de vencimiento y lanza alertas con la antelación suficiente para gestionar la renovación sin urgencias.",
    summary: {
      what_it_is: "Gestión centralizada de documentación laboral con alertas automáticas de vencimiento por trabajador.",
      for_who: ["Industriales con obligaciones de PRL y formación periódica", "Empresas con inspecciones de trabajo frecuentes", "RRHH que lleva el control de documentos en Excel o papel"],
      requirements: ["Listado de documentos requeridos por puesto de trabajo", "Documentos actuales de cada trabajador digitalizados"],
      output: "Expediente digital de cada trabajador actualizado con alertas de vencimiento antes de que sea un problema."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Baja",
      integrations: ["RRHH / Nómina", "Gestión documental", "Email / WhatsApp"]
    },
    how_it_works_steps: [
      { title: "Centraliza los documentos", short: "Por trabajador y tipo de documento.", detail: "Se crea el expediente digital de cada trabajador con todos los documentos laborales relevantes." },
      { title: "Calcula fechas de vencimiento", short: "Por tipo de documento y normativa.", detail: "El sistema registra la fecha de cada documento y calcula cuándo caduca según la normativa o las condiciones del documento." },
      { title: "Alerta antes del vencimiento", short: "Con tiempo suficiente para renovar.", detail: "RRHH recibe la alerta con la antelación configurada para gestionar la renovación sin urgencias." }
    ],
    benefits: [
      "Cero documentos laborales vencidos que generen riesgo legal",
      "RRHH no lleva el control en Excel — el sistema lo hace automáticamente",
      "Preparación de inspecciones de trabajo en minutos, no en días"
    ],
    pasos: [
      "Se crean los expedientes digitales de cada trabajador",
      "Se registran todos los documentos con sus fechas de vencimiento",
      "El sistema calcula las fechas de alerta según el tipo de documento",
      "RRHH recibe la alerta antes del vencimiento para gestionar la renovación",
      "El documento renovado sustituye al anterior en el expediente"
    ],
    personalizacion: "Define los tipos de documentos a controlar, las antelaciones de alerta por tipo y los destinatarios de cada alerta.",
    sectores: ["Industrial"],
    herramientas: ["RRHH / Nómina", "Gestión documental", "Email / WhatsApp", "Make/n8n"],
    dolores: [
      "Hemos tenido sanciones por formaciones o revisiones médicas vencidas",
      "El control de documentos laborales lo llevamos en un Excel que siempre está desactualizado"
    ],
    integration_domains: ["ADMIN", "DOCS"],
    landing_slug: "industrial",
    bloque_negocio: "B6",
    modulo_codigo: "6.3"
  },
  {
    id: "IND-6.4",
    codigo: "6.4",
    slug: "industrial-mantenimiento-preventivo",
    categoria: "B6",
    categoriaNombre: "Equipo y planta",
    nombre: "Mantenimiento preventivo de maquinaria",
    tagline: "Planifica y registra las revisiones de cada máquina, avisa antes de que caduque un mantenimiento y deja trazabilidad de cada intervención para auditorías.",
    recomendado: true,
    descripcionDetallada: "El mantenimiento que 'está pendiente de programar' se convierte invariablemente en una avería en el peor momento. En una línea de producción, una parada no planificada tiene un coste por hora que supera fácilmente al coste del mantenimiento preventivo del año entero. Este proceso planifica automáticamente las revisiones de cada máquina según su plan de mantenimiento, lanza alertas antes de cada vencimiento y registra cada intervención con el responsable, el tiempo invertido y el resultado.",
    summary: {
      what_it_is: "Sistema de planificación y seguimiento de mantenimiento preventivo de maquinaria con alertas y trazabilidad de intervenciones.",
      for_who: ["Industriales con paradas no planificadas frecuentes", "Empresas que gestionan el mantenimiento de memoria o en papel", "Fábricas con requisitos de trazabilidad de mantenimiento por certificación o cliente"],
      requirements: ["Inventario de máquinas con su plan de mantenimiento", "Responsable de mantenimiento identificado"],
      output: "Plan de mantenimiento preventivo ejecutado con alertas puntuales y trazabilidad completa de intervenciones."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Baja",
      integrations: ["Gestión de mantenimiento (CMMS)", "Email / WhatsApp", "Make/n8n"]
    },
    how_it_works_steps: [
      { title: "Define el plan por máquina", short: "Revisiones, frecuencia, responsable.", detail: "Se configura el plan de mantenimiento de cada máquina: tipo de revisión, frecuencia y responsable." },
      { title: "Alerta antes del vencimiento", short: "Con la antelación correcta.", detail: "El sistema alerta al responsable con la antelación suficiente para planificar la intervención sin urgencias." },
      { title: "Registra la intervención", short: "Responsable, tiempo, resultado.", detail: "Al completar el mantenimiento, se registra quién lo hizo, cuánto tardó y el resultado, con la próxima fecha calculada." }
    ],
    benefits: [
      "Paradas no planificadas reducidas significativamente",
      "Cada intervención registrada para auditorías internas, de cliente o de certificación",
      "El responsable de mantenimiento actúa de forma planificada, no reactiva"
    ],
    pasos: [
      "Se define el plan de mantenimiento por máquina con frecuencias y responsables",
      "El sistema calcula las fechas de vencimiento de cada revisión",
      "Alerta al responsable con la antelación configurada antes de cada revisión",
      "El responsable ejecuta el mantenimiento y registra la intervención",
      "El sistema calcula automáticamente la próxima fecha de revisión"
    ],
    personalizacion: "Define los tipos de mantenimiento por máquina, las frecuencias, los responsables y los umbrales de alerta para cada tipo de revisión.",
    sectores: ["Industrial"],
    herramientas: ["CMMS / Gestión de mantenimiento", "Email / WhatsApp", "Make/n8n"],
    dolores: [
      "Las averías siempre nos pillan en el peor momento porque el mantenimiento no está al día",
      "El mantenimiento lo llevamos de memoria y no tenemos trazabilidad de intervenciones"
    ],
    integration_domains: ["OTHER", "COMMS"],
    landing_slug: "industrial",
    bloque_negocio: "B6",
    modulo_codigo: "6.4"
  }
];

export const categories = [
  { id: "Facturación y Finanzas", name: "Facturación y Finanzas", emoji: "💳" },
  { id: "Horarios y Proyectos", name: "Horarios y Proyectos", emoji: "📅" },
  { id: "Gestión Interna", name: "Gestión Interna", emoji: "🏢" },
  { id: "Atención y Ventas", name: "Atención y Ventas", emoji: "💬" },
  { id: "Auditoría tecnológica", name: "Auditoría tecnológica", emoji: "🔍" }
];

