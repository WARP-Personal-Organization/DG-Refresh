import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { Post } from "../../lib/wordpress";

interface Props {
  posts: Post[];
  title?: string;
}

// Renders the latest banner-news items as a horizontal row above a listing page.
// Used on subcategory pages (page 1 only) to surface editor-curated highlights
// before the regular chronological article list.
const BannerNewsBlock: React.FC<Props> = ({ posts, title = "Latest Banner News" }) => {
  const items = posts.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="mb-12 pb-8 border-b border-default">
      <div className="mb-6 pb-2 border-b-2 border-[#fbd203] flex items-baseline justify-between">
        <h2 className="text-2xl font-playfair font-bold text-[#fbd203] uppercase tracking-widest">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.uid}`}
            className="block group"
          >
            <article>
              {post.data.featured_image?.url ? (
                <div className="relative aspect-[16/10] overflow-hidden rounded-md mb-3">
                  <Image
                    src={post.data.featured_image.url}
                    alt={post.data.featured_image.alt || post.data.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              ) : (
                <div className="aspect-[16/10] bg-gray-900 rounded-md mb-3" />
              )}
              <h3 className="text-sm md:text-base font-playfair font-bold text-white leading-snug group-hover:text-[#fcee16] transition-colors line-clamp-3">
                {post.data.title}
              </h3>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BannerNewsBlock;
