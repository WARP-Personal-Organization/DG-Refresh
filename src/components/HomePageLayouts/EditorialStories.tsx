import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../../prismicio-types";

interface EditorialStoriesProps {
  stories: BlogPostDocument[];
  title: string;
}

const renderText = (richText: prismic.RichTextField): string => {
  if (!richText) return "";
  return prismicH.asText(richText);
};

const calculateReadTime = (summary: prismic.RichTextField): string => {
  const text = prismicH.asText(summary);
  if (!text) return "4 MIN READ";
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} MIN READ`;
};

const EditorialStories: React.FC<EditorialStoriesProps> = ({
  stories,
  title,
}) => {
  if (!stories || stories.length === 0) {
    return null;
  }

  const mainStory = stories[0];
  const heroImageStory = stories.length > 1 ? stories[1] : null;
  const secondaryStories = stories.length > 2 ? stories.slice(2, 5) : [];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 pb-4 border-b border-gray-700">
          <h2 className="text-2xl font-serif font-bold text-white">{title}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* === COLUMN 1: Main Featured Article === */}
          <div className="lg:col-span-1">
            <article className="h-full">
              <Link href={`/blog/${mainStory.uid}`} className="block group">
                {/* === CHANGE APPLIED HERE === */}
                <h3 className="text-5xl font-serif font-bold text-white leading-tight group-hover:text-[#fcee16] transition-colors">
                  {mainStory.data.title || "Untitled Article"}
                </h3>
                <p className="text-gray-300 mt-4 text-base leading-relaxed">
                  {renderText(mainStory.data.summary)}
                </p>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-4">
                  {calculateReadTime(mainStory.data.summary)}
                </p>
              </Link>
            </article>
          </div>

          {/* === COLUMN 2: Hero Image (FIXED: Now Landscape) === */}
          {heroImageStory && (
            <div className="lg:col-span-1">
              <Link
                href={`/blog/${heroImageStory.uid}`}
                className="block group"
              >
                {heroImageStory.data.featured_image?.url && (
                  <div className="relative w-full aspect-[16/10] overflow-hidden rounded-md">
                    <Image
                      src={heroImageStory.data.featured_image.url}
                      alt={
                        heroImageStory.data.featured_image.alt || "Editorial"
                      }
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                {/* === CHANGE APPLIED HERE === */}
                <h4 className="text-xl font-serif font-bold text-white mt-4 group-hover:text-[#fcee16] transition-colors">
                  {heroImageStory.data.title || "Untitled Article"}
                </h4>
              </Link>
            </div>
          )}

          {/* === COLUMN 3: Secondary Stories List === */}
          {secondaryStories.length > 0 && (
            <div className="lg:col-span-1">
              <div className="flex flex-col">
                {secondaryStories.map((story, index) => (
                  <article
                    key={story.id}
                    className={`py-6 ${
                      index > 0 ? "border-t border-gray-800" : "pt-0"
                    }`}
                  >
                    <Link href={`/blog/${story.uid}`} className="block group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow">
                          {/* === CHANGE APPLIED HERE === */}
                          <p className="text-xs text-[#fcee16] font-bold uppercase mb-1">
                            {story.data.category || "Editorial"}
                          </p>
                          {/* === CHANGE APPLIED HERE === */}
                          <h4 className="text-xl font-serif font-bold text-white leading-tight group-hover:text-[#fcee16] transition-colors">
                            {story.data.title || "Untitled Article"}
                          </h4>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-3">
                            {calculateReadTime(story.data.summary)}
                          </p>
                        </div>
                        {story.data.featured_image?.url && (
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <Image
                              src={story.data.featured_image.url}
                              alt={story.data.featured_image.alt || ""}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EditorialStories;