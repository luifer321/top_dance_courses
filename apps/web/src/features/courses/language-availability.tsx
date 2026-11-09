"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { isLocale, type Locale } from "@/i18n/routing";

type AvailableLanguages = {
  text?: string[];
  audio?: string[];
  subtitles?: string[];
};

export function LanguageAvailability({
  requestedLocale,
  contentLocale,
  availableLanguages,
  originalLanguage,
}: {
  requestedLocale: string;
  contentLocale: string;
  availableLanguages?: AvailableLanguages;
  originalLanguage?: string;
}) {
  const t = useTranslations("common");

  return (
    <div className="flex flex-col gap-2">
      {requestedLocale !== contentLocale ? (
        <p className="text-sm text-amber-200">{t("contentLanguages.notAvailableInLocale")}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {originalLanguage && isLocale(originalLanguage) ? (
          <Badge variant="outline">
            {t("contentLanguages.original")}: {t(`language.${originalLanguage as Locale}`)}
          </Badge>
        ) : null}
        {availableLanguages?.text?.map((code) =>
          isLocale(code) ? (
            <Badge key={`text-${code}`} variant="secondary">
              {t("contentLanguages.available")}: {t(`language.${code}`)}
            </Badge>
          ) : null,
        )}
        {availableLanguages?.audio?.map((code) =>
          isLocale(code) ? (
            <Badge key={`audio-${code}`} variant="outline">
              {t("contentLanguages.audio")}: {t(`language.${code}`)}
            </Badge>
          ) : null,
        )}
        {availableLanguages?.subtitles?.map((code) =>
          isLocale(code) ? (
            <Badge key={`sub-${code}`} variant="outline">
              {t("contentLanguages.subtitles")}: {t(`language.${code}`)}
            </Badge>
          ) : null,
        )}
      </div>
    </div>
  );
}
