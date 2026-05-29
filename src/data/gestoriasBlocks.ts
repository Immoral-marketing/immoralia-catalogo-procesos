import {
  UserPlus,
  FolderOpen,
  CalendarClock,
  Users,
  MessageSquare,
  Settings2,
  type LucideIcon,
} from "lucide-react";

export type GestoriasBlockId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6";

export interface GestoriasBlock {
  id: GestoriasBlockId;
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

export const gestoriasBlocks: GestoriasBlock[] = [
  {
    id: "B1",
    number: "01",
    title: "Alta y captación de clientes",
    sub: "Del primer contacto al contrato firmado sin papeles ni llamadas de seguimiento",
    icon: UserPlus,
    accent: "#c4a84c",
    accentBg: "bg-yellow-600/10",
    accentBorder: "border-yellow-600/30",
    accentText: "text-yellow-500",
    accentGradient: "from-yellow-600/30 via-yellow-600/5 to-transparent",
    image: "/gestorias/b1.png",
    teaser:
      "Cada cliente potencial que llega a la gestoría debería recibir un presupuesto en minutos y un contrato para firmar esa misma tarde. La realidad es que entre prepararlo a mano, mandarlo y hacer seguimiento se van días — y algunos se van a otra gestoría.",
    paragraph:
      "Cada cliente potencial que llega a la gestoría debería recibir un presupuesto en minutos y un contrato para firmar esa misma tarde. La realidad es que entre prepararlo a mano, mandarlo por email y hacer seguimiento se van días — y algunos clientes se van a otra gestoría que responde antes. Automatizamos el ciclo completo: desde el presupuesto hasta el alta formal con documentación y contrato firmado digitalmente.",
    benefits: [
      "Presupuesto generado y enviado en minutos, sin que nadie lo prepare a mano",
      "Alta del nuevo cliente con datos, contrato y documentación recogidos automáticamente",
      "Contrato firmado digitalmente desde el móvil sin imprimir ni escanear nada",
    ],
  },
  {
    id: "B2",
    number: "02",
    title: "Gestión documental",
    sub: "Recibe, clasifica y archiva los documentos de tus clientes sin perseguir a nadie",
    icon: FolderOpen,
    accent: "#b89838",
    accentBg: "bg-amber-600/10",
    accentBorder: "border-amber-600/30",
    accentText: "text-amber-500",
    accentGradient: "from-amber-600/30 via-amber-600/5 to-transparent",
    image: "/gestorias/b2.png",
    teaser:
      "La mayor fuente de estrés en una gestoría no son los impuestos — es el cliente que envía las facturas por WhatsApp a trozos dos días antes del cierre. Automatizamos la recogida, la clasificación y el archivo para que todo llegue en tiempo y forma sin que nadie tenga que perseguir a nadie.",
    paragraph:
      "La mayor fuente de estrés en una gestoría no son los impuestos — es el cliente que envía las facturas por WhatsApp a trozos dos días antes del cierre, el certificado digital que caduca un viernes por la tarde o el documento que nadie sabe dónde está archivado. Automatizamos la recogida mensual de documentación, el canal de envío, la clasificación automática y las alertas de vencimiento.",
    benefits: [
      "Documentación mensual solicitada y recibida de forma automática sin recordatorios manuales",
      "Canal estructurado para que el cliente envíe cualquier documento sin usar el WhatsApp personal",
      "Alertas automáticas antes de que un certificado, poder o contrato caduque",
    ],
  },
  {
    id: "B3",
    number: "03",
    title: "Fiscal y vencimientos",
    sub: "El calendario de impuestos vigilado solo, sin riesgo de que se pase un plazo",
    icon: CalendarClock,
    accent: "#c9a040",
    accentBg: "bg-yellow-700/10",
    accentBorder: "border-yellow-700/30",
    accentText: "text-yellow-400",
    accentGradient: "from-yellow-700/30 via-yellow-700/5 to-transparent",
    image: "/gestorias/b3.png",
    teaser:
      "Un plazo de impuestos que se pasa no es solo un recargo — es una responsabilidad que cae sobre la gestoría. El calendario fiscal no puede depender de que alguien se acuerde de mirar la agenda.",
    paragraph:
      "Un plazo de impuestos que se pasa no es solo un recargo para el cliente — es una responsabilidad profesional que cae sobre la gestoría. El calendario fiscal no puede depender de que alguien se acuerde de mirar la agenda o de que el cliente envíe los datos a tiempo. Automatizamos las alertas de vencimiento y el seguimiento de cada expediente para que nada se escape.",
    benefits: [
      "Alertas automáticas de vencimientos fiscales y laborales con antelación suficiente para actuar",
      "Seguimiento en tiempo real del estado de cada expediente para clientes y para el equipo",
      "Cero recargos por despistes: el sistema recuerda cada plazo aunque nadie lo tenga en la agenda",
    ],
  },
  {
    id: "B4",
    number: "04",
    title: "Laboral y nóminas de clientes",
    sub: "Altas, bajas, contratos y nóminas gestionados sin ir y venir de WhatsApp",
    icon: Users,
    accent: "#d4af55",
    accentBg: "bg-yellow-500/10",
    accentBorder: "border-yellow-500/30",
    accentText: "text-yellow-400",
    accentGradient: "from-yellow-500/30 via-yellow-500/5 to-transparent",
    image: "/gestorias/b4.png",
    teaser:
      "El área laboral de una gestoría vive en el caos: los datos del nuevo empleado llegan a trozos por WhatsApp, los contratos temporales se renuevan por inercia y enviar las nóminas toma una mañana entera. Todo eso tiene solución.",
    paragraph:
      "El área laboral de una gestoría vive en el caos: los datos del nuevo empleado llegan por WhatsApp a trozos y sin el DNI, los contratos temporales se acaban sin que nadie haya avisado al cliente, y enviar las nóminas de todos los clientes ocupa una mañana entera del mejor técnico del equipo. Automatizamos la recogida de datos, el control de fechas y la distribución de nóminas.",
    benefits: [
      "Datos del nuevo empleado recibidos por canal estructurado, no a trozos por WhatsApp",
      "Contratos temporales de tus clientes vigilados antes de que venzan sin revisar expedientes a mano",
      "Nóminas enviadas automáticamente a cada empleado sin llamadas ni envíos manuales",
    ],
  },
  {
    id: "B5",
    number: "05",
    title: "Relación con el cliente",
    sub: "Clientes informados, bien atendidos y sin llamar constantemente para saber cómo va lo suyo",
    icon: MessageSquare,
    accent: "#bfa042",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/30",
    accentText: "text-amber-400",
    accentGradient: "from-amber-500/30 via-amber-500/5 to-transparent",
    image: "/gestorias/b5.png",
    teaser:
      "El cliente que llama constantemente para preguntar cómo va lo suyo no es un cliente exigente — es un cliente que no está bien informado. Y el asesor que tarda veinte minutos en recordar los detalles de la última reunión no es desmemoriado — es que nadie le da las herramientas.",
    paragraph:
      "El cliente que llama para preguntar cómo va su trámite no es exigente — es que nadie le ha dicho nada en dos semanas. El asesor que tarda en recordar qué se habló en la última reunión no tiene mala memoria — simplemente no tenía las herramientas. Automatizamos el seguimiento, los resúmenes de llamadas y la comunicación proactiva para que clientes y equipo siempre estén alineados.",
    benefits: [
      "Cada llamada con el cliente resumida y registrada en el CRM de forma automática",
      "El asesor accede al historial completo del cliente antes de cada reunión sin buscar correos",
      "Clientes inactivos recuperados con secuencias automáticas antes de que se vayan a la competencia",
    ],
  },
  {
    id: "B6",
    number: "06",
    title: "Operativa interna de la gestoría",
    sub: "Los gastos y las cuentas de la propia gestoría controlados sin trabajo manual",
    icon: Settings2,
    accent: "#a88830",
    accentBg: "bg-yellow-800/10",
    accentBorder: "border-yellow-800/30",
    accentText: "text-yellow-500",
    accentGradient: "from-yellow-800/30 via-yellow-800/5 to-transparent",
    image: "/gestorias/b6.png",
    teaser:
      "La gestoría ayuda a sus clientes a llevar la contabilidad — pero la suya propia a menudo se gestiona en un Excel que nadie actualiza. Automatizamos el registro de gastos y la conciliación bancaria para que el control interno sea tan bueno como el que le dais a vuestros clientes.",
    paragraph:
      "La gestoría se pasa el día ayudando a sus clientes a llevar las cuentas en orden — pero la suya propia a menudo se gestiona en un Excel que nadie actualiza, con facturas que se pierden y extractos que se cuadran cada tres meses. Automatizamos el registro de gastos y la conciliación bancaria para que la gestoría tenga el mismo nivel de control que exige a sus clientes.",
    benefits: [
      "Facturas de gasto registradas automáticamente sin tocar hojas de cálculo",
      "Conciliación bancaria automatizada: extractos y facturas cuadrados sin trabajo manual",
      "Control financiero interno de la gestoría tan ordenado como el de vuestros mejores clientes",
    ],
  },
];

export const getGestoriasBlockById = (id: GestoriasBlockId): GestoriasBlock | undefined =>
  gestoriasBlocks.find((b) => b.id === id);
