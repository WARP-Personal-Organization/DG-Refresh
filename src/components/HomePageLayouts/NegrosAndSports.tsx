import { PublicationCard } from "@/components/PublicationCard";
import RightSidebar from "@/components/RightSidebar";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "../../../lib/wordpress";
import AnimatedHeadline from "../AnimatedHeadline";

interface RegionalStoriesProps {
  negrosStories: Post[];
  negrosTitle: string;
  sportsStories: Post[];
  sportsTitle: string;
  allPosts: Post[];
}

export default function NegrosAndSportsStories({
  negrosStories,
  negrosTitle,
  sportsStories,
  allPosts,
}: RegionalStoriesProps) {
  if (!negrosStories || negrosStories.length === 0) {
    return null;
  }

  const mainNegrosStory = negrosStories[0];
  const supportingNegrosStories = negrosStories.slice(1, 4);
  const limitedSportsStories = sportsStories.slice(0, 6);

  // Use the top posts as editor's picks fallback
  const editorsPicks = allPosts
    .filter((p) => p.data.editors_pick)
    .slice(0, 4);

  return (
    <section className="bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
          {/* === LEFT COLUMN (MAIN CONTENT) === */}
          <div className="lg:col-span-2 mb-10 lg:mb-0">
            {/* --- Negros Featured Story --- */}
            <div className="mb-12">
              <div className="mb-6 pb-3 border-b border-[#fcee16]">
                <h2 className="text-2xl font-roboto font-bold text-foreground">
                  {negrosTitle}
                </h2>
              </div>
              <article className="group">
                <Link href={`/blog/${mainNegrosStory.uid}`} className="block">
                  {mainNegrosStory.data.featured_image?.url && (
                    <div className="relative aspect-video mb-4">
                      <Image
                        src={mainNegrosStory.data.featured_image.url}
                        alt={
                          mainNegrosStory.data.featured_image.alt ||
                          "Story image"
                        }
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-accent text-sm font-medium uppercase font-sans">
                      {mainNegrosStory.data.category || "News"}
                    </p>
                    <AnimatedHeadline
                      as="h3"
                      extraClassName="text-3xl font-playfair font-bold text-accent leading-tight transition-colors duration-200 group-hover:text-accent"
                    >
                      {mainNegrosStory.data.title || "Untitled Article"}
                    </AnimatedHeadline>
                  </div>
                </Link>
              </article>
            </div>

            {/* --- Sports Section --- */}
            {limitedSportsStories.length > 0 && (
              <div>
                <div className="mb-6 pb-3 border-b border-[#fcee16]">
                  <h2 className="text-2xl font-roboto font-bold text-foreground">
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
                          {story.data.category || "Sports"}
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

              <RightSidebar editorsPicks={editorsPicks} />
              <div className="pt-6">
                <PublicationCard
                  title="Supplement"
                  imageUrl={"/Supplement.PNG"}
                  link="https://dailyguardian.com.ph/3d-flip-book/supplement/"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
