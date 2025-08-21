import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import { ChevronRight, Clock, Star } from "lucide-react";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../prismicio-types";

// TypeScript interfaces
interface RightSidebarProps {
  // Prismic BlogPost data - now required like TopStories
  editorsPicks: BlogPostDocument[];

  // Configuration props
  showEditorsPicks?: boolean;
  editorsPicksTitle?: string;
  editorsPicksHref?: string;
  maxEditorsPicks?: number;

  // Optional className for styling
  className?: string;
}

// Helper function to render Prismic rich text as plain text
const renderRichTextAsText = (
  richText: prismic.RichTextField,
  maxLength?: number
): string => {
  if (!richText || (Array.isArray(richText) && richText.length === 0))
    return "";

  try {
    const text = prismicH.asText(richText);
    if (maxLength && text.length > maxLength) {
      return text.substring(0, maxLength).trim() + "...";
    }
    return text;
  } catch (error) {
    console.warn("Error rendering rich text:", error);
    return "";
  }
};

// Helper function to format time ago
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

// Helper function to get category display name
const getCategoryDisplayName = (
  category: "news" | "sports" | "business" | "featured" | null | undefined
): string => {
  const categoryMap = {
    news: "Local News",
    sports: "Sports",
    business: "Business",
    featured: "Featured",
  };

  return category ? categoryMap[category] || "News" : "News";
};

// Gold category badge component
const CategoryBadge: React.FC<{ category: string; size?: "sm" | "xs" }> = ({
  category,
  size = "xs",
}) => {
  const sizeClasses =
    size === "sm" ? "px-2 py-1 text-xs" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold tracking-wide uppercase rounded shadow-lg ${sizeClasses}`}
    >
      {category}
    </span>
  );
};

// Section header component with gold accents
const SectionHeader: React.FC<{
  title: string;
  icon: React.ElementType;
  href?: string;
}> = ({ title, icon: Icon, href }) => (
  <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 relative">
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
    <h3 className="flex items-center gap-2 text-lg font-bold text-white font-serif">
      <Icon size={18} className="text-yellow-400 drop-shadow-sm" />
      {title}
    </h3>
    {href && (
      <Link
        href={href}
        className="text-yellow-400 hover:text-yellow-300 text-sm font-medium flex items-center gap-1 transition-all duration-200 hover:drop-shadow-sm"
      >
        More <ChevronRight size={14} />
      </Link>
    )}
  </div>
);

// Article preview component for Prismic BlogPost
const ArticlePreview: React.FC<{ post: BlogPostDocument }> = ({ post }) => {
  // Handle title properly like in TopStories
  const title = post.data.title || "Untitled Article";
  const author = renderRichTextAsText(post.data.author) || "Staff Writer";
  const category = getCategoryDisplayName(post.data.category);
  const time = formatTimeAgo(
    post.data.published_date || post.data.updated_date
  );
  const image =
    post.data.featured_image?.url ||
    "https://via.placeholder.com/120x80.png/1a1a1a/FFD700?text=No+Image";
  const imageAlt = post.data.featured_image?.alt || title;

  return (
    <Link href={`/blog/${post.uid}`} className="block group">
      <article className="flex gap-3 p-3 rounded-lg bg-black hover:bg-black transition-all duration-300 border border-gray-800 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10">
        <div className="relative flex-shrink-0">
          <img
            src={image}
            alt={imageAlt}
            width={80}
            height={60}
            className="w-20 h-15 rounded object-cover group-hover:scale-105 transition-transform duration-200 border border-gray-700 group-hover:border-yellow-500/50"
          />
          <div className="absolute top-1 left-1">
            <CategoryBadge category={category} size="xs" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm leading-tight mb-2 group-hover:text-yellow-200 transition-colors duration-200 line-clamp-2 drop-shadow-sm">
            {title}
          </h4>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="text-yellow-400 font-medium">{author}</span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1">
              <Clock size={10} className="text-yellow-400" />
              {time}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

// Main RightSidebar component
const RightSidebar: React.FC<RightSidebarProps> = ({
  // Data props - now required like TopStories
  editorsPicks,

  // Configuration props
  showEditorsPicks = true,
  editorsPicksTitle = "Editor's Picks",
  editorsPicksHref = "/editors-picks",
  maxEditorsPicks = 3,

  // Styling
  className = "",
}) => {
  // Take only the articles we need, like TopStories does
  const editorsData = editorsPicks.slice(0, maxEditorsPicks);

  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Editor's Picks with Prismic data */}
      {showEditorsPicks && editorsData.length > 0 && (
        <div className="bg-gradient-to-b from-black via-gray-950 to-black border-2 border-gray-800 hover:border-yellow-500/40 rounded-lg p-6 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300">
          <SectionHeader
            title={editorsPicksTitle}
            icon={Star}
            href={editorsPicksHref}
          />

          <div className="space-y-4">
            {editorsData.map((post) => (
              <ArticlePreview key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State - only show if no editor's picks provided */}
      {showEditorsPicks && editorsPicks.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-950 border-2 border-gray-800 rounded-xl p-8 max-w-md mx-auto">
            <Star size={48} className="mx-auto text-yellow-400/50 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              No Editor&apos;s Picks Available
            </h3>
            <p className="text-gray-400">
              Check back soon for curated content selections.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default RightSidebar;

// Export types for use in other components
export type { RightSidebarProps };

// Usage examples:
//
// Basic usage with BlogPost data (like TopStories):
// <RightSidebar editorsPicks={blogPosts} />
//
// Homepage with featured posts:
// <RightSidebar
//   editorsPicks={featuredPosts}
//   editorsPicksTitle="Featured Stories"
//   maxEditorsPicks={5}
// />
//
// Opinion page:
// <RightSidebar
//   editorsPicks={opinionPosts}
//   editorsPicksTitle="Related Opinions"
//   editorsPicksHref="/opinion"
// />
//
// Article page - minimal sidebar:
// <RightSidebar
//   editorsPicks={relatedPosts}
//   maxEditorsPicks={2}
//   className="lg:sticky lg:top-8"
// />
//
// Hide editor's picks section:
// <RightSidebar
//   editorsPicks={[]}
//   showEditorsPicks={false}
// />
