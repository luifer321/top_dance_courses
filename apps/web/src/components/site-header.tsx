import { getTranslations } from "next-intl/server";
import { AuthStatus } from "@/components/auth-status";
import { BrandLockup } from "@/components/brand-lockup";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MainNav } from "@/components/main-nav";

export async function SiteHeader() {
  const tCommon = await getTranslations("common");

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <BrandLockup label={tCommon("appName")} />
        <MainNav className="hidden sm:flex" />
        <div className="ml-auto flex items-center gap-1.5">
          <LanguageSwitcher />
          <AuthStatus />
        </div>
      </div>
      <MainNav className="mx-auto flex h-10 max-w-7xl border-t border-white/8 px-2 sm:hidden" />
    </header>
  );
}
