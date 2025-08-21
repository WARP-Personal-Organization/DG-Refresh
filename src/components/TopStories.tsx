import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import { Clock, Eye, Tag, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../prismicio-types";

interface TopStoriesProps {
  stories: BlogPostDocument[];
  title: string;
}

// Helper function to render Prismic rich text as plain text with proper typing
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

// Helper function to format dates as "X HOURS AGO"
const formatTimeAgo = (dateString: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    return "JUST NOW";
  } else if (diffInHours < 24) {
    return `${diffInHours} HOUR${diffInHours === 1 ? "" : "S"} AGO`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} DAY${diffInDays === 1 ? "" : "S"} AGO`;
  }
};

// Enhanced category mapping with black and gold theme
const getCategoryInfo = (
  category: "news" | "sports" | "business" | "featured" | null | undefined
) => {
  const categoryMap = {
    news: {
      name: "Local News",
      color: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black",
      textColor: "text-yellow-400",
    },
    sports: {
      name: "Sports",
      color: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black",
      textColor: "text-yellow-400",
    },
    business: {
      name: "Business",
      color: "bg-gradient-to-r from-yellow-600 to-yellow-500 text-black",
      textColor: "text-yellow-400",
    },
    featured: {
      name: "Featured",
      color:
        "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-black",
      textColor: "text-yellow-300",
    },
  };

  return category
    ? categoryMap[category] || {
        name: "News",
        color: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black",
        textColor: "text-yellow-400",
      }
    : {
        name: "News",
        color: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black",
        textColor: "text-yellow-400",
      };
};

// Reading time estimation
const estimateReadingTime = (content: prismic.RichTextField): string => {
  const text = renderRichTextAsText(content);
  const wordsPerMinute = 250;
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};

const TopStories: React.FC<TopStoriesProps> = ({ stories, title }) => {
  // Take only the first 4 stories for the grid
  const topStories = stories.slice(0, 4);

  return (
    <section className="bg-gradient-to-b from-black via-gray-950 to-black py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header with Enhanced Gold Decorative Borders */}
        <div className="flex items-center justify-center mb-12 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            {/* <div className="w-full border-t-2 border-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div> */}
          </div>
          <div className="relative bg-black px-8 py-2">
            <div className="flex items-center justify-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-400 to-yellow-500 mr-4"></div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 tracking-wider font-serif drop-shadow-lg">
                {title}
              </h2>
              <div className="flex-1 h-px bg-gradient-to-l from-yellow-500 via-yellow-400 to-transparent ml-4"></div>
            </div>
          </div>
        </div>

        {/* Stories Grid with Enhanced Black Variations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {topStories.map((story, index) => {
            const categoryInfo = getCategoryInfo(story.data.category);
            const storyTitle = story.data.title || "Untitled Article";
            const storyImage = story.data.featured_image;
            const publishDate =
              story.data.published_date || story.data.updated_date;

            // Alternate black gradient patterns for visual variety
            const backgroundVariations = [
              "bg-gradient-to-br from-black via-gray-950 to-gray-900",
              "bg-gradient-to-bl from-gray-950 via-black to-gray-900",
              "bg-gradient-to-tr from-gray-900 via-black to-gray-950",
              "bg-gradient-to-tl from-black via-gray-900 to-gray-950",
            ];

            const hoverBackgrounds = [
              "hover:from-gray-900 hover:via-gray-950 hover:to-black",
              "hover:from-gray-950 hover:via-gray-900 hover:to-black",
              "hover:from-black hover:via-gray-950 hover:to-gray-900",
              "hover:from-gray-950 hover:via-black hover:to-gray-900",
            ];

            return (
              <Link
                key={story.id}
                href={`/blog/${story.uid}`}
                className="group block transform hover:scale-105 transition-all duration-500"
              >
                <article
                  className={`${backgroundVariations[index % 4]} ${hoverBackgrounds[index % 4]} rounded-xl overflow-hidden border-2 border-gray-800 hover:border-yellow-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/20 group-hover:border-yellow-400`}
                >
                  {/* Story Image with Enhanced Overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {storyImage?.url ? (
                      <Image
                        src={storyImage.url}
                        alt={storyImage.alt || "Story image"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
                        <div className="text-center">
                          <Tag
                            size={32}
                            className="mx-auto text-yellow-400/50 mb-2"
                          />
                          <span className="text-gray-500 text-sm">
                            No Image
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Category Badge Overlay */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg backdrop-blur-sm ${categoryInfo.color}`}
                      >
                        {categoryInfo.name}
                      </span>
                    </div>

                    {/* Trending Badge for Featured Stories */}
                    {story.data.is_featured && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded-full text-xs font-bold tracking-wider shadow-lg">
                          <TrendingUp size={10} className="animate-pulse" />
                          HOT
                        </span>
                      </div>
                    )}

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>

                  {/* Story Content with Enhanced Styling */}
                  <div className="p-6 space-y-4">
                    {/* Category Text Version */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${categoryInfo.textColor} group-hover:text-yellow-300 transition-colors duration-200`}
                      >
                        {categoryInfo.name}
                      </span>
                      {story.data.is_featured && (
                        <span className="text-xs text-yellow-400 font-medium flex items-center gap-1">
                          <Eye size={10} />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Headline with Enhanced Typography */}
                    <h3 className="text-lg font-serif font-bold text-white leading-tight group-hover:text-yellow-200 transition-colors duration-300 line-clamp-3 drop-shadow-sm">
                      {storyTitle}
                    </h3>

                    {/* Summary with Smart Truncation */}
                    {story.data.summary && (
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200 line-clamp-2 leading-relaxed">
                        {renderRichTextAsText(story.data.summary, 100)}
                      </p>
                    )}

                    {/* Enhanced Meta Information */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-800 group-hover:border-yellow-500/30 transition-colors duration-300">
                      <time className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-yellow-400 uppercase tracking-wider transition-colors duration-200">
                        <Clock size={10} />
                        {formatTimeAgo(publishDate)}
                      </time>

                      {story.data.content && (
                        <span className="text-xs text-gray-500 group-hover:text-yellow-400 transition-colors duration-200 flex items-center gap-1">
                          <Tag size={10} />
                          {estimateReadingTime(story.data.content)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subtle Gold Accent Border */}
                  <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* Enhanced Empty State */}
        {topStories.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-950 border-2 border-gray-800 rounded-xl p-8 max-w-md mx-auto">
              <Tag size={48} className="mx-auto text-yellow-400/50 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No Stories Available
              </h3>
              <p className="text-gray-400">
                Check back soon for the latest local news updates.
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-center mt-16">
          <div className="relative group">
            {/* Side decorative elements */}
            <div className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
            <div className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 w-2 h-8 bg-gradient-to-b from-yellow-600 to-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
          </div>
        </div>
        <div className=" text-center">
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-4 px-8 rounded-xl font-serif transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25">
            View All
          </button>
        </div>
        {/* Enhanced Bottom Decorative Border */}
        <div className="flex items-center justify-center mt-12 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
          </div>
          <div className="relative bg-black px-6">
            <div className="flex items-center justify-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-yellow-500/50 mr-3"></div>
              <div className="w-2 h-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg"></div>
              <div className="flex-1 h-px bg-gradient-to-l from-yellow-500/50 via-yellow-400/50 to-transparent ml-3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopStories;
