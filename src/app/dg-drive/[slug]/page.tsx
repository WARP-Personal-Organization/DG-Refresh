import { ArrowLeft, ArrowRight, Calendar, Check, Clock, Expand, Minus, Play, User } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ARTICLES,
  COMING_SOON,
  DG_YELLOW,
  getArticle,
  NEVER_MISS,
  SOCIALS,
  SPOTLIGHT,
  type ArticleBlock,
} from "@/components/dg-drive/data";
import { hasCleanPhoto } from "@/components/dg-drive/data";
import { montserrat } from "@/components/dg-drive/font";
import ArticleLightbox from "@/components/dg-drive/ArticleLightbox";
import ReadingProgress from "@/components/dg-drive/ReadingProgress";
import RelatedSlider from "@/components/dg-drive/RelatedSlider";
import Reveal from "@/components/dg-drive/Reveal";
import ShareButtons from "@/components/dg-drive/ShareButtons";

// DG Drive article page. There is no Canva design for this page, so it is
// built from the landing page's visual language: black/yellow diagonals,
// slanted image frames, heavy Montserrat headings and yellow slanted bars.

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.id }));
}

type Props = { params: Promise<{ slug: string }> };

const titleCase = (s: string) =>
  s
    .toLowerCase()
    .replace(
      /(^|\s|-)(\w)/g,
      (_m, sep: string, c: string) => sep + c.toUpperCase(),
    );

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const title = `${titleCase(article.title)} ${article.subtitle.replace("ISUZU", "Isuzu")}`;
  return {
    title: `${title} | DG Drive`,
    description: article.dek,
    alternates: {
      canonical: `https://www.dailyguardian.com.ph/dg-drive/${article.id}`,
    },
    openGraph: {
      title,
      description: article.dek,
      images: [{ url: article.thumb }],
    },
  };
}

function SlantBar({ children }: { children: React.ReactNode }) {
  return (
    <Reveal variant="left">
      <h2
        className="mt-12 mb-5 inline-block py-2 pr-10 pl-5 text-[22px] font-extrabold text-black sm:text-[26px]"
        style={{
          backgroundColor: DG_YELLOW,
          clipPath: "polygon(12px 0, 100% 0, calc(100% - 18px) 100%, 0 100%)",
        }}
      >
        {children}
      </h2>
    </Reveal>
  );
}

/** Small "enlarge" badge that appears on hover over a zoomable photo. */
function ZoomHint() {
  return (
    <span
      className="absolute right-2 bottom-2 grid size-8 place-items-center bg-black/70 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      aria-hidden
    >
      <Expand size={16} />
    </span>
  );
}

