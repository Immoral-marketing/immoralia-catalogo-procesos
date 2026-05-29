import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dumbbell,
  Briefcase,
  Stethoscope,
  Utensils,
  ShoppingBag,
  Home,
  Users,
  ChevronRight,
  HardHat,
  GraduationCap,
  Factory,
  ArrowRight,
  ChevronDown,
  Zap,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { StepIndicator } from "@/components/StepIndicator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import immoraliaLogo from "@/assets/immoralia_logo.png";
import { processes } from "@/data/processes";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";

const sectors = [
  {
    id: "sports",
    title: "Centros Deportivos",
    description: "Gimnasios, centros de yoga, crossfit y academias deportivas.",
    icon: Dumbbell,
    path: "/sector/centros-deportivos",
    accent: "#dc2626",
    accentClass: "bg-red-600/10 border-red-600/25 text-red-400",
    accentGlow: "rgba(220,38,38,0.25)",
    accentBar: "bg-red-500",
    heroImage: "/centros-deportivos/hero.png",
    landingSlug: "centros-deportivos",
    sectorNames: [] as string[],
  },
  {
    id: "gestorias",
    title: "Gestorías",
    description: "Despachos profesionales, asesorías fiscales y laborales.",
    icon: Briefcase,
    path: "/sector/gestorias",
    status: "active",
    accent: "from-teal-500/20 to-cyan-600/20",
    landingSlug: "gestorias",
    sectorNames: ["Gestoria"],
  },
  {
    id: "health",
    title: "Centros de Salud",
    description: "Centros de fisioterapia, estética, consultas médicas, clínicas dentales y centros veterinarios.",
    icon: Stethoscope,
    path: "/sector/salud",
    status: "active",
    accent: "from-blue-500/20 to-indigo-500/20",
    landingSlug: "salud",
    sectorNames: ["Clínicas / Salud / Dental / Veterinaria"],
  },
  {
    id: "construction",
    title: "Construcción & Reformas",
    description: "Constructoras, estudios de arquitectura, empresas de reformas y mantenimiento.",
    icon: HardHat,
    path: "/sector/construccion",
    accent: "#16a34a",
    accentClass: "bg-green-600/10 border-green-600/25 text-green-400",
    accentGlow: "rgba(22,163,74,0.25)",
    accentBar: "bg-green-500",
    heroImage: "/constructoras.png" as string | null,
    landingSlug: "construccion",
    sectorNames: ["Construcción & Reformas"],
  },
  {
    id: "academias",
    title: "Academias / Formación",
    description: "Academias de idiomas, centros de formación, autoescuelas y formación profesional.",
    icon: GraduationCap,
    path: "/sector/academias",
    status: "active",
    accent: "from-violet-500/20 to-purple-500/20",
    landingSlug: "academias",
    sectorNames: ["Academias / Formación"],
  },
  {
    id: "food",
    title: "Gastronomía y Hotelería",
    description: "Restaurantes, bares, cafeterías, hoteles y negocios de hostelería.",
    icon: Utensils,
    path: "/sector/restauracion",
    status: "active",
    accent: "from-orange-500/20 to-red-500/20",
    landingSlug: "restauracion",
    sectorNames: ["Restauración", "Restaurantes"],
  },
  {
    id: "ecommerce",
    title: "Tienda Online / Retail",
    description: "Tiendas online, moda y comercio minorista.",
    icon: ShoppingBag,
    path: "/sector/ecommerce",
    status: "active",
    accent: "from-blue-500/20 to-cyan-500/20",
    landingSlug: "ecommerce",
    sectorNames: ["E-commerce", "Retail"],
  },
  {
    id: "realestate",
    title: "Inmobiliarias",
    description: "Agencias inmobiliarias y gestión de propiedades.",
    icon: Home,
    path: "/sector/inmobiliaria",
    status: "active",
    accent: "from-emerald-500/20 to-green-600/20",
    landingSlug: "inmobiliaria",
    sectorNames: ["Inmobiliaria", "Inmobiliarias"],
  },
  {
    id: "consultancy",
    title: "Consultoría / Agencias",
    description: "Agencias de marketing, consultoras y servicios B2B.",
    icon: Users,
    path: "/sector/agencias",
    status: "active",
    accent: "from-rose-500/20 to-pink-500/20",
    landingSlug: "agencias",
    sectorNames: ["Agencia/marketing", "Consultoría"],
  },
  {
    id: "industrial",
    number: "07",
    title: "Industrial / Producción",
    description: "Fábricas, plantas de producción, talleres y empresas manufactureras.",
    icon: Factory,
    path: "/sector/industrial",
    accent: "#eab308",
    accentClass: "bg-yellow-500/10 border-yellow-500/25 text-yellow-400",
    accentGlow: "rgba(234,179,8,0.25)",
    accentBar: "bg-yellow-500",
    heroImage: "/industrial/hero.svg" as string | null,
    landingSlug: "industrial",
    sectorNames: ["Industrial / Producción"],
  },
];

