import CartoonCard from "@/components/CartoonCard";
import { PublicationCard } from "@/components/PublicationCard";
import Image from "next/image";
import Link from "next/link";
import type { PaperEdition, Post, Publication } from "../../../lib/wordpress";
import AnimatedHeadline from "../AnimatedHeadline";

interface RegionalStoriesProps {
  negrosStories: Post[];
  negrosTitle: string;
  sportsStories: Post[];
  sportsTitle: string;
  allPosts: Post[];
  supplement?: Publication | null;
  supplementEditions?: PaperEdition[];
  cartoons?: Post[];
}

export default function NegrosAndSportsStories({
  negrosStories,
  negrosTitle,
  sportsStories,
  supplement,
  supplementEditions = [],
  cartoons = [],
}: RegionalStoriesProps) {
  if (!negrosStories || negrosStories.length === 0) {
    return null;
  }

  const mainNegrosStory = negrosStories[0];
  const supportingNegrosStories = negrosStories.slice(1, 4);
  const limitedSportsStories = sportsStories.slice(0, 6);

  return (
    <section className="bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
          {/* === LEFT COLUMN (MAIN CONTENT) === */}
          <div className="lg:col-span-2 mb-10 lg:mb-0">
            {/* --- Negros Featured Story --- */}
            <div className="mb-12">
              <div className="mb-8 pb-3 border-b-2 border-[#fbd203]">
                <h2 className="text-4xl font-playfair font-bold text-[#fbd203] uppercase tracking-widest">
                  {negrosTitle}
                </h2>
              </div>
              <article className="group">
                <Link href={`/blog/${mainNegrosStory.uid}`} className="block">
                  {mainNegrosStory.data.featured_image?.url && (
                    <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                      <Image
                        src={mainNegrosStory.data.featured_image.url}
                        alt={mainNegrosStory.data.featured_image.alt || "Story image"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  )}
                  <div className="space-y-3">
                    <span className="text-[#fbd203] text-xs font-bold uppercase tracking-widest font-roboto">
                      {mainNegrosStory.data.subcategory || mainNegrosStory.data.category || "News"}
                    </span>
                    <AnimatedHeadline
                      as="h3"
                      extraClassName="text-3xl text-[#fbd203] leading-tight"
                    >
                      {mainNegrosStory.data.title || "Untitled Article"}
                    </AnimatedHeadline>
                    {mainNegrosStory.data.summary && (
                      <p className="text-gray-400 leading-relaxed line-clamp-3 font-open-sans">
                        {mainNegrosStory.data.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-800 font-open-sans">
                      <span>{mainNegrosStory.data.author || "Staff Writer"}</span>
                      <span>·</span>
                      <span>
                        {new Date(mainNegrosStory.data.published_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      {mainNegrosStory.data.reading_time && (
                        <>
                          <span>·</span>
                          <span>{mainNegrosStory.data.reading_time} min read</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            </div>

            {/* --- Sports Section --- */}
            {limitedSportsStories.length > 0 && (
              <div>
                <div className="mb-8 pb-3 border-b-2 border-[#fbd203]">
                  <h2 className="text-4xl font-playfair font-bold text-[#fbd203] uppercase tracking-widest">
                    SPORTS
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {limitedSportsStories.map((story) => (
                    <article key={story.id} className="group">
                      <Link href={`/blog/${story.uid}`} className="block">
                        {story.data.featured_image?.url && (
                          <div className="relative aspect-[16/10] mb-4">
                            <Image
                              src={story.data.featured_image.url}
                              alt={
                                story.data.featured_image.alt || "Story image"
                              }
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <p className="text-accent text-xs font-semibold uppercase mb-1 font-sans">
                          {story.data.subcategory || story.data.category || "Sports"}
                        </p>
                        <h4 className="text-lg font-playfair font-bold text-foreground leading-tight transition-colors duration-200 group-hover:text-accent">
                          {story.data.title || "Untitled Article"}
                        </h4>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* === RIGHT COLUMN (SIDEBAR) === */}
          <div className="lg:col-span-1">
            <div className="flex flex-col divide-y divide-gray-700">
              {/* Supporting Negros Stories */}
              {supportingNegrosStories.map((story) => (
                <article key={story.id} className="group py-5 first:pt-0">
                  <Link href={`/blog/${story.uid}`} className="block">
                    <h4 className="text-lg font-playfair font-bold text-foreground leading-tight transition-colors duration-200 group-hover:text-accent">
                      {story.data.title || "Untitled Article"}
                    </h4>
                    <p className="text-xs text-gray-400 pt-2 font-sans">
                      By {story.data.author || "Staff"}
                    </p>
                  </Link>
                </article>
              ))}
            </div>

            {/* Supplement card */}
            <div className="pt-6">
              <PublicationCard
                title="Supplement"
                imageUrl={supplement?.imageUrl || "/Supplement.PNG"}
                link={
                  supplement?.link ||
                  "https://old.dailyguardian.com.ph/3d-flip-book/supplement/"
                }
                embedSrc={supplement?.embedSrc}
                pdfUrl={supplement?.pdfUrl}
                content={supplement?.content}
                editions={supplementEditions}
              />
            </div>

            {/* Lotto banner */}
            <a
              href="https://www.pcso.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 flex flex-col items-center justify-center rounded-lg overflow-hidden px-5 py-5 gap-2 transition-opacity hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, #00206e 0%, #0044cc 50%, #00206e 100%)",
              }}
              aria-label="PCSO Lotto Results"
            >
              {/* PCSO label */}
              <span
                className="text-white/60 font-black text-[11px] uppercase tracking-[0.3em]"
                style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
              >
                PCSO
              </span>
              {/* Main headline */}
              <span
                className="text-[#fcee16] font-black text-2xl uppercase leading-none tracking-tight text-center drop-shadow"
                style={{
                  fontFamily: "Impact, Arial Black, sans-serif",
                  textShadow: "0 0 16px rgba(252,238,22,0.35)",
                }}
              >
                LET&apos;S PLAY LOTTO
              </span>
              {/* Game pills */}
              <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                {["6/42", "6/45", "6/49", "6/55", "6/58", "3D", "4D"].map(
                  (g) => (
                    <span
                      key={g}
                      className="text-[10px] font-black text-white border border-white/25 rounded-sm px-2 py-0.5 bg-white/10 uppercase tracking-wider"
                      style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
                    >
                      {g}
                    </span>
                  ),
                )}
              </div>
              {/* CTA */}
              <span className="text-white/50 group-hover:text-[#fcee16] text-[10px] font-roboto uppercase tracking-widest mt-1 transition-colors">
                View Results →
              </span>
            </a>

            {/* Cartoon card */}
            {cartoons.length > 0 && (
              <div className="mt-4">
                <CartoonCard cartoons={cartoons} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
