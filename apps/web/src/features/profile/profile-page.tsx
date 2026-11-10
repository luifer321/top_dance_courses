import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { enablePageLocale, type LocalePageProps } from "@/i18n/page-locale";
import { pageMetadata } from "@/lib/metadata";
import { ProfileAccount } from "./profile-account";

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "profile" });
  return pageMetadata({
    locale,
    title: `${t("title")} | Top Dance`,
    description: t("subtitle"),
    href: "/profile",
    index: false,
  });
}

export async function ProfilePage({ params }: LocalePageProps) {
  await enablePageLocale(params);
  const t = await getTranslations("profile");

  return (
    <>
      <PageHeader title={t("title")} description={t("subtitle")} />
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>{t("account")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileAccount />
        </CardContent>
      </Card>
      <Card className="mt-4 max-w-xl">
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
