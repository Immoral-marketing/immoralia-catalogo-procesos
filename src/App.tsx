import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProcessDetail from "./pages/ProcessDetail";
import SetupInfo from "./pages/SetupInfo";
import SportsLanding from "./pages/SportsLanding";
import GestoriasLanding from "./pages/GestoriasLanding";
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
            <Route path="/catalogo/procesos/:slug" element={<ProcessDetail />} />
            <Route path="/info/setup-automatizacion" element={<SetupInfo />} />
            <Route path="/landing/centros-deportivos" element={<SportsLanding />} />
            <Route path="/landing/gestorias" element={<GestoriasLanding />} />
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
