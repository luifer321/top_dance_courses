export function durationMinutes(seconds: number | null | undefined): number | null {
  if (!seconds || seconds <= 0) return null;
  return Math.max(1, Math.round(seconds / 60));
}

export function courseLevelKey(level: string | null | undefined) {
  if (level === "beginner" || level === "intermediate" || level === "advanced") return level;
  return null;
}
