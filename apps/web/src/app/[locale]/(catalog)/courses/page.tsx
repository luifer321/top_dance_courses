import { singleLocaleParams } from "@/i18n/static-params";

export { CourseCatalogPage as default, generateMetadata } from "@/features/courses/course-catalog-page";

export const dynamicParams = false;
export const generateStaticParams = () => singleLocaleParams("en");
