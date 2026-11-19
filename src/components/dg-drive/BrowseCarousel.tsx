"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ARTICLES } from "./data";

// Frame-unit helper shared with the desktop artboard (see dg-drive/page.tsx).
const u = (n: number) => `calc(var(--u) * ${n})`;

const AUTO_ADVANCE_MS = 6000;

function useCarousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [paused, setPaused] = useState(false);
  const count = ARTICLES.length;

  const go = (index: number, dir: "next" | "prev") => {
    setDirection(dir);
    setActive(((index % count) + count) % count);
  };
  const next = () => go(active + 1, "next");
  const prev = () => go(active - 1, "prev");

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setDirection("next");
      setActive((a) => (a + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [active, paused, count]);

  const at = (offset: number) => ARTICLES[(active + offset + count) % count];
  return { active, direction, paused, setPaused, go, next, prev, at, count };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Desktop: absolutely positioned pieces placed on the 1044-unit artboard,
 * matching the slanted carousel in the Canva design, plus arrows, a counter
 * and an autoplay progress bar beside the "Go to Article" button.
 */
export function BrowseCarouselDesktop() {
  const { active, direction, paused, setPaused, go, next, prev, at, count } = useCarousel();
  const current = at(0);
  const before = at(-1);
  const after1 = at(1);
  const after2 = at(2);
  const slide = direction === "next" ? "dgd-slide-next" : "dgd-slide-prev";

  return (
    <div
      className={paused ? "dgd-paused" : ""}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Previous card sliver, far left */}
      <button
        type="button"
        aria-label={`Show ${before.title}`}
        onClick={prev}
        className="group absolute overflow-hidden"
        style={{
          left: 0,
          top: u(1215),
          width: u(60),
          height: u(279),
          clipPath: "polygon(0 0, 92% 0, 0 90%)",
        }}
      >
        <Image key={before.id} src={before.thumb} alt="" fill sizes="80px" className="dg-drive-fade object-cover" />
        <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/10" />
      </button>

      {/* Active card */}
      <Link
        key={current.id}
        href={current.href}
        className={`group absolute block overflow-hidden ${slide}`}
        style={{
          left: 0,
          top: u(1215),
          width: u(692),
          height: u(279),
          clipPath: "polygon(10.1% 0, 100% 0, 81.6% 100%, 1% 100%)",
        }}
      >
        <Image
          src={current.image}
          alt={current.title}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
      </Link>

      {/* Next card (faded) */}
      <button
        type="button"
        aria-label={`Show ${after1.title}`}
        onClick={next}
        className="group absolute overflow-hidden"
        style={{
          left: u(588),
          top: u(1278),
          width: u(309),
          height: u(275),
          clipPath: "polygon(40.5% 0, 100% 0, 58.9% 100%, 0 100%)",
        }}
      >
        <Image
          key={after1.id}
          src={after1.thumb}
          alt=""
          fill
          sizes="30vw"
          className="dg-drive-fade object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-black/55 transition-colors duration-300 group-hover:bg-black/25" />
      </button>

      {/* Card after next (more faded, runs off the right edge) */}
      <button
        type="button"
        aria-label={`Show ${after2.title}`}
        onClick={() => go(active + 2, "next")}
        className="group absolute overflow-hidden"
        style={{
          left: u(792),
          top: u(1345),
          width: u(380),
          height: u(260),
          clipPath: "polygon(29.7% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        <Image
          key={after2.id}
          src={after2.thumb}
          alt=""
          fill
          sizes="30vw"
          className="dg-drive-fade object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-black/65 transition-colors duration-300 group-hover:bg-black/35" />
      </button>

      {/* Active article text */}
      <div
        key={`${current.id}-text`}
        className={`absolute text-black ${slide}`}
        style={{ left: u(51), top: u(1526), width: u(520) }}
      >
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

      <Link
        href={current.href}
        className="group absolute flex items-center justify-center gap-2 bg-black font-semibold text-white transition-colors hover:bg-neutral-800"
        style={{ left: u(52), top: u(1700), width: u(176), height: u(32), fontSize: u(15) }}
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
        {pad(active + 1)} <span className="opacity-40">/ {pad(count)}</span>
      </div>

      {/* Autoplay progress */}
      <div className="absolute overflow-hidden bg-black/15" style={{ left: u(52), top: u(1744), width: u(316), height: u(3) }}>
        {/* Re-keyed on pause too: the autoplay timer restarts from zero when
            the pointer leaves, so the bar must restart with it. */}
        <div
          key={`${active}-${paused}`}
          className="dgd-progress h-full bg-black"
          style={{ "--dur": `${AUTO_ADVANCE_MS}ms` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

/** Mobile / tablet: one slanted card at a time with arrows and dots. */
export function BrowseCarouselMobile() {
  const { active, direction, go, next, prev, at } = useCarousel();
  const current = at(0);
  const slide = direction === "next" ? "dgd-slide-next" : "dgd-slide-prev";

  return (
    <div>
      <div className="relative">
        <Link
          key={current.id}
          href={current.href}
          className={`relative block aspect-[16/9] overflow-hidden ${slide}`}
          style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)" }}
        >
          <Image src={current.image} alt={current.title} fill sizes="100vw" className="object-cover" />
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          {ARTICLES.map((a, i) => (
            <button
              key={a.id}
              type="button"
              aria-label={`Show ${a.title}`}
              onClick={() => go(i, i < active ? "prev" : "next")}
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

      <div key={`${current.id}-text`} className={`mt-5 text-black ${slide}`}>
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
  );
}
