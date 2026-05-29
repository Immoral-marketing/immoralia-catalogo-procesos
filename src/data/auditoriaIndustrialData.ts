// Datos de la auditoría de madurez operativa para empresas industriales.
// Sector: metalurgia, alimentación, química/plástico, electrónica, textil, madera y otras industrias manufactureras.

import type { Process } from "./processes";

export type IndAuditQuestion =
  | {
      type: "choice";
      cat: string;
      title: string;
      help?: string;
      options: { k: string; label: string }[];
      scoreless?: true;
      multiselect?: boolean;
      priority?: boolean;
    }
  | {
      type: "scale";
      cat: string;
      title: string;
      help?: string;
      block: IndAuditBlockId;
      /** Etiquetas personalizadas para los 5 puntos de la escala. Si no se define, se usa el genérico Nada/Poco/A medias/Bastante/Totalmente. */
      scaleLabels?: [string, string, string, string, string];
      /** Texto bajo la escala (extremos). Si no se define, se usa "1 — No lo hacemos" / "5 — Es sistemático". */
      scaleHints?: [string, string];
    };

export type IndAuditBlockId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6";

export interface IndAuditBlock {
  id: IndAuditBlockId;
  name: string;
  short: string;
  tips: string[];
}

export interface IndAuditModule {
  ref: string;
  name: string;
  impact: string;
  desc: string;
}

export interface IndAuditLevel {
  min: number;
  max: number;
  name: string;
  desc: string;
}

