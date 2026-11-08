import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export async function SiteHeader() {
  const t = await getTranslations("navigation");
  const tCommon = await getTranslations("common");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="font-heading text-lg font-semibold text-white">
          {tCommon("appName")}
        </Link>
        <nav aria-label={t("mainMenu")} className="hidden items-center gap-1 sm:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/courses">{t("courses")}</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">{t("dashboard")}</Link>
          </Button>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <Button asChild size="sm">
            <Link href="/login">{t("login")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
