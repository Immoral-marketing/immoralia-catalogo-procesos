'use client'
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GS_AUDIT_BLOCKS,
  GS_AUDIT_BLOCK_KEYS,
  GS_AUDIT_LEVELS,
  GS_AUDIT_QUESTIONS,
  GS_AUDIT_TIPO_GESTORIA,
  GS_AUDIT_NUM_CLIENTES,
  GS_AUDIT_CANALES,
  GS_AUDIT_PRIORIDADES,
  buildGsModulesByBlock,
  type GsAuditBlockId,
  type GsAuditLevel,
  type GsAuditQuestion,
} from "@/data/auditoriaGestoriasData";
import { processes } from "@/data/processes";
import { downloadGsAuditPdf, type GsAuditState } from "@/lib/auditoriaGestoriasPdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  ListChecks,
  Lock,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import immoraliaLogo from "@/assets/immoralia_logo.png";

const GS_MODULES = buildGsModulesByBlock(processes);

const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/oAgj6wUxweXdbWMvz0Gn/webhook-trigger/673af019-7b64-4d52-ac6b-e0adbcb12a60";

type Screen = "intro" | "questions" | "contact" | "result";
type AnswerValue = string | string[] | number;

interface Contact {
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
}

const parseScaleHelp = (help: string): { hint1: string; hint5: string } | null => {
  const m = help.match(/^\s*1\s*=\s*(.+?)\s*;\s*5\s*=\s*(.+?)\s*$/i);
  return m ? { hint1: m[1], hint5: m[2] } : null;
};

const SCALE_LABELS = ["Nada", "Poco", "A medias", "Bastante", "Totalmente"];