export const IND_AUDIT_QUESTIONS: IndAuditQuestion[] = [
  // ─── Contexto (scoreless) ───────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Qué tipo de empresa industrial diriges?",
    scoreless: true,
    options: [
      { k: "A", label: "Metalurgia y mecanizado" },
      { k: "B", label: "Alimentación y bebidas" },
      { k: "C", label: "Química / plástico / caucho" },
      { k: "D", label: "Electrónica / eléctrica" },
      { k: "E", label: "Textil / calzado / cuero" },
      { k: "F", label: "Madera / mueble" },
      { k: "G", label: "Otra industria manufacturera" },
    ],
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Qué tamaño tiene la plantilla?",
    scoreless: true,
    options: [
      { k: "A", label: "Entre 1 y 10 personas" },
      { k: "B", label: "Entre 11 y 25 personas" },
      { k: "C", label: "Entre 26 y 50 personas" },
      { k: "D", label: "Entre 51 y 100 personas" },
      { k: "E", label: "Más de 100 personas" },
    ],
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Por qué canales entran las peticiones de cliente?",
    scoreless: true,
    multiselect: true,
    options: [
      { k: "A", label: "Email directo" },
      { k: "B", label: "Llamada telefónica" },
      { k: "C", label: "WhatsApp" },
      { k: "D", label: "Formulario web" },
      { k: "E", label: "Comerciales en visita" },
      { k: "F", label: "Plataformas o marketplaces B2B" },
      { k: "G", label: "Distribuidores" },
    ],
  },
  // ─── B1 Clientes y presupuestos ─────────────────────────────────────────────
  {
    type: "scale",
    cat: "Clientes y presupuestos",
    title:
      "¿Cuánto tarda vuestro comercial en enviar un presupuesto desde que entra la petición del cliente?",
    help: "1 = Días, con búsqueda manual de precios y plazos en varios sitios; 5 = Horas, con generación automática a partir de plantillas y datos actualizados",
    block: "B1",
    scaleLabels: ["Días", "Mucho", "Medio día", "Pocas horas", "Minutos"],
    scaleHints: ["1 — Días buscando datos", "5 — Generación automática"],
  },
  {
    type: "scale",
    cat: "Clientes y presupuestos",
    title:
      "¿Hacéis seguimiento sistemático de las ofertas enviadas que aún no se han cerrado para que ninguna quede en el aire?",
    help: "1 = Se olvidan en cuanto el comercial pasa al siguiente cliente; 5 = Recordatorios automáticos escalonados hasta el cierre o el archivo justificado",
    block: "B1",
    scaleLabels: ["Nunca", "Rara vez", "A veces", "Casi siempre", "Automático"],
    scaleHints: ["1 — Se olvidan", "5 — Recordatorios automáticos"],
  },
  // ─── B2 Pedidos y producción ────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Pedidos y producción",
    title:
      "Cuando se confirma un pedido, ¿cuánto tarda en convertirse en orden de fabricación con materiales reservados y máquina asignada?",
    help: "1 = Un día o más, con traspaso manual de datos; 5 = Automático en minutos, la planta lo ve nada más confirmar el comercial",
    block: "B2",
    scaleLabels: ["Un día+", "Horas", "Mismo día", "Pocas horas", "Minutos"],
    scaleHints: ["1 — Traspaso manual", "5 — Automático en minutos"],
  },
  {
    type: "scale",
    cat: "Pedidos y producción",
    title:
      "¿Tenéis visibilidad en tiempo real del estado de cada orden en planta sin depender de preguntar al jefe de producción?",
    help: "1 = Hay que preguntar al jefe de planta para saber por dónde va cada cosa; 5 = Panel visual con el estado de cada orden y alertas si algo va tarde",
    block: "B2",
    scaleLabels: ["Preguntando", "Algún dato", "A medias", "Bastante", "Panel total"],
    scaleHints: ["1 — Hay que preguntar", "5 — Panel en tiempo real"],
  },
  // ─── B3 Calidad, entregas y trazabilidad ────────────────────────────────────
  {
    type: "scale",
    cat: "Calidad, entregas y trazabilidad",
    title:
      "¿Los controles de calidad están integrados en el proceso y bloquean el avance si hay una desviación, en lugar de detectarse al final?",
    help: "1 = Inspección final si acaso, depende del ojo del operario; 5 = Controles automáticos en cada hito que bloquean el avance ante desviación",
    block: "B3",
    scaleLabels: ["Solo final", "Algún punto", "A medias", "Casi todos", "Integrado"],
    scaleHints: ["1 — Inspección al final", "5 — Bloqueante en cada hito"],
  },
  {
    type: "scale",
    cat: "Calidad, entregas y trazabilidad",
    title:
      "Si llega una reclamación, ¿cuánto tardáis en localizar el lote, la máquina, el operario y la materia prima involucrados?",
    help: "1 = Días investigando entre papeles y memorias; 5 = Segundos consultando la trazabilidad digital",
    block: "B3",
    scaleLabels: ["Días", "Horas", "1 hora", "Minutos", "Segundos"],
    scaleHints: ["1 — Días investigando", "5 — Segundos consultando"],
  },
  // ─── B4 Compras y proveedores ───────────────────────────────────────────────
  {
    type: "scale",
    cat: "Compras y proveedores",
    title:
      "¿Las solicitudes de compra se lanzan automáticamente cuando el stock de cada referencia baja del mínimo?",
    help: "1 = Se descubre cuando para planta o falta material para un pedido; 5 = Pedido automático con propuesta de proveedor antes de que el stock se agote",
    block: "B4",
    scaleLabels: ["Manual", "Algunos", "A medias", "Mayoría", "Automático"],
    scaleHints: ["1 — Solo cuando falta", "5 — Pedido anticipado"],
  },
  {
    type: "scale",
    cat: "Compras y proveedores",
    title:
      "¿Tenéis evaluación continua de proveedores con datos reales de plazo de entrega, calidad y incidencias?",
    help: "1 = Nunca evaluáis o solo cuando hay un problema gordo; 5 = Scorecard mensual con datos objetivos y revisión periódica con cada proveedor",
    block: "B4",
    scaleLabels: ["Nunca", "Si hay problema", "Esporádica", "Periódica", "Continua"],
    scaleHints: ["1 — Nunca", "5 — Scorecard mensual"],
  },
  // ─── B5 Administración y facturación ────────────────────────────────────────
  {
    type: "scale",
    cat: "Administración y facturación",
    title:
      "¿La factura se genera y envía automáticamente al cliente en cuanto se cierra el albarán de entrega?",
    help: "1 = Administración la hace a mano días después; 5 = La factura sale el mismo día con copia al cliente y registro en el sistema",
    block: "B5",
    scaleLabels: ["Manual y tarde", "A veces", "A medias", "Casi siempre", "Automático"],
    scaleHints: ["1 — A mano, días después", "5 — Al cerrar el albarán"],
  },
  {
    type: "scale",
    cat: "Administración y facturación",
    title:
      "¿Tenéis un cuadro de mando con facturación, márgenes y cobros pendientes en tiempo real, o esperáis al cierre del mes?",
    help: "1 = Todo a fin de mes y a mano por administración; 5 = Dashboard diario con los datos clave para dirección",
    block: "B5",
    scaleLabels: ["Fin de mes", "Mensual", "Semanal", "Diario", "Tiempo real"],
    scaleHints: ["1 — Todo a fin de mes", "5 — Dashboard diario"],
  },
  // ─── B6 Equipo y planta ─────────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Equipo y planta",
    title:
      "¿Los turnos se gestionan de forma individual con confirmación por operario, en lugar de en un grupo de WhatsApp o en una pizarra?",
    help: "1 = Grupo de WhatsApp caótico y nadie sabe quién entra mañana; 5 = Turno individual con confirmación y aviso de cambios al instante",
    block: "B6",
    scaleLabels: ["Grupo WhatsApp", "Pizarra", "A medias", "Individual", "Confirmado"],
    scaleHints: ["1 — Grupo caótico", "5 — Individual con confirmación"],
  },
  {
    type: "scale",
    cat: "Equipo y planta",
    title:
      "¿Tenéis un plan de mantenimiento preventivo de máquinas con alertas automáticas antes de cada revisión?",
    help: "1 = Se hace mantenimiento cuando algo se rompe; 5 = Preventivo programado por máquina con alertas y registro de cada intervención",
    block: "B6",
    scaleLabels: ["Reactivo", "Algún plan", "A medias", "Planificado", "Con alertas"],
    scaleHints: ["1 — Se arregla al romper", "5 — Preventivo con alertas"],
  },
  // ─── Madurez digital (scoreless) ────────────────────────────────────────────
  {
    type: "choice",
    cat: "Madurez digital",
    title: "¿Qué sistemas digitales usáis hoy en la empresa?",
    scoreless: true,
    options: [
      { k: "A", label: "Excel y papel — sin ERP" },
      { k: "B", label: "ERP básico, solo para facturación y contabilidad" },
      { k: "C", label: "ERP completo de gestión integral" },
      { k: "D", label: "ERP + sistema de planta (MES) integrados" },
      { k: "E", label: "ERP + MES + sistemas avanzados (BI, mantenimiento, calidad)" },
    ],
  },
  // ─── Riesgo de concentración (scoreless) ────────────────────────────────────
  {
    type: "choice",
    cat: "Riesgo de concentración",
    title: "¿Qué porcentaje de vuestra facturación representa el top 3 de clientes?",
    scoreless: true,
    options: [
      { k: "A", label: "Menos del 20% — base de clientes muy diversificada" },
      { k: "B", label: "Entre el 20% y el 40% — concentración baja" },
      { k: "C", label: "Entre el 40% y el 60% — concentración media" },
      { k: "D", label: "Más del 60% — concentración alta, dependemos de pocos clientes" },
    ],
  },
  // ─── Calidad y cumplimiento (scoreless multiselect) ─────────────────────────
  {
    type: "choice",
    cat: "Calidad y cumplimiento",
    title: "¿Qué certificaciones tenéis activas hoy en la empresa?",
    scoreless: true,
    multiselect: true,
    options: [
      { k: "A", label: "ISO 9001 — Calidad" },
      { k: "B", label: "ISO 14001 — Medio ambiente" },
      { k: "C", label: "ISO 45001 — Seguridad y salud laboral" },
      { k: "D", label: "IATF 16949 — Automoción" },
      { k: "E", label: "BRC / IFS — Alimentación" },
      { k: "F", label: "Certificación sectorial específica" },
      { k: "G", label: "Ninguna por ahora" },
    ],
  },
  // ─── Resiliencia (scoreless) ────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Resiliencia",
    title: "Si mañana no viene el jefe de planta, ¿qué pasa?",
    scoreless: true,
    options: [
      { k: "A", label: "Caos absoluto — todo el conocimiento operativo depende de él" },
      { k: "B", label: "Hay un backup parcial pero se nota mucho su falta" },
      { k: "C", label: "Hay un backup completo formado que puede cubrirle" },
      { k: "D", label: "Todo está documentado y el sistema funciona sin él" },
    ],
  },
  // ─── Prioridades (scoreless) ────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cuáles son los problemas que más os urge resolver ahora mismo?",
    scoreless: true,
    priority: true,
    multiselect: true,
    options: [
      { k: "A", label: "Acortar el tiempo de respuesta a peticiones de cliente" },
      { k: "B", label: "Reducir el caos entre comercial y producción" },
      { k: "C", label: "Mejorar la trazabilidad y reducir reclamaciones" },
      { k: "D", label: "Anticipar roturas de stock y evaluar mejor a proveedores" },
      { k: "E", label: "Automatizar facturación y acelerar cobros" },
      { k: "F", label: "Ordenar turnos y mantenimiento de planta" },
    ],
  },
  // ─── Inversión (scoreless) ──────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Qué inversión mensual contempláis para automatizar procesos?",
    scoreless: true,
    options: [
      { k: "A", label: "Menos de 500 €/mes" },
      { k: "B", label: "Entre 500 € y 1.500 €/mes" },
      { k: "C", label: "Entre 1.500 € y 3.000 €/mes" },
      { k: "D", label: "Más de 3.000 €/mes" },
    ],
  },
];

