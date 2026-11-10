export function requestLocale(language: string): "es" | "en" {
  return language.toLowerCase().startsWith("en") ? "en" : "es";
}

export function courseLevelKey(level: string | null | undefined) {
  if (level === "beginner" || level === "intermediate" || level === "advanced") return level;
  return null;
}

export function durationMinutes(seconds: number | null | undefined): number | null {
  if (!seconds || seconds <= 0) return null;
  return Math.max(1, Math.round(seconds / 60));
}

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const origin = process.env.EXPO_PUBLIC_WEB_URL ?? "http://localhost:3000";
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
