import {
  PhoneCall,
  CalendarCheck,
  Star,
  HeartPulse,
  CreditCard,
  Users,
  type LucideIcon,
} from "lucide-react";

export type BlockId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6";

export interface SaludBlock {
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

export const saludBlocks: SaludBlock[] = [
  {
    id: "B1",
    number: "01",
    title: "Captación y primera visita",
    sub: "Que ninguna petición de cita se pierda, sin importar el canal",
    icon: PhoneCall,
    accent: "#0ea5e9",
    accentBg: "bg-sky-500/10",
    accentBorder: "border-sky-500/30",
    accentText: "text-sky-400",
    accentGradient: "from-sky-500/30 via-sky-500/5 to-transparent",
    image: "/salud/b1.png",
    teaser:
      "Cuando alguien busca un centro de salud, decide en minutos. Si no le atiendes al instante — por teléfono, WhatsApp, web o Instagram — se va al de al lado. Convertimos cada canal en una entrada limpia a tu agenda, con cualificación previa para que llegue ya filtrado.",
    paragraph:
      "El primer contacto con un paciente decide si entra o no a tu clínica. Si llama fuera de horario o escribe por DM un domingo, no puede esperar al lunes — se va al competidor. Unificamos teléfono, WhatsApp, web e Instagram en un único flujo que cualifica al paciente (motivo, urgencia, aseguradora) antes de ocupar agenda.",
    benefits: [
      "Atiende peticiones de cita 24/7 sin recepción nocturna",
      "Cualifica al paciente antes de bloquear hueco en agenda",
      "Centraliza todos los canales en una sola bandeja",
    ],
  },
  {
    id: "B2",
    number: "02",
    title: "Gestión de citas y ausencias",
    sub: "Menos huecos vacíos, menos llamadas para confirmar",
    icon: CalendarCheck,
    accent: "#0284c7",
    accentBg: "bg-sky-600/10",
    accentBorder: "border-sky-600/30",
    accentText: "text-sky-500",
    accentGradient: "from-sky-600/30 via-sky-600/5 to-transparent",
    image: "/salud/b2.png",
    teaser:
      "Cada paciente que no aparece es un hueco de agenda que ya no recuperas. Con confirmaciones automáticas, lista de espera activa y reasignación inteligente de profesional, llenas la agenda y cortas las ausencias a la mitad.",
    paragraph:
      "Cada hueco vacío en agenda es ingreso que no vuelve. Las ausencias en salud rondan el 15-25% y la mayoría se evitan con un sistema de confirmación + lista de espera bien diseñado. Reduce ausencias enviando recordatorios en el momento correcto y rescata cancelaciones reasignando huecos al instante.",
    benefits: [
      "Recordatorios 24h y 2h antes con confirmación de un toque",
      "Lista de espera activa que llena cancelaciones automáticamente",
      "Reasignación inteligente si un profesional no puede atender",
    ],
  },
  {
    id: "B3",
    number: "03",
    title: "Reputación y reseñas",
    sub: "Más valoraciones reales, menos sorpresas en Google",
    icon: Star,
    accent: "#38bdf8",
    accentBg: "bg-sky-400/10",
    accentBorder: "border-sky-400/30",
    accentText: "text-sky-300",
    accentGradient: "from-sky-400/30 via-sky-400/5 to-transparent",
    image: "/salud/b3.png",
    teaser:
      "Das buen trato pero solo las quejas llegan a Google. Pedimos reseña al paciente contento en el momento adecuado, filtramos los descontentos a un canal privado y avisamos en tiempo real cuando algo se publica antes de que escale.",
    paragraph:
      "En salud la decisión de elegir clínica se toma leyendo reseñas. Pero tus pacientes contentos no piensan en escribir una — y los descontentos sí. Inviertes la balanza pidiéndola en el momento de máxima satisfacción, filtrando los enfados a un canal privado y respondiendo en horas, no días.",
    benefits: [
      "Solicita reseña al paciente correcto, tras la cita correcta",
      "Filtra descontentos a canal privado antes de que publiquen",
      "Avisa en tiempo real con borrador de respuesta listo",
    ],
  },
  {
    id: "B4",
    number: "04",
    title: "Seguimiento clínico y fidelización",
    sub: "Pacientes que vuelven a su revisión sin que tengas que perseguirlos",
    icon: HeartPulse,
    accent: "#0369a1",
    accentBg: "bg-sky-700/10",
    accentBorder: "border-sky-700/30",
    accentText: "text-sky-500",
    accentGradient: "from-sky-700/30 via-sky-700/5 to-transparent",
    image: "/salud/b4.png",
    teaser:
      "Un paciente vale 5-10 veces más por su recurrencia que por la primera visita. Recordamos revisiones periódicas, recuperamos pacientes inactivos y enviamos encuestas justo después del tratamiento — cuando la respuesta es honesta y útil.",
    paragraph:
      "El paciente recurrente es el activo real de una clínica. Pero la mayoría de centros no tienen sistema para que vuelvan a su revisión anual, ni saben quién lleva 18 meses sin venir. Construimos un sistema de seguimiento clínico que recuerda revisiones, reactiva pacientes inactivos y mide satisfacción en el momento útil.",
    benefits: [
      "Recordatorios de revisión periódica (limpieza, control, mantenimiento)",
      "Detección de pacientes inactivos con mensaje personal de reactivación",
      "Encuestas post-tratamiento en el momento útil",
    ],
  },
  {
    id: "B5",
    number: "05",
    title: "Administración y facturación",
    sub: "Mutuas, gastos y cierre de mes sin perder horas en papel",
    icon: CreditCard,
    accent: "#075985",
    accentBg: "bg-sky-800/10",
    accentBorder: "border-sky-800/30",
    accentText: "text-sky-600",
    accentGradient: "from-sky-800/30 via-sky-800/5 to-transparent",
    image: "/salud/b5.png",
    teaser:
      "Facturar a mutuas, registrar gastos de material clínico y cerrar el mes te quita días que deberías estar en consulta. Automatizamos facturación a aseguradoras, captura de tickets y un parte diario por clínica para que cierres mes en horas.",
    paragraph:
      "Una clínica pequeña gasta el equivalente a media jornada semanal en administración: facturar mutuas, registrar tickets, conciliar pagos pendientes. Automatizamos la cadena entera para que el cierre de mes deje de ser un cuello de botella y dirección tenga visibilidad sin esperar al gestor.",
    benefits: [
      "Facturación automática a mutuas y aseguradoras con seguimiento",
      "Tickets y gastos clínicos capturados con foto, sin tecleo",
      "Reporte diario por clínica con cifras del día anterior",
    ],
  },
  {
    id: "B6",
    number: "06",
    title: "Gestión del equipo clínico",
    sub: "Menos caos de turnos, incorporaciones más rápidas",
    icon: Users,
    accent: "#7dd3fc",
    accentBg: "bg-sky-300/10",
    accentBorder: "border-sky-300/30",
    accentText: "text-sky-200",
    accentGradient: "from-sky-300/30 via-sky-300/5 to-transparent",
    image: "/salud/b6.png",
    teaser:
      "Sanidad rota mucho personal — auxiliares, higienistas, recepción — y cada incorporación supone explicar lo mismo desde cero. Comunicación de turnos sin grupos caóticos, sustituciones inteligentes y onboarding que se ejecuta solo el primer día.",
    paragraph:
      "La rotación en clínicas es alta y los grupos de WhatsApp del equipo son ingobernables. Cuando una auxiliar no puede venir, la búsqueda de sustituta consume horas. Automatizamos el envío individual de turnos con confirmación, las sustituciones inteligentes según disponibilidad y el onboarding para que el primer día sea operativo desde el primer minuto.",
    benefits: [
      "Turnos individuales por WhatsApp con confirmación de lectura",
      "Sustituciones inteligentes según disponibilidad y rol",
      "Onboarding automático: documentos, protocolos, primer día listo",
    ],
  },
];

export const getBlockById = (id: BlockId): SaludBlock | undefined =>
  saludBlocks.find((b) => b.id === id);
