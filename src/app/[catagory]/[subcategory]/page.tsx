export const revalidate = 300; // ISR: rebuild at most every 5 minutes
export const maxDuration = 30;

import {
  formatSubcategoryName,
  slugToSubcategory,
} from "@/app/[catagory]/[subcategory]/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  TrendingUp,
  User,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByCategorySlugs, getWPSlugsForSubcategory } from "../../../../lib/wordpress";
import type { Post } from "../../../../lib/wordpress";
import Pagination from "../../../components/Pagination";

const POSTS_PER_PAGE = 20;

type Params = Promise<{ catagory: string; subcategory: string }>;
interface SubCategoryPageProps {
  params: Params;
  searchParams: Promise<{ page?: string }>;
}

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

export async function generateStaticParams(): Promise<
  { subcategory: string }[]
> {
  return [];
}

export async function generateMetadata({
  params,
}: SubCategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const subcategoryValue = slugToSubcategory(resolvedParams.subcategory);
  const displayName = formatSubcategoryName(subcategoryValue);

  return {
    title: `${displayName} - Latest Articles | Daily Guardian`,
    description: `Read the latest ${displayName} articles from Daily Guardian.`,
    keywords: `${displayName}, news, Daily Guardian, ${subcategoryValue}`,
  };
}

const ArticleCard: React.FC<{ article: Post; index: number }> = ({
  article,
}) => {
  const tags = article.data.tags.join(", ");

  return (
    <Link href={`/blog/${article.uid}`} className="block group">
      <article className="bg-[#1b1a1b] border border-default hover:border-[#fcee16]/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#fcee16]/10">
        {article.data.featured_image?.url && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={article.data.featured_image.url}
              alt={article.data.featured_image.alt || "Article image"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            {article.data.is_breaking_news && (
              <div className="absolute top-4 right-4">
                <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                  BREAKING
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-6 space-y-4">
          <h3 className="text-xl font-roboto font-bold text-white group-hover:text-[#fcee16] transition-colors duration-200 leading-tight">
            {article.data.title || "Untitled Article"}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed">
            {(article.data.summary || "").substring(0, 150)}...
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <User size={12} className="text-[#fcee16]" />
                {article.data.author || "Staff Reporter"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-[#fcee16]" />
                {formatDate(article.data.published_date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-[#fcee16]" />
                {article.data.reading_time} min
              </span>
            </div>

            <div className="text-[#fcee16] group-hover:translate-x-1 transition-transform duration-200">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {tags && (
            <div className="flex items-center gap-2 pt-2 border-t border-default">
              <Tag size={12} className="text-gray-500" />
              <span className="text-xs text-gray-500 truncate">{tags}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

const FeaturedArticle: React.FC<{ article: Post }> = ({ article }) => (
  <Link href={`/blog/${article.uid}`} className="block group">
    <article className="bg-gradient-to-r from-[#1b1a1b] to-black border border-[#fcee16]/30 rounded-lg overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <span className="inline-block bg-[#fcee16] text-[#1b1a1b] px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
              Featured Story
            </span>
            <TrendingUp className="text-[#fcee16]" size={20} />
            {article.data.is_breaking_news && (
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                BREAKING NEWS
              </span>
            )}
          </div>

          <h2 className="text-3xl lg:text-4xl font-roboto font-bold text-white group-hover:text-[#fcee16] transition-colors duration-300 leading-tight">
            {article.data.title || "Untitled Article"}
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed">
            {(article.data.summary || "").substring(0, 200)}...
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <User size={16} className="text-[#fcee16]" />
              {article.data.author || "Staff Reporter"}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-[#fcee16]" />
              {formatDate(article.data.published_date)}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-[#fcee16]" />
              {article.data.reading_time} min read
            </span>
          </div>

          <div className="pt-4">
            <span className="inline-flex items-center gap-2 text-[#fcee16] font-semibold group-hover:gap-3 transition-all duration-200">
              Read Full Story
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </div>
        </div>

        {article.data.featured_image?.url && (
          <div className="relative lg:aspect-auto aspect-[16/10] min-h-[300px]">
            <Image
              src={article.data.featured_image.url}
              alt={article.data.featured_image.alt || "Featured article"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/20"></div>
          </div>
        )}
      </div>
    </article>
  </Link>
);

export default async function SubCategoryPage({
  params,
  searchParams,
}: SubCategoryPageProps) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams]);
  const subcategoryValue = slugToSubcategory(resolvedParams.subcategory);
  const displayName = formatSubcategoryName(subcategoryValue);
  const page = Math.max(1, parseInt(resolvedSearch.page ?? "1", 10) || 1);

  let posts: Post[] = [];
  let totalPages = 1;

  try {
    const wpSlugs = getWPSlugsForSubcategory(subcategoryValue);
    const result = await getPostsByCategorySlugs(wpSlugs, POSTS_PER_PAGE, page);
    posts = result.posts;
    totalPages = result.totalPages;
  } catch (error) {
    console.error("Error fetching subcategory articles:", error);
  }

  if (posts.length === 0) {
    notFound();
  }

  const featuredArticles = posts.filter((p) => p.data.is_featured);
  const breakingNews = posts.filter((p) => p.data.is_breaking_news);
  const regularArticles = posts.filter(
    (p) => !p.data.is_featured && !p.data.is_breaking_news
  );

  return (
    <div className="bg-[#1b1a1b] min-h-screen text-white font-open-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#fcee16] transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            Back to Home
          </Link>

          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-roboto font-bold text-white">
              {displayName}
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-1 w-24 bg-[#fcee16]"></div>
            </div>
          </div>
        </div>

        {breakingNews.length > 0 && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-red-600 to-red-800 border border-red-500 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-bold text-lg uppercase tracking-wider">
                  Breaking News
                </span>
              </div>
              <div className="space-y-2">
                {breakingNews.slice(0, 3).map((article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.uid}`}
                    className="block text-white hover:text-[#fcee16] transition-colors duration-200"
                  >
                    <span className="font-semibold">{article.data.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {featuredArticles.length > 0 && (
          <section className="mb-16">
            <FeaturedArticle article={featuredArticles[0]} />
          </section>
        )}

        <div className="grid lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 space-y-12">
            {regularArticles.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-8 bg-[#fcee16]"></div>
                  <h2 className="text-3xl font-roboto font-bold text-white">
                    Latest {displayName} Articles
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {regularArticles.map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            )}

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/${resolvedParams.catagory}/${resolvedParams.subcategory}`}
            />
          </div>

          <div className="lg:col-span-1"></div>
        </div>
      </div>
    </div>
  );
}
