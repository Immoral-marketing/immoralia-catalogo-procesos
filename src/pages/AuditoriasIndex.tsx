import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Utensils,
  Dumbbell,
  Briefcase,
  Stethoscope,
  HardHat,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import immoraliaLogo from "@/assets/immoralia_logo.png";

interface SectorAudit {
  id: string;
  title: string;
  short: string;
  icon: LucideIcon;
  path: string;
  status: "available" | "soon";
  accent: string;
  color?: "orange" | "cyan" | "violet" | "teal" | "yellow";
  bullets: string[];
}

const AUDITS: SectorAudit[] = [
  {
    id: "restaurantes",
    title: "Restaurantes",
    short: "Auditoría de madurez operativa para restaurantes modernos",
    icon: Utensils,
    path: "/auditorias/restaurantes",
    status: "available",
    color: "orange",
    accent: "from-orange-500/30 to-red-500/30",
    bullets: [
      "Reservas y atención 24/7",
      "Reputación, fidelización y base de clientes",
      "Visibilidad operativa, equipo y marketing",
    ],
  },
  {
    id: "centros-deportivos",
    title: "Centros deportivos",
    short: "Para gimnasios, crossfit, yoga, natación y academias deportivas",
    icon: Dumbbell,
    path: "/auditorias/deportivos",
    status: "available",
    color: "cyan",
    accent: "from-cyan-500/30 to-blue-500/30",
    bullets: [
      "Reservas 24/7 y captación de socios sin perder leads",
      "Retención, cobros automáticos y detección de baja anticipada",
      "Turnos de instructores, KPIs y reputación online",
    ],
  },
  {
    id: "salud",
    title: "Centros de salud",
    short: "Clínicas dentales, fisio, estética, veterinaria y médicos",
    icon: Stethoscope,
    path: "/auditorias/salud",
    status: "available",
    color: "teal",
    accent: "from-teal-500/30 to-teal-700/30",
    bullets: [
      "Agenda 24/7 y reducción de ausencias",
      "Reseñas automáticas y retención de pacientes",
      "Facturación a mutuas y visibilidad diaria",
    ],
  },
  {
    id: "gestorias",
    title: "Gestorías",
    short: "Despachos profesionales, asesorías fiscales y laborales",
    icon: Briefcase,
    path: "/auditorias/gestorias",
    status: "available",
    color: "yellow",
    accent: "from-yellow-500/30 to-amber-600/30",
    bullets: [
      "Recogida documental automática y cero persecución de clientes",
      "Plazos fiscales blindados y seguimiento de expedientes",
      "Alta de clientes, contratos digitales y CRM con historial automático",
    ],
  },
  {
    id: "construccion",
    title: "Construcción & promotoras",
    short: "Promotoras, constructoras, reformas y rehabilitación",
    icon: HardHat,
    path: "/auditorias/constructoras",
    status: "available",
    color: "cyan",
    accent: "from-cyan-500/30 to-cyan-700/30",
    bullets: [
      "Captación, cualificación y pipeline en tiempo real",
      "Seguimiento y visitas al piso piloto",
      "Cierre, firma digital y postventa",
    ],
  },
  {
    id: "academias",
    title: "Academias / Formación",
    short: "Idiomas, FP, autoescuelas, refuerzo escolar, música y artes",
    icon: GraduationCap,
    path: "/auditorias/academias",
    status: "available",
    color: "violet",
    accent: "from-violet-500/30 to-purple-500/30",
    bullets: [
      "Captación de alumnos y respuesta 24/7",
      "Matriculación digital y gestión de cobros",
      "Retención, bajas anticipadas y reactivación",
    ],
  },
];

