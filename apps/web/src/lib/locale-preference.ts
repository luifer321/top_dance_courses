import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/i18n/routing";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function readCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`))
    ?.split("=")[1];
}

export function readStoredLocale(): Locale | undefined {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Storage can be unavailable (private mode, disabled cookies).
  }
  const cookie = readCookie(LOCALE_COOKIE);
  return isLocale(cookie) ? cookie : undefined;
}

export function storeLocale(locale: Locale) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Ignore: the cookie below is the fallback.
  }
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax${secure}`;
}

export function detectBrowserLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const base = language.toLowerCase().split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

export function resolvePreferredLocale(): Locale {
  return readStoredLocale() ?? detectBrowserLocale(navigator.languages ?? [navigator.language]);
}
