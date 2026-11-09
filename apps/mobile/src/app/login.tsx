import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet } from "react-native";

import { GoogleSignInButton } from "@/features/auth/google-button";
import { useAuth } from "@/features/auth/auth-context";
import { Body, Button, Field, Screen, Title } from "@/components/ui";
import { spacing } from "@/theme/tokens";

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    const error = await signIn(email.trim(), password);
    setSubmitting(false);
    if (error) Alert.alert(t("errors.generic"), error);
    else router.replace("/profile" as Href);
  }

  return (
    <Screen>
      <Title>{t("auth.loginTitle")}</Title>
      <Body muted>{t("auth.loginSubtitle")}</Body>
      <Field label={t("auth.email")} value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" />
      <Field
        label={t("auth.password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
      />
      <Button label={t("auth.submitLogin")} disabled={submitting} onPress={() => void submit()} />
      <Link href={"/forgot-password" as Href} asChild>
        <Pressable>
          <Body muted>{t("auth.forgotPassword")}</Body>
        </Pressable>
      </Link>
      <Body muted style={styles.or}>
        {t("auth.or")}
      </Body>
      <GoogleSignInButton onSuccess={() => router.replace("/profile" as Href)} />
      <Link href={"/register" as Href} asChild>
        <Pressable>
          <Body>
            {t("auth.noAccount")} {t("navigation.register")}
          </Body>
        </Pressable>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  or: { textAlign: "center", marginVertical: spacing.sm },
});
