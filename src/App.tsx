import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProcessDetail from "./pages/ProcessDetail";
import ProcessDetailFacturasVencidas from "./pages/ProcessDetailFacturasVencidas";
import SportsLanding from "./pages/SportsLanding";
import GestoriasLanding from "./pages/GestoriasLanding";
import SaludLanding from "./pages/SaludLanding";
import ConstruccionLanding from "./pages/ConstruccionLanding";
import AcademiasLanding from "./pages/AcademiasLanding";
import RestauracionLanding from "./pages/RestauracionLanding";
import EcommerceLanding from "./pages/EcommerceLanding";
import InmobiliariaLanding from "./pages/InmobiliariaLanding";
import AgenciasLanding from "./pages/AgenciasLanding";
import SectorSelector from "./pages/SectorSelector";
import NotFound from "./pages/NotFound";
import { SelectionProvider } from "./lib/SelectionContext";
import Chatbot from "./components/Chatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SelectionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SectorSelector />} />
            <Route path="/catalogo/completo" element={<Index />} />
            <Route path="/catalogo/procesos/informe-semanal-facturas-vencidas" element={<ProcessDetailFacturasVencidas />} />
            <Route path="/catalogo/procesos/:slug" element={<ProcessDetail />} />
            <Route path="/landing/centros-deportivos" element={<SportsLanding />} />
            <Route path="/landing/gestorias" element={<GestoriasLanding />} />
            <Route path="/landing/salud" element={<SaludLanding />} />
            <Route path="/landing/construccion" element={<ConstruccionLanding />} />
            <Route path="/landing/academias" element={<AcademiasLanding />} />
            <Route path="/landing/restauracion" element={<RestauracionLanding />} />
            <Route path="/landing/ecommerce" element={<EcommerceLanding />} />
            <Route path="/landing/inmobiliaria" element={<InmobiliariaLanding />} />
            <Route path="/landing/agencias" element={<AgenciasLanding />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Chatbot />
        </BrowserRouter>
      </SelectionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
