import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

import { Body, Button, Screen, Title } from "@/components/ui";
import { useAuth } from "@/features/auth/auth-context";
import { api } from "@/lib/api";
import { requestLocale } from "@/lib/catalog";
import { spacing } from "@/theme/tokens";

type LessonDetail = {
  slug: string;
  course_slug: string;
  title: string;
  description?: string | null;
  requested_locale: string;
  content_locale: string;
  previous_slug?: string | null;
  next_slug?: string | null;
};

export default function LessonScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { courseSlug, lessonSlug } = useLocalSearchParams<{ courseSlug: string; lessonSlug: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null | "missing">(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [playbackUnavailable, setPlaybackUnavailable] = useState(false);

  useEffect(() => {
    if (!courseSlug || !lessonSlug) return;
    let cancelled = false;
    void (async () => {
      const { data, error, response } = await api.GET("/api/v1/courses/{slug}/lessons/{lesson_slug}", {
        params: { path: { slug: courseSlug, lesson_slug: lessonSlug }, query: { locale: requestLocale(i18n.language) } },
      });
      if (cancelled) return;
      if (response.status === 404) {
        setLesson("missing");
        return;
      }
      if (error || !data?.lesson) return;
      setLesson(data.lesson);
    })();
    return () => {
      cancelled = true;
    };
  }, [courseSlug, lessonSlug, i18n.language]);

  useEffect(() => {
    if (!courseSlug || !lessonSlug || !user) return;
    let cancelled = false;
    void (async () => {
      const { data, response } = await api.GET("/api/v1/courses/{slug}/lessons/{lesson_slug}/playback", {
        params: { path: { slug: courseSlug, lesson_slug: lessonSlug } },
      });
      if (cancelled) return;
      if (data?.embed_url) {
        setEmbedUrl(data.embed_url);
        setPlaybackUnavailable(false);
        return;
      }
      if (response.status === 422 || response.status === 403) setPlaybackUnavailable(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [courseSlug, lessonSlug, user]);

  function goTo(targetSlug: string) {
    if (!courseSlug) return;
    router.replace(`/lesson/${courseSlug}/${targetSlug}` as Href);
  }

  return (
    <Screen>
      {lesson === null ? <Body muted>{t("common.loading")}</Body> : null}
      {lesson === "missing" ? <Body muted>{t("lessons.notFound")}</Body> : null}
      {lesson && lesson !== "missing" ? (
        <>
          <Title>{lesson.title}</Title>
          {lesson.description ? <Body muted>{lesson.description}</Body> : null}
          {lesson.requested_locale !== lesson.content_locale ? (
            <Body muted>{t("common.contentLanguages.notAvailableInLocale")}</Body>
          ) : null}
          <View style={styles.player}>
            {!user && !authLoading ? (
              <>
                <Body muted>{t("lessons.signInToWatch")}</Body>
                <Button label={t("navigation.login")} onPress={() => router.push("/login" as Href)} />
              </>
            ) : null}
            {user && playbackUnavailable ? <Body muted>{t("lessons.playbackUnavailable")}</Body> : null}
            {user && embedUrl ? (
              <WebView
                source={{ uri: embedUrl }}
                allowsFullscreenVideo
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                style={styles.webview}
              />
            ) : null}
          </View>
          <View style={styles.nav}>
            <Button
              label={t("lessons.previous")}
              variant="outline"
              disabled={!lesson.previous_slug}
              onPress={() => lesson.previous_slug && goTo(lesson.previous_slug)}
            />
            <Button
              label={t("lessons.next")}
              disabled={!lesson.next_slug}
              onPress={() => lesson.next_slug && goTo(lesson.next_slug)}
            />
          </View>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  player: { height: 220, gap: spacing.md, justifyContent: "center" },
  webview: { flex: 1, backgroundColor: "transparent" },
  nav: { flexDirection: "row", gap: spacing.sm, justifyContent: "space-between" },
});
