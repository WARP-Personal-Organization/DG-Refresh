export const revalidate = 300;

import { notFound, redirect } from "next/navigation";
import {
  getAppCategorySlugs,
  getPostsByCategorySlugs,
  getPostBySlug,
  getWPSlugsForCategory,
} from "../../../lib/wordpress";
import PaginatedCategoryContent from "../../components/PaginatedCategoryContent";

type Props = {
  params: Promise<{ catagory: string }>;
};

const POSTS_PER_PAGE = 6;

export default async function CategoryPage({ params }: Props) {
  const categorySlug = (await params).catagory;

  // Server render always fetches page 1 — pagination beyond that is handled
  // client-side (see PaginatedCategoryContent) so this page stays a plain
  // ISR-cached static render instead of force-dynamic.
  let posts: Awaited<ReturnType<typeof getPostsByCategorySlugs>>["posts"] = [];
  let totalPages = 1;
  let recommendedPosts: Awaited<ReturnType<typeof getPostsByCategorySlugs>>["posts"] = [];
  const safeCategory = categorySlug ?? "news";
  try {
    const wpSlugs = getWPSlugsForCategory(categorySlug);
    const mainResult = await getPostsByCategorySlugs(wpSlugs, POSTS_PER_PAGE, 1);
    posts = mainResult.posts;
    totalPages = mainResult.totalPages;

    const mainIds = new Set(posts.map((p) => p.id));
    if (totalPages > 1) {
      const sidebarResult = await getPostsByCategorySlugs(wpSlugs, 5, 2);
      recommendedPosts = sidebarResult.posts.filter((p) => !mainIds.has(p.id)).slice(0, 5);
    }
  } catch (err) {
    console.error("WP FETCH ERROR:", err);
  }

  if (!posts || posts.length === 0) {
    let post = null;
    try {
      post = await getPostBySlug(categorySlug);
    } catch {
      // WP API unreachable — treat as no matching post
    }
    if (post) {
      redirect(`/blog/${categorySlug}`);
    }
    notFound();
  }

  return (
    <div className="font-open-sans">
      <PaginatedCategoryContent
        categorySlug={safeCategory}
        categoryName={safeCategory.charAt(0).toUpperCase() + safeCategory.slice(1)}
        basePath={`/${safeCategory}`}
        initialFeaturedArticle={posts[0]}
        initialNewsArticles={posts.slice(1)}
        initialRecommendedArticles={recommendedPosts}
        initialTotalPages={totalPages}
      />
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const categoryName =
    resolvedParams.catagory.charAt(0).toUpperCase() +
    resolvedParams.catagory.slice(1);
  const url = `https://dailyguardian.com.ph/${resolvedParams.catagory}`;
  const description = `Read the latest ${categoryName.toLowerCase()} articles and news from Daily Guardian — Western Visayas' leading news publication.`;

  return {
    title: `${categoryName} News`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${categoryName} News | Daily Guardian`,
      description,
      siteName: "Daily Guardian",
      images: [{ url: "/black_dg.png", width: 1200, height: 630, alt: "Daily Guardian" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryName} News | Daily Guardian`,
      description,
      images: ["/black_dg.png"],
    },
  };
}

export async function generateStaticParams() {
  return getAppCategorySlugs().map((catagory) => ({ catagory }));
}
