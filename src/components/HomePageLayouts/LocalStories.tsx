import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { Post } from "../../../lib/wordpress";
import AnimatedHeadline from "../AnimatedHeadline";

interface LocalStoriesProps {
  stories: Post[];
  title: string;
}

const LocalStories: React.FC<LocalStoriesProps> = ({ stories, title }) => {
  if (!stories || stories.length === 0) {
    return null;
  }

  const mainStory = stories[0];
  const otherStories = stories.slice(1, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 pb-3 border-b-2 border-[#fbd203]">
        <h2 className="text-4xl font-playfair font-bold text-[#fbd203] uppercase tracking-widest">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
        {/* Main Story Area (Left Side) */}
        <div className="lg:col-span-8 mb-8 lg:mb-0">
          <article className="group h-full">
            <Link href={`/blog/${mainStory.uid}`} className="block h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                {/* Text Content */}
                <div className="flex flex-col">
                  <div className="flex-grow">
                    <AnimatedHeadline
                      as="h3"
                      extraClassName="text-3xl text-accent font-playfair font-bold -mt-4"
                    >
                      {mainStory.data.title || "Untitled Article"}
                    </AnimatedHeadline>
                    {mainStory.data.summary && (
                      <p className="text-gray-300 mt-4 text-sm leading-relaxed font-sans">
                        {mainStory.data.summary}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-2 border-t border-default">
                    <span className="text-xs font-medium text-gray-400 font-sans">
                      {mainStory.data.author || "Staff"}
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
        <div className="lg:col-span-4 lg:border-l lg:border-default lg:pl-8">
          <div className="space-y-6">
            {otherStories.map((story) => (
              <article key={story.id} className="group">
                <Link href={`/blog/${story.uid}`} className="block">
                  <h4 className="text-base font-playfair font-bold text-foreground uppercase transition-colors duration-200 group-hover:text-accent">
                    {story.data.title || "Untitled Article"}
                  </h4>
                  <div className="mt-2 pt-2 border-t border-default">
                    <span className="text-xs font-medium text-gray-400 font-sans">
                      By {story.data.author || "Staff"}
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
