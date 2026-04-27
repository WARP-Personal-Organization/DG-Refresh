import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { Post } from "../../lib/wordpress";
import Pagination from "./Pagination";

interface AuthorArticlesPageProps {
  authorName: string;
  posts: Post[];
  currentPage: number;
  totalPages: number;
  authorSlug: string;
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const formatDate = (s: string) =>
  s
    ? new Date(s).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

const ArticleCard: React.FC<{ post: Post }> = ({ post }) => (
  <Link href={`/blog/${post.uid}`} className="block group">
    <article className="flex gap-5 pb-6 border-b border-gray-800 last:border-b-0">
      {/* Thumbnail */}
      <div className="relative w-28 h-20 flex-shrink-0 overflow-hidden rounded-sm">
        {post.data.featured_image?.url ? (
          <Image
            src={post.data.featured_image.url}
            alt={post.data.featured_image.alt || post.data.title}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity duration-200"
            sizes="112px"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-600 text-xs uppercase tracking-widest font-open-sans">DG</span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="font-roboto font-bold text-white text-base leading-snug group-hover:text-[#fcee16] transition-colors duration-200 line-clamp-2">
          {post.data.title}
        </h3>
        <p className="font-open-sans text-gray-400 text-sm leading-relaxed line-clamp-2">
          {post.data.summary}
        </p>
        <p className="text-xs text-gray-600 font-open-sans pt-1">
          {formatDate(post.data.published_date)}
        </p>
      </div>
    </article>
  </Link>
);

const AuthorArticlesPage: React.FC<AuthorArticlesPageProps> = ({
  authorName,
  posts,
  currentPage,
  totalPages,
  authorSlug,
}) => {
  const avatarPhoto = posts[0]?.data.featured_image?.url ?? null;
  const initials = initialsOf(authorName);

  return (
    <div className="bg-[#1b1a1b] min-h-screen text-white font-open-sans">

      {/* ── Author header ─────────────────────────────────── */}
      <section className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-14">

          {/* Back to Voices */}
          <Link
            href="/opinion"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#fcee16] text-sm font-open-sans transition-colors mb-10 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Voices
          </Link>

          <div className="flex items-center gap-6">
            {/* Avatar */}
            {avatarPhoto ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-800 flex-shrink-0 shadow-xl">
                <Image src={avatarPhoto} alt={authorName} fill className="object-cover" sizes="96px" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-gray-800 flex-shrink-0 shadow-xl bg-gray-800 flex items-center justify-center">
                <span className="font-roboto font-bold text-2xl text-[#fcee16]/70">{initials}</span>
              </div>
            )}

            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-[3px] bg-[#fcee16]" />
                <span className="font-open-sans text-xs tracking-[0.2em] text-[#fcee16] uppercase font-semibold">
                  Columnist
                </span>
              </div>
              <h1 className="font-roboto font-black text-4xl md:text-5xl text-white uppercase leading-tight">
                {authorName}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ── Articles list ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1 h-8 bg-[#fcee16]" />
          <h2 className="font-roboto font-bold text-2xl tracking-wide uppercase text-white">
            All Columns
          </h2>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500 py-16 text-center">No columns found.</p>
        ) : (
          <div className="max-w-3xl space-y-6">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/opinion/${authorSlug}`}
        />
      </div>
    </div>
  );
};

export default AuthorArticlesPage;
