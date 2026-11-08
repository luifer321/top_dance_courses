// Pure locale helpers (no React Native imports) so they are unit-testable.
export const SUPPORTED_LOCALES = ["es", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

// "system" follows the device language; otherwise the user picked a locale.
export type LocalePreference = Locale | "system";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function resolveDeviceLocale(deviceLocales: readonly { languageCode?: string | null }[]): Locale {
  for (const { languageCode } of deviceLocales) {
    const code = languageCode?.toLowerCase();
    if (isLocale(code)) return code;
  }
  return DEFAULT_LOCALE;
}

export function resolveLocale(
  preference: LocalePreference,
  deviceLocales: readonly { languageCode?: string | null }[],
): Locale {
  return preference === "system" ? resolveDeviceLocale(deviceLocales) : preference;
}
