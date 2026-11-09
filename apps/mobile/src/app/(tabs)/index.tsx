import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Badge, Body, Button, Eyebrow, Heading, Screen, Title } from "@/components/ui";
import { spacing } from "@/theme/tokens";

const STYLE_KEYS = [
  "salsa",
  "bachata",
  "technique",
  "musicality",
  "coordination",
  "footwork",
  "choreography",
  "competition",
] as const;

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Screen>
      <Eyebrow>{t("home.eyebrow")}</Eyebrow>
      <Title>{t("home.title")}</Title>
      <Body muted>{t("home.subtitle")}</Body>
      <Button label={t("home.primaryCta")} onPress={() => router.navigate("/courses")} />

      <Heading style={styles.sectionTitle}>{t("home.stylesTitle")}</Heading>
      <View style={styles.badges}>
        {STYLE_KEYS.map((key) => (
          <Badge key={key} label={t(`home.styles.${key}`)} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginTop: spacing.xl },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
});
