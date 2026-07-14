import { JetBrains_Mono, Manrope, Space_Grotesk } from "next/font/google";

/**
 * The design system specs Clash Display + Satoshi (Fontshare), which are
 * self-hosted-only fonts we don't have files for yet. Until the .woff2
 * files are dropped into public/fonts/, the `display` and `body` exports
 * below stand in with visually close Google Fonts. JetBrains Mono is the
 * real spec'd typeface already, so `mono` needs no swap.
 *
 * To switch to the real fonts later: drop files into
 * public/fonts/clash-display/ and public/fonts/satoshi/, then replace the
 * two loaders below with next/font/local, e.g.:
 *
 *   import localFont from "next/font/local";
 *
 *   export const display = localFont({
 *     src: [
 *       { path: "../../public/fonts/clash-display/ClashDisplay-Medium.woff2", weight: "500" },
 *       { path: "../../public/fonts/clash-display/ClashDisplay-Semibold.woff2", weight: "600" },
 *     ],
 *     variable: "--font-clash",
 *     display: "swap",
 *   });
 *
 * No other file needs to change — every component reads the `font-display`
 * / `font-body` / `font-mono` Tailwind utilities, not these exports directly.
 */

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Stand-in for Clash Display.
export const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-clash",
  display: "swap",
});

// Stand-in for Satoshi.
export const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-satoshi",
  display: "swap",
});
