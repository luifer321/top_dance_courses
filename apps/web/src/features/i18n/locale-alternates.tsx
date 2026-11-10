"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import type { MetadataHref } from "@/lib/metadata";

type Alternates = Partial<Record<Locale, MetadataHref>> | null;

const LocaleAlternateContext = createContext<{
  alternates: Alternates;
  setAlternates: (value: Alternates) => void;
} | null>(null);

export function LocaleAlternateProvider({ children }: { children: ReactNode }) {
  const [alternates, setAlternates] = useState<Alternates>(null);
  return (
    <LocaleAlternateContext.Provider value={{ alternates, setAlternates }}>
      {children}
    </LocaleAlternateContext.Provider>
  );
}

export function useLocaleAlternates() {
  return useContext(LocaleAlternateContext)?.alternates ?? null;
}

export function useSetLocaleAlternates(alternates: Alternates) {
  const context = useContext(LocaleAlternateContext);
  const serialized = JSON.stringify(alternates);
  useEffect(() => {
    const next = serialized === "null" ? null : (JSON.parse(serialized) as Alternates);
    context?.setAlternates(next);
    return () => context?.setAlternates(null);
  }, [context, serialized]);
}
