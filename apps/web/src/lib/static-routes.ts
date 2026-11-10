import type { Locale } from "@/i18n/routing";

// Placeholder segment pre-rendered for every dynamic route. Cloudflare Pages
// rewrites unknown slugs to this shell (see public/_redirects) and the page
// reads the real slug from the URL on the client.
export const SHELL_SEGMENT = "_";

export type CatalogCourse = {
  slug: string;
  title: string;
  description?: string | null;
  content_locale: string;
  localized_slugs?: Record<string, string>;
  cover_image_url?: string | null;
  modules?: { lessons?: { slug: string }[] }[];
};

function apiOrigin() {
  return (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/+$/, "");
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${apiOrigin()}${path}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchCatalog(locale: Locale): Promise<CatalogCourse[]> {
  const data = await fetchJson<{ courses: CatalogCourse[] }>(`/api/v1/courses?locale=${locale}`);
  return data?.courses ?? [];
}

export async function fetchCourse(locale: Locale, slug: string): Promise<CatalogCourse | null> {
  if (!slug || slug === SHELL_SEGMENT) return null;
  const data = await fetchJson<{ course: CatalogCourse }>(
    `/api/v1/courses/${encodeURIComponent(slug)}?locale=${locale}`,
  );
  return data?.course ?? null;
}

export async function getPrebuiltCourseSlugs(locale: Locale): Promise<string[]> {
  const courses = await fetchCatalog(locale);
  return [...new Set(courses.map((course) => course.slug).filter(Boolean))];
}

export async function getPrebuiltLessons(locale: Locale): Promise<{ slug: string; lessonSlug: string }[]> {
  const slugs = await getPrebuiltCourseSlugs(locale);
  const pairs: { slug: string; lessonSlug: string }[] = [];

  for (const slug of slugs) {
    const course = await fetchCourse(locale, slug);
    for (const mod of course?.modules ?? []) {
      for (const lesson of mod.lessons ?? []) {
        if (lesson.slug) pairs.push({ slug, lessonSlug: lesson.slug });
      }
    }
  }

  return pairs;
}

export async function courseParams(locale: Locale) {
  const slugs = [SHELL_SEGMENT, ...(await getPrebuiltCourseSlugs(locale))];
  return slugs.map((slug) => ({ locale, slug }));
}

export async function lessonParams(locale: Locale) {
  const lessons = await getPrebuiltLessons(locale);
  return [
    { locale, slug: SHELL_SEGMENT, lessonSlug: SHELL_SEGMENT },
    ...lessons.map((row) => ({ locale, ...row })),
  ];
}
