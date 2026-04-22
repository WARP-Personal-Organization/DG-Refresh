"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Post } from "../../lib/wordpress";

export default function CartoonCard({ cartoons }: { cartoons: Post[] }) {
  const [idx, setIdx] = useState(0);
  if (!cartoons || cartoons.length === 0) return null;

  const c = cartoons[idx];
  const prev = () => setIdx((i) => (i === 0 ? cartoons.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === cartoons.length - 1 ? 0 : i + 1));

  return (
    <div className="relative bg-[#1b1a1b] rounded-xl overflow-hidden shadow-2xl border border-[#fcee16]/20 hover:border-[#fcee16]/40 transition-all duration-500">

      {/* Thumbnail */}
      <Link href={`/blog/${c.uid}`} className="block relative group overflow-hidden">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f4f0eb]">
          {c.data.featured_image?.url ? (
            <Image
              src={c.data.featured_image.url}
              alt={c.data.featured_image.alt || c.data.title}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400 text-xs uppercase tracking-widest font-roboto">No image</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-white font-roboto font-black text-xs uppercase tracking-wider line-clamp-2">
              {c.data.title}
            </p>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="p-4 border-t border-[#fcee16]/10 flex items-center justify-between">
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-black uppercase tracking-widest font-roboto text-[#fcee16]">
            Cartoon
          </span>
          <span className="text-xs text-gray-500 font-open-sans mt-0.5 truncate">
            {c.data.published_date
              ? new Date(c.data.published_date).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })
              : "Latest"}
          </span>
        </div>

        {/* Prev / Next */}
        {cartoons.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={prev}
              className="w-7 h-7 rounded-full bg-gray-800 hover:bg-[#fcee16] hover:text-black text-white flex items-center justify-center transition-all"
              aria-label="Previous cartoon"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[10px] text-gray-600 font-roboto w-6 text-center">
              {idx + 1}/{cartoons.length}
            </span>
            <button
              onClick={next}
              className="w-7 h-7 rounded-full bg-gray-800 hover:bg-[#fcee16] hover:text-black text-white flex items-center justify-center transition-all"
              aria-label="Next cartoon"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