export const IND_AUDIT_BLOCKS: Record<IndAuditBlockId, IndAuditBlock> = {
  B1: {
    id: "B1",
    name: "Clientes y presupuestos",
    short: "Captura de peticiones, generación de ofertas y seguimiento comercial",
    tips: [
      "El 70% de las industriales pierden el primer pedido por tardar más de un día en presupuestar — automatizar la respuesta cierra el gap antes de que el cliente pida a la competencia",
      "El comercial dedica de media 4 horas semanales solo a recopilar datos para preparar ofertas — tiempo que debería estar visitando clientes",
    ],
  },
  B2: {
    id: "B2",
    name: "Pedidos y producción",
    short: "Conversión automática de pedido a orden de fabricación y visibilidad en planta",
    tips: [
      "El cuello de botella entre comercial y producción es uno de los puntos donde más se pierde margen — cada hora de retraso comprime el plazo o genera horas extra en planta",
      "Un panel de planta visible elimina las llamadas de 'oye, ¿por dónde va el pedido X?' que interrumpen al jefe de producción 20 veces al día",
    ],
  },
  B3: {
    id: "B3",
    name: "Calidad, entregas y trazabilidad",
    short: "Controles integrados, trazabilidad por lote y gestión de no conformidades",
    tips: [
      "Una no conformidad detectada en planta cuesta entre 5 y 10 veces menos que una reclamación del cliente — y muchísimas veces menos que una devolución",
      "Resolver una reclamación en 24 horas con trazabilidad completa tiene un impacto en la relación con el cliente radicalmente distinto a hacerlo en una semana investigando entre papeles",
    ],
  },
  B4: {
    id: "B4",
    name: "Compras y proveedores",
    short: "Pedidos automáticos por stock mínimo, recepción guiada y evaluación continua",
    tips: [
      "Una rotura de stock que para una línea de producción puede costar más en un solo día que el stock de seguridad de todo un trimestre",
      "Evaluar proveedores con datos reales (no con percepción) suele revelar que el proveedor más barato es el más caro cuando se cuentan retrasos e incidencias",
    ],
  },
  B5: {
    id: "B5",
    name: "Administración y facturación",
    short: "Facturación automática, seguimiento de cobros y cuadro de mando financiero",
    tips: [
      "En una industrial que factura a 60 o 90 días, retrasar 15 días la emisión por burocracia interna equivale a financiar gratis al cliente — y a tensar tu caja",
      "Un cuadro de mando diario con facturación, márgenes y cobros pendientes evita decisiones a ciegas hasta el cierre de mes",
    ],
  },
  B6: {
    id: "B6",
    name: "Equipo y planta",
    short: "Turnos individuales, onboarding y mantenimiento preventivo de máquinas",
    tips: [
      "Una máquina parada por avería que se podría haber prevenido cuesta de media entre 8 y 20 veces lo que habría costado el mantenimiento preventivo",
      "Los grupos de WhatsApp para gestionar turnos dejan de ser viables en cuanto el equipo supera los 10 operarios — y cada confusión es una hora de producción perdida",
    ],
  },
};

