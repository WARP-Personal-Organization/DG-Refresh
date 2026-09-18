import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { ColumnistSummary, Post } from "../../lib/wordpress";
import PaginatedOpinionGrid from "./PaginatedOpinionGrid";

interface VoicesPageProps {
  columnists: ColumnistSummary[];
  recentPosts: Post[];
  /** How many Opinion columns sit outside the curated roster — the OTHERS tile. */
  otherColumnCount: number;
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
                // `sizes` is a WIDTH hint, but these sources are wide banners
                // that object-cover crops to a square: at sizes="120px" a
                // 1200x600 banner arrived 120 wide and only 60 tall, then got
                // stretched to fill a 112px circle on a 2x screen — a ~3.7x
                // upscale, which is why the portraits looked soft. The widest
                // banner is 2:1, so ask for double the box: 224 CSS px is 448
                // device px wide and 224 tall at 2x, exactly what the circle
                // needs. The originals are 251-1200px, so nothing is upscaled.
                sizes="224px"
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

// ── "OTHERS" tile — the way into every column that isn't on the roster ────────
// Same shape as a ColumnistCard so the grid stays even, but it stands for a
// group rather than a person: the circle carries the count, not a face.
const OthersCard: React.FC<{ count: number }> = ({ count }) => (
  <Link href="/opinion/others" className="block group">
    <div className="flex flex-col items-center text-center transition-transform duration-300 group-hover:-translate-y-1">
      <div className="relative mb-4">
        <div className="absolute -inset-1 rounded-full bg-[#fcee16] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-25" />
        <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gray-800 to-gray-900 ring-2 ring-gray-700 transition-all duration-300 group-hover:ring-[#fcee16] sm:h-28 sm:w-28">
          <span className="font-roboto text-2xl font-black text-[#fcee16]/70">
            +{count}
          </span>
        </div>
      </div>
      <h3 className="font-roboto text-sm font-black uppercase leading-tight tracking-wide text-[#fcee16]">
        Others
      </h3>
      <p className="mt-1 font-open-sans text-[11px] uppercase tracking-wider text-gray-400 transition-colors duration-200 group-hover:text-white">
        More columns
      </p>
    </div>
  </Link>
);

// ── Main component ─────────────────────────────────────────────────────────────
const VoicesPage: React.FC<VoicesPageProps> = ({
  columnists,
  recentPosts,
  otherColumnCount,
}) => {
  // All of them — PaginatedOpinionGrid pages through the rest. Keep the fetch
  // at 20 in opinion/page.tsx: the note there records that 100 posts with
  // _embed exceeded Next's 2 MB per-fetch data-cache limit.
  const latestOpinions = recentPosts;

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
            {columnists.map((c) => (
              <ColumnistCard key={c.slug} c={c} />
            ))}
            {otherColumnCount > 0 && <OthersCard count={otherColumnCount} />}
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
            <PaginatedOpinionGrid posts={latestOpinions} />
          </div>
        </section>
      )}
    </div>
  );
};

export default VoicesPage;
