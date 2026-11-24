import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BrowseCarouselDesktop,
  BrowseCarouselMobile,
} from "@/components/dg-drive/BrowseCarousel";
import { montserrat } from "@/components/dg-drive/font";
import Reveal from "@/components/dg-drive/Reveal";
import {
  COPYRIGHT,
  DG_YELLOW,
  HERO,
  LATEST,
  NEVER_MISS,
  SOCIALS,
} from "@/components/dg-drive/data";

// DG Drive landing page, built 1:1 from the Canva design ("DG DRIVE - Website",
// page 1). All content is hardcoded in components/dg-drive/data.ts for now.

export const metadata: Metadata = {
  title: "DG Drive",
  description:
    "Driven. Tested. Experienced. Automotive news, reviews, and exclusive content from Daily Guardian.",
  alternates: { canonical: "https://www.dailyguardian.com.ph/dg-drive" },
};

// The desktop layout is an artboard measured in "frame units": the Canva
// design is 1366 units wide (y values are Canva's minus its 152-unit mock nav) and every position below is taken straight from
// it. --u is one unit, so the whole composition scales with the viewport and
// the diagonals always line up with the content.
const FRAME_W = 1366;
const FRAME_H = 2688;
const u = (n: number) => `calc(var(--u) * ${n})`;
// Canva's font sizes render ~0.864x of the same CSS size in Montserrat, so
// text sizes are scaled to match the design's measured glyph widths.
const fs = (n: number) => u(n * 0.864);

function Abs({
  x,
  y,
  w,
  h,
  className = "",
  style,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        left: u(x),
        top: u(y),
        width: w === undefined ? undefined : u(w),
        height: h === undefined ? undefined : u(h),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Lines({ lines }: { lines: readonly string[] }) {
  return lines.map((line) => (
    <span key={line} className="block whitespace-nowrap">
      {line}
    </span>
  ));
}

// Slowly breathing yellow glow in the corner of the hero's black panel.
function HeroGlow() {
  return (
    <div
      aria-hidden
      className="dgd-glow pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 45% 35% at 0% 0%, rgba(252,212,0,0.22) 0%, rgba(252,212,0,0) 70%)",
      }}
    />
  );
}

const SLANT_BAR = "polygon(6.4% 0, 100% 0, 93.6% 100%, 0 100%)";
const CAPTION_BAR = "polygon(7.6% 0, 100% 0, 92.4% 100%, 0 100%)";
const NAVY = "#020015";
// Where each platform icon sits relative to its card (Canva page 1).
const CARD_ICON = [
  { dx: 210, dy: 171, w: 66, h: 47 },
  { dx: 217, dy: 164, w: 54, h: 54 },
  { dx: 226, dy: 164, w: 52, h: 52 },
  { dx: 217, dy: 164, w: 55, h: 55 },
];

