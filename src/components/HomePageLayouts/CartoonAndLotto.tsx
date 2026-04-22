"use client";

import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Post } from "../../../lib/wordpress";

interface CartoonAndLottoProps {
  cartoons: Post[];
}

const LOTTO_GAMES = ["6/42", "6/45", "6/49", "6/55", "6/58", "3D", "4D", "6D", "2D"];

export default function CartoonAndLotto({ cartoons }: CartoonAndLottoProps) {
  const [idx, setIdx] = useState(0);

  if (!cartoons || cartoons.length === 0) return null;

  const current = cartoons[idx];
  const prev = () => setIdx((i) => (i === 0 ? cartoons.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === cartoons.length - 1 ? 0 : i + 1));

  return (
    <section className="bg-[#1b1a1b]">

      {/* ── LOTTO STRIP ─────────────────────────────────────────────── */}
      <a
        href="https://dailyguardian.com.ph/lotto/"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center w-full overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #00206e 0%, #0044cc 50%, #00206e 100%)",
          minHeight: "52px",
        }}
        aria-label="PCSO Lotto Results"
      >
        {/* Label */}
        <div className="flex-shrink-0 flex items-center gap-2 px-4 border-r border-white/20 h-full self-stretch">
          <span
            className="text-[#fcee16] font-black text-xs md:text-sm uppercase tracking-widest whitespace-nowrap"
            style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
          >
            PCSO LOTTO
          </span>
        </div>

        {/* Game pills */}
        <div className="flex items-center gap-2 px-4 overflow-x-auto scrollbar-none flex-1 py-3">
          {LOTTO_GAMES.map((g) => (
            <span
              key={g}
              className="flex-shrink-0 text-[10px] md:text-xs font-black text-white border border-white/25 rounded-sm px-2.5 py-1 uppercase tracking-wider bg-white/10 group-hover:border-[#fcee16]/50 transition-colors"
              style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
            >
              {g}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-4 border-l border-white/20 h-full self-stretch">
          <span className="text-white/70 group-hover:text-[#fcee16] text-[10px] md:text-xs font-roboto uppercase tracking-widest whitespace-nowrap transition-colors hidden sm:block">
            Results
          </span>
          <ExternalLink size={12} className="text-white/50 group-hover:text-[#fcee16] transition-colors" />
        </div>
      </a>

      {/* ── CARTOON SECTION ─────────────────────────────────────────── */}
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <div className="mb-8 pb-4 border-b border-[#fcee16]">
            <h2 className="text-2xl font-roboto font-bold text-white">CARTOON</h2>
          </div>

          {/* Main layout: large image + sidebar on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8">

            {/* Cartoon image — full width on mobile, 2/3 on desktop */}
            <div className="lg:col-span-2 relative">
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>

                {/* Paper background — cartoons are on white */}
                <div className="absolute inset-0 bg-[#f4f0eb]" />

                {current.data.featured_image?.url ? (
                  <Image
                    src={current.data.featured_image.url}
                    alt={current.data.featured_image.alt || current.data.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 font-roboto text-sm uppercase tracking-widest">No cartoon</span>
                  </div>
                )}

                {/* Bottom gradient for text legibility */}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

                {/* CARTOON badge */}
                <div className="absolute bottom-12 left-5">
                  <span className="bg-[#fcee16] text-black font-black text-[10px] px-3 py-1 font-roboto tracking-[0.2em] uppercase">
                    CARTOON
                  </span>
                </div>

                {/* Title */}
                <Link href={`/blog/${current.uid}`} className="block">
                  <h3 className="absolute bottom-4 left-5 right-14 text-white font-roboto font-black text-lg md:text-xl uppercase leading-tight tracking-wide drop-shadow-lg hover:text-[#fcee16] transition-colors">
                    {current.data.title}
                  </h3>
                </Link>

                {/* Prev / Next arrows */}
                {cartoons.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-12 bg-black/40 hover:bg-[#fcee16] text-white hover:text-black flex items-center justify-center transition-all duration-200 z-10"
                      aria-label="Previous cartoon"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-12 bg-black/40 hover:bg-[#fcee16] text-white hover:text-black flex items-center justify-center transition-all duration-200 z-10"
                      aria-label="Next cartoon"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Dot indicators */}
              {cartoons.length > 1 && (
                <div className="flex gap-1.5 mt-3 pl-1">
                  {cartoons.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === idx ? "w-8 bg-[#fcee16]" : "w-2 bg-gray-600 hover:bg-gray-400"
                      }`}
                      aria-label={`Cartoon ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar: recent cartoons list */}
            <div className="hidden lg:flex flex-col border-l border-[#fcee16]/20 pl-8 gap-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fcee16]/60 font-roboto mb-4">
                Recent Cartoons
              </p>
              {cartoons.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setIdx(i)}
                  className={`group flex gap-3 items-start py-4 border-t border-white/5 text-left transition-all duration-200 ${
                    i === idx ? "opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-12 flex-shrink-0 overflow-hidden bg-[#f4f0eb]">
                    {c.data.featured_image?.url && (
                      <Image
                        src={c.data.featured_image.url}
                        alt={c.data.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                    {i === idx && (
                      <div className="absolute inset-0 ring-2 ring-[#fcee16] ring-inset" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-roboto font-bold leading-tight line-clamp-2 uppercase transition-colors ${
                      i === idx ? "text-[#fcee16]" : "text-white group-hover:text-[#fcee16]"
                    }`}>
                      {c.data.title}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1 font-open-sans">
                      {new Date(c.data.published_date).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </p>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
