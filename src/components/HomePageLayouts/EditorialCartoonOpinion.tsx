import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { Post } from "../../../lib/wordpress";
import CartoonCard from "../CartoonCard";

interface Props {
  editorialPosts: Post[];
  cartoons: Post[];
  opinionPosts: Post[];
}

const formatDate = (s: string) =>
  s
    ? new Date(s).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

const SectionHeading: React.FC<{ label: string }> = ({ label }) => (
  <div className="mb-6 pb-2 border-b-2 border-[#fbd203]">
    <h2 className="text-2xl lg:text-3xl font-playfair font-bold text-[#fbd203] uppercase tracking-widest">
      {label}
    </h2>
  </div>
);

export default function EditorialCartoonOpinion({
  editorialPosts,
  cartoons,
  opinionPosts,
}: Props) {
  const banner = editorialPosts[0];
  const opinionFeatured = opinionPosts[0];
  const opinionRest = opinionPosts.slice(1, 5);

  if (!banner && cartoons.length === 0 && opinionPosts.length === 0) return null;

  return (
    <section className="bg-background py-12 border-t border-default">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT — Editorial banner */}
          <div>
            <SectionHeading label="Editorial" />
            {banner ? (
              <Link href={`/blog/${banner.uid}`} className="block group">
                {banner.data.featured_image?.url && (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-4">
                    <Image
                      src={banner.data.featured_image.url}
                      alt={banner.data.featured_image.alt || banner.data.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                )}
                <h3 className="text-2xl font-playfair font-bold text-accent leading-tight group-hover:text-accent/80 transition-colors">
                  {banner.data.title}
                </h3>
                <p className="text-xs text-gray-400 mt-3 font-open-sans uppercase tracking-wider">
                  {formatDate(banner.data.published_date)}
                </p>
                {banner.data.summary && (
                  <p className="text-sm text-gray-300 mt-3 line-clamp-3 font-open-sans">
                    {banner.data.summary}
                  </p>
                )}
              </Link>
            ) : (
              <div className="text-gray-500 text-sm">No editorial available.</div>
            )}
          </div>

          {/* MIDDLE — Cartoon */}
          <div>
            <SectionHeading label="Cartoon" />
            {cartoons.length > 0 ? (
              <CartoonCard cartoons={cartoons} />
            ) : (
              <div className="text-gray-500 text-sm">No cartoons yet.</div>
            )}
          </div>

          {/* RIGHT — Opinion list */}
          <div>
            <SectionHeading label="Opinion" />
            <div className="space-y-5">
              {opinionFeatured && (
                <Link
                  href={`/blog/${opinionFeatured.uid}`}
                  className="block group"
                >
                  {opinionFeatured.data.featured_image?.url && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded mb-3">
                      <Image
                        src={opinionFeatured.data.featured_image.url}
                        alt={
                          opinionFeatured.data.featured_image.alt ||
                          opinionFeatured.data.title
                        }
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <h4 className="text-lg font-playfair font-bold text-white leading-snug group-hover:text-accent transition-colors">
                    {opinionFeatured.data.title}
                  </h4>
                  {opinionFeatured.data.author && (
                    <p className="text-xs text-gray-400 mt-1 font-open-sans">
                      {opinionFeatured.data.author}
                    </p>
                  )}
                </Link>
              )}
              {opinionRest.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.uid}`}
                  className="block group pt-3 border-t border-default"
                >
                  <h4 className="text-sm font-playfair font-bold text-white leading-snug group-hover:text-accent transition-colors">
                    {p.data.title}
                  </h4>
                  {p.data.author && (
                    <p className="text-xs text-gray-500 mt-1 font-open-sans">
                      {p.data.author}
                    </p>
                  )}
                </Link>
              ))}
              {opinionPosts.length > 0 && (
                <Link
                  href="/opinion"
                  className="block pt-3 border-t border-default text-xs uppercase tracking-widest text-[#fcee16] hover:text-[#fcee16]/70 transition-colors font-roboto"
                >
                  View All Opinion →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
