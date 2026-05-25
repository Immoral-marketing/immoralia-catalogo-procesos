import {
  CalendarCheck,
  UserPlus,
  Heart,
  Building2,
  Star,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

export type CentrosDeportivosBlockId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6";

export interface CentrosDeportivosBlock {
  id: CentrosDeportivosBlockId;
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

export const centrosDeportivosBlocks: CentrosDeportivosBlock[] = [
  {
    id: "B1",
    number: "01",
    title: "Reservas y acceso 24/7",
    sub: "Gestiona plazas, pistas y cancelaciones sin que nadie tenga que estar al teléfono",
    icon: CalendarCheck,
    accent: "#0ea5e9",
    accentBg: "bg-sky-500/10",
    accentBorder: "border-sky-500/30",
    accentText: "text-sky-400",
    accentGradient: "from-sky-500/30 via-sky-500/5 to-transparent",
    image: "/centros-deportivos/b1.png",
    teaser:
      "Tu recepción no puede atender al socio que entra y al WhatsApp que no para de llegar al mismo tiempo. Convertimos cada canal — mensaje, web, app — en una entrada limpia al sistema, con confirmaciones, avisos de cancelación y lista de espera en tiempo real.",
    paragraph:
      "Tu recepción no puede atender al socio que entra y al WhatsApp que no para de llegar al mismo tiempo — y cada consulta sin respuesta es una reserva que se va a otro centro. Convertimos cada canal (mensaje, web, app) en una entrada limpia al sistema, con confirmaciones automáticas y avisos de cancelación instantáneos para que el centro siempre esté al máximo de ocupación.",
    benefits: [
      "Reservas de sesiones o pistas gestionadas fuera de horario sin contratar a nadie",
      "Avisos inmediatos cuando se cancela o cambia una sesión o actividad",
      "Control automático del aforo con cierre de inscripciones cuando el espacio se llena",
    ],
  },
  {
    id: "B2",
    number: "02",
    title: "Captación y conversión de socios",
    sub: "Convierte cada interesado en socio sin que nadie tenga que perseguirlo",
    icon: UserPlus,
    accent: "#06b6d4",
    accentBg: "bg-cyan-500/10",
    accentBorder: "border-cyan-500/30",
    accentText: "text-cyan-400",
    accentGradient: "from-cyan-500/30 via-cyan-500/5 to-transparent",
    image: "/centros-deportivos/b2.png",
    teaser:
      "Cada mes llegan personas interesadas por Instagram, la web o el boca a boca — y la mayoría no recibe respuesta rápida porque no hay nadie detrás. Capturamos cada interesado, le mandamos una secuencia que le lleva hasta la primera visita y lo damos de alta en cuanto dice que sí.",
    paragraph:
      "Cada mes llegan personas interesadas por Instagram, la web o el boca a boca — y la mayoría no recibe una respuesta rápida porque no hay nadie detrás en ese momento. Capturamos cada interesado en el CRM, le enviamos una secuencia que le lleva hasta la primera visita o sesión de prueba, y lo damos de alta en el sistema en cuanto decide inscribirse — sin que nadie tenga que hacerlo a mano.",
    benefits: [
      "Los interesados entran solos en el CRM y reciben respuesta inmediata sin que nadie lo gestione",
      "Seguimiento automático hasta que el interesado dice sí o no definitivamente",
      "Alta completa del nuevo socio con acceso al centro y bienvenida en un solo paso",
    ],
  },
  {
    id: "B3",
    number: "03",
    title: "Fidelización y retención de socios",
    sub: "Detecta el abandono antes de que ocurra y mantén a tus socios comprometidos",
    icon: Heart,
    accent: "#0891b2",
    accentBg: "bg-cyan-600/10",
    accentBorder: "border-cyan-600/30",
    accentText: "text-cyan-500",
    accentGradient: "from-cyan-600/30 via-cyan-600/5 to-transparent",
    image: "/centros-deportivos/b3.png",
    teaser:
      "El mayor coste de un centro es la pérdida silenciosa de socios — se dejan de venir, no renuevan y te enteras cuando ya es tarde. Detectamos las señales de abandono y actuamos de forma automática antes de que tomen la decisión.",
    paragraph:
      "El mayor coste de un centro no son las bajas declaradas — son los socios que dejan de venir poco a poco, no renuevan y desaparecen sin decir nada. Detectamos las señales de abandono (días de inactividad, bonos agotados, pagos fallidos) y actuamos de forma automática antes de que la decisión sea definitiva.",
    benefits: [
      "Alerta automática cuando un socio lleva días sin aparecer por el centro",
      "Renovaciones sin fricción: cuotas, bonos y avisos de pago gestionados solos",
      "Mensajes personalizados de recuperación para socios que se dieron de baja",
    ],
  },
  {
    id: "B4",
    number: "04",
    title: "Operativa del centro y personal",
    sub: "Saber cómo va el centro sin estar físicamente y liberar al equipo del papeleo",
    icon: Building2,
    accent: "#0369a1",
    accentBg: "bg-sky-700/10",
    accentBorder: "border-sky-700/30",
    accentText: "text-sky-500",
    accentGradient: "from-sky-700/30 via-sky-700/5 to-transparent",
    image: "/centros-deportivos/b4.png",
    teaser:
      "Gestionar un centro tiene una carga administrativa enorme: turnos, contratos, averías, comunicación con familias. Lo automatizamos para que el equipo se centre en los socios, no en el papeleo.",
    paragraph:
      "Gestionar un centro deportivo tiene una carga administrativa enorme: cuadrar turnos, firmar contratos, registrar averías, avisar a padres. Automatizamos todo eso para que el equipo dedique su tiempo a los socios — no a tareas que una máquina puede hacer igual de bien o mejor.",
    benefits: [
      "Turnos organizados automáticamente sin llamadas ni grupos de mensajes caóticos",
      "Informe semanal del centro: ocupación, altas, bajas e ingresos sin prepararlo a mano",
      "Contratos firmados digitalmente y averías registradas con seguimiento hasta resolución",
    ],
  },
  {
    id: "B5",
    number: "05",
    title: "Reputación y comunidad",
    sub: "Más reseñas positivas, quejas resueltas antes de que escalen",
    icon: Star,
    accent: "#0284c7",
    accentBg: "bg-blue-600/10",
    accentBorder: "border-blue-600/30",
    accentText: "text-blue-400",
    accentGradient: "from-blue-600/30 via-blue-600/5 to-transparent",
    image: "/centros-deportivos/b5.png",
    teaser:
      "Das un buen servicio pero tus reseñas en Google no lo reflejan, y cuando alguien se queja muchas veces te enteras demasiado tarde. Pedimos reseña al socio contento en el momento adecuado y gestionamos las quejas antes de que escalen.",
    paragraph:
      "Das un buen servicio pero Google no lo refleja — y cuando alguien se queja, te enteras demasiado tarde y ya está publicado. Pedimos reseña al socio satisfecho en el momento de mayor satisfacción, capturamos las quejas a un canal privado antes de que se publiquen y hacemos una encuesta rápida después de cada sesión para detectar problemas antes de que el socio se vaya.",
    benefits: [
      "Reseñas solicitadas automáticamente al socio correcto en el momento más adecuado",
      "Quejas gestionadas con acuse de recibo inmediato antes de que se publiquen o escalen",
      "Encuesta post-sesión para detectar insatisfacción antes de que se convierta en baja",
    ],
  },
  {
    id: "B6",
    number: "06",
    title: "Marketing y contenido digital",
    sub: "Presencia activa en redes y campañas sin depender de que alguien tenga un rato",
    icon: Megaphone,
    accent: "#3b82f6",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/30",
    accentText: "text-blue-400",
    accentGradient: "from-blue-500/30 via-blue-500/5 to-transparent",
    image: "/centros-deportivos/b6.png",
    teaser:
      "El marketing del centro no puede depender de que alguien tenga un rato libre entre sesión y sesión. Publicamos novedades, activamos campañas por temporada y medimos qué canal trae más socios — sin agencia y sin briefings.",
    paragraph:
      "El marketing del centro no puede depender de que el coordinador tenga un rato libre entre sesión y sesión. Generamos publicaciones automáticas de horarios, eventos y promociones, activamos campañas de captación en los momentos de mayor demanda del año y medimos qué canal trae más socios — sin agencia y sin depender de nadie.",
    benefits: [
      "Publicaciones automáticas de novedades, horarios y promociones en redes y Google Business",
      "Campañas de captación lanzadas automáticamente en los picos del año (enero, septiembre)",
      "Informe semanal de qué canales generan más contactos y socios nuevos",
    ],
  },
];

export const getCentrosDeportivosBlockById = (id: CentrosDeportivosBlockId): CentrosDeportivosBlock | undefined =>
  centrosDeportivosBlocks.find((b) => b.id === id);
