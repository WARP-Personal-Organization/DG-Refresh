import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../../prismicio-types";

interface RegionalStoriesProps {
  negrosStories: BlogPostDocument[];
  negrosTitle: string;
  sportsStories: BlogPostDocument[];
  sportsTitle: string;
}

const renderText = (richText: prismic.RichTextField): string => {
  if (!richText) return "";
  return prismicH.asText(richText);
};

// Reusable Publication Card
const PublicationCard = ({ title, imageUrl, link = "#" }: { title: string; imageUrl: string; link?: string; }) => (
  <div className="pt-6">
    <h3 className="bg-yellow-500 text-black text-xs font-bold uppercase px-3 py-1 inline-block mb-3">
      {title}
    </h3>
    <Link href={link} className="block group">
      <Image
        src={imageUrl}
        alt={title}
        width={400}
        height={520}
        className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-90"
      />
    </Link>
  </div>
);

// I've renamed the component for clarity, you can keep your original name if you prefer.
const NegrosAndSportsStories: React.FC<RegionalStoriesProps> = ({
  negrosStories,
  negrosTitle,
  sportsStories,
  sportsTitle,
}) => {
  if (!negrosStories || negrosStories.length === 0) {
    return null;
  }

  const mainNegrosStory = negrosStories[0];
  const supportingNegrosStories = negrosStories.slice(1, 4);

  // *** FIX: Removed the .slice(0, 2) to show ALL sports stories provided ***
  const allSportsStories = sportsStories;

  // Placeholder URLs
  const todayPaperUrl = "/Todays'News.PNG";
  const supplementUrl = "/Supplement.PNG";

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
          {/* === LEFT COLUMN (MAIN CONTENT) === */}
          <div className="lg:col-span-2 mb-10 lg:mb-0">
            {/* --- Negros Featured Story --- */}
            <div className="mb-12">
              <div className="mb-6 pb-3 border-b border-gray-700">
                <h2 className="text-2xl font-serif font-bold text-white">{negrosTitle}</h2>
              </div>
              <article className="group">
                <Link href={`/blog/${mainNegrosStory.uid}`} className="block">
                  {mainNegrosStory.data.featured_image?.url && (
                    <div className="relative aspect-video mb-4">
                      <Image
                        src={mainNegrosStory.data.featured_image.url}
                        alt={mainNegrosStory.data.featured_image.alt || "Story image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-yellow-500 text-sm font-medium uppercase">
                      {mainNegrosStory.data.category || "News"}
                    </p>
                    <h3 className="text-3xl font-serif font-bold text-white leading-tight">
                      {mainNegrosStory.data.title || "Untitled Article"}
                    </h3>
                  </div>
                </Link>
              </article>
            </div>

            {/* --- Sports Section --- */}
            {allSportsStories.length > 0 && (
              <div>
                <div className="mb-6 pb-3 border-b border-gray-700">
                  <h2 className="text-2xl font-serif font-bold text-white">{sportsTitle}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {allSportsStories.map((story) => (
                    <article key={story.id} className="group">
                      <Link href={`/blog/${story.uid}`} className="block">
                        {story.data.featured_image?.url && (
                          <div className="relative aspect-[16/10] mb-4">
                            <Image
                              src={story.data.featured_image.url}
                              alt={story.data.featured_image.alt || "Story image"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <p className="text-yellow-500 text-xs font-semibold uppercase mb-1">
                          {story.data.category || "Sports"}
                        </p>
                        <h4 className="text-lg font-serif font-bold text-white leading-tight">
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
                    <h4 className="text-lg font-serif font-bold text-white leading-tight">
                      {story.data.title || "Untitled Article"}
                    </h4>
                    <p className="text-xs text-gray-400 pt-2">
                      By {renderText(story.data.author) || "Staff"}
                    </p>
                  </Link>
                </article>
              ))}
              {/* Publications */}
              <PublicationCard title="Today's Paper" imageUrl={todayPaperUrl} />
              <PublicationCard title="Supplement" imageUrl={supplementUrl} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NegrosAndSportsStories;