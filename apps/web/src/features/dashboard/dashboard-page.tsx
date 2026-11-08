import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { enablePageLocale, type LocalePageProps } from "@/i18n/page-locale";
import { localizedMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return { ...(await localizedMetadata(locale, "/dashboard", t("title"))), robots: { index: false } };
}

export async function DashboardPage({ params }: LocalePageProps) {
  await enablePageLocale(params);
  const t = await getTranslations("dashboard");
  const tSubscriptions = await getTranslations("subscriptions");

  return (
    <>
      <PageHeader title={t("title")} description={t("subtitle")} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("continueLearning")}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">{t("emptyProgress")}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{tSubscriptions("title")}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">{tSubscriptions("subtitle")}</CardContent>
        </Card>
      </div>
    </>
  );
}
