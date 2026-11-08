import type { Locale } from "@/i18n/routing";

// Placeholder segment pre-rendered for every dynamic route. Cloudflare Pages
// rewrites unknown slugs to this shell (see public/_redirects) and the page
// reads the real slug from the URL on the client.
export const SHELL_SEGMENT = "_";

// Extension point: return published course slugs at build time (e.g. from the
// Rails API) to pre-render them. Until the catalog exists, only the shell is built.
export async function getPrebuiltCourseSlugs(): Promise<string[]> {
  return [];
}

export async function courseParams(locale: Locale) {
  const slugs = [SHELL_SEGMENT, ...(await getPrebuiltCourseSlugs())];
  return slugs.map((slug) => ({ locale, slug }));
}

export async function lessonParams(locale: Locale) {
  return [{ locale, slug: SHELL_SEGMENT, lessonSlug: SHELL_SEGMENT }];
}