export const IND_AUDIT_LEVELS: IndAuditLevel[] = [
  {
    min: 0,
    max: 39,
    name: "Industria reactiva",
    desc: "Tu planta depende de que las personas clave estén presentes para que las cosas pasen. Presupuestos hechos a mano, pedidos que tardan en bajar a planta y mantenimiento cuando algo se rompe. Es el punto donde activar dos o tres módulos tiene impacto visible antes del próximo trimestre.",
  },
  {
    min: 40,
    max: 59,
    name: "En transición digital",
    desc: "Tienes algunas piezas montadas pero el sistema todavía depende demasiado de la memoria del equipo. La oportunidad está en cerrar los huecos: automatizar el puente entre comercial y producción, blindar la trazabilidad y poner los cobros en piloto automático.",
  },
  {
    min: 60,
    max: 79,
    name: "Planta sistematizada",
    desc: "Tu operativa ya cubre los frentes principales. La siguiente capa de valor está en explotar los datos: anticipar roturas de stock con varias semanas, programar mantenimiento por desgaste real y convertir la calidad en argumento comercial frente a la competencia.",
  },
  {
    min: 80,
    max: 100,
    name: "Industria de referencia",
    desc: "Estás en el percentil alto de la industria española moderna. La conversación ahora es de optimización fina: análisis de rendimiento por máquina y turno, predicción de demanda y escalado del sistema a nuevas líneas o plantas sin perder control.",
  },
];

