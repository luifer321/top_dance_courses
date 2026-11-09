import type { ApiError } from "@top-dance/api-client";

export function apiErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "error" in error) {
    const message = (error as ApiError).error?.message;
    if (message) return message;
  }
  return fallback;
}
