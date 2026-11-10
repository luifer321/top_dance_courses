import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";
import { publishedLocaleSlugs } from "@/lib/locale-hrefs";
import { localizedPath } from "@/lib/metadata";
import { fetchCatalog } from "@/lib/static-routes";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  const home = Object.fromEntries(locales.map((locale) => [locale, localizedPath(locale, "/")]));
  const catalog = Object.fromEntries(locales.map((locale) => [locale, localizedPath(locale, "/courses")]));
  for (const locale of locales) {
    entries.push({ url: home[locale]!, alternates: { languages: home } });
    entries.push({ url: catalog[locale]!, alternates: { languages: catalog } });
  }

  const seen = new Set<string>();
  for (const locale of locales) {
    for (const course of await fetchCatalog(locale)) {
      const published = publishedLocaleSlugs(course.localized_slugs);
      if (!published[locale]) continue;
      const key = locales.map((code) => `${code}:${published[code] ?? ""}`).join("|");
      if (seen.has(key)) continue;
      seen.add(key);

      const languages = Object.fromEntries(
        locales.flatMap((code) => {
          const slug = published[code];
          return slug
            ? [[code, absoluteUrl(getPathname({ locale: code, href: { pathname: "/courses/[slug]", params: { slug } } }))]]
            : [];
        }),
      );
      for (const url of Object.values(languages)) {
        entries.push({ url, alternates: { languages } });
      }
    }
  }

  return entries;
}
