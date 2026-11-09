import { courseParams } from "@/lib/static-routes";

export { CourseDetailPage as default, generateMetadata } from "@/features/courses/course-detail-page";

export const dynamicParams = false;
export const generateStaticParams = () => courseParams("es");
