import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { enablePageLocale, type LocalePageProps } from "@/i18n/page-locale";
import { publishedCourseHrefs, publishedLocaleSlugs } from "@/lib/locale-hrefs";
import { pageMetadata, type MetadataHref } from "@/lib/metadata";
import { courseStructuredData } from "@/lib/structured-data";
import { fetchCourse, SHELL_SEGMENT } from "@/lib/static-routes";
import { CourseDetailClient } from "./course-detail-client";

type Params = { locale: string; slug: string };

export async function generateMetadata({ params }: LocalePageProps<Params>) {
  const { locale, slug } = await enablePageLocale(params);
  const meta = await getTranslations({ locale, namespace: "metadata" });
  const courses = await getTranslations({ locale, namespace: "courses" });

  if (slug === SHELL_SEGMENT) {
    return pageMetadata({
      locale,
      title: meta("coursesTitle"),
      description: meta("coursesDescription"),
      href: { pathname: "/courses/[slug]", params: { slug } },
      index: false,
    });
  }

  const course = await fetchCourse(locale, slug);
  const published = publishedLocaleSlugs(course?.localized_slugs);
  const indexable = Boolean(course && published[locale]);
  const publicSlug = published[locale] ?? slug;
  const href: MetadataHref = { pathname: "/courses/[slug]", params: { slug: publicSlug } };
  const languages = indexable ? publishedCourseHrefs(published) : undefined;

  return pageMetadata({
    locale,
    title: course?.title ? `${course.title} | Top Dance` : courses("detailTitle"),
    description: course?.description?.trim() || course?.title || meta("coursesDescription"),
    href,
    index: indexable,
    languages,
    image: indexable ? course?.cover_image_url : undefined,
  });
}

export async function CourseDetailPage({ params }: LocalePageProps<Params>) {
  const { locale, slug } = await enablePageLocale(params);
  const course = await fetchCourse(locale, slug);
  const published = publishedLocaleSlugs(course?.localized_slugs);
  const nav = await getTranslations("navigation");
  const structured =
    course && published[locale]
      ? courseStructuredData({
          locale,
          course: { title: course.title, description: course.description, slug: published[locale]! },
          homeName: nav("home"),
          coursesName: nav("courses"),
        })
      : null;

  return (
    <>
      {structured ? <JsonLd data={structured} /> : null}
      <CourseDetailClient />
    </>
  );
}
