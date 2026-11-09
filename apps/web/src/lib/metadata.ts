import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { locales, type AppPathname, type Locale } from "@/i18n/routing";

type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;

export async function localizedMetadata(
  locale: Locale,
  pathname: StaticPathname,
  title?: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const languages = Object.fromEntries(
    locales.map((l) => [l, getPathname({ locale: l, href: pathname })]),
  );

  return {
    title: title ?? t("title"),
    description: t("description"),
    alternates: {
      canonical: getPathname({ locale, href: pathname }),
      languages,
    },
  };
}
