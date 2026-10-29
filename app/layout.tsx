import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowJourneyProvider } from "@/components/journey/arrow-journey";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";
const displayFont = localFont({ src: "../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2", variable: "--loaded-display", weight: "300 700", display: "swap" });
const bodyFont = localFont({ src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2", variable: "--loaded-body", weight: "200 800", display: "swap" });
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "FetchUp | Higher Together", template: "%s | FetchUp" },
  description: "Thoughtful software. Shared progress. FetchUp designs and develops websites, mobile applications and custom software that help businesses move forward.",
  openGraph: { siteName: "FetchUp", type: "website", locale: "en_GB", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "FetchUp — Higher Together" }] },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/brand/favicon.png", apple: "/brand/favicon.png" },
};
export const viewport: Viewport = { themeColor: "#080F25", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}><body><ArrowJourneyProvider>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header /><main id="main-content" tabIndex={-1}>{children}</main><Footer />
  </ArrowJourneyProvider></body></html>;
}
