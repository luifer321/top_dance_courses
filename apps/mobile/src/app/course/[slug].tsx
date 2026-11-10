import { Image } from "expo-image";
import { Link, useLocalSearchParams, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { Body, Card, Screen, Title } from "@/components/ui";
import { api } from "@/lib/api";
import { courseLevelKey, durationMinutes, mediaUrl, requestLocale } from "@/lib/catalog";
import { colors, spacing } from "@/theme/tokens";

type CourseDetail = {
  slug: string;
  title: string;
  description?: string | null;
  category?: { slug: string; name: string } | null;
  level?: string | null;
  requested_locale: string;
  content_locale: string;
  cover_image_url?: string | null;
  lesson_count?: number;
  duration_seconds?: number | null;
  modules: {
    position: number;
    title: string;
    lessons: {
      slug: string;
      title: string;
      subtitle?: string | null;
      thumbnail_url?: string | null;
      duration_seconds?: number | null;
    }[];
  }[];
};

export default function CourseScreen() {
  const { t, i18n } = useTranslation();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [course, setCourse] = useState<CourseDetail | null | "missing">(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    void (async () => {
      const { data, error, response } = await api.GET("/api/v1/courses/{slug}", {
        params: { path: { slug }, query: { locale: requestLocale(i18n.language) } },
      });
      if (cancelled) return;
      if (response.status === 404) {
        setCourse("missing");
      } else if (error || !data?.course) {
        setFailed(true);
      } else {
        setCourse(data.course);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, i18n.language]);

  const level = course && course !== "missing" ? courseLevelKey(course.level) : null;
  const minutes = course && course !== "missing" ? durationMinutes(course.duration_seconds) : null;
  const cover = course && course !== "missing" ? mediaUrl(course.cover_image_url) : null;

  return (
    <Screen>
      {course === null && !failed ? <Body muted>{t("common.loading")}</Body> : null}
      {failed ? <Body muted>{t("courses.loadError")}</Body> : null}
      {course === "missing" ? <Body muted>{t("courses.notFound")}</Body> : null}
      {course && course !== "missing" ? (
        <>
          {cover ? (
            <Image
              source={{ uri: cover }}
              style={{ width: "100%", aspectRatio: 16 / 9, borderRadius: 16, backgroundColor: colors.secondary }}
              contentFit="cover"
              accessibilityLabel={t("courses.coverAlt", { title: course.title })}
            />
          ) : null}
          <Title>{course.title}</Title>
          {course.category?.name ? <Body>{course.category.name}</Body> : null}
          {level ? <Body muted>{t(`courses.level.${level}`)}</Body> : null}
          {course.lesson_count != null ? (
            <Body muted>
              {t("courses.lessonCount", { count: course.lesson_count })}
              {minutes ? ` · ${t("courses.durationMinutes", { count: minutes })}` : null}
            </Body>
          ) : null}
          {course.description ? <Body muted>{course.description}</Body> : null}
          {course.requested_locale !== course.content_locale ? (
            <Body muted>{t("common.contentLanguages.notAvailableInLocale")}</Body>
          ) : null}
          <Body>{t("courses.curriculum")}</Body>
          {course.modules.map((mod) => (
            <Card key={`${mod.position}-${mod.title}`}>
              <Body>{mod.title || t("courses.modules")}</Body>
              {mod.lessons.map((lesson) => {
                const thumb = mediaUrl(lesson.thumbnail_url);
                const lessonMinutes = durationMinutes(lesson.duration_seconds);
                return (
                  <Link key={lesson.slug} href={`/lesson/${course.slug}/${lesson.slug}` as Href} asChild>
                    <Pressable accessibilityRole="link" accessibilityLabel={t("courses.openLesson", { title: lesson.title })}>
                      <View style={{ flexDirection: "row", gap: spacing.md, alignItems: "center" }}>
                        {thumb ? (
                          <Image
                            source={{ uri: thumb }}
                            style={{ width: 96, aspectRatio: 16 / 9, borderRadius: 10, backgroundColor: colors.secondary }}
                            contentFit="cover"
                            accessibilityLabel={t("courses.thumbnailAlt", { title: lesson.title })}
                          />
                        ) : null}
                        <View style={{ flex: 1, gap: 4 }}>
                          <Body>{lesson.title}</Body>
                          {lesson.subtitle ? <Body muted>{lesson.subtitle}</Body> : null}
                          {lessonMinutes ? (
                            <Body muted>{t("courses.durationMinutes", { count: lessonMinutes })}</Body>
                          ) : null}
                        </View>
                      </View>
                    </Pressable>
                  </Link>
                );
              })}
            </Card>
          ))}
        </>
      ) : null}
    </Screen>
  );
}
