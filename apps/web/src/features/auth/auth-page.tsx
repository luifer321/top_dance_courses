import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { enablePageLocale, type LocalePageProps } from "@/i18n/page-locale";
import { localizedMetadata } from "@/lib/metadata";
import { AuthForm } from "./auth-form";

async function AuthPage({ params, mode }: LocalePageProps & { mode: "login" | "register" }) {
  await enablePageLocale(params);
  const t = await getTranslations("auth");
  const tNav = await getTranslations("navigation");
  const isLogin = mode === "login";

  return (
    <div className="flex justify-center py-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-heading text-2xl text-white">
            {isLogin ? t("loginTitle") : t("registerTitle")}
          </CardTitle>
          <CardDescription>{isLogin ? t("loginSubtitle") : t("registerSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode={mode} />
        </CardContent>
        <CardFooter className="gap-1 text-sm text-muted-foreground">
          {isLogin ? t("noAccount") : t("haveAccount")}
          <Link
            href={isLogin ? "/register" : "/login"}
            className="text-purple-bright underline-offset-4 hover:underline"
          >
            {isLogin ? tNav("register") : tNav("login")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export function LoginPage(props: LocalePageProps) {
  return <AuthPage {...props} mode="login" />;
}

export function RegisterPage(props: LocalePageProps) {
  return <AuthPage {...props} mode="register" />;
}

export async function generateLoginMetadata({ params }: LocalePageProps) {
  const { locale } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "navigation" });
  return localizedMetadata(locale, "/login", t("login"));
}

export async function generateRegisterMetadata({ params }: LocalePageProps) {
  const { locale } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "navigation" });
  return localizedMetadata(locale, "/register", t("register"));
}
