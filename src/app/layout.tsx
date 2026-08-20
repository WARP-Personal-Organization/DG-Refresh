import AutoRefresh from "@/components/AutoRefresh";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NavigationBar from "@/components/Navigation";
import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  getAllPosts,
  getLayoutPosts,
  getPostsByCategorySlugs,
  type Post,
} from "../../lib/wordpress";
import { withConcurrencyLimit } from "../../lib/concurrency";
import "./globals.css";

export const revalidate = 300;

const EMPTY_CATEGORY_RESULT = { posts: [] as Post[], total: 0 };

// Caps concurrent requests to the WordPress origin — this fetch set runs on
// nearly every page render (root layout), same rationale as page.tsx.
const WP_FETCH_CONCURRENCY = 4;

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    posts,
    recentNav,
    sportsNav,
    voicesNav,
    businessNav,
    featuresNav,
    initiativesNav,
  ] = await withConcurrencyLimit(
    [
      () => getLayoutPosts().catch(() => [] as Post[]),
      () => getAllPosts(20).catch(() => [] as Post[]),
      () => getPostsByCategorySlugs(["sports"], 4).catch(() => EMPTY_CATEGORY_RESULT),
      () =>
        getPostsByCategorySlugs(["voices", "visons", "opinion"], 4).catch(
          () => EMPTY_CATEGORY_RESULT,
        ),
      () =>
        getPostsByCategorySlugs(["business", "motoring", "tech-talk"], 4).catch(
          () => EMPTY_CATEGORY_RESULT,
        ),
      () =>
        getPostsByCategorySlugs(
          ["feature", "features", "entertainment", "lifestyle", "health"],
          4,
        ).catch(() => EMPTY_CATEGORY_RESULT),
      () => getPostsByCategorySlugs(["initiatives"], 4).catch(() => EMPTY_CATEGORY_RESULT),
    ],
    WP_FETCH_CONCURRENCY,
  );

  // Merge all nav posts, deduplicated — each category is guaranteed representation
  const navPosts = [
    ...recentNav,
    ...sportsNav.posts,
    ...voicesNav.posts,
    ...businessNav.posts,
    ...featuresNav.posts,
    ...initiativesNav.posts,
  ].filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);

  // Latest local+featured post for breaking news, fallback to any featured
  const breakingPost =
    posts.find((p) => p.data.subcategory === "local" && p.data.is_featured) ||
    posts.find((p) => p.data.is_featured) ||
    posts[0] ||
    null;

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
        <Header posts={posts} breakingPost={breakingPost} />
        <NavigationBar navPosts={navPosts} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
