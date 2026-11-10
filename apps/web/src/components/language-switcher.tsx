"use client";

import { CheckIcon, LanguagesIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocaleAlternates } from "@/features/i18n/locale-alternates";
import { getPathname, usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { storeLocale } from "@/lib/locale-preference";
import { SHELL_SEGMENT } from "@/lib/static-routes";
import { pathSegmentsAfterLocale } from "@/lib/use-route-params";

// Resolves "[param]" placeholders in the internal pathname template, using the
// browser URL when the page is the client-side shell for an unknown slug.
function resolveParams(template: string, params: Record<string, string | string[] | undefined>) {
  const templateSegments = template.split("/").filter(Boolean);
  const urlSegments = pathSegmentsAfterLocale(window.location.pathname);
  const resolved: Record<string, string> = {};

  templateSegments.forEach((segment, index) => {
    const match = /^\[(.+)\]$/.exec(segment);
    if (!match) return;
    const name = match[1];
    const value = params[name];
    resolved[name] =
      typeof value === "string" && value !== SHELL_SEGMENT ? value : (urlSegments[index] ?? "");
  });
  return resolved;
}

export function LanguageSwitcher() {
  const t = useTranslations("common.language");
  const currentLocale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const alternates = useLocaleAlternates();

  function switchTo(locale: Locale) {
    storeLocale(locale);
    if (locale === currentLocale) return;
    const alternate = alternates?.[locale];
    const href = (alternate ?? { pathname, params: resolveParams(pathname, params) }) as Parameters<
      typeof getPathname
    >[0]["href"];
    // Full navigation: the locale segment owns the root layout (<html lang>).
    // Course alternates already point at the translated slug, or the catalog
    // when that language has no published translation.
    const search = alternate ? "" : window.location.search;
    window.location.assign(getPathname({ locale, href }) + search);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={t("change")}>
          <LanguagesIcon aria-hidden />
          <span className="uppercase">{currentLocale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            lang={locale}
            onSelect={() => switchTo(locale)}
            aria-current={locale === currentLocale ? "true" : undefined}
          >
            {t(locale)}
            {locale === currentLocale && <CheckIcon className="ml-auto" aria-hidden />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
