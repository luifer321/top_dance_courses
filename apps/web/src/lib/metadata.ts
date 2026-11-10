import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { locales, type AppPathname, type Locale } from "@/i18n/routing";
import { absoluteAsset, absoluteUrl } from "@/lib/site-url";

type StaticHref = Exclude<AppPathname, `${string}[${string}`>;
type DynamicHref =
  | { pathname: "/courses/[slug]"; params: { slug: string } }
  | {
      pathname: "/courses/[slug]/lessons/[lessonSlug]";
      params: { slug: string; lessonSlug: string };
    };

export type MetadataHref = StaticHref | DynamicHref;

const OG_LOCALE: Record<Locale, string> = { es: "es_ES", en: "en_US" };

export function localizedPath(locale: Locale, href: MetadataHref) {
  return absoluteUrl(getPathname({ locale, href }));
}

export function pageMetadata({
  locale,
  title,
  description,
  href,
  index = true,
  languages,
  image,
}: {
  locale: Locale;
  title: string;
  description: string;
  href: MetadataHref;
  index?: boolean;
  languages?: Partial<Record<Locale, MetadataHref>>;
  image?: string | null;
}): Metadata {
  const canonical = localizedPath(locale, href);
  const alternates = index ? publishedAlternates(languages) : undefined;
  const ogImage = image ? absoluteAsset(image) : undefined;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      ...(alternates ? { languages: alternates } : {}),
    },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Top Dance",
      locale: OG_LOCALE[locale],
      alternateLocale: alternates
        ? locales.filter((code) => code !== locale && alternates[code]).map((code) => OG_LOCALE[code])
        : undefined,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

function publishedAlternates(languages: Partial<Record<Locale, MetadataHref>> | undefined) {
  if (!languages) return undefined;
  const entries = locales.flatMap((code) => {
    const href = languages[code];
    return href ? [[code, localizedPath(code, href)] as const] : [];
  });
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries);
}
