import { getTranslations } from "next-intl/server";
import { NotFoundContent } from "@/components/not-found-content";
import { enablePageLocale, type LocalePageProps } from "@/i18n/page-locale";

// Exports /{locale}/404/ so scripts/post-export.mjs can publish a localized
// 404.html per locale (Cloudflare Pages serves the nearest 404.html). Other
// unknown paths fall through to not-found.tsx because dynamicParams is false.
export const dynamicParams = false;
export const generateStaticParams = () => [{ missing: ["404"] }];

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "errors" });
  return { title: { absolute: `${t("notFoundTitle")} | Top Dance` }, robots: { index: false, follow: true } };
}

export default async function MissingPage({ params }: LocalePageProps) {
  await enablePageLocale(params);
  return <NotFoundContent />;
}
