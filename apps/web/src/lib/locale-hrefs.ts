import { locales, isLocale, type Locale } from "@/i18n/routing";
import type { MetadataHref } from "@/lib/metadata";

export function samePageLocales(href: MetadataHref): Partial<Record<Locale, MetadataHref>> {
  return Object.fromEntries(locales.map((locale) => [locale, href]));
}

/** Course pages that have a published translation, otherwise the catalog. */
export function courseLocaleHrefs(
  slugs: Record<string, string> | undefined,
): Partial<Record<Locale, MetadataHref>> | null {
  if (!slugs) return null;
  return Object.fromEntries(
    locales.map((locale) => {
      const slug = slugs[locale];
      const href: MetadataHref = slug ? { pathname: "/courses/[slug]", params: { slug } } : "/courses";
      return [locale, href];
    }),
  );
}

/** Lesson pages follow published course and lesson translations. */
export function lessonLocaleHrefs(
  courseSlugs: Record<string, string> | undefined,
  lessonSlugs: Record<string, string> | undefined,
): Partial<Record<Locale, MetadataHref>> | null {
  if (!courseSlugs) return null;
  return Object.fromEntries(
    locales.map((locale) => {
      const slug = courseSlugs[locale];
      const lessonSlug = lessonSlugs?.[locale];
      let href: MetadataHref = "/courses";
      if (slug && lessonSlug) {
        href = { pathname: "/courses/[slug]/lessons/[lessonSlug]", params: { slug, lessonSlug } };
      } else if (slug) {
        href = { pathname: "/courses/[slug]", params: { slug } };
      }
      return [locale, href];
    }),
  );
}

export function publishedCourseHrefs(
  slugs: Partial<Record<Locale, string>>,
): Partial<Record<Locale, MetadataHref>> {
  return Object.fromEntries(
    locales.flatMap((locale) => {
      const slug = slugs[locale];
      return slug ? [[locale, { pathname: "/courses/[slug]", params: { slug } }]] : [];
    }),
  );
}

export function publishedLocaleSlugs(slugs: Record<string, string> | undefined) {
  const published: Partial<Record<Locale, string>> = {};
  for (const [code, slug] of Object.entries(slugs ?? {})) {
    if (isLocale(code) && slug) published[code] = slug;
  }
  return published;
}