const SectorSelector = () => {
  useEffect(() => {
    document.title = "Immoralia - Catálogo de Procesos - Seleccionador";
  }, []);

  const sectorCounts = useMemo(() => {
    return sectors.reduce((acc, sector) => {
      acc[sector.id] = processes.filter(
        (p) => !p.hidden && p.landing_slug === sector.landingSlug
      ).length;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const totalProcesses = useMemo(
    () => processes.filter((p) => !p.hidden).length,
    []
  );

  const [showLeadModal, setShowLeadModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-cyan-500/30 font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <header className="container mx-auto px-6 py-12 flex flex-col items-center text-center">
        <img
          src={immoraliaLogo}
          alt="Immoralia"
          className="h-10 mb-12 animate-in fade-in slide-in-from-top-4 duration-700"
        />

        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Potencia tu negocio con <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              automatización inteligente
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-white animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            Tus herramientas, conectadas. Sin trabajo manual.
          </p>
          <p className="text-sm text-gray-300 border border-cyan-500/30 bg-cyan-500/5 rounded-full px-6 py-2.5 inline-block animate-in fade-in duration-700 delay-500">
            No sustituimos tus herramientas. Las conectamos y eliminamos el trabajo manual que hay entre ellas.
          </p>
        </div>
      </header>

      {/* ── SECTOR GRID ── */}
      <section id="sectores" className="px-6 pb-0 relative">
        <div className="max-w-6xl mx-auto">

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <p className="text-sm text-gray-400 uppercase tracking-widest text-center mb-8 font-semibold">Selecciona tu sector</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
          {sectors.map((sector) => {
            const isActive = sector.status === "active";
            const Icon = sector.icon;
            const count = sectorCounts[sector.id] ?? 0;

            return (
              <Link
                key={sector.id}
                to={sector.path}
                className={`group relative h-full transition-all duration-300 ${!isActive ? 'opacity-70 hover:opacity-100' : 'hover:scale-[1.02]'}`}
              >
                <Card className="h-full border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden transition-all duration-500 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_30px_rgba(8,145,178,0.1)] flex flex-col">
                  <div className={`absolute inset-0 bg-gradient-to-br ${sector.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              return (
                <Link
                  key={sector.id}
                  to={sector.path}
                  className="group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-white/8 hover:border-white/20 transition-all duration-500 min-h-[300px]"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px -8px ${sector.accentGlow}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `none`;
                  }}
                >
                  {/* Background: hero image or accent gradient */}
                  {sector.heroImage ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url('${sector.heroImage}')` }}
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(ellipse at 60% 40%, ${sector.accent}18 0%, #0d0d0d 70%)`,
                      }}
                    />
                  )}

                  {/* Dark overlay — stronger at bottom for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25" />

                  {/* Accent colour wash on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(to top, ${sector.accent}28 0%, transparent 60%)` }}
                  />

                  {/* Top row: icon */}
                  <div className="absolute top-5 left-5 z-10">
                    <div
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center backdrop-blur-sm ${sector.accentClass}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div className="relative z-10 px-6 pb-6 pt-4">
                    <div className="flex items-end justify-between gap-3 mb-2">
                      <h2 className="text-xl font-bold text-white leading-tight">
                        {sector.title}
                      </h2>
                      {count > 0 && (
                        <span
                          className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border tabular-nums whitespace-nowrap"
                          style={{
                            color: sector.accent,
                            borderColor: `${sector.accent}50`,
                            backgroundColor: `${sector.accent}15`,
                          }}
                        >
                          {count} procesos
                        </span>
                      ) : !isActive ? (
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                          Próximamente
                        </Badge>
                      ) : null}
                    </div>
                    <CardTitle className="text-2xl font-bold group-hover:text-cyan-400 transition-colors">
                      {sector.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 leading-relaxed pt-2">
                      {sector.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10 mt-auto pt-4">
                    <div className="flex items-center gap-2 text-sm font-medium transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                      <span className={isActive ? "text-cyan-400" : "text-gray-500"}>
                        {isActive ? "Ver soluciones" : "Ir al catálogo general"}
                      </span>
                      <ChevronRight className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-gray-500"}`} />
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${sector.accentBar}`}
                  />
                </Link>
              );
            })}

            {/* ── ¿NO ENCUENTRAS TU SECTOR? ── */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShowLeadModal(true)}
              onKeyDown={(e) => e.key === "Enter" && setShowLeadModal(true)}
              className="group col-span-1 md:col-span-2 relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 overflow-hidden rounded-2xl border border-white/8 hover:border-white/20 transition-all duration-500 px-8 py-7 cursor-pointer"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px -8px rgba(0,255,255,0.22)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `none`;
              }}
            >
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(0,255,255,0.05) 0%, transparent 65%)" }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(0,255,255,0.09) 0%, transparent 65%)" }} />
              <div className="relative z-10 flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border" style={{ backgroundColor: "rgba(0,255,255,0.07)", borderColor: "rgba(0,255,255,0.18)" }}>
                  <MessageCircle className="w-5 h-5" style={{ color: "rgba(0,255,255,0.75)" }} />
                </div>
                <div>
                  <p className="text-base font-bold text-white mb-1">¿Tu sector no está en la lista?</p>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-xl">Trabajamos con cualquier tipo de negocio. Cuéntanos qué haces y analizamos contigo qué procesos tiene sentido automatizar.</p>
                </div>
              </div>
              <div className="relative z-10 shrink-0 flex items-center gap-2 text-sm font-semibold tracking-wide transition-all duration-300 opacity-55 group-hover:opacity-100 pl-1 sm:pl-0" style={{ color: "rgba(0,255,255,0.9)" }}>
                <span>Contáctanos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-cyan-400/50" />
            </div>

          </div>
        </div>
      </section>

      {/* ── SEGUNDO HERO ── */}
      <section className="relative py-16 overflow-hidden text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,255,255,0.04) 0%, transparent 70%)" }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold leading-[1.1] text-white mb-5">
            Los mejores negocios no trabajan<br />
            más duro.
            <span style={{ color: "rgba(0,255,255,0.85)" }}> Trabajan mejor.</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Optimizar cómo fluye el trabajo es la palanca que más impacto tiene en tu equipo, tu tiempo y tus márgenes.
          </p>
        </div>
      </section>

      {/* ── BOTTOM CARDS ── */}
      <section className="px-6 pb-32 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* ── AUDITORÍAS CALLOUT ── */}
            <Link
              to="/auditorias"
              className="group col-span-1 md:col-span-2 relative overflow-hidden rounded-2xl border border-white/8 hover:border-cyan-500/25 bg-[#0d0d0d] transition-all duration-500 hover:shadow-[0_0_80px_rgba(0,212,232,0.07)] flex flex-col md:flex-row min-h-[280px]"
            >
              {/* LEFT: texto + KPIs */}
              <div className="relative z-10 flex flex-col justify-between p-8 md:p-10 md:w-[42%] shrink-0">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-cyan-400/60 mb-5">Auditorías de madurez operativa</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-[1.15] mb-5">
                    ¿Sabes qué procesos<br />frenan tu negocio?
                  </h2>
                  <div className="flex items-center gap-2 text-sm font-semibold text-cyan-400 group-hover:gap-4 transition-all duration-300">
                    Descúbrelo en 8 minutos
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* KPIs genéricos — franja pequeña */}
                <div className="flex gap-3 mt-8" style={{ perspective: "600px" }}>
                  {[
                    { val: "+3h", label: "recuperables al día" },
                    { val: "8 min", label: "para el diagnóstico" },
                    { val: "PDF", label: "con tu hoja de ruta" },
                  ].map((k, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-lg border border-white/8 bg-white/[0.04] p-3 text-center transition-all duration-300"
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = `rotateY(${i === 1 ? "0deg" : i === 0 ? "-10deg" : "10deg"}) rotateX(-5deg) scale(1.07)`;
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,232,0.35)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(0,212,232,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = "";
                        (e.currentTarget as HTMLElement).style.borderColor = "";
                        (e.currentTarget as HTMLElement).style.background = "";
                      }}
                    >
                      <p className="text-lg font-bold text-white leading-none mb-1">{k.val}</p>
                      <p className="text-[10px] text-gray-500 leading-tight">{k.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: imagen */}
              <div className="md:flex-1 relative overflow-hidden min-h-[180px] md:min-h-0 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl">
                <img
                  src="/auditorias-banner.png"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/30 to-transparent" />
              </div>
            </Link>

          </div>

        </div>

      {/* ── MODAL LEAD CAPTACIÓN ── */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
      />

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-black/50 py-10">
        <div className="container mx-auto px-6 text-center">
          <img src={immoraliaLogo} alt="Immoralia" className="h-5 mx-auto mb-4 opacity-25 grayscale" />
          <p className="text-xs text-gray-700">
            immoralia · Automatización & IA · Parte de Immoral Group · www.immoral.es
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SectorSelector;
