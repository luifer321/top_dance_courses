"use client";

import { useTranslations } from "next-intl";
import { CourseCatalogClient } from "@/features/courses/course-catalog-client";
import { useMe } from "@/features/auth/use-me";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function DashboardHome() {
  const t = useTranslations("dashboard");
  const tNav = useTranslations("navigation");
  const { data: user, isPending } = useMe();

  return (
    <div className="flex flex-col gap-8">
      {!isPending && !user ? (
        <div className="flex flex-col gap-3 rounded-2xl bg-card px-5 py-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{t("signInHint")}</p>
          <Button asChild>
            <Link href="/login">{tNav("login")}</Link>
          </Button>
        </div>
      ) : null}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">{t("continueLearning")}</h2>
        <CourseCatalogClient />
      </section>
    </div>
  );
}
