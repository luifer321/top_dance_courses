import { useTranslation } from "react-i18next";

import { Body, Card, Screen, Title } from "@/components/ui";

export default function CoursesScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <Title>{t("courses.title")}</Title>
      <Body muted>{t("courses.subtitle")}</Body>
      <Card>
        <Body muted>{t("courses.emptyCatalog")}</Body>
      </Card>
    </Screen>
  );
}
