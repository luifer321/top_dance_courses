import { singleLocaleParams } from "@/i18n/static-params";

export { ForgotPasswordPage as default, generateForgotPasswordMetadata as generateMetadata } from "@/features/auth/auth-page";

export const dynamicParams = false;
export const generateStaticParams = () => singleLocaleParams("es");