function DGDriveDesktop() {
  return (
    <div className="hidden lg:block" style={{ containerType: "inline-size" }}>
      <div
        className="relative w-full overflow-hidden"
        style={
          {
            "--u": `calc(100cqw / ${FRAME_W})`,
            height: u(FRAME_H),
            backgroundColor: DG_YELLOW,
          } as React.CSSProperties
        }
      >
        {/* ---------- Hero photo (ends level with the top of the LATEST bar) ---------- */}
        <div
          aria-hidden
          className="dgd-photo-bg absolute inset-x-0 top-0"
          style={{ height: u(662) }}
        />

        {/* ---------- Background diagonals ---------- */}
        {/* Yellow stripe peeking out from behind the black panel's diagonal */}
        <div
          aria-hidden
          className="dgd-wipe-stripe absolute inset-0"
          style={
            {
              "--stripe-clip": `polygon(0 0, calc(58.8% + ${u(7)}) 0, 0 calc(65.8% + ${u(15.4)}))`,
              clipPath: "var(--stripe-clip)",
              backgroundColor: DG_YELLOW,
            } as React.CSSProperties
          }
        />
        <div
          className="dgd-wipe absolute inset-0"
          style={{
            clipPath: "polygon(0 0, 58.8% 0, 0 65.8%)",
            background:
              "radial-gradient(ellipse 55% 30% at 0% 0%, #4a400c 0%, #1d1904 45%, #000 80%), #000",
          }}
        >
          <div className="absolute inset-x-0 top-0" style={{ height: u(662) }}>
            <HeroGlow />
          </div>
        </div>
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(100% 33.8%, 100% 100%, 40.8% 100%)",
            background:
              "radial-gradient(ellipse 45% 22% at 100% 100%, #6e6226 0%, rgba(60,54,22,0.6) 45%, rgba(12,11,20,0) 100%), linear-gradient(180deg, #0c0a16 0%, #0b0a12 70%, #1d1b10 100%)",
          }}
        />

        {/* ---------- Hero ---------- */}
        {/* x is offset left so the slanted "D"'s bottom corner lines up with
            the tagline and button at x=90 (the PNG has empty space there). */}
        <Abs x={74} y={188} w={509} h={117}>
          <Reveal variant="left" delay={350} className="relative h-full w-full">
            <Image
              src="/dg-drive/dg-drive-logo.png"
              alt="DG Drive"
              fill
              priority
              sizes="40vw"
              className="object-contain object-left"
            />
          </Reveal>
        </Abs>

        <Abs
          x={90}
          y={292}
          className="text-white"
          style={{ fontSize: fs(27.5), lineHeight: u(34) }}
        >
          <Reveal delay={450}>
            <h1 className="font-normal whitespace-nowrap">{HERO.tagline}</h1>
          </Reveal>
        </Abs>

        <Abs x={90} y={426} w={167} h={42}>
          <Reveal variant="left" delay={650} className="h-full w-full">
            <Link
              href="/dg-drive/articles"
              className="flex h-full w-full items-center justify-center font-bold text-black transition-colors hover:bg-white"
              style={{ fontSize: fs(21.3), backgroundColor: DG_YELLOW }}
            >
              {HERO.cta}
            </Link>
          </Reveal>
        </Abs>

        {/* ---------- Latest ---------- */}
        <Abs x={39} y={662} w={520} h={68}>
          <Reveal
            variant="left"
            className="h-full w-full"
            style={{ backgroundColor: DG_YELLOW, clipPath: SLANT_BAR }}
          />
        </Abs>
        <Abs
          x={89}
          y={662}
          h={68}
          className="flex items-center font-black text-black"
          style={{ fontSize: fs(42.67) }}
        >
          <Reveal variant="left" delay={120}>
            <h2>{LATEST.label}</h2>
          </Reveal>
        </Abs>

        <Abs x={402} y={731} w={FRAME_W - 402} h={3} className="bg-black" />

        <Abs
          x={90}
          y={762}
          className="text-white"
          style={{ fontSize: fs(21.33), lineHeight: u(29) }}
        >
          <Reveal delay={150}>
            <p>
              <Lines lines={LATEST.blurbLines} />
            </p>
          </Reveal>
        </Abs>

        <Abs x={436} y={786} w={818} h={464}>
          <Reveal variant="zoom" className="h-full w-full">
            <Link
              href={LATEST.href}
              className="group relative block h-full w-full overflow-hidden"
            >
              <Image
                src={LATEST.thumbnail}
                alt={LATEST.thumbnailAlt}
                fill
                priority
                sizes="60vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
            </Link>
          </Reveal>
        </Abs>

        <Abs x={598} y={1289} w={FRAME_W - 598} h={3} className="bg-black" />

        {/* ---------- Browse articles ---------- */}
        <div
          id="browse-articles"
          className="absolute scroll-mt-24"
          style={{ top: u(1478) }}
        />
        <Abs x={-35} y={1478} w={520} h={68}>
          <Reveal
            variant="left"
            className="h-full w-full"
            style={{ backgroundColor: NAVY, clipPath: SLANT_BAR }}
          />
        </Abs>
        <Abs
          x={65}
          y={1478}
          h={68}
          className="flex items-center font-bold whitespace-nowrap text-white"
          style={{ fontSize: fs(37.33) }}
        >
          <Reveal variant="left" delay={120}>
            <h2>BROWSE ARTICLES</h2>
          </Reveal>
        </Abs>

        <BrowseCarouselDesktop />

        {/* ---------- Never miss a story ---------- */}
        <Abs x={600} y={2294} w={700} className="text-right">
          <Reveal variant="right">
            <h2
              className="font-bold"
              style={{ fontSize: fs(37.33), lineHeight: u(52), color: DG_YELLOW }}
            >
              {NEVER_MISS.heading}
            </h2>
            <p
              className="whitespace-nowrap"
              style={{ fontSize: fs(14.67), lineHeight: u(20), color: DG_YELLOW }}
            >
              {NEVER_MISS.sub}
            </p>
          </Reveal>
        </Abs>

        {SOCIALS.map((s, i) => {
          const icon = CARD_ICON[i];
          return (
            <Abs key={s.name} x={65 + i * 316} y={2379} w={287} h={225}>
              <Reveal delay={i * 120} className="h-full w-full">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`DG Drive on ${s.name}`}
                  className="group relative block h-full w-full transition-transform duration-300 hover:-translate-y-1.5"
                >
                  <span
                    className="absolute inset-0 overflow-hidden bg-white shadow-[0_0_0_rgba(0,0,0,0)] transition-shadow duration-300 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
                    style={{ borderRadius: u(17) }}
                  >
                    <Image
                      src={s.card.image}
                      alt=""
                      fill
                      sizes="22vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: s.card.position }}
                    />
                  </span>
                  <span
                    className="absolute transition-transform duration-300 group-hover:scale-110"
                    style={{
                      left: u(icon.dx),
                      top: u(icon.dy),
                      width: u(icon.w),
                      height: u(icon.h),
                    }}
                  >
                    <Image
                      src={s.icon.src}
                      alt=""
                      fill
                      sizes="60px"
                      className="object-contain"
                    />
                  </span>
                  {/* Slanted caption bar with a black drop shadow */}
                  <span
                    className="absolute bg-black"
                    style={{
                      left: u(44),
                      top: u(209),
                      width: u(188),
                      height: u(31),
                      clipPath: CAPTION_BAR,
                    }}
                  />
                  <span
                    className="absolute flex items-center justify-center font-bold text-black"
                    style={{
                      left: u(56),
                      top: u(204),
                      width: u(188),
                      height: u(31),
                      fontSize: fs(18.67),
                      backgroundColor: DG_YELLOW,
                      clipPath: CAPTION_BAR,
                    }}
                  >
                    {s.card.caption}
                  </span>
                </a>
              </Reveal>
            </Abs>
          );
        })}

        {/* ---------- Copyright ---------- */}
        <Abs x={66} y={2638} w={263} h={3}>
          <Reveal variant="left" className="h-full w-full bg-black" />
        </Abs>
        <Abs
          x={69}
          y={2650}
          className="font-bold whitespace-nowrap text-black"
          style={{ fontSize: fs(13.33) }}
        >
          {COPYRIGHT}
        </Abs>
      </div>
    </div>
  );
}

