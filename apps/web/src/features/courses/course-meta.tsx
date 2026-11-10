"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { courseLevelKey, durationMinutes } from "@/lib/catalog";

export function CourseMeta({
  category,
  level,
  lessonCount,
  durationSeconds,
}: {
  category?: string | null;
  level?: string | null;
  lessonCount: number;
  durationSeconds?: number | null;
}) {
  const t = useTranslations("courses");
  const levelKey = courseLevelKey(level);
  const minutes = durationMinutes(durationSeconds);

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {category ? <span className="text-xs font-medium text-purple-glow">{category}</span> : null}
      {levelKey ? <Badge>{t(`level.${levelKey}`)}</Badge> : null}
      <span className="text-xs text-muted-foreground">
        {t("lessonCount", { count: lessonCount })}
        {minutes ? ` · ${t("durationMinutes", { count: minutes })}` : null}
      </span>
    </div>
  );
}
