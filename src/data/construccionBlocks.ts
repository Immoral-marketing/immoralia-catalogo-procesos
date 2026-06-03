import {
  Filter,
  TrendingUp,
  CalendarCheck,
  FileSignature,
  Home,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export type ConstruccionBlockId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6";

export interface ConstruccionBlock {
  id: ConstruccionBlockId;
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

export const construccionBlocks: ConstruccionBlock[] = [
  {
    id: "B1",
    number: "01",
    title: "Captación y cualificación de posibles compradores",
    sub: "Saber quién tiene presupuesto real antes de que tu equipo invierta tiempo",
    icon: Filter,
    accent: "#22c55e",
    accentBg: "bg-green-500/10",
    accentBorder: "border-green-500/30",
    accentText: "text-green-400",
    accentGradient: "from-green-500/30 via-green-500/5 to-transparent",
    image: "/constructoras/b1.png",
    teaser:
      "Recibes consultas de múltiples canales pero no sabes cuáles tienen presupuesto, urgencia y financiación real. La IA evalúa cada lead en segundos para que tu equipo solo hable con quien tiene intención de compra.",
    paragraph:
      "Recibes consultas de múltiples canales pero no sabes cuáles tienen presupuesto, urgencia y financiación real — y tu equipo pierde tiempo en leads que no van a ningún lado. La IA evalúa cada nuevo contacto en segundos, analiza señales de riesgo antes de que se enfríen, y tu director comercial tiene el estado del pipeline en tiempo real sin perseguir a nadie.",
    benefits: [
      "Calificación automática por presupuesto, urgencia y tipo de financiación",
      "Detección temprana de leads que se enfrían antes de perderlos",
      "Dashboard comercial en tiempo real para dirección sin informes manuales",
    ],
  },
  {
    id: "B2",
    number: "02",
    title: "Conversión y argumentación comercial",
    sub: "El agente siempre con el discurso correcto y el dossier listo en segundos",
    icon: TrendingUp,
    accent: "#16a34a",
    accentBg: "bg-green-600/10",
    accentBorder: "border-green-600/30",
    accentText: "text-green-500",
    accentGradient: "from-green-600/30 via-green-600/5 to-transparent",
    image: "/constructoras/b2.png",
    teaser:
      "Tus agentes tienen que responder dudas técnicas, adaptar el discurso a cada perfil y generar dossieres de unidad sobre la marcha. La IA les da respuesta inmediata a todo eso para que se centren en construir confianza.",
    paragraph:
      "Tus agentes tienen que responder dudas técnicas, adaptar el discurso a cada perfil de comprador y generar dossieres con plano, precio y condiciones sobre la marcha — y muchas veces improvisan. Un asistente de IA les da respuesta inmediata a objeciones y preguntas técnicas, adapta los argumentos al perfil del cliente, genera el dossier en segundos y resume cada llamada directamente en el CRM.",
    benefits: [
      "Respuestas instantáneas a objeciones y dudas técnicas del comprador",
      "Dossier de unidad personalizado con plano, precio y condiciones en segundos",
      "Resumen automático de cada llamada actualizado en el CRM sin teclear",
    ],
  },
  {
    id: "B3",
    number: "03",
    title: "Seguimiento y visitas",
    sub: "Leads que no se enfrían y visitas que siempre se producen",
    icon: CalendarCheck,
    accent: "#86efac",
    accentBg: "bg-green-400/10",
    accentBorder: "border-green-400/30",
    accentText: "text-green-300",
    accentGradient: "from-green-400/30 via-green-400/5 to-transparent",
    image: "/constructoras/b3.png",
    teaser:
      "Un lead que visita la promoción tiene muchas más probabilidades de comprar, pero coordinar citas, recordatorios y el seguimiento posterior consume horas cada semana. Lo automatizamos de principio a fin.",
    paragraph:
      "Un lead que visita la promoción tiene muchas más probabilidades de comprar, pero coordinar citas, recordatorios y el seguimiento posterior consume horas cada semana al equipo comercial. Automatizamos el seguimiento por el canal correcto según la fase del embudo, la gestión de la agenda de visitas con check-in automático y la encuesta post-visita con nurturing activo para los que aún no deciden.",
    benefits: [
      "Mensajes de seguimiento contextuales según la fase del embudo sin trabajo manual",
      "Gestión automática de agenda, recordatorios y check-in en la visita",
      "Encuesta post-visita y nurturing activo para leads que no deciden en el momento",
    ],
  },
  {
    id: "B4",
    number: "04",
    title: "Cierre y contratación",
    sub: "De la reserva al contrato firmado sin papeleo manual",
    icon: FileSignature,
    accent: "#15803d",
    accentBg: "bg-green-700/10",
    accentBorder: "border-green-700/30",
    accentText: "text-green-600",
    accentGradient: "from-green-700/30 via-green-700/5 to-transparent",
    image: "/constructoras/b4.png",
    teaser:
      "Cuando un cliente decide comprar, el proceso documental — contratos, firma digital, seguimiento de hitos — suele ser lento y manual. Lo automatizamos para que el cierre sea tan ágil como la decisión.",
    paragraph:
      "Cuando un cliente decide comprar, el proceso documental es el cuello de botella: contratos a revisar, firma digital a coordinar, plazos a comunicar. Automatizamos la generación y trazabilidad de contratos con firma digital integrada, y el proceso post-reserva para que el comprador reciba información de cada hito sin que nadie lo tenga que escribir manualmente.",
    benefits: [
      "Contratos generados automáticamente con firma digital integrada y trazabilidad completa",
      "Comunicación automática de hitos y avances desde la reserva hasta la entrega",
      "Cero cuellos de botella documentales en el momento de mayor ilusión del comprador",
    ],
  },
  {
    id: "B5",
    number: "05",
    title: "Postventa y relación con propietarios",
    sub: "Compradores satisfechos que se convierten en prescriptores",
    icon: Home,
    accent: "#166534",
    accentBg: "bg-green-800/10",
    accentBorder: "border-green-800/30",
    accentText: "text-green-500",
    accentGradient: "from-green-800/30 via-green-800/5 to-transparent",
    image: "/constructoras/b5.png",
    teaser:
      "La relación con el propietario no termina en la entrega de llaves. Un portal de IA resuelve dudas, gestiona garantías y predice problemas antes de que escalen — convirtiendo compradores en recomendadores activos.",
    paragraph:
      "La relación con el propietario no termina en la entrega de llaves — pero el equipo postventa suele estar desbordado con consultas repetitivas sobre garantías, incidencias y plazos. Un portal de IA con conocimiento completo del proyecto resuelve dudas al instante, gestiona las garantías de forma organizada y anticipa problemas potenciales para que el departamento técnico actúe antes de que el comprador se queje.",
    benefits: [
      "Portal de propietarios con IA que resuelve dudas sin saturar al equipo postventa",
      "Gestión estructurada de garantías e incidencias con trazabilidad completa",
      "Predicción de problemas recurrentes para actuar antes de que escalen",
    ],
  },
  {
    id: "B6",
    number: "06",
    title: "Operativa diaria",
    sub: "Visibilidad total del pipeline sin depender de informes manuales",
    icon: BarChart3,
    accent: "#22c55e",
    accentBg: "bg-green-500/10",
    accentBorder: "border-green-500/30",
    accentText: "text-green-400",
    accentGradient: "from-green-500/30 via-green-500/5 to-transparent",
    image: "/constructoras/b6.png",
    teaser:
      "Cuando una unidad lleva tiempo sin movimiento, normalmente te enteras demasiado tarde. La IA detecta las unidades estancadas, analiza por qué y propone acciones concretas para reactivarlas antes de que el proyecto se alargue.",
    paragraph:
      "Cuando una unidad lleva semanas sin movimiento en el pipeline, normalmente el director comercial lo descubre demasiado tarde en la reunión semanal. La IA identifica automáticamente las unidades estancadas, analiza los motivos — precio, tipología, zona — y propone acciones concretas de reactivación con datos reales del mercado para que la promotora actúe con criterio.",
    benefits: [
      "Identificación automática de unidades estancadas con análisis de causa raíz",
      "Recomendaciones estratégicas basadas en datos de mercado para reactivar stock",
      "Alertas proactivas para dirección antes de que los retrasos afecten al proyecto",
    ],
  },
];

export const getConstruccionBlockById = (id: ConstruccionBlockId): ConstruccionBlock | undefined =>
  construccionBlocks.find((b) => b.id === id);
