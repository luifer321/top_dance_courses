import { describe, expect, it } from "vitest";
import { courseLocaleHrefs, lessonLocaleHrefs, publishedCourseHrefs } from "./locale-hrefs";

describe("locale hrefs", () => {
  it("points each published course translation at its own slug", () => {
    expect(courseLocaleHrefs({ es: "salsa-basica", en: "basic-salsa" })).toEqual({
      es: { pathname: "/courses/[slug]", params: { slug: "salsa-basica" } },
      en: { pathname: "/courses/[slug]", params: { slug: "basic-salsa" } },
    });
  });

  it("sends a missing course translation to that language's catalog", () => {
    expect(courseLocaleHrefs({ es: "salsa-basica" })?.en).toBe("/courses");
    expect(publishedCourseHrefs({ es: "salsa-basica" })).toEqual({
      es: { pathname: "/courses/[slug]", params: { slug: "salsa-basica" } },
    });
  });

  it("keeps a translated lesson on the translated course and lesson slugs", () => {
    expect(
      lessonLocaleHrefs(
        { es: "salsa-basica", en: "basic-salsa" },
        { es: "paso-basico", en: "basic-step" },
      ),
    ).toEqual({
      es: {
        pathname: "/courses/[slug]/lessons/[lessonSlug]",
        params: { slug: "salsa-basica", lessonSlug: "paso-basico" },
      },
      en: {
        pathname: "/courses/[slug]/lessons/[lessonSlug]",
        params: { slug: "basic-salsa", lessonSlug: "basic-step" },
      },
    });
  });

  it("sends a missing lesson translation to that language's course", () => {
    expect(lessonLocaleHrefs({ es: "salsa-basica", en: "basic-salsa" }, { es: "paso-basico" })?.en).toEqual({
      pathname: "/courses/[slug]",
      params: { slug: "basic-salsa" },
    });
    expect(lessonLocaleHrefs({ es: "salsa-basica" }, { es: "paso-basico" })?.en).toBe("/courses");
  });
});
