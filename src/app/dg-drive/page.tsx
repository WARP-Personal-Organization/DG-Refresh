import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
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
  SPOTLIGHT,
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
// design is 1044 units wide and every position below is taken straight from
// it. --u is one unit, so the whole composition scales with the viewport and
// the diagonals always line up with the content.
const FRAME_W = 1044;
const FRAME_H = 2033;
const u = (n: number) => `calc(var(--u) * ${n})`;

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

/** Yellow play button over the "Latest" video thumbnail; appears on hover on desktop. */
function PlayBadge({
  size,
  alwaysVisible = false,
}: {
  size: string;
  alwaysVisible?: boolean;
}) {
  return (
    <span
      className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 ${
        alwaysVisible
          ? ""
          : "opacity-0 group-hover:bg-black/20 group-hover:opacity-100"
      }`}
    >
      <span
        className="flex items-center justify-center rounded-full shadow-xl transition-transform duration-300 group-hover:scale-110"
        style={{ width: size, height: size, backgroundColor: DG_YELLOW }}
      >
        <Play className="ml-[8%] h-[42%] w-[42%] fill-black text-black" />
      </span>
    </span>
  );
}

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
        {/* ---------- Background diagonals ---------- */}
        <div
          className="dgd-wipe absolute inset-0"
          style={{
            clipPath: "polygon(0 0, 54.5% 0, 0 62.52%)",
            background:
              "radial-gradient(ellipse 55% 30% at 0% 0%, #4a400c 0%, #1d1904 45%, #000 80%), #000",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            clipPath: "polygon(100% 33.2%, 100% 100%, 41.95% 100%)",
            background:
              "radial-gradient(ellipse 45% 22% at 100% 100%, #6e6226 0%, rgba(60,54,22,0.6) 45%, rgba(12,11,20,0) 100%), linear-gradient(180deg, #0c0a16 0%, #0b0a12 70%, #1d1b10 100%)",
          }}
        />

        {/* ---------- Hero ---------- */}
        <Abs x={58} y={29} w={386} h={89}>
          <Reveal variant="left" delay={350} className="relative h-full w-full">
            <Image
              src="/dg-drive/dg-drive-logo.png"
              alt="DG Drive"
              fill
              priority
              sizes="40vw"
              className="object-contain"
            />
          </Reveal>
        </Abs>

        <Abs
          x={68}
          y={140}
          className="text-white"
          style={{ fontSize: u(15), lineHeight: u(22.4) }}
        >
          <Reveal delay={550}>
            <span className="block whitespace-nowrap">
              {HERO.overviewTitle}
            </span>
            <Lines lines={HERO.overviewLines} />
          </Reveal>
        </Abs>

        <Abs
          x={406}
          y={226}
          w={600}
          className="text-right font-black text-black"
          style={{
            fontSize: u(51),
            lineHeight: u(54),
            letterSpacing: "-0.01em",
          }}
        >
          <h1>
            {HERO.taglineLines.map((line, i) => (
              <Reveal key={line} variant="right" delay={700 + i * 160}>
                <span className="block whitespace-nowrap">{line}</span>
              </Reveal>
            ))}
          </h1>
        </Abs>

        {/* ---------- Latest ---------- */}
        <Abs
          x={68}
          y={360}
          className="font-extrabold leading-none text-white"
          style={{ fontSize: u(36) }}
        >
          <Reveal variant="left">
            <h2>{LATEST.label}</h2>
          </Reveal>
        </Abs>

        <Abs x={0} y={412} w={600} h={51}>
          <Reveal
            variant="left"
            delay={120}
            className="h-full w-full"
            style={{
              backgroundColor: DG_YELLOW,
              clipPath: "polygon(9.17% 0, 100% 0, 100% 100%, 5% 100%)",
            }}
          />
        </Abs>
        <Abs
          x={68}
          y={412}
          h={51}
          className="flex items-center font-extrabold whitespace-nowrap text-black"
          style={{ fontSize: u(28) }}
        >
          <Reveal variant="left" delay={220}>
            <h3>{LATEST.heading}</h3>
          </Reveal>
        </Abs>

        <Abs x={0} y={463} w={FRAME_W} h={3} className="bg-black" />

        <Abs
          x={68}
          y={490}
          className="text-white"
          style={{ fontSize: u(15), lineHeight: u(22.3) }}
        >
          <Reveal delay={150}>
            <p>
              <Lines lines={LATEST.blurbLines} />
            </p>
          </Reveal>
        </Abs>

        <Abs x={392} y={500} w={612} h={347}>
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
              <PlayBadge size={u(72)} />
            </Link>
          </Reveal>
        </Abs>

        <Abs x={457} y={880} w={FRAME_W - 457} h={3} className="bg-black" />

        {/* ---------- Spotlight ---------- */}
        <Abs x={90} y={1030} w={520} h={148} className="opacity-90">
          <Reveal variant="zoom" delay={500} className="relative h-full w-full">
            <Image
              src={SPOTLIGHT.shadow}
              alt=""
              fill
              sizes="50vw"
              className="object-fill"
            />
          </Reveal>
        </Abs>
        <Abs x={26} y={793} w={520} h={347}>
          <Reveal variant="drive" className="relative h-full w-full">
            <Image
              src={SPOTLIGHT.image}
              alt={SPOTLIGHT.name}
              fill
              sizes="50vw"
              className="object-contain"
            />
          </Reveal>
        </Abs>

        <Abs x={563} y={919} w={241} h={38} style={{ fontSize: u(20) }}>
          <Reveal
            variant="right"
            delay={300}
            className="flex h-full w-full items-center justify-center bg-black font-semibold text-white"
          >
            <h3>{SPOTLIGHT.name}</h3>
          </Reveal>
        </Abs>
        <Abs
          x={600}
          y={972}
          className="text-black italic"
          style={{ fontSize: u(14.5), lineHeight: u(20.3) }}
        >
          <ul className="list-disc" style={{ paddingLeft: u(12) }}>
            {SPOTLIGHT.features.map((f, i) => (
              <li key={f} className="whitespace-nowrap">
                <Reveal variant="right" delay={450 + i * 110}>
                  {f}
                </Reveal>
              </li>
            ))}
          </ul>
        </Abs>

        {/* ---------- Browse articles ---------- */}
        <Abs x={0} y={1145} w={370} h={50}>
          <Reveal
            variant="left"
            className="h-full w-full bg-black"
            style={{ clipPath: "polygon(0 0, 100% 0, 93.2% 100%, 0 100%)" }}
          />
        </Abs>
        <Abs
          x={50}
          y={1145}
          h={50}
          className="flex items-center font-extrabold whitespace-nowrap text-white"
          style={{ fontSize: u(30) }}
        >
          <Reveal variant="left" delay={120}>
            <h2>BROWSE ARTICLES</h2>
          </Reveal>
        </Abs>

        <BrowseCarouselDesktop />

        {/* ---------- Never miss a story ---------- */}
        <Abs x={493} y={1724} w={500} className="text-right">
          <Reveal variant="right">
            <h2
              className="font-extrabold leading-none"
              style={{ fontSize: u(28), color: DG_YELLOW }}
            >
              {NEVER_MISS.heading}
            </h2>
            <p
              className="text-white"
              style={{ fontSize: u(10.6), lineHeight: u(15), marginTop: u(6) }}
            >
              {/* Two lines so the copy stays clear of the yellow diagonal. */}
              <Lines lines={NEVER_MISS.subLines} />
            </p>
          </Reveal>
        </Abs>

        {SOCIALS.map((s, i) => {
          const iconH = (s.icon.displayW * s.icon.h) / s.icon.w;
          const btnH = (s.button.displayW * s.button.h) / s.button.w;
          return (
            <Abs key={s.name} x={51 + i * 240.7} y={1800} w={219} h={171}>
              <Reveal delay={i * 120} className="h-full w-full">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`DG Drive on ${s.name}`}
                  className="group relative block h-full w-full bg-white shadow-[0_0_0_rgba(0,0,0,0)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
                  style={{ borderRadius: u(10) }}
                >
                  <span
                    className="absolute left-1/2 -translate-x-1/2 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      top: u(85 - iconH / 2),
                      width: u(s.icon.displayW),
                      height: u(iconH),
                    }}
                  >
                    <Image
                      src={s.icon.src}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                  </span>
                  <span
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      top: u(152 - btnH / 2),
                      width: u(s.button.displayW),
                      height: u(btnH),
                    }}
                  >
                    <Image
                      src={s.button.src}
                      alt={s.button.alt}
                      fill
                      sizes="130px"
                      className="object-contain"
                    />
                  </span>
                </a>
              </Reveal>
            </Abs>
          );
        })}

        {/* ---------- Copyright ---------- */}
        <Abs x={51} y={1993} w={200} h={3}>
          <Reveal variant="left" className="h-full w-full bg-black" />
        </Abs>
        <Abs
          x={51}
          y={2002}
          className="font-bold whitespace-nowrap text-black"
          style={{ fontSize: u(11) }}
        >
          {COPYRIGHT}
        </Abs>
      </div>
    </div>
  );
}

function DGDriveMobile() {
  return (
    <div className="overflow-hidden lg:hidden" style={{ backgroundColor: DG_YELLOW }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden px-5 pt-8 pb-24 text-white"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 0% 0%, #4a400c 0%, #1d1904 45%, #000 80%), #000",
          clipPath: "polygon(0 0, 100% 0, 100% 82%, 0 100%)",
        }}
      >
        <div className="relative h-[60px] w-[260px] sm:h-[80px] sm:w-[350px]">
          <Image
            src="/dg-drive/dg-drive-logo.png"
            alt="DG Drive"
            fill
            priority
            sizes="350px"
            className="object-contain object-left"
          />
        </div>
        <p className="mt-4 text-[14px] leading-relaxed">
          {HERO.overviewTitle}
          <br />
          {HERO.overviewLines.join(" ")}
        </p>
      </section>

      <div className="mt-2 px-5 text-right">
        <h1 className="text-[34px] leading-[1.05] font-black text-black sm:text-[46px]">
          {HERO.taglineLines.map((l, i) => (
            <Reveal key={l} variant="right" delay={200 + i * 150}>
              <span className="block">{l}</span>
            </Reveal>
          ))}
        </h1>
      </div>

      {/* Latest */}
      <section className="mt-8">
        <h2 className="px-5 text-[28px] font-extrabold leading-none text-black">
          {LATEST.label}
        </h2>
        <div className="mt-3 border-b-[3px] border-black bg-black">
          <h3
            className="ml-2 py-2.5 pl-6 text-[22px] font-extrabold text-black"
            style={{
              backgroundColor: DG_YELLOW,
              clipPath: "polygon(14px 0, 100% 0, 100% 100%, 0 100%)",
            }}
          >
            {LATEST.heading}
          </h3>
        </div>
        <div className="bg-black px-5 pt-5 pb-6 text-white">
          <p className="text-[15px] leading-relaxed">
            {LATEST.blurbLines.join(" ")}
          </p>
          <Reveal variant="zoom">
            <Link
              href={LATEST.href}
              className="relative mt-5 block aspect-[1270/720] w-full overflow-hidden"
            >
              <Image
                src={LATEST.thumbnail}
                alt={LATEST.thumbnailAlt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <PlayBadge size="52px" alwaysVisible />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Spotlight */}
      <section className="px-5 pt-8 pb-10">
        <div className="relative mx-auto aspect-[3/2] w-full max-w-[520px]">
          <div className="absolute right-[5%] bottom-[2%] left-[12%] h-[30%] opacity-90">
            <Image
              src={SPOTLIGHT.shadow}
              alt=""
              fill
              sizes="100vw"
              className="object-fill"
            />
          </div>
          <Reveal variant="drive" className="absolute inset-0">
            <Image
              src={SPOTLIGHT.image}
              alt={SPOTLIGHT.name}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </Reveal>
        </div>
        <h3 className="mt-4 inline-block bg-black px-6 py-2 text-[18px] font-semibold text-white">
          {SPOTLIGHT.name}
        </h3>
        <ul className="mt-3 list-disc pl-5 text-[14px] leading-relaxed text-black italic">
          {SPOTLIGHT.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      {/* Browse */}
      <section className="pb-10">
        <h2
          className="mb-5 inline-block bg-black py-2.5 pr-10 pl-5 text-[24px] font-extrabold text-white"
          style={{ clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)" }}
        >
          BROWSE ARTICLES
        </h2>
        <div className="px-5">
          <BrowseCarouselMobile />
        </div>
      </section>

      {/* Never miss a story */}
      <section
        className="px-5 pt-12 pb-8"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 100% 100%, #6e6226 0%, rgba(12,11,20,0) 100%), linear-gradient(180deg, #0c0a16 0%, #0b0a12 100%)",
        }}
      >
        <h2
          className="text-right text-[26px] font-extrabold leading-none"
          style={{ color: DG_YELLOW }}
        >
          {NEVER_MISS.heading}
        </h2>
        <p className="mt-2 text-right text-[12px] text-white">
          {NEVER_MISS.sub}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SOCIALS.map((s, i) => (
            <Reveal key={s.name} delay={i * 100}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`DG Drive on ${s.name}`}
                className="flex aspect-[219/171] flex-col items-center justify-center gap-4 rounded-[10px] bg-white transition-transform active:scale-95"
              >
                <span
                  className="relative"
                  style={{
                    width: s.icon.displayW * 0.8,
                    height: (s.icon.displayW * 0.8 * s.icon.h) / s.icon.w,
                  }}
                >
                  <Image
                    src={s.icon.src}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </span>
                <span
                  className="relative"
                  style={{
                    width: s.button.displayW * 0.85,
                    height:
                      (s.button.displayW * 0.85 * s.button.h) / s.button.w,
                  }}
                >
                  <Image
                    src={s.button.src}
                    alt={s.button.alt}
                    fill
                    sizes="130px"
                    className="object-contain"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
        <div
          className="mt-8 h-[3px] w-40"
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
