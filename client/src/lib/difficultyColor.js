export const getDifficultyColor = (difficulty) => {
  switch ((difficulty || "").toLowerCase()) {
    case "easy":
      return "bg-emerald-950/90 text-emerald-300 border border-emerald-500/40";
    case "beginner":
      return "bg-cyan-950/90 text-cyan-300 border border-cyan-500/40";
    case "moderate":
      return "bg-amber-950/90 text-amber-300 border border-amber-500/40";
    case "hard":
    case "amateur":
      return "bg-rose-950/90 text-rose-300 border border-rose-500/40";
    default:
      return "bg-slate-900 text-slate-300 border border-slate-700";
  }
};
