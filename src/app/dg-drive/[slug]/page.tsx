import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ARTICLES,
  DG_YELLOW,
  getArticle,
  NEVER_MISS,
  SOCIALS,
  SPOTLIGHT,
  type ArticleBlock,
} from "@/components/dg-drive/data";
import { hasCleanPhoto } from "@/components/dg-drive/data";
import { montserrat } from "@/components/dg-drive/font";
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
            <div className="relative aspect-[1270/720] overflow-hidden">
              <Image
                src={block.src}
                alt={block.caption}
                fill
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 border-l-4 border-black pl-3 text-[13px] text-neutral-600 italic">
              {block.caption}
            </figcaption>
          </figure>
        </Reveal>
      );
    case "specs":
      return (
        <Reveal>
          <SpecCard />
        </Reveal>
      );
  }
}

export default async function DGDriveArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = ARTICLES.filter((a) => a.id !== article.id);

  return (
    <main className={montserrat.className}>
      <ReadingProgress targetId="dgd-article" />

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
            {/* Thumbnails already carry their own yellow frame and title art,
                so only clean photos get the slanted crop. */}
            <div
              className={`relative overflow-hidden shadow-2xl ${hasCleanPhoto(article) ? "aspect-[16/10]" : "aspect-[1270/720]"}`}
              style={
                hasCleanPhoto(article)
                  ? { clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0 100%)" }
                  : undefined
              }
            >
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
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
