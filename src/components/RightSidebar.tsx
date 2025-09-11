import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import { ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../prismicio-types";

// TypeScript interfaces (remains unchanged)
interface RightSidebarProps {
  editorsPicks: BlogPostDocument[];
  showEditorsPicks?: boolean;
  editorsPicksTitle?: string;
  editorsPicksHref?: string;
  maxEditorsPicks?: number;
  className?: string;
}

// All helper functions (renderRichTextAsText, formatTimeAgo, etc.) remain unchanged...
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

// Helper function to format time ago - Updated for newspaper style
const formatTimeAgo = (dateString: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays <= 7) return `${diffInDays} days ago`;

    // For older articles, show the actual date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
};

// Updated category display for newspaper style
const getCategoryDisplayName = (
  category: string | null | undefined
): string => {
  const categoryMap: Record<string, string> = {
    news: "News",
    sports: "Sports",
    business: "Business",
    feature: "Features",
    opinion: "Opinion",
    industries: "Industry",
    "other-pages": "Other",
  };

  return category && categoryMap[category] ? categoryMap[category] : "News";
};

// Refined category badge - more newspaper-like
const CategoryBadge: React.FC<{ category: string; size?: "sm" | "xs" }> = ({
  category,
  size = "xs",
}) => {
  const sizeClasses =
    size === "sm" ? "px-2 py-1 text-xs" : "px-1.5 py-0.5 text-xs";

  return (
    <span
      className={`inline-block bg-[#fcee16] text-[#1b1a1b] font-semibold tracking-wide uppercase rounded-sm ${sizeClasses} backdrop-blur-sm font-open-sans`}
    >
      {category}
    </span>
  );
};

// Refined section header - more elegant newspaper style
const SectionHeader: React.FC<{
  title: string;
  href?: string;
}> = ({ title, href }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-bold text-white font-roboto tracking-wide">
        {title}
      </h3>
      {href && (
        <Link
          href={href}
          className="text-[#fcee16] hover:text-[#fcee16]/80 text-sm font-medium flex items-center gap-1 transition-colors duration-200 font-open-sans"
        >
          More <ChevronRight size={12} />
        </Link>
      )}
    </div>
    {/* Subtle divider line */}
    <div className="h-px bg-[#fcee16]/40"></div>
  </div>
);

// Premium article preview component (remains unchanged)
const ArticlePreview: React.FC<{
  post: BlogPostDocument;
  index: number;
  isFirst?: boolean;
}> = ({ post, index, isFirst = false }) => {
  const title = post.data.title || "Untitled Article";
  const author = renderRichTextAsText(post.data.author) || "Staff Writer";
  const category = getCategoryDisplayName(post.data.category);
  const time = formatTimeAgo(
    post.data.published_date || post.data.updated_date
  );
  const summary = renderRichTextAsText(post.data.summary, 120);

  return (
    <Link href={`/blog/${post.uid}`} className="block group">
      <article
        className={`
        ${isFirst ? "pb-4 mb-4 border-b border-default" : "py-3"}
        ${!isFirst ? "border-b border-default last:border-b-0" : ""}
        transition-all duration-200
      `}
      >
        {isFirst && post.data.featured_image?.url && (
          <div className="relative mb-3 overflow-hidden rounded-md">
            <img
              src={post.data.featured_image.url}
              alt={post.data.featured_image.alt || title}
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2">
              <CategoryBadge category={category} size="sm" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4
            className={`
            font-roboto font-semibold text-white group-hover:text-[#fcee16] 
            transition-colors duration-200 leading-tight
            ${isFirst ? "text-base" : "text-sm"}
          `}
          >
            {title}
          </h4>
          {isFirst && summary && (
            <p className="text-gray-400 text-sm leading-relaxed font-open-sans">
              {summary}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              {!isFirst && <CategoryBadge category={category} size="xs" />}
              <span className="text-gray-500 font-medium font-open-sans">
                {author}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 font-open-sans">
              <Clock size={10} className="text-[#fcee16]/70" />
              <span>{time}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

const RightSidebar: React.FC<RightSidebarProps> = ({
  editorsPicks,
  showEditorsPicks = true,
  editorsPicksTitle = "Editor's Picks",
  editorsPicksHref = "/editors-picks",
  maxEditorsPicks = 4,
  className = "",
}) => {
  const editorsData = editorsPicks.slice(0, maxEditorsPicks);

  return (
    <aside className={`space-y-8 font-open-sans ${className}`}>
      {showEditorsPicks && editorsData.length > 0 && (
        <div className="bg-[#1b1a1b]/60 backdrop-blur-sm border border-default rounded-lg p-5 shadow-2xl">
          <SectionHeader title={editorsPicksTitle} href={editorsPicksHref} />

          <div className="space-y-1">
            {editorsData.map((post, index) => (
              // Use React.Fragment to group original and duplicated items
              <React.Fragment key={post.id}>
                <ArticlePreview
                  post={post}
                  index={index}
                  isFirst={index === 0}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Empty State (remains unchanged) */}
      {showEditorsPicks && editorsPicks.length === 0 && (
        <div className="text-center py-12">{/* ... empty state JSX ... */}</div>
      )}
    </aside>
  );
};

export default RightSidebar;
export type { RightSidebarProps };
