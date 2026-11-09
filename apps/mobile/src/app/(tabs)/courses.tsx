import { useRouter, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

import { Body, Card, Screen, Title } from "@/components/ui";
import { api } from "@/lib/api";
import { courseLevelKey, requestLocale } from "@/lib/catalog";

type CourseSummary = {
  slug: string;
  title: string;
  description?: string | null;
  level?: string | null;
  requested_locale: string;
  content_locale: string;
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
        return (
          <Pressable
            key={course.slug}
            accessibilityRole="button"
            onPress={() => router.push(`/course/${course.slug}` as Href)}
          >
            <Card>
              <Body>{course.title}</Body>
              {level ? <Body muted>{t(`courses.level.${level}`)}</Body> : null}
              {course.description ? <Body muted>{course.description}</Body> : null}
              {course.requested_locale !== course.content_locale ? (
                <Body muted>{t("common.contentLanguages.notAvailableInLocale")}</Body>
              ) : null}
            </Card>
          </Pressable>
        );
      })}
    </Screen>
  );
}
