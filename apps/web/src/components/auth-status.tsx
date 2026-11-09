"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useMe } from "@/features/auth/use-me";
import { api, ensureCsrf } from "@/lib/api";
import { apiErrorMessage } from "@/lib/api-error";
import { Link } from "@/i18n/navigation";
import { Button } from "./ui/button";

export function AuthStatus() {
  const t = useTranslations("navigation");
  const tErrors = useTranslations("errors");
  const { data: user, isPending, refetch } = useMe();

  async function signOut() {
    try {
      await ensureCsrf();
      const { error } = await api.DELETE("/api/v1/auth/session");
      if (error) {
        toast.error(apiErrorMessage(error, tErrors("generic")));
        return;
      }
      await refetch();
    } catch {
      toast.error(tErrors("network"));
    }
  }

  if (isPending) {
    return <div className="h-8 w-20" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-1.5">
        <Button asChild size="sm" variant="ghost">
          <Link href="/profile">{user.name}</Link>
        </Button>
        <Button size="sm" variant="outline" onClick={() => void signOut()}>
          {t("logout")}
        </Button>
      </div>
    );
  }

  return (
    <Button asChild size="sm">
      <Link href="/login">{t("login")}</Link>
    </Button>
  );
}