const AuditoriaGestorias = () => {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("intro");
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [contact, setContact] = useState<Contact>({
    name: "",
    role: "",
    company: "",
    email: "",
    phone: "",
  });
  const [result, setResult] = useState<{
    blockScores: Record<GsAuditBlockId, number>;
    global: number;
    level: GsAuditLevel;
  } | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen, cur]);

  const total = GS_AUDIT_QUESTIONS.length;
  const stepNum = cur + 1;
  const pct = Math.round((stepNum / (total + 1)) * 100);

  const q = GS_AUDIT_QUESTIONS[cur];
  const currentAnswer = answers[cur];

  const canAdvance = useMemo(() => {
    if (currentAnswer === undefined) return false;
    if (Array.isArray(currentAnswer)) return currentAnswer.length > 0;
    return true;
  }, [currentAnswer]);

  const start = () => {
    setScreen("questions");
    setCur(0);
  };

  const pick = (idx: number, val: string | number) => {
    const question = GS_AUDIT_QUESTIONS[idx];
    if (question.type === "choice" && question.multiselect) {
      setAnswers((prev) => {
        const arr = Array.isArray(prev[idx]) ? [...(prev[idx] as string[])] : [];
        const pos = arr.indexOf(val as string);
        if (pos === -1) arr.push(val as string);
        else arr.splice(pos, 1);
        const next = { ...prev };
        if (arr.length) next[idx] = arr;
        else delete next[idx];
        return next;
      });
    } else {
      setAnswers((prev) => ({ ...prev, [idx]: val }));
      setTimeout(() => {
        setCur((c) => {
          if (c !== idx) return c;
          if (idx < total - 1) return c + 1;
          setScreen("contact");
          return c;
        });
      }, 280);
    }
  };

  const next = () => {
    if (!canAdvance) return;
    if (cur < total - 1) setCur(cur + 1);
    else setScreen("contact");
  };

  const prev = () => {
    if (screen === "contact") {
      setScreen("questions");
      return;
    }
    if (cur > 0) setCur(cur - 1);
    else setScreen("intro");
  };

  const finish = () => {
    if (!contact.name.trim() || !contact.email.trim()) {
      alert("Por favor completa al menos tu nombre y correo.");
      return;
    }

    const byBlock: Record<GsAuditBlockId, number[]> = {
      B1: [],
      B2: [],
      B3: [],
      B4: [],
      B5: [],
      B6: [],
    };
    GS_AUDIT_QUESTIONS.forEach((qq, i) => {
      if (qq.type === "scale" && answers[i] !== undefined) {
        byBlock[qq.block].push(answers[i] as number);
      }
    });
    const blockScores = {} as Record<GsAuditBlockId, number>;
    GS_AUDIT_BLOCK_KEYS.forEach((b) => {
      const arr = byBlock[b];
      if (!arr.length) {
        blockScores[b] = 0;
        return;
      }
      const avg = arr.reduce((a, c) => a + c, 0) / arr.length;
      blockScores[b] = Math.round(((avg - 1) / 4) * 100);
    });

    const global = Math.round(
      GS_AUDIT_BLOCK_KEYS.reduce((a, b) => a + blockScores[b], 0) / GS_AUDIT_BLOCK_KEYS.length,
    );
    const level =
      GS_AUDIT_LEVELS.find((l) => global >= l.min && global <= l.max) ?? GS_AUDIT_LEVELS[0];

    setResult({ blockScores, global, level });
    setScreen("result");

    if (!GHL_WEBHOOK_URL.includes("LOCATION_ID")) {
      const payload = {
        first_name: contact.name.split(" ")[0],
        last_name: contact.name.split(" ").slice(1).join(" "),
        email: contact.email,
        phone: contact.phone,
        company_name: contact.company,
        custom_fields: {
          audit_score_global: global,
          audit_level: level.name,
          audit_score_b1: blockScores.B1,
          audit_score_b2: blockScores.B2,
          audit_score_b3: blockScores.B3,
          audit_score_b4: blockScores.B4,
          audit_score_b5: blockScores.B5,
          audit_score_b6: blockScores.B6,
          audit_tipo_gestoria: GS_AUDIT_TIPO_GESTORIA[(answers[0] as string) || "A"] || "—",
          audit_num_clientes: GS_AUDIT_NUM_CLIENTES[(answers[1] as string) || "A"] || "—",
          audit_canales: (Array.isArray(answers[2])
            ? (answers[2] as string[])
            : [answers[2] as string].filter(Boolean)
          )
            .map((k) => GS_AUDIT_CANALES[k] || k)
            .join(", "),
          audit_priority: (Array.isArray(answers[13])
            ? (answers[13] as string[])
            : [answers[13] as string].filter(Boolean)
          )
            .map((k) => GS_AUDIT_PRIORIDADES[k] || k)
            .join(", ") || "—",
          audit_sector: "gestorias",
          audit_completed_at: new Date().toISOString(),
        },
        tags: [
          "audit_completed",
          "gestorias",
          `score_${global < 40 ? "bajo" : global < 70 ? "medio" : "alto"}`,
        ],
      };
      fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.error("GHL webhook error", err));
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const state: GsAuditState = {
      contact,
      answers,
      blockScores: result.blockScores,
      global: result.global,
      level: result.level,
    };
    downloadGsAuditPdf(state, setPdfBusy);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-yellow-500/30 font-sans">
      {/* NAV */}
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/auditorias">
            <img
              src={immoraliaLogo}
              alt="Immoralia"
              className="h-8 transition-opacity hover:opacity-80"
            />
          </Link>
          <button
            onClick={() => router.push("/auditorias")}
            className="text-sm text-gray-400 hover:text-yellow-300 transition-colors flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver a auditorías
          </button>
        </div>
      </nav>

      {/* PROGRESS BAR */}
      {(screen === "questions" || screen === "contact") && (
        <div className="sticky top-[65px] z-40 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/5">
          <div className="container mx-auto px-6 py-3">
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 transition-all duration-500"
                style={{ width: screen === "contact" ? "95%" : `${pct}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[11px] tracking-widest uppercase text-gray-500">
                {screen === "contact" ? "Datos de contacto" : `Paso ${stepNum} de ${total}`}
              </span>
              <span className="text-[11px] tracking-widest uppercase text-yellow-400">
                {screen === "contact" ? "95%" : `${pct}%`}
              </span>
            </div>
          </div>
        </div>
      )}

      {screen === "intro" && <IntroScreen onStart={start} />}

      {screen === "questions" && q && (
        <QuestionScreen
          q={q}
          idx={cur}
          answer={currentAnswer}
          isLast={cur === total - 1}
          canAdvance={canAdvance}
          onPick={pick}
          onNext={next}
          onPrev={prev}
        />
      )}

      {screen === "contact" && (
        <ContactScreen
          contact={contact}
          onChange={setContact}
          onPrev={prev}
          onFinish={finish}
        />
      )}

      {screen === "result" && result && (
        <ResultScreen
          contact={contact}
          result={result}
          pdfBusy={pdfBusy}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

/* ───────────────────────── INTRO ───────────────────────── */
const IntroScreen = ({ onStart }: { onStart: () => void }) => (
  <section className="relative py-24 md:py-32 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/8 via-transparent to-yellow-700/8 pointer-events-none" />
    <div className="absolute top-1/3 left-0 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 blur-[140px] rounded-full pointer-events-none" />
    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-yellow-700/8 blur-[160px] rounded-full pointer-events-none" />

    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-7">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-yellow-300 font-medium tracking-widest uppercase text-[11px]">
            Auditoría confidencial · Gestorías y Asesorías 2026
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-7 tracking-tight leading-[1.05]">
          Descubre qué está frenando la{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
            eficiencia y el crecimiento
          </span>{" "}
          de tu gestoría o despacho.
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-5 leading-relaxed">
          Te hacemos las preguntas que importan sobre cómo gestionas la documentación de clientes,
          los plazos fiscales, las altas, las nóminas y la relación con tu cartera. Recibes un{" "}
          <span className="text-white font-semibold">informe personalizado en PDF</span> con tu
          nivel de madurez operativa y los módulos que recomendamos activar primero.
        </p>
        <p className="text-base text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Sin compromiso, sin tarjeta y sin que nadie te llame al día siguiente para venderte
          nada que no necesites. Si después quieres una conversación, tú la pides.
        </p>

        <div className="flex flex-wrap gap-2.5 justify-center mb-10">
          {[
            { icon: FileText, label: "Informe PDF personalizado" },
            { icon: ListChecks, label: "15 preguntas guiadas" },
            { icon: Lock, label: "100% Confidencial" },
            { icon: CheckCircle2, label: "Sin tarjeta ni compromiso" },
          ].map((it, i) => {
            const Icon = it.icon;
            return (
              <div
                key={i}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300"
              >
                <Icon className="w-3.5 h-3.5 text-yellow-400" /> {it.label}
              </div>
            );
          })}
        </div>

        <Button
          size="lg"
          onClick={onStart}
          className="bg-yellow-600 hover:bg-yellow-500 text-white h-16 px-10 text-lg gap-2 font-bold shadow-lg shadow-yellow-900/40 transition-all hover:scale-[1.02]"
        >
          Empezar mi auditoría <ArrowRight className="w-5 h-5" />
        </Button>

        <p className="text-xs text-gray-500 mt-6 flex items-center gap-2 justify-center">
          <Clock className="w-3.5 h-3.5" />
          La mayoría la termina en menos de lo que dura un café
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            n: "01",
            title: "Tu score de madurez operativa",
            desc: "Una nota de 0 a 100 con el nivel en el que está hoy tu gestoría frente a un despacho moderno bien sistematizado.",
          },
          {
            n: "02",
            title: "Diagnóstico por área",
            desc: "Score detallado en las 6 áreas clave: alta y captación, documentación, fiscal, laboral, relación con el cliente y operativa interna.",
          },
          {
            n: "03",
            title: "Módulos prioritarios",
            desc: "Los 3-5 módulos que recomendamos activar primero — basados en las áreas más débiles de tu operativa y en tus prioridades del trimestre.",
          },
        ].map((it) => (
          <div
            key={it.n}
            className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-yellow-500/20 transition-all"
          >
            <div className="text-yellow-400 text-xs tracking-widest font-bold mb-3">{it.n}</div>
            <h3 className="text-lg font-bold text-white mb-2">{it.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{it.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ───────────────────────── QUESTION ───────────────────────── */
const QuestionScreen = ({
  q,
  idx,
  answer,
  isLast,
  canAdvance,
  onPick,
  onNext,
  onPrev,
}: {
  q: GsAuditQuestion;
  idx: number;
  answer: AnswerValue | undefined;
  isLast: boolean;
  canAdvance: boolean;
  onPick: (idx: number, val: string | number) => void;
  onNext: () => void;
  onPrev: () => void;
}) => (
  <section className="py-12 md:py-20">
    <div className="container mx-auto px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-yellow-400 text-[11px] tracking-widest font-bold uppercase mb-3">
          {q.cat}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
          {q.title}
        </h2>
        {q.help && (() => {
          const p = q.type === "scale" ? parseScaleHelp(q.help!) : null;
          return p ? (
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/[0.08] border border-yellow-500/20">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-black text-xs font-bold flex items-center justify-center">1</span>
                <p className="text-gray-300 text-sm leading-snug">{p.hint1}</p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/[0.08] border border-yellow-500/20">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-black text-xs font-bold flex items-center justify-center">5</span>
                <p className="text-gray-300 text-sm leading-snug">{p.hint5}</p>
              </div>
            </div>
          ) : <p className="text-gray-400 mb-8 leading-relaxed">{q.help}</p>;
        })()}

        {q.type === "choice" && (
          <div className="grid gap-2.5 mb-8">
            {q.options.map((o) => {
              let selected = false;
              if (q.multiselect) {
                selected = Array.isArray(answer) && answer.includes(o.k);
              } else {
                selected = answer === o.k;
              }
              return (
                <button
                  key={o.k}
                  onClick={() => onPick(idx, o.k)}
                  className={`group text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                    selected
                      ? "bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_24px_rgba(196,168,76,0.18)]"
                      : "bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-8 h-8 inline-flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                      q.multiselect
                        ? selected
                          ? "bg-yellow-500 text-white"
                          : "bg-white/5 text-gray-500 border border-white/15 group-hover:text-gray-300"
                        : selected
                          ? "bg-yellow-500 text-white"
                          : "bg-white/5 text-gray-400 group-hover:text-white"
                    }`}
                    style={!q.multiselect ? {} : { borderRadius: "8px" }}
                  >
                    {q.multiselect ? (selected ? "✓" : "") : o.k}
                  </span>
                  <span
                    className={`text-[15px] leading-snug ${
                      selected ? "text-white" : "text-gray-300 group-hover:text-white"
                    }`}
                  >
                    {o.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {q.type === "scale" && (
          <>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {(q.scaleLabels ?? SCALE_LABELS).map((lbl, i) => {
                const val = i + 1;
                const selected = answer === val;
                return (
                  <button
                    key={val}
                    onClick={() => onPick(idx, val)}
                    className={`group flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl border transition-all ${
                      selected
                        ? "bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_24px_rgba(196,168,76,0.18)]"
                        : "bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span
                      className={`w-9 h-9 inline-flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                        selected
                          ? "bg-yellow-500 text-white"
                          : "bg-white/5 text-gray-400 group-hover:text-white"
                      }`}
                    >
                      {val}
                    </span>
                    <span
                      className={`text-[10px] md:text-[11px] uppercase tracking-wider leading-tight text-center ${
                        selected ? "text-yellow-300" : "text-gray-500 group-hover:text-gray-300"
                      }`}
                    >
                      {lbl}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 mb-8">
              <span>{q.scaleHints?.[0] ?? "1 — No lo hacemos"}</span>
              <span>{q.scaleHints?.[1] ?? "5 — Es sistemático"}</span>
            </div>
          </>
        )}

        <div className="flex justify-between items-center gap-3 mt-8 pt-6 border-t border-white/5">
          <Button
            variant="outline"
            onClick={onPrev}
            className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5 gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Atrás
          </Button>
          <Button
            onClick={onNext}
            disabled={!canAdvance}
            className="bg-yellow-600 hover:bg-yellow-500 text-white disabled:bg-white/10 disabled:text-gray-500 gap-2 font-semibold"
          >
            {isLast ? "Continuar" : "Siguiente"} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </section>
);

/* ───────────────────────── CONTACT ───────────────────────── */
const ContactScreen = ({
  contact,
  onChange,
  onPrev,
  onFinish,
}: {
  contact: Contact;
  onChange: (c: Contact) => void;
  onPrev: () => void;
  onFinish: () => void;
}) => (
  <section className="py-12 md:py-20">
    <div className="container mx-auto px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-yellow-400 text-[11px] tracking-widest font-bold uppercase mb-3">
          Último paso · Tus datos
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
          Para preparar tu informe personalizado
        </h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Lo recibirás también por correo en formato PDF. No compartiremos tus datos con terceros
          ni con tu competencia.
        </p>

        <div className="grid gap-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                Nombre y apellidos
              </Label>
              <Input
                value={contact.name}
                onChange={(e) => onChange({ ...contact, name: e.target.value })}
                placeholder="Ej. María García"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-12"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                Cargo
              </Label>
              <Input
                value={contact.role}
                onChange={(e) => onChange({ ...contact, role: e.target.value })}
                placeholder="Ej. Socia gestora"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-12"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                Nombre de la gestoría / despacho
              </Label>
              <Input
                value={contact.company}
                onChange={(e) => onChange({ ...contact, company: e.target.value })}
                placeholder="Ej. Assessoria García i Associats"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-12"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
                Correo electrónico
              </Label>
              <Input
                type="email"
                value={contact.email}
                onChange={(e) => onChange({ ...contact, email: e.target.value })}
                placeholder="maria@migestoria.es"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-12"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">
              WhatsApp (con código de país)
            </Label>
            <Input
              value={contact.phone}
              onChange={(e) => onChange({ ...contact, phone: e.target.value })}
              placeholder="Ej. +34 612 345 678"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-12"
            />
          </div>
        </div>

        <div className="flex justify-between items-center gap-3 mt-10 pt-6 border-t border-white/5">
          <Button
            variant="outline"
            onClick={onPrev}
            className="bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5 gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Atrás
          </Button>
          <Button
            onClick={onFinish}
            className="bg-yellow-600 hover:bg-yellow-500 text-white gap-2 font-semibold h-12 px-6"
          >
            Generar mi informe <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-gray-600 mt-6 flex items-center gap-2 justify-center">
          <Lock className="w-3 h-3" /> Tus datos viajan cifrados y nunca se compartirán con
          terceros.
        </p>
      </div>
    </div>
  </section>
);

/* ───────────────────────── RESULT ───────────────────────── */
const ResultScreen = ({
  contact,
  result,
  pdfBusy,
  onDownload,
}: {
  contact: Contact;
  result: { blockScores: Record<GsAuditBlockId, number>; global: number; level: GsAuditLevel };
  pdfBusy: boolean;
  onDownload: () => void;
}) => {
  const sorted = GS_AUDIT_BLOCK_KEYS.map((b) => ({ b, sc: result.blockScores[b] })).sort(
    (a, b) => b.sc - a.sc,
  );
  const strong = sorted.filter((x) => x.sc >= 60).slice(0, 3);
  const weak = sorted
    .filter((x) => x.sc < 60)
    .sort((a, b) => a.sc - b.sc)
    .slice(0, 3);

  const targetBlocks = weak.length ? weak : sorted.slice(-3);
  const modules: {
    ref: string;
    name: string;
    desc: string;
    impact: string;
    block: GsAuditBlockId;
  }[] = [];
  let added = 0;
  targetBlocks.forEach((x) => {
    const mods = GS_MODULES[x.b] || [];
    const lastBlockKey = sorted[sorted.length - 1].b;
    mods.slice(0, x.b === lastBlockKey ? 2 : 1).forEach((m) => {
      if (added >= 5) return;
      modules.push({ ...m, block: x.b });
      added++;
    });
  });

  const firstName = (contact.name || "—").split(" ")[0];
  const arcCirc = 2 * Math.PI * 86;
  const arcOffset = arcCirc - (arcCirc * result.global) / 100;

  let ctaTitle = "Convirtamos tu operativa en sistema.";
  let ctaSub =
    "Una conversación de 30 minutos para ver qué frena la eficiencia y el crecimiento, qué ya tenéis montado y qué módulo puede generar impacto antes del próximo trimestre.";
  if (result.global < 50) {
    ctaTitle = "Cada plazo que se pasa por despiste es tiempo y dinero que no recuperas.";
    ctaSub =
      "Tu nivel indica que hay módulos que pueden activarse en menos de dos semanas con impacto visible desde el primer mes. Agenda 30 min con nuestro equipo y preparamos un plan modular para tu gestoría.";
  } else if (result.global < 75) {
    ctaTitle = "Ya tienes una base. Falta hacerla sistema.";
    ctaSub =
      "Tienes piezas funcionando. Lo que falta es cerrar los huecos: recogida documental automática, alertas de vencimientos y una capa de CRM que registre cada interacción con el cliente sin trabajo manual.";
  } else {
    ctaTitle = "Estás en el percentil alto. La conversación ahora es de escala.";
    ctaSub =
      "Tu operativa ya está sólida. Hablemos sobre personalización por perfil de cliente, reactivación de clientes inactivos y escalar el modelo a nuevas sedes o la incorporación de servicios de mayor valor añadido.";
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Download bar */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={onDownload}
              disabled={pdfBusy}
              className="bg-yellow-600 hover:bg-yellow-500 text-white h-14 px-7 text-base gap-2 font-bold shadow-lg shadow-yellow-900/30 transition-all hover:scale-[1.02]"
            >
              <Download className="w-5 h-5" />
              {pdfBusy ? "Preparando PDF…" : "Descargar informe completo (PDF)"}
            </Button>
          </div>

          {/* Score hero */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1A1400] to-[#0D0900] p-8 md:p-12 mb-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 items-center">
            <div className="relative w-[200px] h-[200px] mx-auto">
              <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="rgba(255,255,255,.08)"
                  strokeWidth="14"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="#c4a84c"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={arcCirc}
                  strokeDashoffset={arcOffset}
                  style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold text-yellow-400 leading-none">
                  {result.global}
                </span>
                <span className="text-[10px] tracking-widest text-gray-400 uppercase mt-1">
                  de 100
                </span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-yellow-300 text-[11px] tracking-widest uppercase font-bold mb-2">
                Hola {firstName} — Tu nivel de madurez operativa
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                {result.level.name}
              </h2>
              <p className="text-gray-300 leading-relaxed text-base">{result.level.desc}</p>
            </div>
          </div>

          {/* Score por bloque */}
          <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-7 md:p-8 mb-6">
            <div className="text-yellow-400 text-[11px] tracking-widest font-bold uppercase mb-5">
              Score por área operativa
            </div>
            <div className="grid gap-3.5">
              {GS_AUDIT_BLOCK_KEYS.map((b) => {
                const sc = result.blockScores[b];
                const color =
                  sc < 40 ? "bg-red-500" : sc < 70 ? "bg-yellow-700" : "bg-yellow-400";
                const textColor =
                  sc < 40 ? "text-red-400" : sc < 70 ? "text-yellow-500" : "text-yellow-400";
                return (
                  <div
                    key={b}
                    className="grid grid-cols-[48px_1fr_72px] gap-4 items-center p-4 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#1A1400] border border-yellow-500/30 flex items-center justify-center">
                      <span className="text-yellow-400 font-bold text-sm">{b}</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">
                        {GS_AUDIT_BLOCKS[b].name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 mb-2">
                        {GS_AUDIT_BLOCKS[b].short}
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color} transition-all duration-1000`}
                          style={{ width: `${sc}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${textColor}`}>{sc}</span>
                      <span className="text-[10px] text-gray-500 block">/100</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagnóstico */}
          <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-7 md:p-8 mb-6">
            <div className="text-yellow-400 text-[11px] tracking-widest font-bold uppercase mb-5">
              Diagnóstico
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04]">
                <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Dónde estás bien
                </h4>
                <ul className="space-y-2.5">
                  {strong.length ? (
                    strong.map((x) => (
                      <li key={x.b} className="text-sm text-gray-300 flex gap-2.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <span>
                          {GS_AUDIT_BLOCKS[x.b].name} —{" "}
                          <span className="text-emerald-300 font-semibold">{x.sc}/100</span>
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-400 leading-relaxed">
                      Aún no tienes ningún bloque sobre 60. Hay trabajo de fundación pendiente
                      — y eso significa que el primer cambio va a tener impacto desproporcionado.
                    </li>
                  )}
                </ul>
              </div>
              <div className="p-5 rounded-2xl border border-red-500/25 bg-red-500/[0.04]">
                <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 inline-flex items-center justify-center rounded-full bg-red-500/30 text-red-300 text-[10px] font-bold">
                    !
                  </span>
                  Dónde se pierde tiempo y clientes
                </h4>
                <ul className="space-y-2.5">
                  {weak.length ? (
                    weak.map((x) => (
                      <li key={x.b} className="text-sm text-gray-300 flex gap-2.5 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                        <span>
                          {GS_AUDIT_BLOCKS[x.b].name} —{" "}
                          <span className="text-red-300 font-semibold">{x.sc}/100</span>
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-400 leading-relaxed">
                      Tu operativa está sólida en todos los frentes. La conversación ahora es de
                      optimización fina y crecimiento de cartera.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Módulos prioritarios */}
          <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-7 md:p-8 mb-6">
            <div className="text-yellow-400 text-[11px] tracking-widest font-bold uppercase mb-1">
              Módulos prioritarios para tu gestoría
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
              Lo que recomendamos activar primero
            </h3>
            <div className="grid gap-3.5">
              {modules.map((m, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border-l-4 border-yellow-500 bg-white/[0.02] border-t border-r border-b border-white/5"
                >
                  <div className="text-[10px] tracking-widest text-yellow-400 font-bold uppercase mb-1">
                    {m.ref} · {GS_AUDIT_BLOCKS[m.block].name}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{m.name}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed mb-3">{m.desc}</p>
                  <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 text-[10px] uppercase tracking-widest font-bold border border-yellow-500/20">
                    {m.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA final */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1A1400] to-[#0D0900] border border-yellow-500/20 p-8 md:p-10 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">{ctaTitle}</h3>
            <p className="text-gray-300 mb-7 max-w-xl mx-auto leading-relaxed">{ctaSub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://api.leadconnectorhq.com/widget/booking/KMjgjNKzL0zYDoJyU8Ta"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full bg-yellow-500 text-[#1A1400] font-bold hover:bg-yellow-400 transition-all"
              >
                Agendar llamada de 30 min <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/sector/gestorias"
                className="inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full bg-white/5 text-white border border-white/20 font-semibold hover:bg-white/10 transition-all"
              >
                Ver catálogo de módulos
              </Link>
            </div>
          </div>

          <footer className="mt-12 pt-6 border-t border-white/5 text-center text-xs text-gray-600">
            Auditoría generada por immoralia · Automatización & IA · 2026 · www.immoral.es ·
            @immoral.group · Confidencial
          </footer>
        </div>
      </div>
    </section>
  );
};

export default AuditoriaGestorias;
