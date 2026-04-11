import { ChevronRight, Clock, Star } from "lucide-react";
import Link from "next/link";
import React from "react";
import type { Post } from "../../lib/wordpress";

interface RightSidebarProps {
  editorsPicks: Post[];
  showEditorsPicks?: boolean;
  editorsPicksTitle?: string;
  editorsPicksHref?: string;
  maxEditorsPicks?: number;
  className?: string;
}

const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays <= 7) return `${diffInDays} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getCategoryDisplayName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    news: "News",
    sports: "Sports",
    business: "Business",
    feature: "Features",
    opinion: "Opinion",
    initiatives: "Initiatives",
    "other-pages": "Other",
  };
  return categoryMap[category] ?? "News";
};

const CategoryBadge: React.FC<{ category: string; size?: "sm" | "xs" }> = ({
  category,
  size = "xs",
}) => {
  const sizeClasses =
    size === "sm" ? "px-3 py-1.5 text-xs" : "px-2 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center bg-gradient-to-r from-accent to-accent/90 text-background font-bold tracking-wider uppercase rounded-md ${sizeClasses} shadow-sm font-roboto`}
    >
      {category}
    </span>
  );
};

const SectionHeader: React.FC<{ title: string; href?: string }> = ({
  title,
  href,
}) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-accent/20 rounded-md flex items-center justify-center">
          <Star size={12} className="text-accent" />
        </div>
        <h3 className="text-lg font-bold text-foreground font-roboto">
          {title}
        </h3>
      </div>
      {href && (
        <Link
          href={href}
          className="group flex items-center gap-1 text-accent hover:text-accent/80 text-xs font-bold uppercase tracking-wider transition-all duration-300 font-roboto"
        >
          <span>More</span>
          <ChevronRight
            size={12}
            className="transform group-hover:translate-x-1 transition-transform duration-300"
          />
        </Link>
      )}
    </div>
    <div className="h-px bg-accent/30"></div>
  </div>
);

const ArticlePreview: React.FC<{
  post: Post;
  index: number;
  isFirst?: boolean;
}> = ({ post, index, isFirst = false }) => {
  const title = post.data.title || "Untitled Article";
  const author = post.data.author || "Staff Writer";
  const category = getCategoryDisplayName(post.data.category);
  const time = formatTimeAgo(post.data.published_date || post.data.updated_date);
  const summary = post.data.summary
    ? post.data.summary.substring(0, 80) + "..."
    : "";

  return (
    <Link href={`/blog/${post.uid}`} className="block group">
      <article
        className={`transition-all duration-300 hover:bg-accent/5 rounded-lg p-3 -m-3 ${isFirst ? "mb-3 pb-3 border-b border-accent/20" : "mb-2"}`}
      >
        {isFirst && post.data.featured_image?.url && (
          <div className="relative mb-3 overflow-hidden rounded-lg">
            <img
              src={post.data.featured_image.url}
              alt={post.data.featured_image.alt || title}
              className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 left-2">
              <CategoryBadge category={category} size="xs" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          {!isFirst && (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-accent/10 rounded text-xs font-bold text-accent flex items-center justify-center">
                {index + 1}
              </span>
              <CategoryBadge category={category} size="xs" />
            </div>
          )}

          <h4
            className={`font-roboto font-bold text-foreground group-hover:text-accent transition-colors duration-300 leading-tight ${isFirst ? "text-base" : "text-sm"}`}
          >
            {title}
          </h4>

          {isFirst && summary && (
            <p className="text-gray-300 text-sm leading-relaxed font-sans">
              {summary}
            </p>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">{author}</span>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock size={10} className="text-accent/70" />
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
    <aside className={`space-y-6 ${className}`}>
      {showEditorsPicks && editorsData.length > 0 && (
        <div className="bg-gradient-to-b from-background via-background/98 to-background/95 backdrop-blur-xl border border-accent/20 rounded-xl p-5 shadow-xl overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5"></div>
          </div>

          <div className="relative z-10">
            <SectionHeader title={editorsPicksTitle} href={editorsPicksHref} />
            <div className="space-y-1">
              {editorsData.map((post, index) => (
                <ArticlePreview
                  key={post.id}
                  post={post}
                  index={index}
                  isFirst={index === 0}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {showEditorsPicks && editorsPicks.length === 0 && (
        <div className="text-center py-8 bg-background/50 rounded-xl border border-accent/10">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Star size={20} className="text-accent/50" />
          </div>
          <p className="text-gray-400 text-sm font-medium">
            No editor&apos;s picks available
          </p>
        </div>
      )}
    </aside>
  );
};

export default RightSidebar;
export type { RightSidebarProps };
