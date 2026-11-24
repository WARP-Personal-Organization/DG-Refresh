"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type Shot = { src: string; caption: string };

const OPEN_MS = 420;
const CLOSE_MS = 300;
const STEP_MS = 320;
const EASE_OUT = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Transform that makes the full-screen stage sit over `el` (the clicked
 * photo), so animating from/to it looks like the photo grows out of / shrinks
 * back into the page.
 */
function transformFrom(el: HTMLElement | undefined, stage: HTMLElement) {
  if (!el) return "scale(0.92)";
  const a = el.getBoundingClientRect();
  const b = stage.getBoundingClientRect();
  const dx = a.left + a.width / 2 - (b.left + b.width / 2);
  const dy = a.top + a.height / 2 - (b.top + b.height / 2);
  const s = Math.max(0.15, Math.min(a.width / b.width, a.height / b.height));
  return `translate(${dx}px, ${dy}px) scale(${s})`;
}

/**
 * Click-to-enlarge for article photos. Any element inside `#${targetId}` with
 * a `data-zoom` attribute (the image src) and optional `data-caption` opens
 * a full-screen viewer that grows out of the clicked photo. Arrows step
 * through every zoomable photo in the article; Esc, X or a backdrop click
 * shrinks it back into the page.
 */
export default function ArticleLightbox({ targetId }: { targetId: string }) {
  const [shots, setShots] = useState<Shot[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const elements = useRef<HTMLElement[]>([]);
  const backdrop = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const chrome = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const stepDir = useRef(0);

  useEffect(() => {
    const root = document.getElementById(targetId);
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-zoom]");
      if (!el || !root.contains(el)) return;
      e.preventDefault();
      const all = Array.from(root.querySelectorAll<HTMLElement>("[data-zoom]"));
      elements.current = all;
      closing.current = false;
      stepDir.current = 0;
      setShots(all.map((n) => ({ src: n.dataset.zoom!, caption: n.dataset.caption ?? "" })));
      setIndex(all.indexOf(el));
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [targetId]);

  const isOpen = index !== null;

  // Open: backdrop fades in, photo grows out of the clicked thumbnail.
  useLayoutEffect(() => {
    if (!isOpen || !stage.current || reducedMotion()) return;
    const from = transformFrom(elements.current[index ?? 0], stage.current);
    backdrop.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: OPEN_MS * 0.7,
      easing: "ease-out",
    });
    stage.current.animate(
      [
        { transform: from, opacity: 0.6 },
        { transform: "none", opacity: 1 },
      ],
      { duration: OPEN_MS, easing: EASE_OUT },
    );
    chrome.current?.animate(
      // Opacity only: a transform here would re-anchor the absolute arrows.
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: OPEN_MS, delay: OPEN_MS * 0.4, easing: EASE_OUT, fill: "backwards" },
    );
    // Only on open, not on every step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Step: the new photo slides in from the side it came from.
  useLayoutEffect(() => {
    if (!isOpen || !stepDir.current || !photo.current || reducedMotion()) return;
    photo.current.animate(
      [
        { opacity: 0, transform: `translateX(${stepDir.current * 60}px) scale(0.97)` },
        { opacity: 1, transform: "none" },
      ],
      { duration: STEP_MS, easing: EASE_OUT },
    );
  }, [index, isOpen]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const done = () => {
      closing.current = false;
      setIndex(null);
    };
    if (!stage.current || reducedMotion()) return done();
    const to = transformFrom(elements.current[index ?? 0], stage.current);
    backdrop.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: CLOSE_MS,
      easing: "ease-in",
      fill: "forwards",
    });
    chrome.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: CLOSE_MS * 0.5,
      fill: "forwards",
    });
    stage.current
      .animate(
        [
          { transform: "none", opacity: 1 },
          { transform: to, opacity: 0.4 },
        ],
        { duration: CLOSE_MS, easing: EASE_IN, fill: "forwards" },
      )
      .finished.then(done, done);
  }, [index]);

  const step = useCallback(
    (d: number) => {
      stepDir.current = d;
      setIndex((i) => (i === null ? i : (i + d + shots.length) % shots.length));
    },
    [shots.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close, step]);

  // Lock page scroll while open (also keeps the thumbnail where it was, so the
  // close animation lands back on it).
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (index === null || !shots[index]) return null;
  const shot = shots[index];
  const many = shots.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shot.caption || "Photo"}
      className="fixed inset-0 z-[100] flex flex-col"
      onClick={close}
    >
      <div ref={backdrop} className="absolute inset-0 bg-black/95" />

      <div className="relative flex items-center justify-between px-4 py-3 text-white sm:px-6">
        <span className="text-[13px] font-semibold text-white/60">
          {many ? `${index + 1} / ${shots.length}` : ""}
        </span>
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="grid size-10 place-items-center text-white transition-colors hover:text-[#FCD400]"
        >
          <X size={26} />
        </button>
      </div>

      <div ref={stage} className="relative flex-1 will-change-transform">
        <div ref={photo} key={shot.src} className="absolute inset-0">
          <Image
            src={shot.src}
            alt={shot.caption}
            fill
            sizes="100vw"
            className="object-contain px-2 sm:px-16"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      <div ref={chrome}>
        {many && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center bg-black/60 text-white transition-colors hover:bg-[#FCD400] hover:text-black sm:left-4"
            >
              <ChevronLeft size={26} />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center bg-black/60 text-white transition-colors hover:bg-[#FCD400] hover:text-black sm:right-4"
            >
              <ChevronRight size={26} />
            </button>
          </>
        )}
        <p className="relative min-h-14 px-5 py-4 text-center text-[14px] text-white/80 italic">
          {shot.caption}
        </p>
      </div>
    </div>
  );
}
