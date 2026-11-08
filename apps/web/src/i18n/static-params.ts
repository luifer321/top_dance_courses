import { locales, type Locale } from "./routing";

export function allLocaleParams() {
  return locales.map((locale) => ({ locale }));
}

// For route folders whose URL segment only exists in one locale
// (e.g. /es/cursos vs /en/courses).
export function singleLocaleParams(locale: Locale) {
  return [{ locale }];
}
