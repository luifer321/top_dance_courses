import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { enablePageLocale, type LocalePageProps } from "@/i18n/page-locale";
import { localizedMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "courses" });
  return localizedMetadata(locale, "/courses", t("title"));
}

export async function CourseCatalogPage({ params }: LocalePageProps) {
  await enablePageLocale(params);
  const t = await getTranslations("courses");

  return (
    <>
      <PageHeader title={t("title")} description={t("subtitle")} />
      <Card>
        <CardContent className="text-muted-foreground">{t("emptyCatalog")}</CardContent>
      </Card>
    </>
  );
}
