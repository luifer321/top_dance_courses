"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type CourseProgressValue = {
  completed_lessons: number;
  lesson_count: number;
  percent: number;
};

export function CourseProgress({
  progress,
  className,
}: {
  progress?: CourseProgressValue | null;
  className?: string;
}) {
  const t = useTranslations("courses");
  if (!progress) return null;

  const label =
    progress.percent >= 100
      ? t("completed")
      : progress.completed_lessons > 0
        ? t("progressLessons", { completed: progress.completed_lessons, count: progress.lesson_count })
        : progress.percent > 0
          ? t("inProgress")
          : t("notStarted");

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between gap-3 text-[11px] leading-4 text-gray-400">
        <span>{label}</span>
        <span className="tabular-nums">{progress.percent}%</span>
      </div>
      <div className="h-0.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
        <div
          className="h-full rounded-full bg-purple-light"
          style={{ width: `${Math.min(progress.percent, 100)}%` }}
        />
      </div>
    </div>
  );
}
