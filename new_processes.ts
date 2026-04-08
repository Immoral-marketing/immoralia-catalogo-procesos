export const constructorasProcesses = [
  {
    id: "CN1",
    codigo: "CN1",
    slug: "calificacion-inteligente-leads",
    categoria: "Ventas y CRM",
    categoriaNombre: "Ventas y CRM",
    nombre: "Calificación inteligente de leads",
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
      what_it_is: "Un motor inteligente que analiza a cada interesado que entra y lo clasifica según su probabilidad de cierre.",
      for_who: ["Directores comerciales", "Equipos de ventas en obra nueva", "Agentes inmobiliarios"],
      requirements: ["CRM", "Herramienta de automatización"],
      output: "Lead puntuado y ordenado en tu CRM."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Alta",
      integrations: ["CRM", "IA"]
    },
    how_it_works_steps: [
      { title: "Captura y análisis", short: "Se recibe el lead y se analiza su información.", detail: "Extrae datos de formularios, chats y comportamiento web." },
      { title: "Evaluación de IA", short: "Calcula la probabilidad de compra real.", detail: "Pondera interés, zona, presupuesto y perfil inversor." },
      { title: "Asignación priorizada", short: "Ordena el CRM para el agente.", detail: "Coloca los leads más calientes al inicio de la lista de tareas." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Canal de alerta para leads Hot", options: ["WhatsApp", "Telegram", "Email", "Ninguno"] }
      ],
      free_text_placeholder: "¿Cuáles son las 3 variables más importantes para calificar un cliente en tu proyecto?"
    },
    faqs: [
      { q: "¿Se conecta directo con mi CRM actual?", a: "Sí, funciona sobre los CRMs más habituales usando sus APIs." },
      { q: "¿Qué pasa con los leads de baja puntuación?", a: "Se envían a una secuencia de maduración automática (nurturing) sin consumir tiempo del agente." }
    ],
    pasos: [
      "Se recibe el lead y se analiza su información.",
      "Calcula la probabilidad de compra real indicadora.",
      "Asigna y ordena según el interés para el agente de ventas."
    ],
    personalizacion: "Ajusta las variables determinantes (presupuesto, urgencia) que definirán quién es un 'lead caliente'.",
    related_processes: ["dashboard-comercial-tiempo-real", "seguimiento-multicanal-inteligente"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["CRM", "IA"],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion"
  },
  {
    id: "CN2",
    codigo: "CN2",
    slug: "analisis-sentimiento-riesgo",
    categoria: "Ventas y CRM",
    categoriaNombre: "Ventas y CRM",
    nombre: "Análisis de sentimiento y detección de riesgo",
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
      what_it_is: "Auditor automático de conversaciones que lee entre líneas y alerta cuando una venta está a punto de caerse.",
      for_who: ["Gerentes de ventas", "Coordinadoras comerciales"],
      requirements: ["CRM", "Canal de comunicación integrado (Email/WhatsApp)"],
      output: "Alertas de riesgo y recomendaciones claras en tu CRM."
    },
    indicators: {
      time_estimate: "3-4 semanas",
      complexity: "Alta",
      integrations: ["CRM", "Comunicaciones", "IA"]
    },
    how_it_works_steps: [
      { title: "Monitoreo constante", short: "Supervisa los mensajes que envían los clientes.", detail: "Conectado al email y WhatsApp oficial de la promotora." },
      { title: "Análisis de contexto", short: "Entiende el tono y detecta fricciones.", detail: "Busca palabras clave de duda sobre pagos, plazos y competencia." },
      { title: "Alerta predictiva", short: "Avisa al comercial si hay peligro de fuga.", detail: "Dispara un mensaje con el punto exacto de fricción y una sugerencia para calmarlo." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Canal de alerta", options: ["Notificación CRM", "Email a gerencia", "Slack"] }
      ],
      free_text_placeholder: "¿Cuáles son las mayores objeciones que sueles recibir y quieres detectar rápido?"
    },
    faqs: [
      { q: "¿Es legal leer los WhatsApps?", a: "Se implementa siempre respetando la política de privacidad que el cliente aceptó al contactar vía canales oficiales." },
      { q: "¿Avisa de lo bueno también?", a: "Sí, genera un reporte de 'entusiasmo' para saber cuándo empujar el cierre de venta de inmediato." }
    ],
    pasos: [
      "Supervisa los mensajes que envían los clientes.",
      "Entiende el tono y detecta fricciones.",
      "Avisa al comercial si hay peligro de fuga."
    ],
    personalizacion: "Define de qué canales de comunicación quieres extraer el sentimiento (email, WhatsApp, transcripciones).",
    related_processes: ["resumen-llamadas-crm", "calificacion-inteligente-leads"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["CRM", "IA", "WhatsApp"],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion"
  },
  {
    id: "CN3",
    codigo: "CN3",
    slug: "dashboard-comercial-tiempo-real",
    categoria: "Análisis y Reporte",
    categoriaNombre: "Análisis y Reporte",
    nombre: "Dashboard comercial en tiempo real",
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
      what_it_is: "Pantalla de control automatizada que cruza datos desde visitas hasta reservas, mostrando métricas críticas.",
      for_who: ["Dirección comercial", "Director de Proyecto", "CEOs"],
      requirements: ["CRM", "Herramienta de Business Intelligence (BI)"],
      output: "Dashboard en tiempo real con datos de conversión."
    },
    indicators: {
      time_estimate: "2 semanas",
      complexity: "Media",
      integrations: ["CRM", "BI"]
    },
    how_it_works_steps: [
      { title: "Extracción continua", short: "Saca datos diarios del CRM.", detail: "Captura automáticamente el cambio de estados en el pipeline cada mañana." },
      { title: "Consolidación de KPIS", short: "Calcula los porcentajes críticos.", detail: "Pondera visitas a reservas, tiempos medios y cuotas por agente." },
      { title: "Visualización viva", short: "Te muestra los gráficos actualizados.", detail: "El panel te presenta los gráficos siempre listos, ideal para la reunión de los lunes." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Frecuencia de envío automático por mail", options: ["Todos los viernes", "Lunes por la mañana", "Sólo consultar online"] }
      ],
      free_text_placeholder: "¿Hay alguna métrica fuera de lo común que necesites que pintemos en pantalla?"
    },
    faqs: [
      { q: "¿Reemplaza los informes del CRM?", a: "Los potencia. Los CRMs son limitados en visualización; nosotros cruzamos hasta con plataformas de gestión de reservas externas." },
      { q: "¿Podré ver qué fase está frenando ventas?", a: "Totalmente, verás el embudo entero y su porcentaje de caída fase a fase." }
    ],
    pasos: [
      "Saca datos diarios del CRM.",
      "Calcula los porcentajes críticos de negocio.",
      "Te muestra gráficos e indicadores actualizados continuamente."
    ],
    personalizacion: "Pídenos diseñar el flujo de tu embudo específico para que el gráfico encaje al 100% con tu realidad comercial.",
    related_processes: ["calificacion-inteligente-leads", "identificacion-reactivacion-unidades"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["CRM", "BI"],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion"
  },
  {
    id: "CN4",
    codigo: "CN4",
    slug: "asistente-digital-precualificacion",
    categoria: "Atención y Clientes",
    categoriaNombre: "Atención y Clientes",
    nombre: "Asistente digital del proyecto (pre-cualificación)",
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
      what_it_is: "Un experto en IA alojado en tu landing page o WhatsApp, cargado con el argumentario de tu promoción.",
      for_who: ["Visitantes de perfil frío", "Marketing inmobiliario"],
      requirements: ["Página Web / WhatsApp", "Base de conocimiento del proyecto"],
      output: "Conversación de alto valor y ficha de lead cualificado al CRM."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Alta",
      integrations: ["Web", "CRM", "IA"]
    },
    how_it_works_steps: [
      { title: "Bienvenida interactiva", short: "Aborda al usuario con preguntas clave.", detail: "Pregunta sutilmente: ¿Buscas comprar para vivir o invertir?" },
      { title: "Educación de proyecto", short: "Resuelve las preguntas comunes.", detail: "Enseña el proyecto y aclara tipologías de piso o chalet." },
      { title: "Pase a comercial", short: "Pide el contacto sólo cuando hay interés maduro.", detail: "Cierra enviando al CRM todo el historial para que el comercial remate." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Tono de la IA", options: ["Elegante y formal", "Cercano y entusiasta", "Eminentemente técnico (para inversores)"] }
      ],
      free_text_placeholder: "¿Cuál es la Memoria de Calidades o dossier principal del proyecto?"
    },
    faqs: [
      { q: "¿La gente hablará con un robot?", a: "Este asistente de IA es tan orgánico y fluido que genera alto engagement por su rapidez y calidad." },
      { q: "¿Sabe redirigir a un humano?", a: "Por supuesto. Si el cliente tiene urgencia alta, desvía a WhatsApp u ofrece agendar reunión." }
    ],
    pasos: [
      "Aborda al usuario con preguntas de situación.",
      "Muestra y defiende el proyecto como tu mejor comercial.",
      "Traspasa un lead cualificado a tu equipo y registra la charla en CRM."
    ],
    personalizacion: "Elige la base de conocimiento de la obra: le daremos a leer todos tus PDFs para que aprenda el proyecto perfecto.",
    related_processes: ["calificacion-inteligente-leads", "seguimiento-multicanal-inteligente"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["Web", "CRM", "WhatsApp"],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion"
  },
  {
    id: "CN5",
    codigo: "CN5",
    slug: "motor-presentacion-perfil",
    categoria: "Ventas y CRM",
    categoriaNombre: "Ventas y CRM",
    nombre: "Motor de presentación personalizada",
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
      what_it_is: "Generador de contenidos automáticos que ensambla la información más atractiva del proyecto según lo que el cliente quiere oír.",
      for_who: ["Comerciales de promociones", "Departamentos de Marketing"],
      requirements: ["CRM", "Generador de PDFs dinámicos"],
      output: "Dossier o Email hiper-personalizado directo para enviar."
    },
    indicators: {
      time_estimate: "3 semanas",
      complexity: "Alta",
      integrations: ["CRM", "PDF Automation"]
    },
    how_it_works_steps: [
      { title: "Detección de etiqueta", short: "Saca el perfil (Inversor/Familia) del CRM.", detail: "Revisamos el tag indicado por el asistente web o el comercial." },
      { title: "Ensamblaje", short: "Combina los bloques ganadores.", detail: "Une las fotos del parque (familia) o del ROI y plusvalía de la zona (inversión)." },
      { title: "Generación de salida", short: "Entrega un documento o email brillante.", detail: "Crea el contacto con el cliente aportando el ángulo comercial imbatible." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Salida principal", options: ["PDF Dinámico", "Cadena de Emails", "Microsite personalizado"] }
      ],
      free_text_placeholder: "¿Cuántos perfiles distintos de comprador tienes ya detectados?"
    },
    faqs: [
      { q: "¿Debemos grabar varios vídeos y PDFs?", a: "Sí, creamos bloques. Luego el sistema los combina todos solos como un rompecabezas." },
      { q: "¿Envia el PDF sin que yo lo vea?", a: "Puede hacerlo o dejarlo en borrador en tu bandeja de salida para que lo remates." }
    ],
    pasos: [
      "Identifica el perfil y necesidad desde tu CRM.",
      "Arma el puzzle automático de textos, imágenes y argumentos.",
      "Envía la documentación más alineada a convertir esa venta."
    ],
    personalizacion: "Define de antemano el mix de beneficios que quieres atar a cada perfil (Rentabilidad vs Calidad de vida).",
    related_processes: ["generador-dossier-unidad", "asistente-digital-precualificacion"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["CRM", "PDF Factory"],
    integration_domains: ["CRM", "DOCS"],
    landing_slug: "construccion"
  },
  {
    id: "CN6",
    codigo: "CN6",
    slug: "generador-dossier-unidad",
    categoria: "Ventas y CRM",
    categoriaNombre: "Ventas y CRM",
    nombre: "Generador automático de dossier de unidad",
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
      what_it_is: "Creador de fichas comerciales en base de datos. Un clic, un PDF perfecto.",
      for_who: ["Comerciales a pie de obra", "Backoffice comercial"],
      requirements: ["CRM o ERP Inmobiliario", "Plantilla base"],
      output: "Ficha comercial PDF única para esa vivienda enviada al lead."
    },
    indicators: {
      time_estimate: "2 semanas",
      complexity: "Media",
      integrations: ["CRM", "DOCS"]
    },
    how_it_works_steps: [
      { title: "Identificador de unidad", short: "Eliges el bajo B del bloque 3.", detail: "Desde tu CRM o app de ventas, marcas la vivienda de interés." },
      { title: "Autocompletado", short: "Saca planos vivos y precio vigente.", detail: "Conecta con tu base de precios para que no haya riesgo de error comercial." },
      { title: "Envío en un toque", short: "Se fusiona en PDF y se envía.", detail: "El cliente lo recibe impecable, sellado por la promotora." }
    ],
    customization: {
      options_blocks: [
        { type: "radio", label: "Marca de agua", options: ["Incluir nombre cliente en PDF", "No incluir"] }
      ],
      free_text_placeholder: "¿Qué datos técnicos deben ir siempre obligatorios (m2 útiles, terraza, orientación)?"
    },
    faqs: [
      { q: "¿Reemplaza los folletos?", a: "Es el sustituto digital, hiperpreciso y siempre actualizado en precio." },
      { q: "¿Puede el comercial modificar el precio?", a: "Solo si tiene permisos en el CRM, el generador coge la fuente de verdad del ERP." }
    ],
    pasos: [
      "Eliges la unidad exacta desde tu app o CRM.",
      "Conecta con bases de precios y saca planos y datos vivos.",
      "Se crea un PDF oficial y se envía en pocos segundos."
    ],
    personalizacion: "Incluye el nombre de tu cliente en cada página para darle exclusividad (y proteger tus planos).",
    related_processes: ["motor-presentacion-perfil", "resumen-llamadas-crm"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["CRM", "DOCS"],
    integration_domains: ["CRM", "DOCS"],
    landing_slug: "construccion"
  },
  {
    id: "CN7",
    codigo: "CN7",
    slug: "resumen-llamadas-crm",
    categoria: "Ventas y CRM",
    categoriaNombre: "Ventas y CRM",
    nombre: "Resumen automático de llamadas comerciales y actualización de CRM",
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
      what_it_is: "Asistente secreto en cada llamada telefónica que capta la información clave y la sube al sistema de gestión de clientes.",
      for_who: ["Directores comerciales", "Fuerza de ventas"],
      requirements: ["Telefonía VOIP", "CRM", "IA"],
      output: "Ficha del CRM con notas completas, presupuesto y objeciones rellenas."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Alta",
      integrations: ["CRM", "Telefonía", "IA"]
    },
    how_it_works_steps: [
      { title: "Escucha pasiva", short: "Graba mediante tu centralita.", detail: "Se conecta a llamadas salientes y entrantes del número oficial (con aviso legal)." },
      { title: "Extracción semántica", short: "Anota fechas, precios y pegas.", detail: "Distingue cuándo el cliente dice 'me parece caro' o 'necesitamos piscina'." },
      { title: "Volcado mágico", short: "Tu CRM se rellena solo.", detail: "Aparecen las notas estructuradas en el campo del interesado al colgar." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Formato de resumen", options: ["Corto y directo", "Transcripción completa", "Campos estructurados en CRM (ej: Presupuesto)"] }
      ],
      free_text_placeholder: "¿Cuáles son las 4 cosas obligatorias que siempre hay que preguntarle al cliente?"
    },
    faqs: [
      { q: "¿Funciona en español y en calle?", a: "Entiende argot, modismos e incluso varios idiomas perfectamente." },
      { q: "¿Es legal?", a: "Claro, como cuando escuchas 'esta llamada puede ser grabada para mejorar la calidad', se graba y procesa acorde a RGPD." }
    ],
    pasos: [
      "Graba mediante tu centralita o VOIP conectada.",
      "Anota fechas, precios, pegas y puntos clave hablados.",
      "Vuelca las notas estructuradas en el CRM nada más colgar."
    ],
    personalizacion: "Define qué campos del CRM se rellenarán automáticamente con lo interpretado en las notas (Ej. Campo Presupuesto).",
    related_processes: ["analisis-sentimiento-riesgo", "calificacion-inteligente-leads"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["CRM", "IA", "Telefonía"],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion"
  },
  {
    id: "CN8",
    codigo: "CN8",
    slug: "asistente-interno-comerciales",
    categoria: "Internos Agencias",
    categoriaNombre: "Internos Agencias",
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
      what_it_is: "Tu base de datos convertida en un chat de WhatsApp/Slack interno, listo para salvar cualquier pregunta difícil de un cliente al instante.",
      for_who: ["Equipo de ventas", "Apertura de pisos piloto", "Coordinadoras comerciales"],
      requirements: ["Chat Interno", "Documentación del proyecto completa"],
      output: "Respuesta al instante y precisa en lenguaje natural."
    },
    indicators: {
      time_estimate: "2 semanas",
      complexity: "Media",
      integrations: ["Chat", "Knowledge Base", "IA"]
    },
    how_it_works_steps: [
      { title: "Entran los manuales", short: "Leemos planos, memorias y argumentarios.", detail: "Cargamos al bot con todos los FAQs, ventajas competitivas y excusas de la competencia." },
      { title: "El agente consulta", short: "Pregunta desde su propio Slack o WhatsApp.", detail: "El comercial frente al cliente duda: ¿Qué espesor lleva la carpintería exterior?" },
      { title: "Respuesta experta", short: "El bot da la métrica perfecta.", detail: "Contesta y le da el manual de donde sacó la información." }
    ],
    customization: {
      options_blocks: [
        { type: "radio", label: "Canal interno preferido", options: ["WhatsApp de equipo", "Microsoft Teams", "Slack", "Intranet web"] }
      ],
      free_text_placeholder: "¿Tienen un manual ya hecho de 'Técnicas de rebote a objeciones'?"
    },
    faqs: [
      { q: "¿Y si la promotora cambia la memoria de calidades?", a: "Subes el nuevo PDF y el asistente borra la información antigua de inmediato." }
    ],
    pasos: [
      "Cargamos al bot con la documentación, técnica o comercial de la obra.",
      "El agente consulta una objeción por chat rápido (ej. '¿Qué digo si les parece caro?').",
      "El bot contesta al momento y dándole la mejor estrategia argumental."
    ],
    personalizacion: "Cárgalo no sólo de datos aburridos, sino de 'Técnicas de rebote a objeciones' para empoderar de verdad al agente.",
    related_processes: ["generador-dossier-unidad", "resumen-llamadas-crm"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["Chat", "Knowledge Base", "IA"],
    integration_domains: ["OTHER"],
    landing_slug: "construccion"
  },
  {
    id: "CN9",
    codigo: "CN9",
    slug: "seguimiento-multicanal-inteligente",
    categoria: "Ventas y CRM",
    categoriaNombre: "Ventas y CRM",
    nombre: "Seguimiento multicanal inteligente durante ciclo largo",
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
      what_it_is: "Nutrición pausada para ventas largas. Manda el dron, avisa de la fundación y recuerda beneficios, espaciado con inteligencia.",
      for_who: ["Marketing Inmobiliario", "Equipos de ventas en ciclo largo"],
      requirements: ["CRM", "Email Marketing / WhatsApp API"],
      output: "Campañas distribuidas que envían el mensaje idóneo según la semana en que entraron."
    },
    indicators: {
      time_estimate: "2-3 অসহায়emanas",
      complexity: "Media",
      integrations: ["CRM", "Mailing / WhatsApp"]
    },
    how_it_works_steps: [
      { title: "Arquitectura temporal", short: "Diseña el flujo del año de comercialización.", detail: "Fijamos puntos de contacto en los meses críticos donde decae el recuerdo." },
      { title: "Disparos cruzados", short: "Combina email visual con WhatsApp rápido.", detail: "Un mes un email bonito del piso piloto, otro mes un WhatsApp directo del agente sobre un descuento." },
      { title: "Alerta de reactivación", short: "Avisa al agente si muerden el anzuelo.", detail: "Si clican el vídeo o contestan algo, entra a la bandeja del comercial de nuevo." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Mix de Canales", options: ["80% Email / 20% WhatsApp", "50% Email / 50% SMS/WhatsApp"] }
      ],
      free_text_placeholder: "¿Cuáles son los 3 hitos de obra que más alucinan a los compradores?"
    },
    faqs: [
      { q: "¿No será muy pesado (spam)?", a: "No, la IA segmenta y espacia los mensajes según la reacción y tipo de lead; puro contexto." }
    ],
    pasos: [
      "Diseña la secuencia ligada a fechas clave de avance de proyecto y marketing.",
      "Cruzan campañas multicanal con fotos o vídeos de dron.",
      "Notifica al agente comercial la reactivación si el lead responde a algo."
    ],
    personalizacion: "Define cómo calibrar los mensajes, más agresivos o más sutiles según la etapa y el termómetro comercial.",
    related_processes: ["identificacion-reactivacion-unidades", "calificacion-inteligente-leads"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["CRM", "Mailing / WhatsApp"],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion"
  },
  {
    id: "CN10",
    codigo: "CN10",
    slug: "automatizacion-agendado-visitas",
    categoria: "Atención y Clientes",
    categoriaNombre: "Atención y Clientes",
    nombre: "Automatización de agendado y gestión de visitas",
    tagline: "Acaba con el cruce de mails para quedar en el piso piloto.",
    one_liner: "Calendario magnético que cierra citas directas y asegura que acudan.",
    badges: ["Popular"],
    benefits: [
      "Caída drástica de los 'No-Shows' (las ausencias en citas de venta)",
      "Reducción a cero horas semanales dedicadas a reagendar visitas canceladas",
      "El cliente elige a solas bajo su demanda al momento de máximo interés"
    ],
    recomendado: true,
    descripcionDetallada: "Flujo automatizado completo: lead calificado → enlace de agenda → confirmación → recordatorios automáticos → check-in → encuesta post-visita. Reduce no-shows y optimiza el tiempo del agente.",
    summary: {
      what_it_is: "Asistente satélite enlazado a los calendarios de los comerciales, facilitando la reserva de horas y enviando recordatorios al cliente para asegurar su presencia.",
      for_who: ["Visitantes de piso piloto", "Coordinadores de venta", "Todos los comerciales"],
      requirements: ["Calendario tipo Calendly", "CRM", "WhatsApp SMS"],
      output: "Cita bloqueada firme con doble alerta antes de llegar la fecha."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Baja",
      integrations: ["Agenda", "CRM", "Herramienta de automatización"]
    },
    how_it_works_steps: [
      { title: "Reserva libre", short: "Botón para agenda en web o correo directo.", detail: "Muestra huecos en vivo con la disponibilidad rotativa y real." },
      { title: "Bloqueo cruzado", short: "Inscribe en CRM y en agenda del equipo.", detail: "Asigna vendedor y bloquea una hora de su Google/Outlook Calendar." },
      { title: "Garantía de asistencia", short: "Doble recordatorio por WhatsApp con el pin GPS.", detail: "La víspera o misma mañana avisa y facilita cómo llegar." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Tiempos de aviso", options: ["24h antes y 2h antes", "48h antes SMS, mañana email", "Tu vía de comunicación preferida"] }
      ],
      free_text_placeholder: "¿Cuántos huecos simultáneos caben en el piso piloto?"
    },
    faqs: [
      { q: "¿Pisa citas si el agente apunta algo manual?", a: "Imposible, tiene sincronización bidireccional en el microsegundo." }
    ],
    pasos: [
      "El usuario reserva y se bloquea el espacio en el calendario vendedor.",
      "Queda asignado y documentado sobre su ficha en el CRM al instante.",
      "Se le envían mensajes con ruta Maps el día previo a su cita."
    ],
    personalizacion: "Incluye las instrucciones de parqueo exactas o fotos de la entrada en los avisos preventivos para evitar la fricción.",
    related_processes: ["seguimiento-post-visita", "asistente-digital-precualificacion"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["Agenda", "CRM", "WhatsApp SMS"],
    integration_domains: ["CRM", "COMMS"],
    landing_slug: "construccion"
  },
  {
    id: "CN11",
    codigo: "CN11",
    slug: "seguimiento-post-visita",
    categoria: "Atención y Clientes",
    categoriaNombre: "Atención y Clientes",
    nombre: "Seguimiento post-visita automatizado",
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
      what_it_is: "Evaluador y nutridor digital que contacta al cliente al terminar su visita para amarrar la reserva o conocer la razón del 'no'.",
      for_who: ["Visitantes al piloto", "Dirección General"],
      requirements: ["CRM", "Plataforma de Encuestas rápidas"],
      output: "Estado de ánimo del interesado adjunto a la ficha en CRM y activación de envíos extras condicionados."
    },
    indicators: {
      time_estimate: "1-2 semanas",
      complexity: "Media",
      integrations: ["CRM", "Surveys"]
    },
    how_it_works_steps: [
      { title: "Detonador de fin de cita", short: "Al marcar 'visitado' en CRM se inicia el reloj.", detail: "Pasadas X horas, envía un gracias y un breve test o cuestionario." },
      { title: "Respuesta de temperatura", short: "Categoriza según el feedback logrado.", detail: "Lo clasifica si dice 'me encantan calidades' o 'no tienen luz natural' y lo vuleca al comercial urgente." },
      { title: "Aporte extra de valor", short: "Manda folletos extra si los pidió, adjunto al momento.", detail: "Contesta enviando el dossier de acabados o el plano de garajes que quizás no vió." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Tono de la Encuesta", options: ["1 a 5 Estrellas rápida", "Dos preguntas abiertas sobre dudas extra", "Combinado"] }
      ],
      free_text_placeholder: "¿Cuántas horas clave deben pasar desde la salida para mandar el primer choque comercial?"
    },
    faqs: [
      { q: "¿Y si no lo rellenan?", a: "Quedan marcados para un impacto de la secuencia multicanal y una llamada humana antes de darse por fríos." }
    ],
    pasos: [
      "Inicia enviando un cuestionario en el momento justo al salir la visita o horas posterior.",
      "Categoriza si la experiencia fue excelente o generó ciertas reservas técnicas por resolver.",
      "Alimenta de nuevo al CRM e instruye al agente qué dudas rebatir en la siguiente llamada al día siguiente."
    ],
    personalizacion: "Define el momento y qué incentivo puedes dar por la encuesta (el regalo de 'los planos detallados en HD' a su correo si rellenan).",
    related_processes: ["automatizacion-agendado-visitas", "seguimiento-multicanal-inteligente"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["CRM", "Surveys"],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion"
  },
  {
    id: "CN12",
    codigo: "CN12",
    slug: "automatizacion-contratos-firma",
    categoria: "Operaciones y Firma",
    categoriaNombre: "Operaciones y Contratos",
    nombre: "Automatización documental de contratos y firma digital",
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
      what_it_is: "Un motor técnico que absorbe la oferta cerrada en tu CRM y vomita el contrato sellado jurídicamente en el móvil de tu cliente en minutos.",
      for_who: ["Admnistración inmobiliaria", "Dirección operativa", "Compradores"],
      requirements: ["CRM", "Software de Firma Digital Certificada"],
      output: "Documentos legales firmados y archivadps digitalmente."
    },
    indicators: {
      time_estimate: "3 semanas",
      complexity: "Alta",
      integrations: ["CRM", "DOCS", "Firma Digital"]
    },
    how_it_works_steps: [
      { title: "Generación del contrato", short: "Un clic al confirmar la venta.", detail: "Extraemos todos los apellidos, DNI y precio pactado al contrato maestro." },
      { title: "Firma certificada móvil", short: "Notifica para firma al instante.", detail: "Les envía por SMS/Email un visualizador legal para la rúbrica dactilar del documento." },
      { title: "Sellado y archivado", short: "Se guarda en tu base y su correo.", detail: "El PDF queda securizado y se autoguarda en el repositorio corporativo del cliente sin fallar uno." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Sistema de firma", options: ["Avanzada OTP por SMS", "Firma biométrica", "Notarial en siguiente fase"] }
      ],
      free_text_placeholder: "¿Cuántos intervinientes promedio (titulares y co-titulares o avalistas) tienen los borradores?"
    },
    faqs: [
      { q: "¿La firma es totalmente legal para una reserva/contrato de arras?", a: "100%, utiliza proveedores homologados europeos (tipo DocuSign o Signaturit) con trazabilidad plena ante un juez." }
    ],
    pasos: [
      "Inyectamos datos de DNI y precio cerrado con el comercial en la plantilla legal oficial de la gestora.",
      "Lanzamos secuencia de rúbrica en en su móvil con certificado de hora/IP.",
      "Devolvemos el archivo firmado a la promotora listos para facturación y elevación a público posterior."
    ],
    personalizacion: "Nos amoldamos a vuestras plantillas blindadas de la propiedad, respetando todos y cada uno de los anexos (memoria, SEPA, RGPD).",
    related_processes: ["proceso-post-reserva", "resumen-llamadas-crm"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["CRM", "DOCS", "Firma Digital"],
    integration_domains: ["CRM", "DOCS"],
    landing_slug: "construccion"
  },
  {
    id: "CN13",
    codigo: "CN13",
    slug: "proceso-post-reserva",
    categoria: "Atención y Clientes",
    categoriaNombre: "Atención y Clientes",
    nombre: "Proceso automatizado post-reserva",
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
      what_it_is: "Asistente documental interactivo que va empujando burocráticamente de la mano al cliente comprador a medida que el proyecto quema etapas.",
      for_who: ["Backoffice tramitador", "Compradores en espera de obra"],
      requirements: ["CRM", "Herramienta de automatización", "Mailing"],
      output: "Documentación lista e historial de comunicaciones tranquilo sin saltos en el abandono."
    },
    indicators: {
      time_estimate: "2-3 semanas",
      complexity: "Media",
      integrations: ["CRM", "Files", "Automatización"]
    },
    how_it_works_steps: [
      { title: "Desbloqueo post-firma", short: "Entra al flujo de 'propietario'.", detail: "Al firmarse el primer depósito (arras), el CRM los etiqueta como 'en pipeline pre-entrega'." },
      { title: "Petición amigable de Info", short: "Bot pide por ti KYC o Sepas.", detail: "Sigue un goteo automatizado pidiendo DNIS en vigor, recibos del banco o avales a depositar." },
      { title: "Avance de obra en video", short: "Alimenta su ilusión de vez en mes.", detail: "Mete vídeos cortos de los cimientos en sus buzones para evitar remordimiento del comprador ansioso." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Cadencia de peticiones", options: ["Agresiva (1 semana todo documentado)", "Gradual mensual de entregas"] }
      ],
      free_text_placeholder: "¿Cuántos documentos solicitan a sus clientes tras la primera reserva?"
    },
    faqs: [
      { q: "¿Es un área privada o va por email?", a: "Puede configurarse via simple email / WhatsApp sin fricción o como pequeño portal web del interesado." }
    ],
    pasos: [
      "Detectamos que el cliente entra en fase de depósito en banco/firma.",
      "Bot pde por él KYC de capital y domiciliaciones según lo planificado.",
      "Mantenemos ilusión latente enviando informes de construcción por trimestres al ser contactados."
    ],
    personalizacion: "Incorporen encuestas post-reserva de materiales a la carta sin que su backoffice mueva un dedo para gestionar listados en excels.",
    related_processes: ["automatizacion-contratos-firma", "portal-propietarios-post-entrega"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["CRM", "Automatización"],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion"
  },
  {
    id: "CN14",
    codigo: "CN14",
    slug: "portal-propietarios-post-entrega",
    categoria: "Atención y Clientes",
    categoriaNombre: "Atención y Clientes",
    nombre: "Portal de propietarios con IA post-entrega",
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
      what_it_is: "Cuartel general post-firma. Los propietarios con quejas hablan con una IA entrenada y abren su ticket fácilmente documentando con fotos.",
      for_who: ["Departamento Post-venta", "Propietarios ya entregados", "Administradores Fincas"],
      requirements: ["Portal Web app", "Ticketing System", "IA Bot"],
      output: "Fichas de incidencia de las viviendas listas para enviar al constructor técnico, ya filtradas."
    },
    indicators: {
      time_estimate: "4 semanas",
      complexity: "Alta",
      integrations: ["Portal Web", "Ticketing", "IA"]
    },
    how_it_works_steps: [
      { title: "Acceso Exclusivo Casa", short: "Se loguea con sus credenciales seguras.", detail: "Entra a la interfaz de su propia casa con los datos de las instalaciones." },
      { title: "El Bot de mantenimiento", short: "IA diagnostica los problemas primero.", detail: "Pregunta: 'Me hace ruido la calefacción'. El IA dice: 'Asegúrese de purgar radiador X con la llave Y así'." },
      { title: "Ticket formal", short: "Sube foto y a cola de trabajo de los operarios de obra.", detail: "Si es daño real, exige fotos, lo cataloga (Ej: Electricidad/Fontanería) y escala al encargado de repasos post-obra en 2 segundos." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Triage previo", options: ["IA intenta resolver con manuales al 100%", "Solo catalogar y abrir tickets manuales a humanos"] }
      ],
      free_text_placeholder: "¿Garantía dividida por plazos? (1 mes pequeños repasos acabados, 3 años defectos visuales, etc?)"
    },
    faqs: [
      { q: "¿Se puede linkar con gremios externos subcontratados?", a: "Absolutamente, en ruta automáticamente las incidencias graves de la bomba de calor a su propia marca subcontratista." }
    ],
    pasos: [
      "El usuario informa problema a bot o formulario de su piso.",
      "El sistema pide adjuntar evidencia e intenta apagar queja menor dando una guía de mantenimiento en el manual web subido.",
      "Vuelca la orden estructurada al ERP del constructor / encargado."
    ],
    personalizacion: "Integra manuales de la aerotermia y el termostato a la inteligencia de la app para que te reboten el 90% de excusas de 'no funciona'.",
    related_processes: ["proceso-post-reserva", "resumen-llamadas-crm"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["Portal Web", "Ticketing", "IA"],
    integration_domains: ["OTHER", "COMMS"],
    landing_slug: "construccion"
  },
  {
    id: "CN15",
    codigo: "CN15",
    slug: "identificacion-reactivacion-unidades",
    categoria: "Análisis y Reporte",
    categoriaNombre: "Análisis y Reporte",
    nombre: "Identificación y reactivación de unidades estancadas",
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
      what_it_is: "Analista de stop-motion que examina pisos que nadie quiere y emite alertas para pivotar el marketing y sacarlas adelante o cambiar precios en automático.",
      for_who: ["Comerciales de zonas", "Ventas general", "Fondos dueños de cartera"],
      requirements: ["CRM", "Herramienta de Automatización", "Datos de Anuncios Mercado"],
      output: "Fichas de acción y propuestas de rebaja/incentivo a dirección semanario."
    },
    indicators: {
      time_estimate: "3 semanas",
      complexity: "Alta",
      integrations: ["CRM", "Market Data", "IA"]
    },
    how_it_works_steps: [
      { title: "Rastreo inútiles", short: "Suma días huecos de todos tus pisos.", detail: "Vigila las 'ratios' de cuánta gente los visito vs reservas dadas." },
      { title: "Diagnóstico AI", short: "Halla 'falta de luz' vs exceso frente mercado de la zona.", detail: "Revisa notas y detecta si es un problema de m2 percibidos de cocina, o si está simplemente 'fuera de mercado en rentabilidad %'." },
      { title: "Plan de Choque", short: "Vomita directriz al equipo de diseño.", detail: "Sugiere: 'Hagan render nuevo amueblado de Home Staging a la vista este' o 'ofrezca garaje de regalo de serie a visitantes de Octubre'." }
    ],
    customization: {
      options_blocks: [
        { type: "select", label: "Métrica Core Alarmante", options: ["Días en Mercado > X", "Visitas a un piso concreto superan Y y no se vende"] }
      ],
      free_text_placeholder: "¿Cuántos meses sueles aguantar antes de aplicar rebaja táctica?"
    },
    faqs: [
      { q: "¿Se puede vincular los anuncios web directamente?", a: "Claro, inyecta bajada de precios al portal de las unidades frías y mide los rebotes." }
    ],
    pasos: [
      "Cruzar base con KPIs para extraer el 'Piso Raro' que frena stock.",
      "Usar feedback en CRM para deducir qué obstáculo paraliza y no convence a la visita.",
      "Emite recomendaciones accionables a la gerencia (Bonus, Muebles o Baja %)."
    ],
    personalizacion: "Define cómo calibrar la rotación o en qué momento y con qué agresividad sugieren incentivar su venta priorizada a tus propios agentes.",
    related_processes: ["dashboard-comercial-tiempo-real", "seguimiento-multicanal-inteligente"],
    sectores: ["Constructoras / Obra Nueva", "Inmobiliaria"],
    herramientas: ["CRM", "IA", "Market Data"],
    integration_domains: ["CRM", "OTHER"],
    landing_slug: "construccion"
  }
];
