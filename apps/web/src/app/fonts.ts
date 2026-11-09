import { Inter, Montserrat } from "next/font/google";

// Inter is the UI typeface. next/font self-hosts latin + latin-ext at build time
// so Spanish glyphs work with the Cloudflare static export.
export const bodyFont = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

// Montserrat is the brand lockup ("TOP" / "DANCE"), matching the logo spec.
export const headingFont = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "900"],
  variable: "--font-display",
  display: "swap",
});
