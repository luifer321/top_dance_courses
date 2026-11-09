"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouteParams } from "@/lib/use-route-params";

export function CourseDetailClient() {
  const t = useTranslations("courses");
  const { slug } = useRouteParams({ slug: 1 });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-mono text-base">{slug ?? "…"}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">{t("detailPlaceholder")}</CardContent>
    </Card>
  );
}
