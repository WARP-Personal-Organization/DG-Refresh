import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { Post } from "../../../lib/wordpress";
import AnimatedHeadline from "../AnimatedHeadline";
import FacebookPagePlugin from "../FacebookPagePlugin";

interface FeaturesStoriesProps {
  stories: Post[];
  title: string;
}

const AuthorByline = ({ story }: { story: Post }) => (
  <div className="text-accent text-sm font-medium uppercase tracking-wide mt-2 font-sans">
    {story.data.author}
  </div>
);

const FeaturesStories: React.FC<FeaturesStoriesProps> = ({
  stories,
  title,
}) => {
  if (!stories || stories.length === 0) {
    return null;
  }

  const mainStory = stories[0];
  const heroImageStory = stories.length > 1 ? stories[1] : null;
  const bottomStories = stories.length > 2 ? stories.slice(2, 8) : [];

  return (
    <section className="bg-background py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 pb-3 border-b-2 border-[#fbd203]">
          <h2 className="text-4xl font-playfair font-bold text-[#fbd203] uppercase tracking-widest">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-12">
          {/* === MAIN CONTENT AREA === */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            {/* === TOP ROW: Main Story + Landscape Image === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Top-Left Main Story */}
              {mainStory && (
                <article className="pl-4 pr-6 md:pl-4 md:pr-8">
                  <Link href={`/blog/${mainStory.uid}`} className="block group">
                    <AnimatedHeadline
                      as="h3"
                      extraClassName="text-4xl font-playfair font-bold text-accent leading-tight transition-colors duration-200 group-hover:text-accent"
                    >
                      {mainStory.data.title || "Untitled Article"}
                    </AnimatedHeadline>
                    <p className="text-gray-300 mt-4 text-lg font-sans">
                      {mainStory.data.summary}
                    </p>
                  </Link>
                </article>
              )}

              {/* Top-Right Landscape Image Story */}
              {heroImageStory && (
                <article className="md:border-l md:border-accent md:pl-8">
                  <Link
                    href={`/blog/${heroImageStory.uid}`}
                    className="block group"
                  >
                    {heroImageStory.data.featured_image?.url && (
                      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-md">
                        <Image
                          src={heroImageStory.data.featured_image.url}
                          alt={
                            heroImageStory.data.featured_image.alt ||
                            "Feature image"
                          }
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <h4 className="text-xl font-playfair font-bold text-foreground mt-4 transition-colors duration-200 group-hover:text-accent">
                      {heroImageStory.data.title}
                    </h4>
                    {heroImageStory.data.author && (
                      <AuthorByline story={heroImageStory} />
                    )}
                  </Link>
                </article>
              )}
            </div>

            {/* === BOTTOM ROW: Grid of smaller stories === */}
            {bottomStories.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10 border-t border-accent pt-8">
                {bottomStories.map((story) => (
                  <article key={story.id} className="group border-t border-gray-700 pt-4">
                    <Link href={`/blog/${story.uid}`} className="block">
                      {/* Thumbnail — shows image when available, fallback placeholder otherwise */}
                      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-md mb-3">
                        {story.data.featured_image?.url ? (
                          <Image
                            src={story.data.featured_image.url}
                            alt={story.data.featured_image.alt || story.data.title || "Article image"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <span className="text-gray-500 text-xs font-sans uppercase tracking-widest select-none">
                              Daily Guardian
                            </span>
                          </div>
                        )}
                      </div>

                      <h4 className="text-lg font-playfair font-bold text-foreground transition-colors duration-200 group-hover:text-accent leading-snug">
                        {story.data.title}
                      </h4>
                      {story.data.author && <AuthorByline story={story} />}
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* === SIDEBAR === */}
          <aside className="lg:col-span-1 lg:border-l lg:border-accent lg:pl-8 flex flex-col gap-6">
            <FacebookPagePlugin />
            <div className="rounded-xl overflow-hidden border border-accent/20">
              <iframe
                src="https://communities.rappler.com/channel-embed/zrqaCHLqMOVpuPEEoc?redirected_from=dailyguardian_embed&cta_text=Join%20the%20conversation"
                width="300"
                height="376"
                style={{ backgroundColor: "#ffffff", border: 0, width: "100%" }}
                title="Rappler Communities"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default FeaturesStories;
