import {
  ClipboardList,
  Factory,
  ShieldCheck,
  Truck,
  Banknote,
  HardHat,
  type LucideIcon,
} from "lucide-react";

export type BlockId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6";

export interface IndustrialBlock {
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

export const industrialBlocks: IndustrialBlock[] = [
  {
    id: "B1",
    number: "01",
    title: "Clientes y presupuestos",
    sub: "Que ninguna petición de oferta se pierda ni llegue tarde",
    icon: ClipboardList,
    accent: "#eab308",
    accentBg: "bg-yellow-500/10",
    accentBorder: "border-yellow-500/30",
    accentText: "text-yellow-400",
    accentGradient: "from-yellow-500/30 via-yellow-500/5 to-transparent",
    image: "/industrial/b1.svg",
    teaser:
      "El comercial de una industrial pierde horas recopilando datos de producto, precios y plazos antes de poder enviar un presupuesto. Mientras tanto, el cliente ya ha pedido oferta a tres competidores. Centraliza las peticiones, genera el presupuesto con los datos actualizados y haz seguimiento automático para que ninguna oferta quede en el aire.",
    paragraph:
      "Una fábrica puede perder un cliente en el tiempo que tarda en preparar un presupuesto a mano. Cuando la petición llega por email, WhatsApp o formulario web, el comercial tiene que buscar precios, consultar stock, calcular plazos y formatear el documento — proceso que puede tardar horas. Automatizamos la captura, la generación del presupuesto y el seguimiento para que el cliente reciba su oferta antes que la de la competencia.",
    benefits: [
      "Peticiones recogidas automáticamente desde cualquier canal",
      "Presupuesto generado en minutos con precios y plazos actualizados",
      "Seguimiento automático de ofertas sin que el comercial lo recuerde",
    ],
  },
  {
    id: "B2",
    number: "02",
    title: "Pedidos y producción",
    sub: "Del pedido confirmado a la orden de fabricación sin fricción",
    icon: Factory,
    accent: "#ca8a04",
    accentBg: "bg-yellow-600/10",
    accentBorder: "border-yellow-600/30",
    accentText: "text-yellow-500",
    accentGradient: "from-yellow-600/30 via-yellow-600/5 to-transparent",
    image: "/industrial/b2.svg",
    teaser:
      "Cuando entra un pedido, alguien tiene que trasladar los datos al sistema de producción, reservar materiales, asignar máquinas y poner la orden en la cola. Si ese paso es manual, hay errores, retrasos y el jefe de planta trabaja siempre con información incompleta. Automatiza el puente entre la venta y la planta.",
    paragraph:
      "El cuello de botella entre comercial y producción es uno de los puntos de mayor pérdida en la industria. Un pedido confirmado puede tardar un día en convertirse en una orden de fabricación real, con materiales reservados y maquinaria asignada. Cada hora de retraso en ese traslado comprime el plazo de entrega o genera horas extra en planta. Cerramos ese gap con un flujo automático que convierte la venta en producción al instante.",
    benefits: [
      "Orden de fabricación creada automáticamente al confirmar el pedido",
      "Panel visual del estado de cada línea en tiempo real",
      "Alertas automáticas si una orden se retrasa respecto al plazo",
    ],
  },
  {
    id: "B3",
    number: "03",
    title: "Calidad, entregas y trazabilidad",
    sub: "Cero piezas malas que salen, cero reclamaciones sin respuesta",
    icon: ShieldCheck,
    accent: "#f59e0b",
    accentBg: "bg-amber-400/10",
    accentBorder: "border-amber-400/30",
    accentText: "text-amber-300",
    accentGradient: "from-amber-400/30 via-amber-400/5 to-transparent",
    image: "/industrial/b3.svg",
    teaser:
      "Una no conformidad detectada en planta cuesta 10 veces menos que una reclamación del cliente. Y una reclamación con trazabilidad resuelta en 24 horas tiene un impacto en la relación completamente diferente a una que tarda una semana en investigarse. Pon el control de calidad y la trazabilidad en el proceso, no en la memoria de las personas.",
    paragraph:
      "La calidad en industria no puede depender de quien tiene el ojo más entrenado ese día ni de si el parte de inspección se rellenó correctamente. Necesita estar integrada en el flujo de producción, con puntos de control definidos que bloquean el avance si hay una desviación. Y cuando algo llega mal al cliente, la trazabilidad tiene que permitir localizar el lote, el operario, la máquina y la materia prima en segundos, no en días.",
    benefits: [
      "Controles de calidad integrados en el proceso que bloquean avance ante desviaciones",
      "Trazabilidad de lote y número de serie consultable en segundos",
      "Expediente de no conformidad abierto y asignado automáticamente",
    ],
  },
  {
    id: "B4",
    number: "04",
    title: "Compras y proveedores",
    sub: "Stock siempre disponible, proveedores siempre evaluados",
    icon: Truck,
    accent: "#d97706",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/30",
    accentText: "text-amber-400",
    accentGradient: "from-amber-500/30 via-amber-500/5 to-transparent",
    image: "/industrial/b4.svg",
    teaser:
      "Una rotura de stock para en planta. Y cuando se para planta, el coste por hora puede superar fácilmente al coste de haber mantenido el stock correcto. Pero comprar de más también tiene coste. El equilibrio pasa por anticipar la necesidad, lanzar el pedido en el momento exacto y recibir el material verificado antes de que entre al proceso.",
    paragraph:
      "El departamento de compras de una industrial vive entre dos fuegos: producción que necesita materiales ya y dirección que quiere reducir stock. La solución no es comprar más ni comprar menos — es comprar con la antelación correcta, al proveedor correcto y con la verificación adecuada a la entrada. Automatizamos el circuito completo, desde la detección de necesidad hasta la confirmación de recepción, con evaluación continua de proveedores integrada.",
    benefits: [
      "Solicitudes de compra lanzadas automáticamente cuando el stock baja del mínimo",
      "Recepción guiada que verifica lo recibido contra el pedido",
      "Evaluación periódica de proveedores con datos reales de entrega y calidad",
    ],
  },
  {
    id: "B5",
    number: "05",
    title: "Administración y facturación",
    sub: "Facturas generadas, cobros controlados, informes sin esperar",
    icon: Banknote,
    accent: "#b45309",
    accentBg: "bg-amber-700/10",
    accentBorder: "border-amber-700/30",
    accentText: "text-amber-500",
    accentGradient: "from-amber-700/30 via-amber-700/5 to-transparent",
    image: "/industrial/b5.svg",
    teaser:
      "En muchas industriales, la factura tarda más en generarse que la pieza en fabricarse. El albarán llega, alguien lo introduce manualmente, otro lo valida, otro genera la factura y otro la envía. Cada paso es un punto donde se puede retrasar el cobro. Y en industria, donde los plazos de cobro ya son largos por defecto, cualquier retraso adicional duele en caja.",
    paragraph:
      "Una empresa industrial que factura a 60 o 90 días no puede permitirse que la factura llegue al cliente con 15 días de retraso por burocracia interna. Automatizamos la cadena completa: del albarán firmado a la factura enviada, del seguimiento de cobro a la alerta de impago y del cuadro de mando financiero al informe mensual que dirección necesita para tomar decisiones.",
    benefits: [
      "Factura generada y enviada automáticamente al cierre del albarán",
      "Recordatorios escalonados antes y después del vencimiento",
      "Cuadro de mando con facturación, márgenes y cobros en tiempo real",
    ],
  },
  {
    id: "B6",
    number: "06",
    title: "Equipo y planta",
    sub: "Incorporaciones rápidas, turnos sin caos, máquinas siempre operativas",
    icon: HardHat,
    accent: "#fbbf24",
    accentBg: "bg-amber-300/10",
    accentBorder: "border-amber-300/30",
    accentText: "text-amber-200",
    accentGradient: "from-amber-300/30 via-amber-300/5 to-transparent",
    image: "/industrial/b6.svg",
    teaser:
      "En planta, una máquina parada por falta de mantenimiento puede costar más en un día que el mantenimiento preventivo de un año. Y un operario que lleva dos semanas sin saber quién cubre la próxima semana es un operario que busca trabajo en otro sitio. La gestión del equipo y la planta necesita sistemas, no buena memoria.",
    paragraph:
      "La rotación en industria es un problema creciente, y cada incorporación que no arranca bien en el primer día es tiempo y producción perdidos. Los grupos de WhatsApp de turnos son ingobernables en cuanto el equipo supera los 10 operarios. Y el mantenimiento que 'está pendiente de programar' se convierte inevitablemente en una avería en el peor momento. Ponemos orden en los tres frentes con automatizaciones específicas para entorno industrial.",
    benefits: [
      "Onboarding automático: documentación, accesos y formación desde el primer día",
      "Turnos individuales con confirmación, sin grupos caóticos",
      "Plan de mantenimiento preventivo con alertas antes de que caduque cada revisión",
    ],
  },
];

export const getBlockById = (id: BlockId): IndustrialBlock | undefined =>
  industrialBlocks.find((b) => b.id === id);
