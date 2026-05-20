import {
  PhoneCall,
  Star,
  Heart,
  BarChart3,
  Users,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

export type BlockId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6";

export interface RestauracionBlock {
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

export const restauracionBlocks: RestauracionBlock[] = [
  {
    id: "B1",
    number: "01",
    title: "Reservas y atención 24/7",
    sub: "Nunca más una llamada sin atender ni una mesa vacía por no-show",
    icon: PhoneCall,
    accent: "#ea580c",
    accentBg: "bg-orange-500/10",
    accentBorder: "border-orange-500/30",
    accentText: "text-orange-400",
    accentGradient: "from-orange-500/30 via-orange-500/5 to-transparent",
    image: "/restauracion/b1.png",
    teaser:
      "Tu sala no puede atender el teléfono mientras sirve mesas. Convertimos cada canal — llamada, WhatsApp, Instagram, web — en una entrada limpia a tu sistema, con confirmaciones y lista de espera en tiempo real.",
    paragraph:
      "Tu equipo de sala no puede atender el teléfono mientras sirve mesas — y cada llamada perdida es una reserva que se va al de al lado. Convertimos cada canal (llamada, WhatsApp, Instagram, web) en una entrada limpia a tu sistema, con recordatorios y anti-no-show.",
    benefits: [
      "Atiende reservas fuera de horario sin contratar a nadie",
      "Captura desde DM, WhatsApp y web en un único panel",
      "Reduce no-shows con confirmación previa y lista de espera en tiempo real",
    ],
  },
  {
    id: "B2",
    number: "02",
    title: "Reputación y reseñas",
    sub: "Más valoraciones positivas, menos daño cuando algo falla",
    icon: Star,
    accent: "#f97316",
    accentBg: "bg-orange-400/10",
    accentBorder: "border-orange-400/30",
    accentText: "text-orange-300",
    accentGradient: "from-orange-400/30 via-orange-400/5 to-transparent",
    image: "/restauracion/b2.png",
    teaser:
      "Das buen servicio pero las reseñas no llegan, y cuando una mala se publica te enteras tarde. Pedimos reseña al cliente contento, filtramos a los descontentos y avisamos al responsable antes de que escale.",
    paragraph:
      "Das un servicio excelente pero las reseñas no llegan — y cuando llega una mala, te enteras dos días después. Pedimos reseña al cliente contento en el momento adecuado, filtramos los descontentos a privado y avisamos al responsable cuando algo se publica antes de que escale.",
    benefits: [
      "Solicita reseña automáticamente tras el servicio al cliente correcto",
      "Filtra clientes descontentos a un canal privado antes de que publiquen",
      "Avisa en tiempo real de reseñas negativas con borrador de respuesta",
    ],
  },
  {
    id: "B3",
    number: "03",
    title: "Fidelización y vuelta del cliente",
    sub: "Convierte clientes ocasionales en habituales con sistema",
    icon: Heart,
    accent: "#fb923c",
    accentBg: "bg-orange-400/10",
    accentBorder: "border-orange-400/30",
    accentText: "text-orange-300",
    accentGradient: "from-orange-400/30 via-orange-400/5 to-transparent",
    image: "/restauracion/b3.png",
    teaser:
      "Cada cliente que entra es un activo, pero la mayoría de restaurantes no tienen base de datos. Construimos un CRM gastronómico que se llena solo con cada reserva y dispara comunicaciones segmentadas — sin spam.",
    paragraph:
      "Cada cliente que entra es un activo, pero la mayoría de restaurantes no tienen base de datos. Construimos un CRM gastronómico que se llena solo con cada reserva, detecta inactividad y dispara comunicaciones segmentadas — sin spam y sin pagar publicidad para llegar a desconocidos.",
    benefits: [
      "Base de datos automática con preferencias, alergias y frecuencia de visita",
      "Detección de clientes inactivos con mensaje personal de reactivación",
      "Comunicaciones segmentadas para eventos solo a quien le interesa",
    ],
  },
  {
    id: "B4",
    number: "04",
    title: "Operativa diaria y visibilidad",
    sub: "Saber cómo va cada local sin tener que ir en persona",
    icon: BarChart3,
    accent: "#c2410c",
    accentBg: "bg-orange-700/10",
    accentBorder: "border-orange-700/30",
    accentText: "text-orange-500",
    accentGradient: "from-orange-700/30 via-orange-700/5 to-transparent",
    image: "/restauracion/b4.png",
    teaser:
      "Si tienes uno o varios locales, necesitas saber cómo van sin perseguir a los encargados. Cada mañana llega un parte limpio del día anterior y cuando algo se desvía del patrón, te avisa antes de que sea problema.",
    paragraph:
      "Si tienes uno o varios locales, necesitas saber cómo van sin perseguir a los encargados. Cada mañana llega un parte limpio del día anterior — cubiertos, ticket medio, reseñas, no-shows — y cuando algo se desvía del patrón, te avisa antes de que sea problema.",
    benefits: [
      "Reporte diario por restaurante en un mensaje, no en hojas de cálculo",
      "Alertas de anomalías: cancelaciones, reseñas malas, picos de demanda",
      "Visión consolidada multi-local cuando empiezas a expandirte",
    ],
  },
  {
    id: "B5",
    number: "05",
    title: "Gestión de personal y equipo",
    sub: "Menos caos operativo, incorporaciones más rápidas",
    icon: Users,
    accent: "#9a3412",
    accentBg: "bg-orange-800/10",
    accentBorder: "border-orange-800/30",
    accentText: "text-orange-600",
    accentGradient: "from-orange-800/30 via-orange-800/5 to-transparent",
    image: "/restauracion/b5.png",
    teaser:
      "Hostelería tiene alta rotación y grupos de WhatsApp caóticos. Cada incorporación supone explicar lo mismo desde cero. Automatizamos la comunicación de turnos y el onboarding del equipo nuevo.",
    paragraph:
      "Hostelería tiene alta rotación y grupos de WhatsApp caóticos. Cada incorporación supone explicar lo mismo desde cero. Automatizamos la comunicación de turnos con confirmación de lectura y montamos un onboarding que se ejecuta solo cuando entra alguien nuevo.",
    benefits: [
      "Turnos por WhatsApp con confirmación de lectura y cambios en directo",
      "Onboarding automático: documentos, protocolos, primer día listo",
      "Encargados liberados de tareas administrativas repetitivas",
    ],
  },
  {
    id: "B6",
    number: "06",
    title: "Marketing y contenido digital",
    sub: "Presencia activa en redes y campañas sin depender del equipo de sala",
    icon: Megaphone,
    accent: "#ea6830",
    accentBg: "bg-orange-500/10",
    accentBorder: "border-orange-500/30",
    accentText: "text-orange-400",
    accentGradient: "from-orange-500/30 via-orange-500/5 to-transparent",
    image: "/restauracion/b6.png",
    teaser:
      "El marketing del restaurante no puede depender de que el encargado tenga un rato libre. Generamos publicaciones de novedades y eventos en piloto automático, y activamos campañas hacia tu propia base antes de los picos.",
    paragraph:
      "El marketing del restaurante no puede depender de que el encargado tenga un rato libre. Generamos publicaciones de novedades y eventos en piloto automático, y activamos campañas hacia tu propia base antes de los picos de temporada — sin agencia externa.",
    benefits: [
      "Publicaciones automáticas de eventos y novedades en Instagram/Facebook",
      "Campañas de temporada hacia tu base de clientes existente",
      "Contenido alineado con la identidad del local, sin depender de nadie",
    ],
  },
];

export const getBlockById = (id: BlockId): RestauracionBlock | undefined =>
  restauracionBlocks.find((b) => b.id === id);
