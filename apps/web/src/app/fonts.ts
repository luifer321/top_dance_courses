import { Manrope, Playfair_Display } from "next/font/google";

// next/font self-hosts the files at build time, so they work with static export.
export const bodyFont = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

export const displayFont = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});
