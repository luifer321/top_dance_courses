import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable } from "react-native";

import { useAuth } from "@/features/auth/auth-context";
import { Body, Button, Field, Screen, Title } from "@/components/ui";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    const error = await requestPasswordReset(email.trim());
    setSubmitting(false);
    if (error) Alert.alert(t("errors.generic"), error);
    else {
      Alert.alert(t("auth.forgotTitle"), t("auth.resetEmailSent"));
      router.back();
    }
  }

  return (
    <Screen>
      <Title>{t("auth.forgotTitle")}</Title>
      <Body muted>{t("auth.forgotSubtitle")}</Body>
      <Field label={t("auth.email")} value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" />
      <Button label={t("auth.submitForgot")} disabled={submitting} onPress={() => void submit()} />
      <Link href={"/login" as Href} asChild>
        <Pressable>
          <Body>{t("navigation.login")}</Body>
        </Pressable>
      </Link>
    </Screen>
  );
}
