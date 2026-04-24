import { Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { Post } from "../../lib/wordpress";
import AnimatedHeadline from "./AnimatedHeadline";

interface OpinionSectionProps {
  posts?: Post[];
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const OpinionSection: React.FC<OpinionSectionProps> = ({ posts = [] }) => {
  const featured = posts[0];
  const rest = posts.slice(1, 7);

  return (
    <section className="py-12 border-default bg-[#1b1a1b] font-open-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 pb-3 border-b-2 border-[#fbd203]">
          <h2 className="text-4xl font-playfair font-bold text-[#fbd203] uppercase tracking-widest">VOICES</h2>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No articles available.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Featured article - takes 2 columns */}
            {featured && (
              <Link href={`/blog/${featured.uid}`} className="lg:col-span-2 block group">
                <article className="h-full flex flex-col">
                  {featured.data.featured_image?.url && (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-4">
                      <Image
                        src={featured.data.featured_image.url}
                        alt={featured.data.featured_image.alt || featured.data.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  )}
                  <div className="space-y-3">
                    <span className="text-[#fcee16] text-xs font-bold uppercase tracking-widest">
                      Featured
                    </span>
                    <AnimatedHeadline as="h3" extraClassName="text-2xl text-white leading-tight">
                      {featured.data.title}
                    </AnimatedHeadline>
                    {featured.data.summary && (
                      <p className="text-gray-400 leading-relaxed line-clamp-3">
                        {featured.data.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-800">
                      <span className="flex items-center gap-1">
                        <User size={12} className="text-[#fcee16]" />
                        {featured.data.author || "Staff"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#fcee16]" />
                        {formatDate(featured.data.published_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-[#fcee16]" />
                        {featured.data.reading_time ?? "—"} min read
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Sidebar list */}
            {rest.length > 0 && (
              <div className="border-l border-gray-800 pl-8 space-y-6">
                {rest.map((post) => (
                  <Link key={post.id} href={`/blog/${post.uid}`} className="block group">
                    <article className="flex gap-3 pb-6 border-b border-gray-800 last:border-b-0">
                      {post.data.featured_image?.url && (
                        <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden rounded">
                          <Image
                            src={post.data.featured_image.url}
                            alt={post.data.featured_image.alt || post.data.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="80px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-1">
                        <AnimatedHeadline as="h4" extraClassName="text-sm text-white leading-snug">
                          <span className="line-clamp-3 block">{post.data.title}</span>
                        </AnimatedHeadline>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{post.data.author || "Staff"}</span>
                          <span>·</span>
                          <span>{formatDate(post.data.published_date)}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default OpinionSection;
