import {
 Filter,
 TrendingUp,
 CalendarCheck,
 HardHat,
 Wallet,
 LayoutDashboard,
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
 title: "Captación y cualificación",
 sub: "Saber quién tiene intención real de compra antes de invertir tiempo del equipo",
 icon: Filter,
 accent: "#22c55e",
 accentBg: "bg-green-500/10",
 accentBorder: "border-green-500/30",
 accentText: "text-green-400",
 accentGradient: "from-green-500/30 via-green-500/5 to-transparent",
 image: "/constructoras/b1.webp",
 teaser:
 "Le entran consultas por muchos canales, pero no sabe cuáles tienen presupuesto, urgencia y financiamiento real. La IA evalúa cada interesado en segundos para que su equipo hable solo con quien puede comprar.",
 paragraph:
 "Le entran consultas por muchos canales, pero no sabe cuáles tienen presupuesto, urgencia y financiamiento real, y el equipo pierde tiempo con interesados que no avanzan. La IA evalúa cada contacto en segundos, avisa a tiempo cuando un interesado se enfría y mantiene a dirección con el estado de la comercialización al día, sin perseguir a nadie.",
 benefits: [
 "Priorización automática por presupuesto, urgencia y financiamiento",
 "Alerta temprana cuando un interesado se enfría",
 "Panel de control comercial en tiempo real para dirección",
 ],
 },
 {
 id: "B2",
 number: "02",
 title: "Conversión y cierre",
 sub: "Del interés a la reserva firmada, con el material correcto y sin papeleo manual",
 icon: TrendingUp,
 accent: "#16a34a",
 accentBg: "bg-green-600/10",
 accentBorder: "border-green-600/30",
 accentText: "text-green-500",
 accentGradient: "from-green-600/30 via-green-600/5 to-transparent",
 image: "/constructoras/b2.webp",
 teaser:
 "Su equipo improvisa argumentos, arma fichas a mano y pierde cierres en el papeleo. La IA le da el material adecuado para cada comprador y lleva la reserva hasta la firma digital sin fricción.",
 paragraph:
 "Su equipo necesita responder dudas técnicas, adaptar el discurso a cada comprador y armar fichas y contratos sobre la marcha, y muchas veces improvisa o se atrasa en el papeleo. El sistema responde dudas al instante, genera la ficha de cada unidad en segundos, adapta la presentación al perfil del comprador y lleva la reserva a firma digital con seguimiento, para cerrar en caliente.",
 benefits: [
 "Asistente y ficha de unidad listos en segundos para el comprador",
 "Presentación adaptada al perfil de cada interesado",
 "Contrato de reserva a firma digital, sin enfriar la venta",
 ],
 },
 {
 id: "B3",
 number: "03",
 title: "Seguimiento y visitas",
 sub: "Interesados que no se enfrían y visitas que sí se producen",
 icon: CalendarCheck,
 accent: "#4ade80",
 accentBg: "bg-green-400/10",
 accentBorder: "border-green-400/30",
 accentText: "text-green-300",
 accentGradient: "from-green-400/30 via-green-400/5 to-transparent",
 image: "/constructoras/b3.webp",
 teaser:
 "En obra nueva pasan meses entre el interés y la entrega, y coordinar visitas y seguimiento consume horas cada semana. Lo automatizamos de principio a fin.",
 paragraph:
 "Un interesado que visita el proyecto tiene mucha más probabilidad de comprar, pero el ciclo largo de la obra lo enfría y coordinar visitas, recordatorios y seguimiento consume horas del equipo. Automatizamos el seguimiento durante los meses de obra, la agenda de visitas con recordatorios y check-in, y el seguimiento tras la visita para recuperar a quien quedó con dudas.",
 benefits: [
 "Seguimiento automático durante los meses de obra",
 "Agenda de visitas con recordatorios y check-in",
 "Recuperación de interesados tras la visita",
 ],
 },
 {
 id: "B4",
 number: "04",
 title: "Obra y proveedores",
 sub: "Que la obra y la oficina trabajen con la misma información, al día",
 icon: HardHat,
 accent: "#15803d",
 accentBg: "bg-green-700/10",
 accentBorder: "border-green-700/30",
 accentText: "text-green-500",
 accentGradient: "from-green-700/30 via-green-700/5 to-transparent",
 image: "/constructoras/b4.webp",
 teaser:
 "Los reportes de avance toman días, los documentos de proveedor se digitan a mano y los trámites se pasan de fecha. La IA conecta la obra con la oficina y mantiene todo al día.",
 paragraph:
 "La mayor parte del margen se gana o se pierde en la ejecución: reportes de avance que toman días, albaranes y facturas de proveedor digitados a mano, permisos que se pasan de fecha y documentación dispersa. Automatizamos el reporte de avance de obra, la lectura de documentos de proveedor, la gestión de permisos y trámites, el control documental del proyecto y la revisión de cumplimiento normativo.",
 benefits: [
 "Reporte de avance de obra automático, en minutos",
 "Albaranes y facturas de proveedor leídos y conciliados solos",
 "Permisos, trámites y normativa bajo control, sin retrasos",
 ],
 },
 {
 id: "B5",
 number: "05",
 title: "Finanzas y cobros",
 sub: "Proteger el flujo de caja del proyecto sin perseguir pagos a mano",
 icon: Wallet,
 accent: "#10b981",
 accentBg: "bg-emerald-500/10",
 accentBorder: "border-emerald-500/30",
 accentText: "text-emerald-400",
 accentGradient: "from-emerald-500/30 via-emerald-500/5 to-transparent",
 image: "/constructoras/b5.webp",
 teaser:
 "La cobranza consume horas, cuadrar pagos genera errores y el reporte a inversionistas toma días. Automatizamos las finanzas del proyecto para proteger la caja.",
 paragraph:
 "El control de cobros es tan crítico como el de costos: un atraso golpea el flujo de caja del proyecto. Automatizamos los recordatorios de cuotas atrasadas, la conciliación de pagos y el estado de cuenta de cada comprador, la facturación de cada pago y el reporte a inversionistas con avance comercial, de obra y de caja, para que dirección decida con datos al día.",
 benefits: [
 "Recordatorios automáticos de cuotas atrasadas",
 "Pagos conciliados y estado de cuenta del comprador al día",
 "Facturación automática y reporte a inversionistas sin armarlo a mano",
 ],
 },
 {
 id: "B6",
 number: "06",
 title: "Postventa y dirección",
 sub: "Compradores satisfechos y dirección con visibilidad total de los proyectos",
 icon: LayoutDashboard,
 accent: "#22c55e",
 accentBg: "bg-green-500/10",
 accentBorder: "border-green-500/30",
 accentText: "text-green-400",
 accentGradient: "from-green-500/30 via-green-500/5 to-transparent",
 image: "/constructoras/b6.webp",
 teaser:
 "La relación no termina con la entrega de llaves, y dirección no siempre ve a tiempo lo que se traba. Ordenamos la postventa y le damos a dirección la vista de todos los proyectos.",
 paragraph:
 "Después de la entrega, las consultas de garantías e incidencias desbordan al equipo, y la dirección descubre demasiado tarde las unidades estancadas o los proyectos que se desvían. Ordenamos la entrega de cada vivienda, el portal de incidencias y las garantías por plazos, detectamos las unidades que no avanzan y le damos a dirección un panel con el estado de todos los proyectos a la vez.",
 benefits: [
 "Entrega digital, portal de incidencias y garantías bajo control",
 "Detección automática de unidades estancadas",
 "Panel ejecutivo con todos los proyectos en una sola vista",
 ],
 },
];

export const getConstruccionBlockById = (id: ConstruccionBlockId): ConstruccionBlock | undefined =>
 construccionBlocks.find((b) => b.id === id);
