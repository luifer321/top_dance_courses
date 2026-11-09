export function requestLocale(language: string): "es" | "en" {
  return language.toLowerCase().startsWith("en") ? "en" : "es";
}

export function courseLevelKey(level: string | null | undefined) {
  if (level === "beginner" || level === "intermediate" || level === "advanced") return level;
  return null;
}
