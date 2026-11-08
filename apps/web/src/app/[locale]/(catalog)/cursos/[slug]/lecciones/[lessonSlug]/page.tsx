import { lessonParams } from "@/lib/static-routes";

export { LessonPlayerPage as default, generateMetadata } from "@/features/lessons/lesson-player-page";

export const dynamicParams = false;
export const generateStaticParams = () => lessonParams("es");
