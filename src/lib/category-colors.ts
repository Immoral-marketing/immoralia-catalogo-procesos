export const getCategoryColorClass = (categoriaNombre: string): string => {
  switch (categoriaNombre) {
    case "Atención y Ventas":
      return "bg-pink-500/10 text-pink-400 border-pink-500/30";
    case "Auditoría tecnológica":
      return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    case "Facturación y Finanzas":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    case "Horarios y Proyectos":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
    case "Gestión Interna":
      return "bg-orange-500/10 text-orange-400 border-orange-500/30";
    // Bloques Gastronomía / Hostelería
    case "Reservas y atención 24/7":
    case "Reputación y reseñas":
    case "Fidelización y vuelta del cliente":
    case "Operativa diaria y visibilidad":
    case "Gestión de personal y equipo":
    case "Marketing y contenido digital":
      return "bg-orange-500/10 text-orange-400 border-orange-500/30";
    // Bloques Centros de Salud
    case "Captación y primera visita":
    case "Gestión de citas y ausencias":
    case "Seguimiento clínico y fidelización":
    case "Administración y facturación":
    case "Gestión del equipo clínico":
      return "bg-sky-500/10 text-sky-400 border-sky-500/30";
    // Bloques Academias / Formación
    case "Captación de alumnos":
    case "Matriculación y onboarding del alumno":
    case "Comunicación con padres y alumnos":
    case "Retención y reactivación":
    case "Administración y finanzas":
    case "Gestión del profesorado":
      return "bg-violet-500/10 text-violet-400 border-violet-500/30";
    default:
      return "bg-secondary/10 text-secondary border-secondary/30";
  }
};
