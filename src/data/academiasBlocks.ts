import {
  PhoneCall,
  ClipboardList,
  MessageCircle,
  Sparkles,
  CreditCard,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export type BlockId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6";

export interface AcademiasBlock {
  id: BlockId;
  number: string;
  title: string;
  sub: string;
  icon: LucideIcon;
  accent: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  accentGradient: string;
  image: string;
  benefits: string[];
  paragraph: string;
  teaser: string;
}

export const academiasBlocks: AcademiasBlock[] = [
  {
    id: "B1",
    number: "01",
    title: "Captación de alumnos",
    sub: "Que ninguna consulta de cursos se pierda, sin importar el canal",
    icon: PhoneCall,
    accent: "#c026d3",
    accentBg: "bg-fuchsia-600/10",
    accentBorder: "border-fuchsia-600/30",
    accentText: "text-fuchsia-400",
    accentGradient: "from-fuchsia-600/30 via-fuchsia-600/5 to-transparent",
    image: "/academias/b1.webp",
    teaser:
      "Cuando alguien busca una academia, compara varias en minutos. Si no le atiendes al instante — por teléfono, WhatsApp, web o Instagram — se va a la academia de al lado. Convertimos cada canal en una entrada limpia al proceso de matriculación, con cualificación previa para que llegue ya filtrado por objetivo, nivel e interés real.",
    paragraph:
      "El primer contacto con un alumno potencial decide si entra o no a tu academia. Si llama fuera de horario o escribe por DM un domingo, no puede esperar al lunes — ya habrá cerrado en otro sitio. Unificamos teléfono, WhatsApp, web e Instagram en un único flujo que cualifica al alumno (objetivo, nivel, modalidad) antes de que llegue a ningún asesor.",
    benefits: [
      "Atiende consultas de cursos 24/7 sin secretaría nocturna",
      "Cualifica al alumno antes de que entren al proceso de venta",
      "Centraliza todos los canales en una sola bandeja de entrada",
    ],
  },
  {
    id: "B2",
    number: "02",
    title: "Matriculación y onboarding del alumno",
    sub: "Menos papeleo, más alumnos activos desde el primer día",
    icon: ClipboardList,
    accent: "#a21caf",
    accentBg: "bg-fuchsia-700/10",
    accentBorder: "border-fuchsia-700/30",
    accentText: "text-fuchsia-600",
    accentGradient: "from-fuchsia-700/30 via-fuchsia-700/5 to-transparent",
    image: "/academias/b2.webp",
    teaser:
      "La matriculación manual — contratos en papel, pagos en ventanilla, explicar lo mismo al nuevo alumno cada vez — consume horas de administración que deberían estar en la enseñanza. Automatizamos el proceso completo: documentación, pago y bienvenida, para que el alumno esté activo en 24 horas.",
    paragraph:
      "Cada matriculación implica papeleo, gestión de cobros, envío de materiales y explicación de normas. Hacerlo a mano para decenas de alumnos cada trimestre agota al equipo administrativo. Automatizamos el flujo completo: el alumno firma en digital, paga o fracciona, y recibe el welcome pack al instante — sin que nadie tenga que tocarlo.",
    benefits: [
      "Matriculación 100% digital sin visita ni papeleo",
      "Welcome pack automático con acceso a plataforma, materiales y normas",
      "Control de cuotas fraccionadas con recordatorios automáticos",
    ],
  },
  {
    id: "B3",
    number: "03",
    title: "Comunicación con padres y alumnos",
    sub: "Más información, menos llamadas entrantes a la academia",
    icon: MessageCircle,
    accent: "#e879f9",
    accentBg: "bg-fuchsia-400/10",
    accentBorder: "border-fuchsia-400/30",
    accentText: "text-fuchsia-300",
    accentGradient: "from-fuchsia-400/30 via-fuchsia-400/5 to-transparent",
    image: "/academias/b3.webp",
    teaser:
      "Los padres quieren saber qué pasa con sus hijos. Sin sistema, cada duda genera una llamada. Con un buen flujo de comunicación proactiva — faltas, exámenes, cambios de horario, fechas clave — reduces llamadas entrantes y aumentas la confianza de las familias en la academia.",
    paragraph:
      "La comunicación manual con padres y alumnos consume tiempo que el equipo no tiene. Avisar de faltas, recordar exámenes, confirmar cambios de horario y felicitar en fechas importantes — todo eso se puede automatizar sin perder el tono humano. El resultado es menos ruido en la academia y familias mejor informadas.",
    benefits: [
      "Avisos automáticos de faltas a padres sin intervención manual",
      "Comunicación de calendario y exámenes con anticipación suficiente",
      "Encuestas post-clase para medir calidad en tiempo real",
    ],
  },
  {
    id: "B4",
    number: "04",
    title: "Retención y reactivación",
    sub: "Alumnos que renuevan su matrícula sin que tengas que perseguirlos",
    icon: Sparkles,
    accent: "#86198f",
    accentBg: "bg-fuchsia-800/10",
    accentBorder: "border-fuchsia-800/30",
    accentText: "text-fuchsia-600",
    accentGradient: "from-fuchsia-800/30 via-fuchsia-800/5 to-transparent",
    image: "/academias/b4.webp",
    teaser:
      "Un alumno que lleva tres meses sin conectarse a la plataforma o con ausencias repetidas está a punto de darse de baja. Si no actúas antes de que lo diga, ya es demasiado tarde. Detectamos las señales de riesgo y lanzamos el mensaje correcto en el momento correcto — antes de la baja, no después.",
    paragraph:
      "La retención es el activo real de una academia. Captar un alumno cuesta cinco veces más que retener uno. Pero la mayoría de academias no tienen sistema para detectar quién está a punto de irse, ni para recuperar a exalumnos que dejaron el curso. Construimos un sistema de retención que actúa antes de la baja y un programa de referidos que trae alumnos nuevos sin publicidad pagada.",
    benefits: [
      "Detección automática de alumnos en riesgo antes de que soliciten la baja",
      "Reactivación de exalumnos con mensaje personalizado y motivo concreto",
      "Programa de referidos que convierte alumnos satisfechos en comerciales",
    ],
  },
  {
    id: "B5",
    number: "05",
    title: "Administración y finanzas",
    sub: "Cobros, gastos y cierre de mes sin perder horas en papeles",
    icon: CreditCard,
    accent: "#701a75",
    accentBg: "bg-fuchsia-800/10",
    accentBorder: "border-fuchsia-800/30",
    accentText: "text-fuchsia-700",
    accentGradient: "from-fuchsia-800/30 via-fuchsia-800/5 to-transparent",
    image: "/academias/b5.webp",
    teaser:
      "Hacer el seguimiento de mensualidades, registrar gastos de material y cerrar el mes te quita días que deberías invertir en mejorar la academia. Automatizamos recordatorios de pago, captura de gastos y el reporte diario para que cierres mes en horas, no en días.",
    paragraph:
      "Una academia mediana gasta el equivalente a media jornada semanal en administración financiera: recordar pagos pendientes, registrar gastos de material, conciliar cobros. Automatizamos la cadena entera para que la dirección tenga visibilidad sin esperar a cuadrar Excel y el equipo deje de perseguir impagos a mano.",
    benefits: [
      "Recordatorios escalonados de mensualidad antes y después del vencimiento",
      "Gastos de material capturados con foto, sin tecleo manual",
      "Reporte diario con cifras clave por academia o sede",
    ],
  },
  {
    id: "B6",
    number: "06",
    title: "Gestión del profesorado",
    sub: "Menos caos de turnos, sustituciones sin llamadas urgentes",
    icon: GraduationCap,
    accent: "#f0abfc",
    accentBg: "bg-fuchsia-300/10",
    accentBorder: "border-fuchsia-300/30",
    accentText: "text-violet-200",
    accentGradient: "from-fuchsia-300/30 via-fuchsia-300/5 to-transparent",
    image: "/academias/b6.webp",
    teaser:
      "Las academias rotan profesores y cubren bajas de última hora con grupos de WhatsApp caóticos. Cuando un profesor no puede dar clase, la búsqueda de sustituto absorbe horas. Comunicación de turnos individual, sustituciones inteligentes y onboarding que se ejecuta solo el primer día.",
    paragraph:
      "La rotación de profesores en academias es habitual y los grupos de WhatsApp del equipo son ingobernables. Cuando alguien se pone enfermo, el coordinador pasa horas buscando sustituto. Automatizamos el envío individual de horarios con confirmación, las sustituciones según disponibilidad y el onboarding para que el profesor nuevo arranque operativo desde el primer minuto.",
    benefits: [
      "Horarios individuales por WhatsApp con confirmación de lectura",
      "Sustituciones inteligentes según disponibilidad y nivel de enseñanza",
      "Onboarding automático: documentos, protocolos y primeras clases asignadas",
    ],
  },
];

export const getBlockById = (id: BlockId): AcademiasBlock | undefined =>
  academiasBlocks.find((b) => b.id === id);
