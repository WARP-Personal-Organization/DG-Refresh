import type * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { BlogPostDocument } from "../../../prismicio-types";

interface OpinionStoriesProps {
  stories: BlogPostDocument[];
  title: string;
}

const renderText = (richText: prismic.RichTextField): string => {
  if (!richText) return "";
  return prismicH.asText(richText);
};

const formatTimeAgo = (dateString: string | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "JUST NOW";
  if (diffInHours < 24) return `${diffInHours}H AGO`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}D AGO`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const OpinionStories: React.FC<OpinionStoriesProps> = ({ stories, title }) => {
  const topStories = stories.slice(0, 6);

  if (topStories.length === 0) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-400">No stories available</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 border-t border-default">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 pb-4 border-b border-default">
          <h2 className="text-2xl font-serif font-bold text-white">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topStories.map((story) => (
            <article key={story.id} className="group">
              <Link href={`/blog/${story.uid}`} className="block">
                {story.data.featured_image?.url && (
                  <div className="relative aspect-[16/10] mb-4 overflow-hidden">
                    <Image
                      src={story.data.featured_image.url}
                      alt={story.data.featured_image.alt || "Story image"}
                      fill
                      className="object-cover group-hover:opacity-90 transition-opacity duration-200"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <div className="text-yellow-500 text-sm font-medium uppercase tracking-wide">
                    {story.data.category || "News"}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white leading-tight group-hover:text-gray-300 transition-colors duration-200">
                    {story.data.title || "Untitled Article"}
                  </h3>
                  {story.data.summary && (
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {renderText(story.data.summary).substring(0, 100)}...
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-default/50">
                    <span>{renderText(story.data.author) || "Staff"}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(story.data.published_date)}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
        <div className="text-center mt-12 pt-8 border-t border-default">
          <Link
            href={`/${title.toLowerCase()}`}
            className="inline-block px-6 py-3 text-yellow-500 hover:text-yellow-400 font-medium transition-colors duration-200 border border-yellow-500 hover:border-yellow-400 rounded"
          >
            View All Stories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OpinionStories;
