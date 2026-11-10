import { Image } from "expo-image";
import { useRouter, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { Body, Card, Screen, Title } from "@/components/ui";
import { api } from "@/lib/api";
import { courseLevelKey, durationMinutes, mediaUrl, requestLocale } from "@/lib/catalog";
import { colors, spacing } from "@/theme/tokens";

type CourseSummary = {
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
};

export default function CoursesScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data, error } = await api.GET("/api/v1/courses", {
        params: { query: { locale: requestLocale(i18n.language) } },
      });
      if (cancelled) return;
      if (error || !data) {
        setFailed(true);
      } else {
        setCourses(data.courses);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [i18n.language]);

  return (
    <Screen>
      <Title>{t("courses.title")}</Title>
      <Body muted>{t("courses.subtitle")}</Body>
      {loading ? <Body muted>{t("common.loading")}</Body> : null}
      {failed ? <Body muted>{t("courses.loadError")}</Body> : null}
      {!loading && !failed && courses.length === 0 ? (
        <Card>
          <Body muted>{t("courses.emptyCatalog")}</Body>
        </Card>
      ) : null}
      {courses.map((course) => {
        const level = courseLevelKey(course.level);
        const minutes = durationMinutes(course.duration_seconds);
        const cover = mediaUrl(course.cover_image_url);
        return (
          <Pressable
            key={course.slug}
            accessibilityRole="button"
            onPress={() => router.push(`/course/${course.slug}` as Href)}
          >
            <Card flush>
              {cover ? (
                <Image
                  source={{ uri: cover }}
                  style={{ width: "100%", aspectRatio: 16 / 9, backgroundColor: colors.secondary }}
                  contentFit="cover"
                  accessibilityLabel={t("courses.coverAlt", { title: course.title })}
                />
              ) : null}
              <View style={{ padding: spacing.lg, gap: spacing.sm }}>
                <Body>{course.title}</Body>
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
              </View>
            </Card>
          </Pressable>
        );
      })}
    </Screen>
  );
}
