// Generación del PDF descargable de la auditoría de gestorías y asesorías.
// Construye un HTML A4 con identidad dorada y lo lanza a window.print() vía iframe oculto.

import {
  GS_AUDIT_BLOCKS,
  GS_AUDIT_BLOCK_KEYS,
  GS_AUDIT_TIPO_GESTORIA,
  GS_AUDIT_NUM_CLIENTES,
  GS_AUDIT_PRIORIDADES,
  buildGsModulesByBlock,
  type GsAuditBlockId,
  type GsAuditLevel,
} from "@/data/auditoriaGestoriasData";
import { processes } from "@/data/processes";

const GS_MODULES = buildGsModulesByBlock(processes);

export interface GsAuditState {
  contact: {
    name: string;
    role: string;
    company: string;
    email: string;
    phone: string;
  };
  answers: Record<number, string | string[] | number>;
  blockScores: Record<GsAuditBlockId, number>;
  global: number;
  level: GsAuditLevel;
}

export function downloadGsAuditPdf(state: GsAuditState, setBusy: (b: boolean) => void) {
  setBusy(true);
  const html = buildPdfHtml(state);
  const despacho = (state.contact.company || "gestoria")
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase();
  const filename = `auditoria-gestoria-${despacho}-${new Date().toISOString().slice(0, 10)}`;

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

function buildPdfHtml(s: GsAuditState): string {
  const c = s.contact;
  const today = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // indices: 0=tipo gestoría, 1=num clientes, 2=canales (multiselect), 13=prioridades
  const tipoIdx = (s.answers[0] as string) || "A";
  const numClientesIdx = (s.answers[1] as string) || "A";
  const prioridadesArr = (
    Array.isArray(s.answers[13]) ? (s.answers[13] as string[]) : [s.answers[13] as string].filter(Boolean)
  )
    .map((k) => GS_AUDIT_PRIORIDADES[k] || k)
    .join(", ") || "—";

  const sorted = GS_AUDIT_BLOCK_KEYS.map((b) => ({ b, sc: s.blockScores[b] })).sort(
    (a, b) => b.sc - a.sc,
  );
  const weak = sorted.filter((x) => x.sc < 60).sort((a, b) => a.sc - b.sc);
  const targetBlocks = weak.length ? weak : sorted.slice(-3);

  const blockRows = GS_AUDIT_BLOCK_KEYS.map((b, i) => {
    const sc = s.blockScores[b];
    const barColor = sc < 40 ? "#C0392B" : sc < 70 ? "#b89838" : "#c4a84c";
    const bgStripe = i % 2 === 0 ? "#FEFCE8" : "#fff";
    const tips = GS_AUDIT_BLOCKS[b].tips || [];
    const bulletsHtml = tips
      .map(
        (t) => `
      <div style="display:flex;gap:6px;align-items:flex-start;margin-top:4px">
        <span style="width:5px;height:5px;border-radius:50%;background:#c4a84c;flex-shrink:0;margin-top:4px"></span>
        <span style="font-size:10px;color:#555;line-height:1.4">${t}</span>
      </div>`,
      )
      .join("");
    return `<div style="padding:10px 14px;background:${bgStripe};border-radius:8px;margin-bottom:4px">
      <div style="display:grid;grid-template-columns:40px 1fr 52px;gap:10px;align-items:center;margin-bottom:6px">
        <div style="width:34px;height:34px;border-radius:50%;background:#1A1400;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <span style="font-weight:800;color:#c4a84c;font-size:11px">${b}</span>
        </div>
        <div>
          <div style="font-weight:700;font-size:11px;color:#1A1A1A;margin-bottom:4px">${GS_AUDIT_BLOCKS[b].name}</div>
          <div style="height:5px;background:#FEF9C3;border-radius:99px;overflow:hidden">
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
    const mods = GS_MODULES[x.b] || [];
    const lastBlockKey = sorted[sorted.length - 1].b;
    mods.slice(0, x.b === lastBlockKey ? 2 : 1).forEach((m) => {
      if (added >= 5) return;
      added++;
      const num = added;
      modCards += `<div style="display:grid;grid-template-columns:48px 1fr;gap:14px;align-items:flex-start;padding:16px;background:#FEFCE8;border-radius:10px;margin-bottom:10px;page-break-inside:avoid;border:1px solid #FEF9C3">
        <div style="width:40px;height:40px;border-radius:50%;background:#c4a84c;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
          <span style="font-weight:800;color:#1A1400;font-size:15px">${num}</span>
        </div>
        <div>
          <div style="font-size:9px;letter-spacing:2px;color:#1A1400;font-weight:800;text-transform:uppercase;margin-bottom:3px">${m.ref}</div>
          <div style="font-size:14px;font-weight:700;color:#1A1A1A;margin-bottom:5px">${m.name}</div>
          <div style="font-size:11px;color:#555;line-height:1.55">${m.desc}</div>
          <div style="display:inline-block;margin-top:8px;padding:3px 12px;background:#1A1400;color:#c4a84c;border-radius:99px;font-size:9px;letter-spacing:1px;text-transform:uppercase;font-weight:700">${m.impact}</div>
        </div>
      </div>`;
    });
  });

  // ─── Resumen ejecutivo ──────────────────────────────────────────────────────
  const benchmark = 42; // <-- sector-specific value
  const vsNum = s.global - benchmark;
  const vsText = vsNum >= 0 ? `+${vsNum}` : `${vsNum}`;
  const vsColor = vsNum >= 0 ? "#0D9488" : "#DC2626";
  const vsBg = vsNum >= 0 ? "#F0FDF4" : "#FEF2F2";
  const vsBorder = vsNum >= 0 ? "#BBF7D0" : "#FECACA";
  const riskBlocks = sorted.filter(({ sc }) => sc < 40).sort((a, b) => a.sc - b.sc);

  const topBlocksHtml = sorted.slice(0, 2).map(({ b, sc }) => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#F0FDF4;border-radius:8px;margin-bottom:6px;border:1px solid #BBF7D0">
      <div style="width:28px;height:28px;border-radius:50%;background:#059669;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <span style="font-weight:800;color:#fff;font-size:9px">${b}</span>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:#1A1A1A">${GS_AUDIT_BLOCKS[b].name}</div>
        <div style="font-size:9px;color:#059669;font-weight:600">${sc}/100</div>
      </div>
    </div>
  `).join("");

  const bottomBlocksHtml = sorted.slice(-2).reverse().map(({ b, sc }) => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#FEF2F2;border-radius:8px;margin-bottom:6px;border:1px solid #FECACA">
      <div style="width:28px;height:28px;border-radius:50%;background:#DC2626;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <span style="font-weight:800;color:#fff;font-size:9px">${b}</span>
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:#1A1A1A">${GS_AUDIT_BLOCKS[b].name}</div>
        <div style="font-size:9px;color:#DC2626;font-weight:600">${sc}/100</div>
      </div>
    </div>
  `).join("");

  const riskHtml = riskBlocks.length > 0 ? `
    <div style="font-size:9px;letter-spacing:2px;color:#D97706;text-transform:uppercase;font-weight:700;margin-bottom:10px">Factores de riesgo operativo</div>
    <div style="display:grid;grid-template-columns:${riskBlocks.length > 1 ? "1fr 1fr" : "1fr"};gap:10px;margin-bottom:0">
      ${riskBlocks.slice(0, 2).map(({ b, sc }) => `
        <div style="padding:12px 14px;background:#FFFBEB;border-radius:8px;border:1px solid #FDE68A">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-weight:800;font-size:12px;color:#92400E">!</span>
            <span style="font-weight:700;font-size:10px;color:#92400E">${GS_AUDIT_BLOCKS[b].name}</span>
            <span style="margin-left:auto;font-size:10px;font-weight:700;color:#D97706">${sc}/100</span>
          </div>
          <div style="font-size:9px;color:#78350F;line-height:1.4">${GS_AUDIT_BLOCKS[b].short}</div>
        </div>
      `).join("")}
    </div>
  ` : `
    <div style="padding:14px 16px;background:#F0FDF4;border-radius:10px;border:1px solid #BBF7D0">
      <div style="font-size:11px;font-weight:700;color:#059669;margin-bottom:4px">Sin riesgos operativos críticos detectados</div>
      <div style="font-size:10px;color:#6B7280">Ninguna área cae por debajo de 40/100. El trabajo ahora es de optimización y diferenciación.</div>
    </div>
  `;

  return `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap');
    @page{size:A4;margin:0}
    *{box-sizing:border-box;margin:0;padding:0;font-family:'Lexend',sans-serif}
    html,body{margin:0;padding:0;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;color:#1A1A1A;font-size:12px;line-height:1.5}
    .pg{page-break-after:always;page-break-inside:avoid;width:210mm;position:relative;overflow:hidden}
    .pg:last-child{page-break-after:avoid}
    .pg-footer{margin-top:20px;font-size:9px;color:#aaa;letter-spacing:1px;text-transform:uppercase;display:flex;justify-content:space-between;border-top:1px solid #EEE;padding-top:8px}
    .section-label{font-size:9px;letter-spacing:2.5px;color:#c4a84c;text-transform:uppercase;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:8px}
    .section-label:after{content:"";flex:1;height:1px;background:#c4a84c;opacity:.3}
  </style>

  <!-- PORTADA -->
  <div class="pg" style="background:linear-gradient(140deg,#1A1400 0%,#0D0900 100%);height:297mm;display:flex;flex-direction:column;color:#fff">
    <div style="position:absolute;right:-100px;bottom:-100px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,#c4a84c 0%,transparent 60%);opacity:.12"></div>
    <div style="position:absolute;left:-70px;top:-30px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,#3A2E00 0%,transparent 65%);opacity:.5"></div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:56px 56px 24px;position:relative;z-index:2">
      <div style="font-size:24px;font-weight:800;margin-bottom:56px">
        <span style="color:#fff">immoral</span><span style="color:#c4a84c">ia</span>
      </div>
      <div style="font-size:9px;letter-spacing:4px;color:#D4A843;text-transform:uppercase;margin-bottom:14px">Informe de Auditoría · Gestorías y Asesorías · ${today}</div>
      <h1 style="font-size:38px;line-height:1.1;font-weight:800;max-width:500px;margin-bottom:14px;color:#fff">Auditoría de Madurez Operativa</h1>
      <div style="font-size:13px;color:#E8D49A;max-width:440px;line-height:1.65;margin-bottom:44px">Preparado para <strong style="color:#fff;font-weight:700">${c.name}</strong>${c.company ? " · " + c.company : ""}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:400px">
        ${[
          ["Tipo de despacho", GS_AUDIT_TIPO_GESTORIA[tipoIdx] || "—"],
          ["Clientes activos", GS_AUDIT_NUM_CLIENTES[numClientesIdx] || "—"],
          ["Score global", s.global + " / 100"],
          ["Nivel", s.level.name],
        ]
          .map(
            ([lbl, val]) => `<div style="padding:12px 16px;background:rgba(255,255,255,.07);border-left:3px solid #c4a84c;border-radius:6px">
          <div style="font-size:8px;letter-spacing:2px;color:#D4A843;text-transform:uppercase;margin-bottom:3px;font-weight:600">${lbl}</div>
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
    <div style="background:#1A1400;padding:32px 40px 28px;position:relative;overflow:hidden">
      <div style="position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:rgba(196,168,76,.07)"></div>
      <div style="position:absolute;right:40px;bottom:-30px;width:120px;height:120px;border-radius:50%;background:rgba(196,168,76,.05)"></div>
      <div style="font-size:9px;letter-spacing:3px;color:rgba(255,255,255,.5);text-transform:uppercase;margin-bottom:10px;position:relative;z-index:2">immoralia · Parte de Immoral Group</div>
      <div style="font-size:26px;font-weight:800;color:#fff;line-height:1.15;margin-bottom:10px;max-width:480px;position:relative;z-index:2">Automatización e IA<br>para gestorías y asesorías</div>
      <div style="font-size:12px;color:rgba(255,255,255,.75);line-height:1.65;max-width:500px;position:relative;z-index:2">Ayudamos a gestorías fiscales, laborales e integrales a captar más clientes, eliminar el caos documental y cumplir todos los plazos fiscales sin depender de que alguien se acuerde — sin añadir más personal. Módulo a módulo, con impacto medible en el primer trimestre.</div>
    </div>
    <div style="background:#fff;padding:20px 40px">
      <div style="font-size:9px;letter-spacing:2px;color:#c4a84c;text-transform:uppercase;font-weight:800;margin-bottom:14px">Las 6 áreas que automatizamos</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
        ${[
          ["B1", "Alta y captación", "Presupuesto en minutos, alta completa sin llamadas y contrato firmado digitalmente desde el móvil"],
          ["B2", "Gestión documental", "Recogida mensual automática, canal único de envío, clasificación por IA y alertas de caducidad"],
          ["B3", "Fiscal y vencimientos", "Alertas de plazos con antelación suficiente y seguimiento del estado de cada expediente"],
          ["B4", "Laboral y nóminas", "Datos de empleados por canal estructurado, contratos temporales vigilados y nóminas distribuidas automáticamente"],
          ["B5", "Relación con el cliente", "CRM con historial automático, resúmenes de llamadas y reactivación de clientes inactivos"],
          ["B6", "Operativa interna", "Registro de gastos automático y conciliación bancaria sin hojas de cálculo"],
        ]
          .map(
            ([id, name, desc]) => `
          <div style="padding:12px 14px;background:#FEFCE8;border-radius:8px;border:1px solid #FEF9C3">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
              <div style="width:22px;height:22px;border-radius:50%;background:#1A1400;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <span style="font-weight:800;color:#c4a84c;font-size:8px">${id}</span>
              </div>
              <span style="font-weight:700;font-size:10px;color:#1A1A1A">${name}</span>
            </div>
            <div style="font-size:9px;color:#6B7280;line-height:1.45;padding-left:30px">${desc}</div>
          </div>`,
          )
          .join("")}
      </div>
    </div>
    <div style="background:#FEFCE8;padding:20px 40px">
      <div style="font-size:9px;letter-spacing:2px;color:#c4a84c;text-transform:uppercase;font-weight:800;margin-bottom:14px">Cómo lo ponemos en marcha</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
        ${[
          ["01", "Semanas 1–2", "Diagnóstico", "Revisamos captación, gestión documental y herramientas actuales. Identificamos los dos o tres procesos con más impacto sin añadir complejidad al equipo. Sin instalar nada todavía."],
          ["02", "Semanas 3–6", "Primeros módulos", "Activamos los procesos prioritarios — normalmente la recogida documental automática y las alertas fiscales. El equipo sigue trabajando igual: los procesos corren en segundo plano."],
          ["03", "Semanas 7–12", "Sistema completo", "Activamos relación con el cliente, operativa interna y visibilidad global. El sistema ya conoce la gestoría y genera valor de forma autónoma. Revisión mensual para ajustar."],
        ]
          .map(
            ([n, weeks, title, desc]) => `
          <div style="background:#fff;border-radius:8px;border:1px solid #EEE;padding:14px 16px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <div style="width:24px;height:24px;border-radius:50%;background:#c4a84c;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <span style="font-weight:800;color:#1A1400;font-size:9px">${n}</span>
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
    <div style="background:#1A1400;flex:1;padding:20px 40px 28px;display:grid;grid-template-columns:1fr 1fr;gap:24px;align-content:start">
      <div>
        <div style="font-size:9px;letter-spacing:2px;color:#D4A843;text-transform:uppercase;margin-bottom:10px">Con quién trabajamos</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${["Gestorías fiscales", "Gestorías laborales", "Asesorías integrales", "Despachos de economistas", "Abogados y asesores", "Gestorías multi-sede"]
            .map(
              (tag) => `
            <span style="padding:3px 10px;background:rgba(255,255,255,.07);color:#E8D49A;border-radius:99px;font-size:9px;border:1px solid rgba(255,255,255,.1)">${tag}</span>`,
            )
            .join("")}
        </div>
      </div>
      <div style="border-left:1px solid rgba(255,255,255,.08);padding-left:24px">
        <div style="font-size:9px;letter-spacing:2px;color:#D4A843;text-transform:uppercase;margin-bottom:10px">Nuestro compromiso</div>
        ${[
          "Módulos independientes — pausar o cambiar el orden no afecta al resto",
          "El primer módulo puede estar funcionando en menos de 2 semanas",
          "Nos adaptamos a tu software actual — A3, Sage, Wolters Kluwer y otros",
          "Sin corporativismos: hablamos de clientes, plazos y resultados, no de tecnología",
        ]
          .map(
            (t) => `
          <div style="display:flex;gap:7px;align-items:flex-start;margin-bottom:6px">
            <span style="color:#c4a84c;font-weight:800;font-size:10px;flex-shrink:0;margin-top:1px">✓</span>
            <span style="font-size:10px;color:#E8D49A;line-height:1.4">${t}</span>
          </div>`,
          )
          .join("")}
      </div>
    </div>
    <div style="padding:12px 40px;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;background:#1A1400">
      <span style="font-size:9px;color:rgba(255,255,255,.3);letter-spacing:1px;text-transform:uppercase">immoralia · Automatización &amp; IA · www.immoral.es</span>
      <span style="font-size:9px;color:rgba(255,255,255,.3);letter-spacing:1px;text-transform:uppercase">${today}</span>
    </div>
  </div>

  <!-- SCORE Y BLOQUES -->
  <div class="pg" style="padding:32px 40px 24px">
    <div class="section-label">Resultado global</div>
    <div style="background:#1A1400;border-radius:12px;padding:28px 32px;display:grid;grid-template-columns:140px 1fr;gap:28px;align-items:center;margin-bottom:24px">
      <div style="width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.08);border:4px solid #c4a84c;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto">
        <span style="font-size:44px;font-weight:800;color:#c4a84c;line-height:1">${s.global}</span>
        <span style="font-size:8px;letter-spacing:2px;color:#E8D49A;text-transform:uppercase;margin-top:2px">de 100</span>
      </div>
      <div>
        <div style="font-size:9px;letter-spacing:2px;color:#D4A843;text-transform:uppercase;margin-bottom:6px">Nivel de madurez operativa</div>
        <div style="font-size:22px;font-weight:800;color:#fff;line-height:1.2;margin-bottom:8px">${s.level.name}</div>
        <div style="font-size:12px;color:#E8D49A;line-height:1.6">${s.level.desc}</div>
      </div>
    </div>
    <div class="section-label" style="margin-bottom:12px">Score por área</div>
    ${blockRows}
    <div class="pg-footer"><span>immoralia · Auditoría de Madurez Operativa · ${c.company || c.name}</span><span>${today}</span></div>
  </div>

  <!-- RESUMEN EJECUTIVO -->
  <div class="pg" style="padding:32px 40px 24px">
    <div class="section-label">Resumen ejecutivo</div>
    <div style="font-size:22px;font-weight:800;color:#1A1A1A;margin-bottom:4px">Hallazgos clave de tu auditoría</div>
    <div style="font-size:12px;color:#6B7280;margin-bottom:18px">Diagnóstico ejecutivo basado en los resultados de las 6 áreas evaluadas.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:22px">
      <div style="padding:20px;background:#1A1400;border-radius:10px;text-align:center">
        <div style="font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:4px">Tu score global</div>
        <div style="font-size:40px;font-weight:800;color:#c4a84c;line-height:1">${s.global}</div>
        <div style="font-size:9px;color:rgba(255,255,255,0.4);margin-top:2px">/100</div>
      </div>
      <div style="padding:20px;background:#F9FAFB;border-radius:10px;text-align:center;border:1px solid #E5E7EB">
        <div style="font-size:9px;letter-spacing:2px;color:#6B7280;text-transform:uppercase;margin-bottom:4px">Benchmark sector</div>
        <div style="font-size:40px;font-weight:800;color:#374151;line-height:1">${benchmark}</div>
        <div style="font-size:9px;color:#6B7280;margin-top:2px">Media gestorías y asesorías</div>
      </div>
      <div style="padding:20px;background:${vsBg};border-radius:10px;text-align:center;border:1px solid ${vsBorder}">
        <div style="font-size:9px;letter-spacing:2px;color:${vsColor};text-transform:uppercase;margin-bottom:4px">Vs. benchmark</div>
        <div style="font-size:40px;font-weight:800;color:${vsColor};line-height:1">${vsText}</div>
        <div style="font-size:9px;color:#6B7280;margin-top:2px">puntos</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
      <div>
        <div style="font-size:9px;letter-spacing:2px;color:#059669;text-transform:uppercase;font-weight:700;margin-bottom:10px">Puntos fuertes</div>
        ${topBlocksHtml}
      </div>
      <div>
        <div style="font-size:9px;letter-spacing:2px;color:#DC2626;text-transform:uppercase;font-weight:700;margin-bottom:10px">Áreas de mejora</div>
        ${bottomBlocksHtml}
      </div>
    </div>
    ${riskHtml}
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
    <div style="background:linear-gradient(135deg,#1A1400,#0D0900);color:#fff;padding:40px;border-radius:14px;margin-bottom:20px">
      <div style="font-size:9px;letter-spacing:3px;color:#D4A843;text-transform:uppercase;margin-bottom:10px">Siguiente paso</div>
      <div style="font-size:24px;font-weight:800;color:#fff;margin-bottom:10px">¿Por dónde empezamos?</div>
      <div style="font-size:13px;color:#E8D49A;max-width:460px;line-height:1.65;margin-bottom:28px">Una conversación de 30 minutos para ver qué frena la captación de clientes y la eficiencia operativa, qué ya tenéis montado y qué módulo puede generar impacto antes del próximo trimestre. Sin compromiso, sin presentaciones largas.</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <div style="padding:12px 24px;background:#c4a84c;color:#1A1400;border-radius:99px;font-weight:700;font-size:11px;letter-spacing:.5px">immoralia.es/procesos</div>
        <div style="padding:12px 24px;background:rgba(255,255,255,.08);color:#fff;border-radius:99px;font-weight:600;font-size:11px;letter-spacing:.3px;border:1px solid rgba(255,255,255,.15)">immoralia.es/procesos/sector/gestorias</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px">
      <div style="background:#FEFCE8;border-radius:10px;padding:18px;border:1px solid #FEF9C3">
        <div style="width:28px;height:28px;border-radius:50%;background:#c4a84c;display:flex;align-items:center;justify-content:center;margin-bottom:10px">
          <span style="color:#1A1400;font-size:13px;font-weight:800">✓</span>
        </div>
        <div style="font-size:12px;font-weight:700;color:#1A1A1A;margin-bottom:4px">Nos adaptamos a tu software de gestión actual</div>
        <div style="font-size:11px;color:#6B7280;line-height:1.5">No hace falta cambiar nada de lo que ya funciona.</div>
      </div>
      <div style="background:#FEFCE8;border-radius:10px;padding:18px;border:1px solid #FEF9C3">
        <div style="width:28px;height:28px;border-radius:50%;background:#c4a84c;display:flex;align-items:center;justify-content:center;margin-bottom:10px">
          <span style="color:#1A1400;font-size:13px;font-weight:800">✓</span>
        </div>
        <div style="font-size:12px;font-weight:700;color:#1A1A1A;margin-bottom:4px">Primer módulo en menos de 2 semanas</div>
        <div style="font-size:11px;color:#6B7280;line-height:1.5">Desde que decidimos arrancar hasta que funciona en tu proceso.</div>
      </div>
    </div>
    <div style="text-align:center;color:#bbb;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;padding-top:16px;border-top:1px solid #EEE">
      immoralia · Automatización &amp; IA · Parte de Immoral Group · www.immoral.es
    </div>
  </div>`;
}
