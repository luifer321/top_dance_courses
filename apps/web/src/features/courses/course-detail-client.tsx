"use client";

import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/use-me";
import { useSetLocaleAlternates } from "@/features/i18n/locale-alternates";
import { courseLocaleHrefs } from "@/lib/locale-hrefs";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { durationMinutes } from "@/lib/catalog";
import { useRouteParams } from "@/lib/use-route-params";
import { CatalogCover } from "./catalog-cover";
import { CourseMeta } from "./course-meta";
import { CourseProgress } from "./course-progress";

export function CourseDetailClient() {
  const t = useTranslations("courses");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { data: user } = useMe();
  const { slug } = useRouteParams({ slug: 1 });
  const { data, isLoading, isError } = useQuery({
    queryKey: ["course", slug, locale, user?.id ?? "anon"],
    enabled: Boolean(slug),
    queryFn: async () => {
      const { data, error, response } = await api.GET("/api/v1/courses/{slug}", {
        params: { path: { slug: slug! }, query: { locale } },
      });
      if (response.status === 404) return null;
      if (error) throw error;
      return data;
    },
  });

  useSetLocaleAlternates(data?.course ? courseLocaleHrefs(data.course.localized_slugs) : null);

  if (!slug || isLoading) {
    return <p className="text-muted-foreground">{tCommon("loading")}</p>;
  }

  if (isError) {
    return <p className="text-muted-foreground">{t("loadError")}</p>;
  }

  const course = data?.course;
  if (!course) {
    return <p className="text-muted-foreground">{t("notFound")}</p>;
  }

  const firstLesson = course.modules.flatMap((mod) => mod.lessons)[0];
  const started = (course.progress?.percent ?? 0) > 0;

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-[1.25rem] bg-card ring-1 ring-foreground/10">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[min(46%,32rem)] md:block">
          <CatalogCover src={course.cover_image_url} alt="" className="size-full [&_img]:object-[center_40%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-card from-0% via-card/80 via-[18%] to-transparent to-[68%]" />
        </div>
        <div className="relative h-32 sm:h-36 md:hidden">
          <CatalogCover
            src={course.cover_image_url}
            alt={t("coverAlt", { title: course.title })}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        </div>
        <div className="relative flex flex-col justify-center gap-3 px-5 py-5 sm:px-7 sm:py-6 md:min-h-72 md:max-w-xl md:py-8">
          <CourseMeta
            category={course.category?.name}
            level={course.level}
            lessonCount={course.lesson_count}
            durationSeconds={course.duration_seconds}
          />
          <h1 className="text-[1.75rem] leading-[1.15] tracking-tight text-white sm:text-4xl">{course.title}</h1>
          {course.description ? (
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{course.description}</p>
          ) : null}
          <CourseProgress progress={course.progress} className="max-w-xs" />
          {firstLesson ? (
            <div className="pt-1">
              <Button asChild className="w-full sm:w-auto">
                <Link
                  href={{
                    pathname: "/courses/[slug]/lessons/[lessonSlug]",
                    params: { slug: course.slug, lessonSlug: firstLesson.slug },
                  }}
                >
                  {t(started ? "continue" : "start")}
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">{t("curriculum")}</h2>
        {course.modules.map((mod) => (
          <div key={`${mod.position}-${mod.title}`} className="flex flex-col gap-2">
            <h3 className="text-xs font-medium tracking-wide text-gray-400">{mod.title || t("modules")}</h3>
            <ol className="overflow-hidden rounded-[1.25rem] bg-card ring-1 ring-foreground/10">
              {mod.lessons.map((lesson, index) => {
                const lessonMinutes = durationMinutes(lesson.duration_seconds);
                return (
                  <li key={lesson.slug} className="border-t border-white/8 first:border-t-0">
                    <Link
                      href={{
                        pathname: "/courses/[slug]/lessons/[lessonSlug]",
                        params: { slug: course.slug, lessonSlug: lesson.slug },
                      }}
                      className="group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-card-hover focus-visible:ring-3 focus-visible:ring-ring/50 sm:gap-3.5 sm:px-4"
                      aria-label={t("openLesson", { title: lesson.title })}
                    >
                      <CatalogCover
                        src={lesson.thumbnail_url}
                        alt={t("thumbnailAlt", { title: lesson.title })}
                        className="aspect-video w-24 shrink-0 rounded-lg sm:w-32"
                      />
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="text-xs tabular-nums text-gray-400">{index + 1}</span>
                          <span className="min-w-0 font-medium text-foreground">{lesson.title}</span>
                          {lesson.completed ? (
                            <span className="inline-flex text-purple-light">
                              <Check className="size-3.5" aria-hidden="true" />
                              <span className="sr-only">{t("watched")}</span>
                            </span>
                          ) : null}
                          {lesson.free_preview ? <Badge variant="outline">{t("freePreview")}</Badge> : null}
                        </span>
                        {lesson.subtitle ? (
                          <span className="line-clamp-2 text-sm leading-snug text-muted-foreground">{lesson.subtitle}</span>
                        ) : null}
                      </span>
                      {lessonMinutes ? (
                        <span className="shrink-0 text-xs tabular-nums text-gray-400">
                          {t("durationMinutes", { count: lessonMinutes })}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </section>
    </div>
  );
}
