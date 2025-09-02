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

// Reusable AuthorByline component using global CSS variables
const AuthorByline = ({ story }: { story: BlogPostDocument }) => (
  <div className="text-accent text-sm font-medium uppercase tracking-wide mt-2 font-sans">
    {renderText(story.data.author)}
  </div>
);

const FeaturesStories: React.FC<FeaturesStoriesProps> = ({
  stories,
  title,
}) => {
  if (!stories || stories.length === 0) {
    return null;
  }

  // Assign stories to the new layout structure
  const mainStory = stories[0];
  const heroImageStory = stories.length > 1 ? stories[1] : null;
  const bottomStories = stories.length > 2 ? stories.slice(2, 8) : [];

  const sidebarLinks = ["Moral Money", "Due Diligence", "Cryptocurrencies"];
  const facebookPostImageUrl = "/DGFacebook.PNG";

  return (
    <section className="bg-background py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 pb-4 border-b border-accent">
          <h2 className="text-2xl font-roboto font-bold text-foreground">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-12">
          {/* === MAIN CONTENT AREA === */}
          <div className="lg:col-span-3 flex flex-col gap-12">
            {/* === TOP ROW: Main Story + Landscape Image === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Top-Left Main Story */}
              {mainStory && (
                <article>
                  <Link href={`/blog/${mainStory.uid}`} className="block group">
                    <h3 className="text-4xl font-roboto font-bold text-foreground leading-tight transition-colors duration-200 group-hover:text-accent">
                      {mainStory.data.title || "Untitled Article"}
                    </h3>
                    <p className="text-gray-300 mt-4 text-lg font-sans">
                      {renderText(mainStory.data.summary)}
                    </p>
                  </Link>
                </article>
              )}

              {/* Top-Right Landscape Image Story */}
              {heroImageStory && (
                <article>
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
                    <h4 className="text-xl font-roboto font-bold text-foreground mt-4 transition-colors duration-200 group-hover:text-accent">
                      {heroImageStory.data.title}
                    </h4>
                    {prismicH.asText(heroImageStory.data.author) && (
                      <AuthorByline story={heroImageStory} />
                    )}
                  </Link>
                </article>
              )}
            </div>

            {/* === BOTTOM ROW: Grid of smaller stories === */}
            {bottomStories.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10 border-t border-default pt-8">
                {bottomStories.map((story) => (
                  <article key={story.id} className="group">
                    <Link
                      href={`/blog/${story.uid}`}
                      className="block border-t border-gray-700 pt-4"
                    >
                      <h4 className="text-lg font-roboto font-bold text-foreground transition-colors duration-200 group-hover:text-accent">
                        {story.data.title}
                      </h4>
                      {prismicH.asText(story.data.author) && (
                        <AuthorByline story={story} />
                      )}
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* === SIDEBAR === */}
          <aside className="lg:col-span-1 lg:border-l lg:border-default lg:pl-8">
            <h3 className="font-roboto font-bold text-foreground mb-4 text-lg">
              More Features
            </h3>
            <ul className="space-y-4">
              {sidebarLinks.map((link) => (
                <li key={link} className="border-b border-default pb-4">
                  <Link
                    href="#"
                    className="font-sans text-foreground transition-colors duration-200 hover:text-accent"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="#" className="block">
                <Image
                  src={facebookPostImageUrl}
                  alt="Daily Guardian on Facebook"
                  width={400}
                  height={710}
                  className="w-full h-auto"
                />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default FeaturesStories;
