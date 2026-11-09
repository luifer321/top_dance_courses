import { singleLocaleParams } from "@/i18n/static-params";

export { ProfilePage as default, generateMetadata } from "@/features/profile/profile-page";

export const dynamicParams = false;
export const generateStaticParams = () => singleLocaleParams("es");
