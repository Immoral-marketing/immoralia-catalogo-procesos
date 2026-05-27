import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Dumbbell,
  Briefcase,
  Stethoscope,
  Utensils,
  HardHat,
  GraduationCap,
  ArrowRight,
  ChevronDown,
  Zap,
  CheckCircle2,
} from "lucide-react";
import immoraliaLogo from "@/assets/immoralia_logo.png";
import { processes } from "@/data/processes";

const sectors = [
  {
    id: "sports",
    number: "01",
    title: "Centros Deportivos",
    description: "Gimnasios, crossfit, centros de yoga, artes marciales y academias deportivas.",
    icon: Dumbbell,
    path: "/sector/centros-deportivos",
    accent: "#0891b2",
    accentClass: "bg-sky-600/10 border-sky-600/25 text-sky-400",
    accentGlow: "rgba(8,145,178,0.25)",
    accentBar: "bg-sky-500",
    heroImage: "/centros-deportivos/hero.png",
    landingSlug: "centros-deportivos",
    sectorNames: [] as string[],
  },
  {
    id: "gestorias",
    number: "02",
    title: "Gestorías",
    description: "Despachos profesionales, asesorías fiscales, laborales y contables.",
    icon: Briefcase,
    path: "/sector/gestorias",
    accent: "#c4a84c",
    accentClass: "bg-yellow-600/10 border-yellow-600/25 text-yellow-500",
    accentGlow: "rgba(196,168,76,0.25)",
    accentBar: "bg-yellow-500",
    heroImage: "/gestorias/hero.png",
    landingSlug: "gestorias",
    sectorNames: ["Gestoria"],
  },
  {
    id: "health",
    number: "03",
    title: "Centros de Salud",
    description: "Clínicas, fisioterapia, estética, dental y centros veterinarios.",
    icon: Stethoscope,
    path: "/sector/salud",
    accent: "#2563eb",
    accentClass: "bg-blue-600/10 border-blue-600/25 text-blue-400",
    accentGlow: "rgba(37,99,235,0.25)",
    accentBar: "bg-blue-500",
    heroImage: "/salud/hero.png",
    landingSlug: "salud",
    sectorNames: ["Centros de Salud"],
  },
  {
    id: "construction",
    number: "04",
    title: "Constructoras e Inmobiliarias",
    description: "Constructoras, empresas de reformas, arquitectura, agencias inmobiliarias y gestión de propiedades.",
    icon: HardHat,
    path: "/sector/construccion",
    accent: "#d97706",
    accentClass: "bg-amber-600/10 border-amber-600/25 text-amber-400",
    accentGlow: "rgba(217,119,6,0.25)",
    accentBar: "bg-amber-500",
    heroImage: "/constructoras.png" as string | null,
    landingSlug: "construccion",
    sectorNames: ["Construcción & Reformas", "Constructoras / Obra Nueva", "Inmobiliaria", "Inmobiliarias"],
  },
  {
    id: "academias",
    number: "05",
    title: "Academias y Formación",
    description: "Academias de idiomas, autoescuelas y centros de formación profesional.",
    icon: GraduationCap,
    path: "/sector/academias",
    accent: "#7c3aed",
    accentClass: "bg-violet-600/10 border-violet-600/25 text-violet-400",
    accentGlow: "rgba(124,58,237,0.25)",
    accentBar: "bg-violet-500",
    heroImage: "/academias/hero.png" as string | null,
    landingSlug: "academias",
    sectorNames: ["Academias / Formación"],
  },
  {
    id: "food",
    number: "06",
    title: "Gastronomía y Hostelería",
    description: "Restaurantes, bares, cafeterías, hoteles y negocios de hostelería.",
    icon: Utensils,
    path: "/sector/gastronomia-hosteleria",
    accent: "#ea580c",
    accentClass: "bg-orange-600/10 border-orange-600/25 text-orange-400",
    accentGlow: "rgba(234,88,12,0.25)",
    accentBar: "bg-orange-500",
    heroImage: "/restauracion/hero.png" as string | null,
    landingSlug: "gastronomia-hosteleria",
    sectorNames: ["Gastronomía / Hostelería"],
  },
];

const SectorSelector = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Immoralia · Catálogo de Automatización por Sector";
  }, []);

  const sectorCounts = useMemo(() => {
    return sectors.reduce((acc, sector) => {
      acc[sector.id] = processes.filter(
        (p) =>
          !p.hidden &&
          (p.landing_slug === sector.landingSlug ||
            sector.sectorNames.some((name) => p.sectores?.includes(name)))
      ).length;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const totalProcesses = useMemo(
    () => processes.filter((p) => !p.hidden).length,
    []
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans selection:bg-white/10">

      {/* ── NAV ── */}
      <nav className="absolute top-0 left-0 right-0 z-30 px-6 py-5 flex items-center justify-between">
        <img src={immoraliaLogo} alt="Immoralia" className="h-7 opacity-90" />
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/home/hero.png')" }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#0d0d0d]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        {/* Glow sutil centrado detrás del contenido */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 55%, rgba(0,255,255,0.08) 0%, transparent 70%)" }} />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-7 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Automatiza tu negocio.<br className="hidden md:block" />
            <span style={{ color: "rgba(0,255,255,0.80)" }}> Empieza por tu sector.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Más de{" "}
            <span className="font-semibold" style={{ color: "#00FFFF" }}>{totalProcesses} procesos listos para implementar</span>,
            clasificados por sector y área operativa. Sin tecnicismos. Sin presión.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-14 animate-in fade-in duration-700 delay-300">
            {[
              { icon: CheckCircle2, label: `${totalProcesses}+ procesos`, sub: "catalogados" },
              { icon: Zap, label: `${sectors.length} sectores`, sub: "disponibles" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex items-center gap-2.5 text-left">
                  <Icon className="w-4 h-4 shrink-0" style={{ color: "rgba(0,255,255,0.65)" }} />
                  <div>
                    <div className="text-sm font-semibold text-white">{s.label}</div>
                    <div className="text-xs text-gray-500">{s.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scroll hint */}
          <div
            className="flex flex-col items-center gap-2 animate-bounce cursor-pointer transition-colors"
            style={{ color: "rgba(0,255,255,0.35)" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(0,255,255,0.75)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(0,255,255,0.35)"}
            onClick={() => document.getElementById("sectores")?.scrollIntoView({ behavior: "smooth" })}
          >
            <span className="text-[11px] tracking-widest uppercase">Elige tu sector</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* ── SECTOR GRID ── */}
      <section id="sectores" className="px-6 pb-32 relative">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
              {sectors.length} sectores disponibles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              const count = sectorCounts[sector.id] ?? 0;

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

                  {/* Top row: icon + number */}
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                    <div
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center backdrop-blur-sm ${sector.accentClass}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className="text-[11px] font-bold tabular-nums tracking-widest opacity-30 group-hover:opacity-60 transition-opacity"
                      style={{ color: sector.accent }}
                    >
                      {sector.number}
                    </span>
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
                      )}
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-4">
                      {sector.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase transition-all duration-300 opacity-50 group-hover:opacity-100"
                      style={{ color: sector.accent }}
                    >
                      <span>Explorar sector</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${sector.accentBar}`}
                  />
                </Link>
              );
            })}
          </div>

        </div>
      </section>

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
