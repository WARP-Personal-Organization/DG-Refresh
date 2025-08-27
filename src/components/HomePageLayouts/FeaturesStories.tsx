import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../../prismicio-types";

interface FeaturesStoriesProps {
  stories: BlogPostDocument[];
  title: string;
}

const renderText = (richText: prismic.RichTextField): string => {
  if (!richText) return "";
  return prismicH.asText(richText);
};

const AuthorByline = ({ story }: { story: BlogPostDocument }) => (
  <div className="text-yellow-500 text-sm font-medium uppercase tracking-wide mt-2">
    {renderText(story.data.author)}
  </div>
);

const FeaturesStories: React.FC<FeaturesStoriesProps> = ({ stories, title }) => {
  if (!stories || stories.length === 0) {
    return null;
  }

  const mainStory = stories[0];
  const heroImageStory = stories.length > 1 ? stories[1] : null;
  const bottomStories = stories.length > 2 ? stories.slice(2, 8) : [];

  const sidebarLinks = ["Moral Money", "Due Diligence", "Cryptocurrencies",];
  const facebookPostImageUrl = "/DGFacebook.PNG";

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 pb-4 border-b border-gray-700">
          <h2 className="text-2xl font-serif font-bold text-white">{title}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-12">
          {/* === MAIN CONTENT AREA === */}
          <div className="lg:col-span-3">
            {/* This is the master grid for the main content area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* === FIX: New column wrapper for the left side === */}
              <div className="flex flex-col gap-8">
                {/* Top-Left Main Story */}
                <article>
                  <Link href={`/blog/${mainStory.uid}`} className="block">
                    <h3 className="text-4xl font-serif font-bold text-white leading-tight">
                      {mainStory.data.title || "Untitled Article"}
                    </h3>
                    <p className="text-gray-300 mt-4 text-lg">
                      {renderText(mainStory.data.summary)}
                    </p>
                  </Link>
                </article>

                {/* Bottom Row of Stories - now guaranteed to be below the main story */}
                {bottomStories.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 border-t border-gray-800 pt-8">
                    {bottomStories.map((story) => (
                      <article key={story.id} className="group">
                        <Link href={`/blog/${story.uid}`} className="block border-t border-gray-700 pt-4">
                          <h4 className="text-lg font-serif font-bold text-white">
                            {story.data.title}
                          </h4>
                          {prismicH.asText(story.data.author) && <AuthorByline story={story} />}
                        </Link>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* Central Hero Image - no longer needs row-span */}
              {heroImageStory && (
                <div>
                  <Link href={`/blog/${heroImageStory.uid}`} className="block h-full w-full">
                    {heroImageStory.data.featured_image?.url && (
                      <div className="relative h-full min-h-[450px]">
                        <Image
                          src={heroImageStory.data.featured_image.url}
                          alt={heroImageStory.data.featured_image.alt || "Feature image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* === SIDEBAR === */}
          <div className="lg:col-span-1 lg:border-l lg:border-gray-800 lg:pl-8">
            <h3 className="font-bold text-yellow mb-4">More highlights</h3>
            <ul className="space-y-4">
              {sidebarLinks.map(link => (
                <li key={link} className="border-b border-gray-800 pb-4">
                  <Link href="#" className="hover:text-yellow-500 transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="#" className="block">
                <div className="relative w-full aspect-[9/16]">
                  <Image
                    src={facebookPostImageUrl}
                    alt="Daily Guardian on Facebook"
                    fill
                    className="object-contain object-top"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesStories;