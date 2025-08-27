import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../../prismicio-types";

interface LocalStoriesProps {
  stories: BlogPostDocument[];
  title: string;
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
      <div
        className={`h-full ${
          hasTopBorder ? "border-t-4 border-accent pt-4" : ""
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
        <h3 className="text-lg font-roboto font-bold text-foreground leading-tight mb-2 transition-colors duration-200 group-hover:text-accent">
          {story.data.title || "Untitled Article"}
        </h3>
        {story.data.summary && (
          <p className="text-gray-400 text-sm leading-relaxed font-sans">
            {renderText(story.data.summary).substring(0, 100)}...
          </p>
        )}
      </div>
    </Link>
  </article>
);

const LocalStories: React.FC<LocalStoriesProps> = ({ stories, title }) => {
  if (!stories || stories.length === 0) {
    return null;
  }

  const mainStory = stories[0];
  const otherStories = stories.slice(1, 4);

  return (
    // Section is transparent, inheriting the black background from page.tsx
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Title with a light-colored bottom border */}
      <div className="mb-6 pb-2 border-b border-gray-700">
        <h2 className="text-lg font-roboto font-semibold text-foreground uppercase tracking-widest">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
        {/* Main Story Area (Left Side) */}
        <div className="lg:col-span-8 mb-8 lg:mb-0">
          <article className="group h-full">
            <Link href={`/blog/${mainStory.uid}`} className="block h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                {/* Text Content - now with light colors */}
                <div className="flex flex-col">
                  <div className="flex-grow">
                    <span className="text-5xl text-gray-500 leading-none font-sans">
                      &quot;
                    </span>
                    <h3 className="text-3xl font-roboto font-bold text-foreground -mt-4 transition-colors duration-200 group-hover:text-accent">
                      {mainStory.data.title || "Untitled Article"}
                    </h3>
                    {mainStory.data.summary && (
                      <p className="text-gray-300 mt-4 text-sm leading-relaxed font-sans">
                        {renderText(mainStory.data.summary)}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-2 border-t border-gray-700">
                    <span className="text-xs font-medium text-gray-400 font-sans">
                      {renderText(mainStory.data.author) || "Staff"}
                    </span>
                  </div>
                </div>

                {/* Image */}
                {mainStory.data.featured_image?.url && (
                  <div className="relative w-full h-full min-h-[350px]">
                    <Image
                      src={mainStory.data.featured_image.url}
                      alt={mainStory.data.featured_image.alt || "Story image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </Link>
          </article>
        </div>

        {/* Secondary Stories List (Right Side) */}
        {/* A light-colored left border provides separation */}
        <div className="lg:col-span-4 lg:border-l lg:border-gray-700 lg:pl-8">
          <div className="space-y-6">
            {otherStories.map((story) => (
              <article key={story.id} className="group">
                <Link href={`/blog/${story.uid}`} className="block">
                  <span className="text-4xl text-gray-500 leading-none font-sans">
                    &quot;
                  </span>
                  <h4 className="text-base font-roboto font-bold text-foreground uppercase -mt-3 transition-colors duration-200 group-hover:text-accent">
                    {story.data.title || "Untitled Article"}
                  </h4>
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <span className="text-xs font-medium text-gray-400 font-sans">
                      By {renderText(story.data.author) || "Staff"}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalStories;
