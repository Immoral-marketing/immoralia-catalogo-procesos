// Datos de la auditoría de madurez operativa para gestorías y asesorías.
// Sector: fiscal, laboral, integral, despachos profesionales.

import type { Process } from "./processes";

export type GsAuditQuestion =
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
      block: GsAuditBlockId;
    };

export type GsAuditBlockId = "B1" | "B2" | "B3" | "B4" | "B5" | "B6";

export interface GsAuditBlock {
  id: GsAuditBlockId;
  name: string;
  short: string;
  tips: string[];
}

export interface GsAuditModule {
  ref: string;
  name: string;
  impact: string;
  desc: string;
}

export interface GsAuditLevel {
  min: number;
  max: number;
  name: string;
  desc: string;
}

export const GS_AUDIT_QUESTIONS: GsAuditQuestion[] = [
  // ─── Contexto (scoreless) ───────────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Qué tipo de gestoría o asesoría diriges?",
    scoreless: true,
    options: [
      { k: "A", label: "Asesoría fiscal y contable" },
      { k: "B", label: "Gestoría laboral y RRHH" },
      { k: "C", label: "Gestoría integral (fiscal + laboral + contable)" },
      { k: "D", label: "Despacho profesional (abogados / economistas)" },
      { k: "E", label: "Asesoría de empresas multi-sede o franquicia" },
    ],
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cuántos clientes activos gestionáis actualmente?",
    scoreless: true,
    options: [
      { k: "A", label: "Menos de 50 clientes" },
      { k: "B", label: "Entre 50 y 150 clientes" },
      { k: "C", label: "Entre 150 y 400 clientes" },
      { k: "D", label: "Más de 400 clientes / varias sedes" },
    ],
  },
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Por qué canal contactan habitualmente los nuevos clientes?",
    scoreless: true,
    multiselect: true,
    options: [
      { k: "A", label: "Web propia / formularios online" },
      { k: "B", label: "Referidos de clientes actuales" },
      { k: "C", label: "Teléfono" },
      { k: "D", label: "WhatsApp" },
      { k: "E", label: "Email directo" },
    ],
  },
  // ─── B1 Alta y captación de clientes ────────────────────────────────────────
  {
    type: "scale",
    cat: "Alta y captación",
    title:
      "Cuando llega un cliente potencial, ¿cuánto tardas en enviarle un presupuesto personalizado y, si dice que sí, cuánto tarda en estar dado de alta con contrato firmado?",
    help: "1 = El presupuesto se prepara a mano en días y el alta requiere llamadas y papel; 5 = Presupuesto enviado en minutos y alta completa con contrato firmado digitalmente sin intervención",
    block: "B1",
  },
  {
    type: "scale",
    cat: "Alta y captación",
    title:
      "¿Los contratos de servicios y representación se generan, envían y firman digitalmente sin que nadie tenga que imprimir, escanear ni desplazarse?",
    help: "1 = Aún se imprimen, se firman a mano y se escanean; 5 = Generación y firma digital con validez legal completa, archivo automático y cero papel",
    block: "B1",
  },
  // ─── B2 Gestión documental ────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Gestión documental",
    title:
      "¿La documentación mensual de cada cliente llega a tiempo y completa sin que el equipo tenga que recordárselo manualmente?",
    help: "1 = Siempre hay que llamar o escribir; hay clientes que entregan tarde o a trozos; 5 = Sistema automático que recuerda y hace seguimiento hasta que llega todo, sin intervención",
    block: "B2",
  },
  {
    type: "scale",
    cat: "Gestión documental",
    title:
      "¿Los documentos de los clientes se clasifican y archivan solos, y el sistema avisa antes de que un certificado, poder o contrato caduque?",
    help: "1 = Todo a mano, los certificados caducados nos pillan por sorpresa; 5 = Clasificación automática y alertas preventivas de caducidad sin trabajo manual",
    block: "B2",
  },
  // ─── B3 Fiscal y vencimientos ─────────────────────────────────────────────
  {
    type: "scale",
    cat: "Fiscal y vencimientos",
    title:
      "¿El equipo tiene visibilidad automática de todos los vencimientos fiscales del próximo mes, con tiempo suficiente para pedir la documentación al cliente antes del plazo?",
    help: "1 = Dependemos de la memoria o de mirar la agenda cada semana; 5 = Alertas automáticas de cada vencimiento con antelación configurable para equipo y cliente",
    block: "B3",
  },
  {
    type: "scale",
    cat: "Fiscal y vencimientos",
    title:
      "¿Los clientes saben en qué estado está su trámite sin tener que llamar a la gestoría para preguntarlo?",
    help: "1 = Recibimos llamadas constantes preguntando por el estado; 5 = El cliente recibe actualizaciones automáticas cada vez que hay un avance relevante",
    block: "B3",
  },
  // ─── B4 Laboral y nóminas ────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Laboral y nóminas",
    title:
      "Cuando un cliente comunica un alta de empleado, ¿los datos llegan completos y estructurados sin tener que perseguirlos por WhatsApp en varias idas y venidas?",
    help: "1 = Los datos llegan a trozos y siempre falta algo; 5 = Formulario automático enviado al empleado que devuelve todo listo para tramitar sin intervención",
    block: "B4",
  },
  {
    type: "scale",
    cat: "Laboral y nóminas",
    title:
      "¿Las nóminas se distribuyen automáticamente a cada empleado al cerrar el mes, y el sistema avisa antes de que venza un contrato temporal de un cliente?",
    help: "1 = Los envíos son manuales y los vencimientos de contratos temporales nos pillan; 5 = Distribución automática al cerrar nóminas y alertas previas de contratos temporales",
    block: "B4",
  },
  // ─── B5 Relación con el cliente ──────────────────────────────────────────
  {
    type: "scale",
    cat: "Relación con el cliente",
    title:
      "¿El equipo tiene acceso inmediato al historial completo de cada cliente y cada llamada queda resumida y registrada automáticamente en el CRM?",
    help: "1 = Dependemos de la memoria o de notas sueltas; 5 = Historial completo en el CRM con resúmenes automáticos de cada interacción accesibles desde cualquier dispositivo",
    block: "B5",
  },
  // ─── B6 Operativa interna ────────────────────────────────────────────────
  {
    type: "scale",
    cat: "Operativa interna",
    title:
      "¿Los gastos e ingresos de la propia gestoría se registran automáticamente y la conciliación bancaria mensual no ocupa más de 15 minutos?",
    help: "1 = Llevamos nuestras propias cuentas en Excel y la conciliación es un trabajo de horas; 5 = Registro automático y conciliación bancaria sin trabajo manual",
    block: "B6",
  },
  // ─── Prioridades (scoreless) ─────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Cuál es el problema que más te urge resolver ahora mismo?",
    scoreless: true,
    priority: true,
    options: [
      { k: "A", label: "Reducir el tiempo que se pierde reclamando documentación a los clientes" },
      { k: "B", label: "Que ningún plazo fiscal o laboral se pase por un despiste" },
      { k: "C", label: "Agilizar el alta de nuevos clientes y la firma de contratos" },
      { k: "D", label: "Mejorar la relación y comunicación con los clientes existentes" },
      { k: "E", label: "Poner orden en la operativa interna de la gestoría" },
    ],
  },
  // ─── Inversión (scoreless) ───────────────────────────────────────────────
  {
    type: "choice",
    cat: "Contexto",
    title: "¿Qué inversión mensual contemplas para automatizar procesos en tu gestoría?",
    scoreless: true,
    options: [
      { k: "A", label: "Menos de 300 €/mes" },
      { k: "B", label: "Entre 300 € y 600 €/mes" },
      { k: "C", label: "Entre 600 € y 1.200 €/mes" },
      { k: "D", label: "Más de 1.200 €/mes" },
    ],
  },
];

