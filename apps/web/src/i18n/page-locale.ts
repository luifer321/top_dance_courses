import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isLocale, type Locale } from "./routing";

export type LocaleParams = { locale: string };
export type LocalePageProps<P extends LocaleParams = LocaleParams> = {
  params: Promise<P>;
};

// Every page must call this so next-intl can render it statically.
export async function enablePageLocale<P extends LocaleParams>(
  params: Promise<P>,
): Promise<P & { locale: Locale }> {
  const resolved = await params;
  if (!isLocale(resolved.locale)) notFound();
  setRequestLocale(resolved.locale);
  return resolved as P & { locale: Locale };
}