export const IND_AUDIT_BLOCK_KEYS: IndAuditBlockId[] = ["B1", "B2", "B3", "B4", "B5", "B6"];

export function buildIndModulesByBlock(
  allProcesses: Process[]
): Record<IndAuditBlockId, IndAuditModule[]> {
  const ind = allProcesses.filter(
    (p) => p.landing_slug === "industrial" && p.bloque_negocio && !p.hidden
  );
  const result = {} as Record<IndAuditBlockId, IndAuditModule[]>;
  for (const b of IND_AUDIT_BLOCK_KEYS) {
    result[b] = ind
      .filter((p) => p.bloque_negocio === b)
      .sort((a, c) => (a.modulo_codigo ?? "").localeCompare(c.modulo_codigo ?? ""))
      .map((p) => ({
        ref: `Módulo ${p.modulo_codigo ?? p.codigo}`,
        name: p.nombre,
        desc: p.descripcionDetallada,
        impact: p.tagline,
      }));
  }
  return result;
}

// ─── Mapas para el payload de GHL ────────────────────────────────────────────
export const IND_AUDIT_TIPO_EMPRESA: Record<string, string> = {
  A: "Metalurgia y mecanizado",
  B: "Alimentación y bebidas",
  C: "Química / plástico / caucho",
  D: "Electrónica / eléctrica",
  E: "Textil / calzado / cuero",
  F: "Madera / mueble",
  G: "Otra industria manufacturera",
};

export const IND_AUDIT_TAMANO_PLANTILLA: Record<string, string> = {
  A: "Entre 1 y 10 personas",
  B: "Entre 11 y 25 personas",
  C: "Entre 26 y 50 personas",
  D: "Entre 51 y 100 personas",
  E: "Más de 100 personas",
};

export const IND_AUDIT_CANALES: Record<string, string> = {
  A: "Email directo",
  B: "Llamada telefónica",
  C: "WhatsApp",
  D: "Formulario web",
  E: "Comerciales en visita",
  F: "Plataformas o marketplaces B2B",
  G: "Distribuidores",
};

export const IND_AUDIT_PRIORIDADES: Record<string, string> = {
  A: "Acortar el tiempo de respuesta a peticiones de cliente",
  B: "Reducir el caos entre comercial y producción",
  C: "Mejorar la trazabilidad y reducir reclamaciones",
  D: "Anticipar roturas de stock y evaluar mejor a proveedores",
  E: "Automatizar facturación y acelerar cobros",
  F: "Ordenar turnos y mantenimiento de planta",
};

export const IND_AUDIT_SISTEMAS_DIGITALES: Record<string, string> = {
  A: "Excel y papel — sin ERP",
  B: "ERP básico solo para facturación",
  C: "ERP completo de gestión integral",
  D: "ERP + sistema de planta (MES) integrados",
  E: "ERP + MES + sistemas avanzados",
};

export const IND_AUDIT_CERTIFICACIONES: Record<string, string> = {
  A: "ISO 9001 — Calidad",
  B: "ISO 14001 — Medio ambiente",
  C: "ISO 45001 — Seguridad y salud laboral",
  D: "IATF 16949 — Automoción",
  E: "BRC / IFS — Alimentación",
  F: "Certificación sectorial específica",
  G: "Ninguna por ahora",
};

export const IND_AUDIT_RIESGO_CLAVE: Record<string, string> = {
  A: "Caos absoluto — todo depende del jefe de planta",
  B: "Backup parcial — se nota mucho su falta",
  C: "Backup completo formado",
  D: "Todo documentado — el sistema funciona sin él",
};
