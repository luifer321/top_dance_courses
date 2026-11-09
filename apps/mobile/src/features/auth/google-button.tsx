import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import { Body, Button } from "@/components/ui";
import { useAuth } from "./auth-context";

WebBrowser.maybeCompleteAuthSession();

export function GoogleSignInButton({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation();
  const { signInWithGoogle } = useAuth();
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const configured = Boolean(webClientId || iosClientId || androidClientId);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId,
    iosClientId,
    androidClientId,
    webClientId,
  });

  useEffect(() => {
    if (response?.type !== "success") return;
    const idToken = response.params.id_token;
    if (!idToken) return;
    signInWithGoogle(idToken).then((error) => {
      if (error) Alert.alert(t("errors.generic"), error);
      else onSuccess();
    });
  }, [onSuccess, response, signInWithGoogle, t]);

  if (!configured) {
    return <Body muted>{t("auth.googleUnavailable")}</Body>;
  }

  return (
    <Button
      variant="outline"
      label={t("auth.continueWithGoogle")}
      disabled={!request}
      onPress={() => void promptAsync()}
    />
  );
}
