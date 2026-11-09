import { useRouter, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Body, Button, Card, Heading, Screen, Title } from "@/components/ui";
import { useAuth } from "@/features/auth/auth-context";
import { getLocalePreference, setLocalePreference, SUPPORTED_LOCALES, type LocalePreference } from "@/i18n";
import { colors, radius, spacing, typography } from "@/theme/tokens";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [preference, setPreference] = useState<LocalePreference>("system");

  useEffect(() => {
    getLocalePreference().then(setPreference);
  }, []);

  async function choose(next: LocalePreference) {
    setPreference(next);
    await setLocalePreference(next);
  }

  const options: { value: LocalePreference; label: string; hint?: string; lang?: string }[] = [
    { value: "system", label: t("mobile.deviceLanguage"), hint: t("mobile.deviceLanguageHint") },
    ...SUPPORTED_LOCALES.map((code) => ({ value: code, label: t(`common.language.${code}`), lang: code })),
  ];

  return (
    <Screen>
      <Title>{t("profile.title")}</Title>
      <Body muted>{t("profile.subtitle")}</Body>
      <Card>
        <Heading>{t("profile.account")}</Heading>
        {user ? (
          <>
            <Body>
              {t("profile.signedInAs")} {user.email}
            </Body>
            <Button label={t("navigation.logout")} variant="outline" onPress={() => void signOut()} />
          </>
        ) : (
          <Button label={t("navigation.login")} onPress={() => router.navigate("/login" as Href)} />
        )}
      </Card>
      <Card>
        <Heading>{t("profile.preferredLanguage")}</Heading>
        <Body muted>{t("profile.preferredLanguageHint")}</Body>
        <View accessibilityRole="radiogroup" style={styles.options}>
          {options.map((option) => {
            const selected = option.value === preference;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLanguage={option.lang}
                onPress={() => choose(option.value)}
                style={[styles.option, selected && styles.optionSelected]}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                {option.hint && <Text style={styles.optionHint}>{option.hint}</Text>}
              </Pressable>
            );
          })}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  options: { gap: spacing.sm, marginTop: spacing.sm },
  option: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  optionSelected: { borderColor: colors.ring, backgroundColor: colors.accent },
  optionLabel: { ...typography.body, color: colors.foreground, fontWeight: "600" },
  optionHint: { ...typography.caption, color: colors.mutedForeground },
});
