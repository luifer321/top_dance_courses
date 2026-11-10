import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { enablePageLocale, type LocalePageProps } from "@/i18n/page-locale";
import { pageMetadata } from "@/lib/metadata";
import { DashboardHome } from "./dashboard-home";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return pageMetadata({
    locale,
    title: `${t("title")} | Top Dance`,
    description: t("subtitle"),
    href: "/dashboard",
    index: false,
  });
}

export async function DashboardPage({ params }: LocalePageProps) {
  await enablePageLocale(params);
  const t = await getTranslations("dashboard");

  return (
    <>
      <PageHeader title={t("title")} description={t("subtitle")} />
      <DashboardHome />
    </>
  );
}
