import { getTranslations } from "next-intl/server";
import { AuthStatus } from "@/components/auth-status";
import { BrandLockup } from "@/components/brand-lockup";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/i18n/navigation";

export async function SiteHeader() {
  const t = await getTranslations("navigation");
  const tCommon = await getTranslations("common");

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-6">
        <BrandLockup label={tCommon("appName")} />
        <nav aria-label={t("mainMenu")} className="hidden items-center gap-6 text-sm sm:flex">
          <Link href="/courses" className="text-muted-foreground transition-colors hover:text-white">
            {t("courses")}
          </Link>
          <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-white">
            {t("dashboard")}
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <LanguageSwitcher />
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
