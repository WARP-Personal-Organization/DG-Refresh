import {
  formatSubcategoryName,
  slugToSubcategory,
} from "@/app/[catagory]/[subcategory]/types";
import { createClient } from "@/prismicio";
import * as prismic from "@prismicio/client";
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
import type { BlogPostDocument } from "../../../../prismicio-types";
type Params = { subcategory: string };
interface SubCategoryPageProps {
  params: Params;
}

// Updated tags group structure based on new schema
interface TagGroup {
  tag?: string;
  priority?: string;
}

// Helper function to safely render text from RichTextField
import { RichTextField } from "@prismicio/client";

const renderText = (
  richText: RichTextField | string | null | undefined
): string => {
  if (!richText) return "";
  if (typeof richText === "string") return richText;

  if (Array.isArray(richText)) {
    return richText
      .map((block) => ("text" in block ? block.text : ""))
      .join(" ")
      .trim();
  }

  return "";
};

// Helper function to render tags from Group field
const renderTags = (tagsGroup: TagGroup[] | null | undefined): string => {
  if (!tagsGroup || !Array.isArray(tagsGroup)) return "";

  return tagsGroup
    .map((tagItem: TagGroup) => tagItem.tag || "")
    .filter(Boolean)
    .join(", ");
};

// Helper function to format dates
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

// Updated comprehensive mapping for all subcategories

// Updated display name formatting

// Generate static params for all subcategories
export async function generateStaticParams(): Promise<Params[]> {
  const client = createClient();

  try {
    const blogPosts = await client.getAllByType("blog_post");
    const subcategories = new Set<string>();

    blogPosts.forEach((post: BlogPostDocument) => {
      if (post.data.subcategory) {
        subcategories.add(post.data.subcategory);
      }
    });

    const params = Array.from(subcategories).map((subcategory: string) => {
      // Convert subcategory to slug format
      const slug = subcategory.toLowerCase().replace(/\s+/g, "-");
      return { subcategory: slug };
    });

    return params;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [{ subcategory: "local" }, { subcategory: "fact-check-news" }];
  }
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: SubCategoryPageProps): Promise<Metadata> {
  const subcategoryValue = slugToSubcategory(params.subcategory);
  const displayName = formatSubcategoryName(subcategoryValue);

  return {
    title: `${displayName} - Latest Articles | Daily Guardian`,
    description: `Read the latest ${displayName} articles and stay updated with current news and insights from Daily Guardian.`,
    keywords: `${displayName}, news, Daily Guardian, articles, ${subcategoryValue}`,
  };
}

