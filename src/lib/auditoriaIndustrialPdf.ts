// Generación del PDF descargable de la auditoría de empresas industriales.
// Construye un HTML A4 con identidad amarilla industrial
// y lo lanza a window.print() vía iframe oculto.

import {
  IND_AUDIT_BLOCKS,
  IND_AUDIT_BLOCK_KEYS,
  IND_AUDIT_TIPO_EMPRESA,
  IND_AUDIT_TAMANO_PLANTILLA,
  IND_AUDIT_PRIORIDADES,
  IND_AUDIT_SISTEMAS_DIGITALES,
  IND_AUDIT_CERTIFICACIONES,
  IND_AUDIT_RIESGO_CLAVE,
  buildIndModulesByBlock,
  type IndAuditBlockId,
  type IndAuditLevel,
} from "@/data/auditoriaIndustrialData";
import { processes } from "@/data/processes";

const IND_MODULES = buildIndModulesByBlock(processes);

export interface IndAuditState {
  contact: {
    name: string;
    role: string;
    company: string;
    email: string;
    phone: string;
  };
  answers: Record<number, string | string[] | number>;
  blockScores: Record<IndAuditBlockId, number>;
  global: number;
  level: IndAuditLevel;
}

export function downloadIndAuditPdf(state: IndAuditState, setBusy: (b: boolean) => void) {
  setBusy(true);
  const html = buildPdfHtml(state);
  const empresa = (state.contact.company || "industrial")
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase();
  const filename = `auditoria-industrial-${empresa}-${new Date().toISOString().slice(0, 10)}`;

  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    setBusy(false);
    return;
  }
  doc.open();
  doc.write(
    `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>${filename}</title></head><body>${html}</body></html>`,
  );
  doc.close();

  const launch = () => {
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.error("print error", e);
      }
      setBusy(false);
      setTimeout(() => {
        try {
          iframe.remove();
        } catch (e) {
          /* ignore */
        }
      }, 2000);
    }, 350);
  };
  if (iframe.contentDocument?.readyState === "complete") launch();
  else iframe.onload = launch;
}