const AuditoriasIndex = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const available = AUDITS.filter((a) => a.status === "available");

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-orange-500/30 font-sans">
      {/* NAV */}
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/">
            <img
              src={immoraliaLogo}
              alt="Immoralia"
              className="h-8 transition-opacity hover:opacity-80"
            />
          </Link>
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-orange-300 transition-colors"
          >
            Ver catálogo de procesos
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-24 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 via-transparent to-amber-500/8 pointer-events-none" />
        <div className="absolute top-1/3 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/12 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.05]">
              Descubre qué procesos están <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                consumiendo tu negocio
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Una serie de auditorías específicas por sector. Te hacemos las preguntas que
              importan y recibes un informe en PDF con tu nivel de madurez operativa y los
              módulos que recomendamos activar primero.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2.5 justify-center mt-8">
              {[
                { icon: FileText, label: "Informe PDF" },
                { icon: ListChecks, label: "Preguntas guiadas" },
                { icon: Lock, label: "100% Confidencial" },
                { icon: CheckCircle2, label: "Sin tarjeta" },
              ].map((it, i) => {
                const Icon = it.icon;
                return (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300"
                  >
                    <Icon className="w-3.5 h-3.5 text-orange-400" /> {it.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* AVAILABLE */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Empieza tu auditoría
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {available.map((a) => {
                const Icon = a.icon;
                const c = a.color ?? "orange";
                const styles = {
                  orange: {
                    border: "border-orange-500/30 hover:border-orange-500/50 hover:shadow-[0_0_40px_rgba(234,88,12,0.15)]",
                    icon: "bg-orange-500/15 border border-orange-500/30",
                    iconText: "text-orange-400",
                    check: "text-orange-400",
                    btn: "bg-orange-600 hover:bg-orange-500",
                  },
                  cyan: {
                    border: "border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]",
                    icon: "bg-cyan-500/15 border border-cyan-500/30",
                    iconText: "text-cyan-400",
                    check: "text-cyan-400",
                    btn: "bg-cyan-600 hover:bg-cyan-500",
                  },
                  violet: {
                    border: "border-violet-500/30 hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]",
                    icon: "bg-violet-500/15 border border-violet-500/30",
                    iconText: "text-violet-400",
                    check: "text-violet-400",
                    btn: "bg-violet-600 hover:bg-violet-500",
                  },
                  teal: {
                    border: "border-teal-500/30 hover:border-teal-500/50 hover:shadow-[0_0_40px_rgba(20,184,166,0.15)]",
                    icon: "bg-teal-500/15 border border-teal-500/30",
                    iconText: "text-teal-400",
                    check: "text-teal-400",
                    btn: "bg-teal-600 hover:bg-teal-500",
                  },
                  yellow: {
                    border: "border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-[0_0_40px_rgba(196,168,76,0.15)]",
                    icon: "bg-yellow-500/15 border border-yellow-500/30",
                    iconText: "text-yellow-400",
                    check: "text-yellow-400",
                    btn: "bg-yellow-600 hover:bg-yellow-500",
                  },
                } as const;
                const s = styles[c];
                return (
                  <Link
                    key={a.id}
                    to={a.path}
                    className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 transition-all ${s.border}`}
                  >
                    <div
                      className={`absolute top-0 right-0 w-72 h-72 bg-gradient-to-br ${a.accent} blur-3xl rounded-full opacity-40 pointer-events-none transition-opacity group-hover:opacity-60`}
                    />
                    <div className="relative">
                      <div className="flex items-center gap-4 mb-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.icon}`}>
                          <Icon className={`w-7 h-7 ${s.iconText}`} />
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] uppercase tracking-widest text-emerald-300 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Disponible
                          </div>
                        </div>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                        Auditoría para {a.title}
                      </h3>
                      <p className="text-gray-400 mb-6 leading-relaxed">{a.short}</p>
                      <ul className="space-y-2 mb-7">
                        {a.bullets.map((b, i) => (
                          <li key={i} className="flex gap-2.5 text-sm text-gray-300 items-start">
                            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${s.check}`} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`gap-2 font-semibold h-12 px-6 transition-all group-hover:translate-x-0.5 text-white ${s.btn}`}
                      >
                        Empezar auditoría <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-black/40">
        <div className="container mx-auto px-6 text-center">
          <img
            src={immoraliaLogo}
            alt="Immoralia"
            className="h-6 mx-auto mb-6 opacity-30 grayscale"
          />
          <p className="text-xs text-gray-600">
            immoralia · Automatización & IA · Parte de Immoral Group · www.immoral.es
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuditoriasIndex;
