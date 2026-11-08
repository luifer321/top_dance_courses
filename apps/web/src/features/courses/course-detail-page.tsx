import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { enablePageLocale, type LocalePageProps } from "@/i18n/page-locale";
import { CourseDetailClient } from "./course-detail-client";

type Params = { locale: string; slug: string };

export async function generateMetadata({ params }: LocalePageProps<Params>) {
  const { locale } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "courses" });
  return { title: t("detailTitle") };
}

export async function CourseDetailPage({ params }: LocalePageProps<Params>) {
  await enablePageLocale(params);
  const t = await getTranslations("courses");

  return (
    <>
      <PageHeader title={t("detailTitle")} />
      <CourseDetailClient />
    </>
  );
}
