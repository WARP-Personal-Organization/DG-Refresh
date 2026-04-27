import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { Post } from "../../lib/wordpress";
import { authorToSlug } from "../../lib/wordpress";

interface VoicesPageProps {
  posts: Post[];
}

const formatDate = (s: string) =>
  s
    ? new Date(s).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface Columnist {
  author: string;
  latestPost: Post;
}

// ── Columnist card — mirrors About Us StaffCard ────────────────────────────────
const ColumnistCard: React.FC<{ c: Columnist }> = ({ c }) => {
  const photo = c.latestPost.data.featured_image?.url ?? null;
  const initials = initialsOf(c.author);

  return (
    <Link href={`/opinion/${authorToSlug(c.author)}`} className="block group">
      <div className="flex flex-col items-center text-center gap-3">
        {/* Avatar */}
        {photo ? (
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-[#fcee16] transition-all duration-300 shadow-xl flex-shrink-0">
            <Image
              src={photo}
              alt={c.author}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
        ) : (
          <div className="w-28 h-28 rounded-full border-4 border-gray-800 group-hover:border-[#fcee16] transition-all duration-300 shadow-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
            <span className="font-roboto font-bold text-2xl text-[#fcee16]/70">
              {initials}
            </span>
          </div>
        )}

        {/* Author name */}
        <p className="font-roboto font-bold text-white text-xs uppercase tracking-wide leading-snug group-hover:text-[#fcee16] transition-colors duration-200 px-1">
          {c.author}
        </p>
      </div>
    </Link>
  );
};

// ── Article card — matches CategoryPage ArticleCard ───────────────────────────
const ArticleCard: React.FC<{ post: Post }> = ({ post }) => (
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
        <div className="flex items-center gap-2 text-xs text-gray-500 font-open-sans pt-1">
          <span>{post.data.author}</span>
          <span>·</span>
          <span>{formatDate(post.data.published_date)}</span>
        </div>
      </div>
    </article>
  </Link>
);

// ── Main component ─────────────────────────────────────────────────────────────
const VoicesPage: React.FC<VoicesPageProps> = ({ posts }) => {
  // One card per unique author (most recent post per columnist)
  const seen = new Set<string>();
  const columnists: Columnist[] = [];
  for (const p of posts) {
    const key = (p.data.author || "Staff Writer").toLowerCase().trim();
    if (key === "staff writer") continue; // skip unresolved bylines
    if (seen.has(key)) continue;
    seen.add(key);
    columnists.push({ author: p.data.author, latestPost: p });
  }

  const latestOpinions = posts.slice(0, 6);

  return (
    <div className="bg-[#1b1a1b] min-h-screen text-white font-open-sans">

      {/* ── Page header — matches About Us ───────────────── */}
      <section className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-[3px] bg-[#fcee16]" />
            <span className="font-open-sans text-sm tracking-[0.2em] text-[#fcee16] uppercase font-semibold">
              Opinion &amp; Commentary
            </span>
          </div>
          <h1 className="font-roboto font-black text-6xl md:text-7xl lg:text-8xl text-white leading-tight uppercase mb-6">
            Voices
          </h1>
          <p className="font-open-sans text-gray-400 text-lg max-w-2xl leading-relaxed">
            Independent perspectives from Daily Guardian&apos;s columnists and contributors.
          </p>
        </div>
      </section>

      {/* ── Columnist directory ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-1 h-8 bg-[#fcee16]" />
          <h2 className="font-roboto font-bold text-3xl tracking-wide uppercase text-white">
            Our Columnists
          </h2>
        </div>

        {columnists.length === 0 ? (
          <p className="text-gray-500 text-center py-16">No columnists found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
            {columnists.map((c, i) => (
              <ColumnistCard key={`${c.author}-${i}`} c={c} />
            ))}
          </div>
        )}
      </section>

      {/* ── Latest Opinions ───────────────────────────────── */}
      {latestOpinions.length > 0 && (
        <section className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
            <div className="mb-10 pb-3 border-b-2 border-[#fbd203]">
              <h2 className="text-4xl font-playfair font-bold text-[#fbd203] uppercase tracking-widest">
                Latest Opinions
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestOpinions.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default VoicesPage;
