"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { ContentImage } from "../../lib/wordpress";

interface Props {
  images: ContentImage[];
}

export default function ArticleImageCarousel({ images }: Props) {
  const [idx, setIdx] = useState(0);
  if (images.length === 0) return null;

  const current = images[idx];
  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <figure className="mb-8">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-gray-700 bg-black">
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt || "Article image"}
          fill
          className="object-cover"
          priority={idx === 0}
          sizes="(max-width: 1024px) 100vw, 800px"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#fcee16] hover:text-black text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#fcee16] hover:text-black text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === idx ? "bg-[#fcee16]" : "bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
              <span className="text-[10px] text-white/80 font-roboto ml-2">
                {idx + 1} / {images.length}
              </span>
            </div>
          </>
        )}
      </div>

      {current.alt && (
        <figcaption className="mt-3 text-sm text-gray-400 italic font-open-sans">
          {current.alt}
        </figcaption>
      )}
    </figure>
  );
}