export const GS_AUDIT_BLOCKS: Record<GsAuditBlockId, GsAuditBlock> = {
  B1: {
    id: "B1",
    name: "Alta y captación de clientes",
    short: "Presupuesto automático, alta sin papeles y contrato firmado digitalmente",
    tips: [
      "El cliente que pide información a tres gestorías se queda con la que responde primero — no con la más barata",
      "Un proceso de alta automatizado puede reducir el tiempo de onboarding de días a menos de una hora",
    ],
  },
  B2: {
    id: "B2",
    name: "Gestión documental",
    short: "Recogida mensual automática, clasificación por IA y alertas de caducidad",
    tips: [
      "Los recordatorios automáticos de documentación reducen las entregas tardías hasta un 60%",
      "Un certificado digital caducado puede bloquear trámites urgentes y generar recargos evitables",
    ],
  },
  B3: {
    id: "B3",
    name: "Fiscal y vencimientos",
    short: "Alertas de plazos, seguimiento de expedientes y cero recargos por despiste",
    tips: [
      "El 90% de los recargos por presentación fuera de plazo se deben a fallos de seguimiento, no de conocimiento",
      "Un sistema de alertas con 15 días de antelación da margen para pedir documentación al cliente antes del vencimiento",
    ],
  },
  B4: {
    id: "B4",
    name: "Laboral y nóminas de clientes",
    short: "Altas estructuradas, contratos vigilados y nóminas distribuidas sin envíos manuales",
    tips: [
      "El 70% del tiempo laboral en gestorías se pierde en comunicaciones de ida y vuelta para recopilar datos",
      "Automatizar la distribución de nóminas puede convertir una mañana de trabajo en un proceso de minutos",
    ],
  },
  B5: {
    id: "B5",
    name: "Relación con el cliente",
    short: "CRM con historial automático, resúmenes de llamadas y reactivación de clientes inactivos",
    tips: [
      "El cliente que llama para preguntar cómo va su trámite es una señal de que el proceso de comunicación está roto",
      "Un asesor con el historial completo del cliente en el bolsillo convierte cada reunión en un momento de valor",
    ],
  },
  B6: {
    id: "B6",
    name: "Operativa interna de la gestoría",
    short: "Registro de gastos automático y conciliación bancaria sin hojas de cálculo",
    tips: [
      "La gestoría que no controla bien sus propios números pierde credibilidad ante los clientes que sí lo hacen",
      "Automatizar la conciliación bancaria mensual puede liberar entre 4 y 8 horas de trabajo administrativo",
    ],
  },
};

