export const revalidate = 300; // ISR: rebuild at most every 5 minutes

import { notFound } from "next/navigation";
import CategoryPageComponent from "../../components/CategoryPage";
import Pagination from "../../components/Pagination";
import { getPostsByCategorySlugs, getWPSlugsForCategory } from "../../../lib/wordpress";

type Props = {
  params: Promise<{ catagory: string }>;
  searchParams: Promise<{ page?: string }>;
};

const POSTS_PER_PAGE = 20;

export default async function CategoryPage({ params, searchParams }: Props) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);
  const categorySlug = resolvedParams.catagory;
  const page = Math.max(1, parseInt(resolvedSearch.page ?? "1", 10) || 1);

  const wpSlugs = getWPSlugsForCategory(categorySlug);
  const { posts, totalPages } = await getPostsByCategorySlugs(wpSlugs, POSTS_PER_PAGE, page);

  if (!posts || posts.length === 0) {
    notFound();
  }

  return (
    <div className="font-open-sans">
      <CategoryPageComponent
        categoryName={categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}
        categorySlug={categorySlug}
        featuredArticle={posts[0]}
        newsArticles={posts}
        opinionArticles={posts}
        recommendedArticles={posts}
      />
      <div className="max-w-7xl mx-auto px-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/${categorySlug}`}
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
