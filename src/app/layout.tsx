import AutoRefresh from "@/components/AutoRefresh";
import Footer from "@/components/Footer";
import SiteChrome from "@/components/SiteChrome";
import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

// This layout deliberately declares no `revalidate` and fetches nothing.
//
// Next.js takes the LOWEST revalidate across a route's whole layout+page tree,
// and this layout wraps every route — so any value here becomes a ceiling on
// every page in the app. At 1800 it silently held /blog/[uid] to 30 minutes
// despite that route asking for 24h, which across ~75,000 articles was the
// dominant remaining source of billed ISR writes. Raising the number would
// only have moved the ceiling; removing the fetches removes it altogether.
//
// The header/nav data those fetches produced now comes from /api/nav-data,
// requested client-side by SiteChrome and cached at the edge, so it is shared
// across readers instead of forcing a page regeneration per article.
//
// Do not add `export const revalidate` or a server-side fetch to this file.
// Either one silently re-caps every route in the app.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const SITE_URL = "https://www.dailyguardian.com.ph";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Daily Guardian | We Write, You Decide",
    template: "%s | Daily Guardian",
  },
  description:
    "Daily Guardian is Western Visayas' leading news publication. Get the latest local, national, and international news, opinion, sports, and more.",
  keywords: ["Daily Guardian", "Western Visayas news", "Iloilo news", "Philippines news", "DG"],
  authors: [{ name: "Daily Guardian", url: SITE_URL }],
  creator: "Daily Guardian",
  publisher: "Daily Guardian",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    siteName: "Daily Guardian",
    title: "Daily Guardian | We Write, You Decide",
    description:
      "Daily Guardian is Western Visayas' leading news publication. Get the latest local, national, and international news.",
    url: SITE_URL,
    images: [{ url: "/black_dg.png", width: 536, height: 128, alt: "Daily Guardian" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dailyguardianph",
    creator: "@dailyguardianph",
    title: "Daily Guardian | We Write, You Decide",
    description: "Daily Guardian is Western Visayas' leading news publication.",
    images: ["/black_dg.png"],
  },
  icons: {
    icon: "/DG-Symbol-Black-1-300x300-1.png",
    apple: "/DG-Symbol-Black-1-300x300-1.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${playfair.variable} antialiased`}
      >
        {/* AnyMind360 — programmatic ad partner */}
        <Script
          src="//anymind360.com/js/8074/ats.js"
          strategy="lazyOnload"
        />
        {/* Google AdSense — auto ads */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          data-ad-client="ca-pub-1002683760929339"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <GoogleAnalytics gaId="G-SQ61FCPRV9" />
        <AutoRefresh intervalMs={300_000} />
        <SiteChrome />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
