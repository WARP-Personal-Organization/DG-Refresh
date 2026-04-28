export const dynamic = 'force-dynamic';

import { notFound, redirect } from "next/navigation";
import {
  getPostsByCategorySlugs,
  getPostBySlug,
  getWPSlugsForCategory,
} from "../../../lib/wordpress";
import CategoryPageComponent from "../../components/CategoryPage";
import Pagination from "../../components/Pagination";

type Props = {
  params: Promise<{ catagory: string }>;
  searchParams: Promise<{ page?: string }>;
};

const POSTS_PER_PAGE = 6;

export default async function CategoryPage({ params, searchParams }: Props) {
  const categorySlug = (await params).catagory;
  const page = Math.max(1, parseInt((await searchParams).page ?? "1", 10) || 1);

  let posts: Awaited<ReturnType<typeof getPostsByCategorySlugs>>["posts"] = [];
  let totalPages = 1;
  let recommendedPosts: Awaited<ReturnType<typeof getPostsByCategorySlugs>>["posts"] = [];
  const safeCategory = categorySlug ?? "news";
  try {
    const wpSlugs = getWPSlugsForCategory(categorySlug);
    const mainResult = await getPostsByCategorySlugs(wpSlugs, POSTS_PER_PAGE, page);
    posts = mainResult.posts;
    totalPages = mainResult.totalPages;

    // Fetch adjacent page for sidebar so recommended articles don't overlap main content
    const mainIds = new Set(posts.map((p) => p.id));
    const sidebarPage = page < totalPages ? page + 1 : totalPages > 1 ? page - 1 : 0;
    if (sidebarPage > 0) {
      const sidebarResult = await getPostsByCategorySlugs(wpSlugs, 5, sidebarPage);
      recommendedPosts = sidebarResult.posts.filter((p) => !mainIds.has(p.id)).slice(0, 5);
    }
  } catch (err) {
    console.error("WP FETCH ERROR:", err);
  }

  if (!posts || posts.length === 0) {
    const post = await getPostBySlug(categorySlug);
    if (post) {
      redirect(`/blog/${categorySlug}`);
    }
    notFound();
  }

  return (
    <div className="font-open-sans">
      <CategoryPageComponent
        categoryName={
          safeCategory.charAt(0).toUpperCase() + safeCategory.slice(1)
        }
        categorySlug={safeCategory}
        featuredArticle={posts[0]}
        newsArticles={posts.slice(1)}
        opinionArticles={[]}
        recommendedArticles={recommendedPosts}
      />
      <div className="max-w-7xl mx-auto px-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/${safeCategory}`}
        />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const categoryName =
    resolvedParams.catagory.charAt(0).toUpperCase() +
    resolvedParams.catagory.slice(1);

  return {
    title: `${categoryName} Articles | Daily Guardian`,
    description: `Read the latest ${categoryName.toLowerCase()} articles and news from Daily Guardian.`,
    keywords: `${categoryName}, news, articles, Daily Guardian, ${resolvedParams.catagory}`,
  };
}

export async function generateStaticParams() {
  return [];
}
