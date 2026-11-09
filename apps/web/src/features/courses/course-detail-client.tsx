"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { useRouteParams } from "@/lib/use-route-params";
import { LanguageAvailability } from "./language-availability";

export function CourseDetailClient() {
  const t = useTranslations("courses");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { slug } = useRouteParams({ slug: 1 });
  const { data, isLoading, isError } = useQuery({
    queryKey: ["course", slug, locale],
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold">{course.title}</h2>
        {course.level ? <p className="text-muted-foreground">{t(`level.${course.level as "beginner" | "intermediate" | "advanced"}`)}</p> : null}
        {course.description ? <p className="max-w-2xl text-muted-foreground">{course.description}</p> : null}
        <LanguageAvailability
          requestedLocale={course.requested_locale}
          contentLocale={course.content_locale}
          availableLanguages={course.available_languages}
          originalLanguage={course.original_language}
        />
      </div>

      {course.modules.map((mod) => (
        <Card key={`${mod.position}-${mod.title}`}>
          <CardHeader>
            <CardTitle>{mod.title || t("modules")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {mod.lessons.map((lesson) => (
                <li key={lesson.slug}>
                  <Link
                    href={{
                      pathname: "/courses/[slug]/lessons/[lessonSlug]",
                      params: { slug: course.slug, lessonSlug: lesson.slug },
                    }}
                    className="text-purple-bright underline-offset-4 hover:underline"
                  >
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
