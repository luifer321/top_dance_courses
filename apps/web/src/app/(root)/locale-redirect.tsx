"use client";

import { useEffect } from "react";
import { defaultLocale } from "@/i18n/routing";
import { resolvePreferredLocale } from "@/lib/locale-preference";

export function LocaleRedirect() {
  useEffect(() => {
    window.location.replace(`/${resolvePreferredLocale()}/`);
  }, []);

  return (
    <p className="sr-only" role="status">
      <a href={`/${defaultLocale}/`}>Top Dance Academy</a>
    </p>
  );
}