function SpecCard() {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div
        className="absolute inset-y-0 right-0 w-[55%]"
        style={{
          backgroundColor: DG_YELLOW,
          clipPath: "polygon(35% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      />
      <div className="relative grid items-center gap-4 p-6 sm:grid-cols-2">
        <div>
          <p className="inline-block bg-white px-4 py-1.5 text-[16px] font-semibold text-black">
            {SPOTLIGHT.name}
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-[14.5px] italic">
            {SPOTLIGHT.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <Reveal variant="drive" className="relative aspect-[3/2]">
          <Image
            src={SPOTLIGHT.image}
            alt={SPOTLIGHT.name}
            fill
            sizes="(min-width: 640px) 360px, 90vw"
            className="object-contain"
          />
        </Reveal>
      </div>
    </div>
  );
}

function Block({ block, index }: { block: ArticleBlock; index: number }) {
  switch (block.type) {
    case "p":
      return index === 0 ? (
        <p className="text-[19px] leading-[1.75] font-medium text-black">
          {block.text}
        </p>
      ) : (
        <p className="mt-5 text-[17px] leading-[1.8] text-neutral-800">
          {block.text}
        </p>
      );
    case "h2":
      return <SlantBar>{block.text}</SlantBar>;
    case "quote":
      return (
        <Reveal variant="zoom">
          <blockquote className="relative my-10 overflow-hidden bg-black px-8 py-8 text-white">
            <span
              className="absolute inset-y-0 left-0 w-3"
              style={{ backgroundColor: DG_YELLOW }}
              aria-hidden
            />
            <p
              className="text-[24px] leading-snug font-extrabold italic sm:text-[28px]"
              style={{ color: DG_YELLOW }}
            >
              &ldquo;{block.text}&rdquo;
            </p>
            <footer className="mt-3 text-[13px] font-semibold tracking-widest text-white/70 uppercase">
              — {block.by}
            </footer>
          </blockquote>
        </Reveal>
      );
    case "image":
      return (
        <Reveal variant="zoom">
          <figure className="my-10">
            <button
              type="button"
              data-zoom={block.src}
              data-caption={block.caption}
              aria-label={`Enlarge photo: ${block.caption}`}
              className="group relative block aspect-[1270/720] w-full cursor-zoom-in overflow-hidden"
            >
              <Image
                src={block.src}
                alt={block.caption}
                fill
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <ZoomHint />
            </button>
            <figcaption className="mt-3 border-l-4 border-black pl-3 text-[13px] text-neutral-600 italic">
              {block.caption}
            </figcaption>
          </figure>
        </Reveal>
      );
    case "gallery":
      return (
        <Reveal variant="zoom">
          <div className="my-10 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {block.images.map((img, i) => (
              <figure
                key={img.src}
                className={i === 0 ? "col-span-2 sm:col-span-1" : undefined}
              >
                <button
                  type="button"
                  data-zoom={img.src}
                  data-caption={img.caption}
                  aria-label={`Enlarge photo: ${img.caption}`}
                  className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-black"
                >
                  <Image
                    src={img.src}
                    alt={img.caption}
                    fill
                    sizes="(min-width: 640px) 240px, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <ZoomHint />
                </button>
                <figcaption className="mt-1.5 text-[12px] font-semibold text-neutral-600">
                  {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      );
    case "list":
      return (
        <div className="mt-5">
          {block.intro && (
            <p className="text-[17px] leading-[1.8] font-semibold text-black">{block.intro}</p>
          )}
          <ul className="mt-3 space-y-3">
            {block.items.map((item) => (
              <li key={item.text} className="relative pl-6 text-[17px] leading-[1.7] text-neutral-800">
                <span
                  className="absolute top-[0.6em] left-0 h-2.5 w-3.5"
                  style={{
                    backgroundColor: DG_YELLOW,
                    clipPath: "polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)",
                  }}
                  aria-hidden
                />
                {item.label && <strong className="font-extrabold text-black">{item.label}: </strong>}
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      );
    case "proscons":
      return (
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-black p-6 text-white">
              <p
                className="inline-block px-3 py-1 text-[13px] font-extrabold tracking-wider text-black uppercase"
                style={{ backgroundColor: DG_YELLOW }}
              >
                What we like
              </p>
              <ul className="mt-4 space-y-3">
                {block.pros.map((t) => (
                  <li key={t} className="flex gap-2.5 text-[15px] leading-relaxed">
                    <Check size={18} className="mt-0.5 shrink-0" style={{ color: DG_YELLOW }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-[3px] border-black bg-white p-6">
              <p className="inline-block bg-black px-3 py-1 text-[13px] font-extrabold tracking-wider text-white uppercase">
                Weaknesses
              </p>
              <ul className="mt-4 space-y-3">
                {block.cons.map((t) => (
                  <li key={t} className="flex gap-2.5 text-[15px] leading-relaxed text-neutral-800">
                    <Minus size={18} className="mt-0.5 shrink-0 text-black" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      );
    case "specs":
      return (
        <Reveal>
          <div className="mt-8">
            <SpecCard />
          </div>
        </Reveal>
      );
  }
}

export default async function DGDriveArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = [...ARTICLES.filter((a) => a.id !== article.id), ...COMING_SOON];

  return (
    <main className={montserrat.className}>
      <ReadingProgress targetId="dgd-article" />
      <ArticleLightbox targetId="dgd-article" />

      {/* ---------- Hero ---------- */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: DG_YELLOW }}
      >
        <div
          className="dgd-wipe-article dgd-article-panel absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 0% 0%, #4a400c 0%, #1d1904 45%, #000 80%), #000",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-[1fr_1.1fr] lg:py-16">
          <div className="text-white">
            <Reveal variant="left">
              <Link
                href="/dg-drive"
                className="group inline-flex items-center gap-3 text-[13px] font-semibold tracking-widest text-white/70 uppercase transition-colors hover:text-white"
              >
                <ArrowLeft
                  size={15}
                  className="transition-transform group-hover:-translate-x-1"
                />
                <span className="relative block h-[22px] w-[96px]">
                  <Image
                    src="/dg-drive/dg-drive-logo.png"
                    alt="DG Drive"
                    fill
                    sizes="96px"
                    className="object-contain object-left"
                  />
                </span>
                <span>/ {article.category}</span>
              </Link>
            </Reveal>
            <Reveal variant="left" delay={150}>
              <h1 className="mt-6 text-[44px] leading-[0.95] font-black sm:text-[60px] lg:text-[72px]">
                {article.title}
              </h1>
            </Reveal>
            <Reveal variant="left" delay={280}>
              <p
                className="mt-3 text-[20px] font-extrabold sm:text-[26px]"
                style={{ color: DG_YELLOW }}
              >
                {article.subtitle}
              </p>
            </Reveal>
            <Reveal delay={420}>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/85">
                {article.dek}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-white/70">
                <span className="inline-flex items-center gap-2">
                  <User size={14} style={{ color: DG_YELLOW }} />{" "}
                  {article.author}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar size={14} style={{ color: DG_YELLOW }} />{" "}
                  {article.date}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock size={14} style={{ color: DG_YELLOW }} />{" "}
                  {article.readTime}
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal variant="right" delay={250}>
            {/* Plain rectangle at the image's own ratio, so nothing is cropped:
                clean photos are 16:9, thumbnails 1270x720. */}
            <div
              className={`relative overflow-hidden shadow-2xl ${article.video ? "group" : ""} ${hasCleanPhoto(article) ? "aspect-video" : "aspect-[1270/720]"}`}
            >
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className={`object-cover ${article.video ? "transition-transform duration-700 group-hover:scale-105" : ""}`}
              />
              {article.video && (
                <a
                  href={article.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch ${article.title} ${article.subtitle} on YouTube`}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 hover:bg-black/35"
                >
                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-full text-black shadow-[0_8px_30px_rgba(0,0,0,0.45)] ring-4 ring-black/20 transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20"
                    style={{ backgroundColor: DG_YELLOW }}
                  >
                    <Play className="ml-1 h-7 w-7 fill-current sm:h-9 sm:w-9" />
                  </span>
                </a>
              )}
            </div>
          </Reveal>
        </div>
        <div className="relative h-[3px] bg-black" />
      </section>

      {/* ---------- Body ---------- */}
      <div
        className="text-black"
        style={{
          background:
            "linear-gradient(180deg, #FFF6CC 0%, #FFFDF3 30%, #FFFFFF 100%)",
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article id="dgd-article" className="max-w-[720px]">
            {article.body.map((block, i) => (
              <Block key={i} block={block} index={i} />
            ))}

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t-[3px] border-black pt-6">
              <span className="text-[13px] font-extrabold tracking-widest uppercase">
                Share this story
              </span>
              <ShareButtons
                path={article.href}
                title={`${article.title} ${article.subtitle}`}
              />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-6">
              <div className="bg-black p-5 text-white">
                <p
                  className="text-[12px] font-bold tracking-widest uppercase"
                  style={{ color: DG_YELLOW }}
                >
                  Share
                </p>
                <div className="mt-3 [&_a]:border-white [&_a]:text-white [&_button]:border-white [&_button]:text-white">
                  <ShareButtons
                    path={article.href}
                    title={`${article.title} ${article.subtitle}`}
                  />
                </div>
              </div>

              <div className="border-[3px] border-black bg-white p-5">
                <p className="inline-block bg-black px-3 py-1 text-[13px] font-semibold text-white">
                  {SPOTLIGHT.name}
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] italic">
                  {SPOTLIGHT.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5" style={{ backgroundColor: DG_YELLOW }}>
                <p className="text-[18px] leading-tight font-extrabold">
                  {NEVER_MISS.heading}
                </p>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`DG Drive on ${s.name}`}
                      className="flex aspect-square items-center justify-center rounded-md bg-white transition-transform duration-200 hover:-translate-y-1"
                    >
                      <span className="relative h-7 w-7">
                        <Image
                          src={s.icon.src}
                          alt=""
                          fill
                          sizes="28px"
                          className="object-contain"
                        />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ---------- More from DG Drive ---------- */}
      <section className="relative overflow-hidden bg-black py-16">
        <div
          className="absolute inset-y-0 right-0 w-1/3"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 100% 100%, #6e6226 0%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal variant="left">
              <h2
                className="inline-block py-2.5 pr-12 pl-5 text-[24px] font-extrabold text-black sm:text-[30px]"
                style={{
                  backgroundColor: DG_YELLOW,
                  clipPath:
                    "polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%)",
                }}
              >
                MORE FROM DG DRIVE
              </h2>
            </Reveal>
            <Link
              href="/dg-drive"
              className="group inline-flex items-center gap-2 text-[14px] font-semibold text-white hover:text-[#FCD400]"
            >
              View all{" "}
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
          <div className="mt-6">
            <RelatedSlider articles={related} />
          </div>
        </div>
      </section>
    </main>
  );
}
