// Historically rendered both Negros and Sports together. Negros now lives in its
// own LocalStories-style block on the homepage to keep section layouts uniform;
// this component is the Sports + supplement + lotto sidebar combo.
import { PublicationCard } from "@/components/PublicationCard";
import Image from "next/image";
import Link from "next/link";
import type { PaperEdition, Post, Publication } from "../../../lib/wordpress";

interface RegionalStoriesProps {
  sportsStories: Post[];
  sportsTitle: string;
  supplement?: Publication | null;
  supplementEditions?: PaperEdition[];
}

export default function NegrosAndSportsStories({
  sportsStories,
  supplement,
  supplementEditions = [],
}: RegionalStoriesProps) {
  if (!sportsStories || sportsStories.length === 0) {
    return null;
  }

  const limitedSportsStories = sportsStories.slice(0, 6);

  return (
    <section className="bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
          {/* === LEFT COLUMN (MAIN CONTENT) === */}
          <div className="lg:col-span-2 mb-10 lg:mb-0">
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
            {/* Supplement card */}
            <div>
              <PublicationCard
                title="Supplement"
                imageUrl={supplement?.imageUrl || "/Supplement.PNG"}
                link={supplement?.link || "/"}
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
              className="group mt-4 block overflow-hidden rounded-lg transition-opacity hover:opacity-90"
              aria-label="PCSO Lotto Results"
            >
              <Image
                src="https://old.dailyguardian.com.ph/wp-content/uploads/2026/03/PCSO-lets-play-lottoxx.webp"
                alt="PCSO — Let's Play Lotto"
                width={700}
                height={180}
                className="w-full h-auto"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}
