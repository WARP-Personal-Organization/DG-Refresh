import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { ColumnistSummary, Post } from "../../lib/wordpress";

interface VoicesPageProps {
  columnists: ColumnistSummary[];
  recentPosts: Post[];
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

// ── Columnist card — circular headshot cropped from the column banner ──────────
const ColumnistCard: React.FC<{ c: ColumnistSummary }> = ({ c }) => {
  const photo = c.image?.url ?? null;
  const initials = initialsOf(c.author);

  return (
    <Link href={`/opinion/${c.slug}`} className="block group">
      <div className="flex flex-col items-center text-center transition-transform duration-300 group-hover:-translate-y-1">
        {/* Avatar — the face sits on the left of each banner, so crop left */}
        <div className="relative mb-4">
          <div className="absolute -inset-1 rounded-full bg-[#fcee16] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-25" />
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-full bg-[#111] ring-2 ring-gray-700 transition-all duration-300 group-hover:ring-[#fcee16]">
            {photo ? (
              <Image
                src={photo}
                alt={c.author}
                fill
                className="object-cover object-left grayscale-[0.2] transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                sizes="120px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <span className="font-roboto text-2xl font-black text-[#fcee16]/70">
                  {initials}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Column title — the hero */}
        <h3 className="font-roboto text-sm font-black uppercase leading-tight tracking-wide text-[#fcee16]">
          {c.column}
        </h3>
        {/* Columnist name */}
        <p className="mt-1 font-open-sans text-[11px] uppercase tracking-wider text-gray-400 transition-colors duration-200 group-hover:text-white">
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
const VoicesPage: React.FC<VoicesPageProps> = ({ columnists, recentPosts }) => {
  const latestOpinions = recentPosts.slice(0, 6);

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
            Opinion
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
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {columnists.map((c, i) => (
              <ColumnistCard key={`${c.slug}-${i}`} c={c} />
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
