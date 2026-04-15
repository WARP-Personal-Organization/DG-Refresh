import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { Post } from "../../../lib/wordpress";

interface TopStoriesProps {
  stories: Post[];
  title: string;
}

const TopStories: React.FC<TopStoriesProps> = ({ stories, title }) => {
  const topStories = stories.slice(0, 4);

  if (topStories.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 space-y-4">
          <div className="mb-6 pb-2 border-b border-[#fcee16]"></div>
          <h2 className="text-sm font-roboto font-semibold text-foreground uppercase tracking-[0.2em]">
            {title}
          </h2>
          <div className="mb-6 pb-2 border-b border-[#fcee16]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:divide-x md:divide-gray-700">
          {topStories.map((story) => (
            <article key={story.id} className="group px-4 mb-8 md:mb-0">
              <Link href={`/blog/${story.uid}`} className="block">
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

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-accent uppercase font-sans">
                    {story.data.category || "News"}
                  </p>
                  <h3 className="text-xl font-playfair font-bold text-foreground leading-tight transition-colors duration-200 group-hover:text-accent">
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
