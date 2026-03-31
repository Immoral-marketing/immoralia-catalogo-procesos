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
  ArrowRight
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
    accent: "from-cyan-500/20 to-emerald-500/20"
  },
  {
    id: "health",
    title: "Clínicas / Salud",
    description: "Centros de fisioterapia, estética y consultas médicas.",
    icon: Stethoscope,
    path: "/catalogo/completo",
    status: "soon",
    accent: "from-purple-500/10 to-pink-500/10"
  },
  {
    id: "food",
    title: "Restauración",
    description: "Restaurantes, cafeterías y grupos de hostelería.",
    icon: Utensils,
    path: "/catalogo/completo",
    status: "soon",
    accent: "from-orange-500/10 to-red-500/10"
  },
  {
    id: "ecommerce",
    title: "E-commerce / Retail",
    description: "Tiendas online, moda y comercio minorista.",
    icon: ShoppingBag,
    path: "/catalogo/completo",
    status: "soon",
    accent: "from-blue-500/10 to-indigo-500/10"
  },
  {
    id: "realestate",
    title: "Inmobiliarias",
    description: "Agencias inmobiliarias y gestión de propiedades.",
    icon: Home,
    path: "/catalogo/completo",
    status: "soon",
    accent: "from-emerald-500/10 to-teal-500/10"
  },
  {
    id: "consultancy",
    title: "Consultoría / Agencias",
    description: "Agencias de marketing, consultoras y servicios B2B.",
    icon: Users,
    path: "/catalogo/completo",
    status: "soon",
    accent: "from-yellow-500/10 to-amber-500/10"
  }
];

const SectorSelector = () => {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <Sparkles className="w-3 h-3" /> CATÁLOGO DE PROCESOS
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Potencia tu negocio con <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              automatización inteligente
            </span>
          </h1>
          <p className="text-lg text-gray-400 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            Selecciona tu industria para descubrir soluciones diseñadas específicamente para tus retos operativos.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
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
