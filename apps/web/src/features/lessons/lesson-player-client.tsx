"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useMe } from "@/features/auth/use-me";
import { LanguageAvailability } from "@/features/courses/language-availability";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { useRouteParams } from "@/lib/use-route-params";

export function LessonPlayerClient() {
  const t = useTranslations("lessons");
  const tNav = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { slug, lessonSlug } = useRouteParams({ slug: 1, lessonSlug: 3 });
  const { data: user, isLoading: authLoading } = useMe();

  const lessonQuery = useQuery({
    queryKey: ["lesson", slug, lessonSlug, locale],
    enabled: Boolean(slug && lessonSlug),
    queryFn: async () => {
      const { data, error, response } = await api.GET("/api/v1/courses/{slug}/lessons/{lesson_slug}", {
        params: { path: { slug: slug!, lesson_slug: lessonSlug! }, query: { locale } },
      });
      if (response.status === 404) return null;
      if (error) throw error;
      return data;
    },
  });

  const playbackQuery = useQuery({
    queryKey: ["playback", slug, lessonSlug, user?.id],
    enabled: Boolean(slug && lessonSlug && user),
    retry: false,
    queryFn: async () => {
      const { data, error, response } = await api.GET("/api/v1/courses/{slug}/lessons/{lesson_slug}/playback", {
        params: { path: { slug: slug!, lesson_slug: lessonSlug! } },
      });
      if (response.status === 401) return { kind: "signed_out" as const };
      if (response.status === 422 || response.status === 403) return { kind: "unavailable" as const };
      if (error) throw error;
      return { kind: "ready" as const, ...data! };
    },
  });

  if (!slug || !lessonSlug || lessonQuery.isLoading || authLoading) {
    return <p className="text-muted-foreground">{tCommon("loading")}</p>;
  }

  const lesson = lessonQuery.data?.lesson;
  if (!lesson) {
    return <p className="text-muted-foreground">{t("notFound")}</p>;
  }

  const playback = playbackQuery.data;
  const lessonHref = (targetSlug: string) =>
    ({
      pathname: "/courses/[slug]/lessons/[lessonSlug]" as const,
      params: { slug: lesson.course_slug, lessonSlug: targetSlug },
    });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold">{lesson.title}</h2>
        {lesson.description ? <p className="mt-2 max-w-2xl text-muted-foreground">{lesson.description}</p> : null}
        <div className="mt-3">
          <LanguageAvailability
            requestedLocale={lesson.requested_locale}
            contentLocale={lesson.content_locale}
            availableLanguages={lesson.available_languages}
            originalLanguage={lesson.original_language}
          />
        </div>
      </div>

      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border bg-card shadow-glow-sm">
        {!user ? (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <p className="text-muted-foreground">{t("signInToWatch")}</p>
            <Button asChild>
              <Link href="/login">{tNav("login")}</Link>
            </Button>
          </div>
        ) : playbackQuery.isLoading ? (
          <p className="text-muted-foreground">{tCommon("loading")}</p>
        ) : playback?.kind === "ready" && playback.embed_url ? (
          <iframe
            title={lesson.title}
            src={playback.embed_url}
            className="size-full border-0"
            allow="accelerometer; gyroscope; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <p className="px-6 text-center text-muted-foreground">{t("playbackUnavailable")}</p>
        )}
      </div>

      <div className="flex justify-between gap-2">
        {lesson.previous_slug ? (
          <Button variant="outline" asChild>
            <Link href={lessonHref(lesson.previous_slug)}>{t("previous")}</Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            {t("previous")}
          </Button>
        )}
        {lesson.next_slug ? (
          <Button asChild>
            <Link href={lessonHref(lesson.next_slug)}>{t("next")}</Link>
          </Button>
        ) : (
          <Button disabled>{t("next")}</Button>
        )}
      </div>
    </div>
  );
}
