import AutoRefresh from "@/components/AutoRefresh";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoadingScreen from "@/components/LoadingScreen";
import NavigationBar from "@/components/Navigation";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";
import {
  getAllPosts,
  getLayoutPosts,
  getPostsByCategorySlugs,
  type Post,
} from "../../lib/wordpress";
import "./globals.css";

export const revalidate = 300;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
});

const SITE_URL = "https://dailyguardian.com.ph";

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
    images: [{ url: "/black_dg.png", width: 1200, height: 630, alt: "Daily Guardian" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dailyguardian",
    creator: "@dailyguardian",
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
  const empty = { posts: [] as Post[], total: 0 };
  const [
    posts,
    recentNav,
    sportsNav,
    voicesNav,
    businessNav,
    featuresNav,
    initiativesNav,
  ] = await Promise.all([
    getLayoutPosts().catch(() => [] as Post[]),
    getAllPosts(20).catch(() => [] as Post[]),
    getPostsByCategorySlugs(["sports"], 4).catch(() => empty),
    getPostsByCategorySlugs(["voices", "visons", "opinion"], 4).catch(() => empty),
    getPostsByCategorySlugs(["business", "motoring", "tech-talk"], 4).catch(() => empty),
    getPostsByCategorySlugs(
      ["feature", "features", "entertainment", "lifestyle", "health"],
      4,
    ).catch(() => empty),
    getPostsByCategorySlugs(["initiatives"], 4).catch(() => empty),
  ]);

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
      <head>
        {/* Runs synchronously before React — blocks page on first visit with no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!sessionStorage.getItem('dg_intro'))document.documentElement.classList.add('dg-first-load')}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        {/* Google AdSense — auto ads */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1002683760929339"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FTDWF3L7Z8"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FTDWF3L7Z8');
        `}</Script>
        <LoadingScreen />
        <AutoRefresh intervalMs={300_000} />
        <Header posts={posts} breakingPost={breakingPost} />
        <NavigationBar navPosts={navPosts} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
