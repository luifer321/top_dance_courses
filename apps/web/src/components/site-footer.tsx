import { getTranslations } from "next-intl/server";
import { BrandLockup } from "@/components/brand-lockup";

export async function SiteFooter() {
  const t = await getTranslations();

  return (
    <footer className="border-t border-white/8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <BrandLockup label={t("common.appName")} />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t("common.appName")}. {t("navigation.footerRights")}
        </p>
      </div>
    </footer>
  );
}
