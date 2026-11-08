import { defaultLocale } from "@/i18n/routing";
import { LocaleRedirect } from "./locale-redirect";

export default function RootPage() {
  return (
    <>
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=/${defaultLocale}/`} />
      </noscript>
      <LocaleRedirect />
    </>
  );
}
