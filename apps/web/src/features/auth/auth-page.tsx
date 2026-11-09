import { Suspense, type ReactNode } from "react";
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
import { ForgotPasswordForm } from "./password-forms";
import { ResetPasswordPageClient } from "./reset-password-page";

async function AuthPage({ params, mode }: LocalePageProps & { mode: "login" | "register" }) {
  await enablePageLocale(params);
  const t = await getTranslations("auth");
  const tNav = await getTranslations("navigation");
  const isLogin = mode === "login";

  return (
    <div className="flex min-h-[calc(100dvh-12rem)] items-center justify-center py-8">
      <Card className="w-full max-w-[24rem] gap-6 py-8 ring-1 ring-white/10">
        <CardHeader className="px-8">
          <CardTitle className="text-xl text-white">
            {isLogin ? t("loginTitle") : t("registerTitle")}
          </CardTitle>
          <CardDescription className="text-[13px] leading-relaxed">
            {isLogin ? t("loginSubtitle") : t("registerSubtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <AuthForm mode={mode} />
        </CardContent>
        <CardFooter className="justify-center gap-1 border-t-0 bg-transparent px-8 pt-0 text-sm text-muted-foreground">
          {isLogin ? t("noAccount") : t("haveAccount")}
          <Link
            href={isLogin ? "/register" : "/login"}
            className="font-medium text-purple-bright underline-offset-4 hover:underline"
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

async function PasswordCard({
  params,
  title,
  subtitle,
  children,
}: LocalePageProps & { title: string; subtitle: string; children: ReactNode }) {
  await enablePageLocale(params);
  const tNav = await getTranslations("navigation");

  return (
    <div className="flex min-h-[calc(100dvh-12rem)] items-center justify-center py-8">
      <Card className="w-full max-w-[24rem] gap-6 py-8 ring-1 ring-white/10">
        <CardHeader className="px-8">
          <CardTitle className="text-xl text-white">{title}</CardTitle>
          <CardDescription className="text-[13px] leading-relaxed">{subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="px-8">{children}</CardContent>
        <CardFooter className="justify-center gap-1 border-t-0 bg-transparent px-8 pt-0 text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-purple-bright underline-offset-4 hover:underline">
            {tNav("login")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export async function ForgotPasswordPage({ params }: LocalePageProps) {
  await enablePageLocale(params);
  const t = await getTranslations("auth");
  return (
    <PasswordCard params={params} title={t("forgotTitle")} subtitle={t("forgotSubtitle")}>
      <ForgotPasswordForm />
    </PasswordCard>
  );
}

export async function ResetPasswordPage({ params }: LocalePageProps) {
  await enablePageLocale(params);
  const t = await getTranslations("auth");
  return (
    <PasswordCard params={params} title={t("resetTitle")} subtitle={t("resetSubtitle")}>
      <Suspense>
          <ResetPasswordPageClient />
        </Suspense>
    </PasswordCard>
  );
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

export async function generateForgotPasswordMetadata({ params }: LocalePageProps) {
  const { locale } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "auth" });
  return localizedMetadata(locale, "/forgot-password", t("forgotTitle"));
}

export async function generateResetPasswordMetadata({ params }: LocalePageProps) {
  const { locale } = await enablePageLocale(params);
  const t = await getTranslations({ locale, namespace: "auth" });
  return { ...(await localizedMetadata(locale, "/reset-password", t("resetTitle"))), robots: { index: false } };
}
