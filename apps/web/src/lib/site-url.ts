const DEFAULT_ORIGIN = "http://localhost:3000";

/** Canonical origin for every absolute SEO URL. Trailing slashes are removed. */
export function siteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_ORIGIN;
  return configured.replace(/\/+$/, "");
}

/** Absolute URL with a trailing slash and no query string or fragment. */
export function absoluteUrl(path: string) {
  const withoutQuery = path.split(/[?#]/, 1)[0] ?? "/";
  const withLeading = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  const withTrailing = withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
  return `${siteOrigin()}${withTrailing}`;
}

/** Turn a site path or an already-absolute asset URL into an absolute URL. */
export function absoluteAsset(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return absoluteUrl(url).replace(/\/$/, "") || absoluteUrl(url);
}
