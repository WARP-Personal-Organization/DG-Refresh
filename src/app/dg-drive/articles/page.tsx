import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArticlesExplorer from "@/components/dg-drive/ArticlesExplorer";
import ComingSoonCover from "@/components/dg-drive/ComingSoonCover";
import {
  ARTICLES,
  COMING_SOON,
  COPYRIGHT,
  DG_YELLOW,
} from "@/components/dg-drive/data";
import { montserrat } from "@/components/dg-drive/font";
import Reveal from "@/components/dg-drive/Reveal";

// DG Drive "All Articles" index. There is no Canva design for this page yet,
// so it reuses the landing page's language: a black hero over the yellow
// page, slanted bars and tags, and heavy Montserrat headings.

export const metadata: Metadata = {
  title: "All Articles | DG Drive",
  description:
    "Every DG Drive review, test drive, and comparison from Daily Guardian in one place.",
  alternates: { canonical: "https://www.dailyguardian.com.ph/dg-drive/articles" },
};

const NAVY = "#020015";
const BAR_CLIP = "polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%)";

// Newest first. Dates are display strings like "November 17, 2026".
const sorted = [...ARTICLES].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export default function DGDriveArticlesPage() {
  return (
    <main
      className={`${montserrat.className} overflow-hidden`}
      style={{ backgroundColor: DG_YELLOW }}
    >
      {/* ---------- Hero ---------- */}
      <section className="relative">
        <div
          className="dgd-wipe-article absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 90% at 0% 0%, #4a400c 0%, #1d1904 45%, #000 80%), #000",
            clipPath: "polygon(0 0, 100% 0, 100% 62%, 0 100%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 pt-8 pb-20 sm:px-8 sm:pb-28 lg:pb-36">
          <Reveal variant="left">
            <Link
              href="/dg-drive"
              className="group inline-flex items-center gap-2 text-[13px] font-bold text-white/70 transition-colors hover:text-[#FCD400]"
            >
              <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
              Back to DG Drive
            </Link>
          </Reveal>
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Reveal variant="left" delay={150} className="relative h-[44px] w-[190px] sm:h-[56px] sm:w-[244px]">
                <Image
                  src="/dg-drive/dg-drive-logo.png"
                  alt="DG Drive"
                  fill
                  priority
                  sizes="244px"
                  className="object-contain object-left"
                />
              </Reveal>
              <Reveal variant="left" delay={250}>
                <h1 className="mt-3 text-[44px] leading-[0.95] font-black text-white sm:text-[64px] lg:text-[80px]">
                  ALL ARTICLES
                </h1>
              </Reveal>
            </div>
            <Reveal variant="right" delay={350}>
              <p className="max-w-[38ch] text-[15px] leading-relaxed text-white/80 lg:text-right">
                Reviews, test drives, and comparisons from the DG Drive team.
                Driven, tested, experienced.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Listing ---------- */}
      <section className="relative mx-auto -mt-6 max-w-7xl px-5 pb-20 sm:-mt-10 sm:px-8">
        <Reveal variant="left">
          <h2
            className="mb-6 inline-block py-2.5 pr-12 pl-5 text-[22px] font-bold text-white sm:text-[26px]"
            style={{ backgroundColor: NAVY, clipPath: BAR_CLIP }}
          >
            BROWSE ALL
          </h2>
        </Reveal>
        <ArticlesExplorer articles={sorted} />

      </section>

      {/* ---------- Coming soon (black band for contrast) ---------- */}
      {COMING_SOON.length > 0 && (
        <section
          className="relative pt-20 pb-20 text-white sm:pt-24 sm:pb-24"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 100% 100%, #4a4214 0%, rgba(12,11,20,0) 100%), linear-gradient(180deg, #050409 0%, #0b0a12 100%)",
            clipPath: "polygon(0 56px, 100% 0, 100% calc(100% - 40px), 0 100%)",
          }}
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal variant="left">
              <h2
                className="inline-block py-2.5 pr-12 pl-5 text-[22px] font-bold text-black sm:text-[26px]"
                style={{ backgroundColor: DG_YELLOW, clipPath: BAR_CLIP }}
              >
                COMING SOON
              </h2>
            </Reveal>
            <p className="mt-3 mb-8 text-[13px] font-semibold text-white/60">
              New episodes in production. Check back soon.
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {COMING_SOON.map((ep, i) => (
                <Reveal key={ep.id} delay={i * 120}>
                  <div
                    className="relative aspect-[1270/720] overflow-hidden bg-neutral-900"
                    style={{ containerType: "inline-size" }}
                    aria-label={`${ep.subtitle}, coming soon`}
                  >
                    <ComingSoonCover
                      src={ep.image}
                      sizes="(min-width: 1024px) 22vw, 50vw"
                    />
                  </div>
                  <div className="h-1.5 sm:h-2" style={{ backgroundColor: DG_YELLOW }} />
                  <h3 className="pt-3 text-[15px] leading-tight font-black text-white sm:pt-4 sm:text-[19px] xl:text-[21px]">
                    {ep.subtitle}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-white/60 sm:text-[13.5px]">
                    {ep.descriptionLines.join(" ")}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Footer strip ---------- */}
      <section className="relative px-5 pt-6 pb-8 sm:px-8" style={{ backgroundColor: DG_YELLOW }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[22px] font-black text-black">Never miss a story.</p>
            <p className="mt-1 text-[13px] text-black/70">
              Follow DG Drive for the latest automotive news and reviews.
            </p>
          </div>
          <Link
            href="/dg-drive"
            className="inline-flex h-10 w-fit items-center bg-black px-6 text-[14px] font-bold text-[#FCD400] transition-colors hover:bg-neutral-800"
          >
            Go to DG Drive
          </Link>
        </div>
        <div className="mx-auto mt-8 max-w-7xl">
          <div className="h-[3px] w-40 bg-black" />
          <p className="mt-2 text-[11px] font-bold text-black">{COPYRIGHT}</p>
        </div>
      </section>
    </main>
  );
}
