"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface GalleryImage {
  url: string;
  caption: string;
}

export default function ArticleGallery({ images }: { images: GalleryImage[] }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // All hooks must run unconditionally — early return comes after
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % images.length),
    [images.length],
  );

  // Keyboard ← → navigation
  useEffect(() => {
    if (!images.length) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, prev, next]);

  if (!images.length) return null;

  const { url, caption } = images[current];

  // Touch swipe — require at least 50px horizontal movement
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div className="mb-10">
      {/* Counter + arrow controls */}
      <div className="flex items-center justify-end gap-0 mb-2 text-sm text-gray-400 font-open-sans select-none">
        <span className="mr-2">
          {current + 1} of {images.length}
        </span>
        {/* 44px minimum touch target */}
        <button
          onClick={prev}
          className="flex items-center justify-center w-11 h-11 hover:text-white transition-colors rounded"
          aria-label="Previous image"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="flex items-center justify-center w-11 h-11 hover:text-white transition-colors rounded"
          aria-label="Next image"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Main image — fixed 4:3 frame, swipeable on mobile */}
      <div
        className="relative w-full aspect-[4/3] bg-black overflow-hidden rounded-sm cursor-pointer"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={url}
          src={url}
          alt={caption || "Gallery image"}
          className="absolute inset-0 w-full h-full object-contain"
          loading="eager"
        />
      </div>

      {/* Caption — min height prevents layout jump on empty captions */}
      <p className="min-h-[2.5rem] text-sm text-gray-400 italic mt-2 leading-snug font-open-sans">
        {caption}
      </p>

      {/* Thumbnail strip — 80×60 tiles, horizontally scrollable on mobile */}
      <div className="flex gap-1.5 mt-1 overflow-x-auto pb-1 -mx-1 px-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`flex-none w-[72px] h-[54px] sm:w-[80px] sm:h-[60px] overflow-hidden rounded-sm border-2 transition-all ${
              i === current
                ? "border-[#fcee16] opacity-100"
                : "border-transparent opacity-50 hover:opacity-90"
            }`}
            aria-label={`View image ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