// Phone / tablet layout (< lg). The desktop artboard is too wide to scale down,
// so this restacks the same content while keeping the design's language:
// black/yellow diagonals, slanted bars, and a dark wedge into the footer.
const MOBILE_DARK_BG =
  "radial-gradient(ellipse 80% 45% at 100% 100%, #6e6226 0%, rgba(12,11,20,0) 100%), linear-gradient(180deg, #0c0a16 0%, #0b0a12 100%)";

function DGDriveMobile() {
  return (
    <div
      className="overflow-hidden lg:hidden"
      style={{ backgroundColor: DG_YELLOW }}
    >
      {/* ---------- Hero ---------- */}
      {/* Full-bleed photo with the black panel laid over it on a diagonal (and
          a yellow stripe peeking out along the edge) — the desktop hero,
          rotated to fit a tall screen. The copy sits well above the diagonal. */}
      <section
        className="dgd-photo-bg relative isolate min-h-[540px] sm:min-h-[660px]"
        style={{ backgroundPosition: "65% center" }}
      >
        <div
          aria-hidden
          className="dgd-wipe-article absolute inset-0 -z-10"
          style={{
            backgroundColor: DG_YELLOW,
            clipPath: "polygon(0 0, 100% 0, 100% calc(46% + 9px), 0 calc(80% + 9px))",
          }}
        />
        <div
          aria-hidden
          className="dgd-wipe-article absolute inset-0 -z-10 overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 90% 50% at 0% 0%, #4a400c 0%, #1d1904 45%, #000 80%), #000",
            clipPath: "polygon(0 0, 100% 0, 100% 46%, 0 80%)",
          }}
        >
          <HeroGlow />
        </div>

        <div className="px-5 pt-12 sm:px-8 sm:pt-16">
          <Reveal
            variant="left"
            delay={300}
            className="relative aspect-[1596/367] w-[78vw] max-w-[400px]"
            style={{ marginLeft: "calc(min(78vw, 400px) * -0.031)" }}
          >
            <Image
              src="/dg-drive/dg-drive-logo.png"
              alt="DG Drive"
              fill
              priority
              sizes="(min-width: 640px) 400px, 78vw"
              className="object-contain object-left"
            />
          </Reveal>
          <Reveal delay={400}>
            <h1 className="mt-2 text-[18px] leading-snug font-normal text-white sm:text-[22px]">
              {HERO.tagline}
            </h1>
          </Reveal>
          <Reveal variant="left" delay={550}>
            <Link
              href="/dg-drive/articles"
              className="mt-7 inline-flex h-11 min-w-36 items-center justify-center px-6 text-[15px] font-bold text-black active:bg-white"
              style={{ backgroundColor: DG_YELLOW }}
            >
              {HERO.cta}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- Latest ---------- */}
      <section className="relative pb-10">
        {/* Black block with a slanted top, then a yellow wedge the thumbnail straddles */}
        <div
          className="absolute inset-0 bg-black"
          style={{ clipPath: "polygon(0 0, 100% 34px, 100% 100%, 0 100%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: DG_YELLOW,
            clipPath: "polygon(0 74%, 100% 52%, 100% 100%, 0 100%)",
          }}
        />
        <div className="relative pt-10">
          <Reveal variant="left">
            <h2
              className="mr-auto inline-block py-2 pr-12 pl-5 text-[30px] leading-none font-black text-black"
              style={{ backgroundColor: DG_YELLOW, clipPath: SLANT_BAR }}
            >
              {LATEST.label}
            </h2>
          </Reveal>
          <div className="mt-1 ml-[30%] h-[3px] bg-black" />
          <div className="px-5 pt-5">
            <Reveal delay={150}>
              <p className="max-w-[60ch] text-[15px] leading-relaxed text-white">
                {LATEST.blurbLines.join(" ")}
              </p>
            </Reveal>
            <Reveal variant="zoom" delay={150}>
              <Link
                href={LATEST.href}
                className="relative mt-6 block aspect-[1270/720] w-full overflow-hidden shadow-2xl"
              >
                <Image
                  src={LATEST.thumbnail}
                  alt={LATEST.thumbnailAlt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </Link>
            </Reveal>
          </div>
          <div className="mt-6 ml-[40%] h-[3px] bg-black" />
        </div>
      </section>

      {/* ---------- Browse articles ---------- */}
      <section id="browse-articles-m" className="scroll-mt-20 pb-16">
        <Reveal variant="left">
          <h2
            className="mb-5 inline-block py-2.5 pr-12 pl-5 text-[24px] font-bold text-white"
            style={{ backgroundColor: NAVY, clipPath: SLANT_BAR }}
          >
            BROWSE ARTICLES
          </h2>
        </Reveal>
        <div className="px-5">
          <BrowseCarouselMobile />
        </div>
      </section>

      {/* ---------- Never miss a story ---------- */}
      <section
        className="-mt-10 px-5 pt-20 pb-8"
        style={{
          background: MOBILE_DARK_BG,
          clipPath: "polygon(0 56px, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        <Reveal variant="right">
          <h2
            className="text-right text-[26px] leading-none font-bold"
            style={{ color: DG_YELLOW }}
          >
            {NEVER_MISS.heading}
          </h2>
          <p className="mt-2 text-right text-[12px]" style={{ color: DG_YELLOW }}>
            {NEVER_MISS.sub}
          </p>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4">
          {SOCIALS.map((s, i) => (
            <Reveal key={s.name} delay={i * 100}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`DG Drive on ${s.name}`}
                className="relative block aspect-[287/225] transition-transform active:scale-95"
              >
                <span className="absolute inset-0 overflow-hidden rounded-[10px] bg-white">
                  <Image
                    src={s.card.image}
                    alt=""
                    fill
                    sizes="50vw"
                    className="object-cover"
                    style={{ objectPosition: s.card.position }}
                  />
                </span>
                <span className="absolute right-[6%] bottom-[8%] h-[22%] w-[22%]">
                  <Image
                    src={s.icon.src}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </span>
                <span
                  className="absolute top-[94%] left-[14%] h-[14%] w-[66%] bg-black"
                  style={{ clipPath: CAPTION_BAR }}
                />
                <span
                  className="absolute top-[91%] left-[18%] flex h-[14%] w-[66%] items-center justify-center text-[12px] font-bold text-black"
                  style={{ backgroundColor: DG_YELLOW, clipPath: CAPTION_BAR }}
                >
                  {s.card.caption}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
        <div
          className="mt-10 h-[3px] w-40"
          style={{ backgroundColor: DG_YELLOW }}
        />
        <p className="mt-2 text-[11px] font-bold text-white">{COPYRIGHT}</p>
      </section>
    </div>
  );
}

export default function DGDrivePage() {
  return (
    <main className={montserrat.className}>
      <DGDriveDesktop />
      <DGDriveMobile />
    </main>
  );
}
