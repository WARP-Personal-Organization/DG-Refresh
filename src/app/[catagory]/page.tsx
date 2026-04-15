export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import {
  getPostsByCategorySlugs,
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
  const safeCategory = categorySlug ?? "news";
  try {
    const wpSlugs = getWPSlugsForCategory(categorySlug);
    const result = await getPostsByCategorySlugs(wpSlugs, POSTS_PER_PAGE, page);
    posts = result.posts;
    totalPages = result.totalPages;
  } catch (err) {
    console.error("WP FETCH ERROR:", err);
  }

  if (!posts || posts.length === 0) {
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
        newsArticles={posts}
        opinionArticles={posts}
        recommendedArticles={posts}
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
