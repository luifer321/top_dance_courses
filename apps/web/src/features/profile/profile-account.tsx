"use client";

import { useTranslations } from "next-intl";
import { useMe } from "@/features/auth/use-me";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function ProfileAccount() {
  const t = useTranslations("profile");
  const tNav = useTranslations("navigation");
  const { data: user, isPending } = useMe();

  if (isPending) return null;

  if (!user) {
    return (
      <Button asChild>
        <Link href="/login">{tNav("login")}</Link>
      </Button>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      {t("signedInAs")} <span className="text-foreground">{user.email}</span>
    </p>
  );
}