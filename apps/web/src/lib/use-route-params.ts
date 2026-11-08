"use client";

import { useParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { SHELL_SEGMENT } from "./static-routes";

function subscribe() {
  return () => {};
}

// Path segments after the locale, e.g. "/es/cursos/salsa/" -> ["cursos", "salsa"].
export function pathSegmentsAfterLocale(pathname: string): string[] {
  return pathname.split("/").filter(Boolean).slice(1).map(decodeURIComponent);
}

/**
 * Route params that resolve the client-side shell placeholder to the real
 * value from the browser URL. `positions` maps each param to its index in the
 * path after the locale (identical for every locale).
 */
export function useRouteParams<T extends string>(positions: Record<T, number>) {
  const params = useParams<Record<T, string>>();
  const pathname = useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => null,
  );

  const resolved = {} as Record<T, string | undefined>;
  for (const key of Object.keys(positions) as T[]) {
    const value = params[key];
    if (value !== SHELL_SEGMENT) {
      resolved[key] = value;
    } else {
      resolved[key] = pathname ? pathSegmentsAfterLocale(pathname)[positions[key]] : undefined;
      if (resolved[key] === SHELL_SEGMENT) resolved[key] = undefined;
    }
  }
  return resolved;
}
