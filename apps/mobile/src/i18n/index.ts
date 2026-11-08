import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";
import { DEFAULT_LOCALE, isLocale, resolveLocale, type Locale, type LocalePreference } from "./locale";

export * from "./locale";

// Same key the web app uses for localStorage.
const STORAGE_KEY = "top-dance.locale";

const i18n = createInstance();

export const resources = {
  es: { translation: es },
  en: { translation: en },
} as const;

export async function getLocalePreference(): Promise<LocalePreference> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY).catch(() => null);
  return isLocale(stored) ? stored : "system";
}

export async function setLocalePreference(preference: LocalePreference): Promise<Locale> {
  if (preference === "system") {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } else {
    await AsyncStorage.setItem(STORAGE_KEY, preference);
  }
  const locale = resolveLocale(preference, getLocales());
  await i18n.changeLanguage(locale);
  return locale;
}

export async function initI18n(): Promise<Locale> {
  const locale = resolveLocale(await getLocalePreference(), getLocales());

  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: ["es", "en"],
      // Same `{name}` placeholder syntax as next-intl on the web.
      interpolation: { escapeValue: false, prefix: "{", suffix: "}" },
      returnNull: false,
    });
  }
  return locale;
}

export default i18n;
