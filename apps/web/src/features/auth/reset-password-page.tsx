"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ResetPasswordForm } from "./password-forms";

export function ResetPasswordPageClient() {
  const t = useTranslations("auth");
  const token = useSearchParams().get("token") ?? "";

  if (!token) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("missingResetToken")}{" "}
        <Link href="/forgot-password" className="font-medium text-purple-bright underline-offset-4 hover:underline">
          {t("forgotPassword")}
        </Link>
      </p>
    );
  }

  return <ResetPasswordForm token={token} />;
}
