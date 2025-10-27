import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../prismicio-types";
import AnimatedHeadline from "./AnimatedHeadline";

interface MainContentProps {
  heroPost?: BlogPostDocument;
  featuredPost?: BlogPostDocument;
  editorialPost?: BlogPostDocument;
  localposts?: BlogPostDocument;
  editorsPicks?: BlogPostDocument[];
}

// Helper function to render Prismic rich text
const renderText = (richText: prismic.RichTextField): string => {
  if (!richText) return "";
  return prismicH.asText(richText);
};

// Compact Article Separator Component
const ArticleSeparator: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-2 my-3">
      <div className="flex-1 h-px bg-accent"></div>
      <div className="mx-2">
        <div className="w-1 h-1 bg-accent rounded-full"></div>
      </div>
      <div className="flex-1 h-px bg-accent"></div>
    </div>
  );
};

const MainContent: React.FC<MainContentProps> = ({
  heroPost,
  featuredPost,
  editorialPost,
  localposts,
}) => {
  if (!heroPost || !featuredPost) {
    return (
      <main className="lg:col-span-3 w-full bg-background">
        <div className="text-center py-12 text-gray-400">Loading...</div>
      </main>
    );
  }

  return (
    <main className="lg:col-span-3 w-full p-0 m-0">
      {/* === MAIN GRID (40/60 split) === */}
      <div className="grid lg:grid-cols-5 gap-4 lg:gap-6 mt-8">
        {/* === LEFT COLUMN (MAIN HERO STORY - 2/5 width) === */}
        <div className="lg:col-span-2 flex flex-col justify-between h-full">
          <article>
            <p className="text-accent text-xs font-bold uppercase tracking-wider mb-1">
              {heroPost.data.category || "News"}
            </p>
            <Link href={`/blog/${heroPost.uid}`} className="block group">
              <AnimatedHeadline as="h1" extraClassName="text-2xl lg:text-3xl font-roboto font-bold leading-snug">
                {heroPost.data.title}
              </AnimatedHeadline>
            </Link>
            <p className="text-base text-gray-300 mt-2 leading-snug font-sans">
              {renderText(heroPost.data.summary)}
            </p>
          </article>

          {/* Bottom articles */}
          <div>
            {editorialPost && (
              <>
                <ArticleSeparator />
                <article className="pt-4">
                  <Link
                    href={`/blog/${editorialPost.uid}`}
                    className="block group"
                  >
                    <div className="flex items-start gap-2">
                      <div className="text-accent text-lg font-roboto font-bold"></div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-base group-hover:text-accent transition-colors font-roboto">
                          <span className="text-gray-400 font-normal text-sm">
                            The DG View.
                          </span>{" "}
                          {editorialPost.data.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          The editorial board
                        </p>
                      </div>
                    </div>
                  </Link>
                </article>
              </>
            )}

            {localposts && (
              <>
                <ArticleSeparator />
                <article className="pt-4">
                  <Link
                    href={`/blog/${localposts.uid}`}
                    className="block group"
                  >
                    <div className="flex items-start gap-2">
                      <div className="text-accent text-lg font-roboto font-bold"></div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-base group-hover:text-accent transition-colors font-roboto">
                          <span className="text-gray-400 font-normal text-sm">
                            The DG View.
                          </span>{" "}
                          {localposts.data.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          The editorial board
                        </p>
                      </div>
                    </div>
                  </Link>
                </article>
              </>
            )}
          </div>
        </div>

        {/* === RIGHT COLUMN (FEATURED STORY - 3/5 width) === */}
        <div className="lg:col-span-3 relative border-l border-r border-accent lg:px-6">
          <article className="h-full">
            <Link
              href={`/blog/${featuredPost.uid}`}
              className="block group h-full"
            >
              {/* Featured Image */}
              {featuredPost.data.featured_image?.url && (
                <div className="relative w-full aspect-[4/3] mb-3 overflow-hidden rounded-lg">
                  <Image
                    src={featuredPost.data.featured_image.url}
                    alt={
                      featuredPost.data.featured_image.alt || "Featured Story"
                    }
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Center Separator */}
              <div className="w-full flex items-center justify-center my-6">
                <div className="flex-1 h-px bg-accent"></div>
                <div className="mx-4">
                  <div className="w-2 h-2 bg-accent transform rotate-45"></div>
                </div>
                <div className="flex-1 h-px bg-accent"></div>
              </div>

              {/* Category & Title with Premium Underline Effects */}
              <p className="text-accent text-xs font-bold uppercase tracking-wider mb-1 font-sans text-center">
                {featuredPost.data.category || "Featured"}
              </p>

              {/* Option 1: Gradient Expanding Underline */}
              {/* Alternative Options (uncomment one at a time to test): */}

              {/* Option 2: Double Line Effect */}

              <h2 className="relative text-3xl lg:text-4xl font-roboto text-accent leading-tight max-w-2xl break-words text-center mx-auto group-hover:text-accent/80 transition-colors duration-300">
                {featuredPost.data.title}

                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-px bg-accent group-hover:w-full transition-all duration-500 ease-out"></span>
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-px bg-accent/40 group-hover:w-3/4 transition-all duration-700 delay-100 ease-out"></span>
              </h2>

              {/* Option 3: Animated Dots Underline */}

              {/* Option 4: Typewriter Effect Underline */}

              {/* Option 5: Glow Effect Underline */}

              {/* Option 6: Split Animation Underline */}
            </Link>
          </article>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
