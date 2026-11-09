import { Link, useLocalSearchParams, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

import { Body, Card, Screen, Title } from "@/components/ui";
import { api } from "@/lib/api";
import { courseLevelKey, requestLocale } from "@/lib/catalog";

type CourseDetail = {
  slug: string;
  title: string;
  description?: string | null;
  level?: string | null;
  requested_locale: string;
  content_locale: string;
  modules: { position: number; title: string; lessons: { slug: string; title: string }[] }[];
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

  return (
    <Screen>
      {course === null && !failed ? <Body muted>{t("common.loading")}</Body> : null}
      {failed ? <Body muted>{t("courses.loadError")}</Body> : null}
      {course === "missing" ? <Body muted>{t("courses.notFound")}</Body> : null}
      {course && course !== "missing" ? (
        <>
          <Title>{course.title}</Title>
          {level ? <Body muted>{t(`courses.level.${level}`)}</Body> : null}
          {course.description ? <Body muted>{course.description}</Body> : null}
          {course.requested_locale !== course.content_locale ? (
            <Body muted>{t("common.contentLanguages.notAvailableInLocale")}</Body>
          ) : null}
          {course.modules.map((mod) => (
            <Card key={`${mod.position}-${mod.title}`}>
              <Body>{mod.title || t("courses.modules")}</Body>
              {mod.lessons.map((lesson) => (
                <Link key={lesson.slug} href={`/lesson/${course.slug}/${lesson.slug}` as Href} asChild>
                  <Pressable accessibilityRole="link">
                    <Body>{lesson.title}</Body>
                  </Pressable>
                </Link>
              ))}
            </Card>
          ))}
        </>
      ) : null}
    </Screen>
  );
}
