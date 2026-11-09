import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { enablePageLocale, type LocalePageProps } from "@/i18n/page-locale";
import { localizedMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "profile" });
  return { ...(await localizedMetadata(locale, "/profile", t("title"))), robots: { index: false } };
}

export async function ProfilePage({ params }: LocalePageProps) {
  await enablePageLocale(params);
  const t = await getTranslations("profile");

  return (
    <>
      <PageHeader title={t("title")} description={t("subtitle")} />
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>{t("preferredLanguage")}</CardTitle>
          <CardDescription>{t("preferredLanguageHint")}</CardDescription>
        </CardHeader>
        <CardContent>
          <LanguageSwitcher />
        </CardContent>
      </Card>
    </>
  );
}
