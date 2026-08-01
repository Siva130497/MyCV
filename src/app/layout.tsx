import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/providers/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import Preloader from "@/components/ui/Preloader";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { person, siteMeta, socials } from "@/data/site";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: siteMeta.title,
    template: `%s — ${person.fullName}`,
  },
  description: siteMeta.description,
  keywords: [...siteMeta.keywords],
  authors: [{ name: person.fullName, url: siteMeta.url }],
  creator: person.fullName,
  openGraph: {
    type: "profile",
    locale: "en_GB",
    url: siteMeta.url,
    siteName: siteMeta.title,
    title: siteMeta.title,
    description: siteMeta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
  ],
  colorScheme: "light dark",
};

/** Structured data so search engines read the CV, not just the copy. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.fullName,
  jobTitle: person.role,
  email: `mailto:${person.email}`,
  telephone: person.phone,
  url: siteMeta.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: person.location,
    addressCountry: "GB",
  },
  worksFor: {
    "@type": "Organization",
    name: person.company,
  },
  sameAs: socials
    .filter((s) => s.href.startsWith("http"))
    .map((s) => s.href),
  knowsAbout: [
    "Artificial intelligence",
    "LLM orchestration",
    "Multi-agent systems",
    "LangGraph",
    "AI safety",
    "Model Context Protocol",
    "TypeScript",
    "Python",
    "Rust",
    "React",
    "Next.js",
    "PostgreSQL",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`no-js ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Resolves the theme and drops the no-JS fallback before first paint:
            no flash of the wrong palette, and masked text can start hidden
            whenever scripting is available. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="flex min-h-svh flex-col">
        <Preloader />
        <Cursor />
        <div className="grain" aria-hidden />

        <SmoothScroll>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
