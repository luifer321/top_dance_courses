import { singleLocaleParams } from "@/i18n/static-params";

export { RegisterPage as default, generateRegisterMetadata as generateMetadata } from "@/features/auth/auth-page";

export const dynamicParams = false;
export const generateStaticParams = () => singleLocaleParams("en");
