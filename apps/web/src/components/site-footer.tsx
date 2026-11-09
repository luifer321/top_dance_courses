import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations();

  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} {t("common.appName")}. {t("navigation.footerRights")}
      </div>
    </footer>
  );
}
