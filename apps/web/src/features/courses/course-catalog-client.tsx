"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { LanguageAvailability } from "./language-availability";

export function CourseCatalogClient() {
  const t = useTranslations("courses");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses", locale],
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
    <div className="grid gap-4 sm:grid-cols-2">
      {courses.map((course) => (
        <Link key={course.slug} href={{ pathname: "/courses/[slug]", params: { slug: course.slug } }}>
          <Card className="h-full transition hover:ring-white/20">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              {course.level ? (
                <CardDescription>{t(`level.${course.level as "beginner" | "intermediate" | "advanced"}`)}</CardDescription>
              ) : null}
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {course.description ? <p className="text-muted-foreground">{course.description}</p> : null}
              <LanguageAvailability
                requestedLocale={course.requested_locale}
                contentLocale={course.content_locale}
                availableLanguages={course.available_languages}
                originalLanguage={course.original_language}
              />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
