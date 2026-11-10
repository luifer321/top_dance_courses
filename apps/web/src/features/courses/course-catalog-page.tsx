import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { enablePageLocale, type LocalePageProps } from "@/i18n/page-locale";
import { samePageLocales } from "@/lib/locale-hrefs";
import { pageMetadata } from "@/lib/metadata";
import { CourseCatalogClient } from "./course-catalog-client";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "metadata" });
  return pageMetadata({
    locale,
    title: t("coursesTitle"),
    description: t("coursesDescription"),
    href: "/courses",
    languages: samePageLocales("/courses"),
  });
}

export async function CourseCatalogPage({ params }: LocalePageProps) {
  await enablePageLocale(params);
  const t = await getTranslations("courses");

  return (
    <>
      <PageHeader title={t("title")} description={t("subtitle")} />
      <CourseCatalogClient />
    </>
  );
}
