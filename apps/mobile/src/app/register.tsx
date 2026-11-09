import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet } from "react-native";

import { GoogleSignInButton } from "@/features/auth/google-button";
import { useAuth } from "@/features/auth/auth-context";
import { Body, Button, Field, Screen, Title } from "@/components/ui";
import { spacing } from "@/theme/tokens";

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    const error = await register(name.trim(), email.trim(), password);
    setSubmitting(false);
    if (error) Alert.alert(t("errors.generic"), error);
    else router.replace("/profile" as Href);
  }

  return (
    <Screen>
      <Title>{t("auth.registerTitle")}</Title>
      <Body muted>{t("auth.registerSubtitle")}</Body>
      <Field label={t("auth.name")} value={name} onChangeText={setName} autoComplete="name" autoCapitalize="words" />
      <Field label={t("auth.email")} value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" />
      <Field
        label={t("auth.password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password-new"
      />
      <Button label={t("auth.submitRegister")} disabled={submitting} onPress={() => void submit()} />
      <Body muted style={styles.or}>
        {t("auth.or")}
      </Body>
      <GoogleSignInButton onSuccess={() => router.replace("/profile" as Href)} />
      <Link href={"/login" as Href} asChild>
        <Pressable>
          <Body>
            {t("auth.haveAccount")} {t("navigation.login")}
          </Body>
        </Pressable>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  or: { textAlign: "center", marginVertical: spacing.sm },
});
