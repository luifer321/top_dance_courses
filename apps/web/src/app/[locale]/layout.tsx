import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isLocale } from "@/i18n/routing";
import { allLocaleParams } from "@/i18n/static-params";
import { bodyFont, displayFont } from "../fonts";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return allLocaleParams();
}

export const viewport: Viewport = {
  themeColor: "#0a0612",
  colorScheme: "dark",
};

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "metadata" });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: { default: t("title"), template: t("titleTemplate") },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <html lang={locale} className={`dark ${bodyFont.variable} ${displayFont.variable}`}>
      <body className="flex min-h-dvh flex-col bg-surface-gradient bg-no-repeat">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider>
          <Providers>
            <SiteHeader />
            <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
              {children}
            </main>
            <SiteFooter />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
