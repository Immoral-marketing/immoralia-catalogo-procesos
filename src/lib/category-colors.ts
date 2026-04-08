export const getCategoryColorClass = (categoriaNombre: string): string => {
  switch (categoriaNombre) {
    case "Atención y Ventas":
      return "bg-pink-500/10 text-pink-400 border-pink-500/30";
    case "Auditoría tecnológica":
      return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    case "Facturas y Gastos":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "Finanzas y Tesorería":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    case "Horarios y Proyectos":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
    case "Gestión Interna":
      return "bg-orange-500/10 text-orange-400 border-orange-500/30";
    default:
      return "bg-secondary/10 text-secondary border-secondary/30";
  }
};
