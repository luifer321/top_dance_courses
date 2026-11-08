import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { enablePageLocale, type LocalePageProps } from "@/i18n/page-locale";
import { LessonPlayerClient } from "./lesson-player-client";

type Params = { locale: string; slug: string; lessonSlug: string };

export async function generateMetadata({ params }: LocalePageProps<Params>) {
  const { locale } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "lessons" });
  return { title: t("playerTitle"), robots: { index: false } };
}

export async function LessonPlayerPage({ params }: LocalePageProps<Params>) {
  await enablePageLocale(params);
  const t = await getTranslations("lessons");

  return (
    <>
      <PageHeader title={t("playerTitle")} />
      <LessonPlayerClient />
    </>
  );
}
