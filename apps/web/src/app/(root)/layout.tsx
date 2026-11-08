import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";

export const metadata: Metadata = {
  title: "Top Dance Academy",
  robots: { index: false },
};

// Only used by "/", which immediately redirects to a localized route.
export default function RootRedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body>{children}</body>
    </html>
  );
}
