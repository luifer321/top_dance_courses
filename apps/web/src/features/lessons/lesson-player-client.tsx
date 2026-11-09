"use client";

import { PlayIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouteParams } from "@/lib/use-route-params";

export function LessonPlayerClient() {
  const t = useTranslations("lessons");
  const { slug, lessonSlug } = useRouteParams({ slug: 1, lessonSlug: 3 });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex aspect-video items-center justify-center rounded-xl border bg-card shadow-glow-sm">
        <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
          <PlayIcon className="size-10 text-purple-bright" aria-hidden />
          <p>{t("playerPlaceholder")}</p>
          <p className="font-mono text-xs">
            {slug ?? "…"} / {lessonSlug ?? "…"}
          </p>
        </div>
      </div>
      <div className="flex justify-between gap-2">
        <Button variant="outline" disabled>
          {t("previous")}
        </Button>
        <Button disabled>{t("next")}</Button>
      </div>
    </div>
  );
}
