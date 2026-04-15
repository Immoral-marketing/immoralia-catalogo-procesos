import { useEffect } from "react";
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
  Sparkles,
  ArrowRight,
  HardHat,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import immoraliaLogo from "@/assets/immoralia_logo.png";

const sectors = [
  {
    id: "sports",
    title: "Centros Deportivos",
    description: "Gimnasios, centros de yoga, crossfit y academias deportivas.",
    icon: Dumbbell,
    path: "/landing/centros-deportivos",
    status: "active",
    accent: "from-cyan-500/20 to-blue-500/20"
  },
  {
    id: "gestorias",
    title: "Gestorías",
    description: "Despachos profesionales, asesorías fiscales y laborales.",
    icon: Briefcase,
    path: "/landing/gestorias",
    status: "active",
    accent: "from-teal-500/20 to-cyan-600/20"
  },
  {
    id: "health",
    title: "Centros de Salud",
    description: "Centros de fisioterapia, estética, consultas médicas, clínicas dentales y centros veterinarios.",
    icon: Stethoscope,
    path: "/landing/salud",
    status: "active",
    accent: "from-blue-500/20 to-indigo-500/20"
  },
  {
    id: "construction",
    title: "Construcción & Reformas",
    description: "Constructoras, estudios de arquitectura, empresas de reformas y mantenimiento.",
    icon: HardHat,
    path: "/landing/construccion",
    status: "active",
    accent: "from-orange-500/10 to-amber-500/20"
  },
  {
    id: "academias",
    title: "Academias / Formación",
    description: "Academias de idiomas, centros de formación, autoescuelas y formación profesional.",
    icon: GraduationCap,
    path: "/landing/academias",
    status: "active",
    accent: "from-violet-500/20 to-purple-500/20"
  },
  {
    id: "food",
    title: "Restauración",
    description: "Restaurantes, cafeterías y grupos de hostelería.",
    icon: Utensils,
    path: "/landing/restauracion",
    status: "active",
    accent: "from-orange-500/20 to-red-500/20"
  },
  {
    id: "ecommerce",
    title: "Tienda Online / Retail",
    description: "Tiendas online, moda y comercio minorista.",
    icon: ShoppingBag,
    path: "/landing/ecommerce",
    status: "active",
    accent: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: "realestate",
    title: "Inmobiliarias",
    description: "Agencias inmobiliarias y gestión de propiedades.",
    icon: Home,
    path: "/landing/inmobiliaria",
    status: "active",
    accent: "from-emerald-500/20 to-green-600/20"
  },
  {
    id: "consultancy",
    title: "Consultoría / Agencias",
    description: "Agencias de marketing, consultoras y servicios B2B.",
    icon: Users,
    path: "/landing/agencias",
    status: "active",
    accent: "from-rose-500/20 to-pink-500/20"
  }
];

const SectorSelector = () => {
  useEffect(() => {
    document.title = "Immoralia - Catálogo de Procesos - Seleccionador";
  }, []);

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


      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <p className="text-sm text-gray-400 uppercase tracking-widest text-center mb-8 font-semibold">Selecciona tu sector</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
          {sectors.map((sector) => {
            const isActive = sector.status === "active";
            const Icon = sector.icon;

            return (
              <Link 
                key={sector.id} 
                to={sector.path}
                className={`group relative h-full transition-all duration-300 ${!isActive ? 'opacity-70 hover:opacity-100' : 'hover:scale-[1.02]'}`}
              >
                <Card className={`h-full border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden transition-all duration-500 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_30px_rgba(8,145,178,0.1)] flex flex-col`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${sector.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <CardHeader className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black group-hover:rotate-6' : 'bg-white/5 text-gray-500'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {!isActive && (
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                          Próximamente
                        </Badge>
                      )}
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
                  </CardContent>
                </Card>
              </Link>
            );
          })}

          {/* Catalog Explorar Card */}
          <Link 
            to="/catalogo/completo"
            className="group relative h-full md:col-span-2 lg:col-span-1"
          >
            <Card className="h-full border-dashed border-white/10 bg-transparent hover:bg-white/5 transition-all duration-300 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-8 h-8 text-gray-500 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">¿Quieres ver todo?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Explora el catálogo completo con más de 70 procesos de automatización.
              </p>
              <Button variant="link" className="text-cyan-400 p-0 h-auto font-bold gap-2">
                Explorar catálogo completo <ChevronRight className="w-4 h-4" />
              </Button>
            </Card>
          </Link>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-12 text-center border-t border-white/5 mt-12 bg-black/50 overflow-hidden relative">
        <p className="text-gray-600 text-sm relative z-10">
          © 2026 Immoralia. Soluciones de Automatización Inteligente para Empresas.
        </p>
      </footer>
    </div>
  );
};

export default SectorSelector;
