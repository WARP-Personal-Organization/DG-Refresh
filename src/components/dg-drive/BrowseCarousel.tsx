"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ARTICLES } from "./data";

// Frame-unit helper shared with the desktop artboard (see dg-drive/page.tsx).
const u = (n: number) => `calc(var(--u) * ${n})`;

const AUTO_ADVANCE_MS = 6000;
const SLIDE_MS = 750;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

const N = ARTICLES.length;
// The article list is doubled so every visible slot (sliver, main, two
// previews) plus an off-screen slot on each side always has its own element,
// even with only three articles. Each element keeps its identity and just
// moves between slots, which is what makes the cards physically slide.
const VIRTUAL = [...ARTICLES, ...ARTICLES];
const V = VIRTUAL.length;

function useCarousel() {
  const [v, setV] = useState(0); // virtual index of the active card
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [paused, setPaused] = useState(false);

  const step = (delta: number) => {
    if (!delta) return;
    setDirection(delta > 0 ? "next" : "prev");
    setV((cur) => (((cur + delta) % V) + V) % V);
  };
  const next = () => step(1);
  const prev = () => step(-1);
  const goTo = (articleIndex: number) => {
    const current = v % N;
    let delta = articleIndex - current;
    if (delta > N / 2) delta -= N;
    if (delta < -N / 2) delta += N;
    step(delta);
  };

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setDirection("next");
      setV((cur) => (cur + 1) % V);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [v, paused]);

  return { v, active: v % N, direction, paused, setPaused, step, next, prev, goTo };
}

const pad = (n: number) => String(n).padStart(2, "0");

// Slot geometry in frame units, taken from the Canva design. Every clip-path
// has four points so the browser can animate between them.
type Slot = { x: number; y: number; w: number; h: number; clip: string; shade: number; opacity: number; z: number };
const SLOTS: Record<number, Slot> = {
  [-2]: { x: -420, y: 1215, w: 380, h: 279, clip: "polygon(30% 0, 100% 0, 70% 100%, 0 100%)", shade: 0.6, opacity: 0, z: 1 },
  [-1]: { x: 0, y: 1215, w: 60, h: 279, clip: "polygon(0 0, 92% 0, 0 90%, 0 90%)", shade: 0.3, opacity: 1, z: 10 },
  0: { x: 0, y: 1215, w: 692, h: 279, clip: "polygon(10.1% 0, 100% 0, 81.6% 100%, 1% 100%)", shade: 0, opacity: 1, z: 30 },
  1: { x: 588, y: 1278, w: 309, h: 275, clip: "polygon(40.5% 0, 100% 0, 58.9% 100%, 0 100%)", shade: 0.55, opacity: 1, z: 20 },
  2: { x: 792, y: 1345, w: 380, h: 260, clip: "polygon(29.7% 0, 100% 0, 100% 100%, 0 100%)", shade: 0.65, opacity: 1, z: 15 },
  3: { x: 1110, y: 1400, w: 380, h: 260, clip: "polygon(29.7% 0, 100% 0, 100% 100%, 0 100%)", shade: 0.7, opacity: 0, z: 1 },
};

/** Offset of virtual item i from the active one, normalised to -2..3. */
const offsetOf = (i: number, v: number) => {
  const o = (((i - v) % V) + V) % V;
  return o > V / 2 ? o - V : o === V / 2 ? 3 : o;
};

/**
 * Desktop: the slanted carousel from the Canva design. Cards slide between
 * the sliver, main and preview positions; arrows, a counter and an autoplay
 * progress bar sit beside the "Go to Article" button.
 */
