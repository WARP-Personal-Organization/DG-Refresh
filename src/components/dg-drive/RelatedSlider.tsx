import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DG_YELLOW, type DriveArticle } from "./data";

/**
 * "More from DG Drive": an endlessly sliding row of slanted (trapezoid) cards.
 * Hovering pauses the row and pops the card up: it lifts, scales and its
 * slanted crop opens to a full rectangle so the whole thumbnail shows.
 * Pure CSS (see .dgd-marquee* in globals.css); reduced-motion users get a
 * static, horizontally scrollable row instead.
 */
export default function RelatedSlider({
  articles,
}: {
  articles: DriveArticle[];
}) {
  if (!articles.length) return null;

  // Repeat until the row is comfortably wider than the screen, then double it
  // so translating by -50% loops seamlessly.
  const base: DriveArticle[] = [];
  while (base.length < 6) base.push(...articles);
  const track = [...base, ...base];

  return (
    <div
      className="dgd-marquee relative -mx-5 overflow-hidden py-8 sm:mx-0"
      // Edge fade as a mask, so it blends with whatever background sits behind.
      style={{
        maskImage:
          "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
      }}
    >
      <div
        className="dgd-marquee-track flex w-max"
        style={
          { "--dgd-marquee-dur": `${base.length * 7}s` } as React.CSSProperties
        }
      >
        {track.map((article, i) => (
          <Link
            key={`${article.id}-${i}`}
            href={article.href}
            aria-hidden={i >= base.length ? true : undefined}
            tabIndex={i >= base.length ? -1 : undefined}
            className="dgd-pop group relative -mr-10 block w-[78vw] shrink-0 sm:w-[420px] lg:w-[460px]"
          >
            <div className="dgd-pop-shape relative aspect-[1270/720] overflow-hidden">
              <Image
                src={article.thumb}
                alt={article.title}
                fill
                sizes="(min-width: 1024px) 460px, (min-width: 640px) 420px, 78vw"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-black/25 transition-opacity duration-300 group-hover:opacity-0" />
            </div>
            <div className="mt-4 pr-16 pl-10 transition-transform duration-300 group-hover:translate-x-2">
              <p
                className="text-[12px] font-bold tracking-widest uppercase"
                style={{ color: DG_YELLOW }}
              >
                {article.category} · {article.date}
              </p>
              <h3 className="mt-1 text-[22px] leading-tight font-black text-white">
                {article.title}
              </h3>
              <p className="text-[14px] font-extrabold text-white/80">
                {article.subtitle}
              </p>
              <span className="mt-2 inline-flex items-center gap-2 text-[14px] font-semibold text-white transition-colors group-hover:text-[#FCD400]">
                Read Article
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