export const GS_AUDIT_LEVELS: GsAuditLevel[] = [
  {
    min: 0,
    max: 39,
    name: "Gestoría reactiva",
    desc: "La gestoría funciona porque hay personas pendientes de todo. Los presupuestos se preparan a mano, la documentación se persigue cliente a cliente y los plazos fiscales dependen de que alguien mire la agenda. Activar dos o tres módulos tiene impacto visible antes del próximo trimestre.",
  },
  {
    min: 40,
    max: 59,
    name: "En transición",
    desc: "Tienes algunas piezas montadas pero el sistema todavía depende demasiado del equipo. La oportunidad está en cerrar los huecos: recogida documental automática, alertas de vencimientos y contrato digital para que el alta de un cliente no requiera intervención.",
  },
  {
    min: 60,
    max: 79,
    name: "Gestoría sistematizada",
    desc: "Tu operativa ya cubre los frentes principales. La siguiente capa está en la relación con el cliente: historial automático en el CRM, comunicación proactiva del estado de trámites y reactivación de clientes que llevan tiempo sin dar señales de vida.",
  },
  {
    min: 80,
    max: 100,
    name: "Gestoría de referencia",
    desc: "Estás en el percentil alto de las gestorías modernas. La conversación ahora es de optimización fina: personalización por perfil de cliente, predicción de bajas y escalar el modelo a nuevas sedes o la incorporación de servicios de mayor valor añadido.",
  },
];

export const GS_AUDIT_BLOCK_KEYS: GsAuditBlockId[] = ["B1", "B2", "B3", "B4", "B5", "B6"];

export function buildGsModulesByBlock(
  allProcesses: Process[]
): Record<GsAuditBlockId, GsAuditModule[]> {
  const gs = allProcesses.filter(
    (p) => p.landing_slug === "gestorias" && p.bloque_negocio && !p.hidden
  );
  const result = {} as Record<GsAuditBlockId, GsAuditModule[]>;
  for (const b of GS_AUDIT_BLOCK_KEYS) {
    result[b] = gs
      .filter((p) => p.bloque_negocio === b)
      .sort((a, c) => (a.modulo_codigo ?? "").localeCompare(c.modulo_codigo ?? "", undefined, { numeric: true }))
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
export const GS_AUDIT_TIPO_GESTORIA: Record<string, string> = {
  A: "Asesoría fiscal y contable",
  B: "Gestoría laboral y RRHH",
  C: "Gestoría integral (fiscal + laboral + contable)",
  D: "Despacho profesional (abogados / economistas)",
  E: "Asesoría de empresas multi-sede o franquicia",
};

export const GS_AUDIT_NUM_CLIENTES: Record<string, string> = {
  A: "Menos de 50 clientes",
  B: "Entre 50 y 150 clientes",
  C: "Entre 150 y 400 clientes",
  D: "Más de 400 clientes / varias sedes",
};

export const GS_AUDIT_CANALES: Record<string, string> = {
  A: "Web propia / formularios online",
  B: "Referidos de clientes actuales",
  C: "Teléfono",
  D: "WhatsApp",
  E: "Email directo",
};

export const GS_AUDIT_PRIORIDADES: Record<string, string> = {
  A: "Reducir el tiempo que se pierde reclamando documentación a los clientes",
  B: "Que ningún plazo fiscal o laboral se pase por un despiste",
  C: "Agilizar el alta de nuevos clientes y la firma de contratos",
  D: "Mejorar la relación y comunicación con los clientes existentes",
  E: "Poner orden en la operativa interna de la gestoría",
};