export function BrowseCarouselDesktop() {
  const { v, active, direction, paused, setPaused, step, next, prev } = useCarousel();
  const router = useRouter();
  const current = ARTICLES[active];

  // Remember each card's previous slot: a card wrapping from one end to the
  // other (-2 <-> 3) must jump there without animating across the page.
  const prevOffsets = useRef<number[]>(VIRTUAL.map((_, i) => offsetOf(i, 0)));
  const offsets = VIRTUAL.map((_, i) => offsetOf(i, v));
  useLayoutEffect(() => {
    prevOffsets.current = offsets;
  });

  const textSlide = direction === "next" ? "dgd-text-next" : "dgd-text-prev";

  return (
    <div
      className={paused ? "dgd-paused" : ""}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {VIRTUAL.map((article, i) => {
        const offset = offsets[i];
        const slot = SLOTS[offset];
        const jumped = Math.abs(offset - prevOffsets.current[i]) > 1;
        const isMain = offset === 0;
        const visible = offset >= -1 && offset <= 2;
        const label = isMain ? `Read ${article.title}` : `Show ${article.title}`;
        return (
          <div
            key={`${article.id}-${i}`}
            role={visible ? (isMain ? "link" : "button") : undefined}
            aria-label={visible ? label : undefined}
            aria-hidden={visible ? undefined : true}
            tabIndex={visible ? 0 : -1}
            onClick={() => (isMain ? router.push(article.href) : visible && step(offset))}
            onKeyDown={(e) => {
              if (e.key !== "Enter" && e.key !== " ") return;
              e.preventDefault();
              if (isMain) router.push(article.href);
              else if (visible) step(offset);
            }}
            className="dgd-slide-card group absolute cursor-pointer overflow-hidden outline-none focus-visible:brightness-110"
            style={{
              left: u(slot.x),
              top: u(slot.y),
              width: u(slot.w),
              height: u(slot.h),
              clipPath: slot.clip,
              opacity: slot.opacity,
              zIndex: slot.z,
              pointerEvents: visible ? "auto" : "none",
              transition: jumped
                ? "none"
                : ["left", "top", "width", "height", "clip-path", "opacity"]
                    .map((p) => `${p} ${SLIDE_MS}ms ${EASE}`)
                    .join(", "),
            }}
          >
            {/* Preview thumbnail (with title art) and the clean main photo,
                cross-faded as the card moves into / out of the main slot. */}
            <Image
              src={article.thumb}
              alt=""
              fill
              sizes="30vw"
              className="object-cover transition-[opacity,transform] duration-700 group-hover:scale-105"
              style={{ opacity: isMain && article.image !== article.thumb ? 0 : 1 }}
            />
            {article.image !== article.thumb && (
              <Image
                src={article.image}
                alt={isMain ? article.title : ""}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover transition-[opacity,transform] duration-[1200ms] ease-out group-hover:scale-105"
                style={{ opacity: isMain ? 1 : 0 }}
              />
            )}
            <span
              className="absolute inset-0 bg-black opacity-[var(--shade)] transition-opacity duration-500 group-hover:opacity-[calc(var(--shade)*0.5)]"
              style={{ ["--shade" as string]: slot.shade }}
            />
          </div>
        );
      })}

      {/* Active article text */}
      <div className="absolute overflow-hidden" style={{ left: u(51), top: u(1520), width: u(560), height: u(170) }}>
        <div key={`${current.id}-text`} className={`text-black ${textSlide}`} style={{ paddingTop: u(6) }}>
          <h3 className="font-black leading-none" style={{ fontSize: u(38) }}>
            {current.title}
          </h3>
          <p className="font-extrabold leading-none" style={{ fontSize: u(21), marginTop: u(9) }}>
            {current.subtitle}
          </p>
          <p className="font-normal" style={{ fontSize: u(17.5), lineHeight: u(25), marginTop: u(13) }}>
            {current.descriptionLines.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>

      <Link
        href={current.href}
        className="group absolute flex items-center justify-center gap-2 bg-black font-semibold text-white transition-colors hover:bg-neutral-800"
        style={{ left: u(52), top: u(1700), width: u(176), height: u(32), fontSize: u(15), zIndex: 40 }}
      >
        Go to Article
        <ChevronRight
          className="-ml-1 transition-transform duration-300 group-hover:translate-x-1"
          style={{ width: u(15), height: u(15) }}
        />
      </Link>

      {/* Arrows + counter */}
      {[
        { label: "Previous article", onClick: prev, Icon: ChevronLeft, x: 240 },
        { label: "Next article", onClick: next, Icon: ChevronRight, x: 278 },
      ].map(({ label, onClick, Icon, x }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          onClick={onClick}
          className="absolute flex items-center justify-center border-2 border-black text-black transition-colors hover:bg-black hover:text-[#FCD400]"
          style={{ left: u(x), top: u(1700), width: u(32), height: u(32) }}
        >
          <Icon strokeWidth={3} style={{ width: u(18), height: u(18) }} />
        </button>
      ))}
      <div
        className="absolute font-extrabold text-black tabular-nums"
        style={{ left: u(322), top: u(1700), height: u(32), fontSize: u(14), lineHeight: u(32) }}
        aria-live="polite"
      >
        {pad(active + 1)} <span className="opacity-40">/ {pad(N)}</span>
      </div>

      {/* Autoplay progress */}
      <div className="absolute overflow-hidden bg-black/15" style={{ left: u(52), top: u(1744), width: u(316), height: u(3) }}>
        {/* Re-keyed on pause too: the autoplay timer restarts from zero when
            the pointer leaves, so the bar must restart with it. */}
        <div
          key={`${v}-${paused}`}
          className="dgd-progress h-full bg-black"
          style={{ "--dur": `${AUTO_ADVANCE_MS}ms` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

/** Mobile / tablet: a swipeable horizontal slider with arrows and dots. */
export function BrowseCarouselMobile() {
  const { active, direction, goTo, next, prev, setPaused } = useCarousel();
  const current = ARTICLES[active];
  const textSlide = direction === "next" ? "dgd-text-next" : "dgd-text-prev";
  const touchX = useRef<number | null>(null);

  return (
    <div>
      <div
        className="overflow-hidden"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
          setPaused(true);
        }}
        onTouchEnd={(e) => {
          const start = touchX.current;
          touchX.current = null;
          setPaused(false);
          if (start === null) return;
          const dx = e.changedTouches[0].clientX - start;
          if (dx < -40) next();
          else if (dx > 40) prev();
        }}
      >
        <div
          className="flex"
          style={{ transform: `translateX(-${active * 100}%)`, transition: `transform ${SLIDE_MS}ms ${EASE}` }}
        >
          {ARTICLES.map((a, i) => (
            <Link
              key={a.id}
              href={a.href}
              aria-hidden={i !== active}
              tabIndex={i === active ? 0 : -1}
              className="relative block aspect-[16/9] w-full shrink-0 overflow-hidden"
              style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)" }}
            >
              <Image src={a.image} alt={a.title} fill sizes="100vw" className="object-cover" />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          {ARTICLES.map((a, i) => (
            <button
              key={a.id}
              type="button"
              aria-label={`Show ${a.title}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-black" : "w-2 bg-black/30"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous article"
            onClick={prev}
            className="flex h-9 w-9 items-center justify-center border-2 border-black text-black active:bg-black active:text-[#FCD400]"
          >
            <ChevronLeft size={18} strokeWidth={3} />
          </button>
          <button
            type="button"
            aria-label="Next article"
            onClick={next}
            className="flex h-9 w-9 items-center justify-center border-2 border-black text-black active:bg-black active:text-[#FCD400]"
          >
            <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden">
        <div key={`${current.id}-text`} className={`text-black ${textSlide}`}>
          <h3 className="text-[28px] font-black leading-none">{current.title}</h3>
          <p className="mt-2 text-[17px] font-extrabold leading-none">{current.subtitle}</p>
          <p className="mt-3 text-[15px] leading-relaxed">{current.descriptionLines.join(" ")}</p>
          <Link
            href={current.href}
            className="mt-5 inline-flex h-10 items-center gap-2 bg-black px-7 text-[14px] font-semibold text-white"
          >
            Go to Article <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
