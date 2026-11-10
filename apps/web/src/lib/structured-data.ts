import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl, siteOrigin } from "@/lib/site-url";

type CourseSeo = {
  title: string;
  description?: string | null;
  slug: string;
};

export function organizationAndWebsite(locale: Locale, homeName: string, description: string) {
  const origin = `${siteOrigin()}/`;
  const home = absoluteUrl(getPathname({ locale, href: "/" }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Top Dance",
        url: origin,
      },
      {
        "@type": "WebSite",
        name: homeName,
        url: home,
        description,
        inLanguage: locale,
        publisher: { "@type": "Organization", name: "Top Dance", url: origin },
      },
    ],
  };
}

export function courseStructuredData({
  locale,
  course,
  homeName,
  coursesName,
}: {
  locale: Locale;
  course: CourseSeo;
  homeName: string;
  coursesName: string;
}) {
  const origin = `${siteOrigin()}/`;
  const home = absoluteUrl(getPathname({ locale, href: "/" }));
  const courses = absoluteUrl(getPathname({ locale, href: "/courses" }));
  const page = absoluteUrl(
    getPathname({ locale, href: { pathname: "/courses/[slug]", params: { slug: course.slug } } }),
  );
  const description = course.description?.trim() || course.title;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: homeName, item: home },
          { "@type": "ListItem", position: 2, name: coursesName, item: courses },
          { "@type": "ListItem", position: 3, name: course.title, item: page },
        ],
      },
      {
        "@type": "Course",
        name: course.title,
        description,
        url: page,
        inLanguage: locale,
        provider: { "@type": "Organization", name: "Top Dance", url: origin },
      },
    ],
  };
}
