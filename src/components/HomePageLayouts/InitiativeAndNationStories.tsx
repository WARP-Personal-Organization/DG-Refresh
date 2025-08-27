import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../../prismicio-types";

// New props for our combined component
interface ContentShowcaseProps {
  initiativeStories: BlogPostDocument[];
  initiativeTitle: string;
  nationStories: BlogPostDocument[];
  nationTitle: string;
}

const renderText = (richText: prismic.RichTextField): string => {
  if (!richText) return "";
  return prismicH.asText(richText);
};

// A reusable card for displaying individual stories in the grid
const StoryCard = ({
  story,
  hasTopBorder = false,
}: {
  story: BlogPostDocument;
  hasTopBorder?: boolean;
}) => (
  <article className="group">
    <Link href={`/blog/${story.uid}`} className="block">
      {/* === CHANGE APPLIED HERE: Border color updated to brand yellow === */}
      <div
        className={`h-full ${
          hasTopBorder ? "border-t-4 border-[#fcee16] pt-4" : ""
        }`}
      >
        {story.data.featured_image?.url && (
          <div className="relative aspect-video mb-4 overflow-hidden">
            <Image
              src={story.data.featured_image.url}
              alt={story.data.featured_image.alt || "Story image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <h3 className="text-lg font-serif font-bold text-white leading-tight mb-2">
          {story.data.title || "Untitled Article"}
        </h3>
        {story.data.summary && (
          <p className="text-gray-400 text-sm leading-relaxed">
            {renderText(story.data.summary).substring(0, 100)}...
          </p>
        )}
      </div>
    </Link>
  </article>
);

// The main combined component
const ContentShowcaseSection: React.FC<ContentShowcaseProps> = ({
  initiativeStories,
  initiativeTitle,
  nationStories,
  nationTitle,
}) => {
  // Take the first 3 stories for each section to fit the layout
  const initiativeItems = initiativeStories.slice(0, 3);
  const nationItems = nationStories.slice(0, 3);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {/* === INITIATIVE STORIES ROW === */}
        {initiativeItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Intro Column */}
            <div className="lg:pr-8">
              <h2 className="text-2xl font-serif font-bold text-white mb-3">
                {initiativeTitle}
              </h2>
              <p className="text-gray-300 mb-4">
                Discover key initiatives and projects making an impact across
                various sectors.
              </p>
              {/* === CHANGE APPLIED HERE: Link color updated to brand yellow === */}
              <Link
                href={`/${initiativeTitle.toLowerCase()}`}
                className="text-[#fcee16] font-semibold hover:underline"
              >
                Explore all initiatives
              </Link>
            </div>
            {/* Story Cards */}
            {initiativeItems.map((story) => (
              <div key={story.id} className="lg:col-span-1">
                <StoryCard story={story} />
              </div>
            ))}
          </div>
        )}

        {/* === NATION STORIES ROW === */}
        {nationItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-12 border-t border-gray-800">
            {/* Intro Column */}
            <div className="lg:pr-8">
              <h2 className="text-2xl font-serif font-bold text-white mb-3">
                {nationTitle}
              </h2>
              <p className="text-gray-300 mb-4">
                Gain access to exclusive coverage and analysis of national
                developments.
              </p>
              {/* === CHANGE APPLIED HERE: Link color updated to brand yellow === */}
              <Link
                href={`/${nationTitle.toLowerCase()}`}
                className="text-[#fcee16] font-semibold hover:underline"
              >
                Explore national news
              </Link>
            </div>
            {/* Story Cards with Top Border */}
            {nationItems.map((story) => (
              <div key={story.id} className="lg:col-span-1">
                <StoryCard story={story} hasTopBorder={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContentShowcaseSection;