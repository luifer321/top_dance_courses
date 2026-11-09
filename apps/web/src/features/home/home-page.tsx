import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { enablePageLocale, type LocalePageProps } from "@/i18n/page-locale";
import { localizedMetadata } from "@/lib/metadata";

const STYLE_KEYS = [
  "salsa",
  "bachata",
  "technique",
  "musicality",
  "coordination",
  "footwork",
  "choreography",
  "competition",
] as const;

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await enablePageLocale(params);
  return localizedMetadata(locale, "/");
}

export async function HomePage({ params }: LocalePageProps) {
  await enablePageLocale(params);
  const t = await getTranslations("home");

  return (
    <div className="flex flex-col gap-16">
      <section className="flex max-w-3xl flex-col gap-5 pt-6 sm:pt-16">
        <p className="text-xs font-medium tracking-[0.16em] text-purple-glow uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl leading-[1.12] sm:text-5xl lg:text-6xl">
          <span className="text-brand-gradient">{t("title")}</span>
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t("subtitle")}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="shadow-glow">
            <Link href="/courses">{t("primaryCta")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/register">{t("secondaryCta")}</Link>
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">{t("stylesTitle")}</h2>
        <ul className="flex flex-wrap gap-2">
          {STYLE_KEYS.map((key) => (
            <li key={key}>
              <Badge variant="secondary" className="h-8 px-3 text-sm">
                {t(`styles.${key}`)}
              </Badge>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
