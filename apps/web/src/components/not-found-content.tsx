import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export async function NotFoundContent() {
  const t = await getTranslations("errors");

  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <h1 className="text-3xl font-semibold">{t("notFoundTitle")}</h1>
      <p className="text-muted-foreground">{t("notFoundDescription")}</p>
      <Button asChild>
        <Link href="/">{t("backHome")}</Link>
      </Button>
    </div>
  );
}
