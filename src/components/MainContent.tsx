import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../prismicio-types";

interface MainContentProps {
  heroPost?: BlogPostDocument;
  featuredPost?: BlogPostDocument;
  editorialPost?: BlogPostDocument;
  editorsPicks?: BlogPostDocument[];
}

// Helper function to render Prismic rich text
const renderText = (richText: prismic.RichTextField): string => {
  if (!richText) return "";
  return prismicH.asText(richText);
};

// Clean date formatting
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "JUST NOW";
  if (diffInHours < 24) return `${diffInHours}H AGO`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}D AGO`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const MainContent: React.FC<MainContentProps> = ({
  heroPost,
  featuredPost,
  editorialPost,
  editorsPicks = [],
}) => {
  if (!heroPost || !featuredPost) {
    return (
      <main className="lg:col-span-3 w-full">
        <div className="text-center py-12 text-gray-400">Loading...</div>
      </main>
    );
  }

  return (
    <main className="lg:col-span-3 w-full">
      {/* Main Story Grid - FT Style */}
      <div className="grid lg:grid-cols-5 gap-8 pb-8 border-b border-gray-800">
        {/* Hero Article - Left Side */}
        <div className="lg:col-span-3 space-y-4">
          {/* Category Label */}
          <div className="text-yellow-500 text-sm font-medium uppercase tracking-wide">
            {heroPost.data.category || "News"}
          </div>

          {/* Hero Headline */}
          <Link href={`/blog/${heroPost.uid}`} className="block group">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white leading-tight group-hover:text-gray-300 transition-colors duration-200">
              {heroPost.data.title}
            </h1>
          </Link>

          {/* Hero Summary */}
          <p className="text-lg text-gray-400 leading-relaxed">
            {renderText(heroPost.data.summary).substring(0, 220)}
          </p>

          {/* Hero Meta - Clean */}
          <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
            <span>{renderText(heroPost.data.author) || "Staff"}</span>
            <span>•</span>
            <span>{formatDate(heroPost.data.published_date)}</span>
          </div>
        </div>

        {/* Featured Story - Right Side */}
        <div className="lg:col-span-2 border-l border-gray-800 pl-8">
          <Link href={`/blog/${featuredPost.uid}`} className="block group">
            {/* Featured Image */}
            {featuredPost.data.featured_image?.url && (
              <div className="relative aspect-[16/10] mb-4 overflow-hidden">
                <Image
                  src={featuredPost.data.featured_image.url}
                  alt={featuredPost.data.featured_image.alt || "Featured"}
                  fill
                  className="object-cover group-hover:opacity-90 transition-opacity duration-200"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            )}

            {/* Featured Category */}
            <div className="text-yellow-500 text-xs font-medium uppercase tracking-wide mb-2">
              {featuredPost.data.category || "Featured"}
            </div>

            {/* Featured Headline */}
            <h2 className="text-xl font-serif font-bold text-white leading-tight mb-3 group-hover:text-gray-300 transition-colors duration-200">
              {featuredPost.data.title}
            </h2>

            {/* Featured Summary */}
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              {renderText(featuredPost.data.summary).substring(0, 100)}
            </p>

            {/* Featured Meta */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{renderText(featuredPost.data.author) || "Staff"}</span>
              <span>•</span>
              <span>{formatDate(featuredPost.data.published_date)}</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Editorial Quote Section - FT Style */}
      {editorialPost && (
        <div className="py-8 border-b border-gray-800">
          <Link href={`/blog/${editorialPost.uid}`} className="block group">
            <div className="border-l-2 border-yellow-500 pl-6">
              <blockquote className="text-xl italic text-gray-200 leading-relaxed mb-4 group-hover:text-white transition-colors duration-200">
                &quot;{renderText(editorialPost.data.summary).substring(0, 160)}
                &quot;
              </blockquote>

              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="font-medium">
                  {renderText(editorialPost.data.author) || "Editorial Board"}
                </span>
                <span>•</span>
                <span>{formatDate(editorialPost.data.published_date)}</span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* More Stories Grid - Clean List */}
      {editorsPicks.length > 0 && (
        <div className="py-8">
          <h2 className="text-lg font-serif font-bold text-white mb-6 pb-3 border-b border-gray-800">
            More Stories
          </h2>

          <div className="space-y-6">
            {editorsPicks
              .slice(0, 4)
              .map((article: BlogPostDocument, index: number) => (
                <article key={article.id} className="group">
                  <Link href={`/blog/${article.uid}`} className="block">
                    <div className="grid grid-cols-4 gap-4 pb-6 border-b border-gray-800/50 last:border-b-0">
                      {/* Article Content */}
                      <div className="col-span-3 space-y-2">
                        {/* Category */}
                        <div className="text-yellow-500 text-xs font-medium uppercase tracking-wide">
                          {article.data.category || "News"}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-serif font-bold text-white leading-tight group-hover:text-gray-300 transition-colors duration-200">
                          {article.data.title}
                        </h3>

                        {/* Summary */}
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {renderText(article.data.summary).substring(0, 100)}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>
                            {renderText(article.data.author) || "Staff"}
                          </span>
                          <span>•</span>
                          <span>{formatDate(article.data.published_date)}</span>
                        </div>
                      </div>

                      {/* Thumbnail */}
                      {article.data.featured_image?.url && (
                        <div className="col-span-1">
                          <div className="relative aspect-square overflow-hidden">
                            <Image
                              src={article.data.featured_image.url}
                              alt={article.data.featured_image.alt || "Article"}
                              fill
                              className="object-cover group-hover:opacity-90 transition-opacity duration-200"
                              sizes="(max-width: 768px) 25vw, 20vw"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default MainContent;