function buildPdfHtml(s: IndAuditState): string {
  const c = s.contact;
  const today = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // indices: 0=tipo empresa, 1=plantilla, 2=canales (multiselect),
  // 15=sistemas digitales, 16=concentración, 17=certificaciones (multiselect),
  // 18=resiliencia, 19=prioridades (multiselect)
  const tipoIdx = (s.answers[0] as string) || "A";
  const plantillaIdx = (s.answers[1] as string) || "A";
  const sistemasIdx = (s.answers[15] as string) || "A";
  const concentracionIdx = (s.answers[16] as string) || "A";
  const resilienciaIdx = (s.answers[18] as string) || "A";

  const certificacionesArr = (
    Array.isArray(s.answers[17]) ? (s.answers[17] as string[]) : [s.answers[17] as string].filter(Boolean)
  )
    .map((k) => IND_AUDIT_CERTIFICACIONES[k] || k)
    .join(", ") || "—";

  const prioridadesArr = (
    Array.isArray(s.answers[19]) ? (s.answers[19] as string[]) : [s.answers[19] as string].filter(Boolean)
  )
    .map((k) => IND_AUDIT_PRIORIDADES[k] || k)
    .join(", ") || "—";

  const sorted = IND_AUDIT_BLOCK_KEYS.map((b) => ({ b, sc: s.blockScores[b] })).sort(
    (a, b) => b.sc - a.sc,
  );
  const weak = sorted.filter((x) => x.sc < 60).sort((a, b) => a.sc - b.sc);
  const targetBlocks = weak.length ? weak : sorted.slice(-3);

  const blockRows = IND_AUDIT_BLOCK_KEYS.map((b, i) => {
    const sc = s.blockScores[b];
    const barColor = sc < 40 ? "#C0392B" : sc < 70 ? "#a16207" : "#eab308";
    const bgStripe = i % 2 === 0 ? "#fef9c3" : "#fff";
    const tips = IND_AUDIT_BLOCKS[b].tips || [];
    const bulletsHtml = tips
      .map(
        (t) => `
      <div style="display:flex;gap:6px;align-items:flex-start;margin-top:4px">
        <span style="width:5px;height:5px;border-radius:50%;background:#eab308;flex-shrink:0;margin-top:4px"></span>
        <span style="font-size:10px;color:#555;line-height:1.4">${t}</span>
      </div>`,
      )
      .join("");
    return `<div style="padding:10px 14px;background:${bgStripe};border-radius:8px;margin-bottom:4px">
      <div style="display:grid;grid-template-columns:40px 1fr 52px;gap:10px;align-items:center;margin-bottom:6px">
        <div style="width:34px;height:34px;border-radius:50%;background:#1a1408;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <span style="font-weight:800;color:#eab308;font-size:11px">${b}</span>
        </div>
        <div>
          <div style="font-weight:700;font-size:11px;color:#1A1A1A;margin-bottom:4px">${IND_AUDIT_BLOCKS[b].name}</div>
          <div style="height:5px;background:#fef3c7;border-radius:99px;overflow:hidden">
            <div style="width:${sc}%;height:100%;background:${barColor};border-radius:99px"></div>
          </div>
        </div>
        <div style="text-align:right">
          <span style="font-weight:800;font-size:18px;color:${barColor}">${sc}</span>
          <span style="font-size:8px;color:#999;display:block">/100</span>
        </div>
      </div>
      <div style="padding-left:44px">${bulletsHtml}</div>
    </div>`;
  }).join("");

  let modCards = "";
  let added = 0;
  targetBlocks.forEach((x) => {
    const mods = IND_MODULES[x.b] || [];
    const lastBlockKey = sorted[sorted.length - 1].b;
    mods.slice(0, x.b === lastBlockKey ? 2 : 1).forEach((m) => {
      if (added >= 5) return;
      added++;
      const num = added;
      modCards += `<div style="display:grid;grid-template-columns:48px 1fr;gap:14px;align-items:flex-start;padding:16px;background:#fef9c3;border-radius:10px;margin-bottom:10px;page-break-inside:avoid;border:1px solid #fde68a">
        <div style="width:40px;height:40px;border-radius:50%;background:#eab308;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
          <span style="font-weight:800;color:#1a1408;font-size:15px">${num}</span>
        </div>
        <div>
          <div style="font-size:9px;letter-spacing:2px;color:#1a1408;font-weight:800;text-transform:uppercase;margin-bottom:3px">${m.ref}</div>
          <div style="font-size:14px;font-weight:700;color:#1A1A1A;margin-bottom:5px">${m.name}</div>
          <div style="font-size:11px;color:#555;line-height:1.55">${m.desc}</div>
          <div style="display:inline-block;margin-top:8px;padding:3px 12px;background:#1a1408;color:#eab308;border-radius:99px;font-size:9px;letter-spacing:1px;text-transform:uppercase;font-weight:700">${m.impact}</div>
        </div>
      </div>`;
    });
  });

  // ─── RESUMEN EJECUTIVO: hallazgos clave ───────────────────────────────────
  const findings: { title: string; desc: string; severity: "high" | "mid" | "low" }[] = [];
  if (s.blockScores.B1 < 40) {
    findings.push({
      title: "Tiempo de respuesta a presupuestos por debajo del estándar sectorial",
      desc: "Tu score en clientes y presupuestos indica que la oferta tarda demasiado en llegar al cliente. En industria, cada hora extra es probabilidad de perder el pedido frente a un competidor que responde antes.",
      severity: "high",
    });
  } else if (s.blockScores.B1 < 60) {
    findings.push({
      title: "Margen de mejora claro en velocidad comercial",
      desc: "Generáis presupuestos pero no de forma sistemática. Automatizar la captura de la petición y el seguimiento de ofertas abiertas convierte tu tiempo de respuesta en argumento comercial.",
      severity: "mid",
    });
  }
  if (s.blockScores.B2 < 50) {
    findings.push({
      title: "Cuello de botella entre comercial y producción",
      desc: "El traspaso de un pedido confirmado a la orden de fabricación está consumiendo tiempo crítico. Cada día perdido en ese puente comprime el plazo de entrega o genera horas extra en planta.",
      severity: "high",
    });
  }
  if (s.blockScores.B3 < 50) {
    findings.push({
      title: "Trazabilidad insuficiente para responder a reclamaciones",
      desc: "Localizar lote, máquina y operario lleva más tiempo del que la relación con el cliente puede permitirse. Una reclamación bien gestionada en 24 horas blinda al cliente; una mal gestionada en una semana lo pierde.",
      severity: "high",
    });
  }
  if (s.blockScores.B4 < 50) {
    findings.push({
      title: "Riesgo de parar planta por gestión de stock reactiva",
      desc: "El stock se gestiona por descubrimiento, no por anticipación. Cada hora de planta parada por rotura de material cuesta más que el stock de seguridad bien dimensionado.",
      severity: "mid",
    });
  }
  if (s.blockScores.B5 < 50) {
    findings.push({
      title: "Ciclo de cobro alargado por burocracia interna",
      desc: "Si la factura tarda en salir, en una industrial que cobra a 60 o 90 días eso es caja financiada gratis al cliente. Automatizar la cadena albarán → factura → recordatorio recupera días de tesorería.",
      severity: "mid",
    });
  }
  if (s.blockScores.B6 < 50) {
    findings.push({
      title: "Planta gestionada por buena memoria, no por sistema",
      desc: "Turnos y mantenimiento dependen de personas concretas. El día que esa persona falla, la planta pierde horas. Sistematizar turnos individuales y mantenimiento preventivo blinda contra ese riesgo.",
      severity: "mid",
    });
  }
  // Si la planta va muy bien, hallazgos positivos
  if (findings.length === 0) {
    findings.push({
      title: "Operativa por encima de la media del sector",
      desc: "Vuestros bloques operativos están sólidos. La siguiente capa de valor está en la explotación de datos: anticipar demanda, optimizar consumos y convertir la calidad en argumento comercial.",
      severity: "low",
    });
  }
  // Concentración de clientes
  if (concentracionIdx === "D") {
    findings.push({
      title: "Concentración de clientes alta — riesgo estratégico",
      desc: "Más del 60% de la facturación en tres clientes deja a la empresa muy expuesta. Automatizar B1 (clientes y presupuestos) acelera la diversificación al permitir gestionar más leads sin más comercial.",
      severity: "high",
    });
  }
  // Resiliencia
  if (resilienciaIdx === "A") {
    findings.push({
      title: "Dependencia crítica de personas clave",
      desc: "El conocimiento operativo está en una sola persona. Documentar procesos y sistematizar planta es seguro, no solo eficiencia.",
      severity: "high",
    });
  }

  const findingsHtml = findings
    .slice(0, 4)
    .map((f, i) => {
      const color =
        f.severity === "high" ? "#C0392B" : f.severity === "mid" ? "#d97706" : "#16a34a";
      const bg =
        f.severity === "high" ? "#FEF2F2" : f.severity === "mid" ? "#FFFBEB" : "#F0FDF4";
      const border =
        f.severity === "high" ? "#FECACA" : f.severity === "mid" ? "#FDE68A" : "#BBF7D0";
      const label =
        f.severity === "high" ? "Alto" : f.severity === "mid" ? "Medio" : "Positivo";
      return `<div style="display:grid;grid-template-columns:32px 1fr;gap:12px;align-items:flex-start;padding:14px;background:${bg};border-radius:10px;margin-bottom:8px;border:1px solid ${border}">
        <div style="width:26px;height:26px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff;font-weight:800;font-size:11px">${i + 1}</div>
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span style="font-size:13px;font-weight:700;color:#1A1A1A">${f.title}</span>
            <span style="font-size:8px;padding:2px 7px;background:${color};color:#fff;border-radius:99px;letter-spacing:1px;text-transform:uppercase;font-weight:800">${label}</span>
          </div>
          <div style="font-size:11px;color:#555;line-height:1.55">${f.desc}</div>
        </div>
      </div>`;
    })
    .join("");

  // Mapa de calor de riesgos (concentración, certificaciones, resiliencia)
  const heatRows = [
    {
      label: "Concentración de clientes",
      value:
        ["A", "B"].includes(concentracionIdx)
          ? { txt: "Baja", color: "#16a34a", bg: "#F0FDF4" }
          : concentracionIdx === "C"
            ? { txt: "Media", color: "#d97706", bg: "#FFFBEB" }
            : { txt: "Alta", color: "#C0392B", bg: "#FEF2F2" },
      explain:
        concentracionIdx === "D"
          ? "Más del 60% en top 3"
          : concentracionIdx === "C"
            ? "40-60% en top 3"
            : concentracionIdx === "B"
              ? "20-40% en top 3"
              : "<20% en top 3",
    },
    {
      label: "Certificaciones activas",
      value:
        certificacionesArr === "—" || certificacionesArr.includes("Ninguna")
          ? { txt: "Sin certificar", color: "#C0392B", bg: "#FEF2F2" }
          : certificacionesArr.split(",").length >= 2
            ? { txt: "Sólido", color: "#16a34a", bg: "#F0FDF4" }
            : { txt: "Básico", color: "#d97706", bg: "#FFFBEB" },
      explain: certificacionesArr === "—" ? "Ninguna" : certificacionesArr,
    },
    {
      label: "Resiliencia del equipo",
      value:
        resilienciaIdx === "A"
          ? { txt: "Crítica", color: "#C0392B", bg: "#FEF2F2" }
          : resilienciaIdx === "B"
            ? { txt: "Frágil", color: "#d97706", bg: "#FFFBEB" }
            : resilienciaIdx === "C"
              ? { txt: "Resiliente", color: "#16a34a", bg: "#F0FDF4" }
              : { txt: "Documentada", color: "#16a34a", bg: "#F0FDF4" },
      explain: IND_AUDIT_RIESGO_CLAVE[resilienciaIdx] || "—",
    },
    {
      label: "Madurez digital",
      value:
        sistemasIdx === "A"
          ? { txt: "Inicial", color: "#C0392B", bg: "#FEF2F2" }
          : sistemasIdx === "B"
            ? { txt: "Básica", color: "#d97706", bg: "#FFFBEB" }
            : sistemasIdx === "C"
              ? { txt: "Intermedia", color: "#eab308", bg: "#FEFCE8" }
              : { txt: "Avanzada", color: "#16a34a", bg: "#F0FDF4" },
      explain: IND_AUDIT_SISTEMAS_DIGITALES[sistemasIdx] || "—",
    },
  ];

  const heatHtml = heatRows
    .map(
      (r) => `<div style="padding:12px 14px;background:${r.value.bg};border-radius:8px;border:1px solid #EEE;display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;margin-bottom:6px">
      <div>
        <div style="font-size:10px;color:#666;letter-spacing:1px;text-transform:uppercase;font-weight:700;margin-bottom:3px">${r.label}</div>
        <div style="font-size:10px;color:#555">${r.explain}</div>
      </div>
      <span style="padding:4px 12px;background:${r.value.color};color:#fff;border-radius:99px;font-size:9px;font-weight:800;letter-spacing:1px;text-transform:uppercase">${r.value.txt}</span>
    </div>`,
    )
    .join("");

  // Benchmark sectorial
  const benchmark = 52;
  const benchmarkDelta = s.global - benchmark;
  const benchmarkColor = benchmarkDelta >= 0 ? "#16a34a" : "#C0392B";
  const benchmarkArrow = benchmarkDelta >= 0 ? "▲" : "▼";

  return `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap');
    @page{size:A4;margin:0}
    *{box-sizing:border-box;margin:0;padding:0;font-family:'Lexend',sans-serif}
    html,body{margin:0;padding:0;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;color:#1A1A1A;font-size:12px;line-height:1.5}
    .pg{page-break-after:always;page-break-inside:avoid;width:210mm;position:relative;overflow:hidden}
    .pg:last-child{page-break-after:avoid}
    .pg-footer{margin-top:20px;font-size:9px;color:#aaa;letter-spacing:1px;text-transform:uppercase;display:flex;justify-content:space-between;border-top:1px solid #EEE;padding-top:8px}
    .section-label{font-size:9px;letter-spacing:2.5px;color:#a16207;text-transform:uppercase;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:8px}
    .section-label:after{content:"";flex:1;height:1px;background:#eab308;opacity:.3}
  </style>

  <!-- PORTADA -->
  <div class="pg" style="background:linear-gradient(140deg,#1a1408 0%,#0d0a04 100%);height:297mm;display:flex;flex-direction:column;color:#fff">
    <div style="position:absolute;right:-100px;bottom:-100px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,#eab308 0%,transparent 60%);opacity:.12"></div>
    <div style="position:absolute;left:-70px;top:-30px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,#3d2f0c 0%,transparent 65%);opacity:.5"></div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:56px 56px 24px;position:relative;z-index:2">
      <div style="font-size:24px;font-weight:800;margin-bottom:56px">
        <span style="color:#fff">immoral</span><span style="color:#eab308">ia</span>
      </div>
      <div style="font-size:9px;letter-spacing:4px;color:#fde68a;text-transform:uppercase;margin-bottom:14px">Informe de Auditoría · Industrial / Producción · ${today}</div>
      <h1 style="font-size:38px;line-height:1.1;font-weight:800;max-width:500px;margin-bottom:14px;color:#fff">Auditoría de Madurez Operativa</h1>
      <div style="font-size:13px;color:#fde68a;max-width:440px;line-height:1.65;margin-bottom:44px">Preparado para <strong style="color:#fff;font-weight:700">${c.name}</strong>${c.company ? " · " + c.company : ""}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:400px">
        ${[
          ["Tipo de empresa", IND_AUDIT_TIPO_EMPRESA[tipoIdx] || "—"],
          ["Plantilla", IND_AUDIT_TAMANO_PLANTILLA[plantillaIdx] || "—"],
          ["Score global", s.global + " / 100"],
          ["Nivel", s.level.name],
        ]
          .map(
            ([lbl, val]) => `<div style="padding:12px 16px;background:rgba(255,255,255,.07);border-left:3px solid #eab308;border-radius:6px">
          <div style="font-size:8px;letter-spacing:2px;color:#fde68a;text-transform:uppercase;margin-bottom:3px;font-weight:600">${lbl}</div>
          <div style="font-size:11px;color:#fff;font-weight:600">${val}</div>
        </div>`,
          )
          .join("")}
      </div>
    </div>
    <div style="padding:14px 56px;border-top:1px solid rgba(255,255,255,.08);position:relative;z-index:2;display:flex;justify-content:space-between">
      <span style="font-size:9px;color:rgba(255,255,255,.3);letter-spacing:1px;text-transform:uppercase">immoralia · Automatización &amp; IA · Immoral Group</span>
      <span style="font-size:9px;color:rgba(255,255,255,.3);letter-spacing:1px;text-transform:uppercase">Confidencial</span>
    </div>
  </div>

  <!-- QUIÉNES SOMOS -->
  <div class="pg" style="height:297mm;display:flex;flex-direction:column">
    <div style="background:#1a1408;padding:32px 40px 28px;position:relative;overflow:hidden">
      <div style="position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:rgba(234,179,8,.07)"></div>
      <div style="position:absolute;right:40px;bottom:-30px;width:120px;height:120px;border-radius:50%;background:rgba(234,179,8,.05)"></div>
      <div style="font-size:9px;letter-spacing:3px;color:rgba(255,255,255,.5);text-transform:uppercase;margin-bottom:10px;position:relative;z-index:2">immoralia · Parte de Immoral Group</div>
      <div style="font-size:26px;font-weight:800;color:#fff;line-height:1.15;margin-bottom:10px;max-width:480px;position:relative;z-index:2">Automatización e IA<br>para empresas industriales</div>
      <div style="font-size:12px;color:rgba(255,255,255,.75);line-height:1.65;max-width:500px;position:relative;z-index:2">Ayudamos a fábricas y empresas de producción a acortar el tiempo de respuesta comercial, eliminar el cuello de botella entre venta y planta, blindar la trazabilidad y poner la administración en piloto automático — sin reemplazar vuestro ERP actual. Módulo a módulo, con impacto medible en el primer trimestre.</div>
    </div>
    <div style="background:#fff;padding:20px 40px">
      <div style="font-size:9px;letter-spacing:2px;color:#a16207;text-transform:uppercase;font-weight:800;margin-bottom:14px">Las 6 áreas que automatizamos</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
        ${[
          ["B1", "Clientes y presupuestos", "Captura de peticiones, generación de ofertas y seguimiento comercial para que ninguna oferta quede en el aire"],
          ["B2", "Pedidos y producción", "Pedido confirmado convertido en orden de fabricación, materiales reservados y panel de planta en tiempo real"],
          ["B3", "Calidad y trazabilidad", "Controles de calidad integrados, trazabilidad por lote y gestión de no conformidades sin papeles"],
          ["B4", "Compras y proveedores", "Pedidos automáticos por stock mínimo, recepción guiada y evaluación continua de proveedores"],
          ["B5", "Administración y cobros", "Facturación automática al cierre del albarán, recordatorios de cobro y cuadro de mando diario"],
          ["B6", "Equipo y planta", "Turnos individuales, onboarding rápido y mantenimiento preventivo con alertas"],
        ]
          .map(
            ([id, name, desc]) => `
          <div style="padding:12px 14px;background:#fef9c3;border-radius:8px;border:1px solid #fde68a">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
              <div style="width:22px;height:22px;border-radius:50%;background:#1a1408;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <span style="font-weight:800;color:#eab308;font-size:8px">${id}</span>
              </div>
              <span style="font-weight:700;font-size:10px;color:#1A1A1A">${name}</span>
            </div>
            <div style="font-size:9px;color:#6B7280;line-height:1.45;padding-left:30px">${desc}</div>
          </div>`,
          )
          .join("")}
      </div>
    </div>
    <div style="background:#fef9c3;padding:20px 40px">
      <div style="font-size:9px;letter-spacing:2px;color:#a16207;text-transform:uppercase;font-weight:800;margin-bottom:14px">Cómo lo ponemos en marcha</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
        ${[
          ["01", "Semanas 1–2", "Diagnóstico", "Revisamos cómo entran las peticiones, cómo se gestionan los pedidos en planta y qué sistemas ya tenéis. Identificamos los dos procesos con más impacto sin reemplazar nada. Sin instalar nada todavía."],
          ["02", "Semanas 3–6", "Primeros módulos", "Activamos los procesos prioritarios — normalmente presupuestos automáticos y cierre del puente comercial a producción. La planta sigue trabajando igual: los procesos corren en segundo plano."],
          ["03", "Semanas 7–12", "Sistema completo", "Activamos trazabilidad, seguimiento de cobros y mantenimiento preventivo. El sistema ya conoce la planta y genera valor de forma autónoma. Revisión mensual para ajustar según el ritmo de producción."],
        ]
          .map(
            ([n, weeks, title, desc]) => `
          <div style="background:#fff;border-radius:8px;border:1px solid #EEE;padding:14px 16px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <div style="width:24px;height:24px;border-radius:50%;background:#eab308;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <span style="font-weight:800;color:#1a1408;font-size:9px">${n}</span>
              </div>
              <span style="font-size:8px;color:#aaa;letter-spacing:1px;text-transform:uppercase">${weeks}</span>
            </div>
            <div style="font-weight:700;font-size:11px;color:#1A1A1A;margin-bottom:4px;padding-left:32px">${title}</div>
            <div style="font-size:10px;color:#6B7280;line-height:1.5;padding-left:32px">${desc}</div>
          </div>`,
          )
          .join("")}
      </div>
    </div>
    <div style="background:#1a1408;flex:1;padding:20px 40px 28px;display:grid;grid-template-columns:1fr 1fr;gap:24px;align-content:start">
      <div>
        <div style="font-size:9px;letter-spacing:2px;color:#fde68a;text-transform:uppercase;margin-bottom:10px">Con quién trabajamos</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${["Metalurgia y mecanizado", "Alimentación", "Química y plástico", "Electrónica", "Madera y mueble", "Textil"]
            .map(
              (tag) => `
            <span style="padding:3px 10px;background:rgba(255,255,255,.07);color:#fde68a;border-radius:99px;font-size:9px;border:1px solid rgba(255,255,255,.1)">${tag}</span>`,
            )
            .join("")}
        </div>
      </div>
      <div style="border-left:1px solid rgba(255,255,255,.08);padding-left:24px">
        <div style="font-size:9px;letter-spacing:2px;color:#fde68a;text-transform:uppercase;margin-bottom:10px">Nuestro compromiso</div>
        ${[
          "Módulos independientes — pausar o cambiar el orden no afecta al resto",
          "El primer módulo puede estar funcionando en menos de 2 semanas",
          "Nos adaptamos a tu ERP actual — SAP, Sage, Holded, Odoo y otros",
          "Sin corporativismos: hablamos de pedidos, planta y resultados, no de tecnología",
        ]
          .map(
            (t) => `
          <div style="display:flex;gap:7px;align-items:flex-start;margin-bottom:6px">
            <span style="color:#eab308;font-weight:800;font-size:10px;flex-shrink:0;margin-top:1px">✓</span>
            <span style="font-size:10px;color:#fde68a;line-height:1.4">${t}</span>
          </div>`,
          )
          .join("")}
      </div>
    </div>
    <div style="padding:12px 40px;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;background:#1a1408">
      <span style="font-size:9px;color:rgba(255,255,255,.3);letter-spacing:1px;text-transform:uppercase">immoralia · Automatización &amp; IA · www.immoral.es</span>
      <span style="font-size:9px;color:rgba(255,255,255,.3);letter-spacing:1px;text-transform:uppercase">${today}</span>
    </div>
  </div>

  <!-- SCORE Y BLOQUES -->
  <div class="pg" style="padding:32px 40px 24px">
    <div class="section-label">Resultado global</div>
    <div style="background:#1a1408;border-radius:12px;padding:28px 32px;display:grid;grid-template-columns:140px 1fr;gap:28px;align-items:center;margin-bottom:24px">
      <div style="width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.08);border:4px solid #eab308;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto">
        <span style="font-size:44px;font-weight:800;color:#eab308;line-height:1">${s.global}</span>
        <span style="font-size:8px;letter-spacing:2px;color:#fde68a;text-transform:uppercase;margin-top:2px">de 100</span>
      </div>
      <div>
        <div style="font-size:9px;letter-spacing:2px;color:#fde68a;text-transform:uppercase;margin-bottom:6px">Nivel de madurez operativa</div>
        <div style="font-size:22px;font-weight:800;color:#fff;line-height:1.2;margin-bottom:8px">${s.level.name}</div>
        <div style="font-size:12px;color:#fde68a;line-height:1.6">${s.level.desc}</div>
      </div>
    </div>
    <div class="section-label" style="margin-bottom:12px">Score por área</div>
    ${blockRows}
    <div class="pg-footer"><span>immoralia · Auditoría de Madurez Operativa · ${c.company || c.name}</span><span>${today}</span></div>
  </div>

  <!-- RESUMEN EJECUTIVO -->
  <div class="pg" style="padding:32px 40px 24px">
    <div class="section-label">Resumen ejecutivo</div>
    <div style="margin-bottom:6px">
      <span style="font-size:22px;font-weight:800;color:#1A1A1A">Lo que más pesa en tu diagnóstico</span>
    </div>
    <div style="font-size:12px;color:#6B7280;margin-bottom:20px">Hallazgos clave detectados a partir de tus respuestas y comparación con la media del sector industrial español.</div>

    <!-- Benchmark sectorial -->
    <div style="background:linear-gradient(135deg,#1a1408,#0d0a04);border-radius:12px;padding:20px 24px;margin-bottom:20px;color:#fff">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:center">
        <div>
          <div style="font-size:9px;letter-spacing:2px;color:#fde68a;text-transform:uppercase;margin-bottom:6px">Benchmark sectorial 2026</div>
          <div style="font-size:13px;color:#fff;line-height:1.5">Media estimada del sector industrial español: <strong style="color:#eab308">${benchmark}/100</strong>. Tu posición frente a la media:</div>
        </div>
        <div style="text-align:right">
          <div style="display:inline-flex;align-items:baseline;gap:6px">
            <span style="font-size:36px;font-weight:800;color:${benchmarkColor};line-height:1">${benchmarkArrow}</span>
            <span style="font-size:36px;font-weight:800;color:${benchmarkColor};line-height:1">${Math.abs(benchmarkDelta)}</span>
          </div>
          <div style="font-size:9px;color:#fde68a;letter-spacing:2px;text-transform:uppercase;margin-top:4px">Puntos vs media</div>
        </div>
      </div>
    </div>

    <!-- Hallazgos -->
    <div class="section-label" style="margin-bottom:12px">Hallazgos clave</div>
    ${findingsHtml}

    <!-- Mapa de calor -->
    <div class="section-label" style="margin-top:18px;margin-bottom:12px">Mapa de riesgos operativos</div>
    ${heatHtml}

    <div class="pg-footer"><span>immoralia · Auditoría de Madurez Operativa · ${c.company || c.name}</span><span>${today}</span></div>
  </div>

  <!-- MÓDULOS PRIORITARIOS -->
  <div class="pg" style="padding:32px 40px 24px">
    <div class="section-label">Módulos prioritarios</div>
    <div style="margin-bottom:6px">
      <span style="font-size:22px;font-weight:800;color:#1A1A1A">Lo que recomendamos activar primero</span>
    </div>
    <div style="font-size:12px;color:#6B7280;margin-bottom:20px">Basado en las áreas con menor score en tu auditoría${prioridadesArr !== "—" ? ` y en tus prioridades declaradas (${prioridadesArr})` : ""}.</div>
    ${modCards}
    <div class="pg-footer"><span>immoralia · Auditoría de Madurez Operativa · ${c.company || c.name}</span><span>${today}</span></div>
  </div>

  <!-- CTA FINAL -->
  <div class="pg" style="padding:32px 40px 24px">
    <div style="background:linear-gradient(135deg,#1a1408,#0d0a04);color:#fff;padding:40px;border-radius:14px;margin-bottom:20px">
      <div style="font-size:9px;letter-spacing:3px;color:#fde68a;text-transform:uppercase;margin-bottom:10px">Siguiente paso</div>
      <div style="font-size:24px;font-weight:800;color:#fff;margin-bottom:10px">¿Por dónde empezamos?</div>
      <div style="font-size:13px;color:#fde68a;max-width:460px;line-height:1.65;margin-bottom:28px">Una conversación de 30 minutos para ver dónde está la fricción real entre tu comercial, tu planta y tu administración, qué ya tenéis montado y qué módulo puede generar impacto antes del próximo trimestre. Sin compromiso, sin presentaciones largas.</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <div style="padding:12px 24px;background:#eab308;color:#1a1408;border-radius:99px;font-weight:700;font-size:11px;letter-spacing:.5px">calendly.com/david-immoral/30min</div>
        <div style="padding:12px 24px;background:rgba(255,255,255,.08);color:#fff;border-radius:99px;font-weight:600;font-size:11px;letter-spacing:.3px;border:1px solid rgba(255,255,255,.15)">procesos.immoralia.es/sector/industrial</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px">
      <div style="background:#fef9c3;border-radius:10px;padding:18px;border:1px solid #fde68a">
        <div style="width:28px;height:28px;border-radius:50%;background:#eab308;display:flex;align-items:center;justify-content:center;margin-bottom:10px">
          <span style="color:#1a1408;font-size:13px;font-weight:800">✓</span>
        </div>
        <div style="font-size:12px;font-weight:700;color:#1A1A1A;margin-bottom:4px">Nos adaptamos a tu ERP actual</div>
        <div style="font-size:11px;color:#6B7280;line-height:1.5">SAP, Sage, Holded, Odoo y otros — no hace falta cambiar nada de lo que ya funciona.</div>
      </div>
      <div style="background:#fef9c3;border-radius:10px;padding:18px;border:1px solid #fde68a">
        <div style="width:28px;height:28px;border-radius:50%;background:#eab308;display:flex;align-items:center;justify-content:center;margin-bottom:10px">
          <span style="color:#1a1408;font-size:13px;font-weight:800">✓</span>
        </div>
        <div style="font-size:12px;font-weight:700;color:#1A1A1A;margin-bottom:4px">Primer módulo en menos de 2 semanas</div>
        <div style="font-size:11px;color:#6B7280;line-height:1.5">Desde que decidimos arrancar hasta que funciona en planta.</div>
      </div>
    </div>
    <div style="text-align:center;color:#bbb;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;padding-top:16px;border-top:1px solid #EEE">
      immoralia · Automatización &amp; IA · Parte de Immoral Group · www.immoral.es
    </div>
  </div>`;
}