// Enhanced Article Card Component with reading time
const ArticleCard: React.FC<{ article: BlogPostDocument; index: number }> = ({
  article,
  index,
}) => {
  const tags = renderTags(article.data.tags as TagGroup[]);

  return (
    <Link href={`/blog/${article.uid}`} className="block group">
      <article className="bg-black border border-gray-800 hover:border-yellow-500/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10">
        {/* Article Image */}
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

            {/* Article Number Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                #{index + 1}
              </span>
            </div>

            {/* Breaking News Badge */}
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
          {/* Article Title */}
          <h3 className="text-xl font-serif font-bold text-white group-hover:text-yellow-200 transition-colors duration-200 leading-tight">
            {renderText(article.data.title) || "Untitled Article"}
          </h3>

          {/* Article Summary */}
          <p className="text-gray-400 text-sm leading-relaxed">
            {renderText(article.data.summary).substring(0, 150)}...
          </p>

          {/* Article Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <User size={12} className="text-yellow-400" />
                {renderText(article.data.author) || "Staff Reporter"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-yellow-400" />
                {formatDate(article.data.published_date)}
              </span>
              {article.data.reading_time && (
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-yellow-400" />
                  {article.data.reading_time} min
                </span>
              )}
            </div>

            {/* Read More Arrow */}
            <div className="text-yellow-400 group-hover:translate-x-1 transition-transform duration-200">
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

          {/* Tags */}
          {tags && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
              <Tag size={12} className="text-gray-500" />
              <span className="text-xs text-gray-500 truncate">{tags}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

// Featured Article Component
const FeaturedArticle: React.FC<{ article: BlogPostDocument }> = ({
  article,
}) => (
  <Link href={`/blog/${article.uid}`} className="block group">
    <article className="bg-gradient-to-r from-gray-900 to-black border border-yellow-500/30 rounded-lg overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Content Side */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
              Featured Story
            </span>
            <TrendingUp className="text-yellow-400" size={20} />
            {article.data.is_breaking_news && (
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                BREAKING NEWS
              </span>
            )}
          </div>

          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white group-hover:text-yellow-200 transition-colors duration-300 leading-tight">
            {renderText(article.data.title) || "Untitled Article"}
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed">
            {renderText(article.data.summary).substring(0, 200)}...
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <User size={16} className="text-yellow-400" />
              {renderText(article.data.author) || "Staff Reporter"}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-yellow-400" />
              {formatDate(article.data.published_date)}
            </span>
            {article.data.reading_time && (
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-yellow-400" />
                {article.data.reading_time} min read
              </span>
            )}
          </div>

          <div className="pt-4">
            <span className="inline-flex items-center gap-2 text-yellow-400 font-semibold group-hover:gap-3 transition-all duration-200">
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

        {/* Image Side */}
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
}: SubCategoryPageProps) {
  const client = createClient();

  try {
    const subcategoryValue = slugToSubcategory(params.subcategory);
    const displayName = formatSubcategoryName(subcategoryValue);

    // Fetch all blog posts for this subcategory
    const allPosts = await client.getAllByType("blog_post", {
      filters: [
        prismic.filter.at("my.blog_post.subcategory", subcategoryValue),
      ],
      orderings: [{ field: "my.blog_post.published_date", direction: "desc" }],
    });

    if (allPosts.length === 0) {
      notFound();
    }

    // Separate different types of articles
    const featuredArticles = allPosts.filter(
      (post: BlogPostDocument) => post.data.is_featured
    );
    const editorsPicks = allPosts.filter(
      (post: BlogPostDocument) => post.data.editors_pick
    );
    const breakingNews = allPosts.filter(
      (post: BlogPostDocument) => post.data.is_breaking_news
    );
    const regularArticles = allPosts.filter(
      (post: BlogPostDocument) =>
        !post.data.is_featured && !post.data.is_breaking_news
    );

    return (
      <div className="bg-black min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Enhanced Header */}
          <div className="mb-12">
            {/* Back Navigation */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200 mb-6 group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />
              Back to Home
            </Link>

            {/* Page Title */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-serif font-bold text-white">
                {displayName}
              </h1>
              <div className="flex items-center gap-4">
                <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
                <span className="text-lg text-gray-300">
                  {allPosts.length} article{allPosts.length !== 1 ? "s" : ""}{" "}
                  available
                </span>
              </div>
            </div>
          </div>

          {/* Breaking News Banner */}
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
                  {breakingNews.slice(0, 3).map((article: BlogPostDocument) => (
                    <Link
                      key={article.id}
                      href={`/blog/${article.uid}`}
                      className="block text-white hover:text-yellow-200 transition-colors duration-200"
                    >
                      <span className="font-semibold">
                        {renderText(article.data.title)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Featured Article */}
          {featuredArticles.length > 0 && (
            <section className="mb-16">
              <FeaturedArticle article={featuredArticles[0]} />
            </section>
          )}

          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Latest Articles */}
              {regularArticles.length > 0 && (
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-500"></div>
                    <h2 className="text-3xl font-serif font-bold text-white">
                      Latest {displayName} Articles
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {regularArticles.map(
                      (article: BlogPostDocument, index: number) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          index={index}
                        />
                      )
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Editor's Picks */}
                {editorsPicks.length > 0 && (
                  <section className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="text-yellow-400" size={20} />
                      <h3 className="text-xl font-serif font-bold text-white">
                        Editor&apos;s Picks
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {editorsPicks
                        .slice(0, 5)
                        .map((article: BlogPostDocument, index: number) => (
                          <Link
                            key={article.id}
                            href={`/blog/${article.uid}`}
                            className="block group"
                          >
                            <div className="flex gap-4">
                              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold rounded-full flex items-center justify-center text-sm">
                                {index + 1}
                              </span>
                              <div className="space-y-2">
                                <h4 className="text-white group-hover:text-yellow-200 transition-colors text-sm font-semibold leading-tight">
                                  {renderText(article.data.title) ||
                                    "Untitled Article"}
                                </h4>
                                <p className="text-gray-400 text-xs">
                                  {formatDate(article.data.published_date)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </section>
                )}

                {/* Enhanced Category Stats */}
                <section className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-serif font-bold text-white mb-6">
                    {displayName} Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                      <span className="text-gray-300">Total Articles</span>
                      <span className="text-yellow-400 font-bold text-lg">
                        {allPosts.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                      <span className="text-gray-300">Featured Stories</span>
                      <span className="text-yellow-400 font-bold text-lg">
                        {featuredArticles.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                      <span className="text-gray-300">Editor&apos;s Picks</span>
                      <span className="text-yellow-400 font-bold text-lg">
                        {editorsPicks.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                      <span className="text-gray-300">Breaking News</span>
                      <span className="text-red-400 font-bold text-lg">
                        {breakingNews.length}
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching subcategory articles:", error);
    notFound();
  }
}
