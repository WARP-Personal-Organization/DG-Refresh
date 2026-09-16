"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "../../lib/wordpress";

// Latest Opinions grid with prev/next paging.
//
// Shaped like NavigationBar rather than SectionPager: this owns both the page
// state and the markup, and takes the posts as a plain serializable prop,
// instead of receiving server-rendered children. See CHANGES.md for the long
// history here — the control renders correctly but could not be verified as
// responding to clicks in automated testing, while the same pattern works in
// the nav and on the homepage.
const PER_PAGE = 6;

// Pinned to Asia/Manila like the homepage cards — the functions run in iad1,
// so an unpinned date renders a day off for a PH newsroom.
const formatDate = (s: string) =>
  s
    ? new Date(s).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Manila",
      })
    : "";

const ArticleCard = ({ post }: { post: Post }) => {
  const date = formatDate(post.data.published_date);
  return (
    <Link href={`/blog/${post.uid}`} className="block group">
      <article className="pb-6 border-b border-gray-800 last:border-b-0">
        {post.data.featured_image?.url && (
          <div className="relative aspect-[16/10] mb-4 overflow-hidden">
            <Image
              src={post.data.featured_image.url}
              alt={post.data.featured_image.alt || "Article image"}
              fill
              className="object-cover group-hover:opacity-90 transition-opacity duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="space-y-2">
          <h3 className="font-roboto font-bold text-white text-base leading-snug group-hover:text-[#fcee16] transition-colors duration-200">
            {post.data.title}
          </h3>
          <p className="font-open-sans text-gray-400 text-sm leading-relaxed line-clamp-2">
            {post.data.summary}
          </p>
          {/* Separator only between two values — unbylined columns were
              rendering a stray "·" before the date. */}
          <div className="flex items-center gap-2 text-xs text-gray-500 font-open-sans pt-1">
            {post.data.author && <span>{post.data.author}</span>}
            {post.data.author && date && <span>·</span>}
            {date && <span>{date}</span>}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default function PaginatedOpinionGrid({ posts }: { posts: Post[] }) {
  const [page, setPage] = useState(0);
  if (posts.length === 0) return null;

  const pageCount = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const current = Math.min(page, pageCount - 1);
  const visible = posts.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE);

  const arrow = (
    to: number,
    disabled: boolean,
    aria: string,
    icon: React.ReactNode,
  ) => (
    <button
      type="button"
      aria-label={aria}
      disabled={disabled}
      onClick={() => setPage(to)}
      className="flex h-8 w-8 items-center justify-center border border-gray-700 text-gray-300 transition-colors hover:border-[#fcee16] hover:text-[#fcee16] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-gray-700 disabled:hover:text-gray-300"
    >
      {icon}
    </button>
  );

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visible.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center gap-2 pt-8">
          {arrow(current - 1, current === 0, "Previous latest opinions", <ChevronLeft size={16} />)}
          {arrow(
            current + 1,
            current === pageCount - 1,
            "Next latest opinions",
            <ChevronRight size={16} />,
          )}
          <span className="ml-2 text-xs text-gray-500 font-open-sans">
            Page {current + 1} of {pageCount}
          </span>
        </div>
      )}
    </>
  );
}
