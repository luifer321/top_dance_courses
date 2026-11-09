import { defineRouting } from "next-intl/routing";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_STORAGE_KEY = "top-dance.locale";

// Internal pathnames (keys) are English; each maps to the public URL per locale.
// Every localized path has a physical route folder under src/app/[locale]
// because static export has no middleware to rewrite URLs.
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/courses": { es: "/cursos", en: "/courses" },
    "/courses/[slug]": { es: "/cursos/[slug]", en: "/courses/[slug]" },
    "/courses/[slug]/lessons/[lessonSlug]": {
      es: "/cursos/[slug]/lecciones/[lessonSlug]",
      en: "/courses/[slug]/lessons/[lessonSlug]",
    },
    "/login": { es: "/iniciar-sesion", en: "/login" },
    "/register": { es: "/registro", en: "/register" },
    "/dashboard": "/dashboard",
    "/profile": { es: "/perfil", en: "/profile" },
    "/design-system": "/design-system",
  },
});

export type AppPathname = keyof typeof routing.pathnames;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
