// app/category/[slug]/CategoryPageComponent.tsx
import { Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../prismicio-types";

interface CategoryPageComponentProps {
  categoryName: string;
  categorySlug: string;
  featuredArticle: BlogPostDocument;
  newsArticles: BlogPostDocument[];
  opinionArticles: BlogPostDocument[];
  recommendedArticles: BlogPostDocument[];
}

// Helper function to safely render text
import { RichTextField } from "@prismicio/client";

const renderText = (richText: RichTextField | string | null): string => {
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

// Helper function to format dates
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "JUST NOW";
    if (diffInHours < 24) return `${diffInHours}H AGO`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}D AGO`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

// Clean article card
const ArticleCard: React.FC<{ article: BlogPostDocument }> = ({ article }) => (
  <Link href={`/blog/${article.uid}`} className="block group">
    <article className="pb-6 border-b border-gray-800/50 last:border-b-0">
      {/* Article Image */}
      {article.data.featured_image?.url && (
        <div className="relative aspect-[16/10] mb-4 overflow-hidden">
          <Image
            src={article.data.featured_image.url}
            alt={article.data.featured_image.alt || "Article image"}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="space-y-3">
        <h3 className="text-lg font-serif font-bold text-white leading-tight group-hover:text-gray-300 transition-colors duration-200">
          {article.data.title || "Untitled Article"}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed">
          {renderText(article.data.summary).substring(0, 120)}...
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-500 pt-2">
          <span>{renderText(article.data.author) || "Staff"}</span>
          <span>•</span>
          <span>{formatDate(article.data.published_date)}</span>
        </div>
      </div>
    </article>
  </Link>
);

const CategoryPageComponent: React.FC<CategoryPageComponentProps> = ({
  categoryName,
  featuredArticle,
  newsArticles,
  opinionArticles,
  recommendedArticles,
}) => {
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Clean Category Header */}
        <div className="mb-12 pb-4 border-b border-gray-800">
          <h1 className="text-4xl font-serif font-bold text-white">
            {categoryName}
          </h1>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Article - Clean Layout */}
            {featuredArticle && (
              <section className="mb-12 pb-8 border-b border-gray-800">
                <Link
                  href={`/blog/${featuredArticle.uid}`}
                  className="block group"
                >
                  <article className="grid md:grid-cols-2 gap-8">
                    {/* Content */}
                    <div className="space-y-4">
                      <div className="text-yellow-500 text-sm font-medium uppercase tracking-wide">
                        Featured
                      </div>

                      <h2 className="text-3xl font-serif font-bold text-white leading-tight group-hover:text-gray-300 transition-colors duration-200">
                        {featuredArticle.data.title || "Untitled Article"}
                      </h2>

                      <p className="text-lg text-gray-400 leading-relaxed">
                        {renderText(featuredArticle.data.summary).substring(
                          0,
                          200
                        )}
                        ...
                      </p>

                      <div className="flex items-center gap-3 text-sm text-gray-500 pt-2">
                        <span>
                          {renderText(featuredArticle.data.author) || "Staff"}
                        </span>
                        <span>•</span>
                        <span>
                          {formatDate(featuredArticle.data.published_date)}
                        </span>
                      </div>
                    </div>

                    {/* Featured Image */}
                    {featuredArticle.data.featured_image?.url && (
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={featuredArticle.data.featured_image.url}
                          alt={
                            featuredArticle.data.featured_image.alt ||
                            "Featured article"
                          }
                          fill
                          className="object-cover group-hover:opacity-90 transition-opacity duration-200"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}
                  </article>
                </Link>
              </section>
            )}

            {/* Latest Articles */}
            {newsArticles.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-serif font-bold text-white mb-6 pb-3 border-b border-gray-800">
                  Latest {categoryName}
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  {newsArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* Related Stories */}
            {opinionArticles.length > 0 && (
              <section>
                <h2 className="text-2xl font-serif font-bold text-white mb-6 pb-3 border-b border-gray-800">
                  Related Stories
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  {opinionArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Clean Sidebar */}
          <div className="lg:col-span-1 border-l border-gray-800 pl-8">
            <div className="sticky top-8">
              {recommendedArticles.length > 0 && (
                <section>
                  <h3 className="text-lg font-serif font-bold text-white mb-6 pb-3 border-b border-gray-800">
                    Recommended
                  </h3>

                  <div className="space-y-6">
                    {recommendedArticles.slice(0, 5).map((article, index) => (
                      <article
                        key={article.id}
                        className="pb-4 border-b border-gray-800/50 last:border-b-0"
                      >
                        <Link
                          href={`/blog/${article.uid}`}
                          className="block group"
                        >
                          <div className="flex gap-3">
                            {/* Number */}
                            <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-black font-bold rounded-full flex items-center justify-center text-xs">
                              {index + 1}
                            </span>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white group-hover:text-gray-300 transition-colors duration-200 text-sm font-semibold leading-tight mb-2">
                                {article.data.title || "Untitled Article"}
                              </h4>

                              <div className="text-xs text-gray-500">
                                {formatDate(article.data.published_date)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Category Stats */}
              <section className="mt-8 pt-6 border-t border-gray-800">
                <h3 className="text-lg font-serif font-bold text-white mb-4">
                  {categoryName} Overview
                </h3>

                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Latest Articles</span>
                    <span className="text-yellow-500 font-medium">
                      {newsArticles.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Related Stories</span>
                    <span className="text-yellow-500 font-medium">
                      {opinionArticles.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recommended</span>
                    <span className="text-yellow-500 font-medium">
                      {recommendedArticles.length}
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
};

export default CategoryPageComponent;
