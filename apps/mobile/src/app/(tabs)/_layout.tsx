import { NativeTabs } from "expo-router/native-tabs";
import { useTranslation } from "react-i18next";

import { colors } from "@/theme/tokens";

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.secondary}
      iconColor={{ default: colors.mutedForeground, selected: colors.accentForeground }}
      labelStyle={{ default: { color: colors.mutedForeground }, selected: { color: colors.heading } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t("navigation.home")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="courses">
        <NativeTabs.Trigger.Label>{t("navigation.courses")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="play.rectangle.fill" md="video_library" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>{t("navigation.profile")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.crop.circle.fill" md="account_circle" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
