import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../../prismicio-types";

interface TopStoriesProps {
  stories: BlogPostDocument[];
  title: string;
}

const renderText = (richText: prismic.RichTextField): string => {
  if (!richText) return "";
  return prismicH.asText(richText);
};

// Separator adapted for a dark background
const DottedSeparator = () => (
  <div className="w-full border-t border-dotted border-gray-700" />
);

const TopStories: React.FC<TopStoriesProps> = ({ stories, title }) => {
  // Taking 4 stories for the 4-column layout
  const topStories = stories.slice(0, 4);

  if (topStories.length === 0) {
    return null;
  }

  return (
    // The section is transparent, inheriting the black background from page.tsx
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header with light text and borders */}
        <div className="text-center mb-8 space-y-4">
          <DottedSeparator />
          <h2 className="text-sm font-semibold text-white uppercase tracking-[0.2em]">
            {title}
          </h2>
          <DottedSeparator />
        </div>

        {/* Stories Grid with light vertical separators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:divide-x md:divide-gray-700">
          {topStories.map((story) => (
            <article key={story.id} className="group px-4 mb-8 md:mb-0">
              <Link href={`/blog/${story.uid}`} className="block">
                {/* Image remains the same */}
                {story.data.featured_image?.url && (
                  <div className="relative aspect-[16/10] mb-4 overflow-hidden">
                    <Image
                      src={story.data.featured_image.url}
                      alt={story.data.featured_image.alt || "Story image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 25vw"
                    />
                  </div>
                )}

                {/* Story Content with light text */}
                <div className="space-y-2">
                  {/* Category color changed to be bright and visible (like your original) */}
                  <p className="text-sm font-semibold text-yellow-500 uppercase">
                    {story.data.category || "News"}
                  </p>

                  {/* Headline with white text */}
                  <h3 className="text-xl font-serif font-bold text-white leading-tight">
                    {story.data.title || "Untitled Article"}
                  </h3>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopStories;