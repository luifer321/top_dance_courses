import { singleLocaleParams } from "@/i18n/static-params";

export { LoginPage as default, generateLoginMetadata as generateMetadata } from "@/features/auth/auth-page";

export const dynamicParams = false;
export const generateStaticParams = () => singleLocaleParams("es");
