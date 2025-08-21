import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import { ArrowRight, Clock, Tag, TrendingUp, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../prismicio-types";

interface MainContentProps {
  heroPost?: BlogPostDocument;
  featuredPost?: BlogPostDocument;
  editorialPost?: BlogPostDocument;
}

// Enhanced helper function to render Prismic rich text with length limit
const renderRichTextAsText = (
  richText: prismic.RichTextField,
  maxLength?: number
): string => {
  if (!richText) return "";
  const text = prismicH.asText(richText);
  if (maxLength && text.length > maxLength) {
    return text.substring(0, maxLength).trim() + "...";
  }
  return text;
};

// Enhanced date formatting with multiple options
const formatDate = (
  dateString: string | null | undefined,
  format: "relative" | "absolute" = "relative"
): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  if (format === "absolute") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "JUST NOW";
  if (diffInMinutes < 60) return `${diffInMinutes}M AGO`;
  if (diffInHours < 24) return `${diffInHours}H AGO`;
  if (diffInDays < 7) return `${diffInDays}D AGO`;

  return formatDate(dateString, "absolute");
};

// Reading time estimation
const estimateReadingTime = (content: prismic.RichTextField): string => {
  const text = renderRichTextAsText(content);
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};

// Enhanced category mapping with colors and icons
const getCategoryInfo = (
  category: "news" | "sports" | "business" | "featured" | null | undefined
) => {
  const categoryMap = {
    news: {
      name: "Breaking News",
      color: "text-red-400 bg-red-400/10 border-red-400/20",
      icon: TrendingUp,
    },
    sports: {
      name: "Sports",
      color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
      icon: TrendingUp,
    },
    business: {
      name: "Business",
      color: "text-green-400 bg-green-400/10 border-green-400/20",
      icon: TrendingUp,
    },
    featured: {
      name: "Featured",
      color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
      icon: TrendingUp,
    },
  };

  return category
    ? categoryMap[category] || {
        name: "News",
        color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
        icon: TrendingUp,
      }
    : {
        name: "News",
        color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
        icon: TrendingUp,
      };
};

// Enhanced loading skeleton component
const LoadingSkeleton: React.FC = () => (
  <main className="lg:col-span-3 space-y-8 w-full pb">
    <div className="bg-black/50 border border-yellow-500/20 p-6 rounded-xl backdrop-blur-sm">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-yellow-500/20 rounded animate-pulse w-24"></div>
          <div className="space-y-2">
            <div className="h-8 bg-black-700/50 rounded animate-pulse"></div>
            <div className="h-8 bg-black-700/50 rounded animate-pulse w-4/5"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-black-600/50 rounded animate-pulse"></div>
            <div className="h-4 bg-black-600/50 rounded animate-pulse w-3/4"></div>
          </div>
          <div className="h-3 bg-yellow-500/20 rounded animate-pulse w-32"></div>
        </div>
        {/* Right skeleton */}
        <div className="h-80 bg-black-700/30 rounded-xl animate-pulse"></div>
      </div>
    </div>
  </main>
);

// Enhanced category badge component
const CategoryBadge: React.FC<{ category: string; className?: string }> = ({
  category,
  className,
}) => {
  const categoryInfo = getCategoryInfo(category as never);
  const IconComponent = categoryInfo.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tracking-wider border ${categoryInfo.color} ${className}`}
    >
      <IconComponent size={12} />
      {categoryInfo.name}
    </span>
  );
};

const MainContent: React.FC<MainContentProps> = ({
  heroPost,
  featuredPost,
  editorialPost,
}) => {
  // Enhanced loading state
  if (!heroPost || !featuredPost) {
    return <LoadingSkeleton />;
  }

  return (
    <main className="lg:col-span-3 space-y-8 w-full">
      {/* Enhanced Hero Article & Featured Image Section */}
      <article className="group relative bg-gradient-to-br from-black via-gray-900 to-black border border-yellow-500/20 rounded-xl overflow-hidden hover:border-yellow-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/10">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-50"></div>

        <div className="relative grid md:grid-cols-2 gap-8 p-8">
          {/* Enhanced Hero Article Details */}
          <div className="flex flex-col justify-center space-y-6 z-10">
            {/* Category and Meta */}
            <div className="flex items-center gap-4 flex-wrap">
              <CategoryBadge category={heroPost.data.category || "news"} />
              {heroPost.data.is_featured && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-md text-xs font-medium">
                  <TrendingUp size={10} />
                  TRENDING
                </span>
              )}
            </div>

            {/* Enhanced Headlines */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-4xl font-serif font-bold text-white leading-tight group-hover:text-yellow-100 transition-colors duration-300">
                {heroPost.data.title || "Untitled Article"}
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {renderRichTextAsText(heroPost.data.summary, 200)}
              </p>
            </div>

            {/* Enhanced Meta Information */}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              {heroPost.data.author && (
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span>{renderRichTextAsText(heroPost.data.author)}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>
                  {formatDate(
                    heroPost.data.updated_date || heroPost.data.published_date
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Tag size={14} />
                <span>{estimateReadingTime(heroPost.data.content)}</span>
              </div>
            </div>

            {/* Enhanced CTA */}
            <Link
              href={`/blog/${heroPost.uid}`}
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-medium transition-all duration-300 group/link w-fit"
            >
              Read Full Story
              <ArrowRight
                size={16}
                className="transform group-hover/link:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Enhanced Featured Image and Secondary Article */}
          <div className="relative">
            <Link
              href={`/blog/${featuredPost.uid}`}
              className="block group/image"
            >
              <div className="relative overflow-hidden rounded-xl border border-yellow-500/30 group-hover/image:border-yellow-500/60 transition-all duration-500 min-h-[400px]">
                {/* Enhanced Image with Next.js optimization */}
                {featuredPost.data.featured_image?.url ? (
                  <Image
                    src={featuredPost.data.featured_image.url}
                    alt={
                      featuredPost.data.featured_image.alt ||
                      "Featured article image"
                    }
                    fill
                    className="object-cover group-hover/image:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Tag size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No Image Available</p>
                    </div>
                  </div>
                )}

                {/* Enhanced Overlay Content */}
              </div>
            </Link>
          </div>
        </div>
      </article>
      {editorialPost && (
        <article className="relative group">
          <Link href={`/blog/${editorialPost.uid}`} className="block">
            <blockquote className="relative bg-gradient-to-r from-black via-gray-900 to-black border-l-4 border-yellow-500 p-8 rounded-r-xl hover:border-l-yellow-400 transition-all duration-500 hover:shadow-xl hover:shadow-yellow-500/10 backdrop-blur-sm">
              {/* Quote decoration */}
              <div className="absolute top-4 left-4 text-6xl text-yellow-500/20 font-serif">
                &quot;
              </div>

              <div className="relative z-10 space-y-4">
                <p className="text-xl lg:text-2xl italic text-yellow-100 leading-relaxed group-hover:text-white transition-colors duration-300 pl-8">
                  {renderRichTextAsText(editorialPost.data.summary, 300)}
                </p>

                <footer className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-gray-400" />
                    <cite className="text-gray-300 not-italic font-medium">
                      {renderRichTextAsText(editorialPost.data.author)}
                    </cite>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock size={14} />
                    <span>{formatDate(editorialPost.data.published_date)}</span>
                  </div>
                </footer>
              </div>
            </blockquote>
          </Link>
        </article>
      )}
    </main>
  );
};

export default MainContent;
