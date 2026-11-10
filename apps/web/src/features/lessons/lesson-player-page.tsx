import { getTranslations } from "next-intl/server";
import { enablePageLocale, type LocalePageProps } from "@/i18n/page-locale";
import { pageMetadata } from "@/lib/metadata";
import { LessonPlayerClient } from "./lesson-player-client";

type Params = { locale: string; slug: string; lessonSlug: string };

export async function generateMetadata({ params }: LocalePageProps<Params>) {
  const { locale, slug, lessonSlug } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "lessons" });
  return pageMetadata({
    locale,
    title: `${t("playerTitle")} | Top Dance`,
    description: t("signInToWatch"),
    href: { pathname: "/courses/[slug]/lessons/[lessonSlug]", params: { slug, lessonSlug } },
    index: false,
  });
}

export async function LessonPlayerPage({ params }: LocalePageProps<Params>) {
  await enablePageLocale(params);
  return <LessonPlayerClient />;
}
