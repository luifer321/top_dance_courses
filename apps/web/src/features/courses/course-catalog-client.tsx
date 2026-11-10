"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { useMe } from "@/features/auth/use-me";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { CatalogCover } from "./catalog-cover";
import { CourseMeta } from "./course-meta";
import { CourseProgress } from "./course-progress";

export function CourseCatalogClient() {
  const t = useTranslations("courses");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { data: user } = useMe();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses", locale, user?.id ?? "anon"],
    queryFn: async () => {
      const { data, error } = await api.GET("/api/v1/courses", { params: { query: { locale } } });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <p className="text-muted-foreground">{tCommon("loading")}</p>;
  }

  if (isError) {
    return <p className="text-muted-foreground">{t("loadError")}</p>;
  }

  const courses = data?.courses ?? [];
  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground">{t("emptyCatalog")}</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Link
          key={course.slug}
          href={{ pathname: "/courses/[slug]", params: { slug: course.slug } }}
          className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-card ring-1 ring-foreground/10 outline-none transition-colors hover:bg-card-hover focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <CatalogCover
            src={course.cover_image_url}
            alt={t("coverAlt", { title: course.title })}
            className="aspect-video"
          />
          <div className="flex flex-1 flex-col gap-2 px-3.5 py-3">
            <CourseMeta
              category={course.category?.name}
              level={course.level}
              lessonCount={course.lesson_count}
              durationSeconds={course.duration_seconds}
            />
            <h2 className="line-clamp-2 text-base leading-snug font-semibold tracking-tight text-white">
              {course.title}
            </h2>
            {course.description ? (
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{course.description}</p>
            ) : null}
            <CourseProgress progress={course.progress} className="mt-auto pt-1" />
          </div>
        </Link>
      ))}
    </div>
  );
}
